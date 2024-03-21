import {CT_AbsoluteAnchor} from '../../../openxml/ExcelTypes';
import {emuToPx} from '../../../util/emuToPx';

/**
 * 获取绝对锚点的位置信息
 * @param absoluteAnchor
 */
export function getAbsoluteAnchorPosition(absoluteAnchor: CT_AbsoluteAnchor) {
  const pos = absoluteAnchor.pos?.[0];
  if (pos) {
    const x = parseFloat(pos.x! as string);
    const y = parseFloat(pos.y! as string);
    const ext = absoluteAnchor.ext?.[0];
    if (ext && !isNaN(x) && !isNaN(y)) {
      const width = emuToPx(ext.cx!);
      const height = emuToPx(ext.cy!);
      return {
        x,
        y,
        width,
        height
      };
    }
  }

  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
}
