/**
 * 组件专有动作选择器
 */

import {Option, Select} from 'amis';
import {RendererProps, getRendererByName} from 'amis-core';
import React from 'react';
import {getActionsByRendererName} from './helper';

// 动作基本配置项
export const BASE_ACTION_PROPS = [
  'actionType',
  '__actionDesc',
  'preventDefault',
  'stopPropagation',
  'expression'
  // 'outputVar'
];

export default class CmptActionSelect extends React.Component<RendererProps> {
  onChange(option: Option) {
    const {formStore} = this.props;
    let removeKeys: {
      [key: string]: any;
    } = {};

    // 保留必须字段，其他过滤掉
    Object.keys(formStore.data).forEach((key: string) => {
      if (
        ![
          ...BASE_ACTION_PROPS,
          'componentId',
          '__rendererName',
          '__cmptTreeSource',
          '__isScopeContainer',
          '__cmptId'
        ].includes(key)
      ) {
        removeKeys[key] = undefined;
      }
    });

    formStore.setValues({
      ...removeKeys,
      args: undefined,
      groupType: option.value,
      __cmptActionDesc: option.description
    });
    if (
      formStore.data.actionType === 'component' &&
      formStore.data.groupType === 'setValue'
    ) {
      formStore.setValueByName('args.__containerType', 'all');
      formStore.setValueByName('args.__comboType', 'all');
    }

    this.props.onChange(option.value);
  }
  render() {
    const {data, formStore} = this.props;
    // 根据type 从组件树中获取actions
    const actions = getActionsByRendererName(
      data.pluginActions,
      data.__rendererName
    );

    return (
      <Select
        value={formStore.data.groupType}
        className="cmpt-action-select"
        options={actions.map((item: any) => ({
          label: item.actionLabel,
          value: item.actionType,
          description: item.description
        }))}
        onChange={this.onChange.bind(this)}
        clearable={false}
      />
    );
  }
}
