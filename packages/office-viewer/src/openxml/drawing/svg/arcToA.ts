/**
 * 将 arc 定义转成 SVG PATH 里的 A 命令
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
  let swAngR = radians(swAng);
  let endR = radians(stAng + swAng);

  if (floatEqual(swAng, 60000 * 360)) {
    // 如果是圆会变成点，所以减少一下避免这种情况
    endR = endR - 0.0001;
  }

  const end = getEndPoint(wR, hR, startR, endR, 0, preX, preY);

  // 是否是大弧
  const largeArcFlag = Math.abs(swAngR) > Math.PI ? 1 : 0;
  // 是否是顺时针
  const sweepFlag = swAng > 0 ? 1 : 0;

  const path = `A ${wR} ${hR} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}`;

  return {
    path,
    end
  };
}

/**
 * 简单实现的矩阵相乘，只支持一种输入
 */
function matrixMul(first: number[][], second: number[]) {
  return [
    first[0][0] * second[0] + first[0][1] * second[1],
    first[1][0] * second[0] + first[1][1] * second[1]
  ];
}

/**
 * 算出结束点位置，公式来自
 * https://www.cnblogs.com/ryzen/p/15191386.html
 * https://wiki.documentfoundation.org/Development/Improve_handles_of_DrawingML_shapes
 *
 * @param rx 半长轴半径
 * @param ry 半短轴半径
 * @param stAng 起始角度
 * @param swAng 旋转角度
 * @param rotate 旋转
 * @param x 起始点 x 坐标
 * @param y 起始点 y 坐标
 * @returns 结束点位置
 */
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
