/**
 * 用来显示选择结果，垂直显示。支持移出、排序等操作。
 */
import React from 'react';
import {cloneDeep, debounce, isEqual, omit} from 'lodash';
import {Option, Options} from './Select';
import {ThemeProps, themeable} from '../theme';
import {Icon} from './icons';
import {autobind, guid} from '../utils/helper';
import Sortable from 'sortablejs';
import {findDOMNode} from 'react-dom';
import {LocaleProps, localeable} from '../locale';
import {BaseSelectionProps, BaseSelection} from './Selection';
import InputBox from './InputBox';

import TableSelection from './TableSelection';
import Tree from './Tree';

type TreeNode = {
  label?: string
  value?: string
  children?: Array<TreeNode>
  isChecked?: boolean
};

export interface ResultListProps extends ThemeProps, LocaleProps, BaseSelectionProps {
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
  isFollowMode?: boolean;
  resultSearchable?: boolean;
  resultPlaceholder?: string;
  onResultSearch?: Function;
  selectMode: 'table' | 'group' | 'list' | 'tree' | 'chained' | 'associated'
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

export class ResultList extends React.Component<ResultListProps, ResultListState> {
  static itemRender(option: any) {
    return <span>{`${option.scopeLabel || ''}${option.label}`}</span>;
  }
  static defaultProps: Pick<ResultListProps, 'placeholder' | 'itemRender' | 'isFollowMode'> = {
    placeholder: 'placeholder.selectData',
    itemRender: ResultList.itemRender,
    isFollowMode: false
  };

  state: ResultListState = {
    inputValue: '',
    searchResult: null
  }

  cancelSearch?: () => void;
  id = guid();
  sortable?: Sortable;
  treeOptions?: Array<TreeNode>;
  clearTreeOptions: Array<TreeNode> | null;
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
    this.lazySearch.cancel();
    this.unmounted = true;
  }

  @autobind
  handleRemove(e: React.MouseEvent<HTMLElement>, option: Option) {
    const index = parseInt(e.currentTarget.getAttribute('data-index')!, 10);
    const {value, onChange} = this.props;

    if (!Array.isArray(value)) {
      return;
    }

    const newValue = value.concat();
    newValue.splice(index, 1);
    onChange?.(newValue);

    this.deleteSearchNotTreeResultItem(option);
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

  // 递归找到对应选中节点
  getDeep(
    node: TreeNode,
    cb: (node: TreeNode) => boolean,
    pathNodes: Array<TreeNode>) {
    if (node.value && cb(node)) {
      node.isChecked = true;
      for (let i = pathNodes.length - 2; i >= 0; i--) {
        if (!pathNodes[i].isChecked) {
          pathNodes[i].isChecked = true;
          continue;
        }
        break;
      }
    }
    else if (node.children && Array.isArray(node.children)){
      node.children.forEach((n) => {
        pathNodes.push(n);
        this.getDeep(n, cb, pathNodes);
        pathNodes.pop();
      });
    }
  }

  // 递归删除树多余的节点
  deepCheckedTreeNode(nodes: Array<TreeNode>) {
    let arr: Array<Option> = [];
    for(let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.isChecked) {
        if (node.children && Array.isArray(node.children)) {
          node.children = this.deepCheckedTreeNode(node.children);
        }
        arr.push(node);
      }
    }
    return arr;
  }

  // 根据选项获取到结果
  getResultOptions(value: Options = [], options: Options) {
    const newOptions = cloneDeep(options) as Array<TreeNode>;
    const callBack = (node: TreeNode) => !!(value || []).find(target => target.value === node.value);
    newOptions && newOptions.forEach(op => {
      this.getDeep(op, callBack, [op]);
    });
    return this.deepCheckedTreeNode(newOptions);
  }

  deepTree(nodes: Options, cb: (node: Option) => void) {
    for(let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      cb(node);
      if (node.children && Array.isArray(node.children)) {
        this.deepTree(node.children, cb);
      }
    }
  }

  // 删除非选中节点
  @autobind
  deleteTreeChecked(option: Option) {
    let temNode: Options = [];
    const cb = (node: Option) => {
      if (isEqual(node, option)) {
        temNode = [node];
      }
    }
    this.deepTree(this.treeOptions || [], cb);
    let arr: Options = [];
    const cb2 = (node: Option) => {
      if (node.isChecked && node.value) {
        arr.push(node);
      }
    }
    this.deepTree(temNode, cb2);
    const {value = [], onChange} = this.props;
    onChange && onChange(value.filter(item =>
      !arr.find(arrItem => isEqual(omit(arrItem, ['isChecked', 'childrens']), item))));
  }

  @autobind
  handleSearch(inputValue: string) {
    // text 有值的时候，走搜索否则直接走 handleSeachCancel ，等同于右侧的 clear 按钮
    this.setState({inputValue},
      () => {
        if (inputValue) {
          // 如果有取消搜索，先取消掉。
          this.cancelSearch && this.cancelSearch();
          this.lazySearch();
        }
        else {
          this.handleSeachCancel()
        }
      }
    );
  }

