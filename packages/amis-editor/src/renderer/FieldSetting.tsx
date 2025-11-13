/**
 * @file FieldSetting.tsx
 * @desc 脚手架中字段管理
 */

import React from 'react';
import {reaction} from 'mobx';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import {isObject} from 'amis-core';
import {findDomCompat as findDOMNode} from 'amis-core';
import {
  FormItem,
  FormControlProps,
  autobind,
  isValidApi,
  normalizeApi
} from 'amis-core';
import {Button, toast} from 'amis-ui';
import {DSFeatureEnum} from '../builder/constants';

import type {IReactionDisposer} from 'mobx';
import type {InputTableColumnProps} from 'amis-ui';
import type {DSFeatureType, ScaffoldField} from '../builder/type';

interface FieldSettingProps extends FormControlProps {
  /** 脚手架渲染类型 */
  renderer?: string;
  feat: DSFeatureType;
  /** 支持的功能场景对应的字段集合，eg: listFields, bulkEditFields等 */
  fieldKeys: string[];
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

interface FieldSettingState {
  loading: boolean;
  fields: RowData[];
}

export class FieldSetting extends React.Component<
  FieldSettingProps,
  FieldSettingState
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

  columns: InputTableColumnProps[];

  constructor(props: FieldSettingProps) {
    super(props);

    const {render, classnames: cx, env, config, data, renderer, feat} = props;
    const popOverContainer = env?.getModalContainer?.() ?? this.dom;
    const {showDisplayType, showInputType} = config || {};
    const isFirstStep = data?.__step === 0;

    this.state = {
      loading: false,
      fields: Array.isArray(props.value) ? props.value : []
    };
    this.reaction = reaction(
      () => {
        const ctx = props?.store?.data;
        const initApi = ctx?.initApi;
        const listApi = ctx?.listApi;
        let result = '';

        try {
          result = `${JSON.stringify(initApi)}${JSON.stringify(listApi)}`;
        } catch (error) {}

        return result;
      },
      () => this.forceUpdate()
    );
  }

  componentDidMount() {
    this.dom = findDOMNode(this) as HTMLElement;
  }

  componentDidUpdate(
    prevProps: Readonly<FieldSettingProps>,
    prevState: Readonly<FieldSettingState>,
    snapshot?: any
  ): void {
    const prevValue = prevProps.value;
    const value = this.props.value;

    if (
      (prevValue?.length !== value?.length || !isEqual(prevValue, value)) &&
      !isEqual(value, prevState?.fields)
    ) {
      this.setState({fields: Array.isArray(value) ? value : []});
    }
  }

  componentWillUnmount() {
    this.reaction?.();
  }

  isFirstStep() {
    return this.props?.manager?.store?.scaffoldFormStep === 0;
  }

  @autobind
  handleTableChange(items?: RowData[]) {
    if (!items || !Array.isArray(items)) {
      return;
    }

    const fields = this.state.fields.concat();

    this.handleFieldsChange(
      items.map((row: RowData) => {
        const item = fields.find((r: RowData) => r?.name === row.name);

        return {
          ...pick(
            {
              ...item,
              ...row
            },
            ['label', 'name', 'displayType', 'inputType']
          ),
          checked: true
        };
      })
    );
  }

