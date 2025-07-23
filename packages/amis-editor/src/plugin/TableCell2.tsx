import React, {StrictMode} from 'react';
import get from 'lodash/get';
import flattenDeep from 'lodash/flattenDeep';
import {Button, Icon} from 'amis';
import {dataMapping, getVariable, isObject} from 'amis-core';
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
  BaseEventContext
} from 'amis-editor-core';
import {remarkTpl} from '../component/BaseControl';

import type {DSField} from '../builder';
import {schemaToArray} from '../util';
import omit from 'lodash/omit';

export type TableCell2DynamicControls = Partial<
  Record<
    | 'name'
    | 'key'
    | 'sorter'
    | 'relationBuildSetting'
    | 'searchable'
    | 'quickEdit'
    | 'popover',
    (context: BaseEventContext) => any
  >
>;

export class TableCell2Plugin extends BasePlugin {
  static id = 'TableCell2Plugin';

  rendererName = 'cell-field';

  panelTitle = '列配置';

  panelIcon = 'fa fa-columns';

  panelJustify = true;

  /** 是否为操作列 */
  _isOpColumn?: boolean;

  /** NodeStore在构建时需要将一些信息添加进去 */
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const {renderer, schema} = context;

    if (this.rendererName === renderer?.name) {
      return {
        name: schema.title ? `<${schema.title}>列` : '匿名列',
        $schema: '/schemas/TableSchema.json',
        multifactor: true,
        wrapperResolve: (dom: HTMLDivElement) => {
          // 固定这种结构 amis里改了 这里也得改
          const parent = dom.parentElement?.parentElement;
          const col = parent?.getAttribute('data-col');
          const wrapper = dom.closest('table')!.parentElement?.parentElement;
          return [].slice.call(
            wrapper?.querySelectorAll(
              `th[data-col="${col}"],
              td[data-col="${col}"]`
            )
          );
        }
        // filterProps: (props: any) => {
        //   props = JSONPipeOut(props, true);
        //   return props;
        // }
      };
    }

