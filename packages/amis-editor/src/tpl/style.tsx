import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  tipedLabel
} from 'amis-editor-core';
import {createAnimationStyle, formateId, type SchemaCollection} from 'amis';
import kebabCase from 'lodash/kebabCase';
import {styleManager} from 'amis-core';
import {MixedInput} from 'amis-ui';

const animationOptions = {
  enter: [
    {
      label: '淡入',
      children: [
        {
          label: '淡入',
          value: 'fadeIn'
        },
        {
          value: 'fadeInDown',
          label: '从上淡入'
        },
        {
          value: 'fadeInDownBig',
          label: '从上淡入(加强效果)'
        },
        {
          value: 'fadeInLeft',
          label: '从左淡入'
        },
        {
          value: 'fadeInLeftBig',
          label: '从左淡入(加强效果)'
        },
        {
          value: 'fadeInRight',
          label: '从右淡入'
        },
        {
          value: 'fadeInRightBig',
          label: '从右淡入(加强效果)'
        },
        {
          value: 'fadeInUp',
          label: '从下淡入'
        },
        {
          value: 'fadeInUpBig',
          label: '从下淡入(加强效果)'
        }
      ]
    },
    {
      label: '回弹',
      children: [
        {
          value: 'backInDown',
          label: '从上回弹进入'
        },
        {
          value: 'backInLeft',
          label: '从左回弹进入'
        },
        {
          value: 'backInRight',
          label: '从右回弹进入'
        },
        {
          value: 'backInUp',
          label: '从下回弹进入'
        }
      ]
    },
    {
      label: '旋转',
      children: [
        {
          value: 'rotateIn',
          label: '旋转进入'
        },
        {
          value: 'rotateInDownLeft',
          label: '左上角旋转进入'
        },
        {
          value: 'rotateInDownRight',
          label: '右上角旋转进入'
        },
        {
          value: 'rotateInUpLeft',
          label: '左下角旋转进入'
        },
        {
          value: 'rotateInUpRight',
          label: '右下角旋转进入'
        }
      ]
    },
    {
      label: '滑动',
      children: [
        {
          value: 'slideInUp',
          label: '从下滑入'
        },
        {
          value: 'slideInDown',
          label: '从上滑入'
        },
        {
          value: 'slideInLeft',
          label: '从左滑入'
        },
        {
          value: 'slideInRight',
          label: '从右滑入'
        }
      ]
    },
    {
      label: '翻页',
      children: [
        {
          value: 'flip',
          label: '翻页'
        },
        {
          value: 'flipInY',
          label: '水平翻页'
        },
        {
          value: 'flipInX',
          label: '垂直翻页'
        }
      ]
    },
    {
      label: '弹跳',
      children: [
        {
          value: 'bounceIn',
          label: '弹跳进入'
        },
        {
          value: 'bounceInDown',
          label: '从上弹跳进入'
        },
        {
          value: 'bounceInLeft',
          label: '从左弹跳进入'
        },
        {
          value: 'bounceInRight',
          label: '从右弹跳进入'
        },
        {
          value: 'bounceInUp',
          label: '从下弹跳进入'
        }
      ]
    },
    {
      label: '缩放',
      children: [
        {
          value: 'zoomIn',
          label: '缩放进入'
        },
        {
          value: 'zoomInDown',
          label: '从上缩放进入'
        },
        {
          value: 'zoomInLeft',
          label: '从左缩放进入'
        },
        {
          value: 'zoomInRight',
          label: '从右缩放进入'
        },
        {
          value: 'zoomInUp',
          label: '从下缩放进入'
        }
      ]
    },
    {
      label: '其他',
      children: [
        {
          value: 'lightSpeedInLeft',
          label: '从左光速进入'
        },
        {
          value: 'lightSpeedInRight',
          label: '从右光速进入'
        },
        {
          value: 'rollIn',
          label: '滚动进入'
        }
      ]
    }
  ],
  attention: [
    {
      label: '弹跳',
      value: 'bounce'
    },
    {
      label: '闪烁',
      value: 'flash'
    },
    {
      value: 'headShake',
      label: '摇头'
    },
    {
      value: 'heartBeat',
      label: '心跳'
    },
    {
      value: 'jello',
      label: '果冻'
    },
    {
      label: '跳动',
      value: 'pulse'
    },
    {
      label: '摇摆',
      value: 'swing'
    },
    {
      label: '震动',
      value: 'tada'
    },
    {
      label: '晃动',
      value: 'wobble'
    },
    {
      label: '抖动',
      value: 'shake'
    },
    {
      value: 'shakeX',
      label: '水平抖动'
    },
    {
      value: 'shakeY',
      label: '垂直抖动'
    },
    {
      value: 'rubberBand',
      label: '橡皮筋'
    }
  ],
  hover: [
    {
      label: '放大效果',
      value: 'hoverZoomIn'
    },
    {
      label: '缩小效果',
      value: 'hoverZoomOut'
    },
    {
      label: '向上滑动',
      value: 'hoverUp'
    },
    {
      label: '向下滑动',
      value: 'hoverDown'
    },
    {
      label: '向左滑动',
      value: 'hoverLeft'
    },
    {
      label: '向右滑动',
      value: 'hoverRight'
    },
    {
      label: '阴影增强',
      value: 'hoverShadow'
    },
    {
      label: '发光边框',
      value: 'hoverBorder'
    },
    {
      label: '内容翻转',
      value: 'hoverFlip'
    },
    {
      label: '闪烁',
      value: 'hoverFlash'
    },
    {
      label: '抖动',
      value: 'hoverShake'
    }
  ],
  exit: [
    {
      label: '淡出',
      children: [
        {
          label: '淡出',
          value: 'fadeOut'
        },
        {
          value: 'fadeOutDown',
          label: '向下淡出'
        },
        {
          value: 'fadeOutDownBig',
          label: '向下淡出(加强效果)'
        },
        {
          value: 'fadeOutLeft',
          label: '向左淡出'
        },
        {
          value: 'fadeOutLeftBig',
          label: '向左淡出(加强效果)'
        },
        {
          value: 'fadeOutRight',
          label: '向右淡出'
        },
        {
          value: 'fadeOutRightBig',
          label: '向右淡出(加强效果)'
        },
        {
          value: 'fadeOutUp',
          label: '向上淡出'
        },
        {
          value: 'fadeOutUpBig',
          label: '向上淡出(加强效果)'
        }
      ]
    },
    {
      label: '回弹',
      children: [
        {
          value: 'backOutDown',
          label: '向下回弹退出'
        },
        {
          value: 'backOutLeft',
          label: '向左回弹退出'
        },
        {
          value: 'backOutRight',
          label: '向右回弹退出'
        },
        {
          value: 'backOutUp',
          label: '向上回弹退出'
        }
      ]
    },
    {
      label: '旋转',
      children: [
        {
          value: 'rotateOut',
          label: '旋转退出'
        },
        {
          value: 'rotateOutDownLeft',
          label: '左上角旋转退出'
        },
        {
          value: 'rotateOutDownRight',
          label: '右上角旋转退出'
        },
        {
          value: 'rotateOutUpLeft',
          label: '左下角旋转退出'
        },
        {
          value: 'rotateOutUpRight',
          label: '右下角旋转退出'
        }
      ]
    },
    {
      label: '滑动',
      children: [
        {
          value: 'slideOutUp',
          label: '向上滑入'
        },
        {
          value: 'slideOutDown',
          label: '向下滑入'
        },
        {
          value: 'slideOutLeft',
          label: '向左滑入'
        },
        {
          value: 'slideOutRight',
          label: '向右滑入'
        }
      ]
    },
    {
      label: '翻页',
      children: [
        {
          value: 'flipOutY',
          label: '水平翻页'
        },
        {
          value: 'flipOutX',
          label: '垂直翻页'
        }
      ]
    },
    {
      label: '弹跳',
      children: [
        {
          value: 'bounceOut',
          label: '弹跳退出'
        },
        {
          value: 'bounceOutDown',
          label: '向下弹跳退出'
        },
        {
          value: 'bounceOutLeft',
          label: '向左弹跳退出'
        },
        {
          value: 'bounceOutRight',
          label: '向右弹跳退出'
        },
        {
          value: 'bounceOutUp',
          label: '向上弹跳退出'
        }
      ]
    },
    {
      label: '缩放',
      children: [
        {
          value: 'zoomOut',
          label: '缩放退出'
        },
        {
          value: 'zoomOutDown',
          label: '向上缩放退出'
        },
        {
          value: 'zoomOutLeft',
          label: '向左缩放退出'
        },
        {
          value: 'zoomOutRight',
          label: '向右缩放退出'
        },
        {
          value: 'zoomOutUp',
          label: '向下缩放退出'
        }
      ]
    },
    {
      label: '其他',
      children: [
        {
          value: 'lightSpeedOutLeft',
          label: '向左光速退出'
        },
        {
          value: 'lightSpeedOutRight',
          label: '向右光速退出'
        },
        {
          value: 'rollOut',
          label: '滚动退出'
        }
      ]
    }
  ]
};

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

