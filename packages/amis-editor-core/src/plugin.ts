/**
 * @file 定义插件的 interface，以及提供一个 BasePlugin 基类，把一些通用的方法放在这。
 */

import omit from 'lodash/omit';
import {RegionWrapperProps} from './component/RegionWrapper';
import {makeAsyncLayer} from './component/AsyncLayer';
import {EditorManager} from './manager';
import {EditorStoreType} from './store/editor';
import {EditorNodeType} from './store/node';
import {DNDModeInterface} from './dnd/interface';
import {EditorDNDManager} from './dnd';
import React from 'react';
import {DiffChange} from './util';
import find from 'lodash/find';
import {RAW_TYPE_MAP} from './util';
import type {GlobalVariableItem, RendererConfig, Schema} from 'amis-core';
import type {MenuDivider, MenuItem} from 'amis-ui/lib/components/ContextMenu';
import type {BaseSchema, SchemaCollection} from 'amis';
import type {AsyncLayerOptions} from './component/AsyncLayer';
import type {SchemaType} from 'amis/lib/Schema';

/**
 * 区域的定义，容器渲染器都需要定义区域信息。
 */
export interface RegionConfig {
  /**
   * 简单情况，如果区域直接用的 render('region', subSchema)
   * 这种只需要配置 key 就能简单插入 Region 节点。
   */
  key: string;

  /**
   * 区域用来显示的名字。
   */
  label: string;

  /**
   * 区域占位字符，用于提示
   */
  placeholder?: string | JSX.Element;

  /**
   * 对于复杂的控件需要用到这个配置。
   * 如果配置了，则遍历 react dom 直到目标节点调换成 Region 节点
   *
   * 如果没有配置这个，但是又配置了 renderMethod 方法，
   * 那就直接将 renderMethod 里面返回的 react dom 直接包一层 Region
   */
  matchRegion?: (
    elem: JSX.Element | undefined | null,
    component: JSX.Element
  ) => boolean;

  /**
   * 指定要覆盖哪个方法。
   */
  renderMethod?: string;

  /**
   * 通常是hack 当前渲染器，单有时候当前渲染器其实是组合的别的渲染器。
   */
  rendererName?: string;

  /**
   * 当配置 renderMethod 的时候会自动把 Region 插入进去。
   * 默认是 outter 模式，有时候可能需要配置成 inner，
   * 比如 renderMethod 为 render 的时候。
   */
  insertPosition?: 'outter' | 'inner';

  /**
   * 是否为可选容器，如果是可选容器，不会强制自动创建成员
   */
  optional?: boolean;

  /**
   * 有时候有些包括是需要其他条件的，所以要自己写包裹逻辑。
   * 比如 Panel 里面的 renderBody
   */
  renderMethodOverride?: (
    regions: Array<RegionConfig>,
    insertRegion: (
      component: JSX.Element,
      dom: JSX.Element,
      regions: Array<RegionConfig>,
      info: RendererInfo,
      manager: EditorManager
    ) => JSX.Element
  ) => Function;

  /**
   * 偏好什么类型的组件？比如表单里面，controls 容器偏向表单项。
   */
  preferTag?: string;

  /**
   * 用来指定用什么组件包裹，默认是 RegionWrapper
   */
  wrapper?: React.ComponentType<RegionWrapperProps>;

  /**
   * 返回需要添加 data-region 的 dom 节点。
   */
  wrapperResolve?: (dom: HTMLElement) => HTMLElement;

  /**
   * 当拖入到这个容器时，是否需要修改一下 ghost 结构？
   */
  modifyGhost?: (ghost: HTMLElement, schema?: any) => void;

  /**
   * dnd 拖拽模式。比如 table 那种需要配置成 position-h
   */
  dndMode?:
    | 'default'
    | 'position-h'
    | 'position-v'
    | 'flex'
    // | (new (dnd: EditorDNDManager) => DNDModeInterface)
    | ((node: any) => string | undefined);

  /**
   * 可以用来判断是否允许拖入当前节点。
   */
  accept?: (
    json: any,
    node: EditorNodeType,
    dragNode?: EditorNodeType
  ) => boolean;

  /**
   * 当前区域是否隐藏
   */
  hiddenOn?: (schema: Schema) => boolean;
}

export interface VRendererConfig {
  /**
   * 配置了这些会自动创建编辑面板。
   */
  panelIcon?: string;
  panelTitle?: string;
  /**
   * @deprecated 用 panelBody 代替
   */
  panelControls?: Array<any>;
  panelDefinitions?: any;

  /**
   * 配置面板两端对齐布局
   */
  panelJustify?: boolean;

  /**
   * @deprecated 用panelBodyCreator 代替
   */
  panelControlsCreator?: (context: BaseEventContext) => Array<any>;
  panelBody?: Array<any>;
  panelBodyCreator?: (context: BaseEventContext) => Array<any>;

  /**
   * 配置了，要是不在 overides 里面使用也是没用的。
   */
  regions?: {
    [propName: string]: RegionConfig;
  };
}

