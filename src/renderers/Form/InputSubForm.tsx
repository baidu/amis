import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {createObject} from '../../utils/helper';
import {Icon} from '../../components/icons';
import {SchemaClassName} from '../../Schema';
import {FormSchema} from '.';

/**
 * SubForm 子表单
 * 文档：https://baidu.gitee.io/amis/docs/components/form/subform
 */
export interface SubFormControlSchema extends FormBaseControl {
  /**
   * 指定为 SubForm 子表单
   */
  type: 'input-sub-form';

  /**
   * 占位符
   */
  placeholder?: string;

  /**
   * 是否多选
   */
  multiple?: boolean;

  /**
   * 最少个数
   */
  minLength?: number;

  /**
   * 最多个数
   */
  maxLength?: number;

  /**
   * 当值中存在这个字段，则按钮名称将使用此字段的值来展示。
   */
  labelField?: string;

  /**
   * 按钮默认名称
   * @default 设置
   */
  btnLabel?: string;

  /**
   * 新增按钮 CSS 类名
   */
  addButtonClassName?: SchemaClassName;

  /**
   * 修改按钮 CSS 类名
   */
  editButtonClassName?: SchemaClassName;

  /**
   * 子表单详情
   */
  form?: Omit<FormSchema, 'type'>;

  scaffold?: any;
}

export interface SubFormProps extends FormControlProps {
  placeholder?: string;
  multiple?: boolean;
  minLength?: number;
  maxLength?: number;
  labelField?: string;
}

export interface SubFormState {
  dialogData?: any;
  dialogCtx?: {
    mode?: 'add' | 'edit';
    index?: number;
  };
}

let dom: HTMLElement;
const stripTag = (value: string) => {
  if (!value) {
    return value;
  }
  dom = dom || document.createElement('div');
  dom.innerHTML = value;
  return dom.innerText;
};

export default class SubFormControl extends React.PureComponent<
  SubFormProps,
  SubFormState
