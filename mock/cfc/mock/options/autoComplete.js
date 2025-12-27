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
  const labelField = req.query.labelField || 'label';
  const valueField = req.query.valueField || 'value';
  const term = req.query.term || '';
  const list = db.map(item => ({[labelField]: item.label, [valueField]: item.value}))

  res.json({
    status: 0,
    msg: '',
    data: term
      ? list.filter(function (item) {
          return term ? ~item.label.indexOf(term) : false;
        })
      : list
  });
};
