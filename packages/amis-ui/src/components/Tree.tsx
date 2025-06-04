/**
 * @file Tree
 * @description 树形组件
 *
 * 情况列举：
 * 1. 选中父节点时，连带选中子节点 : autoChildren = true 前提条件
 *    1.1 交互
 *        1.1.1 子节点不可以取消勾选 cascade = false,
 *        1.1.2 子节点可以取消勾选 cascade = true, withChildren 失效
 *    1.2 数据（state.value）
 *        1.2.1 只提交父节点数据 cascade = false
 *        1.2.2 只提交子节点的数据  onlyChildren = true
 *        1.2.3 全部数据提交 withChildren = true || cascade = true
 *
 * 2. 选中节点时，只选中当前节点，没有联动效果
 *
 * @author fex
 */

import React from 'react';
import {
  eachTree,
  isVisible,
  autobind,
  findTreeIndex,
  hasAbility,
  getTreeParent,
  getTreeAncestors,
  flattenTree,
  flattenTreeWithLeafNodes,
  TestIdBuilder,
  resizeSensor,
  calculateHeight
} from 'amis-core';
import {Option, Options, value2array} from './Select';
import {themeable, ThemeProps, highlight} from 'amis-core';
import {Icon} from './icons';
import Checkbox from './Checkbox';
import {LocaleProps, localeable} from 'amis-core';
import Spinner, {SpinnerExtraProps} from './Spinner';
import {ItemRenderStates} from './Selection';
import VirtualList from './virtual-list';
import TooltipWrapper from './TooltipWrapper';

interface IDropIndicator {
  left: number;
  top: number;
  width: number;
  height?: number;
}

export interface IDropInfo {
  dragNode: Option | null;
  node: Option;
  position: 'top' | 'bottom' | 'self';
  indicator: IDropIndicator;
}

type NodeBehaviorType = 'unfold' | 'check';

interface TreeSelectorProps extends ThemeProps, LocaleProps, SpinnerExtraProps {
  highlightTxt?: string;

  onRef?: any;

  showIcon?: boolean;
  // 是否默认都展开
  initiallyOpen?: boolean;
  // 默认展开的级数，从1开始，只有initiallyOpen不是true时生效
  unfoldedLevel?: number;
  // 单选时，是否展示radio
  showRadio?: boolean;
  multiple?: boolean;
  // 是否都不可用
  disabled?: boolean;
  // 多选时，选中父节点时，是否将其所有子节点也融合到取值中，默认是不融合
  withChildren?: boolean;
  // 多选时，选中父节点时，是否只将起子节点加入到值中。
  onlyChildren?: boolean;
  // 单选时，只运行选择子节点
  onlyLeaf?: boolean;
  // 名称、取值等字段名映射
  labelField: string;
  valueField: string;
  iconField: string;
  deferField: string;
  unfoldedField: string;
  foldedField: string;
  disabledField: string;

  // 是否显示 outline 辅助线
  showOutline?: boolean;

  className?: string;
  itemClassName?: string;
  joinValues?: boolean;
  extractValue?: boolean;
  delimiter?: string;
  options: Options;
  value: any;
  onChange: Function;
  placeholder?: string;
  hideRoot?: boolean;
  rootLabel?: string;
  rootValue?: any;
  // 是否开启节点路径记录
  enableNodePath?: boolean;
  // 路径节点的分隔符
  pathSeparator?: string;
  // 已选择节点路径
  nodePath: any[];
  // ui级联关系，true代表级联选中，false代表不级联，默认为true
  autoCheckChildren: boolean;

  /**
   * 子节点取消时自定去掉父节点的值，默认为false
   */
  autoCancelParent?: boolean;

  /*
   * 该属性代表数据级联关系，autoCheckChildren为true时生效，默认为false，具体数据级联关系如下：
   * 1.cascade 为false，ui行为为级联选中子节点，子节点禁用；值只包含父节点的值
   * 2.cascade为false，withChildren为true，ui行为为级联选中子节点，子节点禁用；值包含父子节点的值
   * 3.cascade为true，ui行为级联选中子节点，子节点可反选，值包含父子节点的值，此时withChildren属性失效
   * 4.cascade不论为true还是false，onlyChildren为true，ui行为级联选中子节点，子节点可反选，值只包含子节点的值
   */
  cascade?: boolean;

  /**
   * 节点行为配置，默认为选中
   */
  nodeBehavior?: NodeBehaviorType[];

  /**
   * 是否使用 disable 字段
   */
  selfDisabledAffectChildren?: boolean;
  minLength?: number;
  maxLength?: number;
  // 是否为内建 增、改、删。当有复杂表单的时候直接抛出去让外层能统一处理
  bultinCUD?: boolean;
  rootCreatable?: boolean;
  rootCreateTip?: string;
  creatable?: boolean;
  createTip?: string;
  // 是否开启虚拟滚动
  virtualThreshold?: number;
  onAdd?: (
    idx?: number | Array<number>,
    value?: any,
    skipForm?: boolean
  ) => void;
  editable?: boolean;
  editTip?: string;
  onEdit?: (value: Option, origin?: Option, skipForm?: boolean) => void;
  removable?: boolean;
  removeTip?: string;
  onDelete?: (value: Option) => void;
  onDeferLoad?: (option: Option) => void;
  onExpandTree?: (nodePathArr: any[]) => void;
  draggable?: boolean;
  onMove?: (dropInfo: IDropInfo) => void;
  itemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  // 是否允许全选
  checkAll?: boolean;
  // 全选按钮文案
  checkAllLabel?: string;
  enableDefaultIcon?: boolean;
  onHandleNodeClick?: (option: Option) => void;

  /**
   * 节点操作栏区域
   */
  itemActionsRender?: (item: Option, states: any) => JSX.Element;

  testIdBuilder?: TestIdBuilder;
  actionClassName?: string;