> {
  static defaultProps: Partial<SubFormProps> = {
    minLength: 0,
    maxLength: 0,
    multiple: false,
    btnClassName: '',
    addButtonClassName: '',
    editButtonClassName: '',
    labelField: 'label',
    btnLabel: 'SubForm.button',
    placeholder: 'placeholder.empty'
  };

  state: SubFormState = {};
  constructor(props: SubFormProps) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.editSingle = this.editSingle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
  }

  addItem() {
    this.setState({
      dialogData: createObject(this.props.data, this.props.scaffold || {}),
      dialogCtx: {
        mode: 'add'
      }
    });
  }

  removeItem(e: React.UIEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
    const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);

    let value = this.props.value;

    if (!Array.isArray(value)) {
      return;
    }

    value = value.concat();
    value.splice(index, 1);
    this.props.onChange(value);
  }

  editSingle() {
    const {value} = this.props;

    if (value) {
      this.setState({
        dialogData: createObject(this.props.data, this.props.value),
        dialogCtx: {
          mode: 'edit'
        }
      });
    } else {
      this.addItem();
    }
  }

  open(e: React.UIEvent<any>) {
    const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
    const value = this.props.value;
    if (!Array.isArray(value) || !value[index]) {
      return;
    }

    this.setState({
      dialogData: createObject(this.props.data, value[index]),
      dialogCtx: {
        mode: 'edit',
        index
      }
    });
  }

  close() {
    this.setState({
      dialogData: undefined,
      dialogCtx: undefined
    });
  }

  handleDialogConfirm(values: Array<object>) {
    const {multiple, onChange, value} = this.props;
    const ctx = this.state.dialogCtx;

    if (multiple) {
      let newValue = Array.isArray(value) ? value.concat() : [];

      if (ctx?.mode === 'add') {
        newValue.push({
          ...values[0]
        });
      } else {
        newValue[ctx!.index!] = {
          ...newValue[ctx!.index!],
          ...values[0]
        };
      }
      onChange(newValue);
    } else {
      onChange({
        ...value,
        ...values[0]
      });
    }

    this.close();
  }

  buildDialogSchema() {
    let {form} = this.props;

    const dialogProps = [
      'title',
      'actions',
      'name',
      'size',
      'closeOnEsc',
      'closeOnOutside',
      'showCloseButton',
      'bodyClassName',
      'type'
    ];

    return {
      ...pick(form, dialogProps),
      type: 'dialog',
      body: {
        type: 'form',
        ...omit(form, dialogProps)
      }
    };
  }

  renderMultipe() {
    const {
      addButtonClassName,
      editButtonClassName,
      disabled,
      maxLength,
      labelField,
      value,
      btnLabel,
      render,
      data,
      translate: __,
      classnames: cx,
      placeholder
    } = this.props;

    return (
      <>
        {Array.isArray(value) && value.length ? (
          <div className={cx('SubForm-values')} key="values">
            {value.map((value: any, key) => (
              <div
                className={cx(
                  `SubForm-value`,
                  {
                    'is-disabled': disabled
                  },
                  editButtonClassName
                )}
                key={key}
              >
                <a
                  className={cx('SubForm-valueLabel')}
                  data-index={key}
                  onClick={this.open}
                >
                  <Icon icon="setting" className="icon" />

                  {(value &&
                    labelField &&
                    value[labelField] &&
                    stripTag(value[labelField])) ||
                    render(
                      'label',
                      {
                        type: 'tpl',
                        tpl: __(btnLabel)
                      },
                      {
                        data: createObject(data, value)
                      }
                    )}
                </a>
                {!disabled ? (
                  <a
                    data-index={key}
                    className={cx('SubForm-valueDel')}
                    onClick={this.removeItem}
                  >
                    <Icon icon="close" className="icon" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className={cx('SubForm-placeholder')} key="placeholder">
            {__(placeholder || 'placeholder.empty')}
          </div>
        )}

        <div key="toolbar" className={cx('SubForm-toolbar')}>
          <button
            type="button"
            onClick={this.addItem}
            className={cx(`Button SubForm-addBtn`, addButtonClassName)}
            disabled={
              disabled ||
              !!(maxLength && Array.isArray(value) && value.length >= maxLength)
            }
          >
            <Icon icon="plus" className="icon" />
            <span>{__('SubForm.add')}</span>
          </button>
        </div>
      </>
    );
  }

  renderSingle() {
    const {
      classPrefix: ns,
      btnClassName,
      disabled,
      value,
      labelField,
      btnLabel,
      render,
      data,
      translate: __
    } = this.props;

    return (
      <div className={`${ns}SubForm-values`} key="values">
        <div
          className={cx(
            `${ns}SubForm-value`,
            {
              'is-disabled': disabled
            },
            btnClassName
          )}
          onClick={this.editSingle}
          data-tooltip={__('SubForm.editDetail')}
          data-position="bottom"
        >
          <a className={`${ns}SubForm-valueLabel`}>
            <Icon icon="setting" className="icon" />

            {(value &&
              labelField &&
              value[labelField] &&
              stripTag(value[labelField])) ||
              render(
                'label',
                {
                  type: 'tpl',
                  tpl: __(btnLabel)
                },
                {
                  data: createObject(data, value)
                }
              )}
          </a>
        </div>
      </div>
    );
  }

  render() {
    const {multiple, classPrefix: ns, className, render} = this.props;
    const dialogData = this.state.dialogData;
    const dialogCtx = this.state.dialogCtx;

    return (
      <div className={cx(`${ns}SubFormControl`, className)}>
        {multiple ? this.renderMultipe() : this.renderSingle()}
        {render(`modal`, this.buildDialogSchema(), {
          show: !!dialogCtx,
          onClose: this.close,
          onConfirm: this.handleDialogConfirm,
          data: dialogData
        })}
      </div>
    );
  }
}

@FormItem({
  type: 'input-sub-form',
  sizeMutable: false
})
export class SubFormControlRenderer extends SubFormControl {}
