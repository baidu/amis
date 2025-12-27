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
        image: 'https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg'
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
        image: 'https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg'
      }))
    }
  });
};
