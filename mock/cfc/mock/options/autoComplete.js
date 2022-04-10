const db = [
  {
    label: 'zhugeliang',
    value: '1'
  },

  {
    label: 'zhongwuyan',
    value: '2'
  },

  {
    label: 'buzhihuowu',
    value: '3'
  },

  {
    label: 'zhongkui',
    value: '4'
  },

  {
    label: 'luna',
    value: '5'
  },

  {
    label: 'wangzhaojun',
    value: '6'
  }
];

module.exports = function (req, res) {
  const term = req.query.term || '';

  res.json({
    status: 0,
    msg: '',
    data: term
      ? db.filter(function (item) {
          return term ? ~item.label.indexOf(term) : false;
        })
      : db
  });
};
