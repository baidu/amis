/**
 * @file 生成一些通用的配置项
 */

/**
 * 创建一个层级，比如 name 是 title，这里面的子组件 name 就相当于 title.name
 * @param name
 * @param label
 */

export const createHierarchy = (name: string, controls: any[]) => {
  return {
    name: name,
    type: 'combo',
    label: '',
    noBorder: true,
    multiLine: true,
    controls: controls
  };
};

/**
 * 方便生成颜色类的控件
 * @param name
 * @param label
 */
export const color = (name: string, label: string) => {
  return {
    type: 'color',
    format: 'rgba',
    name: name,
    label: label
  };
};

/**
 * 默认值是 true 的 switch，并且 inline
 * @param name
 * @param label
 */
export const trueSwitch = (name: string, label: string) => {
  return {
    type: 'switch',
    name: name,
    mode: 'inline',
    label: label,
    pipeIn: (value: any) => {
      if (typeof value === 'undefined') {
        return true;
      }
      return value;
    }
  };
};

/**
 * 默认值是 false 的 switch，并且 inline
 * @param name
 * @param label
 */
export const falseSwitch = (name: string, label: string) => {
  return {
    type: 'switch',
    name: name,
    mode: 'inline',
    label: label
  };
};

/**
 * 如果没数据就默认用第一个的 select
 * @param name
 * @param label
 * @param options
 */
export const select = (name: string, label: string, options: any[]) => {
  return {
    type: 'select',
    name: name,
    label: label,
    pipeIn: (value: any) => {
      if (typeof value === 'undefined') {
        return options[0];
      }
      return value;
    },
    options: options
  };
};

/**
 * fieldSet 辅助
 * @param label
 * @param controls
 * @param collapsed
 */
export const fieldSet = (
  label: string,
  controls: any[],
  collapsed: boolean = false
) => {
  return {
    type: 'fieldSet',
    title: label,
    collapsable: true,
    collapsed: collapsed,
    controls: controls
  };
};

/**
 * 控制一组控件的显隐
 * @param visibleOn
 * @param controls
 */
export const visibleOn = (visibleOn: string, controls: any[]) => {
  return {
    type: 'container',
    visibleOn: visibleOn,
    controls: controls
  };
};

/**
 * 方便生成数字类的控件
 * @param name
 * @param label
 * @param isInteger 是否是整数
 */
export const number = (
  name: string,
  label: string,
  isInteger: boolean = true
) => {
  const control: any = {
    type: 'number',
    label: label
  };
  if (isInteger) {
    control.min = 0;
  }
  return control;
};

/**
 * 用于 left/top 等，支持三种类型，一种是关键字，比如 auto，一种是数字，另一种是百分比
 * @param name
 * @param label
 * @param labelForRadio 切换按钮的文字
 * @param keywordList 关键字列表
 */
export const viewportControl = (
  name: string,
  label: string,
  labelForRadio: string,
  keywordList: string[]
) => {
  return [
    {
      type: 'button-group',
      name: name,
      label: labelForRadio,
      options: [
        {
          label: '关键字',
          value: keywordList[0]
        },
        {
          label: '数字',
          value: 2
        },
        {
          label: '百分比',
          value: 3
        }
      ],
      pipeIn: value => {
        if (typeof value === 'undefined') {
          return keywordList[0];
        }
        if (typeof value === 'string') {
          if (value.indexOf('%') !== -1) {
            return 3;
          } else {
            return keywordList[0];
          }
        } else if (typeof value === 'number') {
          return 2;
        } else {
          return keywordList[0];
        }
      },
      pipeOut: value => {
        if (value === 1) {
          return keywordList[0];
        } else if (value === 2) {
          return 0;
        } else if (value === 3) {
          return '0%';
        } else {
          return keywordList[0];
        }
      }
    },
    {
      type: 'select',
      name: name,
      label: label,
      options: keywordList,
      visibleOn: `(typeof data.${name} === "undefined") || ((typeof data.${name} === "string") && (data.${name}.indexOf("%") === -1))`
    },
    {
      type: 'number',
      name: name,
      label: label,
      visibleOn: `(typeof data.${name} === "number")`
    },
    {
      type: 'text',
      name: name,
      label: label,
      visibleOn: `(typeof data.${name} === "string") && (data.${name}.indexOf("%") !== -1)`
    }
  ];
};

/**
 * 设置某个组件在容器中的距离
 * @param label 组件名
 */
