/**
 * @file 把一些功能性的东西放在了这个里面，辅助 compoennt/Editor.tsx 组件的。
 * 编辑器非 UI 相关的东西应该放在这。
 */
import {reaction} from 'mobx';
import {isAlive} from 'mobx-state-tree';
import {parse, stringify} from 'json-ast-comments';
import debounce from 'lodash/debounce';
import findIndex from 'lodash/findIndex';
import omit from 'lodash/omit';
import {openContextMenus, toast, alert, DataScope, DataSchema} from 'amis';
import {
  getRenderers,
  RenderOptions,
  JSONTraverse,
  wrapFetcher,
  GlobalVariableItem,
  setVariable,
  getTheme
} from 'amis-core';
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
  PluginActions,
  BasePlugin,
  GlobalVariablesEventContext,
  GlobalVariableEventContext,
  InlineEditableElement
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
  JsonGenerateID,
  isString,
  isObject,
  isLayoutPlugin,
  JSONPipeOut,
  scrollToActive,
  JSONPipeIn,
  generateNodeId,
  JSONGetNodesById,
  diff
} from './util';
import {hackIn, makeSchemaFormRender, makeWrapper} from './component/factory';
import {env} from './env';
import {EditorNodeType} from './store/node';
import {EditorProps} from './component/Editor';
import {EditorDNDManager} from './dnd';
import {VariableManager} from './variable';

import type {IScopedContext} from 'amis';
import type {SchemaObject, SchemaCollection} from 'amis';
import type {Api, Payload, RendererConfig, RendererEnv} from 'amis-core';
import {loadAsyncRenderer} from 'amis-core';
import {startInlineEdit} from './inlineEdit';

export interface EditorManagerConfig
  extends Omit<EditorProps, 'value' | 'onChange'> {}

export interface PluginClass {
  new (manager: EditorManager, options?: any): PluginInterface;
  id?: string;
  /** 优先级，值为整数，当存在两个ID相同的Plugin时，数字更大的优先级更高 */
  priority?: number;
  scene?: Array<string>;
}

const builtInPlugins: Array<
  PluginClass | [PluginClass, Record<string, any> | (() => Record<string, any>)]
> = [];

declare const window: Window & {AMISEditorCustomPlugins: any};

/**
 * 自动加载预先注册的自定义插件
 * 备注：新版 amis-widget[3.0.0] 需要
 */
export function autoPreRegisterEditorCustomPlugins() {
  if (window.AMISEditorCustomPlugins) {
    Object.keys(window.AMISEditorCustomPlugins).forEach(pluginName => {
      const curEditorPlugin = window.AMISEditorCustomPlugins[pluginName];
      if (curEditorPlugin) {
        registerEditorPlugin(curEditorPlugin);
      }
    });
  }
}

/**
 * 注册Editor插件
 * 备注: 支持覆盖原有组件，注册新的组件时需配置 priority。
 * @param editor
 */
export function registerEditorPlugin(klass: PluginClass) {
  // 处理插件身上的场景信息
  const scene = Array.from(new Set(['global'].concat(klass.scene || 'global')));
  klass.scene = scene;

  let exsitedPluginIdx: any = null;
  if (klass.prototype && klass.prototype.isNpmCustomWidget) {
    exsitedPluginIdx = builtInPlugins.findIndex(item =>
      Array.isArray(item)
        ? item[0].prototype.name === klass.prototype.name
        : item.prototype.name === klass.prototype.name
    );
  } else {
    // 待进一步优化
    exsitedPluginIdx = builtInPlugins.findIndex(item => item === klass);
  }

  /** 先给新加入的plugin加一个ID */
  if (!~exsitedPluginIdx) {
    klass.id = klass.id || klass.name || guid();
  }

  /** 因为class的继承关系，未设置ID的子class会和父class共用ID, 只有设置了priority的时候才会执行同ID去重 */
  if (klass.priority == null || !Number.isInteger(klass.priority)) {
    if (!~exsitedPluginIdx) {
      builtInPlugins.push(klass);
    } else {
      console.warn(`注册插件「${klass.id}」异常，已存在同名插件：`, klass);
    }
  } else {
    exsitedPluginIdx = ~exsitedPluginIdx
      ? exsitedPluginIdx
      : builtInPlugins.findIndex(
          item =>
            !Array.isArray(item) &&
            item.id === klass.id &&
            item?.prototype instanceof BasePlugin
        );

    if (!~exsitedPluginIdx) {
      builtInPlugins.push(klass);
    } else {
      const current = builtInPlugins[exsitedPluginIdx] as PluginClass;

      /** 同ID的插件根据优先级决定是否update */
      const currentPriority =
        current.priority && Number.isInteger(current.priority)
          ? current.priority
          : 0;

      if (klass.priority > currentPriority) {
        builtInPlugins.splice(exsitedPluginIdx, 1, klass);
      } else {
        console.warn(`注册插件「${klass.id}」异常，已存在同名插件：`, klass);
      }
    }
  }
}

