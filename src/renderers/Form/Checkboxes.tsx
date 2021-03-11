import React from 'react';
import {
  OptionsControl,
  OptionsControlProps,
  Option,
  FormOptionsControl
} from './Options';
import cx from 'classnames';
import Checkbox from '../../components/Checkbox';
import chunk from 'lodash/chunk';
import {Icon} from '../../components/icons';
import {Api} from '../../types';
import {autobind} from '../../utils/helper';

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
  columnsCount?: number;
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
  columnsCount?: number;
  labelClassName?: string;
  onAdd?: () => void;
  addApi?: Api;
  creatable: boolean;
  createBtnLabel: string;
  editable?: boolean;
  removable?: boolean;
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
    createBtnLabel: 'Select.createLabel'
  };

  componentDidMount() {
    const {defaultCheckAll, onToggleAll} = this.props;

    defaultCheckAll && onToggleAll();
  }

  componentDidUpdate(prevProps: OptionsControlProps) {
    let {options: currOptions, onToggleAll, defaultCheckAll} = this.props;
    let {options: prevOptions} = prevProps;

    if (defaultCheckAll && prevOptions != currOptions) {
      onToggleAll();
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

  renderGroup(option: Option, index: number) {
    const {classnames: cx, labelField} = this.props;

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

        {option.children && option.children.length
          ? option.children.map((option, index) =>
              this.renderItem(option, index)
            )
          : null}
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
      translate: __
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
      >
        {String(option[labelField || 'label'])}
        {removable ? (
          <a data-tooltip={__('Select.clear')} data-position="left">
            <Icon
              icon="minus"
              className="icon"
              onClick={(e: any) => this.handleDeleteClick(e, option)}
            />
          </a>
        ) : null}
        {editable ? (
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
      translate: __
    } = this.props;

    let body: Array<React.ReactNode> = [];

    if (options && options.length) {
      body = options.map((option, key) => this.renderItem(option, key));
    }

    if (checkAll && body.length) {
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
          全选/不选
        </Checkbox>
      );
    }

    if (!inline && (columnsCount as number) > 1) {
      let weight = 12 / (columnsCount as number);
      let cellClassName = `Grid-col--sm${
        weight === Math.round(weight) ? weight : ''
      }`;
      body = chunk(body, columnsCount).map((group, groupIndex) => (
        <div className={cx('Grid')} key={groupIndex}>
          {Array.from({length: columnsCount as number}).map((_, index) => (
            <div key={index} className={cx(cellClassName)}>
              {group[index]}
            </div>
          ))}
        </div>
      ));
    }

    return (
      <div className={cx(`CheckboxesControl`, className)}>
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
