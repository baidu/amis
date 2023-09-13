import React from 'react';
import inRange from 'lodash/inRange';
import {
  OptionsControl,
  createObject,
  autobind,
  hasAbility,
  columnsSplit,
  flattenTreeWithLeafNodes
} from 'amis-core';
import type {ActionObject, Api, OptionsControlProps, Option} from 'amis-core';
import {Checkbox, Icon} from 'amis-ui';
import {FormOptionsSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * 复选框
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/checkboxes
 */
export interface CheckboxesControlSchema extends FormOptionsSchema {
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
   * 全选/不选文案
   */
  checkAllText?: string;
  /**
   * 每行显示多少个
   */
  columnsCount?: number | number[];

  /**
   * 自定义选项展示
   */
  menuTpl?: string;
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
  menuTpl?: string;
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

  doAction(action: ActionObject, data: object, throwErrors: boolean) {
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

  componentWillUnmount() {
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

    const children = option.children.map((option, index) =>
      this.renderItem(option, index)
    );

    const body = this.columnsSplit(children);

    return (
      <div
        key={'group-' + index}
        className={cx('CheckboxesControl-group', option.className)}
      >
        <label
          className={cx('CheckboxesControl-groupLabel', option.labelClassName)}
        >
          {option[labelField || 'label']}
        </label>

        {body}
      </div>
    );
  }

  renderItem(option: Option, index: number) {
    if (option.children) {
      return this.renderGroup(option, index);
    }

    const {
      render,
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
      optionType,
      menuTpl,
      data
    } = this.props;
    const labelText = String(option[labelField || 'label']);
    const optionLabelClassName = option['labelClassName'];

    return (
      <Checkbox
        className={itemClassName}
        key={index}
        onChange={() => onToggle(option)}
        checked={!!~selectedOptions.indexOf(option)}
        disabled={disabled || option.disabled}
        inline={inline}
        labelClassName={optionLabelClassName || labelClassName}
        description={option.description}
        optionType={optionType}
      >
        {menuTpl
          ? render(`checkboxes/${index}`, menuTpl, {
              data: createObject(data, option)
            })
          : labelText}
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

  columnsSplit(body: React.ReactNode[]) {
    const {columnsCount, classnames: cx} = this.props;

    const result: Array<any> = [];
    let tmp: Array<React.ReactPortal> = [];
    body.forEach((node: React.ReactPortal) => {
      // 如果有分组，组内单独分列
      if (node && node.key && String(node.key).startsWith('group')) {
        // 夹杂在分组间的无分组选项，分别成块
        if (tmp.length) {
          result.push(columnsSplit(tmp, cx, columnsCount));
          tmp = [];
        }

        result.push(node);
      } else {
        tmp.push(node);
      }
    });
    // 收尾
    tmp.length && result.push(columnsSplit(tmp, cx, columnsCount));

    return result;
  }

  @supportStatic()
  render() {
    const {
      className,
      style,
      disabled,
      placeholder,
      options,
      inline,
      columnsCount,
      selectedOptions,
      onToggle,
      onToggleAll,
      checkAll,
      checkAllText,
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
          partial={inRange(
            selectedOptions.length,
            0,
            flattenTreeWithLeafNodes(options).length
          )}
          disabled={disabled}
          inline={inline}
          labelClassName={labelClassName}
        >
          {checkAllText ?? __('Checkboxes.selectAll')}
        </Checkbox>
      );
    }

    body = this.columnsSplit(body);

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
