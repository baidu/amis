import {ST_BorderStyle} from '../../../../openxml/ExcelTypes';

/**
 * 参考 18.18.3 (p2436)
 */

export function setLineStyle(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  style?: ST_BorderStyle
) {
  ctx.lineWidth = 1;
  if (style) {
    switch (style) {
      case 'hair':
        ctx.setLineDash([1, 2]);
        break;

      case 'dashDotDot':
      case 'mediumDashDotDot':
        ctx.setLineDash([2, 2, 5, 2, 2]);
        break;

      case 'dashDot':
      case 'mediumDashDot':
      case 'slantDashDot':
        ctx.setLineDash([2, 5, 2]);
        break;

      case 'dotted':
        ctx.setLineDash([2]);
        break;

      case 'dashed':
      case 'mediumDashed':
        ctx.setLineDash([3]);
        break;

      case 'medium':
        ctx.lineWidth = 2;
        break;

      case 'thick':
        ctx.lineWidth = 3;
        break;

      default:
        ctx.setLineDash([0]);
        break;
    }
  } else {
    ctx.setLineDash([]);
  }
}
