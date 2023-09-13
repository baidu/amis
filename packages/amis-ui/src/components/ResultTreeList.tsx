/**
 * 结果树(暂时不支持结果排序)
 */
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import {Option, Options} from './Select';
import {ThemeProps, themeable} from 'amis-core';
import {autobind, noop} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import {BaseSelectionProps} from './Selection';
import Tree from './Tree';
import TransferSearch from './TransferSearch';
import {SpinnerExtraProps} from './Spinner';

export interface ResultTreeListProps
  extends ThemeProps,
    LocaleProps,
    BaseSelectionProps,
    SpinnerExtraProps {
  className?: string;
  title?: string;
  searchable?: boolean;
  value: Array<Option>;
  valueField: string;
  onSearch?: Function;
  onChange: (value: Array<Option>, optionModified?: boolean) => void;
  placeholder: string;
  searchPlaceholder?: string;
  itemRender: (option: Option, states: ItemRenderStates) => JSX.Element;
  itemClassName?: string;
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
}

export interface ItemRenderStates {
  index: number;
  disabled?: boolean;
  onChange: (value: any, name: string) => void;
}

interface ResultTreeListState {
  searching: Boolean;
  treeOptions: Options;
  searchTreeOptions: Options;
}

// 递归找到对应选中节点(dfs)
function getDeep(
  node: Option,
  cb: (node: Option) => boolean,
  pathNodes: Array<Option>,
  valueField: string
) {
  if (node[valueField] && cb(node)) {
    node.isChecked = true;
    for (let i = pathNodes.length - 2; i >= 0; i--) {
      if (!pathNodes[i].isChecked) {
        pathNodes[i].isChecked = true;
        continue;
      }
      break;
    }
  } else if (node.children && Array.isArray(node.children)) {
    node.children.forEach(n => {
      pathNodes.push(n);
      getDeep(n, cb, pathNodes, valueField);
      pathNodes.pop();
    });
  }
}

// 递归删除树多余的节点
function deepCheckedTreeNode(nodes: Array<Option>) {
  let arr: Array<Option> = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.isChecked) {
      if (node.children && Array.isArray(node.children)) {
        node.children = deepCheckedTreeNode(node.children);
      }
      arr.push(node);
    }
  }
  return arr;
}

// 根据选项获取到结果
function getResultOptions(
  value: Options = [],
  options: Options,
  valueField: string
) {
  const newOptions = cloneDeep(options) as Array<Option>;
  const callBack = (node: Option) =>
    !!(value || []).find(target => target[valueField] === node[valueField]);
  newOptions &&
    newOptions.forEach(op => {
      getDeep(op, callBack, [op], valueField);
    });
  return deepCheckedTreeNode(newOptions);
}

// 在包含回调函数情况下，遍历树
function deepTree(nodes: Options, cb: (node: Option) => void) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    cb(node);
    if (node.children && Array.isArray(node.children)) {
      deepTree(node.children, cb);
    }
  }
}

// 树的节点删除
function deepDeleteTree(nodes: Options, option: Option, valueField: string) {
  let arr: Array<Option> = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isEqual(node, option)) {
      continue;
    }
    if (node.children && Array.isArray(node.children)) {
      node.children = deepDeleteTree(node.children, option, valueField);
    }
    if (
      (node.children && node.children.length > 0) ||
      node[valueField] !== undefined
    ) {
      arr.push(node);
    }
  }
  return arr;
}

export class BaseResultTreeList extends React.Component<
  ResultTreeListProps,
  ResultTreeListState
