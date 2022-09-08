import {setSchemaTpl, getSchemaTpl, defaultValue} from 'amis-editor-core';
import {isObject} from 'lodash';
import {tipedLabel} from 'amis-editor-core';

setSchemaTpl('horizontal-align', {
  type: 'button-group-select',
  label: '位置',
  options: [
    {
      label: '左边',
      value: 'left',
      icon: 'fa fa-align-left'
    },
    {
      label: '右边',
      value: 'right',
      icon: 'fa fa-align-right'
    }
  ]
});

setSchemaTpl('leftFixed', {
  name: 'horizontal.leftFixed',
  type: 'button-group-select',
  visibleOn: 'data.horizontal && data.horizontal.leftFixed',
  label: '宽度',
  options: [
    {
      label: '小',
      value: 'sm'
    },

    {
      label: '中',
      value: 'normal'
    },

    {
      label: '大',
      value: 'lg'
    }
  ]
});

setSchemaTpl('leftRate', {
  name: 'horizontal',
  type: 'input-range',
  visibleOn: 'data.horizontal && !data.horizontal.leftFixed',
  min: 1,
  max: 11,
  step: 1,
  label: tipedLabel('比例', '12 等份，标题宽度占比 n/12'),
  pipeIn(v: any) {
    return v.left || 3;
  },
  pipeOut(v: any) {
    return {left: v, right: 12 - v};
  }
});

setSchemaTpl(
  'horizontal',
  (config: {visibleOn: string; [propName: string]: any}) => {
    return [
      {
        type: 'button-group-select',
        label: '标题宽度',
        name: 'horizontal',
        options: [
          {label: '继承', value: 'formHorizontal'},
          {label: '固宽', value: 'leftFixed'},
          {label: '比例', value: 'leftRate'}
        ],
        pipeIn(v: any) {
          if (!v) {
            return 'formHorizontal';
          }
          if (v.leftFixed) {
            return 'leftFixed';
          }
          return 'leftRate';
        },
        pipeOut(v: any) {
          const defaultData = {
            formHorizontal: undefined,
            leftFixed: {leftFixed: 'normal'},
            leftRate: {left: 3, right: 9}
          };

          // @ts-ignore
          return defaultData[v];
        },
        visibleOn: 'this.mode == "horizontal" && this.label !== false',
        ...(isObject(config) ? config : {})
      },
      {
        type: 'container',
        className: 'ae-ExtendMore mb-3',
        visibleOn:
          'this.mode == "horizontal" && this.horizontal && this.label !== false',
        body: [getSchemaTpl('leftFixed'), getSchemaTpl('leftRate')]
      }
    ];
  }
);

setSchemaTpl('subFormItemMode', {
  label: '子表单展示模式',
  name: 'subFormMode',
  type: 'button-group-select',
  size: 'sm',
  option: '继承',
  // mode: 'inline',
  // className: 'w-full',
  pipeIn: defaultValue(''),
  options: [
    {
      label: '继承',
      value: ''
    },

    {
      label: '正常',
      value: 'normal'
    },

    {
      label: '内联',
      value: 'inline'
    },

    {
      label: '水平',
      value: 'horizontal'
    }
  ]
});

setSchemaTpl('subFormHorizontalMode', {
  type: 'switch',
  label: '子表单水平占比设置',
  name: 'subFormHorizontal',
  onText: '继承',
  offText: '自定义',
  inputClassName: 'text-sm',
  visibleOn: 'this.subFormMode == "horizontal"',
  pipeIn: (value: any) => !value,
  pipeOut: (value: any, originValue: any, data: any) =>
    value
      ? null
      : data.formHorizontal || {
          leftFixed: 'normal'
        }
});

setSchemaTpl('subFormItemMode', {
  label: '子表单展示模式',
  name: 'subFormMode',
  type: 'button-group-select',
  size: 'sm',
  option: '继承',
  // mode: 'inline',
  // className: 'w-full',
  pipeIn: defaultValue(''),
  options: [
    {
      label: '继承',
      value: ''
    },

    {
      label: '正常',
      value: 'normal'
    },

    {
      label: '内联',
      value: 'inline'
    },

    {
      label: '水平',
      value: 'horizontal'
    }
  ]
});

setSchemaTpl('subFormHorizontalMode', {
  type: 'switch',
  label: '子表单水平占比设置',
  name: 'subFormHorizontal',
  onText: '继承',
  offText: '自定义',
  inputClassName: 'text-sm',
  visibleOn: 'this.subFormMode == "horizontal"',
  pipeIn: (value: any) => !value,
  pipeOut: (value: any, originValue: any, data: any) =>
    value
      ? null
      : data.formHorizontal || {
          leftFixed: 'normal'
        }
});

setSchemaTpl('subFormHorizontal', {
  type: 'combo',
  syncDefaultValue: false,
  visibleOn: 'data.subFormMode == "horizontal" && data.subFormHorizontal',
  name: 'subFormHorizontal',
  multiLine: true,
  pipeIn: (value: any) => {
    return {
      leftRate:
        value && typeof value.left === 'number'
          ? value.left
          : value && /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(value.left)
          ? parseInt(RegExp.$1, 10)
          : 2,
      leftFixed: (value && value.leftFixed) || ''
    };
  },
  pipeOut: (value: any) => {
    let left = Math.min(11, Math.max(1, value.leftRate || 2));

    return {
      leftFixed: value.leftFixed || '',
      left: left,
      right: 12 - left
    };
  },
  inputClassName: 'no-padder',
  items: [
    {
      name: 'leftFixed',
      type: 'button-group-select',
      label: '左侧宽度',
      size: 'xs',
      options: [
        {
          label: '比率',
          value: ''
        },

        {
          label: '小宽度',
          value: 'sm',
          visibleOn: 'this.leftFixed'
        },

        {
          label: '固定宽度',
          value: 'normal'
        },

        {
          label: '大宽度',
          value: 'lg',
          visibleOn: 'this.leftFixed'
        }
      ]
    },
    {
      name: 'leftRate',
      type: 'input-range',
      visibleOn: '!this.leftFixed',
      min: 1,
      max: 11,
      step: 1,
      label: '左右分布调整(n/12)',
      labelRemark: {
        trigger: 'click',
        className: 'm-l-xs',
        rootClose: true,
        content: '一共 12 等份，这里可以设置左侧宽度占比 n/12。',
        placement: 'left'
      }
    }
  ]
});
