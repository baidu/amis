import React from 'react';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {tipedLabel} from 'amis-editor-core';
import {registerEditorPlugin, getSchemaTpl, diff} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {schemaArrayFormat, schemaToArray} from '../util';

export class TimelinePlugin extends BasePlugin {
  static id = 'TimelinePlugin';
  rendererName = 'timeline';
  $schema = '/schemas/TimelineSchema.json';
  label: '时间轴';
  type: 'timeline';
  name = '时间轴';
  isBaseComponent = true;
  icon = 'fa fa-bars';
  description = '用来展示时间轴';
  docLink = '/amis/zh-CN/components/timeline';
  tags = ['展示'];
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
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '排序',
                name: 'reverse',
                value: false,
                type: 'button-group-select',
                inline: false,
                size: 'sm',
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
                size: 'sm',
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
                visibleOn: 'this.direction === "vertical"',
                size: 'sm',
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
              }),
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: '自定义标题模板',
                bulk: false,
                name: 'itemTitleSchema',
                formType: 'extend',
                defaultData: {
                  type: 'container',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '${label}',
                      editorSetting: {
                        mock: {
                          tpl: '节点标题'
                        }
                      },
                      wrapperComponent: ''
                    }
                  ]
                },
                form: {
                  body: [
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      block: true,
                      onClick: this.editDetail.bind(this, context),
                      label: '配置展示模板'
                    }
                  ]
                },
                pipeIn: (value: any) => {
                  if (typeof value === 'undefined') {
                    return false;
                  }
                  return typeof value !== 'string';
                },
                pipeOut: (value: any) => {
                  if (value === true) {
                    return {
                      type: 'tpl',
                      tpl: this.scaffold.label
                    };
                  }
                  return value ? value : undefined;
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
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'timeClassName',
                label: '时间区'
              }),

              getSchemaTpl('className', {
                name: 'titleClassName',
                label: '标题区'
              }),

              getSchemaTpl('className', {
                name: 'detailClassName',
                label: '详情区'
              })
            ]
          })
        ])
      }
    ]);

  editDetail(context: BaseEventContext) {
    const {id, schema} = context;
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = {
      type: 'tpl',
      tpl: this.scaffold.label
    };
    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置标题显示模版',
        value: schemaToArray(value.itemTitleSchema ?? defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, itemTitleSchema: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(TimelinePlugin);
