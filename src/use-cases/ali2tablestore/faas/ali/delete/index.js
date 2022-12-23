/*
*   ___                            
*  / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
*  \___/|_|  \__,_|_| |_| |_|\__,_|
*                        Framework
*/
'use strict';

const TableStore = require('tablestore');

// Instantiates a client
const ALICLOUD_ACCESS_KEY = process.env.ALICLOUD_ACCESS_KEY
const ALICLOUD_SECRET_KEY = process.env.ALICLOUD_SECRET_KEY
const ENDPOINT = process.env.ENDPOINT;
const INSTANCENAME = process.env.INSTANCENAME;
const TABLE_NAME = process.env.TABLE_NAME;
const Long = TableStore.Long;
var datastore = new TableStore.Client({
  accessKeyId: ALICLOUD_ACCESS_KEY,
  secretAccessKey: ALICLOUD_SECRET_KEY,
  endpoint: ENDPOINT,
  instancename: INSTANCENAME
});


const makeErrorObj = prop => {
  return new Error(
    `${prop} not provided. Make sure you have a "${prop.toLowerCase()}" property in your request`
  );
};


/**
 * Retrieves a record.
 *
 * @param {object} req request context.
 * @param {object} res response context.
 */
exports.delete = async (req, res, context) => {
  try {
    res.setHeader("Content-Type", "text/plain");
    const id = req.queries ? req.queries['id'] : null;

    if (!id) {
      const err = makeErrorObj('id');
      console.error(err);
      res.setStatusCode(400);
      res.send(err.message);
      return;
    }

    var params = {
      tableName: TABLE_NAME,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
      primaryKey: [{ 'pk': Long.fromNumber(id) }]
    };

    await datastore.deleteRow(params, function (err, data) {
      if (err) {
        console.error(err);
        res.setStatusCode(500);
        res.send(err.message);
        return;
      }

      res.setStatusCode(200);
      res.send(`Entity ${id} deleted.`);
    });
  } catch (err) {
    console.error(err);
    res.setStatusCode(500);
    res.send(err.message);
  }
};