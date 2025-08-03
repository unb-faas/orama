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
 * Deletes a record.
 *
 * @example
 * gcloud functions call del --data '{"kind":"Task","key":"sampletask1"}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to delete, e.g. "Task".
 * @param {string} req.body.key Key at which to delete data, e.g. "sampletask1".
 * @param {object} res Cloud Function response context.
 */
exports.del = async (req, res) => {
  // Deletes the entity
  // The delete operation will not fail for a non-existent entity, it just
  // doesn't delete anything
  try {
    const key = await getKeyFromRequestData(req.body);
    await datastore.delete(key);
    res.status(200).send(`Entity ${key.path.join('/')} deleted.`);
  } catch (err) {
    console.error(new Error(err.message)); // Add to Stackdriver Error Reporting
    res.status(500).send(err.message);
  }
};
