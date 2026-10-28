#  ___
# / _ \ _ __ __ _ _ __ ___   __ _
# | | | | '__/ _` | '_ ` _ \ / _` |
# | |_| | | | (_| | | | | | | (_| |
#  \___/|_|  \__,_|_| |_| |_|\__,_|
# Framework - Sequence Aligner (IBM Code Engine + COS)
#
# Same workload as lambdaaligner/gcfaligner: Hirschberg global alignment of two
# genetic sequences, writing the result as JSON to object storage.
# Code Engine inline functions accept a single file, so the Hirschberg
# implementation (from lambdaaligner/faas/aws/put/alignment/alignment.py) is
# embedded here and COS is reached via plain HTTP + IAM token (no dependencies).

import base64
import datetime
import json
import time
import urllib.parse
import urllib.request

COS_APIKEY = "XXX_APIKEY_XXX"
COS_RESOURCE_INSTANCE_ID = "XXX_RESOURCE_INSTANCE_ID_XXX"
COS_BUCKET = "XXX_BUCKET_XXX"
COS_REGION = "XXX_REGION_XXX"
IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"
COS_ENDPOINT = "https://s3.%s.cloud-object-storage.appdomain.cloud" % COS_REGION

algorithm = "hirschberg"
output_filename = "hirschberg-"

headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Max-Age": "86400"
}


class Alignment(object):
    def __init__(self):
        self.seq_a = None
        self.seq_b = None
        self.len_a = None
        self.len_b = None
        self.score_null = 5
        self.score_sub = -100
        self.score_del = -3
        self.score_ins = -3
        self.separator = '|'

    def match(self, a, b):
        if a == b:
            return self.score_null
        return self.score_sub

    def delete(self, a):
        return self.score_del

    def insert(self, a):
        return self.score_ins

    def score(self, aligned_seq_a, aligned_seq_b):
        score = 0
        for a, b in zip(aligned_seq_a, aligned_seq_b):
            if a == b:
                score += self.score_null
            else:
                if a == self.separator:
                    score += self.score_ins
                elif b == self.separator:
                    score += self.score_del
                else:
                    score += self.score_sub
        return score


