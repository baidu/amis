var Chance = require('../chance');

var chance = new Chance();

function repeat(fn, times = 10) {
  let arr = [];
  while (times--) {
    arr.push(fn());
  }

  return arr;
}

module.exports = function (req, res) {
  res.json({
    status: 0,
    msg: 'ok',
    data: {
      keywords: req.query.keywords,
      date: Math.round(Date.now() / 1000),
      table1: repeat(() => ({
        id: chance.integer({min: 1, max: 99999999}),
        text: chance.city(),
        progress: Math.round(Math.random() * 100),
        type: Math.round(Math.random() * 5),
        boolean: Math.random() > 0.5 ? true : false,
        list: repeat(
          () => ({
            title: chance.word(),
            description: chance.paragraph()
          }),
          Math.round(Math.random() * 10)
        ),
        date: Math.round(Date.now() / 1000),
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
      })),

      table2: repeat(() => ({
        id: chance.integer({min: 1, max: 99999999}),
        text: chance.city(),
        progress: Math.round(Math.random() * 100),
        type: Math.round(Math.random() * 5),
        boolean: Math.random() > 0.5 ? true : false,
        list: repeat(
          () => ({
            title: chance.word(),
            description: chance.paragraph()
          }),
          Math.round(Math.random() * 10)
        ),
        date: Math.round(Date.now() / 1000),
        image:
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
      }))
    }
  });
};
