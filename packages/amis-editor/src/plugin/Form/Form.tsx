import {registerEditorPlugin} from 'amis-editor-core';
import {
  BasePlugin,
  ChangeEventContext,
  BaseEventContext,
  PluginEvent,
  RegionConfig,
  ScaffoldForm
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {jsonToJsonSchema} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {setVariable} from 'amis-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';

// 用于脚手架的常用表单控件
const formItemOptions = [
  {
    name: 'type',
    label: '控件类型',
    type: 'select',
    required: true,
    options: [
      {
        label: '单行文本框',
        value: 'input-text'
      },
      {
        label: '多行文本',
        value: 'textarea'
      },
      {
        label: '分组',
        value: 'group'
      },
      {
        label: '数字输入',
        value: 'input-number'
      },
      {
        label: '单选框',
        value: 'radios'
      },
      {
        label: '勾选框',
        value: 'checkbox'
      },
      {
        label: '复选框',
        value: 'checkboxes'
      },
      {
        label: '下拉框',
        value: 'select'
      },
      {
        label: '开关',
        value: 'switch'
      },
      {
        label: '日期',
        value: 'input-date'
      },
      {
        label: '表格',
        value: 'input-table'
      },
      {
        label: '文件上传',
        value: 'input-file'
      },
      {
        label: '图片上传',
        value: 'input-image'
      },
      {
        label: '富文本编辑器',
        value: 'input-rich-text'
      }
    ]
  },
  {
    name: 'label',
    label: '显示名称',
    type: 'input-text',
    hiddenOn: 'data.type === "group"'
  },
  {
    name: 'name',
    label: '提交字段名',
    required: true,
    type: 'input-text',
    hiddenOn: 'data.type === "group"'
  }
];

export class FormPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'form';
  $schema = '/schemas/FormSchema.json';

  order = -999;

  // 组件名称
  name = '表单';
  isBaseComponent = true;
  description =
    '可用于新建、编辑或者展示数据，配置初始化接口可从远端加载数据，配置提交接口可将数据发送远端。另外也可以将数据提交给其他组件，与其他组件通信。';
  docLink = '/amis/zh-CN/components/form/index';
  tags = ['功能'];
  icon = 'fa fa-list-alt';
  pluginIcon = 'form-plugin';
  scaffold = {
    type: 'form',
    title: '表单',
    body: [
      {
        label: '文本框',
        type: 'input-text',
        name: 'text'
      }
    ]
  };
  previewSchema = {
    type: 'form',
    panelClassName: 'Panel--default text-left m-b-none',
    mode: 'horizontal',
    body: [
      {
        label: '文本',
        name: 'a',
        type: 'input-text'
      }
    ]
  };

  scaffoldForm: ScaffoldForm = {
    title: '快速创建表单',
    body: [
      getSchemaTpl('apiControl', {
        label: '提交地址'
      }),
      {
        name: 'mode',
        label: '文字与输入框展示模式',
        type: 'button-group-select',
        pipeIn: defaultValue('normal', false),
        options: [
          {
            label: '上下',
            value: 'normal'
          },
          {
            label: '左右摆放',
            value: 'horizontal'
          },
          {
            label: '内联',
            value: 'inline'
          }
        ]
      },
      {
        label: '表单控件',
        type: 'combo',
        name: 'body',
        multiple: true,
        draggable: true,
        multiLine: false,
        items: [
          ...formItemOptions,
          {
            visibleOn: 'data.type === "group"',
            type: 'combo',
            name: 'body',
            label: '分组内的控件',
            multiple: true,
            draggable: true,
            multiLine: true,
            items: [...formItemOptions]
          }
        ]
      }
    ]
  };

  // scaffoldForm: ScaffoldForm = {
  //   title: '配置表单信息',
  //   body: [getSchemaTpl('api')],
  //   canRebuild: true
  // };

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '表单集合',
      matchRegion: (elem: JSX.Element) => !!elem?.props.noValidate,
      renderMethod: 'renderBody',
      preferTag: '表单项'
    },

    {
      label: '按钮组',
      key: 'actions',
      preferTag: '按钮'
    }
  ];

  panelTitle = '表单';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '初始化完成',
      description: '远程初始化接口请求成功时触发',
      // 表单数据为表单变量
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: 'initApi 远程请求返回的初始化数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: '数值变化',
      description: '表单值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'formItemValidateSucc',
      eventLabel: '表单项校验成功',
      description: '表单项校验成功后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'formItemValidateError',
      eventLabel: '表单项校验失败',
      description: '表单项校验失败后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'validateSucc',
      eventLabel: '表单校验成功',
      description: '表单校验成功后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'validateError',
      eventLabel: '表单校验失败',
      description: '表单校验失败后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    // {
    //   eventName: 'submit',
    //   eventLabel: '表单提交',
    //   strongDesc: '配置该事件后将不会触发表单提交时默认的校验、提交到api或者target等行为，所有行为需要自己配置',
    //   dataSchema: [
    //     {
    //       type: 'object',
    //       properties: {
    //         'event.data': {
    //           type: 'object',
    //           title: '当前表单数据'
    //         }
    //       }
    //     }
    //   ]
    // },
    {
      eventName: 'submitSucc',
      eventLabel: '提交成功',
      description: '表单提交请求成功后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.result': {
              type: 'object',
              title: '提交成功后返回的数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitFail',
      eventLabel: '提交失败',
      description: '表单提交请求失败后触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.error': {
              type: 'object',
              title: '提交失败后返回的错误信息'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionLabel: '提交表单',
      actionType: 'submit',
      description: '触发表单提交'
    },
    {
      actionLabel: '重置表单',
      actionType: 'reset',
      description: '触发表单重置'
    },
    {
      actionLabel: '清空表单',
      actionType: 'clear',
      description: '触发表单清空'
    },
    {
      actionLabel: '校验表单',
      actionType: 'validate',
      description: '触发表单校验'
    },
    {
      actionLabel: '重新加载',
      actionType: 'reload',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionLabel: '更新数据',
      actionType: 'setValue',
      description: '触发组件数据更新'
    }
  ];

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDFilter: boolean = /\/crud\/filter\/form$/.test(context.path);
    const isInDialog: boolean = /(?:\/|^)dialog\/.+$/.test(context.path);

    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            {
              name: 'title',
              type: 'input-text',
              label: '标题',
              visibleOn: `this.wrapWithPanel !== false`
            },
            {
              name: 'submitText',
              type: 'input-text',
              label: '提交按钮名称',
              pipeIn: defaultValue('提交'),
              visibleOn: `this.wrapWithPanel !== false && !this.actions && (!Array.isArray(this.body) || !this.body.some(function(item) {return !!~['submit','button','reset','button-group'].indexOf(item.type);}))`,
              description: '当没有自定义按钮时有效。'
            },

            getSchemaTpl('switch', {
              name: 'autoFocus',
              label: '自动聚焦',
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content: '设置后将让表单的第一个可输入的表单项获得焦点',
                placement: 'left'
              }
            }),

            getSchemaTpl('submitOnChange'),

            getSchemaTpl('switch', {
              label: '禁用回车提交表单',
              name: 'preventEnterSubmit',
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content: '设置后无法通过键盘 “回车” 按键进行表单提交',
                placement: 'left'
              }
            }),

            getSchemaTpl('switch', {
              label: '提交完后重置表单',
              name: 'resetAfterSubmit',
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content: '即表单提交完后，让所有表单项的值还原成初始值',
                placement: 'left'
              }
            }),

            isCRUDFilter
              ? null
              : getSchemaTpl('switch', {
                  label: '初始化后提交一次',
                  name: 'submitOnInit',
                  labelRemark: {
                    className: 'm-l-xs',
                    trigger: 'click',
                    rootClose: true,
                    content: '开启后，表单初始完成便会触发一次提交。',
                    placement: 'left'
                  }
                }),

            isInDialog
              ? getSchemaTpl('switch', {
                  label: '提交后是否关闭对话框',
                  name: 'closeDialogOnSubmit',
                  pipeIn: (value: any) => value !== false
                })
              : null,

            isCRUDFilter
              ? null
              : {
                  label: '提交给其他组件',
                  name: 'target',
                  type: 'input-text',
                  description:
                    '可以通过设置此属性，把当前表单的值提交给目标组件，而不是自己来通过接口保存，请填写目标组件的 <code>name</code> 属性，多个组件请用逗号隔开。当 <code>target</code> 为 <code>window</code> 时，则把表单数据附属到地址栏。'
                },

            getSchemaTpl('reload', {
              test: !isCRUDFilter
            }),

            isCRUDFilter
              ? null
              : {
                  label: '跳转',
                  name: 'redirect',
                  type: 'input-text',
                  description: '当设置此值后，表单提交完后跳转到目标地址。'
                },

            getSchemaTpl('switch', {
              name: 'canAccessSuperData',
              label: '是否自动填充父级同名变量',
              pipeIn: defaultValue(true)
            }),

            getSchemaTpl('switch', {
              name: 'persistData',
              label: '是否开启本地缓存',
              pipeIn: defaultValue(false),
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content:
                  '开启后，表单的数据会缓存在浏览器中，切换页面或关闭弹框不会清空当前表单内的数据',
                placement: 'left'
              }
            }),

            getSchemaTpl('switch', {
              name: 'clearPersistDataAfterSubmit',
              label: '提交成功后清空本地缓存',
              pipeIn: defaultValue(false),
              visibleOn: 'data.persistData',
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content:
                  '开启本地缓存并开启本配置项后，表单提交成功后，会自动清除浏览器中当前表单的缓存数据',
                placement: 'left'
              }
            }),

            {
              name: 'rules',
              label: '表单组合校验',
              type: 'combo',
              multiple: true,
              multiLine: true,
              items: [
                {
                  name: 'rule',
                  label: '校验规则',
                  type: 'input-text'
                },
                {
                  name: 'message',
                  label: '报错提示',
                  type: 'input-text'
                }
              ]
            }
          ]
        },

        isCRUDFilter
          ? null
          : {
              title: '接口',
              body: [
                getSchemaTpl('apiControl', {
                  label: '保存接口',
                  description: '用来保存表单数据',
                  sampleBuilder: () => `{
    "status": 0,
    "msg": "",

    // 可以不返回，如果返回了数据将被 merge 进来。
    data: {}
  }`
                  // test: !this.isCRUDFilter
                }),

                getSchemaTpl('switch', {
                  name: 'asyncApi',
                  label: '采用异步方式?',
                  visibleOn: 'data.api',
                  labelRemark: {
                    trigger: 'click',
                    rootClose: true,
                    title: '什么是异步方式？',
                    content:
                      '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                    placement: 'left'
                  },
                  pipeIn: (value: any) => value != null,
                  pipeOut: (value: any) => (value ? '' : undefined)
                }),

                getSchemaTpl('apiControl', {
                  name: 'asyncApi',
                  label: '异步检测接口',
                  visibleOn: 'data.asyncApi != null',
                  description:
                    '设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                }),

                {
                  type: 'divider'
                },

                getSchemaTpl('apiControl', {
                  name: 'initApi',
                  label: '初始化接口',
                  description: '用来初始化表单数据',
                  sampleBuilder: () => {
                    const data = {};
                    const schema = context?.schema;

                    if (Array.isArray(schema?.body)) {
                      schema.body.forEach((control: any) => {
                        if (
                          control.name &&
                          !~['combo', 'input-array', 'form'].indexOf(
                            control.type
                          )
                        ) {
                          setVariable(data, control.name, 'sample');
                        }
                      });
                    }

                    return JSON.stringify(
                      {
                        status: 0,
                        msg: '',
                        data: data
                      },
                      null,
                      2
                    );
                  }
                }),

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
                  visibleOn: 'data.interval',
                  step: 500,
                  className: 'm-t-n-sm',
                  description: '设置后将自动定时刷新，单位 ms'
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

                getSchemaTpl('switch', {
                  label: '采用异步方式？',
                  name: 'initAsyncApi',
                  visibleOn: 'data.initApi',
                  remark: {
                    trigger: 'click',
                    rootClose: true,
                    title: '什么是异步方式？',
                    content:
                      '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                    placement: 'left'
                  },
                  pipeIn: (value: any) => value != null,
                  pipeOut: (value: any) => (value ? '' : undefined)
                }),

                getSchemaTpl('apiControl', {
                  name: 'initAsyncApi',
                  label: '异步检测接口',
                  visibleOn: 'data.initAsyncApi != null',
                  description:
                    '设置此属性后，表单请求 initApi 后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                }),

                {
                  type: 'divider'
                },

                isCRUDFilter
                  ? {
                      name: 'messages',
                      pipeIn: defaultValue({
                        fetchFailed: '初始化失败'
                      }),
                      label: '默认消息信息',
                      type: 'combo',
                      multiLine: true,
                      description:
                        '可以不设置，接口返回的 msg 字段，优先级更高',
                      items: [
                        {
                          label: '获取成功提示',
                          name: 'fetchSuccess',
                          type: 'input-text'
                        },
                        {
                          label: '获取失败提示',
                          name: 'fetchFailed',
                          type: 'input-text'
                        }
                      ]
                    }
                  : {
                      name: 'messages',
                      pipeIn: defaultValue({
                        fetchFailed: '初始化失败',
                        saveSuccess: '保存成功',
                        saveFailed: '保存失败'
                      }),
                      label: '默认消息提示',
                      type: 'combo',
                      multiLine: true,
                      description:
                        '可以不设置，接口返回的 msg 字段，优先级更高',
                      items: [
                        {
                          label: '获取成功提示',
                          name: 'fetchSuccess',
                          type: 'input-text'
                        },
                        {
                          label: '获取失败提示',
                          name: 'fetchFailed',
                          type: 'input-text'
                        },
                        {
                          label: '保存成功提示',
                          name: 'saveSuccess',
                          type: 'input-text'
                        },
                        {
                          label: '保存失败提示',
                          name: 'saveFailed',
                          type: 'input-text'
                        },
                        {
                          label: '验证失败提示',
                          name: 'validateFailed',
                          type: 'input-text'
                        }
                      ]
                    }
              ]
            },

        {
          title: '外观',
          body: [
            getSchemaTpl('switch', {
              name: 'wrapWithPanel',
              label: '用 Panel 包裹',
              pipeIn: defaultValue(true),
              labelRemark: {
                className: 'm-l-xs',
                trigger: 'click',
                rootClose: true,
                content: '关闭后，表单只会展示表单项，标题和操作栏将不会显示。',
                placement: 'left'
              }
            }),

            {
              name: 'mode',
              label: '展示模式',
              type: 'button-group-select',
              size: 'sm',
              // mode: 'inline',
              // className: 'block',
              pipeIn: defaultValue('normal', false),
              options: [
                {
                  label: '默认',
                  value: 'normal'
                },
                {
                  label: '左右摆放',
                  value: 'horizontal'
                },
                {
                  label: '内联',
                  value: 'inline'
                }
              ]
            },

            getSchemaTpl('horizontal', {
              visibleOn: 'this.mode == "horizontal"'
            }),

            getSchemaTpl('className'),

            getSchemaTpl('className', {
              name: 'panelClassName',
              visibleOn: 'this.wrapWithPanel !== false',
              label: 'Panel 的 CSS 类名',
              description: '可以设置 Panel--info 之类的'
            })
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
            getSchemaTpl('ref'),
            getSchemaTpl('name', {
              test: !isCRUDFilter
            }),
            getSchemaTpl('switch', {
              name: 'debug',
              label: '开启调试',
              labelRemark: '显示当前表单的数据在表单顶部'
            }),

            getSchemaTpl('disabled'),
            getSchemaTpl('visible')
          ]
        }
      ])
    ];
  };

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.name === 'form' &&
      context.diff?.some(change => change.path?.join('.') === 'wrapWithPanel')
    ) {
      this.manager.buildPanels();
    }
  }

  async buildDataSchemas(node: EditorNodeType, region: EditorNodeType) {
    const jsonschema: any = {
      $id: 'formItems',
      type: 'object',
      properties: {}
    };

    const pool = node.children.concat();
    while (pool.length) {
      const current = pool.shift() as EditorNodeType;

      if (current.rendererConfig?.type === 'combo') {
        const schema = current.schema;
        if (schema.name) {
          jsonschema.properties[schema.name] = {
            type: 'array',
            title: schema.label || schema.name,
            items: current.info?.plugin?.buildDataSchemas
              ? await current.info.plugin.buildDataSchemas(current, region)
              : {
                  type: 'object',
                  properties: {}
                }
          };
        }
      } else if (current.rendererConfig?.isFormItem) {
        const schema = current.schema;
        if (schema.name) {
          jsonschema.properties[schema.name] = current.info?.plugin
            ?.buildDataSchemas
            ? await current.info.plugin.buildDataSchemas(current, region)
            : {
                type: 'string',
                title: schema.label || schema.name,
                originalValue: schema.value, // 记录原始值，循环引用检测需要
                description: schema.description
              };
        }
      } else {
        pool.push(...current.children);
      }
    }

    return jsonschema;
  }

  rendererBeforeDispatchEvent(node: EditorNodeType, e: any, data: any) {
    if (e === 'inited') {
      // 监听 form 的 inited 事件，把数据加入到上下文中
      const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);
      const jsonschema: any = {
        $id: 'formInitedData',
        ...jsonToJsonSchema(data)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }
}

registerEditorPlugin(FormPlugin);
