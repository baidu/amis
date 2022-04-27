import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import cx from 'classnames';
import Checkbox from '../../components/Checkbox';

import {Icon} from '../../components/icons';
import {Action, Api} from '../../types';
import {autobind, hasAbility} from '../../utils/helper';
import {columnsSplit} from '../../utils/columnsSplit';

/**
 * 复选框
 * 文档：https://baidu.gitee.io/amis/docs/components/form/checkboxes
 */
export interface CheckboxesControlSchema extends FormOptionsControl {
  type: 'checkboxes';

  /**
   * 是否开启全选功能
   */
  checkAll?: boolean;

  /**
   * 是否默认全选
   */
  defaultCheckAll?: boolean;

  /**
   * 每行显示多少个
   */
  columnsCount?: number | number[];
}

export interface CheckboxesProps
  extends OptionsControlProps,
    Omit<
      CheckboxesControlSchema,
      | 'options'
      | 'type'
      | 'className'
      | 'descriptionClassName'
      | 'inputClassName'
    > {
  placeholder?: any;
  itemClassName?: string;
  columnsCount?: number | number[];
  labelClassName?: string;
  onAdd?: () => void;
  addApi?: Api;
  creatable: boolean;
  createBtnLabel: string;
  editable?: boolean;
  removable?: boolean;
  optionType?: 'default' | 'button';
}

export default class CheckboxesControl extends React.Component<
  CheckboxesProps,
  any
