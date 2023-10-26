import {
  setSchemaTpl,
  getSchemaTpl,
  defaultValue,
  tipedLabel
} from 'amis-editor-core';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import compact from 'lodash/compact';

/**
 * 布局相关配置项
 * 备注: 当前合计新增22个布局相关配置项，详细如下：
 * 一、布局容器新增「定位模式」配置项，可选择：默认、相对、绝对、固定，其中绝对和固定可实现特殊布局（fixed：吸顶元素、吸底元素，不随指定页面内容滚动）；
 * 1. 相对、绝对和固定布局 均提供 「inset 配置项」（top、right、bottom、left）；
 * 2. 列级容器（布局容器中的直接子容器，比如 wrapper，container、嵌套布局容器）增加 「弹性模式」（固定宽度、弹性宽度）、「展示模式」（默认、弹性布局）、「默认宽度」配置项；
 * 3. 开启 弹性模式 后，增加 「占比设置」配置项；
 * 4. 展示模式 设置为 弹性布局（flex布局）后，新增 「排列方向」、「水平对齐方式」、「垂直对齐方式」、「自动换行」配置项；
 * 5. 相对、绝对和固定布局 均提供「层级」配置项（z-index）；
 * 备注：目前主要针对 布局容器（flex）、容器（container）和 包裹 （wrapper） 增加以上配置项。（布局容器 是 之前的 Flex 布局 组件 的升级版）
 *
 * 二、布局容器（flex）、容器（container）可通过以下新增配置项，实现滚动展示、居中展示等布局；
 * 1. 新增是否「固定高度」，设置成固定高度，则增加 「高度」配置项、「y轴滚动」模式配置；
 * 2. 新增是否「固定宽度」，设置成固定宽度，则增加「宽度」配置项、「x轴滚动」模式配置；
 * 3. 非固定宽度，新增「最大宽度」、「最小宽度」配置项；
 * 4. 非固定高度，新增「最大高度」、「最小高度」配置项；
 * 5. 设置了 固定宽度 或者 最大宽度时，新增「居中显示」配置项；
 */

// 默认支持的单位
const LayoutUnitOptions = ['px', '%', 'em', 'vh', 'vw'];

