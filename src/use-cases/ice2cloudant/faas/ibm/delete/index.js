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

function extractId(context = {}) {
  if (context.id !== undefined && context.id !== null && String(context.id).trim() !== "") {
    return String(context.id).trim();
  }

  if (context.query && context.query.id !== undefined) {
    return String(context.query.id).trim();
  }

  if (context.body && typeof context.body === "object" && context.body.id !== undefined) {
    return String(context.body.id).trim();
  }

  return null;
}

async function main(context = {}) {
  try {
    const id = extractId(context);
    if (!id) {
      return response(400, { errors: ["Error: parameter id is missing"] });
    }

    const token = await getIamToken();
    const documentUrl = `${CLOUDANT_URL.replace(/\/$/, "")}/${encodeURIComponent(DATABASE_NAME)}/${encodeURIComponent(id)}`;
    const requestHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    };

    const getResponse = await fetch(documentUrl, {
      method: "GET",
      headers: requestHeaders
    });

    const getBody = await getResponse.json();
    if (getResponse.status === 404) {
      return response(404, { errors: [`Error: item ${id} was not found`] });
    }
    if (!getResponse.ok) {
      return response(getResponse.status, { errors: [getBody] });
    }

    const deleteResponse = await fetch(
      `${documentUrl}?rev=${encodeURIComponent(getBody._rev)}`,
      {
        method: "DELETE",
        headers: requestHeaders
      }
    );

    const deleteBody = await deleteResponse.json();
    if (!deleteResponse.ok) {
      return response(deleteResponse.status, { errors: [deleteBody] });
    }

    return response(200, {
      message: "Item deleted successfully",
      id: deleteBody.id,
      rev: deleteBody.rev
    });
  } catch (error) {
    console.error(error);
    return response(500, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
