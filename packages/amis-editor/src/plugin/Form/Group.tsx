import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  ContextMenuEventContext,
  ContextMenuItem,
  RegionConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {JSONPipeIn, JSONUpdate, makeHorizontalDeeper} from 'amis-editor-core';

export class GroupControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'group';
  $schema = '/schemas/GroupControlSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = '表单组';
  isBaseComponent = true;
  icon = 'fa fa-id-card-o';
  pluginIcon = 'form-group-plugin';
  description = '水平展示多个表单项';
  docLink = '/amis/zh-CN/components/form/group';
  tags = ['表单项'];
  scaffold = {
    type: 'group',
    body: [
      {
        type: 'input-text',
        label: '文本',
        name: 'var1'
      },

      {
        type: 'input-text',
        label: '文本',
        name: 'var2'
      }
    ],
    label: false
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold,
        mode: 'normal'
      }
    ]
  };

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '子表单',
      renderMethod: 'renderInput',
      preferTag: '表单项',
      wrapperResolve: (dom: HTMLElement) => dom
    }
  ];

  panelTitle = '表单组';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('label'),

          getSchemaTpl('description', {
            visible: 'this.label'
          }),

          {
            children: (
              <Button
                className="m-b"
                onClick={() => {
                  // this.manager.showInsertPanel('body')
                  this.manager.showRendererPanel(
                    '表单项',
                    '请从左侧组件面板中点击添加表单项'
                  );
                }}
                level="danger"
                tooltip="插入一个新的元素"
                size="sm"
                block
              >
                新增元素
              </Button>
            )
          },

          getSchemaTpl('remark'),
          getSchemaTpl('labelRemark')
        ]
      },

      {
        title: '外观',
        body: [
          getSchemaTpl('formItemMode'),
          getSchemaTpl('horizontalMode'),
          getSchemaTpl('horizontal', {
            visibleOn:
              '(data.$$formMode == "horizontal" || data.mode == "horizontal") && data.label !== false && data.horizontal',
            pipeIn: (value: any, data: any) => {
              value =
                value ||
                (data.formHorizontal &&
                  makeHorizontalDeeper(data.formHorizontal, data.body.length));

              return {
                leftRate:
                  value && typeof value.left === 'number'
                    ? value.left
                    : value &&
                      /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(value.left)
                    ? parseInt(RegExp.$1, 10)
                    : 2,
                leftFixed: (value && value.leftFixed) || ''
              };
            }
          }),

          getSchemaTpl('subFormItemMode'),
          getSchemaTpl('subFormHorizontalMode'),
          getSchemaTpl('subFormHorizontal'),

          {
            name: 'body',
            type: 'combo',
            label: '列宽度配置',
            multiple: true,
            removable: false,
            addable: false,
            multiLine: true,
            visibleOn: 'data.$$formMode != "inline"',
            items: [
              {
                type: 'button-group-select',
                name: 'columnRatio',
                label: '宽度设置',
                tiled: true,
                pipeIn: (value: any, data: any) => {
                  if (typeof value === 'number') {
                    return 'custom';
                  } else if (
                    data.columnClassName &&
                    /\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(
                      data.columnClassName as string
                    )
                  ) {
                    return 'custom';
                  }
                  return value || '';
                },
                pipeOut: (value: any) => (value === 'custom' ? 2 : value),
                options: [
                  {
                    value: '',
                    label: '适配宽度'
                  },

                  {
                    value: 'auto',
                    label: '适配内容'
                  },

                  {
                    value: 'custom',
                    label: '自定义'
                  }
                ]
              },
              {
                label: '宽度占比',
                type: 'input-range',
                name: 'columnRatio',
                visibleOn:
                  'typeof this.columnRatio === "number" || this.columnClassName && /\\bcol\\-(?:xs|sm|md|lg)\\-(\\d+)\\b/.test(this.columnClassName)',
                pipeIn: (value: any, data: any) => {
                  if (typeof value === 'number') {
                    return value;
                  }

                  if (
                    !data.columnClassName ||
                    !/\bcol\-(?:xs|sm|md|lg)\-(\d+)\b/.test(
                      data.columnClassName as string
                    )
                  ) {
                    return 2;
                  }

                  return parseInt(RegExp.$1, 10) || 2;
                },
                min: 1,
                max: 12,
                step: 1
              }
            ]
          },

          {
            type: 'button-group-select',
            name: 'gap',
            label: '间隔大小',
            pipeIn: defaultValue(''),
            size: 'sm',
            tiled: true,
            clearable: true,
            options: [
              {
                value: 'xs',
                label: '极小'
              },

              {
                value: 'sm',
                label: '小'
              },

              {
                value: 'md',
                label: '中'
              },

              {
                value: 'lg',
                label: '大'
              }
            ]
          },

          getSchemaTpl('className'),

          {
            name: 'body',
            type: 'combo',
            label: '列 CSS 类名配置',
            multiple: true,
            removable: false,
            addable: false,
            items: [
              {
                type: 'input-text',
                name: 'columnClassName'
              }
            ]
          }
        ]
      },

      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];

  buildEditorContextMenu(
    {id, schema, region, selections, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (
      selections.length ||
      info.plugin !== this ||
      !Array.isArray(schema.body) ||
      schema.body.length < 2
    ) {
      return;
    }

    menus.push({
      label: '变成多行',
      onSelect: () => {
        const store = this.manager.store;
        let rootSchema = store.schema;

        rootSchema = JSONUpdate(rootSchema, id, JSONPipeIn(schema.body), true);

        store.traceableSetSchema(rootSchema);
      }
    });
  }
}

registerEditorPlugin(GroupControlPlugin);
