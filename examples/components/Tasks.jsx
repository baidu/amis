export default {
  title: '异步任务',
  body: [
    '<p class="text-danger"></p>',
    {
      type: 'tasks',
      name: 'tasks',
      items: [
        {
          label: 'hive 任务',
          key: 'hive',
          status: 4,
          remark:
            '查看详情<a target="_blank" href="http://www.baidu.com">日志</a>。'
        },
        {
          label: '小流量',
          key: 'partial',
          status: 4
        },
        {
          label: '全量',
          key: 'full',
          status: 4
        }
      ]
    },

    {
      type: 'tasks',
      name: 'tasks',
      className: 'b-a bg-white table-responsive m-t',
      checkApi: '/api/mock2/task'
    }
  ]
};
