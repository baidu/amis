import {render, RendererProps} from 'amis';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {NodeWrapper} from './NodeWrapper';
import {PanelProps, RegionConfig, RendererInfo} from '../plugin';
import cx from 'classnames';
import groupBy from 'lodash/groupBy';
import {RegionWrapper} from './RegionWrapper';
import find from 'lodash/find';
import {ContainerWrapper} from './ContainerWrapper';
import {observer} from 'mobx-react';
import {EditorNodeContext, EditorNodeType} from '../store/node';
import {EditorManager} from '../manager';
import flatten from 'lodash/flatten';
import {render as reactRender, unmountComponentAtNode} from 'react-dom';
import {
  autobind,
  diff,
  getThemeConfig,
  JSONGetById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate,
  getFixDialogType
} from '../util';
import {createObjectFromChain} from 'amis-core';
import {ErrorBoundary} from 'amis-core';
import {CommonConfigWrapper} from './CommonConfigWrapper';
import type {Schema} from 'amis';
import type {DataScope} from 'amis-core';
import type {RendererConfig} from 'amis-core';
import type {SchemaCollection} from 'amis';
import omit from 'lodash/omit';

// 创建 Node Store 并构建成树
export function makeWrapper(
  manager: EditorManager,
  info: RendererInfo,
  rendererConfig: RendererConfig
) {
  type Props = RendererProps & {
    $$id: string;
  };
  const store = manager.store;
  const renderer = rendererConfig.component;

  @observer
  class Wrapper extends React.Component<Props> {
    static displayName = renderer.displayName;
    static propsList = ((renderer && renderer.propsList) || []).concat([
      '$$id'
      // '$$editor'
    ]);
    static contextType = EditorNodeContext;
    editorNode?: EditorNodeType;
    scopeId?: string;

    UNSAFE_componentWillMount() {
      const parent: EditorNodeType = (this.context as any) || store.root;
      if (!info.id) {
        return;
      }

      this.editorNode = parent.addChild({
        id: info.id, // 页面schema中的 $$id
        type: info.type,
        label: info.name,
        isCommonConfig: !!this.props.$$commonSchema,
        path: this.props.$path,
        schemaPath: info.schemaPath,
        dialogTitle: info.dialogTitle,
        dialogType: info.dialogType,
        info,
        getData: () => this.props.data
      });

      this.editorNode!.setRendererConfig(rendererConfig);

      // 查找父数据域，将当前组件数据域追加上去，使其形成父子关系
      if (
        (rendererConfig.storeType || info.isListComponent) &&
        !manager.dataSchema.hasScope(`${info.id}-${info.type}`)
      ) {
        let from = parent;
        let closestScope: DataScope | undefined = undefined;
        while (from && !closestScope) {
          if (from === store.root) {
            closestScope = manager.dataSchema.getScope('root');
          } else if (manager.dataSchema.hasScope(`${from.id}-${from.type}`)) {
            closestScope = manager.dataSchema.getScope(
              `${from.id}-${from.type}`
            );
          }

          // node.parent 是找不到 root 那层的，所以需要自己加逻辑
          from = from.parentId === 'root' ? store.root : from.parent;
        }

        if (closestScope) {
          manager.dataSchema.switchTo(closestScope.id);
        } else {
          throw new Error('程序错误');
        }

        this.scopeId = `${info.id}-${info.type}`;
        manager.dataSchema.addScope([], this.scopeId);
        if (info.name) {
          const nodeSchema = manager.store.getNodeById(info.id)?.schema;
          const tag = nodeSchema?.title ?? nodeSchema?.name;
          manager.dataSchema.current.tag = `${info.name}${
            tag ? ` : ${tag}` : ''
          }`;
          manager.dataSchema.current.group = '组件上下文';
        }
      }
    }

    componentDidUpdate(prevProps: Props) {
      const props = this.props;

      if (
        this.editorNode &&
        props.$$commonSchema !== prevProps.$$commonSchema
      ) {
        this.editorNode.updateIsCommonConfig(!!this.props.$$commonSchema);
      }
    }

    componentWillUnmount() {
      if (this.editorNode && isAlive(this.editorNode)) {
        const parent: EditorNodeType = (this.context as any) || store.root;
        parent.removeChild(this.editorNode);
      }

      if (this.scopeId) {
        manager.dataSchema.removeScope(this.scopeId);
      }
    }

    @autobind
    wrapperRef(ref: any) {
      while (ref?.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }

      if (this.editorNode && isAlive(this.editorNode)) {
        this.editorNode.setComponent(ref);

        info.plugin?.componentRef?.(this.editorNode, ref);
      }
    }

    /**
     * 主要目的是渲染器下发的 $$editor 指向当前层，而不是 store 层。
     */
    @autobind
    renderChild(region: string, node: Schema, props: any) {
      const {render} = this.props; // render: amis渲染器

      // $$id 变化，渲染器最好也变化
      if (node?.$$id) {
        props = props || {}; // props 可能为 undefined
        props.key = node.$$id || props.key;
      }

      return render(region, node, {...props, $$editor: info});
    }

    render() {
      const {$$id, ...rest} = this.props;

      /*
       * 根据渲染器信息决定时 NodeWrapper 包裹还是 ContainerWrapper 包裹。
       * NodeWrapper 主要完成 dom 节点的标记（即：添加 data-editor-id 属性）。
       * 同时如果插件中设置了自定义渲染，则会调用自定义渲染相关逻辑。
       * ContainerWrapper 本身依然会包一层 NodeWrapper, 除此之外，主要完成对区域的包裹，和 dom 标记。
       * 会不会包裹区域跟编辑器信息中配置不配置 regions 有关，配置了才会包裹。
       * **并不是每个容器节点都是这样的。比如 amis 中的 Table 渲染器。**
       */
      const Wrapper = /*info.wrapper || (*/ this.props.$$commonSchema
        ? CommonConfigWrapper
        : info.regions
        ? ContainerWrapper
        : NodeWrapper; /*)*/
      return (
        <EditorNodeContext.Provider
          value={this.editorNode || (this.context as any)}
        >
          <ErrorBoundary
            customErrorMsg={`拦截到${info.type}渲染错误`}
            fallback={() => {
              return (
                <div className="renderer-error-boundary">
                  {info?.type}
                  渲染发生错误，详细错误信息请查看控制台输出。
                </div>
              );
            }}
          >
            <Wrapper
              {...rest}
              render={this.renderChild}
              $$editor={info}
              $$node={this.editorNode}
              ref={this.wrapperRef}
            />
          </ErrorBoundary>
        </EditorNodeContext.Provider>
      );
    }
  }

  return Wrapper as any;
}

