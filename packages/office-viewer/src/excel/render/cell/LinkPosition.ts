import {Rect} from '../Rect';

/**
 * 链接位置
 */
export type LinkPosition = {
  /**
   * 链接位置
   */
  url: string;
  /**
   * 如果有多个位置，表示折行了，需要每一行都判断
   */
  pos: Rect[];
};
