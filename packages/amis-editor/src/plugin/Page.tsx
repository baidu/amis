import {ContainerWrapper, JSONPipeOut} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  getSchemaTpl,
  defaultValue
} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import type {SchemaObject} from 'amis';
import {tipedLabel} from 'amis-editor-core';
import {jsonToJsonSchema, EditorNodeType} from 'amis-editor-core';
import omit from 'lodash/omit';

export class PagePlugin extends BasePlugin {
  static id = 'PagePlugin';
  // 关联渲染器名字
  rendererName = 'page';
  $schema = '/schemas/PageSchema.json';

  // 组件名称
  name = '页面';
  isBaseComponent = true;
  // 只有顶级才会用到这个page组件
  disabledRendererPlugin = true;
  description =
    '页面渲染器，页面的顶级入口。包含多个区域，您可以选择在不同的区域里面放置不同的渲染器。';
  docLink = '/amis/zh-CN/components/page';
  tags = '容器';
  icon = 'fa fa-desktop';
  // pluginIcon = 'page-plugin'; // 暂无新 icon
  scaffold: SchemaObject = {
    type: 'page',
    regions: ['body'],
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

  events: RendererPluginEvent[] = [
    {
      eventName: 'init',
      eventLabel: '初始化',
      description: '组件实例被创建并插入 DOM 中时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              description: '当前数据域，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'inited',
      eventLabel: '初始化数据接口请求完成',
      description: '远程初始化数据接口请求完成时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                responseData: {
                  type: 'object',
                  title: '响应数据'
                },
                responseStatus: {
                  type: 'number',
                  title: '响应状态(0表示成功)'
                },
                responseMsg: {
                  type: 'string',
                  title: '响应消息'
                }
              }
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
  actions: RendererPluginAction[] = [
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '变量赋值',
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
  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基本',
                body: [
                  {
                    type: 'checkboxes',
                    name: 'regions',
                    label: '区域展示',
                    pipeIn: (value: any) =>
                      Array.isArray(value)
                        ? value
                        : ['body', 'toolbar', 'aside', 'header'],
                    pipeOut: (value: any) => {
                      return Array.isArray(value) && value.length
                        ? value
                        : ['body', 'toolbar', 'aside', 'header'];
                    },
                    joinValues: false,
                    extractValue: true,
                    inline: false,
                    options: [
                      {
                        label: '内容区',
                        value: 'body'
                      },
                      {
                        label: '标题栏',
                        value: 'header'
                      },
                      {
                        label: '工具栏',
                        value: 'toolbar'
                      },
                      {
                        label: '边栏',
                        value: 'aside'
                      }
                    ]
                  },
                  getSchemaTpl('pageTitle'),
                  getSchemaTpl('pageSubTitle'),
                  getSchemaTpl('remark', {
                    label: '标题提示',
                    hiddenOn:
                      'data.regions && !data.regions.includes("header") || !data.title'
                  }),
                  {
                    type: 'ae-Switch-More',
                    name: 'asideResizor',
                    mode: 'normal',
                    label: '边栏宽度可调节',
                    hiddenOn: 'data.regions && !data.regions.includes("aside")',
                    value: false,
                    hiddenOnDefault: true,
                    formType: 'extend',
                    form: {
                      body: [
                        {
                          type: 'input-number',
                          label: '最小宽度',
                          min: 0,
                          name: 'asideMinWidth',
                          pipeIn: defaultValue(160),
                          pipeOut: (value: any) => value || 0
                        },
                        {
                          type: 'input-number',
                          label: '最大宽度',
                          min: 0,
                          name: 'asideMaxWidth',
                          pipeIn: defaultValue(350),
                          pipeOut: (value: any) => value || 0
                        }
                      ]
                    }
                  },
                  {
                    type: 'switch',
                    label: tipedLabel(
                      '边栏固定',
                      '边栏内容是否固定，即不跟随内容区滚动'
                    ),
                    name: 'asideSticky',
                    inputClassName: 'is-inline',
                    pipeIn: defaultValue(true),
                    hiddenOn: 'data.regions && !data.regions.includes("aside")'
                  }
                ]
              },
              {
                title: '数据',
                body: [
                  // page组件下掉组件静态数据配置项，可通过页面变量来定义页面中的变量
                  // getSchemaTpl('combo-container', {
                  //   type: 'input-kv',
                  //   mode: 'normal',
                  //   name: 'data',
                  //   label: '组件静态数据'
                  // }),
                  getSchemaTpl('apiControl', {
                    name: 'initApi',
                    mode: 'row',
                    labelClassName: 'none',
                    label: tipedLabel(
                      '初始化接口',
                      '用来获取初始数据的 api, 返回的数据可以整个 page 级别使用'
                    )
                  })
                ]
              },
              ,
              {
                title: '移动端',
                body: [
                  {
                    type: 'combo',
                    name: 'pullRefresh',
                    mode: 'normal',
                    noBorder: true,
                    items: [
                      {
                        type: 'ae-Switch-More',
                        mode: 'normal',
                        label: '下拉刷新',
                        name: 'disabled',
                        formType: 'extend',
                        value: true,
                        trueValue: false,
                        falseValue: true,
                        autoFocus: false,
                        form: {
                          body: [
                            {
                              name: 'pullingText',
                              label: tipedLabel('下拉文案', '下拉过程提示文案'),
                              type: 'input-text'
                            },
                            {
                              name: 'loosingText',
                              label: tipedLabel('释放文案', '释放过程提示文案'),
                              type: 'input-text'
                            }
                          ]
                        }
                      }
                    ]
                  }
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          className: 'p-none',
          body: [
            getSchemaTpl('collapseGroup', [
              ...getSchemaTpl('theme:common', {
                exclude: ['layout'],
                classname: 'baseControlClassName',
                baseTitle: '基本样式',
                extra: [
                  getSchemaTpl('theme:base', {
                    classname: 'bodyControlClassName',
                    title: '内容区样式',
                    hiddenOn: 'data.regions && !data.regions.includes("body")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'headerControlClassName',
                    title: '标题栏样式',
                    extra: [
                      getSchemaTpl('theme:font', {
                        label: '文字',
                        name: 'themeCss.titleControlClassName.font'
                      })
                    ],
                    hiddenOn: 'data.regions && !data.regions.includes("header")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'toolbarControlClassName',
                    title: '工具栏样式',
                    hiddenOn:
                      'data.regions && !data.regions.includes("toolbar")'
                  }),
                  getSchemaTpl('theme:base', {
                    classname: 'asideControlClassName',
                    title: '边栏样式',
                    hiddenOn: 'data.regions && !data.regions.includes("aside")'
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
        //               : {type: 'tpl', tpl: '内容', wrapperComponent: ''}
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
        // ]
        // }
      ])
    ];
  };

  async buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    let jsonschema = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data))
    };

    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema?.name) {
        jsonschema.properties[schema.name] =
          await current.info.plugin.buildDataSchemas?.(
            current,
            undefined,
            trigger,
            node
          );
      } else if (!current.rendererConfig?.storeType) {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'inited') {
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'pageInitedData',
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }
}

registerEditorPlugin(PagePlugin);
