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
  return null;
}

function normalizeId(id) {
  return id.endsWith(".json") ? id.slice(0, -5) : id;
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractKeys(xml) {
  return [...xml.matchAll(/<Key>([\s\S]*?)<\/Key>/g)]
    .map((match) => decodeXml(match[1]))
    .filter((key) => key.endsWith(".json"))
    .map((key) => key.slice(0, -5));
}

async function main(context = {}) {
  try {
    const id = extractId(context);
    const token = await getIamToken();
    const requestHeaders = {
      Authorization: `Bearer ${token}`,
      "ibm-service-instance-id": COS_RESOURCE_INSTANCE_ID
    };

    if (id) {
      const normalizedId = normalizeId(id);
      const objectKey = `${normalizedId}.json`;
      const objectUrl = `${COS_ENDPOINT}/${encodeURIComponent(COS_BUCKET)}/${encodeURIComponent(objectKey)}`;
      const cosResponse = await fetch(objectUrl, {
        method: "GET",
        headers: { ...requestHeaders, Accept: "application/json" }
      });

      if (cosResponse.status === 404) {
        return response(404, { errors: [`Error: file ${normalizedId} was not found`] });
      }

      const rawBody = await cosResponse.text();
      if (!cosResponse.ok) {
        return response(cosResponse.status, {
          errors: [`Error retrieving object: ${rawBody || cosResponse.statusText}`]
        });
      }

      let item;
      try {
        item = JSON.parse(rawBody);
      } catch (_) {
        item = rawBody;
      }

      return response(200, { id: normalizedId, item });
    }

    const listUrl = `${COS_ENDPOINT}/${encodeURIComponent(COS_BUCKET)}?list-type=2`;
    const cosResponse = await fetch(listUrl, {
      method: "GET",
      headers: requestHeaders
    });
    const xmlBody = await cosResponse.text();

    if (!cosResponse.ok) {
      return response(cosResponse.status, {
        errors: [`Error listing objects: ${xmlBody || cosResponse.statusText}`]
      });
    }

    const ids = extractKeys(xmlBody);
    return response(200, { count: ids.length, ids });
  } catch (error) {
    console.error(error);
    return response(500, { errors: [`Error: ${error.message || error}`] });
  }
}

module.exports.main = main;
