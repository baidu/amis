// 计算向量的模长
export function vectorLength(v: number[]): number {
  return Math.sqrt(v.reduce((sum, cur) => sum + cur ** 2, 0));
}

// 计算向量的点积
export function dotProduct(v1: number[], v2: number[]): number {
  return v1.reduce((sum, cur, index) => sum + cur * v2[index], 0);
}

// 计算向量的夹角
export function vectorAngle(v1: number[], v2: number[]): number {
  return Math.acos(dotProduct(v1, v2) / (vectorLength(v1) * vectorLength(v2)));
}

// 通过直角边和夹角计算另一直角边长度
export function computeSideLength(side: number, angle: number): number {
  return side / Math.tan(angle);
}

/**
 * 传入起点、终点和距离，返回直线上距离起点距离为distance
 *
 * @param {[number, number]} [startX, startY]
 * @param {[number, number]} [endX, endY]
 * @param {number} distance
 * @returns
 * @memberof SvgPathGenerator
 */
export function radiusPoint(
  [startX, startY]: number[],
  [endX, endY]: number[],
  distance: number
) {
  // 计算终点与起点的直线距离
  const dx = endX - startX;
  const dy = endY - startY;
  const totalDistance = Math.sqrt(dx * dx + dy * dy);

  // 如果距离大于总距离的一半，则取一半
  if (distance > totalDistance / 2) {
    distance = totalDistance / 2;
  }

  // 计算比例
  const ratio = distance / totalDistance;

  // 计算新点
  const x = startX + dx * ratio;
  const y = startY + dy * ratio;

  return [x, y];
}

// 传入2个向量和圆角半径，返回圆角弧线的起始点坐标
export function radiusStartEndPoint(
  v1: number[],
  v2: number[],
  radius: number
) {
  // 计算向量夹角
  const angle = vectorAngle(
    [v1[2] - v1[0], v1[3] - v1[1]],
    [v2[2] - v1[0], v2[3] - v1[1]]
  );

  // 计算3点是顺时针还是逆时针
  const sweepFlag =
    (v1[2] - v1[0]) * (v2[3] - v1[1]) - (v1[3] - v1[1]) * (v2[2] - v1[0]) < 0
      ? 1
      : 0;

  // 计算短边一半的长度
  const maxLength = Math.min(
    vectorLength([v1[2] - v1[0], v1[3] - v1[1]]) / 2,
    vectorLength([v2[2] - v1[0], v2[3] - v1[1]]) / 2
  );

  // 计算radius的最大值
  const maxRadius = Math.min(radius, maxLength * Math.tan(angle / 2));

  // 直角边的长度
  const distance = computeSideLength(maxRadius, angle / 2);

  const [startX, startY] = radiusPoint(
    [v1[0], v1[1]],
    [v1[2], v1[3]],
    distance
  );
  const [endX, endY] = radiusPoint([v2[0], v2[1]], [v2[2], v2[3]], distance);

  return {
    start: [startX, startY],
    end: [endX, endY],
    radius: maxRadius,
    sweepFlag
  };
}
