/**
 * 将 shape 转成 svg 格式
 */

import {Color} from '../../../../util/color';
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
  // 边框有时候会超过
  svg.setAttribute('style', 'overflow: visible');
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
    const d = generateDefines(path, vars);
    pathEl.setAttribute('d', d);
    if (d.endsWith('Z')) {
      // 暂时不知道原因
      pathEl.setAttribute('fill-opacity', '0.5');
    }
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

    const fillColor = pathEl.getAttribute('fill');
    if (fillColor && fillColor !== 'none') {
      const color = new Color(fillColor);
      const fillMode = path.fill;
      let changeColor = '';
      switch (fillMode) {
        // 这些值目前是瞎编的，官方规范里没说
        // http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/ST_PathFillMode.html
        case 'darken':
          changeColor = color.lumOff(-0.5).toHex();
          break;

        case 'darkenLess':
          changeColor = color.lumOff(-0.2).toHex();
          break;

        case 'lighten':
          changeColor = color.lumOff(0.5).toHex();
          break;

        case 'lightenLess':
          changeColor = color.lumOff(0.2).toHex();
          break;
      }
      if (changeColor) {
        pathEl.setAttribute('fill', changeColor);
      }
    }
    if (path.fill === 'none') {
      pathEl.setAttribute('fill', 'none');
    }

    // 如果没有 fill 也没有 stroke 就没法看了，所以设置个默认颜色
    const strokeColor = pathEl.getAttribute('stroke');
    if (!strokeColor && pathEl.getAttribute('fill') === 'none') {
      pathEl.setAttribute('stroke', 'black');
    }

    svg.appendChild(pathEl);
  }

  return svg;
}
