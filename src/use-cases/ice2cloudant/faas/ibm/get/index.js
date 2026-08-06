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
const DATABASE_NAME = "XXX_DATABASE_XXX";
const IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Max-Age": "86400"
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

async function getIamToken() {
  const tokenResponse = await fetch(IAM_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      response_type: "cloud_iam",
      apikey: CLOUDANT_APIKEY
    })
  });

  const tokenBody = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenBody.access_token) {
    throw new Error(`Unable to obtain IAM token: ${JSON.stringify(tokenBody)}`);
  }
  return tokenBody.access_token;
}

async function main() {
  try {
    const token = await getIamToken();
    const url = `${CLOUDANT_URL.replace(/\/$/, "")}/${encodeURIComponent(DATABASE_NAME)}/_all_docs?include_docs=true`;

    const cloudantResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const cloudantBody = await cloudantResponse.json();
    if (!cloudantResponse.ok) {
      return response(cloudantResponse.status, { errors: [cloudantBody] });
    }

    const items = (cloudantBody.rows || [])
      .map((row) => row.doc)
      .filter(Boolean);

    return response(200, {
      count: items.length,
      items
    });
  } catch (error) {
    console.error(error);
    return response(500, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
