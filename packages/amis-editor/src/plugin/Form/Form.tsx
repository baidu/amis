import cx from 'classnames';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import {isObject} from 'amis-core';
import {
  BasePlugin,
  tipedLabel,
  getI18nEnabled,
  ChangeEventContext,
  BaseEventContext,
  PluginEvent,
  EditorManager,
  defaultValue,
  getSchemaTpl,
  jsonToJsonSchema,
  RendererPluginAction,
  RendererPluginEvent,
  EditorNodeType,
  ScaffoldForm,
  RegionConfig,
  registerEditorPlugin,
  JSONPipeOut
} from 'amis-editor-core';
import {
  DSFeatureType,
  DSBuilderManager,
  DSFeatureEnum,
  ModelDSBuilderKey
} from '../../builder';
import {FormOperatorMap} from '../../builder/constants';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {FieldSetting} from '../../renderer/FieldSetting';

import type {FormSchema} from 'amis/lib/Schema';
import type {
  IFormStore,
  IFormItemStore,
  Schema,
  RendererConfig
} from 'amis-core';
import type {FormScaffoldConfig} from '../../builder';

export type FormPluginFeat = Extract<
  DSFeatureType,
  'Insert' | 'Edit' | 'BulkEdit' | 'View'
>;

export interface ExtendFormSchema extends FormSchema {
  feat?: FormPluginFeat;
  dsType?: string;
}

/** 动态注册的控件 */
export type FormDynamicControls = Partial<
  Record<string, (context: BaseEventContext) => any>
>;

export class FormPlugin extends BasePlugin {
  static id = 'FormPlugin';

  name = '表单';

  panelTitle = '表单';
  // 关联渲染器名字
  rendererName = 'form';

  isBaseComponent = true;

  description =
    '可用于新建、编辑或者展示数据，配置初始化接口可从远端加载数据，配置提交接口可将数据发送远端。另外也可以将数据提交给其他组件，与其他组件通信。';

  docLink = '/amis/zh-CN/components/form/index';

  $schema = '/schemas/FormSchema.json';

  tags = ['数据容器'];

  order = -900;

  icon = 'fa fa-list-alt';

  pluginIcon = 'form-plugin';

  panelIcon = 'form-plugin';