class Needleman(Alignment):
    def __init__(self):
        super(Needleman, self).__init__()
        self.semi_global = False
        self.matrix = None

    def init_matrix(self):
        rows = self.len_a + 1
        cols = self.len_b + 1
        self.matrix = [[0] * cols for i in range(rows)]

    def compute_matrix(self):
        seq_a = self.seq_a
        seq_b = self.seq_b
        len_a = self.len_a
        len_b = self.len_b

        if not self.semi_global:
            for i in range(1, len_a + 1):
                self.matrix[i][0] = self.delete(seq_a[i - 1]) + self.matrix[i - 1][0]
            for i in range(1, len_b + 1):
                self.matrix[0][i] = self.insert(seq_b[i - 1]) + self.matrix[0][i - 1]

        for i in range(1, len_a + 1):
            for j in range(1, len_b + 1):
                score_sub = self.matrix[i - 1][j - 1] + self.match(seq_a[i - 1], seq_b[j - 1])
                score_del = self.matrix[i - 1][j] + self.delete(seq_a[i - 1])
                score_ins = self.matrix[i][j - 1] + self.insert(seq_b[j - 1])
                self.matrix[i][j] = max(score_sub, score_del, score_ins)

    def backtrack(self):
        aligned_seq_a, aligned_seq_b = [], []
        seq_a, seq_b = self.seq_a, self.seq_b

        if self.semi_global:
            last_col_max, val = max(enumerate([row[-1] for row in self.matrix]), key=lambda a: a[1])
            last_row_max, val = max(enumerate([col for col in self.matrix[-1]]), key=lambda a: a[1])

            if self.len_a < self.len_b:
                i, j = self.len_a, last_row_max
                aligned_seq_a = [self.separator] * (self.len_b - last_row_max)
                aligned_seq_b = seq_b[last_row_max:]
            else:
                i, j = last_col_max, self.len_b
                aligned_seq_a = seq_a[last_col_max:]
                aligned_seq_b = [self.separator] * (self.len_a - last_col_max)
        else:
            i, j = self.len_a, self.len_b

        mat = self.matrix

        while i > 0 or j > 0:
            if self.semi_global and (i == 0 or j == 0):
                if i == 0 and j > 0:
                    aligned_seq_a = [self.separator] * j + aligned_seq_a
                    aligned_seq_b = seq_b[:j] + aligned_seq_b
                elif i > 0 and j == 0:
                    aligned_seq_a = seq_a[:i] + aligned_seq_a
                    aligned_seq_b = [self.separator] * i + aligned_seq_b
                break

            if j > 0 and mat[i][j] == mat[i][j - 1] + self.insert(seq_b[j - 1]):
                aligned_seq_a.insert(0, self.separator * len(seq_b[j - 1]))
                aligned_seq_b.insert(0, seq_b[j - 1])
                j -= 1

            elif i > 0 and mat[i][j] == mat[i - 1][j] + self.delete(seq_a[i - 1]):
                aligned_seq_a.insert(0, seq_a[i - 1])
                aligned_seq_b.insert(0, self.separator * len(seq_a[i - 1]))
                i -= 1

            elif i > 0 and j > 0 and mat[i][j] == mat[i - 1][j - 1] + self.match(seq_a[i - 1], seq_b[j - 1]):
                aligned_seq_a.insert(0, seq_a[i - 1])
                aligned_seq_b.insert(0, seq_b[j - 1])
                i -= 1
                j -= 1

            else:
                raise Exception('backtrack error', i, j, seq_a[i - 2:i + 1], seq_b[j - 2:j + 1])

        return aligned_seq_a, aligned_seq_b

    def align(self, seq_a, seq_b, semi_global=True):
        self.seq_a = seq_a
        self.seq_b = seq_b
        self.len_a = len(self.seq_a)
        self.len_b = len(self.seq_b)
        self.semi_global = semi_global
        self.init_matrix()
        self.compute_matrix()
        return self.backtrack()


class Hirschberg(Alignment):
    def __init__(self):
        super(Hirschberg, self).__init__()
        self.needleman = Needleman()

    def last_row(self, seqa, seqb):
        lena = len(seqa)
        lenb = len(seqb)
        pre_row = [0] * (lenb + 1)
        cur_row = [0] * (lenb + 1)

        for j in range(1, lenb + 1):
            pre_row[j] = pre_row[j - 1] + self.insert(seqb[j - 1])

        for i in range(1, lena + 1):
            cur_row[0] = self.delete(seqa[i - 1]) + pre_row[0]
            for j in range(1, lenb + 1):
                score_sub = pre_row[j - 1] + self.match(seqa[i - 1], seqb[j - 1])
                score_del = pre_row[j] + self.delete(seqa[i - 1])
                score_ins = cur_row[j - 1] + self.insert(seqb[j - 1])
                cur_row[j] = max(score_sub, score_del, score_ins)

            pre_row = cur_row
            cur_row = [0] * (lenb + 1)

        return pre_row

    def align_rec(self, seq_a, seq_b):
        aligned_a, aligned_b = [], []
        len_a, len_b = len(seq_a), len(seq_b)

        if len_a == 0:
            for i in range(len_b):
                aligned_a.append(self.separator * len(seq_b[i]))
                aligned_b.append(seq_b[i])
        elif len_b == 0:
            for i in range(len_a):
                aligned_a.append(seq_a[i])
                aligned_b.append(self.separator * len(seq_a[i]))

        elif len(seq_a) == 1:
            aligned_a, aligned_b = self.needleman.align(seq_a, seq_b)

        else:
            mid_a = int(len_a / 2)

            rowleft = self.last_row(seq_a[:mid_a], seq_b)
            rowright = self.last_row(seq_a[mid_a:][::-1], seq_b[::-1])

            rowright.reverse()

            row = [l + r for l, r in zip(rowleft, rowright)]
            maxidx, maxval = max(enumerate(row), key=lambda a: a[1])

            mid_b = maxidx

            aligned_a_left, aligned_b_left = self.align_rec(seq_a[:mid_a], seq_b[:mid_b])
            aligned_a_right, aligned_b_right = self.align_rec(seq_a[mid_a:], seq_b[mid_b:])
            aligned_a = aligned_a_left + aligned_a_right
            aligned_b = aligned_b_left + aligned_b_right

        return aligned_a, aligned_b

    def align(self, seq_a, seq_b):
        self.seq_a = seq_a
        self.seq_b = seq_b
        self.len_a = len(self.seq_a)
        self.len_b = len(self.seq_b)
        return self.align_rec(self.seq_a, self.seq_b)