export interface RendererScaffoldInfo {
  /**
   * 组件名称
   */
  name: string;

  // 图标
  icon?: string;

  pluginIcon?: string; // 优先级比 icon 高，用于使用新版组件 icon

  // 组件搜索关键字
  searchKeywords?: string;

  // 组件描述信息
  description?: string;

  // 文档链接
  docLink?: string;

  // 用来生成预览图
  previewSchema?: any;

  // 分类
  tags?: string | Array<string>;

  // type 和 scaffold 二选一
  type?: string;
  scaffold?: any;
}

export interface InlineEditableElement {
  // 元素选择器，当命中这个规则时支持内联编辑
  match: string;

  // 内联编辑模式
  // 默认为 plain-text
  mode?: 'plain-text' | 'rich-text';

  // onChange?: (node: EditorNodeType, value: any, elem: HTMLElement) => void;
  key: string;
}

/**
 * 渲染器信息。
 */
export interface RendererInfo extends RendererScaffoldInfo {
  // 是否使用懒渲染，默认 false
  // 当一个页面有很多组件时，开启懒渲染可以提升性能。
  // 打算正对容器组件开启懒渲染
  useLazyRender?: boolean;

  scaffolds?: Array<Partial<RendererScaffoldInfo>>;

  rendererName?: string;

  /**
   * json schema 协议
   */
  $schema?: string;

  isBaseComponent?: boolean;

  /**
   * 是否列表类型组件，自身没数据但是绑定了数据源里面的数组字段
   * 子组件需要能获取到单项字段，如list、each、cards
   */
  isListComponent?: boolean;

  disabledRendererPlugin?: boolean;

  /**
   * 配置区域。
   */
  regions?: Array<RegionConfig>;

  /**
   * 支持内联编辑的元素集合
   */
  inlineEditableElements?: Array<InlineEditableElement>;

  /**
   *  选中不需要高亮
   */
  notHighlight?: boolean;

  /**
   * 哪些容器属性需要自动转成数组的。如果不配置默认就从 regions 里面读取。
   */
  patchContainers?: Array<string>;

  /**
   * 覆盖的目标渲染器名称
   */
  overrideTargetRendererName?: string;

  /**
   * 覆写某些方法，一般用来插入虚拟的渲染器编辑器。
   */
  overrides?: {
    [propName: string]: Function;
  };

  /**
   * 虚拟渲染器的配置项，有时候需要给那些并不是渲染器的组件添加点选编辑功能。
   * 比如： Tabs 下面的 Tab, 这个并不是个渲染器，但是需要可以点选修改内容。
   */
  vRendererConfig?: VRendererConfig;

  /**
   * 默认为 BaseWrapper, 容器类的指定为 BaseContainerWrapper 或者再实现一个
   * 暂时没有需要配置的所以注释掉。
   * wrapper?: React.ComponentType<NodeWrapperProps>;
   *
   * 返回哪些 dom 节点，需要自动加上 data-editor-id 属性
   * 目前只有 TableCell 里面用到了，就它需要同时给某一列下所有 td 都加上那个属性。
   */
  wrapperResolve?: (dom: HTMLElement) => HTMLElement | Array<HTMLElement>;

  /**
   * 默认下发哪些属性，如果要动态下发，请使用 filterProps
   */
  wrapperProps?: any;

  /**
   * 修改一些属性，一般用来干掉 $$id，或者渲染假数据
   * 这样它的孩子节点就不能直接点选编辑了，比如 Combo。
   */
  filterProps?: (props: any, node: EditorNodeType) => any;

  /**
   * 有些没有视图的组件，可以自己输出点内容，否则没办法点选编辑。
   */
  renderRenderer?: (props: any, info: RendererInfo) => JSX.Element;

  /**
   * 是否有多重身份？
   * 比如 CRUD 即是 CRUD 又可能是 Table
   *
   * 表格的列，即是表格列，也可能是其他文本框。
   *
   * 配置了这个后会自动添加多个 Panel 面板来编辑。
   */
  multifactor?: boolean;

  /**
   * 右键的时候是否出现重新构建，靠这个。
   */
  scaffoldForm?: ScaffoldForm;

  // 自动填入，不用配置
  id: string;
  type: string;
  plugin: PluginInterface;
  extraPlugin?: PluginInterface; // 辅助插件，看需求。
  renderer: RendererConfig;
  schemaPath: string;

  // 给 subEditor 用的，别直接配置
  editable?: boolean; // 是否可编辑。
  removable?: boolean; // 是否可被删除
  draggable?: boolean; // 是否可被拖动
  movable?: boolean; // 是否可被移动
  replaceable?: boolean; // 是否可被替换
  duplicatable?: boolean; // 是否可以重复一份
  memberImmutable?: boolean | Array<string>; // 成员节点固定，意味着不能新增成员
  typeMutable?: boolean; // 类型是否可被修改

  // 如果是虚拟的渲染器
  hostId?: string;
  memberIndex?: number;

