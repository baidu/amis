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
  getTreeParent
} from '../utils/helper';
import {Option, Options, value2array} from './Select';
import {ClassNamesFn, themeable, ThemeProps} from '../theme';
import {highlight} from '../renderers/Form/Options';
import {Icon} from './icons';
import Checkbox from './Checkbox';
import {LocaleProps, localeable} from '../locale';

interface TreeSelectorProps extends ThemeProps, LocaleProps {
  highlightTxt?: string;

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
  // 名称、取值等字段名映射
  labelField: string;
  valueField: string;
  iconField: string;
  unfoldedField: string;
  foldedField: string;
  disabledField: string;

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

  // 这个配置名字没取好，目前的含义是，如果这个配置成true，点父级的时候，子级点不会自选中。
  // 否则点击父级，子节点选中。
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
}

interface TreeSelectorState {
  value: Array<any>;
  unfolded: {[propName: string]: string};

  inputValue: string;
  addingParent: Option | null;
  isAdding: boolean;
  isEditing: boolean;
  editingItem: Option | null;
}

export class TreeSelector extends React.Component<
  TreeSelectorProps,
  TreeSelectorState
> {
  static defaultProps = {
    showIcon: true,
    initiallyOpen: true,
    unfoldedLevel: 0,
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
    cascade: false,
    selfDisabledAffectChildren: true,
    rootCreateTip: 'Tree.addRoot',
    createTip: 'Tree.addChild',
    editTip: 'Tree.editNode',
    removeTip: 'Tree.removeNode'
  };

  componentWillMount() {
    const props = this.props;

    this.setState({
      value: value2array(props.value, {
        multiple: props.multiple,
        delimiter: props.delimiter,
        valueField: props.valueField,
        options: props.options
      }),
      unfolded: this.syncUnFolded(props),

      inputValue: '',
      addingParent: null,
      isAdding: false,
      isEditing: false,
      editingItem: null
    });
  }

  componentWillReceiveProps(nextProps: TreeSelectorProps) {
    const toUpdate: any = {};

    if (
      this.props.value !== nextProps.value ||
      this.props.options !== nextProps.options
    ) {
      toUpdate.value = value2array(nextProps.value, {
        multiple: nextProps.multiple,
        delimiter: nextProps.delimiter,
        valueField: nextProps.valueField,
        options: nextProps.options
      });
    }

    if (this.props.options !== nextProps.options) {
      toUpdate.unfolded = this.syncUnFolded(nextProps);
    }

    this.setState(toUpdate);
  }

  syncUnFolded(props: TreeSelectorProps) {
    // 初始化树节点的展开状态
    let unfolded: {[propName: string]: string} = {};
    const {foldedField, unfoldedField} = this.props;

    eachTree(props.options, (node: Option, index, level) => {
      if (node.children && node.children.length) {
        let ret: any = true;

        if (unfoldedField && typeof node[unfoldedField] !== 'undefined') {
          ret = !!node[unfoldedField];
        } else if (foldedField && typeof node[foldedField] !== 'undefined') {
          ret = !node[foldedField];
        } else {
          ret = !!props.initiallyOpen;
          if (!ret && level <= (props.unfoldedLevel as number)) {
            ret = true;
          }
        }
        unfolded[node[props.valueField as string]] = ret;
      }
    });

    return unfolded;
  }

  @autobind
  toggleUnfolded(node: any) {
    this.setState({
      unfolded: {
        ...this.state.unfolded,
        [node[this.props.valueField as string]]: !this.state.unfolded[
          node[this.props.valueField as string]
        ]
      }
    });
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

  @autobind
  handleSelect(node: any, value?: any) {
    this.setState(
      {
        value: [node]
      },
      () => {
        const {joinValues, valueField, onChange} = this.props;

        onChange(joinValues ? node[valueField as string] : node);
      }
    );
  }

  @autobind
  handleCheck(item: any, checked: boolean) {
    const props = this.props;
    const value = this.state.value.concat();
    const idx = value.indexOf(item);
    const onlyChildren = props.onlyChildren;

    if (checked) {
      ~idx || value.push(item);

      // cascade 为 true 表示父节点跟子节点没有级联关系。
      if (!props.cascade) {
        const children = item.children ? item.children.concat([]) : [];

        if (onlyChildren) {
          // 父级选中的时候，子节点也都选中，但是自己不选中
          !~idx && children.length && value.pop();

          while (children.length) {
            let child = children.shift();
            let index = value.indexOf(child);

            if (child.children) {
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

            if (props.withChildren) {
              value.push(child);
            }

            if (child.children && child.children.length) {
              children.push.apply(children, child.children);
            }
          }

          const parent = getTreeParent(props.options, item);
          if (parent?.value) {
            // 如果所有孩子节点都勾选了，应该自动勾选父级。

            if (parent.children.every((child: any) => ~value.indexOf(child))) {
              parent.children.forEach((child: any) => {
                const index = value.indexOf(child);
                if (~index) {
                  value.splice(index, 1);
                }
              });
              value.push(parent);
            }
          }
        }
      }
    } else {
      ~idx && value.splice(idx, 1);

      if (!props.cascade && (props.withChildren || onlyChildren)) {
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
          onChange
        } = props;

        onChange(
          joinValues
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
          <a data-tooltip={__('cancle')} onClick={this.handleCancel}>
            <Icon icon="close" className="icon" />
          </a>
          <a data-tooltip={__('confirm')} onClick={this.handleConfirm}>
            <Icon icon="check" className="icon" />
          </a>
        </div>
      </div>
    );
  }

  @autobind
  renderList(
    list: Options,
    value: Option[],
    uncheckable: boolean
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
      translate: __
    } = this.props;
    const {
      unfolded,
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

      const checked = !!~value.indexOf(item);
      const selfDisabled = item[disabledField];
      let selfChecked = !!uncheckable || checked;

      let childrenItems = null;
      let tmpChildrenChecked = false;
      if (item.children && item.children.length) {
        childrenItems = this.renderList(
          item.children,
          value,
          cascade
            ? false
            : uncheckable ||
                (selfDisabledAffectChildren ? selfDisabled : false) ||
                (multiple && checked)
        );
        tmpChildrenChecked = !!childrenItems.childrenChecked;
        if (
          !selfChecked &&
          onlyChildren &&
          item.children.length === childrenItems.childrenChecked
        ) {
          selfChecked = true;
        }
        childrenItems = childrenItems.dom;
      }

      if (tmpChildrenChecked || checked) {
        childrenChecked++;
      }

      let nodeDisabled = !!uncheckable || !!disabled || selfDisabled;

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
          checked={selfChecked}
          onChange={this.handleCheck.bind(this, item, !selfChecked)}
        />
      ) : showRadio ? (
        <Checkbox
          size="sm"
          disabled={nodeDisabled}
          checked={checked}
          onChange={this.handleSelect.bind(this, item)}
        />
      ) : null;

      const isLeaf =
        (!item.children || !item.children.length) && !item.placeholder;

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
                  multiple && !cascade && tmpChildrenChecked && !nodeDisabled,
                'is-checked': checked,
                'is-disabled': nodeDisabled
              })}
            >
              {!isLeaf ? (
                <div
                  onClick={() => this.toggleUnfolded(item)}
                  className={cx('Tree-itemArrow', {
                    'is-folded': !unfolded[item[valueField]]
                  })}
                >
                  <Icon icon="right-arrow-bold" className="icon" />
                </div>
              ) : (
                <span className={cx('Tree-itemArrowPlaceholder')} />
              )}

              {checkbox}

              {showIcon ? (
                <i
                  className={cx(
                    `Tree-itemIcon ${
                      item[iconField] ||
                      (childrenItems ? 'Tree-folderIcon' : 'Tree-leafIcon')
                    }`
                  )}
                  onClick={() =>
                    !nodeDisabled &&
                    (multiple
                      ? this.handleCheck(item, !selfChecked)
                      : this.handleSelect(item))
                  }
                >
                  <Icon
                    icon={childrenItems ? 'folder' : 'file'}
                    className="icon"
                  />
                </i>
              ) : null}

              <span
                className={cx('Tree-itemText')}
                onClick={() =>
                  !nodeDisabled &&
                  (multiple
                    ? this.handleCheck(item, !selfChecked)
                    : this.handleSelect(item))
                }
              >
                {highlightTxt
                  ? highlight(`${item[labelField]}`, highlightTxt)
                  : `${item[labelField]}`}
              </span>

              {!nodeDisabled && !isAdding && !isEditing ? (
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
                      <Icon icon="pencil" className="icon" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
          {/* 有children而且为展开状态 或者 添加child时 */}
          {(childrenItems && unfolded[item[valueField]]) ||
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
          ) : !childrenItems &&
            item.placeholder &&
            unfolded[item[valueField]] ? (
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
      showIcon,
      classnames: cx,
      creatable,
      rootCreatable,
      rootCreateTip,
      disabled,
      translate: __
    } = this.props;
    let options = this.props.options;
    const {value, isAdding, addingParent, isEditing, inputValue} = this.state;

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
      <div className={cx(`Tree ${className || ''}`)}>
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
      </div>
    );
  }
}

export default themeable(localeable(TreeSelector));
