// 与departUser.js中的users一致
const users = [
  {
    label: '用户 1',
    value: 'user1'
  },
  {
    label: '用户 2',
    value: 'user2'
  },
  {
    label: '用户 a',
    value: 'usera'
  },
  {
    label: '用户 b',
    value: 'userb'
  },
  {
    label: '用户 x',
    value: 'userx'
  },
  {
    label: '用户 y',
    value: 'usery'
  },
  {
    label: '用户 I',
    value: 'useri'
  },
  {
    label: '用户 II',
    value: 'userii'
  },
  {
    label: '用户一',
    value: 'useryi'
  },
  {
    label: '用户二',
    value: 'userer'
  },
  {
    label: '用户k',
    value: 'userk'
  },
  {
    label: '用户j',
    value: 'userj'
  }
];

module.exports = function (req, res) {
  // 关键词为term
  if (req.query.term) {
    const result = users.find(item => item.value === req.query.term);

    res.json({
      status: 0,
      msg: '',
      data: {
        options: result ? [result] : []
      }
    });
  }

  res.json({
    status: 0,
    msg: '',
    data: {
      options: users
    }
  });
};
