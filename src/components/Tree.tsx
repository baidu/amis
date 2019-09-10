/**
 * @file Tree
 * @description 树形组件
 * @author fex
 */

import React from 'react';
import {eachTree, isVisible, isObject} from '../utils/helper';
import {Option, Options, value2array} from './Checkboxes';
import {ClassNamesFn, themeable} from '../theme';
import {highlight} from '../renderers/Form/Options';
import debounce = require('lodash/debounce');

interface TreeSelectorProps {
    classPrefix: string;
    classnames: ClassNamesFn;

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
    nameField?: string;
    valueField?: string;
    iconField?: string;
    unfoldedField?: string;
    foldedField?: string;
    disabledField?: string;
    className?: string;
    itemClassName?: string;
    joinValues?: boolean;
    extractValue?: boolean;
    delimiter?: string;
    data: Options;
    value: any;
    onChange: Function;
    placeholder?: string;
    hideRoot?: boolean;
    rootLabel?: string;
    rootValue?: any;
    cascade?: boolean;
    selfDisabledAffectChildren?: boolean;
    minLength?: number;
    maxLength?: number;
    addMode?: string;
    addItem?: Function;
    openAddDialog?: Function;
    editMode?: string;
    editItem?: Function;
    openEditDialog?: Function;
    deletable?: boolean;
    deleteItem?: Function;
}

interface TreeSelectorState {
    value: Array<any>;
    unfolded: {[propName: string]: string};
    hoverItem: Option | null;
    editItem: Option | null;
    addItem: Option | null;
    addingItem: Option | null;
    editingItem: Option | null;
}

export class TreeSelector extends React.Component<TreeSelectorProps, TreeSelectorState> {
    static defaultProps = {
        showIcon: true,
        initiallyOpen: true,
        unfoldedLevel: 0,
        showRadio: false,
        multiple: false,
        disabled: false,
        withChildren: false,
        onlyChildren: false,
        nameField: 'name',
        valueField: 'value',
        iconField: 'icon',
        unfoldedField: 'unfolded',
        foldedField: 'foled',
        disabledField: 'disabled',
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        hideRoot: true,
        rootLabel: '顶级',
        rootValue: 0,
        cascade: false,
        selfDisabledAffectChildren: true
    };

    componentWillMount() {
        this.renderList = this.renderList.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.clearSelect = this.clearSelect.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.toggleUnfolded = this.toggleUnfolded.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onChangeAddItem = this.onChangeAddItem.bind(this);
        this.confirmAddItem = this.confirmAddItem.bind(this);
        this.cancelAddItem = this.cancelAddItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.onChangeEditItem = this.onChangeEditItem.bind(this);
        this.confirmEditItem = this.confirmEditItem.bind(this);
        this.cancelEditItem = this.cancelEditItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);

        const props = this.props;

