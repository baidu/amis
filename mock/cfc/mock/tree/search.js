/**
 * @file tree/autoComplete
 * @desc 树形结构的自动搜索
 */

const treeOptions = [
  {
    label: 'node-0',
    value: 'node-0',
    children: [
      {
        label: 'node-0-0',
        value: 'node-0-0',
        children: [
          {
            label: 'node-0-0-0',
            value: 'node-0-0-0',
            children: [
              {
                label: 'node-0-0-0-0',
                value: 'node-0-0-0-0'
              },
              {
                label: 'node-0-0-0-1',
                value: 'node-0-0-0-1'
              },
              {
                label: 'node-0-0-0-2',
                value: 'node-0-0-0-2'
              }
            ]
          },
          {
            label: 'node-0-0-1',
            value: 'node-0-0-1',
            children: [
              {
                label: 'node-0-0-1-0',
                value: 'node-0-0-1-0'
              }
            ]
          },
          {
            label: 'node-0-0-2',
            value: 'node-0-0-2',
            children: [
              {
                label: 'node-0-0-2-0',
                value: 'node-0-0-2-0'
              },
              {
                label: 'node-0-0-2-1',
                value: 'node-0-0-2-1'
              },
              {
                label: 'node-0-0-2-2',
                value: 'node-0-0-2-2'
              },
              {
                label: 'node-0-0-2-3',
                value: 'node-0-0-2-3'
              }
            ]
          }
        ]
      },
      {
        label: 'node-0-1',
        value: 'node-0-1',
        children: [
          {
            label: 'node-0-1-0',
            value: 'node-0-1-0',
            children: [
              {
                label: 'node-0-1-0-0',
                value: 'node-0-1-0-0'
              },
              {
                label: 'node-0-1-0-1',
                value: 'node-0-1-0-1'
              }
            ]
          },
          {
            label: 'node-0-1-1',
            value: 'node-0-1-1',
            children: [
              {
                label: 'node-0-1-1-0',
                value: 'node-0-1-1-0'
              },
              {
                label: 'node-0-1-1-1',
                value: 'node-0-1-1-1'
              },
              {
                label: 'node-0-1-1-2',
                value: 'node-0-1-1-2'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'node-1',
    value: 'node-1',
    children: [
      {
        label: 'node-1-0',
        value: 'node-1-0'
      }
    ]
  },
  {
    label: 'node-2',
    value: 'node-2'
  },
  {
    label: 'node-3',
    value: 'node-3',
    children: [
      {
        label: 'node-3-0',
        value: 'node-3-0',
        children: [
          {
            label: 'node-3-0-0',
            value: 'node-3-0-0'
          },
          {
            label: 'node-3-0-1',
            value: 'node-3-0-1'
          },
          {
            label: 'node-3-0-2',
            value: 'node-3-0-2'
          },
          {
            label: 'node-3-0-3',
            value: 'node-3-0-3'
          }
        ]
      }
    ]
  }
];

function searchNode(keyword) {
  const search = data => {
    const matched = [];

    data.forEach(node => {
      if (node.value && ~node.value.indexOf(keyword)) {
        matched.push({...node});
      } else if (node.children) {
        const filtered = search(node.children);

        if (filtered.length) {
          matched.push({...node, children: filtered});
        }
      }
    });

    return matched;
  };

  return search(treeOptions);
}

module.exports = function (req, res) {
  const term = req.query.term || '';

  res.json({
    status: 0,
    msg: '',
    data: {
      options: term ? searchNode(term) : treeOptions
    }
  });
};
