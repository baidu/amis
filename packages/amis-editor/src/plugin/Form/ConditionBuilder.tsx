import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  PluginInterface,
  RendererEventContext,
  ScaffoldForm,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

import {isObject, isString} from 'lodash';
import defaultConfig, {
  OperationMap
} from 'amis-ui/lib/components/condition-builder/config';

export class ConditionBilderPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'condition-builder';
  $schema = '/schemas/ConditionBuilderControlSchema.json';

  // 组件名称
  name = '条件组件';
  isBaseComponent = true;
  icon = 'fa fa-group';
  description =
    '用于设置复杂组合条件，支持添加条件，添加分组，设置组合方式，拖拽排序等功能。';
  docLink = '/amis/zh-CN/components/form/condition-builder';
  tags = ['表单项'];

  scaffold = {
    type: 'condition-builder',
    label: '条件组件',
    name: 'conditions',
    description: '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
    fields: [
      {
        label: '文本',
        type: 'text',
        name: 'text'
      },
      {
        label: '数字',
        type: 'number',
        name: 'number'
      },
      {
        label: '布尔',
        type: 'boolean',
        name: 'boolean'
      },
      {
        label: '选项',
        type: 'select',
        name: 'select',
        options: [
          {
            label: 'A',
            value: 'a'
          },
          {
            label: 'B',
            value: 'b'
          },
          {
            label: 'C',
            value: 'c'
          },
          {
            label: 'D',
            value: 'd'
          },
          {
            label: 'E',
            value: 'e'
          }
        ]
      },
      {
        label: '日期',
        type: 'date',
        name: 'date'
      },
      {
        label: '时间',
        type: 'time',
        name: 'time'
      },
      {
        label: '日期时间',
        type: 'datetime',
        name: 'datetime'
      }
    ]
  };

  scaffoldForm: ScaffoldForm = {
    title: '快速开始-条件组合',
    body: [
      {
        type: 'combo',
        name: 'fields',
        multiple: true,
        draggable: true,
        multiLine: true,
        items: [
          {
            type: 'group',
            body: [
              {
                type: 'select',
                name: 'type',
                placeholder: '条件类型',
                options: [
                  {
                    label: '文本',
                    value: 'text'
                  },
                  {
                    label: '数字',
                    value: 'number'
                  },
                  {
                    label: '布尔',
                    value: 'boolean'
                  },
                  {
                    label: '日期',
                    value: 'date'
                  },
                  {
                    label: '日期时间',
                    value: 'datetime'
                  },
                  {
                    label: '时间',
                    value: 'time'
                  },
                  {
                    label: '选项',
                    value: 'select'
                  }
                ]
              },
              {
                type: 'input-text',
                name: 'name',
                placeholder: '字段名'
              },
              {
                type: 'input-text',
                placeholder: '字段名称',
                name: 'label'
              }
            ]
          },

          {
            type: 'group',
            visibleOn: 'data.type === "number"',
            body: [
              {
                type: 'input-number',
                name: 'minimum',
                placeholder: '最小值'
              },
              {
                type: 'input-number',
                name: 'maximum',
                placeholder: '最大值'
              },
              {
                type: 'input-number',
                name: 'step',
                min: 0,
                placeholder: '步长'
              }
            ]
          },

          {
            type: 'group',
            visibleOn: '!!~["date", "datetime", "time"].indexOf(data.type)',
            body: [
              {
                type: 'input-text',
                name: 'format',
                placeholder: '值格式'
              },
              {
                type: 'input-text',
                name: 'inputFormat',
                placeholder: '日期显示格式'
              },
              {
                type: 'input-text',
                name: 'timeFormat',
                placeholder: '时间显示格式',
                visibleOn: 'data.type === "datetime"'
              }
            ]
          },

          {
            type: 'group',
            visibleOn: 'data.type === "select"',
            body: [
              {
                type: 'input-text',
                name: 'source',
                placeholder: '字段选项远程拉取，支持接口或数据映射'
              }
            ]
          },

          {
            type: 'group',
            body: [
              {
                type: 'input-text',
                placeholder: '占位符',
                name: 'placeholder'
              },

              {
                name: 'operators',
                placeholder: '操作符',
                asFormItem: true,
                children: ({data, render, onChange}: any) =>
                  render(
                    'operations',
                    {
                      type: 'select',
                      name: 'operators',
                      multiple: true,
                      value:
                        data.value ||
                        defaultConfig.types[data.type]?.operators ||
                        [],
                      joinValues: false,
                      extractValue: true,
                      options: defaultConfig.types[data.type]?.operators.map(
                        item => {
                          if (isObject(item) && item.label && item.value) {
                            return (
                              {
                                label: item.label,
                                value: item.value
                              } || []
                            );
                          } else if (isString(item)) {
                            return (
                              {
                                label: OperationMap[item],
                                value: item
                              } || []
                            );
                          } else {
                            return [];
                          }
                        }
                      )
                    },
                    {
                      onChange: (value: any) => onChange(value)
                    }
                  )
              }
            ]
          }
        ]
      }
    ],
    canRebuild: true
  };

  previewSchema: any = {
    type: 'form',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [this.scaffold]
  };

  panelTitle = '条件组件';
  panelBodyCreator = (context: BaseEventContext) => {
    return [getSchemaTpl('source')];
  };

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface = this;
    // return super.buildSubRenderers.apply(this, arguments);
    if (plugin.name && plugin.description) {
      return {
        name: plugin.name,
        icon: plugin.icon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        scaffoldForm: this.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName
      };
    }
  }
}

registerEditorPlugin(ConditionBilderPlugin);
