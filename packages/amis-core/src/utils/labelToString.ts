import isPlainObject from 'lodash/isPlainObject';

export function labelToString(label: any): string {
  const type = typeof label;
  if (type === 'string') {
    return label;
  } else if (type === 'number') {
    return `${label}`;
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
