module.exports = function (req, res) {
  const showError = req.query.error;

  if (showError) {
    return res.json({
      status: 404,
      msg: 'Not Found'
    });
  } else {
    return res.json({
      status: 0,
      msg: '随机返回一个数字',
      data: {
        random: Math.random() * 1000
      }
    });
  }
};
