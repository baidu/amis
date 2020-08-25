module.exports = function (req, res) {
  let repeat = 2 + Math.round(Math.random() * 5);
  const options = [];

  while (repeat--) {
    const value = Math.round(Math.random() * 1000000);
    const label = value + '';

    options.push({
      label: label,
      value: value,
      defer: Math.random() > 0.7
    });
  }

  res.json({
    status: 0,
    msg: '',
    data: {
      options: options
    }
  });
};