export const viewport = (label: string) => {
  return {
    type: 'fieldSet',
    title: '离容器边距',
    collapsable: true,
    collapsed: true,
    controls: [
      ...viewportControl('left', `${label}离容器左侧的距离`, '左侧距离值类型', [
        'auto',
        'left',
        'center',
        'right'
      ]),
      ...viewportControl('top', `${label}离容器上侧的距离`, '上侧距离值类型', [
        'auto',
        'top',
        'middle',
        'bottom'
      ]),
      ...viewportControl(
        'right',
        `${label}离容器右侧的距离`,
        '右侧距离值类型',
        ['auto']
      ),
      ...viewportControl(
        'bottom',
        `${label}离容器下侧的距离`,
        '下侧距离值类型',
        ['auto']
      )
    ]
  };
};

/**
 * 设置宽度的便捷方法
 * @param label
 */
export const width = (label: string) => {
  return keywordOrNumber('width', `${label}的宽度`, '宽度的单位', ['auto']);
};

/**
 * 设置高度的便捷方法
 * @param label
 */
export const height = (label: string) => {
  return keywordOrNumber('height', `${label}的高度`, '高度的单位', ['auto']);
};

/**
 * 设置 padding 的便捷方法
 * @param label
 */
export const padding = (label: string) => {
  return numberOrArray('padding', label + '内边距', '单独设置每个内边距');
};

/**
 * 设置 orient 的便捷方法
 * @param label
 */
export const origin = (label: string) => {
  return select('origin', `${label}列表的布局朝向`, ['horizontal', 'vertical']);
};

/**
 * formatter 的简便方法，不过这里不支持函数
 * @param label
 */
export const formatter = (label: string) => {
  return {
    type: 'text',
    name: 'formatter',
    label: `格式化${label}文本`
  };
};

/**
 * selectedMode 的简便写法
 * @param label
 */
export const selectedMode = (label: string) => {};

/**
 * 用于生成类似 padding 那种可以是数字或数组的控件
 * @param name
 * @param label
 * @param labelForSwitch 切换按钮的文字
 * @param defaultNumber 默认数字
 * @param defaultArray 默认数组
 */
export const numberOrArray = (
  name: string,
  label: string,
  labelForSwitch: string,
  defaultNumber: number = 5,
  defaultArray = [0, 0, 0, 0]
) => {
  return [
    {
      type: 'group',
      controls: [
        {
          type: 'number',
          name: name,
          hiddenOn: `Array.isArray(data.${name})`,
          label: label
        },
        {
          type: 'switch',
          name: name,
          label: labelForSwitch,
          pipeIn: (value: any) => {
            return Array.isArray(value);
          },
          pipeOut: (value: any, oldValue: any) => {
            return value ? defaultArray : defaultNumber;
          }
        }
      ]
    },

    {
      type: 'array',
      name: name,
      label: label,
      remark: '设置两个值将分别是上下、左右；设置四个值则分别是上、右、下、左',
      visibleOn: `Array.isArray(data.${name})`,
      minLength: 2,
      maxLength: 4,
      items: {
        type: 'number'
      }
    }
  ];
};

/**
 * 阴影相关的控件
 */
export const shadowControls = () => {
  return {
    type: 'fieldSet',
    title: '阴影',
    collapsable: true,
    collapsed: true,
    controls: [
      color('shadowColor', '阴影颜色'),
      number('shadowBlur', '阴影模糊大小'),
      number('shadowOffsetX', '阴影水平方向上的偏移距离'),
      number('shadowOffsetY', '阴影垂直方向上的偏移距离')
    ]
  };
};

/**
 * 关键字或数字，比如 fontWeight，可以是 normal，或者 100
 * @param name
 * @param label
 * @param labelForSwitch
 * @param keywordList
 */
export const keywordOrNumber = (
  name: string,
  label: string,
  labelForSwitch: string,
  keywordList: string[],
  defaultNumber: number = 100
) => {
  return {
    type: 'group',
    controls: [
      {
        type: 'switch',
        label: labelForSwitch,
        name: name,
        pipeIn: (value: any, data) => {
          if (typeof data[name] === 'undefined') {
            return false;
          }
          return typeof data[name] !== 'string';
        },
        pipeOut: (value: any, oldValue: any, data: any) => {
          if (value) {
            return defaultNumber;
          } else {
            return keywordList[0];
          }
        }
      },
      {
        type: 'number',
        name: name,
        visibleOn: `typeof(data.${name}) === 'number'`,
        label: label
      },
      {
        type: 'select',
        name: name,
        label: label,
        visibleOn: `typeof(data.${name}) === 'undefined' || typeof(data.${name}) === 'string'`,
        options: keywordList
      }
    ]
  };
};

