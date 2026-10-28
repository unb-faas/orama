/*
*  ___
* / _ \ _ __ __ _ _ __ ___   __ _
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Sequence Aligner (Code Engine + COS)
*
* Same workload as lambdaaligner/gcfaligner: Hirschberg global alignment of two
* genetic sequences, writing the result as JSON to object storage.
* Code Engine inline functions accept a single file and the account only
* offers the Node.js runtime, so the Hirschberg implementation (ported from
* lambdaaligner/faas/aws/put/alignment/alignment.py) is embedded here.
*/

const COS_APIKEY = "XXX_APIKEY_XXX";
const COS_RESOURCE_INSTANCE_ID = "XXX_RESOURCE_INSTANCE_ID_XXX";
const COS_BUCKET = "XXX_BUCKET_XXX";
const COS_REGION = "XXX_REGION_XXX";
const IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";
const COS_ENDPOINT = `https://s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;

const algorithm = "hirschberg";
const outputFilename = "hirschberg-";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PUT,DELETE",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400"
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

class Alignment {
  constructor() {
    this.scoreNull = 5;
    this.scoreSub = -100;
    this.scoreDel = -3;
    this.scoreIns = -3;
    this.separator = "|";
  }

  match(a, b) {
    return a === b ? this.scoreNull : this.scoreSub;
  }

  delete() {
    return this.scoreDel;
  }

  insert() {
    return this.scoreIns;
  }

  score(alignedA, alignedB) {
    let score = 0;
    const n = Math.min(alignedA.length, alignedB.length);
    for (let i = 0; i < n; i++) {
      const a = alignedA[i];
      const b = alignedB[i];
      if (a === b) score += this.scoreNull;
      else if (a === this.separator) score += this.scoreIns;
      else if (b === this.separator) score += this.scoreDel;
      else score += this.scoreSub;
    }
    return score;
  }
}

// Only used by Hirschberg when seqA has a single element (semi-global mode)
class Needleman extends Alignment {
  align(seqA, seqB) {
    const lenA = seqA.length;
    const lenB = seqB.length;
    const mat = Array.from({ length: lenA + 1 }, () => new Array(lenB + 1).fill(0));

    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        mat[i][j] = Math.max(
          mat[i - 1][j - 1] + this.match(seqA[i - 1], seqB[j - 1]),
          mat[i - 1][j] + this.delete(),
          mat[i][j - 1] + this.insert()
        );
      }
    }

    // first index of the max value, like Python's max(enumerate(...))
    const argmax = (values) => values.reduce((best, v, idx) => (v > values[best] ? idx : best), 0);
    const lastColMax = argmax(mat.map((row) => row[lenB]));
    const lastRowMax = argmax(mat[lenA]);

    let i, j, alignedA, alignedB;
    if (lenA < lenB) {
      i = lenA;
      j = lastRowMax;
      alignedA = new Array(lenB - lastRowMax).fill(this.separator);
      alignedB = seqB.slice(lastRowMax);
    } else {
      i = lastColMax;
      j = lenB;
      alignedA = seqA.slice(lastColMax);
      alignedB = new Array(lenA - lastColMax).fill(this.separator);
    }

    while (i > 0 || j > 0) {
      if (i === 0 || j === 0) {
        if (i === 0 && j > 0) {
          alignedA = new Array(j).fill(this.separator).concat(alignedA);
          alignedB = seqB.slice(0, j).concat(alignedB);
        } else if (i > 0 && j === 0) {
          alignedA = seqA.slice(0, i).concat(alignedA);
          alignedB = new Array(i).fill(this.separator).concat(alignedB);
        }
        break;
      }

      if (mat[i][j] === mat[i][j - 1] + this.insert()) {
        alignedA.unshift(this.separator);
        alignedB.unshift(seqB[j - 1]);
        j--;
      } else if (mat[i][j] === mat[i - 1][j] + this.delete()) {
        alignedA.unshift(seqA[i - 1]);
        alignedB.unshift(this.separator);
        i--;
      } else if (mat[i][j] === mat[i - 1][j - 1] + this.match(seqA[i - 1], seqB[j - 1])) {
        alignedA.unshift(seqA[i - 1]);
        alignedB.unshift(seqB[j - 1]);
        i--;
        j--;
      } else {
        throw new Error(`backtrack error at ${i},${j}`);
      }
    }

    return [alignedA, alignedB];
  }
}

class Hirschberg extends Alignment {
  constructor() {
    super();
    this.needleman = new Needleman();
  }

  lastRow(seqA, seqB) {
    const lenB = seqB.length;
    let preRow = new Array(lenB + 1).fill(0);
    let curRow = new Array(lenB + 1).fill(0);

    for (let j = 1; j <= lenB; j++) preRow[j] = preRow[j - 1] + this.insert();

    for (let i = 1; i <= seqA.length; i++) {
      curRow[0] = this.delete() + preRow[0];
      for (let j = 1; j <= lenB; j++) {
        curRow[j] = Math.max(
          preRow[j - 1] + this.match(seqA[i - 1], seqB[j - 1]),
          preRow[j] + this.delete(),
          curRow[j - 1] + this.insert()
        );
      }
      preRow = curRow;
      curRow = new Array(lenB + 1).fill(0);
    }

    return preRow;
  }

  alignRec(seqA, seqB) {
    const lenA = seqA.length;
    const lenB = seqB.length;

    if (lenA === 0) return [new Array(lenB).fill(this.separator), seqB.slice()];
    if (lenB === 0) return [seqA.slice(), new Array(lenA).fill(this.separator)];
    if (lenA === 1) return this.needleman.align(seqA, seqB);

    const midA = Math.floor(lenA / 2);
    const rowLeft = this.lastRow(seqA.slice(0, midA), seqB);
    const rowRight = this.lastRow(seqA.slice(midA).reverse(), seqB.slice().reverse()).reverse();

    let midB = 0;
    let maxVal = -Infinity;
    for (let k = 0; k < rowLeft.length; k++) {
      const v = rowLeft[k] + rowRight[k];
      if (v > maxVal) {
        maxVal = v;
        midB = k;
      }
    }

    const [leftA, leftB] = this.alignRec(seqA.slice(0, midA), seqB.slice(0, midB));
    const [rightA, rightB] = this.alignRec(seqA.slice(midA), seqB.slice(midB));
    return [leftA.concat(rightA), leftB.concat(rightB)];
  }

  align(seqA, seqB) {
    return this.alignRec(seqA, seqB);
  }
}

const token = { value: null, expiresAt: 0 };

async function getIamToken() {
  // IAM tokens last ~1h; reuse while the instance is warm
  if (token.value && Date.now() / 1000 < token.expiresAt - 60) return token.value;

  const tokenResponse = await fetch(IAM_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      response_type: "cloud_iam",
      apikey: COS_APIKEY
    })
  });

  const tokenBody = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenBody.access_token) {
    throw new Error(`Unable to obtain IAM token: ${JSON.stringify(tokenBody)}`);
  }
  token.value = tokenBody.access_token;
  token.expiresAt = tokenBody.expiration || Date.now() / 1000 + 3600;
  return token.value;
}

async function upload(key, document) {
  const objectUrl = `${COS_ENDPOINT}/${encodeURIComponent(COS_BUCKET)}/${key.split("/").map(encodeURIComponent).join("/")}`;
  const cosResponse = await fetch(objectUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${await getIamToken()}`,
      "ibm-service-instance-id": COS_RESOURCE_INSTANCE_ID,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(document)
  });
  if (!cosResponse.ok) {
    throw new Error(`Error creating object: ${(await cosResponse.text()) || cosResponse.statusText}`);
  }
}

