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

async function main(context) {
  let data = context.query || context.body || context.__ow_body || context || {};
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { } }
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'OPTIONS,DELETE', 'Access-Control-Allow-Origin': '*' };
  if (context.__ow_method && context.__ow_method.toLowerCase() === 'options') return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };

  let docId = data.id || data.docId || null;
  if (!docId) return { statusCode: 400, headers, body: JSON.stringify({ error: "O parâmetro ID é obrigatório." }) };

  try {
    const token = await getToken();

    const getRes = await fetch(`${CLOUDANT_URL}/${DB_NAME}/${docId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    const doc = await getRes.json();
    if (!doc._rev) return { statusCode: 404, headers, body: JSON.stringify({ error: "Documento não encontrado." }) };

    // Deleta usando o ID
    await fetch(`${CLOUDANT_URL}/${DB_NAME}/${docId}?rev=${doc._rev}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return { statusCode: 200, headers, body: JSON.stringify({ message: "Documento removido com sucesso", id: docId }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ errors: error.message }) };
  }
}
module.exports = main;