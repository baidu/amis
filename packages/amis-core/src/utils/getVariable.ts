import {keyToPath} from './keyToPath';

export function getVariable(
  data: {[propName: string]: any},
  key: string | undefined,
  canAccessSuper: boolean = true
): any {
  if (!data || !key) {
    return undefined;
  } else if (canAccessSuper ? key in data : data.hasOwnProperty(key)) {
    return data[key];
  }

  return keyToPath(key).reduce(
    (obj, key) =>
      obj &&
      typeof obj === 'object' &&
      (canAccessSuper ? key in obj : obj.hasOwnProperty(key))
        ? obj[key]
        : undefined,
    data
  );
}
