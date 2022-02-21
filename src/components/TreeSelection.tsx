import {BaseSelection, BaseSelectionProps} from './Selection';
import {themeable} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {autobind, eachTree, everyTree} from '../utils/helper';
import Spinner from './Spinner';
import {localeable} from '../locale';
import {Icon} from './icons';

export interface TreeSelectionProps extends BaseSelectionProps {
  expand?: 'all' | 'first' | 'root' | 'none';
}

export interface TreeSelectionState {
  expanded: Array<string>;
}

export class TreeSelection extends BaseSelection<
  TreeSelectionProps,
  TreeSelectionState
> {
  valueArray: Array<Option>;
  state: TreeSelectionState = {
    expanded: []
  };

  static defaultProps = {
    ...BaseSelection.defaultProps,
    expand: 'first' as 'first'
  };

  componentDidMount() {
    this.syncExpanded();
  }

  componentDidUpdate(prevProps: TreeSelectionProps) {
    const props = this.props;

    if (
      !this.state.expanded.length &&
      (props.expand !== prevProps.expand || props.options !== prevProps.options)
    ) {
      this.syncExpanded();
    }
  }

  syncExpanded() {
    const options = this.props.options;
    const mode = this.props.expand;
    const expanded: Array<string> = [];

    if (!Array.isArray(options)) {
      return;
    }

    if (mode === 'first' || mode === 'root') {
      options.every((option, index) => {
        if (Array.isArray(option.children)) {
          expanded.push(`${index}`);
          return mode === 'root';
        }
        return true;
      });
    } else if (mode === 'all') {
      everyTree(options, (option, index, level, paths, indexes) => {
        if (Array.isArray(option.children)) {
          expanded.push(`${indexes.concat(index).join('-')}`);
        }
        return true;
      });
    }

    this.setState({expanded});
  }

  toggleOption(option: Option) {
    const {
      value,
      onChange,
      option2value,
      options,
      onDeferLoad,
      disabled,
      multiple,
      clearable
    } = this.props;

    if (disabled || option.disabled) {
      return;
    } else if (option.defer && !option.loaded) {
      onDeferLoad?.(option);
      return;
    }

    let valueArray = BaseSelection.value2array(value, options, option2value);

    if (
      option.value === void 0 &&
      Array.isArray(option.children) &&
      option.children.length &&
      multiple
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

      if (~idx && (multiple || clearable)) {
        valueArray.splice(idx, 1);
      } else if (multiple) {
        valueArray.push(option);
      } else {
        valueArray = [option];
      }
    }

    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;

    onChange && onChange(multiple ? newValue : newValue[0]);
  }

  toggleCollapsed(option: Option, index: string) {
    const onDeferLoad = this.props.onDeferLoad;
    const expanded = this.state.expanded.concat();
    const idx = expanded.indexOf(index);

    if (~idx) {
      expanded.splice(idx, 1);
    } else {
      expanded.push(index);
    }

    this.setState(
      {
        expanded: expanded
      },
      option.defer && onDeferLoad ? () => onDeferLoad(option) : undefined
    );
  }

  renderItem(option: Option, index: number, indexes: Array<number> = []) {
    const {
      labelClassName,
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      multiple
    } = this.props;
    const id = indexes.join('-');
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

    const expaned = !!~this.state.expanded.indexOf(id);

    return (
      <div
        key={index}
        className={cx(
          'TreeSelection-item',
          disabled || option.disabled || (option.defer && option.loading)
            ? 'is-disabled'
            : '',
          expaned ? 'is-expanded' : ''
        )}
      >
        <div
          className={cx(
            'TreeSelection-itemInner',
            itemClassName,
            option.className,
            checked ? 'is-active' : ''
          )}
          onClick={() => this.toggleOption(option)}
        >
          {hasChildren || option.defer ? (
            <a
              onClick={(e: React.MouseEvent<any>) => {
                e.stopPropagation();
                this.toggleCollapsed(option, id);
              }}
              className={cx('Table-expandBtn', expaned ? 'is-active' : '')}
            >
              <Icon icon="right-arrow-bold" className="icon" />
            </a>
          ) : null}

          {option.defer && option.loading ? <Spinner show size="sm" /> : null}

          {multiple && (!option.defer || option.loaded) ? (
            <Checkbox
              size="sm"
              checked={checked}
              partial={partial}
              disabled={disabled || option.disabled}
              labelClassName={labelClassName}
              description={option.description}
            />
          ) : null}

          <div className={cx('TreeSelection-itemLabel')}>
            {itemRender(option, {
              index: index,
              multiple: multiple,
              checked: checked,
              onChange: () => this.toggleOption(option),
              disabled: disabled || option.disabled
            })}
          </div>

          {option.defer && option.loading ? <Spinner show size="sm" /> : null}
        </div>
        {hasChildren ? (
          <div className={cx('TreeSelection-sublist')}>
            {option.children!.map((option, key) =>
              this.renderItem(option, key, indexes.concat(key))
            )}
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
      option2value,
      translate: __
    } = this.props;

    this.valueArray = BaseSelection.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderItem(option, key, [key]));
    }

    return (
      <div className={cx('TreeSelection', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('TreeSelection-placeholder')}>
            {__(placeholder)}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TreeSelection, {
      value: 'onChange'
    })
  )
);