> {
  static itemRender(option: any) {
    return <span>{`${option.scopeLabel || ''}${option.label}`}</span>;
  }

  static defaultProps: Pick<ResultTreeListProps, 'placeholder' | 'itemRender'> =
    {
      placeholder: 'placeholder.selectData',
      itemRender: this.itemRender
    };

  state: ResultTreeListState = {
    searching: false,
    treeOptions: [],
    searchTreeOptions: []
  };

  searchRef?: any;

  static getDerivedStateFromProps(props: ResultTreeListProps) {
    const newOptions = getResultOptions(
      props.value,
      props.options,
      props.valueField
    );
    return {
      treeOptions: cloneDeep(newOptions)
    };
  }

  @autobind
  domSearchRef(ref: any) {
    while (ref && ref.getWrappedInstance) {
      ref = ref.getWrappedInstance();
    }
    this.searchRef = ref;
  }

  // 删除非选中节点
  @autobind
  deleteTreeChecked(option: Option) {
    const {value = [], onChange, valueField} = this.props;
    const {searching, treeOptions} = this.state;
    let temNode: Options = [];
    const cb = (node: Option) => {
      // 对比时去掉 parent，因为其无限嵌套
      if (isEqual(omit(node, 'parent'), omit(option, 'parent'))) {
        temNode = [node];
      }
    };
    deepTree(treeOptions || [], cb);
    let arr: Options = [];
    const cb2 = (node: Option) => {
      if (node.isChecked && node[valueField]) {
        arr.push(node);
      }
    };
    deepTree(temNode, cb2);
    onChange &&
      onChange(
        value.filter(
          item =>
            !arr.find(arrItem =>
              // 对比时去掉 parent，因为其无限嵌套，且不相等
              isEqual(
                omit(arrItem, ['isChecked', 'childrens', 'parent']),
                omit(item, 'parent')
              )
            )
        )
      );

    // 搜索时，重新生成树
    searching && this.deleteResultTreeNode(option);
  }

  // 搜索树点击删除时，删除对应节点
  deleteResultTreeNode(option: Option) {
    const arr = deepDeleteTree(
      cloneDeep(this.state.searchTreeOptions) || [],
      option,
      this.props.valueField
    );
    this.setState({searchTreeOptions: arr});
  }

  @autobind
  search(inputValue: string) {
    // 结果为空，直接清空
    if (!inputValue) {
      this.clearSearch();
      return;
    }

    const {valueField, onSearch} = this.props;
    let temOptions: Array<Option> = this.state.treeOptions || [];
    const cb = (node: Option) => {
      node.isChecked = false;
      return true;
    };
    deepTree(temOptions, cb);

    const callBack = (node: Option) => onSearch?.(inputValue, node);

    temOptions &&
      temOptions.forEach(op => {
        getDeep(op, callBack, [op], valueField);
      });

    this.setState({
      searching: true,
      searchTreeOptions: deepCheckedTreeNode(temOptions)
    });
  }

  @autobind
  clearSearch() {
    this.setState({
      searching: false,
      searchTreeOptions: []
    });
  }

  @autobind
  clearInput() {
    if (this.props.searchable) {
      this.searchRef?.clearInput?.();
    }
    this.clearSearch();
  }

  renderTree() {
    const {
      className,
      classnames: cx,
      value,
      valueField,
      itemRender,
      translate: __,
      placeholder,
      virtualThreshold,
      itemHeight,
      loadingConfig
    } = this.props;

    const {treeOptions, searching, searchTreeOptions} = this.state;

    return (
      <div className={cx('ResultTreeList', className)}>
        {Array.isArray(value) && value.length ? (
          <Tree
            className={cx('Transfer-tree')}
            options={!searching ? treeOptions : searchTreeOptions}
            valueField={valueField}
            value={[]}
            onChange={noop}
            showIcon={false}
            itemRender={itemRender}
            removable
            loadingConfig={loadingConfig}
            onDelete={(option: Option) => this.deleteTreeChecked(option)}
            virtualThreshold={virtualThreshold}
            itemHeight={itemHeight}
          />
        ) : (
          <div className={cx('Selections-placeholder')}>{__(placeholder)}</div>
        )}
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      className,
      title,
      searchable,
      translate: __,
      searchPlaceholder = __('Transfer.searchKeyword')
    } = this.props;

    return (
      <div className={cx('Selections', className)}>
        {title ? <div className={cx('Selections-title')}>{title}</div> : null}
        {searchable ? (
          <TransferSearch
            ref={this.domSearchRef}
            placeholder={searchPlaceholder}
            onSearch={this.search}
            onCancelSearch={this.clearSearch}
          />
        ) : null}
        {this.renderTree()}
      </div>
    );
  }
}

export default themeable(localeable(BaseResultTreeList));
