import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {tipedLabel} from '../component/BaseControl';
import {ValidatorTag} from '../validator';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {RendererPluginEvent} from 'amis-editor-core';

import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class PaginationPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'pagination';
  $schema = '/schemas/PaginationSchema.json';

  // 组件名称
  name = '分页组件';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  description = '分页组件，可以对列表进行分页展示，提高页面性能';
  tags = ['容器'];
  icon = 'fa fa-window-minimize';
  // pluginIcon = 'pagination-plugin'; // 暂无新icon
  baseLayoutLIst = [
    {text: '总数', value: 'total', checked: false},
    {text: '每页条数', value: 'perPage', checked: false},
    {text: '分页', value: 'pager', checked: true},
    {text: '跳转', value: 'go', checked: false}
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
    maxButtons: 7
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
                label: '分页类型',
                type: 'button-group-select',
                size: 'sm',
                pipeIn: defaultValue('normal'),
                options: [
                  {
                    label: '普通',
                    value: 'normal'
                  },
                  {
                    label: '简易',
                    value: 'simple'
                  }
                ]
              },
              getSchemaTpl('combo-container', {
                name: 'layout',
                type: 'combo',
                label: tipedLabel(
                  '分页布局展示',
                  '选中表示渲染该项，可以拖拽排序调整显示的顺序'
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
                  let layoutList: string[] = [];
                  if (Array.isArray(value)) {
                    layoutList = value;
                  } else if (typeof value === 'string') {
                    layoutList = (value as string).split(',');
                  }
                  const layout = this.baseLayoutLIst.map(v => ({
                    ...v,
                    checked: layoutList.includes(v.value)
                  }));
                  return layout;
                },
                pipeOut: (value: any[]) => {
                  this.baseLayoutLIst = [...value];
                  return value.filter(v => v.checked).map(v => v.value);
                }
              }),
              {
                type: 'ae-formulaControl',
                label: '是否有下一页',
                name: 'hasNext',
                visibleOn: 'data.mode === "simple"'
              },
              {
                type: 'ae-formulaControl',
                label: '当前页',
                name: 'activePage'
              },
              {
                type: 'ae-formulaControl',
                label: '最后页码',
                name: 'lastPage',
                visibleOn: 'data.mode === "normal"'
              },
              {
                type: 'ae-formulaControl',
                label: '总条数',
                name: 'total',
                visibleOn: 'data.mode === "normal"'
              },
              getSchemaTpl('combo-container', {
                name: 'perPageAvailable',
                type: 'combo',
                label: '每页条数选项',
                visibleOn:
                  'data.mode === "normal" && data.layout?.includes("perPage")',
                mode: 'normal',
                multiple: true,
                multiLine: false,
                addable: true,
                removable: true,
                draggable: true,
                editable: true,
                minLength: 1,
                tabsStyle: 'inline',
                items: [
                  {
                    type: 'input-number',
                    name: 'value',
                    min: 1
                  }
                ],
                pipeIn: (value: any[]) => {
                  return value.map(v => ({value: v}));
                },
                pipeOut: (value: any[]) => {
                  return value.map(v => v.value);
                }
              }),
              {
                name: 'perPage',
                type: 'input-text',
                label: '默认每页条数',
                visibleOn:
                  'data.mode === "normal" && data.layout?.includes("perPage")'
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
                visibleOn: 'data.mode === "normal"'
              }
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
