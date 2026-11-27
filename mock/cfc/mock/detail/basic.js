const data = {
  userInfo: {
    name: '张三',
    email: 'zhangsan@fake.com',
    department: '系统开发部',
    tel: '13232212321',
    remark: '这是一段很长很长很长很长很长很长很长很长很长很长的备注'
  },
  job: {
    status: 'pending',
    jobNo: '9080978978979878',
    childNo: '4',
    createdAt: new Date().getTime()
  },
  subJobs: [
    {
      id: '8562812',
      name: '/bj/orp/xxx-node_0_基础组件升级',
      code: '12421432143214321',
      per: '1',
      count: '1',
      consuming: '1',
      createdAt: new Date().getTime()
    },
    {
      id: '8561371',
      name: '/bj/orp/xxx-node_1_后台升级',
      code: '12421432143214322',
      per: '2',
      count: '2',
      consuming: '4',
      createdAt: new Date().getTime()
    },
    {
      id: '8561131',
      name: '/gz/orp/fsda-node_4_基础数据库升级',
      code: '12421432143214323',
      per: '4',
      count: '4',
      consuming: '16',
      createdAt: new Date().getTime()
    },
    {
      id: '8560085',
      name: '/sz/orp/saas-node_0_基础组件升级',
      code: '12421432143214324',
      per: '9',
      count: '2',
      consuming: '18',
      createdAt: new Date().getTime()
    }
  ],
  jobProgress: [
    {
      time: new Date().getTime(),
      rate: '全量',
      status: 'pending',
      updatedBy: 'zhangsan',
      cost: '-'
    },
    {
      time: new Date().getTime(),
      rate: '单边',
      status: 'success',
      updatedBy: 'zhangsan',
      cost: '2h'
    },
    {
      time: new Date().getTime(),
      rate: '单台',
      status: 'success',
      updatedBy: 'zhangsan',
      cost: '10mins'
    },
    {
      time: new Date().getTime(),
      rate: '预览机',
      status: 'success',
      updatedBy: 'zhangsan',
      cost: '4mins'
    },
    {
      time: new Date().getTime(),
      rate: '准备阶段',
      status: 'success',
      updatedBy: 'zhangsan',
      cost: '2mins'
    }
  ]
};

module.exports = function (req, res) {
  const ret = {
    status: 0,
    msg: 'ok',
    data
  };

  res.json(ret);
};
