import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IFormItemStore, IFormStore} from '../store/form';
import {reaction} from 'mobx';

import {
  renderersMap,
  RendererProps,
  registerRenderer,
  TestFunc,
  RendererConfig
} from '../factory';
import {
  anyChanged,
  ucFirst,
  getWidthRate,
  autobind,
  isMobile,
  createObject,
  getVariable
} from '../utils/helper';
import {observer} from 'mobx-react';
import {FormHorizontal, FormSchemaBase} from './Form';
import {
  BaseApiObject,
  BaseSchemaWithoutType,
  ClassName,
  Schema
} from '../types';
import {filter} from '../utils/tpl';
import {HocStoreFactory} from '../WithStore';
import {wrapControl} from './wrapControl';
import debounce from 'lodash/debounce';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {findDOMNode} from 'react-dom';
import {dataMapping} from '../utils';
import Overlay from '../components/Overlay';
import PopOver from '../components/PopOver';

export type LabelAlign = 'right' | 'left';

export interface FormBaseControl extends BaseSchemaWithoutType {
  /**
   * 表单项大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * 描述标题
   */
  label?: string | false;

  /**
   * 描述标题
   */
  labelAlign?: LabelAlign;

  /**
   * label自定义宽度，默认单位为px
   */
  labelWidth?: number | string;

  /**
   * 配置 label className
   */
  labelClassName?: string;

  /**
   * 字段名，表单提交时的 key，支持多层级，用.连接，如： a.b.c
   */
  name?: string;

  /**
   * 显示一个小图标, 鼠标放上去的时候显示提示内容
   */
  remark?: any;

  /**
   * 显示一个小图标, 鼠标放上去的时候显示提示内容, 这个小图标跟 label 在一起
   */
  labelRemark?: any;

  /**
   * 输入提示，聚焦的时候显示
   */
  hint?: string;

  /**
   * 当修改完的时候是否提交表单。
   */
  submitOnChange?: boolean;

  /**
   * 是否只读
   */
  readOnly?: boolean;

  /**
   * 只读条件
   */
  readOnlyOn?: string;

  /**
   * 不设置时，当表单提交过后表单项每次修改都会触发重新验证，
   * 如果设置了，则由此配置项来决定要不要每次修改都触发验证。
   */
  validateOnChange?: boolean;

  /**
   * 描述内容，支持 Html 片段。
   */
  description?: string;

  /**
   * @deprecated 用 description 代替
   */
  desc?: string;

  /**
   * 配置描述上的 className
   */
  descriptionClassName?: ClassName;

  /**
   * 配置当前表单项展示模式
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 当配置为水平布局的时候，用来配置具体的左右分配。
   */
  horizontal?: FormHorizontal;

  /**
   * 表单 control 是否为 inline 模式。
   */
  inline?: boolean;

  /**
   * 配置 input className
   */
  inputClassName?: ClassName;

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否为必填
   */
  required?: boolean;

  /**
   * 验证失败的提示信息
   */
  validationErrors?: {
    isAlpha?: string;
    isAlphanumeric?: string;
    isEmail?: string;
    isFloat?: string;
    isInt?: string;
    isJson?: string;
    isLength?: string;
    isNumeric?: string;
    isRequired?: string;
    isUrl?: string;
    matchRegexp?: string;
    matchRegexp2?: string;
    matchRegexp3?: string;
    matchRegexp4?: string;
    matchRegexp5?: string;
    maxLength?: string;
    maximum?: string;
    minLength?: string;
    minimum?: string;

    [propName: string]: any;
  };