  panelJustify = true;

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
      preferTag: '按钮'
    }
  ];

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '初始化数据接口请求完成',
      description: '远程初始化数据接口请求完成时触发',
      // 表单数据为表单变量
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
      eventName: 'change',
      eventLabel: '数值变化',
      description: '表单值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
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
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'submit',
      eventLabel: '表单提交',
      strongDesc:
        '配置该事件后将不会触发表单提交时默认的校验、提交到api或者target等行为，所有行为需要自己配置',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              description: '当前表单数据，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitSucc',
      eventLabel: '提交成功',
      description:
        '表单提交成功后触发，如果事件源是按钮，且按钮的类型为“提交”，那么即便当前表单没有配置“保存接口”也将触发提交成功事件',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                result: {
                  type: 'object',
                  title: '保存接口请求成功后返回的数据'
                }
              }
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
            data: {
              type: 'object',
              title: '数据',
              properties: {
                error: {
                  type: 'object',
                  title: '保存接口请求失败后返回的错误信息'
                }
              }
            }
          }
        }
      ]
    },
    {
      eventName: 'asyncApiFinished',
      eventLabel: '远程请求轮询结束',
      description: 'asyncApi 远程请求轮询结束后触发',
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
      actionLabel: '变量赋值',
      actionType: 'setValue',
      description: '触发组件数据更新'
    }
  ];

  Features: Array<{
    label: string;
    value: DSFeatureType;
    disabled?: boolean;
  }> = [
    {label: '新增', value: DSFeatureEnum.Insert},
    {label: '编辑', value: DSFeatureEnum.Edit},
    {label: '批量编辑', value: DSFeatureEnum.BulkEdit, disabled: true},
    {label: '查看', value: DSFeatureEnum.View, disabled: true}
  ];

  dsManager: DSBuilderManager;

  protected _dynamicControls: FormDynamicControls = {};

  constructor(manager: EditorManager) {
    super(manager);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** 表单脚手架 */
  get scaffoldForm(): ScaffoldForm {
    const features = this.Features.filter(f => !f.disabled);

    return {
      title: '表单创建向导',
      mode: {
        mode: 'horizontal',
        horizontal: {
          leftFixed: 'sm'
        }
      },
      canRebuild: true,
      className: 'ae-Scaffold-Modal ae-Scaffold-Modal-content',
      body: [
        {
          type: 'radios',
          name: 'feat',
          label: '使用场景',
          value: DSFeatureEnum.Insert,
          options: features,
          onChange: (
            value: FormPluginFeat,
            oldValue: FormPluginFeat,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  /^(insert|edit|bulkEdit)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit)Api$/i.test(key)
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValues({
                dsType: this.dsManager.getDefaultBuilderKey(),
                initApi:
                  DSFeatureEnum.Insert === value ||
                  DSFeatureEnum.BulkEdit === value
                    ? undefined
                    : ''
              });
            }
          }
        },
        /** 数据源选择器 */
        this.dsManager.getDSSelectorSchema({
          onChange: (
            value: string,
            oldValue: string,
            model: IFormItemStore,
            form: IFormStore
          ) => {
            if (value !== oldValue) {
              const data = form.data;

              Object.keys(data).forEach(key => {
                if (
                  /^(insert|edit|bulkEdit)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit)Api$/i.test(key)
                ) {
                  form.deleteValueByName(key);
                }
              });
              form.deleteValueByName('__fields');
              form.deleteValueByName('__relations');
              form.setValues({
                initApi:
                  DSFeatureEnum.Insert === value ||
                  DSFeatureEnum.BulkEdit === value
                    ? undefined
                    : ''
              });
            }

            return value;
          }
        }),
        /** 数据源相关配置 */
        ...flatten(
          features.map(feat =>
            this.dsManager.buildCollectionFromBuilders(
              (builder, builderKey) => {
                return {
                  type: 'container',
                  className: 'form-item-gap',
                  visibleOn: `data.feat === '${feat.value}' && (!data.dsType || data.dsType === '${builderKey}')`,
                  body: flatten([
                    builder.makeSourceSettingForm({
                      feat: feat.value,
                      renderer: 'form',
                      inScaffold: true,
                      sourceSettings: {
                        userOrders: false
                      }
                    }),
                    builder.makeFieldsSettingForm({
                      feat: feat.value,
                      renderer: 'form',
                      inScaffold: true
                    })
                  ])
                };
              }
            )
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
            FormOperatorMap['reset'],
            FormOperatorMap['submit'],
            FormOperatorMap['cancel']
          ]
        }
      ],
      pipeIn: async (schema: ExtendFormSchema) => {
        /** 数据源类型 */
        const dsType = schema?.dsType ?? this.dsManager.getDefaultBuilderKey();
        const builder = this.dsManager.getBuilderByKey(dsType);

        if (!builder) {
          return {dsType};
        }

        const config = await builder.guessFormScaffoldConfig({schema});

        return {...config};
      },
      pipeOut: async (config: FormScaffoldConfig) => {
        const scaffold: any = cloneDeep(this.scaffold);
        const builder = this.dsManager.getBuilderByScaffoldSetting(config);

        if (!builder) {
          return scaffold;
        }

        const schema = await builder.buildFormSchema({
          feat: config.feat,
          renderer: 'form',
          inScaffold: true,
          entitySource: config?.entitySource,
          fallbackSchema: scaffold,
          scaffoldConfig: config
        });

        return schema;
      },
      validate: (data: FormScaffoldConfig, form: IFormStore) => {
        const {feat} = data;
        const builder = this.dsManager.getBuilderByScaffoldSetting(data);
        const featValue = builder?.getFeatValueByKey(
          feat ?? DSFeatureEnum.Insert
        );
        const apiKey = `${featValue}Api`;
        const fieldsKey = `${featValue}Fields`;
        const errors: Record<string, string> = {};

        if (data?.dsType === ModelDSBuilderKey) {
          return errors;
        }

        // if (!form.data[apiKey]) {
        //   errors[apiKey] = '请输入接口信息';
        // }

        // if (feat === 'Edit' && !form.data?.initApi) {
        //   errors['initApi'] = '请输入初始化接口信息';
        // }

        const fieldErrors = FieldSetting.validator(form.data[fieldsKey]);

        if (fieldErrors) {
          errors[fieldsKey] = fieldErrors;
        }

        return errors;
      }
    };
  }

  get dynamicControls() {
    return this._dynamicControls;
  }

  set dynamicControls(controls: FormDynamicControls) {
    if (!controls || !isObject(controls)) {
      throw new Error(
        '[amis-editor][FormPlugin] dynamicControls的值必须是一个对象'
      );
    }

    this._dynamicControls = {...this._dynamicControls, ...controls};
  }

  panelBodyCreator = (context: BaseEventContext) => {
    const dc = this.dynamicControls;
    const builder = this.dsManager.getBuilderBySchema(context.schema);
    /** 是否为CRUD的过滤器表单 */
    const isCRUDFilter: boolean =
      /\/crud\/filter\/form$/.test(context.path) ||
      /\/crud2\/filter\/\d\/form$/.test(context.path) ||
      /\/crud2\/filter\/form$/.test(context.path) ||
      /body\/0\/filter$/.test(context.schemaPath);
    /** 表单是否位于Dialog内 */
    const isInDialog: boolean = context.path?.includes?.('dialog/');
    /** 是否使用Panel包裹 */
    const isWrapped = 'this.wrapWithPanel !== false';
    const justifyLayout = (left: number = 2) => ({
      mode: 'horizontal',
      horizontal: {
        left,
        justify: true
      }
    });
    const i18nEnabled = getI18nEnabled();
    const schema = context?.node?.schema ?? context?.schema;
    /** 是否是模型表单 */
    const isModelForm =
      ((typeof schema?.api === 'string'
        ? schema.api
        : typeof schema?.api?.url === 'string'
        ? schema.api.url
        : ''
      ).startsWith('model://') ||
        (typeof schema?.initApi === 'string'
          ? schema.initApi
          : typeof schema?.initApi?.url === 'string'
          ? schema.initApi.url
          : ''
        ).startsWith('model://')) &&
      !schema.api.strategy;

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            isCRUDFilter || isModelForm
              ? null
              : {
                  title: '数据源',
                  body: [
                    {
                      type: 'select',
                      name: 'feat',
                      label: '使用场景',
                      value: DSFeatureEnum.Insert,
                      options: this.Features,
                      onChange: (
                        value: FormPluginFeat,
                        oldValue: FormPluginFeat,
                        model: IFormItemStore,
                        form: IFormStore
                      ) => {
                        if (value !== oldValue) {
                          form.setValues({
                            dsType: this.dsManager.getDefaultBuilderKey(),
                            initApi:
                              DSFeatureEnum.Insert === value ||
                              DSFeatureEnum.BulkEdit === value
                                ? undefined
                                : '',
                            api: undefined
                          });
                        }
                      }
                    },
                    this.dsManager.getDSSelectorSchema({
                      type: 'select',
                      label: '数据源',
                      pipeIn: (value: any, form: any) => {
                        if (value !== undefined) {
                          return value;
                        }

                        const api = form.data?.api || form.data?.initApi;
                        let dsType = 'api';

                        if (!api) {
                        } else if (typeof api === 'string') {
                          dsType = api.startsWith('api://')
                            ? 'apicenter'
                            : 'api';
                        } else if (api?.url) {
                          dsType = api.url.startsWith('api://')
                            ? 'apicenter'
                            : 'api';
                        } else if (api?.entity) {
                          dsType = ModelDSBuilderKey;
                        }

                        // 需要 set 一下，否则 buildCollectionFromBuilders 里的内容条件不满足
                        form.setValueByName('dsType', dsType);

                        return dsType;
                      },
                      onChange: (
                        value: string,
                        oldValue: string,
                        model: IFormItemStore,
                        form: IFormStore
                      ) => {
                        if (value !== oldValue) {
                          const data = form.data;

                          Object.keys(data).forEach(key => {
                            if (
                              /^(insert|edit|bulkEdit)Fields$/i.test(key) ||
                              /^(insert|edit|bulkEdit)Api$/i.test(key)
                            ) {
                              form.deleteValueByName(key);
                            }
                          });
                          form.deleteValueByName('__fields');
                          form.deleteValueByName('__relations');
                          form.deleteValueByName('initApi');
                          form.deleteValueByName('api');
                        }
                        return value;
                      }
                    }),
                    /** 数据源配置 */
                    ...flatten(
                      this.Features.map(feat =>
                        this.dsManager.buildCollectionFromBuilders(
                          (builder, builderKey, index) => ({
                            type: 'container',
                            className: 'form-item-gap',
                            visibleOn: `data.feat === '${feat.value}' && (data.dsType === '${builderKey}' || (!data.dsType && ${index} === 0))`,
                            body: flatten([
                              builder.makeSourceSettingForm({
                                feat: feat.value,
                                renderer: 'form',
                                inScaffold: false,
                                sourceSettings: {
                                  renderLabel: true,
                                  userOrders: false
                                }
                              })
                            ])
                          })
                        )
                      )
                    )
                  ]
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
                }),
                getSchemaTpl('loadingConfig', {label: '加载设置'}, {context})
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
            {
              title: '状态',
              body: [
                getSchemaTpl('disabled'),
                getSchemaTpl('visible'),
                getSchemaTpl('static')
              ]
            },
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
                getSchemaTpl('formItemMode', {
                  isForm: true,
                  /** Form组件默认为normal模式 */
                  defaultValue: 'normal'
                }),
                getSchemaTpl('horizontal'),
                {
                  name: 'labelAlign',
                  label: '标签对齐方式',
                  type: 'button-group-select',
                  size: 'sm',
                  visibleOn: "${mode === 'horizontal'}",
                  pipeIn: defaultValue('right', false),
                  options: [
                    {
                      label: '左对齐',
                      value: 'left'
                    },
                    {
                      label: '右对齐',
                      value: 'right'
                    }
                  ]
                },
                {
                  label: '列数',
                  name: 'columnCount',
                  type: 'input-number',
                  step: 1,
                  min: 0,
                  precision: 0,
                  resetValue: '',
                  unitOptions: ['列'],
                  pipeOut: (value: string) => {
                    if (value && typeof value === 'string') {
                      const count = Number.parseInt(
                        value?.replace(/\D+/g, ''),
                        10
                      );

                      return isNaN(count) ? undefined : count;
                    } else if (value && typeof value === 'number') {
                      return value;
                    } else {
                      return undefined;
                    }
                  }
                }
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

  /** 重新构建 API */
  panelFormPipeOut = async (schema: any) => {
    const entity = schema?.api?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);

    try {
      const updatedSchema = await builder.buildApiSchema({
        schema,
        renderer: 'form',
        sourceKey: 'api',
        feat: schema.feat ?? 'Insert'
      });
      return updatedSchema;
    } catch (e) {
      console.error(e);
    }

    return schema;
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

  async buildDataSchemas(
    node: EditorNodeType,
    region: EditorNodeType,
    trigger?: EditorNodeType
  ) {
    const jsonschema: any = {
      ...jsonToJsonSchema(JSONPipeOut(node.schema.data))
    };
    const pool = node.children.concat();

    while (pool.length) {
      const current = pool.shift() as EditorNodeType;
      const schema = current.schema;

      if (current.rendererConfig?.isFormItem && schema.name) {
        jsonschema.properties[schema.name] =
          await current.info.plugin.buildDataSchemas?.(
            current,
            region,
            trigger,
            node
          );
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
        ...jsonToJsonSchema(data.responseData)
      };

      scope?.removeSchema(jsonschema.$id);
      scope?.addSchema(jsonschema);
    }
  }

  /**
   * 为了让 form 的按钮可以点击编辑
   */
  patchSchema(schema: Schema, info: RendererConfig, props: any) {
    if (
      Array.isArray(schema.actions) ||
      schema.wrapWithPanel === false ||
      (Array.isArray(schema.body) &&
        schema.body.some(
          (item: any) =>
            item &&
            !!~['submit', 'button', 'button-group', 'reset'].indexOf(
              (item as any)?.body?.[0]?.type ||
                (item as any)?.body?.type ||
                (item as any).type
            )
        ))
    ) {
      return;
    }

    return {
      ...schema,
      actions: [
        {
          type: 'submit',
          label:
            props?.translate(props?.submitText) || schema.submitText || '提交',
          primary: true
        }
      ]
    };
  }

  async getAvailableContextFields(
    scopeNode: EditorNodeType,
    target: EditorNodeType,
    region?: EditorNodeType
  ) {
    const rendererInfo = target.info.renderer;
    /** 部分使用 Renderer 装饰器的组件也是表单项目 */
    const specialRenderer = ['user-select', 'department-select'];
    // 只有表单项组件可以使用表单组件的数据域
    if (
      rendererInfo.isFormItem ||
      (rendererInfo.type && specialRenderer.includes(rendererInfo.type)) ||
      target.sameIdChild?.info.renderer.isFormItem
    ) {
      let parentNode = scopeNode.parent;

      while (parentNode && parentNode?.type !== 'crud2') {
        parentNode = parentNode?.parent;
      }

      if (
        parentNode?.type === 'crud2' &&
        (scopeNode?.type === 'form' ||
          /^body\/\d+\/filter/.test(scopeNode.schemaPath ?? ''))
      ) {
        return parentNode.info.plugin.getAvailableContextFields?.(
          parentNode,
          target,
          region
        );
      }

      if (
        scopeNode.parent?.type === 'service' &&
        scopeNode.parent?.parent?.path?.endsWith('service')
      ) {
        return scopeNode.parent.parent.info.plugin.getAvailableContextFields?.(
          scopeNode.parent.parent,
          target,
          region
        );
      }

      // 先从数据源获取可用字段
      const builder = this.dsManager.getBuilderBySchema(scopeNode.schema);
      if (builder && scopeNode.schema.api) {
        return builder.getAvailableContextFields(
          {
            schema: scopeNode.schema,
            sourceKey: 'api',
            feat: scopeNode.schema?.feat ?? DSFeatureEnum.Insert
          },
          target
        );
      }
    }
  }
}

registerEditorPlugin(FormPlugin);
