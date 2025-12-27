module.exports = function (req, res) {
  const callback = req.query._callback;

  const responseData = {
    status: 0,
    msg: '',
    data: {
      type: 'page',
      title: 'jsonp 示例',
      body: 'this is tpl from jsonp'
    }
  };
  const js = `
    (function() {
      window.${callback} && window.${callback}(${JSON.stringify(responseData)})
    })();
  `;

  return res.send(js);
};
