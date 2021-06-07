export default {
  title: 'Table 全键盘操作示例',
  remark: 'bla bla bla',
  body: [
    {
      type: 'plain',
      className: 'text-danger',
      text:
        '请通过上下左右键切换单元格，按 `Space` 键进入编辑模式，按 `Enter` 提交编辑，并最后点左上角的全部保存完成操作。'
    },
    {
      type: 'crud',
      className: 'm-t',
      api: '/api/sample',
      quickSaveApi: '/api/sample/bulkUpdate',
      quickSaveItemApi: '/api/sample/$id',
      columns: [
        {
          name: 'id',
          label: 'ID',
          width: 20,
          sortable: true,
          type: 'text',
          toggled: true
        },
        {
          name: 'engine',
          label: 'Rendering engine',
          sortable: true,
          quickEdit: {
            type: 'input-text',
            required: true,
            mode: 'inline'
          },
          type: 'text',
          toggled: true
        },
        {
          name: 'browser',
          label: 'Browser',
          sortable: true,
          quickEdit: {
            type: 'input-text',
            required: true
          },
          type: 'text',
          toggled: true
        },
        {
          name: 'platform',
          label: 'Platform(s)',
          sortable: true,
          quickEdit: true,
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
            type: 'select',
            options: ['A', 'B', 'C', 'D', 'X']
          },
          type: 'text',
          toggled: true
        }
      ]
    }
  ]
};
