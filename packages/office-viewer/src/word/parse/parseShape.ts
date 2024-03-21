/**
 * 解析 shape
 */

import {getAttrBoolean} from '../../OpenXML';
import {ST_PathFillMode} from '../../openxml/Types';
import {
  LnTo,
  QuadBezTo,
  CubicBezTo,
  ArcTo,
  MoveTo,
  Path,
  IPath,
  PathPoint
} from '../../openxml/drawing/Path';
import {Rect, Shape, ShapeGuide} from '../../openxml/drawing/Shape';

export function parsePts(element: Element) {
  const pts: PathPoint[] = [];
  for (const child of element.children) {
    const tagName = child.tagName;
    if (tagName === 'a:pt' || tagName === 'pt') {
      const x = child.getAttribute('x');
      const y = child.getAttribute('y');
      if (x && y) {
        pts.push({x, y});
      }
    } else {
      console.warn('unknown pt', tagName, child);
    }
  }

  return pts;
}

// http://webapp.docx4java.org/OnlineDemo/ecma376/DrawingML/path_2.html
export function parsePath(element: Element) {
  const pathChild: IPath[] = [];

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:moveTo':
      case 'moveTo':
        const moveToPt = parsePts(child);
        if (moveToPt.length) {
          const moveTo: MoveTo = {
            type: 'moveTo',
            pt: moveToPt[0]
          };
          pathChild.push(moveTo);
        }
        break;

      case 'a:lnTo':
      case 'lnTo':
        const lnToPt = parsePts(child);
        if (lnToPt.length) {
          const lnTo: LnTo = {
            type: 'lnTo',
            pt: lnToPt[0]
          };
          pathChild.push(lnTo);
        }
        break;

      case 'a:quadBezTo':
      case 'quadBezTo':
        const quadBezToPt = parsePts(child);
        if (quadBezToPt.length) {
          const quadBezTo: QuadBezTo = {
            type: 'quadBezTo',
            pts: quadBezToPt
          };
          pathChild.push(quadBezTo);
        }
        break;

      case 'a:cubicBezTo':
      case 'cubicBezTo':
        const cubicBezToPt = parsePts(child);
        if (cubicBezToPt.length) {
          const cubicBezTo: CubicBezTo = {
            type: 'cubicBezTo',
            pts: cubicBezToPt
          };
          pathChild.push(cubicBezTo);
        }
        break;

      case 'a:arcTo':
      case 'arcTo':
        const wR = child.getAttribute('wR');
        const hR = child.getAttribute('hR');
        const stAng = child.getAttribute('stAng');
        const swAng = child.getAttribute('swAng');
        if (wR && hR && stAng && swAng) {
          const arcTo: ArcTo = {
            type: 'arcTo',
            wR,
            hR,
            stAng,
            swAng
          };
          pathChild.push(arcTo);
        }
        break;

      case 'a:close':
      case 'close':
        pathChild.push({
          type: 'close'
        });
        break;

      default:
        console.warn('parsePath: unknown tag', tagName, child);
    }
  }

  const path: Path = {defines: pathChild};

  const fill = element.getAttribute('fill') as ST_PathFillMode;
  if (fill) {
    path.fill = fill;
  }

  path.extrusionOk = getAttrBoolean(element, 'extrusionOk', false);
  path.stroke = getAttrBoolean(element, 'stroke', true);

  const w = element.getAttribute('w');
  if (w) {
    path.w = parseInt(w, 10);
  }

  const h = element.getAttribute('h');
  if (h) {
    path.h = parseInt(h, 10);
  }

  return path;
}

export function parsePathLst(element: Element) {
  const pathLst: Path[] = [];
  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:path':
      case 'path':
        pathLst.push(parsePath(child));
        break;
    }
  }

  return pathLst;
}

export function parseShapeGuide(element: Element) {
  const gds: ShapeGuide[] = [];

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:gd':
      case 'gd':
        const name = child.getAttribute('name');
        const fmla = child.getAttribute('fmla');
        if (name && fmla) {
          const gd: ShapeGuide = {
            n: name,
            f: fmla
          };
          gds.push(gd);
        }

        break;
    }
  }

  return gds;
}

export function parseShape(element: Element) {
  const shape: Shape = {};

  for (const child of element.children) {
    const tagName = child.tagName;
    switch (tagName) {
      case 'a:avLst':
      case 'avLst':
        shape.avLst = parseShapeGuide(child);
        break;

      case 'a:gdLst':
      case 'gdLst':
        shape.gdLst = parseShapeGuide(child);
        break;

      case 'a:rect':
      case 'react':
        const rect: Rect = {
          b: child.getAttribute('b') || '',
          l: child.getAttribute('l') || '',
          r: child.getAttribute('r') || '',
          t: child.getAttribute('t') || ''
        };
        shape.rect = rect;
        break;

      case 'a:pathLst':
      case 'pathLst':
        shape.pathLst = parsePathLst(child);
        break;
    }
  }

  return shape;
}