  tipName?: string;
  /** 共享上下文 */
  sharedContext?: Record<string, any>;
  dialogTitle?: string; //弹窗标题用于弹窗大纲的展示
  dialogType?: string; //区分确认对话框类型
  getSubEditorVariable?: (
    schema?: any
  ) => Array<{label: string; children: any}>; // 传递给子编辑器的组件自定义变量，如listSelect的选项名称和值
}

export type BasicRendererInfo = Omit<
  RendererInfo,
  'id' | 'type' | 'plugin' | 'renderer' | 'schemaPath'
>;

export interface PopOverForm {
  title?: string;

  /**
   * 脚手架配置项。
   */
  body: Array<any>;

  /**
   * @deprecated 改用 body 代替
   */
  controls?: Array<any>;

  initApi?: any;
  api?: any;
}

export interface ScaffoldForm extends PopOverForm {
  // 内容是否是分步骤的，如果是，body必须是?: Array<{title: string,body: any[]}>
  stepsBody?: boolean;
  /** 是否可跳过创建向导直接创建 */
  canSkip?: boolean;
  getSchema?: (value: any) => PopOverForm | Promise<PopOverForm>;
  mode?:
    | 'normal'
    | 'horizontal'
    | 'inline'
    | {
        mode: string;
        horizontal: any;
      };

  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  initApi?: any;
  api?: any;
  actions?: any[];
  /**
   * 整体验证脚手架配置，如果有错误返回错误对象。
   * key 是配置的字段名。
   * value 是具体错误信息。
   */
  validate?: (
    values: any,
    formStore: any
  ) =>
    | void
    | {[propName: string]: string}
    | Promise<void | {[propName: string]: string}>;

  /**
   * schema 配置转脚手架配置
   */
  pipeIn?: (value: any) => any;

  /**
   * 脚手架配置转 schema 配置。
   */
  pipeOut?: (value: any) => any;

  /**
   * 是否允许重新构建；
   */
  canRebuild?: boolean;
}

/**
 * 子渲染器信息
 */
export interface SubRendererInfo extends RendererScaffoldInfo {
  /**
   * 用于判断是否是平台预置组件，平台预置组件为true。
   */
  isBaseComponent?: boolean;

  rendererName?: string;
  /**
   * 首次拖入的时候可以用来配置个表单。
   */
  scaffoldForm?: ScaffoldForm;
  /**
   * 新增属性，用于判断是否出现在组件面板中，默认为false，为true则不展示
   */
  disabledRendererPlugin?: boolean;

  // 自动填入，不用配置
  plugin: PluginInterface;
  parent: RendererInfo;
  id: string;
  order: number;
}

export type BasicSubRenderInfo = Omit<
  SubRendererInfo,
  'plugin' | 'parent' | 'id' | 'order'
> &
  Partial<Pick<SubRendererInfo, 'order'>>;

/**
 * 工具按钮信息。
 */
export interface ToolbarItem {
  label?: string;
  id?: string;
  order: number;
  level?: 'primary' | 'secondary' | 'special';
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: any) => void;
  icon?: string;
  iconSvg?: string; // 自定义icon（svg格式）
  onClick?: (e: any) => void;
  tooltip?: string;
  placement?: 'top' | 'bottom' | 'right' | 'left';
}

export type BasicToolbarItem = Partial<ToolbarItem>;

export type ContextMenuItem = MenuItem | MenuDivider;

/**
 * 面板的属性定义
 */
export interface PanelProps {
  id?: string;
  info?: RendererInfo;
  path?: string;
  node?: EditorNodeType;
  value: BaseSchema;
  onChange: (value: BaseSchema, diff?: Array<DiffChange>) => void;
  store: EditorStoreType;
  manager: EditorManager;
  popOverContainer?: () => HTMLElement | void;
  readonly?: boolean;
  children?: React.ReactNode | ((props: PanelProps) => React.ReactNode);
}

/**
 * 面板信息定义
 */
export interface PanelItem {
  nodeId?: string;
  key: string;
  icon: React.ReactNode;
  tooltip?: string;
  pluginIcon?: string; // 新版icon（svg）
  title?: React.ReactNode; // 标题
  component?: React.ComponentType<PanelProps | any>;
  order: number;
  position?: 'left' | 'right';
  render?: (props: PanelProps) => JSX.Element;
  menus?: Array<any>;
}

export type BasicPanelItem = Omit<PanelItem, 'order'> &
  Partial<Pick<PanelItem, 'order'>>;

export interface EventContext {
  data?: any;
  [propName: string]: any;
}

/**
 * 事件上下文
 */
export interface BaseEventContext extends EventContext {
  node: EditorNodeType;
  id: string;
  info: RendererInfo;
  path: string;
  schema: any;
  schemaPath: string;
  secondFactor?: boolean;
}

export interface RendererInfoResolveEventContext extends EventContext {
  renderer: RendererConfig;
  path: string;
  schema: any;
  schemaPath: string;
  data?: RendererInfo;
}

