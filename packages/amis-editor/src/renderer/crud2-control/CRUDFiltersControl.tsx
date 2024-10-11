/**
 * @file CRUDFiltersControl
 * @desc 搜索控件
 */

import React from 'react';
import {findDOMNode} from 'react-dom';
import cloneDeep from 'lodash/cloneDeep';
import uniq from 'lodash/uniq';
import {
  FormItem,
  Button,
  Icon,
  toast,
  Switch,
  Spinner,
  Tag,
  autobind
} from 'amis';
import {TooltipWrapper} from 'amis-ui';
import {DSFeatureEnum, ModelDSBuilderKey} from '../../builder/constants';
import {traverseSchemaDeep} from '../../builder/utils';
import {deepRemove} from '../../plugin/CRUD2/utils';

import type {
  DSFeatureType,
  DSBuilderInterface,
  CRUDScaffoldConfig
} from '../../builder';
import type {EditorNodeType} from 'amis-editor-core';
import type {FormControlProps, PlainObject} from 'amis';

interface Option {
  label: string;
  value: string;
  nodeId: string;
  node?: EditorNodeType;
  /** 原始结构 */
  pristine: Record<string, any>;
  /** 字段信息 */
  context?: Record<string, any>;
}

interface CRUDFiltersControlProps extends FormControlProps {
  /** CRUD配置面板的数据 */
  data: Record<string, any>;
  /** CRUD 节点的 ID */
  nodeId: string;
  // TODO：暂时支持简单查询先不扩展了
  feat: Extract<DSFeatureType, 'SimpleQuery' | 'AdvancedQuery' | 'FuzzyQuery'>;
  /** 数据源构造器 */
  builder: DSBuilderInterface;
}

interface CRUDFiltersControlState {
  options: Option[];
  loading: boolean;
  checked: boolean;
  /** 目标组件的 Node.id */
  targetNodeId?: string;
}

export class CRUDFiltersControl extends React.Component<
  CRUDFiltersControlProps,
  CRUDFiltersControlState