/**
 * 将之前选择的弹窗和本次现有弹窗schema替换为$ref引用
 * @param schema
 * @param dialogId 选择弹窗的id
 * @param dialogRefsName
 */
function replaceDialogtoRef(
  schema: Schema,
  dialogId: string,
  dialogRefsName: string
) {
  let replacedSchema = schema;
  const dialog = JSONGetById(schema, dialogId);
  if (dialog) {
    replacedSchema = JSONUpdate(schema, dialogId, {$ref: dialogRefsName}, true);
  }
  return replacedSchema;
}

// 添加definitions
function addDefinitions(
  schema: Schema,
  definitions: Schema,
  dialogMaxIndex: number,
  selectDialog: any
) {
  let newSchema;
  let dialogRefsName = '';
  if (dialogMaxIndex) {
    Object.keys(definitions).forEach(ref => {
      const dialog = definitions[ref];
      if (dialog.$$id === selectDialog) {
        dialogRefsName = ref;
      }
    });
  }
  let dialogType = getFixDialogType(schema, selectDialog);
  let newDefinitions = {...definitions};
  if (!dialogRefsName) {
    dialogRefsName = dialogMaxIndex
      ? `${dialogType}-ref-${dialogMaxIndex + 1}`
      : `${dialogType}-ref-1`;
  }
  let dialogBody = JSONGetById(schema, selectDialog);
  // 防止definition被查找到替换为$ref重新生成一下
  newDefinitions[dialogRefsName] = JSONPipeIn(
    JSONPipeOut({
      ...dialogBody,
      type: dialogType
    })
  );
  newSchema = {
    ...schema,
    definitions: newDefinitions
  };
  return {
    dialogRefsName,
    newSchema
  };
}

