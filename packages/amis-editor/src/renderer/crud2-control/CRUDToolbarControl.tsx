/**
 * @file CRUDToolbarControl
 * @desc 顶部工具栏控件
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {FormItem, Button, Icon, toast, Spinner, autobind} from 'amis';
import {TooltipWrapper} from 'amis-ui';
import {JSONPipeIn} from 'amis-editor-core';
import {DSFeature, DSFeatureType, DSFeatureEnum} from '../../builder';
import {traverseSchemaDeep} from '../../builder/utils';
import {deepRemove, addSchema2Toolbar} from '../../plugin/CRUD2/utils';

import type {FormControlProps} from 'amis';
import type {EditorNodeType} from 'amis-editor-core';
import type {ColumnSchema} from 'amis/lib/renderers/Table2';
import type {DSBuilderInterface} from '../../builder';

type ActionValue =
  | Extract<DSFeatureType, 'Insert' | 'BulkEdit' | 'BulkDelete' | 'Export'>
  | 'custom';

interface Option {
  label: string;
  value: ActionValue;
  nodeId: string;
  /** 原始结构 */
  pristine: Record<string, any>;
  node?: EditorNodeType;
}

export interface CRUDToolbarControlProps extends FormControlProps {
  /** CRUD 节点的 ID */
  nodeId: string;
  builder: DSBuilderInterface;
}

export interface CRUDToolbarControlState {
  options: Option[];
  loading: boolean;
}

export class CRUDToolbarControl extends React.Component<
  CRUDToolbarControlProps,
  CRUDToolbarControlState
