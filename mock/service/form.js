const predefined = {
  tpl1: {
    data: {
      dy_1: '还可以更新值'
    },
    controls: [
      {
        type: 'text',
        label: '动态字段1',
        name: 'dy_1',
        required: true
      },

      {
        type: 'text',
        label: '动态字段2',
        name: 'dy_2'
      }
    ]
  },

  tpl2: {
    type: 'panel',
    title: '不是非得是 controls',
    body: '也可以是其他渲染器'
  },

  tpl3: {
    type: 'tpl',
    tpl: '简单点好。'
  }
};

module.exports = function (req, res) {
  const tpl = req.query.tpl;

  if (predefined[tpl]) {
    return res.json({
      status: 0,
      msg: '',
      data: predefined[tpl]
    });
  } else {
    return res.json({
      status: 404,
      msg: 'Not Found'
    });
  }
};