> {
  dom?: HTMLElement;

  constructor(props: CRUDFiltersControlProps) {
    super(props);
    this.state = {
      options: [],
      loading: false,
      checked: false
    };
  }

  componentDidMount(): void {
    this.dom = findDOMNode(this) as HTMLElement;
    this.initOptions();
  }

  componentDidUpdate(
    prevProps: Readonly<CRUDFiltersControlProps>,
    prevState: Readonly<CRUDFiltersControlState>,
    snapshot?: any
  ): void {
    if (
      prevProps.data.headerToolbar !== this.props.data.headerToolbar ||
      prevProps.data.filter !== this.props.data.filter
    ) {
      this.initOptions();
    }
  }

  transformOption(option: any): Option | false {
    if (option.name) {
      return {
        label:
          typeof option.label === 'string'
            ? option.label
            : option.label?.type === 'tpl' &&
              typeof (option.label as any).tpl === 'string'
            ? (option.label as any).tpl /** 处理 SchemaObject 的场景 */
            : option.name,
        value: option.name ?? (option as any).key,
        /** 使用id用于定位 */
        nodeId: option.$$id,
        pristine: option
      };
    }

    return false;
  }

  @autobind
  async initOptions() {
    const {manager, nodeId, feat, builder} = this.props;
    const store = manager.store;
    const node = store.getNodeById(nodeId);
    const CRUDSchema = node.schema;
    const filterSchema = CRUDSchema?.filter
      ? Array.isArray(CRUDSchema.filter)
        ? CRUDSchema.filter.find(
            (item: any) => item.behavior && Array.isArray(item.behavior)
          )
        : CRUDSchema.filter?.type === 'form'
        ? CRUDSchema.filter
        : undefined
      : undefined;

    let targetNodeId: string = filterSchema ? filterSchema.$$id : '';

    if (!builder) {
      const options: Option[] = [];
      (filterSchema?.body ?? []).forEach((formItem: any) => {
        if (
          formItem.type === 'condition-builder' ||
          formItem.behavior === 'AdvancedQuery'
        ) {
          return;
        }

        const option = this.transformOption(formItem);

        if (option !== false) {
          options.push(option);
        }
      });

      this.setState({
        options,
        checked: options.length > 0,
        targetNodeId: targetNodeId
      });
      return;
    }

    this.setState({loading: true});

    const baseOpitons = {
      feat,
      renderer: 'crud',
      schema: node.schema,
      inScaffold: false,
      controlSettings: {
        fieldMapper: this.transformOption.bind(this)
      }
    };

    try {
      if (feat === DSFeatureEnum.SimpleQuery && builder.filterByFeat(feat)) {
        const fields =
          (await builder.getCRUDSimpleQueryFields?.<Option>({
            ...baseOpitons
          })) ?? [];

        this.setState({
          options: fields,
          checked: fields.length > 0,
          targetNodeId
        });
      } else if (
        feat === DSFeatureEnum.AdvancedQuery &&
        builder.filterByFeat(feat)
      ) {
        const fields =
          (await builder?.getCRUDAdvancedQueryFields?.<Option>({
            ...baseOpitons
          })) ?? [];
        const CBSchema = (filterSchema?.body ?? []).find(
          (item: any) =>
            item.type === 'condition-builder' &&
            (item.behavior === DSFeatureEnum.AdvancedQuery ||
              item.name === '__filter')
        );

        targetNodeId = CBSchema ? CBSchema.$$id : '';
        this.setState({
          options: fields,
          checked: fields.length > 0,
          targetNodeId
        });
      } else if (
        feat === DSFeatureEnum.FuzzyQuery &&
        builder.filterByFeat(feat)
      ) {
        const fields =
          (await builder?.getCRUDFuzzyQueryFields?.<Option>({
            ...baseOpitons
          })) ?? [];

        let fuzzyQuerySchema: any;

        traverseSchemaDeep(CRUDSchema, (key: string, value: any, host: any) => {
          if (
            key === 'behavior' &&
            value === DSFeatureEnum.FuzzyQuery &&
            host.type === 'search-box'
          ) {
            fuzzyQuerySchema = host;
          }
          return [key, value];
        });

        targetNodeId = fuzzyQuerySchema ? fuzzyQuerySchema.$$id : '';
        this.setState({
          options: fields,
          checked: fields.length > 0,
          targetNodeId
        });
      }
    } catch (error) {}

    this.setState({loading: false});
  }

  setFilterVisible(schema: PlainObject) {
    if (!('visibleOn' in schema) && schema.type) {
      schema.visible = schema.body?.length > 0;
    }
  }

  async updateSimpleQuery(enable: boolean) {
    const {manager, nodeId, builder} = this.props;
    const store = manager.store;
    const CRUDNode = store.getNodeById(nodeId);
    const CRUDSchema = CRUDNode?.schema;
    const CRUDSchemaID = CRUDSchema?.schema?.id;
    const config = await builder.guessCRUDScaffoldConfig({schema: CRUDSchema});
    const filterSchema = cloneDeep(
      CRUDSchema?.filter
        ? Array.isArray(CRUDSchema.filter)
          ? CRUDSchema.filter.find(
              (item: any) =>
                item.behavior &&
                Array.isArray(item.behavior) &&
                item.type === 'form'
            )
          : CRUDSchema.filter?.type === 'form'
          ? CRUDSchema.filter
          : undefined
        : undefined
    );

    if (filterSchema) {
      if (enable) {
        const simpleQuerySchema =
          (await builder.buildSimpleQueryCollectionSchema?.({
            renderer: 'crud',
            schema: CRUDSchema,
            inScaffold: false,
            buildSettings: {
              useDefaultFields: true
            }
          })) ?? [];

        let newFilterSchema = traverseSchemaDeep(
          filterSchema,
          (key: string, value: any, host: any) => {
            /** 更新标识符 */
            if (key === 'behavior' && Array.isArray(value)) {
              return [
                key,
                uniq([...value, DSFeatureEnum.SimpleQuery].filter(Boolean))
              ];
            }

            /** 更新内容区 */
            if (
              key === 'body' &&
              Array.isArray(value) &&
              host?.type === 'form'
            ) {
              return [key, [...value, ...simpleQuerySchema].filter(Boolean)];
            }

            return [key, value];
          }
        );
        this.setFilterVisible(newFilterSchema);

        const targetNode = manager.store.getNodeById(filterSchema.$$id);

        if (targetNode) {
          targetNode.updateSchema(newFilterSchema);
        }
      } else {
        let newFilterSchema = traverseSchemaDeep(
          filterSchema,
          (key: string, value: any, host: any) => {
            /** 更新标识符 */
            if (key === 'behavior' && Array.isArray(value)) {
              return [
                key,
                value.filter(
                  (i: DSFeatureType) => i !== DSFeatureEnum.SimpleQuery
                )
              ];
            }

            /** 更新内容区 */
            if (
              key === 'body' &&
              Array.isArray(value) &&
              host?.type === 'form'
            ) {
              return [
                key,
                value.filter(
                  (item: any) => item?.behavior !== DSFeatureEnum.SimpleQuery
                )
              ];
            }

            return [key, value];
          }
        );

        this.setFilterVisible(newFilterSchema);
        const targetNode = manager.store.getNodeById(filterSchema.$$id);

        if (targetNode) {
          targetNode.updateSchema(newFilterSchema);
        }
      }
    } else {
      if (enable) {
        /** 没有查询表头新建一个 */
        const simpleQuerySchema =
          (await builder.buildSimpleQueryCollectionSchema?.({
            renderer: 'crud',
            schema: CRUDSchema,
            inScaffold: false,
            buildSettings: {
              useDefaultFields: true
            }
          })) ?? [];
        const filter = await builder.buildCRUDFilterSchema({
          renderer: 'crud',
          inScaffold: false,
          schema: CRUDSchema,
          feats: [DSFeatureEnum.SimpleQuery],
          scaffoldConfig: {
            dsType: CRUDSchema.dsType,
            simpleQueryFields: simpleQuerySchema
          },
          buildSettings: {
            useDefaultFields: true
          }
        });

        const newFilterSchema = cloneDeep(CRUDNode?.schema.filter);
        const isArrayFilter = Array.isArray(newFilterSchema);

        if (isArrayFilter) {
          newFilterSchema.push(filter);
        }

        CRUDNode.updateSchema({
          ...CRUDSchema,
          filter: isArrayFilter ? newFilterSchema : filter
        });
      }
    }
  }

  @autobind
  async updateAdvancedQuery(enable: boolean) {
    const {manager, nodeId, builder} = this.props;
    const store = manager.store;
    const CRUDNode = store.getNodeById(nodeId);
    const CRUDSchema = CRUDNode?.schema;
    const filterSchema = cloneDeep(
      Array.isArray(CRUDSchema.filter)
        ? CRUDNode?.schema.filter.find(
            (item: any) => item.behavior && Array.isArray(item.behavior)
          )
        : CRUDNode?.schema.filter
    );

    if (filterSchema) {
      if (enable) {
        const advancedQuerySchema = await builder.buildAdvancedQuerySchema?.({
          renderer: 'crud',
          inScaffold: false,
          schema: CRUDSchema,
          buildSettings: {
            useDefaultFields: true
          }
        });

        let newFilterSchema = traverseSchemaDeep(
          filterSchema,
          (key: string, value: any, host: any) => {
            /** 更新标识符 */
            if (key === 'behavior' && Array.isArray(value)) {
              return [
                key,
                uniq([...value, DSFeatureEnum.AdvancedQuery].filter(Boolean))
              ];
            }

            /** 更新内容区 */
            if (
              key === 'body' &&
              Array.isArray(value) &&
              host?.type === 'form'
            ) {
              return [key, [advancedQuerySchema, ...value]];
            }

            return [key, value];
          }
        );
        this.setFilterVisible(newFilterSchema);

        const targetNode = manager.store.getNodeById(filterSchema.$$id);

        if (targetNode) {
          targetNode.updateSchema(newFilterSchema);
        }
      } else {
        let newFilterSchema = traverseSchemaDeep(
          filterSchema,
          (key: string, value: any, host: any) => {
            /** 更新标识符 */
            if (key === 'behavior' && Array.isArray(value)) {
              return [
                key,
                value.filter(
                  (i: DSFeatureType) => i !== DSFeatureEnum.AdvancedQuery
                )
              ];
            }

            /** 更新内容区 */
            if (
              key === 'body' &&
              Array.isArray(value) &&
              host?.type === 'form'
            ) {
              return [
                key,
                value.filter(
                  (item: any) =>
                    item?.behavior !== DSFeatureEnum.AdvancedQuery &&
                    item.type !== 'condition-builder'
                )
              ];
            }

            return [key, value];
          }
        );
        this.setFilterVisible(newFilterSchema);

        const targetNode = manager.store.getNodeById(filterSchema.$$id);

        if (targetNode) {
          targetNode.updateSchema(newFilterSchema);
        }
      }
    } else {
      if (enable) {
        /** 没有查询表头新建一个 */
        const filter = await builder.buildCRUDFilterSchema({
          renderer: 'crud',
          inScaffold: false,
          schema: CRUDSchema,
          feats: [DSFeatureEnum.AdvancedQuery],
          buildSettings: {
            useDefaultFields: true
          }
        });

        const newFilterSchema = cloneDeep(CRUDNode?.schema.filter);
        const isArrayFilter = Array.isArray(newFilterSchema);

        if (isArrayFilter) {
          newFilterSchema.push(filter);
        }

        CRUDNode.updateSchema({
          ...CRUDSchema,
          filter: isArrayFilter ? newFilterSchema : filter
        });
      }
    }
  }

  @autobind
  async updateFuzzyQuery(enable: boolean) {
    const {manager, nodeId, builder} = this.props;
    const store = manager.store;
    const CRUDNode = store.getNodeById(nodeId);
    const CRUDSchema = CRUDNode?.schema;
    const CRUDSchemaID = CRUDSchema?.schema?.id;
    const headerToolbar = cloneDeep(CRUDSchema.headerToolbar);

    /** 关闭功能且存在定位容器 */
    if (!enable) {
      if (headerToolbar) {
        deepRemove(
          headerToolbar,
          (schema: any) => {
            return (
              schema.behavior === DSFeatureEnum.FuzzyQuery &&
              schema.type === 'search-box'
            );
          },
          true
        );

        CRUDNode.updateSchema({
          ...CRUDSchema,
          headerToolbar
        });
      }

      return;
    }

    /** 没有工具栏的话直接重新创建 */
    if (!headerToolbar) {
      CRUDNode.updateSchema({
        ...CRUDSchema,
        headerToolbar: await builder.buildCRUDHeaderToolbar?.(
          {
            renderer: 'crud',
            inScaffold: false,
            schema: CRUDSchema,
            buildSettings: {
              useDefaultFields: true
            }
          },
          CRUDSchemaID
        )
      });
      return;
    }

    /** 定位容器 */
    let fuzzyQueryParent: any;
    traverseSchemaDeep(CRUDSchema, (key: string, value: any, host: any) => {
      if (
        key === 'behavior' &&
        Array.isArray(value) &&
        host?.behavior.includes('FuzzyQuery') &&
        host?.type === 'container' &&
        Array.isArray(host?.body)
      ) {
        fuzzyQueryParent = host;
      }

      return [key, value];
    });

    if (fuzzyQueryParent) {
      const fuzzyQuerySchema = await builder.buildFuzzyQuerySchema?.({
        renderer: 'crud',
        inScaffold: false,
        schema: CRUDSchema,
        buildSettings: {
          useDefaultFields: true
        }
      });
      const newFuzzyParent = cloneDeep(fuzzyQueryParent);
      newFuzzyParent.body = [...newFuzzyParent.body, fuzzyQuerySchema];
      const targetNode = manager.store.getNodeById(fuzzyQueryParent.$$id);

      if (targetNode) {
        targetNode.updateSchema(newFuzzyParent);
      }
    } else {
      const fuzzyQuerySchema = await builder.buildFuzzyQuerySchema?.({
        renderer: 'crud',
        inScaffold: false,
        schema: CRUDSchema,
        buildSettings: {
          useDefaultFields: true
        }
      });

      if (
        headerToolbar?.[0]?.type === 'flex' &&
        Array.isArray(headerToolbar[0]?.items)
      ) {
        const newFlexContainer = cloneDeep(headerToolbar[0]);

        /** toolbar 里有 flex 容器，直接追加 */
        const container = await builder.buildFuzzyQuerySchema?.({
          renderer: 'crud',
          inScaffold: false,
          schema: CRUDSchema,
          buildSettings: {
            useDefaultFields: true,
            wrapContainer: 'container'
          }
        });
        newFlexContainer.items.push(container);

        const targetNode = manager.store.getNodeById(headerToolbar[0].$$id);

        if (targetNode) {
          targetNode.updateSchema(newFlexContainer);
        }
      } else {
        /** toolbar 里没有 flex 容器，重新创建一个 */
        const newHeaderToolbar = cloneDeep(headerToolbar);

        const flexContainer = await builder.buildFuzzyQuerySchema?.({
          renderer: 'crud',
          inScaffold: false,
          schema: CRUDSchema,
          buildSettings: {
            useDefaultFields: true,
            wrapContainer: 'flex'
          }
        });
        newHeaderToolbar.push(flexContainer);

        CRUDNode.updateSchema({
          ...CRUDSchema,
          headerToolbar: newHeaderToolbar
        });
      }
    }
  }

  @autobind
  async handleToggle(checked: boolean) {
    const {manager, nodeId, feat, builder} = this.props;
    const store = manager.store;
    this.setState({loading: true, checked});

    try {
      if (feat === DSFeatureEnum.SimpleQuery && builder.filterByFeat(feat)) {
        await this.updateSimpleQuery(checked);
      } else if (
        feat === DSFeatureEnum.AdvancedQuery &&
        builder.filterByFeat(feat)
      ) {
        await this.updateAdvancedQuery(checked);
      }
      if (feat === DSFeatureEnum.FuzzyQuery && builder.filterByFeat(feat)) {
        await this.updateFuzzyQuery(checked);
      }

      // crud模型实体每次都需要重新生成jsonql的筛选条件
      if (builder.key === ModelDSBuilderKey) {
        const node = store.getNodeById(nodeId);
        const crudSchema = node?.schema;
        if (crudSchema) {
          let schema = await builder.buildApiSchema({
            schema: node.schema,
            renderer: 'crud',
            sourceKey: 'api',
            feat: DSFeatureEnum.List
          });
          node.updateSchema({
            api: schema.api
          });
        }
      }
    } catch (error) {}

    this.setState({loading: false, checked});
  }

  @autobind
  handleEdit(item?: Option) {
    const {manager} = this.props;
    const targetNodeId = item ? item?.nodeId : this.state.targetNodeId;

    if (!targetNodeId) {
      toast.warning(`未找到目标组件`);
      return;
    }

    manager.setActiveId(targetNodeId);
  }

  @autobind
  renderOption(item: Option, index: number) {
    const {classnames: cx, feat, popOverContainer, env} = this.props;

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
          {item?.context?.isCascadingField ? (
            <Tag
              label={item?.context?.modelLabel}
              displayMode="normal"
              className={cx(
                'ae-CRUDConfigControl-list-item-tag',
                'ae-CRUDConfigControl-list-item-tag--cascading'
              )}
            />
          ) : null}
          {feat === 'SimpleQuery' ? (
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
              <Icon icon="column-setting" className={cx('icon')} />
            </Button>
          ) : null}
        </div>
      </li>
    );
  }

  renderHeader() {
    const {
      classPrefix: ns,
      classnames: cx,
      render,
      env,
      label,
      feat
    } = this.props;
    const {options, checked} = this.state;

    return (
      <header className={cx('ae-CRUDConfigControl-header', 'mb-2')}>
        <span className={cx('Form-label')}>{label}</span>

        <div className={cx('ae-CRUDConfigControl-header-actions')}>
          <Switch
            className={cx('ae-CRUDConfigControl-header-actions-switch')}
            key="switch"
            size="sm"
            classPrefix={ns}
            value={checked}
            onChange={this.handleToggle}
          />
          <div className={cx('ae-CRUDConfigControl-header-actions-divider')} />
          <Button
            level="link"
            size="sm"
            tooltip={{
              content: '去编辑目标组件',
              tooltipTheme: 'dark',
              style: {fontSize: '12px'}
            }}
            onClick={() => this.handleEdit()}
          >
            <Icon
              icon="share-link"
              className={cx('icon')}
              style={{width: '16px', height: '16px'}}
            />
          </Button>
        </div>
      </header>
    );
  }

  render(): React.ReactNode {
    const {classnames: cx} = this.props;
    const {options, loading} = this.state;

    return (
      <div className={cx('ae-CRUDConfigControl')}>
        {this.renderHeader()}
        <ul className={cx('ae-CRUDConfigControl-list')}>
          {loading ? (
            <Spinner
              show
              tip="字段加载中"
              tipPlacement="bottom"
              size="sm"
              className={cx('flex')}
            />
          ) : Array.isArray(options) && options.length > 0 ? (
            options.map((item, index) => {
              return this.renderOption(item, index);
            })
          ) : (
            <p className={cx(`ae-CRUDConfigControl-placeholder`)}>暂无字段</p>
          )}
        </ul>
      </div>
    );
  }
}

@FormItem({
  type: 'ae-crud-filters-control',
  renderLabel: false,
  wrap: false
})
export class CRUDFiltersControlRenderer extends CRUDFiltersControl {}
