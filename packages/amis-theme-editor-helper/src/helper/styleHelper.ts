import type {PlainObject} from './declares';

const styleMap: PlainObject = {
  border: ['border-top', 'border-right', 'border-left', 'border-bottom']
};

export function styleBorder(style: CSSStyleDeclaration) {
  const styleList = styleMap.border;
  const data: PlainObject = {};
  for (const item of styleList) {
    const values = style.getPropertyValue(item);
    const [border, position] = item.split('-');
    const [borderWidth, borderStyle, ...borderColor] = values.split(' ');
    data[`${position}-${border}-width`] = borderWidth;
    data[`${position}-${border}-style`] = borderStyle;
    data[`${position}-${border}-color`] = borderColor.join('');
  }
  return data;
}

export function styleBackground(style: CSSStyleDeclaration) {
  const image = style.getPropertyPriority('background-image');
  let data = image;
  if (image === 'none') {
    data = style.getPropertyValue('background-color');
  }
  return data;
}

export function getStyleById(id: string, name?: string) {
  if (!name) {
    return null;
  }
  let dom: any = document.getElementsByName(id);
  if (dom.length === 0) {
    return null;
  }
  dom = dom[0];

  const list = name.split('.');
  name = list[list.length - 1];
  const [styleName] = name.split(':');
  const style = getComputedStyle(dom);
  let data: any = {};
  switch (styleName) {
    case 'border':
      data = styleBorder(style);
      break;
    case 'color':
      data = style.getPropertyValue('color');
      break;
    case 'background':
      data = styleBackground(style);
      break;
  }
  return data;
}

export function getCssVarByName(
  name: string,
  className: string = '.ThemeEditor-body-content-item-content'
): string {
  name = name?.replace('var', '').replace('(', '').replace(')', '');
  try {
    const res = getComputedStyle(
      document.querySelector(className)!
    ).getPropertyValue(name);
    return res;
  } catch (error) {
    return '';
  }
}
