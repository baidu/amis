export function isPureVariable(path?: any): path is string {
  return typeof path === 'string'
    ? /^\$(?:((?:\w+\:)?[a-z0-9_.][a-z0-9_.\[\]]*)|{[^}{]+})$/i.test(path)
    : false;
}
