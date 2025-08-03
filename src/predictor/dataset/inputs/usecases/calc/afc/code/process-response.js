module.exports = (isCors, body, statusCode, resp) => {
  const status = statusCode || (body ? 200 : 204);
  resp.setHeader("Content-Type", "application/json");
  if (isCors) {
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET');
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Max-Age', '86400');
  }
  resp.setStatusCode(status);
  resp.send(JSON.stringify(body) || '');
};
