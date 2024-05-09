import {
  BasePlugin,
  RegionConfig,
  BaseEventContext,
  tipedLabel,
  defaultValue,
  getSchemaTpl,
  RendererPluginEvent,
  registerEditorPlugin
} from 'amis-editor-core';
import sortBy from 'lodash/sortBy';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class PaginationPlugin extends BasePlugin {
  static id = 'PaginationPlugin';
  // 关联渲染器名字
  rendererName = 'pagination';
  $schema = '/schemas/PaginationSchema.json';

  // 组件名称
  name = '分页组件';
  isBaseComponent = true;
  description = '分页组件，可以对列表进行分页展示，提高页面性能';
  docLink = '/amis/zh-CN/components/pagination';
  tags = ['展示'];
  icon = 'fa fa-window-minimize';
  lastLayoutSetting = ['pager'];
  layoutOptions = [
    {text: '总数', value: 'total', checked: false},
    {text: '每页条数', value: 'perPage', checked: false},
    {text: '分页', value: 'pager', checked: true},
    {text: '跳转页', value: 'go', checked: false}
  ];
  scaffold = {
    type: 'pagination',
    mode: 'normal',
    layout: ['pager'],
    activePage: 1,
    lastPage: 1,
    total: 1,
    hasNext: false,
    disabled: false,
    perPageAvailable: [10, 20, 50, 100],
    perPage: 10,
    maxButtons: 7,
    ellipsisPageGap: 5
  };
  previewSchema = {
    ...this.scaffold
  };
  panelTitle = '分页器';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入内容变化',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                page: {
                  type: 'number',
                  title: '当前页码值'
                },
                perPage: {
                  type: 'number',
                  title: '每页显示的记录数'
                }
              },
              description: '当前数据域，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    }
  ];

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
                name: 'mode',
                label: '模式',
                type: 'button-group-select',
                size: 'sm',
                pipeIn: defaultValue('normal'),
                options: [
                  {
                    label: '默认',
                    value: 'normal'
                  },
                  {
                    label: '简约',
                    value: 'simple'
                  }
                ]
              },
              // {
              //   name: 'hasNext',
              //   label: '是否有下一页',
              //   mode: 'row',
              //   inputClassName: 'inline-flex justify-between flex-row-reverse',
              //   type: 'switch',
              //   visibleOn: 'this.mode === "simple"'
              // },
              // {
              //   name: 'activePage',
              //   label: tipedLabel('当前页', '支持使用 \\${xxx} 来获取变量'),
              //   type: 'input-text'
              // },
              // {
              //   name: 'lastPage',
              //   label: tipedLabel('最后页码', '支持使用 \\${xxx} 来获取变量'),
              //   type: 'input-text',
              //   visibleOn: 'this.mode === "normal"'
              // },
              // {
              //   name: 'total',
              //   label: tipedLabel('总条数', '支持使用 \\${xxx} 来获取变量'),
              //   type: 'input-text',
              //   visibleOn: 'this.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'layout',
                type: 'combo',
                label: tipedLabel(
                  '启用功能',
                  '选中表示启用该项，可以拖拽排序调整功能的顺序'
                ),
                visibleOn: '!this.mode || this.mode === "normal"',
                mode: 'normal',
                multiple: true,
                multiLine: false,
                addable: false,
                removable: false,
                draggable: true,
                editable: false,
                minLength: 1,
                tabsStyle: 'inline',
                formClassName: 'ae-pagination-layout-item',
                items: [
                  {
                    type: 'checkbox',
                    name: 'checked',
                    inputClassName: 'p-t-none mt-1.5'
                  },
                  {
                    type: 'tpl',
                    name: 'text',
                    className: 'inline-block pt-1.5'
                  }
                ],
                pipeIn: (value: any) => {
                  if (typeof value === 'string') {
                    value = (value as string).split(',');
                  } else if (!value || !Array.isArray(value)) {
                    value = this.lastLayoutSetting;
                  }

                  return sortBy(
                    this.layoutOptions.map(op => ({
                      ...op,
                      checked: value.includes(op.value)
                    })),
                    [
                      item => {
                        const idx = value.findIndex(
                          (v: string) => v === item.value
                        );
                        return ~idx ? idx : Infinity;
                      }
                    ]
                  );

                  // return this.layoutOptions.map(v => ({
                  //   ...v,
                  //   checked: value.includes(v.value)
                  // }));
                },
                pipeOut: (value: any[]) => {
                  this.lastLayoutSetting = value
                    .filter(v => v.checked)
                    .map(v => v.value);
                  return this.lastLayoutSetting.concat();
                }
              }),
              // {
              //   name: 'showPerPage',
              //   label: '显示每页条数',
              //   mode: 'row',
              //   inputClassName: 'inline-flex justify-between flex-row-reverse',
              //   type: 'switch',
              //   visibleOn: 'this.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'perPageAvailable',
                type: 'combo',
                label: '每页条数选项',
                visibleOn:
                  '(!this.mode || this.mode === "normal") && this.layout && this.layout.includes("perPage")',
                mode: 'normal',
                multiple: true,
                multiLine: false,
                addable: true,
                removable: true,
                draggable: true,
                editable: true,
                minLength: 1,
                tabsStyle: 'inline',
                addButtonClassName: 'm-b-sm',
                items: [
                  {
                    type: 'input-number',
                    name: 'value',
                    min: 1
                  }
                ],
                pipeIn: (value: any[]) => {
                  return value?.map(v => ({value: v})) || [10];
                },
                pipeOut: (value: any[]) => {
                  const pages = value.map(v => v.value);
                  return pages.map(
                    page => page || Math.max(...pages.filter(Boolean)) + 5
                  );
                }
              }),
              {
                name: 'perPage',
                type: 'input-number',
                label: '默认每页条数',
                visibleOn:
                  '(!this.mode || this.mode === "normal") && this.layout?.includes("perPage")'
              },
              {
                name: 'maxButtons',
                label: tipedLabel(
                  '最多按钮数',
                  '最多显示多少个分页按钮，最小为5，最大值为20'
                ),
                type: 'input-number',
                min: 5,
                max: 20,
                pipeOut: (value: any) => value || 5,
                visibleOn: '!this.mode || this.mode === "normal"'
              },
              {
                name: 'ellipsisPageGap',
                label: '多页跳转页数',
                type: 'input-number',
                min: 1,
                pipeIn: (value: any) => value || 5,
                pipeOut: (value: any) => value || 5,
                visibleOn: 'this.mode && this.mode === "normal"'
              }
            ]
          },
          {
            title: '状态',
            body: [
              getSchemaTpl('disabled'),
              getSchemaTpl('hidden'),
              getSchemaTpl('visible')
            ]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'select',
                name: 'size',
                label: '尺寸',
                value: '',
                pipeIn: defaultValue('md'),
                options: [
                  {
                    label: '正常',
                    value: 'md'
                  },

                  {
                    label: '微型',
                    value: 'sm'
                  }
                ]
              }
            ]
          },
          getSchemaTpl('style:classNames', {isFormItem: false})
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];
}

registerEditorPlugin(PaginationPlugin);
