import {ContainerWrapper} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {getEventControlConfig} from '../util';
import {
  RendererAction,
  RendererEvent
} from 'amis-editor-comp/dist/renderers/event-action';
import type {SchemaObject} from 'amis/lib/Schema';

export class PagePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'page';
  $schema = '/schemas/PageSchema.json';

  // 组件名称
  name = '页面';
  isBaseComponent = true;
  // 注释掉是为了不让它在出现在组件列表中，因为只有顶级才会用到这个。
  // description =
  //   '页面渲染器，页面的顶级入口。包含多个区域，您可以选择在不同的区域里面放置不同的渲染器。';
  docLink = '/amis/zh-CN/components/page';
  tags = '容器';
  icon = 'fa fa-desktop';
  scaffold: SchemaObject = {
    type: 'page',
    body: [
      {
        type: 'tpl',
        tpl: '内容'
      }
    ]
  };
  previewSchema: SchemaObject = {
    type: 'page',
    className: 'text-left b-a',
    asideClassName: 'w-xs',
    title: '标题',
    subTitle: '副标题',
    aside: '边栏',
    body: '内容'
  };

  events: RendererEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '初始化完成',
      description: '远程初始化接口请求成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '远程请求返回的初始化数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'pullRefresh',
      eventLabel: '下拉刷新',
      description: '开启下拉刷新后，下拉释放后触发（仅用于移动端）'
    }
  ];

  // 动作定义
  actions: RendererAction[] = [
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '更新数据',
      description: '触发组件数据更新'
    }
  ];

  // 普通容器类渲染器配置
  regions = [
    {key: 'toolbar', label: '工具栏', preferTag: '工具栏内容'},
    {key: 'aside', label: '边栏', placeholder: '边栏内容'},
    {key: 'body', label: '内容区', placeholder: '页面内容'}
  ];
  wrapper = ContainerWrapper;

  panelTitle = '页面';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            {
              type: 'checkboxes',
              name: 'regions',
              label: '区域展示',
              pipeIn: (value: any) =>
                Array.isArray(value)
                  ? value
                  : ['auto', 'body', 'toolbar', 'aside', 'header'],
              pipeOut: (value: any) => {
                return Array.isArray(value) && ~value.indexOf('auto')
                  ? undefined
                  : value.length
                  ? value
                  : ['auto', 'body', 'toolbar', 'aside', 'header'];
              },
              joinValues: false,
              extractValue: true,
              inline: false,
              options: [
                {
                  label: '自动',
                  value: 'auto'
                },
                {
                  label: '内容区',
                  value: 'body',
                  disabledOn:
                    '!Array.isArray(this.regions) || ~this.regions.indexOf("auto")'
                },
                {
                  label: '边栏',
                  value: 'aside',
                  disabledOn:
                    '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")'
                },
                {
                  label: '工具栏',
                  value: 'toolbar',
                  disabledOn:
                    '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")'
                },
                {
                  label: '顶部',
                  value: 'header',
                  disabledOn:
                    '!Array.isArray(this.regions) ||~this.regions.indexOf("auto")'
                }
              ]
            },

            {
              label: '标题',
              name: 'title',
              type: 'input-text'
            },

            {
              label: '副标题',
              name: 'subTitle',
              type: 'input-text'
            },

            {
              label: '提示',
              name: 'remark',
              type: 'textarea',
              visibleOn: 'this.title',
              description:
                '标题附近会出现一个提示图标，鼠标放上去会提示该内容。'
            },
            getSchemaTpl('data')
          ]
        },

        {
          title: '接口',
          body: [
            getSchemaTpl('api', {
              label: '数据初始化接口',
              name: 'initApi',
              sampleBuilder: (schema: any) => `{
  "status": 0,
  "msg": "",

  data: {
    // 示例数据
    "id": 1,
    "a": "sample"
  }
}`
            }),

            getSchemaTpl('initFetch'),

            getSchemaTpl('switch', {
              label: '开启定时刷新',
              name: 'interval',
              visibleOn: 'data.initApi',
              pipeIn: (value: any) => !!value,
              pipeOut: (value: any) => (value ? 3000 : undefined)
            }),

            {
              name: 'interval',
              type: 'input-number',
              visibleOn: 'typeof this.interval === "number"',
              step: 500
            },

            getSchemaTpl('switch', {
              name: 'silentPolling',
              label: '静默刷新',
              visibleOn: '!!data.interval',
              description: '设置自动定时刷新时是否显示loading'
            }),

            {
              name: 'stopAutoRefreshWhen',
              label: '停止定时刷新检测表达式',
              type: 'input-text',
              visibleOn: '!!data.interval',
              description:
                '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
            },

            {
              label: '默认消息提示',
              type: 'combo',
              name: 'messages',
              multiLine: true,
              description:
                '设置 ajax 默认提示信息，当 ajax 没有返回 msg 信息时有用，如果 ajax 返回携带了 msg 值，则还是以 ajax 返回为主',
              items: [
                {
                  label: '获取成功提示',
                  type: 'input-text',
                  name: 'fetchSuccess'
                },

                {
                  label: '获取失败提示',
                  type: 'input-text',
                  name: 'fetchFailed'
                },

                {
                  label: '保存成功提示',
                  type: 'input-text',
                  name: 'saveSuccess'
                },

                {
                  label: '保存失败提示',
                  type: 'input-text',
                  name: 'saveFailed'
                }
              ]
            }
          ]
        },
        {
          title: '外观',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              ...getSchemaTpl('style:common'),
              getSchemaTpl('style:className', {
                isFormItem: false,
                schema: [
                  getSchemaTpl('className', {
                    name: 'headerClassName',
                    label: '头部CSS类名'
                  }),
                  getSchemaTpl('className', {
                    name: 'bodyClassName',
                    label: '内容CSS类名'
                  }),

                  getSchemaTpl('className', {
                    name: 'asideClassName',
                    label: '边栏CSS类名'
                  }),

                  getSchemaTpl('className', {
                    name: 'toolbarClassName',
                    label: '工具栏CSS类名'
                  })
                ]
              })
            ])
          ]
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
        },
        {
          title: '其他',
          body: [
            {
              type: 'combo',
              name: 'pullRefresh',
              multiLine: true,
              noBorder: true,
              items: [
                {
                  type: 'switch',
                  label: '移动端下拉刷新',
                  name: 'disabled',
                  mode: 'horizontal',
                  horizontal: {
                    justify: true,
                    left: 8
                  },
                  inputClassName: 'is-inline ',
                  trueValue: false,
                  falseValue: true
                },
                {
                  name: 'pullingText',
                  label: '下拉过程提示文案',
                  type: 'input-text',
                  visibleOn: '!this.disabled'
                },
                {
                  name: 'loosingText',
                  label: '释放过程提示文案',
                  type: 'input-text',
                  visibleOn: '!this.disabled'
                }
              ]
            }

            // {
            //   type: 'combo',
            //   name: 'definitions',
            //   multiple: true,
            //   multiLine: true,
            //   label: '定义',
            //   description: '定义类型，定义完成后可被子节点引用。',
            //   pipeIn: (value: any) =>
            //     value
            //       ? Object.keys(value).map(key => ({
            //           key,
            //           value: value[key]
            //         }))
            //       : [],
            //   pipeOut: (value: any) =>
            //     Array.isArray(value)
            //       ? value.reduce(
            //           (obj, current) => ({
            //             ...obj,
            //             [current.key || '']: current.value
            //               ? current.value
            //               : {type: 'tpl', tpl: '内容'}
            //           }),
            //           {}
            //         )
            //       : undefined,
            //   items: [
            //     {
            //       type: 'input-text',
            //       name: 'key',
            //       label: 'Key',
            //       required: true
            //     },

            //     {
            //       children: ({index}: any) => (
            //         <Button
            //           size="sm"
            //           level="danger"
            //           // onClick={this.handleEditDefinitionDetail.bind(
            //           //   this,
            //           //   index
            //           // )}
            //           block
            //         >
            //           配置详情
            //         </Button>
            //       )
            //     }
            //   ]
            // }
          ]
        }
      ])
    ];
  };
}

registerEditorPlugin(PagePlugin);
