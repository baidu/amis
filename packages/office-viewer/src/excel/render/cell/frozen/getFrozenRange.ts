import {Size} from '../../../sheet/ViewRange';
import {RangeInfo} from '../../../sheet/getViewRange';

/**
 * 获取冻结区域的数据范围
 */

export function getFrozenRange(
  split: number,
  shift: number,
  getSize: (index: number) => number
): RangeInfo {
  const indexes: number[] = [];
  let startOffset = 0;
  let sizes: Size[] = [];
  for (let i = 0; i < split; i++) {
    indexes.push(i);
    const size = getSize(i);
    sizes.push({
      size: size,
      offset: startOffset + shift
    });
    startOffset += size;
  }
  return {
    indexes,
    sizes,
    startOffset: 0,
    length: startOffset + shift
  };
}
