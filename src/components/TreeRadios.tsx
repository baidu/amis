import {themeable} from '../theme';
import React from 'react';
import {uncontrollable} from 'uncontrollable';
import Checkbox from './Checkbox';
import {Option} from './Select';
import {autobind, eachTree, everyTree} from '../utils/helper';
import Spinner from './Spinner';
import {BaseRadiosProps, BaseRadios} from './ListRadios';
import {localeable} from '../locale';
import {Icon} from './icons';

export interface TreeRadiosProps extends BaseRadiosProps {
  expand: 'all' | 'first' | 'root' | 'none';
}

export interface TreeRadiosState {
  expanded: Array<string>;
}

export class TreeRadios extends BaseRadios<TreeRadiosProps, TreeRadiosState> {
  state: TreeRadiosState = {
    expanded: []
  };

  static defaultProps = {
    ...BaseRadios.defaultProps,
    expand: 'first' as 'first'
  };

  componentDidMount() {
    this.syncExpanded();
  }

  componentDidUpdate(prevProps: TreeRadiosProps) {
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
      disabled,
      classnames: cx,
      itemClassName,
      itemRender,
      showRadio
    } = this.props;
    const id = indexes.join('-');
    let hasChildren = Array.isArray(option.children) && option.children.length;

    const checked = option === this.selected;
    const expaned = !!~this.state.expanded.indexOf(id);

    return (
      <div
        key={index}
        className={cx(
          'TreeRadios-item',
          disabled || option.disabled || (option.defer && option.loading)
            ? 'is-disabled'
            : '',
          expaned ? 'is-expanded' : '',
          checked ? 'is-active' : ''
        )}
      >
        <div
          className={cx(
            'TreeRadios-itemInner',
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

          <div className={cx('TreeRadios-itemLabel')}>{itemRender(option)}</div>

          {option.defer && option.loading ? <Spinner show size="sm" /> : null}

          {(!option.defer || option.loaded) &&
          option.value !== undefined &&
          showRadio !== false ? (
            <Checkbox
              type="radio"
              size="sm"
              checked={checked}
              disabled={disabled || option.disabled}
            />
          ) : null}
        </div>
        {hasChildren ? (
          <div className={cx('TreeRadios-sublist')}>
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

    this.selected = BaseRadios.resolveSelected(value, options, option2value);
    let body: Array<React.ReactNode> = [];

    if (Array.isArray(options) && options.length) {
      body = options.map((option, key) => this.renderItem(option, key, [key]));
    }

    return (
      <div className={cx('TreeRadios', className)}>
        {body && body.length ? (
          body
        ) : (
          <div className={cx('TreeRadios-placeholder')}>{__(placeholder)}</div>
        )}
      </div>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(TreeRadios, {
      value: 'onChange'
    })
  )
);
