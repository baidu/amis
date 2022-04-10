const tpls = {
  tpl1: {
    name: 'Amis Renderer',
    author: 'fex',
    date: 1646323200
  },
  tpl2: {
    name: 'Renderer',
    author: 'amis'
  },
  tpl3: {
    name: 'Amis',
    author: 'renderer'
  }
};

module.exports = function (req, res) {
  res.json({
    status: 0,
    msg: '',
    data: Object.assign({}, tpls[req.query.tpl] || tpls.tpl1, {
      infoId: req.query.id,
      date: Math.round(Date.now() / 1000),
      info: req.query.keywords ? `你输入的关键子是 ${req.query.keywords}` : ''
    })
  });
};
