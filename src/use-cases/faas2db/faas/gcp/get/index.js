// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
 * Retrieves a record.
 *
 * @example
 * gcloud functions call get --data '{"kind":"Task","key":"sampletask1"}'
 *
 * @param {object} req Cloud Function request context.
 * @param {object} req.body The request body.
 * @param {string} req.body.kind The Datastore kind of the data to retrieve, e.g. "Task".
 * @param {string} req.body.key Key at which to retrieve the data, e.g. "sampletask1".
 * @param {object} res Cloud Function response context.
 */
exports.get = async (req, res) => {
  try {
    const limit = 20
    const dataBaseSize = 200
    const lastOffSet = dataBaseSize / limit
    const query = datastore.createQuery(process.env.TABLE_NAME).limit(limit).offset(getRandomArbitrary(0,lastOffSet))
    const list = await datastore.runQuery(query)
    res.status(200).send(list[0]);
  } catch (err) {
    console.error(new Error(err.message)); // Add to Stackdriver Error Reporting
    res.status(500).send(err.message);
  }

};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}