  @autobind
  handleSubmit(data: {items: RowData[]}) {
    const {onSubmit} = this.props;

    onSubmit?.(data?.items);
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

    if (
      !api ||
      (renderer === 'form' &&
        feat !== DSFeatureEnum.Edit &&
        feat !== DSFeatureEnum.View)
    ) {
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
            let inputType = 'input-text';

            if (Array.isArray(value)) {
              inputType = 'select';
            } else if (isObject(value)) {
              inputType = 'combo';
            } else if (typeof value === 'number') {
              inputType = 'input-number';
            }

            fields.push({
              label: key,
              name: key,
              displayType: 'tpl',
              inputType,
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

    fields = Array.isArray(fields) && fields.length > 0 ? fields : [];

    this.handleFieldsChange(fields);
    this.setState({loading: false});
  }

  @autobind
  handleFieldsChange(fields: RowData[]) {
    const {
      manager,
      fieldKeys,
      onChange,
      onBulkChange,
      submitOnChange,
      renderer,
      data: ctx
    } = this.props;
    const isFirstStep = this.isFirstStep();
    const scaffoldStepManipulated = manager?.store?.scaffoldStepManipulated;

    this.setState({fields});

    if (renderer === 'form') {
      onChange?.(fields, submitOnChange, true);
    } else {
      if (isFirstStep) {
        /** 若未进行过下一步，则为所有 feat 字段进行初始化，否则仅修改List场景字段 */
        if (scaffoldStepManipulated) {
          onChange?.(fields, submitOnChange, true);
        } else {
          const updatedData: Record<string, RowData[]> = {};

          fieldKeys.forEach(fieldKey => {
            if (!updatedData.hasOwnProperty(fieldKey)) {
              updatedData[fieldKey] = fields;
            }
          });

          onBulkChange?.({...updatedData, listFields: fields}, submitOnChange);
        }
      } else {
        onChange?.(fields, submitOnChange, true);
      }
    }
  }

  debounceGenerateFields = debounce(
    async (e: React.MouseEvent<any>) => this.handleGenerateFields(e),
    200,
    {trailing: true, leading: false}
  );

  @autobind
  renderFooter() {
    const {classnames: cx, renderer, store, data: ctx, feat} = this.props;
    const scaffoldData = store?.data;
    const {initApi, listApi} = scaffoldData || {};
    const {loading} = this.state;
    const isForm = renderer === 'form';
    const isCRUD = renderer === 'crud';
    const fieldApi = isForm ? initApi : isCRUD ? listApi : '';
    const isApiValid = isValidApi(normalizeApi(fieldApi)?.url);
    const showAutoGenBtn =
      (isForm &&
        (feat === DSFeatureEnum.Edit || feat === DSFeatureEnum.View)) ||
      (isCRUD && feat === DSFeatureEnum.List && ctx?.__step === 0);

    return showAutoGenBtn ? (
      <div
        className={cx('ae-FieldSetting-footer', {
          ['ae-FieldSetting-footer--form']: isForm
        })}
      >
        <Button
          size="sm"
          level="link"
          loading={loading}
          disabled={!isApiValid || loading}
          disabledTip={{
            content: loading
              ? '数据处理中...'
              : isForm
              ? '请先填写初始化接口'
              : '请先填写接口',
            tooltipTheme: 'dark'
          }}
          onClick={this.debounceGenerateFields}
        >
          <span>基于接口自动生成字段</span>
        </Button>
      </div>
    ) : null;
  }

  render() {
    const {
      render,
      classnames: cx,
      name = 'items',
      renderer,
      config,
      feat,
      popOverContainer
    } = this.props;
    const {showDisplayType, showInputType} = config || {};
    const isFirstStep = this.isFirstStep();
    const fields = this.state.fields.concat();

    return (
      <>
        {render(
          'field-setting',
          {
            type: 'input-table',
            name: name,
            label: false,
            className: cx(
              'ae-FieldSetting-Table',
              'mb-0'
            ) /** 底部有操作区，干掉默认的 margin-bottom */,
            toolbarClassName: 'w-1/2',
            showIndex: true,
            showFooterAddBtn: true,
            addable: true,
            addBtnLabel: '新增',
            addBtnIcon: false,
            editable: true,
            editBtnLabel: '编辑',
            editBtnIcon: false,
            removable: true,
            deleteBtnLabel: '删除',
            deleteBtnIcon: false,
            confirmBtnLabel: '确认',
            cancelBtnLabel: '取消',
            needConfirm: false,
            enableStaticTransform: true,
            autoFocus: false,
            affixHeader: true,
            columnsTogglable: false,
            autoFillHeight: {
              maxHeight: 325 // 至少展示5个元素
            },
            footerAddBtn: {
              level: 'link',
              label: '添加字段'
            },
            placeholder: '暂无字段',
            scaffold: this.scaffold,
            columns: [
              {
                type: 'input-text',
                name: 'name',
                label: '字段名称',
                placeholder: '字段名称'
              },
              {
                type: 'input-text',
                name: 'label',
                label: '标题',
                placeholder: '字段标题'
              },
              showInputType &&
              !(renderer === 'crud' && feat === 'List' && !isFirstStep)
                ? {
                    type: 'select',
                    name: 'inputType',
                    label: '输入类型',
                    options: [
                      {
                        label: '单行文本框',
                        value: 'input-text',
                        icon: 'input-text-plugin'
                      },
                      {label: '多行文本', value: 'textarea'},
                      {label: '数字输入', value: 'input-number'},
                      {label: '单选框', value: 'radios'},
                      {label: '勾选框', value: 'checkbox'},
                      {label: '复选框', value: 'checkboxes'},
                      {label: '下拉框', value: 'select'},
                      {label: '开关', value: 'switch'},
                      {label: '日期', value: 'input-date'},
                      {label: '表格编辑', value: 'input-table'},
                      {label: '组合输入', value: 'combo'},
                      {label: '文件上传', value: 'input-file'},
                      {label: '图片上传', value: 'input-image'},
                      {label: '富文本编辑器', value: 'input-rich-text'}
                    ]
                  }
                : undefined,
              showDisplayType
                ? {
                    type: 'select',
                    name: 'displayType',
                    label: '展示类型',
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
                      },
                      {
                        value: 'list',
                        label: '列表',
                        typeKey: 'value'
                      }
                    ]
                  }
                : undefined
            ].filter(Boolean)
          },
          {
            popOverContainer,
            data: {
              [name]: fields
            },
            loading: this.state.loading,
            onChange: this.handleTableChange
          }
        )}
        {this.renderFooter()}
      </>
    );
  }
}

@FormItem({type: 'ae-field-setting'})
export default class FieldSettingRenderer extends FieldSetting {}
