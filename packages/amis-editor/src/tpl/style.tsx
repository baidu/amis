import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import type {SchemaCollection} from 'amis';
import kebabCase from 'lodash/kebabCase';

setSchemaTpl('style:formItem', ({renderer, schema}: any) => {
  return {
    title: '表单项',
    key: 'formItem',
    body: [
      getSchemaTpl('formItemMode'),
      getSchemaTpl('labelHide'),
      getSchemaTpl('horizontal'),
      renderer?.sizeMutable !== false ? getSchemaTpl('formItemSize') : null
      // getSchemaTpl('formItemInline')
    ].concat(schema)
  };
});

setSchemaTpl(
  'style:classNames',
  (config: {
    schema: SchemaCollection;
    isFormItem: boolean;
    unsupportStatic?: boolean;
  }) => {
    const {
      isFormItem = true,
      unsupportStatic = false,
      schema = []
    } = config || {};

    return {
      title: 'CSS 类名',
      body: (isFormItem
        ? [
            getSchemaTpl('className', {
              label: '表单项'
            }),
            getSchemaTpl('className', {
              label: '标签',
              name: 'labelClassName'
            }),
            getSchemaTpl('className', {
              label: '控件',
              name: 'inputClassName'
            }),
            ...(unsupportStatic
              ? []
              : [
                  getSchemaTpl('className', {
                    label: '静态展示',
                    name: 'staticClassName'
                  })
                ])
          ]
        : [
            getSchemaTpl('className', {
              label: '外层'
            })
          ]
      ).concat(schema)
    };
  }
);

setSchemaTpl('style:others', (schemas: any[] = []) => ({
  title: '其他项',
  body: [...schemas]
}));

/**
 * 通用CSS Style控件
 * @param {string | Array<string>} exclude 需要隐藏的配置key
 * @param {string | Array<string>} include 包含的配置key，存在时，优先级高于exclude
 */
