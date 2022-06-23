import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import {SchemaCollection} from 'amis/lib/Schema';
import kebabCase from 'lodash/kebabCase';

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
      label: config?.label || '定位',
      name: config?.name || 'position',
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
      label: config?.label || '主轴上的对齐方式',
      name: config?.name || 'justifyContent',
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
      label: config?.label || '交叉轴上的对齐方式',
      name: config?.name || 'alignItems',
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
      label: config?.label || '排列方向',
      name: config?.name || 'flexDirection',
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
      label: config?.label || '布局位置',
      name: config?.name || 'style.inset',
      value: config?.value || 'auto',
      visibleOn: config?.visibleOn,
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
      label: config?.label || '层级',
      name: config?.name || 'style.zIndex',
      value: config?.value || '0',
      visibleOn: config?.visibleOn,
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