import {BaseCheckboxes, BaseCheckboxesProps} from './Checkboxes';
import {themeable} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {autobind, eachTree, everyTree} from '../utils/helper';
import Spinner from './Spinner';
import {localeable} from '../locale';
import {Icon} from './icons';

export interface TreeCheckboxesProps extends BaseCheckboxesProps {
  expand?: 'all' | 'first' | 'root' | 'none';
}

export interface TreeCheckboxesState {
  expanded: Array<string>;
}

export class TreeCheckboxes extends BaseCheckboxes<
  TreeCheckboxesProps,
  TreeCheckboxesState
> {
  valueArray: Array<Option>;
  state: TreeCheckboxesState = {
    expanded: []
  };

  static defaultProps = {
    ...BaseCheckboxes.defaultProps,
    expand: 'first' as 'first'
  };

  componentDidMount() {
    this.syncExpanded();
  }

  componentDidUpdate(prevProps: TreeCheckboxesProps) {
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
      disabled
    } = this.props;

    if (disabled || option.disabled) {
      return;
    } else if (option.defer && !option.loaded) {
      onDeferLoad?.(option);
      return;
    }

    let valueArray = BaseCheckboxes.value2array(value, options, option2value);

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
      itemRender
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
          'TreeCheckboxes-item',
          disabled || option.disabled || (option.defer && option.loading)
            ? 'is-disabled'
            : '',
          expaned ? 'is-expanded' : ''
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

          <div className={cx('TreeCheckboxes-itemLabel')}>
            {itemRender(option)}
          </div>

          {option.defer && option.loading ? <Spinner show size="sm" /> : null}

          {!option.defer || option.loaded ? (
            <Checkbox
              size="sm"
              checked={checked}
              partial={partial}
              disabled={disabled || option.disabled}
              labelClassName={labelClassName}
              description={option.description}
            />
          ) : null}
        </div>
        {hasChildren ? (
          <div className={cx('TreeCheckboxes-sublist')}>
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

    this.valueArray = BaseCheckboxes.value2array(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderItem(option, key, [key]));
    }

    return (
      <div className={cx('TreeCheckboxes', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('TreeCheckboxes-placeholder')}>
            {__(placeholder)}
          </div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TreeCheckboxes, {
      value: 'onChange'
    })
  )
);
