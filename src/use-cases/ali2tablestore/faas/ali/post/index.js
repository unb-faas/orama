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
 * Creates and/or updates a record.
 *
 * @param {object} req request context.
 * @param {object} req.body The request body to save to cloud datastore, e.g. {"description":"Buy milk"}
 * @param {object} res response context.
 */
exports.post = async (req, res, context) => {
  res.setHeader("Content-Type", "text/plain");

  // The value contains a JSON document representing the entity we want to save
  if (!req.body) {
    const err = makeErrorObj('body');
    console.error(err);
    res.setStatusCode(400);
    res.send(err.message);
    return;
  }

  try {
    var key = getID();
    var params = {
      tableName: TABLE_NAME,
      condition: new TableStore.Condition(TableStore.RowExistenceExpectation.EXPECT_NOT_EXIST, null),
      primaryKey: [{ 'pk': Long.fromNumber(key) }],
      attributeColumns: [
        { 'data': JSON.stringify(JSON.parse(req.body)) }
      ],
      returnContent: { returnType: TableStore.ReturnType.Primarykey }
    };

    await datastore.putRow(params, function (err, data) {
      if (err) {
        console.error(new Error(err.message));
        res.setStatusCode(500);
        res.send(err.message);
        return;
      }
  
      res.setStatusCode(200);
      res.send(`Entity ${data.row.primaryKey[0].value.toNumber()} saved.`);
    });
  } catch (err) {
    console.error(new Error(err.message));
    res.setStatusCode(500);
    res.send(err.message);
  }

  function getID() {
    const hrTime = process.hrtime();
    const microTime = Long.fromNumber(hrTime[0] * 1000000 + hrTime[1] / 1000);
    return parseInt(microTime);
  }
};
