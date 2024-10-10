/**
 * 判断两个对象是否相等
 */

export function objectEqual(
  obj1: Record<string, any>,
  obj2: Record<string, any>
) {
  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