  lazySearch = debounce(() => {
    const {inputValue} = this.state;
    // 防止由于防抖导致空值问题，导致后续由于
    if (!inputValue) {
      return;
    }
    const {onResultSearch, value, selectMode, isFollowMode} = this.props;
    if (selectMode === 'tree' && isFollowMode) {
      let temOptions = this.clearTreeOptions || [];
      if (this.clearTreeOptions === null) {
        const cb = (node: Option) => {
          node.isChecked = false;
          return true;
        }
        temOptions = this.treeOptions || [];
        this.deepTree(temOptions, cb);
      }
      const callBack = (node: TreeNode) => !!onResultSearch && onResultSearch(inputValue, node);
      temOptions && temOptions.forEach(op => {
        this.getDeep(op, callBack, [op]);
      });
      this.setState({searchResult: this.deepCheckedTreeNode(temOptions)});
    }
    else {
      const searchResult = (value || []).filter(item => onResultSearch && onResultSearch(inputValue, item));
      this.setState({searchResult});
    }
  }, 250, {trailing: true, leading: false});

  @autobind
  handleSearchKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  @autobind
  handleSeachCancel() {
    this.setState({
      inputValue: '',
      searchResult: null
    });
  }

  // 关闭表格最后一项
  @autobind
  handleCloseTableItem(option: Option) {
    const {
      value,
      onChange,
      option2value,
      options,
      disabled,
    } = this.props;

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

    this.deleteSearchNotTreeResultItem(option);
  }

  // 删除结果搜索值
  deleteSearchNotTreeResultItem(option: Option) {
    const {option2value, options} = this.props;
    // 删除搜索值
    let {searchResult} = this.state;
    if (searchResult) {
      let searchArray = BaseSelection.value2array(searchResult, options, option2value);
      let searchIdx = searchArray.indexOf(option);
      searchResult.splice(searchIdx, 1);
      this.setState({searchResult});
    }
  }

  // 向下删
  deepDeleteTree(nodes: Options, option: Option) {
    let arr: Array<Option> = [];
    for(let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (isEqual(node, option)) {
        continue;
      };
      if (node.children && Array.isArray(node.children)) {
        node.children = this.deepDeleteTree(node.children, option);
      }
      if ((node.children && node.children.length > 0) || node.value !== undefined) {
        arr.push(node);
      }
    }
    return arr;
  }

  // 搜索树点击删除时，删除对应节点
  deleteResultTreeNode(option: Option) {
    const arr = this.deepDeleteTree(cloneDeep(this.state.searchResult) || [], option);
    this.setState({searchResult: arr});
  }

  // 生成搜索结果树
  renderSearchTree(searchResult: Options) {
    const {classnames: cx} = this.props;
    return (
      <Tree
        className={cx('Transfer-tree')}
        options={searchResult}
        valueField={'value'}
        value={[]}
        onChange={() => {}}
        showIcon={false}
        onDelete={(option: Option) => {
          this.deleteTreeChecked(option);
          this.deleteResultTreeNode(option);
        }}
        removable
      />
    )
  }

  // 普通树
  renderTree() {
    const {classnames: cx, options, value} = this.props;
    const newOptions = this.getResultOptions(value, options);
    // 这里只是为了临时记录当前的右侧结果树列表
    this.treeOptions = cloneDeep(newOptions);
    this.clearTreeOptions = null;
    return (
      <Tree
        className={cx('Transfer-tree')}
        options={newOptions}
        valueField={'value'}
        value={[]}
        onChange={() => {}}
        showIcon={false}
        onDelete={this.deleteTreeChecked}
        removable
      />
    )
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
                className={cx('Selections-item', itemClassName, option?.className)}
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
                    onClick={(e: React.MouseEvent<HTMLElement>) => this.handleRemove(e, option)}
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

  renderTable(value?: Options) {
    const {
      columns,
      options,
      disabled,
      option2value,
      classnames: cx,
      cellRender,
      onChange
    } = this.props;

    return (
    <TableSelection
      className={cx('Transfer-selection')}
      columns={columns}
      options={options || []}
      value={value}
      disabled={disabled}
      option2value={option2value}
      cellRender={cellRender}
      onChange={onChange}
      onCloseItem={this.handleCloseTableItem}
      multiple={false}
      isCloseSide={true}
    />)
  }

  renderSearchResult(searchResult: Options) {
    const {
      classnames: cx,
      isFollowMode,
      selectMode,
      translate: __
    } = this.props;
    return selectMode === 'table' && isFollowMode
      ? this.renderTable(searchResult)
      : selectMode === 'tree' && isFollowMode
        ? this.renderSearchTree(searchResult)
        : this.renderNormalList(searchResult);
  }

  renderNormalResult() {
    const {isFollowMode, value, selectMode} = this.props;
    return selectMode === 'table' && isFollowMode
      ? this.renderTable(value)
      : selectMode === 'tree' && isFollowMode
        ? this.renderTree()
        : this.renderNormalList(value);
  }

  render() {
    const {
      classnames: cx,
      className,
      title,
      resultSearchable,
      translate: __,
      resultPlaceholder = __('Transfer.searchKeyword')
    } = this.props;

    const {searchResult, inputValue} = this.state;

    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}
        {resultSearchable ? (
          <div className={cx('Transfer-search')}>
            <InputBox
              value={inputValue}
              onChange={this.handleSearch}
              clearable={false}
              onKeyDown={this.handleSearchKeyDown}
              placeholder={resultPlaceholder}
            >
              {searchResult !== null
              ? (<a onClick={this.handleSeachCancel}>
                  <Icon icon="close" className="icon" />
                </a>)
              : <Icon icon="search" className="icon" /> }
            </InputBox>
          </div>
        ) : null}
        {searchResult !== null
          ? this.renderSearchResult(searchResult)
          : this.renderNormalResult()}
      </div>
    );
  }
}

export default themeable(localeable(ResultList));
