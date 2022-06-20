import React from 'react';
import {getEventControlConfig} from '../util';
import {registerEditorPlugin, getSchemaTpl} from 'amis-editor-core';
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
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
  tags = ['容器'];
  scaffold = {
    type: 'timeline',
    label: '时间轴',
    name: 'timeline',
    items: [
      {time: '2012-12-21', title: '世界末日'},
      {time: '2012-12-24', title: '期末考试'}
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  // 事件定义
  events: RendererEvent[] = [
    {
      eventName: 'add',
      eventLabel: '新增选项',
      description: '新增选项'
    },
    {
      eventName: 'edit',
      eventLabel: '编辑选项',
      description: '编辑选项'
    },
    {
      eventName: 'delete',
      eventLabel: '删除选项',
      description: '删除选项'
    }
  ];

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
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('description')
            ]
          },
          {
            title: '数据',
            body: [
              getSchemaTpl('timelineItemControl', {
                name: 'items',
                mode: 'normal',
              }),
              {
                label: '方向',
                name: 'direction',
                value: 'vertical',
                type: 'button-group-select',
                inline: true,
                options: [
                  {label: '垂直', value: 'vertical'},
                  {label: '水平', value: 'horizontal'}
                ],
              },
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
                label: '文字方向',
                name: 'mode',
                value: 'right',
                type: 'button-group-select',
                visibleOn: 'data.direction === "vertical"',
                options: [
                  {label: '偏左', value: 'right'},
                  {label: '偏右', value: 'left'},
                  {label: '左右交替', value: 'alternate'},
                ]
              }
            ]
          },
          getSchemaTpl('status', {isFormItem: true})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '样式',
            body: [
              {
                name: 'className',
                label: '外层class',
                type: 'input-text',
                placeholder: '请输入className'
              },

            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl',{
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
}

registerEditorPlugin(TimelinePlugin);