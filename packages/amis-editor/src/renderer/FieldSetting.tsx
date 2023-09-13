/**
 * @file FieldSetting.tsx
 * @desc 脚手架中字段管理
 */

import React from 'react';
import {reaction} from 'mobx';
import pick from 'lodash/pick';
import {findDOMNode} from 'react-dom';
import {
  FormItem,
  FormControlProps,
  autobind,
  isValidApi,
  normalizeApi
} from 'amis-core';
import {
  Form,
  InputTable,
  Controller,
  InputBox,
  Select,
  Button,
  toast
} from 'amis-ui';

import type {IReactionDisposer} from 'mobx';
import type {InputTableColumnProps} from 'amis-ui';
import type {DSFeatureType, ScaffoldField} from '../builder/type';

interface FieldSettingProps extends FormControlProps {
  /** 脚手架渲染类型 */
  renderer?: string;
  feat: DSFeatureType;
  config: {
    showInputType?: boolean;
    showDisplayType?: boolean;
  };
  onAutoGenerateFields: (params: {
    api: any;
    props: FieldSettingProps;
    setState: (state: any) => void;
  }) => Promise<any[]>;
}

interface RowData extends ScaffoldField {}

export class FieldSetting extends React.Component<
  FieldSettingProps,
  {loading: boolean}
