import isPlainObject from 'lodash/isPlainObject';

export function labelToString(label: any): string {
  if (typeof label === 'string') {
    return label;
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