> {
  drag?: HTMLElement | null;

  dom?: HTMLElement;

  /** 可供使用的功能集合 */
  collection: ActionValue[] = [
    DSFeatureEnum.Insert,
    DSFeatureEnum.BulkEdit,
    DSFeatureEnum.BulkDelete,
    DSFeatureEnum.Export
  ];

  constructor(props: CRUDToolbarControlProps) {
    super(props);

    this.state = {
      options: [],
      loading: false
    };
  }

  componentDidMount(): void {
    this.dom = findDOMNode(this) as HTMLElement;
    const actions = this.getActionNodes(this.props);
    this.initOptions(actions);
  }

  getActionNodes(props: CRUDToolbarControlProps) {
    const {manager, nodeId, name = 'headerToolbar'} = props;
    const store = manager.store;
    const hostNode: EditorNodeType = store.getNodeById(nodeId);
    const actionNodes: EditorNodeType[] = [];
    traverseSchemaDeep(
      pick(hostNode?.schema, name),
      (key: string, value: any, host: any) => {
        if (
          key === 'behavior' &&
          [
            DSFeatureEnum.Insert,
            DSFeatureEnum.BulkEdit,
            DSFeatureEnum.BulkDelete,
            DSFeatureEnum.Export,
            'custom'
          ].includes(value)
        ) {
          const node = store.getNodeById(host?.$$id);

          !!node && actionNodes.push(node);
        }

        return [key, value];
      }
    );

    return actionNodes;
  }

  initOptions(actions: EditorNodeType[]) {
    if (!actions || !Array.isArray(actions) || !actions.length) {
      this.setState({options: []});
      return;
    }

    const options = actions.map(node => {
      const schema = node.schema;
      const behavior = schema.behavior as ActionValue;

      return {
        label: this.getOptionLabel(schema, behavior),
        value: behavior,
        nodeId: schema.$$id,
        node: node,
        pristine: node.schema
      };
    });

    this.setState({options});
  }

  getOptionLabel(schema: any, behavior: ActionValue) {
    return behavior === 'custom' ? schema.label : DSFeature[behavior].label;
  }

  @autobind
  handleEdit(item: Option) {
    const {manager} = this.props;

    if (!item.nodeId) {
      toast.warning(`未找到工具栏中对应操作「${item.label}」`);
      return;
    }

    manager.setActiveId(item.nodeId);
  }

  /** 添加列 */
  @autobind
  async handleAddAction(type: ActionValue) {
    this.setState({loading: true});
    const {
      onBulkChange,
      onChange,
      data: ctx,
      nodeId,
      manager,
      builder
    } = this.props;
    const options = this.state.options.concat();
    const node = manager.store.getNodeById(nodeId);
    const CRUDSchemaID = node?.schema?.id;
    let scaffold: any;

    switch (type) {
      case 'Insert':
        scaffold = await builder.buildInsertSchema(
          {
            feat: DSFeatureEnum.Insert,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              insertFields: (ctx?.columns ?? [])
                .filter((item: ColumnSchema) => item.type !== 'operation')
                .map((item: ColumnSchema) => ({
                  inputType: item.type ?? 'input-text',
                  name: item.name,
                  label: item.title
                })),
              insertApi: ''
            }
          },
          CRUDSchemaID
        );
        break;
      case 'BulkEdit':
        scaffold = await builder.buildBulkEditSchema(
          {
            feat: DSFeatureEnum.BulkEdit,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              bulkEditFields: (ctx?.columns ?? [])
                .filter((item: ColumnSchema) => item.type !== 'operation')
                .map((item: ColumnSchema) => ({
                  inputType: item.type ?? 'input-text',
                  name: item.name,
                  label: item.title
                })),
              bulkEdit: ''
            }
          },
          CRUDSchemaID
        );
        break;
      case 'BulkDelete':
        scaffold = await builder.buildCRUDBulkDeleteSchema(
          {
            feat: DSFeatureEnum.BulkDelete,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              bulkDeleteApi: ''
            }
          },
          CRUDSchemaID
        );
        break;
      case 'Export':
        scaffold = await builder.buildCRUDExportSchema(
          {
            feat: DSFeatureEnum.Export,
            renderer: 'crud',
            inScaffold: false,
            schema: ctx,
            scaffoldConfig: {
              exportApi: ''
            }
          },
          CRUDSchemaID
        );
        break;
      default:
        scaffold = {
          type: 'button',
          label: '按钮',
          behavior: 'custom',
          className: 'm-r-xs',
          onEvent: {
            click: {
              actions: []
            }
          }
        };
    }

    if (!scaffold) {
      this.setState({loading: false});
      return;
    }

    const headerToolbarSchema = cloneDeep(ctx.headerToolbar);
    const actionSchema = JSONPipeIn({...scaffold});

    options.push({
      label: this.getOptionLabel(actionSchema, type),
      value: type,
      nodeId: actionSchema.$$id,
      pristine: actionSchema
    });

    this.setState({options, loading: false}, () => {
      const fakeCRUD = {headerToolbar: headerToolbarSchema};
      /** 自适应添加操作按钮到顶部工具栏 */
      addSchema2Toolbar(fakeCRUD, actionSchema, 'header', 'left');
      onChange?.(fakeCRUD.headerToolbar, true, true);
    });
  }

  @autobind
  async handleDelete(option: Option, index: number) {
    const {env, data: ctx, onBulkChange, onChange} = this.props;
    const options = this.state.options.concat();
    const confirmed = await env.confirm(
      `确定要删除工具栏中「${option.label}」吗？`
    );

    const headerToolbarSchema = cloneDeep(ctx.headerToolbar);

    if (confirmed) {
      const marked = deepRemove(
        headerToolbarSchema,
        item => item.behavior === option.value
      );

      if (marked) {
        options.splice(index, 1);

        this.setState({options}, () => {
          onChange?.(headerToolbarSchema, true, true);
        });
      }
    }
  }

  @autobind
  renderOption(item: Option, index: number) {
    const {classnames: cx, popOverContainer, env} = this.props;

    return (
      <li key={index} className={cx('ae-CRUDConfigControl-list-item')}>
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
    const {classnames: cx, render, env} = this.props;
    const options = this.state.options;
    const actions = this.collection.concat();

    // options.forEach(item => {
    //   if (actions.includes(item.value)) {
    //     const idx = actions.indexOf(item.value);
    //     if (~idx) {
    //       actions.splice(idx, 1);
    //     }
    //   }
    // });

    const optionValues = options.map(item => item.value);

    return (
      <header className={cx('ae-CRUDConfigControl-header')}>
        <span className={cx('Form-label')}>工具栏</span>
        {render('crud-toolbar-control-dropdown', {
          type: 'dropdown-button',
          closeOnClick: true,
          hideCaret: true,
          level: 'link',
          align: 'right',
          trigger: ['click'],
          popOverContainer: env.getModalContainer ?? this.dom ?? document.body,
          icon: 'column-add',
          label: '添加操作',
          className: cx('ae-CRUDConfigControl-dropdown'),
          disabledTip: {
            content: '暂无可添加操作',
            tooltipTheme: 'dark'
          },
          buttons: actions
            .map((item: Exclude<ActionValue, 'custom'>) => ({
              type: 'button',
              label: DSFeature[item].label,
              disabled: !!~optionValues.findIndex(op => op === item),
              onClick: () => this.handleAddAction(item)
            }))
            .concat({
              type: 'button',
              label: '自定义按钮',
              disabled: false,
              onClick: () => this.handleAddAction('custom')
            })
        })}
      </header>
    );
  }

  render() {
    const {classnames: cx, data: ctx} = this.props;
    const {options, loading} = this.state;

    return (
      <div className={cx('ae-CRUDConfigControl')}>
        {loading ? (
          <Spinner
            show
            tip="操作生成中"
            tipPlacement="bottom"
            size="sm"
            className={cx('flex')}
          />
        ) : (
          <>
            {this.renderHeader()}
            <ul className={cx('ae-CRUDConfigControl-list')}>
              {Array.isArray(options) && options.length > 0 ? (
                options.map((item, index) => {
                  return this.renderOption(item, index);
                })
              ) : (
                <p className={cx(`ae-CRUDConfigControl-placeholder`)}>
                  暂无数据
                </p>
              )}
            </ul>
          </>
        )}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-crud-toolbar-control',
  renderLabel: false,
  wrap: false
})
export class CRUDToolbarControlRenderer extends CRUDToolbarControl {}