function extractJsonBody(context = {}) {
  if (context.body && typeof context.body === "object") return context.body;
  if (typeof context.body === "string") return JSON.parse(context.body);
  if (context.__ce_body) {
    return JSON.parse(Buffer.from(context.__ce_body, "base64").toString("utf8"));
  }
  return Object.fromEntries(Object.entries(context).filter(([key]) => !key.startsWith("__ce_")));
}

async function main(context = {}) {
  let dt;
  try {
    dt = extractJsonBody(context);
  } catch (error) {
    return response(400, { errors: [`Error: invalid JSON body (${error.message})`] });
  }

  const required = ["s1", "s2", "t1", "t2", "service", "concurrence", "repetition", "execid"];
  const missing = required.filter((field) => dt[field] === undefined);
  if (missing.length > 0) {
    return response(400, { errors: [`Error: missing fields ${missing.join(", ")}`] });
  }

  const { s1: _s1, s2: _s2, t1: _t1, t2: _t2, service, concurrence, repetition, execid: id } = dt;
  const s1 = Array.from(_s1);
  const s2 = Array.from(_s2);
  const startedAt = new Date();

  const localId = (Date.now() / 1000).toFixed(20);
  const outputPath = `${service}/repetition_${repetition}/concurrence_${concurrence}/`;
  const key = `${outputPath}${outputFilename}${id}_${localId}.json`;

  try {
    await upload(key, {
      id,
      service,
      started_at: startedAt.toISOString(),
      s1: { content: _s1, title: _t1, length: s1.length },
      s2: { content: _s2, title: _t2, length: s2.length },
      algorithm
    });

    const h = new Hirschberg();
    const [a, b] = h.align(s1, s2);
    const score = h.score(a, b);

    const finishedAt = new Date();
    const duration = (finishedAt - startedAt) / 1000;

    await upload(key, {
      id,
      service,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      s1: { content: _s1, title: _t1, length: s1.length, align: a },
      s2: { content: _s2, title: _t2, length: s2.length, align: b },
      duration,
      score,
      algorithm
    });

    return response(200, { result: "done", duration, score });
  } catch (error) {
    console.error(error);
    return response(500, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
module.exports.Hirschberg = Hirschberg;
