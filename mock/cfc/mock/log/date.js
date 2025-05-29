function pad(num) {
  return num < 10 ? '0' + num : num;
}

module.exports = function (req, res) {
  const now = new Date();
  const seconds = now.getSeconds();
  const logs = [];
  let from = req.query.offset ? parseInt(req.query.offset) || 0 : 0;
  const finished = seconds == 59;

  for (let i = from; i <= seconds; i++) {
    logs.push(
      `Date: ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate() + 1
      )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(i)}\n`
    );
  }

  if (finished) {
    logs.push('Finished');
  }

  res.json({
    status: 0,
    msg: '',
    data: {
      offset: seconds + 1,
      log: logs,
      finished: finished
    }
  });
};
