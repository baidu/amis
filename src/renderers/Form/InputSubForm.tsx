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
}

export interface SubFormProps extends FormControlProps {
  placeholder?: string;
  multiple?: boolean;
  minLength?: number;
  maxLength?: number;
  labelField?: string;
}

export interface SubFormState {
  openedIndex: number;
  optionIndex: number;
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

  state: SubFormState = {
    openedIndex: -1,
    optionIndex: -1
  };
  constructor(props: SubFormProps) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
  }

  addItem() {
    let value = this.props.value;

    if (!Array.isArray(value)) {
      value = [];
    } else {
      value = value.concat();
    }

    value.push({});
    this.props.onChange(value);
    this.open(value.length - 1);
  }

  removeItem(key: number, e: React.UIEvent<any>) {
    e.stopPropagation();
    e.preventDefault();

    let value = this.props.value;

    if (!Array.isArray(value)) {
      return;
    }

    value = value.concat();
    value.splice(key, 1);
    this.props.onChange(value);
  }

  open(index: number = 0) {
    this.setState({
      openedIndex: index
    });
  }

  close() {
    this.setState({
      openedIndex: -1
    });
  }

  handleDialogConfirm(values: Array<object>) {
    const {multiple, onChange, value} = this.props;

    if (multiple) {
      let newValue = Array.isArray(value) ? value.concat() : [];
      newValue[this.state.openedIndex] = {
        ...newValue[this.state.openedIndex],
        ...values[0]
      };
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
                <span
                  className={cx('SubForm-valueLabel')}
                  onClick={this.open.bind(this, key)}
                >
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
                </span>
                {!disabled ? (
                  <a data-index={key} onClick={this.removeItem.bind(this, key)}>
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
            disabled={disabled}
            data-tooltip={__('Combo.add')}
          >
            <Icon icon="plus" className="icon" />
            <span>{__('Combo.add')}</span>
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
          onClick={this.open.bind(this, 0)}
          data-tooltip={__('SubForm.editDetail')}
          data-position="bottom"
        >
          <span className={`${ns}SubForm-valueLabel`}>
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
          </span>
        </div>
      </div>
    );
  }

  render() {
    const {
      multiple,
      classPrefix: ns,
      className,
      render,
      value,
      data
    } = this.props;
    const openedIndex = this.state.openedIndex;

    return (
      <div className={cx(`${ns}SubFormControl`, className)}>
        {multiple ? this.renderMultipe() : this.renderSingle()}
        {render(`dalog/${openedIndex}`, this.buildDialogSchema(), {
          show: openedIndex !== -1,
          onClose: this.close,
          onConfirm: this.handleDialogConfirm,
          data: createObject(
            data,
            (multiple ? Array.isArray(value) && value[openedIndex] : value) ||
              {}
          )
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
