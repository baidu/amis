/**
 * 将 shape 转成 svg 格式
 *
 * https://wiki.documentfoundation.org/Development/Improve_handles_of_DrawingML_shapes
 */

import {Color} from '../../../util/color';
import {createSVGElement} from '../../../util/dom';
import {WPSStyle} from '../../word/wps/WPSStyle';
import {Shape, ShapeGuide} from '../Shape';
import {ShapePr} from '../ShapeProperties';
import {evalFmla} from './formulas';
import {Point, Var, generateDefines} from './generateDefines';
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
  svg.style.display = 'block';

  // 边框有时候会超过
  // block 是为了避免被 text-align 影响
  // z-index 是因为后面可能会有文字，避免遮挡
  svg.setAttribute(
    'style',
    'display: block; overflow: visible; position: absolute; z-index: -1'
  );
  svg.setAttribute('width', width.toString() + 'px');
  svg.setAttribute('height', height.toString() + 'px');

  // 变量值
  const vars: Var = presetVal(width, height);

  // 先执行 avLst 定义初始变量
  for (const gd of shape.avLst || []) {
    evalFmla(gd.n, gd.f, vars);
  }

  // 自定义 avLst
  for (const gd of avLst) {
    evalFmla(gd.n, gd.f, vars);
  }

  // 执行 gdLst
  for (const gd of shape.gdLst || []) {
    evalFmla(gd.n, gd.f, vars);
  }

  const outline = shapePr.outline;
  const prevPoint: Point[] = [];
  for (const path of shape.pathLst || []) {
    const pathEl = createSVGElement('path');
    const d = generateDefines(path, vars, prevPoint);
    pathEl.setAttribute('d', d);

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
      if (outline.style === 'none') {
        pathEl.setAttribute('stroke', 'none');
      }
    } else if (wpsStyle && wpsStyle.lineColor) {
      pathEl.setAttribute('stroke', wpsStyle.lineColor);
    } else {
      pathEl.setAttribute('stroke', 'none');
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

    if (path.stroke === false) {
      pathEl.setAttribute('stroke', 'none');
      if (!path.fill) {
        pathEl.setAttribute('fill', 'none');
      }
    }

    if (shapePr.noFill) {
      pathEl.setAttribute('fill', 'none');
    }

    svg.appendChild(pathEl);
  }

  return svg;
}