  validations?:
    | string
    | {
        /**
         * 是否是字母
         */
        isAlpha?: boolean;

        /**
         * 是否为字母数字
         */
        isAlphanumeric?: boolean;

        /**
         * 是否为邮箱地址
         */
        isEmail?: boolean;

        /**
         * 是否为浮点型
         */
        isFloat?: boolean;

        /**
         * 是否为整型
         */
        isInt?: boolean;

        /**
         * 是否为 json
         */
        isJson?: boolean;

        /**
         * 长度等于指定值
         */
        isLength?: number;

        /**
         * 是否为数字
         */
        isNumeric?: boolean;

        /**
         * 是否为必填
         */
        isRequired?: boolean;

        /**
         * 是否为 URL 地址
         */
        isUrl?: boolean;

        /**
         * 内容命中指定正则
         */
        matchRegexp?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp1?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp2?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp3?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp4?: string;
        /**
         * 内容命中指定正则
         */
        matchRegexp5?: string;

        /**
         * 最大长度为指定值
         */
        maxLength?: number;

        /**
         * 最大值为指定值
         */
        maximum?: number;

        /**
         * 最小长度为指定值
         */
        minLength?: number;

        /**
         * 最小值为指定值
         */
        minimum?: number;

        [propName: string]: any;
      };

  /**
   * 默认值，切记只能是静态值，不支持取变量，跟数据关联是通过设置 name 属性来实现的。
   */
  value?: any;

  /**
   * 表单项隐藏时，是否在当前 Form 中删除掉该表单项值。注意同名的未隐藏的表单项值也会删掉
   */
  clearValueOnHidden?: boolean;

  /**
   * 远端校验表单项接口
   */
  validateApi?: string | BaseApiObject;
}

export interface FormItemBasicConfig extends Partial<RendererConfig> {
  type?: string;
  wrap?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  test?: RegExp | TestFunc;
  storeType?: string;
  validations?: string;
  strictMode?: boolean;
  /**
   * schema变化使视图更新的属性白名单
   */
  detectProps?: Array<string>;
  shouldComponentUpdate?: (props: any, prevProps: any) => boolean;
  descriptionClassName?: string;
  storeExtendsData?: boolean;
  sizeMutable?: boolean;
  weight?: number;
  extendsData?: boolean;
  showErrorMsg?: boolean;

  // 兼容老用法，新用法直接在 Component 里面定义 validate 方法即可。
  validate?: (values: any, value: any) => string | boolean;
}

// 自己接收到属性。
export interface FormItemProps extends RendererProps {
  name?: string;
  formStore?: IFormStore;
  formItem?: IFormItemStore;
  formInited: boolean;
  formMode: 'normal' | 'horizontal' | 'inline' | 'row' | 'default';
  formHorizontal: FormHorizontal;
  formLabelAlign: LabelAlign;
  formLabelWidth?: number | string;
  defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  labelAlign?: LabelAlign;
  labelWidth?: number | string;
  disabled?: boolean;
  btnDisabled: boolean;
  defaultValue: any;
  value?: any;
  prinstine: any;
  setPrinstineValue: (value: any) => void;
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onBulkChange?: (
    values: {[propName: string]: any},
    submitOnChange?: boolean
  ) => void;
  addHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => () => void;
  removeHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => void;
  renderFormItems: (
    schema: Partial<FormSchemaBase>,
    region: string,
    props: any
  ) => JSX.Element;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;

  formItemValue: any; // 不建议使用 为了兼容 v1
  getValue: () => any; // 不建议使用 为了兼容 v1
  setValue: (value: any, key: string) => void; // 不建议使用 为了兼容 v1

  inputClassName?: string;
  renderControl?: (props: FormControlProps) => JSX.Element;

  inputOnly?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  sizeMutable?: boolean;
  wrap?: boolean;
  hint?: string;
  description?: string;
  descriptionClassName?: string;
  // error 详情
  errors?: {
    [propName: string]: string;
  };
  // error string
  error?: string;
  showErrorMsg?: boolean;
}

// 下发下去的属性
export type FormControlProps = RendererProps & {
  onOpenDialog: (schema: Schema, data: any) => Promise<any>;
} & Exclude<
    FormItemProps,
    | 'inputClassName'
    | 'renderControl'
    | 'defaultSize'
    | 'size'
    | 'error'
    | 'errors'
    | 'hint'
    | 'descriptionClassName'
    | 'inputOnly'
    | 'renderLabel'
    | 'renderDescription'
    | 'sizeMutable'
    | 'wrap'
  >;