/**
 * 获取当前已经注册的插件。
 */
export function getEditorPlugins(options: any = {}) {
  const {scene = 'global'} = options;
  return builtInPlugins.filter(item =>
    (Array.isArray(item) ? item[0] : item).scene?.includes(scene)
  );
}

/**
 * 注销插件
 */
export function unRegisterEditorPlugin(id: string) {
  const idx = findIndex(builtInPlugins, item =>
    Array.isArray(item) ? item[0].id === id : item.id === id
  );
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

  // 广播事件集
  readonly broadcasts: RendererPluginEvent[] = [];
  // 插件事件集
  readonly pluginEvents: PluginEvents = {};
  // 插件动作集
  readonly pluginActions: PluginActions = {};

  dataSchema: DataSchema;

  /** 变量管理 */
  readonly variableManager;
  fetch?: (api: Api, data?: any, options?: object) => Promise<Payload>;

  constructor(
    readonly config: EditorManagerConfig,
    readonly store: EditorStoreType,
    readonly parent?: EditorManager
  ) {
    // 传给 amis 渲染器的默认 env
    this.env = {
      ...(env as any), // 默认的 env 中带 jumpTo
      ...omit(config.amisEnv, 'replaceText'), // 用户也可以设置自定义环境配置，用于覆盖默认的 env
      theme: config.theme!
    };

    // 内部统一使用 wrapFetcher 包装 fetcher
    if (this.env.fetcher) {
      this.env.fetcher = wrapFetcher(this.env.fetcher as any, this.env.tracker);
      this.fetch = this.env.fetcher as any;
    }

    this.env.beforeDispatchEvent = this.beforeDispatchEvent.bind(
      this,
      this.env.beforeDispatchEvent
    );
    this.hackIn = hackIn;
    // 自动加载预先注册的自定义组件
    autoPreRegisterEditorCustomPlugins();

    /** 在顶层对外部注册的Plugin和builtInPlugins合并去重 */
    const externalPlugins = (config?.plugins || []).forEach(external => {
      if (
        Array.isArray(external) ||
        !external.priority ||
        !Number.isInteger(external.priority)
      ) {
        return;
      }

      const idx = builtInPlugins.findIndex(
        builtIn =>
          !Array.isArray(builtIn) &&
          !Array.isArray(external) &&
          builtIn.id === external.id &&
          builtIn?.prototype instanceof BasePlugin
      );

      if (~idx) {
        const current = builtInPlugins[idx] as PluginClass;
        const currentPriority =
          current.priority && Number.isInteger(current.priority)
            ? current.priority
            : 0;
        /** 同ID Plugin根据优先级决定是否替换掉Builtin中的Plugin */
        if (external.priority > currentPriority) {
          builtInPlugins.splice(idx, 1);
        }
      }
    });

    this.plugins = (config.disableBultinPlugin ? [] : builtInPlugins) // 页面设计器注册的插件列表
      .concat(this.normalizeScene(config?.plugins))
      .filter(p => {
        p = Array.isArray(p) ? p[0] : p;
        return config.disablePluginList
          ? typeof config.disablePluginList === 'function'
            ? !config.disablePluginList(p.id || '', p)
            : !config.disablePluginList.includes(p.id || 'unkown')
          : true;
      })
      .map(Editor => {
        let pluginOptions: Record<string, any> = {};
        if (Array.isArray(Editor)) {
          pluginOptions =
            typeof Editor[1] === 'function' ? Editor[1]() : Editor[1];
          Editor = Editor[0];
        }

        const plugin = new Editor(this, pluginOptions); // 进行一次实例化
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
    this.dnd = new EditorDNDManager(this, store);
    this.dataSchema = new DataSchema(config.schemas || []);

    /** 初始化变量管理 */
    this.variableManager = new VariableManager(
      this.dataSchema,
      config?.variables,
      config?.variableOptions
    );
    let topParent = this.parent;
    while (topParent?.parent) {
      topParent = topParent.parent;
    }
    const topStore = topParent?.store || store;

    const setGlobalVariables = (variables: GlobalVariableItem[]) => {
      const id = 'global-variables-schema';
      const scope = this.dataSchema.root;
      const globalSchema: any = {
        type: 'object',
        title: '全局变量',
        properties: {}
      };

      variables.forEach(variable => {
        globalSchema.properties[variable.key] = {
          type: 'string',
          title: variable.label || variable.key,
          description: variable.description,
          ...variable.valueSchema
        };
      });

      const jsonschema: any = {
        $id: id,
        type: 'object',
        properties: {
          global: globalSchema
        }
      };
      scope.removeSchema(jsonschema.$id);
      scope.addSchema(jsonschema);
    };

    if (topStore.globalVariables?.length) {
      setGlobalVariables(topStore.globalVariables);
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
          scrollToActive(`[data-node-id="${id}"]`);

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
      ),

      // 同步全局变量数据结构，以便支持fx 可视化操作
      reaction(() => topStore.globalVariables, setGlobalVariables)
    );
  }

  normalizeScene(
    plugins?: Array<
      | PluginClass
      | [PluginClass, Record<string, any> | (() => Record<string, any>)]
    >
  ): (
    | PluginClass
    | [PluginClass, Record<string, any> | (() => Record<string, any>)]
  )[] {
    return (
      plugins?.map(klass => {
        let options;
        if (Array.isArray(klass)) {
          options = klass[1];
          klass = klass[0];
        }

        // 处理插件身上的场景信息
        const scene = Array.from(
          new Set(['global'].concat(klass.scene || 'global'))
        );
        klass.scene = scene;
        return options ? [klass, options] : klass;
      }) || []
    );
  }

  // 动态注册 plugin
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
    let newPluginClass: any = builtInPlugins.find(
      (Plugin: any) => Plugin.prototype && Plugin.prototype.name === pluginName
    );
    // 支持 postMessage 间接动态注册自定义组件
    if (!newPluginClass && window.AMISEditorCustomPlugins) {
      newPluginClass = window.AMISEditorCustomPlugins[pluginName];
    }
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

    if (!id && this.store?.filteredSchema) {
      id = this.store?.filteredSchema.$$id; // 默认使用根节点id
    }

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
      let subRenderer = await pluginItem.buildSubRenderers?.(
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
  updateConfigPanel(pluginType?: string) {
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
    return () => this.off(event, fn);
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
  async addElem(
    rendererIdOrSchema: string | any,
    reGenerateId?: boolean,
    activeChild: boolean = true
  ) {
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
    let curActiveId = store.activeId;
    let node = store.getNodeById(curActiveId)!; // 默认插入当前选中节点

    if (rendererId) {
      // 当有 rendererId 时，获取渲染器信息
      subRenderer = store.getSubRendererById(rendererId);

      // 点击添加悬浮容器，则直接插入当前页面根节点
      const curElemStyle = subRenderer?.scaffold?.style || {};
      if (curElemStyle.position === 'fixed') {
        curActiveId = store.getRootId();
        node = store.getNodeById(curActiveId)!; // 默认插入当前选中节点
      }
    }

    if (!subRenderer && !schemaData) {
      // 当渲染器信息和 schemaData 都为空时，则不作任何处理
      return;
    }

    if (!node) {
      toast.warning('请先选择一个元素作为插入的位置。');
      return;
    }

    const curElemSchema = schemaData || subRenderer?.scaffold;
    const isSpecialLayout = this.isSpecialLayout(curElemSchema);

    // 不直接替换容器
    // if (
    //   (node.type === 'wrapper' || node.type === 'container') &&
    //   node.schema?.body?.length === 0 &&
    //   curElemSchema?.type === 'flex' &&
    //   !node.schema?.isFreeContainer &&
    //   !isSpecialLayout
    // ) {
    //   // 布局能力提升: 点击插入新元素，当wrapper为空插入布局容器时，自动改为置换，避免过多层级
    //   this.replaceChild(
    //     curActiveId,
    //     curElemSchema,
    //     subRenderer,
    //     store.insertRegion,
    //     reGenerateId
    //   );
    //   setTimeout(() => {
    //     this.updateConfigPanel();
    //   }, 0);
    //   return;
    // }

    const parentNode = node.parent as EditorNodeType; // 父级节点

    // 插入新元素需要的字段
    let nextId = null;
    let regionNodeId = null;
    let regionNodeRegion = null;

    if (store.activeRegion) {
      regionNodeId = curActiveId;
      regionNodeRegion = store.activeRegion;
    } else if (node.schema.columns && node.type !== 'grid') {
      // crud 和 table 等表格类容器
      regionNodeId = curActiveId;
      regionNodeRegion = 'columns';
    } else if (
      node.schema.items &&
      (isLayoutPlugin(node.schema) || node.type === 'combo')
    ) {
      // 当前节点是布局类容器节点或 combo 组件
      regionNodeId = curActiveId;
      regionNodeRegion = 'items';
    } else if (node.schema.body) {
      // 当前节点是容器节点
      regionNodeId = curActiveId;
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
      } else if (
        !parentNode.region &&
        !parentNode.schema.body &&
        !parentNode.schema.items
      ) {
        // 其他特殊情况暂时不考虑，给予提示
        toast.warning('当前节点不允许追加新组件。');
        return;
      }

      const parent = store.getSchemaParentById(curActiveId); // 获取父节点
      let beforeId = -1;
      parent.some((item: any, index: number) => {
        let result = false;
        if (item?.$$id === curActiveId) {
          beforeId = index;
          result = true;
        }
        return result;
      });
      nextId = parent[beforeId + 1]?.$$id; // 下一个节点的ID（追加时需要）
    } else {
      // 当前选中的是根节点，默认插入到body中
      regionNodeId = curActiveId;
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
      subRenderer || node.info,
      undefined, // 不是拖拽，不需要传递拖拽信息
      reGenerateId
    );
    if (child && activeChild) {
      // mobx 修改数据是异步的
      setTimeout(() => {
        store.setActiveId(child.$$id);
      }, 100);
    }
  }

  /**
   * 判断当前节点是否可以添加同级节点
   */
  canAppendSiblings() {
    const store = this.store;
    const id = store.activeId;
    const node = store.getNodeById(id)!; // 当前选中节点
    const regionNode = node.parent as EditorNodeType; // 父级节点
    if (!node || !regionNode || !regionNode.schema) {
      return false;
    } else if (regionNode.memberImmutable('')) {
      return false;
    } else if (
      regionNode.schema.body ||
      (regionNode.schema.type === 'flex' && regionNode.schema.items) ||
      node.schema.columns
    ) {
      return true;
    }
    return false;
  }

  /**
   * 在当前选中元素追加新的schema
   * 备注：目前主要用在复制&粘贴快捷功能键中
   * @param rendererSchema
   */
  async appendSiblingSchema(
    rendererSchema: Object,
    beforeInsert?: boolean,
    disabledAutoSelectInsertElem?: boolean,
    reGenerateId?: boolean
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
      } else if (
        !regionNode.region &&
        regionNode.schema?.type === 'flex' &&
        regionNode.schema.items
      ) {
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
        nextId,
        node.info,
        {
          id: store.dragId,
          type: store.dragType,
          data: store.dragSchema
        },
        reGenerateId
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
   * 判断当前元素定位是否为flex容器
   */
  isFlexContainer(id: string) {
    return this.store.isFlexContainer(id);
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

  // 判断是否为特殊布局元素：绝对布局 or 固定布局
  isSpecialLayout(curSchema: any) {
    const curSchemaStyle = curSchema?.style || {};
    if (
      curSchemaStyle?.position === 'fixed' ||
      curSchemaStyle?.position === 'absolute'
    ) {
      return true;
    }
    return false;
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
          dialogTitle:
            schema.type === 'dialog' || schema.type === 'drawer'
              ? schema.title
              : '',
          dialogType: schema.dialogType,
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
  panelChangeValue(
    value: any,
    diff?: any,
    changeFilter?: (schema: any, value: any, id: string, diff?: any) => any,
    id = this.store.activeId
  ) {
    const store = this.store;
    const context: ChangeEventContext = {
      ...this.buildEventContext(id),
      value,
      diff
    };

    const event = this.trigger('before-update', context);
    if (event.prevented) {
      return;
    }

    store.changeValue(value, diff, changeFilter, id);

    this.trigger('after-update', {
      ...context,
      schema: context.node.schema // schema 是新的，因为修改完了
    });
  }

  /**
   * 打开子编辑器，比如弹框什么的，没办法直接编辑器，靠弹窗个新的编辑器来编辑。
   * @param config
   */
  openSubEditor(config: SubEditorContext) {
    if (
      ['dialog', 'drawer', 'confirmDialog'].includes(config.value.type) &&
      this.parent
    ) {
      let parent: EditorManager | undefined = this.parent;
      const id = config.value.$$originId || config.value.$$id;
      while (parent) {
        if (parent.store.schema.$$id === id) {
          toast.warning('所选弹窗已经被打开，不能多次打开');
          return;
        }

        parent = parent.parent;
      }
    }
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
      clientX: number;
      clientY: number;
      target: HTMLElement;
    }
  ) {
    let menus: Array<ContextMenuItem> = [];
    const commonContext = this.buildEventContext(id);
    const context: ContextMenuEventContext = {
      ...commonContext,
      clientX: info.clientX,
      clientY: info.clientY,
      target: info.target,
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
      ctx => ctx.state.isOpened && this.store.setContextId('')
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
   * 自由容器内元素置于顶层
   */
  moveTop() {
    const store = this.store;
    if (!store.activeId) {
      return;
    }

    const node = store.getNodeById(store.activeId)!;
    const regionNode = node.parent;
    this.move(regionNode.id, regionNode.region, node.id);
  }

  /**
   * 自由容器内元素置于底层
   */
  moveBottom() {
    const store = this.store;
    if (!store.activeId) {
      return;
    }
    const node = store.getNodeById(store.activeId)!;
    const regionNode = node.parent;

    this.move(
      regionNode.id,
      regionNode.region,
      node.id,
      regionNode.children[0].id
    );
  }

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
      region: regionNode.region,
      regionNode: regionNode
    };

    const event = this.trigger('before-move', context);
    if (!event.prevented) {
      store.moveUp(context);
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
      beforeId: node.nextSibling?.nextSibling?.id,
      region: regionNode.region,
      regionNode: regionNode
    };

    const event = this.trigger('before-move', context);
    if (!event.prevented) {
      store.moveDown(context);
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
        : this.store.del(context);
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
    if (region) {
      this.addChild(id, region, json);
      return;
    }
    if (this.replaceChild(id, json)) {
      setTimeout(() => {
        this.store.highlightNodes.forEach(node => {
          node.calculateHighlightBox();
        });
        this.updateConfigPanel(json.type);
      });
    }
  }

  /**
   * 重新生成当前节点的重复的id
   */
  reGenerateNodeDuplicateID(types: Array<string> = []) {
    const node = this.store.getNodeById(this.store.activeId);
    if (!node) {
      return;
    }
    let schema = node.schema;
    let changed = false;

    // 支持按照类型过滤某类型组件
    let tags = node.info?.plugin?.tags || [];
    if (!Array.isArray(tags)) {
      tags = [tags];
    }
    if (types.length && !tags.some(tag => types.includes(tag))) {
      return;
    }

    // 记录组件新旧ID映射关系方便当前组件内事件动作替换
    let idRefs: {[propKey: string]: string} = {};

    // 如果有多个重复组件，则重新生成ID
    JSONTraverse(schema, (value: any, key: string, host: any) => {
      const isNodeIdFormat =
        typeof value === 'string' && value.indexOf('u:') === 0;
      if (key === 'id' && isNodeIdFormat && host) {
        let sameNodes = JSONGetNodesById(this.store.schema, value, 'id');
        if (sameNodes && sameNodes.length > 1) {
          let newId = generateNodeId();
          idRefs[value] = newId;
          host[key] = newId;
          changed = true;
        }
      }
      return value;
    });

    if (changed) {
      // 替换当前组件内事件动作里面可能的ID
      JSONTraverse(schema, (value: any, key: string, host: any) => {
        const isNodeIdFormat =
          typeof value === 'string' && value.indexOf('u:') === 0;
        if (key === 'componentId' && isNodeIdFormat && idRefs[value]) {
          host.componentId = idRefs[value];
        }
        return value;
      });
      this.replaceChild(node.id, schema);
    }
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
    subRenderer?: SubRendererInfo | RendererInfo,
    dragInfo?: {
      id: string;
      type: string;
      data: any;
      position?: string;
    },
    reGenerateId?: boolean
  ): any | null {
    const store = this.store;
    let index: number = -1;
    const commonContext = this.buildEventContext(id);

    // 填充id，有些脚手架生成了复杂的布局等，自动填充一下id
    let curChildJson = JSONPipeIn(json, reGenerateId ?? true);

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
      data: curChildJson,
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
    beforeId?: string,
    dragInfo?: any
  ): boolean {
    const store = this.store;

    const context: MoveEventContext = {
      ...this.buildEventContext(id),
      beforeId,
      region: region,
      sourceId,
      dragInfo
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
    subRenderer?: SubRendererInfo | RendererInfo,
    region?: string,
    reGenerateId?: boolean
  ): boolean {
    // 转成普通json并添加node id
    let curJson = JSONPipeIn(json, reGenerateId ?? true);

    const context: ReplaceEventContext = {
      ...this.buildEventContext(id),
      data: {...curJson},
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
    e.persist?.();
    this.dnd.startDrag(id, e.nativeEvent || e);
  }

  async scaffold(form: ScaffoldForm, value: any): Promise<SchemaObject> {
    const scaffoldFormData = form.pipeIn ? await form.pipeIn(value) : value;
    if (form.getSchema) {
      form = Object.assign({}, form, await form.getSchema(scaffoldFormData));
    }

    return new Promise(resolve => {
      this.store.openScaffoldForm({
        ...form,
        value: scaffoldFormData,
        callback: resolve
      });
    });
  }

  async reScaffold(id: string, form: ScaffoldForm, value: any) {
    const replaceWith = await this.scaffold(form, value);
    this.replaceChild(id, replaceWith);
  }

  // 根据元素ID实时拿取上下文数据
  async reScaffoldV2(id: string) {
    const commonContext = this.buildEventContext(id);
    const scaffoldForm = commonContext.info?.scaffoldForm!;
    const curSchema = commonContext.schema;
    const replaceWith = await this.scaffold(scaffoldForm, curSchema);
    this.replaceChild(id, replaceWith);
  }

  // 用来纠正一些错误的配置。
  lazyPatchSchema = debounce(this.patchSchema.bind(this), 250, {
    leading: false,
    trailing: true
  });

  patching = false;
  patchingInvalid = false;
  patchSchema(force = false) {
    if (this.patching) {
      this.patchingInvalid = true;
      return;
    }
    this.patching = true;
    this.patchingInvalid = false;
    const batch: Array<{id: string; value: any}> = [];
    const ids = new Map();
    let patchList = (list: Array<EditorNodeType>) => {
      // 深度优先
      list.forEach((node: EditorNodeType) => {
        if (node.uniqueChildren && node.uniqueChildren.length) {
          patchList(node.uniqueChildren);
        }

        if (isAlive(node) && !node.isRegion) {
          const schema = node.schema;
          node.patch(
            this.store,
            force,
            (id, value) => batch.unshift({id, value}),
            ids
          );
          node.schemaPath && ids.set(schema.id, node.schemaPath);
        }
      });
    };

    patchList(this.store.root.children);
    this.store.batchChangeValue(batch);
    this.patching = false;
    this.patchingInvalid && this.patchSchema(force);
  }

  /**
   * 把设置了特殊 region 的，hack 一下。
   */
  async hackRenderers(renderers = getRenderers()) {
    const toHackList: Array<{
      renderer: RendererConfig;
      regions?: Array<RegionConfig>;
      overrides?: any;
    }> = [];

    await Promise.all(renderers.map(renderer => loadAsyncRenderer(renderer)));

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

    this.store.markReady();
  }

  /**
   * 入口在 Preview，用来生成包括元素头部快捷工具栏。
   * @param info
   * @param render
   */
  makeWrapper(info: RendererInfo, render: RendererConfig): any {
    return makeWrapper(this, info, render);
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
    pipeIn?: (value: any) => any;
    pipeOut?: (value: any) => any;
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
      store: EditorStoreType;
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
      node,
      body: plugin.popOverBodyCreator
        ? plugin.popOverBodyCreator(this.buildEventContext(node))
        : plugin.popOverBody!,
      value: store.getValueOf(node.id),
      callback: this.panelChangeValue,
      target: () =>
        document.querySelector(`[data-hlbox-id="${node.id}"]`) as HTMLElement
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

    let scope: DataScope | void = undefined;
    let from = node;
    let region = node;
    const trigger = node;

    // 删掉当前行记录scope，保持原始scope
    for (const key in this.dataSchema.idMap) {
      if (/\-currentRow$/.test(key)) {
        this.dataSchema.removeScope(key);
      }
    }

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
    let listScope = [];

    // 更新组件树中的所有上下文数据声明为最新数据
    while (scope) {
      const [nodeId] = scope.id.split('-');
      const type = scope.id.replace(`${nodeId}-`, '');
      const scopeNode = this.store.getNodeById(nodeId, type);

      // 拿非重复组件id的父组件作为主数据域展示，如CRUD，不展示表格，只展示增删改查信息，避免变量面板出现两份数据
      if (!nearestScope && scopeNode && !scopeNode.isSecondFactor) {
        nearestScope = scope;
      }
      if (scopeNode) {
        const tmpSchema = await scopeNode?.info?.plugin?.buildDataSchemas?.(
          scopeNode,
          region,
          trigger
        );

        if (tmpSchema) {
          const jsonschema = {
            ...tmpSchema,
            ...(tmpSchema?.$id
              ? {}
              : {$id: `${scopeNode!.id}-${scopeNode!.type}`})
          };
          scope.removeSchema(jsonschema.$id);
          scope.addSchema(jsonschema);
        }

        // 记录each列表等组件顺序
        if (scopeNode?.info?.isListComponent) {
          listScope.unshift(scope);

          // 如果当前节点是list类型节点，当前scope从父节点上取
          if (nodeId === id) {
            nearestScope = scope.parent;
          }
        }
      }

      scope = withoutSuper ? undefined : scope.parent;
    }

    // each列表类型嵌套时需要从上到下获取数据，重新执行一遍
    if (listScope.length > 1) {
      for (let scope of listScope) {
        const [id, type] = scope.id.split('-');
        const node = this.store.getNodeById(id, type);
        if (node) {
          const tmpSchema = await node?.info?.plugin?.buildDataSchemas?.(
            node,
            region,
            trigger
          );
          if (tmpSchema) {
            const jsonschema = {
              ...tmpSchema,
              ...(tmpSchema?.$id ? {} : {$id: `${node!.id}-${node!.type}`})
            };
            scope.removeSchema(jsonschema.$id);
            scope.addSchema(jsonschema);
          }
        }
      }
    }

    // 存在当前行时，找到最底层（todo：暂不考虑table套service+table的场景）
    const nearestScopeId =
      Object.keys(this.dataSchema.idMap).find(
        key =>
          /\-currentRow$/.test(key) &&
          !this.dataSchema.idMap[key].children?.length
      ) || nearestScope?.id;

    if (nearestScopeId) {
      this.dataSchema.switchTo(nearestScopeId);
    }

    // 如果当前容器是list非数据组件，scope从父scope开始
    if (node.info.isListComponent) {
      let lastScope = listScope[listScope.length - 1];
      this.dataSchema.switchTo(lastScope.parent!);
    }

    return withoutSuper
      ? this.dataSchema.current.schemas
      : this.dataSchema.getSchemas();
  }

  /**
   * 获取可用上下文待绑定字段
   */
  async getAvailableContextFields(node: EditorNodeType): Promise<any> {
    if (!node) {
      return;
    }

    let scope: DataScope | void = undefined;
    let from = node;
    let region = node;

    // 查找最近一层的数据域
    while (!scope && from) {
      scope = this.dataSchema.hasScope(`${from.id}-${from.type}`)
        ? this.dataSchema.getScope(`${from.id}-${from.type}`)
        : undefined;

      /** Combo和InputTable作为也有自己的Scope */
      if (!scope) {
        if (['combo', 'input-table'].includes(from?.info?.type)) {
          break;
        }
      }

      from = from.parent;
      if (from?.isRegion) {
        region = from;
      }
    }

    if (!scope) {
      /** 如果在子编辑器中，继续去上层编辑器查找，不过这里可能受限于当前层的数据映射 */
      if (!from && this.store.isSubEditor) {
        return this.config?.getAvaiableContextFields?.(node);
      }
      return from?.info.plugin.getAvailableContextFields?.(from, node);
    }

    while (scope) {
      const [id] = scope.id.split('-');
      const type = scope.id.substring(id.length + 1); // replace(`${id}-`, '');
      const scopeNode = this.store.getNodeById(id, type);

      if (scopeNode && !scopeNode.info?.isListComponent) {
        return scopeNode?.info.plugin.getAvailableContextFields?.(
          scopeNode,
          node
        );
      }

      scope = scope.parent;
    }
  }

  startInlineEdit(
    node: EditorNodeType,
    elem: HTMLElement,
    config: InlineEditableElement,
    event?: MouseEvent
  ) {
    const store = this.store;
    store.setActiveId(node.id);
    store.setActiveElement(config.match);

    startInlineEdit({
      node,
      event,
      elem,
      config,
      richTextToken: this.config.richTextToken,
      richTextOptions: this.config.richTextOptions,
      onCancel: () => {
        store.setActiveElement('');
      },
      onConfirm: (value: string) => {
        store.setActiveElement('');

        if (config.key) {
          const originValue = store.getValueOf(node.id);
          const newValue = {...originValue};
          setVariable(newValue, config.key, value);

          const diffValue = diff(originValue, newValue);
          // 没有变化时不触发onChange
          if (!diffValue) {
            return;
          }
          this.panelChangeValue(newValue, diffValue, undefined, node.id);
        }
      }
    });
  }

  /**
   * 初始化全局变量
   */
  async initGlobalVariables() {
    let variables: Array<GlobalVariableItem & {id: string | number}> = [];
    const context: GlobalVariablesEventContext = {
      data: variables
    };

    // 从插件中获取全局变量
    const event = this.trigger('global-variable-init', context);
    if (event.pending) {
      await event.pending;
    }
    this.store.setGlobalVariables(event.data);
  }

  /**
   * 获取全局变量详情
   */
  async getGlobalVariableDetail(variable: Partial<GlobalVariableItem>) {
    const context: GlobalVariableEventContext = {
      data: variable!
    };

    const event = this.trigger('global-variable-detail', context);
    if (event.pending) {
      await event.pending;
    }
    return event.data;
  }

  /**
   * 保存全局变量，包括新增保存和编辑保存
   */
  async saveGlobalVariable(variable: Partial<GlobalVariableItem>) {
    const context: GlobalVariableEventContext = {
      data: variable!
    };

    const event = this.trigger('global-variable-save', context);
    if (event.pending) {
      await event.pending;
    }
    return event.data;
  }

  /**
   * 删除全局变量
   */
  async deleteGlobalVariable(variable: Partial<GlobalVariableItem>) {
    const context: GlobalVariableEventContext = {
      data: variable!
    };

    const event = this.trigger('global-variable-delete', context);
    if (event.pending) {
      await event.pending;
    }

    return event.data;
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

    const id = component.props.$$id || component.props.$$editor?.id;
    if (id) {
      const node = this.store.getNodeById(id, component.props.type);
      node?.info?.plugin?.rendererBeforeDispatchEvent?.(
        node,
        e,
        JSONPipeOut(data)
      );
    }
  }

  getThemeClassPrefix() {
    return getTheme(this.config.theme || 'cxd').classPrefix;
  }

  /**
   * 销毁函数
   */
  dispose() {
    // 有些插件需要销毁，靠这个事件
    this.trigger('dispose', {
      data: this
    });
    delete (this as any).parent;
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
    this.plugins.forEach(p => p.dispose?.());
    this.plugins.splice(0, this.plugins.length);
    this.listeners.splice(0, this.listeners.length);
    this.broadcasts.splice(0, this.broadcasts.length);
    this.lazyPatchSchema.cancel();
    this.dnd.dispose();
  }
}
