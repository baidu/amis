const length = 112;
const data = [];

for (let index = 0; index < length; index++) {
  data.push({
    id: index + 1,
    name: 'TaskJob' + (length - index + 1),
    description:
      '这是一段很长很长很长很长很长很长很长很长很长很长很长很长的描述',
    retry: getRandomItem(['120', '150', '20', '2']),
    priority: getRandomItem([1, 2, 3]),
    status: getRandomItem(['success', 'pending', 'fail', 'queue', 'schedule']),
    createdAt: getRandomItem([new Date().getTime(), 0])
  });
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = function (req, res) {
  const perPage = 10;
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