export type FormItemComponent = React.ComponentType<FormItemProps>;
export type FormControlComponent = React.ComponentType<FormControlProps>;

export interface FormItemConfig extends FormItemBasicConfig {
  component: FormControlComponent;
}

export class FormItemWrap extends React.Component<FormItemProps> {
  reaction: Array<() => void> = [];
  lastSearchTerm: any;
  target: HTMLElement;

  constructor(props: FormItemProps) {
    super(props);

    this.state = {
      isOpened: false
    };

    const {formItem: model} = props;

    if (model) {
      this.reaction.push(
        reaction(
          () => `${model.errors.join('')}${model.isFocused}${model.dialogOpen}`,
          () => this.forceUpdate()
        )
      );
      this.reaction.push(
        reaction(
          () => JSON.stringify(model.tmpValue),
          () => this.syncAutoFill(model.tmpValue)
        )
      );
    }
  }

  componentDidUpdate(prevProps: FormItemProps) {
    const props = this.props;
    const {formItem: model} = props;

    if (
      isEffectiveApi(props.autoFill?.api, props.data) &&
      isApiOutdated(
        prevProps.autoFill?.api,
        props.autoFill?.api,
        prevProps.data,
        props.data
      )
    ) {
      this.syncAutoFill(model?.tmpValue, true);
    }
  }

  componentDidMount() {
    this.target = findDOMNode(this) as HTMLElement;
  }

  componentWillUnmount() {
    this.reaction.forEach(fn => fn());
    this.reaction = [];
    this.syncAutoFill.cancel();
  }

  @autobind
  handleFocus(e: any) {
    const {formItem: model, autoFill} = this.props;
    model && model.focus();
    this.props.onFocus && this.props.onFocus(e);

    if (
      !autoFill ||
      (autoFill && !autoFill?.hasOwnProperty('showSuggestion'))
    ) {
      return;
    }
    this.handleAutoFill('focus');
  }

  @autobind
  handleBlur(e: any) {
    const {formItem: model} = this.props;
    model && model.blur();
    this.props.onBlur && this.props.onBlur(e);
  }

  handleAutoFill(type: string) {
    const {autoFill, onBulkChange, formItem, data} = this.props;
    const {trigger, mode} = autoFill;
    if (trigger === type && mode === 'popOver') {
      // 参照录入 popOver形式
      this.setState({
        isOpened: true
      });
    } else if (
      // 参照录入 dialog | drawer
      trigger === type &&
      (mode === 'dialog' || mode === 'drawer')
    ) {
      formItem?.openDialog(this.buildSchema(), data, result => {
        if (!result?.selectedItems) {
          return;
        }

        this.updateAutoFillData(result.selectedItems);
      });
    }
  }

  updateAutoFillData(context: any) {
    const {formStore, autoFill, onBulkChange} = this.props;
    const {fillMapping, multiple} = autoFill;
    // form原始数据
    const data = formStore?.data;
    const contextData = createObject(
      {items: !multiple ? [context] : context, ...data},
      {...context}
    );
    let responseData: any = {};
    responseData = dataMapping(fillMapping, contextData);

    if (!multiple && !fillMapping) {
      responseData = context;
    }

    onBulkChange?.(responseData);
  }

