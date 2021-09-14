const length = 60;
const data = [];

for (let index = 0; index < length; index++) {
  const id = Math.floor(Math.random() * 99 + 10);
  data.push({
    id,
    name: 'icafe ' + id,
    priority: getRandomItem([
      'P0-Highest',
      'P1-High',
      'P2-Middle',
      'P3-Lowest',
      '-'
    ]),
    status: getRandomItem(['新建', '已完成', '开发中']),
    createdAt: new Date().getTime()
  });
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = function (req, res) {
  const perPage = req.query.perPage || 10;
  const page = req.query.page || 1;
  let items = data.concat();

  if (req.query.keywords) {
    const keywords = req.query.keywords;
    items = items.filter(function (item) {
      return ~JSON.stringify(item).indexOf(keywords);
    });
  }

  const ret = {
    status: 0,
    msg: 'ok',
    data: {
      count: items.length,
      rows: items.concat().splice((page - 1) * perPage, perPage)
    }
  };

  res.json(ret);
};
