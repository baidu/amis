import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {IFormItemStore, IFormStore} from '../../store/form';
import {reaction} from 'mobx';

import {
  RendererProps,
  registerRenderer,
  TestFunc,
  RendererConfig,
  HocStoreFactory
} from '../../factory';
import {anyChanged, ucFirst, getWidthRate, autobind} from '../../utils/helper';
import {observer} from 'mobx-react';
import {FormHorizontal, FormSchema} from '.';
import {Schema} from '../../types';
import {filter} from '../../utils/tpl';

export interface FormItemBasicConfig extends Partial<RendererConfig> {
  type?: string;
  wrap?: boolean;
  renderLabel?: boolean;
  renderDescription?: boolean;
  test?: RegExp | TestFunc;
  storeType?: string;
  validations?: string;
  strictMode?: boolean;
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
  defaultSize?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  btnDisabled: boolean;
  defaultValue: any;
  value: any;
  prinstine: any;
  setPrinstineValue: (value: any) => void;
  onChange: (
    value: any,
    submitOnChange?: boolean,
    changeImmediately?: boolean
  ) => void;
  onBulkChange: (
    values: {[propName: string]: any},
    submitOnChange?: boolean
  ) => void;
  addHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => () => void;
  removeHook: (fn: Function, mode?: 'validate' | 'init' | 'flush') => void;
  renderFormItems: (
    schema: FormSchema,
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
  reaction: any;

  componentWillMount() {
    const {formItem: model} = this.props;

    if (model) {
      this.reaction = reaction(
        () => `${model.errors.join('')}${model.isFocused}${model.dialogOpen}`,
        () => this.forceUpdate()
      );
    }
  }

  componentWillUnmount() {
    this.reaction && this.reaction();
  }

  @autobind
  handleFocus(e: any) {
    const {formItem: model} = this.props;
    model && model.focus();
    this.props.onFocus && this.props.onFocus(e);
  }

  @autobind
  handleBlur(e: any) {
    const {formItem: model} = this.props;
    model && model.blur();
    this.props.onBlur && this.props.onBlur(e);
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
  handleDialogClose() {
    const {formItem: model} = this.props;
    if (!model) {
      return;
    }
    model.closeDialog();
  }

  renderControl() {
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
      ...rest
    } = this.props;

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
            'is-inline': !!rest.inline,
            'is-error': model && !model.valid,
            [`Form-control--withSize Form-control--size${ucFirst(
              controlSize
            )}`]:
              sizeMutable !== false &&
              typeof controlSize === 'string' &&
              !!controlSize &&
              controlSize !== 'full'
          },
          inputClassName
        )
      });
    }

    return null;
  }

  renderHorizontal() {
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
      showErrorMsg
    } = this.props;

    // 强制不渲染 label 的话
    if (renderLabel === false) {
      label = label === false ? false : '';
    }

    description = description || desc;
    const horizontal = this.props.horizontal || this.props.formHorizontal;
    const left = getWidthRate(horizontal.left);
    const right = getWidthRate(horizontal.right);

    return (
      <div
        className={cx(`Form-item Form-item--horizontal`, className, {
          [`is-error`]: model && !model.valid,
          [`is-required`]: required
        })}
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
                [`Form-itemColumn--${left}`]: !horizontal.leftFixed
              },
              labelClassName
            )}
          >
            <span>
              {filter(label, data)}
              {required && (label || labelRemark) ? (
                <span className={cx(`Form-star`)}>*</span>
              ) : null}
              {labelRemark
                ? render('label-remark', {
                    type: 'remark',
                    tooltip: labelRemark,
                    className: cx(`Form-labelRemark`),
                    container:
                      env && env.getModalContainer
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
            [`Form-itemColumn--${right}`]: !!right && right !== 12 - left
          })}
        >
          {this.renderControl()}

          {caption
            ? render('caption', caption, {
                className: cx(`Form-caption`, captionClassName)
              })
            : null}

          {remark
            ? render('remark', {
                type: 'remark',
                tooltip: remark,
                className: cx(`Form-remark`),
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

          {model && !model.valid && showErrorMsg !== false ? (
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
  }

  renderNormal() {
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
      formMode,
      data,
      showErrorMsg
    } = this.props;

    description = description || desc;

    return (
      <div
        className={cx(`Form-item Form-item--${formMode}`, className, {
          'is-error': model && !model.valid,
          [`is-required`]: required
        })}
      >
        {label && renderLabel !== false ? (
          <label className={cx(`Form-label`, labelClassName)}>
            <span>
              {filter(label, data)}
              {required && (label || labelRemark) ? (
                <span className={cx(`Form-star`)}>*</span>
              ) : null}
              {labelRemark
                ? render('label-remark', {
                    type: 'remark',
                    tooltip: labelRemark,
                    className: cx(`Form-lableRemark`),
                    container:
                      env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                  })
                : null}
            </span>
          </label>
        ) : null}

        {this.renderControl()}

        {caption
          ? render('caption', caption, {
              className: cx(`Form-caption`, captionClassName)
            })
          : null}

        {remark
          ? render('remark', {
              type: 'remark',
              className: cx(`Form-remark`),
              tooltip: remark,
              container:
                env && env.getModalContainer ? env.getModalContainer : undefined
            })
          : null}

        {hint && model && model.isFocused
          ? render('hint', hint, {
              className: cx(`Form-hint`)
            })
          : null}

        {model && !model.valid && showErrorMsg !== false ? (
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
  }

  renderInline() {
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
      showErrorMsg
    } = this.props;

    description = description || desc;

    return (
      <div
        className={cx(`Form-item Form-item--inline`, className, {
          'is-error': model && !model.valid,
          [`is-required`]: required
        })}
      >
        {label && renderLabel !== false ? (
          <label className={cx(`Form-label`, labelClassName)}>
            <span>
              {filter(label, data)}
              {required && (label || labelRemark) ? (
                <span className={cx(`Form-star`)}>*</span>
              ) : null}
              {labelRemark
                ? render('label-remark', {
                    type: 'remark',
                    tooltip: labelRemark,
                    className: cx(`Form-lableRemark`),
                    container:
                      env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                  })
                : null}
            </span>
          </label>
        ) : null}

        <div className={cx(`Form-value`)}>
          {this.renderControl()}

          {caption
            ? render('caption', caption, {
                className: cx(`Form-caption`, captionClassName)
              })
            : null}

          {remark
            ? render('remark', {
                type: 'remark',
                className: cx(`Form-remark`),
                tooltip: remark,
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

          {model && !model.valid && showErrorMsg !== false ? (
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
  }

  renderRow() {
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
      formMode,
      data,
      showErrorMsg
    } = this.props;

    description = description || desc;

    return (
      <div
        className={cx(`Form-item Form-item--${formMode}`, className, {
          'is-error': model && !model.valid,
          [`is-required`]: required
        })}
      >
        <div className={cx('Form-rowInner')}>
          {label && renderLabel !== false ? (
            <label className={cx(`Form-label`, labelClassName)}>
              <span>
                {filter(label, data)}
                {required && (label || labelRemark) ? (
                  <span className={cx(`Form-star`)}>*</span>
                ) : null}
                {labelRemark
                  ? render('label-remark', {
                      type: 'remark',
                      tooltip: labelRemark,
                      className: cx(`Form-lableRemark`),
                      container:
                        env && env.getModalContainer
                          ? env.getModalContainer
                          : undefined
                    })
                  : null}
              </span>
            </label>
          ) : null}

          {this.renderControl()}

          {caption
            ? render('caption', caption, {
                className: cx(`Form-caption`, captionClassName)
              })
            : null}

          {remark
            ? render('remark', {
                type: 'remark',
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

        {model && !model.valid && showErrorMsg !== false ? (
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

  render() {
    const {formMode, inputOnly, wrap, render, formItem: model} = this.props;

    if (wrap === false || inputOnly) {
      return this.renderControl();
    }

    return (
      <>
        {formMode === 'inline'
          ? this.renderInline()
          : formMode === 'horizontal'
          ? this.renderHorizontal()
          : formMode === 'row'
          ? this.renderRow()
          : this.renderNormal()}
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
                data: model.dialogData
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
  'diffValue'
];

export function asFormItem(config: Omit<FormItemConfig, 'component'>) {
  return (Control: FormControlComponent) => {
    const isSFC = !(Control.prototype instanceof React.Component);

    // 兼容老的 FormItem 用法。
    if (config.validate && !Control.prototype.validate) {
      const fn = config.validate;
      Control.prototype.validate = function () {
        // console.warn('推荐直接在类中定义，而不是 FormItem HOC 的参数中传入。');
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

    return hoistNonReactStatic(
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

        static displayName = `FormItem${config.type ? `(${config.type})` : ''}`;
        static ComposedComponent = Control;

        ref: any;

        constructor(props: FormItemProps) {
          super(props);
          this.refFn = this.refFn.bind(this);
        }

        componentWillMount() {
          const {validations, formItem: model} = this.props;

          // 组件注册的时候可能默认指定验证器类型
          if (model && !validations && config.validations) {
            model.config({
              rules: config.validations
            });
          }

          super.componentWillMount();
        }

        shouldComponentUpdate(nextProps: FormControlProps) {
          if (nextProps.strictMode === false || config.strictMode === false) {
            return true;
          }

          // 把可能会影响视图的白名单弄出来，减少重新渲染次数。
          if (anyChanged(detectProps, this.props, nextProps)) {
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
            ...rest
          } = this.props;

          const controlSize = size || defaultSize;

          return (
            <Control
              {...rest}
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
                  'is-inline': !!rest.inline,
                  'is-error': model && !model.valid,
                  [`Form-control--withSize Form-control--size${ucFirst(
                    controlSize
                  )}`]:
                    config.sizeMutable !== false &&
                    typeof controlSize === 'string' &&
                    !!controlSize &&
                    controlSize !== 'full'
                },
                inputClassName
              )}
            />
          );
        }
      },
      Control
    );
  };
}

export function registerFormItem(config: FormItemConfig): RendererConfig {
  let Control = asFormItem(config)(config.component);

  return registerRenderer({
    ...config,
    name: config.name || `${config.type}-control`,
    weight: typeof config.weight !== 'undefined' ? config.weight : -100, // 优先级高点
    test:
      config.test ||
      new RegExp(
        `(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?${config.type}$`,
        'i'
      ),
    component: Control,
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

export default FormItem;