  height?: number;
}

interface TreeSelectorState {
  value: Array<any>;
  valueSet: Set<any>;
  inputValue: string;
  addingParent: Option | null;
  isAdding: boolean;
  isEditing: boolean;
  editingItem: Option | null;

  // 拍平的 Option list
  flattenedOptions: Option[];

  // 拖拽指示器
  dropIndicator?: IDropIndicator;

  virtualHeight: number;
  itemHeight: number;
}

export class TreeSelector extends React.Component<
  TreeSelectorProps,
  TreeSelectorState
> {
  static defaultProps = {
    showIcon: true,
    showOutline: false,
    initiallyOpen: true,
    unfoldedLevel: 1,
    showRadio: false,
    multiple: false,
    disabled: false,
    withChildren: false,
    onlyChildren: false,
    labelField: 'label',
    valueField: 'value',
    iconField: 'icon',
    deferField: 'defer',
    unfoldedField: 'unfolded',
    foldedField: 'foled',
    disabledField: 'disabled',
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    hideRoot: true,
    rootLabel: 'Tree.root',
    rootValue: 0,
    autoCheckChildren: true,
    autoCancelParent: false,
    cascade: false,
    selfDisabledAffectChildren: true,
    rootCreateTip: 'Tree.addRoot',
    createTip: 'Tree.addChild',
    editTip: 'Tree.editNode',
    removeTip: 'Tree.removeNode',
    enableNodePath: false,
    pathSeparator: '/',
    nodePath: [],
    virtualThreshold: 100,
    enableDefaultIcon: true
  };
  // 展开的节点
  unfolded: WeakMap<Object, boolean> = new WeakMap();
  // key: child option, value: parent option;
  relations: WeakMap<Option, Option> = new WeakMap();
  levels: WeakMap<Option, number> = new WeakMap();

  dragNode: Option | null;
  dropInfo: IDropInfo | null;
  startPoint: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0
  };
  root = React.createRef<HTMLDivElement>();
  virtualListRef: HTMLDivElement | null = null;
  unSensor?: () => void;

  constructor(props: TreeSelectorProps) {
    super(props);
    const value = value2array(
      props.value,
      {
        multiple: props.multiple,
        delimiter: props.delimiter,
        valueField: props.valueField,
        labelField: props.labelField,
        options: props.options,
        pathSeparator: props.pathSeparator
      },
      props.enableNodePath
    );
    this.state = {
      value,
      valueSet: new Set(value),
      flattenedOptions: [],
      inputValue: '',
      addingParent: null,
      isAdding: false,
      isEditing: false,
      editingItem: null,
      dropIndicator: undefined,
      virtualHeight: 0,
      itemHeight: 0
    };

    this.syncUnFolded(props, undefined, true);
    this.flattenOptions(props, true);
  }

  componentDidMount() {
    const {enableNodePath} = this.props;

    // onRef只有渲染器的情况才会使用
    this.props.onRef?.(this);
    enableNodePath && this.expandLazyLoadNodes();

    let treeElement: HTMLElement = this.root.current!;
    treeElement =
      treeElement?.parentElement?.matches('.cxd-TreeControl') &&
      treeElement.parentElement.childElementCount === 1
        ? treeElement.parentElement
        : treeElement;

    this.unSensor = resizeSensor(
      treeElement,
      this.handleVirtualHeight,
      false,
      'height'
    );
  }

  componentDidUpdate(
    prevProps: TreeSelectorProps,
    prevState: TreeSelectorState
  ) {
    const props = this.props;
    const state = this.state;

    if (prevProps.options !== props.options) {
      this.syncUnFolded(props);
      this.flattenOptions(props);
    }

    if (
      prevProps.value !== props.value ||
      prevProps.options !== props.options
    ) {
      const newValue = value2array(
        props.value,
        {
          multiple: props.multiple,
          delimiter: props.delimiter,
          valueField: props.valueField,
          pathSeparator: props.pathSeparator,
          options: props.options,
          labelField: props.labelField
        },
        props.enableNodePath
      );
      this.setState({
        value: newValue,
        valueSet: new Set(newValue)
      });
    }
  }

  componentWillUnmount(): void {
    // clear data
    this.relations = this.unfolded = this.levels = new WeakMap() as any;

    if (this.unSensor) {
      this.unSensor();
      delete this.unSensor;
    }
  }

  /**
   * 展开懒加载节点的父节点
   */
  expandLazyLoadNodes() {
    const {pathSeparator, onExpandTree, nodePath = []} = this.props;
    const nodePathArr = nodePath.map(path =>
      path ? path.toString().split(pathSeparator) : []
    );
    onExpandTree?.(nodePathArr);
  }

  @autobind
  virtualListRefSetter(ref: HTMLDivElement | null) {
    this.virtualListRef = ref;
    ref && this.handleVirtualHeight();
  }

  syncUnFolded(
    props: TreeSelectorProps,
    unfoldedLevel?: number,
    initial?: boolean
  ) {
    // 传入默认展开层级需要重新初始化unfolded
    let initFoldedLevel = typeof unfoldedLevel !== 'undefined';
    let expandLevel = Number(
      initFoldedLevel ? unfoldedLevel : props.unfoldedLevel
    );

    // 初始化树节点的展开状态
    let unfolded = this.unfolded;
    const {deferField, foldedField, unfoldedField} = this.props;

    eachTree(props.options, (node: Option, index, level) => {
      if (unfolded.has(node) && !initFoldedLevel) {
        return;
      }

      if (node.children && node.children.length) {
        let ret: any = true;

        if (
          node[deferField] &&
          node.loaded &&
          !initFoldedLevel &&
          unfoldedField &&
          node[unfoldedField] !== false
        ) {
          ret = true;
        } else if (
          unfoldedField &&
          typeof node[unfoldedField] !== 'undefined'
        ) {
          ret = !!node[unfoldedField];
        } else if (foldedField && typeof node[foldedField] !== 'undefined') {
          ret = !node[foldedField];
        } else {
          ret = !!props.initiallyOpen && !initFoldedLevel;
          if (!ret && level <= (expandLevel as number)) {
            ret = true;
          }
        }
        unfolded.set(node, ret);
      }
    });

    initFoldedLevel && this.forceUpdate();
    this.flattenOptions(undefined, initial);
    return unfolded;
  }

  @autobind
  toggleUnfolded(node: any) {
    const unfolded = this.unfolded;
    const {deferField, onDeferLoad, unfoldedField} = this.props;

    if (node[deferField] && !node.loaded) {
      onDeferLoad?.(node);
      return;
    }
    // ！ hack: 在node上直接添加属性，options 在更新的时候旧的字段会保留
    if (node[deferField] && node.loaded) {
      node[unfoldedField] = !unfolded.get(node);
    }

    unfolded.set(node, !unfolded.get(node));
    this.flattenOptions();
    this.forceUpdate();
  }

  isUnfolded(node: any): boolean {
    const unfolded = this.unfolded;
    const parent = this.relations.get(node);
    if (parent) {
      return !!unfolded.get(node) && this.isUnfolded(parent);
    }
    return !!unfolded.get(node);
  }

  @autobind
  clearSelect() {
    this.setState(
      {
        value: []
      },
      () => {
        const {joinValues, rootValue, onChange} = this.props;

        onChange(joinValues ? rootValue : []);
      }
    );
  }

  /**
   * enableNodePath为true时，将label和value转换成node path格式
   */
  transform2NodePath(value: any) {
    const {
      multiple,
      options,
      valueField,
      labelField,
      joinValues,
      extractValue,
      pathSeparator,
      delimiter
    } = this.props;

    const nodesValuePath: string[] = [];
    const selectedNodes = Array.isArray(value) ? value.concat() : [value];
    const selectedNodesPath = selectedNodes.map(node => {
      const nodePath = getTreeAncestors(options, node, true)?.reduce(
        (acc, node) => {
          acc[labelField as string].push(node[labelField as string]);
          acc[valueField as string].push(node[valueField as string]);
          return acc;
        },
        {[labelField as string]: [], [valueField as string]: []}
      );
      const nodeValuePath = nodePath[valueField as string].join(pathSeparator);

      nodesValuePath.push(nodeValuePath);
      return {
        ...node,
        [labelField]: nodePath[labelField as string].join(pathSeparator),
        [valueField]: nodeValuePath
      };
    });

    if (multiple) {
      return joinValues
        ? nodesValuePath.join(delimiter)
        : extractValue
        ? nodesValuePath
        : selectedNodesPath;
    } else {
      return joinValues || extractValue
        ? selectedNodesPath[0][valueField]
        : selectedNodesPath[0];
    }
  }

  @autobind
  handleSelect(node: any, value?: any) {
    const {
      joinValues,
      valueField,
      deferField,
      onChange,
      enableNodePath,
      onlyLeaf
    } = this.props;

    if (node[valueField as string] === undefined) {
      if (node[deferField] && !node.loaded) {
        this.toggleUnfolded(node);
      }
      return;
    }

    if (onlyLeaf && Array.isArray(node.children) && node.children.length) {
      return;
    }

    this.setState(
      {
        value: [node]
      },
      () => {
        onChange(
          enableNodePath
            ? this.transform2NodePath(node)
            : joinValues
            ? node[valueField as string]
            : node
        );
      }
    );
  }

  @autobind
  handleItemClick(node: any, checked: boolean) {
    const {onHandleNodeClick, multiple, nodeBehavior = ['check']} = this.props;

    onHandleNodeClick && onHandleNodeClick(node);

    if (nodeBehavior?.includes('unfold') && node.children?.length) {
      this.toggleUnfolded(node);
    }

    if (nodeBehavior?.includes('check')) {
      multiple ? this.handleCheck(node, !checked) : this.handleSelect(node);
    }
  }

  @autobind
  handleCheck(item: any, checked: boolean) {
    // TODO: 重新梳理这里的逻辑
    const props = this.props;
    const value = this.state.valueSet;
    const {
      onlyChildren,
      withChildren,
      cascade,
      autoCheckChildren,
      autoCancelParent,
      valueField
    } = props;
    if (checked) {
      if (!value.has(item)) {
        value.add(item);
      }
      // cascade 为 true 表示父节点跟子节点没有级联关系。
      if (autoCheckChildren) {
        const children = item.children ? [...item.children] : [];
        const hasDisabled = flattenTree(children).some(item => item?.disabled);

        if (onlyChildren) {
          // 这个 isAllChecked 主要是判断如果有disabled的item项，这时父节点还是选中的话，针对性的处理逻辑
          const isAllChecked = flattenTreeWithLeafNodes(children)
            .filter(item => !item?.disabled)
            .every(v => value.has(v));
          // 父级选中的时候，子节点也都选中，但是自己不选中
          if (value.has(item) && children.length) {
            value.delete(item);
          }

          while (children.length) {
            let child = children.shift();

            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
              continue;
            }

            if (hasDisabled && isAllChecked) {
              if (
                value.has(child) &&
                child.value !== 'undefined' &&
                !child?.disabled
              ) {
                value.delete(child);
              }
              continue;
            }

            if (
              !value.has(child) &&
              child.value !== 'undefined' &&
              !child?.disabled
            ) {
              value.add(child);
            }
          }
        } else {
          // 这个 isAllChecked 主要是判断如果有disabled的item项，这时父节点还是选中的话，针对性的处理逻辑
          const isAllChecked = flattenTree(children)
            .filter(item => !item?.disabled)
            .every(v => value.has(v));

          // 只要父节点选择了,子节点就不需要了,全部去掉勾选.  withChildren时相反
          while (children.length) {
            let child = children.shift();

            if (child?.disabled) {
              continue;
            }

            // 判断下下面是否有禁用项
            if (!hasDisabled) {
              if (value.has(child)) {
                value.delete(child);
              }

              if (withChildren || cascade) {
                value.add(child);
              }
            } else {
              isAllChecked ? value.delete(child) : value.add(child);
            }

            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            }
          }

          let toCheck = item;

          while (true) {
            const parent = getTreeParent(props.options, toCheck);
            // 判断 parent 节点是否已经勾选，避免重复值
            if (parent?.[valueField || 'value'] && !value.has(parent)) {
              // 如果所有孩子节点都勾选了，应该自动勾选父级。

              if (parent.children.every((child: any) => value.has(child))) {
                if (!cascade && !withChildren) {
                  parent.children.forEach((child: any) => {
                    if (value.has(child)) {
                      value.delete(child);
                    }
                  });
                }
                value.add(parent);
                toCheck = parent;
                continue;
              }
            }
            break;
          }
        }
      }
    } else {
      value.has(item) && value.delete(item);
      if (autoCheckChildren) {
        if (cascade || withChildren || onlyChildren) {
          const children = item.children ? [...item.children] : [];
          while (children.length) {
            let child = children.shift();
            if (value.has(child) && !child?.disabled) {
              value.delete(child);
            }
            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            }
          }
        }
      }

      if (autoCancelParent && cascade) {
        let toCheck = item;
        while (true) {
          const parent = getTreeParent(props.options, toCheck);
          //判断 parent 节点是否已经勾选
          if (value.has(parent)) {
            //当有一个子节点取消时要去掉父节点，也要去掉父节点的父节点，直至最外层
            value.delete(parent);
            toCheck = parent;
            continue;
          }
          break;
        }
      }
    }

    this.setState(
      {
        value: [...value]
      },
      () => this.fireChange([...value])
    );
  }

  fireChange(value: Option[]) {
    const {
      joinValues,
      extractValue,
      valueField,
      delimiter,
      onChange,
      enableNodePath
    } = this.props;

    onChange(
      enableNodePath
        ? this.transform2NodePath(value)
        : joinValues
        ? value.map(item => item[valueField as string]).join(delimiter)
        : extractValue
        ? value.map(item => item[valueField as string])
        : value
    );
  }

  @autobind
  handleAdd(parent: Option | null = null) {
    const {bultinCUD, onAdd, options} = this.props;

    if (!bultinCUD) {
      const idxes = findTreeIndex(options, item => item === parent) || [];
      return onAdd && onAdd(idxes.concat(0));
    } else {
      this.setState(
        {
          isEditing: false,
          isAdding: true,
          addingParent: parent
        },
        () => {
          if (!parent) {
            return;
          }

          const result = [] as Option[];

          for (let option of this.state.flattenedOptions) {
            result.push(option);
            if (option === parent) {
              const insert = {isAdding: true};
              this.levels.set(insert, (this.levels.get(option) || 0) + 1);
              result.push(insert);
            }
          }
          this.setState({flattenedOptions: result});
        }
      );
    }
  }

  @autobind
  handleEdit(item: Option) {
    const {bultinCUD, onEdit, labelField, options} = this.props;

    if (!bultinCUD) {
      onEdit?.(item);
    } else {
      this.setState({
        isEditing: true,
        isAdding: false,
        editingItem: item,
        inputValue: item[labelField]
      });
    }
  }

  @autobind
  handleRemove(item: Option) {
    const {onDelete} = this.props;

    onDelete && onDelete(item);
  }

  @autobind
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      inputValue: e.currentTarget.value
    });
  }

  @autobind
  handleConfirm() {
    const {
      inputValue: value,
      isAdding,
      addingParent,
      editingItem,
      isEditing
    } = this.state;

    if (!value) {
      return;
    }
    const {labelField, onAdd, options, onEdit} = this.props;
    this.setState(
      {
        inputValue: '',
        isAdding: false,
        isEditing: false
      },
      () => {
        if (isAdding && onAdd) {
          const idxes =
            (addingParent &&
              findTreeIndex(options, item => item === addingParent)) ||
            [];
          onAdd(idxes.concat(0), {[labelField]: value}, true);
        } else if (isEditing && onEdit) {
          onEdit(
            {
              ...editingItem,
              [labelField]: value
            },
            editingItem!,
            true
          );
        }
      }
    );
  }

  @autobind
  handleCancel() {
    const {flattenedOptions} = this.state;
    const flattenedOptionsWithoutAdding = flattenedOptions.filter(
      item => !item.isAdding
    );
    this.setState({
      inputValue: '',
      isAdding: false,
      isEditing: false,
      flattenedOptions: flattenedOptionsWithoutAdding
    });
  }

  renderInput(prfix: JSX.Element | null = null, testIdBuilder?: TestIdBuilder) {
    const {classnames: cx, mobileUI, translate: __} = this.props;
    const {inputValue} = this.state;

    return (
      <div
        className={cx('Tree-itemLabel', {
          'is-mobile': mobileUI
        })}
      >
        <div
          className={cx('Tree-itemInput', {
            'is-mobile': mobileUI
          })}
        >
          {prfix}
          <input
            onChange={this.handleInputChange}
            value={inputValue}
            placeholder={__('placeholder.enter')}
            {...testIdBuilder?.getChild('input').getTestId()}
          />
          <a
            data-tooltip={__('cancel')}
            onClick={this.handleCancel}
            {...testIdBuilder?.getChild('cancel').getTestId()}
          >
            <Icon icon="close" className="icon" />
          </a>
          <a
            data-tooltip={__('confirm')}
            onClick={this.handleConfirm}
            {...testIdBuilder?.getChild('confirm').getTestId()}
          >
            <Icon icon="check" className="icon" />
          </a>
        </div>
      </div>
    );
  }

  getOffsetPosition(element: HTMLElement) {
    let left = 0;
    let top = 0;

    while (element.offsetParent) {
      left += element.offsetLeft;
      top += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    }
    return {left, top};
  }

  @autobind
  getDropInfo(e: React.DragEvent<Element>, node: Option): IDropInfo {
    let rect = e.currentTarget.getBoundingClientRect();
    const dragNode = this.dragNode;
    const deltaX = Math.min(50, rect.width * 0.3);
    const gap = node?.children?.length ? 0 : 16;

    // 计算相对位置
    let offset = this.getOffsetPosition(this.root.current!);
    let targetOffset = this.getOffsetPosition(e.currentTarget as HTMLElement);
    let left = targetOffset.left - offset.left;
    let top = targetOffset.top - offset.top;

    let {clientX, clientY} = e;
    let position: IDropInfo['position'] =
      clientY >= rect.top + rect.height / 2 ? 'bottom' : 'top';
    let indicator;
    if (position === 'bottom' && clientX >= this.startPoint.x + deltaX) {
      position = 'self';
      indicator = {
        top: top,
        left: left,
        width: rect.width,
        height: rect.height
      };
    } else {
      indicator = {
        top: position === 'bottom' ? top + rect.height : top,
        left: left + gap,
        width: rect.width - gap
      };
    }

    return {
      node,
      dragNode,
      position,
      indicator
    };
  }

  @autobind
  updateDropIndicator(e: React.DragEvent<Element>, node: Option) {
    // const gap = node?.children?.length ? 0 : 16;
    this.dropInfo = this.getDropInfo(e, node);
    let {dragNode, indicator} = this.dropInfo;
    if (node === dragNode) {
      this.setState({dropIndicator: undefined});
      return;
    }
    this.setState({
      dropIndicator: indicator
    });
  }

  @autobind
  onDragStart(node: Option) {
    let draggable = this.props.draggable;
    return (e: React.DragEvent<Element>) => {
      if (draggable) {
        e.dataTransfer.effectAllowed = 'copyMove';

        this.dragNode = node;
        this.dropInfo = null;
        this.startPoint = {
          x: e.clientX,
          y: e.clientY
        };

        if (node?.children?.length) {
          this.unfolded.set(node, false);
          this.flattenOptions();
          this.forceUpdate();
        }
      } else {
        this.dragNode = null;
        this.dropInfo = null;
      }
      e.stopPropagation();
    };
  }

  @autobind
  onDragOver(node: Option) {
    return (e: React.DragEvent<Element>) => {
      if (!this.dragNode) {
        return;
      }
      this.updateDropIndicator(e, node);
      e.preventDefault();
    };
  }

  @autobind
  onDragEnd(dragNode: Option) {
    return (e: React.DragEvent<Element>) => {
      this.setState({
        dropIndicator: undefined
      });
      let node = this.dropInfo?.node;
      if (!this.dropInfo || !node || dragNode === node) {
        return;
      }
      this.props.onMove?.(this.dropInfo);
      this.dragNode = null;
      this.dropInfo = null;
      e.preventDefault();
    };
  }

  /**
   * 将树形接口转换为平铺结构，以支持虚拟列表
   * TODO: this.unfolded => reaction 更加合理
   */
  flattenOptions(
    props?: TreeSelectorProps,
    initial?: boolean
  ): void | Option[] {
    let flattenedOptions: Option[] = [];

    eachTree(
      props?.options || this.props.options,
      (item, index, level, paths: Option[]) => {
        const parent = paths[paths.length - 1];
        if (!isVisible(item)) {
          return;
        }
        this.levels.set(item, level);
        parent && this.relations.set(item, parent);
        if (paths.length === 0) {
          // 父节点
          flattenedOptions.push(item);
        } else if (this.isUnfolded(parent)) {
          // 父节点是展开的状态
          flattenedOptions.push(item);
        }
      }
    );
    if (initial) {
      // 初始化
      this.state = {...this.state, flattenedOptions};
    } else {
      this.setState({
        flattenedOptions: flattenedOptions
      });
    }
  }

  /**
   * 判断父元素是否勾选
   * TODO: 递归可能需要优化
   */
  isParentChecked(item?: Option): boolean {
    if (!item || !this.relations.get(item)) {
      return false;
    }

    const {valueSet} = this.state;
    let currentItem = item;
    while (currentItem) {
      const itemParent = this.relations.get(currentItem);
      if (!itemParent) {
        return false;
      }
      if (valueSet.has(itemParent)) {
        return true;
      }
      currentItem = itemParent;
    }

    return false;
  }

  /**
   * 判断 子元素 是否全部选中
   */
  isItemChildrenChecked(item: Option) {
    if (!item || !item.children) {
      return true;
    }
    return !item.children.some(child => !this.isItemChecked(child));
  }

  /**
   * 判断子元素 部分勾选
   */
  isItemChildrenPartialChecked(item: Option, checked: boolean): boolean {
    if (!item || !item.children || checked) {
      return false;
    }
    let checkedLength = 0;
    let partialChildrenLength = 0;
    for (const child of item.children) {
      if (this.isItemChecked(child)) {
        checkedLength++;
      } else if (this.isItemChildrenPartialChecked(child, false)) {
        partialChildrenLength++;
      }
    }

    return checkedLength !== 0 || partialChildrenLength !== 0;
  }

  /**
   * 判断元素是否选中：checked
   */
  isItemChecked(item?: Option): boolean {
    if (!item) {
      return false;
    }

    const {autoCheckChildren, onlyChildren, multiple, withChildren, cascade} =
      this.props;
    const {valueSet} = this.state;
    const checked = valueSet.has(item);

    if (checked) {
      return true;
    }

    if (item.children?.length) {
      if (onlyChildren && autoCheckChildren) {
        if (this.isItemChildrenChecked(item)) {
          // 当前元素没有在 value 中，但是子组件全部勾选了
          return true;
        }
      }
    }
    const itemParent = this.relations.get(item);
    if (itemParent && multiple && autoCheckChildren) {
      // 当前节点为子节点
      if (withChildren || cascade) {
        return false;
      }
      return this.isParentChecked(item);
    }

    // 判断父组件是否勾选
    return false;
  }

  /**
   * item 是否 disabled 状态
   * props.disabled === true return;
   *
   */
  isItemDisabled(item: Option, checked: boolean) {
    const {
      disabledField,
      disabled,
      autoCheckChildren,
      valueField,
      multiple,
      maxLength,
      minLength,
      cascade,
      onlyChildren
    } = this.props;
    const {value} = this.state;
    const selfDisabled = item[disabledField];
    const nodeDisabled =
      !!disabled ||
      selfDisabled ||
      (multiple && !autoCheckChildren && !item[valueField]);

    if (nodeDisabled) {
      return true;
    }

    if (
      (maxLength && !checked && value.length >= maxLength) ||
      (minLength && checked && value.length <= minLength)
    ) {
      return true;
    }

    const itemParent = this.relations.get(item);

    if (autoCheckChildren && multiple && checked && itemParent) {
      if (!this.isItemChecked(itemParent)) {
        return false;
      }
      // 子节点
      if (onlyChildren) {
        return false;
      }
      return !cascade;
    }

    return false;
  }

  @autobind
  renderItem({
    index,
    style,
    ...rest
  }: {
    index: number;
    style?: Record<string, any>;
    ref?: (node: HTMLElement | null) => void;
  }) {
    const {
      itemClassName,
      showIcon,
      showRadio,
      multiple,
      labelField,
      iconField,
      deferField,
      cascade,
      classnames: cx,
      highlightTxt,
      creatable,
      editable,
      removable,
      createTip,
      editTip,
      removeTip,
      translate: __,
      itemRender,
      draggable,
      loadingConfig,
      enableDefaultIcon,
      valueField,
      mobileUI,
      testIdBuilder,
      itemActionsRender,
      actionClassName
    } = this.props;

    const item = this.state.flattenedOptions[index];

    if (!item) {
      return null;
    }

    const {isAdding, editingItem, isEditing} = this.state;

    const checked = this.isItemChecked(item);
    const disabled = this.isItemDisabled(item, checked);
    const partial = this.isItemChildrenPartialChecked(item, checked);
    const checkedInValue = !!~this.state.value.indexOf(item);
    const itemTestBuilder = testIdBuilder?.getChild(
      `item-${item[valueField] || item[labelField] || index}`
    );

    const checkbox: JSX.Element | null = multiple ? (
      <Checkbox
        size="sm"
        disabled={disabled}
        checked={checked || partial}
        partial={partial}
        onChange={this.handleCheck.bind(this, item, !checked)}
        testIdBuilder={itemTestBuilder?.getChild('chekbx')}
      />
    ) : showRadio ? (
      <Checkbox
        size="sm"
        disabled={disabled}
        checked={checked}
        onChange={this.handleSelect.bind(this, item)}
        testIdBuilder={itemTestBuilder?.getChild('chekbx')}
      />
    ) : null;

    const isLeaf =
      (!item.children || !item.children.length) && !item.placeholder;
    const iconValue =
      item[iconField] ||
      (enableDefaultIcon !== false
        ? (Array.isArray(item.children) && item.children.length) ||
          item[deferField]
          ? 'folder'
          : 'file'
        : false);
    const level = this.levels.has(item) ? this.levels.get(item)! - 1 : 0;

    let body = null;

    if (isEditing && editingItem === item) {
      body = this.renderInput(checkbox, itemTestBuilder?.getChild('edit'));
    } else if (item.isAdding) {
      body = this.renderInput(
        <span className={cx('Tree-itemArrowPlaceholder')} />,
        itemTestBuilder?.getChild('add')
      );
    } else {
      const isFolded = !this.isUnfolded(item);
      body = (
        <div
          className={cx('Tree-itemLabel', {
            'is-children-checked':
              multiple &&
              !cascade &&
              this.isItemChildrenChecked(item) &&
              !disabled,
            'is-checked': checkedInValue,
            'is-disabled': disabled
          })}
          draggable={draggable}
          onDragStart={this.onDragStart(item)}
          onDragOver={this.onDragOver(item)}
          onDragEnd={this.onDragEnd(item)}
        >
          {draggable && (
            <a
              className={cx('Tree-itemDrager drag-bar')}
              {...itemTestBuilder?.getChild('drag-bar').getTestId()}
            >
              <Icon icon="drag-bar" className="icon" />
            </a>
          )}

          {item.loading ? (
            <Spinner
              size="sm"
              show
              icon="reload"
              spinnerClassName={cx('Tree-spinner')}
              loadingConfig={loadingConfig}
            />
          ) : !isLeaf || (item[deferField] && !item.loaded) ? (
            <div
              onClick={() => this.toggleUnfolded(item)}
              className={cx('Tree-itemArrow', {
                'is-folded': isFolded
              })}
              {...itemTestBuilder
                ?.getChild(isFolded ? 'open' : 'fold')
                .getTestId()}
            >
              <Icon icon="down-arrow-bold" className="icon" />
            </div>
          ) : (
            <span className={cx('Tree-itemArrowPlaceholder')} />
          )}

          {checkbox}

          <div
            className={cx('Tree-itemLabel-item', {'is-mobile': mobileUI})}
            {...itemTestBuilder?.getChild('content').getTestId()}
            onClick={() => !disabled && this.handleItemClick(item, checked)}
          >
            {showIcon ? (
              <i
                className={cx(
                  `Tree-itemIcon ${
                    (Array.isArray(item.children) && item.children.length) ||
                    item[deferField]
                      ? 'Tree-folderIcon'
                      : 'Tree-leafIcon'
                  }`
                )}
              >
                {iconValue ? <Icon icon={iconValue} className="icon" /> : null}
              </i>
            ) : null}

            <span
              className={cx('Tree-itemText')}
              title={item[labelField]}
              {...itemTestBuilder?.getChild('text').getTestId()}
            >
              {itemRender
                ? itemRender(item, {
                    index,
                    multiple: multiple,
                    checked: checked,
                    labelField: labelField,
                    onChange: () => this.handleCheck(item, !checked),
                    disabled: disabled || item.disabled,
                    classnames: cx
                  })
                : highlightTxt
                ? highlight(`${item[labelField]}`, highlightTxt)
                : `${item[labelField]}`}
            </span>

            {!disabled && !isAdding && !isEditing ? (
              <div
                className={cx('Tree-item-icons', actionClassName)}
                onClick={e => e.stopPropagation()}
              >
                {creatable &&
                !(item[deferField] && !item.loaded) &&
                hasAbility(item, 'creatable') ? (
                  <TooltipWrapper
                    placement={'bottom'}
                    tooltip={__(createTip)}
                    trigger={'hover'}
                    tooltipTheme="dark"
                  >
                    <a
                      onClick={this.handleAdd.bind(this, item)}
                      {...itemTestBuilder?.getChild('add').getTestId()}
                    >
                      <Icon icon="plus" className="icon" />
                    </a>
                  </TooltipWrapper>
                ) : null}

                {removable && hasAbility(item, 'removable') ? (
                  <TooltipWrapper
                    placement={'bottom'}
                    tooltip={__(removeTip)}
                    trigger={'hover'}
                    tooltipTheme="dark"
                  >
                    <a
                      onClick={this.handleRemove.bind(this, item)}
                      {...itemTestBuilder?.getChild('remove').getTestId()}
                    >
                      <Icon icon="minus" className="icon" />
                    </a>
                  </TooltipWrapper>
                ) : null}

                {editable && hasAbility(item, 'editable') ? (
                  <TooltipWrapper
                    placement={'bottom'}
                    tooltip={__(editTip)}
                    trigger={'hover'}
                    tooltipTheme="dark"
                  >
                    <a
                      onClick={this.handleEdit.bind(this, item)}
                      {...itemTestBuilder?.getChild('edit').getTestId()}
                    >
                      <Icon icon="new-edit" className="icon" />
                    </a>
                  </TooltipWrapper>
                ) : null}

                {itemActionsRender && (
                  <div className={cx('Tree-itemActions')}>
                    {itemActionsRender(item, {
                      ...item,
                      index,
                      multiple: multiple,
                      checked: checked,
                      labelField: labelField,
                      onChange: () => this.handleCheck(item, !checked),
                      disabled: disabled || item.disabled,
                      classnames: cx
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <li
        {...rest}
        key={`${item[valueField || 'value']}-${index}`}
        className={cx(`Tree-item ${itemClassName || ''}`, {
          'Tree-item--isLeaf': isLeaf,
          'is-child': this.relations.get(item)
        })}
        style={
          {
            ...style,
            '--Tree-depth': level
          } as any
        }
        {...itemTestBuilder?.getTestId()}
      >
        {body}
      </li>
    );
  }

  isEmptyOrNotExist(obj: any) {
    return obj === '' || obj === undefined || obj === null;
  }

  getAvailableOptions() {
    const {options, onlyChildren, valueField} = this.props;
    const flattendOptions = flattenTree(options, item =>
      onlyChildren
        ? item.children?.length
          ? null
          : item
        : this.isEmptyOrNotExist(item[valueField || 'value'])
        ? null
        : item
    ).filter(a => a && !a.disabled);

    return flattendOptions as Option[];
  }

  @autobind
  handleCheckAll(availableOptions: Option[], checkedAll: boolean) {
    this.setState(
      {
        value: checkedAll ? [] : availableOptions
      },
      () => this.fireChange(checkedAll ? [] : availableOptions)
    );
  }

  @autobind
  handleToggle(bool?: boolean) {
    const availableOptions = this.getAvailableOptions();
    if (bool === undefined) {
      const checkedAll = availableOptions.every(option =>
        this.isItemChecked(option)
      );
      this.handleCheckAll(availableOptions, checkedAll);
      return;
    }
    this.handleCheckAll(availableOptions, bool);
  }

  renderCheckAll() {
    const {
      multiple,
      checkAll,
      checkAllLabel,
      classnames: cx,
      translate: __,
      disabled,
      mobileUI
    } = this.props;

    if (!multiple || !checkAll) {
      return null;
    }

    const availableOptions = this.getAvailableOptions();

    const checkedAll = availableOptions.every(option =>
      this.isItemChecked(option)
    );
    const checkedPartial = availableOptions.some(option =>
      this.isItemChecked(option)
    );

    return (
      <div
        className={cx('Tree-itemLabel')}
        onClick={() => this.handleCheckAll(availableOptions, checkedAll)}
      >
        <Checkbox
          size="sm"
          disabled={disabled}
          checked={checkedPartial}
          partial={checkedPartial && !checkedAll}
        />

        <div
          className={cx('Tree-itemLabel-item', {
            'is-mobile': mobileUI
          })}
        >
          <span className={cx('Tree-itemText')}>{__(checkAllLabel)}</span>
        </div>
      </div>
    );
  }

  @autobind
  styleGetter(node: HTMLElement | null) {
    node && this.setState({itemHeight: node?.offsetHeight || 0});
  }

  @autobind
  renderList(list: Options) {
    const {virtualThreshold} = this.props;
    const {virtualHeight, itemHeight} = this.state;
    if (virtualThreshold && list.length > virtualThreshold) {
      return itemHeight ? (
        <div ref={this.virtualListRefSetter}>
          <VirtualList
            height={virtualHeight}
            itemCount={list.length}
            prefix={this.renderCheckAll()}
            itemSize={itemHeight}
            renderItem={this.renderItem}
          />
        </div>
      ) : (
        this.renderItem({index: 0, ref: this.styleGetter})
      );
    }

    return (
      <>
        {this.renderCheckAll()}
        {list.map((item, index) => this.renderItem({index}))}
      </>
    );
  }

  @autobind
  handleVirtualHeight() {
    const {virtualThreshold} = this.props;
    const {flattenedOptions, itemHeight} = this.state;

    if (virtualThreshold && flattenedOptions.length > virtualThreshold) {
      // tree 对应元素
      let treeElement: HTMLElement = this.root.current!;

      if (
        !this.virtualListRef ||
        (!treeElement.offsetHeight && !treeElement.offsetWidth)
      ) {
        return;
      }

      treeElement =
        treeElement?.parentElement?.matches('.cxd-TreeControl') &&
        treeElement.parentElement.childElementCount === 1
          ? treeElement.parentElement
          : treeElement;

      const styles = getComputedStyle(treeElement);
      let offsetHeight = 0;
      if (styles.flexGrow !== '0') {
        // 当配置了成了动态高度时，根据实际高度来
        offsetHeight = treeElement.offsetHeight;
      } else {
        offsetHeight = itemHeight * flattenedOptions.length;
      }
      const virtualElement = this.virtualListRef!;

      // 通常时外围设置了 maxHeight
      if (
        virtualElement.offsetHeight &&
        virtualElement.offsetHeight > treeElement.offsetHeight
      ) {
        offsetHeight = treeElement.offsetHeight;
      }

      // 虚拟列表 对应元素
      // todo 去支持外部滚动也支持虚拟滚动的场景，目前不支持，所以只能让高度最大，其实就没启动虚拟滚动
      // 目前只有没有配置  heightAuto 的时候
      // 或者配置了 flexGrow 的时候，才会有虚拟滚动的效果

      const virtualHeight =
        offsetHeight - calculateHeight(treeElement, virtualElement);

      this.setState({virtualHeight: virtualHeight});
    }
  }

  render() {
    const {
      className,
      placeholder,
      hideRoot,
      rootLabel,
      showOutline,
      showIcon,
      classnames: cx,
      creatable,
      rootCreatable,
      rootCreateTip,
      disabled,
      draggable,
      translate: __,
      testIdBuilder,
      actionClassName,
      height
    } = this.props;
    const {
      value,
      isAdding,
      addingParent,
      isEditing,
      dropIndicator,
      flattenedOptions
    } = this.state;

    let addBtn = null;

    if (creatable && rootCreatable !== false && hideRoot) {
      addBtn = (
        <a
          className={cx('Tree-addTopBtn', {
            'is-disabled': isAdding || isEditing
          })}
          onClick={this.handleAdd.bind(this, null)}
          {...testIdBuilder?.getChild('add').getTestId()}
        >
          <Icon icon="plus" className="icon" />
          <span>{__(rootCreateTip)}</span>
        </a>
      );
    }

    let style = {};
    if (height && height > 0) {
      style = {
        height: `${height}px`,
        maxHeight: 'none'
      };
    }

    return (
      <div
        className={cx(`Tree ${className || ''}`, {
          'Tree--outline': showOutline,
          'is-disabled': disabled,
          'is-draggable': draggable
        })}
        style={style}
        ref={this.root}
        {...testIdBuilder?.getTestId()}
      >
        {(flattenedOptions && flattenedOptions.length) ||
        addBtn ||
        hideRoot === false ? (
          <ul className={cx('Tree-list')}>
            {hideRoot ? (
              <>
                {addBtn}
                {isAdding && !addingParent ? (
                  <li className={cx('Tree-item')}>{this.renderInput()}</li>
                ) : null}

                {this.renderList(flattenedOptions)}
              </>
            ) : (
              <li
                className={cx('Tree-rootItem', {
                  'is-checked': !value || !value.length
                })}
              >
                <div className={cx('Tree-itemLabel')}>
                  <span
                    className={cx('Tree-itemText')}
                    onClick={this.clearSelect}
                    {...testIdBuilder?.getChild(`root-item`).getTestId()}
                  >
                    {showIcon ? (
                      <i className={cx('Tree-itemIcon Tree-rootIcon')}>
                        <Icon icon="home" className="icon" />
                      </i>
                    ) : null}
                    {rootLabel}
                  </span>
                  {!disabled &&
                  creatable &&
                  rootCreatable !== false &&
                  !isAdding &&
                  !isEditing ? (
                    <div className={cx('Tree-item-icons', actionClassName)}>
                      {creatable ? (
                        <a
                          onClick={this.handleAdd.bind(this, null)}
                          data-tooltip={rootCreateTip}
                          data-position="left"
                          {...testIdBuilder?.getChild(`root-add`).getTestId()}
                        >
                          <Icon icon="plus" className="icon" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <ul className={cx('Tree-sublist')}>
                  {isAdding && !addingParent ? (
                    <li className={cx('Tree-item')}>{this.renderInput()}</li>
                  ) : null}
                  {this.renderList(flattenedOptions)}
                </ul>
              </li>
            )}
          </ul>
        ) : (
          <div className={cx('Tree-placeholder')}>{placeholder}</div>
        )}

        {dropIndicator && (
          <div
            className={cx('Tree-dropIndicator', {
              'Tree-dropIndicator--hover': !!dropIndicator.height
            })}
            style={dropIndicator}
          />
        )}
      </div>
    );
  }
}

export default themeable(localeable(TreeSelector));
