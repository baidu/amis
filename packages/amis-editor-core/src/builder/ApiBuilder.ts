/**
 * API数据源处理器
 */

import {Schema, toast} from 'amis';
import {
  DSBuilder,
  DSFeature,
  DSFeatureType,
  DSGrain,
  registerDSBuilder
} from './DSBuilder';
import cloneDeep from 'lodash/cloneDeep';
import {getEnv} from 'mobx-state-tree';
import {ButtonSchema} from 'amis/lib/renderers/Action';
import {FormSchema, SchemaObject} from 'amis/lib/Schema';

import type {DSSourceSettingFormConfig} from './DSBuilder';
import {getSchemaTpl, tipedLabel} from '../tpl';

class APIBuilder extends DSBuilder {
  public static type = 'api';

  name = '接口';

  order = 0;

  public match = (value: any, schema?: SchemaObject) => {
    // https://aisuda.bce.baidu.com/amis/zh-CN/docs/types/api
    if (
      (typeof value === 'string' &&
        /^(get|post|put|delete|option):/.test(value)) ||
      (typeof value === 'object' && value.url)
    ) {
      return true;
    }

    return false;
  };

  public static accessable = (controlType: string, propKey: string) => {
    return true;
  };

  public features: Array<DSFeatureType> = [
    'List',
    'Insert',
    'View',
    'Edit',
    'Delete',
    'BulkEdit',
    'BulkDelete',
    'Import',
    'Export',
    'SimpleQuery',
    'FuzzyQuery'
  ];

  public makeSourceSettingForm(
    config: DSSourceSettingFormConfig
  ): SchemaObject[] {
    let {name, label, feat, inCrud, inScaffold} = config;

    if (['Import', 'Export', 'SimpleQuery', 'FuzzyQuery'].includes(feat)) {
      return [];
    }

    label =
      label ??
      (inCrud && feat !== 'List' ? DSFeature[feat].label + '接口' : '接口');
    name = name ?? (inScaffold ? DSFeature[feat].value + 'Api' : 'api');

    let sampleBuilder = null;
    let apiDesc = null;
    switch (feat) {
      case 'Insert':
        (label as any) = tipedLabel(
          label,
          `用来保存数据, 表单提交后将数据传入此接口。 <br/>
          接口响应体要求(如果data中有数据，该数据将被合并到表单上下文中)：<br/>
          ${JSON.stringify({status: 0, msg: '', data: {}}, null, '<br/>')}`
        );
        break;

      case 'List':
        (label as any) = tipedLabel(
          label,
          `接口响应体要求：<br/>
          ${JSON.stringify(
            {status: 0, msg: '', items: {}, page: 0, total: 0},
            null,
            '<br/>'
          )}`
        );
        break;
    }

    return [
      getSchemaTpl('apiControl', {
        label,
        name,
        sampleBuilder,
        apiDesc
      })
    ]
      .concat(
        feat === 'Edit' && !inCrud
          ? getSchemaTpl('apiControl', {
              label: tipedLabel(
                '初始化接口',
                `接口响应体要求：<br/>
          ${JSON.stringify({status: 0, msg: '', data: {}}, null, '<br/>')}`
              ),
              name: 'initApi'
            })
          : null
      )
      .concat(
        feat === 'List' && inCrud && inScaffold
          ? this.makeFieldsSettingForm({
              feat,
              setting: true
            })
          : null
      )
      .filter(Boolean);
  }

  public async getContextFileds(config: {
    schema: any;
    sourceKey: string;
    feat: DSFeatureType;
  }) {
    return config.schema.__fields;
  }

  public async getAvailableContextFileds(config: {
    schema: any;
    sourceKey: string;
    feat: DSFeatureType;
  }) {
    if (!config.schema.__fields) {
      return;
    }

    return [
      {
        label: '字段',
        value: 'fields',
        children: config.schema.__fields
      }
    ];
  }

