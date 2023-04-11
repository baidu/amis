/**
 * 将 arc 定义转成 SVG PATH 里的 A 命令
 *
 * 参考了下面文档
 * https://github.com/xenonflash/prst-shape-transform
 * https://www.cnblogs.com/ryzen/p/15191386.html
 * https://wiki.documentfoundation.org/Development/Improve_handles_of_DrawingML_shapes
 */

function floatEqual(a: number, b: number) {
  if (a === b) {
    return true;
  }

  const diff = Math.abs(a - b);

  if (diff < Number.EPSILON) {
    return true;
  }

  return diff <= Number.EPSILON * Math.min(Math.abs(a), Math.abs(b));
}

/**
 * 计算角度
 */
const radians = (deg: number) => Math.PI * (deg / 60000 / 180);

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
  let startR = radians(stAng);
  let endR = radians(stAng + swAng);

  const end = getEndPoint(wR, hR, startR, endR, 0, preX, preY);

  const largeArcFlag = Math.abs(swAng) > 60000 * 180 ? 1 : 0;
  const sweepFlag = swAng > 0 ? 1 : 0;
  if (floatEqual(swAng, 60000 * 360)) {
    // let {end: halfEnd} = genArcPoint(wR, hR, stAng, 60000 * 180);
    // halfEnd = applyToPoint(matrix, halfEnd);
    // path = `A ${wR} ${hR} 0 1 0 ${halfEnd.x.toFixed(2)},${halfEnd.y.toFixed(
    //   2
    // )}A ${wR} ${hR} 0 0 0 ${start.x.toFixed(2)},${start.y.toFixed(2)}`;
  }

  const path = `A ${wR} ${hR} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}`;

  return {
    path,
    end
  };
}

/**
 * 简单实现的矩阵相乘，只支持 2x2
 */
function matrixMul(first: number[][], second: number[]) {
  return [
    first[0][0] * second[0] + first[0][1] * second[1],
    first[1][0] * second[0] + first[1][1] * second[1]
  ];
}

function getEndPoint(
  rx: number,
  ry: number,
  stAng: number,
  swAng: number,
  rotate: number,
  x: number,
  y: number
) {
  let startR = stAng;
  let endR = swAng;

  // 起始节点坐标
  const matrixX1Y1 = [x, y];
  const matrix1 = [
    [Math.cos(rotate), -Math.sin(rotate)],
    [Math.sin(rotate), Math.cos(rotate)]
  ];

  const matrix2 = [rx * Math.cos(startR), ry * Math.sin(startR)];

  // 公式第二部分
  const secondPart = matrixMul(matrix1, matrix2);

  const matrixCxCy = [
    matrixX1Y1[0] - secondPart[0],
    matrixX1Y1[1] - secondPart[1]
  ];

  const matrix3 = [rx * Math.cos(endR), ry * Math.sin(endR)];

  const firstPart = matrixMul(matrix1, matrix3);

  const result = [matrixCxCy[0] + firstPart[0], matrixCxCy[1] + firstPart[1]];

  return {
    x: result[0],
    y: result[1]
  };
}