setSchemaTpl('theme:formItem', ({schema, hidSize}: any = {hidSize: false}) => {
  return {
    title: '表单项',
    key: 'formItem',
    body: [
      getSchemaTpl('theme:labelHide'),
      !hidSize && {
        type: 'col-size',
        name: '__size',
        label: '宽度'
      }
    ]
      .filter(Boolean)
      .concat(schema)
  };
});

setSchemaTpl(
  'style:classNames',
  (config: {
    schema: SchemaCollection;
    isFormItem: boolean;
    unsupportStatic?: boolean;
    collapsed?: boolean;
  }) => {
    const {
      isFormItem = true,
      unsupportStatic = false,
      schema = [],
      collapsed = true
    } = config || {};

    return {
      title: 'CSS 类名',
      collapsed,
      body: (isFormItem
        ? [
            getSchemaTpl('className', {
              label: '表单项'
            }),
            getSchemaTpl('className', {
              label: '标题',
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
      getSchemaTpl('theme:width2', {
        name: 'width',
        label: '宽度',
        ...widthSchema
      }),
      getSchemaTpl('theme:height2', {
        name: 'width',
        label: '宽度',
        ...heightSchema
      })
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
setSchemaTpl('theme:cssCode', () => {
  return {
    title: '自定义样式',
    body: [
      {
        type: 'theme-cssCode',
        label: false
      }
    ]
  };
});

// single css类名
setSchemaTpl(
  'theme:singleCssCode',
  (options: {
    selectors: {
      label: string;
      selector: string;
      isRoot?: boolean;
    }[];
  }) => {
    const {selectors} = options;
    return {
      title: '自定义样式',
      name: 'wrapperCustomStyle',
      body: selectors?.map(
        (item: {label: string; selector: string; isRoot?: boolean}) => {
          const {isRoot, selector} = item;
          const _selector = isRoot ? 'root' : selector;
          const name = `wrapperCustomStyle[${_selector}]`;
          return {
            mode: 'default',
            name,
            type: 'ae-single-theme-cssCode',
            label: false,
            selector: item
          };
        }
      )
    };
  }
);

// form label
setSchemaTpl('theme:form-label', () => {
  return {
    title: '标题样式',
    visibleOn: 'this.label !== false',
    body: [
      {
        type: 'label-align',
        name: 'labelAlign',
        label: '位置'
      },
      getSchemaTpl('theme:select', {
        label: '宽度',
        name: 'labelWidth',
        hiddenOn: 'this.labelAlign == "top"'
      }),

      getSchemaTpl('theme:font', {
        label: '文字',
        name: 'themeCss.labelClassName.font:default',
        hasSenior: false,
        editorValueToken: '--Form-item'
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
        editorValueToken: '--Form-description'
      }),
      {
        label: '上间距',
        type: 'amis-theme-select',
        name: 'themeCss.descriptionClassName.margin-top:default',
        options: '${sizesOptions}',
        editorValueToken: '--Form-description-gap'
      }
    ]
  };
});

// 带提示的值输入框
setSchemaTpl('theme:select', (option: any = {}) => {
  return {
    mode: 'horizontal',
    labelAlign: 'left',
    type: 'amis-theme-select',
    label: '大小',
    name: `themeCss.className.select:default`,
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
    mode: 'default',
    type: 'amis-theme-size-editor',
    label: false,
    name: `themeCss.className.size:default`,
    options: '${sizesOptions}',
    hideMinWidth: true,
    ...option
  };
});

setSchemaTpl(
  'theme:base',
  (option: {
    collapsed?: boolean;
    extra?: any[];
    classname?: string;
    title?: string;
    hiddenOn?: string;
    visibleOn?: string;
    hidePaddingAndMargin?: boolean;
    hideBorder?: boolean;
    hideRadius?: boolean;
    hideBackground?: boolean;
    hideShadow?: boolean;
    hideMargin?: boolean;
    hidePadding?: boolean;
    needState?: boolean;
    editorValueToken?: string;
    state?: string[];
  }) => {
    const {
      collapsed = false,
      extra = [],
      classname = 'baseControlClassName',
      title = '基本样式',
      hiddenOn,
      visibleOn,
      hidePaddingAndMargin,
      hideBorder,
      hideRadius,
      hideBackground,
      hideShadow,
      hideMargin,
      hidePadding,
      needState = true,
      editorValueToken,
      state = ['default', 'hover', 'active']
    } = option;

    const classId = classname.replace(/\-/g, '_');

    const styleStateFunc = (visibleOn: string, state: string) => {
      return [
        !hideBorder &&
          getSchemaTpl('theme:border', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.border${needState ? ':' + state : ''}`,
            state,
            editorValueToken
          }),
        !hideRadius &&
          getSchemaTpl('theme:radius', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.radius${needState ? ':' + state : ''}`,
            state,
            editorValueToken
          }),
        !hidePaddingAndMargin &&
          getSchemaTpl('theme:paddingAndMargin', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.padding-and-margin${
              needState ? ':' + state : ''
            }`,
            hideMargin,
            hidePadding,
            state,
            editorValueToken
          }),
        !hideBackground &&
          getSchemaTpl('theme:colorPicker', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.background${
              needState ? ':' + state : ''
            }`,
            label: '背景',
            needCustom: true,
            needGradient: true,
            needImage: true,
            labelMode: 'input',
            state,
            editorValueToken: editorValueToken
              ? `${editorValueToken}-\${__editorState${classId} || 'default'}-bg-color`
              : undefined
          }),
        !hideShadow &&
          getSchemaTpl('theme:shadow', {
            visibleOn: visibleOn,
            name: `themeCss.${classname}.boxShadow${
              needState ? ':' + state : ''
            }`,
            state,
            editorValueToken
          })
      ]
        .filter(item => item)
        .concat(
          extra.map(item => {
            return {
              ...item,
              visibleOn: visibleOn,
              name: `${item.name}${needState ? ':' + state : ''}`,
              state
            };
          })
        );
    };

    const styles = [
      needState && {
        type: 'select',
        mode: 'horizontal',
        labelAlign: 'left',
        labelWidth: 80,
        name: `__editorState${classId}`,
        label: '状态',
        selectFirst: true,
        options: [
          {
            label: '常规',
            value: 'default'
          },
          {
            label: '悬浮',
            value: 'hover'
          },
          {
            label: '点击',
            value: 'active'
          },
          {
            label: '选中',
            value: 'focused'
          },
          {
            label: '禁用',
            value: 'disabled'
          }
        ].filter(item => state.includes(item.value))
      },
      ...styleStateFunc(
        `\${__editorState${classId} == 'default' || !__editorState${classId}}`,
        'default'
      ),
      ...styleStateFunc(`\${__editorState${classId} == 'hover'}`, 'hover'),
      ...styleStateFunc(`\${__editorState${classId} == 'active'}`, 'active'),
      ...styleStateFunc(`\${__editorState${classId} == 'focused'}`, 'focused'),
      ...styleStateFunc(`\${__editorState${classId} == 'disabled'}`, 'disabled')
    ].filter(Boolean);

    return {
      title,
      collapsed,
      body: styles,
      hiddenOn,
      visibleOn
    };
  }
);

setSchemaTpl(
  'theme:common',
  (option: {
    exclude: string[] | string;
    collapsed?: boolean;
    extra?: any[];
    baseExtra?: any[];
    layoutExtra?: any[];
    classname?: string;
    baseTitle?: string;
    hidePaddingAndMargin?: boolean;
    hideAnimation?: boolean;
    needState?: boolean;
  }) => {
    let {
      exclude,
      collapsed,
      extra = [],
      baseExtra,
      layoutExtra,
      classname,
      baseTitle,
      hidePaddingAndMargin,
      hideAnimation,
      needState = true
    } = option || {};

    const curCollapsed = collapsed ?? false; // 默认都展开
    // key统一转换成Kebab case，eg: boxShadow => bos-shadow
    exclude = (
      exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : []
    ).map((key: string) => kebabCase(key));

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
        ]
          .filter(comp => !~exclude.indexOf(comp.type.replace(/^style-/i, '')))
          .concat(layoutExtra || [])
      },
      getSchemaTpl('theme:base', {
        collapsed: curCollapsed,
        extra: baseExtra,
        classname,
        title: baseTitle,
        needState,
        hidePaddingAndMargin
      }),
      ...extra,
      {
        title: '自定义样式',
        key: 'theme-css-code',
        collapsed: curCollapsed,
        body: [
          {
            type: 'theme-cssCode',
            label: false
          }
        ]
      },
      !hideAnimation && getSchemaTpl('animation')
    ].filter(item => !~exclude.indexOf(item.key || ''));
  }
);

setSchemaTpl(
  'theme:icon',
  (option: {classname?: string; visibleOn?: string; title?: string}) => {
    const {
      classname = 'iconControlClassName',
      visibleOn,
      title = '图标样式'
    } = option;
    return {
      title,
      visibleOn,
      body: [
        getSchemaTpl('theme:select', {
          label: '图标尺寸',
          name: `themeCss.${classname}.iconSize`
        }),
        getSchemaTpl('theme:colorPicker', {
          name: `themeCss.${classname}.color`,
          label: '图标颜色',
          needCustom: true,
          needGradient: true,
          labelMode: 'input'
        }),
        getSchemaTpl('theme:paddingAndMargin', {
          label: '图标边距',
          name: `themeCss.${classname}.padding-and-margin`
        })
      ]
    };
  }
);

setSchemaTpl('animation', () => {
  let timeoutId: any = null;

  function playAnimation(animations: any, id: string, type: string) {
    let doc = document;
    const isMobile = (window as any).editorStore.isMobile;
    if (isMobile) {
      doc = (document.getElementsByClassName('ae-PreviewIFrame')[0] as any)
        .contentDocument;
    }
    const highlightDom = document.getElementById('aePreviewHighlightBox');
    if (highlightDom) {
      highlightDom.style.opacity = '0';
      highlightDom.classList.add('ae-Preview-widgets--no-transition');
    }
    const el = doc.querySelector(`[name="${id}"]`);
    id = formateId(id);
    const className = `${animations[type].type}-${id}-${type}`;
    if (type === 'hover') {
      el?.classList.add(`amis-${animations[type].type}-show`);
      el?.classList.add(`${animations[type].type}-${id}-hover-show`);
    }
    el?.classList.add(className);
    createAnimationStyle(id, animations);

    if (isMobile) {
      let style = doc.getElementById('amis-styles');
      if (!style) {
        style = doc.createElement('style');
        style.id = 'amis-styles';
        doc.head.appendChild(style);
      }
      style.innerHTML = styleManager.styleText;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      el?.classList.remove(className);
      if (type === 'hover') {
        el?.classList.remove(`amis-${animations[type].type}-show`);
        el?.classList.remove(`${animations[type].type}-${id}-hover-show`);
      }

      if (highlightDom) {
        const editorId = el?.getAttribute('data-editor-id');
        const node = (window as any).editorStore.getNodeById(editorId);
        // 重新计算元素高亮框的位置
        node.calculateHighlightBox();
        highlightDom.style.opacity = '1';
        setTimeout(() => {
          highlightDom.classList.remove('ae-Preview-widgets--no-transition');
        }, 150);
      }
    }, ((animations[type].duration || 1) + (animations[type].delay || 0)) * 1000 + 200);
  }
  const animation = (
    type: 'enter' | 'attention' | 'hover' | 'exit',
    label: string,
    schema: any = []
  ) => [
    {
      type: 'switch',
      name: `animations.${type}`,
      pipeIn: (value: boolean) => !!value,
      pipeOut: (value: boolean) => {
        if (value) {
          return {};
        }
        return undefined;
      },
      onChange: (value: any, a: any, b: any, {data}: any) => {
        if (value) {
          const {id} = data;
          let animationType = 'fadeIn';
          if ('children' in animationOptions[type][0]) {
            // @ts-ignore
            animationType = animationOptions[type][0].children[0].value;
          } else {
            // @ts-ignore
            animationType = animationOptions[type][0].value;
          }
          playAnimation(
            {
              [type]: {
                delay: 0,
                duration: 1,
                type: animationType
              }
            },
            id,
            type
          );
        }
      },
      label
    },
    {
      type: 'container',
      className: 'm-b ae-ExtendMore',
      visibleOn: `\${animations && animations.${type}}`,
      body: [
        {
          type: 'select',
          name: `animations.${type}.type`,
          selectMode: 'group',
          options: animationOptions[type],
          label: '类型',
          selectFirst: true,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    type: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        {
          type: 'input-number',
          name: `animations.${type}.duration`,
          label: '持续',
          value: 1,
          suffix: '秒',
          min: 0,
          precision: 3,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    duration: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        {
          label: '延迟',
          type: 'input-number',
          name: `animations.${type}.delay`,
          value: 0,
          suffix: '秒',
          precision: 3,
          onChange: (value: any, oldValue: any, obj: any, {data}: any) => {
            const {animations, id} = data;
            if (oldValue !== undefined) {
              playAnimation(
                {
                  ...animations,
                  [type]: {
                    ...animations[type],
                    delay: value
                  }
                },
                id,
                type
              );
            }
          }
        },
        ...schema
      ]
    },
    {
      type: 'button',
      visibleOn: `\${animations && animations.${type}}`,
      className: 'm-b',
      block: true,
      level: 'enhance',
      size: 'sm',
      label: '播放',
      onClick: (e: any, {data}: any) => {
        const {animations, id} = data;
        playAnimation(animations, id, type);
      }
    }
  ];

  return {
    title: '动画',
    body: [
      ...animation('enter', '进入动画', [
        {
          label: tipedLabel('可见时触发', '组件进入可见区域才触发进入动画'),
          type: 'switch',
          name: 'animations.enter.inView',
          value: true,
          onChange: (value: any, oldValue: any, obj: any, props: any) => {
            if (value === false) {
              props.setValueByName('animations.enter.repeat', false);
            }
          }
        },
        {
          label: tipedLabel('重复', '组件再次进入可见区域时重复播放动画'),
          type: 'switch',
          name: 'animations.enter.repeat',
          visibleOn: 'animations.enter.inView',
          value: false
        }
      ]),
      ...animation('attention', '强调动画', [
        {
          label: '重复',
          type: 'select',
          name: 'animations.attention.repeat',
          value: 'infinite',
          options: [
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
              label: i,
              value: i
            })),
            {label: '无限', value: 'infinite'}
          ]
        }
      ]),
      ...animation('hover', '悬浮动画', [
        {
          label: '重复',
          type: 'select',
          name: 'animations.hover.repeat',
          value: '2',
          visibleOn:
            'animations.hover.type =="hoverFlash" || animations.hover.type =="hoverShake"',
          options: [
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
              label: i,
              value: i
            }))
          ]
        }
      ]),
      ...animation('exit', '退出动画', [
        {
          label: tipedLabel('不可见时触发', '组件退出可见区域触发进入动画'),
          type: 'switch',
          name: 'animations.exit.outView',
          value: true
        }
      ])
    ]
  };
});

