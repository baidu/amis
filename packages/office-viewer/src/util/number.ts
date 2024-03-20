/**
 * 一些数值比较的工具函数
 */

export function eq(x: number, y: number) {
  return Math.abs(x - y) < Number.EPSILON;
}

export function lt(x: number, y: number) {
  return x - y < Number.EPSILON && Math.abs(x - y) > Number.EPSILON;
}

export function lte(x: number, y: number) {
  return x - y < Number.EPSILON;
}

export function gt(x: number, y: number) {
  return y - x < Number.EPSILON && Math.abs(x - y) > Number.EPSILON;
}

export function gte(x: number, y: number) {
  return y - x < Number.EPSILON;
}

export function getPercent(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}