// 定位模式
setSchemaTpl(
  'layout:position',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string; // 用于控制显示的表达式
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label || tipedLabel('定位模式', '指定当前容器元素的定位类型'),
      name: config?.name || 'style.position',
      value: config?.value || 'static',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value === 'static') {
          form.setValueByName('style.inset', undefined);
          form.setValueByName('style.zIndex', undefined);
          form.setValueByName('originPosition', undefined);
        } else if (value === 'fixed' || value === 'absolute') {
          // 默认使用右下角进行相对定位
          form.setValueByName('style.inset', 'auto 50px 50px auto');
          form.setValueByName('originPosition', 'right-bottom');
        } else if (value === 'relative') {
          form.setValueByName('style.inset', 'auto');
          form.setValueByName('originPosition', undefined);
        }
        if (value !== 'sticky') {
          // 非滚动吸附定位
          form.setValueByName('stickyStatus', undefined);
        }
      },
      options: [
        {
          label: '默认(static)',
          value: 'static'
        },
        {
          label: '相对(relative)',
          value: 'relative'
        },
        {
          label: '固定(fixed)',
          value: 'fixed'
        },
        {
          label: '绝对(absolute)',
          value: 'absolute'
        }
      ]
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// inset 配置:
setSchemaTpl(
  'layout:inset',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
  }) => {
    const configSchema = {
      type: 'inset-box-model',
      label:
        config?.label ||
        tipedLabel(
          '布局位置',
          '指定当前容器元素的定位位置，用于配置 top、right、bottom、left。'
        ),
      name: config?.name || 'style.inset',
      value: config?.value || 'auto',
      visibleOn:
        config?.visibleOn ??
        'data.style && data.style.position && data.style.position !== "static"',
      pipeIn: (value: any) => {
        let curValue = value || 'auto';
        if (isNumber(curValue)) {
          curValue = curValue.toString();
        }
        if (!isString(curValue)) {
          curValue = '0';
        }
        const inset = curValue.split(' ');
        return {
          insetTop: inset[0] || 'auto',
          insetRight: inset[1] || 'auto',
          insetBottom: inset[2] || inset[0] || 'auto',
          insetLeft: inset[3] || inset[1] || 'auto'
        };
      },
      pipeOut: (value: any) => {
        return `${value.insetTop ?? 'auto'} ${value.insetRight ?? 'auto'} ${
          value.insetBottom ?? 'auto'
        } ${value.insetLeft ?? 'auto'}`;
      }
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// z-index 配置:
setSchemaTpl(
  'layout:z-index',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel(
          '显示层级',
          '指定元素的堆叠顺序，层级高的元素总是会处于较低层级元素的上面。'
        ),
      name: config?.name || 'style.zIndex',
      value: config?.value,
      visibleOn:
        config?.visibleOn ??
        'data.style && data.style.position && data.style.position !== "static"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// 显示类型
setSchemaTpl(
  'layout:display',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    isFlexItem?: boolean;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    flexHide?: boolean;
  }) => {
    const configOptions = compact([
      {
        label: '块级(block)',
        icon: 'block-display',
        value: 'block'
      },
      {
        label: '行内区块(inline-block)',
        icon: 'inline-block-display',
        value: 'inline-block'
      },
      {
        label: '行内元素(inline)',
        icon: 'inline-display',
        value: 'inline'
      },
      !config?.flexHide && {
        label: '弹性布局(flex)',
        icon: 'flex-display',
        value: 'flex'
      }
    ]);
    const configSchema = {
      type: 'icon-button-group',
      label:
        config?.label ||
        tipedLabel(
          '显示类型',
          '默认为块级，可设置为弹性布局模式（flex布局容器）'
        ),
      name: config?.name || 'style.display',
      value: config?.value || 'block',
      visibleOn: config?.visibleOn,
      options: configOptions,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value !== 'flex' && value !== 'inline-flex') {
          form.setValueByName('style.flexDirection', undefined);
          form.setValueByName('style.justifyContent', undefined);
          form.setValueByName('style.alignItems', undefined);
          form.setValueByName('style.flexWrap', undefined);
        }
      }
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// 主轴排列方向
setSchemaTpl(
  'layout:justifyContent',
  (config?: {
    mode?: string; // 自定义展示默认值，上下展示: vertical, 左右展示: horizontal
    label?: string; // 表单项 label
    name?: string; // 表单项 name
    value?: string;
    options?: any;
    visibleOn?: string; // 用于控制显示的表达式
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const defaultOptions = [
      {
        label: '起始端对齐',
        value: 'flex-start'
      },
      {
        label: '居中对齐',
        value: 'center'
      },
      {
        label: '末尾端对齐',
        value: 'flex-end'
      },
      {
        label: '均匀分布（首尾留空）',
        value: 'space-around'
      },
      {
        label: '均匀分布（首尾对齐）',
        value: 'space-between'
      },
      {
        label: '均匀分布（元素等间距）',
        value: 'space-evenly'
      },
      {
        label: '均匀分布（自动拉伸）',
        value: 'stretch'
      }
    ];

    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(`水平对齐方式`, '设置子元素在主轴上的对齐方式'),
      name: config?.name || 'style.justifyContent',
      value: config?.value || 'flex-start',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: config?.options || defaultOptions
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// 交叉轴排列方向
setSchemaTpl(
  'layout:alignItems',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    options?: any;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const defaultOptions = [
      {
        label: '起始端对齐',
        value: 'flex-start'
      },
      {
        label: '居中对齐',
        value: 'center'
      },
      {
        label: '末尾端对齐',
        value: 'flex-end'
      },
      {
        label: '基线对齐',
        value: 'baseline'
      },
      {
        label: '自动拉伸',
        value: 'stretch'
      }
    ];

    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(`垂直对齐方式`, '设置子元素在交叉轴上的对齐方式'),
      name: config?.name || 'style.alignItems',
      value: config?.value || 'stretch', // 如果项目未设置高度或设为auto，将占满整个容器的高度。
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: config?.options || defaultOptions
    };

    if (config?.mode === 'vertical') {
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      return configSchema;
    }
  }
);

// 排列方向
setSchemaTpl(
  'layout:flexDirection',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          '排列方向',
          '设置成水平排列方向，则从左到右放置子项；设置成垂直排列方向，则从上到下放置子项'
        ),
      name: config?.name || 'style.flexDirection',
      value: config?.value || 'row',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '水平',
          value: 'row'
        },
        {
          label: '水平（起点在右端）',
          value: 'row-reverse'
        },
        {
          label: '垂直',
          value: 'column'
        },
        {
          label: '垂直（起点在下沿）',
          value: 'column-reverse'
        }
      ]
    };

    if (config?.mode === 'vertical') {
      // 上下展示，可避免 自定义渲染器 出现挤压
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      // 默认左右展示
      return configSchema;
    }
  }
);