setSchemaTpl(
  'theme:width2',
  (options: {
    classname?: string;
    visibleOn?: string;
    label?: string;
    description?: string;
  }) => {
    const makeNumericMethod = (affix: string) => ({
      type: 'number',
      inputSettings: {
        precision: 2
      },
      label: affix,
      pipeIn: (value: any) => {
        value = typeof value === 'string' ? value.replace(affix, '') : '';
        if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value)) {
          value = '';
        }

        return value ? value.replace(affix, '') : '';
      },
      pipeOut: (value: any) => {
        return typeof value === 'number' ||
          (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value))
          ? `${value}${affix}`
          : '';
      },
      test: (value: any) => {
        return typeof value === 'string' && value.endsWith(affix);
      }
    });

    return {
      label: '宽度',
      methods: [
        makeNumericMethod('px'),
        {
          ...makeNumericMethod('%'),
          inputSettings: {
            min: 0,
            max: 100,
            step: 1,
            precision: 2
          }
        },
        makeNumericMethod('rem'),
        makeNumericMethod('em'),
        {
          ...makeNumericMethod('vw'),
          inputSettings: {
            min: 0,
            max: 100,
            step: 1,
            precision: 2
          }
        },
        {
          label: '自适应',
          pipeIn: () => '',
          pipeOut: () => 'auto',
          inputSettings: {
            disabled: true,
            clearable: false,
            placeholder: 'auto'
          },
          test: (value: any, defaultMethod: any) => {
            return value === 'auto' || (!defaultMethod && !value);
          }
        },
        {
          label: 'CSS公式',
          pipeOut: (value: any) =>
            typeof value !== 'string' || !value.startsWith('calc(')
              ? `calc()`
              : value,
          test: (value: any) => {
            return typeof value === 'string' && value.startsWith('calc(');
          }
        }
      ],
      pipeIn: defaultValue('auto'),
      ...options,
      component: MixedInput,
      asFormItem: true
    };
  }
);

