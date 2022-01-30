import json
from alignment import Hirschberg
import datetime
import time
import logging
import os
from google.cloud import storage

storage_client = storage.Client()
algorithm = "hirschberg"
output_filename = "hirschberg-"

def hAlign(a, b):
    h = Hirschberg()
    a,b = h.align(a,b)
    return h.score(a, b)

def align( request ):    
    dt =  request.get_json()
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
    bucket_name = dt["bucket"]
    tempPath='/tmp/'
    
    try:
        bucket = storage_client.get_bucket(bucket_name)
    except:
        bucket = storage_client.bucket(bucket_name)
        bucket.location = 'us'
        bucket.create()

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
    f = open(tempPath+_output_filename,"w+")
    f.write(json.dumps(result))
    f.close()
    
    blob = bucket.blob(_output_path+_output_filename+".json")
    blob.upload_from_filename(tempPath+_output_filename)

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
    f = open(tempPath+_output_filename,"w+")
    f.write(json.dumps(result))
    f.close()

    blob = bucket.blob(_output_path+_output_filename+".json")
    blob.upload_from_filename(tempPath+_output_filename)

    return {
        'statusCode': 200,
        'body': json.dumps({"result":"done"})
    }