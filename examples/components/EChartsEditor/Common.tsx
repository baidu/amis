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
    items: controls
  };
};

/**
 * 方便生成颜色类的控件
 * @param name
 * @param label
 */
export const color = (
  name: string,
  label: string,
  defaultColor?: string,
  labelRemark?: string
) => {
  return {
    type: 'color',
    format: 'rgba',
    pipeIn: (value: any) => {
      if (
        typeof value === 'undefined' &&
        defaultColor &&
        defaultColor !== 'null'
      ) {
        return defaultColor;
      }
      return value;
    },
    labelRemark: labelRemark
      ? {
          type: 'remark',
          content: labelRemark
        }
      : undefined,
    name: name,
    label: label
  };
};

/**
 * 默认值是 true 的 switch，并且 inline
 * @param name
 * @param label
 */
export const trueSwitch = (
  name: string,
  label: string,
  labelRemark?: string
) => {
  return {
    type: 'switch',
    name: name,
    mode: 'inline',
    className: 'w-full',
    label: label,
    labelRemark: labelRemark
      ? {
          type: 'remark',
          content: labelRemark
        }
      : undefined,
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
export const falseSwitch = (
  name: string,
  label: string,
  labelRemark?: string
) => {
  return {
    type: 'switch',
    name: name,
    mode: 'inline',
    className: 'w-full',
    labelRemark: labelRemark
      ? {
          type: 'remark',
          content: labelRemark
        }
      : undefined,
    label: label
  };
};

/**
 * 如果没数据就默认用第一个的 select
 * @param name
 * @param label
 * @param options
 */
export const select = (
  name: string,
  label: string,
  options: any[],
  labelRemark?: string
) => {
  return {
    type: 'select',
    name: name,
    label: label,
    labelRemark: labelRemark
      ? {
          type: 'remark',
          content: labelRemark
        }
      : undefined,
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
    mountOnEnter: true,
    body: controls
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
    body: controls
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
  labelRemark?: string,
  defaultNumber?: number,
  min: number = -1e4,
  max: number = 1e4,
  step: number = 1
) => {
  const control: any = {
    type: 'input-number',
    name: name,
    label: label
  };
  if (labelRemark) {
    control.labelRemark = {
      type: 'remark',
      content: labelRemark
    };
  }
  if (typeof defaultNumber !== 'undefined') {
    control.pipeIn = (value: any) => {
      if (typeof value === 'undefined') {
        return defaultNumber;
      }
      return value;
    };
  }
  control.min = min;
  control.max = max;
  control.step = step;
  return control;
};

/**
 * 生成文本控件
 * @param name
 * @param label
 * @param labelRemark
 * @param defaultText
 */
export const text = (
  name: string,
  label: string,
  labelRemark?: string,
  defaultText?: string
) => {
  const control: any = {
    type: 'input-text',
    name: name,
    label: label
  };
  if (labelRemark) {
    if (labelRemark) {
      control.labelRemark = {
        type: 'remark',
        content: labelRemark
      };
    }
  }
  if (typeof defaultText !== 'undefined') {
    control.pipeIn = (value: any) => {
      if (typeof value === 'undefined') {
        return defaultText;
      }
      return value;
    };
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
      visibleOn: `(typeof this.${name} === "undefined") || ((typeof this.${name} === "string") && (this.${name}.indexOf("%") === -1))`
    },
    {
      type: 'input-number',
      name: name,
      label: label,
      visibleOn: `(typeof this.${name} === "number")`
    },
    {
      type: 'input-text',
      name: name,
      label: label,
      visibleOn: `(typeof this.${name} === "string") && (this.${name}.indexOf("%") !== -1)`
    }
  ];
};

/**
 * 设置某个组件在容器中的距离
 * @param label 前缀
 * @param label 组件名
 */
export const viewport = (scope: string, label: string) => {
  return {
    type: 'fieldSet',
    title: '离容器边距',
    collapsable: true,
    collapsed: true,
    mountOnEnter: true,
    body: [
      ...viewportControl(
        `${scope}left`,
        `${label}离容器左侧的距离`,
        '左侧距离值类型',
        ['auto', 'left', 'center', 'right']
      ),
      ...viewportControl(
        `${scope}top`,
        `${label}离容器上侧的距离`,
        '上侧距离值类型',
        ['auto', 'top', 'middle', 'bottom']
      ),
      ...viewportControl(
        `${scope}right`,
        `${label}离容器右侧的距离`,
        '右侧距离值类型',
        ['auto']
      ),
      ...viewportControl(
        `${scope}bottom`,
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
    type: 'input-text',
    name: 'formatter',
    label: `格式化${label}文本`
  };
};

/**
 * selectedMode 的简便写法
 * @param label
 */
export const selectedMode = (label: string) => {
  return booleanOrKeyword('selectedMode', `${label}选择的模式`, [
    {label: '单选', value: 'single'},
    {label: '多选', value: 'multiple'}
  ]);
};

/**
 * 生成动画相关的控件
 * @param scope
 */
export const animation = (scope?: string, collapsed: boolean = true) => {
  let prefix = '';
  if (scope) {
    prefix = `${scope}.`;
  }
  const easing = [
    'linear',
    'quadraticIn',
    'quadraticOut',
    'quadraticInOut',
    'cubicIn',
    'cubicOut',
    'cubicInOut',
    'quarticIn',
    'quarticOut',
    'quarticInOut',
    'quinticIn',
    'quinticOut',
    'quinticInOut',
    'sinusoidalIn',
    'sinusoidalOut',
    'sinusoidalInOut',
    'exponentialIn',
    'exponentialOut',
    'exponentialInOut',
    'circularIn',
    'circularOut',
    'circularInOut',
    'elasticIn',
    'elasticOut',
    'elasticInOut',
    'backIn',
    'backOut',
    'backInOut',
    'bounceIn',
    'bounceOut',
    'bounceInOut'
  ];
  return fieldSet('动画', [
    trueSwitch(`${prefix}animation`, '是否开启动画'),
    visibleOn(`this.${prefix}animation`, [
      number(
        `${prefix}animationThreshold`,
        '是否开启动画的阈值',
        '当单个系列显示的图形数量大于这个阈值时会关闭动画',
        2000
      ),
      number(
        `${prefix}animationDuration`,
        '初始动画的时长',
        '支持回调函数，可以通过每个数据返回不同的时长实现更戏剧的初始动画效果，不过只能写代码',
        1000
      ),
      select(`${prefix}animationEasing`, '初始动画的缓动效果', easing),
      number(
        `${prefix}animationDelay`,
        '初始动画的延迟',
        '初始动画的延迟，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果',
        0
      )
    ]),
    number(
      `${prefix}animationDurationUpdate`,
      '数据更新动画的时长',
      '支持回调函数，可以通过每个数据返回不同的时长实现更戏剧的更新动画效果',
      200
    ),
    select(`${prefix}animationEasingUpdate`, '数据更新动画的缓动效果', easing),
    number(
      `${prefix}animationDelayUpdate`,
      '数据更新动画的延迟',
      '支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的更新动画效果'
    )
  ]);
};

/**
 * icon 的简版写法
 */
export const icon = (label: string) => {
  return keywordOrString(
    'icon',
    `${label}的 icon`,
    '切换类型为 url',
    [
      'circle',
      'rect',
      'roundRect',
      'triangle',
      'diamond',
      'pin',
      'arrow',
      'none'
    ],
    'image://http://',
    `可以通过 'image://url' 设置为图片，其中 URL 为图片的链接，或者 dataURI。

  URL 为图片链接例如：

  'image://http://xxx.xxx.xxx/a/b.png'
  URL 为 dataURI 例如：

  'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
  可以通过 'path://' 将图标设置为任意的矢量路径。这种方式相比于使用图片的方式，不用担心因为缩放而产生锯齿或模糊，而且可以设置为任意颜色。路径图形会自适应调整为合适的大小。路径的格式参见 SVG PathData。可以从 Adobe Illustrator 等工具编辑导出。`
  );
};

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
      body: [
        {
          type: 'input-number',
          name: name,
          hiddenOn: `Array.isArray(this.${name})`,
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
      type: 'input-array',
      name: name,
      label: label,
      labelRemark:
        '设置两个值将分别是上下、左右；设置四个值则分别是上、右、下、左',
      visibleOn: `Array.isArray(this.${name})`,
      minLength: 2,
      maxLength: 4,
      items: {
        type: 'input-number'
      }
    }
  ];
};

/**
 * 用于生成类似 padding 那种可以是数字或数组的控件
 * @param name
 * @param label
 * @param labelForSwitch 切换按钮的文字
 * @param labelRemark remark
 * @param defaultNumber 默认数字
 * @param defaultArray 默认数组
 */
export const vector = (
  name: string,
  label: string,
  labelForSwitch: string,
  labelRemark?: string,
  defaultNumber: number = 0,
  defaultArray = [0, 0, 0, 0]
) => {
  return [
    {
      type: 'input-array',
      name: name,
      label: label,
      visibleOn: `Array.isArray(this.${name})`,
      minLength: 2,
      maxLength: 4,
      items: {
        type: 'input-number'
      }
    },
    {
      type: 'group',
      body: [
        {
          type: 'input-number',
          name: name,
          hiddenOn: `Array.isArray(this.${name})`,
          label: label
        },
        {
          type: 'switch',
          name: name,
          label: labelForSwitch,
          pipeIn: (value: any) => {
            return Array.isArray(value);
          },
          pipeOut: (value: any) => {
            return value ? defaultArray : defaultNumber;
          },
          labelRemark: labelRemark
            ? {
                type: 'remark',
                content: labelRemark
              }
            : undefined
        }
      ]
    }
  ];
};

/**
 * 阴影相关的控件
 */
export const shadowControls = (scope: string) => {
  return {
    type: 'fieldSet',
    title: '阴影',
    collapsable: true,
    collapsed: true,
    mountOnEnter: true,
    body: [
      color(`${scope}shadowColor`, '阴影颜色'),
      number(`${scope}shadowBlur`, '阴影模糊大小'),
      number(`${scope}shadowOffsetX`, '阴影水平方向上的偏移距离'),
      number(`${scope}shadowOffsetY`, '阴影垂直方向上的偏移距离')
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
    body: [
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
        type: 'input-number',
        name: name,
        visibleOn: `typeof(this.${name}) === 'number'`,
        label: label
      },
      {
        type: 'select',
        name: name,
        label: label,
        visibleOn: `typeof(this.${name}) === 'undefined' || typeof(this.${name}) === 'string'`,
        options: keywordList
      }
    ]
  };
};

/**
 * 可以是关键字或者是字符串
 * @param name
 * @param label
 * @param labelForSwitch
 * @param keywordList
 * @param remark
 */
export const keywordOrString = (
  name: string,
  label: string,
  labelForSwitch: string,
  keywordList: string[],
  defaultString: string = '',
  remark?: string
) => {
  return {
    type: 'group',
    body: [
      {
        type: 'switch',
        label: labelForSwitch,
        name: name,
        pipeIn: (value: any) => {
          if (typeof value === 'undefined') {
            return false;
          }
          return keywordList.indexOf(value) === -1;
        },
        pipeOut: (value: any, oldValue: any, data: any) => {
          if (value) {
            return defaultString;
          } else {
            return keywordList[0];
          }
        },
        labelRemark: remark
      },
      {
        type: 'input-text',
        name: name,
        visibleOn: `this.${name} && ${JSON.stringify(
          keywordList
        )}.indexOf(this.${name}) === -1`,
        label: label
      },
      {
        type: 'select',
        name: name,
        label: label,
        visibleOn: `typeof(this.${name}) === 'undefined' || ${JSON.stringify(
          keywordList
        )}.indexOf(this.${name}) !== -1`,
        options: keywordList
      }
    ]
  };
};

/**
 * 对象或者对象数组
 * TODO: 这样会造成配置项 double，是否有更好的方法？
 * @param name
 * @param label
 * @param labelForSwitch
 * @param keywordList
 * @param controls
 */
export const objectOrArray = (
  name: string,
  labelForSwitch: string,
  controls: any[]
) => {
  return [
    {
      type: 'switch',
      label: labelForSwitch,
      mode: 'inline',
      name: name,
      pipeIn: (value: any) => {
        if (typeof value === 'undefined') {
          return false;
        }
        return Array.isArray(value);
      },
      pipeOut: (value: any, oldValue: any, data: any) => {
        if (value) {
          if (data[name]) {
            return [data[name]];
          }
          return [{}];
        } else {
          if (data[name] && Array.isArray(data[name])) {
            return data[name][0];
          }
          return {};
        }
      }
    },
    {
      type: 'combo',
      name: name,
      label: '',
      noBorder: true,
      multiLine: true,
      visibleOn: `typeof(this.${name}) === 'undefined' || !Array.isArray(this.${name})`,
      multiple: false,
      items: controls
    },
    {
      type: 'combo',
      name: name,
      label: '',
      noBorder: true,
      multiLine: true,
      visibleOn: `Array.isArray(this.${name})`,
      multiple: true,
      items: controls
    }
  ];
};

/**
 * 常见样式设置
 * @param label
 */
export const commonStyle = (scope: string, label: string) => {
  return [
    color(`${scope}backgroundColor`, `${label}背景色，默认透明`),
    color(`${scope}borderColor`, `${label}的边框颜色`),
    number(`${scope}borderWidth`, `${label}的边框线宽`),
    ...numberOrArray(
      `${scope}borderRadius`,
      '圆角半径',
      '单独设置每个圆角半径'
    ),
    shadowControls(scope)
  ];
};

/**
 * 布尔类型或关键字，优先布尔类型
 * @param name
 * @param label
 * @param keywordList
 */
export const booleanOrKeyword = (
  name: string,
  label: string,
  keywordList: any[],
  defaultBoolean: boolean = true
) => {
  return {
    type: 'select',
    name: name,
    label: label,
    pipeIn: (value: any) => {
      if (typeof value === 'undefined') {
        return defaultBoolean ? 'true' : 'false';
      }
      return value;
    },
    pipeOut: (value: any) => {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else {
        return value;
      }
    },
    options: [
      {label: '开启', value: 'true'},
      {label: '关闭', value: 'false'},
      ...keywordList
    ]
  };
};

/**
 * enum 辅助方法
 * @param name
 * @param label
 * @param keywordList
 */
export const enumControl = (
  name: string,
  label: string,
  keywordList: any[],
  defaultValue: string,
  labelRemark?: string
) => {
  return {
    type: 'select',
    name: name,
    label: label,
    labelRemark: labelRemark
      ? {
          type: 'remark',
          content: labelRemark
        }
      : undefined,
    pipeIn: (value: any) => {
      if (typeof value === 'undefined') {
        defaultValue;
      }
      if (value === true) {
        return 'true';
      }
      if (value === false) {
        return 'false';
      }
      return value;
    },
    pipeOut: (value: any) => {
      if (value === 'true') {
        return true;
      } else if (value === 'false') {
        return false;
      } else {
        return value;
      }
    },
    options: keywordList
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
  labelRemark?: string,
  defaultPercent: string = '1%',
  defaultNumber: number = 100
) => {
  return [
    {
      type: 'group',
      body: [
        {
          type: 'switch',
          label: labelForSwitch,
          name: name,
          pipeIn: (value: any) => {
            if (typeof value === 'undefined') {
              return false;
            }
            return typeof value !== 'string';
          },
          pipeOut: (value: any) => {
            if (value) {
              return defaultNumber;
            } else {
              return defaultPercent;
            }
          },
          labelRemark: labelRemark
            ? {
                type: 'remark',
                content: labelRemark
              }
            : undefined
        },
        {
          type: 'input-number',
          name: name,
          visibleOn: `typeof(this.${name}) === 'number'`,
          label: label
        },
        {
          type: 'input-text',
          name: name,
          label: label,
          visibleOn: `typeof(this.${name}) === 'undefined' || typeof(this.${name}) === 'string'`
        }
      ]
    }
  ];
};

/**
 * 生成文本样式的控件
 * @param scope
 */
export const textStyleControls = (scope: string, label: string) => {
  return createHierarchy(scope, [
    {
      type: 'fieldSet',
      title: label,
      collapsable: true,
      body: [
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
          type: 'input-text',
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
        number('lineHeight', `${label}行高`),
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

// 对于一些没正确识别的 label 手动处理
const FIX_LABEL = {
  symbolKeepAspect: '是否在缩放时保持该图形的长宽比',
  pageIcons: '图例控制块的图标',
  pageIconColor: '翻页按钮的颜色',
  pageIconInactiveColor: '翻页按钮不激活时（即翻页到头时）的颜色',
  pageIconSize: '翻页按钮的大小',
  scrollDataIndex: '图例当前最左上显示项的 dataIndex',
  pageButtonItemGap: '图例控制块中，按钮和页信息之间的间隔',
  pageButtonGap: '图例控制块和图例项之间的间隔',
  pageButtonPosition: '图例控制块的位置',
  pageFormatter: '图例控制块中，页信息的显示格式',
  appendToBody: '是否添加为 HTML 的 <body> 的子节点'
};

/**
 * 构建某个基于文档的控件
 * @param name
 * @param option
 */
const buildOneOption = (scope: string, name: string, option: any) => {
  if (name.indexOf('<') !== -1) {
    return;
  }
  if (name.indexOf('.0') != -1) {
    return;
  }
  if (name.indexOf('.1') != -1) {
    return;
  }
  const desc = option.desc.trim();
  const uiControl = option.uiControl;
  if (!desc) {
    console.warn('must have desc', name);
    return false;
  }
  const descSplit = desc.split('。');
  let label = descSplit[0]
    .trim()
    .replace('<p>', '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, '')
    .replace(/<\/?[^>]+(>|$)/g, '');

  let remark =
    descSplit.length > 1 ? descSplit[1].trim().replace('</p>', '') : '';
  // 有些描述太长了，再通过逗号拆分一下
  const labelSplitComma = label.split('，');
  if (labelSplitComma.length > 1) {
    label = labelSplitComma[0];
    remark = labelSplitComma[1] + remark;
  }

  if (name in FIX_LABEL) {
    label = FIX_LABEL[name];
  }

  remark = `「${name}」${remark}`;

  name = scope + name;
  if (!uiControl || !uiControl.type) {
    // 这种可能只有 desc
    return text(name, label, remark);
  }
  const uiControlType = uiControl.type;
  if (uiControlType === 'boolean') {
    if (uiControl.default) {
      return trueSwitch(name, label, remark);
    } else {
      return falseSwitch(name, label, remark);
    }
  } else if (uiControlType === 'color') {
    return color(name, label, uiControl.default, remark);
  } else if (uiControlType === 'number' || uiControlType === 'angle') {
    const defaultValue =
      typeof uiControl.default === 'undefined' ? 0 : +uiControl.default;
    const min = typeof uiControl.min === 'undefined' ? -1e4 : +uiControl.min;
    const max = typeof uiControl.max === 'undefined' ? 1e4 : +uiControl.max;
    const step = typeof uiControl.step === 'undefined' ? 1 : +uiControl.step;
    return number(name, label, remark, defaultValue, min, max, step);
  } else if (uiControlType === 'percent') {
    return numberOrPercentage(name, label, '使用绝对值', remark);
  } else if (uiControlType === 'enum') {
    if (uiControl.options) {
      return enumControl(
        name,
        label,
        uiControl.options.split(',').map((item: string) => item.trim()),
        uiControl.default,
        remark
      );
    } else {
      console.warn('enum do not have options, fallback to text', name);
      return text(name, label, remark);
    }
  } else if (uiControlType === 'vector') {
    return vector(name, label, '单独设置', remark);
  } else if (uiControlType === 'percentvector') {
    // TODO: 可能需要特殊处理
    // return vector(name, label, '单独设置', remark);
  } else if (uiControlType === 'text') {
    // return text(name, label, remark, uiControl.default);
  } else {
    console.warn('unknow type', name, uiControlType);
  }
};

export const buildGroupOptions = (
  scope: string,
  parentName: string,
  options: any
) => {
  let controls = [];
  for (const name in options) {
    if (name.startsWith(parentName + '.')) {
      const control = buildOneOption(scope, name, options[name]);
      if (control) {
        if (Array.isArray(control)) {
          controls = controls.concat(control);
        } else {
          controls.push(control);
        }
      }
    }
  }
  return controls;
};

/**
 * 基于 ECharts 文档的数据构建控件，对常见元素做分组
 * @param scope 前缀，虽然可以用 combo，但加前缀可以方便 debug，空字符串就是没前缀
 * @param options
 */
export const buildOptions = (scope: string, options: any) => {
  const commonStyleKeys = new Set([
    'backgroundColor',
    'borderColor',
    'borderWidth',
    'borderRadius'
  ]);

  const viewportKeys = new Set(['left', 'top', 'right', 'bottom']);

  // 没啥用的
  const uselessKeys = new Set(['id', 'z', 'zlevel']);

  let controls = [];

  // 有些属性有深层结构，对它们进行特殊处理，使用 fieldSet 来自动折叠
  const groupKeys = new Set();

  for (const name in options) {
    if (name.indexOf('.') !== -1) {
      groupKeys.add(name.split('.')[0]);
    }
  }

  for (const name in options) {
    // if (!name.startsWith('label.padding')) {
    //   continue; // 用于开发时单独测试某个属性
    // }
    // 这些样式单独处理或忽略
    if (
      commonStyleKeys.has(name) ||
      viewportKeys.has(name) ||
      uselessKeys.has(name)
    ) {
      continue;
    }
    if (
      name.startsWith('textStyle') ||
      name.startsWith('subtextStyle') ||
      name.startsWith('pageTextStyle') ||
      name.startsWith('animation')
    ) {
      continue;
    }
    // TODO: 后续单独处理
    if (name === 'data' || name === 'tooltip') {
      continue;
    }

    if (groupKeys.has(name)) {
      controls.push(
        fieldSet(name, buildGroupOptions(scope, name, options), true)
      );
    }

    if (name.indexOf('.') !== -1) {
      // 前面已经处理了
      continue;
    }

    const control = buildOneOption(scope, name, options[name]);

    if (control) {
      if (Array.isArray(control)) {
        controls = controls.concat(control);
      } else {
        controls.push(control);
      }
    } else {
      console.warn('build control error', name);
    }
  }

  return controls;
};
