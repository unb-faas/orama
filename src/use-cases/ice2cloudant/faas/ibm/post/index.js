/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Database (Cloudant)
*/

const CLOUDANT_URL = "XXX_URL_XXX";
const CLOUDANT_APIKEY = "XXX_APIKEY_XXX";
const DB_NAME = "orama-db";

async function getToken() {
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${CLOUDANT_APIKEY}`
  });
  return (await res.json()).access_token;
}

function getID() {
  const hrTime = process.hrtime();
  return parseInt(hrTime[0] * 1000000 + hrTime[1] / 1000).toString();
}

async function main(context) {
  let data = context.query || context.body || context.__ow_body || context || {};
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { } }
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'OPTIONS,POST', 'Access-Control-Allow-Origin': '*' };
  if (context.__ow_method && context.__ow_method.toLowerCase() === 'options') return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };

  let document = data.document || data.doc || data;
  if (!document || Object.keys(document).length === 0) return { statusCode: 400, headers, body: JSON.stringify({ error: "JSON inválido." }) };
  document._id = document._id || document.id || getID();

  try {
    const token = await getToken();
    await fetch(`${CLOUDANT_URL}/${DB_NAME}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(document)
    });
    return { statusCode: 200, headers, body: JSON.stringify({ message: "Documento salvo com sucesso", id: document._id }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ errors: error.message }) };
  }
}
module.exports = main;