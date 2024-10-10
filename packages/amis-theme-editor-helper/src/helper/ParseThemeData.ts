import type {PlainObject, ThemeDefinition} from './declares';

export class ParseThemeData {
  style: string[] = [];
  class: string[] = [];
  data: ThemeDefinition;
  scope: string[];
  theme: string;
  constructor(data: ThemeDefinition, scope: string[]) {
    this.data = data;
    this.scope = scope;
    this.theme = data.config.key;
  }

  generator() {
    const {global, component} = this.data;
    const {colors, fonts, borders, sizes, shadows} = global;
    this.parseColor(colors);
    this.parseFont(fonts);
    this.parseGlobalCommon(borders);
    this.parseGlobalCommon(sizes);
    this.parseSizesBase(sizes);
    this.parseShadows(shadows);
    for (let key in component) {
      if (key === 'button1') {
        this.parseButton(component['button1']);
      } else if (key === 'inputRating') {
        this.parseInputRating(component['inputRating']);
      } else {
        this.parseComponentCommon(component[key]);
      }
    }
  }

  getStyle() {
    return this.getCssVariable() + this.getCustomClass();
  }

  getCssVariable() {
    return `${this.scope.join(', ')}{${this.style.join(';')};}\n`;
  }

  getCustomClass() {
    return `${this.class.join('\n')}`;
  }

  /**
   * 获取自定义样式，需要使用less或scss编译后使用
   */
  getCustomStyle() {
    const customStyle = this.data?.customStyle?.style || '';
    return customStyle;
  }

  /**
   * 装载css变量
   */
  cssFormat(key: string, value: string) {
    if (!value) {
      return;
    }
    this.style.push(`${key}: ${value}`);
  }

  /**
   * 装载class
   */
  classFormat(classname: string, value: string) {
    // 自定义的不需要在命名空间下了
    this.class.push(`${classname}{${value}}`);
  }

  /**
   * 解析全局颜色
   */
  parseColor(colors: any) {
    this.cssFormat('--colors-neutral-fill-none', 'translate');
    for (let key in colors) {
      const color = colors[key];
      if (key !== 'brand') {
        color.body.forEach((item: any) => {
          const prefix = item.token;
          for (let colorKey in item.body) {
            if (colorKey === 'colors') {
              item.body.colors.forEach((color: any) => {
                this.cssFormat(color.token, color.color);
              });
            } else if (!Array.isArray(item.body[colorKey])) {
              this.cssFormat(prefix + colorKey, item.body[colorKey]);
            }
          }
        });
      } else {
        const prefix = color.token;
        for (let colorKey in color.body) {
          if (colorKey === 'colors') {
            color.body.colors.forEach((color: any) => {
              this.cssFormat(color.token, color.color);
            });
          } else if (!Array.isArray(color.body[colorKey])) {
            this.cssFormat(prefix + colorKey, color.body[colorKey]);
          }
        }
      }
    }
  }
  /**
   * 解析全局字体
   */
  parseFont(fonts: any) {
    for (let key in fonts) {
      const font = fonts[key];
      if (key === 'base') {
        let family = '';
        font.body.forEach((item: any, index: number) => {
          family += item.value || '';
          if (index !== font.body.length - 1) {
            family += ', ';
          }
        });
        this.cssFormat(font.token, family);
      } else {
        font.body.forEach((item: any) => {
          this.cssFormat(item.token, item.value);
        });
      }
    }
  }
  // 解析基础尺寸
  parseSizesBase(item: any) {
    const reg = /\d+(\.\d+)?/;
    const unitReg = /[^\d\.]+/;
    const start = parseFloat(item.size.start.match(reg)[0]);
    const base = item.size.base;
    const unit = item.size.start.match(unitReg)[0];
    for (let i = 0; i < 50; i++) {
      this.cssFormat(`--sizes-base-${i + 1}`, start + i * base + unit);
    }
  }
  /**
   * 解析全局样式通用
   */
  parseGlobalCommon(items: any) {
    for (let key in items) {
      const item = items[key];
      item.body.forEach((i: any) => {
        this.cssFormat(i.token, i.value);
      });
    }
  }
  /**
   * 解析阴影样式
   */
  parseShadows(items: any) {
    const item = items.shadow;
    item.body.forEach((i: any) => {
      const shadowStyle = i.value.map(
        (shadow: any) =>
          `${shadow.inset ? 'inset' : ''} ${shadow.x} ${shadow.y} ${
            shadow.blur
          } ${shadow.spread} ${shadow.color}`
      );
      this.cssFormat(i.token, shadowStyle.join(', '));
    });
  }

