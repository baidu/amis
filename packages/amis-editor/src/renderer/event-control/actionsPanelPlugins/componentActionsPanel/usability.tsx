import React from 'react';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

const SUPPORT_DISABLED_CMPTS = [
  'button-group',
  'action',
  'button',
  'submit',
  'reset',
  'collapse',
  'container',
  'dropdown-button',
  'flex',
  'flex-item',
  'grid',
  'grid-2d',
  'link',
  'nav',
  'wizard'
  // 'card2'
];

registerActionPanel('usability', {
  label: '组件可用性',
  tag: '组件',
  description: '控制所选的组件的启用/禁用',
  actions: [
    {
      actionType: 'enabled',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            启用
            {buildLinkActionDesc(props.manager, info)}
            组件
          </div>
        );
      }
    },
    {
      actionType: 'disabled',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            禁用
            {buildLinkActionDesc(props.manager, info)}
            组件
          </div>
        );
      }
    },
    {
      actionType: 'usability',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            组件
            {buildLinkActionDesc(props.manager, info)}
            表达式已配置
          </div>
        );
      }
    }
  ],
  supportComponents: ['form', 'isFormItem', ...SUPPORT_DISABLED_CMPTS],
  schema: [
    ...renderCmptSelect('目标组件', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: '条件',
      name: 'groupType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'static',
      required: true,
      options: [
        {
          label: '静态',
          value: 'static'
        },
        {
          label: '表达式',
          value: 'usability'
        }
      ]
    },
    {
      type: 'radios',
      label: '启用/禁用',
      name: '__statusType',
      mode: 'horizontal',
      inputClassName: 'event-action-radio',
      value: 'enabled',
      required: true,
      pipeIn: defaultValue('enabled'),
      visibleOn: "this.groupType === 'static'",
      options: [
        {
          label: '启用',
          value: 'enabled'
        },
        {
          label: '禁用',
          value: 'disabled'
        }
      ]
    },
    getSchemaTpl('expressionFormulaControl', {
      mode: 'horizontal',
      label: '表达式',
      required: true,
      size: 'lg',
      evalMode: true,
      name: '__actionExpression',
      visibleOn: "this.groupType === 'usability'"
    })
  ]
});
