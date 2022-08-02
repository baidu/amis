/**
 * @file Tree
 * @description 树形组件
 * @author fex
 */

import React from 'react';
import {
  eachTree,
  isVisible,
  autobind,
  findTreeIndex,
  hasAbility,
  createObject,
  getTreeParent,
  getTreeAncestors,
  cloneObject,
  difference
} from 'amis-core';
import {Option, Options, value2array} from './Select';
import {ClassNamesFn, themeable, ThemeProps, highlight} from 'amis-core';
import {Icon, getIcon} from './icons';
import Checkbox from './Checkbox';
import {LocaleProps, localeable} from 'amis-core';
import Spinner from './Spinner';
import {ItemRenderStates} from './Selection';

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
   * 1.casacde为false，ui行为为级联选中子节点，子节点禁用；值只包含父节点的值
   * 2.cascade为false，withChildren为true，ui行为为级联选中子节点，子节点禁用；值包含父子节点的值
   * 3.cascade为true，ui行为级联选中子节点，子节点可反选，值包含父子节点的值，此时withChildren属性失效
   * 4.cascade不论为true还是false，onlyChildren为true，ui行为级联选中子节点，子节点可反选，值只包含子节点的值
   */
  cascade?: boolean;

  selfDisabledAffectChildren?: boolean;
  minLength?: number;
  maxLength?: number;
  // 是否为内建 增、改、删。当有复杂表单的时候直接抛出去让外层能统一处理
  bultinCUD?: boolean;
  rootCreatable?: boolean;
  rootCreateTip?: string;
  creatable?: boolean;
  createTip?: string;
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

  // 拖拽指示器
  dropIndicator?: IDropIndicator;
}

