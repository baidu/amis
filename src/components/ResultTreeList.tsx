/**
 * 结果树(暂时不支持结果排序)
 */
import React from 'react';
import {cloneDeep, isEqual, omit} from 'lodash';

import {Option, Options} from './Select';
import {ThemeProps, themeable} from '../theme';
import {autobind, noop} from '../utils/helper';
import {LocaleProps, localeable} from '../locale';
import {BaseSelectionProps} from './Selection';
import Tree from './Tree';

export interface ResultTreeListProps extends ThemeProps, LocaleProps, BaseSelectionProps {
  onRef?: any;
  className?: string;
  value: Array<Option>;
  valueField: string;
  onChange: (value: Array<Option>, optionModified?: boolean) => void;
  placeholder: string;
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
function getResultOptions(value: Options = [], options: Options, valueField: string) {
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

export class BaseResultTreeList extends React.Component<ResultTreeListProps, ResultTreeListState> {

  static itemRender(option: any) {
    return <span>{`${option.scopeLabel || ''}${option.label}`}</span>;
  }

  static defaultProps: Pick<ResultTreeListProps, 'placeholder' | 'itemRender'> = {
    placeholder: 'placeholder.selectData',
    itemRender: BaseResultTreeList.itemRender
  };

  state: ResultTreeListState = {
    searching: false,
    treeOptions: [],
    searchTreeOptions: []
  }

  static getDerivedStateFromProps(props: ResultTreeListProps) {
    const newOptions = getResultOptions(props.value, props.options, props.valueField);
    return {
      treeOptions: cloneDeep(newOptions)
    }
  }

  componentDidMount() {
    // onRef只有渲染器的情况才会使用
    this.props.onRef?.(this);
  }

  // 删除非选中节点
  @autobind
  deleteTreeChecked(option: Option) {
    const {value = [], onChange, valueField} = this.props;
    const {searching, treeOptions} = this.state;
    let temNode: Options = [];
    const cb = (node: Option) => {
      if (isEqual(node, option)) {
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
              isEqual(omit(arrItem, ['isChecked', 'childrens']), item)
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

  search(inputValue: string, searchFunction: Function) {
    // 结果为空，直接清空
    if (!inputValue) {
      this.clearSearch();
      return;
    }

    const {valueField} = this.props;
    let temOptions: Array<Option> = this.state.treeOptions || [];
    const cb = (node: Option) => {
      node.isChecked = false;
      return true;
    };
    deepTree(temOptions, cb);

    const callBack = (node: Option) =>
      !!searchFunction && searchFunction(inputValue, node);

    temOptions &&
      temOptions.forEach(op => {
        getDeep(op, callBack, [op], valueField);
      });

    this.setState({
      searching: true,
      searchTreeOptions: deepCheckedTreeNode(temOptions)
    });
  }
  
  clearSearch() {
    this.setState({
      searching: false,
      searchTreeOptions: []
    });
  }

  render() {
    const {
      className,
      classnames: cx,
      value,
      placeholder,
      valueField,
      itemRender,
      translate: __
    } = this.props;

    const {treeOptions, searching, searchTreeOptions} = this.state;

    return (
      <div className={className}>
        {
          Array.isArray(value) && value.length ?
          (<Tree
            className={cx('Transfer-tree')}
            options={!searching ? treeOptions : searchTreeOptions}
            valueField={valueField}
            value={[]}
            onChange={noop}
            showIcon={false}
            itemRender={itemRender}
            removable
            onDelete={(option: Option) => this.deleteTreeChecked(option)}
          />) :
          (<div className={cx('Selections-placeholder')}>{__(placeholder)}</div>)
        }
      </div>
    );
  }
}

export default themeable(localeable(BaseResultTreeList));
