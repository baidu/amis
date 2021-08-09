/**
 * @file 用于模拟 cfc 接口
 */

const cfcHandler = require('./cfc/index').handler;

module.exports = function (req, res) {
  const subpath = (req.originalUrl || req.url).replace(
    /^\/(api\/mock2|api)\/|\?.*$/g,
    ''
  );
  const mockEvent = {
    queryStringParameters: req.query,
    pathParameters: {
      subpath
    },
    headers: req.headers,
    body: req.body
  };
  const mockContext = {};

  cfcHandler(mockEvent, mockContext, (err, result) => {
    res.set(result.headers);
    res.status(result.statusCode).json(JSON.parse(result.body));
  });
};