// 选择现有弹窗后definitions设置和弹窗schema的同步
function currentDialogOnchagne(
  manager: EditorManager,
  diffs: any,
  newValue?: any
) {
  const {store} = manager;
  let schema = store.schema;
  let definitions = schema.definitions || {};
  let dialogMaxIndex: number = 0;
  Object.keys(definitions).forEach(k => {
    if (k.includes('ref-')) {
      let index = Number(k.split('-')[2]);
      dialogMaxIndex = Math.max(dialogMaxIndex, index);
    }
  });
  if (diffs?.length) {
    let replacedSchema = null;
    let editRefsName = '';
    for (const diff of diffs) {
      const {path, kind, item, rhs} = diff;
      // 添加选择现有弹窗事件
      if (
        kind === 'A' &&
        path.length > 1 &&
        path?.[path.length - 1] === 'actions' &&
        item.kind === 'N' &&
        item.rhs?.__selectDialog
      ) {
        const {newSchema, dialogRefsName} = addDefinitions(
          schema,
          definitions,
          dialogMaxIndex,
          item.rhs?.__selectDialog
        );
        replacedSchema = replaceDialogtoRef(
          newSchema,
          item.rhs?.__selectDialog,
          dialogRefsName
        );
        if (item.rhs?.__relatedDialogId) {
          replacedSchema = replaceDialogtoRef(
            replacedSchema,
            item.rhs?.__relatedDialogId,
            dialogRefsName
          );
        }
        return replacedSchema;
      }
      // 编辑弹窗,从新建弹窗切换到现有弹窗,原始弹窗id
      else if (
        kind === 'N' &&
        path?.length > 1 &&
        path?.[path.length - 1] === '__selectDialog'
      ) {
        const {newSchema, dialogRefsName} = addDefinitions(
          schema,
          definitions,
          dialogMaxIndex,
          rhs
        );
        editRefsName = dialogRefsName;
        replacedSchema = replaceDialogtoRef(newSchema, rhs, dialogRefsName);
      }
      // 编辑弹窗,从新建弹窗切换到现有弹窗,新生成弹窗id
      else if (
        kind === 'N' &&
        path?.length > 1 &&
        path?.[path.length - 1] === '__relatedDialogId'
      ) {
        replacedSchema = replaceDialogtoRef(
          replacedSchema!,
          rhs,
          editRefsName!
        );
        return replacedSchema;
      }
      // 编辑弹窗,选择了其他现有弹窗，原始弹窗id
      else if (
        kind === 'E' &&
        path?.length > 1 &&
        path?.[path.length - 1] === '__selectDialog'
      ) {
        const {newSchema, dialogRefsName} = addDefinitions(
          schema,
          definitions,
          dialogMaxIndex,
          rhs
        );
        editRefsName = dialogRefsName;
        replacedSchema = replaceDialogtoRef(newSchema, rhs, dialogRefsName);
      }
      // 编辑弹窗,选择了其他现有弹窗，新生成弹窗id
      else if (
        kind === 'E' &&
        path?.length > 1 &&
        path?.[path.length - 1] === '__relatedDialogId'
      ) {
        replacedSchema = replaceDialogtoRef(
          replacedSchema!,
          rhs,
          editRefsName!
        );
        return replacedSchema;
      }
    }
    return replacedSchema;
  }
  return null;
}

