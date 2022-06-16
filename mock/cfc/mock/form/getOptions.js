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

  res.json({
    status: 0,
    msg: 'ok',
    data: {
      options: customOptions.length > 0 ? customOptions : defaultOptions
    }
  });
};