    return super.getRendererInfo(context);
  }

  /** 更新渲染器前的事件，或者右键粘贴配置 */
  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    // 替换字段的时候保留 label 和 name 值。
    if (context.info.plugin === this && context.data) {
      context.data.title = context.data.title || context.schema.title;
      context.data.key = context.data.key || context.schema.key;
    }
  }

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
      // context.node.info.plugin.withDataSource === false
      //   ? false
      //   : {
      //       sameName: context.info.renderer.isFormItem ? 'name' : undefined,
      //       name: 'name',
      //       type: 'ae-DataBindingControl',
      //       label: '列字段',
      //       onBindingChange(
      //         field: DSField,
      //         onBulkChange: (value: any) => void
      //       ) {
      //         const schema = field?.resolveColumnSchema?.('List') || {
      //           title: field.label
      //         };
      //         onBulkChange(schema);
      //       }
      //     },
      {
        sameName: context.info.renderer.isFormItem ? 'name' : undefined,
        name: 'name',
        type: 'ae-DataBindingControl',
        label: '列字段',
        onBindingChange(field: DSField, onBulkChange: (value: any) => void) {
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

      getSchemaTpl('remark', {
        label: '标题提示'
      }),

      getSchemaTpl('placeholder')
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
        visibleOn: 'this.searchable',
        name: 'searchable',
        asFormItem: true,
        label: false,
        children: ({value, onChange, data}: any) => {
          if (value === true) {
            value = {};
          } else if (typeof value === 'undefined') {
            value = getVariable(data, 'searchable');
          }
        }
      }
    ];
  }

  protected _dynamicControls: TableCell2DynamicControls = {
    /** 字段配置 */
    name: () =>
      getSchemaTpl('formItemName', {
        name: 'name',
        label: '列字段',
        visibleOn: 'this.name !== undefined || this.key === undefined'
      }),
    /** 字段配置，兼容key */
    key: () =>
      getSchemaTpl('formItemName', {
        name: 'key',
        label: '列字段',
        visibleOn: 'this.name === undefined && this.key'
      }),
    /** 排序配置 */
    sorter: () =>
      getSchemaTpl('switch', {
        name: 'sorter',
        hidden: this._isOpColumn,
        label: tipedLabel(
          '可排序',
          '开启后可以根据当前列排序，接口类型将增加排序参数。'
        )
      }),
    /** 可搜索 */
    searchable: () => {
      return [
        getSchemaTpl('switch', {
          name: 'searchable',
          label: '可搜索',
          hidden: this._isOpColumn,
          pipeIn: (value: any) => !!value
        }),
        {
          name: 'searchable',
          visibleOn: 'this.searchable',
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
              body: value?.body?.length
                ? value.body
                : [
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
        }
      ];
    },
    /** 快速查看 */
    popover: () => {
      return {
        name: 'popOver',
        label: '弹出框',
        type: 'ae-switch-more',
        hidden: this._isOpColumn,
        bulk: false,
        mode: 'normal',
        formType: 'extend',
        defaultData: {
          mode: 'popOver',
          body: [
            {
              type: 'tpl',
              tpl: '弹出框内容',
              wrapperComponent: ''
            }
          ]
        },
        form: {
          body: [
            {
              name: 'mode',
              type: 'button-group-select',
              label: '模式',
              value: 'popOver',
              options: [
                {
                  label: '提示',
                  value: 'popOver'
                },
                {
                  label: '弹窗',
                  value: 'dialog'
                },
                {
                  label: '抽屉',
                  value: 'drawer'
                }
              ]
            },
            getSchemaTpl('formItemSize', {
              name: 'size',
              clearValueOnHidden: true,
              visibleOn: 'mode !== "popOver"'
            }),
            {
              type: 'select',
              name: 'position',
              label: '弹出位置',
              visibleOn: 'mode === "popOver"',
              options: [
                'center',
                'left-top',
                'right-top',
                'left-bottom',
                'right-bottom'
              ],
              clearValueOnHidden: true
            },
            {
              name: 'trigger',
              type: 'button-group-select',
              label: '触发方式',
              options: [
                {
                  label: '点击',
                  value: 'click'
                },
                {
                  label: '鼠标移入',
                  value: 'hover'
                }
              ],
              pipeIn: defaultValue('click')
            },
            getSchemaTpl('switch', {
              name: 'showIcon',
              label: '显示图标'
            }),
            {
              type: 'input-text',
              name: 'title',
              label: '标题'
            },
            {
              name: 'body',
              asFormItem: true,
              label: false,
              children: ({value: originValue, onChange}: any) => {
                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      this.manager.openSubEditor({
                        title: '配置弹出框',
                        value: schemaToArray(originValue),
                        slot: {
                          type: 'container',
                          body: '$$'
                        },
                        onChange
                      });
                    }}
                  >
                    <span className="inline-flex items-center">
                      <Icon icon="edit" className="mr-1 w-3" />
                      配置弹出框
                    </span>
                  </Button>
                );
              }
            }
          ]
        }
      };
    },
    /** 快速编辑 */
    quickEdit: context => {
      return {
        name: 'quickEdit',
        label: tipedLabel('快速编辑', '输入框左侧或右侧的附加挂件'),
        type: 'ae-switch-more',
        hidden: this._isOpColumn,
        mode: 'normal',
        bulk: false,
        formType: 'extend',
        defaultData: {
          mode: 'popOver'
        },
        form: {
          body: [
            {
              name: 'mode',
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

            getSchemaTpl('icon', {
              name: 'icon'
            }),

            getSchemaTpl('switch', {
              name: 'saveImmediately',
              label: tipedLabel(
                '修改立即保存',
                '开启后修改即提交，而不是批量提交，需要配置快速保存接口用于提交数据'
              ),
              pipeIn: (value: any) => !!value
            }),

            getSchemaTpl('apiControl', {
              label: '立即保存接口',
              description:
                '默认使用表格的「快速保存单条」接口，若单独给立即保存配置接口，则优先使用局部配置。',
              name: 'saveImmediately.api',
              visibleOn: 'this.saveImmediately'
            }),

            {
              asFormItem: true,
              label: false,
              children: ({onBulkChange}: any) => {
                // todo 多个快速编辑表单模式看来只能代码模式编辑了。
                return (
                  <Button
                    className="w-full flex flex-col items-center"
                    onClick={() => {
                      let data = context.node.schema.quickEdit
                        ? omit(context.node.schema.quickEdit, [
                            'saveImmediately',
                            'icon',
                            'mode'
                          ])
                        : {};
                      let originValue = data?.type
                        ? ['container', 'wrapper'].includes(data.type)
                          ? data
                          : {
                              // schema中存在容器，用自己的就行
                              type: 'container',
                              body: [data]
                            }
                        : {
                            type: 'container',
                            body: [
                              {
                                type: 'input-text',
                                name: context.node.schema.name
                              }
                            ]
                          };

                      this.manager.openSubEditor({
                        title: '配置快速编辑类型',
                        value: originValue,
                        onChange: value => onBulkChange(value)
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
      };
    }
  };

  /** 需要动态控制的控件 */
  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: TableCell2DynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][TableCell2Plugin] dynamicControls的值必须是一个对象'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const manager = this.manager;
    const dc = this.dynamicControls;
    this._isOpColumn = context?.schema?.type === 'operation';

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl(
          'collapseGroup',
          [
            {
              title: '数据源',
              hidden: this._isOpColumn,
              body: flattenDeep([
                /** 字段配置 */
                dc?.name?.(context),
                /** 字段配置，兼容key */
                dc?.key?.(context),
                getSchemaTpl('pageTitle', {
                  label: '列标题'
                }),
                getSchemaTpl('remark', {
                  label: '标题提示'
                }),
                getSchemaTpl('placeholder')
              ]).filter(Boolean)
            },
            dc?.relationBuildSetting?.(context),
            /** 操作列按钮配置 */
            {
              title: '操作按钮',
              hidden: !this._isOpColumn,
              body: [
                {
                  type: 'ae-feature-control',
                  strictMode: false, // 注意需要添加这个才能及时获取表单data变更
                  label: false,
                  manager,
                  addable: true,
                  sortable: true,
                  removeable: true,
                  features: () => {
                    const node = manager.store.getNodeById(context.id);

                    return (node?.schema?.buttons ?? []).map(
                      (item: any, index: number) => ({
                        label: item.label,
                        value: item.$$id || '',
                        remove: (schema: any) => {
                          if (schema?.buttons?.length) {
                            schema.buttons.splice(index, 1);
                          }
                        }
                      })
                    );
                  },
                  goFeatureComp: (feat: any) => feat.value,
                  onSort: (schema: any, e: any) => {
                    if (schema?.buttons?.length > 1) {
                      schema.buttons[e.oldIndex] = schema.buttons.splice(
                        e.newIndex,
                        1,
                        schema.buttons[e.oldIndex]
                      )[0];
                    }
                  },
                  customAction: (props: any) => {
                    const {onBulkChange, schema} = props;

                    return {
                      type: 'button',
                      label: '新增按钮',
                      level: 'enhance',
                      className: 'ae-FeatureControl-action',
                      onClick: () => {
                        schema.buttons.push({
                          label: '新增按钮',
                          level: 'link'
                        });
                        onBulkChange(schema);
                      }
                    };
                  }
                }
              ]
            },
            {
              title: '列设置',
              body: flattenDeep([
                getSchemaTpl('pageTitle', {
                  label: '列名称'
                }),
                {
                  type: 'ae-columnWidthControl',
                  name: 'width',
                  label: false,
                  formLabel: '列宽'
                },
                {
                  type: 'select',
                  name: 'align',
                  label: '对齐方式',
                  pipeIn: defaultValue('left'),
                  hidden: this._isOpColumn,
                  options: [
                    {label: '左对齐', value: 'left'},
                    {label: '居中对齐', value: 'center'},
                    {label: '右对齐', value: 'right'}
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
                    {label: '右对齐', value: 'right'}
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
                  name: 'textOverflow',
                  type: 'button-group-select',
                  label: '文本超出处理',
                  size: 'xs',
                  inputClassName: 'mt-1',
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
                {
                  type: 'select',
                  name: 'fixed',
                  label: '固定当前列',
                  hidden: this._isOpColumn,
                  options: [
                    {label: '不固定', value: false},
                    {label: '左侧固定', value: 'left'},
                    {label: '右侧固定', value: 'right'}
                  ]
                },
                {
                  type: 'ae-Switch-More',
                  mode: 'normal',
                  name: 'copyable',
                  label: '可复制',
                  trueValue: true,
                  formType: 'extend',
                  bulk: false,
                  form: {
                    body: [
                      {
                        name: 'content',
                        type: 'ae-formulaControl',
                        label: '复制内容'
                      }
                    ]
                  }
                },
                /** 排序设置 */
                dc?.sorter?.(context),
                /** 可搜索 */
                dc?.searchable?.(context),
                /** 快速查看 */
                dc?.popover?.(context),
                /** 快速编辑 */
                dc?.quickEdit?.(context)
              ]).filter(Boolean)
            }
          ].filter(Boolean)
        )
      }
      // {
      //   title: '外观',
      //   body: [
      //     getSchemaTpl('className'),
      //     getSchemaTpl('className', {
      //       name: 'innerClassName',
      //       label: '内部 CSS 类名'
      //     })
      //   ]
      // }
    ]);
  };
}

registerEditorPlugin(TableCell2Plugin);
