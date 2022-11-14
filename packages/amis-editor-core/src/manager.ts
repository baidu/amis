/**
 * @file 把一些功能性的东西放在了这个里面，辅助 compoennt/Editor.tsx 组件的。
 * 编辑器非 UI 相关的东西应该放在这。
 */
import {getRenderers, RenderOptions} from 'amis-core';
import {
  PluginInterface,
  BasicPanelItem,
  RendererInfo,
  SubRendererInfo,
  BaseEventContext,
  createEvent,
  InsertEventContext,
  PluginEvent,
  BasicToolbarItem,
  RegionConfig,
  ContextMenuItem,
  ContextMenuEventContext,
  ChangeEventContext,
  ReplaceEventContext,
  RendererInfoResolveEventContext,
  EventContext,
  PluginEventFn,
  MoveEventContext,
  RendererJSONSchemaResolveEventContext,
  ScaffoldForm,
  SelectionEventContext,
  BuildPanelEventContext,
  DeleteEventContext,
  RendererPluginEvent,
  PluginEvents,
  PluginActions
} from './plugin';
import {
  EditorStoreType,
  PopOverFormContext,
  SubEditorContext
} from './store/editor';

import {
  autobind,
  camelize,
  guid,
  reactionWithOldValue,
  reGenerateID,
  isString,
  isObject,
  isLayoutPlugin,
  JSONPipeOut,
  generateNodeId,
  JSONTraverse
} from './util';
import {reaction} from 'mobx';
import {hackIn, makeSchemaFormRender, makeWrapper} from './component/factory';
import {env} from './env';
import debounce from 'lodash/debounce';
import {openContextMenus, toast, alert, DataScope, DataSchema} from 'amis';
import {parse, stringify} from 'json-ast-comments';
import {EditorNodeType} from './store/node';
import {EditorProps} from './component/Editor';
import findIndex from 'lodash/findIndex';
import {EditorDNDManager} from './dnd';
import {IScopedContext} from 'amis';
import {SchemaObject, SchemaCollection} from 'amis/lib/Schema';
import type {RendererConfig} from 'amis-core/lib/factory';
import {isPlainObject} from 'lodash';

export interface EditorManagerConfig
  extends Omit<EditorProps, 'value' | 'onChange'> {}

export interface PluginClass {
  new (manager: EditorManager): PluginInterface;
  id?: string;
}

const builtInPlugins: Array<PluginClass> = [];

/**
 * 注册默认的插件。
 * @param editor
 */
export function registerEditorPlugin(klass: PluginClass) {
  let isExitPlugin: any = null;
  if (klass.prototype && klass.prototype.isNpmCustomWidget) {
    isExitPlugin = builtInPlugins.find(
      item => item.prototype.name === klass.prototype.name
    );
  } else {
    // 待进一步优化
    isExitPlugin = builtInPlugins.find(item => item === klass);
  }
  if (!isExitPlugin) {
    builtInPlugins.push(klass);
  } else {
    console.warn(`注册插件异常，已存在同名插件：`, klass);
  }
}

/**
 * 获取当前已经注册的插件。
 */
export function getEditorPlugins() {
  return builtInPlugins.concat();
}

/**
 * 注销插件
 */
export function unRegisterEditorPlugin(id: string) {
  const idx = findIndex(builtInPlugins, item => item.id === id);
  ~idx && builtInPlugins.splice(idx, 1);
}

/**
 * 在 component/Editor.tsx 里面实例化的。
 * 辅助 component/Editor.tsx 实现一些非 UI 相关的功能。
 */
export class EditorManager {
  readonly plugins: Array<PluginInterface>;
  readonly env: RenderOptions;
  toDispose: Array<() => void> = [];
  readonly dnd: EditorDNDManager;
  readonly id = guid();
  disableHover = false;

  // Chrome 要求必须 https 才能支持读剪贴板，所以基于内存实现
  private clipboardData: string;
  readonly hackIn: any;

  // 用于记录amis渲染器的上下文数据
  amisStore: Object = {};

  // 广播事件集
  readonly broadcasts: RendererPluginEvent[] = [];
  // 插件事件集
  readonly pluginEvents: PluginEvents = {};
  // 插件动作集
  readonly pluginActions: PluginActions = {};

  dataSchema: DataSchema;
  readonly isInFrame: boolean = false;

