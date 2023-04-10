import {ArcTo, LnTo, MoveTo, QuadBezTo, ShapeDefine} from '../Path';
import arcToPathA from './arcToA';

export type Var = Record<string, number>;

function getVal(name: string, vars: Var): number {
  if (name in vars) {
    return vars[name];
  } else {
    const val = parseInt(name, 10);
    if (isNaN(val)) {
      console.warn('var not found', name);
      return 0;
    } else {
      return val;
    }
  }
}

type Point = {
  x: number;
  y: number;
};

/**
 *
 * 转成 svg path 里的定义
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
 */
export function generateDefines(defines: ShapeDefine[], vars: Var) {
  const paths: string[] = [];
  const prevPoint: Point[] = [];
  for (const def of defines) {
    switch (def.type) {
      case 'moveTo': {
        const pt = (def as MoveTo).pt;
        const x = getVal(pt.x, vars);
        const y = getVal(pt.y, vars);
        paths.push(`M ${x} ${y}`);
        prevPoint.push({x, y});
        break;
      }

      case 'lnTo': {
        const pt = (def as LnTo).pt;
        const x = getVal(pt.x, vars);
        const y = getVal(pt.y, vars);
        paths.push(`L ${x} ${y}`);
        prevPoint.push({x, y});
        break;
      }

      case 'arcTo': {
        const arc = def as ArcTo;
        const wR = getVal(arc.wR, vars);
        const hR = getVal(arc.hR, vars);
        const stAng = getVal(arc.stAng, vars);
        const swAng = getVal(arc.swAng, vars);
        let prev = {
          x: 0,
          y: 0
        };
        if (prevPoint.length > 0) {
          prev = prevPoint[prevPoint.length - 1];
        }

        const aPath = arcToPathA(wR, hR, stAng, swAng, prev.x, prev.y);
        paths.push(aPath.path);
        prevPoint.push({x: aPath.end.x, y: aPath.end.y});
        break;
      }

      case 'quadBezTo': {
        const quadBezTo = def as QuadBezTo;
        if (quadBezTo.pts.length >= 2) {
          const pt1 = quadBezTo.pts[0];
          const pt2 = quadBezTo.pts[1];
          const x1 = getVal(pt1.x, vars);
          const y1 = getVal(pt1.y, vars);
          const x2 = getVal(pt2.x, vars);
          const y2 = getVal(pt2.y, vars);
          paths.push(`Q ${x1},${y1} ${x2},${y2}`);
          prevPoint.push({x: x2, y: y2});
        } else {
          console.warn('quadBezTo pts length must large than 2', def);
        }
        break;
      }

      case 'cubicBezTo': {
        const cubicBezTo = def as QuadBezTo;
        if (cubicBezTo.pts.length === 3) {
          const pt1 = cubicBezTo.pts[0];
          const pt2 = cubicBezTo.pts[1];
          const pt3 = cubicBezTo.pts[2];
          const x1 = getVal(pt1.x, vars);
          const y1 = getVal(pt1.y, vars);
          const x2 = getVal(pt2.x, vars);
          const y2 = getVal(pt2.y, vars);
          const x3 = getVal(pt3.x, vars);
          const y3 = getVal(pt3.y, vars);
          paths.push(`C ${x1},${y1} ${x2},${y2} ${x3},${y3}`);
          prevPoint.push({x: x3, y: y3});
        } else {
          console.warn('cubicBezTo pts length must be 3', def);
        }
        break;
      }

      case 'close':
        paths.push('Z');
        break;

      default:
        break;
    }
  }
  return paths.join(' ');
}