setSchemaTpl(
  'theme:height2',
  (options: {
    classname?: string;
    visibleOn?: string;
    label?: string;
    description?: string;
  }) => {
    const makeNumericMethod = (affix: string) => ({
      type: 'number',
      inputSettings: {
        precision: 2
      },
      label: affix,
      pipeIn: (value: any) => {
        value = typeof value === 'string' ? value.replace(affix, '') : '';
        if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value)) {
          value = '';
        }

        return value ? value.replace(affix, '') : '';
      },
      pipeOut: (value: any) => {
        return typeof value === 'number' ||
          (typeof value === 'string' && /^\d+(?:\.\d+)?$/.test(value))
          ? `${value}${affix}`
          : '';
      },
      test: (value: any) => {
        return typeof value === 'string' && value.endsWith(affix);
      }
    });

    return {
      label: '高度',
      methods: [
        makeNumericMethod('px'),
        {
          ...makeNumericMethod('%'),
          inputSettings: {
            min: 0,
            max: 100,
            step: 1,
            precision: 2
          }
        },
        makeNumericMethod('rem'),
        makeNumericMethod('em'),
        {
          ...makeNumericMethod('vh'),
          inputSettings: {
            min: 0,
            max: 100,
            step: 1,
            precision: 2
          }
        },
        {
          label: '自适应',
          pipeIn: () => '',
          pipeOut: () => 'auto',
          inputSettings: {
            disabled: true,
            clearable: false,
            placeholder: 'auto'
          },
          test: (value: any, defaultMethod: any) => {
            return value === 'auto' || (!defaultMethod && !value);
          }
        },
        {
          label: 'CSS公式',
          pipeOut: (value: any) =>
            typeof value !== 'string' || !value.startsWith('calc(')
              ? `calc()`
              : value,
          test: (value: any) => {
            return typeof value === 'string' && value.startsWith('calc(');
          }
        }
      ],
      pipeIn: defaultValue('auto'),
      ...options,
      component: MixedInput,
      asFormItem: true
    };
  }
);
