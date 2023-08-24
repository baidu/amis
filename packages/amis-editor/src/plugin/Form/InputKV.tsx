/**
 * @file input-kv 组件的素项目部
 */
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';

export class KVControlPlugin extends BasePlugin {
  static id = 'KVControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'input-kv';
  $schema = '/schemas/KVControlSchema.json';

  // 组件名称
  name = 'KV 键值对';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
  pluginIcon = 'input-kv-plugin';
  description = '用于编辑键值对类型的数据';
  docLink = '/amis/zh-CN/components/form/input-kv';
  tags = ['表单项'];
  scaffold = {
    type: 'input-kv',
    label: 'KV',
    name: 'kv'
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

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'add',
      eventLabel: '添加',
      description: '添加组合项时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '组合项的值'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '删除',
      description: '删除组合项',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                key: {
                  type: 'string',
                  title: '被删除的索引'
                },
                value: {
                  type: 'string',
                  title: '组合项的值'
                },
                item: {
                  type: 'object',
                  title: '被删除的项'
                }
              }
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'clear',
      actionLabel: '清空',
      description: '清除选中值'
    },
    {
      actionType: 'reset',
      actionLabel: '重置',
      description: '将值重置为resetValue，若没有配置resetValue，则清空'
    },
    {
      actionType: 'setValue',
      actionLabel: '赋值',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = 'KV 键值对';
  panelBody = [
    getSchemaTpl('layout:originPosition', {value: 'left-top'}),
    {
      type: 'input-text',
      name: 'valueType',
      label: '值类型',
      pipeIn: defaultValue('input-text')
    },
    {
      type: 'input-text',
      name: 'keyPlaceholder',
      label: 'key 的提示信息'
    },
    {
      type: 'input-text',
      name: 'valuePlaceholder',
      label: 'value 的提示信息'
    },
    {
      type: 'switch',
      name: 'draggable',
      label: '是否可排序',
      pipeIn: defaultValue(true)
    }
  ];
}

registerEditorPlugin(KVControlPlugin);
