module.exports = function (req, res) {
  const prevLabel = req.query.label ? req.query.label : '';
  let labelPrefix = 'lazy-option-';
  let valuePrefix = 'lazy-';
  const options = [];

  if (prevLabel && /^lazy-option-(.*)$/.test(prevLabel)) {
    labelPrefix = `lazy-option-${RegExp.$1}-`;
    valuePrefix = `lazy-${RegExp.$1}-`;
  }

  for (let i = 1, len = 5; i <= len; i++) {
    options.push({
      label: labelPrefix + i,
      value: valuePrefix + i,
      defer: i < 3
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
