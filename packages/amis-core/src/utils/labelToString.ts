import isPlainObject from 'lodash/isPlainObject';

export function labelToString(label: any): string {
  const type = typeof label;
  if (type === 'undefined' || label === null) {
    // render placeholder
    return '-';
  }
  if (type === 'string') {
    return label;
  } else if (type === 'number') {
    return `${label}`;
  } else if (type === 'boolean') {
    return String(label);
  }

  if (isPlainObject(label)) {
    for (let key of ['__title', 'label', Object.keys(label)[0]]) {
      if (typeof label[key] === 'string') {
        return label[key];
      }
    }
  }

  return 'invalid label';
}