function generateKey(parentKey: string | undefined, key: string) {
  if (typeof parentKey === 'undefined') {
    return key;
  }

  return `${parentKey}-${key}`;
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
    nodePath: []
  };

  unfolded: Set<string> = new Set();
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
    const {valueField} = props;
    // 传入默认展开层级需要重新初始化unfolded
    let initFoldedLevel = typeof unfoldedLevel !== 'undefined';
    let expandLevel =
      Number(initFoldedLevel ? unfoldedLevel : props.unfoldedLevel) - 1;

    // 初始化树节点的展开状态
    let unfolded = this.unfolded;
    const {foldedField, unfoldedField} = this.props;

    eachTree(props.options, (node: Option, index, level, path) => {
      const itemKey =
        path?.map(item => item[valueField]).join('-') ||
        String(node[valueField]);
      if (unfolded.has(itemKey) && !initFoldedLevel) {
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
        ret && unfolded.add(itemKey);
      }
    });

    initFoldedLevel && this.forceUpdate();

    return unfolded;
  }

  @autobind
  toggleUnfolded(node: any, itemKey: string | number) {
    const key = String(itemKey);
    const unfolded = this.unfolded;
    const {onDeferLoad} = this.props;

    if (node.defer && !node.loaded) {
      unfolded.add(key);
      onDeferLoad?.(node);
      return;
    }
    this.isUnfolded(key) ? this.deleteUnfoldedKey(key) : unfolded.add(key);
    this.forceUpdate();
  }

  isUnfolded(itemKey: string | number) {
    return this.unfolded.has(String(itemKey));
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
  handleSelect(node: any, itemKey: string) {
    const {joinValues, valueField, onChange, enableNodePath, onlyLeaf} =
      this.props;

    if (node[valueField as string] === undefined) {
      if (node.defer && !node.loaded) {
        this.toggleUnfolded(node, itemKey);
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
      this.setState({
        isEditing: false,
        isAdding: true,
        addingParent: parent
      });
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
    const gap = node?.children?.length ? 0 : 16;
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
  deleteUnfoldedKey(itemKey: string) {
    this.unfolded.delete(String(itemKey));
    this.unfolded.forEach(key => {
      if (key.startsWith(`${itemKey}-`)) {
        this.unfolded.delete(key);
      }
    });
  }

  @autobind
  onDragStart(node: Option, itemKey: string) {
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
          this.deleteUnfoldedKey(itemKey);
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

  @autobind
  renderList(
    list: Options,
    value: Option[],
    uncheckable: boolean,
    parentKey?: string
  ): {dom: Array<JSX.Element | null>; childrenChecked: number} {
    const {
      itemClassName,
      showIcon,
      showRadio,
      multiple,
      disabled,
      labelField,
      valueField,
      iconField,
      disabledField,
      autoCheckChildren,
      cascade,
      selfDisabledAffectChildren,
      onlyChildren,
      classnames: cx,
      highlightTxt,
      options,
      maxLength,
      minLength,
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
    const {
      value: stateValue,
      isAdding,
      addingParent,
      editingItem,
      isEditing
    } = this.state;

    let childrenChecked = 0;
    let ret = list.map((item, key) => {
      if (!isVisible(item as any, options)) {
        return null;
      }
      const itemKey = generateKey(parentKey, item[valueField]);
      const checked = !!~value.indexOf(item);
      const selfDisabled = item[disabledField];
      let selfChecked = !!uncheckable || checked;
      let childrenItems = null;
      let selfChildrenChecked = false;
      if (item.children && item.children.length) {
        childrenItems = this.renderList(
          item.children,
          value,
          !autoCheckChildren || cascade
            ? false
            : uncheckable ||
                (selfDisabledAffectChildren ? selfDisabled : false) ||
                (multiple && checked),
          itemKey
        );
        selfChildrenChecked = !!childrenItems.childrenChecked;
        if (
          !selfChecked &&
          onlyChildren &&
          autoCheckChildren &&
          item.children.length === childrenItems.childrenChecked
        ) {
          selfChecked = true;
        }
        childrenItems = childrenItems.dom;
      }

      if ((onlyChildren ? selfChecked : selfChildrenChecked) || checked) {
        childrenChecked++;
      }

      let nodeDisabled =
        !!uncheckable ||
        !!disabled ||
        selfDisabled ||
        (multiple && !autoCheckChildren && !item[valueField]);

      if (
        !nodeDisabled &&
        ((maxLength && !selfChecked && stateValue.length >= maxLength) ||
          (minLength && selfChecked && stateValue.length <= minLength))
      ) {
        nodeDisabled = true;
      }
      const checkbox: JSX.Element | null = multiple ? (
        <Checkbox
          size="sm"
          disabled={nodeDisabled}
          checked={selfChecked || (autoCheckChildren && selfChildrenChecked)}
          partial={!selfChecked}
          onChange={this.handleCheck.bind(this, item, !selfChecked)}
        />
      ) : showRadio ? (
        <Checkbox
          size="sm"
          disabled={nodeDisabled}
          checked={checked}
          onChange={this.handleSelect.bind(this, item, itemKey)}
        />
      ) : null;

      const isLeaf =
        (!item.children || !item.children.length) && !item.placeholder;

      const iconValue = item[iconField] || (childrenItems ? 'folder' : 'file');

      return (
        <li
          key={key}
          className={cx(`Tree-item ${itemClassName || ''}`, {
            'Tree-item--isLeaf': isLeaf
          })}
        >
          {isEditing && editingItem === item ? (
            this.renderInput(checkbox)
          ) : (
            <div
              className={cx('Tree-itemLabel', {
                'is-children-checked':
                  multiple && !cascade && selfChildrenChecked && !nodeDisabled,
                'is-checked': checked,
                'is-disabled': nodeDisabled
              })}
              draggable={draggable}
              onDragStart={this.onDragStart(item, itemKey)}
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
                  onClick={() => this.toggleUnfolded(item, itemKey)}
                  className={cx('Tree-itemArrow', {
                    'is-folded': !this.isUnfolded(itemKey)
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
                        childrenItems ? 'Tree-folderIcon' : 'Tree-leafIcon'
                      }`
                    )}
                    onClick={() =>
                      !nodeDisabled &&
                      (multiple
                        ? this.handleCheck(item, !selfChecked)
                        : this.handleSelect(item, itemKey))
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
                    !nodeDisabled &&
                    (multiple
                      ? this.handleCheck(item, !selfChecked)
                      : this.handleSelect(item, itemKey))
                  }
                  title={item[labelField]}
                >
                  {highlightTxt
                    ? highlight(`${item[labelField]}`, highlightTxt)
                    : itemRender
                    ? itemRender(item, {
                        index: key,
                        multiple: multiple,
                        checked: checked,
                        onChange: () => this.handleCheck(item, !selfChecked),
                        disabled: disabled || item.disabled
                      })
                    : `${item[labelField]}`}
                </span>

                {!nodeDisabled &&
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
          )}
          {/* 有children而且为展开状态 或者 添加child时 */}
          {(childrenItems && this.isUnfolded(itemKey)) ||
          (isAdding && addingParent === item) ? (
            <ul className={cx('Tree-sublist')}>
              {isAdding && addingParent === item ? (
                <li className={cx('Tree-item')}>
                  {this.renderInput(
                    checkbox
                      ? React.cloneElement(checkbox, {
                          checked: false,
                          disabled: true
                        })
                      : null
                  )}
                </li>
              ) : null}
              {childrenItems}
            </ul>
          ) : !childrenItems && item.placeholder && this.isUnfolded(itemKey) ? (
            <ul className={cx('Tree-sublist')}>
              <li className={cx('Tree-item')}>
                <div className={cx('Tree-placeholder')}>{item.placeholder}</div>
              </li>
            </ul>
          ) : null}
        </li>
      );
    });

    return {
      dom: ret,
      childrenChecked
    };
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
    let options = this.props.options;
    const {
      value,
      isAdding,
      addingParent,
      isEditing,
      inputValue,
      dropIndicator
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
        {(options && options.length) || addBtn || hideRoot === false ? (
          <ul className={cx('Tree-list')}>
            {hideRoot ? (
              <>
                {addBtn}
                {isAdding && !addingParent ? (
                  <li className={cx('Tree-item')}>{this.renderInput()}</li>
                ) : null}
                {this.renderList(options, value, false).dom}
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
                  {this.renderList(options, value, false).dom}
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
