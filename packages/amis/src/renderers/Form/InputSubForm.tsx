import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {createObject, guid} from '../../utils/helper';
import {Icon} from '../../components/icons';
import {SchemaClassName} from '../../Schema';
import {FormSchema} from '.';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';

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
   * 是否可拖拽排序
   */
  draggable?: boolean;

  /**
   * 拖拽提示信息
   */
  draggableTip?: string;

  /**
   * 是否可新增
   */
  addable?: boolean;

  /**
   * 是否可删除
   */
  removable?: boolean;

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
   * 新增按钮文字
   */
  addButtonText?: string;

  /**
   * 新增按钮 CSS 类名
   */
  addButtonClassName?: SchemaClassName;

  /**
   * 值元素的类名
   */
  itemClassName?: SchemaClassName;

  /**
   * 值列表元素的类名
   */
  itemsClassName?: SchemaClassName;

  /**
   * 是否在左下角显示报错信息
   */
  showErrorMsg?: boolean;

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
    itemClassName: '',
    labelField: 'label',
    btnLabel: 'SubForm.button',
    placeholder: 'placeholder.empty'
  };

  static propsList: Array<string> = ['form', 'formStore'];

  state: SubFormState = {};
  dragTip?: HTMLElement;
  sortable?: Sortable;
  id: string = guid();
  constructor(props: SubFormProps) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.editSingle = this.editSingle.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
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

  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging();
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  initDragging() {
    const ns = this.props.classPrefix;
    const submitOnChange = this.props.submitOnChange;
    const dom = findDOMNode(this) as HTMLElement;
    this.sortable = new Sortable(
      dom.querySelector(`.${ns}SubForm-values`) as HTMLElement,
      {
        group: `SubForm-${this.id}`,
        animation: 150,
        handle: `.${ns}SubForm-valueDragBar`,
        ghostClass: `${ns}SubForm-value--dragging`,
        onEnd: (e: any) => {
          // 没有移动
          if (e.newIndex === e.oldIndex) {
            return;
          }

          // 换回来
          const parent = e.to as HTMLElement;
          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
          } else {
            parent.appendChild(e.item);
          }

          const value = this.props.value;
          if (!Array.isArray(value)) {
            return;
          }
          const newValue = value.concat();
          newValue.splice(e.newIndex, 0, newValue.splice(e.oldIndex, 1)[0]);
          this.props.onChange(newValue, submitOnChange, true);
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
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
      'showErrorMsg',
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
      itemClassName,
      itemsClassName,
      disabled,
      maxLength,
      labelField,
      value,
      btnLabel,
      render,
      data,
      translate: __,
      classnames: cx,
      placeholder,
      draggable,
      draggableTip,
      addable,
      removable,
      minLength,
      addButtonText
    } = this.props;

    return (
      <>
        {Array.isArray(value) && value.length ? (
          <div className={cx('SubForm-values', itemsClassName)} key="values">
            {value.map((item: any, key) => (
              <div
                className={cx(
                  `SubForm-value`,
                  {
                    'is-disabled': disabled
                  },
                  itemClassName
                )}
                key={key}
              >
                {draggable && value.length > 1 ? (
                  <a className={cx('SubForm-valueDragBar')}>
                    <Icon icon="drag-bar" className={cx('icon')} />
                  </a>
                ) : null}

                <span className={cx('SubForm-valueLabel')}>
                  {(item &&
                    labelField &&
                    item[labelField] &&
                    stripTag(item[labelField])) ||
                    render(
                      'label',
                      {
                        type: 'tpl',
                        tpl: __(btnLabel)
                      },
                      {
                        data: createObject(data, item)
                      }
                    )}
                </span>
                <a
                  data-index={key}
                  onClick={this.open}
                  className={cx('SubForm-valueEdit')}
                >
                  <Icon icon="pencil" className="icon" />
                </a>
                {!disabled &&
                removable !== false &&
                (!minLength || value.length > minLength) ? (
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
          {addable !== false ? (
            <button
              type="button"
              onClick={this.addItem}
              className={cx(`Button SubForm-addBtn`, addButtonClassName)}
              disabled={
                disabled ||
                !!(
                  maxLength &&
                  Array.isArray(value) &&
                  value.length >= maxLength
                )
              }
            >
              <Icon icon="plus" className="icon" />
              <span>{__(addButtonText || 'SubForm.add')}</span>
            </button>
          ) : null}

          {draggable && Array.isArray(value) && value.length > 1 ? (
            <span className={cx(`Combo-dragableTip`)} ref={this.dragTipRef}>
              {Array.isArray(value) && value.length > 1 ? __(draggableTip) : ''}
            </span>
          ) : null}
        </div>
      </>
    );
  }

  renderSingle() {
    const {
      classnames: cx,
      itemsClassName,
      itemClassName,
      disabled,
      value,
      labelField,
      btnLabel,
      render,
      data,
      translate: __
    } = this.props;

    return (
      <div className={cx('SubForm-values', itemsClassName)} key="values">
        <div
          className={cx(
            `SubForm-value`,
            {
              'is-disabled': disabled
            },
            itemClassName
          )}
          onClick={this.editSingle}
          data-tooltip={__('SubForm.editDetail')}
          data-position="bottom"
        >
          <span className={cx('SubForm-valueLabel')}>
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
          <a className={cx('SubForm-valueEdit')}>
            <Icon icon="pencil" className="icon" />
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
          data: dialogData,
          formStore: undefined
        })}
      </div>
    );
  }
}

@FormItem({
  type: 'input-sub-form',
  sizeMutable: false,
  strictMode: false
})
export class SubFormControlRenderer extends SubFormControl {}
