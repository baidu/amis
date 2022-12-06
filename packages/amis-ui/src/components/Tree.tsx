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
  getTreeAncestors
} from 'amis-core';
import {Option, Options, value2array} from './Select';
import {themeable, ThemeProps, highlight} from 'amis-core';
import {Icon, getIcon} from './icons';
import Checkbox from './Checkbox';
import {LocaleProps, localeable} from 'amis-core';
import Spinner from './Spinner';
import {ItemRenderStates} from './Selection';
import VirtualList from './virtual-list';

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

interface TreeSelectorProps extends ThemeProps, LocaleProps {
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

  /*
   * 该属性代表数据级联关系，autoCheckChildren为true时生效，默认为false，具体数据级联关系如下：
   * 1.cascade 为false，ui行为为级联选中子节点，子节点禁用；值只包含父节点的值
   * 2.cascade为false，withChildren为true，ui行为为级联选中子节点，子节点禁用；值包含父子节点的值
   * 3.cascade为true，ui行为级联选中子节点，子节点可反选，值包含父子节点的值，此时withChildren属性失效
   * 4.cascade不论为true还是false，onlyChildren为true，ui行为级联选中子节点，子节点可反选，值只包含子节点的值
   */
  cascade?: boolean;

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
  itemHeight?: number;
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
}

interface TreeSelectorState {
  value: Array<any>;
  inputValue: string;
  addingParent: Option | null;
  isAdding: boolean;
  isEditing: boolean;
  editingItem: Option | null;

  // 拍平的 Option list
  flattenedOptions: Option[];

