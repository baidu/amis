import cx from 'classnames';
import {
  DSFeatureType,
  generateNodeId,
  registerEditorPlugin,
  tipedLabel
} from 'amis-editor-core';
import {
  BasePlugin,
  ChangeEventContext,
  BaseEventContext,
  PluginEvent,
  RegionConfig,
  ScaffoldForm,
  EditorManager,
  DSBuilderManager
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {jsonToJsonSchema} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {RendererPluginAction, RendererPluginEvent} from 'amis-editor-core';
import {setVariable} from 'amis-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {FormSchema} from 'amis/lib/Schema';
import flatten from 'lodash/flatten';
import {clone, cloneDeep} from 'lodash';

const Features: Array<{
  label: string;
  value: DSFeatureType;
}> = [
  {label: '新增', value: 'Insert'},
  {label: '编辑', value: 'Edit'}
];

export class FormPlugin extends BasePlugin {
  constructor(manager: EditorManager) {
    super(manager);
    this.dsBuilderMgr = new DSBuilderManager('form', 'api');
  }

  dsBuilderMgr: DSBuilderManager;

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
  tags = ['功能', '数据容器'];
  icon = 'fa fa-list-alt';
  pluginIcon = 'form-plugin';

  scaffold: FormSchema = {
    type: 'form',
    title: '表单',
    body: [
      {
        label: '文本框',
        type: 'input-text',
        name: 'text'
      }
    ],
    actions: [
      {type: 'button', label: '提交', level: 'primary'},
      {type: 'button', label: '重置'}
    ]
  };
  previewSchema: FormSchema = {
    type: 'form',
    panelClassName: 'Panel--default text-left m-b-none',
    mode: 'horizontal',
    body: [
      {
        label: '文本',
        name: 'a',
        type: 'input-text'
      }
    ],
    actions: [
      {
        type: 'button',
        label: '提交'
      }
    ]
  };

  get scaffoldForm(): ScaffoldForm {
    return {
      title: '表单创建向导',
      mode: 'horizontal',
      className: 'ae-Scaffold-Modal ae-formItemControl',
      body: [
        {
          type: 'radios',
          name: 'feat',
          label: '使用场景',
          value: 'Insert',
          options: Features
        },
        this.dsBuilderMgr.getDSSwitch({
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            const data = form.data;
            Object.keys(data).forEach(key => {
              if (key.endsWith('Fields') || key.endsWith('api')) {
                form.deleteValueByName(key);
              }
            });
            form.deleteValueByName('__fields');
            return value;
          }
        }),
        ...flatten(
          Features.map(feat =>
            this.dsBuilderMgr.collectFromBuilders((builder, builderName) => ({
              type: 'container',
              className: 'form-item-gap',
              visibleOn: `data.feat === '${feat.value}' && (!data.dsType || data.dsType === '${builderName}')`,
              body: flatten([
                builder.makeSourceSettingForm({
                  feat: feat.value,
                  label: builderName,
                  inScaffold: true
                }),
                builder.makeFieldsSettingForm({
                  feat: feat.value,
                  inScaffold: true
                })
              ])
            }))
          )
        ),
        {
          name: 'operators',
          label: '操作',
          type: 'checkboxes',
          value: ['submit'],
          joinValues: false,
          extractValue: false,
          options: [
            {
              label: '重置',
              value: 'reset',
              order: 0,
              schema: {
                level: 'default'
              }
            },
            {
              label: '提交',
              value: 'submit',
              order: 1,
              schema: {
                level: 'primary'
              }
            }
          ]
        }
      ],
      pipeOut: (value: any) => {
        const id = generateNodeId();
        const builder = this.dsBuilderMgr.resolveBuilderBySetting(value);

        let operators = clone(value.operators);
        operators.sort((p: any, n: any) => p.order - n.order);

        let schema: FormSchema = {
          ...cloneDeep(this.scaffold),
          body: [],
          id,
          actions: operators.map((op: any) => {
            return {
              type: 'button',
              label: op.label,
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: op.value,
                      componentId: id
                    }
                  ]
                }
              },
              ...op.schema
            };
          })
        };

        builder.resolveCreateSchema({
          schema,
          setting: value,
          feat: value.feat
        });

        return schema;
      }
    };
  }

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
      label: '操作区',
      key: 'actions',
      preferTag: '操作按钮'
    }
  ];

  panelTitle = '表单';

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '初始化接口请求成功',
      description: '远程初始化接口请求成功时触发',
      // 表单数据为表单变量
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '初始化接口请求成功返回的数据'
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
      description:
        '表单提交成功后触发，如果事件源是按钮，且按钮的类型为“提交”，那么即便当前表单没有配置“保存接口”也将触发提交成功事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.result': {
              type: 'object',
              title: '保存接口请求成功后返回的数据'
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
              title: '保存接口请求失败后返回的错误信息'
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

  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const builder = this.dsBuilderMgr.resolveBuilderBySchema(
      context.schema,
      'api'
    );
    /** 是否为CRUD的过滤器表单 */
    const isCRUDFilter: boolean =
      /\/crud\/filter\/form$/.test(context.path) ||
      /\/crud2\/filter\/\d\/form$/.test(context.path);
    /** 表单是否位于Dialog内 */
    const isInDialog: boolean = /(?:\/|^)dialog\/.+$/.test(context.path);
    /** 是否使用Panel包裹 */
    const isWrapped = 'this.wrapWithPanel !== false';
    const justifyLayout = (left: number = 2) => ({
      mode: 'horizontal',
      horizontal: {
        left,
        justify: true
      }
    });

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            isCRUDFilter
              ? null
              : {
                  title: '数据源',
                  body: builder.makeFormSourceSetting()
                },
            {
              title: '基本',
              body: [
                {
                  name: 'title',
                  type: 'input-text',
                  label: '标题',
                  visibleOn: isWrapped
                },
                getSchemaTpl('switch', {
                  name: 'autoFocus',
                  label: tipedLabel(
                    '自动聚焦',
                    '设置后将让表单的第一个可输入的表单项获得焦点'
                  )
                }),
                {
                  type: 'ae-switch-more',
                  mode: 'normal',
                  name: 'persistData',
                  label: tipedLabel(
                    '本地缓存',
                    '开启后，表单的数据会缓存在浏览器中，切换页面或关闭弹框不会清空当前表单内的数据'
                  ),
                  hiddenOnDefault: true,
                  formType: 'extend',
                  form: {
                    body: [
                      getSchemaTpl('switch', {
                        name: 'clearPersistDataAfterSubmit',
                        label: tipedLabel(
                          '提交成功后清空缓存',
                          '开启本地缓存并开启本配置项后，表单提交成功后，会自动清除浏览器中当前表单的缓存数据'
                        ),
                        pipeIn: defaultValue(false),
                        visibleOn: 'data.persistData'
                      })
                    ]
                  }
                },
                getSchemaTpl('switch', {
                  name: 'canAccessSuperData',
                  label: tipedLabel(
                    '自动填充数据域同名变量',
                    '默认表单是可以获取到完整数据链中的数据的，如果想使表单的数据域独立，请关闭此配置'
                  ),
                  pipeIn: defaultValue(true)
                })
              ]
            },
            {
              title: '提交设置',
              body: [
                {
                  name: 'submitText',
                  type: 'input-text',
                  label: tipedLabel(
                    '提交按钮名称',
                    '如果底部按钮不是自定义按钮时，可以通过该配置可以快速修改按钮名称，如果设置成空，则可以把默认按钮去掉。'
                  ),
                  pipeIn: defaultValue('提交'),
                  visibleOn: `${isWrapped} && !this.actions && (!Array.isArray(this.body) || !this.body.some(function(item) {return !!~['submit','button','reset','button-group'].indexOf(item.type);}))`,
                  ...justifyLayout(4)
                },
                getSchemaTpl('switch', {
                  name: 'submitOnChange',
                  label: tipedLabel(
                    '修改即提交',
                    '设置后，表单中每次有修改都会触发提交'
                  )
                }),
                getSchemaTpl('switch', {
                  name: 'resetAfterSubmit',
                  label: tipedLabel(
                    '提交后重置表单',
                    '表单提交后，让所有表单项的值还原成初始值'
                  )
                }),
                getSchemaTpl('switch', {
                  name: 'preventEnterSubmit',
                  label: tipedLabel(
                    '阻止回车提交',
                    '默认按回车键触发表单提交，开启后将阻止这一行为'
                  )
                }),
                // isCRUDFilter
                //   ? null
                //   : getSchemaTpl('switch', {
                //       name: 'submitOnInit',
                //       label: tipedLabel(
                //         '初始化后提交一次',
                //         '开启后，表单初始完成便会触发一次提交'
                //       )
                //     }),
                isInDialog
                  ? getSchemaTpl('switch', {
                      label: '提交后关闭对话框',
                      name: 'closeDialogOnSubmit',
                      pipeIn: (value: any) => value !== false
                    })
                  : null
                // isCRUDFilter
                //   ? null
                //   : {
                //       label: tipedLabel(
                //         '提交其他组件',
                //         '可以通过设置此属性，把当前表单的值提交给目标组件，而不是自己来通过接口保存，请填写目标组件的 <code>name</code> 属性，多个组件请用逗号隔开。当 <code>target</code> 为 <code>window</code> 时，则把表单数据附属到地址栏。'
                //       ),
                //       name: 'target',
                //       type: 'input-text',
                //       placeholder: '请输入组件name',
                //       ...justifyLayout(4)
                //     },
                // getSchemaTpl('reload', {
                //   test: !isCRUDFilter
                // }),
                // isCRUDFilter
                //   ? null
                //   : {
                //       type: 'ae-switch-more',
                //       mode: 'normal',
                //       label: tipedLabel(
                //         '提交后跳转',
                //         '当设置此值后，表单提交完后跳转到目标地址'
                //       ),
                //       formType: 'extend',
                //       form: {
                //         mode: 'horizontal',
                //         horizontal: {
                //           justify: true,
                //           left: 4
                //         },
                //         body: [
                //           {
                //             label: '跳转地址',
                //             name: 'redirect',
                //             type: 'input-text',
                //             placeholder: '请输入目标地址'
                //           }
                //         ]
                //       }
                //     }
              ]
            },
            {
              title: '组合校验',
              body: [
                {
                  name: 'rules',
                  label: false,
                  type: 'combo',
                  multiple: true,
                  multiLine: true,
                  subFormMode: 'horizontal',
                  placeholder: '',
                  addBtn: {
                    label: '添加校验规则',
                    block: true,
                    icon: 'fa fa-plus',
                    className: cx('ae-Button--enhance')
                  },
                  items: [
                    {
                      type: 'ae-formulaControl',
                      name: 'rule',
                      label: '校验规则',
                      ...justifyLayout(4)
                    },
                    {
                      name: 'message',
                      label: '报错提示',
                      type: 'input-text',
                      ...justifyLayout(4)
                    }
                  ]
                }
              ]
            },
            /** 状态 */
            getSchemaTpl('status', {isFormItem: false, disabled: true}),
            {
              title: '高级',
              body: [
                getSchemaTpl('switch', {
                  name: 'debug',
                  label: tipedLabel('开启调试', '在表单顶部显示当前表单的数据')
                })
              ]
            }
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '布局',
              body: [
                getSchemaTpl('formItemMode', {isForm: true}),
                getSchemaTpl('horizontal')
              ]
            },
            {
              title: '其他',
              body: [
                getSchemaTpl('switch', {
                  name: 'wrapWithPanel',
                  label: tipedLabel(
                    'Panel包裹',
                    '关闭后，表单只会展示表单项，标题和操作栏将不会显示。'
                  ),
                  pipeIn: defaultValue(true)
                }),
                getSchemaTpl('switch', {
                  name: 'affixFooter',
                  label: tipedLabel(
                    '吸附操作栏',
                    '开启后，滚动表单内容区时使底部操作区悬浮吸附'
                  ),
                  visibleOn: isWrapped
                })
              ]
            },
            /** */
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'panelClassName',
                  label: 'Panel',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'headerClassName',
                  label: '标题区',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'bodyClassName',
                  label: '内容区',
                  visibleOn: isWrapped
                }),
                getSchemaTpl('className', {
                  name: 'actionsClassName',
                  label: '操作区',
                  visibleOn: isWrapped
                })
              ]
            })
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

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    target: EditorNodeType,
    region?: EditorNodeType
  ) {
    // 只有表单项组件可以使用表单组件的数据域
    if (
      target.info.renderer.isFormItem ||
      target.sameIdChild?.info.renderer.isFormItem
    ) {
      if (
        scopeNode.parent?.type === 'crud2' &&
        scopeNode.schemaPath.startsWith('body/0/filter/')
      ) {
        return scopeNode.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent,
          target,
          region
        );
      }

      // 先从数据源获取可用字段
      const builder = this.dsBuilderMgr.resolveBuilderBySchema(
        scopeNode.schema,
        'api'
      );
      if (builder && scopeNode.schema.api) {
        return builder.getAvailableContextFileds(
          {
            schema: scopeNode.schema,
            sourceKey: 'api',
            feat: 'Insert'
          },
          target
        );
      }
    }
  }
}

registerEditorPlugin(FormPlugin);
