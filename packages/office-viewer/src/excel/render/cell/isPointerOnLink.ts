import {pointInRect} from '../Rect';
import {LinkPosition} from './LinkPosition';

/**
 * 判断当前指针是否在链接上
 */
export function isPointerOnLink(
  x: number,
  y: number,
  linkPositionCache: LinkPosition[]
) {
  for (const linkPosition of linkPositionCache) {
    for (const pos of linkPosition.pos) {
      if (pointInRect(x, y, pos)) {
        return linkPosition.url;
      }
    }
  }

  return false;
}