export interface RendererJSONSchemaResolveEventContext
  extends BaseEventContext {
  data: string;
}

export interface IGlobalEvent {
  label: string;
  name: string; // 事件名称，唯一
  description: string; // 事件描述
  mapping: Array<{
    key: string; // 入参名称
    type: string; // 入参类型
  }>;
}

/**
 * 右键菜单事件的上下文。
 */
export interface ContextMenuEventContext extends BaseEventContext {
  region: string;
  selections: Array<BaseEventContext>;
  data: Array<ContextMenuItem>;
  clientX?: number;
  clientY?: number;
  target?: HTMLElement;
}

export interface SelectionEventContext extends BaseEventContext {
  selections: Array<BaseEventContext>;
  data: Array<string>;
}

export interface RendererEventContext extends BaseEventContext {
  region?: string;
}

export interface ActiveEventContext extends Partial<BaseEventContext> {
  active?: boolean;
}

export interface DeleteEventContext extends BaseEventContext {
  data?: Array<string>;
}

/**
 * 插入节点的事件上下文信息
 */
export interface InsertEventContext extends BaseEventContext {
  region: string;
  beforeId?: string;
  index: number;
  data: any;
  subRenderer?: SubRendererInfo | RendererInfo;
  dragInfo?: {
    id: string;
    type: string;
    data: any;
    position?: string;
  };
}

export interface ReplaceEventContext extends BaseEventContext {
  data: any;
  subRenderer?: SubRendererInfo | RendererInfo;
  region?: string;
}

export interface MoveEventContext extends BaseEventContext {
  region: string;
  sourceId: string;
  beforeId?: string;
  direction?: 'up' | 'down';
}

/**
 * 更新节点的事件上下文
 */
export interface ChangeEventContext extends BaseEventContext {
  value: any;
  readonly diff: Array<DiffChange>;
}

export interface DragEventContext extends EventContext {
  mode: 'move' | 'copy';
  sourceType: 'schema' | 'subrenderer' | string;
  sourceId: string;
  data: any;

  targetId?: string;
  targetRegion?: string;
}

export interface BuildPanelEventContext extends BaseEventContext {
  data: Array<BasicPanelItem>;
  selections: Array<BaseEventContext>;
}

export interface PreventClickEventContext extends EventContext {
  data: MouseEvent;
}

export interface ResizeMoveEventContext extends EventContext {
  data: Object;
  nativeEvent: MouseEvent;
  dom: HTMLElement;
  resizer: HTMLElement;
  node: EditorNodeType;
  store: EditorStoreType;
}

export interface GlobalVariablesEventContext extends EventContext {
  data: Array<GlobalVariableItem>;
}

export interface GlobalVariableEventContext extends EventContext {
  data: Partial<GlobalVariableItem>;
}

export interface AfterBuildPanelBody extends EventContext {
  data: SchemaCollection;
  plugin: BasePlugin;
  context: BaseEventContext;
}

/**
 * 将事件上下文转成事件对象。
 */
export type PluginEvent<T, P = any> = {
  context: T;
  type: string;
  preventDefault: () => void;
  stopPropagation: () => void;
  setData: (data: P) => void;

  // 是否被阻止？
  prevented?: boolean;
  stoped?: boolean;

  // 用来支持异步场景
  pending?: Promise<any>;

  // 当前值
  data?: P;

  // value值
  value?: any;
};

export type PluginEventFn = (e: PluginEvent<EventContext>) => any;

/**
 * 创建事件。
 * @param type
 * @param context
 */
export function createEvent<T extends EventContext>(
  type: string,
  context: T
): PluginEvent<T> {
  const event = {
    context,
    type,
    prevented: false,
    stoped: false,
    preventDefault() {
      event.prevented = true;
    },
    stopPropagation() {
      event.stoped = true;
    },
    get data() {
      return event.context.data;
    },
    setData(data: any) {
      event.context.data = data;
    }
  };

  return event;
}
export interface PluginEventListener {
  onInit?: (
    event: PluginEvent<
      EventContext & {
        data: EditorManager;
      }
    >
  ) => void;

  onActive?: (event: PluginEvent<ActiveEventContext>) => void;

  /**
   * 事件，当有配置项插入前调用。通过 event.preventDefault() 可以干预。
   */
  beforeInsert?: (event: PluginEvent<InsertEventContext>) => false | void;
  afterInsert?: (event: PluginEvent<InsertEventContext>) => void;

  /**
   * 面板里面编辑修改的事件。
   */
  beforeUpdate?: (event: PluginEvent<ChangeEventContext>) => false | void;
  afterUpdate?: (event: PluginEvent<ChangeEventContext>) => void;

  /**
   * 更新渲染器，或者右键粘贴配置。
   */
  beforeReplace?: (event: PluginEvent<ReplaceEventContext>) => false | void;
  afterReplace?: (event: PluginEvent<ReplaceEventContext>) => void;

