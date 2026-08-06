/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Object Storage (COS)
*/

const COS_APIKEY = "XXX_APIKEY_XXX";
const COS_INSTANCE_ID = "XXX_RESOURCE_INSTANCE_ID_XXX";
const BUCKET_NAME = "XXX_BUCKET_XXX";
const REGION = "XXX_REGION_XXX";

async function getToken() {
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${COS_APIKEY}`
  });
  return (await res.json()).access_token;
}

async function main(context) {
  let data = context.query || context.body || context.__ow_body || context || {};
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { } }
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': 'OPTIONS,DELETE', 'Access-Control-Allow-Origin': '*' };
  if (context.__ow_method && context.__ow_method.toLowerCase() === 'options') return { statusCode: 200, headers, body: JSON.stringify({ message: "OK" }) };

  let objectKey = data.objectKey || data.objectName || data.key || null;
  if (!objectKey) return { statusCode: 400, headers, body: JSON.stringify({ error: "O parâmetro objectKey é obrigatório." }) };

  try {
    const token = await getToken();
    const endpoint = `https://s3.${REGION}.cloud-object-storage.appdomain.cloud`;

    await fetch(`${endpoint}/${BUCKET_NAME}/${objectKey}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'ibm-service-instance-id': COS_INSTANCE_ID }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: `Object ${objectKey} deleted successfully from bucket ${BUCKET_NAME}`, objectKey })
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ errors: error.message }) };
  }
}
module.exports = main;