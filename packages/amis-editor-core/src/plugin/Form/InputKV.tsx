/**
 * @file input-kv 组件的素项目部
 */
import { RendererAction, RendererEvent } from 'amis-editor-comp/dist/renderers/event-action';
import {
  defaultValue,
  getSchemaTpl,
  valuePipeOut
} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {
  BasePlugin,
  BasicSubRenderInfo,
  RendererEventContext,
  SubRendererInfo
} from '../../plugin';

export class KVControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-kv';
  $schema = '/schemas/KVControlSchema.json';

  // 组件名称
  name = 'KV 键值对';
  isBaseComponent = true;
  icon = 'fa fa-eyedropper';
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
   events: RendererEvent[] = [
    {
      eventName: 'add',
      eventLabel: '添加',
      description: '添加组合项时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.value': {
              type: 'object',
              title: '当前组合项的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'delete',
      eventLabel: '删除',
      description: '删除组合项时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.key': {
              type: 'string',
              title: '删除项的索引'
            },
            'event.data.value': {
              type: 'string',
              title: '当前组合项的值'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererAction[] = [
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
