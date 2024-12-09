import React from 'react';
import {defaultValue} from 'amis-editor-core';
import without from 'lodash/without';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('staticStatus', {
  label: '组件展示态',
  tag: '组件',
  description: '控制所选的组件的输入态/静态',
  actions: [
    {
      actionType: 'static',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            {buildLinkActionDesc(props.manager, info)}切换为静态展示
          </div>
        );
      }
    },
    {
      actionType: 'nonstatic',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            <span className="variable-right">
              {info?.rendererLabel || info.componentId}
            </span>
            组件切换为输入态
          </div>
        );
      }
    }
  ],
  supportComponents: ['form', 'isStaticFormItem'],
  schema: [
    ...renderCmptSelect('选择组件', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: '组件状态',
      name: 'groupType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'nonstatic',
      required: true,
      pipeIn: defaultValue('nonstatic'),
      options: [
        {
          label: '表单输入',
          value: 'nonstatic'
        },
        {
          label: '表单静态',
          value: 'static'
        }
      ]
    }
  ]
});