// 如何换行
setSchemaTpl(
  'layout:flex-wrap',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label: config?.label || '如何换行',
      name: config?.name || 'style.flexWrap',
      value: config?.value || 'nowrap',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '不换行(默认)',
          value: 'nowrap'
        },
        {
          label: '自动换行',
          value: 'wrap'
        },
        {
          label: '自动换行（颠倒）',
          value: 'wrap-reverse'
        }
      ]
    };
  }
);

// 弹性模式
setSchemaTpl(
  'layout:flex',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    isFlexColumnItem?: boolean;
    onText?: string;
    offText?: string;
  }) => {
    return {
      type: 'button-group-select',
      size: 'xs',
      name: config?.name || 'style.flex',
      options: [
        {
          label: '弹性',
          value: '1 1 auto'
        },
        {
          label: '固定',
          value: '0 0 150px'
        },
        {
          label: '适配',
          value: '0 0 auto'
        }
      ],
      label: config?.label || '弹性设置',
      value: config?.value || '0 0 auto',
      inputClassName: 'inline-flex justify-between',
      visibleOn: config?.visibleOn,
      onChange: (value: any, oldValue: boolean, model: any, form: any) => {
        if (value === '1 1 auto') {
          // 弹性
          if (config?.isFlexColumnItem) {
            // form.setValueByName('style.overflowY', 'auto');
            form.setValueByName('style.height', undefined);
          } else {
            // form.setValueByName('style.overflowX', 'auto');
            form.setValueByName('style.width', undefined);
          }
        } else if (value === '0 0 150px') {
          // 固定
          form.setValueByName('style.flexGrow', undefined);
          form.setValueByName('style.flexBasis', '150px');

          if (config?.isFlexColumnItem) {
            form.setValueByName('style.height', undefined);
          } else {
            form.setValueByName('style.width', undefined);
          }
        } else if (value === '0 0 auto') {
          // 适配
          form.setValueByName('style.flexGrow', undefined);
          form.setValueByName('style.flexBasis', undefined);
          form.setValueByName('style.overflowX', undefined);
          form.setValueByName('style.overflowY', undefined);
          form.setValueByName('style.overflow', undefined);

          if (config?.isFlexColumnItem) {
            form.setValueByName('style.height', undefined);
          } else {
            form.setValueByName('style.width', undefined);
          }
        }
      }
    };
  }
);

// flex-basis设置
setSchemaTpl(
  'layout:flex-basis',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: tipedLabel(
        config?.label || '默认宽度',
        '在分配多余空间之前，其默认占据的主轴空间（main size）'
      ),
      name: config?.name || 'style.flexBasis',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn,
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// flex-grow 弹性比例
setSchemaTpl(
  'layout:flex-grow',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-range',
      max: 12,
      step: 1,
      label:
        config?.label ||
        tipedLabel(
          '弹性比例',
          '定义项目的放大比例，如果设置为0，即使父容器存在剩余空间，也不放大。'
        ),
      name: config?.name || 'style.flexGrow',
      value: config?.value || 1,
      visibleOn:
        config?.visibleOn || 'data.style && data.style.flex !== "0 0 auto"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut
    };
  }
);

// 是否固定宽度: isFixedWidth 配置:
setSchemaTpl(
  'layout:isFixedWidth',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    onChange?: (value: boolean) => void;
  }) => {
    return {
      type: 'button-group-select',
      label: config?.label || '宽度设置',
      size: 'xs',
      name: config?.name || 'isFixedWidth',
      options: [
        {
          label: '固定',
          value: true
        },
        {
          label: '适配',
          value: false
        }
      ],
      value: config?.value ?? false,
      visibleOn: config?.visibleOn,
      inputClassName: 'inline-flex justify-between',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
        if (value) {
          // 固定宽度时，剔除最大宽度、最小宽度
          form.setValueByName('style.maxWidth', undefined);
          form.setValueByName('style.minWidth', undefined);
        } else {
          // 非固定宽度时，剔除宽度数值
          form.setValueByName('style.width', undefined);
        }
        if (config?.onChange) {
          config.onChange(value);
        }
      }
    };
  }
);

