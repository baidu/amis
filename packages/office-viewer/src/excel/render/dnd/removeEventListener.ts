import {handleMousemove} from './handleMousemove';
import {handleMouseup} from './handleMouseup';

/**
 * 移除事件监听
 */
export function removeEventListener() {
  document.removeEventListener('mousemove', handleMousemove, true);
  // document.removeEventListener('touchmove', handleMousemove, true);
  document.removeEventListener('mouseup', handleMouseup);
  // document.removeEventListener('touchend', handleMouseup);
}
