import React from 'react';
import cx from 'classnames';
import TreeSelector from '../../components/Tree';
import {OptionsControl, OptionsControlProps} from './Options';
import {autobind, createObject} from '../../utils/helper';
import {Action, Schema, PlainObject, Api, Payload} from '../../types';
import {isEffectiveApi} from '../../utils/api';
import {filter} from '../../utils/tpl';
import {Option} from '../../components/Checkboxes';

export interface TreeProps extends OptionsControlProps {
    placeholder?: any;
    hideRoot?: boolean;
    rootLabel?: string;
    rootValue?: any;
    showIcon?: boolean;
    cascade?: boolean; // 父子之间是否完全独立。
    withChildren?: boolean; // 选父级的时候是否把子节点的值也包含在内。
    onlyChildren?: boolean; // 选父级的时候，是否只把子节点的值包含在内
    addApi?: Api;
    addMode?: 'dialog' | 'normal';
    addDialog?: Schema;
    editApi?: Api;
    editMode?: 'dialog' | 'normal';
    editDialog?: Schema;
    deleteApi?: Api;
    deleteConfirmText?: string;
}

export interface TreeState {
    isAddModalOpened: boolean,
    isEditModalOpened: boolean,
    parent: Option | null,
    prev: Option | null,
    data: any
}

export default class TreeControl extends React.Component<TreeProps, TreeState> {
    static defaultProps: Partial<TreeProps> = {
        placeholder: '选项加载中...',
        multiple: false,
        hideRoot: false,
        rootLabel: '顶级',
        rootValue: '',
        showIcon: true
    };

    state: TreeState = {
        isAddModalOpened: false,
        isEditModalOpened: false,
        parent: null,
        prev: null,
        data: null
    }

    reload() {
        const reload = this.props.reloadOptions;
        reload && reload();
    }

    @autobind
    handleAdd(values: PlainObject) {
        this.saveRemote(values, 'add');
    }

    @autobind
    handleAddModalConfirm(values: Array<any>, action: Action, ctx: any, components: Array<any>) {
        this.saveRemote({
            ...values,
            parent: this.state.parent
        }, 'add');
        this.closeAddDialog();
    }

    @autobind
    handleEdit(values: PlainObject) {
        this.saveRemote(values, 'edit');
    }

    @autobind
    handleEditModalConfirm(values: Array<any>, action: Action, ctx: any, components: Array<any>) {
        this.saveRemote({
            ...values,
            prev: this.state.prev
        }, 'edit');
        this.closeEditDialog();
    }

    @autobind
    async saveRemote(item: any, type: 'add' | 'edit') {
        const {
            addApi,
            editApi,
            data,
            env
        } = this.props;

        let remote: Payload | null = null;
        if (type == 'add' && isEffectiveApi(addApi, createObject(data, item))) {
            remote = await env.fetcher(addApi, createObject(data, item));
        } else if (type == 'edit' && isEffectiveApi(editApi, createObject(data, item))) {
            remote = await env.fetcher(editApi, createObject(data, item));
        }

        if (remote && !remote.ok) {
            env.notify('error', remote.msg || '保存失败');
            return;
        }
        
        this.reload();
    }

    @autobind
    async handleRemove(item: any) {
        const {deleteConfirmText, deleteApi, data, env} = this.props;
        const ctx = createObject(data, item);
        if (isEffectiveApi(deleteApi, ctx)) {
            const confirmed = await env.confirm(deleteConfirmText ? filter(deleteConfirmText, ctx) : '确认要删除？');
            if (!confirmed) {
                return;
            }

            const result = await env.fetcher(deleteApi, ctx);

            if (!result.ok) {
                env.notify('error', result.msg || '删除失败');
                return;
            }

            this.reload();
        }
    }

    @autobind
    openAddDialog(parent: Option | null) {
        const {data} = this.props;
        this.setState({
            isAddModalOpened: true,
            data: createObject(data, parent ? parent : {}),
            parent
        });
    }

    @autobind
    closeAddDialog() {
        this.setState({
            isAddModalOpened: false,
            parent: null
        });
    }

    @autobind
    openEditDialog(prev: Option) {
        const {data} = this.props;
        this.setState({
            isEditModalOpened: true,
            data: createObject(data, prev),
            prev
        });
    }

    @autobind
    closeEditDialog() {
        this.setState({
            isEditModalOpened: false,
            prev: null
        });
    }

    render() {
        const {
            className,
            classPrefix: ns,
            value,
            onChange,
            disabled,
            joinValues,
            extractValue,
            delimiter,
            placeholder,
            options,
            inline,
            multiple,
            valueField,
            initiallyOpen,
            unfoldedLevel,
            withChildren,
            onlyChildren,
            loading,
            hideRoot,
            rootLabel,
            cascade,
            rootValue,
            showIcon,
            showRadio,
            render,
            addMode,
            addApi,
            addDialog,
            editMode,
            editApi,
            editDialog,
            deleteApi
        } = this.props;

        const {data} = this.state;

        return (
            <div className={cx(`${ns}TreeControl`, className)}>
                {loading ? (
                    render('loading', {
                        type: 'spinner'
                    })
                ) : (
                    <TreeSelector
                        classPrefix={ns}
                        valueField={valueField}
                        disabled={disabled}
                        onChange={onChange}
                        joinValues={joinValues}
                        extractValue={extractValue}
                        delimiter={delimiter}
                        placeholder={placeholder}
                        data={options}
                        multiple={multiple}
                        initiallyOpen={initiallyOpen}
                        unfoldedLevel={unfoldedLevel}
                        withChildren={withChildren}
                        onlyChildren={onlyChildren}
                        hideRoot={hideRoot}
                        rootLabel={rootLabel}
                        rootValue={rootValue}
                        showIcon={showIcon}
                        showRadio={showRadio}
                        cascade={cascade}
                        foldedField="collapsed"
                        value={value || ''}
                        nameField="label"
                        selfDisabledAffectChildren={false}
                        addMode={addMode}
                        addable={isEffectiveApi(addApi)}
                        onAdd={this.handleAdd}
                        openAddDialog={this.openAddDialog}
                        editMode={editMode}
                        editable={isEffectiveApi(editApi)}
                        onEdit={this.handleEdit}
                        openEditDialog={this.openEditDialog}
                        onRemove={this.handleRemove}
                        removable={isEffectiveApi(deleteApi)}
                    />
                )}

                {addMode && render(
                    'modal',
                    {
                        type: 'dialog',
                        ...addDialog
                    },
                    {
                        key: 'addModal',
                        data: data,
                        onConfirm: this.handleAddModalConfirm,
                        onClose: this.closeAddDialog,
                        show: this.state.isAddModalOpened
                    }
                )}

                {editMode && render(
                    'modal',
                    {
                        type: 'dialog',
                        ...editDialog
                    },
                    {
                        key: 'editModal',
                        data: data,
                        onConfirm: this.handleEditModalConfirm,
                        onClose: this.closeEditDialog,
                        show: this.state.isEditModalOpened
                    }
                )}
            </div>
        );
    }
}

@OptionsControl({
    type: 'tree'
})
export class TreeControlRenderer extends TreeControl {}