  constructor(
    readonly config: EditorManagerConfig,
    readonly store: EditorStoreType,
    readonly parent?: EditorManager
  ) {
    const isInFrame = !!parent;
    this.isInFrame = isInFrame;
    // 传给 amis 渲染器的默认 env
    this.env = {
      ...env, // 默认的 env 中带 jumpTo
      ...config.amisEnv, // 用户也可以设置自定义环境配置，用于覆盖默认的 env
      theme: config.theme
    };
    this.env.beforeDispatchEvent = this.beforeDispatchEvent.bind(
      this,
      this.env.beforeDispatchEvent
    );
    this.hackIn = parent?.hackIn || hackIn;

    this.plugins =
      parent?.plugins ||
      (config.disableBultinPlugin ? [] : builtInPlugins) // 页面设计器注册的插件列表
        .concat(config.plugins || [])
        .map(Editor => {
          const plugin = new Editor(this); // 进行一次实例化
          plugin.order = plugin.order ?? 0;

          // 记录动作定义
          if (plugin.rendererName) {
            this.pluginEvents[plugin.rendererName] = plugin.events || [];
            this.pluginActions[plugin.rendererName] = plugin.actions || [];
          }

          return plugin;
        })
        .sort((a, b) => a.order! - b.order!); // 按order排序【升序】
    this.hackRenderers();
    this.dnd = parent?.dnd || new EditorDNDManager(this, store);
    this.dataSchema =
      parent?.dataSchema || new DataSchema(config.schemas || []);

    this.dataSchema.current.tag = '系统变量';
    if (isInFrame) {
      return;
    }

    this.toDispose.push(
      // 当前节点区域数量发生变化，重新构建孩子渲染器列表。
      /*reaction(
        () => [
          store.activeContainerId,
          store.activeContainerId
            ? store
                .getNodeById(store.activeContainerId)
                ?.childRegions.map(region => region.key)
            : []
        ],
        ([id, regions]) => {
          if (id && regions?.length) {
            this.buildRenderers();
          }
        }
      ),*/

      // 选中的节点变化了，重新构建工具栏和面板。
      reactionWithOldValue(
        () => store.activeId,
        async (id, oldValue) => {
          // 如果当前正在插入，则先关闭。
          this.store.insertId && this.store.closeInsertPanel();
          this.buildJSONSchemaUri();
          this.buildToolbars();
          await this.buildRenderers();
          this.buildPanels();

          this.trigger(
            'active',
            id
              ? ({
                  ...this.buildEventContext(id),
                  active: true
                } as any)
              : {
                  id: oldValue,
                  active: false
                }
          );
        }
      ),

      // 选取变化，重新构建面板
      reaction(
        () => store.selections.join(','),
        () => {
          this.buildPanels();
        }
      ),

      // 自动修复配置错误
      reaction(
        () => store.needPatch,
        result => {
          result && this.lazyPatchSchema();
        }
      ),

      // 给当前高亮region添加 is-active 类名。
      reactionWithOldValue(
        () => ({id: store.hoverId, region: store.hoverRegion}),
        (value, oldValue) => {
          const doc = store.getDoc();
          if (value.id && value.region) {
            doc
              .querySelector(
                `[data-region="${value.region}"][data-region-host="${value.id}"]`
              )
              ?.classList.add('is-region-active');
          } else if (oldValue?.id && oldValue?.region) {
            doc
              .querySelector(
                `[data-region="${oldValue.region}"][data-region-host="${oldValue.id}"]`
              )
              ?.classList.remove('is-region-active');
          }
        }
      )
    );
  }

  // 初始化plugins
  dynamicAddPlugin(pluginName: string) {
    if (!pluginName) {
      return;
    }
    // 重名插件检测（避免重复注册）
    if (
      this.plugins.some((plugin: any) => plugin && plugin.name === pluginName)
    ) {
      console.warn(`[amis-editor]当前已有${pluginName}插件`);
      return;
    }
    const newPluginClass: any = builtInPlugins.find(
      (Plugin: any) => Plugin.prototype && Plugin.prototype.name === pluginName
    );
    if (newPluginClass) {
      const newPlugin = new newPluginClass(this); // 进行一次实例化
      newPlugin.order = newPlugin.order ?? 0;
      this.plugins.push(newPlugin);
      // 重新排序
      this.plugins.sort((a, b) => a.order! - b.order!); // 按order排序【升序】

      // 记录动作定义
      if (newPlugin.rendererName) {
        this.pluginEvents[newPlugin.rendererName] = newPlugin.events || [];
        this.pluginActions[newPlugin.rendererName] = newPlugin.actions || [];
      }

      this.buildRenderers();
    }
  }

  // 更新amis渲染器上下文
  updateAMISContext(amisStore: Object) {
    if (amisStore) {
      this.amisStore = amisStore;
    }
  }

  // 首次初始化时，增加组件物料和面板加载逻辑，避免 autoFocus 为 false 时，左右面板为空
  buildRenderersAndPanels() {
    setTimeout(async () => {
      const {store} = this;
      if (!store.activeId && store?.schema?.$$id) {
        // 默认使用根节点id
        await this.buildRenderers();
        this.buildPanels(store.schema.$$id);
      }
    }, 200);
  }

  // 构建当前节点上下文
  buildEventContext(idOrNode: string | EditorNodeType) {
    const node =
      typeof idOrNode === 'string'
        ? this.store.getNodeById(idOrNode)!
        : idOrNode;
    const schema = this.store.getSchema(node.id);
    return {
      node,
      id: node.id,
      info: node.info!,
      path: node.path,
      schemaPath: node.schemaPath,
      schema,
      data: ''
    };
  }

  /**
   * 构建 JSONSchema Uri，这样可以用代码模式编辑了。
   */
  buildJSONSchemaUri() {
    const id = this.store.activeId;
    let jsonschemaUri = '';

    if (id) {
      const context: RendererJSONSchemaResolveEventContext =
        this.buildEventContext(id);

      const event = this.trigger('before-resolve-json-schema', context);
      jsonschemaUri = event.context.data;
      if (!event.prevented) {
        this.plugins.forEach(editor => {
          if (jsonschemaUri) {
            return;
          }

          const result = editor.buildJSONSchema?.(context);

          if (result) {
            jsonschemaUri = result;
          }
        });

        context.data = jsonschemaUri;
        const event = this.trigger('after-resolve-json-schema', context);
        jsonschemaUri = event.data;
      }
    }

    this.store.setJSONSchemaUri(jsonschemaUri);
  }

  buildToolbars() {
    const id = this.store.activeId;
    const toolbars: Array<BasicToolbarItem> = [];

    if (id) {
      const commonContext = this.buildEventContext(id);
      this.plugins.forEach(editor => {
        const context: BaseEventContext = {
          ...commonContext
        };
        editor.buildEditorToolbar?.(context, toolbars);
      });

      this.trigger('build-toolbars', {
        ...commonContext,
        data: toolbars
      });
    }

    this.store.setActiveToolbars(
      toolbars.map(item => ({
        ...item,
        order: item.order || 0,
        id: guid()
      }))
    );
  }

  collectPanels(
    node: EditorNodeType,
    triggerEvent = false,
    secondFactor = false
  ) {
    let panels: Array<BasicPanelItem> = [];

    if (node) {
      const context: BuildPanelEventContext = {
        ...this.buildEventContext(node),
        secondFactor,
        data: panels,
        selections: this.store.selections.map(item =>
          this.buildEventContext(item)
        )
      };

      // 生成属性配置面板
      this.plugins.forEach(editor => {
        editor.buildEditorPanel?.(context, panels);
      });

      triggerEvent && this.trigger('build-panels', context);
      panels = context.data || panels;
      if (context.changeLeftPanelKey) {
        // 改变左侧激活面板
        this.store.changeLeftPanelKey(context.changeLeftPanelKey);
      }
    }

    return panels;
  }