  public makeFieldsSettingForm(config: {
    sourceKey?: string;
    feat: DSFeatureType;
    inCrud?: boolean;
    setting?: boolean;
    inScaffold?: boolean;
  }) {
    let {sourceKey, feat, inCrud, setting, inScaffold} = config;
    if (
      inScaffold === false ||
      ['Import', 'Export', 'FuzzyQuery'].includes(feat)
    ) {
      return [];
    }

    sourceKey = sourceKey ?? `${DSFeature[feat].value}Api`;
    const key = setting ? '__fields' : `${DSFeature[feat].value}Fields`;
    const hasInputType =
      ['Edit', 'Insert'].includes(feat) || (inCrud && feat === 'List');
    const hasType = ['View', 'List'].includes(feat);

    return ([] as any)
      .concat(
        inCrud && feat !== 'List'
          ? this.makeSourceSettingForm({
              feat,
              inScaffold,
              inCrud
            })
          : null
      )
      .concat([
        {
          type: 'combo',
          className: 'mb-0 ae-Fields-Setting',
          joinValues: false,
          name: key,
          label: inCrud ? `${DSFeature[feat].label}字段` : '字段',
          multiple: true,
          draggable: true,
          addable: false,
          removable: false,
          itemClassName: 'ae-Fields-Setting-Item',
          hidden: setting || !inCrud || ['Delete', 'BulkDelete'].includes(feat),
          items: {
            type: 'container',
            body: [
              {
                name: 'checked',
                label: false,
                mode: 'inline',
                className: 'm-0 ml-1',
                type: 'checkbox'
              },
              {
                type: 'tpl',
                className: 'ae-Fields-Setting-Item-label',
                tpl: '${label}'
              }
            ]
          }
        },
        {
          type: 'input-table',
          label: '字段',
          className: 'mb-0',
          name: key,
          // 非crud，都是定义字段的模式，只有crud，有统一定义字段，因此是选择字段
          visible: setting ?? !inCrud,
          removable: true,
          columnsTogglable: false,
          needConfirm: false,
          onChange: (value: any, oldValue: any, model: any, form: any) => {
            this.features.forEach(feat => {
              const key = `${DSFeature[feat].value}Fields`;
              const currentData = form.getValueByName(key);

              const result = cloneDeep(value || []).map((field: any) => {
                const exist = currentData?.find(
                  (f: any) => f.name === field.name
                );

                return {
                  ...field,
                  checked: exist ? exist.checked : true
                };
              });
              form.setValueByName(key, result);
            });
          },
          columns: [
            {
              type: 'switch',
              name: 'checked',
              value: true,
              label: '隐藏，默认选中',
              visible: false
            },
            {
              type: 'input-text',
              name: 'label',
              label: '标题'
            },
            {
              type: 'input-text',
              name: 'name',
              label: '绑定字段'
            },
            {
              type: 'select',
              name: 'type',
              label: '类型',
              visible: hasType,
              value: 'tpl',
              options: [
                {
                  value: 'tpl',
                  label: '文本',
                  typeKey: 'tpl'
                },
                {
                  value: 'image',
                  label: '图片',
                  typeKey: 'src'
                },
                {
                  value: 'date',
                  label: '日期',
                  typeKey: 'value'
                },
                {
                  value: 'progress',
                  label: '进度',
                  typeKey: 'value'
                },
                {
                  value: 'status',
                  label: '状态',
                  typeKey: 'value'
                },
                {
                  value: 'mapping',
                  label: '映射',
                  typeKey: 'value'
                }
              ],
              autoFill: {
                typeKey: '${typeKey}'
              }
            },
            {
              type: 'select',
              name: 'inputType',
              label: '输入类型',
              visible: hasInputType,
              value: 'input-text',
              options: [
                {
                  label: '输入框',
                  value: 'input-text'
                },
                {
                  label: '多行文本',
                  value: 'textarea'
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
            }
          ]
        },
        {
          type: 'group',
          visible: setting ?? !inCrud,
          label: '',
          body: [
            {
              type: 'grid',
              columns: [
                {
                  body: [
                    {
                      type: 'button',
                      label: '添加字段',
                      target: key,
                      className: 'ae-Button--link',
                      level: 'link',
                      icon: 'plus',
                      actionType: 'add'
                    }
                  ]
                },
                {
                  columnClassName: 'text-right',
                  body: [
                    {
                      type: 'button',
                      label: '基于接口自动生成字段',
                      visible: feat === 'Edit' || feat === 'List',
                      className: 'ae-Button--link',
                      level: 'link',
                      // className: 'm-t-xs m-b-xs',
                      // 列表 或者 不在CRUD中的查看接口等
                      onClick: async (e: Event, props: any) => {
                        const data = props.data;
                        const schemaFilter = getEnv(
                          (window as any).editorStore
                        ).schemaFilter;
                        const apiKey =
                          feat === 'Edit' && !inCrud ? 'initApi' : sourceKey;
                        let api: any = data[apiKey!];
                        // 主要是给爱速搭中替换 url
                        if (schemaFilter) {
                          api = schemaFilter({
                            api
                          }).api;
                        }
                        if (!api) {
                          toast.warning('请先填写接口');
                        }

                        const result = await props.env.fetcher(api, data);

                        let autoFillKeyValues: Array<any> = [];
                        let itemExample;
                        if (feat === 'List') {
                          const items = result.data?.rows || result.data?.items;
                          itemExample = items?.[0];
                        } else {
                          itemExample = result.data;
                        }

                        if (itemExample) {
                          Object.entries(itemExample).forEach(
                            ([key, value]) => {
                              autoFillKeyValues.push({
                                label: key,
                                type: 'tpl',
                                inputType:
                                  typeof value === 'number'
                                    ? 'input-number'
                                    : 'input-text',
                                name: key
                              });
                            }
                          );
                          props.formStore.setValues({
                            [key]: autoFillKeyValues
                          });
                        } else {
                          toast.warning(
                            'API返回格式不正确，请查看接口响应格式要求'
                          );
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]) as SchemaObject[];
  }

  public async makeFieldFilterSetting(config: {
    /** 数据源字段名 */
    sourceKey: string;
    schema: any;
    fieldName: string;
  }) {
    return [];
  }

  public resolveSourceSchema(config: {
    schema: SchemaObject;
    setting: any;
    name?: string;
    feat?: DSFeatureType;
    inCrud?: boolean;
  }): void {
    let {name, setting, schema, feat} = config;
    name = name ?? 'api';
    // @ts-ignore
    schema[name] = setting[feat ? `${DSFeature[feat].value}Api` : 'api'];

    // form中需要初始化接口和编辑接口
    if (feat === 'Edit') {
      (schema as FormSchema).initApi = setting.initApi;
    }
  }

  public resolveViewSchema(config: {
    setting: any;
    feat?: DSFeatureType;
  }): SchemaObject[] {
    let {setting, feat = 'Edit'} = config;
    const fields = setting[`${DSFeature[feat].value}Fields`] || [];
    return fields
      .filter((i: any) => i.checked)
      .map((field: any) => ({
        type: field.type,
        [field.typeKey || 'value']: '${' + field.name + '}'
      }));
  }

  public resolveTableSchema(config: {schema: any; setting: any}): void {
    let {schema, setting} = config;
    const fields = setting.listFields.filter((i: any) => i.checked) || [];
    schema.columns = this.makeTableColumnsByFields(fields);
  }

  public makeTableColumnsByFields(fields: any[]) {
    return fields.map((field: any) => ({
      type: field.type,
      title: field.label,
      key: field.name,
      [field.typeKey || 'value']: '${' + field.name + '}'
    }));
  }

  public resolveCreateSchema(config: {
    schema: FormSchema;
    setting: any;
    feat: 'Insert' | 'Edit' | 'BulkEdit';
    name?: string;
    inCrud?: boolean;
    inScaffold?: boolean;
  }): void {
    let {schema, setting, feat, name} = config;
    const fields = setting[`${DSFeature[feat].value}Fields`] || [];
    // @ts-ignore
    schema[name ?? 'api'] = setting[DSFeature[feat].value + 'Api'];
    schema.initApi = setting['initApi'];
    schema.body = fields
      .filter((i: any) => i.checked)
      .map((field: any) => ({
        type: field.inputType,
        name: field.name,
        label: field.label
      }));
  }

  public resolveDeleteSchema(config: {
    schema: ButtonSchema;
    setting: any;
    feat: 'BulkDelete' | 'Delete';
    name?: string | undefined;
  }) {
    const {schema, setting, feat} = config;
    schema.onEvent = Object.assign(schema.onEvent ?? {}, {
      click: {
        actions: []
      }
    });

    const api = {
      ...(setting[`${DSFeature[feat].value}Api`] || {})
    };
    if (feat === 'Delete') {
      api.data = {
        id: '${item.id}'
      };
    } else {
      api.data = {
        ids: '${ARRAYMAP(selectedItems, item=> item.id)}'
      };
    }

    schema.onEvent.click.actions.push({
      actionType: 'ajax',
      args: {api}
    });
  }

  public resolveSimpleFilterSchema(config: {setting: any}) {
    const {setting} = config;
    const fields = setting.simpleQueryFields || [];
    return fields
      .filter((i: any) => i.checked)
      .map((field: any) => ({
        type: field.inputType,
        name: field.name,
        label: field.label
      }));
  }

  public resolveAdvancedFilterSchema(config: {setting: any}) {
    return;
  }
}

registerDSBuilder(APIBuilder);
