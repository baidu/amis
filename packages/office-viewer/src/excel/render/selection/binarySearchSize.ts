import {Size} from '../../sheet/ViewRange';

/**
 * 二分查找到到 hitTest 的位置
 * @param sizes 位置信息
 * @param position 要查找的位置
 * @returns
 */
export function binarySearchSize(sizes: Size[], position: number) {
  let found = -1;
  let start = 0;
  let end = sizes.length - 1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const size = sizes[mid];
    if (size.offset <= position && size.offset + size.size > position) {
      return mid;
    } else if (size.offset < position) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return found;
}
