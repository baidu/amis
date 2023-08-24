import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {SchemaObject} from 'amis';

export class AlertPlugin extends BasePlugin {
  static id = 'AlertPlugin';
  static scene = ['layout'];

  // 关联渲染器名字
  rendererName = 'alert';
  $schema = '/schemas/AlertSchema.json';

  // 组件名称
  name = '提示';
  isBaseComponent = true;
  description =
    '用来做文字特殊提示，分为四类：提示类、成功类、警告类和危险类。可结合 <code>visibleOn</code> 用来做错误信息提示。';
  docLink = '/amis/zh-CN/components/alert';
  icon = 'fa fa-exclamation-circle';
  pluginIcon = 'tooltip-plugin';
  tags = ['功能'];

  scaffold: SchemaObject = {
    type: 'alert',
    body: {
      type: 'tpl',
      tpl: '提示内容',
      wrapperComponent: '',
      inline: false
    },
    level: 'info'
  };
  previewSchema: any = {
    ...this.scaffold,
    className: 'text-left',
    showCloseButton: true
  };

  // 普通容器类渲染器配置
  regions = [{key: 'body', label: '内容区', placeholder: '提示内容'}];

  notRenderFormZone = true;
  panelTitle = '提示';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '类型',
                name: 'level',
                type: 'select',
                options: [
                  {
                    label: '提示',
                    value: 'info'
                  },
                  {
                    label: '成功',
                    value: 'success'
                  },
                  {
                    label: '警告',
                    value: 'warning'
                  },
                  {
                    label: '严重',
                    value: 'danger'
                  }
                ]
              },
              getSchemaTpl('label', {
                name: 'title'
              }),
              getSchemaTpl('switch', {
                label: '可关闭',
                name: 'showCloseButton'
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                name: 'showIcon',
                label: '图标',
                hiddenOnDefault: !context.schema.icon,
                formType: 'extend',
                form: {
                  body: [
                    getSchemaTpl('icon', {
                      label: '自定义图标'
                    })
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      }
    ]);
  };
}

registerEditorPlugin(AlertPlugin);