  buildPanels(curRendererId?: string) {
    let id = curRendererId || this.store.activeId;
    let panels: Array<BasicPanelItem> = [];

    if (id || this.store.selections.length) {
      id = id || this.store.selections[0];
      const node = this.store.getNodeById(id);
      panels = node ? this.collectPanels(node, true) : panels;
    }

    this.store.setPanels(
      panels.map(item => ({
        ...item,
        order: item.order || 0
      }))
    );
  }

  async collectRenderers(
    region?: string,
    activeContainerId: string = this.store.activeContainerId
  ) {
    const subRenderers: Array<SubRendererInfo> = [];

    let id = activeContainerId;

    if (!id && this.store?.schema) {
      id = this.store?.schema.$$id; // 默认使用根节点id
    }

    if (!id) {
      return subRenderers;
    }

    const node = this.store.getNodeById(id);

    if (!node) {
      return subRenderers;
    }

    const schema = this.store.getSchema(id);
    const contxt = {
      node,
      id: node.id,
      info: node.info!,
      path: node.path,
      schemaPath: node.schemaPath,
      schema,
      region
    };
    let asyncUpdateCompPlugins = [];
    // 此处换成for是为了解决异步问题
    for (let index = 0, size = this.plugins.length; index < size; index++) {
      const pluginItem = this.plugins[index];
      let subRenderer = pluginItem.buildSubRenderers?.(
        contxt,
        subRenderers,
        getRenderers()
      );
      if (subRenderer) {
        (Array.isArray(subRenderer) ? subRenderer : [subRenderer]).forEach(
          item =>
            subRenderers.push({
              ...item,
              id: guid(),
              plugin: pluginItem,
              parent: node.info!,
              order: item.order || 0
            })
        );
      }
      // 预置组件和NPM自定义组件更新分类和排序需要
      if (pluginItem.asyncUpdateCustomSubRenderersInfo) {
        asyncUpdateCompPlugins.push(pluginItem);
      }
    }

    if (asyncUpdateCompPlugins.length) {
      for (let i = 0, len = asyncUpdateCompPlugins.length; i < len; i++) {
        const asyncUpdateCompPlugin = asyncUpdateCompPlugins[i];

        await asyncUpdateCompPlugin.asyncUpdateCustomSubRenderersInfo?.(
          contxt,
          subRenderers,
          getRenderers()
        );
      }
    }

    // 过滤掉被隐藏的组件
    return subRenderers.filter(renderer => !renderer.disabledRendererPlugin);
  }

  async buildRenderers(region?: string) {
    const curRenderers = await this.collectRenderers(region);
    this.store.setSubRenderers(curRenderers);
    this.store.changeSubRendererRegion(region || '');
  }

  async rebuild() {
    await this.buildRenderers();
    this.buildToolbars();
    this.buildPanels();
  }

  /**
   * 刷新属性配置面板
   * 备注1: 组件类型更换时需要，以及表单编辑器实体绑定需要;
   * 备注2: 仅适用于新版属性配置面板（仅有一个一级属性配置面板）;
   * 备注3: 建议优先使用当前选中组件ID（this.store.activeId）来更新属性配置面板;
   * @param pluginType 组件类型
   */
  updateConfigPanel(pluginType: string) {
    const {activeId, getSchema, getNodeById} = this.store;
    let curPluginType = pluginType;

    if (!curPluginType && this.store.activeId) {
      // 当 pluginType 为空时，则获取当前选中组件type字段
      const curSchema = getSchema(activeId);
      curPluginType = curSchema.type;
    }

    if (curPluginType && this.store.activeId) {
      const panels = this.store.panels.concat();
      const curNode = getNodeById(activeId);
      if (curPluginType && curNode) {
        // 获取当前plugin
        const curPlugin = this.plugins.find(
          item => item.rendererName === curPluginType
        );
        // 删除当前属性配置面板
        panels.splice(
          panels.findIndex(item => item.key === 'config'),
          1
        );

        const context: BuildPanelEventContext = {
          ...this.buildEventContext(curNode),
          data: panels,
          selections: this.store.selections.map(item =>
            this.buildEventContext(item)
          )
        };
        if (curPlugin) {
          // 重新生成当前组件的属性配置面板
          curPlugin.buildEditorPanel?.(context, panels);
          this.store.setPanels(
            panels.map(item => ({
              ...item,
              order: item.order || 0
            }))
          );
        }
      }
    }
  }

  /**
   * 可用组件面板里面会点进来，不同的区域可能可插入的组件不一样。
   * @param region 区域的 key
   */
  switchToRegion(region: string) {
    if (!this.store.activeId) {
      return;
    }
    this.buildRenderers(region);
  }

  /**
   * 显示插入面板
   * @param region
   * @param preferTag
   */
  async showInsertPanel(
    region: string,
    id: string = this.store.activeId,
    preferTag?: string,
    mode: 'insert' | 'replace' = 'insert',
    originId: string = '',
    beforeId?: string
  ) {
    if (typeof preferTag === 'undefined' && id) {
      const node = this.store.getNodeById(id);
      preferTag = node?.info?.regions?.find(
        child => child.key === region
      )?.preferTag;
    }
    const curRenderers = await this.collectRenderers(region, id);
    this.store.setInsertRenderers(curRenderers);
    this.store.setInsertRegion(region, id, preferTag, mode, originId, beforeId);
  }

  /**
   * 显示组件更换面板
   * @param region
   * @param preferTag
   */
  showReplacePanel(id: string, preferTag?: string) {
    const node = this.store.getNodeById(id);
    const region: EditorNodeType = node?.parent;

    if (!node || !region || !region.isRegion || !region.parent) {
      return;
    }

    const host: EditorNodeType = region.parent!;
    this.showInsertPanel(region.region, host.id, preferTag, 'replace', node.id);
  }

