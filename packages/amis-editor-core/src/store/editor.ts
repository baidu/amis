import {
  findTree,
  getVariable,
  mapObject,
  mapTree,
  eachTree,
  extendObject,
  createObject,
  extractObjectChain,
  GlobalVariableItem
} from 'amis-core';
import {cast, getEnv, Instance, types} from 'mobx-state-tree';
import {
  diff,
  filterSchemaForEditor,
  JSONDelete,
  JSONGetById,
  JSONTraverse,
  patchDiff,
  unitFormula,
  stringRegExp,
  needDefaultWidth,
  guid,
  appTranslate,
  JSONGetByPath,
  addModal,
  mergeDefinitions,
  getModals
} from '../util';
import {
  InsertEventContext,
  PluginEvent,
  RendererInfo,
  SubRendererInfo,
  ToolbarItem,
  PanelItem,
  MoveEventContext,
  ScaffoldForm,
  PopOverForm,
  DeleteEventContext,
  BaseEventContext,
  IGlobalEvent
} from '../plugin';
import {
  JSONDuplicate,
  JSONGetParentById,
  JSONGetPathById,
  JSONMoveDownById,
  JSONMoveUpById,
  JSONPipeIn,
  JSONPipeOut,
  JSONUpdate
} from '../util';
import type {JSONSchema, Schema} from 'amis';
import {toast, resolveVariable} from 'amis';
import find from 'lodash/find';
import {InsertSubRendererPanel} from '../component/Panel/InsertSubRendererPanel';
import {AvailableRenderersPanel} from '../component/Panel/AvailableRenderersPanel';
import isPlainObject from 'lodash/isPlainObject';
import {EditorManagerConfig} from '../manager';
import {EditorNode, EditorNodeType} from './node';
import findIndex from 'lodash/findIndex';
import {matchSorter} from 'match-sorter';
import debounce from 'lodash/debounce';
import type {DialogSchema} from 'amis/lib/renderers/Dialog';
import type {DrawerSchema} from 'amis/lib/renderers/Drawer';
import getLayoutInstance from '../layout';
import {isAlive} from 'mobx-state-tree';
import {modalsToDefinitions} from '../util';

export interface SchemaHistory {
  versionId: number;
  schema: any;
}

export type SubEditorContext = {
  title: string;
  value: any;
  onChange?: (value: any, diff: any) => void;
  slot?: any;
  data?: any;
  validate?: (value: any) => void | string | Promise<void | string>;

  // 当 definitions 变化的时候，会触发这个回调
  onDefinitionsChange?: (
    definitions: any,
    originDefinitions: any,
    value: any
  ) => any;
  canUndo?: boolean;
  canRedo?: boolean;

  // 自己类型是否可变动。
  typeMutable?: boolean;
  memberImmutable?: boolean | Array<string>;
  props?: any;
  /* 宿主节点的Store */
  hostNode?: EditorNodeType;
};

export type PatchItem =
  | {
      op: 'update' | 'replace';
      target: string;
      value: any;
    }
  | {
      op: 'delete';
      target: string;
    }
  | {
      op: 'push';
      target: string;
      key: string;
      value: any;
    }
  | {
      op: 'splice';
      target: string;
      key: string;
      args: Array<any>;
    };

export interface ScaffoldFormContext extends ScaffoldForm {
  value: any;
  callback: (value: any) => void;
}

export interface PopOverFormContext extends PopOverForm {
  target: () => HTMLElement;
  value: any;
  callback: (value: any, diff: any) => void;
  node?: EditorNodeType;
}

export interface ModalFormContext extends PopOverForm {
  mode?: 'dialog' | 'drawer';
  size?: string;
  postion?: string;
  value: any;
  callback: (value: any, diff: any) => void;
}

/**
 * 搜集的 name 信息
 */
export interface TargetName {
  type: string;
  name: string;
  editorId: string;
}

export type EditorModalBody = (DialogSchema | DrawerSchema) & {
  // 节点 ID
  $$id?: string;
  // 如果是公共弹窗，在 definitions 中的 key
  $$ref?: string;

  // 内嵌弹窗会转成公共弹窗下发给子弹窗，否则子弹窗里面无法选择
  // 这类会在 definition 里面标记原始位置
  $$originId?: string;

  // 弹出方式
  actionType?: string;
};

