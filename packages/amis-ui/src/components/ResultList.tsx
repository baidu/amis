/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
import React from 'react';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {cloneDeep} from 'lodash';

import {Option, Options} from './Select';
import {ThemeProps, themeable} from 'amis-core';
import {Icon} from './icons';
import {autobind, guid} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import {BaseSelection, BaseSelectionProps} from './Selection';
import TransferSearch from './TransferSearch';

export interface ResultListProps extends ThemeProps, LocaleProps {
  className?: string;
  value?: Array<Option>;
  onChange?: (value: Array<Option>, optionModified?: boolean) => void;
  sortable?: boolean;
  disabled?: boolean;
  title?: string;
  searchPlaceholder?: string;
  placeholder: string;
  itemRender: (option: Option, states: ItemRenderStates) => JSX.Element;
  itemClassName?: string;
  searchable?: boolean;
  onSearch?: Function;
  valueField?: string;
  labelField?: string
}

export interface ItemRenderStates {
  index: number;
  disabled?: boolean;
  labelField?: string;
  onChange: (value: any, name: string) => void;
}

interface ResultListState {
  searchResult: Options | null;
}

export class ResultList extends React.Component<
  ResultListProps,
  ResultListState
> {
  static itemRender(option: Option, states: ItemRenderStates) {
    return <span>{`${option.scopeLabel || ''}${option[states?.labelField || 'label']}`}</span>;
  }

  static defaultProps: Pick<ResultListProps, 'placeholder' | 'itemRender' | 'searchPlaceholder'> = {
    placeholder: 'placeholder.selectData',
    itemRender: ResultList.itemRender,
    searchPlaceholder: ''
  };

  state: ResultListState = {
    searchResult: null
  };

  cancelSearch?: () => void;
  id = guid();
  sortable?: Sortable;
  unmounted = false;

  componentDidMount() {
    this.props.sortable && this.initSortable();
  }

  componentDidUpdate() {
    if (this.props.sortable) {
      this.sortable || this.initSortable();
    } else {
      this.desposeSortable();
    }
  }

  componentWillUnmount() {
    this.desposeSortable();
    this.unmounted = true;
  }

  initSortable() {
    const ns = this.props.classPrefix;
    const dom = findDOMNode(this) as HTMLElement;
    const container = dom.querySelector(
      `.${ns}Selections-items`
    ) as HTMLElement;

    if (!container) {
      return;
    }

    this.sortable = new Sortable(container, {
      group: `selections-${this.id}`,
      animation: 150,
      handle: `.${ns}Selections-dragbar`,
      ghostClass: `${ns}Selections-item--dragging`,
      onEnd: (e: any) => {
        // 没有移动
        if (e.newIndex === e.oldIndex) {
          return;
        }

        // 换回来
        const parent = e.to as HTMLElement;
        if (
          e.newIndex < e.oldIndex &&
          e.oldIndex < parent.childNodes.length - 1
        ) {
          parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
        } else if (e.oldIndex < parent.childNodes.length - 1) {
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
        this.props.onChange?.(newValue);
      }
    });
  }

  desposeSortable() {
    this.sortable?.destroy();
    delete this.sortable;
  }

  handleValueChange(index: number, value: any, name: string) {
    if (typeof name !== 'string') {
      return;
    }
    const {value: list, onChange} = this.props;

    const result = Array.isArray(list) ? list.concat() : [];
    if (!result[index]) {
      return;
    }
    result.splice(index, 1, {
      ...result[index],
      [name]: value
    });
    onChange?.(result, true);
  }

  @autobind
  search(inputValue: string) {
    const {onSearch, value} = this.props;
    const searchResult = (value || []).filter(
      item => onSearch && onSearch(inputValue, item)
    );
    this.setState({searchResult});
  }

  @autobind
  clearSearch() {
    this.setState({searchResult: null});
  }

  // 删除项
  @autobind
  handleCloseItem(e: React.MouseEvent<HTMLElement>, option: Option) {
    const {
      value,
      onChange,
      disabled,
      searchable,
      valueField = 'value'
    } = this.props;

    if (disabled || option.disabled) {
      return;
    }

    const {searchResult} = this.state;
    // 结果搜索
    if (searchable && searchResult) {
      // 删除普通值
      const valueArray = cloneDeep(value) || [];
      const idx = valueArray.findIndex(
        (item: Option) => item[valueField] === option[valueField]
      );
      if (idx > -1) {
        valueArray.splice(idx, 1);
        onChange && onChange(valueArray);
      }
      // 删除搜索结果
      const searchIdx = parseInt(
        e.currentTarget.getAttribute('data-index')!,
        10
      );
      if (searchIdx > -1) {
        searchResult.splice(searchIdx, 1);
        this.setState({searchResult});
      }
    }
    // 没有搜索，走旧的删除方式
    else {
      const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
      const {value, onChange} = this.props;

      if (!Array.isArray(value)) {
        return;
      }

      const newValue = value.concat();
      newValue.splice(index, 1);
      onChange?.(newValue);
    }
  }

  renderNormalList(value?: Options) {
    const {
      classnames: cx,
      itemRender,
      disabled,
      itemClassName,
      sortable,
      labelField,
      translate: __,
      placeholder
    } = this.props;

    return (
      <>
        {Array.isArray(value) && value.length ? (
          <div className={cx('Selections-items')}>
            {value.map((option, index) => (
              <div
                className={cx(
                  'Selections-item',
                  itemClassName,
                  option?.className
                )}
                key={index}
              >
                {sortable && !disabled && value.length > 1 ? (
                  <Icon
                    className={cx('Selections-dragbar icon')}
                    icon="drag-bar"
                  />
                ) : null}

                <label>
                  {itemRender(option, {
                    index,
                    disabled,
                    onChange: this.handleValueChange.bind(this, index),
                    labelField
                  })}
                </label>

                {!disabled ? (
                  <a
                    className={cx('Selections-delBtn')}
                    data-index={index}
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                      this.handleCloseItem(e, option)
                    }
                  >
                    <Icon icon="close" className="icon" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className={cx('Selections-placeholder')}>{__(placeholder)}</div>
        )}
      </>
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      title,
      searchable,
      value,
      translate: __,
      searchPlaceholder = __('Transfer.searchKeyword')
    } = this.props;

    const {searchResult} = this.state;

    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}
        {searchable ? (
          <TransferSearch
            placeholder={searchPlaceholder}
            onSearch={this.search}
            onCancelSearch={this.clearSearch}
          />
        ) : null}
        {this.renderNormalList(searchResult !== null ? searchResult : value)}
      </div>
    );
  }
}

export default themeable(localeable(ResultList));