  /** 显示左侧组件面板（主要在属性面板中使用）*/
  showRendererPanel(tag?: string, msg?: string) {
    this.store.showRendererPanel(tag, msg);
  }

  readonly listeners: Array<{
    type: string;
    fn: PluginEventFn;
  }> = [];

  on(event: string, fn: PluginEventFn) {
    this.listeners.push({
      type: event,
      fn
    });
  }

  off(event: string, fn: PluginEventFn) {
    const idx = findIndex(this.listeners, item => {
      return item.type === event && item.fn === fn;
    });

    if (~idx) {
      this.listeners.splice(idx, 1);
    }
  }

  /**
   * 派发事件。
   * @param type
   * @param context
   */
  trigger<T extends EventContext>(type: string, context: T): PluginEvent<T> {
    const event = createEvent(type, context);
    const method = camelize(
      /^(?:before|after)/.test(type) ? type : `on-${type}`
    );
    const listeners = this.listeners.filter(item => item.type === type);

    this.plugins.forEach(
      plugin =>
        (plugin as any)[method] &&
        listeners.push({
          type,
          fn: (plugin as any)[method].bind(plugin)
        })
    );

    if ((this.config as any)[method]) {
      listeners.push({
        fn: (this.config as any)[method],
        type
      });
    }

    let promises: Array<Promise<any>> = [];
    listeners.some(listener => {
      const ret = listener.fn.call(null, event);

      if (ret === false) {
        event.preventDefault();
        event.stopPropagation();
      } else if (ret?.then) {
        promises.push(ret);
      } else if (ret !== void 0) {
        event.setData(ret);
      }

      return event.stoped;
    });

    if (promises.length) {
      event.pending = Promise.all(promises);
    }

    return event;
  }

  /**
   * 在当前选中元素插入或追加新的元素
   * @param rendererIdOrSchema
   * 备注：可以根据渲染器ID添加新元素，也可以根据现有schema片段添加新元素
   */
  async addElem(rendererIdOrSchema: string | any) {
    if (!rendererIdOrSchema) {
      return;
    }
    let rendererId: string = ''; // 用于记录渲染器ID
    let schemaData; // 用于记录现有的schema数据

    if (isString(rendererIdOrSchema)) {
      rendererId = rendererIdOrSchema.toString();
    } else if (isObject(rendererIdOrSchema)) {
      schemaData = rendererIdOrSchema;
    }

    const store = this.store;
    let subRenderer;

    if (rendererId) {
      // 当有 rendererId 时，获取渲染器信息
      subRenderer = store.getSubRendererById(rendererId);
    }

    if (!subRenderer && !schemaData) {
      // 当渲染器信息和 schemaData 都为空时，则不作任何处理
      return;
    }

    const id = store.activeId;
    const node = store.getNodeById(id)!; // 当前选中节点
    if (!node) {
      toast.warning('请先选择一个元素作为插入的位置。');
      return;
    }

    if (node.type === 'wrapper'
     && node.schema?.body?.length === 0
     && (schemaData?.type === 'flex' || subRenderer?.rendererName === 'flex')) {
      const newSchemaData = schemaData || subRenderer?.scaffold;
      // 布局能力提升: 点击插入新元素，当wrapper为空插入布局容器时，自动改为置换，避免过多层级
      this.replaceChild(id, newSchemaData);
    }

    const parentNode = node.parent as EditorNodeType; // 父级节点

    // 插入新元素需要的字段
    let nextId = null;
    let regionNodeId = null;
    let regionNodeRegion = null;

    if (store.activeRegion) {
      regionNodeId = id;
      regionNodeRegion = store.activeRegion;
    } else if (node.schema.columns) {
      // crud 和 table 等表格类容器
      regionNodeId = id;
      regionNodeRegion = 'columns';
    } else if (node.schema.items && isLayoutPlugin(node.schema)) {
      // 当前节点是布局类容器节点
      regionNodeId = id;
      regionNodeRegion = 'items';
    } else if (node.schema.body) {
      // 当前节点是容器节点
      regionNodeId = id;
      regionNodeRegion = 'body';
    } else if (parentNode) {
      // 存在父节点
      regionNodeId = parentNode.id;
      regionNodeRegion = parentNode.region;

      // 考虑特殊情况，比如「表单项容器」
      if (!parentNode.region && parentNode.schema.body) {
        // 默认插入到父节点的body中
        regionNodeRegion = 'body';
      } else if (!parentNode.region && parentNode.schema.items) {
        regionNodeRegion = 'items';
      } else if (!parentNode.region && !parentNode.schema.body && !parentNode.schema.items) {
        // 其他特殊情况暂时不考虑，给予提示
        toast.warning('当前节点不允许追加新组件。');
        return;
      }

      const parent = store.getSchemaParentById(id); // 获取父节点
      let beforeId = -1;
      parent.some((item: any, index: number) => {
        let result = false;
        if (item.$$id === id) {
          beforeId = index;
          result = true;
        }
        return result;
      });
      nextId = parent[beforeId + 1]?.$$id; // 下一个节点的ID（追加时需要）
    } else {
      // 当前选中的是根节点，默认插入到body中
      regionNodeId = id;
      regionNodeRegion = 'body';
    }

    let value = schemaData;

    if (subRenderer && !schemaData) {
      value =
        subRenderer.scaffold ||
        ({
          type: subRenderer.type
        } as SchemaObject);

      if (subRenderer.scaffoldForm) {
        value = await this.scaffold(subRenderer.scaffoldForm, value);
      }
    }

    const child = this.addChild(
      regionNodeId,
      regionNodeRegion,
      value,
      nextId,
      subRenderer
    );
    if (child) {
      // mobx 修改数据是异步的
      setTimeout(() => {
        store.setActiveId(child.$$id);
      }, 100);
    }
  }

