const data = [
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
      label: 'ID',
      width: 20,
      sortable: true,
      type: 'text',
      toggled: true,
      fixed: 'left'
    },
    {
      name: 'engine',
      label: 'Rendering engine',
      sortable: true,
      searchable: true,
      type: 'text',
      toggled: true,
      fixed: 'left'
    },
    {
      name: 'browser',
      label: 'Browser',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s)',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'version',
      label: 'Engine version',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'grade',
      label: 'CSS grade',
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
      label: 'Browser',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s)',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'version',
      label: 'Engine version',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'browser',
      label: 'Browser',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s)',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'version',
      label: 'Engine version',
      quickEdit: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'browser',
      label: 'Browser',
      sortable: true,
      type: 'text',
      toggled: true
    },
    {
      name: 'platform',
      label: 'Platform(s)',
      sortable: true,
      type: 'text',
      toggled: true,
      fixed: 'right'
    },
    {
      name: 'version',
      label: 'Engine version',
      quickEdit: true,
      type: 'text',
      toggled: true,
      fixed: 'right'
    }
  ]
};

export default {
  title: '固顶和列固定示例',
  remark: 'bla bla bla',
  body: [
    table,
    {
      label: '点击弹框',
      type: 'button',
      actionType: 'dialog',
      dialog: {
        title: '弹框标题',
        size: 'lg',
        body: {...table, data: [...data, ...data]}
      }
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
    table
  ]
};