  /**
   * 设置组件样式
   */
  setComponentStyle(key: string, token: string, value: string | PlainObject) {
    if (typeof value === 'string') {
      this.cssFormat(token + key, value);
    } else {
      if (key.indexOf('padding-and-margin') > -1) {
        for (let k in value) {
          this.cssFormat(
            token + key.replace('padding-and-margin', '') + k,
            value[k]
          );
        }
      } else if (key.indexOf('size') > -1) {
        for (let k in value) {
          this.cssFormat(token + key.replace('size', '') + k, value[k]);
        }
      } else if (key.indexOf('font') > -1) {
        for (let k in value) {
          this.cssFormat(token + key.replace('font', '') + k, value[k]);
        }
      } else if (key.indexOf('border') > -1) {
        for (let k in value) {
          this.cssFormat(token + key.replace('border', '') + k, value[k]);
        }
      } else {
        for (let k in value) {
          this.cssFormat(`${token}${k}`, value[k]);
        }
      }
    }
  }
  /**
   * 解析Button
   */
  parseButton(button: any) {
    const {type, size} = button;
    const setButtonCssValue = (token: string, body: any) => {
      for (let key in body) {
        const data = body[key];
        this.setComponentStyle(key, token, data);
      }
    };
    for (let item of type) {
      ['default', 'hover', 'active', 'disabled'].forEach(state => {
        setButtonCssValue(item[state].token, item[state].body);
      });
      if (item.custom) {
        const fontType = item.type;
        const style = (state: string) =>
          [
            `color: var(--button-${fontType}-${state}-font-color)`,
            `background: var(--button-${fontType}-${state}-bg-color)`,
            `box-shadow: var(--button-${fontType}-${state}-shadow)`,
            `border-width: var(--button-${fontType}-${state}-top-border-width) var(--button-${fontType}-${state}-right-border-width) var(--button-${fontType}-${state}-bottom-border-width) var(--button-${fontType}-${state}-left-border-width)`,
            `border-color: var(--button-${fontType}-${state}-top-border-color) var(--button-${fontType}-${state}-right-border-color) var(--button-${fontType}-${state}-bottom-border-color) var(--button-${fontType}-${state}-left-border-color)`,
            `border-style: var(--button-${fontType}-${state}-top-border-style) var(--button-${fontType}-${state}-right-border-style) var(--button-${fontType}-${state}-bottom-border-style) var(--button-${fontType}-${state}-left-border-style)`
          ].join(';');

        this.classFormat(`.cxd-Button--${fontType}`, `${style('default')}`);
        this.classFormat(
          `.cxd-Button--${fontType}:not(:disabled):not(.is-disabled):hover`,
          `${style('hover')}`
        );
        this.classFormat(
          `.cxd-Button--${fontType}:not(:disabled):not(.is-disabled):hover:active`,
          `${style('active')}`
        );
      }
    }
    for (let item of size) {
      setButtonCssValue(item.token, item.body);
      if (item.custom) {
        const fontType = item.type;
        this.classFormat(
          `.cxd-Button--size-${fontType}`,
          [
            `font-size: var(--button-size-${fontType}-fonSize)`,
            `font-weight: var(--button-size-${fontType}-fontWeight)`,
            `line-height: var(--button-size-${fontType}-lineHeight)`,
            `min-width: var(--button-size-${fontType}-minWidth)`,
            `height: var(--button-size-${fontType}-height)`,
            `border-radius: var(--button-size-${fontType}-top-right-border-radius) var(--button-size-${fontType}-top-left-border-radius) var(--button-size-${fontType}-bottom-right-border-radius) var(--button-size-${fontType}-bottom-left-border-radius)`,
            `padding: var(--button-size-${fontType}-paddingTop) var(--button-size-${fontType}-paddingRight) var(--button-size-${fontType}-paddingBottom) var(--button-size-${fontType}-paddingLeft)`,
            `margin: var(--button-size-${fontType}-marginTop) var(--button-size-${fontType}-marginRight) var(--button-size-${fontType}-marginBottom) var(--button-size-${fontType}-marginLeft)`
          ].join(';')
        );
      }
    }
  }

  /**
   * 解析Tranfer
   */
  parseTransfer(transfer: any) {
    for (let typeKey in transfer) {
      const token = transfer[typeKey].token;
      const body = transfer[typeKey].body;
      for (let key in body) {
        this.setComponentStyle(key, token, body[key]);
      }
    }
  }

  /**
   * 解析inputRating
   */
  parseInputRating(inputRating: any) {
    const data = JSON.parse(JSON.stringify(inputRating));
    const colors = data.activeColors;
    this.cssFormat('--Rating-colors', `'${JSON.stringify(colors)}'`);
    delete data.activeColors;
    this.parseComponentCommon(data);
  }

  // 解析组件通用方法
  parseComponentCommon(component: any) {
    if (component.token && component.body) {
      // 有token时结束递归
      const token = component.token;
      for (let key in component.body) {
        this.setComponentStyle(key, token, component.body[key]);
      }
    } else {
      for (let key in component) {
        if (typeof component[key] === 'object') {
          this.parseComponentCommon(component[key]);
        }
      }
    }
  }
}
