/**
 * @file 请求随机延迟的模拟接口
 */

function generateRandomNames(num) {
  const candidate = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Mike', 'Nina', 'Oliver', 'Polly', 'Queenie', 'Randy', 'Sybil', 'Trudy', 'Victor', 'Wendy', 'Xander', 'Yvonne', 'Zoe'];
  const randomNames = [];

  for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * candidate.length);
      randomNames.push(candidate[randomIndex]);
  }

  return [...new Set(randomNames)].map(i => ({ value: i, label: i }));
}

function generateRandomDelay() {
  const timeout = [0, 200, 500, 700, 1000, 2000];

  const randomDelay = [];
  for (let i = 0; i < timeout.length; i++) {
      const randomIndex = Math.floor(Math.random() * timeout.length);
      randomDelay.push(timeout[randomIndex]);
  }

  return randomDelay[0];
}

function isPositiveInteger(input) {
  var pattern = /^\d+$/;
  return pattern.test(input);
}

module.exports = function (req, res) {
  const labelField = req.query.labelField || 'label';
  const valueField = req.query.valueField || 'value';
  const term = req.query.term || '';
  const useDelay = req.query.delay || false;
  const total = isPositiveInteger(Number(req.query.total)) ? Number(req.query.total) : 20;
  const list = generateRandomNames(total).map(item => ({[labelField]: item.label, [valueField]: item.value}));
  const delay = generateRandomDelay();

  const responseWrapper = () => {
    res.json({
      status: 0,
      msg: '',
      data: term
        ? list.filter(function (item) {
            return term ? ~item.label.toLowerCase().indexOf(term.toLowerCase()) : false;
          })
        : list
    });
  }

  if (useDelay) {
    return setTimeout(responseWrapper, delay);
  }

  return responseWrapper();
};
