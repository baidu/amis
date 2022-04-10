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
    if (err) {
      console.error(err);
      res.status(500).json({status: 500, msg: err});
    } else {
      res.set(result.headers);
      if (!result.json) {
        res.status(result.statusCode).send(result.body);
      } else {
        res.status(result.statusCode).json(JSON.parse(result.body));
      }
    }
  });
};
