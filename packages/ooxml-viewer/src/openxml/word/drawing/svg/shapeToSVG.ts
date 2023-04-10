/**
 * 将 shape 转成 svg 格式
 */

import {createSVGElement} from '../../../../util/dom';
import {WPSStyle} from '../../wps/WPSStyle';
import {Shape, ShapeGuide} from '../Shape';
import {ShapePr} from '../ShapeProperties';
import {evalFmla} from './formulas';
import {Var, generateDefines} from './generateDefines';
import {presetVal} from './presetVal';

export function shapeToSVG(
  shape: Shape,
  avLst: ShapeGuide[],
  shapePr: ShapePr,
  width: number,
  height: number,
  wpsStyle?: WPSStyle
): SVGElement {
  const svg = createSVGElement('svg');
  svg.setAttribute('width', width.toString() + 'px');
  svg.setAttribute('height', height.toString() + 'px');

  // 变量值
  const vars: Var = presetVal(width, height);

  // 先执行 avLst 定义初始变量
  for (const gd of shape.avLst || []) {
    evalFmla(gd.name, gd.fmla, vars);
  }

  // 自定义 avLst
  for (const gd of avLst) {
    evalFmla(gd.name, gd.fmla, vars);
  }

  // 执行 gdLst
  for (const gd of shape.gdLst || []) {
    evalFmla(gd.name, gd.fmla, vars);
  }

  const outline = shapePr.outline;

  for (const path of shape.pathLst || []) {
    const pathEl = createSVGElement('path');
    pathEl.setAttribute('d', generateDefines(path.defines, vars));
    if (shapePr.fillColor) {
      pathEl.setAttribute('fill', shapePr.fillColor);
    } else if (wpsStyle && wpsStyle.fillColor) {
      pathEl.setAttribute('fill', wpsStyle.fillColor);
    } else {
      pathEl.setAttribute('fill', 'none');
    }

    if (outline) {
      if (outline.color) {
        pathEl.setAttribute('stroke', outline.color);
      }
      if (outline.width) {
        pathEl.setAttribute('stroke-width', outline.width);
      }
    } else if (wpsStyle && wpsStyle.lineColor) {
      pathEl.setAttribute('stroke', wpsStyle.lineColor);
    }

    svg.appendChild(pathEl);
  }

  return svg;
}
