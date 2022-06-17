import React from 'react';
import {Button} from 'amis';
import {defaultValue, getSchemaTpl, RendererPluginAction} from 'amis-editor-core';

export const getComboWrapper = (items: any, multiple: boolean = false) => ({
  type: 'combo',
  name: 'args',
  // label: '动作参数',
  multiple,
  strictMode: false,
  items: Array.isArray(items) ? items : [items]
});

/**
 * 获取动作配置项map
 * @param manager
 */
export function getActionConfigItemsMap(manager: any): {[propName: string]: RendererPluginAction} {
  return {
    ajax: {
      config: ['api'],
      desc: (info: any) => {
        return (
          <div>
            发送
            <span className="variable-right variable-left">
              {info?.args?.api?.method}
            </span>
            请求：<span className="variable-left">{info?.args?.api?.url}</span>
          </div>
        );
      },
      schema: {
        type: 'wrapper',
        style: {padding: '0 0 0 32px'},
        body: [
          getComboWrapper(
            getSchemaTpl('apiControl', {
              name: 'api'
            })
          )
        ]
      }
    },
    download: {
      config: ['api'],
      schema: {
        type: 'wrapper',
        style: {padding: '0 0 0 32px'},
        body: [
          getComboWrapper(
            getSchemaTpl('apiControl', {
              name: 'api'
            })
          )
        ]
      }
    },
    dialog: {
      schema: {
        name: 'dialog',
        label: '弹框内容',
        mode: 'horizontal',
        required: true,
        pipeIn: defaultValue({
          title: '弹框标题',
          body: '<p>对，你刚刚点击了</p>'
        }),
        asFormItem: true,
        children: ({value, onChange, data}: any) => (
          <Button
            size="sm"
            className="action-btn-width"
            onClick={() =>
              manager.openSubEditor({
                title: '配置弹框内容',
                value: {type: 'dialog', ...value},
                onChange: (value: any) => onChange(value)
              })
            }
            block
          >
            去配置
          </Button>
        )
      }
    },
    drawer: {
      schema: {
        name: 'drawer',
        label: '抽屉内容',
        mode: 'horizontal',
        required: true,
        pipeIn: defaultValue({
          title: '弹框标题',
          body: '<p>对，你刚刚点击了</p>'
        }),
        asFormItem: true,
        children: ({value, onChange, data}: any) => (
          <Button
            size="sm"
            className="action-btn-width"
            onClick={() =>
              manager.openSubEditor({
                title: '配置抽出式弹框内容',
                value: {type: 'drawer', ...value},
                onChange: (value: any) => onChange(value)
              })
            }
            block
          >
            去配置
          </Button>
        )
      }
    },
    link: {
      config: ['link', 'params'],
      desc: (info: any) => {
        return (
          <div>
            打开
            <span className="variable-left variable-right">
              {info?.__pageName}
            </span>
            页面
          </div>
        );
      },
      schema: getComboWrapper([
        {
          type: 'wrapper',
          className: 'p-none',
          body: [getSchemaTpl('app-page'), getSchemaTpl('app-page-args')]
        }
      ])
    }
  };
}
