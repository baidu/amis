const data = [
  {
    engine: 'Other browsers',
    browser: 'All others',
    platform: '-',
    version: '1',
    grade: 'U',
    progress: 50,
    status: true,
    weight: 56,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '2',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '3',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Other browsers',
    browser: 'All others',
    platform: '-',
    version: '4',
    grade: 'U',
    progress: 50,
    status: true,
    weight: 56,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '-',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '5',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Other browsers',
    browser: 'All others',
    platform: '-',
    version: '-',
    grade: 'U',
    progress: 50,
    status: true,
    weight: 56,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '-',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Misc',
    browser: 'PSP browser',
    platform: 'PSP',
    version: '-',
    grade: 'C',
    progress: 50,
    status: true,
    weight: 55,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  },
  {
    engine: 'Other browsers',
    browser: 'All others',
    platform: '-',
    version: '-',
    grade: 'U',
    progress: 50,
    status: true,
    weight: 56,
    others: null,
    createdAt: '2017-11-17T08:47:50.000Z',
    updatedAt: '2017-11-17T08:47:50.000Z'
  }
].map((item, key) => ({
  ...item,
  id: key + 1
}));

const table = {
  type: 'table',
  data,
  columns: [
    {
      name: 'id',
      label: 'ID 1',
      width: 20,
      sortable: true,
      type: 'text',
      toggled: true,
      fixed: 'left'
    },
    {
      name: 'engine',
      label: 'Rendering engine 2',
      sortable: true,
      searchable: true,
      type: 'text',
      toggled: true,
      fixed: 'left'
    },
    {
      name: 'browser',
      label: 'Browser 3',
      sortable: true,
      type: 'text',
      toggled: true
      // groupName: '1'
    },
    {
      name: 'platform',
      label: 'Platform(s) 4',
      sortable: true,
      type: 'text',
      toggled: true
      // groupName: '1'
    },
    {
      name: 'version',
      label: 'Engine version 5',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'grade',
      label: 'CSS grade 6',
      quickEdit: {
        mode: 'inline',
        type: 'select',
        options: ['A', 'B', 'C', 'D', 'X'],
        saveImmediately: true
      },
      type: 'text',
      toggled: true
    },
    {
      name: 'browser',
      label: 'Browser 7',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s) 8',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'version',
      label: 'Engine version 9',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'browser',
      label: 'Browser 10',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s) 11',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'version',
      label: 'Engine version 12',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'browser',
      label: 'Browser 13',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s) 14',
      sortable: true,
      type: 'text',
      toggled: true,
      fixed: 'right'
    },
    {
      name: 'version',
      label: 'Engine version 15',
      quickEdit: true,
      type: 'text',
      toggled: true,
      fixed: 'right'
    }
  ]
};

const tableBody = [
  table,

  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  {
    ...table,
    columns: table.columns.map((item, index) => {
      if (index < 5 && index > 2) {
        return {
          ...item,
          groupName: 'group'
        };
      }
      return item;
    })
  },
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>',
  '<div>分割</div>'
];

export default {
  title: '固顶和列固定示例',
  remark: 'bla bla bla',
  body: [
    ...tableBody,
    {
      label: '点击弹框',
      type: 'button',
      actionType: 'dialog',
      dialog: {
        title: '弹框标题',
        size: 'lg',
        body: tableBody
      }
    }
  ]
};
