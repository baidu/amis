const DB = require('../sample.db');

module.exports = function (req, res) {
  const size =
    req.query.size && typeof Number(req.query.size) === 'number'
      ? Math.ceil(req.query.size)
      : 0;

  const customOptions =
    size > 0
      ? Array.from({length: size}, (item, index) => ({
          label: 'Option ' + index,
          value: index.toString()
        }))
      : [];

  const defaultOptions = [
    {label: 'Option A', value: 'a'},
    {label: 'Option B', value: 'b'},
    {label: 'Option C', value: 'c'},
    {label: 'Option D', value: 'd'},
    {label: 'Option E', value: 'e'},
    {label: 'Option F', value: 'f'},
    {label: 'Option G', value: 'g'},
    {label: 'Option H', value: 'h'},
    {label: 'Option I', value: 'i'},
    {label: 'Option J', value: 'j'},
    {label: 'Option K', value: 'k'},
    {label: 'Option L', value: 'l'},
    {label: 'Option M', value: 'm'},
    {label: 'Option N', value: 'n'},
    {label: 'Option O', value: 'o'},
    {label: 'Option P', value: 'p'},
    {label: 'Option Q', value: 'q'}
  ];

  function getRandomText() {
    const aa = ['engine', 'browser', 'platform', 'version', 'grade'];

    const key = aa[Math.ceil(Math.random() * 5 - 1)];

    const index = Math.ceil(Math.random() * 171 - 1);

    return DB[index][key];
  }

  const jiade = [...Array(200)].map((_, i) => ({
    id: i + 1,
    label: getRandomText(),
    value: getRandomText()
  }));

  res.json({
    status: 0,
    msg: 'ok',
    data: {
      options: jiade // size ? defaultOptions : DB // .slice(0, 10)
    }
  });
};
