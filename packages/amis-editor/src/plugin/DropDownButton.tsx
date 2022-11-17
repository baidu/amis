import {Button} from 'amis';
import React from 'react';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  registerEditorPlugin,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  diff
} from 'amis-editor-core';
import {BUTTON_DEFAULT_ACTION} from '../component/BaseControl';
export class DropDownButtonPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'dropdown-button';
  $schema = '/schemas/DropdownButtonSchema.json';

  // 组件名称
  name = '下拉按钮';
  isBaseComponent = true;
  description = '下拉按钮，更多的按钮通过点击后展示开来。';
  tags = ['按钮'];
  icon = 'fa fa-chevron-down';
  pluginIcon = 'dropdown-btn-plugin';

  docLink = '/amis/zh-CN/components/dropdown-button';
  scaffold = {
    type: 'dropdown-button',
    label: '下拉按钮',
    buttons: [
      {
        type: 'button',
        label: '按钮1',
        ...BUTTON_DEFAULT_ACTION
      },

      {
        type: 'button',
        label: '按钮2',
        ...BUTTON_DEFAULT_ACTION
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '下拉按钮';

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                children: (
                  <div className="mb-3">
                    <Button
                      level="info"
                      size="sm"
                      className="m-b-sm"
                      block
                      onClick={this.editDetail.bind(this, context.id)}
                    >
                      配置下拉按钮集合
                    </Button>
                  </div>
                )
              },
              {
                label: '按钮文案',
                type: 'input-text',
                name: 'label'
              },
              {
                type: 'button-group-select',
                name: 'trigger',
                label: '触发方式',
                size: 'sm',
                options: [
                  {
                    label: '点击',
                    value: 'click'
                  },
                  {
                    label: '鼠标经过',
                    value: 'hover'
                  }
                ],
                pipeIn: defaultValue('click')
              },

              getSchemaTpl('switch', {
                name: 'closeOnOutside',
                label: '点击外部关闭',
                pipeIn: defaultValue(true)
              }),

              getSchemaTpl('switch', {
                name: 'closeOnClick',
                label: '点击内容关闭'
              }),

              getSchemaTpl('switch', {
                label: tipedLabel('默认展开', '选择后下拉菜单会默认展开'),
                name: 'defaultIsOpened'
              }),

              {
                type: 'button-group-select',
                name: 'align',
                label: '菜单对齐方式',
                size: 'sm',
                options: [
                  {
                    label: '左对齐',
                    value: 'left'
                  },
                  {
                    label: '右对齐',
                    value: 'right'
                  }
                ],
                pipeIn: defaultValue('left')
              }
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
                getSchemaTpl('size', {
                  label: '尺寸',
                  pipeIn: defaultValue('md')
                }),

                getSchemaTpl('switch', {
                  name: 'block',
                  label: tipedLabel('块状显示', '选择后按钮占满父容器宽度')
                }),

                getSchemaTpl('buttonLevel', {
                  label: '展示样式',
                  name: 'level'
                })
              ]
            },
            {
              title: '图标',
              body: [
                // getSchemaTpl('switch', {
                //   label: '只显示 icon',
                //   name: 'iconOnly'
                // }),

                getSchemaTpl('switch', {
                  label: '隐藏下拉图标',
                  name: 'hideCaret'
                }),

                getSchemaTpl('icon', {
                  label: '左侧图标'
                }),

                getSchemaTpl('icon', {
                  name: 'rightIcon',
                  label: '右侧图标'
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'btnClassName',
                  label: '按钮'
                }),

                getSchemaTpl('className', {
                  name: 'menuClassName',
                  label: '下拉菜单'
                })
              ]
            })
          ])
        ]
      }
    ]);
  };

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'dropdown-button') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置下拉按钮集合',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置下拉按钮集合',
        value: value.buttons,
        slot: {
          type: 'button-group',
          buttons: '$$',
          block: true
        },
        onChange: newValue => {
          newValue = {...value, buttons: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (info.renderer.name === 'dropdown-button') {
      menus.push('|', {
        label: '配置下拉按钮集合',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  filterProps(props: any) {
    // trigger 为 hover 会影响编辑体验。
    props.trigger = 'click';
    return props;
  }
}

registerEditorPlugin(DropDownButtonPlugin);
