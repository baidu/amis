import React from 'react';
import {registerActionPanel} from '../../actionsPanelManager';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';
import {normalizeApi} from 'amis-core';

registerActionPanel('ajax', {
  label: '发送请求',
  tag: '服务',
  description: '配置并发送API请求',
  // innerArgs: ['api', 'options'],
  descDetail: (info: any, context: any, props: any) => {
    let apiInfo = info?.api ?? info?.args?.api;
    if (typeof apiInfo === 'string') {
      apiInfo = normalizeApi(apiInfo);
    }
    return (
      <div className="action-desc">
        发送
        <span className="variable-right variable-left">
          {apiInfo?.method || '-'}
        </span>
        请求：
        <span className="variable-left">{apiInfo?.url || '-'}</span>
      </div>
    );
  },
  schema: () => [
    {
      type: 'wrapper',
      className: 'p-none',
      body: [
        getSchemaTpl('apiControl', {
          name: 'api',
          label: '配置请求',
          mode: 'horizontal',
          size: 'lg',
          inputClassName: 'm-b-none',
          renderLabel: true,
          required: true
        }),
        {
          name: 'options',
          type: 'combo',
          label: tipedLabel(
            '静默请求',
            '开启后，服务请求将以静默模式发送，即不会弹出成功或报错提示。'
          ),
          mode: 'horizontal',
          items: [
            {
              type: 'switch',
              name: 'silent',
              label: false,
              onText: '开启',
              offText: '关闭',
              mode: 'horizontal',
              pipeIn: defaultValue(false)
            }
          ]
        },
        {
          name: 'outputVar',
          type: 'input-text',
          label: '请求结果',
          placeholder: '请输入存储请求结果的变量名称',
          description:
            '如需执行多次发送请求，可以修改此变量名用于区分不同请求返回的结果',
          mode: 'horizontal',
          size: 'lg',
          value: 'responseResult',
          required: true
        }
      ]
    }
  ],
  outputVarDataSchema: [
    {
      type: 'object',
      title: 'responseResult',
      properties: {
        responseData: {
          type: 'object',
          title: '响应数据'
        },
        responseStatus: {
          type: 'number',
          title: '状态标识'
        },
        responseMsg: {
          type: 'string',
          title: '提示信息'
        }
      }
    }
  ]
});
