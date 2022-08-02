// cfc 入口。
exports.handler = (event, context, callback) => {
  try {
    const entry = require('./mock/index');
    entry(mockRequest(event, context), mockResponse(event, context, callback));
  } catch (e) {
    callback(e.stack);
  }
};

function mockRequest(event, context) {
  let body = {};

  if (
    event.body &&
    typeof event.body === 'string' &&
    /^application\/json/i.test(event.headers['Content-Type'])
  ) {
    body = JSON.parse(event.body);
  }

  return {
    query: event.queryStringParameters || {},
    method: 'GET',
    body: body,
    url: `/api/${event.pathParameters.subpath}`,
    originalUrl: ''
  };
}

function mockResponse(event, context, callback) {
  return {
    json(json) {
      callback(null, {
        statusCode: 200,
        headers: createHeaders(event.headers),
        body: JSON.stringify(json)
      });
    },
    send(res, headers = {}) {
      callback(null, {
        statusCode: 200,
        headers: {
          ...createHeaders(event.headers),
          'Content-Type': 'text/javascript',
          ...headers
        },
        json: false,
        body: res
      });
    }
  };
}

function createHeaders(headers) {
  let referer = '';

  if (/^(https?\:\/\/[^:\/]+(?:\:\d+)?\/)/i.test(headers['referer'])) {
    referer = RegExp.$1.replace(/\/$/, '');
  }

  return {
    'Content-Type': 'Application/json',
    'Access-Control-Allow-Headers': 'x-requested-with,content-type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,HEAD',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': referer ? `${referer}` : '*'
  };
}