  syncAutoFill = debounce(
    (term: any, reload?: boolean) => {
      (async (term: string, reload?: boolean) => {
        const {autoFill, onBulkChange, formItem, data} = this.props;

        // 参照录入
        if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
          return;
        }
        if (autoFill?.showSuggestion) {
          this.handleAutoFill('change');
        } else {
          // 自动填充
          const itemName = formItem?.name;
          const ctx = createObject(data, {
            [itemName || '']: term
          });
          if (
            (onBulkChange &&
              isEffectiveApi(autoFill.api, ctx) &&
              this.lastSearchTerm !== term) ||
            reload
          ) {
            let result = await formItem?.loadAutoUpdateData(
              autoFill.api,
              ctx,
              !!(autoFill.api as BaseApiObject)?.silent
            );
            this.lastSearchTerm =
              (result && getVariable(result, itemName)) ?? term;

            if (autoFill?.fillMapping) {
              result = dataMapping(autoFill.fillMapping, result);
            }
            result && onBulkChange?.(result);
          }
        }
      })(term, reload).catch(e => console.error(e));
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  buildSchema() {
    const {
      render,
      autoFill,
      classPrefix: ns,
      classnames: cx,
      translate: __
    } = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }
    const {
      api,
      mode,
      size,
      offset,
      position,
      multiple,
      filter,
      columns,
      labelField,
      popOverContainer,
      popOverClassName
    } = autoFill;
    const form = {
      type: 'form',
      // debug: true,
      title: '',
      className: 'suggestion-form',
      body: {
        type: 'picker',
        embed: true,
        joinValues: false,
        label: false,
        labelField,
        multiple,
        name: 'selectedItems',
        options: [],
        required: true,
        source: api,
        pickerSchema: {
          type: 'crud',
          affixHeader: false,
          alwaysShowPagination: true,
          keepItemSelectionOnPageChange: true,
          headerToolbar: [],
          footerToolbar: [
            {
              type: 'pagination',
              align: 'left'
            },
            {
              type: 'bulkActions',
              align: 'right',
              className: 'ml-2'
            }
          ],
          multiple,
          filter,
          columns: columns || []
        }
      },
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: __('cancel')
        },
        {
          type: 'submit',
          actionType: 'submit',
          level: 'primary',
          label: __('confirm')
        }
      ]
    };
    const schema = {
      type: mode,
      className: 'auto-fill-dialog',
      title: __('FormItem.autoFillSuggest'),
      size,
      body: form,
      actions: [
        {
          type: 'button',
          actionType: 'cancel',
          label: __('cancel')
        },
        {
          type: 'submit',
          actionType: 'submit',
          level: 'primary',
          label: __('confirm')
        }
      ]
    };
    if (mode === 'popOver') {
      return (
        <Overlay
          container={popOverContainer || this.target}
          target={() => this.target}
          placement={position || 'left-bottom-left-top'}
          show
        >
          <PopOver
            classPrefix={ns}
            className={cx(`${ns}auto-fill-popOver`, popOverClassName)}
            style={{
              minWidth: this.target ? this.target.offsetWidth : undefined
            }}
            offset={offset}
            onHide={this.hanldeClose}
            overlay
          >
            {render('popOver-auto-fill-form', form, {
              onSubmit: this.hanldeSubmit
            })}
          </PopOver>
        </Overlay>
      );
    } else {
      return schema;
    }
  }

  // 参照录入popOver提交
  @autobind
  hanldeSubmit(values: any) {
    const {onBulkChange, autoFill} = this.props;
    if (!autoFill || (autoFill && !autoFill?.hasOwnProperty('api'))) {
      return;
    }

    this.updateAutoFillData(values.selectedItems);

    this.hanldeClose();
  }

  @autobind
  hanldeClose() {
    this.setState({
      isOpened: false
    });
  }

  @autobind
  async handleOpenDialog(schema: Schema, data: any) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    return new Promise(resolve =>
      model.openDialog(schema, data, (result?: any) => resolve(result))
    );
  }

  @autobind
  handleDialogConfirm([values]: Array<any>) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }

    model.closeDialog(values);
  }

  @autobind
  handleDialogClose(confirmed = false) {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }
    model.closeDialog(confirmed);
  }

  renderControl(): JSX.Element | null {
    const {
      inputClassName,
      formItem: model,
      classnames: cx,
      children,
      type,
      renderControl,
      formItemConfig,
      sizeMutable,
      size,
      defaultSize,
      useMobileUI,
      ...rest
    } = this.props;

    const mobileUI = useMobileUI && isMobile();
    if (renderControl) {
      const controlSize = size || defaultSize;
      return renderControl({
        ...rest,
        onOpenDialog: this.handleOpenDialog,

        type,
        classnames: cx,
        formItem: model,
        className: cx(
          `Form-control`,
          {
            'is-inline': !!rest.inline && !mobileUI,
            'is-error': model && !model.valid,
            [`Form-control--withSize Form-control--size${ucFirst(
              controlSize
            )}`]:
              sizeMutable !== false &&
              typeof controlSize === 'string' &&
              !!controlSize &&
              controlSize !== 'full'
          },
          model?.errClassNames,
          inputClassName
        )
      });
    }

    return null;
  }

  /**
   * 布局扩充点，可以自己扩充表单项的布局方式
   */
  static layoutRenderers: {
    [propsName: string]: (
      props: FormItemProps,
      renderControl: () => JSX.Element | null
    ) => JSX.Element;
  } = {
    horizontal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        classnames: cx,
        description,
        descriptionClassName,
        captionClassName,
        desc,
        label,
        labelClassName,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        useMobileUI,
        translate: __
      } = props;

      // 强制不渲染 label 的话
      if (renderLabel === false) {
        label = label === false ? false : '';
      }

      description = description || desc;
      const horizontal = props.horizontal || props.formHorizontal || {};
      const left = getWidthRate(horizontal.left);
      const right = getWidthRate(horizontal.right);
      const labelAlign = props.labelAlign || props.formLabelAlign;
      const labelWidth = props.labelWidth || props.formLabelWidth;

      return (
        <div
          data-role="form-item"
          className={cx(
            `Form-item Form-item--horizontal`,
            className,
            {
              'Form-item--horizontal-justify': horizontal.justify,
              [`is-error`]: model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames
          )}
        >
          {label !== false ? (
            <label
              className={cx(
                `Form-label`,
                {
                  [`Form-itemColumn--${
                    typeof horizontal.leftFixed === 'string'
                      ? horizontal.leftFixed
                      : 'normal'
                  }`]: horizontal.leftFixed,
                  [`Form-itemColumn--${left}`]: !horizontal.leftFixed,
                  'Form-label--left': labelAlign === 'left'
                },
                labelClassName
              )}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label
                  ? render(
                      'label',
                      typeof label === 'string'
                        ? filter(__(label), data)
                        : label
                    )
                  : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      useMobileUI,
                      className: cx(`Form-labelRemark`),
                      container: props.popOverContainer
                        ? props.popOverContainer
                        : env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div
            className={cx(`Form-value`, {
              // [`Form-itemColumn--offset${getWidthRate(horizontal.offset)}`]: !label && label !== false,
              [`Form-itemColumn--${right}`]:
                !horizontal.leftFixed && !!right && right !== 12 - left
            })}
          >
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  tooltip: remark,
                  className: cx(`Form-remark`),
                  useMobileUI,
                  container: props.popOverContainer
                    ? props.popOverContainer
                    : env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(`Form-description`, descriptionClassName)
                })
              : null}
          </div>
        </div>
      );
    },

    normal: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        classnames: cx,
        desc,
        description,
        label,
        labelClassName,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        useMobileUI,
        translate: __
      } = props;

      description = description || desc;

      return (
        <div
          data-role="form-item"
          className={cx(
            `Form-item Form-item--normal`,
            className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames
          )}
        >
          {label && renderLabel !== false ? (
            <label className={cx(`Form-label`, labelClassName)}>
              <span>
                {label
                  ? render(
                      'label',
                      typeof label === 'string'
                        ? filter(__(label), data)
                        : label
                    )
                  : null}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      useMobileUI,
                      container: props.popOverContainer
                        ? props.popOverContainer
                        : env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                    })
                  : null}
              </span>
            </label>
          ) : null}

          {renderControl()}

          {caption
            ? render('caption', caption, {
                className: cx(`Form-caption`, captionClassName)
              })
            : null}

          {remark
            ? render('remark', {
                type: 'remark',
                icon: remark.icon || 'warning-mark',
                className: cx(`Form-remark`),
                tooltip: remark,
                useMobileUI,
                container:
                  env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
              })
            : null}

          {hint && model && model.isFocused
            ? render('hint', hint, {
                className: cx(`Form-hint`)
              })
            : null}

          {model &&
          !model.valid &&
          showErrorMsg !== false &&
          Array.isArray(model.errors) ? (
            <ul className={cx(`Form-feedback`)}>
              {model.errors.map((msg: string, key: number) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          ) : null}

          {renderDescription !== false && description
            ? render('description', description, {
                className: cx(`Form-description`, descriptionClassName)
              })
            : null}
        </div>
      );
    },

    inline: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        classnames: cx,
        desc,
        description,
        label,
        labelClassName,
        render,
        required,
        caption,
        descriptionClassName,
        captionClassName,
        formItem: model,
        remark,
        labelRemark,
        env,
        hint,
        renderLabel,
        renderDescription,
        data,
        showErrorMsg,
        useMobileUI,
        translate: __
      } = props;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;

      return (
        <div
          data-role="form-item"
          className={cx(
            `Form-item Form-item--inline`,
            className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames
          )}
        >
          {label && renderLabel !== false ? (
            <label
              className={cx(`Form-label`, labelClassName)}
              style={labelWidth != null ? {width: labelWidth} : undefined}
            >
              <span>
                {label
                  ? render(
                      'label',
                      typeof label === 'string'
                        ? filter(__(label), data)
                        : label
                    )
                  : label}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      icon: labelRemark.icon || 'warning-mark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      useMobileUI,
                      container: props.popOverContainer
                        ? props.popOverContainer
                        : env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                    })
                  : null}
              </span>
            </label>
          ) : null}

          <div className={cx(`Form-value`)}>
            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  useMobileUI,
                  container: props.popOverContainer
                    ? props.popOverContainer
                    : env && env.getModalContainer
                    ? env.getModalContainer
                    : undefined
                })
              : null}

            {hint && model && model.isFocused
              ? render('hint', hint, {
                  className: cx(`Form-hint`)
                })
              : null}

            {model &&
            !model.valid &&
            showErrorMsg !== false &&
            Array.isArray(model.errors) ? (
              <ul className={cx(`Form-feedback`)}>
                {model.errors.map((msg: string, key: number) => (
                  <li key={key}>{msg}</li>
                ))}
              </ul>
            ) : null}

            {renderDescription !== false && description
              ? render('description', description, {
                  className: cx(`Form-description`, descriptionClassName)
                })
              : null}
          </div>
        </div>
      );
    },

    row: (props: FormItemProps, renderControl: () => JSX.Element) => {
      let {
        className,
        classnames: cx,
        desc,
        description,
        label,
        labelClassName,
        render,
        required,
        caption,
        remark,
        labelRemark,
        env,
        descriptionClassName,
        captionClassName,
        formItem: model,
        renderLabel,
        renderDescription,
        hint,
        data,
        showErrorMsg,
        useMobileUI,
        translate: __
      } = props;
      const labelWidth = props.labelWidth || props.formLabelWidth;
      description = description || desc;

      return (
        <div
          data-role="form-item"
          className={cx(
            `Form-item Form-item--row`,
            className,
            {
              'is-error': model && !model.valid,
              [`is-required`]: required
            },
            model?.errClassNames
          )}
        >
          <div className={cx('Form-rowInner')}>
            {label && renderLabel !== false ? (
              <label
                className={cx(`Form-label`, labelClassName)}
                style={labelWidth != null ? {width: labelWidth} : undefined}
              >
                <span>
                  {render(
                    'label',
                    typeof label === 'string' ? filter(__(label), data) : label
                  )}
                  {required && (label || labelRemark) ? (
                    <span className={cx(`Form-star`)}>*</span>
                  ) : null}
                  {labelRemark
                    ? render('label-remark', {
                        type: 'remark',
                        icon: labelRemark.icon || 'warning-mark',
                        tooltip: labelRemark,
                        className: cx(`Form-lableRemark`),
                        useMobileUI,
                        container: props.popOverContainer
                          ? props.popOverContainer
                          : env && env.getModalContainer
                          ? env.getModalContainer
                          : undefined
                      })
                    : null}
                </span>
              </label>
            ) : null}

            {renderControl()}

            {caption
              ? render('caption', caption, {
                  className: cx(`Form-caption`, captionClassName)
                })
              : null}

            {remark
              ? render('remark', {
                  type: 'remark',
                  icon: remark.icon || 'warning-mark',
                  className: cx(`Form-remark`),
                  tooltip: remark,
                  container:
                    env && env.getModalContainer
                      ? env.getModalContainer
                      : undefined
                })
              : null}
          </div>

          {hint && model && model.isFocused
            ? render('hint', hint, {
                className: cx(`Form-hint`)
              })
            : null}

          {model &&
          !model.valid &&
          showErrorMsg !== false &&
          Array.isArray(model.errors) ? (
            <ul className={cx('Form-feedback')}>
              {model.errors.map((msg: string, key: number) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          ) : null}

          {description && renderDescription !== false
            ? render('description', description, {
                className: cx(`Form-description`, descriptionClassName)
              })
            : null}
        </div>
      );
    }
  };

  render() {
    const {formMode, inputOnly, wrap, render, formItem: model} = this.props;
    const mode = this.props.mode || formMode;

    if (wrap === false || inputOnly) {
      return this.renderControl();
    }

    const renderLayout =
      FormItemWrap.layoutRenderers[mode] ||
      FormItemWrap.layoutRenderers['normal'];

    return (
      <>
        {renderLayout(this.props, this.renderControl.bind(this))}

        {model
          ? render(
              'modal',
              {
                type: 'dialog',
                ...model.dialogSchema
              },
              {
                show: model.dialogOpen,
                onClose: this.handleDialogClose,
                onConfirm: this.handleDialogConfirm,
                data: model.dialogData,
                formStore: undefined
              }
            )
          : null}
      </>
    );
  }
}

