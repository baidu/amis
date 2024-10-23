import kebabCase from 'lodash/kebabCase';

interface Style {
  [id: string]: {
    [className: string]: {
      [propName: string]: string | number;
    };
  };
}

class StyleManager {
  styles: Style;
  styleDom: HTMLStyleElement;
  styleText: string;

  constructor() {
    this.styles = {};
    this.styleDom = document.createElement('style');
    this.styleDom.id = 'amis-styles';
    document.head.appendChild(this.styleDom);
  }

  updateStyle(style: Style) {
    Object.keys(style).forEach(className => {
      if (!this.styles[className]) {
        this.styles[className] = style[className];
      } else {
        this.styles[className] = {
          ...this.styles[className],
          ...style[className]
        };
      }
    });
    this.updateStyleDom();
  }

  removeStyles(id: string) {
    delete this.styles[id];
    this.updateStyleDom();
  }

  updateStyleDom() {
    const styleText = Object.keys(this.styles)
      .map(id => {
        const style = this.styles[id];
        return Object.keys(style)
          .map(className => {
            return `${className} {${Object.keys(style[className])
              .map(propName => {
                return `${kebabCase(propName)}: ${style[className][propName]};`;
              })
              .join('')}}`;
          })
          .join('');
      })
      .join('');

    this.styleDom.innerHTML = styleText;
    this.styleText = styleText;
  }
}

export default new StyleManager();
