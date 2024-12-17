/**
 * @file Shape.tsx 图形组件
 *
 * @author allenve(yupeng12@baidu.com)
 * @created: 2024/12/12
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';

export type IShapeType =
  | 'square'
  | 'triangle'
  | 'right-triangle'
  | 'rectangle'
  | 'convex-arc-rectangle'
  | 'concave-arc-rectangle'
  | 'double-convex-arc-rectangle'
  | 'double-concave-arc-rectangle'
  | 'barrel-rectangle' // 桶形矩形
  | 'rhombus' // 菱形
  | 'parallelogram' // 平行四边形
  | 'rectangle-1' // 矩形类型1
  | 'rectangle-2' // 矩形类型2
  | 'rectangle-3' // 矩形类型1
  | 'rectangle-4' // 矩形类型2
  | 'pentagon' // 五边形
  | 'hexagon' // 六边形
  | 'octagon' // 八边形
  | 'hexagon-star' // 六角星
  | 'star'
  | 'heart'
  | 'circle'
  | 'arrow'
  | 'leaf';

export type IShapeCustomType = 'custom';

export interface IShapeProps extends ThemeProps {
  shapeType: IShapeType | IShapeCustomType;
  radius: number;
  width?: number;
  height?: number;
  color?: string;
  paths?: string[];
}

class SvgPathGenerator {
  constructor(readonly size: number) {}

  static getPath(
    type: IShapeType | IShapeCustomType,
    props: Pick<IShapeProps, 'radius' | 'paths'>
  ) {
    const {radius, paths} = props;
    const generator = new SvgPathGenerator(200);
    if (type === 'custom') {
      return this.getCustomPath(paths);
    }

    const genFun = generator.getGenerage(type);
    if (!genFun) {
      return [];
    }
    const radiusValue = Math.floor(Math.max(0, Math.min(10, radius))) || 0;
    return genFun(radiusValue * 10);
  }

  toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  getGenerage(type: IShapeType) {
    const ShapeConfig: {
      [key in IShapeType]: (radius: number) => string[];
    } = {
      'square': this.getSquarePath.bind(this),
      'triangle': this.getTrianglePath.bind(this),
      'right-triangle': this.getRightTrianglePath.bind(this),
      'rectangle': this.getRectanglePath.bind(this),
      'convex-arc-rectangle': this.getConvexArcRectangle.bind(this),
      'concave-arc-rectangle': this.getConcaveArcRectangle.bind(this),
      'double-convex-arc-rectangle': this.getDConvexArcRectangle.bind(this),
      'double-concave-arc-rectangle': this.getDConcaveArcRectangle.bind(this),
      'barrel-rectangle': this.getBarrelRectangle.bind(this),
      'rhombus': this.getRhombusPath.bind(this),
      'parallelogram': this.getParallelogramPath.bind(this),
      'rectangle-1': this.getRectangleType1Path.bind(this),
      'rectangle-2': this.getRectangleType2Path.bind(this),
      'rectangle-3': this.getRectangleType3Path.bind(this),
      'rectangle-4': this.getRectangleType4Path.bind(this),
      'pentagon': this.getPentagon.bind(this),
      'hexagon': this.getHexagon.bind(this),
      'octagon': this.getOctagonPath.bind(this),
      'hexagon-star': this.getHexagonStar.bind(this),
      'star': this.getStar.bind(this),
      'heart': this.getHeart.bind(this),
      'circle': this.getCirclePath.bind(this),
      'arrow': this.getArrowPath.bind(this),
      'leaf': this.getLeafPath.bind(this)
    };

    return ShapeConfig[type];
  }

  /**
   * 传入起点、终点和距离，返回直线上距离起点距离为distanc
   *
   * @param {[number, number]} [startX, startY]
   * @param {[number, number]} [endX, endY]
   * @param {number} distance
   * @returns
   * @memberof SvgPathGenerator
   */
  radiusPoint(
    [startX, startY]: [number, number],
    [endX, endY]: [number, number],
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

  radiusPath(
    radius: number,
    [endX1, endY1]: [number, number],
    [startX, startY]: [number, number],
    [endX2, endY2]: [number, number]
  ) {
    const [x1, y1] = this.radiusPoint([startX, startY], [endX1, endY1], radius);
    const [x2, y2] = this.radiusPoint([startX, startY], [endX2, endY2], radius);
    return [`${x1},${y1}`, `${startX},${startY} ${x2},${y2}`];
  }

  /**
   * 将 SVG 路径的每个角添加圆角
   *
   * @param {string[]} path
   * @param {number} radius
   * @returns
   * @memberof SvgPathGenerator
   */
  addRoundCornersToPath(points: Array<[number, number]>, radius: number) {
    const newPath = [];
    for (let i = 0; i < points.length; i++) {
      const nextItem = points[i + 1] || points[0];
      const preItem = points[i - 1] || points[points.length - 1];
      const [startX, startY] = points[i];
      const [endX1, endY1] = nextItem;
      const [endX2, endY2] = preItem;
      const [start, Q] = this.radiusPath(
        radius,
        [endX2, endY2],
        [startX, startY],
        [endX1, endY1]
      );

      if (i === 0) {
        newPath.push(`M${start}`, `Q${Q}`);
      } else {
        newPath.push(`L${start}`, `Q${Q}`);
      }
    }
    newPath.push('Z');

    return newPath;
  }

  // 正方形
  getSquarePath(radius: number) {
    const S = this.size;
    const ponits1: Array<[number, number]> = [
      [0, 0],
      [S, 0],
      [S, S],
      [0, S]
    ];
    const ponits2: Array<[number, number]> = [
      [S, S],
      [S, 0],
      [0, 0],
      [0, S]
    ];
    const path1 = this.addRoundCornersToPath(ponits1, radius);

    const path2 = this.addRoundCornersToPath(ponits2, radius);
    // 用两个path重叠 避免曲线的间隙
    return [path1, path2];
  }

  // 等边三角形
  getTrianglePath(radius: number) {
    const S = this.size;
    const height = Math.sin(this.toRadians(60)) * S;
    const x = ((2 - Math.sqrt(3)) / 4) * S - (Math.sqrt(3) / 8) * radius;

    const points1: Array<[number, number]> = [
      [0, height + x],
      [S / 2, x],
      [S, height + x]
    ];
    const points2: Array<[number, number]> = [
      [S / 2, x],
      [S, height + x],
      [0, height + x]
    ];

    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);

    return [path1, path2];
  }

  // 直角三角形
  getRightTrianglePath(radius: number) {
    const points1: Array<[number, number]> = [
      [0, 0],
      [0, 200],
      [200, 200]
    ];
    const points2: Array<[number, number]> = [
      [200, 200],
      [0, 200],
      [0, 0]
    ];
    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);
    return [path1, path2];
  }

  // 矩形
  getRectanglePath(radius: number) {
    const S = this.size;
    const points1: Array<[number, number]> = [
      [0, S / 4],
      [S, S / 4],
      [S, (S / 4) * 3],
      [0, (S / 4) * 3]
    ];
    const points2: Array<[number, number]> = [
      [S, (S / 4) * 3],
      [S, S / 4],
      [0, S / 4],
      [0, (S / 4) * 3]
    ];
    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);
    return [path1, path2];
  }

  // 凸弧矩形
  getConvexArcRectangle(radius: number) {
    const S = this.size;
    const w = S;
    const h = (S / 3) * 2;
    const x = (S - h) / 2 - radius / 4;
    const path1 = `
      M 0 ${h + x}
      L 0 ${radius + x}
      Q ${w / 2} ${x} ${w} ${radius + x}
      L ${w} ${h + x}
      Z
    `;
    const path2 = `
      M 0 ${radius + x}
      Q ${w / 2} ${x} ${w} ${radius + x}
      L ${w} ${h + x}
      L 0 ${h + x}
      Z
    `;

    return [path1, path2];
  }

  // 凹弧矩形
  getConcaveArcRectangle(radius: number) {
    const S = this.size;
    const w = S;
    const h = S / 2;
    const x = (S - h) / 2;
    const path1 = `
      M 0 ${h + x}
      L 0 ${x}
      Q ${w / 2} ${radius + x} ${w} ${x}
      L ${w} ${h + x}
      Z
    `;
    const path2 = `
      M 0 ${x}
      Q ${w / 2} ${radius + x} ${w} ${x}
      L ${w} ${h + x}
      L 0 ${h + x}
      Z
    `;

    return [path1, path2];
  }

  // 双凸弧矩形
  getDConvexArcRectangle(radius: number) {
    const S = this.size;
    const dx = radius;
    const path1 = `
      M 0 ${S / 4}
      Q ${S / 2} ${S / 4 - dx} ${S} ${S / 4}
      L ${S} ${(S / 4) * 3}
      Q ${S / 2} ${(S / 4) * 3 + dx} 0 ${(S / 4) * 3}
      Z
    `;
    const path2 = `
      M ${S} ${(S / 4) * 3}
      L ${S} ${S / 4}
      Q ${S / 2} ${S / 4 - dx} 0 ${S / 4}
      L 0 ${(S / 4) * 3}
      Q ${S / 2} ${(S / 4) * 3 + dx} ${S} ${(S / 4) * 3}
      Z
    `;
    return [path1, path2];
  }
  // 双凹弧矩形
  getDConcaveArcRectangle(radius: number) {
    const S = this.size;
    const dx = radius;
    const path1 = `
      M 0 ${S / 4}
      Q ${S / 2} ${S / 4 + dx} ${S} ${S / 4}
      L ${S} ${(S / 4) * 3}
      Q ${S / 2} ${(S / 4) * 3 - dx} 0 ${(S / 4) * 3}
      Z
    `;
    const path2 = `
      M ${S} ${(S / 4) * 3}
      L ${S} ${S / 4}
      Q ${S / 2} ${S / 4 + dx} 0 ${S / 4}
      L 0 ${(S / 4) * 3}
      Q ${S / 2} ${(S / 4) * 3 - dx} ${S} ${(S / 4) * 3}
      Z
    `;
    return [path1, path2];
  }

  // 桶形矩形
  getBarrelRectangle(radius: number) {
    const S = this.size;
    const R = radius;
    const dx = R / 4;
    const path1 = `
      M 0 ${S / 4 - dx}
      Q ${S / 2} ${S / 4 + R - dx} ${S} ${S / 4 - dx}
      L ${S} ${(S / 4) * 3 - dx}
      Q ${S / 2} ${(S / 4) * 3 + R - dx} 0 ${(S / 4) * 3 - dx}
      Z
    `;
    const path2 = `
      M 0 ${S / 4 - dx}
      Q ${S / 2} ${S / 4 + R - dx} ${S} ${S / 4 - dx}
      L ${S} ${(S / 4) * 3 - dx}
      Q ${S / 2} ${(S / 4) * 3 + R - dx} 0 ${(S / 4) * 3 - dx}
      Z
    `;
    return [path1, path2];
  }

  // 菱形
  getRhombusPath(radius: number) {
    const ponits1: Array<[number, number]> = [
      [100, 0],
      [200, 100],
      [100, 200],
      [0, 100]
    ];
    const ponits2: Array<[number, number]> = [
      [200, 100],
      [100, 0],
      [0, 100],
      [100, 200]
    ];
    const path1 = this.addRoundCornersToPath(ponits1, radius);
    const path2 = this.addRoundCornersToPath(ponits2, radius);

    return [path1, path2];
  }

  // 平行四边形
  getParallelogramPath(radius: number) {
    const points1: Array<[number, number]> = [
      [50, 0],
      [200, 0],
      [150, 200],
      [0, 200]
    ];
    const points2: Array<[number, number]> = [
      [150, 200],
      [200, 0],
      [50, 0],
      [0, 200]
    ];

    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);
    return [path1, path2];
  }

  // 矩形-类型1
  getRectangleType1Path() {
    const S = this.size;
    const x = 20;
    const points: Array<[number, number]> = [
      [x, 0],
      [S - x, 0],
      [S - x, x],
      [S, x],
      [S, S - x],
      [S - x, S - x],
      [S - x, S],
      [x, S],
      [x, S - x],
      [0, S - x],
      [0, x],
      [x, x]
    ];

    const path = this.addRoundCornersToPath(points, 0);
    return [path];
  }

  // 矩形-类型2
  getRectangleType2Path() {
    const path = [
      'M20,0',
      'L180,0',
      'Q180,20 200,20',
      'L200,180',
      'Q180,180 180,200',
      'L20,200',
      'Q20,180 0,180',
      'L0,20',
      'Q20,20 20,0',
      'Z'
    ];
    return [path];
  }

  // 矩形-类型3
  getRectangleType3Path(radius: number) {
    const S = this.size;
    const dx = 35;
    const points: Array<[number, number]> = [
      [0, 0],
      [S - dx, 0],
      [S, S / 2],
      [S - dx, S],
      [0, S],
      [dx, S / 2]
    ];
    const path = this.addRoundCornersToPath(points, radius);
    return [path];
  }

  // 矩形-类型4
  getRectangleType4Path(radius: number) {
    const S = this.size;
    const dx = 35;
    const points: Array<[number, number]> = [
      [0, 0],
      [S - dx, 0],
      [S, S / 2],
      [S - dx, S],
      [0, S]
    ];
    const path = this.addRoundCornersToPath(points, radius);
    return [path];
  }

  // 星形
  getStar(radius: number) {
    const points: Array<[number, number]> = [
      [100, 11.1297757],
      [129.05723, 70.0061542],
      [194.031171, 79.4474205],
      [147.015586, 125.27629],
      [158.11446, 189.987692],
      [100, 159.435112],
      [41.8855403, 189.987692],
      [52.9844145, 125.27629],
      [5.96882894, 79.4474205],
      [70.9427701, 70.0061542]
    ];

    const path = this.addRoundCornersToPath(points, radius);
    return [path];
  }

  // 心形
  getHeart() {
    const path = `
      M143.526375,12
      C132.21418,12 124.346417,16.1423074 111.598905,27.0093876
      C111.007635,27.5125184 107.668026,30.3835001 106.701139,31.2037806
      C103.410893,33.9868624 98.5891073,33.9868624 95.2988609,31.2037806
      C94.331974,30.3807731 90.9923649,27.5125184 90.4010952,27.0093876
      C77.653583,16.1423074 69.78582,12 58.4736246,12
      C24.0713382,12 2,39.4823959 2,79.1438299
      C2,109.386491 32.9900653,146.921686 95.9859458,190.440184
      C99.0044944,192.519939 102.995506,192.519939 106.014054,190.440184
      C169.009935,146.924413 200,109.386491 200,79.1438299
      C200,39.4823959 177.928662,12 143.526375,12
    Z`;
    return [path];
  }

  // 五边形
  getPentagon(radius: number) {
    const S = this.size;
    const a = S / (Math.tan(this.toRadians(54)) * 2);
    const b = S / 2;
    const c = Math.sqrt(a * a + b * b);
    const x1 = Math.sin(this.toRadians(18)) * c;
    const x2 = Math.cos(this.toRadians(18)) * c;
    const dx = (S - (a + x2)) / 2;
    const points1: Array<[number, number]> = [
      [S, a + dx],
      [S - x1, a + x2 + dx],
      [x1, a + x2 + dx],
      [0, a + dx],
      [b, dx]
    ];
    const points2: Array<[number, number]> = [
      [x1, a + x2 + dx],
      [S - x1, a + x2 + dx],
      [S, a + dx],
      [b, dx],
      [0, a + dx]
    ];
    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);

    return [path1, path2];
  }

  // 六边形
  getHexagon(radius: number) {
    const points1: Array<[number, number]> = [
      [100, 0.577350269],
      [186.10254, 50.2886751],
      [186.10254, 149.711325],
      [100, 199.42265],
      [13.8974596, 149.711325],
      [13.8974596, 50.2886751]
    ];
    const points2: Array<[number, number]> = [
      [100, 199.42265],
      [186.10254, 149.711325],
      [186.10254, 50.2886751],
      [100, 0.577350269],
      [13.8974596, 50.2886751],
      [13.8974596, 149.711325]
    ];

    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);
    return [path1, path2];
  }

  // 正八边形
  getOctagonPath(radius: number) {
    const S = this.size;
    const x = S / (2 + Math.sqrt(2));
    const points1: Array<[number, number]> = [
      [x, 0],
      [S - x, 0],
      [S, x],
      [S, S - x],
      [S - x, S],
      [x, S],
      [0, S - x],
      [0, x]
    ];
    const points2: Array<[number, number]> = [
      [S - x, S],
      [S, S - x],
      [S, x],
      [S - x, 0],
      [x, 0],
      [0, x],
      [0, S - x],
      [x, S]
    ];
    const path1 = this.addRoundCornersToPath(points1, radius);
    const path2 = this.addRoundCornersToPath(points2, radius);
    return [path1, path2];
  }

  // 六角星
  getHexagonStar(radius: number) {
    const points1: Array<[number, number]> = [
      [149.380343, 14.4707367],
      [142.764632, 75.3098284],
      [198.760686, 100],
      [142.764632, 124.690172],
      [149.380343, 185.529263],
      [100, 149.380343],
      [50.6196568, 185.529263],
      [57.2353684, 124.690172],
      [1.23931367, 100],
      [57.2353684, 75.3098284],
      [50.6196568, 14.4707367],
      [100, 50.6196568]
    ];

    const path1 = this.addRoundCornersToPath(points1, radius);

    return [path1];
  }

  // 圆
  getCirclePath() {
    const path = `
      M 100 0
      A 100 100 0 0 1 100 200
      A 100 100 0 0 1 100 0
      Z
    `;
    return [path];
  }

  // 箭头
  getArrowPath(radius: number) {
    const points: Array<[number, number]> = [
      [0, 75],
      [110, 75],
      [110, 30],
      [200, 100],
      [110, 170],
      [110, 125],
      [0, 125]
    ];

    return [this.addRoundCornersToPath(points, radius)];
  }

  // 树叶形状
  getLeafPath() {
    const path = `
      M 0 140
      Q 0 60 80 60
      L 200 60
      Q 200 140 120 140
      Z
    `;
    return [path];
  }

  static getCustomPath(paths?: string[]) {
    return paths || [];
  }
}

const Shape: React.FC<IShapeProps> = props => {
  const BASE_SIZE = 200;
  const {
    classnames: cx,
    className,
    shapeType,
    color,
    width = BASE_SIZE,
    height = BASE_SIZE
  } = props;
  const paths = SvgPathGenerator.getPath(shapeType, props);
  const getStyle = React.useCallback(
    () => [
      {
        width: width + 'px',
        height: height + 'px'
      },
      {
        transform: `scale(${width / BASE_SIZE}, ${height / BASE_SIZE})`
      }
    ],
    [width, height]
  );

  return (
    <div className={cx('Shape', className)} style={getStyle()[0]}>
      <svg
        className={cx('Shape-svg')}
        width={BASE_SIZE}
        height={BASE_SIZE}
        style={getStyle()[1]}
        fill={color ? color : 'currentColor'}
        viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`}
      >
        {paths.map((path, index) => (
          <path key={index} d={path} />
        ))}
      </svg>
    </div>
  );
};

export default themeable(Shape);
