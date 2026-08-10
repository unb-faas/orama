/*
* ___                            
* / _ \ _ __ __ _ _ __ ___   __ _ 
* | | | | '__/ _` | '_ ` _ \ / _` |
* | |_| | | | (_| | | | | | | (_| |
* \___/|_|  \__,_|_| |_| |_|\__,_|
* Framework - Object Storage (COS)
*/

const COS_APIKEY = "XXX_APIKEY_XXX";
const COS_RESOURCE_INSTANCE_ID = "XXX_RESOURCE_INSTANCE_ID_XXX";
const COS_BUCKET = "XXX_BUCKET_XXX";
const COS_REGION = "XXX_REGION_XXX";
const IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";
const COS_ENDPOINT = `https://s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;

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
      apikey: COS_APIKEY
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

function normalizeId(id) {
  return id.endsWith(".json") ? id.slice(0, -5) : id;
}

async function main(context = {}) {
  try {
    const id = extractId(context);
    if (!id) {
      return response(400, { errors: ["Error: parameter id is missing"] });
    }

    const normalizedId = normalizeId(id);
    const objectKey = `${normalizedId}.json`;
    const token = await getIamToken();
    const objectUrl = `${COS_ENDPOINT}/${encodeURIComponent(COS_BUCKET)}/${encodeURIComponent(objectKey)}`;
    const requestHeaders = {
      Authorization: `Bearer ${token}`,
      "ibm-service-instance-id": COS_RESOURCE_INSTANCE_ID
    };

    const headResponse = await fetch(objectUrl, {
      method: "HEAD",
      headers: requestHeaders
    });

    if (headResponse.status === 404) {
      return response(404, { errors: [`Error: file ${normalizedId} was not found`] });
    }
    if (!headResponse.ok) {
      const headBody = await headResponse.text();
      return response(headResponse.status, {
        errors: [`Error checking object: ${headBody || headResponse.statusText}`]
      });
    }

    const cosResponse = await fetch(objectUrl, {
      method: "DELETE",
      headers: requestHeaders
    });

    if (!cosResponse.ok) {
      const errorBody = await cosResponse.text();
      return response(cosResponse.status, {
        errors: [`Error deleting object: ${errorBody || cosResponse.statusText}`]
      });
    }

    return response(200, {
      message: "File deleted successfully",
      id: normalizedId
    });
  } catch (error) {
    console.error(error);
    return response(500, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
