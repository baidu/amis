import React from 'react';
import cx from 'classnames';
import DeepDiff from 'deep-diff';
import flatten from 'lodash/flatten';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {isObject, getRendererByName, setVariable} from 'amis-core';
import {
  BasePlugin,
  tipedLabel,
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
  getI18nEnabled,
  registerEditorPlugin,
  JSONPipeOut
} from 'amis-editor-core';
import type {FormSchema} from 'amis';
import type {
  IFormStore,
  IFormItemStore,
  Schema,
  RendererConfig
} from 'amis-core';
import {
  DSFeatureType,
  DSBuilderManager,
  DSFeatureEnum,
  ModelDSBuilderKey,
  ApiDSBuilderKey
} from '../../builder';
import {FormOperatorMap} from '../../builder/constants';
import {
  getEventControlConfig,
  getActionCommonProps
} from '../../renderer/event-control/helper';
import {FieldSetting} from '../../renderer/FieldSetting';
import {_isModelComp, generateId} from '../../util';
import {InlineEditableElement} from 'amis-editor-core';

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

  useLazyRender = true;

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
        id: generateId(),
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
      preferTag: '表单项',
      dndMode: (schema: any) => {
        if (schema.mode === 'flex') {
          return 'flex';
        }
        return 'default';
      }
    },

    {
      label: '操作区',
      key: 'actions',
      preferTag: '按钮'
    }
  ];

  // 定义可以内联编辑的元素
  inlineEditableElements: Array<InlineEditableElement> = [
    {
      match: ':scope.cxd-Panel .cxd-Panel-title',
      key: 'title'
    }
  ];

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '表单初始化完成',
      description: '表单初始化完成时触发',
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
      eventName: 'initApiFinished',
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
              description: '当前数据域，可以通过.字段名读取对应的值',
              properties: {
                __trigger: {
                  type: 'string',
                  title: '触发事件',
                  enum: ['init', 'reload']
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
      description: '触发表单提交',
      ...getActionCommonProps('submit')
    },
    {
      actionLabel: '重置表单',
      actionType: 'reset',
      description: '触发表单重置',
      ...getActionCommonProps('reset')
    },
    {
      actionLabel: '清空表单',
      actionType: 'clear',
      description: '触发表单清空',
      ...getActionCommonProps('clear')
    },
    {
      actionLabel: '校验表单',
      actionType: 'validate',
      description: '触发表单校验',
      descDetail: (info: any, context: any, props: any) => {
        return (
          <div className="action-desc">
            校验
            <span className="variable-left variable-right">
              {info?.rendererLabel}
            </span>
            的数据
          </div>
        );
      }
    },
    {
      actionLabel: '重新加载',
      actionType: 'reload',
      description: '触发组件数据刷新并重新渲染',
      ...getActionCommonProps('reload')
    },
    {
      actionLabel: '变量赋值',
      actionType: 'setValue',
      description: '触发组件数据更新',
      ...getActionCommonProps('setValue')
    },
    {
      actionLabel: '清除校验状态',
      actionType: 'clearError',
      description: '清除表单校验产生的错误状态'
    }
  ];

  Features: Array<{
    label: string;
    value: DSFeatureType;
    disabled?: boolean;
  }> = [
    {label: '新增', value: DSFeatureEnum.Insert},
    {label: '编辑', value: DSFeatureEnum.Edit},
    {label: '查看', value: DSFeatureEnum.View},
    {label: '批量编辑', value: DSFeatureEnum.BulkEdit, disabled: true}
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
      className: 'ae-Scaffold-Modal ae-Scaffold-Modal-content :AMISCSSWrapper',
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
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
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
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
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
                  visibleOn: `$\{feat === '${feat.value}' && (!dsType || dsType === '${builderKey}')}`,
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

        /** 脚手架构建的 Schema 加个标识符，避免addChild替换 Schema ID */
        schema.__origin = 'scaffold';

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

  /** 获取可能的使用场景 */
  guessDSFeatFromSchema(schema: Record<string, any>): FormPluginFeat {
    const validFeat = [
      DSFeatureEnum.Insert,
      DSFeatureEnum.Edit,
      DSFeatureEnum.BulkEdit,
      DSFeatureEnum.View
    ];

    // 判断表单功能类型
    const {initApi, api, feat} = schema;

    // 根据API配置判断基础功能类型
    if (initApi && api) {
      return DSFeatureEnum.Edit;
    }
    if (initApi && !api) {
      return DSFeatureEnum.View;
    }
    if (!initApi && api) {
      return DSFeatureEnum.Insert;
    }

    // 检查自定义功能类型
    if (feat && validFeat.includes(feat)) {
      return feat;
    }

    // 默认返回插入模式
    return DSFeatureEnum.Insert;
  }

  panelBodyCreator = (context: BaseEventContext) => {
    /** 是否为CRUD的过滤器表单 */
    const isCRUDFilter: boolean =
      /\/crud\/filter\/form$/.test(context.path) ||
      /\/crud2\/filter\/\d\/form$/.test(context.path) ||
      /\/crud2\/filter\/form$/.test(context.path) ||
      /body\/0\/filter$/.test(context.schemaPath);
    /** 表单是否位于Dialog内 */
    const isInDialog: boolean =
      context.path?.includes?.('dialog/') ||
      context.path?.includes?.('drawer/');
    /** 是否使用Panel包裹 */
    const isWrapped = 'this.wrapWithPanel !== false';
    const justifyLayout = (left: number = 2) => ({
      mode: 'horizontal',
      horizontal: {
        left,
        justify: true
      }
    });
    const schema = context?.node?.schema ?? context?.schema;
    /** 新版数据源控件 */
    const generateDSControls = () => {
      const dsTypeSelector = this.dsManager.getDSSelectorSchema(
        {
          type: 'select',
          label: '数据源',
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
                  /^(insert|edit|bulkEdit|view)Fields$/i.test(key) ||
                  /^(insert|edit|bulkEdit|view)Api$/i.test(key)
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
        },
        {
          schema: context?.schema,
          sourceKey: 'api',
          getDefautlValue: (key, builder) => {
            const schema = context?.schema;
            let dsType = schema?.dsType;

            // TODO: api和initApi可能是混合模式的场景
            if (
              builder.match(schema, 'api') ||
              builder.match(schema, 'initApi')
            ) {
              dsType = key;
            }

            return dsType;
          }
        }
      );
      /** 默认数据源类型 */
      const defaultDsType = dsTypeSelector.value;
      /** 数据源配置 */
      const dsSettings = flatten(
        this.Features.map(feat =>
          this.dsManager.buildCollectionFromBuilders(
            (builder, builderKey, index) => {
              return {
                type: 'container',
                className: 'form-item-gap',
                visibleOn: `$\{feat === '${
                  feat.value
                }' && (dsType == null ? '${builderKey}' === '${
                  defaultDsType || ApiDSBuilderKey
                }' : dsType === '${builderKey}')}`,
                body: flatten([
                  builder.makeSourceSettingForm({
                    feat: feat.value,
                    renderer: 'form',
                    inScaffold: false,
                    sourceSettings: {
                      renderLabel: true,
                      userOrders: false,
                      /**
                       * name 默认是基于场景自动生成的
                       * 1. 脚手架中，默认生成的是 viewApi
                       * 2. 配置面板中要读取Schema 配置，所以使用 initApi
                       */
                      ...(feat.value === DSFeatureEnum.View
                        ? {name: 'initApi'}
                        : {})
                    }
                  })
                ])
              };
            }
          )
        )
      );

      return [dsTypeSelector, ...dsSettings];
    };

    /** 数据源 */
    const generateDSCollapse = () => {
      if (isCRUDFilter) {
        /** CRUD查询表头数据源交给CRUD托管 */
        return null;
      } else if (_isModelComp(schema)) {
        /** 模型组件使用旧版数据源配置 */
        return {
          title: '数据源',
          body: [
            getSchemaTpl('apiControl', {
              label: '保存接口',
              sampleBuilder: () => {
                return `{\n  "status": 0,\n  "msg": "",\n  // 可以不返回，如果返回了数据将被 merge 进来。\n  data: {}\n}`;
              }
            }),
            getSchemaTpl('apiControl', {
              name: 'asyncApi',
              label: tipedLabel(
                '异步检测接口',
                '设置此属性后，表单提交发送保存接口后，还会继续轮询请求该接口，直到返回 finished 属性为 true 才 结束'
              ),
              visibleOn: 'this.asyncApi != null'
            }),
            getSchemaTpl('apiControl', {
              name: 'initAsyncApi',
              label: tipedLabel(
                '异步检测接口',
                '设置此属性后，表单请求 initApi 后，还会继续轮询请求该接口，直到返回 finished 属性为 true 才 结束'
              ),
              visibleOn: 'this.initAsyncApi != null'
            }),
            getSchemaTpl('apiControl', {
              name: 'initApi',
              label: '初始化接口',
              sampleBuilder: () => {
                const data = {};
                const schema = context?.schema;

                if (Array.isArray(schema?.body)) {
                  schema.body.forEach((control: any) => {
                    if (
                      control.name &&
                      !~['combo', 'input-array', 'form'].indexOf(control.type)
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
            })
          ]
        };
      } else {
        return {
          title: '数据源',
          body: [
            {
              type: 'select',
              name: 'feat',
              label: '使用场景',
              options: this.Features,
              pipeIn: (
                value: FormPluginFeat | undefined,
                formStore: IFormStore
              ) => {
                let feat = value;

                if (!value) {
                  feat = this.guessDSFeatFromSchema(formStore?.data);
                }

                return feat;
              },
              onChange: (
                value: FormPluginFeat,
                oldValue: FormPluginFeat,
                model: IFormItemStore,
                form: IFormStore
              ) => {
                if (value !== oldValue) {
                  const newSchema: any = {
                    dsType: this.dsManager.getDefaultBuilderKey()
                  };

                  // 批量编辑和新增需要删除获取数据接口
                  if (
                    DSFeatureEnum.Insert === value ||
                    DSFeatureEnum.BulkEdit === value
                  ) {
                    newSchema.initApi = undefined;
                  } else if (DSFeatureEnum.View === value) {
                    newSchema.api = undefined;
                  }
                  // 删除数据源无用配置
                  form.setValues(newSchema);
                }
              }
            },
            ...generateDSControls()
          ]
        };
      }
    };
    const i18nEnabled = getI18nEnabled();

    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl(
            'collapseGroup',
            [
              generateDSCollapse(),
              {
                title: '基本',
                body: [
                  getSchemaTpl('pageTitle', {
                    label: '标题',
                    visibleOn: isWrapped
                  }),
                  getSchemaTpl('switch', {
                    name: 'autoFocus',
                    label: tipedLabel(
                      '自动聚焦',
                      '设置后将让表单的第一个可输入的表单项获得焦点'
                    )
                  }),
                  getSchemaTpl('switch', {
                    name: 'persistData',
                    label: tipedLabel(
                      '本地缓存',
                      '开启后，表单的数据会缓存在浏览器中，切换页面或关闭弹框不会清空当前表单内的数据'
                    ),
                    pipeIn: (value: boolean | string | undefined) => !!value
                  }),
                  {
                    type: 'container',
                    className: 'ae-ExtendMore mb-3',
                    visibleOn: 'this.persistData',
                    body: [
                      getSchemaTpl('tplFormulaControl', {
                        name: 'persistData',
                        label: tipedLabel(
                          '持久化Key',
                          '使用静态数据或者变量：<code>"\\${id}"</code>，来为Form指定唯一的Key'
                        ),
                        pipeIn: (value: boolean | string | undefined) =>
                          typeof value === 'string' ? value : ''
                      }),
                      {
                        type: 'input-array',
                        label: tipedLabel(
                          '保留字段集合',
                          '如果只需要保存Form中的部分字段值，请配置需要保存的字段名称集合，留空则保留全部字段'
                        ),
                        name: 'persistDataKeys',
                        items: {
                          type: 'input-text',
                          placeholder: '请输入字段名',
                          options: flatten(
                            schema?.body ?? schema?.controls ?? []
                          )
                            .map((item: Record<string, any>) => {
                              const isFormItem = getRendererByName(
                                item?.type
                              )?.isFormItem;

                              return isFormItem &&
                                typeof item?.name === 'string'
                                ? {label: item.name, value: item.name}
                                : false;
                            })
                            .filter(Boolean)
                        },
                        itemClassName: 'bg-transparent'
                      },
                      getSchemaTpl('switch', {
                        name: 'clearPersistDataAfterSubmit',
                        label: tipedLabel(
                          '提交成功后清空缓存',
                          '开启本地缓存并开启本配置项后，表单提交成功后，会自动清除浏览器中当前表单的缓存数据'
                        ),
                        pipeIn: defaultValue(false)
                      })
                    ]
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
                        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
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
                    label: tipedLabel(
                      '开启调试',
                      '在表单顶部显示当前表单的数据'
                    )
                  })
                ]
              }
            ].filter(Boolean)
          )
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '布局',
              body: [
                {
                  label: '布局',
                  name: 'mode',
                  type: 'select',
                  pipeIn: defaultValue('flex'),
                  options: [
                    {
                      label: '网格',
                      value: 'flex'
                    },
                    {
                      label: '内联',
                      value: 'inline'
                    },
                    {
                      label: '水平',
                      value: 'horizontal'
                    },
                    {
                      label: '垂直',
                      value: 'normal'
                    }
                  ],
                  pipeOut: (v: string) => (v ? v : undefined),
                  onChange: (
                    value: string,
                    oldValue: string,
                    model: any,
                    form: any
                  ) => {
                    const body = [...form.data.body];
                    let temp = body;
                    if (value === 'flex') {
                      temp = body?.map((item: any, index: number) => {
                        return {
                          ...item,
                          row: index,
                          mode: undefined
                        };
                      });
                    } else {
                      temp = body?.map((item: any, index: number) => {
                        return {
                          ...item,
                          row: undefined,
                          colSize: undefined,
                          labelAlign: undefined,
                          mode: undefined
                        };
                      });
                    }
                    form.setValueByName('body', temp);
                  }
                },
                {
                  type: 'col-count',
                  name: '__rolCount',
                  label: tipedLabel('列数', '仅对PC页面生效'),
                  visibleOn: 'this.mode === "flex"'
                },
                {
                  label: '列数',
                  name: 'columnCount',
                  type: 'input-number',
                  step: 1,
                  min: 1,
                  precision: 0,
                  resetValue: '',
                  unitOptions: ['列'],
                  hiddenOn: 'this.mode === "flex"',
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
                },
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
            getSchemaTpl('theme:base', {
              classname: 'formControlClassName',
              title: '表单样式',
              needState: false,
              hiddenOn: isWrapped
            }),
            getSchemaTpl('theme:base', {
              classname: 'panelClassName',
              title: 'Panel样式',
              editorValueToken: '--Panel',
              hidePadding: true,
              needState: false,
              visibleOn: isWrapped
            }),
            getSchemaTpl('theme:base', {
              classname: 'headerControlClassName',
              title: '标题区样式',
              visibleOn: isWrapped,
              editorValueToken: '--Panel-heading',
              hideRadius: true,
              hideShadow: true,
              hideMargin: true,
              needState: false,
              extra: [
                getSchemaTpl('theme:font', {
                  name: 'themeCss.headerTitleControlClassName.font',
                  editorValueToken: '--Panel-heading'
                })
              ]
            }),

            getSchemaTpl('theme:base', {
              classname: 'bodyControlClassName',
              title: '内容区样式',
              editorValueToken: '--Panel-body',
              hideRadius: true,
              hideShadow: true,
              hideBorder: true,
              hideMargin: true,
              hideBackground: true,
              needState: false,
              visibleOn: isWrapped
            }),
            {
              title: '表单项样式',
              body: [
                {
                  type: 'select',
                  name: 'labelAlign',
                  label: '标题位置',
                  selectFirst: true,
                  hiddenOn:
                    'this.mode === "normal" || this.mode === "inline" || this.mode === "horizontal"',
                  options: [
                    {
                      label: '上下布局',
                      value: 'top'
                    },
                    {
                      label: '水平居左',
                      value: 'left'
                    },
                    {
                      label: '水平居右',
                      value: 'right'
                    }
                  ]
                },
                {
                  type: 'select',
                  name: 'labelAlign',
                  label: '标题位置',
                  selectFirst: true,
                  hiddenOn:
                    'this.mode === "normal" || this.mode === "inline" || this.mode === "flex"',
                  options: [
                    {
                      label: '水平居左',
                      value: 'left'
                    },
                    {
                      label: '水平居右',
                      value: 'right'
                    }
                  ]
                },
                getSchemaTpl('theme:select', {
                  label: '标题宽度',
                  name: 'labelWidth',
                  hiddenOn:
                    'this.mode === "normal" || this.labelAlign === "top"'
                }),

                getSchemaTpl('theme:font', {
                  label: '标题文字',
                  editorValueToken: '--Form-item',
                  hasSenior: false,
                  name: 'themeCss.itemLabelClassName.font'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: '标题边距',
                  hidePadding: true,
                  name: 'themeCss.itemLabelClassName.padding-and-margin'
                }),
                getSchemaTpl('theme:paddingAndMargin', {
                  label: '表单项边距',
                  hidePadding: true,
                  name: 'themeCss.itemClassName.padding-and-margin'
                }),
                getSchemaTpl('theme:font', {
                  label: '静态展示文字',
                  editorValueToken: '--Form-static',
                  name: 'themeCss.staticClassName.font',
                  visibleOn: '!!this.static || !!this.staticOn'
                })
              ]
            },
            getSchemaTpl('theme:base', {
              classname: 'actionsControlClassName',
              title: '操作区样式',
              editorValueToken: '--Panel-footer',
              hideRadius: true,
              hideShadow: true,
              hideMargin: true,
              needState: false,
              visibleOn: isWrapped
            }),
            {
              title: '自定义样式',
              body: [
                {
                  type: 'theme-cssCode',
                  label: false
                }
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

  filterProps(props: Record<string, any>, node: EditorNodeType) {
    ['rules'].forEach(name => {
      if (props.hasOwnProperty(name)) {
        props[name] = JSONPipeOut(props[name], false);
      }
    });

    return props;
  }

  /** 重新构建 API */
  panelFormPipeOut = async (schema: any, oldSchema: any) => {
    // 查看场景下，没有api，只有initApi
    const entity = schema?.api?.entity || schema?.initApi?.entity;

    if (!entity || schema?.dsType !== ModelDSBuilderKey) {
      return schema;
    }

    const builder = this.dsManager.getBuilderBySchema(schema);
    const observedFields = ['api', 'initApi', 'body', 'feat'];
    const diff = DeepDiff.diff(
      pick(oldSchema, observedFields),
      pick(schema, observedFields)
    );

    if (!diff) {
      return schema;
    }

    try {
      const updatedSchema = await builder.buildApiSchema({
        schema,
        renderer: 'form',
        sourceKey: DSFeatureEnum.View === schema.feat ? 'initApi' : 'api',
        feat: schema.feat ?? 'Insert',
        apiSettings: {
          diffConfig: {
            enable: true,
            schemaDiff: diff
          }
        }
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
        const tmpSchema = await current.info.plugin.buildDataSchemas?.(
          current,
          region,
          trigger,
          node
        );
        jsonschema.properties[schema.name] = {
          ...tmpSchema,
          ...(tmpSchema?.$id ? {} : {$id: `${current.id}-${current.type}`})
        };
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
    let shouldUpdateSchema = false;
    let patchedSchema: Schema = {...schema};

    if (
      !(
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
      )
    ) {
      shouldUpdateSchema = true;
      patchedSchema = {
        ...patchedSchema,
        actions: [
          {
            type: 'submit',
            label:
              props?.translate(props?.submitText) ||
              schema.submitText ||
              '提交',
            primary: true
          }
        ]
      };
    }

    if (!_isModelComp(schema)) {
      /** 每次需要纠正一下feat，有可能直接是编辑了代码的api */
      const exactlyFeat = this.guessDSFeatFromSchema(schema);
      if (exactlyFeat !== schema.feat) {
        shouldUpdateSchema = true;
        patchedSchema = {
          ...patchedSchema,
          feat: this.guessDSFeatFromSchema(schema)
        };
      }
    }

    return shouldUpdateSchema ? patchedSchema : undefined;
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