// 白名单形式，只有这些属性发生变化，才会往下更新。
// 除非配置  strictMode
export const detectProps = [
  'formPristine', // 这个千万不能干掉。
  'formInited',
  'addable',
  'addButtonClassName',
  'addButtonText',
  'addOn',
  'btnClassName',
  'btnLabel',
  'btnDisabled',
  'className',
  'clearable',
  'columns',
  'columnsCount',
  'controls',
  'desc',
  'description',
  'disabled',
  'draggable',
  'editable',
  'editButtonClassName',
  'formHorizontal',
  'formMode',
  'hideRoot',
  'horizontal',
  'icon',
  'inline',
  'inputClassName',
  'label',
  'labelClassName',
  'labelField',
  'language',
  'level',
  'max',
  'maxRows',
  'min',
  'minRows',
  'multiLine',
  'multiple',
  'option',
  'placeholder',
  'removable',
  'required',
  'remark',
  'hint',
  'rows',
  'searchable',
  'showCompressOptions',
  'size',
  'step',
  'showInput',
  'unit',
  'value',
  'diffValue',
  'borderMode',
  'items',
  'showCounter',
  'minLength',
  'maxLength',
  'embed',
  'displayMode',
  'revealPassword'
];

export function asFormItem(config: Omit<FormItemConfig, 'component'>) {
  return (Control: FormControlComponent) => {
    const isSFC = !(Control.prototype instanceof React.Component);

    // 兼容老的 FormItem 用法。
    if (config.validate && !Control.prototype.validate) {
      const fn = config.validate;
      Control.prototype.validate = function () {
        const host = {
          input: this
        };

        return fn.apply(host, arguments);
      };
    } else if (config.validate) {
      console.error(
        'FormItem配置中的 validate 将不起作用，因为类的成员函数中已经定义了 validate 方法，将优先使用类里面的实现。'
      );
    }

    if (config.storeType) {
      Control = HocStoreFactory({
        storeType: config.storeType,
        extendsData: config.extendsData
      })(observer(Control));
      delete config.storeType;
    }

    return wrapControl(
      hoistNonReactStatic(
        class extends FormItemWrap {
          static defaultProps = {
            className: '',
            renderLabel: config.renderLabel,
            renderDescription: config.renderDescription,
            sizeMutable: config.sizeMutable,
            wrap: config.wrap,
            showErrorMsg: config.showErrorMsg,
            ...Control.defaultProps
          };
          static propsList: any = [
            'value',
            'defaultValue',
            'onChange',
            'setPrinstineValue',
            'readOnly',
            'strictMode',
            ...((Control as any).propsList || [])
          ];

          static displayName = `FormItem${
            config.type ? `(${config.type})` : ''
          }`;
          static ComposedComponent = Control;

          ref: any;

          constructor(props: FormItemProps) {
            super(props);
            this.refFn = this.refFn.bind(this);

            const {validations, formItem: model} = props;

            // 组件注册的时候可能默认指定验证器类型
            if (model && !validations && config.validations) {
              model.config({
                rules: config.validations
              });
            }
          }

          shouldComponentUpdate(nextProps: FormControlProps) {
            if (
              config.shouldComponentUpdate?.(this.props, nextProps) ||
              nextProps.strictMode === false ||
              config.strictMode === false
            ) {
              return true;
            }

            // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
            if (
              anyChanged(
                detectProps.concat(config.detectProps || []),
                this.props,
                nextProps
              )
            ) {
              return true;
            }

            return false;
          }

          getWrappedInstance() {
            return this.ref;
          }

          refFn(ref: any) {
            this.ref = ref;
          }

          renderControl() {
            const {
              inputClassName,
              formItem: model,
              classnames: cx,
              children,
              type,
              size,
              defaultSize,
              useMobileUI,
              ...rest
            } = this.props;

            const controlSize = size || defaultSize;
            const mobileUI = useMobileUI && isMobile();
            //@ts-ignore
            const isOpened = this.state.isOpened;
            return (
              <>
                <Control
                  {...rest}
                  useMobileUI={useMobileUI}
                  onOpenDialog={this.handleOpenDialog}
                  size={config.sizeMutable !== false ? undefined : size}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                  type={type}
                  classnames={cx}
                  ref={isSFC ? undefined : this.refFn}
                  forwardedRef={isSFC ? this.refFn : undefined}
                  formItem={model}
                  className={cx(
                    `Form-control`,
                    {
                      'is-inline': !!rest.inline && !mobileUI,
                      'is-error': model && !model.valid,
                      [`Form-control--withSize Form-control--size${ucFirst(
                        controlSize
                      )}`]:
                        config.sizeMutable !== false &&
                        typeof controlSize === 'string' &&
                        !!controlSize &&
                        controlSize !== 'full'
                    },
                    model?.errClassNames,
                    inputClassName
                  )}
                ></Control>
                {isOpened ? this.buildSchema() : null}
              </>
            );
          }
        },
        Control
      ) as any
    );
  };
}

export function registerFormItem(config: FormItemConfig): RendererConfig {
  let Control = asFormItem(config)(config.component);

  return registerRenderer({
    ...config,
    weight: typeof config.weight !== 'undefined' ? config.weight : -100, // 优先级高点
    component: Control as any,
    isFormItem: true
  });
}

export function FormItem(config: FormItemBasicConfig) {
  return function (component: FormControlComponent): any {
    const renderer = registerFormItem({
      ...config,
      component
    });

    return renderer.component as any;
  };
}

export function getFormItemByName(name: string) {
  return renderersMap[name];
}

export default FormItem;