function SchemaFrom({
  propKey,
  body,
  definitions,
  controls,
  onChange,
  value,
  env,
  api,
  popOverContainer,
  submitOnChange,
  node,
  manager,
  justify,
  ctx,
  pipeIn,
  pipeOut
}: {
  propKey: string;
  env: any;
  body?: Array<any>;
  /**
   * @deprecated 用 body 代替
   */
  controls?: Array<any>;
  definitions?: any;
  value: any;
  api?: any;
  onChange: (value: any, diff: any) => void;
  popOverContainer?: () => HTMLElement | void;
  submitOnChange?: boolean;
  node?: EditorNodeType;
  manager: EditorManager;
  panelById?: string;
  justify?: boolean;
  ctx?: any;
  pipeIn?: (value: any) => any;
  pipeOut?: (value: any) => any;
}) {
  let containerKey = 'body';

  if (Array.isArray(controls)) {
    body = controls;
    containerKey = 'controls';
  }

  body = Array.isArray(body) ? body.concat() : [];

  if (submitOnChange === false) {
    body.push({
      type: 'submit',
      label: '保存',
      level: 'primary',
      block: true,
      className: 'ae-Settings-actions'
    });
  }
  const schema = {
    key: propKey,
    definitions,
    [containerKey]: body,
    className: cx(
      'config-form-content',
      'ae-Settings-content',
      'hoverShowScrollBar',
      submitOnChange === false ? 'with-actions' : ''
    ),
    wrapperComponent: 'div',
    type: 'form',
    title: '',
    mode: 'normal',
    api,
    wrapWithPanel: false,
    submitOnChange: submitOnChange !== false,
    messages: {
      validateFailed: ''
    }
  };

  if (justify) {
    schema.mode = 'horizontal';
    schema.horizontal = {
      left: 4,
      right: 8,
      justify: true
    };
  }

  value = value || {};
  const finalValue = pipeIn ? pipeIn(value) : value;
  const themeConfig = getThemeConfig();

  return render(
    schema,
    {
      onFinished: async (newValue: any) => {
        newValue = pipeOut ? await pipeOut(newValue) : newValue;
        const diffValue = diff(value, newValue);
        onChange(newValue, diffValue);

        // 如果是选择现有弹窗，需要提取Definitions，在这里一起做变更
        const store = manager.store;
        const schema = store.schema;
        let newSchema = currentDialogOnchagne(manager, diffValue, newValue);
        if (newSchema) {
          const schemaDiff = diff(schema, newSchema);
          store.definitionOnchangeValue(newSchema, schemaDiff);
        }
        // 添加弹窗事件后自动选中弹窗
        if (store.activeDialogPath) {
          let activeId = store.getSchemaByPath(
            store.activeDialogPath.split('/').filter(item => item !== '')
          )?.$$id;
          activeId && store.setPreviewDialogId(activeId);
          store.setActiveDialogPath('');
        }
      },
      data: createObjectFromChain([ctx, themeConfig, finalValue]),
      node: node,
      manager: manager,
      popOverContainer
    },
    {
      ...omit(env, 'replaceText')
      // theme: 'cxd' // 右侧属性配置面板固定使用cxd主题展示
    }
  );
}

export function makeSchemaFormRender(
  manager: EditorManager,
  schema: {
    body?: SchemaCollection;
    controls?: Array<any>;
    definitions?: any;
    api?: any;
    submitOnChange?: boolean;
    justify?: boolean;
    panelById?: string;
    formKey?: string;
    pipeIn?: (value: any) => any;
    pipeOut?: (value: any) => any;
  }
) {
  const env = {...manager.env, session: 'schema-form'};

  return ({value, onChange, popOverContainer, id, store, node}: PanelProps) => {
    const ctx = {...manager.store.ctx};

    if (schema?.panelById && schema?.panelById !== node?.id) {
      // 用于过滤掉异常的渲染
      return <></>;
    }

    if (id) {
      Object.defineProperty(ctx, '__props__', {
        get: () => {
          const node = store.getNodeById(id);
          return node?.getComponent()?.props || {};
        }
      });
    }

    // 每一层的面板数据不要共用
    const curFormKey = `${id}-${node?.type}${schema.formKey ? '-' : ''}${
      schema.formKey ? schema.formKey : ''
    }`;

    return (
      <SchemaFrom
        key={curFormKey}
        propKey={curFormKey}
        api={schema.api}
        definitions={schema.definitions}
        body={
          schema.body
            ? flatten(Array.isArray(schema.body) ? schema.body : [schema.body])
            : undefined
        }
        controls={
          schema.controls
            ? flatten(
                Array.isArray(schema.controls)
                  ? schema.controls
                  : [schema.controls]
              )
            : undefined
        }
        value={value}
        ctx={ctx}
        pipeIn={schema.pipeIn}
        pipeOut={schema.pipeOut}
        submitOnChange={schema.submitOnChange}
        onChange={onChange}
        env={env}
        popOverContainer={popOverContainer}
        node={node}
        manager={manager}
        justify={schema.justify}
      />
    );
  };
}

