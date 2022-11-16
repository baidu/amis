import {findTree, getVariable, mapObject, createObject} from 'amis-core';
import {cast, getEnv, Instance, types} from 'mobx-state-tree';
import {
  diff,
  filterSchemaForEditor,
  JSONDelete,
  JSONGetById,
  JSONTraverse,
  patchDiff,
  unitFormula,
  guid,
  reGenerateID
} from '../../src/util';
import {
  InsertEventContext,
  PluginEvent,
  RendererInfo,
  SubRendererInfo,
  ToolbarItem,
  PanelItem,
  MoveEventContext,
  ScaffoldForm,
  PopOverForm
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
import {Schema} from 'amis/lib/types';
import {toast, resolveVariable} from 'amis';
import find from 'lodash/find';
import {InsertSubRendererPanel} from '../component/Panel/InsertSubRendererPanel';
import {AvailableRenderersPanel} from '../component/Panel/AvailableRenderersPanel';
import isPlainObject from 'lodash/isPlainObject';
import {EditorManagerConfig} from '../manager';
import {EditorNode, EditorNodeType} from './node';
import findIndex from 'lodash/findIndex';

export interface SchemaHistory {
  versionId: number;
  schema: any;
}

export type SubEditorContext = {
  title: string;
  value: any;
  onChange: (value: any, diff: any) => void;
  slot?: any;
  data?: any;
  validate?: (value: any) => void | string | Promise<void | string>;
  canUndo?: boolean;
  canRedo?: boolean;

  // 自己类型是否可变动。
  typeMutable?: boolean;
  memberImmutable?: boolean | Array<string>;
  props?: any;
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
}

/**
 * 搜集的 name 信息
 */
export interface TargetName {
  type: string;
  name: string;
  editorId: string;
}

export const EditorStore = types
  .model('EditorRoot', {
    isMobile: false,
    isSubEditor: false,
    // 用于自定义爱速搭中的 amis 文档路径
    amisDocHost: types.optional(types.string, 'https://baidu.gitee.io'),
    root: types.optional(EditorNode, {
      id: 'root',
      label: 'Root'
    }),
    theme: 'cxd', // 主题，默认cxd主题
    hoverId: '',
    hoverRegion: '',
    activeId: '',
    activeRegion: '', // 记录当前激活的子区域
    mouseMoveRegion: '', // 记录当前鼠标hover到的区域，后续需要优化（合并MouseMoveRegion和hoverRegion）

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
    scaffoldFormBuzy: false,
    scaffoldError: '',

    popOverForm: types.maybe(types.frozen<PopOverFormContext>()),

    // 弹出子编辑器相关的信息
    subEditorContext: types.maybe(types.frozen<SubEditorContext>()),
    // 子编辑器中可能需要拿到父编辑器的数据
    superEditorData: types.maybe(types.frozen()),

    calculateStarted: false,

    // 自动收集可以供 target/reload 使用的名称列表
    targetNames: types.optional(types.array(types.frozen<TargetName>()), []),

    ctx: types.frozen()
  })
  .views(self => {
    return {
      // 给编辑状态时的
      get filteredSchema() {
        return filterSchemaForEditor(
          getEnv(self).schemaFilter?.(self.schema) ?? self.schema
        );
      },

      // 给预览状态时的
      get filteredSchemaForPreview() {
        const schema = JSONPipeOut(self.schema);
        return getEnv(self).schemaFilter?.(schema) ?? schema;
      },

      // 判断当前元素是否是根节点
      isRootSchema(id: string) {
        const curSchema = this.getSchema();
        if (curSchema && curSchema.$$id === id) {
          return true;
        }
        return false;
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

      isRegionHighlightHover(id: string, region: string) {
        return id === self.hoverId && region === self.mouseMoveRegion;
      },

      isRegionActive(id: string, region: string): boolean {
        return (
          this.isActive(id) ||
          id === self.dropId ||
          this.isRegionHighlighted(id, region) ||
          this.isRegionHighlightHover(id, region)
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

        if (self.insertMode === 'insert' && self.insertId) {
          nodes.push(self.insertId);
        }

        self.insertOrigId && nodes.push(self.insertOrigId);
        self.dropId && nodes.push(self.dropId);
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
        let pool = self.root.children.concat();

        while (pool.length) {
          const item = pool.shift();
          if (
            item.id === id &&
            (!regionOrType ||
              item.region === regionOrType ||
              item.type === regionOrType)
          ) {
            return item;
          }

          // 将当前节点的子节点全部放置到 pool中
          if (item.children.length) {
            pool.push.apply(pool, item.children);
          }
        }

        return undefined;
      },

      get activeNodeInfo(): RendererInfo | null | undefined {
        return this.getNodeById(self.activeId)?.info;
      },

      getSchema(id?: string, idKey?: string) {
        return id ? JSONGetById(self.schema, id, idKey) : self.schema;
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
        const schema = JSONPipeOut(curSchema);
        return getEnv(self).schemaFilter?.(schema) ?? schema;
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
        return JSONPipeOut(JSONGetById(self.schema, id), false);
      },

      get valueWithoutHiddenProps() {
        if (!self.activeId) {
          return undefined;
        }

        return JSONPipeOut(
          JSONGetById(self.schema, self.activeId),
          getEnv(self).isHiddenProps ||
            ((key, props) =>
              (key.substring(0, 2) === '$$' &&
                key !== '$$comments' &&
                key !== '$$commonSchema') ||
              typeof props === 'function' || // pipeIn 和 pipeOut
              key.substring(0, 2) === '__')
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
            } else if (node.children.length) {
              return hasUnPatched(node.children);
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
        keywords?: string
      ) {
        const subRenderers = _subRenderers;
        const grouped: {
          [propName: string]: Array<SubRendererInfo>;
        } = {};
        const regular = keywords ? new RegExp(keywords, 'i') : null;

        subRenderers.forEach(item => {
          if (
            !keywords ||
            ['name', 'description', 'scaffold.type', 'searchKeywords'].some(
              key =>
                resolveVariable(key, item) &&
                regular &&
                regular.test(resolveVariable(key, item))
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
          全部: []
        };
        const keywords = self.insertRenderersKeywords;
        const r = new RegExp(keywords, 'i');

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
          return self.subEditorContext.slot
            ? {
                ...mapObject(self.subEditorContext.slot, function (value: any) {
                  if (value === '$$') {
                    return self.subEditorContext!.value;
                  }

                  return value;
                }),
                isSlot: true
              }
            : self.subEditorContext.value;
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
      // 判断是否是布局容器中的列级元素
      isFlexItem(id: string) {
        const activeId = id || self.activeId;
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
        const activeId = id || self.activeId;
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
      get getSuperEditorData() {
        return self.superEditorData || {};
      }
    };
  })
  .actions(self => {
    const config: EditorManagerConfig = getEnv(self);
    let versionIdIndex = 0;
    let subEditor: any = null;
    let layer: HTMLElement | undefined = undefined;
    let doc: Document = document;
    let iframe: HTMLIFrameElement | undefined = undefined;

    return {
      setLayer(value: any) {
        layer = value;
      },
      getLayer() {
        return layer;
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

        if (self.schema) {
          // 不直接替换，主要是为了不要重新生成 $$id 什么的。
          const changes = diff(
            self.schema,
            newSchema,
            (path, key) => key === '$$id'
          );
          self.schema = patchDiff(self.schema, changes);
        } else {
          self.schema = newSchema;
        }

        this.resetHistory();
        this.updateTargetName();
      },

      insertSchema(event: PluginEvent<InsertEventContext>) {
        const id = event.context.id;
        const region = event.context.region;

        const parent = JSONGetById(self.schema, id);

        if (!parent) {
          // 显然有错误。
          return;
        }

        const child = JSONPipeIn(event.context.data);

        const arr = Array.isArray(parent[region])
          ? parent[region].concat()
          : parent[region]
          ? [parent[region]]
          : [];

        if (event.context.beforeId) {
          const idx = findIndex(
            arr,
            (item: any) => item.$$id === event.context.beforeId
          );
          ~idx ? arr.splice(idx, 0, child) : arr.push(child);
        } else {
          arr.push(child);
        }

        this.traceableSetSchema(
          JSONUpdate(self.schema, id, {
            [region]: arr
          })
        );

        event.context.data = child;
        return child;
      },

      moveSchema(event: PluginEvent<MoveEventContext>) {
        const context = event.context;
        let schema = self.schema;

        // 还是原来的位置。
        if (context.sourceId === context.beforeId) {
          return;
        }

        const source = JSONGetById(schema, context.sourceId);
        schema = JSONDelete(schema, context.sourceId, undefined, true);

        const region = context.region;

        const json = JSONGetById(schema, context.id);
        let origin = json[region];
        origin = Array.isArray(origin)
          ? origin.concat()
          : origin
          ? [origin]
          : [];

        if (context.beforeId) {
          const idx = findIndex(
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

        this.traceableSetSchema(
          JSONUpdate(schema, context.id, {
            [region]: origin
          })
        );
      },

      setActiveId(
        id: string,
        region: string = '',
        selections: Array<string> = []
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

      setMouseMoveRegion(region: string) {
        self.mouseMoveRegion = region;
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

      changeValue(value: Schema, diff?: any) {
        if (!self.activeId) {
          return;
        }
        this.changeValueById(self.activeId, value, diff);
      },

      changeValueById(
        id: string,
        value: Schema,
        diff?: any,
        replace?: boolean,
        noTrace?: boolean
      ) {
        const origin = JSONGetById(self.schema, id);

        if (!origin) {
          return;
        }

        // 通常 Panel 和 codeEditor 过来都有 diff 信息
        if (diff) {
          const result = patchDiff(origin, diff);
          this.traceableSetSchema(
            JSONUpdate(self.schema, id, JSONPipeIn(result), true),
            noTrace
          );
        } else {
          this.traceableSetSchema(
            JSONUpdate(self.schema, id, JSONPipeIn(value), replace),
            noTrace
          );
        }
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

      moveUp(id: string) {
        if (!id) {
          return;
        }

        this.traceableSetSchema(JSONMoveUpById(self.schema, id));
      },
      moveDown(id: string) {
        if (!id) {
          return;
        }

        this.traceableSetSchema(JSONMoveDownById(self.schema, id));
      },

      del(id: string) {
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
        this.traceableSetSchema(JSONDelete(self.schema, id));
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

      openSubEditor(context: SubEditorContext) {
        if (!self.activeId) {
          return;
        }
        self.subEditorContext = {
          ...context,
          data: context.data || {}
        };
      },

      confirmSubEditor([valueRaw]: any) {
        const {onChange, slot} = self.subEditorContext!;
        let value = valueRaw.schema;
        let originValue = valueRaw.__pristine?.schema || value;

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

        onChange(
          value,
          onChange.length > 1 ? diff(originValue, value) : undefined
        );

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

      openScaffoldForm(context: ScaffoldFormContext) {
        self.scaffoldForm = context;
      },

      closeScaffoldForm() {
        self.scaffoldForm = undefined;
      },

      setScaffoldBuzy(value: any) {
        self.scaffoldFormBuzy = !!value;
      },

      setScaffoldError(msg: string = '') {
        self.scaffoldError = msg;
      },

      openPopOverForm(context: PopOverFormContext) {
        self.popOverForm = context;
      },

      closePopOverForm() {
        self.popOverForm = undefined;
      },

      calculateHighlightBox(ids: Array<string>) {
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
        this.updateTargetName();
      },

      undo() {
        const idx = self.schemaHistory.findIndex(
          item => item.versionId === self.versionId
        );

        if (idx > 0) {
          const version = self.schemaHistory[idx - 1];
          self.versionId = version.versionId;
          self.schema = version.schema;
          this.updateTargetName();
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
          this.updateTargetName();
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
      }
    };
  });

export type EditorStoreType = Instance<typeof EditorStore>;
