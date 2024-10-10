/**
 * 来自 https://github.com/jednano/parse-css-sides/blob/master/src/index.ts
 */

export interface ISides {
  top: string;
  right: string;
  bottom: string;
  left: string;
  important?: boolean;
}

export default function parseSides(value: string): ISides {
  const sides = value.split(/\s+/);
  const pos = sides.lastIndexOf('!important');
  const important = pos !== -1;
  if (important) {
    sides.splice(pos, 1);
  }

  const numberOfSides = sides.length;
  if (numberOfSides < 1 || numberOfSides > 4) {
    throw new Error(`Cannot parse ${numberOfSides} sides`);
  }

  const [first, ...rest] = sides;
  return createSides(first, ...rest);

  function createSides(
    top: string,
    right: string = top,
    bottom: string = top,
    left: string = right
  ) {
    return {
      bottom,
      left,
      right,
      top,
      ...(important ? {important} : {})
    };
  }
}