  /**
   * 在当前选中元素追加新的schema
   * 备注：目前主要用在复制&粘贴快捷功能键中
   * @param rendererSchema
   */
  async appendSiblingSchema(
    rendererSchema: Object,
    beforeInsert?: boolean,
    disabledAutoSelectInsertElem?: boolean
  ) {
    if (!rendererSchema) {
      return;
    }

    const store = this.store;
    const id = store.activeId;
    const node = store.getNodeById(id)!; // 当前选中节点
    if (!node) {
      toast.warning('请先选择一个元素作为插入的位置。');
      return;
    }
    const regionNode = node.parent as EditorNodeType; // 父级节点

    // 插入新元素需要的字段
    let nextId = null;
    let regionNodeId = null;
    let regionNodeRegion = null;

    if (regionNode) {
      // 存在父节点
      regionNodeId = regionNode.id;
      regionNodeRegion = regionNode.region;

      // 考虑特殊情况，比如「表单项容器」
      if (!regionNode.region && regionNode.schema.body) {
        // 默认插入到父节点的body中
        regionNodeRegion = 'body';
      } else if (!regionNode.region && regionNode.schema?.type === 'flex' && regionNode.schema.items) {
        // flex布局容器
        regionNodeRegion = 'items';
      } else if (!regionNode.region && !regionNode.schema.body) {
        // 其他特殊情况暂时不考虑，给予提示
        toast.warning('当前节点不允许追加新组件。');
        return;
      }

      const parent = store.getSchemaParentById(id); // 获取父节点
      let beforeId = -1;
      parent.some((item: any, index: number) => {
        let result = false;
        if (item.$$id === id) {
          beforeId = index;
          result = true;
        }
        return result;
      });
      nextId = parent[beforeInsert ? beforeId : beforeId + 1]?.$$id; // 下一个节点的ID（追加时需要）

      const child = this.addChild(
        regionNodeId,
        regionNodeRegion,
        rendererSchema,
        nextId
      );
      if (child && !disabledAutoSelectInsertElem) {
        // mobx 修改数据是异步的
        setTimeout(() => {
          store.setActiveId(child.$$id);
        }, 100);
      }
    }
  }

  /**
   * 给插入面板使用的，将当前选中的节点插入到当前选中的节点容器内。
   * @param position
   */
  async insert() {
    const store = this.store;
    const subRenderer = store.selectedInsertRendererInfo;
    if (!subRenderer) {
      return;
    }

    const id = store.insertId;
    const region = store.insertRegion;
    const beforeId = store.insertBeforeId; // 插入组件面板选中的组件
    let value =
      subRenderer.scaffold ||
      ({
        type: subRenderer.type
      } as SchemaObject);

    if (subRenderer.scaffoldForm) {
      value = await this.scaffold(subRenderer.scaffoldForm, value);
    }
    const child = this.addChild(id, region, value, beforeId, subRenderer);
    if (child) {
      store.closeInsertPanel();
      // mobx 修改数据是异步的
      setTimeout(() => {
        store.setActiveId(child.$$id);
      }, 100);
    }
  }

  /**
   * 给插入面板使用的，替换组件类型。
   * @param position
   */
  async replace() {
    const store = this.store;
    const subRenderer = store.selectedInsertRendererInfo;

    if (!subRenderer) {
      return;
    }

    const id = store.insertOrigId;
    let value = subRenderer.scaffold || {
      type: subRenderer.type
    };
    const region = store.insertRegion;

    if (subRenderer.scaffoldForm) {
      value = await this.scaffold(subRenderer.scaffoldForm, value);
    }

    if (this.replaceChild(id, value, subRenderer, region)) {
      store.closeInsertPanel();

      // outline 更新有点延时，而重新生成的时候读取的是outline里面的信息
      // 所以需要延时
      setTimeout(() => {
        this.rebuild();
      }, 4);
    }
  }

  /**
   * 判断当前元素是否为flex布局子容器
   * 备注: 以便额外增加布局相关配置项
   */
  isFlexItem(id: string) {
    return this.store.isFlexItem(id);
  }

  isFlexColumnItem(id: string) {
    return this.store.isFlexColumnItem(id);
  }

  /**
   * 判断当前元素是否为特殊布局元素（fixed、absolute）
   * 备注: 以便支持拖拽位置
   */
  draggableContainer(id: string) {
    return this.store.draggableContainer(id);
  }

  /**
   * 更新特殊布局元素的位置（fixed、absolute）
   */
  updateContainerStyleByDrag(dragId: string, dx: number, dy: number) {
    this.store.updateContainerStyleByDrag(dragId, dx, dy);
  }

  /**
   * 入口在 Preview 里面，用来获取渲染器对应的编辑器信息。
   * 拿到这些信息后会在渲染原本渲染器的地方包一层，并创建高亮框在点选或者 hover 的时候显示。
   * @param renderer  amis元素渲染器，比如 { type: 'audio', component: 'xxx渲染器'}
   * @param path 节点路径
   * @param schema 节点 schema 数据
   */
  getEditorInfo(
    renderer: RendererConfig,
    path: string,
    schema: any
  ): RendererInfo | null | undefined {
    let info: RendererInfo | null = null;
    /** 根据节点唯一id获取当前节点在页面schema中的数据路径 */
    const schemaPath = schema.$$id ? this.store.getSchemaPath(schema.$$id) : '';
    const context: RendererInfoResolveEventContext = {
      renderer,
      path,
      schemaPath,
      schema
    };

    const event = this.trigger('before-resolve-editor-info', context);

    if (event.prevented) {
      return event.context.data;
    }

    this.plugins.some(editor => {
      /** 从amis-editor的渲染器schema中获取关键信息 */
      const result = editor.getRendererInfo?.(context);

      if (result) {
        info = {
          id: schema.$$id,
          ...result,
          type: schema.type,
          plugin: editor,
          renderer: renderer,
          schemaPath
        };
        return true;
      }

      return false;
    });

    const afterEvent = this.trigger('after-resolve-editor-info', {
      ...context,
      data: info
    });

    return afterEvent.context.data;
  }

