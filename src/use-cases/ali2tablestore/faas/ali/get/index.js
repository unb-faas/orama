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


/**
 * Retrieves a record.
 *
 * @param {object} req request context.
 * @param {object} res response context.
 */
exports.get = async (req, res, context) => {
  try {
    res.setHeader("Content-Type", "text/plain");
    const limit = req.queries ? req.queries['limit'] : 10;
    const startPK = req.queries ? req.queries['startPK'] : 0;
    var params = {
      tableName: TABLE_NAME,
      direction: TableStore.Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: [{ "pk": Long.fromString(startPK) }],
      exclusiveEndPrimaryKey: [{ "pk": TableStore.INF_MAX }],
      limit: limit
    };

    await datastore.getRange(params, function (err, data) {
      if (err) {
        console.error(err);
        res.setStatusCode(500);
        res.send(err.message);
        return;
      }

      res.setStatusCode(200);
      res.send(JSON.stringify(data.rows) || '');
    });
  } catch (err) {
    console.error(err);
    res.setStatusCode(500);
    res.send(err.message);
  }
};