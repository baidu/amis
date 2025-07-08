import {Button} from 'amis';
import React from 'react';
import get from 'lodash/get';
import {
  getI18nEnabled,
  registerEditorPlugin,
  tipedLabel
} from 'amis-editor-core';
import {
  BasePlugin,
  BasicRendererInfo,
  BaseEventContext,
  RendererInfoResolveEventContext,
  ReplaceEventContext,
  PluginEvent
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {getVariable} from 'amis-core';

export class TableCellPlugin extends BasePlugin {
  static id = 'TableCellPlugin';
  panelTitle = '列配置';
  panelIcon = 'fa fa-columns';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            /*{
              children: (
                <Button
                  size="sm"
                  level="info"
                  className="m-b"
                  block
                  onClick={this.exchangeRenderer.bind(this, context.id)}
                >
                  更改渲染器类型
                </Button>
              )
            },*/
            getSchemaTpl('label', {
              label: '列名称'
            }),

            getSchemaTpl('formItemName', {
              label: '绑定字段名'
            }),

            getSchemaTpl('tableCellRemark'),

            getSchemaTpl('tableCellPlaceholder'),

            getSchemaTpl('switch', {
              name: 'sortable',
              label: '是否可排序',
              description: '开启后可以根据当前列排序(后端排序)。'
            })
          ]
        },
        {
          title: '高级',
          body: [
            {
              name: 'groupName',
              label: '列分组名称',
              type: i18nEnabled ? 'input-text-i18n' : 'input-text',
              description:
                '当多列的分组名称设置一致时，表格会在显示表头的上层显示超级表头，<a href="https://baidu.github.io/amis/zh-CN/components/table#%E8%B6%85%E7%BA%A7%E8%A1%A8%E5%A4%B4" target="_blank">示例</a>'
            },

            getSchemaTpl('switch', {
              name: 'quickEdit',
              label: '启用快速编辑',
              isChecked: (e: any) => {
                const {data, name} = e;
                return !!get(data, name);
              },
              pipeIn: (value: any) => !!value
            }),

            {
              visibleOn: 'this.quickEdit',
              name: 'quickEdit.mode',
              type: 'button-group-select',
              value: 'popOver',
              label: '快速编辑模式',
              size: 'xs',
              mode: 'inline',
              className: 'w-full',
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

            getSchemaTpl('icon', {
              name: 'quickEdit.icon'
            }),

            getSchemaTpl('switch', {
              name: 'quickEdit.saveImmediately',
              label: '是否立即保存',
              visibleOn: 'this.quickEdit',
              description: '开启后修改即提交，而不是标记修改批量提交。',
              descriptionClassName: 'help-block m-b-none',
              pipeIn: (value: any) => !!value
            }),

            getSchemaTpl('apiControl', {
              label: '立即保存接口',
              description:
                '是否单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
              name: 'quickEdit.saveImmediately.api',
              visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
            }),

            {
              visibleOn: 'this.quickEdit',
              name: 'quickEdit',
              asFormItem: true,
              children: ({value, onChange, data}: any) => {
                if (value === true) {
                  value = {};
                } else if (typeof value === 'undefined') {
                  value = getVariable(data, 'quickEdit');
                }
                value = {...value};
                const originMode = value.mode || 'popOver';
                if (value.mode) {
                  delete value.mode;
                }
                const originSaveImmediately = value.saveImmediately;
                if (value.saveImmediately) {
                  delete value.saveImmediately;
                }
                value =
                  value.body && ['container', 'wrapper'].includes(value.type)
                    ? {
                        // schema中存在容器，用自己的就行
                        type: 'wrapper',
                        body: [],
                        ...value
                      }
                    : {
                        // schema中不存在容器，打开子编辑器时需要包裹一层
                        type: 'wrapper',
                        body: [
                          {
                            type: 'input-text',
                            name: data.name,
                            ...value
                          }
                        ]
                      };

                // todo 多个快速编辑表单模式看来只能代码模式编辑了。
                return (
                  <Button
                    level="info"
                    className="m-b"
                    size="sm"
                    block
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: '配置快速编辑类型',
                        value: value,
                        onChange: value =>
                          onChange(
                            {
                              ...value,
                              mode: originMode,
                              saveImmediately: originSaveImmediately
                            },
                            'quickEdit'
                          )
                      });
                    }}
                  >
                    配置快速编辑
                  </Button>
                );
              }
            },

            getSchemaTpl('switch', {
              name: 'popOver',
              label: '启用查看更多展示',
              pipeIn: (value: any) => !!value
            }),

            {
              name: 'popOver.mode',
              label: '查看更多弹出模式',
              type: 'select',
              visibleOn: 'this.popOver',
              pipeIn: defaultValue('popOver'),
              options: [
                {
                  label: '默认',
                  value: 'popOver'
                },

                {
                  label: '弹框',
                  value: 'dialog'
                },

                {
                  label: '抽出式弹框',
                  value: 'drawer'
                }
              ]
            },

            {
              name: 'popOver.position',
              label: '查看更多弹出模式',
              type: 'select',
              visibleOn: 'this.popOver && this.popOver.mode === "popOver"',
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
              visibleOn: 'this.popOver',
              name: 'popOver',
              asFormItem: true,
              children: ({value, onChange}: any) => {
                value = {
                  type: 'panel',
                  title: '查看详情',
                  body: '内容详情',
                  ...value
                };

                return (
                  <Button
                    level="info"
                    className="m-b"
                    size="sm"
                    block
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: '配置查看更多展示内容',
                        value: value,
                        onChange: value => onChange(value, 'popOver')
                      });
                    }}
                  >
                    查看更多内容配置
                  </Button>
                );
              }
            },

            getSchemaTpl('switch', {
              name: 'copyable',
              label: '启用内容复制功能',
              pipeIn: (value: any) => !!value
            }),

            {
              visibleOn: 'this.copyable',
              name: 'copyable.content',
              type: 'textarea',
              label: '复制内容模板',
              description: '默认为当前字段值，可定制。'
            }
          ]
        },
        {
          title: '外观',
          body: [
            {
              type: 'select',
              name: 'align',
              label: '对齐方式',
              pipeIn: defaultValue('left'),
              options: [
                {label: '左对齐', value: 'left'},
                {label: '居中对齐', value: 'center'},
                {label: '右对齐', value: 'right'},
                {label: '两端对齐', value: 'justify'}
              ]
            },
            {
              type: 'select',
              name: 'headerAlign',
              label: '表头对齐方式',
              pipeIn: defaultValue(''),
              options: [
                {label: '复用对齐方式', value: ''},
                {label: '左对齐', value: 'left'},
                {label: '居中对齐', value: 'center'},
                {label: '右对齐', value: 'right'},
                {label: '两端对齐', value: 'justify'}
              ]
            },
            {
              type: 'select',
              name: 'vAlign',
              label: '垂直对齐方式',
              pipeIn: defaultValue('middle'),
              options: [
                {label: '顶部对齐', value: 'top'},
                {label: '垂直居中', value: 'middle'},
                {label: '底部对齐', value: 'bottom'}
              ]
            },
            {
              name: 'fixed',
              type: 'button-group-select',
              label: '固定位置',
              pipeIn: defaultValue(''),
              size: 'xs',
              mode: 'inline',
              inputClassName: 'mt-1 w-full',
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
              label: '默认展示',
              pipeIn: defaultValue(true)
            }),

            {
              name: 'breakpoint',
              type: 'button-group-select',
              label: '触发底部显示条件',
              visibleOn: 'this.tableFootableEnabled',
              size: 'xs',
              multiple: true,
              options: [
                {
                  label: '总是',
                  value: '*'
                },
                {
                  label: '手机端',
                  value: 'xs'
                },
                {
                  label: '平板',
                  value: 'sm'
                },
                {
                  label: 'PC小屏',
                  value: 'md'
                },
                {
                  label: 'PC大屏',
                  value: 'lg'
                }
              ],
              pipeIn: (value: any) =>
                value ? (typeof value === 'string' ? value : '*') : '',
              pipeOut: (value: any) =>
                typeof value === 'string' &&
                ~value.indexOf('*') &&
                /xs|sm|md|lg/.test(value)
                  ? value.replace(/\*\s*,\s*|\s*,\s*\*/g, '')
                  : value
            },
            {
              name: 'textOverflow',
              type: 'button-group-select',
              label: '文本超出处理',
              size: 'xs',
              mode: 'inline',
              inputClassName: 'mt-1 w-full',
              pipeIn: defaultValue('default'),
              options: [
                {
                  label: '默认',
                  value: 'default'
                },
                {
                  label: '溢出隐藏',
                  value: 'ellipsis'
                },
                {
                  label: '取消换行',
                  value: 'noWrap'
                }
              ]
            },
            getSchemaTpl('switch', {
              name: 'className',
              label: tipedLabel(
                '允许任意字符间断行',
                '开启此项，换行处理将在任意字母处断行，长英文单词或长英文字符会被切断，如url链接'
              ),
              pipeIn: (value: any) =>
                typeof value === 'string' && /\word\-break\b/.test(value),
              pipeOut: (value: any, originValue: any) =>
                (value ? 'word-break ' : '') +
                (originValue || '').replace(/\bword\-break\b/g, '').trim()
            }),

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              name: 'innerClassName',
              label: '内部 CSS 类名'
            }),

            getSchemaTpl('theme:width2', {
              name: 'width',
              label: '列宽'
            })
          ]
        }
      ])
    ];
  };

  // filterProps(props: any) {
  //   props = JSONPipeOut(props, true);
  //   return props;
  // }

  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    if (renderer.name === 'table-cell') {
      return {
        name: schema.label ? `<${schema.label}>列` : '匿名列',
        $schema: '/schemas/TableColumn.json',
        multifactor: true,
        wrapperResolve: (dom: HTMLTableCellElement) => {
          const siblings = [].slice.call(dom.parentElement!.children);
          const index = siblings.indexOf(dom) + 1;
          const table = dom.closest('table')!;

          return [].slice.call(
            table.querySelectorAll(
              `th:nth-child(${index}):not([data-editor-id="${schema.id}"]),
              td:nth-child(${index}):not([data-editor-id="${schema.id}"])`
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
      context.data.label = context.data.label || context.schema.label;
      context.data.name = context.data.name || context.schema.name;
    }
  }
}

registerEditorPlugin(TableCellPlugin);