_token = {"value": None, "expires_at": 0}


def get_iam_token():
    # IAM tokens last ~1h; reuse while the instance is warm
    if _token["value"] and time.time() < _token["expires_at"] - 60:
        return _token["value"]
    data = urllib.parse.urlencode({
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "response_type": "cloud_iam",
        "apikey": COS_APIKEY
    }).encode()
    req = urllib.request.Request(IAM_TOKEN_URL, data=data, method="POST", headers={
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req, timeout=30) as res:
        body = json.loads(res.read())
    _token["value"] = body["access_token"]
    _token["expires_at"] = body.get("expiration", time.time() + 3600)
    return _token["value"]


def upload(key, document):
    url = "%s/%s/%s" % (COS_ENDPOINT, urllib.parse.quote(COS_BUCKET), urllib.parse.quote(key))
    req = urllib.request.Request(url, data=json.dumps(document).encode(), method="PUT", headers={
        "Authorization": "Bearer " + get_iam_token(),
        "ibm-service-instance-id": COS_RESOURCE_INSTANCE_ID,
        "Content-Type": "application/json"
    })
    with urllib.request.urlopen(req, timeout=30) as res:
        res.read()


def extract_json_body(params):
    body = params.get("__ce_body")
    if body:
        try:
            return json.loads(base64.b64decode(body).decode("utf-8"))
        except ValueError:
            return json.loads(body)
    return {k: v for k, v in params.items() if not k.startswith("__ce_")}


def response(status_code, body):
    return {"statusCode": status_code, "headers": headers, "body": json.dumps(body)}


def main(params):
    try:
        dt = extract_json_body(params)
        _s1 = dt["s1"]
        _s2 = dt["s2"]
        _t1 = dt["t1"]
        _t2 = dt["t2"]
        _service = dt["service"]
        _concurrence = dt["concurrence"]
        _repetition = dt["repetition"]
        id = dt["execid"]
    except (KeyError, ValueError) as e:
        return response(400, {"errors": ["Error: missing or invalid field %s" % e]})

    s1 = list(_s1)
    s2 = list(_s2)
    started_at = datetime.datetime.now()

    result = {
        "id": id,
        "service": _service,
        "started_at": str(started_at),
        "s1": {"content": _s1, "title": _t1, "length": len(s1)},
        "s2": {"content": _s2, "title": _t2, "length": len(s2)},
        "algorithm": algorithm
    }

    local_id = "%.20f" % time.time()
    _output_filename = output_filename + str(id) + "_" + str(local_id)
    _output_path = str(_service) + "/repetition_" + str(_repetition) + "/concurrence_" + str(_concurrence) + "/"
    _key = _output_path + _output_filename + ".json"

    try:
        upload(_key, result)

        h = Hirschberg()
        a, b = h.align(s1, s2)
        score = h.score(a, b)

        finished_at = datetime.datetime.now()
        duration = str(finished_at - started_at)

        result = {
            "id": id,
            "service": _service,
            "started_at": str(started_at),
            "finished_at": str(finished_at),
            "s1": {"content": _s1, "title": _t1, "length": len(s1), "align": a},
            "s2": {"content": _s2, "title": _t2, "length": len(s2), "align": b},
            "duration": duration,
            "score": score,
            "algorithm": algorithm
        }
        upload(_key, result)
    except Exception as e:
        print(e)
        return response(500, {"errors": ["Error: %s" % e]})

    return response(200, {"result": "done", "duration": duration, "score": score})
