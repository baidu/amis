import React from 'react';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {tipedLabel} from 'amis-editor-core';
import {registerEditorPlugin, getSchemaTpl} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';

export class TimelinePlugin extends BasePlugin {
  rendererName = 'timeline';
  $schema = '/schemas/TimelineSchema.json';
  label: '时间轴';
  type: 'timeline';
  name = '时间轴';
  isBaseComponent = true;
  icon = 'fa fa-bars';
  description = '用来展示时间轴';
  docLink = '/amis/zh-CN/components/timeline';
  tags = ['功能'];
  scaffold = {
    type: 'timeline',
    label: '时间轴',
    name: 'timeline',
    items: [
      {time: '2012-12-21', title: '节点示例数据'},
      {time: '2012-12-24', title: '节点示例数据'},
      {time: '2012-12-27', title: '节点示例数据'}
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  // TODO 事件定义
  // events = [];

  panelTitle = '时间轴';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) =>
    getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              {
                label: '排序',
                name: 'reverse',
                value: false,
                type: 'button-group-select',
                inline: false,
                options: [
                  {label: '正序', value: false},
                  {label: '反序', value: true}
                ]
              },
              {
                label: '时间轴方向',
                name: 'direction',
                value: 'vertical',
                type: 'button-group-select',
                inline: true,
                options: [
                  {label: '垂直', value: 'vertical'},
                  {label: '水平', value: 'horizontal'}
                ]
              },
              {
                label: tipedLabel('文字位置', '文字相对时间轴位置'),
                name: 'mode',
                value: 'right',
                type: 'button-group-select',
                visibleOn: 'data.direction === "vertical"',
                options: [
                  {label: '左侧', value: 'right'},
                  {label: '右侧', value: 'left'},
                  {label: '两侧交替', value: 'alternate'}
                ]
              }
            ]
          },
          {
            title: '数据',
            body: [
              getSchemaTpl('timelineItemControl', {
                name: 'items',
                mode: 'normal'
              })
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false
          })
        ])
      }
    ]);
}

registerEditorPlugin(TimelinePlugin);