> {
  static defaultProps = {
    columnsCount: 1,
    multiple: true,
    placeholder: 'placeholder.noOption',
    creatable: false,
    inline: true,
    createBtnLabel: 'Select.createLabel',
    optionType: 'default'
  };

  doAction(action: Action, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  reload() {
    const reload = this.props.reloadOptions;
    reload && reload();
  }

  @autobind
  handleAddClick() {
    const {onAdd} = this.props;
    onAdd && onAdd();
  }

  @autobind
  handleEditClick(e: Event, item: any) {
    const {onEdit} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onEdit && onEdit(item);
  }

  @autobind
  handleDeleteClick(e: Event, item: any) {
    const {onDelete} = this.props;
    e.preventDefault();
    e.stopPropagation();
    onDelete && onDelete(item);
  }

  componentDidMount() {
    this.updateBorderStyle();
    window.addEventListener('resize', this.updateBorderStyle);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.updateBorderStyle);
  }

  @autobind
  updateBorderStyle() {
    if (this.props.optionType !== 'button') {
      return;
    }
    const wrapDom = this.refs.checkboxRef as HTMLElement;
    const wrapWidth = wrapDom.clientWidth;
    const childs = Array.from(wrapDom.children) as HTMLElement[];

    childs.forEach(child => {
      child.style.borderRadius = '0';
      child.style.borderLeftWidth = '1px';
      child.style.borderTopWidth = '1px';
    });
    const childTotalWidth = childs.reduce(
      (pre, next) => pre + next.clientWidth,
      0
    );
    if (childTotalWidth <= wrapWidth) {
      if (childs.length === 1) {
        childs[0].style.borderRadius = '4px';
      } else {
        childs[0].style.borderRadius = '4px 0 0 4px';
        childs[childs.length - 1].style.borderRadius = '0 4px 4px 0';
        childs.forEach((child, idx) => {
          idx !== 0 && (child.style.borderLeftWidth = '0');
        });
      }
    } else {
      let curRowWidth = 0;
      let curRow = 0;
      const rowNum = Math.floor(childTotalWidth / wrapWidth);
      const rowColArr: any[] = [];
      for (let i = 0; i <= rowNum; i++) {
        const arr: HTMLElement[] = [];
        rowColArr[i] = arr;
      }
      childs.forEach((child: HTMLElement, idx: number) => {
        curRowWidth += child.clientWidth;
        if (curRowWidth > wrapWidth) {
          curRowWidth = child.clientWidth;
          curRow++;
        }
        if (curRow > rowNum) {
          return;
        }
        rowColArr[curRow].push(child);
      });

      rowColArr.forEach((row: HTMLElement[], rowIdx: number) => {
        if (rowIdx === 0) {
          row.forEach((r: HTMLElement, colIdx: number) => {
            r.style.borderRadius = '0';
            colIdx !== 0 && (r.style.borderLeftWidth = '0');
            row.length > rowColArr[rowIdx + 1].length &&
              (row[row.length - 1].style.borderBottomRightRadius = '4px');
          });
          row[0].style.borderTopLeftRadius = '4px';
          row[row.length - 1].style.borderTopRightRadius = '4px';
        } else if (rowIdx === rowNum) {
          row.forEach((r: HTMLElement, colIdx: number) => {
            r.style.borderRadius = '0';
            colIdx !== 0 && (r.style.borderLeftWidth = '0');
            r.style.borderTopWidth = '0';
            row[0].style.borderBottomLeftRadius = '4px';
            row[row.length - 1].style.borderBottomRightRadius = '4px';
          });
        } else {
          row.forEach((r: HTMLElement, colIdx: number) => {
            r.style.borderRadius = '0';
            colIdx !== 0 && (r.style.borderLeftWidth = '0');
            r.style.borderTopWidth = '0';
            row.length > rowColArr[rowIdx + 1].length &&
              (row[row.length - 1].style.borderBottomRightRadius = '4px');
          });
        }
      });
    }
  }

  renderGroup(option: Option, index: number) {
    const {classnames: cx, labelField} = this.props;

    if (!option.children?.length) {
      return null;
    }

    return (
      <div
        key={index}
        className={cx('CheckboxesControl-group', option.className)}
      >
        <label
          className={cx('CheckboxesControl-groupLabel', option.labelClassName)}
        >
          {option[labelField || 'label']}
        </label>

        {option.children.map((option, index) => this.renderItem(option, index))}
      </div>
    );
  }

  renderItem(option: Option, index: number) {
    if (option.children) {
      return this.renderGroup(option, index);
    }

    const {
      itemClassName,
      onToggle,
      selectedOptions,
      disabled,
      inline,
      labelClassName,
      labelField,
      removable,
      editable,
      translate: __,
      optionType
    } = this.props;

    return (
      <Checkbox
        className={itemClassName}
        key={index}
        onChange={() => onToggle(option)}
        checked={!!~selectedOptions.indexOf(option)}
        disabled={disabled || option.disabled}
        inline={inline}
        labelClassName={labelClassName}
        description={option.description}
        optionType={optionType}
      >
        {String(option[labelField || 'label'])}
        {removable && hasAbility(option, 'removable') ? (
          <a data-tooltip={__('Select.clear')} data-position="left">
            <Icon
              icon="minus"
              className="icon"
              onClick={(e: any) => this.handleDeleteClick(e, option)}
            />
          </a>
        ) : null}
        {editable && hasAbility(option, 'editable') ? (
          <a data-tooltip="编辑" data-position="left">
            <Icon
              icon="pencil"
              className="icon"
              onClick={(e: any) => this.handleEditClick(e, option)}
            />
          </a>
        ) : null}
      </Checkbox>
    );
  }

  render() {
    const {
      className,
      disabled,
      placeholder,
      options,
      inline,
      columnsCount,
      selectedOptions,
      onToggle,
      onToggleAll,
      checkAll,
      classnames: cx,
      itemClassName,
      labelClassName,
      creatable,
      addApi,
      createBtnLabel,
      translate: __,
      optionType
    } = this.props;

    let body: Array<React.ReactNode> = [];

    if (options && options.length) {
      body = options.map((option, key) => this.renderItem(option, key));
    }

    if (checkAll && body.length && optionType === 'default') {
      body.unshift(
        <Checkbox
          key="checkall"
          className={itemClassName}
          onChange={onToggleAll}
          checked={!!selectedOptions.length}
          partial={
            !!(
              selectedOptions.length &&
              selectedOptions.length !== options.length
            )
          }
          disabled={disabled}
          inline={inline}
          labelClassName={labelClassName}
        >
          {__('Checkboxes.selectAll')}
        </Checkbox>
      );
    }

    body = columnsSplit(body, cx, columnsCount);

    return (
      <div className={cx(`CheckboxesControl`, className)} ref="checkboxRef">
        {body && body.length ? (
          body
        ) : (
          <span className={`Form-placeholder`}>{__(placeholder)}</span>
        )}

        {(creatable || addApi) && !disabled ? (
          <a className={cx('Checkboxes-addBtn')} onClick={this.handleAddClick}>
            <Icon icon="plus" className="icon" />
            {__(createBtnLabel)}
          </a>
        ) : null}
      </div>
    );
  }
}

@OptionsControl({
  type: 'checkboxes',
  sizeMutable: false
})
export class CheckboxesControlRenderer extends CheckboxesControl {}
