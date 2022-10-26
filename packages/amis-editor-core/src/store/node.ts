/**
 * @file 每个渲染器的节点信息存在这了。
 * Outline 就是靠这个生成的。
 */
import {
  getParent,
  getRoot,
  IAnyModelType,
  Instance,
  isAlive,
  types
} from 'mobx-state-tree';
import uniq from 'lodash/uniq';
import {RegionConfig, RendererInfo} from '../plugin';
import {guid, JSONPipeIn} from '../util';
import {filterSchema} from 'amis';
import React from 'react';
import {EditorStoreType} from './editor';
import findIndex from 'lodash/findIndex';
import type {RendererConfig} from 'amis-core/lib/factory';

export const EditorNode = types
  .model('EditorNode', {
    // 记录父亲节点信息
    parentId: '',
    parentRegion: '',
    isCommonConfig: false,

    id: '',
    type: '',
    label: '',
    // info: types.maybe(types.frozen<RendererInfo>()),
    regionInfo: types.maybe(types.frozen<RegionConfig>()),
    path: '',
    schemaPath: '',
    region: '',
    preferTag: '',

    state: types.optional(types.frozen(), {}),

    widthMutable: false,
    heightMutable: false,

    // 虚拟的渲染器编辑器，并没有对应的渲染器，而是单纯某个渲染器的子组件
    memberIndex: -1,

    // 是否收起
    folded: false,

    // 对应 schema 是否已经修正过
    patched: false,

    x: 0,
    y: 0,
    w: 0,
    h: 0,

    children: types.optional(
      types.array(types.late((): IAnyModelType => EditorNode)),
      []
    )
  })
  .volatile(() => ({
    getData: types.frozen<() => any>()
  }))
  .views(self => {
    let info: RendererInfo;
    let rendererConfig: RendererConfig | undefined;

    return {
      get info() {
        return info;
      },

      setInfo(value: RendererInfo) {
        info = value;
      },

      get rendererConfig() {
        return rendererConfig;
      },

      setRendererConfig(value: RendererConfig) {
        rendererConfig = value;
      },

      get isVitualRenderer() {
        return !!~self.memberIndex;
      },

      get clickable() {
        if (this.info?.editable === false && this.info?.hostId) {
          return false;
        }

        return true;
      },

      get draggable() {
        if (this.moveable && this.info?.draggable !== false) {
          return true;
        }

        return false;
      },

      // 是否可移动
      get moveable() {
        if (
          !this.isRegion &&
          this.info?.movable !== false &&
          Array.isArray(this.schemaParent) &&
          !this.host?.memberImmutable(this.parent.region)
        ) {
          return true;
        }

        return false;
      },

      // 是否可向上移动
      get canMoveUp() {
        if (
          !this.isRegion &&
          this.moveable &&
          Array.isArray(this.schemaParent) &&
          this.prevSibling
        ) {
          return true;
        }
        return false;
      },

      // 是否可向下移动
      get canMoveDown() {
        if (
          !this.isRegion &&
          this.moveable &&
          Array.isArray(this.schemaParent) &&
          this.nextSibling
        ) {
          return true;
        }
        return false;
      },

      // 是否允许删除
      get removable() {
        if (
          !this.isRegion &&
          this.info?.removable !== false &&
          Array.isArray(this.schemaParent) &&
          this.host &&
          !this.host.memberImmutable(this.parent.region)
        ) {
          return true;
        }

        return false;
      },

      get duplicatable() {
        if (
          !this.isRegion &&
          this.info?.duplicatable !== false &&
          Array.isArray(this.schemaParent) &&
          !this.host.memberImmutable(this.parent.region)
        ) {
          return true;
        }

        return false;
      },

      // 是否可替换
      get replaceable() {
        if (!this.isRegion && this.info?.replaceable !== false) {
          return true;
        }

        return false;
      },

      memberImmutable(region: string) {
        return !!(
          this.info?.memberImmutable === true ||
          (Array.isArray(this.info?.memberImmutable) &&
            ~this.info!.memberImmutable.indexOf(region))
        );
      },

      get isRegion() {
        return !!self.region;
      },

      get childRegions() {
        const regions = this.uniqueChildren.filter(
          (item, index, list) => item.isRegion
        );

        if (this.info?.multifactor) {
          const sameIdChild = this.sameIdChild;
          sameIdChild?.childRegions?.forEach((region: any) =>
            regions.push(region)
          );
        }

        return regions;
      },

      get uniqueChildren() {
        let children = self.children.filter(
          (child, index, list) =>
            list.findIndex(a =>
              child.isRegion
                ? a.id === child.id && a.region === child.region
                : a.id === child.id
            ) === index
        );

        if (Array.isArray(this.schema)) {
          const arr = this.schema;
          children = children.sort((a, b) => {
            const idxa = findIndex(arr, item => item?.$$id === a.id);
            const idxb = findIndex(arr, item => item?.$$id === b.id);
            return idxa - idxb;
          });
        }

        return children;
      },

      get sameIdChild() {
        return this.uniqueChildren?.find(
          child => !child.isRegion && child.id === self.id
        );
      },

      // 意思说，是否这个节点有且仅有一个容器，
      // 如果是这样导航里面就不显示容器节点了
      get singleRegion() {
        return !!(
          this.uniqueChildren.length === 1 && this.uniqueChildren[0].isRegion
        );
      },

      isExists(id: string): boolean {
        return self.children.some(child => child.id === id);
      },

      getChildById(id: string) {
        return self.children.find(child => child.id === id);
      },

      get parent(): any {
        try {
          const parent = getParent(self, 2) as EditorNodeType;
          return parent?.id !== 'root' ? parent : null;
        } catch (e) {
          return null;
        }
      },

      get ancestorField(): any {
        const ancestor = getParent(self, 4) as EditorNodeType;

        if (ancestor?.id === 'root') {
          return null;
        }
        const ancestorProps = ancestor?.getComponent()?.props ?? {};
        const body = ancestorProps?.body ?? [];
        const context = Object.keys(ancestorProps?.data ?? {});

        return uniq([...body.map((item: any) => item?.name ?? ''), ...context]);
      },

      get host(): any {
        let host = (self as any).parent;

        if (host?.isRegion) {
          host = host.parent;
        }

        return host;
      },

      get firstChild(): any {
        let host = self;
        if (!host.children.length) {
          return null;
        }
        let firstChild = host.children[0];

        while (firstChild) {
          if (firstChild.isRegion || firstChild.id === host.id) {
            if (firstChild.children.length) {
              firstChild = firstChild.children[0];
            } else {
              firstChild = null;
            }

            continue;
          }

          return firstChild;
        }

        return null;
      },

      get index() {
        const parent = this.parent;
        const list = parent.uniqueChildren;
        return list.indexOf(self);
      },

      get prevSibling() {
        const parent = this.parent;
        const list = parent.uniqueChildren;
        const idx = list.indexOf(self);
        let index = idx - 1;
        while (index >= 0 && list[index]) {
          if (list[index].id !== self.id) {
            return list[index];
          }

          index--;
        }

        return null;
      },

      get nextSibling() {
        const parent = this.parent;
        const list = parent.uniqueChildren;
        const len = list.length;
        const idx = list.indexOf(self);
        let index = idx + 1;
        while (index < len && list[index]) {
          if (list[index].id !== self.id) {
            return list[index];
          }

          index++;
        }

        return null;
      },

      get schema(): any {
        if (!isAlive(self)) {
          return null;
        }
        const schema = (getRoot(self) as EditorStoreType).getSchema(self.id);
        if (this.isRegion && schema) {
          return schema[self.region];
        }

        return schema;
      },

      get schemaParent(): any {
        const editor = getRoot(self) as EditorStoreType;

        if (this.isRegion) {
          return editor.getSchema(self.id);
        }

        return editor.getSchemaParentById(self.id);
      },

      get isSecondFactor() {
        return this.parent?.id === self.id;
      }
    };
  })
  .actions(self => {
    // 用来统一 container 成员的格式，因为渲染支持成员配置成字符串，
    // 为了可编辑，得变成对象才行。
    function normalizeContainer(schema: any, containers: Array<string>) {
      let isModified = false;
      let toUpdate: any = {};
      if (!schema) {
        return;
      }

      containers.forEach(key => {
        const paths = key.split('.');
        key = paths.shift() as string;

        let container = schema[key];

        if (typeof container === 'string') {
          isModified = true;
          toUpdate[key] = [
            JSONPipeIn({
              type: 'tpl',
              tpl: container,
              inline: false
            })
          ];
          return;
        } else if (!Array.isArray(container)) {
          if (container) {
            toUpdate[key] = [JSONPipeIn(container)];
            isModified = true;
          }

          return;
        }

        let currentIsModified = false;
        const modified = container.map((item: any) => {
          // 如果是 tpl
          if (typeof item === 'string' && item) {
            currentIsModified = true;
            return JSONPipeIn({
              type: 'tpl',
              tpl: item,
              inline: false
            });
          } else if (paths.length) {
            const changed = normalizeContainer(item, [paths.join('.')]);

            if (changed !== item) {
              currentIsModified = true;
              item = changed;
            }
          }

          return item;
        });

        if (currentIsModified) {
          isModified = true;
          toUpdate[key] = modified;
        }
      });

      if (isModified) {
        schema = {
          ...schema,
          ...toUpdate
        };
      }

      return schema;
    }

    function getReactOfTargets(targets: Array<HTMLElement>) {
      const arr = targets.concat();
      const first = arr.shift()!;
      const firstRect = first.getBoundingClientRect();

      const rect = {
        left: firstRect.left,
        top: firstRect.top,
        width: firstRect.width,
        height: firstRect.height,
        right: firstRect.right,
        bottom: firstRect.bottom
      };

      let region: HTMLElement | null = first.parentElement!.closest(
        '.ae-Preview-inner,[data-region]'
      );

      while (arr.length) {
        const item = arr.shift()!;
        const itemRect = item.getBoundingClientRect();
        const blong = item.parentElement!.closest(
          '.ae-Preview-inner,[data-region],[data-editor-id]'
        );

        if (!region && blong) {
          region = blong as HTMLElement;
        } else if (blong && region && blong !== region) {
          continue;
        }

        rect.left = Math.min(rect.left, itemRect.left);
        rect.top = Math.min(rect.top, itemRect.top);
        rect.right = Math.max(rect.right, itemRect.right);
        rect.bottom = Math.max(rect.bottom, itemRect.bottom);
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
      }
      return rect;
    }

    function calculateHighlightBox(target: HTMLElement | Array<HTMLElement>) {
      const targets = Array.isArray(target) ? target : target ? [target] : [];
      if (!targets.length) {
        return;
      }

      const root = getRoot(self) as any;
      const iframe = root.getIframe();
      const layer: HTMLElement = (getRoot(self) as any).getLayer();
      const layerRect = layer.getBoundingClientRect();

      const targetRect = getReactOfTargets(targets);
      const position = {
        left: targetRect.left - layerRect.left,
        top: targetRect.top - layerRect.top
      };

      if (iframe) {
        const rect = iframe.getBoundingClientRect();
        position.left += rect.left;
        position.top += rect.top;
      }

      let height = targetRect.height;

      if (!height) {
        return;
      }

      self.x = position.left + 0;
      self.y = position.top + 0;
      self.w = targetRect.width;
      self.h = height;
    }

    function getClosestParentByType(type: string): EditorNodeType | void {
      let node = self;
      while (node) {
        if (node.type === type) {
          return node as EditorNodeType;
        }
        if (node.id === 'root') {
          return;
        }
        node = node.parent;
      }
    }

    // 放到props会变成 frozen 的。
    let component: any;

    function updateIsCommonConfig(value: boolean) {
      self.isCommonConfig = !!value;
    }

    return {
      getClosestParentByType,
      updateIsCommonConfig,
      addChild(props: {
        id: string;
        type: string;
        label: string;
        path: string;
        isCommonConfig?: boolean;
        info?: RendererInfo;
        region?: string;
        getData?: () => any;
        preferTag?: string;
        schemaPath?: string;
        regionInfo?: RegionConfig;
        widthMutable?: boolean;
        memberIndex?: number;
      }) {
        self.children.push({
          ...props,
          parentId: self.id,
          parentRegion: self.region
        });
        const node = self.children[self.children.length - 1];
        node.setInfo(props.info);
        return node;
      },

      removeChild(child: any) {
        const idx = self.children.findIndex(item => item === child);
        self.children.splice(idx, 1);
      },

      toggleFold(e: React.MouseEvent<HTMLAnchorElement>) {
        e.stopPropagation();
        e.preventDefault();

        self.folded = !self.folded;
      },

      patch(store: any, force = false) {
        // 避免重复 patch
        if (self.patched && !force) {
          return;
        }
        self.patched = true;

        const root = store as EditorStoreType;
        const info = self.info!;

        if (info.editable === false) {
          return;
        }

        let schema = root.getSchema(info.id);
        let patched = schema;

        if (!patched?.id) {
          patched = {...patched, id: 'u:' + guid()};
        }

        if (
          (Array.isArray(info.regions) && info.regions.length) ||
          Array.isArray(info.patchContainers)
        ) {
          patched = normalizeContainer(
            patched,
            info.patchContainers || info.regions!.map(region => region.key)
          );
        }

        patched = filterSchema(patched, {
          component: info.renderer.component
        } as any);
        patched = JSONPipeIn(patched);
        if (patched !== schema) {
          root.changeValueById(info.id, patched, undefined, true, true);
        }
      },

      updateSchema(value: any) {
        const info = self.info!;

        if (info.editable === false) {
          return;
        }
        const root = getRoot(self) as any;
        let schema = root.getSchema(info.id);
        schema = {...schema, ...value};
        root.changeValueById(info.id, schema);
      },

      setComponent(value: any) {
        component = value;
      },

      getComponent() {
        return component;
      },

      /**
       * 计算高亮区域信息。
       * @param layer
       * @param root
       */
      calculateHighlightBox(root: any = getRoot(self)) {
        if (!root.calculateStarted) {
          return;
        }
        const doc = (getRoot(self) as any).getDoc();

        if (self.isRegion) {
          const target = doc.querySelector(
            `[data-region="${self.region}"][data-region-host="${self.id}"]`
          ) as HTMLElement;
          calculateHighlightBox(target);
        } else {
          const target = [].slice.call(
            doc.querySelectorAll(`[data-editor-id="${self.id}"]`)
          );

          // 按钮一般不会出现多份，所以先写死只展示一块。
          calculateHighlightBox(
            self.info?.renderer.name === 'button' ? target?.[0] : target
          );

          self.childRegions.forEach(child => child.calculateHighlightBox(root));
        }
      },

      resetHighlightBox(root: any) {
        self.x = 0;
        self.y = 0;
        self.w = 0;
        self.h = 0;

        self.childRegions.forEach(child => child.resetHighlightBox(root));
      },

      updateState(state: any, replace = false) {
        self.state = {
          ...(replace ? null : self.state),
          ...state
        };
      },

      setWidthMutable(value: any) {
        self.widthMutable = !!value;
      },

      setHeightMutable(value: any) {
        self.heightMutable = !!value;
      }
    };
  });

export const EditorNodeContext = React.createContext<EditorNodeType | null>(
  null
);
export type EditorNodeType = Instance<typeof EditorNode>;
