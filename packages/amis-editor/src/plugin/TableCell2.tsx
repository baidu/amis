import {Button, Icon} from 'amis';
import React from 'react';
import {getVariable} from 'amis-core';

import {
  BasePlugin,
  BasicRendererInfo,
  registerEditorPlugin,
  RendererInfoResolveEventContext,
  ReplaceEventContext,
  PluginEvent,
  AfterBuildPanelBody,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  DSField
} from 'amis-editor-core';
import {fromPairs} from 'lodash';
import {TabsSchema} from 'amis/lib/renderers/Tabs';
import {SchemaObject} from 'amis/lib/Schema';
import {remarkTpl} from '../component/BaseControl';

export class TableCell2Plugin extends BasePlugin {
  panelTitle = '列配置';
  panelIcon = 'fa fa-columns';

  afterBuildPanelBody(event: PluginEvent<AfterBuildPanelBody>) {
    const {context, data} = event.context;
    if (
      !context.node.parent?.parent?.type ||
      context.node.parent.parent.type !== 'table2'
    ) {
      return;
    }

    // @ts-ignore
    const base: Array<{
      sameName?: string;
      [propName: string]: any;
    }> = [
      context.node.info.plugin.withDataSource === false
        ? false
        : {
            sameName: context.info.renderer.isFormItem ? 'name' : undefined,
            name: 'name',
            type: 'ae-DataBindingControl',
            label: '列字段',
            onBindingChange(
              field: DSField,
              onBulkChange: (value: any) => void
            ) {
              const schema = field?.resolveColumnSchema?.('List') || {
                title: field.label
              };
              onBulkChange(schema);
            }
          },

      {
        sameName: context.info.renderer.isFormItem ? 'label' : undefined,
        name: 'title',
        label: '列标题',
        type: 'input-text'
      },

      remarkTpl({
        name: 'remark',
        label: '标题提示',
        labelRemark: '在标题旁展示提示'
      }),

      {
        name: 'placeholder',
        type: 'input-text',
        label: tipedLabel('占位提示', '当没有值时用这个来替代展示。'),
        value: '-'
      }
    ].filter(Boolean);
    const advanced = [
      getSchemaTpl('switch', {
        name: 'sorter',
        label: tipedLabel(
          '可排序',
          '开启后可以根据当前列排序，接口类型将增加排序参数。'
        )
      }),

      getSchemaTpl('switch', {
        name: 'searchable',
        label: '可搜索',
        pipeIn: (value: any) => !!value
      }),

      {
        visibleOn: 'data.searchable',
        name: 'searchable',
        asFormItem: true,
        label: false,
        children: ({value, onChange, data}: any) => {
          if (value === true) {
            value = {};
          } else if (typeof value === 'undefined') {
            value = getVariable(data, 'searchable');
          }

          const originMode = value.mode;

          value = {
            ...value,
            type: 'form',
            mode: 'normal',
            wrapWithPanel: false,
            body: [
              {
                type: 'input-text',
                name: data.key
              }
            ]
          };

          delete value.mode;
          // todo 多个快速编辑表单模式看来只能代码模式编辑了。
          return (
            <Button
              className="w-full flex flex-col items-center"
              onClick={() => {
                this.manager.openSubEditor({
                  title: '配置列搜索类型',
                  value: value,
                  onChange: value =>
                    onChange(
                      {
                        ...value,
                        mode: originMode
                      },
                      'searchable'
                    )
                });
              }}
            >
              <span className="inline-flex items-center">
                <Icon icon="edit" className="mr-1 w-3" />
                配置列搜索类型
              </span>
            </Button>
          );
        }
      },

      {
        name: 'quickEdit',
        label: tipedLabel('快速编辑', '输入框左侧或右侧的附加挂件'),
        type: 'ae-switch-more',
        mode: 'normal',
        formType: 'extend',
        bulk: true,
        defaultData: {
          mode: 'popOver'
        },
        form: {
          body: [
            {
              name: 'quickEdit.mode',
              type: 'button-group-select',
              label: '模式',
              value: 'popOver',
              options: [
                {
                  label: '下拉',
                  value: 'popOver'
                },
                {
                  label: '内嵌',
                  value: 'inline'
                }
              ]
            },

            getSchemaTpl('switch', {
              name: 'quickEdit.saveImmediately',
              label: tipedLabel(
                '修改立即保存',
                '开启后修改即提交，而不是批量提交。'
              ),
              pipeIn: (value: any) => !!value
            }),

            {
              name: 'quickEdit',
              asFormItem: true,
              label: false,
              children: ({value, onBulkChange, name, data}: any) => {
                if (value === true) {
                  value = {};
                } else if (typeof value === 'undefined') {
                  value = getVariable(data, 'quickEdit');
                }

                const originMode = value?.mode || 'popOver';

                value = {
                  ...value,
                  type: 'form',
                  mode: 'normal',
                  wrapWithPanel: false,
                  body: [
                    {
                      type: 'input-text',
                      name: data.key
                    }
                  ]
                };

                if (value.mode) {
                  delete value.mode;
                }
                // todo 多个快速编辑表单模式看来只能代码模式编辑了。
                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: '配置快速编辑类型',
                        value: value,
                        onChange: value =>
                          onBulkChange({
                            [name]: {
                              ...value,
                              mode: originMode
                            }
                          })
                      });
                    }}
                  >
                    <span className="inline-flex items-center">
                      <Icon icon="edit" className="mr-1 w-3" />
                      配置编辑表单
                    </span>
                  </Button>
                );
              }
            }
          ]
        }
      },

      {
        name: 'popOver',
        label: '查看更多',
        type: 'ae-switch-more',
        mode: 'normal',
        formType: 'extend',
        bulk: true,
        form: {
          body: [
            {
              name: 'popOver.mode',
              label: '模式',
              type: 'button-group-select',
              pipeIn: defaultValue('popOver'),
              options: [
                {
                  label: '浮窗',
                  value: 'popOver'
                },

                {
                  label: '弹框',
                  value: 'dialog'
                },

                {
                  label: '抽屉',
                  value: 'drawer'
                }
              ]
            },

            {
              name: 'popOver.position',
              label: '浮窗位置',
              type: 'select',
              visibleOn: 'data.popOver.mode === "popOver"',
              pipeIn: defaultValue('center'),
              options: [
                {
                  label: '目标中部',
                  value: 'center'
                },

                {
                  label: '目标左上角',
                  value: 'left-top'
                },

                {
                  label: '目标右上角',
                  value: 'right-top'
                },

                {
                  label: '目标左下角',
                  value: 'left-bottom'
                },

                {
                  label: '目标右下角',
                  value: 'right-bottom'
                },

                {
                  label: '页面左上角',
                  value: 'fixed-left-top'
                },

                {
                  label: '页面右上角',
                  value: 'fixed-right-top'
                },

                {
                  label: '页面左下角',
                  value: 'fixed-left-bottom'
                },

                {
                  label: '页面右下角',
                  value: 'fixed-right-bottom'
                }
              ]
            },

            {
              name: 'popOver',
              asFormItem: true,
              label: false,
              children: ({value, onBulkChange, name}: any) => {
                value = {
                  type: 'panel',
                  title: '查看详情',
                  body: '内容详情',
                  ...value
                };

                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: '配置查看更多展示内容',
                        value: value,
                        onChange: value =>
                          onBulkChange({
                            [name]: value
                          })
                      });
                    }}
                  >
                    <span className="inline-flex items-center">
                      <Icon icon="edit" className="mr-1 w-3" />
                      配置内容
                    </span>
                  </Button>
                );
              }
            }
          ]
        }
      },

      {
        name: 'copyable',
        label: tipedLabel('复制内容', '默认为当前字段值，可定制。'),
        type: 'ae-switch-more',
        mode: 'normal',
        formType: 'extend',
        bulk: true,
        defaultData: {},
        form: {
          body: [
            {
              name: 'copyable.content',
              type: 'textarea',
              placehoder: '默认为当前字段的值',
              label: '内容模板'
            }
          ]
        }
      },

      {
        name: 'rowSpanExpr',
        type: 'ae-formulaControl',
        label: '合并行'
      },
      {
        name: 'colSpanExpr',
        type: 'ae-formulaControl',
        label: '合并列'
      }
    ];

    const baseStyle = [
      getSchemaTpl('withUnit', {
        name: 'width',
        label: tipedLabel('列宽', '固定列的宽度，不推荐设置。'),
        control: {
          name: 'width',
          type: 'input-number'
        },
        unit: 'px'
      }),

      {
        name: 'fixed',
        type: 'button-group-select',
        label: '固定位置',
        pipeIn: defaultValue(''),
        pipeOut(value: any) {
          if (!value) {
            return undefined;
          }
          return value;
        },
        options: [
          {
            value: '',
            label: '不固定'
          },

          {
            value: 'left',
            label: '左侧'
          },

          {
            value: 'right',
            label: '右侧'
          }
        ]
      },

      getSchemaTpl('switch', {
        name: 'toggled',
        label: '自定义列时默认展示',
        pipeIn: defaultValue(true)
      }),

      getSchemaTpl('switch', {
        name: 'className',
        label: '内容超出换行',
        pipeIn: (value: any) =>
          typeof value === 'string' && /\word\-break\b/.test(value),
        pipeOut: (value: any, originValue: any) =>
          (value ? 'word-break ' : '') +
          (originValue || '').replace(/\bword\-break\b/g, '').trim()
      })
    ];

    // 之前的面板，不是新的组件面板，需要添加新的tab，不能合并
    if (Array.isArray(data)) {
      if ((data[0] as SchemaObject).type === 'tabs') {
        const body = data[0] as TabsSchema;
        body.tabs.forEach((tab: any) => {
          if (tab.title === '常规') {
            tab.body.unshift(...base.concat(advanced));
          }

          if (tab.title === '外观') {
            tab.body.unshift(...baseStyle);
          }
        });
      } else {
        console.error('错误的组件合并对象，面板过老无法处理，除非增加新面板');
      }
      return;
    }

    (data as TabsSchema).tabs?.forEach((tab: any) => {
      if (tab.title === '属性') {
        tab.body[0].body.forEach((collapse: any) => {
          if (collapse.title === '基本') {
            const appendItems = fromPairs(
              base.map(item => [item.sameName ?? item.name, item])
            );

            const removeIndex: number[] = [];
            collapse.body.forEach((item: any, index: number) => {
              const key = item.name;

              // 重复意义的配置用现在的表达文案替换一下
              if (appendItems.hasOwnProperty(key)) {
                removeIndex.push(index);
                appendItems[key] = {
                  ...item,
                  ...appendItems[key]
                };
                return;
              }

              if (item.name === 'labelRemark') {
                removeIndex.push(index);
              }
            });

            removeIndex.reverse();
            removeIndex.forEach(index => {
              collapse.body.splice(index, 1);
            });

            collapse.body.unshift(...Object.values(appendItems));
          }
        });

        const moreCollapse = getSchemaTpl('collapseGroup', [
          {
            title: '列',
            body: advanced
          }
        ]);
        tab.body[0].body.splice(1, 0, ...moreCollapse.body);
        // 让折叠器默认都展开
        tab.body[0].activeKey.push(...moreCollapse.activeKey);
      }

      if (tab.title === '外观') {
        const moreCollapse = getSchemaTpl('collapseGroup', [
          {
            title: '列',
            body: baseStyle
          }
        ]);
        tab.body[0].body.splice(1, 0, ...moreCollapse.body);
        // 让折叠器默认都展开
        tab.body[0].activeKey.push(...moreCollapse.activeKey);
      }
    });
  }

  // filterProps(props: any) {
  //   props = JSONPipeOut(props, true);
  //   return props;
  // }

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const {renderer, schema} = context;

    if (renderer.name === 'cell-field') {
      return {
        name: schema.title ? `<${schema.title}>列` : '匿名列',
        $schema: '/schemas/TableColumn.json',
        multifactor: true,
        wrapperResolve: (dom: HTMLDivElement) => {
          // 固定这种结构 amis里改了 这里也得改
          const parent = dom.parentElement?.parentElement;
          const groupId = parent?.getAttribute('data-group-id');
          const wrapper = dom.closest('table')!.parentElement?.parentElement;
          return [].slice.call(
            wrapper?.querySelectorAll(
              `th[data-group-id="${groupId}"],
              td[data-group-id="${groupId}"]`
            )
          );
        }
        // filterProps: this.filterProps
      };
    }
  }

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/

  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    // 替换字段的时候保留 label 和 name 值。
    if (context.info.plugin === this && context.data) {
      context.data.title = context.data.title || context.schema.title;
      context.data.key = context.data.key || context.schema.key;
    }
  }
}

registerEditorPlugin(TableCell2Plugin);
