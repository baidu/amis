/**
 * pt 转 px
 */

const DPI = 96;
const ptToPx = DPI / 72;

export function pt2px(pt: number) {
  return pt * ptToPx;
}