export function hackIn(
  renderer: RendererConfig,
  regions?: Array<RegionConfig>,
  overrides?: any
) {
  let rawComponent: any = renderer.Renderer;
  while (rawComponent.ComposedComponent) {
    rawComponent = rawComponent.ComposedComponent;
  }

  const prototype: any = rawComponent.prototype;

  if (Array.isArray(regions)) {
    const grouped = groupBy(regions, item => item.renderMethod);

    // 主要是 render 方法没办法覆盖，只能指定其他 render 方法。
    // 所以才需要配置 renderMethod 指定覆盖其他方法。
    Object.keys(grouped).forEach(key => {
      // 不要重复 hack, 或者目标方法不存在。
      if (prototype[`__${key}`] || !prototype[key]) {
        return;
      }

      const regions = grouped[key];
      const customRenderCreator = regions[0]?.renderMethodOverride;

      prototype[`__${key}`] = prototype[key];
      prototype[key] = (function (origin, fn) {
        if (typeof origin !== 'function') {
          return origin;
        }

        return function (this: any) {
          const prev = this.super;
          this.super = origin.bind(this);
          const result = fn.apply(this, arguments);
          this.super = prev;
          return result;
        };
      })(
        prototype[`__${key}`],
        customRenderCreator?.(regions.concat(), insertRegion) ||
          function (this: any, ...args: any[]) {
            const info: RendererInfo = this.props.$$editor;
            const dom = this.super.apply(this, args);

            if (
              info &&
              !this.props.$$commonSchema &&
              Array.isArray(info.regions) &&
              regions.every(region =>
                find(info.regions!, c => c.key === region.key)
              )
            ) {
              const regionsCopy = regions.map(r => {
                const i = find(
                  info.regions,
                  c =>
                    c.key === r.key &&
                    (!r.rendererName || r.rendererName === c.rendererName)
                );

                if (i) {
                  return {
                    ...r,
                    label: i.label,
                    preferTag: i.preferTag
                  };
                }

                return r;
              });

              return insertRegion(
                this,
                dom,
                regionsCopy,
                info,
                info.plugin.manager
              );
            }

            return dom;
          }
      );
    });
  } else if (overrides) {
    Object.keys(overrides).forEach(key => {
      // 不要重复 hack
      if (prototype[`__${key}`] || typeof prototype[key] !== 'function') {
        return;
      }

      prototype[`__${key}`] = prototype[key];
      prototype[key] = (function (origin, fn) {
        if (typeof origin !== 'function') {
          return origin;
        }

        return function (this: any) {
          const prev = this.super;
          this.super = origin.bind(this);
          const result = fn.apply(this, arguments);
          this.super = prev;
          return result;
        };
      })(prototype[`__${key}`], overrides[key]);
    });
  }
}

function getMatchedRegion(
  component: JSX.Element,
  dom: JSX.Element,
  regions: Array<RegionConfig>
): [RegionConfig | undefined, number] {
  let index = -1;
  let resolved: RegionConfig | undefined = undefined;

  regions.some((item, i) => {
    /*
     正常直接在覆盖的方法外面包裹一次 Region 即可，但是有时候其实并不是正则的容器，
     有时候可能时返回的 JSX.Element 里面的 Element。
     所以有时候还得配置 matchRegion 这样的属性，来告诉 hack 逻辑应该包裹到哪块。
     还有个 insertPosition 也是相关的配置。
     */
    if (item.matchRegion!(dom, component)) {
      index = i;
      resolved = item;
      return true;
    }
    return false;
  });

  return [resolved, index];
}