setSchemaTpl(
  'style:common',
  (exclude: string[] | string, include: string[] | string) => {
    // key统一转换成Kebab case，eg: boxShadow => bos-shadow
    exclude = (
      exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : []
    ).map((key: string) => kebabCase(key));

    include = (
      include ? (Array.isArray(include) ? include : [include]) : []
    ).map((key: string) => kebabCase(key));

    return [
      {
        header: '布局',
        key: 'layout',
        body: [
          {
            type: 'style-display',
            label: false,
            name: 'style'
          }
        ].filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
      },
      {
        header: '文字',
        key: 'font',
        body: [
          {
            type: 'style-font',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: '内外边距',
        key: 'box-model',
        body: [
          {
            type: 'style-box-model',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: '背景',
        key: 'background',
        body: [
          {
            type: 'style-background',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: '边框',
        key: 'border',
        body: [
          {
            type: 'style-border',
            label: false,
            name: 'style'
          }
        ]
      },
      {
        header: '阴影',
        key: 'box-shadow',
        body: [
          {
            type: 'style-box-shadow',
            label: false,
            name: 'style.boxShadow'
          }
        ]
      },
      {
        header: '其他',
        key: 'other',
        body: [
          {
            label: '透明度',
            name: 'style.opacity',
            min: 0,
            max: 1,
            step: 0.05,
            type: 'input-range',
            pipeIn: defaultValue(1),
            marks: {
              '0%': '0',
              '50%': '0.5',
              '100%': '1'
            }
          },
          {
            label: '光标类型',
            name: 'style.cursor',
            type: 'select',
            mode: 'row',
            menuTpl: {
              type: 'html',
              html: "<span style='cursor:${value};'>${label}</span><code class='ae-Code'>${value}</code>",
              className: 'ae-selection-code'
            },
            pipIn: defaultValue('default'),
            options: [
              {label: '默认', value: 'default'},
              {label: '自动', value: 'auto'},
              {label: '无指针', value: 'none'},
              {label: '悬浮', value: 'pointer'},
              {label: '帮助', value: 'help'},
              {label: '文本', value: 'text'},
              {label: '单元格', value: 'cell'},
              {label: '交叉指针', value: 'crosshair'},
              {label: '可移动', value: 'move'},
              {label: '禁用', value: 'not-allowed'},
              {label: '可抓取', value: 'grab'},
              {label: '放大', value: 'zoom-in'},
              {label: '缩小', value: 'zoom-out'}
            ]
          }
        ]
      }
    ].filter(item =>
      include.length ? ~include.indexOf(item.key) : !~exclude.indexOf(item.key)
    );
  }
);

/**
 * 宽高配置控件
 * @param {object | undefined} options witdthSchema(宽度控件配置) heightSchema(高度控件配置)
 */
setSchemaTpl('style:widthHeight', (option: any = {}) => {
  const {widthSchema = {}, heightSchema = {}} = option;
  return {
    type: 'container',
    body: [
      {
        type: 'input-number',
        name: 'width',
        label: '宽度',
        unitOptions: ['px', '%', 'rem', 'em', 'vw'],
        ...widthSchema
      },
      {
        type: 'input-number',
        name: 'height',
        label: '高度',
        unitOptions: ['px', '%', 'rem', 'em', 'vh'],
        ...heightSchema
      }
    ]
  };
});

/**
 * 样式相关的属性面板，因为预计会比较多所以拆出来
 */
export const styleTpl = {
  name: 'style',
  type: 'combo',
  label: '',
  noBorder: true,
  multiLine: true,
  items: [
    {
      type: 'fieldSet',
      title: '文字',
      body: [
        {
          type: 'group',
          body: [
            {
              label: '文字大小',
              type: 'input-text',
              name: 'fontSize'
            },
            {
              label: '文字粗细',
              name: 'fontWeight',
              type: 'select',
              options: ['normal', 'bold', 'lighter', 'bolder']
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: '文字颜色',
              type: 'input-color',
              name: 'color'
            },
            {
              label: '对齐方式',
              name: 'textAlign',
              type: 'select',
              options: [
                'left',
                'right',
                'center',
                'justify',
                'justify-all',
                'start',
                'end',
                'match-parent'
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '背景',
      body: [
        {
          label: '颜色',
          name: 'backgroundColor',
          type: 'input-color'
        },
        getSchemaTpl('imageUrl', {
          name: 'backgroundImage'
        })
      ]
    },
    {
      type: 'fieldSet',
      title: '边距',
      body: [
        {
          type: 'group',
          label: '外边距',
          body: [
            {
              label: '上',
              name: 'marginTop',
              type: 'input-text'
            },
            {
              label: '右',
              name: 'marginRight',
              type: 'input-text'
            },
            {
              label: '下',
              name: 'marginBottom',
              type: 'input-text'
            },
            {
              label: '左',
              name: 'marginLeft',
              type: 'input-text'
            }
          ]
        },
        {
          type: 'group',
          label: '内边距',
          body: [
            {
              label: '上',
              name: 'paddingTop',
              type: 'input-text'
            },
            {
              label: '右',
              name: 'paddingRight',
              type: 'input-text'
            },
            {
              label: '下',
              name: 'paddingBottom',
              type: 'input-text'
            },
            {
              label: '左',
              name: 'paddingLeft',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '边框',
      body: [
        {
          type: 'group',
          body: [
            {
              label: '样式',
              name: 'borderStyle',
              type: 'select',
              options: ['none', 'solid', 'dotted', 'dashed']
            },
            {
              label: '颜色',
              name: 'borderColor',
              type: 'input-color'
            }
          ]
        },
        {
          type: 'group',
          body: [
            {
              label: '宽度',
              name: 'borderWidth',
              type: 'input-text'
            },
            {
              label: '圆角宽度',
              name: 'borderRadius',
              type: 'input-text'
            }
          ]
        }
      ]
    },
    {
      type: 'fieldSet',
      title: '特效',
      body: [
        {
          label: '透明度',
          name: 'opacity',
          min: 0,
          max: 1,
          step: 0.05,
          type: 'input-range',
          pipeIn: defaultValue(1)
        },
        {
          label: '阴影',
          name: 'boxShadow',
          type: 'input-text'
        }
      ]
    }
  ]
};

/**
 * 新版主题
 */

// css类名
setSchemaTpl(
  'theme:cssCode',
  ({
    themeClass = [],
    isFormItem
  }: {
    themeClass?: any[];
    isFormItem?: boolean;
  } = {}) => {
    if (isFormItem) {
      themeClass.push(
        ...[
          {
            name: 'description',
            value: 'description',
            className: 'descriptionClassName'
          },
          {name: 'label', value: 'label', className: 'labelClassName'}
        ]
      );
    }
    return {
      title: '样式源码',
      body: [
        {
          type: 'theme-cssCode',
          label: false,
          themeClass
        }
      ]
    };
  }
);

// form label
setSchemaTpl('theme:form-label', () => {
  return {
    title: 'Label样式',
    body: [
      getSchemaTpl('theme:select', {
        label: '宽度',
        name: 'labelWidth'
      }),
      getSchemaTpl('theme:font', {
        label: '文字',
        name: 'themeCss.labelClassName.font:default',
        editorThemePath: 'form.item.default.label.body.font'
      }),
      getSchemaTpl('theme:paddingAndMargin', {
        name: 'themeCss.labelClassName.padding-and-margin:default'
      })
    ]
  };
});

// form description
setSchemaTpl('theme:form-description', () => {
  return {
    title: '描述样式',
    visibleOn: 'this.description',
    body: [
      getSchemaTpl('theme:font', {
        label: '文字',
        name: 'themeCss.descriptionClassName.font:default',
        editorThemePath: 'form.item.default.description.body.font'
      }),
      getSchemaTpl('theme:paddingAndMargin', {
        name: 'themeCss.descriptionClassName.padding-and-margin:default'
      })
    ]
  };
});

// 尺寸选择器
setSchemaTpl('theme:select', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-select',
    label: '尺寸',
    name: `themeCss.className.size:default`,
    options: '${sizesOptions}',
    ...option
  };
});

// 文字编辑器
setSchemaTpl('theme:font', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-font-editor',
    label: '文字',
    name: `themeCss.className.font:default`,
    needColorCustom: true,
    ...option
  };
});

// 颜色选择器
setSchemaTpl('theme:colorPicker', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-color-picker',
    label: '颜色',
    name: `themeCss.className.color:default`,
    needCustom: true,
    ...option
  };
});

// 边框选择器
setSchemaTpl('theme:border', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-border',
    label: '边框',
    name: `themeCss.className.border:default`,
    needColorCustom: true,
    ...option
  };
});

// 边距选择器
setSchemaTpl('theme:paddingAndMargin', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-padding-and-margin',
    label: '边距',
    name: `themeCss.className.padding-and-margin:default`,
    ...option
  };
});

// 圆角选择器
setSchemaTpl('theme:radius', (option: any = {}) => {
  return {
    mode: 'default',
    type: 'amis-theme-radius',
    label: '圆角',
    name: `themeCss.className.radius:default`,
    ...option
  };
});

// 阴影选择器
setSchemaTpl('theme:shadow', (option: any = {}) => {
  return {
    type: 'amis-theme-shadow-editor',
    label: false,
    name: `themeCss.className.boxShadow:default`,
    hasSenior: true,
    ...option
  };
});

// 尺寸选择器
setSchemaTpl('theme:size', (option: any = {}) => {
  return {
    type: 'amis-theme-select',
    label: false,
    name: `css.className.size`,
    options: '${sizesOptions}',
    ...option
  };
});

setSchemaTpl(
  'theme:common',
  (option: {
    exclude: string[] | string;
    include: string[];
    collapsed?: boolean;
  }) => {
    let {exclude, include, collapsed} = option || {};
    const curCollapsed = collapsed ?? false; // 默认都展开
    // key统一转换成Kebab case，eg: boxShadow => bos-shadow
    exclude = (
      exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : []
    ).map((key: string) => kebabCase(key));

    const moreStyle =
      include?.map(key =>
        getSchemaTpl(`theme:${key}`, {
          name: 'style'
        })
      ) || [];
    const styles = moreStyle.concat([
      getSchemaTpl('theme:border', {
        name: 'style'
      }),
      getSchemaTpl('theme:radius', {
        name: 'style.radius'
      }),
      getSchemaTpl('theme:paddingAndMargin', {
        name: 'style'
      }),
      getSchemaTpl('theme:colorPicker', {
        name: 'style.background',
        label: '背景',
        needCustom: true,
        needGradient: true,
        needImage: true,
        labelMode: 'input'
      }),
      getSchemaTpl('theme:shadow', {
        name: 'style.boxShadow'
      })
    ]);
    return [
      {
        header: '布局',
        key: 'layout',
        collapsed: curCollapsed,
        body: [
          {
            type: 'style-display',
            label: false,
            name: 'style'
          }
        ].filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
      },
      {
        title: '自定义样式',
        collapsed: curCollapsed,
        body: styles
      },
      {
        title: '样式源码',
        collapsed: curCollapsed,
        body: [
          {
            type: 'theme-cssCode',
            label: false,
            isLayout: true
          }
        ]
      }
    ].filter(item => !~exclude.indexOf(item.key || ''));
  }
);