  /**
   * 面板的配置修改方法，不直接调用 store.changeValue 的原因是，
   * 这里面还有事件逻辑，插件里面可以写些逻辑。
   * @param value
   * @param diff
   */
  @autobind
  panelChangeValue(value: any, diff?: any) {
    const store = this.store;
    const context: ChangeEventContext = {
      ...this.buildEventContext(store.activeId),
      value,
      diff
    };

    const event = this.trigger('before-update', context);
    if (event.prevented) {
      return;
    }

    store.changeValue(value, diff);
    this.trigger('after-update', context);
  }

  /**
   * 打开子编辑器，比如弹框什么的，没办法直接编辑器，靠弹窗个新的编辑器来编辑。
   * @param config
   */
  openSubEditor(config: SubEditorContext) {
    this.store.openSubEditor(config);
  }

  /**
   * 打开对应节点的右键菜单。
   * @param id
   * @param region
   * @param info
   */
  openContextMenu(
    id: string,
    region: string,
    info: {
      x: number;
      y: number;
    }
  ) {
    let menus: Array<ContextMenuItem> = [];
    const commonContext = this.buildEventContext(id);
    const context: ContextMenuEventContext = {
      ...commonContext,
      selections: this.store.selections.map(item =>
        this.buildEventContext(item)
      ),
      region,
      data: menus
    };

    menus = this.buildContextMenus(context);

    if (!menus.length) {
      return;
    }

    this.store.setContextId(id);
    openContextMenus(
      {
        x: info.x,
        y: info.y
      },
      menus,
      () => this.store.setContextId('')
    );
  }

  // 生成右键菜单内容
  buildContextMenus(context: ContextMenuEventContext) {
    this.plugins.forEach(editor => {
      editor.buildEditorContextMenu?.(context, context.data);
    });

    this.trigger('build-context-menus', context);

    return context.data;
  }

  closeContextMenu() {}

  /**
   * 将当前选中的节点上移
   */
  moveUp() {
    const store = this.store;
    if (!store.activeId) {
      return;
    }

    const node = store.getNodeById(store.activeId)!;
    const regionNode = node.parent;
    const host = node.host;

    const commonContext = this.buildEventContext(host);
    const context: MoveEventContext = {
      ...commonContext,
      sourceId: node.id,
      direction: 'up',
      beforeId: node.prevSibling?.id,
      region: regionNode.region
    };

    const event = this.trigger('before-move', context);
    if (!event.prevented) {
      store.moveUp(node.id);
      // this.buildToolbars();
      this.trigger('after-move', context);
      this.trigger('after-update', context);
    }
  }

  /**
   * 将当前选中的节点下移
   */
  moveDown() {
    const store = this.store;
    if (!store.activeId) {
      return;
    }

    const node = store.getNodeById(store.activeId)!;
    const regionNode = node.parent;
    const host = node.host;

    const commonContext = this.buildEventContext(host);
    const context: MoveEventContext = {
      ...commonContext,
      sourceId: node.id,
      direction: 'down',
      beforeId: node.nextSibling?.id,
      region: regionNode.region
    };

    const event = this.trigger('before-move', context);
    if (!event.prevented) {
      store.moveDown(node.id);
      // this.buildToolbars();
      this.trigger('after-move', context);
      this.trigger('after-update', context);
    }
  }

  /**
   * 删除节点
   */
  del(ids: string | Array<string>) {
    if (!ids || !ids.length) {
      return;
    }
    const id = Array.isArray(ids) ? ids[0] : ids;

    const context: DeleteEventContext = {
      ...this.buildEventContext(id),
      data: Array.isArray(ids) ? ids.concat() : []
    };

    const event = this.trigger('before-delete', context);
    if (!event.prevented) {
      Array.isArray(context.data) && context.data.length
        ? this.store.delMulti(context.data)
        : this.store.del(id);

      this.trigger('after-delete', context);
    }
  }

  /**
   * 重复节点
   * @param id
   */
  duplicate(id: string | Array<string>) {
    this.store.duplicate(id);
  }

  /**
   * 复制节点配置
   * @param id
   */
  copy(id: string, toastText: string = '已复制') {
    const json = this.store.getValueOf(id);
    this.clipboardData = stringify(json);
    toast.info('配置项' + toastText);
  }

  /**
   * 剪切当前节点，并复制配置到剪切板。
   * @param id
   */
  cut(id: string) {
    this.copy(id, '已剪切');
    this.del(id);
  }

  /**
   * 在节点上应用粘贴。
   * @param id
   * @param region
   */
  async paste(id: string, region?: string) {
    if (!this.clipboardData) {
      alert('剪切板内容为空');
      return;
    }
    const json = reGenerateID(parse(this.clipboardData));
    region ? this.addChild(id, region, json) : this.replaceChild(id, json);
  }

  /**
   * 清空区域
   * @param id
   * @param region
   */
  emptyRegion(id: string, region: string) {
    this.store.emptyRegion(id, region);

    setTimeout(() => {
      // 如果当前没有选中的元素，则自动选中当前元素
      if (
        !this.store.activeId ||
        !this.store.getNodeById(this.store.activeId)
      ) {
        this.store.setActiveId(id);
      }
    }, 100);
  }

  /**
   * 添加孩子，成功后返回节点，失败后返回 null。
   * @param id 目标组件 id
   * @param region 目标组件区域
   * @param json
   * @param position
   */
  addChild(
    id: string,
    region: string,
    json: any,
    beforeId?: string,
    subRenderer?: SubRendererInfo,
    dragInfo?: {
      id: string;
      type: string;
      data: any;
    }
  ): any | null {
    const store = this.store;
    let index: number = -1;
    const commonContext = this.buildEventContext(id);

    // 填充id，有些脚手架生成了复杂的布局等，这里都填充一下id
    JSONTraverse(json, (value: any) => {
      if (isPlainObject(value) && value.type && !value.id) {
        value.id = generateNodeId();
      }
    });

    if (beforeId) {
      const arr = commonContext.schema[region];
      if (Array.isArray(arr)) {
        index = findIndex(arr, (item: any) => item?.$$id === beforeId);
      }
    }

    const context: InsertEventContext = {
      ...commonContext,
      beforeId: beforeId,
      index,
      region: region,
      data: json,
      subRenderer,
      dragInfo
    };

    const event = this.trigger('before-insert', context);
    if (!event.prevented) {
      const child = store.insertSchema(event);
      this.trigger('after-insert', context);
      return child;
    }

    return null;
  }

