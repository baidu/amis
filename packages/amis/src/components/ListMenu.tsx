import {ThemeProps, themeable} from '../theme';
import React from 'react';
import {Options, Option} from './Select';
import {LocaleProps, localeable} from '../locale';

export interface ListMenuProps extends ThemeProps, LocaleProps {
  options: Options;
  disabled?: boolean;
  selectedOptions?: Options;
  highlightIndex?: number | null;
  onSelect?: (e: any, option: Option) => void;
  placeholder: string;
  itemRender: (option: Option) => JSX.Element;
  getItemProps: (props: {item: Option; index: number}) => any;
  prefix?: JSX.Element;
}

interface RenderResult {
  items: Array<JSX.Element>;
  index: number;
}

export class ListMenu extends React.Component<ListMenuProps> {
  static defaultProps = {
    placeholder: 'placeholder.noOption',
    itemRender: (option: Option) => <>{option.label}</>,
    getItemProps: (props: {item: Option; index: number}) => null
  };

  renderItem(result: RenderResult, option: Option, optionIndex: number) {
    const {
      classnames: cx,
      itemRender,
      disabled,
      getItemProps,
      highlightIndex,
      selectedOptions,
      onSelect
    } = this.props;

    if (Array.isArray(option.children) && option.children.length) {
      const stackResult = {
        items: [],
        index: result.index
      };
      result.items.push(
        <div className={cx('ListMenu-group')} key={optionIndex}>
          <div className={cx('ListMenu-groupLabel')}>{itemRender(option)}</div>
          {
            option.children.reduce(
              (result: RenderResult, option, index) =>
                this.renderItem(result, option, index),
              stackResult
            ).items
          }
        </div>
      );
      result.index = stackResult.index;
      return result;
    }

    const index = result.index++;

    result.items.push(
      <div
        className={cx(
          'ListMenu-item',
          option.className,
          disabled || option.disabled ? 'is-disabled' : '',
          index === highlightIndex ? 'is-highlight' : '',
          ~(selectedOptions || []).indexOf(option) ? 'is-active' : ''
        )}
        key={index}
        onClick={onSelect ? (e: any) => onSelect(e, option) : undefined}
        {...getItemProps({
          item: option,
          index: index
        })}
      >
        <div className={cx('ListMenu-itemLabel')}>{itemRender(option)}</div>
      </div>
    );

    return result;
  }

  render() {
    const {classnames: cx, options, placeholder, prefix, children} = this.props;
    const __ = this.props.translate;

    return (
      <div className={cx('ListMenu')}>
        {prefix}
        {Array.isArray(options) && options.length ? (
          options.reduce(
            (result: RenderResult, option: Option, index) =>
              this.renderItem(result, option, index),
            {
              items: [],
              index: 0
            }
          ).items
        ) : (
          <span className={cx('ListMenu-placeholder')}>{__(placeholder)}</span>
        )}
        {children}
      </div>
    );
  }
}

export default themeable(localeable(ListMenu));
