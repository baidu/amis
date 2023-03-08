import type {Option} from 'amis-core';

export function filterVisibleOption(option: Option) {
  return !option.hidden && option.visible !== false;
}


export function filterVisibleOptions(options: Option[] = []) {
  if (!Array.isArray(options)) {
    return options;
  }
  return options.filter(filterVisibleOption);
}
