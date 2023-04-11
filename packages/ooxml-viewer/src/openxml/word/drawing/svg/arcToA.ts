/**
 * 将 arc 定义转成 SVG PATH 里的 A 命令
 * 参考了 prst-shape-transform 里的实现，去掉了第三方依赖
 * https://github.com/xenonflash/prst-shape-transform
 */

type Matrix = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

type Point = {
  x: number;
  y: number;
};

export function translate(tx: number, ty = 0) {
  return {
    a: 1,
    c: 0,
    e: tx,
    b: 0,
    d: 1,
    f: ty
  };
}

export function applyToPoint(matrix: Matrix, point: Point) {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f
  };
}

/**
 * 将 arc 转成 A 指令，但目前看来不太正确，比如 curvedRightArrow 的显示就不对
 */
export default function arcToPathA(
  wR: number,
  hR: number,
  stAng: number,
  swAng: number,
  preX: number,
  preY: number
) {
  // 1. 计算 椭圆线段 开始的 x1 y1 和结束的 x2 y2
  let {start, end} = genArcPoint(wR, hR, stAng, swAng);
  // 2. 计算 x1 y1 处切线角度
  // 3. 根据切线角度对椭圆以椭圆中心为原点进行 旋转变换(根据选取的线段角度判断 旋转方向)
  // 4. 根据旋转后的 x1 和 y1，对椭圆进行平移变换，使 x1 y1 和 起点重合（起点为上一个指令的结束点 或者 0 0
  const matrix = translate(preX - start.x, preY - start.y);
  end = applyToPoint(matrix, end);
  start = applyToPoint(matrix, start);
  // 5. 得到平移变换后 x2 y2 的坐标，赋值给endX， endY
  let path = '';
  if (swAng == 60000 * 360) {
    let {end: halfEnd} = genArcPoint(wR, hR, stAng, 60000 * 180);
    halfEnd = applyToPoint(matrix, halfEnd);
    path = `A ${wR} ${hR} 0 1 0 ${halfEnd.x.toFixed(2)},${halfEnd.y.toFixed(
      2
    )}A ${wR} ${hR} 0 0 0 ${start.x.toFixed(2)},${start.y.toFixed(2)}`;
  } else if (swAng > 60000 * 180) {
    path = `A ${wR} ${hR} 0 1 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
  } else if (swAng < 0) {
    path = `A ${wR} ${hR} 0 0 0 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
  } else {
    path = `A ${wR} ${hR} 0 0 1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
  }
  return {
    path,
    start,
    end
  };
}

function genArcPoint(wr: number, hr: number, stAng: number, swAng: number) {
  const r = (deg: number) => Math.PI * (deg / 60000 / 180);
  let start = stAng;
  let end = start + swAng;
  let startR = r(start);
  let endR = r(end);
  return {
    start: {
      x: wr * Math.cos(startR),
      y: hr * Math.sin(startR)
    },
    end: {
      x: wr * Math.cos(endR),
      y: hr * Math.sin(endR)
    }
  };
}
