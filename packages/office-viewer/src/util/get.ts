/**
 * https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
 */

export const get = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res: any, key: string) =>
          res !== null && res !== undefined ? res[key] : res,
        obj
      );
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};
