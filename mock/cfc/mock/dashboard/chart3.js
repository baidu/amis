const data = {
  toolbox: {
    show: true,
    feature: {
      mark: {show: true},
      dataView: {show: true, readOnly: false},
      restore: {show: true},
      saveAsImage: {show: true}
    }
  },
  series: [
    {
      name: '面积模式',
      type: 'pie',
      radius: [50, 130],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        {value: 40, name: 'rose 1'},
        {value: 38, name: 'rose 2'},
        {value: 32, name: 'rose 3'},
        {value: 30, name: 'rose 4'},
        {value: 28, name: 'rose 5'},
        {value: 26, name: 'rose 6'},
        {value: 22, name: 'rose 7'},
        {value: 18, name: 'rose 8'}
      ]
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
