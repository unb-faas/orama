from typing import Optional
import boto3
import json
import base64
from alignment import Hirschberg
import datetime
import logging
from botocore.exceptions import ClientError
import os, platform
import time

s3_client = boto3.client('s3')
algorithm = "hirschberg"
output_filename = "hirschberg-"

def hAlign(a, b):
    h = Hirschberg()
    a,b = h.align(a,b)
    return h.score(a, b)

def align( event, context):    
    dt = json.loads(event["body"])
    _s1 = dt["s1"]
    _s2 = dt["s2"]
    _t1 = dt["t1"]
    _t2 = dt["t2"]
    _service = dt["service"]
    _concurrence = dt["concurrence"]
    _repetition = dt["repetition"]
    id = dt["execid"]
    s1 = list(_s1)
    s2 = list(_s2)
    started_at = datetime.datetime.now()
    bucket = dt["bucket"]
    try:
        s3_client.create_bucket(Bucket=bucket)
    except:
        print("bucket exists")
    result = {
        "id":id,
        "service":_service,
        "started_at":str(started_at),
        "s1": {"content":_s1, "title":_t1, "length":len(s1)},
        "s2": {"content":_s2, "title":_t2, "length":len(s2)},
        "algorithm":algorithm
    }

    local_id = "%.20f" % time.time()
    _output_filename = output_filename + str(id) + "_" + str(local_id)
    _output_path = str(_service) + "/repetition_" + str(_repetition) + "/concurrence_" + str(_concurrence) + "/"
    f = open("/tmp/"+_output_filename,"w+")
    f.write(json.dumps(result))
    f.close()
    s3_client.upload_file('/tmp/'+_output_filename, bucket, _output_path+_output_filename+".json")
    
    h = Hirschberg()
    a,b = h.align(s1,s2)
    score = h.score(a, b)

    align_s1 =  a
    align_s2 =  b
    finished_at = datetime.datetime.now()
    duration =  str(finished_at - started_at)
    
    result = {
        "id":id,
        "service":_service,
        "started_at":str(started_at),
        "finished_at":str(finished_at),
        "s1": {"content":_s1, "title":_t1, "length":len(s1),"align":align_s1},
        "s2": {"content":_s2, "title":_t2, "length":len(s2),"align":align_s2},
        "duration":duration,
        "score":score,
        "algorithm":algorithm
    }
    f = open("/tmp/"+_output_filename,"w+")
    f.write(json.dumps(result))
    f.close()
    s3_client.upload_file('/tmp/'+_output_filename, bucket, _output_path+_output_filename+".json")
    return {
        'statusCode': 200,
        'body': json.dumps({"result":"done"})
    }