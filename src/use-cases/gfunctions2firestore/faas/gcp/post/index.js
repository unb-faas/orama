/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/

'use strict';

const {Datastore} = require('@google-cloud/datastore');

// Instantiates a client
const datastore = new Datastore();

const makeErrorObj = prop => {
  return new Error(
    `${prop} not provided. Make sure you have a "${prop.toLowerCase()}" property in your request`
  );
};

/**
 * Gets a Datastore key from the kind/key pair in the request.
 *
 * @param {object} requestData Cloud Function request data.
 * @param {string} requestData.key Datastore key string.
 * @param {string} requestData.kind Datastore kind.
 * @returns {object} Datastore key object.
 */
const getKeyFromRequestData = requestData => {
  if (!requestData.key) {
    return Promise.reject(makeErrorObj('Key'));
  }

  if (!requestData.kind) {
    return Promise.reject(makeErrorObj('Kind'));
  }

  return datastore.key([requestData.kind, requestData.key]);
};

/**
 * Creates and/or updates a record.
 *
 * @example
 * gcloud functions call set --data '{"kind":"Task","key":"sampletask1","value":{"description": "Buy milk"}}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to save, e.g. "Task".
 * @param {string} req.body.key Key at which to save the data, e.g. "sampletask1".
 * @param {object} req.body.value Value to save to Cloud Datastore, e.g. {"description":"Buy milk"}
 * @param {object} res Cloud Function response context.
 */
exports.set = async (req, res) => {
  // The value contains a JSON document representing the entity we want to save
  if (!req.body.value) {
    const err = makeErrorObj('Value');
    console.error(err);
    res.status(500).send(err.message);
    return;
  }

  req.body.key = getID()
  req.body.kind = process.env.TABLE_NAME

  try {
    const key = await getKeyFromRequestData(req.body);
    const entity = {
      key: key,
      data: req.body.value,
    };

    await datastore.save(entity);
    res.status(200).send(`Entity ${key.path.join('/')} saved.`);
  } catch (err) {
    console.error(new Error(err.message)); // Add to Stackdriver Error Reporting
    res.status(500).send(err.message);
  }

  function getID(){
    const hrTime = process.hrtime()
    const microTime = hrTime[0] * 1000000 + hrTime[1] / 1000
    return parseInt(microTime)
  }

};


