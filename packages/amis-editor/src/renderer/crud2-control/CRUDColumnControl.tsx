/**
 * @file CRUDColumnControl
 * @desc 列配置控件
 */

import React from 'react';
import {findDomCompat as findDOMNode} from 'amis-core';
import Sortable from 'sortablejs';
import {FormItem, Button, Icon, toast, Tag, Spinner, autobind} from 'amis';
import {TooltipWrapper} from 'amis-ui';
import {JSONPipeIn} from 'amis-editor-core';
import AddColumnModal from './AddColumnModal';

import type {FormControlProps} from 'amis';
import type {SortableEvent} from 'sortablejs';
import type {ColumnSchema} from 'amis/lib/renderers/Table2';
import type {DSBuilderInterface} from '../../builder';

interface Option {
  label: string;
  value: string;
  nodeId: string;
  hidden: boolean;
  /** 原始结构 */
  pristine: DesignColumnSchema;
  /** 字段信息 */
  context?: any;
}

interface DesignColumnSchema extends ColumnSchema {
  /** 设计态节点 ID */
  $$id: string;
  /** schema ID */
  id: string;
  /** 绑定的实体字段的 ID */
  fieldId?: string;
  relationBuildSetting?: any;
}

export interface CRUDColumnControlProps extends FormControlProps {
  /** CRUD 节点的 ID */
  nodeId: string;
  builder: DSBuilderInterface;
}

export interface CRUDColumnControlState {
  options: Option[];
  loading: boolean;
  showAddModal: boolean;
  addModalData?: {
    colTypeLabel: string;
    colType: 'field' | 'operation';
  };
}

export class CRUDColumnControl extends React.Component<
  CRUDColumnControlProps,
  CRUDColumnControlState
