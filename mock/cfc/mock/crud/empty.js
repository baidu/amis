module.exports = function (req, res) {
  const ret = {
    status: 0,
    msg: '',
    data: {
      count: 0,
      rows: []
    }
  };

  res.json(ret);
};
