module.exports = function (req, res) {
  const showError = req.query.error;
  const max = req.query.max != null ? parseInt(req.query.max, 10) : 10;
  const min = req.query.min != null ? parseInt(req.query.min, 10) : 1;

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
        random: Math.floor(Math.random() * (max - min + 1) + min)
      }
    });
  }
};