  /**
   * 移动节点的时候触发，包括上移，下移
   */
  beforeMove?: (event: PluginEvent<MoveEventContext>) => false | void;
  afterMove?: (event: PluginEvent<MoveEventContext>) => void;

  /**
   * 删除的时候触发
   */
  beforeDelete?: (event: PluginEvent<DeleteEventContext>) => false | void;
  afterDelete?: (event: PluginEvent<DeleteEventContext>) => void;

  beforeResolveEditorInfo?: (
    event: PluginEvent<RendererInfoResolveEventContext>
  ) => false | void;
  afterResolveEditorInfo?: (
    event: PluginEvent<RendererInfoResolveEventContext>
  ) => void;

  beforeResolveJsonSchema?: (
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) => false | void;
  afterResolveJsonSchema?: (
    event: PluginEvent<RendererJSONSchemaResolveEventContext>
  ) => void;

  onDndAccept?: (event: PluginEvent<DragEventContext>) => false | void;

  onBuildPanels?: (event: PluginEvent<BuildPanelEventContext>) => void;

  onBuildContextMenus?: (event: PluginEvent<ContextMenuEventContext>) => void;

  onBuildToolbars?: (event: PluginEvent<BaseEventContext>) => void;

  onSelectionChange?: (event: PluginEvent<SelectionEventContext>) => void;

  onPreventClick?: (
    event: PluginEvent<PreventClickEventContext>
  ) => false | void;

  onWidthChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  onHeightChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  onSizeChangeStart?: (
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) => void;

  afterBuildPanelBody?: (event: PluginEvent<AfterBuildPanelBody>) => void;

  // 外部可以接管全局变量的增删改查
  // 全局变量列表获取
  onGlobalVariableInit?: (
    event: PluginEvent<GlobalVariablesEventContext>
  ) => void;
  // 全局变量详情信息
  onGlobalVariableDetail?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
  // 全局变量保存
  onGlobalVariableSave?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
  // 全局变量删除
  onGlobalVariableDelete?: (
    event: PluginEvent<GlobalVariableEventContext>
  ) => void;
}

/**
 * 插件的 interface 定义
 */
export interface PluginInterface
  extends Partial<BasicRendererInfo>,
    Partial<BasicSubRenderInfo>,
    PluginEventListener {
  readonly manager: EditorManager;

  order?: number;

  /**
   * 插件作用场景
   */
  scene?: Array<string>;

  // 是否可绑定数据，一般容器类型就没有
  withDataSource?: boolean;

  /**
   * 渲染器的名字，关联后不用自己实现 getRendererInfo 了。
   */
  rendererName?: string;

  /**
   * 默认的配置面板信息
   */
  panelIcon?: string;
  panelTitle?: string;

  /**
   * 新增属性，用于判断是否出现在组件面板中，默认为false，为ture则不展示
   */
  disabledRendererPlugin?: boolean;

  /**
   * @deprecated 用 panelBody
   */
  panelControls?: Array<any>;
  panelBody?: Array<any>;
  panelDefinitions?: any;
  panelApi?: any;
  panelSubmitOnChange?: boolean;

  /**
   * 隐藏右侧面板表单项Tab
   * TODO: 正式上线后要干掉这个属性
   */
  notRenderFormZone?: boolean;

  /**
   *
   * 事件定义集合
   */
  events?: RendererPluginEvent[] | ((schema: any) => RendererPluginEvent[]);

  /**
   *
   * 专有动作定义集合
   */
  actions?: RendererPluginAction[];

  /**
   * 右侧面板是否需要两端对齐布局
   */
  panelJustify?: boolean;

  /**
   * panelBodyAsyncCreator设置后异步加载层的配置项
   */
  async?: AsyncLayerOptions;

  /**
   * 拖拽模式
   */
  dragMode?: string;

  /**
   * 有数据域的容器，可以为子组件提供读取的字段绑定页面
   */
  getAvailableContextFields?: (
    // 提供数据域的容器节点
    scopeNode: EditorNodeType,
    // 数据域的应用节点
    target: EditorNodeType,
    // 节点所属的容器region
    region?: EditorNodeType
  ) => Promise<SchemaCollection | void>;

  /** 配置面板表单的 pipeOut function */
  panelFormPipeOut?: (value: any, oldValue: any) => any;

  /**
   * @deprecated 用 panelBodyCreator
   */
  panelControlsCreator?: (context: BaseEventContext) => Array<any>;
  panelBodyCreator?: (context: BaseEventContext) => SchemaCollection;
  /**
   * 配置面板内容区的异步加载方法，设置后优先级大于panelBodyCreator
   */
  panelBodyAsyncCreator?: (
    context: BaseEventContext
  ) => Promise<SchemaCollection>;

  // 好像没用，先注释了
  // /**
  //  * panel还需要合并目标插件提供的配置，冲突时以当前plugin为准
  //  */
  // panelBodyMergeable?: (
  //   context: BaseEventContext,
  //   plugin: PluginInterface
  // ) => boolean;

  popOverBody?: Array<any>;
  popOverBodyCreator?: (context: BaseEventContext) => Array<any>;

  /**
   * 返回渲染器信息。不是每个插件都需要。
   */
  getRendererInfo?: (
    context: RendererInfoResolveEventContext
  ) => BasicRendererInfo | void;

  /**
   * 生成节点的 JSON Schema 的 uri 地址。
   */
  buildJSONSchema?: (
    context: RendererJSONSchemaResolveEventContext
  ) => void | string;

  /**
   * 构建右上角功能按钮集合
   */
  buildEditorToolbar?: (
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) => void;

  /**
   * 构建右键菜单项
   */
  buildEditorContextMenu?: (
    context: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) => void;

  /**
   * 构建编辑器面板。
   */
  buildEditorPanel?: (
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) => void;

  /**
   * 构建子渲染器信息集合。
   */
  buildSubRenderers?: (
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ) =>
    | BasicSubRenderInfo
    | Array<BasicSubRenderInfo>
    | void
    | Promise<BasicSubRenderInfo | Array<BasicSubRenderInfo> | void>;

  /**
   * 更新NPM自定义组件分类和排序[异步方法]
   * 备注：目前主要在npm自定义组件的分类和排序更新中使用
   */
  asyncUpdateCustomSubRenderersInfo?: (
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ) => void;

  markDom?: (dom: HTMLElement | Array<HTMLElement>, props: any) => void;

  /**
   * 获取上下文数据结构
   *
   * @param node 当前容器节点
   * @param region 所属容器节点
   */
  buildDataSchemas?: (
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) => any | Promise<any>;

  rendererBeforeDispatchEvent?: (
    node: EditorNodeType,
    e: any,
    data: any
  ) => void;

  /**
   * 给 schema 打补丁，纠正一下 schema 配置。
   * @param schema
   * @param renderer
   * @param props
   * @returns
   */
  patchSchema?: (
    schema: Schema,
    renderer: RendererConfig,
    props?: any
  ) => Schema | void;

  dispose?: () => void;

  /**
   * 组件 ref 回调，mount 和 unmount 的时候都会调用
   * @param ref
   * @returns
   */
  componentRef?: (node: EditorNodeType, ref: any) => void;
}