export const MainStore = types
  .model('EditorRoot', {
    ready: false, // 异步组件加载前不可用
    isMobile: false,
    isSubEditor: false,
    // 用于自定义爱速搭中的 amis 文档路径
    amisDocHost: types.optional(types.string, 'https://baidu.gitee.io'),
    root: types.optional(EditorNode, {
      id: 'root',
      label: 'Root'
    }),
    theme: 'cxd', // 主题，默认cxd主题
    toolbarMode: 'default', // 工具栏模式，默认default，mini模式没有更多、前后插入组件、上下文数据、重复一份、合成一行、右键功能
    noDialog: false, // 不需要弹框功能
    hoverId: '',
    hoverRegion: '',
    activeId: '',
    activeRegion: '', // 记录当前激活的子区域
    activeElement: '', // 记录当前编辑的内联元素

    // 点选多个的时候用来记录， 单选单个的时候还是 activeId
    selections: types.optional(types.frozen<Array<string>>(), []),

    // 当右键的时候，记录当前点选的哪个。
    contextId: '',

    // 拖拽相关
    dragMode: 'move' as 'move' | 'copy',
    dragId: '', // 拖动的组件id
    dragType: '',
    dragSchema: types.frozen(),

    dropId: '', // 放置的组件id
    dropRegion: '',

    // 欲拖拽区域
    planDropId: '',
    planDropRegion: '',

    insertId: '',
    insertRegion: '',
    insertRenderers: types.optional(types.frozen<Array<SubRendererInfo>>(), []),
    insertRenderersKeywords: '',
    insertTag: '全部',
    insertSelected: '',
    insertMode: 'insert' as 'insert' | 'replace', //
    insertOrigId: '',
    insertBeforeId: '',

    showInsertRenderer: false, // 是否显示插入组件面板（抽屉弹出模式）

    schema: types.frozen(),
    versionId: 0,
    schemaHistory: types.optional(
      types.array(types.frozen<SchemaHistory>()),
      []
    ),

    toolbars: types.optional(types.frozen<Array<ToolbarItem>>(), []),
    panels: types.optional(types.frozen<Array<PanelItem>>(), []),

    showCustomRenderersPanel: false, // 是否显示自定义组件面板，默认不显示
    renderersTabsKey: 'base-renderers', // 组件面板tabs，默认显示「基础组件」，custom 则显示「自定义组件」
    outlineTabsKey: 'component-outline', // 视图结构tabs，默认显示「组件大纲」，dialog 则显示「弹窗大纲」
    // 存放预置组件和自定义组件
    subRenderers: types.optional(types.frozen<Array<SubRendererInfo>>(), []),
    subRenderersKeywords: '', // 基础组件的查询关键字
    subRenderersTag: '', // 基础组件的当前展示分类
    subRendererRegion: '', // 预置组件的查询容器元素【当前未使用】

    customRenderersKeywords: '', // 自定义组件的查询关键字
    customRenderersTag: '', // 自定义组件的当前展示分类

    panelKey: '',
    leftPanelKey: '',
    leftPanelOpenStatus: true, // 左侧面板展开状态，默认展示

    jsonSchemaUri: '',

    scaffoldForm: types.maybe(types.frozen<ScaffoldFormContext>()),
    scaffoldFormStep: 0,
    /** 脚手架是否进行过下一步 */
    scaffoldStepManipulated: false,
    scaffoldFormBuzy: false,
    scaffoldError: '',

    popOverForm: types.maybe(types.frozen<PopOverFormContext>()),

    // 弹出层表单
    modalForm: types.maybe(types.frozen<ModalFormContext>()),
    modalMode: '',
    modalFormBuzy: false,
    modalFormError: '',

    // 弹出子编辑器相关的信息
    subEditorContext: types.maybe(types.frozen<SubEditorContext>()),
    // 子编辑器中可能需要拿到父编辑器的数据
    superEditorData: types.maybe(types.frozen()),

    calculateStarted: false,

    // 自动收集可以供 target/reload 使用的名称列表
    targetNames: types.optional(types.array(types.frozen<TargetName>()), []),

    ctx: types.frozen(),
    /** 是否开启应用多语言 */
    i18nEnabled: types.optional(types.boolean, false),
    /** 应用语言 */
    appLocale: types.optional(types.string, 'zh-CN'),
    /** 应用语料 */
    appCorpusData: types.optional(types.frozen(), {}),
    /** 应用多语言状态，用于其它组件进行订阅 */
    appLocaleState: types.optional(types.number, 0),
    /** 全局广播事件 */
    globalEvents: types.optional(types.frozen<Array<IGlobalEvent>>(), []),

    /** 全局变量 */
    globalVariables: types.optional(
      types.frozen<Array<GlobalVariableItem & {id: string | number}>>(),
      []
    )
    // types.optional(
    //   types.array(types.frozen<GlobalVariableItem & {id: string | number}>()),
    //   []
    // )
  })
  .views(self => {
    return {
      // 给编辑状态时的
      get filteredSchema() {
        let schema = self.schema;
        return filterSchemaForEditor(
          getEnv(self).schemaFilter?.(schema) ?? schema
        );
      },

      // 给预览状态时的
      get filteredSchemaForPreview() {
        const schema = JSONPipeOut(self.schema);
        return getEnv(self).schemaFilter?.(schema, true) ?? schema;
      },

      // 判断当前元素是否是根节点
      isRootSchema(id: string) {
        const curSchema = this.getSchema();
        if (curSchema && curSchema.$$id === id) {
          return true;
        }
        return false;
      },

      get rootId() {
        return this.getRootId();
      },

      getRootId() {
        const curSchema = this.getSchema();
        return curSchema?.$$id;
      },

      isHoved(id: string) {
        return id && self.hoverId === id;
      },

      isActive(id: string) {
        return (
          id &&
          !this.dragging &&
          !self.insertOrigId &&
          self.insertBeforeId !== id &&
          self.activeId === id
        );
      },

      isContextOn(id: string) {
        return id && self.contextId === id;
      },

      get activeContainerId() {
        if (!self.activeId) {
          return '';
        }

        let node: EditorNodeType = this.getNodeById(self.activeId) as any;

        while (node) {
          if (node.childRegions.length || node.info?.regions) {
            return node.id;
          }

          node = node.host;
        }

        return '';
      },

      isRegionHighlighted(id: string, region: string) {
        return (
          (!self.insertOrigId &&
            id === self.hoverId &&
            region === self.hoverRegion) ||
          (id === self.activeId && self.activeRegion === region) ||
          (id === self.dropId && self.dropRegion === region) ||
          (!self.insertOrigId &&
            id === self.insertId &&
            self.insertRegion === region)
        );
      },

      isRegionActive(id: string, region: string): boolean {
        return (
          this.isActive(id) ||
          id === self.dropId ||
          id === self.planDropId || // 欲拖拽区域
          this.isRegionHighlighted(id, region)
        );
      },

      isRegionDragEnter(id: string, region: string) {
        return this.isRegionActive(id, region) && region === self.dropRegion;
      },

      get highlightNodes() {
        const nodes: Array<string> = [];

        if (
          self.hoverId &&
          !self.dragId &&
          !self.contextId &&
          (self.activeId !== self.hoverId || self.hoverRegion) &&
          !self.selections.includes(self.hoverId)
        ) {
          nodes.push(self.hoverId);
        }

        if (self.contextId) {
          nodes.push(self.contextId);
        }

        if (
          (self.activeId || self.selections.length) &&
          (!self.dragId || this.draggableContainer(self.dragId)) &&
          !self.insertOrigId &&
          !self.insertId &&
          !(self.hoverId && self.hoverRegion)
        ) {
          self.activeId
            ? nodes.push(self.activeId)
            : nodes.push.apply(nodes, self.selections);
        }

        // 判断父元素是否为自由容器元素
        const curFreeContainerId = this.parentIsFreeContainer(self.activeId);
        if (curFreeContainerId) {
          nodes.push(curFreeContainerId);
        }

        if (self.insertMode === 'insert' && self.insertId) {
          nodes.push(self.insertId);
        }

        self.insertOrigId && nodes.push(self.insertOrigId);
        self.dropId && nodes.push(self.dropId);
        self.planDropId && nodes.push(self.planDropId);
        self.insertBeforeId && nodes.push(self.insertBeforeId);

        return nodes
          .filter((id, index, thelist) => id && index === thelist.indexOf(id))
          .map(id => this.getNodeById(id)!)
          .filter(node => node);
      },

      getNodeById(
        id: string,
        regionOrType?: string
      ): EditorNodeType | undefined {
        return self.root.getNodeById(id, regionOrType);
      },
      getNodeByComponentId(id: string): EditorNodeType | undefined {
        return self.root.getNodeByComponentId(id);
      },

      get activeNodeInfo(): RendererInfo | null | undefined {
        return this.getNodeById(self.activeId)?.info;
      },

      getSchema(id?: string, idKey?: string) {
        return id ? JSONGetById(self.schema, id, idKey) : self.schema;
      },

      getSchemaByPath(path: Array<string>) {
        return JSONGetByPath(self.schema, path);
      },

      getSchemaParentById(id: string, skipArray: boolean = false) {
        return JSONGetParentById(self.schema, id, skipArray);
      },

      getSchemaPath(id: string): string {
        const paths = JSONGetPathById(self.schema, id);
        return Array.isArray(paths) ? paths.join('/') : '';
      },

      // 用于剔除多余的字段
      getSimpleSchema(curSchema: any) {
        return JSONPipeOut(curSchema);
      },

      getPanelKey() {
        let panelKey = self.panelKey;

        if (panelKey === 'none') {
          return panelKey;
        }

        const panels = this.getPanels();
        const isIn = find(panels, panel => panelKey && panel.key === panelKey);

        if (!isIn) {
          return panels[0]?.key || 'none';
        }

        return panelKey;
      },

      getLeftPanelKey() {
        let leftPanelKey = self.leftPanelKey;
        if (this.dragging) {
          return 'outline';
        } else if (leftPanelKey === 'none') {
          return leftPanelKey;
        }
        const panels = this.getLeftPanels();
        const isIn = find(
          panels,
          panel => leftPanelKey && panel.key === leftPanelKey
        );

        if (!isIn) {
          return 'renderers'; // 默认展开左侧组件面板，此前默认是 outline
        }
        return leftPanelKey;
      },

      get leftPanels() {
        return self.panels.filter(panel => panel.position === 'left');
      },

      get rightPanels() {
        // contextmenu面板改成自定义面板
        return self.panels.filter(
          panel => panel.position !== 'left' && panel.key !== 'contextmenu'
        );
      },

      get contextMenuPanel() {
        // contextmenu面板改成自定义面板
        return self.panels.find(panel => panel.key === 'contextmenu');
      },

      getPanels(): Array<PanelItem> {
        const panels: Array<PanelItem> = [].concat(
          (this.rightPanels as any) || []
        );
        return panels.sort((a, b) => a.order - b.order);
      },

      getLeftPanels(): Array<PanelItem> {
        const panels: Array<PanelItem> = [].concat(
          (this.leftPanels as any) || []
        );

        if (self.insertId && self.insertRegion) {
          panels.push({
            key: 'insert',
            icon: 'fa fa-bolt',
            position: 'left',
            title: self.insertMode === 'replace' ? '变更' : '插入',
            component: InsertSubRendererPanel,
            order: 9999
          });
        }

        // 新增插入组件面板（抽屉弹出式）
        panels.push({
          key: 'insertRenderer',
          icon: 'fa fa-bolt',
          position: 'left',
          title: '插入组件面板',
          component: AvailableRenderersPanel,
          order: 9999
        });

        return panels.sort((a, b) => a.order - b.order);
      },

      get sortedToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(
            toolbar =>
              toolbar.level !== 'secondary' && toolbar.level !== 'special'
          )
          .sort((a, b) => a.order - b.order);
      },

      get sortedSecondaryToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(toolbar => toolbar.level === 'secondary')
          .sort((a, b) => a.order - b.order);
      },

      get sortedSpecialToolbars(): Array<ToolbarItem> {
        return self.toolbars
          .filter(toolbar => toolbar.level === 'special')
          .sort((a, b) => a.order - b.order);
      },

      get value() {
        if (!self.activeId) {
          return undefined;
        }

        return this.getValueOf(self.activeId);
      },

      getValueOf(id: string) {
        const schema = JSONGetById(self.schema, id);
        const data = JSONPipeOut(schema, false);
        return data;
      },

      get valueWithoutHiddenProps() {
        if (!self.activeId) {
          return undefined;
        }

        const isSubEditor = self.isSubEditor;
        const isHiddenProps = getEnv(self).isHiddenProps;

        return JSONPipeOut(
          JSONGetById(self.schema, self.activeId),
          (key, props) => {
            if (isSubEditor && key === 'definitions') {
              return true;
            }

            if (typeof isHiddenProps === 'function') {
              return isHiddenProps(key, props);
            }

            return (
              (key.substring(0, 2) === '$$' &&
                key !== '$$comments' &&
                key !== '$$commonSchema' &&
                key !== '$$formSchema') ||
              typeof props === 'function' || // pipeIn 和 pipeOut
              key.substring(0, 2) === '__'
            );
          }
        );
      },

      get outline() {
        return self.root.children;
      },

      get bcn() {
        let bcn: Array<EditorNodeType> = [];

        if (self.activeId) {
          findTree(
            self.root.children,
            (item: EditorNodeType, index: number, leve, paths: any[]) => {
              if (item.id === self.activeId) {
                bcn = paths.concat(item);
                return true;
              }
              return false;
            }
          );
        }

        return bcn.filter(item => !item.isSecondFactor);
      },

      get activePath(): Array<EditorNodeType> {
        return this.getNodePathById(self.activeId);
      },

      getNodePathById(id: string) {
        let paths: Array<EditorNodeType> = [];
        if (!id) {
          return paths;
        }

        let iterator = (
          list: Array<EditorNodeType>,
          parents: Array<EditorNodeType> = []
        ): boolean => {
          return list.every(node => {
            if (node.id === id) {
              paths = parents.concat(node);
              return false;
            } else if (node.children && node.children.length) {
              return iterator(node.children, parents.concat(node));
            }

            return true;
          });
        };

        iterator(self.root.children);

        return paths;
      },

      get dragging() {
        if (this.draggableContainer(self.dragId)) {
          return false;
        }
        return !!(self.dragId || self.dropId);
      },

      get needPatch() {
        let hasUnPatched = (list: Array<EditorNodeType>): boolean => {
          return list.some(node => {
            if (!node.patched && !node.isRegion) {
              return true;
            } else if (node.uniqueChildren.length) {
              return hasUnPatched(node.uniqueChildren);
            }

            return false;
          });
        };

        return hasUnPatched(self.root.children);
      },

      get schemaRaw() {
        return JSONPipeOut(self.schema);
      },

      /** 获取平台预置组件（基础组件）
       * 备注：disabledRendererPlugin 为 true 则不在面板中展示
       */
      get subRenderersByOrder() {
        return self.subRenderers
          .filter(renderer =>
            !renderer.disabledRendererPlugin && self.showCustomRenderersPanel
              ? renderer.isBaseComponent
              : true
          )
          .sort((a, b) => a.order - b.order);
      },

      /** 获取自定义组件
       * 备注：disabledRendererPlugin 为 true 则不在面板中展示
       */
      get customRenderersByOrder() {
        return self.subRenderers
          .filter(
            renderer =>
              !renderer.disabledRendererPlugin && !renderer.isBaseComponent
          )
          .sort((a, b) => a.order - b.order);
      },

      /** 根据关键字过滤组件 */
      groupedRenderersByKeyword(
        _subRenderers: Array<SubRendererInfo>,
        keywords: string = ''
      ) {
        const subRenderers = _subRenderers;
        const grouped: {
          [propName: string]: Array<SubRendererInfo>;
        } = {};

        const searchMap = new Map<string, any>();
        matchSorter(subRenderers, keywords, {
          keys: ['name', 'description', 'scaffold.type', 'searchKeywords']
        }).forEach(item => {
          searchMap.set(item.id, item);
        });

        subRenderers.forEach(item => {
          if (searchMap.has(item.id)) {
            const tags = Array.isArray(item.tags)
              ? item.tags.concat()
              : item.tags
              ? [item.tags]
              : ['其他'];

            tags.forEach(tag => {
              grouped[tag] = grouped[tag] || [];
              grouped[tag].push(item);
            });
          }
        });

        return grouped;
      },

      /** 根据关键字过滤预置组件
       * 备注：组件搜索中需要
       */
      groupedSubRenderersByKeyword(
        _subRenderers?: Array<SubRendererInfo>,
        keywords?: string
      ) {
        // 获取预置组件
        const subRenderers: Array<SubRendererInfo> =
          _subRenderers || this.subRenderersByOrder;
        return this.groupedRenderersByKeyword(subRenderers, keywords);
      },

      /**
       * 根据当前分类和关键字获取预置组件
       * 备注：组件面板展示需要
       */
      get groupedSubRenderers() {
        if (self.subRenderersTag) {
          // 根据tag分类获取组件列表
          const grouped: {
            [propName: string]: Array<SubRendererInfo>;
          } = {};
          const groupedSubRenderers = this.groupedSubRenderersByKeyword();
          const curTagSubRenderers = groupedSubRenderers[self.subRenderersTag];
          if (curTagSubRenderers) {
            grouped[self.subRenderersTag] = curTagSubRenderers;
          }
          return grouped;
        } else {
          // 根据关键字获取组件列表
          return this.groupedSubRenderersByKeyword(
            this.subRenderersByOrder,
            self.subRenderersKeywords
          );
        }
      },

      /** 根据关键字过滤自定义组件 */
      groupedCustomRenderersByKeyword(
        _subRenderers?: Array<SubRendererInfo>,
        keywords?: string
      ) {
        // 获取预置组件
        const subRenderers: Array<SubRendererInfo> =
          _subRenderers || this.customRenderersByOrder;
        return this.groupedRenderersByKeyword(subRenderers, keywords);
      },

      /**
       * 根据当前分类和关键字获取自定义组件
       */
      get groupedCustomRenderers() {
        if (self.customRenderersTag) {
          // 根据tag分类获取组件列表
          const grouped: {
            [propName: string]: Array<SubRendererInfo>;
          } = {};
          const groupedCustomRenderers = this.groupedCustomRenderersByKeyword();
          const curTagCustomRenderers =
            groupedCustomRenderers[self.customRenderersTag];
          if (curTagCustomRenderers) {
            grouped[self.customRenderersTag] = curTagCustomRenderers;
          }
          return grouped;
        } else {
          // 根据关键字获取组件列表
          return this.groupedCustomRenderersByKeyword(
            this.customRenderersByOrder,
            self.customRenderersKeywords
          );
        }
      },

      getSubRendererById(id: string) {
        return find(self.subRenderers || [], (item: any) => item.id === id);
      },

      get groupedInsertRenderers() {
        const grouped: {
          [propName: string]: Array<SubRendererInfo>;
        } = {
          ['全部']: []
        };
        const keywords = self.insertRenderersKeywords;
        const r = new RegExp(stringRegExp(keywords), 'i');

        self.insertRenderers
          .concat()
          .sort((a, b) => a.order - b.order)
          .forEach(item => {
            if (
              !keywords ||
              ['name', 'description', 'scaffold.type'].some(
                key =>
                  resolveVariable(key, item) &&
                  r.test(resolveVariable(key, item))
              )
            ) {
              const tags = Array.isArray(item.tags)
                ? item.tags.concat()
                : item.tags
                ? [item.tags]
                : ['其他'];

              tags.forEach(tag => {
                grouped[tag] = grouped[tag] || [];
                grouped[tag].push(item);
              });

              grouped['全部'].push(item);
            }
          });

        return grouped;
      },

      get selectedInsertRendererInfo() {
        return find(
          self.insertRenderers,
          item => item.id === self.insertSelected
        );
      },

      get subEditorSlotPath() {
        const slot = self.subEditorContext?.slot;

        if (!slot) {
          return '';
        }

        let paths: Array<string> = [];
        let resolve = (
          value: any,
          prefixPaths: Array<string> = []
        ): boolean => {
          if (
            Array.isArray(value) &&
            value.some((value, index) =>
              resolve(value, prefixPaths.concat(`${index}`))
            )
          ) {
            return true;
          } else if (isPlainObject(value)) {
            return Object.keys(value).some(key => {
              return resolve(value[key], prefixPaths.concat(key));
            });
          } else if (value === '$$') {
            paths = prefixPaths.concat();
            return true;
          }

          return false;
        };

        resolve(slot);

        return paths.length ? paths.join('/') : '';
      },

      get subEditorValue() {
        if (self.subEditorContext) {
          return self.subEditorContext.value;
        }

        return undefined;
      },

      get canUndo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        return idx !== 0;
      },

      get canRedo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        return idx < self.schemaHistory.length - 1;
      },
      // 判断当前元素定位是否为flex容器
      isFlexContainer(id: string) {
        const activeId = id ?? self.activeId;
        const curSchema = this.getSchema(activeId);
        if (
          curSchema?.style?.display === 'flex' ||
          curSchema?.style?.display === 'inline-flex'
        ) {
          return true;
        }
        return false;
      },
      // 判断是否是布局容器中的列级元素
      isFlexItem(id: string) {
        const activeId = id ?? self.activeId;
        const parentSchema = this.getSchemaParentById(activeId, true);
        if (
          parentSchema?.type === 'flex' ||
          parentSchema?.style?.display === 'flex' ||
          parentSchema?.style?.display === 'inline-flex'
        ) {
          return true;
        }
        return false;
      },
      // 判断父级布局容器是否为垂直排列
      isFlexColumnItem(id: string) {
        const activeId = id ?? self.activeId;
        const parentSchema = this.getSchemaParentById(activeId, true);
        const isFlexItem =
          parentSchema?.type === 'flex' ||
          parentSchema?.style?.display === 'flex' ||
          parentSchema?.style?.display === 'inline-flex';
        const isFlexColumn =
          parentSchema?.direction === 'column' ||
          parentSchema?.direction === 'column-reverse' ||
          parentSchema?.style?.flexDirection === 'column' ||
          parentSchema?.style?.flexDirection === 'column-reverse';
        if (isFlexItem && isFlexColumn) {
          return true;
        }
        return false;
      },
      // 判断是否可拖拽容器元素
      draggableContainer(id?: string) {
        const activeId = id || self.activeId;
        const curSchema = this.getSchema(activeId);
        const curSchemaStyle = curSchema?.style || {};
        if (
          curSchemaStyle?.position === 'fixed' ||
          curSchemaStyle?.position === 'absolute'
        ) {
          return true;
        }
        return false;
      },
      // 判断父元素是否为自由容器元素，如果父级元素是自由容器则返回父元素ID
      parentIsFreeContainer(id?: string) {
        const activeId = id ?? self.activeId;
        const curNode = this.getNodeById(activeId)!;
        const parentNode = curNode?.parent;
        if (!parentNode) {
          return false;
        }
        const curSchema = this.getSchema(parentNode.id);
        if (curSchema?.isFreeContainer) {
          return parentNode.id;
        }
        return false;
      },
      get getSuperEditorData() {
        return self.superEditorData || {};
      },
      // 获取组件选择树
      getComponentTreeSource() {
        return mapTree(
          self.root.children ?? [],
          (item: any) => {
            const schema = item.id
              ? JSONGetById(self.schema, item.id)
              : self.schema;
            let cmptLabel = '';
            const itemLabel = appTranslate(item?.label);
            const schemaLabel = appTranslate(schema?.label);
            const schemaTitle = appTranslate(schema?.title);
            if (item?.region) {
              cmptLabel = itemLabel;
            } else {
              const labelPrefix =
                item.type !== 'cell' ? `<${itemLabel}>` : `<列>`;
              cmptLabel = `${labelPrefix}${
                schemaLabel ?? schemaTitle ?? itemLabel
              }`;
            }
            cmptLabel = cmptLabel ?? itemLabel;
            return {
              id: item.id,
              label: cmptLabel,
              value: schema?.id ?? item.id,
              type: schema?.type ?? item.type,
              schema,
              disabled: !!item.region,
              visible: item.region ? !!item?.children.length : true,
              children: item?.children
            };
          },
          1,
          true
        );
      },

      get scaffoldData() {
        return createObject(self.ctx, {
          ...(self.scaffoldForm?.value || {}),
          __step: self.scaffoldFormStep
        });
      },

      // 获取弹窗大纲列表
      get modals(): Array<EditorModalBody> {
        const schema = self.schema;
        const modals: Array<DialogSchema | DrawerSchema> = getModals(schema);

        return modals;
      },

      get modalOptions() {
        return this.modals.map((modal: EditorModalBody) => {
          return {
            label: `${
              modal.editorSetting?.displayName || modal.title || '未命名弹窗'
            }`,
            tip:
              modal.actionType === 'confirmDialog'
                ? '确认框'
                : modal.type === 'drawer'
                ? '抽屉弹窗'
                : '弹窗',
            value: modal.$$id,
            $$ref: modal.$$ref
          };
        });
      }
    };
  })
  .actions(self => {
    const config: EditorManagerConfig = getEnv(self);
    let versionIdIndex = 0;
    let subEditor: any = null;
    let layer: HTMLElement | undefined = undefined;
    let scale: number = 1;
    let doc: Document = document;
    let iframe: HTMLIFrameElement | undefined = undefined;

    const lazyUpdateTargetName = debounce(
      () => (self as any).updateTargetName(),
      250,
      {
        leading: false,
        trailing: true
      }
    );

    const observer = new ResizeObserver(entries => {
      if (!isAlive(self)) {
        return;
      }

      (self as any).calculateHighlightBox([]);
      for (let entry of entries) {
        const target = entry.target as HTMLElement;
        const id =
          target.getAttribute('data-editor-id') ||
          target.getAttribute('data-region-host');

        if (id) {
          const node = self.getNodeById(id);
          node?.calculateHighlightBox();
        }
      }
    });

    return {
      markReady() {
        self.ready = true;
      },
      setLayer(value: any) {
        layer = value;
      },
      getLayer() {
        return layer;
      },
      // iframe 缩放比例
      setScale(num: number) {
        scale = num;
      },
      getScale() {
        return scale;
      },
      setDoc(value: any) {
        doc = value;
      },
      getDoc() {
        return doc;
      },
      setIframe(value: any) {
        iframe = value;
      },
      getIframe() {
        return iframe;
      },

      setIsMobile(value?: boolean) {
        self.isMobile = !!value;
      },

      setCtx(value: any) {
        if (value?.__super) {
          // context 不支持链式，如果这样下发了，需要转成普通对象。
          // 目前平台会下发这种数据，为了防止数据丢失做个处理
          value = extractObjectChain(value).reduce(
            (obj, item) => Object.assign(obj, item),
            {}
          );
        }

        self.ctx = value;
      },

      setTheme(value: string) {
        self.theme = value;
      },

      setIsSubEditor(isSubEditor: boolean) {
        self.isSubEditor = isSubEditor;
      },

      // 用于设置是否显示自定义组件面板
      setShowCustomRenderersPanel(_showCustomRenderersPanel: boolean) {
        self.showCustomRenderersPanel = _showCustomRenderersPanel;
      },

      setSchema(json: any) {
        const newSchema = JSONPipeIn(json || {});

        // schema 里面始终有个 $$id
        // 如果超过一个元素，说明不是个空配置了，就不要直接替换了。
        if (self.schema && Object.keys(self.schema).length > 1) {
          // 不直接替换，主要是为了不要重新生成 $$id 什么的。
          const changes = diff(
            self.schema,
            newSchema,
            (path, key) => key === '$$id'
          );

          const schema = patchDiff(self.schema, changes);

          // 有数组变动且是新增或者删除成员的时候
          // 这个时候通常不知道具体是哪个成员发生了变化
          // 所以让所有成员都重新生成 $$id
          if (
            changes?.[0]?.kind === 'A' &&
            (changes[0].item.kind === 'D' || changes[0].item.kind === 'N') &&
            Array.isArray(changes[0].path)
          ) {
            const path = changes[0].path;
            const last = path.pop();
            const host = path.reduce((schema, key) => {
              return schema[key];
            }, schema);
            host[last] = host[last].map((item: any) => {
              if (isPlainObject(host[last])) {
                return {
                  ...item,
                  $$id: guid()
                };
              }
              return item;
            });
          }

          self.schema = schema;
        } else {
          self.schema = newSchema;
        }

        this.resetHistory();
        lazyUpdateTargetName();
      },

      insertSchema(event: PluginEvent<InsertEventContext>) {
        const id = event.context.id;
        const region = event.context.region;

        const parent = JSONGetById(self.schema, id);

        if (!parent) {
          // 显然有错误。
          return;
        }
        const node = self.getNodeById(id, region);
        const LayoutInstance = getLayoutInstance(self.schema, node!);
        const {beforeInsert, afterInsert} = LayoutInstance;

        beforeInsert && (event.context = beforeInsert(event.context, self));

        const child = JSONPipeIn(event.context.data);

        if (parent?.isFreeContainer) {
          child.style = {
            position: 'absolute',
            inset: '10px auto auto 10px'
          };

          // 特殊元素，需要补上默认宽度
          if (needDefaultWidth(child.type)) {
            child.style.width = '300px';
          }
        }

        const arr = Array.isArray(parent[region])
          ? parent[region].concat()
          : parent[region]
          ? [parent[region]]
          : [];

        if (event.context.beforeId) {
          const idx = findIndex(
            arr,
            (item: any) => item?.$$id === event.context.beforeId
          );
          ~idx ? arr.splice(idx, 0, child) : arr.push(child);
        } else {
          arr.push(child);
        }

        event.context.data = child;
        event.context.regionList = arr;
        afterInsert && (event.context = afterInsert(event.context, self));

        this.traceableSetSchema(
          JSONUpdate(self.schema, id, {
            [region]: event.context.regionList
          })
        );

        child?.$$id &&
          setTimeout(() => {
            this.setActiveId(child.$$id);
          }, 0);

        return child;
      },

      moveSchema(event: PluginEvent<MoveEventContext>) {
        const context = event.context;
        let schema = self.schema;

        // 还是原来的位置。
        if (context.sourceId === context.beforeId) {
          return;
        }
        const region = context.region;

        const node = self.getNodeById(context.id, region);
        const LayoutInstance = getLayoutInstance(self.schema, node!);
        const {beforeMove, afterMove} = LayoutInstance;

        beforeMove && (event.context = beforeMove(event.context, self));

        const source = JSONGetById(schema, context.sourceId);
        schema = JSONDelete(schema, context.sourceId, undefined, true);

        const json = JSONGetById(schema, context.id);
        let origin = json[region];
        origin = Array.isArray(origin)
          ? origin.concat()
          : origin
          ? [origin]
          : [];

        if (context.beforeId) {
          let idx = findIndex(
            origin,
            (item: any) => item.$$id === context.beforeId
          );
          if (!~idx) {
            throw new Error('位置错误，目标位置没有找到');
          }
          origin.splice(idx, 0, source);
        } else {
          origin.push(source);
        }

        event.context.regionList = origin;
        afterMove && (event.context = afterMove(event.context, self));

        this.traceableSetSchema(
          JSONUpdate(schema, context.id, {
            [region]: event.context.regionList
          })
        );
      },

      setActiveId(
        id: string,
        region: string = '',
        selections: Array<string> = [],
        onEditorActive: boolean = true
      ) {
        const node = id ? self.getNodeById(id) : undefined;

        if (node?.clickable === false || (id && !node)) {
          return;
        }

        self.activeId = id;
        self.activeRegion = region;
        self.selections = selections;
        // if (!self.panelKey && id) {
        //   self.panelKey = 'config';
        // }
        const schema = self.getSchema(id);

        onEditorActive && (window as any).onEditorActive?.(schema);
      },

      setActiveIdByComponentId(id: string) {
        const node = self.getNodeByComponentId(id);
        if (node) {
          this.setActiveId(node.id, node.region, [], false);
          this.closeSubEditor();
        } else {
          const modals = self.modals;
          const modalSchema = find(modals, modal => modal.id === id);
          if (modalSchema) {
            this.openSubEditor({
              value: modalSchema,
              title: '弹窗预览',
              onChange: (value: any) => {}
            });
          } else {
            const subEditorRef = this.getSubEditorRef();
            if (subEditorRef) {
              subEditorRef.store.setActiveIdByComponentId(id);
              const $$id = subEditorRef.props.value.$$id;
              const modalSchema = find(modals, modal => modal.$$id === $$id);
              this.openSubEditor({
                value: modalSchema,
                title: '弹窗预览',
                onChange: (value: any) => {}
              });
            }
          }
        }
      },

      setActiveElement(selector: string) {
        self.activeElement = selector;
      },

      setSelections(ids: Array<string>) {
        self.activeId = '';
        self.activeRegion = '';
        self.selections = ids ? ids.concat() : [];
      },

      clearSelection() {
        self.selections = [];
      },

      setHoverId(id: string, region?: string) {
        const node = id ? self.getNodeById(id) : undefined;

        if (node?.clickable === false) {
          return;
        }

        self.hoverId = id;
        self.hoverRegion = region || '';
      },

      setInsertId(id: string) {
        self.insertId = id;
      },

      setContextId(id: string) {
        self.contextId = id;
      },

      setDragId(
        id: string,
        mode: 'move' | 'copy' = 'move',
        type: string = 'schema',
        schema?: any
      ) {
        self.dragId = id;
        self.dragMode = mode;
        self.dragType = type;
        self.dragSchema = schema || (id ? self.getSchema(id) : null);
      },

      setDropId(id: string, region: string = '') {
        self.dropId = id;
        self.dropRegion = region;
        self.planDropId = '';
        self.planDropRegion = '';
      },

      setPlanDropId(id: string, region: string) {
        self.planDropId = id;
        self.planDropRegion = region;
      },

      setActiveToolbars(activeToolbars: Array<ToolbarItem>) {
        self.toolbars = activeToolbars;
      },

      setPanels(panels: Array<PanelItem>) {
        self.panels = panels;
      },

      // 设置渲染器（包括预置组件和自定义组件）
      setSubRenderers(renderers: Array<SubRendererInfo>) {
        self.subRenderers = renderers;
      },

      changeSubRenderersKeywords(keywords: string) {
        self.subRenderersKeywords = keywords;
        self.subRenderersTag = '';
      },

      changeSubRenderersTag(tag: string) {
        self.subRenderersKeywords = '';
        self.subRenderersTag = tag;
      },

      resetSubRenderersKeywords() {
        self.subRenderersKeywords = '';
        self.subRenderersTag = '';
      },

      // 自定义组件面板
      changeCustomRenderersKeywords(keywords: string) {
        self.customRenderersKeywords = keywords;
        self.customRenderersTag = '';
      },

      // 自定义组件面板
      changeCustomRenderersTag(tag: string) {
        self.customRenderersKeywords = '';
        self.customRenderersTag = tag;
      },

      // 自定义组件面板
      resetCustomRenderersKeywords() {
        self.customRenderersKeywords = '';
        self.customRenderersTag = '';
      },

      changeSubRendererRegion(region: string) {
        self.subRendererRegion = region;
      },

      changePanelKey(key: string) {
        if (key !== self.getPanelKey()) {
          self.panelKey = key;
        }
      },

      changeLeftPanelKey(key: string) {
        if (key === 'insert' || self.panelKey === 'insert') {
          return;
        }

        if (key !== self.getLeftPanelKey()) {
          self.leftPanelKey = key;
        }
      },

      changeRenderersTabsKey(key: string) {
        if (key !== self.renderersTabsKey) {
          self.renderersTabsKey = key;
        }
      },

      changeOutlineTabsKey(key: string) {
        if (key !== self.outlineTabsKey) {
          self.outlineTabsKey = key;
        }
      },

      changeLeftPanelOpenStatus(isOpenStatus: boolean) {
        if (isOpenStatus !== self.leftPanelOpenStatus) {
          self.leftPanelOpenStatus = isOpenStatus;
        }
      },

      // 显示左侧组件面板（在属性面板中自动弹出组件面板）
      showRendererPanel(tag?: string, msg?: string) {
        if ('renderers' !== self.getLeftPanelKey()) {
          self.leftPanelKey = 'renderers';
        } else if (tag === self.subRenderersTag || !tag) {
          // toast一个小提示
          toast.info(msg || '请从左侧组件面板中点击添加新的元素。');
        }
        // 主动弹出组件面板时，优先展示「基础组件」
        self.renderersTabsKey = 'base-renderers';
        if (tag) {
          this.changeSubRenderersTag(tag);
        }
        this.changeLeftPanelOpenStatus(true);
      },

      changeValue(
        value: Schema,
        diff?: any,
        changeFilter?: (schema: any, value: any, id: string, diff?: any) => any,
        id = self.activeId
      ) {
        if (!id) {
          return;
        }
        this.changeValueById(
          id,
          value,
          diff,
          undefined,
          undefined,
          changeFilter
        );
      },

      definitionOnchangeValue(value: Schema, diff?: any) {
        this.changeValueById(self.getRootId(), value, diff);
      },

      changeValueById(
        id: string,
        value: Schema,
        diff?: any,
        replace?: boolean,
        noTrace?: boolean,
        changeFilter?: (schema: any, value: any, id: string, diff?: any) => any
      ) {
        const origin = JSONGetById(self.schema, id);

        if (!origin) {
          return;
        }

        // 通常 Panel 和 codeEditor 过来都有 diff 信息
        if (diff) {
          const result = patchDiff(origin, diff);
          let schema = JSONUpdate(self.schema, id, JSONPipeIn(result), true);
          schema = changeFilter?.(schema, value, id, diff) || schema;
          this.traceableSetSchema(schema, noTrace);
        } else {
          let schema = JSONUpdate(self.schema, id, JSONPipeIn(value), replace);
          schema = changeFilter?.(schema, value, id) || schema;
          this.traceableSetSchema(
            JSONUpdate(self.schema, id, JSONPipeIn(value), replace),
            noTrace
          );
        }
      },

      batchChangeValue(list: Array<{id: string; value: Schema}>) {
        this.traceableSetSchema(
          list.reduce((schema, item) => {
            return JSONUpdate(schema, item.id, JSONPipeIn(item.value), true);
          }, self.schema),
          true
        );
      },

      /**
       * 更新特殊布局元素的位置（fixed、absolute）
       */
      updateContainerStyleByDrag(dragId: string, dx: number, dy: number) {
        const curDragId = dragId || self.dragId;
        if (!curDragId) {
          return;
        }
        const curSchema = self.getSchema(curDragId);
        const curSchemaStyle = curSchema?.style || {};
        if (
          (curDragId && curSchemaStyle?.position === 'fixed') ||
          curSchemaStyle?.position === 'absolute'
        ) {
          let curInset = curSchemaStyle.inset || 'auto';

          const insetArr = curInset.split(' ');
          const inset = {
            top: insetArr[0] || 'auto',
            right: insetArr[1] || 'auto',
            bottom: insetArr[2] || insetArr[0] || 'auto',
            left: insetArr[3] || insetArr[1] || 'auto'
          };

          const newInset = `${
            inset.top !== 'auto' ? unitFormula(inset.top, dy) : 'auto'
          } ${
            inset.right !== 'auto' ? unitFormula(inset.right, -dx) : 'auto'
          } ${
            inset.bottom !== 'auto' ? unitFormula(inset.bottom, -dy) : 'auto'
          } ${inset.left !== 'auto' ? unitFormula(inset.left, dx) : 'auto'}`;

          this.changeValueById(curDragId, {
            ...curSchema,
            style: {
              ...curSchemaStyle,
              inset: newInset
            }
          });

          // 更新高亮位置
          this.calculateHighlightBox([curDragId]);
        }
      },

      moveUp(context: BaseEventContext) {
        const {sourceId, regionNode, region, id} = context;
        if (!sourceId) {
          return;
        }
        const schema = JSONMoveUpById(self.schema, sourceId);
        const LayoutInstance = getLayoutInstance(self.schema, regionNode);

        if (LayoutInstance.afterMoveUp) {
          const parent = JSONGetById(schema, id);
          let regionList = parent[region];
          context.regionList = regionList;
          context = LayoutInstance.afterMoveUp(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, id, {
              [region]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },
      moveDown(context: BaseEventContext) {
        const {sourceId, regionNode, region, id} = context;
        if (!sourceId) {
          return;
        }
        const schema = JSONMoveDownById(self.schema, sourceId);
        const LayoutInstance = getLayoutInstance(self.schema, regionNode);

        if (LayoutInstance.afterMoveDown) {
          const parent = JSONGetById(schema, id);
          let regionList = parent[region];
          context.regionList = regionList;
          context = LayoutInstance.afterMoveDown(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, id, {
              [region]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },

      del(context: DeleteEventContext) {
        const id = context.id;
        if (id === self.activeId) {
          const node = self.getNodeById(id);
          this.setActiveId(node?.parentId || '', node?.parentRegion);
        } else if (self.activeId) {
          const active = JSONGetById(self.schema, id);

          // 如果当前点选的是要删的节点里面的，则改成选中当前要删的上层
          if (JSONGetById(active, self.activeId)) {
            const node = self.getNodeById(id);
            this.setActiveId(node?.parentId || '', node?.parentRegion);
          }
        }

        const schema = JSONDelete(self.schema, id);

        const node = self.getNodeById(id);
        const LayoutInstance = getLayoutInstance(self.schema, node?.parent);

        if (LayoutInstance.afterDelete && node) {
          const parent = JSONGetById(schema, node.parentId);
          let regionList = parent[node.parentRegion];
          context.regionList = regionList;
          context = LayoutInstance.afterDelete(context, self);
          this.traceableSetSchema(
            JSONUpdate(schema, node.parentId, {
              [node.parentRegion]: context.regionList
            })
          );
        } else {
          this.traceableSetSchema(schema);
        }
      },

      delMulti(ids: Array<string>) {
        (Array.isArray(ids) ? ids : [ids]).forEach(id => {
          if (id === self.activeId) {
            const host = self.getNodeById(id)?.host;
            this.setActiveId(host ? host.id : '');
          } else if (self.activeId) {
            const active = JSONGetById(self.schema, id);

            // 如果当前点选的是要删的节点里面的，则改成选中当前要删的上层
            if (JSONGetById(active, self.activeId)) {
              const host = self.getNodeById(id)?.host;
              this.setActiveId(host ? host.id : '');
            }
          }
        });
        this.traceableSetSchema(
          ids.reduce((schema, id) => {
            return JSONDelete(schema, id);
          }, self.schema)
        );
      },

      duplicate(id: string | Array<string>) {
        this.traceableSetSchema(
          (Array.isArray(id) ? id : [id]).reduce((schema, id) => {
            return JSONDuplicate(schema, id);
          }, self.schema)
        );
      },

      emptyRegion(id: string, region: string) {
        this.traceableSetSchema(
          JSONUpdate(self.schema, id, {
            [region]: []
          })
        );
      },

      replaceChild(id: string, json: any) {
        this.traceableSetSchema(
          JSONUpdate(self.schema, id, JSONPipeIn(json), true)
        );
      },

      setInsertRegion(
        region: string,
        id: string = '',
        tag = '全部',
        mode: 'insert' | 'replace' = 'insert',
        originId: string = '',
        beforeId?: string
      ) {
        self.insertId = id;
        self.insertRegion = region;
        self.insertTag = tag;

        self.insertMode = mode;
        self.insertOrigId = originId;
        self.insertBeforeId = beforeId || '';
      },

      closeInsertPanel() {
        self.insertOrigId = '';
        self.insertId = '';
        self.insertRegion = '';
        self.insertSelected = '';
        self.insertRenderersKeywords = '';
        self.insertBeforeId = '';
      },

      // 显示插入组件面板（新版：复用组件物料选择面板）
      showInsertRendererPanel() {
        self.showInsertRenderer = true;
      },

      closeInsertRendererPanel() {
        self.showInsertRenderer = false;
      },

      setInsertRenderers(renderers: Array<SubRendererInfo>) {
        self.insertRenderers = renderers;
      },

      changeInsertRenderersKeywords(keywords: string) {
        self.insertRenderersKeywords = keywords;
      },

      resetInsertRenderersKeywords() {
        self.insertRenderersKeywords = '';
      },

      setInsertTag(tag: string) {
        self.insertTag = tag;
      },

      setInsertSelected(id: string) {
        self.insertSelected = id;
      },

      setJSONSchemaUri(schemaUri: string) {
        self.jsonSchemaUri = schemaUri;
      },

      addModal(modal?: DialogSchema | DrawerSchema, definitions?: any) {
        const [schema] = addModal(self.schema, modal, definitions);
        this.traceableSetSchema(schema);
      },

      /**
       * 计算具有指定ID的模态动作引用的数量
       *
       * @param id 模态动作的ID
       * @returns 返回模态动作引用的数量
       */
      countModalActionRefs(id: string) {
        let count = 0;
        const host = JSONGetParentById(self.schema, id);

        if (host?.actionType) {
          // 有 type 说明是旧的动作按钮，按钮本身就是某种动作，不需要再计算
          // 没有 type 说明是 onEvent 里面的动作，引用的数量也就是自己是 1
          return host.type ? 0 : 1;
        } else if (host !== self.schema.definitions) {
          return count;
        }

        const modalKey = Object.keys(host).find(key => host[key]?.$$id === id);
        JSONTraverse(self.schema, (value: any, key: string, host: any) => {
          if (
            key === 'actionType' &&
            ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
            host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref === modalKey
          ) {
            count++;
          }
          return value;
        });

        return count;
      },

      removeModal(id: string) {
        let schema = self.schema;
        const host = JSONGetParentById(schema, id);
        if (host === schema.definitions) {
          const modalKey = Object.keys(host).find(
            key => host[key]?.$$id === id
          );
          JSONTraverse(schema, (value: any, key: string, host: any) => {
            if (
              key === 'actionType' &&
              ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
              host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref === modalKey
            ) {
              schema = JSONDelete(schema, host.$$id);
            }
            return value;
          });
          schema = JSONDelete(schema, id);
        } else {
          schema = JSONDelete(schema, host.$$id);
        }
        this.traceableSetSchema(schema);
      },

      updateModal(
        id: string,
        modal: DialogSchema | DrawerSchema,
        definitions?: any
      ) {
        let schema = self.schema;
        const parent = JSONGetParentById(schema, id);

        if (!parent) {
          throw new Error('modal not found');
        }

        modal = JSONPipeIn(modal);
        if (definitions && isPlainObject(definitions)) {
          schema = mergeDefinitions(schema, definitions, modal);
        }

        const newHostKey =
          ((modal as any).actionType || modal.type) === 'drawer'
            ? 'drawer'
            : 'dialog';

        schema = JSONUpdate(schema, id, modal, true);

        // 如果编辑的是公共弹窗
        if (!parent.actionType) {
          const modalKey = Object.keys(parent).find(
            key => parent[key]?.$$id === id
          );

          // 所有引用的地方都要更新
          JSONTraverse(schema, (value: any, key: string, host: any) => {
            if (
              key === 'actionType' &&
              ['dialog', 'drawer', 'confirmDialog'].includes(value) &&
              host[value === 'drawer' ? 'drawer' : 'dialog']?.$ref ===
                modalKey &&
              newHostKey !== (value === 'drawer' ? 'drawer' : 'dialog')
            ) {
              schema = JSONUpdate(schema, host.$$id, {
                actionType: (modal as any).actionType || modal.type,
                args: undefined,
                dialog: undefined,
                drawer: undefined,
                [newHostKey]: host[value === 'drawer' ? 'drawer' : 'dialog']
              });
            }
            return value;
          });
        } else {
          // 内嵌弹窗只用改自己就行了
          schema = JSONUpdate(schema, parent.$$id, {
            actionType: (modal as any).actionType || modal.type,
            args: undefined,
            dialog: undefined,
            drawer: undefined,
            [newHostKey]: modal
          });
        }

        // 如果弹窗里面又弹窗指向自己，那么也要更新
        let refIds: string[] = [];
        JSONTraverse(modal, (value: any, key: string, host: any) => {
          if (key === '$ref' && host.$$originId === id) {
            refIds.push(host.$$id);
          }
        });
        if (refIds.length) {
          let refKey = '';
          [schema, refKey] = addModal(schema, modal);
          schema = JSONUpdate(schema, parent.$$id, {
            [newHostKey]: JSONPipeIn({
              $ref: refKey
            })
          });
          refIds.forEach(refId => {
            schema = JSONUpdate(schema, refId, {
              $ref: refKey,
              $$originId: undefined
            });
          });
        }

        this.traceableSetSchema(schema);

        // todo 更新弹出方式的配置
      },

      openSubEditor(context: SubEditorContext) {
        const activeId = self.activeId;

        if (!activeId) {
          return;
        }

        let subSchema = context.slot
          ? {
              ...mapObject(context.slot, function (value: any) {
                if (value === '$$') {
                  return context.value;
                }

                return value;
              }),
              isSlot: true
            }
          : context.value;

        if (!subSchema.definitions) {
          subSchema = {
            ...subSchema,
            definitions: modalsToDefinitions(self.modals)
          };
        }

        self.subEditorContext = {
          ...context,
          value: subSchema,
          hostNode: self.getNodeById(activeId),
          data: createObject(
            self.ctx,
            extendObject(context.data, {
              __curCmptTreeWrap: {
                label: context.title,
                disabled: true
              },
              __superCmptTreeSource: self.getComponentTreeSource()
            })
          )
        };
      },

      confirmSubEditor([valueRaw]: any) {
        const {onChange, slot, onDefinitionsChange} = self.subEditorContext!;
        let {definitions, ...value} = valueRaw.schema;
        let {definitions: originDefinitions, ...originValue} =
          valueRaw.__pristine?.schema || value;

        if (slot) {
          const slotPath = self.subEditorSlotPath;
          // const dotPath = slotPath.replace(/\//g, '.');
          // 上面的写法后续的代码都当成注释了，在 fis 项目里面，所以加个分组。
          const dotPath = slotPath.replace(/(?:\/)/g, '.');
          value = getVariable(value, dotPath);
          originValue = getVariable(originValue, dotPath);

          if (
            Array.isArray(value) &&
            value.length === 1 &&
            !Array.isArray(originValue)
          ) {
            value = value[0];
          }
        }

        const prevented =
          onDefinitionsChange?.(definitions, originDefinitions, value) ===
          false;

        onChange?.(
          value,
          onChange.length > 1 ? diff(originValue, value) : undefined
        );

        if (!prevented) {
          // merge definitions
          const patches = diff(
            originDefinitions,
            definitions,
            (path, key) => key === '$$id'
          );
          this.traceableSetSchema(
            JSONUpdate(self.schema, self.schema.$$id, {
              definitions: JSONPipeIn(patchDiff(originDefinitions, patches))
            }),
            true
          );
        }

        self.subEditorContext = undefined;
      },

      closeSubEditor() {
        self.subEditorContext = undefined;
      },

      subEditorOnChange() {
        if (!subEditor) {
          return;
        }

        self.subEditorContext = {
          ...self.subEditorContext!,
          canUndo: subEditor.canUndo(),
          canRedo: subEditor.canRedo()
        };
      },

      undoSubEditor() {
        if (!subEditor) {
          return;
        }
        subEditor.undo();
      },

      redoSubEditor() {
        if (!subEditor) {
          return;
        }

        subEditor.redo();
      },

      subEditorRef(ref: any) {
        subEditor = ref;
      },

      getSubEditorRef() {
        return subEditor;
      },

      openScaffoldForm(context: ScaffoldFormContext) {
        self.scaffoldForm = context;
        /** 打开前重置状态 */
        self.scaffoldStepManipulated = false;
      },

      closeScaffoldForm() {
        self.scaffoldForm = undefined;
      },

      setScaffoldBuzy(value: any) {
        self.scaffoldFormBuzy = !!value;
      },

      setScaffoldStep(value: number) {
        self.scaffoldFormStep = value;
      },

      setScaffoldStepManipulated(value: boolean) {
        self.scaffoldStepManipulated = value;
      },

      setScaffoldError(msg: string = '') {
        self.scaffoldError = msg;
      },

      updateScaffoldData(value: any, replace?: boolean) {
        if (self.scaffoldForm && value) {
          self.scaffoldForm = {
            ...self.scaffoldForm,
            value: replace
              ? value
              : {
                  ...self.scaffoldForm.value,
                  ...value
                }
          };
        }
      },

      openPopOverForm(context: PopOverFormContext) {
        self.popOverForm = context;
      },

      closePopOverForm() {
        self.popOverForm = undefined;
      },

      openModalForm(context: ModalFormContext) {
        self.modalForm = context;
        self.modalMode = context?.mode || self.modalMode;
        self.modalFormError = '';
      },

      closeModalForm() {
        self.modalForm = undefined;
      },

      markModalFormBuzy(value: any) {
        self.modalFormBuzy = !!value;
      },

      setModalFormError(msg: string = '') {
        self.modalFormError = msg;
      },

      activeHighlightNodes(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          const target = node?.getTarget();

          if (target) {
            (Array.isArray(target) ? target : [target]).forEach(target =>
              observer.observe(target)
            );
          }
        });
        setTimeout(() => {
          isAlive(self) && this.calculateHighlightBox(ids);
        }, 200);
      },

      deActiveHighlightNodes(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          const target = node?.getTarget();

          if (target) {
            (Array.isArray(target) ? target : [target]).forEach(target =>
              observer.unobserve(target)
            );
          }
        });
      },

      calculateHighlightBox(
        ids: Array<string> = self.highlightNodes.map(item => item.id)
      ) {
        self.calculateStarted = true;
        ids.forEach(id => {
          const node = self.getNodeById(id);
          node?.calculateHighlightBox(self);
        });
      },

      resetHighlightBox(ids: Array<string>) {
        ids.forEach(id => {
          const node = self.getNodeById(id);
          node?.resetHighlightBox(self);
        });
      },

      /**
       * 更新可供 target 及 reload 使用的名称列表
       */
      updateTargetName() {
        const targetNames: Array<TargetName> = [];
        JSONTraverse(self.schema, (value: any, key: string, host: any) => {
          if (
            key === 'name' &&
            value &&
            host &&
            (host.type === 'crud' ||
              host.type === 'form' ||
              host.type === 'page' ||
              host.type === 'service' ||
              host.type === 'chart' ||
              host.type === 'wizard')
          ) {
            targetNames.push({
              type: host.type,
              name: value,
              editorId: host.$$id
            });
          }
          return value;
        });
        self.targetNames = cast(targetNames);
      },

      traceableSetSchema(schema: any, noTrace?: boolean) {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        if (~idx) {
          self.schemaHistory.splice(
            idx + 1,
            self.schemaHistory.length - idx - 1
          );
        }
        if (noTrace) {
          self.schemaHistory.pop();
        }
        self.schemaHistory.push({
          versionId: (self.versionId = versionIdIndex++),
          schema: schema
        });
        self.schema = schema;
        lazyUpdateTargetName();
      },

      undo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );

        if (idx > 0) {
          const version = self.schemaHistory[idx - 1];
          self.versionId = version.versionId;
          self.schema = version.schema;
          lazyUpdateTargetName();
          this.autoSelectRoot();
        }
      },

      redo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );
        if (idx < self.schemaHistory.length - 1) {
          const version = self.schemaHistory[idx + 1];
          self.versionId = version.versionId;
          self.schema = version.schema;
          lazyUpdateTargetName();
          this.autoSelectRoot();
        }
      },

      autoSelectRoot() {
        // 撤销或重做后，可能当前选中的元素已在撤销中删除掉了，这时需要自动选中根节点
        const curElem = self.getSchema(self.activeId);
        if (!curElem) {
          this.setActiveId(self.getRootId());
        }
      },

      resetHistory() {
        versionIdIndex = 0;
        self.versionId = versionIdIndex++;
        self.schemaHistory.replace([
          {
            versionId: self.versionId,
            schema: self.schema
          }
        ]);
        this.autoSelectRoot();
      },

      /**
       * 原来 MiniEditor 里面的逻辑，目前是 pageEditor 中使用了
       */
      applyPatches(patches: Array<PatchItem>) {
        let json = self.schema;
        patches.forEach(item => {
          if (item.op === 'update') {
            json = JSONUpdate(json, item.target, item.value);
          } else if (item.op === 'replace') {
            json = JSONUpdate(json, item.target, item.value, true);
          } else if (item.op === 'delete') {
            json = JSONDelete(json, item.target);
          } else if (item.op === 'push') {
            let target = JSONGetById(json, item.target);
            let container = target[item.key];
            container = Array.isArray(container)
              ? container.concat()
              : container
              ? [container]
              : [];
            container.push(item.value);
            target = {
              ...target,
              [item.key]: container
            };
            json = JSONUpdate(json, item.target, target);
          } else if (item.op === 'splice') {
            let target = JSONGetById(json, item.target);
            let container = target[item.key];
            container = Array.isArray(container)
              ? container.concat()
              : container
              ? [container]
              : [];
            container.splice(...item.args);
            target = {
              ...target,
              [item.key]: container
            };
            json = JSONUpdate(json, item.target, target);
          }
        });
        this.traceableSetSchema(json);
      },

      /** 更改应用多语言的状态 */
      updateAppLocaleState() {
        self.appLocaleState += 1;
      },

      /** 设置应用语言，支持应用国际化 */
      setAppLocale(locale?: string) {
        if (!locale) {
          return;
        }
        self.appLocale = locale;
        this.updateAppLocaleState();
      },

      /** 设置应用的语料数据 */
      setAppCorpusData(data: any = {}) {
        self.appCorpusData = data;
        this.updateAppLocaleState();
      },

      setGlobalEvents(events: IGlobalEvent[]) {
        self.globalEvents = events;
      },

      setGlobalVariables(
        variables: Array<GlobalVariableItem & {id: string | number}>
      ) {
        self.globalVariables = variables;
      },

      beforeDestroy() {
        observer.disconnect();
        lazyUpdateTargetName.cancel();
      }
    };
  });

export type EditorStoreType = Instance<typeof MainStore>;
