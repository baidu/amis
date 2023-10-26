export default {
  title: '简单分页，返回 hasNext 属性指示是否有下一页',
  body: {
    type: 'crud',
    draggable: true,
    api: {
      method: 'get',
      url: '/api/sample/simpleList?page=${page}&pageDir=${pageDir}&after=${items[items.length - 1].id}&before=${items[0].id}',
      // 因为 before 和 after 的值每次请求完后都会变
      // 触发了接口的自动刷新，所以这里需要通过 trackExpression 自定义刷新条件
      trackExpression: '${page}-${pageDir}'
    },
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text',
        remark: 'Bla bla Bla'
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        type: 'text'
      },
      {
        name: 'browser',
        label: 'Browser',
        type: 'text'
      },
      {
        name: 'platform',
        label: 'Platform(s)',
        type: 'text'
      },
      {
        name: 'version',
        label: 'Engine version',
        type: 'text',
        classNameExpr: "<%= data.version < 5 ? 'bg-danger' : '' %>"
      },
      {
        type: 'text',
        name: 'grade',
        label: 'CSS grade'
      }
    ]
  }
};
