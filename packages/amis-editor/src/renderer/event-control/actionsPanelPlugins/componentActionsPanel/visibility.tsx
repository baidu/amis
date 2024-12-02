import React from 'react';
import {getSchemaTpl, defaultValue} from 'amis-editor-core';
import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptSelect, renderCmptIdInput} from './helper';
import {buildLinkActionDesc} from '../../helper';

registerActionPanel('visibility', {
  label: '组件可见性',
  tag: '组件',
  description: '控制所选的组件的显示/隐藏',
  actions: [
    {
      actionType: 'show',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            显示
            {buildLinkActionDesc(props.manager, info)}
            组件
          </div>
        );
      }
    },
    {
      actionType: 'hidden',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            隐藏
            {buildLinkActionDesc(props.manager, info)}
            组件
          </div>
        );
      }
    },
    {
      actionType: 'visibility',
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
  supportComponents: '*',
  schema: () => [
    ...renderCmptSelect('目标组件', true),
    renderCmptIdInput(),
    {
      type: 'radios',
      label: '条件',
      name: 'groupType',
      mode: 'horizontal',
      value: 'static',
      required: true,
      inputClassName: 'event-action-radio',
      options: [
        {
          label: '静态',
          value: 'static'
        },
        {
          label: '表达式',
          value: 'visibility'
        }
      ]
    },
    {
      type: 'radios',
      label: '显示/隐藏',
      name: '__statusType',
      mode: 'horizontal',
      value: 'show',
      required: true,
      pipeIn: defaultValue('show'),
      inputClassName: 'event-action-radio',
      visibleOn: "this.groupType === 'static'",
      options: [
        {
          label: '显示',
          value: 'show'
        },
        {
          label: '隐藏',
          value: 'hidden'
        }
      ]
    },
    getSchemaTpl('expressionFormulaControl', {
      mode: 'horizontal',
      label: '表达式',
      required: true,
      size: 'lg',
      variables: '${variables}',
      evalMode: true,
      name: '__actionExpression',
      visibleOn: "this.groupType === 'visibility'"
    })
  ]
});