// 宽度设置
setSchemaTpl(
  'layout:width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || '宽度',
      name: config?.name || 'style.width',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && data.isFixedWidth`
        : 'data.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// 宽度设置(不关联固定宽度配置项)
setSchemaTpl(
  'layout:width:v2',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || '宽度',
      name: config?.name || 'style.width',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn || true,
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut,
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// 最大宽度设置
setSchemaTpl(
  'layout:max-width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel('最大宽度', '最大宽度即当前元素最大的水平展示区域'),
      name: config?.name || 'style.maxWidth',
      value: config?.value,
      min: '${style.minWidth | toInt}',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && !data.isFixedWidth`
        : '!data.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// 最小宽度设置
setSchemaTpl(
  'layout:min-width',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel('最小宽度', '最小宽度即当前元素最小的水平展示区域'),
      name: config?.name || 'style.minWidth',
      value: config?.value,
      max: '${style.maxWidth | toInt}',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && !data.isFixedWidth`
        : '!data.isFixedWidth',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// x轴（水平轴）滚动模式
setSchemaTpl(
  'layout:overflow-x',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(' x轴滚动模式', '用于设置水平方向的滚动模式'),
      name: config?.name || 'style.overflowX',
      value: config?.value || 'visible',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '超出显示',
          value: 'visible'
        },
        {
          label: '超出隐藏',
          value: 'hidden'
        },
        {
          label: '滚动显示',
          value: 'scroll'
        },
        {
          label: '自动适配',
          value: 'auto'
        }
      ]
    };
  }
);

// 是否固定高度: isFixedHeight 配置:
setSchemaTpl(
  'layout:isFixedHeight',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
    onChange?: (value: boolean) => void;
  }) => {
    return {
      type: 'button-group-select',
      label: config?.label || '高度设置',
      size: 'xs',
      name: config?.name || 'isFixedHeight',
      options: [
        {
          label: '固定',
          value: true
        },
        {
          label: '适配',
          value: false
        }
      ],
      value: config?.value ?? false,
      visibleOn: config?.visibleOn,
      inputClassName: 'inline-flex justify-between',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
        if (value) {
          // 固定高度时，剔除最大高度、最小高度
          form.setValueByName('style.maxHeight', undefined);
          form.setValueByName('style.minHeight', undefined);
        } else {
          // 非固定高度时，剔除高度数值
          form.setValueByName('style.height', undefined);
        }
        if (config?.onChange) {
          config.onChange(value);
        }
      }
    };
  }
);

// 高度设置
setSchemaTpl(
  'layout:height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label: config?.label || '高度',
      name: config?.name || 'style.height',
      value: config?.value || '300px',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && data.isFixedHeight`
        : 'data.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// 最大高度设置
setSchemaTpl(
  'layout:max-height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel('最大高度', '最大高度即当前元素最多的展示高度'),
      name: config?.name || 'style.maxHeight',
      value: config?.value,
      min: '${style.minHeight | toInt}',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && !data.isFixedHeight`
        : '!data.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// 最小高度设置
setSchemaTpl(
  'layout:min-height',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    unitOptions?: Array<string>;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-number',
      label:
        config?.label ||
        tipedLabel('最小高度', '最小高度即当前元素最小的垂直展示区域'),
      name: config?.name || 'style.minHeight',
      value: config?.value,
      max: '${style.maxHeight | toInt}',
      visibleOn: config?.visibleOn
        ? `${config?.visibleOn} && !data.isFixedHeight`
        : '!data.isFixedHeight',
      clearable: true,
      unitOptions: config?.unitOptions ?? LayoutUnitOptions,
      pipeIn: config?.pipeIn,
      // pipeOut: config?.pipeOut
      pipeOut: (value: string) => {
        const curValue = parseInt(value);
        if (value === 'auto' || curValue || curValue === 0) {
          return value;
        } else {
          return undefined;
        }
      }
    };
  }
);

// y轴（交叉轴）滚动模式
setSchemaTpl(
  'layout:overflow-y',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(' y轴滚动模式', '用于设置垂直方向的滚动模式'),
      name: config?.name || 'style.overflowY',
      value: config?.value || 'visible',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '超出显示',
          value: 'visible'
        },
        {
          label: '超出隐藏',
          value: 'hidden'
        },
        {
          label: '滚动显示',
          value: 'scroll'
        },
        {
          label: '自动适配',
          value: 'auto'
        }
      ]
    };
  }
);

// 居中显示
setSchemaTpl(
  'layout:margin-center',
  (config?: {
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'button-group-select',
      size: 'xs',
      label:
        config?.label ||
        tipedLabel(
          '对齐方式',
          '通过 margin 数值来设置对齐方式，其中 margin: 0 auto 用于设置居中对齐'
        ),
      name: config?.name || 'style.margin',
      value: config?.value || '0',
      inputClassName: 'inline-flex justify-between',
      visibleOn:
        config?.visibleOn ??
        'data.isFixedWidth || data.style && data.style.maxWidth',
      options: [
        {
          label: '靠左',
          value: 'auto auto auto 0px'
        },
        {
          label: '居中',
          value: '0px auto'
        },
        {
          label: '靠右',
          value: 'auto 0px auto auto'
        }
      ],
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (
          form?.data?.style?.position === 'fixed' ||
          form?.data?.style?.position === 'absolute'
        ) {
          // 吸附容器
          if (value === '0px auto') {
            // 居中
            if (form.data?.sorptionPosition === 'top') {
              // 吸顶
              form.setValueByName('style.inset', '0px auto auto 50%');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // 吸底
              form.setValueByName('style.inset', 'auto auto 0px 50%');
            } else {
              form.setValueByName('style.inset', 'auto auto auto 50%');
            }
            form.setValueByName('style.transform', 'translateX(-50%)');
          } else if (value === 'auto 0px auto auto') {
            // 靠右
            if (form.data?.sorptionPosition === 'top') {
              // 吸顶
              form.setValueByName('style.inset', '0px 0px auto auto');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // 吸底
              form.setValueByName('style.inset', 'auto 0px 0px auto');
            } else {
              form.setValueByName('style.inset', 'auto 0px auto auto');
            }
            form.setValueByName('style.transform', undefined);
          } else {
            // 靠左
            if (form.data?.sorptionPosition === 'top') {
              // 吸顶
              form.setValueByName('style.inset', '0px auto auto 0px');
            } else if (form.data?.sorptionPosition === 'bottom') {
              // 吸底
              form.setValueByName('style.inset', 'auto auto 0px 0px');
            } else {
              form.setValueByName('style.inset', 'auto auto auto 0px');
            }
            form.setValueByName('style.transform', undefined);
          }
        } else {
          // 靠左
          form.setValueByName('style.transform', undefined);
        }
      }
    };
  }
);

//「参考位置」可设置为左上角、右上角、右下角、左下角，默认为“右下角”。
setSchemaTpl(
  'layout:originPosition',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string;
    visibleOn?: string | boolean;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label:
        config?.label ||
        tipedLabel(
          '参考位置',
          '可设置为左上角、右上角、右下角、左下角，默认为右下角'
        ),
      name: config?.name || 'originPosition',
      value: config?.value || 'right-bottom',
      visibleOn:
        config?.visibleOn ??
        'data.style && data.style.position && (data.style.position === "fixed" || data.style.position === "absolute")',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '左上角',
          value: 'left-top'
        },
        {
          label: '右上角',
          value: 'right-top'
        },
        {
          label: '右下角(默认)',
          value: 'right-bottom'
        },
        {
          label: '左下角',
          value: 'left-bottom'
        }
      ],
      onChange: (value: string, oldValue: string, model: any, form: any) => {
        if (value === 'right-bottom') {
          // 右下角
          form.setValueByName('style.inset', 'auto 50px 50px auto');
        } else if (value === 'left-top') {
          // 左上角
          form.setValueByName('style.inset', '50px auto auto 50px');
        } else if (value === 'right-top') {
          // 右上角
          form.setValueByName('style.inset', '50px 50px auto auto');
        } else if (value === 'left-bottom') {
          // 左下角
          form.setValueByName('style.inset', 'auto auto 50px 50px');
        }
      }
    };

    if (config?.mode === 'vertical') {
      return {
        type: 'group',
        mode: 'vertical',
        visibleOn: config?.visibleOn,
        body: [
          {
            ...configSchema
          }
        ]
      };
    } else {
      return configSchema;
    }
  }
);

// 吸附位置配置项
setSchemaTpl('layout:sorption', {
  type: 'button-group-select',
  label: '吸附位置',
  size: 'xs',
  name: 'sorptionPosition',
  options: [
    {
      label: '吸顶',
      value: 'top'
    },
    {
      label: '吸底',
      value: 'bottom'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    if (value === 'top') {
      form.setValueByName('style.inset', '0 auto auto 0');
    } else if (value === 'bottom') {
      form.setValueByName('style.inset', 'auto auto 0 0');
    }
  }
});

// 滚动吸附配置项
setSchemaTpl('layout:sticky', {
  type: 'switch',
  label: tipedLabel(
    '滚动吸附',
    '开启滚动吸附后，当滚动至父容器上下边沿时会自动开启吸附模式。'
  ),
  name: 'stickyStatus',
  inputClassName: 'inline-flex justify-between',
  onChange: (value: boolean, oldValue: boolean, model: any, form: any) => {
    if (value) {
      form.setValueByName('style.position', 'sticky');
      form.setValueByName('style.inset', '0px auto auto auto');
      form.setValueByName('style.zIndex', 10);
    } else {
      form.setValueByName('style.position', 'static');
      form.setValueByName('style.inset', undefined);
      form.setValueByName('style.zIndex', undefined);
    }
  }
});

// 滚动吸附位置配置项
setSchemaTpl('layout:stickyPosition', {
  type: 'button-group-select',
  size: 'xs',
  label: tipedLabel('吸附位置', '用于设置滚动吸附时的位置'),
  name: 'stickyPosition',
  visibleOn: 'data.stickyStatus',
  options: [
    {
      label: '吸顶',
      value: 'top'
    },
    {
      label: '吸底',
      value: 'bottom'
    },
    {
      label: '自动',
      value: 'auto'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    if (value === 'top') {
      form.setValueByName('style.inset', '0px auto auto auto');
    } else if (value === 'bottom') {
      form.setValueByName('style.inset', 'auto auto 0px auto');
    } else if (value === 'auto') {
      form.setValueByName('style.inset', '0px auto 0px auto');
    }
  }
});

// 默认内边距配置项
setSchemaTpl(
  'layout:padding',
  (config?: {
    label?: string;
    name?: string;
    mode?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      label: config?.label || '默认内间距',
      type: 'button-group-select',
      name: config?.name || 'size',
      size: 'xs',
      mode: config?.mode || 'horizontal', // horizontal、vertical
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn || defaultValue(''),
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '默认',
          value: ''
        },
        {
          label: '极小',
          value: 'xs'
        },
        {
          label: '小',
          value: 'sm'
        },
        {
          label: '中',
          value: 'md'
        },
        {
          label: '大',
          value: 'lg'
        },
        {
          label: '无',
          value: 'none'
        }
      ]
    };
  }
);

// 内部水平对齐方式
setSchemaTpl(
  'layout:textAlign',
  (config?: {
    label?: string;
    name?: string;
    mode?: string;
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      label: config?.label || '对齐方式',
      type: 'button-group-select',
      name: config?.name || 'textAlign',
      // size: 'xs',
      mode: config?.mode || 'horizontal', // horizontal、vertical
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn || defaultValue(''),
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '',
          value: 'left',
          icon: 'fa fa-align-left'
        },
        {
          label: '',
          value: 'center',
          icon: 'fa fa-align-center'
        },
        {
          label: '',
          value: 'right',
          icon: 'fa fa-align-right'
        },
        {
          label: '',
          value: 'justify',
          icon: 'fa fa-align-justify'
        }
      ]
    };
  }
);

// flex相关配置项（整合版）
setSchemaTpl(
  'layout:flex-setting',
  (config?: {
    name?: string;
    label?: string;
    visibleOn?: string;
    direction?: string;
    justify?: string;
    alignItems?: string;
  }) => {
    return {
      type: 'flex-layout-setting',
      name: config?.name || 'style',
      mode: 'vertical', // horizontal、vertical
      label: config?.label ?? false,
      visibleOn: config?.visibleOn,
      direction: config?.direction,
      justify: config?.justify,
      alignItems: config?.alignItems
    };
  }
);

// 子配置项包裹容器
setSchemaTpl(
  'layout:wrapper-contanier',
  (config: {visibleOn?: string; className?: string; body: Array<any>}) => {
    return {
      type: 'container',
      className: `config-wrapper-contanier ${config.className || ''}`,
      body: config.body,
      visibleOn: config?.visibleOn
    };
  }
);