export interface RendererPluginEvent {
  eventName: string; // 事件名称value
  eventLabel: string; // 事件名称label
  description?: string; // 事件描述
  defaultShow?: boolean; // 是否默认展示
  isBroadcast?: boolean; // 广播事件
  owner?: string; // 标记来源，主要用于广播
  dataSchema?: any[] | ((manager: EditorManager) => any[]); // 上下文schema
  strongDesc?: string;
}

// 动作声明
export interface RendererPluginAction {
  actionType?: string; // 动作名称value
  actionLabel?: string; // 动作名称label
  description?: string; // 动作描述
  schema?: any; // 动作配置schema
  supportComponents?: string[] | string; // 如果schema中包含选择组件，可以指定该动作支持的组件类型，用于组件数树过滤
  innerArgs?: string[]; // 动作专属配置参数，主要是为了区分特性字段和附加参数
  descDetail?: (info: any, context: any, props: any) => string | JSX.Element; // 动作详细描述
  outputVarDataSchema?: any | any[]; // 动作出参的结构定义
  actions?: SubRendererPluginAction[]; // 分支动作（配置面板包含多种动作的情况）
  children?: RendererPluginAction[]; // 子类型，for动作树
}

// 分支动作
export interface SubRendererPluginAction
  extends Pick<
    RendererPluginAction,
    'actionType' | 'innerArgs' | 'descDetail'
  > {}

export interface PluginEvents {
  [propName: string]:
    | RendererPluginEvent[]
    | ((schema: any) => RendererPluginEvent[]);
}

export interface PluginActions {
  [propName: string]: RendererPluginAction[];
}

/**
 * 基类，所有插件都继承这个好了，可以少写些逻辑。
 */
export abstract class BasePlugin implements PluginInterface {
  constructor(readonly manager: EditorManager) {}

  static scene = ['global'];

  name?: string;
  rendererName?: string;

  /**
   * 如果配置里面有 rendererName 自动返回渲染器信息。
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      (plugin.rendererName === renderer.name ||
        plugin.rendererName === renderer.origin?.name) // renderer.name 会从 renderer.type 中取值
    ) {
      let curPluginName = plugin.name;
      if (schema?.isFreeContainer) {
        curPluginName = '自由容器';
      } else if (schema?.isSorptionContainer) {
        curPluginName = '吸附容器';
      }
      // 复制部分信息出去
      return {
        name: curPluginName,
        regions: plugin.regions,
        inlineEditableElements: plugin.inlineEditableElements,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer,
        multifactor: plugin.multifactor,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        isListComponent: plugin.isListComponent,
        rendererName: plugin.rendererName,
        memberImmutable: plugin.memberImmutable,
        getSubEditorVariable: plugin.getSubEditorVariable,
        useLazyRender: plugin.useLazyRender
      };
    }
  }

  /**
   * 配置了 panelControls 自动生成配置面板
   * @param context
   * @param panels
   */
  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const plugin: PluginInterface = this;
    const store = this.manager.store;