        this.setState({
            value: value2array(props.value, {
                joinValues: props.joinValues,
                extractValue: props.extractValue,
                multiple: props.multiple,
                delimiter: props.delimiter,
                valueField: props.valueField,
                options: props.data
            }),
            unfolded: this.syncUnFolded(props),
            hoverItem: null, // 鼠标覆盖选中的 item
            editItem: null, // 点击编辑时的 item
            addItem: null, // 点击添加时的 item
            addingItem: null, // 添加后的 item
            editingItem: null // 编辑后的 item
        });
    }

    componentWillReceiveProps(nextProps: TreeSelectorProps) {
        const toUpdate: any = {};

        if (this.props.value !== nextProps.value || this.props.data !== nextProps.data) {
            toUpdate.value = value2array(nextProps.value, {
                joinValues: nextProps.joinValues,
                extractValue: nextProps.extractValue,
                multiple: nextProps.multiple,
                delimiter: nextProps.delimiter,
                valueField: nextProps.valueField,
                options: nextProps.data
            });
        }

        if (this.props.data !== nextProps.data) {
            toUpdate.unfolded = this.syncUnFolded(nextProps);
        }

        this.setState(toUpdate);
    }

    syncUnFolded(props: TreeSelectorProps) {
        // 初始化树节点的展开状态
        let unfolded: {[propName: string]: string} = {};
        const {foldedField, unfoldedField} = this.props;

        eachTree(props.data, (node: Option, index, level) => {
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

    toggleUnfolded(node: any) {
        this.setState({
            addItem: null,
            unfolded: {
                ...this.state.unfolded,
                [node[this.props.valueField as string]]: !this.state.unfolded[node[this.props.valueField as string]]
            }
        });
    }

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

    handleCheck(item: any, checked: boolean) {
        const props = this.props;
        const value = this.state.value.concat();
        const idx = value.indexOf(item);
        const onlyChildren = this.props.onlyChildren;

        if (checked) {
            ~idx || value.push(item);
            if (!props.cascade) {
                const children = item.children ? item.children.concat([]) : [];

                if (onlyChildren) {
                    // 父级选中的时候，子节点也都选中，但是自己不选中
                    !~idx && children.length && value.shift();

                    while (children.length) {
                        let child = children.shift();
                        let index = value.indexOf(child);

                        if (child.children) {
                            children.push.apply(children, child.children);
                        } else {
                            ~index || value.push(child);
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
                }
            }
        } else if (!checked) {
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
                const {joinValues, extractValue, valueField, delimiter, onChange} = this.props;

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

    handleEnter(item: Option) {
        this.setState({
            hoverItem: item
        });
    }

    handleMove(e: MouseEvent, item: Option) {
        const target = e.target as HTMLElement;
        const tagName = target.tagName;
        if (tagName === 'LI') {
            const current = target.childNodes[0].textContent;
            if (current == item['label'] && (!this.state.hoverItem || current !== (this.state.hoverItem as Option)['label'])) {
                this.setState({
                    hoverItem: item
                });
            }
        }
    }

    handleLeave() {
        this.setState({
            hoverItem: null
        });
    }

    addItem(item: Option, isFolder: boolean) {
        const {addMode, openAddDialog, valueField} = this.props;
        let {hoverItem, unfolded} = this.state;
        if (addMode === 'dialog') {
            openAddDialog && openAddDialog(hoverItem)
        } else if (addMode === 'normal')  {
            // 添加时，默认折叠的文件夹需要展开
            if (isFolder && !unfolded[item[valueField as string]]) {
                unfolded = {
                    ...unfolded,
                    [item[valueField as string]]: !unfolded[item[valueField as string]],
                }
            }

            this.setState({
                addItem: item,
                editItem: null,
                unfolded
            });
        }
    }

    editItem(item: Option) {
        const {editMode, openEditDialog} = this.props;
        const {hoverItem, addItem} = this.state;
        if (editMode === 'dialog') {
            openEditDialog && openEditDialog(hoverItem);
            addItem && this.setState({
                addItem: null
            });
        } else if (editMode === 'normal')  {
            this.setState({
                editItem: item,
                addItem: null
            });
        }
    }

    deleteItem(item: Option) {
        const {deleteItem} = this.props;
        deleteItem && deleteItem(item);

        this.setState({
            hoverItem: null
        });
    }

    confirmAddItem() {
        const {addItem} = this.props;
        const {addItem: parent, addingItem} = this.state;
        addItem && addItem({
            ...addingItem,
            parent: parent
        });

        this.setState({
            addingItem: null,
            addItem: null
        })
    }

    cancelAddItem() {
        this.setState({
            addItem: null
        });
    }

    confirmEditItem() {
        const {editItem} = this.props;
        let {editingItem, editItem: prevItem} = this.state;
        editItem && editItem({
            ...editingItem,
            prev: prevItem
        });
        this.setState({
            editingItem: null,
            editItem: null
        });
    }

    cancelEditItem() {
        this.setState({
            editItem: null
        });
    }

    onChangeAddItem(value: string) {
        this.setState({
            addingItem: {
                label: value
            }
        });
    }

    onChangeEditItem(item: Option, value: string) {
        let {editItem} = this.state;
        this.setState({
            editingItem: {
                ...item,
                label: value || (editItem as Option)['label']
            }
        });
    }

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
            nameField = '',
            valueField = '',
            iconField = '',
            disabledField = '',
            cascade,
            selfDisabledAffectChildren,
            onlyChildren,
            classnames: cx,
            highlightTxt,
            data,
            maxLength,
            minLength,
            addMode,
            editMode,
            deletable
        } = this.props;

        let childrenChecked = 0;
        let ret = list.map((item, key) => {
            if (!isVisible(item as any, data)) {
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
                        : uncheckable || (selfDisabledAffectChildren ? selfDisabled : false) || (multiple && checked)
                );
                tmpChildrenChecked = !!childrenItems.childrenChecked;
                if (!selfChecked && onlyChildren && item.children.length === childrenItems.childrenChecked) {
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
                ((maxLength && !selfChecked && this.state.value.length >= maxLength) ||
                    (minLength && selfChecked && this.state.value.length <= minLength))
            ) {
                nodeDisabled = true;
            }

            const checkbox: JSX.Element | null = multiple ? (
                <label className={cx(`Checkbox Checkbox--checkbox Checkbox--sm`)}>
                    <input
                        type="checkbox"
                        disabled={nodeDisabled}
                        checked={selfChecked}
                        onChange={e => this.handleCheck(item, e.currentTarget.checked)}
                    />
                    <i />
                </label>
            ) : showRadio ? (
                <label className={cx(`Checkbox Checkbox--radio Checkbox--sm`)}>
                    <input
                        type="radio"
                        disabled={nodeDisabled}
                        checked={checked}
                        onChange={() => this.handleSelect(item)}
                    />
                    <i />
                </label>
            ) : null;

            const isLeaf = !item.children || !item.children.length;

            return (
                <li
                    key={key}
                    className={cx(`Tree-item ${itemClassName || ''}`, {
                        'Tree-item--isLeaf': isLeaf
                    })}
                    onMouseMove={(e) =>
                        !nodeDisabled && this.handleMove(e, item)
                    }
                    onMouseEnter={() =>
                        !nodeDisabled && this.handleEnter(item)
                    }
                    onMouseLeave={() =>
                        !nodeDisabled && this.handleLeave()
                    }
                >
                    {!this.state.editItem || isObject(this.state.editItem) && (this.state.editItem as Option)[valueField] !== item[valueField] ? (
                        <a>
                            {!isLeaf ? (
                                <i
                                    onClick={() => this.toggleUnfolded(item)}
                                    className={cx('Tree-itemArrow', {
                                        'is-folded': !this.state.unfolded[item[valueField]],
                                    })}
                                />
                            ) : null}

                            {showIcon ? (
                                <i
                                    className={cx(
                                        `Tree-itemIcon ${item[iconField] ||
                                        (childrenItems ? 'Tree-folderIcon' : 'Tree-leafIcon')}`
                                    )}
                                />
                            ) : null}

                            {checkbox}

                            <span
                                className={cx('Tree-itemText', {
                                    'is-children-checked': multiple && !cascade && tmpChildrenChecked && !nodeDisabled,
                                    'is-checked': checked,
                                    'is-disabled': nodeDisabled,
                                })}
                                onClick={() =>
                                    !nodeDisabled &&
                                    (multiple ? this.handleCheck(item, !selfChecked) : this.handleSelect(item))
                                }
                            >
                                {highlightTxt ? highlight(item[nameField], highlightTxt) : item[nameField]}
                            </span>
                            {/* 非添加时 && 非编辑时 && 鼠标覆盖时是当前item时，显示添加/编辑/删除图标 */}
                            {!this.state.addItem
                                && !this.state.editItem
                                && isObject(this.state.hoverItem)
                                && (this.state.hoverItem as Option)[valueField as string] === item[valueField] ? (
                                    <span>
                                        {addMode ? <i className="fa fa-plus" onClick={() => this.addItem(item, !isLeaf)}></i> : null}
                                        {deletable ? <i className="fa fa-minus" onClick={() => this.deleteItem(item)}></i> : null}
                                        {editMode ? <i className="fa fa-pencil" onClick={() => this.editItem(item)}></i> : null}
                                    </span>
                            ) : null}
                        </a>
                    ) : (
                        <div className={cx('Tree-item--isEdit')}>
                            <input placeholder='label' defaultValue={item['label']} onChange={(e) => this.onChangeEditItem(item, e.currentTarget.value)}/>
                            <i className="fa fa-check" onClick={this.confirmEditItem}></i>
                            <i className="fa fa-close" onClick={this.cancelEditItem}></i>
                        </div>
                    )}
                    {/* 有children而且为展开状态 或者 添加child时 */}
                    {((childrenItems && this.state.unfolded[item[valueField]]) || this.state.addItem && (this.state.addItem[valueField] === item[valueField])) ? (
                        <ul
                            className={cx('Tree-sublist')}
                        >
                            {this.state.addItem && this.state.addItem[valueField] === item[valueField] ? (
                                <li>
                                    <input placeholder='label' onChange={(e) => this.onChangeAddItem(e.currentTarget.value)}/>
                                    <i className="fa fa-check" onClick={this.confirmAddItem}></i>
                                    <i className="fa fa-close" onClick={this.cancelAddItem}></i>
                                </li>
                            ) : null}
                            {childrenItems}
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
        const {className, placeholder, hideRoot, rootLabel, showIcon, classnames: cx} = this.props;
        let data = this.props.data;

        const value = this.state.value;
        return (
            <div className={cx(`Tree ${className || ''}`)}>
                {data && data.length ? (
                    <ul className={cx('Tree-list')}>
                        {hideRoot ? (
                            this.renderList(data, value, false).dom
                        ) : (
                            <li className={cx('Tree-item Tree-rootItem')}>
                                <a>
                                    {showIcon ? <i className={cx('Tree-itemIcon Tree-rootIcon')} /> : null}

                                    <label
                                        className={cx('Tree-itemLabel', {
                                            'is-checked': !value || !value.length
                                        })}
                                    >
                                        <span className={cx('Tree-itemText')} onClick={this.clearSelect}>
                                            {rootLabel}
                                        </span>
                                    </label>
                                </a>
                                <ul className={cx('Tree-sublist')}>{this.renderList(data, value, false).dom}</ul>
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

export default themeable(TreeSelector);
