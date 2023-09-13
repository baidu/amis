export function formatDuration(value: number): string {
  const unit = ['秒', '分', '时', '天', '月', '季', '年'];
  const steps = [1, 60, 3600, 86400, 2592000, 7776000, 31104000];
  let len = steps.length;
  const parts = [];

  while (len--) {
    if (steps[len] && value >= steps[len]) {
      parts.push(Math.floor(value / steps[len]) + unit[len]);
      value %= steps[len];
    } else if (len === 0 && value) {
      parts.push((value.toFixed ? value.toFixed(2) : '0') + unit[0]);
    }
  }

  return parts.join('');
}
