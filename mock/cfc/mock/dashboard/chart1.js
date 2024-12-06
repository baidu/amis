function random(a = 1, b = 100, num = 1) {
  if (num === 1) {
    return randomOne();
  } else {
    let arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(randomOne());
    }
    return arr;
  }

  function randomOne() {
    let rand = Math.random();
    return Math.ceil(a + (b - a) * rand);
  }
}

module.exports = function (req, res) {
  var r = {
    status: 0,
    msg: 'ok',
    data: {
      title: {
        text: '销售情况'
      },
      tooltip: {},
      legend: {data: ['销量']},
      xAxis: {data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']},
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [random(), random(), random(), random(), random(), random()]
        }
      ]
    }
  };

  res.json(r);
};