  // 拖拽指示器
  dropIndicator?: IDropIndicator;
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
    itemHeight: 32
  };
  // 展开的节点
  unfolded: WeakMap<Object, boolean> = new WeakMap();
  // key: child option, value: parent option;
  relations: WeakMap<Option, Option> = new WeakMap();

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

  constructor(props: TreeSelectorProps) {
    super(props);
    this.state = {
      value: value2array(
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
      ),
      flattenedOptions: [],
      inputValue: '',
      addingParent: null,
      isAdding: false,
      isEditing: false,
      editingItem: null,
      dropIndicator: undefined
    };

    this.syncUnFolded(props);
  }

  componentDidMount() {
    const {enableNodePath} = this.props;

    // onRef只有渲染器的情况才会使用
    this.props.onRef?.(this);
    // 初始化
    this.flattenOptions();
    enableNodePath && this.expandLazyLoadNodes();
  }

  componentDidUpdate(prevProps: TreeSelectorProps) {
    const props = this.props;

    if (prevProps.options !== props.options) {
      this.syncUnFolded(props);
    }

    if (
      prevProps.value !== props.value ||
      prevProps.options !== props.options
    ) {
      this.setState({
        value: value2array(
          props.value,
          {
            multiple: props.multiple,
            delimiter: props.delimiter,
            valueField: props.valueField,
            options: props.options
          },
          props.enableNodePath
        )
      });
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

  syncUnFolded(props: TreeSelectorProps, unfoldedLevel?: number) {
    // 传入默认展开层级需要重新初始化unfolded
    let initFoldedLevel = typeof unfoldedLevel !== 'undefined';
    let expandLevel =
      Number(initFoldedLevel ? unfoldedLevel : props.unfoldedLevel) - 1;

    // 初始化树节点的展开状态
    let unfolded = this.unfolded;
    const {foldedField, unfoldedField} = this.props;

    eachTree(props.options, (node: Option, index, level) => {
      if (unfolded.has(node) && !initFoldedLevel) {
        return;
      }

      if (node.children && node.children.length) {
        let ret: any = true;

        if (node.defer && node.loaded && !initFoldedLevel) {
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

    this.flattenOptions();
    initFoldedLevel && this.forceUpdate();

    return unfolded;
  }

  @autobind
  toggleUnfolded(node: any) {
    const unfolded = this.unfolded;
    const {onDeferLoad} = this.props;

    if (node.defer && !node.loaded) {
      onDeferLoad?.(node);
      return;
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
    const {joinValues, valueField, onChange, enableNodePath, onlyLeaf} =
      this.props;

    if (node[valueField as string] === undefined) {
      if (node.defer && !node.loaded) {
        this.toggleUnfolded(node);
      }
      return;
    }

    if (onlyLeaf && node.children) {
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
  handleCheck(item: any, checked: boolean) {
    // TODO: 重新梳理这里的逻辑
    const props = this.props;
    const value = this.state.value.concat();
    const idx = value.indexOf(item);
    const {onlyChildren, withChildren, cascade, autoCheckChildren} = props;
    if (checked) {
      ~idx || value.push(item);
      // cascade 为 true 表示父节点跟子节点没有级联关系。
      if (autoCheckChildren) {
        const children = item.children ? item.children.concat([]) : [];
        if (onlyChildren) {
          // 父级选中的时候，子节点也都选中，但是自己不选中
          !~idx && children.length && value.pop();

          while (children.length) {
            let child = children.shift();
            let index = value.indexOf(child);

            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            } else if (!~index && child.value !== 'undefined') {
              value.push(child);
            }
          }
        } else {
          // 只要父节点选择了,子节点就不需要了,全部去掉勾选.  withChildren时相反
          while (children.length) {
            let child = children.shift();
            let index = value.indexOf(child);

            if (~index) {
              value.splice(index, 1);
            }

            if (withChildren || cascade) {
              value.push(child);
            }

            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            }
          }

          let toCheck = item;

          while (true) {
            const parent = getTreeParent(props.options, toCheck);
            if (parent?.value) {
              // 如果所有孩子节点都勾选了，应该自动勾选父级。

              if (
                parent.children.every((child: any) => ~value.indexOf(child))
              ) {
                if (!cascade && !withChildren) {
                  parent.children.forEach((child: any) => {
                    const index = value.indexOf(child);
                    if (~index) {
                      value.splice(index, 1);
                    }
                  });
                }
                value.push(parent);
                toCheck = parent;
                continue;
              }
            }
            break;
          }
        }
      }
    } else {
      ~idx && value.splice(idx, 1);
      if (autoCheckChildren) {
        if (cascade || withChildren || onlyChildren) {
          const children = item.children ? item.children.concat([]) : [];
          while (children.length) {
            let child = children.shift();
            let index = value.indexOf(child);
            if (~index) {
              value.splice(index, 1);
            }
            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            }
          }
        }
      }
    }

    this.setState(
      {
        value
      },
      () => {
        const {
          joinValues,
          extractValue,
          valueField,
          delimiter,
          onChange,
          enableNodePath
        } = props;

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
              result.push({...option, isAdding: true});
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
    this.setState({
      inputValue: '',
      isAdding: false,
      isEditing: false
    });
  }

  renderInput(prfix: JSX.Element | null = null) {
    const {classnames: cx, translate: __} = this.props;
    const {inputValue} = this.state;

    return (
      <div className={cx('Tree-itemLabel')}>
        <div className={cx('Tree-itemInput')}>
          {prfix}
          <input
            onChange={this.handleInputChange}
            value={inputValue}
            placeholder={__('placeholder.enter')}
          />
          <a data-tooltip={__('cancel')} onClick={this.handleCancel}>
            <Icon icon="close" className="icon" />
          </a>
          <a data-tooltip={__('confirm')} onClick={this.handleConfirm}>
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
   * TODO: this.unfolded => reaction 更加合理
   */
  flattenOptions(props?: TreeSelectorProps): void | Option[] {
    let flattenedOptions: Option[] = [];

    eachTree(
      props?.options || this.props.options,
      (item, key, level, paths: Option[]) => {
        const parent = paths[paths.length - 2];
        if (!isVisible(item)) {
          return;
        }
        if (paths.length === 1) {
          // 父节点
          item.key = item.key || key;
          flattenedOptions.push(item);
        } else if (this.isUnfolded(parent)) {
          this.relations.set(item, parent);
          // 父节点是展开的状态
          item.level = level;
          item.key = item.key || `${parent.key}-${key}`;
          flattenedOptions.push(item);
        }
      }
    );
    if (!this.state.flattenedOptions) {
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
    const itemParent = this.relations.get(item);
    const {value} = this.state;
    const checked = !!~value.indexOf(itemParent);

    return checked || this.isParentChecked(itemParent);
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
    const {value} = this.state;
    const checked = !!~value.indexOf(item);

    if (checked) {
      return true;
    }

    if (item.children?.length) {
      if (
        onlyChildren &&
        autoCheckChildren &&
        this.isItemChildrenChecked(item) // TODO: 优化这个逻辑
      ) {
        // 当前元素没有在 value 中，但是子组件全部勾选了
        return true;
      }
    }
    const itemParent = this.relations.get(item);
    if (itemParent && multiple && autoCheckChildren) {
      // 当前节点为子节点
      if (withChildren) {
        return false;
      }
      if (cascade) {
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

    if (
      autoCheckChildren &&
      multiple &&
      checked &&
      itemParent &&
      this.isItemChecked(itemParent)
    ) {
      // 子节点
      if (onlyChildren) {
        return false;
      }
      return !cascade;
    }

    return false;
  }

  @autobind
  renderItem({index, style}: {index: number; style?: Record<string, any>}) {
    const {
      itemClassName,
      showIcon,
      showRadio,
      multiple,
      labelField,
      iconField,
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
      draggable
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

    const checkbox: JSX.Element | null = multiple ? (
      <Checkbox
        size="sm"
        disabled={disabled}
        checked={checked || partial}
        partial={partial}
        onChange={this.handleCheck.bind(this, item, !checked)}
      />
    ) : showRadio ? (
      <Checkbox
        size="sm"
        disabled={disabled}
        checked={checked}
        onChange={this.handleSelect.bind(this, item)}
      />
    ) : null;

    const isLeaf =
      (!item.children || !item.children.length) && !item.placeholder;

    const iconValue = item[iconField] || (item.children ? 'folder' : 'file');

    const level = item.level ? item.level - 1 : 0;

    let body = null;

    if (isEditing && editingItem === item) {
      body = this.renderInput(checkbox);
    } else if (item.isAdding) {
      body = this.renderInput(checkbox);
    } else {
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
            <a className={cx('Tree-itemDrager drag-bar')}>
              <Icon icon="drag-bar" className="icon" />
            </a>
          )}

          {item.loading ? (
            <Spinner
              size="sm"
              show
              icon="reload"
              spinnerClassName={cx('Tree-spinner')}
            />
          ) : !isLeaf || (item.defer && !item.loaded) ? (
            <div
              onClick={() => this.toggleUnfolded(item)}
              className={cx('Tree-itemArrow', {
                'is-folded': !this.isUnfolded(item)
              })}
            >
              <Icon icon="down-arrow-bold" className="icon" />
            </div>
          ) : (
            <span className={cx('Tree-itemArrowPlaceholder')} />
          )}

          {checkbox}

          <div className={cx('Tree-itemLabel-item')}>
            {showIcon ? (
              <i
                className={cx(
                  `Tree-itemIcon ${
                    item.children ? 'Tree-folderIcon' : 'Tree-leafIcon'
                  }`
                )}
                onClick={() =>
                  !disabled &&
                  (multiple
                    ? this.handleCheck(item, !checked)
                    : this.handleSelect(item))
                }
              >
                {getIcon(iconValue) ? (
                  <Icon icon={iconValue} className="icon" />
                ) : React.isValidElement(iconValue) ? (
                  iconValue
                ) : (
                  <i className={iconValue}></i>
                )}
              </i>
            ) : null}

            <span
              className={cx('Tree-itemText')}
              onClick={() =>
                !disabled &&
                (multiple
                  ? this.handleCheck(item, !checked)
                  : this.handleSelect(item))
              }
              title={item[labelField]}
            >
              {highlightTxt
                ? highlight(`${item[labelField]}`, highlightTxt)
                : itemRender
                ? itemRender(item, {
                    index: item.key,
                    multiple: multiple,
                    checked: checked,
                    onChange: () => this.handleCheck(item, !checked),
                    disabled: disabled || item.disabled
                  })
                : `${item[labelField]}`}
            </span>

            {!disabled &&
            !isAdding &&
            !isEditing &&
            !(item.defer && !item.loaded) ? (
              <div className={cx('Tree-item-icons')}>
                {creatable && hasAbility(item, 'creatable') ? (
                  <a
                    onClick={this.handleAdd.bind(this, item)}
                    data-tooltip={__(createTip)}
                    data-position="left"
                  >
                    <Icon icon="plus" className="icon" />
                  </a>
                ) : null}

                {removable && hasAbility(item, 'removable') ? (
                  <a
                    onClick={this.handleRemove.bind(this, item)}
                    data-tooltip={__(removeTip)}
                    data-position="left"
                  >
                    <Icon icon="minus" className="icon" />
                  </a>
                ) : null}

                {editable && hasAbility(item, 'editable') ? (
                  <a
                    onClick={this.handleEdit.bind(this, item)}
                    data-tooltip={__(editTip)}
                    data-position="left"
                  >
                    <Icon icon="new-edit" className="icon" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <li
        key={item.key}
        className={cx(`Tree-item ${itemClassName || ''}`, {
          'Tree-item--isLeaf': isLeaf
        })}
        style={{
          ...style,
          left: `calc(${level} * var(--Tree-indent))`,
          width: `calc(100% - ${level} * var(--Tree-indent))`
        }}
      >
        {body}
      </li>
    );
  }

  @autobind
  renderList(list: Options, value: any[]) {
    const {virtualThreshold, itemHeight = 32} = this.props;
    if (virtualThreshold && list.length > virtualThreshold) {
      return (
        <VirtualList
          height={list.length > 8 ? 266 : list.length * itemHeight}
          itemCount={list.length}
          itemSize={itemHeight}
          //! hack: 让 VirtualList 重新渲染
          renderItem={this.renderItem.bind(this)}
        />
      );
    }

    return list.map((item, index) => this.renderItem({index}));
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
      translate: __
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
        >
          <Icon icon="plus" className="icon" />
          <span>{__(rootCreateTip)}</span>
        </a>
      );
    }

    return (
      <div
        className={cx(`Tree ${className || ''}`, {
          'Tree--outline': showOutline,
          'is-disabled': disabled,
          'is-draggable': draggable
        })}
        ref={this.root}
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

                {this.renderList(flattenedOptions, value)}
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
                    <div className={cx('Tree-item-icons')}>
                      {creatable ? (
                        <a
                          onClick={this.handleAdd.bind(this, null)}
                          data-tooltip={rootCreateTip}
                          data-position="left"
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
                  {this.renderList(flattenedOptions, value)}
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
