import {Checkboxes, CheckboxesProps} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import uncontrollable from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {autobind} from '../utils/helper';

export interface TreeCheckboxesProps extends CheckboxesProps {}

export interface TreeCheckboxesState {
  collapsed: Array<Option>;
}

export class TreeCheckboxes extends Checkboxes<
  TreeCheckboxesProps,
  TreeCheckboxesState
> {
  valueArray: Array<Option>;
  state: TreeCheckboxesState = {
    collapsed: []
  };

  toggleOption(option: Option) {
    const {value, onChange, option2value, options} = this.props;

    if (option.disabled) {
      return;
    }

    let valueArray = Checkboxes.value2array(value, options, option2value);

    if (
      option.value === void 0 &&
      Array.isArray(option.children) &&
      option.children.length
    ) {
      const someCheckedFn = (child: Option) =>
        (Array.isArray(child.children) && child.children.length
          ? child.children.some(someCheckedFn)
          : false) ||
        (child.value !== void 0 && ~valueArray.indexOf(child));
      const someChecked = option.children.some(someCheckedFn);
      const eachFn = (child: Option) => {
        if (Array.isArray(child.children) && child.children.length) {
          child.children.forEach(eachFn);
        }

        if (child.value !== void 0) {
          const idx = valueArray.indexOf(child);

          ~idx && valueArray.splice(idx, 1);

          if (!someChecked) {
            valueArray.push(child);
          }
        }
      };
      option.children.forEach(eachFn);
    } else {
      let idx = valueArray.indexOf(option);

      if (~idx) {
        valueArray.splice(idx, 1);
      } else {
        valueArray.push(option);
      }
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(newValue);
  }

  toggleCollapsed(option: Option) {
    const collapsed = this.state.collapsed.concat();
    const idx = collapsed.indexOf(option);

    if (~idx) {
      collapsed.splice(idx, 1);
    } else {
      collapsed.push(option);
    }

    this.setState({
      collapsed
    });
  }

  renderItem(option: Option, index: number) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender
    } = this.props;
    const valueArray = this.valueArray;
    let partial = false;
    let checked = false;
    let hasChildren = Array.isArray(option.children) && option.children.length;

    if (option.value === void 0 && hasChildren) {
      let allchecked = true;
      let partialChecked = false;
      const eachFn = (child: Option) => {
        if (Array.isArray(child.children) && child.children.length) {
          child.children.forEach(eachFn);
        }

        if (child.value !== void 0) {
          const isIn = !!~valueArray.indexOf(child);

          if (isIn && !partialChecked) {
            partialChecked = true;
          } else if (!isIn && allchecked) {
            allchecked = false;
          }

          checked = partialChecked;
          partial = partialChecked && !allchecked;
        }
      };

      option.children!.forEach(eachFn);
    } else {
      checked = !!~valueArray.indexOf(option);
    }

    const collapsed = !!~this.state.collapsed.indexOf(option);

    return (
      <div
        key={index}
        className={cx(
          'TreeCheckboxes-item',
          disabled || option.disabled ? 'is-disabled' : '',
          collapsed ? 'is-collapsed' : ''
        )}
      >
        <div
          className={cx(
            'TreeCheckboxes-itemInner',
            itemClassName,
            option.className
          )}
          onClick={() => this.toggleOption(option)}
        >
          {hasChildren ? (
            <a
              onClick={(e: React.MouseEvent<any>) => {
                e.stopPropagation();
                this.toggleCollapsed(option);
              }}
              className={cx('Table-expandBtn', !collapsed ? 'is-active' : '')}
            >
              <i />
            </a>
          ) : null}

          <div className={cx('TreeCheckboxes-itemLabel')}>
            {itemRender(option)}
          </div>

          <Checkbox
            size="sm"
            checked={checked}
            partial={partial}
            disabled={disabled || option.disabled}
            labelClassName={labelClassName}
            description={option.description}
          />
        </div>
        {Array.isArray(option.children) && option.children.length ? (
          <div className={cx('TreeCheckboxes-sublist')}>
            {option.children.map((option, key) => this.renderItem(option, key))}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      value,
      options,
      className,
      placeholder,
      classnames: cx,
      option2value
    } = this.props;

    this.valueArray = Checkboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderItem(option, key));
    }

    return (
      <div className={cx('TreeCheckboxes', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('TreeCheckboxes-placeholder')}>{placeholder}</div>
        )}
      </div>
    );
  }
}

export default themeable(
  uncontrollable(TreeCheckboxes, {
    value: 'onChange'
  })
);