/**
 * 关键字或布尔类型
 * @param name
 * @param label
 * @param labelForSwitch
 * @param keywordList
 */
export const keywordOrBoolean = (
  name: string,
  label: string,
  labelForSwitch: string,
  keywordList: string[],
  defaultBoolean: boolean = true
) => {
  return {
    type: 'group',
    controls: [
      {
        type: 'switch',
        label: labelForSwitch,
        name: name,
        pipeIn: (value: any, data) => {
          if (typeof data[name] === 'undefined') {
            return false;
          }
          return typeof data[name] !== 'string';
        },
        pipeOut: (value: any, oldValue: any, data: any) => {
          if (value) {
            return defaultBoolean;
          } else {
            return keywordList[0];
          }
        }
      },
      {
        type: 'switch',
        name: name,
        visibleOn: `typeof(data.${name}) === 'boolean'`,
        label: label
      },
      {
        type: 'select',
        name: name,
        label: label,
        visibleOn: `typeof(data.${name}) === 'undefined' || typeof(data.${name}) === 'string'`,
        options: keywordList
      }
    ]
  };
};

/**
 * 数字或百分比
 * @param name
 * @param label
 * @param labelForSwitch
 * @param keywordList
 */
export const numberOrPercentage = (
  name: string,
  label: string,
  labelForSwitch: string,
  defaultPercent: string = '100%',
  defaultNumber: number = 100
) => {
  return [
    {
      type: 'group',
      controls: [
        {
          type: 'switch',
          label: labelForSwitch,
          name: name,
          pipeIn: (value: any, data) => {
            if (typeof data[name] === 'undefined') {
              return false;
            }
            return typeof data[name] !== 'string';
          },
          pipeOut: (value: any) => {
            if (value) {
              return defaultNumber;
            } else {
              return defaultPercent;
            }
          }
        },
        {
          type: 'number',
          name: name,
          visibleOn: `typeof(data.${name}) === 'number'`,
          label: label
        },
        {
          type: 'text',
          name: name,
          label: label,
          visibleOn: `typeof(data.${name}) === 'undefined' || typeof(data.${name}) === 'string'`
        }
      ]
    }
  ];
};

/**
 * 生成文本样式的控件
 * @param name
 */
export const textStyleControls = (name: string, label: string) => {
  return createHierarchy(name, [
    {
      type: 'fieldSet',
      title: label,
      collapsable: true,
      controls: [
        color('color', `${label}文字的颜色`),
        select('fontStyle', `${label}文字字体的风格`, [
          'normal',
          'italic',
          'oblique'
        ]),
        keywordOrNumber(
          'fontWeight',
          `${label}文字字体的粗细`,
          '字体粗细格式使用数字',
          ['normal', 'bold', 'bolder', 'lighter']
        ),
        {
          type: 'text',
          name: 'fontFamily',
          label: `${label}文字的字体`,
          options: [
            'Arial',
            'Bookman',
            'Candara',
            'Courier New',
            'Courier',
            'Garamond',
            'Georgia',
            'Helvetica',
            'Impact',
            'Microsoft YaHei',
            'Monaco',
            'monospace',
            'Palatino',
            'Roboto',
            'sans-serif',
            'serif',
            'Times New Roman',
            'Verdana'
          ]
        },
        number('fontSize', `${label}文字的字体大小`),
        number('lineHeight', `${label}行高`, false),
        // TODO：用处不大，要不别支持了
        numberOrPercentage('width', '文字块宽度', '宽度使用数字'),
        numberOrPercentage('height', '文字块高度', '高度使用数字'),
        color('textBorderColor', '文字本身的描边颜色'),
        number('textBorderWidth', '文字本身的描边宽度'),
        color('textShadowColor', '文字本身的阴影颜色'),
        number('textShadowBlur', '文字本身的阴影长度'),
        number('textShadowOffsetX', '文字本身的阴影 X 偏移'),
        number('textShadowOffsetY', '文字本身的阴影 Y 偏移')
        // TODO: rich 暂时不支持
      ]
    }
  ]);
};