  /**
   * 移动节点
   * @param id 目标组件 id
   * @param region 目标组件区域
   * @param sourceId 移动的节点 id
   * @param beforeId 移动到哪个节点前面
   */
  move(
    id: string,
    region: string,
    sourceId: string,
    beforeId?: string
  ): boolean {
    const store = this.store;

    const context: MoveEventContext = {
      ...this.buildEventContext(id),
      beforeId,
      region: region,
      sourceId
    };

    const event = this.trigger('before-move', context);
    if (!event.prevented) {
      store.moveSchema(event);

      this.trigger('after-move', context);
      return true;
    }

    return false;
  }

  /**
   * 替换节点。
   * @param id
   * @param json
   */
  replaceChild(
    id: string,
    json: any,
    subRenderer?: SubRendererInfo,
    region?: string
  ): boolean {
    const context: ReplaceEventContext = {
      ...this.buildEventContext(id),
      data: json,
      subRenderer,
      region
    };
    const event = this.trigger('before-replace', context);

    if (!event.prevented && event.context.data) {
      this.store.replaceChild(id, event.context.data);
      this.trigger('after-replace', context);
      return true;
    }

    return false;
  }

  setActiveId(id: string) {
    this.store.setActiveId(id);
  }

  /**
   * 打开某节点的编辑面板
   * @param id
   */
  openConfigPanel(id: string) {
    const store = this.store;

    if (store.activeId !== id) {
      store.setActiveId(id);
    }

    store.changePanelKey('config');
  }

  /**
   * 打开某节点的代码面板
   * @param id
   */
  openCodePanel(id: string) {
    const store = this.store;

    if (store.activeId !== id) {
      store.setActiveId(id);
    }

    store.changePanelKey('code');
  }

  toggleSelection(id: string) {
    const store = this.store;
    let selections = store.selections.concat();

    if (!selections.length && store.activeId) {
      selections.push(store.activeId);
    }

    const idx = selections.indexOf(id);

    if (!~idx) {
      selections.push(id);
    } else {
      selections.splice(idx, 1);
    }
    this.setSelection(selections, id);
  }

  setSelection(selections: Array<string>, id: string = selections[0]) {
    const store = this.store;
    const commonContext = this.buildEventContext(id);
    const context: SelectionEventContext = {
      ...commonContext,
      selections: selections.map(item => this.buildEventContext(item)),
      data: selections
    };

    const event = this.trigger('selection-change', context);
    if (event.prevented) {
      return;
    }
    selections = context.data;

    if (selections.length === 1) {
      store.setActiveId(selections[0]);
    } else {
      store.setSelections(selections); // 多选
    }
  }

  startDrag(id: string, e: React.DragEvent) {
    e.persist();
    this.dnd.startDrag(id, e.nativeEvent);
  }

  async scaffold(form: ScaffoldForm, value: any): Promise<SchemaObject> {
    return new Promise(resolve => {
      this.store.openScaffoldForm({
        ...form,
        value: form.pipeIn ? form.pipeIn(value) : value,
        callback: resolve
      });
    });
  }

  async reScaffold(id: string, form: ScaffoldForm, value: any) {
    const replaceWith = await this.scaffold(form, value);
    this.replaceChild(id, replaceWith);
  }

  // 用来纠正一些错误的配置。
  lazyPatchSchema = debounce(this.patchSchema.bind(this), 250, {
    leading: false,
    trailing: true
  });

  patching = false;
  patchSchema(force = false) {
    if (this.patching) {
      return;
    }
    this.patching = true;
    let patchList = (list: Array<EditorNodeType>) => {
      // 深度优先
      list.forEach((node: EditorNodeType) => {
        if (node.uniqueChildren && node.uniqueChildren.length) {
          patchList(node.uniqueChildren);
        }

        if (!node.isRegion) {
          node.patch(this.store, force);
        }
      });
    };

    patchList(this.store.root.children);
    this.patching = false;
  }

  /**
   * 把设置了特殊 region 的，hack 一下。
   */
  hackRenderers(renderers = getRenderers()) {
    const toHackList: Array<{
      renderer: RendererConfig;
      regions?: Array<RegionConfig>;
      overrides?: any;
    }> = [];
    renderers.forEach(renderer => {
      const plugins = this.plugins.filter(
        plugin =>
          (Array.isArray(plugin?.regions) &&
            plugin.regions.some(
              region =>
                region.renderMethod &&
                (region.rendererName ?? plugin.rendererName) === renderer.name
            )) ||
          (plugin.overrides &&
            (plugin.overrideTargetRendererName ?? plugin.rendererName) ===
              renderer.name)
      );

      plugins.forEach(plugin => {
        const complexRegions = plugin.regions?.filter(
          region =>
            region.renderMethod &&
            (region.rendererName ?? plugin.rendererName) === renderer.name
        );

        complexRegions?.length &&
          toHackList.push({
            renderer,
            regions: complexRegions
          });

        if (
          plugin.overrides &&
          (plugin.overrideTargetRendererName ?? plugin.rendererName) ===
            renderer.name
        ) {
          toHackList.push({
            renderer,
            overrides: plugin.overrides
          });
        }
      });
    });
    toHackList.forEach(({regions, renderer, overrides}) =>
      this.hackIn(renderer, regions, overrides)
    );
  }

  /**
   * 入口在 Preview，用来生成包括元素头部快捷工具栏。
   * @param info
   * @param render
   */
  makeWrapper(info: RendererInfo, render: RendererConfig): any {
    return this.parent?.makeWrapper
      ? this.parent.makeWrapper(info, render)
      : makeWrapper(this, info, render);
  }