    // 没有选中元素 或者 多选时不处理
    if (!store.activeId || context.selections.length) {
      return;
    }

    if (
      !context.info.hostId &&
      (plugin.panelControls ||
        plugin.panelControlsCreator ||
        plugin.panelBody ||
        plugin.panelBodyCreator ||
        plugin.panelBodyAsyncCreator) &&
      context.info.plugin === this
    ) {
      const enableAsync = !!(
        plugin.panelBodyAsyncCreator &&
        typeof plugin.panelBodyAsyncCreator === 'function'
      );
      const body = plugin.panelBodyAsyncCreator
        ? plugin.panelBodyAsyncCreator(context)
        : plugin.panelBodyCreator
        ? plugin.panelBodyCreator(context)
        : plugin.panelBody!;

      const event = this.manager.trigger('after-build-panel-body', {
        context,
        data: body,
        plugin
      });

      const baseProps = {
        definitions: plugin.panelDefinitions,
        submitOnChange: plugin.panelSubmitOnChange,
        api: plugin.panelApi,
        controls: plugin.panelControlsCreator
          ? plugin.panelControlsCreator(context)
          : plugin.panelControls!,
        justify: plugin.panelJustify,
        panelById: store.activeId,
        pipeOut: plugin.panelFormPipeOut?.bind?.(plugin)
      };

      panels.push({
        key: 'config',
        icon: plugin.panelIcon || plugin.icon || 'fa fa-cog',
        pluginIcon: plugin.pluginIcon,
        title: plugin.panelTitle || '设置',
        render: enableAsync
          ? makeAsyncLayer(async () => {
              const panelBody = await ((event.data ||
                body) as Promise<SchemaCollection>);

              return this.manager.makeSchemaFormRender({
                ...baseProps,
                body: panelBody
              });
            }, omit(plugin.async, 'enable'))
          : this.manager.makeSchemaFormRender({
              ...baseProps,
              body: (event.data || body) as SchemaCollection
            })
      });
    } else if (
      context.info.plugin === this &&
      context.info.hostId &&
      (plugin.vRendererConfig?.panelControls ||
        plugin.vRendererConfig?.panelControlsCreator ||
        plugin.vRendererConfig?.panelBody ||
        plugin.vRendererConfig?.panelBodyCreator)
    ) {
      panels.push({
        key: context.info.multifactor ? 'vconfig' : 'config',
        icon: plugin.vRendererConfig.panelIcon || 'fa fa-cog',
        title: plugin.vRendererConfig.panelTitle || '设置',
        render: this.manager.makeSchemaFormRender({
          submitOnChange: plugin.panelSubmitOnChange,
          api: plugin.panelApi,
          definitions: plugin.vRendererConfig.panelDefinitions,
          controls: plugin.vRendererConfig.panelControlsCreator
            ? plugin.vRendererConfig.panelControlsCreator(context)
            : plugin.vRendererConfig.panelControls!,
          body: plugin.vRendererConfig.panelBodyCreator
            ? plugin.vRendererConfig.panelBodyCreator(context)
            : plugin.vRendererConfig.panelBody!,
          justify: plugin.vRendererConfig.panelJustify,
          panelById: store.activeId
        })
      });
    }

