/**
 * 计算公式 20.1.9.11
 */

const angleFactor = (1 / 60000 / 180) * Math.PI;

export const formulas = {
  '*/': function (x: number, y: number, z: number) {
    return (x * y) / z;
  },
  '+-': function (x: number, y: number, z: number) {
    return x + y - z;
  },
  '+/': function (x: number, y: number, z: number) {
    return (x + y) / z;
  },
  '?:': function (x: number, y: number, z: number) {
    return x > 0 ? y : z;
  },
  'abs': function (x: number) {
    return Math.abs(x);
  },
  'at2': function (x: number, y: number) {
    // 转回角度，因为后续的计算是基于角度的
    return (Math.atan2(y, x) * 180 * 60000) / Math.PI;
  },
  'cat2': function (x: number, y: number, z: number) {
    return x * Math.cos(Math.atan2(z, y));
  },
  'cos': function (x: number, y: number) {
    return x * Math.cos(y * angleFactor);
  },
  'max': function (x: number, y: number) {
    return Math.max(x, y);
  },
  'min': function (x: number, y: number) {
    return Math.min(x, y);
  },
  'mod': function (x: number, y: number, z: number) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  },
  'pin': function (x: number, y: number, z: number) {
    return y < x ? x : y > z ? z : y;
  },
  'sat2': function (x: number, y: number, z: number) {
    return x * Math.sin(Math.atan2(z, y));
  },
  'sin': function (x: number, y: number) {
    return x * Math.sin(y * angleFactor);
  },
  'sqrt': function (x: number) {
    return Math.sqrt(x);
  },
  'tan': function (x: number, y: number) {
    return x * Math.tan(y * angleFactor);
  },
  'val': function (a: string) {
    const parse = parseInt(a, 10);
    if (isNaN(parse)) {
      return parse;
    }
    return parse;
  }
};

/**
 * 执行公式计算并返回结果
 * @param fmla 公式
 * @param vars 变量值
 * @returns
 */
export function evalFmla(
  name: string,
  fmla: string,
  vars: Record<string, number>
): number {
  const fmlaArr = fmla.split(/[ ]+/);
  if (fmlaArr.length <= 1) {
    console.warn('fmla format error', fmla);
  }
  const fmlaName = fmlaArr[0];
  const fmlaArgs = fmlaArr.slice(1);
  // 这里要求 gd 定义必须顺序，不然就找不到之前的值了
  const fmlaArgsNum = fmlaArgs.map(arg => {
    if (arg in vars) {
      return vars[arg];
    }
    const parse = parseInt(arg, 10);
    if (isNaN(parse)) {
      console.warn('fmla arg error', arg, fmla);
      return 0;
    } else {
      return parse;
    }
  });
  if (fmlaName in formulas) {
    const val = formulas[fmlaName as keyof typeof formulas].apply(
      null,
      fmlaArgsNum
    );
    if (isNaN(val)) {
      console.warn('fmla eval error', fmla, name);
      return 0;
    } else {
      vars[name] = val;
    }
  }
  return 0;
}
