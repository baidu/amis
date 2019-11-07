import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import omit = require('lodash/omit');
import pick = require('lodash/pick');
import {createObject} from '../../utils/helper';

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
    btnLabel: '设置'
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
      classPrefix: ns,
      addButtonClassName,
      editButtonClassName,
      disabled,
      labelField,
      value,
      btnLabel,
      render,
      data
    } = this.props;

    return [
      <div className={`${ns}SubForm-values`} key="values">
        {Array.isArray(value)
          ? value.map((value: any, key) => (
              <div
                className={cx(
                  `${ns}SubForm-value`,
                  {
                    'is-disabled': disabled
                  },
                  editButtonClassName
                )}
                key={key}
              >
                <span
                  data-tooltip="删除"
                  data-position="bottom"
                  className={`${ns}Select-valueIcon`}
                  onClick={this.removeItem.bind(this, key)}
                >
                  ×
                </span>
                <span
                  onClick={this.open.bind(this, key)}
                  className={`${ns}SubForm-valueLabel`}
                  data-tooltip="编辑详情"
                  data-position="bottom"
                >
                  {(value &&
                    labelField &&
                    value[labelField] &&
                    stripTag(value[labelField])) ||
                    render(
                      'label',
                      {
                        type: 'tpl',
                        tpl: btnLabel
                      },
                      {
                        data
                      }
                    )}
                </span>
              </div>
            ))
          : null}
      </div>,
      <button
        key="add"
        type="button"
        onClick={this.addItem}
        className={cx(`${ns}Button ${ns}SubForm-addBtn`, addButtonClassName)}
        disabled={disabled}
        data-tooltip="新增一条数据"
      >
        <i className="fa fa-plus m-r-xs" />
        <span>新增</span>
      </button>
    ];
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
      data
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
          data-tooltip="编辑详情"
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
                  tpl: btnLabel
                },
                {
                  data
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
  type: 'form',
  sizeMutable: false
})
export class SubFormControlRenderer extends SubFormControl {}
