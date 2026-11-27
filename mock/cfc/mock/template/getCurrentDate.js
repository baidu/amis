module.exports = function (req, res) {
  function getDaysInMonth(month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${month}月${day}日`;
      daysArray.push({
        "label": dateStr,
        "value": dateStr
      });
    }

    return daysArray;
  }

  // 获取当前日期
  const currentDate = new Date();

  // 获取当前年份和月份
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 注意月份是从0开始的，所以要加1

  // 获取当前月份的每一天数组
  const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);


  res.json({
    status: 0,
    msg: 'ok',
    data: daysInCurrentMonth
  });
};