> {
  sortable?: Sortable;

  drag?: HTMLElement | null;

  dom?: HTMLElement;

  constructor(props: CRUDColumnControlProps) {
    super(props);

    this.state = {
      options: [],
      loading: false,
      showAddModal: false
    };
  }

  componentDidMount(): void {
    this.dom = findDOMNode(this) as HTMLElement;
    this.initOptions();
  }

  componentDidUpdate(prevProps: Readonly<CRUDColumnControlProps>): void {
    if (prevProps.value !== this.props.value) {
      this.initOptions();
    }
  }

  transformOption(option: DesignColumnSchema): Option | false {
    if (option.name || option.type === 'operation') {
      return {
        label:
          typeof option.title === 'string'
            ? option.title
            : option.type === 'tpl' && typeof (option as any).tpl === 'string'
            ? (option as any).tpl /** 处理 SchemaObject 的场景 */
            : option.name,
        value: option.name ?? (option as any).key,
        /** 使用$$id用于定位 */
        nodeId: option.$$id,
        hidden: option.type === 'operation',
        pristine: option
      };
    }

    return false;
  }

  async initOptions() {
    const {manager, nodeId, builder, data: ctx} = this.props;
    const store = manager.store;
    const node = store.getNodeById(nodeId);

    this.setState({loading: true});

    if (builder && builder.getCRUDListFields) {
      try {
        const options = await builder.getCRUDListFields<Option>({
          renderer: 'crud',
          schema: node.schema,
          inScaffold: false,
          controlSettings: {
            fieldMapper: this.transformOption.bind(this)
          }
        });

        this.setState({options});
      } catch (error) {}
    } else {
      /** 从 Node 取是为了获取设计态节点 ID */
      const columns = node?.schema?.columns as DesignColumnSchema[];
      const result: Option[] = [];
      columns.forEach(col => {
        const option = this.transformOption(col);

        if (option !== false) {
          result.push(option);
        }
      });
      this.setState({options: result});
    }

    this.setState({loading: false});
  }

  @autobind
  dragRef(ref: any) {
    if (!this.drag && ref) {
      this.initDragging();
    } else if (this.drag && !ref) {
      this.destroyDragging();
    }

    this.drag = ref;
  }

  initDragging() {
    const {classnames: cx} = this.props;
    const dom = findDOMNode(this) as HTMLElement;

    this.sortable = new Sortable(
      dom.querySelector(
        `.${cx('ae-CRUDConfigControl-list')}`
      ) as HTMLUListElement,
      {
        group: 'CRUDColumnControlGroup',
        animation: 150,
        handle: `.${cx('ae-CRUDConfigControl-list-item')}`,
        ghostClass: `.${cx('ae-CRUDConfigControl-list-item--dragging')}`,
        onEnd: (e: SortableEvent) => {
          if (
            e.newIndex === e.oldIndex ||
            e.newIndex == null ||
            e.oldIndex == null
          ) {
            return;
          }

          const parent = e.to as HTMLElement;

          if (e.oldIndex < parent.childNodes.length - 1) {
            parent.insertBefore(
              e.item,
              parent.childNodes[
                e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
              ]
            );
          } else {
            parent.appendChild(e.item);
          }

          const options = this.state.options.concat();

          // options[e.oldIndex] = options.splice(
          //   e.newIndex,
          //   1,
          //   options[e.oldIndex]
          // )[0];
          options.splice(e.newIndex, 0, options.splice(e.oldIndex, 1)[0]);

          this.setState({options}, () => this.handleSort());
        }
      }
    );
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  @autobind
  handleSort() {
    const {onBulkChange} = this.props;
    const options = this.state.options.concat();

    onBulkChange?.({columns: options.map(item => item.pristine)});
  }

  @autobind
  handleEdit(item: Option) {
    const {manager, node} = this.props;
    const columns = node?.schema?.columns ?? [];
    const idx = columns.findIndex((c: any) => c.id === item.pristine.id);

    if (!~idx) {
      toast.warning(`未找到对应列「${item.label}」`);
      return;
    }

    // FIXME: 理论上用item.nodeId就可以，不知道为何会重新构建一次导致store中node.id更新
    manager.setActiveId(columns[idx]?.$$id);
  }

  /** 添加列 */
  @autobind
  handleAddColumn(type: 'field' | 'empty' | 'container' | 'operation') {
    const {onBulkChange} = this.props;
    const options = this.state.options.concat();
    let scaffold: any;

    switch (type) {
      case 'field':
        this.setState({
          showAddModal: true,
          addModalData: {colTypeLabel: '字段列', colType: type}
        });
        break;
      case 'empty':
        scaffold = {
          title: '空列',
          name: 'empty'
        };
        break;
      case 'container':
        scaffold = {
          title: '容器',
          name: 'container',
          type: 'container',
          style: {
            position: 'static',
            display: 'block'
          },
          wrapperBody: false,
          body: []
        };
        break;
      case 'operation':
        this.setState({
          showAddModal: true,
          addModalData: {colTypeLabel: '操作列', colType: type}
        });
        break;
    }

    if (!scaffold) {
      return;
    }

    const columnSchema = JSONPipeIn({...scaffold});

    options.push({
      label: columnSchema.title,
      value: columnSchema.name,
      nodeId: columnSchema.$$id,
      hidden: type === 'operation',
      pristine: columnSchema
    });

    this.setState({options}, () => {
      onBulkChange?.({columns: options.map(item => item.pristine)});
    });
  }

  @autobind
  handleAddModalConfirm(scaffold: DesignColumnSchema) {
    const {onBulkChange} = this.props;
    const options = this.state.options.concat();

    options.push({
      label:
        typeof scaffold.title === 'string' ? scaffold.title : scaffold.name,
      value: scaffold.name,
      nodeId: scaffold.$$id,
      hidden: scaffold.type === 'operation',
      pristine: scaffold
    });

    this.setState({options}, () => {
      onBulkChange?.({columns: options.map(item => item.pristine)});
    });
  }

  @autobind
  handleAddModalClose() {
    this.setState({
      showAddModal: false,
      addModalData: undefined
    });
  }

  @autobind
  async handleDelete(item: Option, index: number) {
    const {onBulkChange, env} = this.props;
    const options = this.state.options;
    const confirmed = await env.confirm(`确定要删除列「${item.label}」吗？`);

    if (~index && confirmed) {
      options.splice(index, 1);

      this.setState({options}, () => {
        onBulkChange?.({columns: options.map(item => item.pristine)});
      });
    }
  }

  @autobind
  renderOption(item: Option, index: number) {
    const {
      classnames: cx,
      data: ctx,
      render,
      popOverContainer,
      env
    } = this.props;

    return (
      <li
        key={index}
        className={cx('ae-CRUDConfigControl-list-item', 'is-draggable')}
      >
        <TooltipWrapper
          tooltip={{
            content: item.label,
            tooltipTheme: 'dark',
            style: {fontSize: '12px'}
          }}
          container={popOverContainer || env?.getModalContainer?.()}
          trigger={['hover']}
          delay={150}
        >
          <div className={cx('ae-CRUDConfigControl-list-item-info')}>
            <span>{item.label}</span>
          </div>
        </TooltipWrapper>

        <div className={cx('ae-CRUDConfigControl-list-item-actions')}>
          {item.hidden || !item?.context?.isCascadingField ? null : (
            <Tag
              label={item?.context?.modelLabel}
              displayMode="normal"
              className={cx(
                'ae-CRUDConfigControl-list-item-tag',
                'ae-CRUDConfigControl-list-item-tag--cascading'
              )}
            />
          )}

          <Button
            level="link"
            size="sm"
            tooltip={{
              content: '去编辑',
              tooltipTheme: 'dark',
              style: {fontSize: '12px'}
            }}
            onClick={() => this.handleEdit(item)}
          >
            <Icon icon="column-setting" className="icon" />
          </Button>
          <Button
            level="link"
            size="sm"
            onClick={() => this.handleDelete(item, index)}
          >
            <Icon icon="column-delete" className="icon" />
          </Button>
        </div>
      </li>
    );
  }

  renderHeader() {
    const {classnames: cx, data: ctx, render, env} = this.props;

    return (
      <header className={cx('ae-CRUDConfigControl-header')}>
        <span className={cx('Form-label')}>列配置</span>
        {render('column-control-dropdown', {
          type: 'dropdown-button',
          closeOnClick: true,
          hideCaret: true,
          level: 'link',
          align: 'right',
          trigger: ['click'],
          popOverContainer: env.getModalContainer ?? this.dom ?? document.body,
          icon: 'column-add',
          label: '添加列',
          className: cx('ae-CRUDConfigControl-dropdown'),
          buttons: [
            {
              type: 'button',
              label: '字段列',
              onClick: () => this.handleAddColumn('field')
            },
            {
              type: 'button',
              label: '空列',
              onClick: () => this.handleAddColumn('empty')
            },
            {
              type: 'button',
              label: '容器列',
              onClick: () => this.handleAddColumn('container')
            },
            {
              type: 'button',
              label: '操作列',
              onClick: () => this.handleAddColumn('operation')
            }
          ]
        })}
      </header>
    );
  }

  render() {
    const {classnames: cx, data: ctx, manager, builder} = this.props;
    const {options, loading, showAddModal, addModalData} = this.state;

    return (
      <div className={cx('ae-CRUDConfigControl')}>
        {loading ? (
          <Spinner
            show
            tip="字段加载中"
            tipPlacement="bottom"
            size="sm"
            className={cx('flex')}
          />
        ) : (
          <>
            {this.renderHeader()}
            {Array.isArray(options) && options.length > 0 ? (
              <ul
                className={cx('ae-CRUDConfigControl-list')}
                ref={this.dragRef}
              >
                {options.map((item, index) => {
                  return this.renderOption(item, index);
                })}
              </ul>
            ) : (
              <ul
                className={cx('ae-CRUDConfigControl-list')}
                ref={this.dragRef}
              >
                <p className={cx(`ae-CRUDConfigControl-placeholder`)}>
                  暂无数据
                </p>
              </ul>
            )}
          </>
        )}

        {showAddModal ? (
          <AddColumnModal
            render={this.props.render}
            visible={showAddModal}
            initData={addModalData as any}
            ctx={ctx}
            manager={manager}
            builder={builder}
            onConfirm={this.handleAddModalConfirm}
            onClose={this.handleAddModalClose}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-crud-column-control',
  renderLabel: false,
  wrap: false
})
export class CRUDColumnControlRenderer extends CRUDColumnControl {}