function insertRegion(
  component: JSX.Element,
  dom: JSX.Element,
  regions: Array<RegionConfig>,
  info: RendererInfo,
  manager: EditorManager
): JSX.Element {
  // 如果没有开启这些区域的内容修改功能，则跳过插入逻辑
  if (info.memberImmutable === true) {
    return dom;
  } else if (
    Array.isArray(info.memberImmutable) &&
    regions.every(reg =>
      (info.memberImmutable as Array<string>).includes(reg.key)
    )
  ) {
    return dom;
  }

  const rootRegion = find(regions, r => !r.matchRegion);

  if (rootRegion) {
    const Region = rootRegion.wrapper || RegionWrapper;

    if (rootRegion.insertPosition === 'inner' && React.isValidElement(dom)) {
      return React.cloneElement(dom as any, {
        children: (
          <Region
            key={rootRegion.key}
            preferTag={rootRegion.preferTag}
            name={rootRegion.key}
            label={rootRegion.label}
            placeholder={rootRegion.placeholder}
            regionConfig={rootRegion}
            editorStore={manager.store}
            manager={manager}
            children={(dom as any).props.children}
            wrapperResolve={rootRegion.wrapperResolve}
            rendererName={info.renderer.name}
          />
        )
      });
    } else {
      return (
        <Region
          key={rootRegion.key}
          preferTag={rootRegion.preferTag}
          name={rootRegion.key}
          label={rootRegion.label}
          placeholder={rootRegion.placeholder}
          regionConfig={rootRegion}
          editorStore={manager.store}
          manager={manager}
          children={dom}
          wrapperResolve={rootRegion.wrapperResolve}
          rendererName={info.renderer.name}
        />
      );
    }
  } else if (regions.length) {
    const [resolved, index] = getMatchedRegion(component, dom, regions);

    if (resolved) {
      const Region = resolved.wrapper || RegionWrapper;
      regions.splice(index, 1);

      if (resolved.insertPosition === 'outter') {
        return (
          <Region
            key={resolved.key}
            preferTag={resolved.preferTag}
            name={resolved.key}
            label={resolved.label}
            placeholder={resolved.placeholder}
            regionConfig={resolved}
            editorStore={manager.store}
            manager={manager}
            children={dom}
            wrapperResolve={resolved.wrapperResolve}
          />
        );
      } else if (React.isValidElement(dom)) {
        const children = (dom.props as any).children;

        return React.cloneElement(dom, {
          children: (
            <Region
              key={resolved.key}
              preferTag={resolved.preferTag}
              name={resolved.key}
              label={resolved.label}
              placeholder={resolved.placeholder}
              regionConfig={resolved}
              editorStore={manager.store}
              manager={manager}
              children={children}
              wrapperResolve={resolved.wrapperResolve}
            />
          )
        } as any);
      }
    } else if (React.isValidElement(dom) && (dom.props as any).children) {
      let children: any = (dom.props as any).children;

      if (Array.isArray(children)) {
        children = children.map(child =>
          insertRegion(component, child, regions, info, manager)
        );
      } else {
        children = insertRegion(
          component,
          children,
          regions,
          info,
          manager
        ) as any;
      }

      return React.cloneElement(dom, {
        children
      } as any);
    }
  }

  return dom;
}

export function mapReactElement(
  dom: JSX.Element,
  iterator: (dom: JSX.Element, index?: number) => JSX.Element,
  index?: number
) {
  if (!React.isValidElement(dom)) {
    return dom;
  }

  let mapped = iterator(dom, index);

  // 如果完全一样，说明没找到要替换的。
  if (mapped === dom && (dom.props as any).children) {
    const children = (dom.props as any).children;
    if (Array.isArray(children)) {
      const childMapped: Array<any> = [];
      let modified = false;
      children.forEach((child: any, index: number) => {
        let mapped = mapReactElement(child, iterator, index);

        if (mapped !== child) {
          modified = true;
          if (React.isValidElement(mapped) && !mapped.key) {
            mapped = React.cloneElement(mapped, {key: index});
          }
        }

        childMapped.push(mapped);
      });

      if (modified) {
        mapped = React.cloneElement(mapped, {
          children: childMapped
        });
      }
    } else {
      const childMapped = mapReactElement(children, iterator, index);
      if (childMapped !== children) {
        mapped = React.cloneElement(mapped, {
          children: childMapped
        });
      }
    }
  }

  return mapped;
}

const thumbHost = document.createElement('div');
export function renderThumbToGhost(
  ghost: HTMLElement,
  region: EditorNodeType,
  schema: any,
  manager: EditorManager
) {
  // bca-disable-next-line
  ghost.innerHTML = '';
  let path = '';
  const host = region.host!;
  const component = host.getComponent()!;
  const isForm = component?.renderControl && region.region === 'body';

  try {
    reactRender(
      render(
        {
          children: ({render}: any) => {
            return isForm
              ? render('', {
                  type: 'form',
                  wrapWithPanel: false,
                  mode: component.props.mode,
                  body: [schema]
                })
              : render(region.region, schema);
          }
        } as any,
        {},
        {
          ...manager.env,
          theme: component?.props.theme || manager.env.theme,
          session: 'ghost-thumb'
        },
        path
      ),
      thumbHost
    );
  } catch (e) {}

  /* bca-disable */
  const html =
    thumbHost.innerHTML ||
    '<div class="wrapper-sm b-a b-light m-b-sm">拖入占位</div>';
  // bca-disable-line
  ghost.innerHTML = html;
  /* bca-enable */

  unmountComponentAtNode(thumbHost);
  // bca-disable-next-line
  thumbHost.innerHTML = '';
}
