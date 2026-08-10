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

function extractJsonBody(context = {}) {
  if (context.body && typeof context.body === "object") {
    return context.body;
  }

  if (typeof context.body === "string") {
    return JSON.parse(context.body);
  }

  if (context.__ce_body) {
    const decoded = Buffer.from(context.__ce_body, "base64").toString("utf8");
    return JSON.parse(decoded);
  }

  return Object.fromEntries(
    Object.entries(context).filter(([key]) => !key.startsWith("__ce_"))
  );
}

async function main(context = {}) {
  try {
    const document = extractJsonBody(context);

    if (!document || typeof document !== "object" || Array.isArray(document) || Object.keys(document).length === 0) {
      return response(400, { errors: ["Error: a non-empty JSON body is required"] });
    }

    const id = crypto.randomUUID();
    const objectKey = `${id}.json`;
    const token = await getIamToken();
    const objectUrl = `${COS_ENDPOINT}/${encodeURIComponent(COS_BUCKET)}/${encodeURIComponent(objectKey)}`;

    const cosResponse = await fetch(objectUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "ibm-service-instance-id": COS_RESOURCE_INSTANCE_ID,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(document)
    });

    if (!cosResponse.ok) {
      const errorBody = await cosResponse.text();
      return response(cosResponse.status, {
        errors: [`Error creating object: ${errorBody || cosResponse.statusText}`]
      });
    }

    return response(201, {
      message: "File created successfully",
      id,
      item: document
    });
  } catch (error) {
    console.error(error);
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    return response(statusCode, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
