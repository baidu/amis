import {Size, ViewRange} from './ViewRange';

export interface RangeInfo {
  /**
   * 索引列表
   */
  indexes: number[];

  /**
   * 起始偏移量
   */
  startOffset: number;

  /**
   * 每个索引的尺寸信息
   */
  sizes: Size[];

  /**
   * 最大长度
   */
  length: number;
}

/**
 * 索引位置缓存信息
 */
export interface IndexInfo {
  offset: number;
  size: number;
}

/**
 * 影藏列范围
 */
export interface HiddenRange {
  min: number;
  max: number;
}

/**
 * 使用二分查找第一个大于等于目标值的索引，也就是在某个偏移量下能看到的第一个单元格
 * @param rangeCache
 * @param target
 * @returns
 */
export function findStartInCache(rangeCache: IndexInfo[], target: number) {
  let start = 0,
    end = rangeCache.length - 1;
  let found = -1;

  while (start < end) {
    let mid = Math.floor((start + end) / 2);

    const indexInfo = rangeCache[mid];
    // 找不到说明 bug 了
    if (!indexInfo) {
      console.error('findStartInCache indexInfo is undefined');
      break;
    }

    const indexRange = indexInfo.offset + indexInfo.size;
    if (indexRange === target) {
      found = mid;
      break;
    } else if (indexRange < target) {
      start = mid + 1;
    } else {
      end = mid;
    }
  }
  if (found !== -1) {
    return found;
  } else {
    return start;
  }
}

/**
 * 获取范围内的索引列表
 * @param offset 滚动条偏移
 * @param shift 表头导致的偏移
 * @param totalLength 总长度
 * @param getHeight 获取长度的方法
 * @param hiddenRange 隐藏的范围
 * @param rangeCache 位置信息缓存
 * @returns
 */
export function getRange(
  offset: number,
  shift: number,
  totalLength: number,
  getHeight: (index: number) => number,
  hiddenRange: HiddenRange[] = [],
  rangeCache: IndexInfo[] = []
): RangeInfo {
  // 从零开始遍历直到找到
  let foundStart = false;
  let foundEnd = false;
  let index = 0;
  let startOffset = 0;
  let currentOffset = 0;
  // 这些都不能为 undefined，避免后面计算死循环
  offset = offset || 0;
  totalLength = totalLength || 0;
  const indexes: number[] = [];
  const sizes: Size[] = [];
  const MAX_LOOP = 10000;
  let loop = 0;
  if (rangeCache.length) {
    const lastRangeCache = rangeCache[rangeCache.length - 1];
    if (lastRangeCache.offset < offset) {
      index = rangeCache.length;
      currentOffset = lastRangeCache.offset;
    } else {
      const foundIndex = findStartInCache(rangeCache, offset);
      // 这时肯定有找到，为 -1 基本上是 bug
      if (foundIndex !== -1) {
        index = foundIndex;
        currentOffset = rangeCache[index].offset;
      }
    }
  }

  while (!(foundStart && foundEnd)) {
    // 如果有隐藏列就直接跳到下一个不隐藏的列，避免很大隐藏列导致性能卡顿
    for (const range of hiddenRange) {
      if (index >= range.min && index <= range.max) {
        index = range.max + 1;
        // 将索引信息加入到缓存中，只处理一次
        if (range.max > rangeCache.length - 1) {
          for (let i = range.min; i <= range.max; i++) {
            rangeCache[i] = {
              offset: currentOffset,
              size: 0
            };
          }
        }
        continue;
      }
    }

    const cellLength = getHeight(index) || 0;
    rangeCache[index] = {
      offset: currentOffset,
      size: cellLength
    };

    // 第一次大于 offset 就找到了开始位置
    if (currentOffset + cellLength >= offset && !foundStart) {
      startOffset = currentOffset - offset;
      foundStart = true;
      indexes.push(index);
      sizes.push({
        size: cellLength,
        offset: currentOffset - offset + shift
      });
      currentOffset += cellLength;
      index = index + 1;
      continue;
    }

    // 第一次大于结束位置就找到了结束位置
    if (currentOffset + cellLength >= offset + totalLength && !foundEnd) {
      foundEnd = true;
      indexes.push(index);
      sizes.push({
        size: cellLength,
        offset: currentOffset - offset + shift
      });
    }

    // 中间节点
    if (foundStart && !foundEnd) {
      indexes.push(index);
      sizes.push({
        size: cellLength,
        offset: currentOffset - offset + shift
      });
    }

    currentOffset += cellLength;

    // 避免是死循环
    if (loop++ > MAX_LOOP) {
      console.error('getRange loop too many times');
      break;
    }
    index = index + 1;
  }

  return {
    indexes,
    sizes,
    startOffset,
    length: totalLength + shift
  };
}

/**
 * 获取视口范围的单元格区域，拆分单独函数是为了方便单元测试，这部分逻辑不需要依赖 UI 展现
 *
 * @param scrollLeft 水平滚动条
 * @param scrollTop 垂直滚动条
 * @param leftShift 左偏移量，主要是表头导致的偏移量
 * @param topShift 上偏移量，主要是表头导致的偏移量
 * @param height 窗口高度
 * @param width 窗口宽度
 * @param defaultRowHeight 行默认高度
 * @param defaultColWidth 列默认宽度
 * @param customRowHeight 自定义行高
 * @param customColWidth 自定义列宽
 *
 * @returns 从 0 开始的行和列，以及初始的坐标
 */
export function getViewRange(
  scrollLeft: number,
  scrollTop: number,
  leftShift: number,
  topShift: number,
  height: number,
  width: number,
  getRowHeight: (index: number) => number,
  rowPositionCache: IndexInfo[] = [],
  getColWidth: (index: number) => number,
  colPositionCache: IndexInfo[] = [],
  colHiddenRange: HiddenRange[] = []
): ViewRange {
  const {
    indexes: rows,
    startOffset: startRowOffset,
    sizes: rowSizes
  } = getRange(scrollTop, topShift, height, getRowHeight, [], rowPositionCache);

  const {
    indexes: cols,
    startOffset: startColOffset,
    sizes: colSizes
  } = getRange(
    scrollLeft,
    leftShift,
    width,
    getColWidth,
    colHiddenRange,
    colPositionCache
  );

  return {
    region: 'normal',
    rows,
    rowSizes,
    height,
    startRowOffset,
    cols,
    colSizes,
    width,
    startColOffset
  };
}