> {
  static defaultProps = {
    config: {
      showInputType: true,
      showDisplayType: true
    }
  };

  static validator = (items: RowData[], isInternal?: boolean) => {
    const cache: Record<string, boolean> = {};
    const fields = items ?? [];
    let error: string | boolean = false;

    for (let [index, item] of fields.entries()) {
      /** 提交时再校验 */
      if (!item.name && isInternal !== true) {
        error = `序号「${index + 1}」的字段名称不能为空`;
        break;
      }

      if (!cache.hasOwnProperty(item.name)) {
        cache[item.name] = true;
        continue;
      }

      error = `序号「${index + 1}」的字段名称「${item.name}」不唯一`;
      break;
    }

    return error;
  };

  reaction: IReactionDisposer;

  dom: HTMLElement;

  formRef = React.createRef<{submit: () => Promise<Record<string, any>>}>();

  tableRef = React.createRef<any>();

  scaffold: RowData = {
    label: '',
    name: '',
    displayType: 'tpl',
    inputType: 'input-text'
  };

  constructor(props: FieldSettingProps) {
    super(props);
    this.state = {loading: false};
    this.reaction = reaction(
      () => {
        const ctx = props?.store?.data;
        const initApi = ctx?.initApi;
        const listApi = ctx?.listApi;
        return `${initApi}${listApi}`;
      },
      () => this.forceUpdate()
    );
  }

  componentDidMount() {
    this.dom = findDOMNode(this) as HTMLElement;
  }

  componentWillUnmount() {
    this.reaction?.();
  }

  @autobind
  handleColumnBlur() {
    this?.formRef?.current?.submit();
  }

  @autobind
  handleSubmit(data: {items: RowData[]}) {
    const {value} = this.props;
    const items = (data?.items ?? []).map((field: RowData) => {
      const item = value?.find((f: RowData) => f.name === field.name);
      return {
        ...pick(
          {
            ...item,
            ...field
          },
          ['label', 'name', 'displayType', 'inputType']
        ),
        checked: true
      };
    });

    this.handleFieldsChange(items);
  }

  @autobind
  async handleGenerateFields(e: React.MouseEvent<any>) {
    const {
      store,
      renderer,
      feat,
      env,
      manager,
      data: ctx,
      onAutoGenerateFields
    } = this.props;
    const scaffoldData = store?.data;
    let api =
      renderer === 'form'
        ? scaffoldData?.initApi
        : renderer === 'crud'
        ? scaffoldData?.listApi
        : '';

    if (!api || (renderer === 'form' && feat !== 'Edit')) {
      return;
    }

    this.setState({loading: true});
    let fields: RowData[] = [];

    if (onAutoGenerateFields && typeof onAutoGenerateFields === 'function') {
      try {
        fields = await onAutoGenerateFields({
          api: api,
          props: this.props,
          setState: this.setState
        });
      } catch (error) {
        toast.warning(
          error.message ?? 'API返回格式不正确，请查看接口响应格式要求'
        );
      }
    } else {
      const schemaFilter = manager?.store?.schemaFilter;

      if (schemaFilter) {
        api = schemaFilter({
          api
        }).api;
      }

      try {
        const result = await env?.fetcher(api, ctx);

        if (!result.ok) {
          toast.warning(
            result.defaultMsg ??
              result.msg ??
              'API返回格式不正确，请查看接口响应格式要求'
          );
          this.setState({loading: false});
          return;
        }

        let sampleRow: Record<string, any>;
        if (feat === 'List') {
          const items = result.data?.rows || result.data?.items || result.data;
          sampleRow = items?.[0];
        } else {
          sampleRow = result.data;
        }

        if (sampleRow) {
          Object.entries(sampleRow).forEach(([key, value]) => {
            fields.push({
              label: key,
              name: key,
              displayType: 'tpl',
              inputType:
                typeof value === 'number' ? 'input-number' : 'input-text',
              checked: true
            });
          });
        }
      } catch (error) {
        toast.warning(
          error.message ?? 'API返回格式不正确，请查看接口响应格式要求'
        );
      }
    }

    if (fields && fields.length > 0) {
      this.handleFieldsChange(fields);
    }

    this.setState({loading: false});
  }

  @autobind
  handleFieldsChange(fields: RowData[]) {
    const {
      onChange,
      onBulkChange,
      submitOnChange,
      renderer,
      data: ctx
    } = this.props;
    const isFirstStep = ctx?.__step === 0;

    if (renderer === 'form') {
      onChange?.(fields, submitOnChange, true);
    } else {
      if (isFirstStep) {
        onBulkChange?.(
          {
            listFields: fields,
            editFields: fields,
            bulkEditFields: fields,
            insertFields: fields,
            viewFields: fields,
            simpleQueryFields: fields
          },
          submitOnChange
        );
      } else {
        onChange?.(fields, submitOnChange, true);
      }
    }
  }

  @autobind
  renderFooter() {
    const {renderer, store, data: ctx, feat} = this.props;
    const scaffoldData = store?.data;
    const {initApi, listApi} = scaffoldData || {};
    const {loading} = this.state;
    const fieldApi =
      renderer === 'form' ? initApi : renderer === 'crud' ? listApi : '';
    const isApiValid = isValidApi(normalizeApi(fieldApi)?.url);
    const showAutoGenBtn =
      (renderer === 'form' && feat === 'Edit') ||
      (renderer === 'crud' && feat === 'List' && ctx?.__step === 0);

    return showAutoGenBtn ? (
      <>
        <Button
          size="sm"
          level="link"
          loading={loading}
          disabled={!isApiValid}
          disabledTip={{
            content:
              renderer === 'form' ? '请先填写初始化接口' : '请先填写接口',
            tooltipTheme: 'dark'
          }}
          onClick={e => this.handleGenerateFields(e)}
        >
          <span>基于接口自动生成字段</span>
        </Button>
      </>
    ) : null;
  }

  render() {
    const {
      classnames: cx,
      value: formValue,
      defaultValue: formDefaultValue,
      env,
      renderer,
      config,
      data: ctx,
      feat
    } = this.props;
    const {showDisplayType, showInputType} = config || {};
    const isForm = renderer === 'form';
    const defaultValue = Array.isArray(formDefaultValue)
      ? {items: formDefaultValue}
      : {items: []};
    const value = Array.isArray(formValue) ? {items: formValue} : undefined;
    const popOverContainer = env?.getModalContainer?.() ?? this.dom;
    const isFirstStep = ctx?.__step === 0;

    return (
      <Form
        className={cx('ae-FieldSetting')}
        defaultValue={defaultValue}
        value={value}
        autoSubmit={false}
        // onChange={this.handleTableChange}
        onSubmit={this.handleSubmit}
        ref={this.formRef}
      >
        {({control}: any) => (
          <>
            <InputTable
              ref={this.tableRef}
              name="items"
              label={false}
              labelAlign="left"
              mode="horizontal"
              horizontal={{left: 4}}
              control={control}
              scaffold={this.scaffold}
              addable={true}
              removable={true}
              isRequired={false}
              rules={{
                validate: (values: any[]) =>
                  FieldSetting.validator(values, true)
              }}
              addButtonText="添加字段"
              addButtonProps={{level: 'link'}}
              scroll={{y: '315.5px'}}
              footer={this.renderFooter}
              columns={
                [
                  {
                    title: '序号',
                    tdRender: (
                      {control}: any,
                      index: number,
                      rowIndex: number
                    ) => {
                      return (
                        <Controller
                          name="index"
                          control={control}
                          render={({field, fieldState}) => (
                            <span>{rowIndex + 1}</span>
                          )}
                        />
                      );
                    }
                  },
                  {
                    title: '字段名称',
                    tdRender: ({control}: any) => {
                      return (
                        <Controller
                          name="name"
                          control={control}
                          render={renderProps => {
                            const {field, fieldState} = renderProps;
                            return (
                              <InputBox
                                {...field}
                                onBlur={() => {
                                  field.onBlur();
                                  this.handleColumnBlur();
                                }}
                                hasError={!!fieldState.error}
                                className={cx('ae-FieldSetting-input')}
                              />
                            );
                          }}
                        />
                      );
                    }
                  },
                  {
                    title: '标题',
                    tdRender: ({control}: any) => {
                      return (
                        <Controller
                          name="label"
                          control={control}
                          render={renderProps => {
                            const {field, fieldState} = renderProps;
                            return (
                              <InputBox
                                {...field}
                                onBlur={() => {
                                  field.onBlur();
                                  this.handleColumnBlur();
                                }}
                                hasError={!!fieldState.error}
                                className={cx('ae-FieldSetting-input')}
                              />
                            );
                          }}
                        />
                      );
                    }
                  },
                  showInputType &&
                  !(renderer === 'crud' && feat === 'List' && !isFirstStep)
                    ? {
                        title: '输入类型',
                        tdRender: ({control}: any, index: number) => {
                          return (
                            <Controller
                              name="inputType"
                              control={control}
                              isRequired
                              render={({field, fieldState}) => (
                                <Select
                                  {...field}
                                  className={'w-full'}
                                  hasError={!!fieldState.error}
                                  searchable
                                  disabled={false}
                                  clearable={false}
                                  popOverContainer={popOverContainer}
                                  options={[
                                    {
                                      label: '单行文本框',
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
                                      label: '表格编辑',
                                      value: 'input-table'
                                    },
                                    {
                                      label: '组合输入',
                                      value: 'combo'
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
                                  ]}
                                />
                              )}
                            />
                          );
                        }
                      }
                    : undefined,
                  showDisplayType
                    ? {
                        title: '展示类型',
                        tdRender: ({control}: any) => {
                          return (
                            <Controller
                              name="displayType"
                              control={control}
                              isRequired
                              render={({field, fieldState}) => (
                                <Select
                                  {...field}
                                  className={'w-full'}
                                  hasError={!!fieldState.error}
                                  searchable
                                  disabled={false}
                                  clearable={false}
                                  popOverContainer={popOverContainer}
                                  options={[
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
                                    },
                                    {
                                      value: 'list',
                                      label: '列表',
                                      typeKey: 'value'
                                    }
                                  ]}
                                />
                              )}
                            />
                          );
                        }
                      }
                    : undefined
                ].filter(
                  (f): f is Exclude<typeof f, null | undefined> => f != null
                ) as InputTableColumnProps[]
              }
            />
          </>
        )}
      </Form>
    );
  }
}

@FormItem({type: 'ae-field-setting'})
export default class FieldSettingRenderer extends FieldSetting {}
