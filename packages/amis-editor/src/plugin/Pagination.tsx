import {getEventControlConfig} from '../util';
import {
  getSchemaTpl,
  defaultValue,
  tipedLabel,
  BasePlugin,
  RendererPluginEvent,
  RegionConfig,
  BaseEventContext,
  registerEditorPlugin
} from 'amis-editor-core';

export class PaginationPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'pagination';
  $schema = '/schemas/PaginationSchema.json';

  // 组件名称
  name = '分页组件';
  isBaseComponent = false;
  description = '分页组件，可以对列表进行分页展示，提高页面性能';
  tags = ['容器'];
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
    showPerPage: false,
    perPageAvailable: [10, 20, 50, 100],
    perPage: 10,
    maxButton: 7,
    showPageInput: false
  };
  previewSchema = {
    ...this.scaffold
  };
  panelTitle = '分页器';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'pageChange',
      eventLabel: '分页改变',
      description: '分页改变'
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
              //   visibleOn: 'data.mode === "simple"'
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
              //   visibleOn: 'data.mode === "normal"'
              // },
              // {
              //   name: 'total',
              //   label: tipedLabel('总条数', '支持使用 \\${xxx} 来获取变量'),
              //   type: 'input-text',
              //   visibleOn: 'data.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'layout',
                type: 'combo',
                label: tipedLabel(
                  '启用功能',
                  '选中表示启用该项，可以拖拽排序调整功能的顺序'
                ),
                visibleOn: 'data.mode === "normal"',
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
                    className: 'm-t-n-xxs'
                  },
                  {
                    type: 'tpl',
                    name: 'text',
                    className: 'p-t-xs'
                  }
                ],
                pipeIn: (value: any) => {
                  if (!value) {
                    value = this.lastLayoutSetting;
                  } else if (typeof value === 'string') {
                    value = (value as string).split(',');
                  }
                  return this.layoutOptions.map(v => ({
                    ...v,
                    checked: value.includes(v.value)
                  }));
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
              //   visibleOn: 'data.mode === "normal"'
              // },
              getSchemaTpl('combo-container', {
                name: 'perPageAvailable',
                type: 'combo',
                label: '每页条数选项',
                visibleOn:
                  'data.mode === "normal" && data.layout && data.layout.includes("perPage")',
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
                  return value.map(v => v.value);
                }
              })
              // {
              //   name: 'perPage',
              //   type: 'input-text',
              //   label: '默认每页条数',
              //   visibleOn: 'data.mode === "normal"'
              // },
              // {
              //   name: 'maxButton',
              //   label: tipedLabel('分页按钮数量', '超过此数量，将会隐藏多余按钮'),
              //   type: 'input-number',
              //   min: 5,
              //   max: 20,
              //   pipeIn: defaultValue(5),
              //   visibleOn: 'data.mode === "normal"'
              // }
              // {
              //   name: 'showPageInput',
              //   label: '显示页面跳转',
              //   mode: 'row',
              //   inputClassName: 'inline-flex justify-between flex-row-reverse',
              //   type: 'switch',
              //   visibleOn: 'data.mode === "normal"'
              // }
            ]
          },
          {
            title: '状态',
            body: [getSchemaTpl('disabled')]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
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