    // 如果是个多重身份证
    if (context.info.plugin === this && context.info.multifactor) {
      const sameIdChild: EditorNodeType = context.node.sameIdChild;

      if (sameIdChild) {
        const subPanels = this.manager.collectPanels(sameIdChild, false, true);
        subPanels.forEach(panel => {
          if (panel.key === 'config' || panel.key === 'vconfig') {
            panels.push({
              ...panel,
              key: `sub-${panel.key}`,
              icon: sameIdChild.info?.plugin?.icon || panel.icon
            });
          }
        });
      }
    }
  }

  /**
   * 默认什么组件都加入的子组件里面，子类里面可以复写这个改变行为。
   * @param context
   * @param subRenderers
   */
  buildSubRenderers(
    context: RendererEventContext,
    subRenderers: Array<SubRendererInfo>,
    renderers: Array<RendererConfig>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    const plugin: PluginInterface = this;

    if (Array.isArray(plugin.scaffolds)) {
      return plugin.scaffolds.map(scaffold => ({
        name: (scaffold.name ?? plugin.name)!,
        icon: scaffold.icon ?? plugin.icon,
        pluginIcon: plugin.pluginIcon,
        description: scaffold.description ?? plugin.description,
        previewSchema: scaffold.previewSchema ?? plugin.previewSchema,
        tags: scaffold.tags ?? plugin.tags,
        docLink: scaffold.docLink ?? plugin.docLink,
        type: scaffold.type ?? plugin.type,
        scaffold: scaffold.scaffold ?? plugin.scaffold,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        rendererName: plugin.rendererName
      }));
    } else if (plugin.name && plugin.description) {
      return {
        searchKeywords: plugin.searchKeywords,
        name: plugin.name,
        icon: plugin.icon,
        description: plugin.description,
        previewSchema: plugin.previewSchema,
        tags: plugin.tags,
        docLink: plugin.docLink,
        type: plugin.type,
        scaffold: plugin.scaffold,
        scaffoldForm: plugin.scaffoldForm,
        disabledRendererPlugin: plugin.disabledRendererPlugin,
        isBaseComponent: plugin.isBaseComponent,
        pluginIcon: plugin.pluginIcon,
        rendererName: plugin.rendererName
      };
    }
  }

  renderPlaceholder(text: string, key?: any, style?: any) {
    return React.createElement('div', {
      key,
      className: 'wrapper-sm b-a b-light m-b-sm',
      style: style,
      children: React.createElement('span', {
        className: 'text-muted',
        children: text
      })
    });
  }

  getPlugin(rendererNameOrKlass: string | typeof BasePlugin) {
    return find(this.manager.plugins, plugin =>
      typeof rendererNameOrKlass === 'string'
        ? plugin.rendererName === rendererNameOrKlass
        : plugin instanceof rendererNameOrKlass
    );
  }

  buildDataSchemas(
    node: EditorNodeType,
    region?: EditorNodeType,
    trigger?: EditorNodeType,
    parent?: EditorNodeType
  ) {
    return {
      type: 'string',
      rawType: RAW_TYPE_MAP[node.schema.type as SchemaType] || 'string',
      title:
        typeof node.schema.label === 'string'
          ? node.schema.label
          : node.schema.name,
      originalValue: node.schema.value // 记录原始值，循环引用检测需要
    } as any;
  }

  getKeyAndName() {
    return {
      key: this.rendererName,
      name: this.name
    };
  }
}

/**
 * 布局相关组件基类，带宽高可拖拽功能。
 */
export class LayoutBasePlugin extends BasePlugin {
  onActive(event: PluginEvent<ActiveEventContext>) {
    const context = event.context;

    if (context.info?.plugin !== this || !context.node) {
      return;
    }

    const node = context.node!;
    const curSchema = node.schema || {};

    if (curSchema.isFixedWidth) {
      node.setWidthMutable(true);
    }
    if (curSchema.isFixedHeight) {
      node.setHeightMutable(true);
    }
  }

  onWidthChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'horizontal');
  }

  onHeightChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >
  ) {
    return this.onSizeChangeStart(event, 'vertical');
  }

  onSizeChangeStart(
    event: PluginEvent<
      ResizeMoveEventContext,
      {
        onMove(e: MouseEvent): void;
        onEnd(e: MouseEvent): void;
      }
    >,
    direction: 'both' | 'vertical' | 'horizontal' = 'both'
  ) {
    const context = event.context;
    const node = context.node;
    const store = context.store;
    if (node.info?.plugin !== this) {
      return;
    }

    const resizer = context.resizer;
    const dom = context.dom;
    const doc = store.getDoc() || document;
    const frameRect = dom.parentElement!.getBoundingClientRect();
    const rect = dom.getBoundingClientRect();
    const startX = context.nativeEvent.pageX;
    const startY = context.nativeEvent.pageY;

    event.setData({
      onMove: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        const dragHlBoxItem = doc.querySelector(
          `[data-hlbox-id='${node.id}']`
        ) as HTMLElement;

        // 实时调整被拖拽元素的坐标值
        const dragContainerItem = doc.querySelector(
          `[data-editor-id='${node.id}']`
        ) as HTMLElement;

        if (direction === 'both') {
          resizer.setAttribute('data-value', `${width}px x ${height}px`);
          dragHlBoxItem.style.height = `${height}px`;
          dragHlBoxItem.style.width = `${width}px`;
          dragContainerItem.style.height = `${height}px`;
          dragContainerItem.style.width = `${width}px`;
        } else if (direction === 'vertical') {
          resizer.setAttribute('data-value', `${height}px`);
          dragHlBoxItem.style.height = `${height}px`;
          dragContainerItem.style.height = `${height}px`;
          delete state.width;
        } else {
          resizer.setAttribute('data-value', `${width}px`);
          dragHlBoxItem.style.width = `${width}px`;
          dragContainerItem.style.width = `${width}px`;
          delete state.height;
        }

        node.updateState(state);

        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      },
      onEnd: (e: MouseEvent) => {
        const dy = e.pageY - startY;
        const dx = e.pageX - startX;
        const height = Math.max(50, rect.height + dy);
        const width = Math.max(100, Math.min(rect.width + dx, frameRect.width));
        const state: any = {
          width,
          height
        };

        if (direction === 'vertical') {
          delete state.width;
        } else if (direction === 'horizontal') {
          delete state.height;
        }

        resizer.removeAttribute('data-value');
        node.updateSchemaStyle(state);
        requestAnimationFrame(() => {
          node.calculateHighlightBox();
        });
      }
    });
  }
}
