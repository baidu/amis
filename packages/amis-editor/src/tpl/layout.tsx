import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import {tipedLabel} from '../component/BaseControl'

/**
 * 布局相关配置项
 */

// 定位模式
setSchemaTpl(
  'layout:position',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string; // 用于控制显示的表达式
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label: config?.label || tipedLabel('定位模式', '指定当前容器元素的定位类型'),
      name: config?.name || 'style.position',
      value: config?.value || 'static',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
        {
          label: '默认',
          value: 'static'
        },
        {
          label: '相对',
          value: 'relative'
        },
        {
          label: '固定(相对窗口)',
          value: 'fixed'
        },
        {
          label: '绝对(相对父容器)',
          value: 'absolute'
        },
      ]
    }

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
});

// 主轴排列方向
setSchemaTpl(
  'layout:justifyContent',
  (config?: {
    mode?: string; // 自定义展示默认值，上下展示: vertical, 左右展示: horizontal
    label?: string; // 表单项 label
    name?: string; // 表单项 name
    value?: string,
    visibleOn?: string; // 用于控制显示的表达式
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label: config?.label || tipedLabel(`水平对齐方式`, '设置子元素在主轴上的对齐方式'),
      name: config?.name || 'style.justifyContent',
      value: config?.value || 'center',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
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
      ]
    }

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
});

// 交叉轴排列方向
setSchemaTpl(
  'layout:alignItems',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label: config?.label || tipedLabel(`垂直对齐方式`, '设置子元素在交叉轴上的对齐方式'),
      name: config?.name || 'style.alignItems',
      value: config?.value || 'stretch', // 如果项目未设置高度或设为auto，将占满整个容器的高度。
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
      options: [
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
      ]
    }

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
});

// 排列方向
setSchemaTpl(
  'layout:flexDirection',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'select',
      label: config?.label || tipedLabel('排列方向', '设置成水平排列方向，则从左到右放置子项；设置成垂直排列方向，则从上到下放置子项'),
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
        },
      ]
    }

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
});

// inset 配置: 
setSchemaTpl(
  'layout:inset',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'inset-box-model',
      label: config?.label || tipedLabel('布局位置', '指定当前容器元素的定位位置，用于配置 top、right、bottom、left。'),
      name: config?.name || 'style.inset',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn ?? 'data.style.position && data.style.position !== "static"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    }

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
});

// z-index 配置: 
setSchemaTpl(
  'layout:z-index',
  (config?: {
    mode?: string;
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    const configSchema = {
      type: 'input-number',
      label: config?.label || tipedLabel('层级', '指定元素的堆叠顺序，层级高的元素总是会处于较低层级元素的上面。'),
      name: config?.name || 'style.zIndex',
      value: config?.value || '0',
      visibleOn: config?.visibleOn ?? 'data.style.position && data.style.position !== "static"',
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    }

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
});

// 是否固定高度: isFixedHeight 配置:
setSchemaTpl(
  'layout:isFixedHeight',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'switch',
      label: config?.label || '固定高度',
      name: config?.name || 'isFixedHeight',
      value: config?.value || 'false',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// 是否固定高度: isFixedWidth 配置:
setSchemaTpl(
  'layout:isFixedWidth',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'switch',
      label: config?.label || '固定宽度',
      name: config?.name || 'isFixedWidth',
      value: config?.value || 'false',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// 高度设置
setSchemaTpl(
  'layout:height',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-text',
      label: config?.label || '高度',
      name: config?.name || 'style.height',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn ?? 'data.isFixedHeight',
      clearable: true,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// 宽度设置
setSchemaTpl(
  'layout:width',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-text',
      label: config?.label || '宽度',
      name: config?.name || 'style.width',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn ?? 'data.isFixedWidth',
      clearable: true,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// 弹性模式
setSchemaTpl(
  'layout:flex',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'switch',
      label: config?.label || tipedLabel('弹性模式', '设置为弹性模式后，自动适配当前所在区域'),
      name: config?.name || 'style.flex',
      value: config?.value || '0 0 auto',
      visibleOn: config?.visibleOn,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// flex-basis默认宽度设置
setSchemaTpl(
  'layout:flex-basis',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-text',
      label: config?.label || tipedLabel('默认宽度', '定义在分配多余空间之前，项目占据的主轴空间（main size）'),
      name: config?.name || 'style.flexBasis',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn,
      clearable: true,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});

// flex-grow 占比设置
setSchemaTpl(
  'layout:flex-grow',
  (config?: {
    label?: string;
    name?: string;
    value?: string,
    visibleOn?: string;
    pipeIn?: (value: any, data: any) => void;
    pipeOut?: (value: any, data: any) => void;
  }) => {
    return {
      type: 'input-range',
      max: 12,
      step: 1,
      label: config?.label || tipedLabel('占比设置', '定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。'),
      name: config?.name || 'style.flexGrow',
      value: config?.value || 0,
      visibleOn: config?.visibleOn,
      clearable: true,
      pipeIn: config?.pipeIn,
      pipeOut: config?.pipeOut,
    };
});