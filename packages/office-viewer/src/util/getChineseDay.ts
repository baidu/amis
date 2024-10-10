/**
 * 获取中文星期几
 */

export function getChineseDay(date: Date) {
  const day = date.getDay();
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `星期${days[day]}`;
}
