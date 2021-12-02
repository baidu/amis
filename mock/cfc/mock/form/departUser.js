const departments = [
  {
    label: '总公司',
    value: 1,
    children: [
      {
        label: '部门 A',
        value: 2
      },

      {
        label: '部门 B',
        value: 3,
        children: [
          {
            label: '子部门1',
            value: 5
          },

          {
            label: '子部门2',
            value: 6
          }
        ]
      },

      {
        label: '部门 C',
        value: 4
      }
    ]
  }
];

function findTree(tree, iterator) {
  function find(list) {
    if (Array.isArray(list)) {
      for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        if (iterator(item)) {
          return item;
        } else if (Array.isArray(item.children)) {
          const result = find(item.children);
          if (result) {
            return result;
          }
        }
      }
    }
    return null;
  }

  return find(tree, iterator);
}

const users = {
  1: [
    {
      label: '用户 1',
      value: 'user1'
    },
    {
      label: '用户 2',
      value: 'user2'
    }
  ],

  2: [
    {
      label: '用户 a',
      value: 'usera'
    },
    {
      label: '用户 b',
      value: 'userb'
    }
  ],
  3: [
    {
      label: '用户 x',
      value: 'userx'
    },
    {
      label: '用户 y',
      value: 'usery'
    }
  ],
  4: [
    {
      label: '用户 I',
      value: 'useri'
    },
    {
      label: '用户 II',
      value: 'userii'
    }
  ],
  5: [
    {
      label: '用户一',
      value: 'useryi'
    },
    {
      label: '用户二',
      value: 'userer'
    }
  ],
  6: [
    {
      label: '用户k',
      value: 'userk'
    },
    {
      label: '用户j',
      value: 'userj'
    }
  ]
};

module.exports = function (req, res) {
  if (req.query.ref) {
    const options = users[req.query.ref];
    res.json({
      status: 0,
      msg: '',
      data: {
        options
      }
    });
    return;
  } else if (req.query.dep) {
    const resolved = findTree(departments, item => item.value == req.query.dep);

    res.json({
      status: 0,
      msg: '',
      data: {
        options: resolved
          ? resolved.children.map(item => {
              item = {
                ...item
              };

              if (item.children) {
                item.defer = true;
                delete item.children;
              }

              return item;
            })
          : []
      }
    });
    return;
  }

  res.json({
    status: 0,
    msg: '',
    data: {
      options: [
        {
          leftOptions: departments.map(item => {
            item = {
              ...item
            };

            if (item.children) {
              item.defer = true;
              delete item.children;
            }

            return item;
          }),
          children: [
            {
              ref: 1,
              defer: true
            },
            {
              ref: 2,
              defer: true
            },
            {
              ref: 3,
              defer: true
            },
            {
              ref: 4,
              defer: true
            },
            {
              ref: 5,
              defer: true
            },
            {
              ref: 6,
              defer: true
            }
          ]
        }
      ]
    }
  });
};
