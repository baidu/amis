import {registerEditorPlugin, RendererPluginEvent} from 'amis-editor-core';

import {TransferPlugin} from './Transfer';

export class TransferPickerPlugin extends TransferPlugin {
  static id = 'TransferPickerPlugin';
  // 关联渲染器名字
  rendererName = 'transfer-picker';
  $schema = '/schemas/TransferPickerControlSchema.json';

  // 组件名称
  name = '穿梭选择器';
  isBaseComponent = true;
  icon = 'fa fa-th-list';
  pluginIcon = 'transfer-plugin';
  description = '穿梭选择器组件';
  docLink = '/amis/zh-CN/components/form/transfer-picker';
  tags = ['表单项'];
  scaffold = {
    label: '分组',
    type: 'transfer-picker',
    name: 'transfer-picker',
    options: [
      {
        label: '诸葛亮',
        value: 'zhugeliang'
      },
      {
        label: '曹操',
        value: 'caocao'
      }
    ],
    selectMode: 'list',
    resultListModeFollowSelect: false
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  events: RendererPluginEvent[] = [
    ...this.events,
    {
      eventName: 'itemClick',
      eventLabel: '点击选项',
      description: '选项被点击时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                item: {
                  type: 'object',
                  title: '当前选项'
                }
              }
            }
          }
        }
      ]
    }
  ];

  notRenderFormZone = true;
}

registerEditorPlugin(TransferPickerPlugin);
