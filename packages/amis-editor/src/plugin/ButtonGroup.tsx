import {
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  registerEditorPlugin,
  translateSchema
} from 'amis-editor-core';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
import {generateId} from '../util';

export class ButtonGroupPlugin extends BasePlugin {
  static id = 'ButtonGroupPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'button-group';
  $schema = '/schemas/ButtonGroupSchema.json';

  // 组件名称
  name = '按钮组';
  isBaseComponent = true;
  description = '用来展示多个按钮，视觉上会作为一个整体呈现。';
  tags = ['功能'];
  icon = 'fa fa-object-group';
  pluginIcon = 'btn-group-plugin';
  docLink = '/amis/zh-CN/components/button-group';
  scaffold = {
    type: 'button-group',
    buttons: [
      {
        type: 'button',
        label: '按钮1',
        id: generateId(),
        ...BUTTON_DEFAULT_ACTION
      },

      {
        type: 'button',
        label: '按钮2',
        id: generateId(),
        ...BUTTON_DEFAULT_ACTION
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '按钮组';

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
                type: 'button-group-select',
                name: 'vertical',
                label: '布局方向',
                options: [
                  {
                    label: '水平',
                    value: false
                  },
                  {
                    label: '垂直',
                    value: true
                  }
                ],
                pipeIn: defaultValue(false)
              },

              getSchemaTpl('switch', {
                name: 'tiled',
                label: tipedLabel(
                  '平铺模式',
                  '使按钮组宽度占满父容器，各按钮宽度自适应'
                ),
                pipeIn: defaultValue(false)
              }),

              getSchemaTpl('combo-container', {
                type: 'combo',
                label: '按钮管理',
                name: 'buttons',
                mode: 'normal',
                multiple: true,
                addable: true,
                minLength: 1,
                draggable: true,
                editable: false,
                pipeIn: (value: any, data: any) => translateSchema(value),
                items: [
                  {
                    type: 'tpl',
                    inline: false,
                    className: 'p-t-xs',
                    tpl: `<span class="label label-default"><% if (data.type === "button-group") { %> ${'按钮组'} <% } else { %><%= data.label %><% if (data.icon) { %><i class="<%= data.icon %>"/><% }%><% } %></span>`
                  }
                ],
                addButtonText: '新增按钮',
                scaffold: {
                  type: 'button',
                  label: '按钮'
                }
              })
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('buttonLevel', {
                  label: '样式',
                  name: 'btnLevel'
                }),
                getSchemaTpl('size', {
                  label: '尺寸'
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  label: '按钮',
                  name: 'btnClassName'
                })
              ]
            })
          ])
        ]
      }
    ]);
  };

  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: '子按钮',
      renderMethod: 'render',
      preferTag: '按钮',
      insertPosition: 'inner'
    }
  ];
}

registerEditorPlugin(ButtonGroupPlugin);
