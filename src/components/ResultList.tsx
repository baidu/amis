/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
import React from 'react';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {debounce} from 'lodash';

import {Option, Options} from './Select';
import {ThemeProps, themeable} from '../theme';
import {Icon} from './icons';
import {autobind, guid} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';
import {BaseSelection, BaseSelectionProps} from './Selection';
import InputBox from './InputBox';
import ResultTreeList, {BaseResultTreeList} from './ResultTreeList';

import ResultTableList, {BaseResultTableSelection} from './ResultTableList';
import {SelectMode} from './Transfer';

export interface ResultListProps
  extends ThemeProps,
    LocaleProps,
    BaseSelectionProps {
  className?: string;
  value?: Array<Option>;
  onChange?: (value: Array<Option>, optionModified?: boolean) => void;
  sortable?: boolean;
  disabled?: boolean;
  title?: string;
  placeholder: string;
  itemRender: (option: Option, states: ItemRenderStates) => JSX.Element;
  itemClassName?: string;
  columns: Array<{
    name: string;
    label: string;
    [propName: string]: any;
  }>;
  cellRender?: (
    column: {
      name: string;
      label: string;
      [propName: string]: any;
    },
    option: Option,
    colIndex: number,
    rowIndex: number
  ) => JSX.Element;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: Function;
  selectMode: SelectMode;
}

export interface ItemRenderStates {
  index: number;
  disabled?: boolean;
  onChange: (value: any, name: string) => void;
}

interface ResultListState {
  inputValue: string;
  searchResult: Options | null;
}

export class ResultList extends React.Component<
  ResultListProps,
  ResultListState
> {

  static itemRender(option: any) {
    return <span>{`${option.scopeLabel || ''}${option.label}`}</span>;
  }

  static defaultProps: Pick<
    ResultListProps,
    'placeholder' | 'itemRender'
  > = {
    placeholder: 'placeholder.selectData',
    itemRender: ResultList.itemRender
  };

  state: ResultListState = {
    inputValue: '',
    searchResult: null
  };

  cancelSearch?: () => void;
  id = guid();
  sortable?: Sortable;
  unmounted = false;
  resultTreeRef?: BaseResultTreeList;
  resultTableRef?: BaseResultTableSelection;

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
    this.lazySearch.cancel();
    this.unmounted = true;
  }

  @autobind
  domTreeRef(ref: any) {
    this.resultTreeRef = ref;
  }

  @autobind
  domTableRef(ref: any) {
    this.resultTableRef = ref;
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
  handleSearch(inputValue: string) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    this.setState({inputValue}, () => {
      if (inputValue) {
        // 如果有取消搜索，先取消掉。
        this.cancelSearch && this.cancelSearch();
        this.lazySearch();
      } else {
        this.handleSeachCancel();
      }
    });
  }

  lazySearch = debounce(
    () => {
      const {inputValue} = this.state;
      // 防止由于防抖导致空值问题
      if (!inputValue) {
        return;
      }
      const {onSearch, value, selectMode} = this.props;
      if (selectMode === 'tree') {
        this.resultTreeRef?.search(inputValue, onSearch!);
      }
      else if (selectMode === 'table') {
        this.resultTableRef?.search(inputValue, onSearch!);
      }
      else {
        const searchResult = (value || []).filter(
          item => onSearch && onSearch(inputValue, item)
        );
        this.setState({searchResult});
      }
    },
    250,
    {trailing: true, leading: false}
  );

  @autobind
  handleSearchKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  @autobind
  handleSeachCancel() {
    const {selectMode} = this.props;
    if (selectMode === 'tree') {
      this.resultTreeRef?.clearSearch();
    }
    else if (selectMode === 'table') {
      this.resultTableRef?.clearSearch();
    }

    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  // 关闭表格最后一项
  @autobind
  handleCloseItem(option: Option) {
    const {value, onChange, option2value, options, disabled} = this.props;

    if (disabled || option.disabled) {
      return;
    }

    // 删除普通值
    let valueArray = BaseSelection.value2array(value, options, option2value);

    let idx = valueArray.indexOf(option);
    valueArray.splice(idx, 1);
    let newValue: string | Array<Option> = option2value
      ? valueArray.map(item => option2value(item))
      : valueArray;
    onChange && onChange(newValue);

    let {searchResult} = this.state;
    if (searchResult) {
      let searchArray = BaseSelection.value2array(
        searchResult,
        options,
        option2value
      );
      let searchIdx = searchArray.indexOf(option);
      searchResult.splice(searchIdx, 1);
      this.setState({searchResult});
    }
  }

  renderNormalList(value?: Options) {
    const {
      classnames: cx,
      placeholder,
      itemRender,
      disabled,
      itemClassName,
      sortable,
      translate: __
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
                    onChange: this.handleValueChange.bind(this, index)
                  })}
                </label>

                {!disabled ? (
                  <a
                    className={cx('Selections-delBtn')}
                    data-index={index}
                    onClick={(e: React.MouseEvent<HTMLElement>) =>
                      this.handleCloseItem(option)
                    }
                  >
                    <Icon icon="close" className="icon" />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) :
        (<div className={cx('Selections-placeholder')}>{__(placeholder)}</div>)}
      </>
    );
  }

  renderTable() {
    const {
      columns,
      options,
      disabled,
      option2value,
      classnames: cx,
      cellRender,
      onChange,
      placeholder,
      value,
      translate: __
    } = this.props;

    return (
      <ResultTableList
        onRef={this.domTableRef}
        classnames={cx}
        columns={columns}
        options={options || []}
        value={value}
        disabled={disabled}
        option2value={option2value}
        cellRender={cellRender}
        onChange={onChange}
        multiple={false}
        placeholder={placeholder}
      />
    );
  }

  renderTree() {
    const {
      classnames: cx,
      options,
      value,
      placeholder,
      onChange,
      itemRender,
      translate: __
    } = this.props;
    return (
      <ResultTreeList
        onRef={this.domTreeRef}
        classnames={cx}
        options={options}
        valueField={'value'}
        value={value || []}
        onChange={onChange!}
        itemRender={itemRender}
        placeholder={placeholder}
      />
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      title,
      searchable,
      selectMode,
      value,
      translate: __,
      searchPlaceholder = __('Transfer.searchKeyword')
    } = this.props;

    const {searchResult, inputValue} = this.state;
    const temp = searchResult !== null ? searchResult : value;

    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}
        {searchable ? (
          <div className={cx('Transfer-search')}>
            <InputBox
              value={inputValue}
              onChange={this.handleSearch}
              clearable={false}
              onKeyDown={this.handleSearchKeyDown}
              placeholder={searchPlaceholder}
            >
              {!!inputValue ? (
                <a onClick={this.handleSeachCancel}>
                  <Icon icon="close" className="icon" />
                </a>
              ) : (
                <Icon icon="search" className="icon" />
              )}
            </InputBox>
          </div>
        ) : null}
        {
        selectMode === 'table'
          ? this.renderTable()
          : selectMode === 'tree'
            ? this.renderTree()
            : this.renderNormalList(temp)
        }
      </div>
    );
  }
}

export default themeable(localeable(ResultList));