  /**
   * 用来生成属性配置面板。
   * @param schema
   */
  makeSchemaFormRender(schema: {
    body?: SchemaCollection;
    controls?: Array<any>;
    definitions?: any;
    api?: any;
    submitOnChange?: boolean;
    justify?: boolean;
    panelById?: string;
    formKey?: string;
  }) {
    return makeSchemaFormRender(this, schema);
  }

  onWidthChangeStart(
    e: MouseEvent,
    ctx: {
      dom: HTMLElement;
      node: EditorNodeType;
      resizer: HTMLElement;
    }
  ) {
    return this.trigger('width-change-start', {
      ...ctx,
      nativeEvent: e
    });
  }

  onHeightChangeStart(
    e: MouseEvent,
    ctx: {
      dom: HTMLElement;
      node: EditorNodeType;
      resizer: HTMLElement;
    }
  ) {
    return this.trigger('height-change-start', {
      ...ctx,
      nativeEvent: e
    });
  }

  onSizeChangeStart(
    e: MouseEvent,
    ctx: {
      dom: HTMLElement;
      node: EditorNodeType;
      resizer: HTMLElement;
    }
  ) {
    return this.trigger('size-change-start', {
      ...ctx,
      nativeEvent: e
    });
  }

  openNodePopOverForm(id: string | EditorNodeType) {
    const node = typeof id === 'string' ? this.store.getNodeById(id) : id;
    if (
      !node ||
      (!node.info?.plugin?.popOverBody &&
        !node.info?.plugin?.popOverBodyCreator)
    ) {
      return;
    }
    const plugin = node.info.plugin!;

    const store = this.store;
    const context: PopOverFormContext = {
      body: plugin.popOverBodyCreator
        ? plugin.popOverBodyCreator(this.buildEventContext(node))
        : plugin.popOverBody!,
      value: store.getValueOf(node.id),
      callback: this.panelChangeValue,
      target: () =>
        document.querySelector(`[data-editor-id="${node.id}"]`) as HTMLElement
    };
    store.openPopOverForm(context);
  }

  /**
   * 更新广播事件集（还没想好怎么存）
   *
   * @param {string} key 插件名称
   * @param {RendererEvent[]} events 事件集
   * @memberof EditorManager
   */
  addBroadcast(event: RendererPluginEvent) {
    this.broadcasts.push(event);
  }

  /**
   * 删除指定广播（还没想好怎么存）
   *
   * @param {string} id
   * @memberof EditorManager
   */
  removeBroadcast(id: string) {
    const idx = findIndex(this.broadcasts, item => item.eventName === id);
    this.broadcasts.splice(idx, 1);
  }

  /**
   * 获取上下文数据结构
   * @param id
   */
  async getContextSchemas(id: string | EditorNodeType, withoutSuper = false) {
    const node = typeof id === 'string' ? this.store.getNodeById(id) : id;
    if (!node) {
      return [];
    }

    let scope: DataScope | void;
    let from = node;
    let region = node;

    // 查找最近一层的数据域
    while (!scope && from) {
      const nodeId = from.info?.id;
      const type = from.info?.type;
      scope = this.dataSchema.hasScope(`${nodeId}-${type}`)
        ? this.dataSchema.getScope(`${nodeId}-${type}`)
        : undefined;
      from = from.parent;
      if (from?.isRegion) {
        region = from;
      }
    }

    let nearestScope;

    // 更新组件树中的所有上下文数据声明为最新数据
    while (scope) {
      const [id, type] = scope.id.split('-');
      const node = this.store.getNodeById(id, type);

      // 拿非重复组件id的父组件作为主数据域展示，如CRUD，不展示表格，只展示增删改查信息，避免变量面板出现两份数据
      if (!nearestScope && node && !node.isSecondFactor) {
        nearestScope = scope;
      }

      const jsonschema = await node?.info?.plugin?.buildDataSchemas?.(
        node,
        region
      );
      if (jsonschema) {
        scope.removeSchema(jsonschema.$id);
        scope.addSchema(jsonschema);
      }

      scope = withoutSuper ? undefined : scope.parent;
    }

    if (nearestScope?.id) {
      this.dataSchema.switchTo(nearestScope.id);
    }

    return withoutSuper
      ? this.dataSchema.current.schemas
      : this.dataSchema.getSchemas();
  }

  /**
   * 获取可用上下文待绑定字段
   */
  async getAvailableContextFields(node: EditorNodeType) {
    if (!node) {
      return;
    }

    let scope: DataScope | void;
    let from = node;
    let region = node;

    // 查找最近一层的数据域
    while (!scope && from) {
      scope = this.dataSchema.hasScope(`${from.id}-${from.type}`)
        ? this.dataSchema.getScope(`${from.id}-${from.type}`)
        : undefined;
      from = from.parent;
      if (from?.isRegion) {
        region = from;
      }
    }

    while (scope) {
      const [id, type] = scope.id.split('-');
      const scopeNode = this.store.getNodeById(id, type);

      if (scopeNode) {
        return scopeNode?.info.plugin.getAvailableContextFields?.(
          scopeNode,
          node
        );
      }

      scope = scope.parent;
    }
  }

  beforeDispatchEvent(
    originHook: any,
    e: any,
    component: any,
    scoped: IScopedContext,
    data: any,
    broadcasts?: any
  ) {
    originHook?.(e, component, scoped, data, broadcasts);

    if (component.props.$$id) {
      const node = this.store.getNodeById(
        component.props.$$id,
        component.props.type
      );
      node?.info?.plugin?.rendererBeforeDispatchEvent?.(
        node,
        e,
        JSONPipeOut(data)
      );
    }
  }

  /**
   * 销毁函数
   */
  dispose() {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.listeners.splice(0, this.listeners.length);
    this.broadcasts.splice(0, this.broadcasts.length);
    this.lazyPatchSchema.cancel();
    this.dnd.dispose();
  }
}
