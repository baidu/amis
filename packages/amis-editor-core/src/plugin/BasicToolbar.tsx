import {
  BasePlugin,
  BaseEventContext,
  BasicToolbarItem,
  ContextMenuItem,
  ContextMenuEventContext,
  BasicPanelItem,
  BuildPanelEventContext,
  PluginEvent,
  InsertEventContext,
  PluginInterface
} from '../plugin';
import {registerEditorPlugin} from '../manager';
import type {MenuItem} from 'amis-ui/lib/components/ContextMenu';
import {EditorNodeType} from '../store/node';

/**
 * 用来给当前选中的元素添加一些基本的工具栏按钮。
 */
export class BasicToolbarPlugin extends BasePlugin {
  static scene = ['layout'];
  order = -9999;

  buildEditorToolbar(
    {id, schema, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const store = this.manager.store;
    const node = store.getNodeById(id)!;
    const parent = store.getSchemaParentById(id);
    const draggableContainer = this.manager.draggableContainer(id);
    // 判断是否为吸附容器
    // const isSorptionContainer = schema?.isSorptionContainer || false;
    // let vertical = true;
    const regionNode = node.parent as EditorNodeType; // 父级节点
    if ((Array.isArray(parent) && regionNode?.isRegion) || draggableContainer) {
      const host = node.host as EditorNodeType;

      // if ((node.draggable || draggableContainer) && !isSorptionContainer) {
      //   toolbars.push({
      //     id: 'drag',
      //     iconSvg: 'drag-btn',
      //     icon: 'fa fa-arrows',
      //     tooltip: '按住拖动调整位置',
      //     placement: 'bottom',
      //     draggable: true,
      //     order: -1000,
      //     onDragStart: this.manager.startDrag.bind(this.manager, id)
      //   });
      // }

      const idx = parent?.indexOf(schema);

      // if (idx > 0 && node.moveable) {
      //   let icon = 'fa fa-arrow-up';
      //   let tooltip = '向上移动';

      //   const dom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${id}"]`);
      //   const prevDom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${parent[idx - 1]?.$$id}"]`);

      //   if (dom && prevDom) {
      //     const prevRect = prevDom.getBoundingClientRect();
      //     const rect = dom.getBoundingClientRect();

      //     if (Math.abs(rect.x - prevRect.x) > Math.abs(rect.y - prevRect.y)) {
      //       vertical = false;
      //       icon = 'fa fa-arrow-left';
      //       tooltip = '向前移动';
      //     }

      //     toolbars.push({
      //       icon: icon,
      //       // tooltip: '向前移动（⌘ + ←）',
      //       tooltip: tooltip,
      //       onClick: () => this.manager.moveUp()
      //     });
      //   }
      // }

      // if (idx < parent.length - 1 && node.moveable) {
      //   let icon = 'fa fa-arrow-down';
      //   let tooltip = '向下移动';

      //   const dom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${id}"]`);
      //   const nextDom = this.manager.store
      //     .getDoc()
      //     .querySelector(`[data-editor-id="${parent[idx + 1]?.$$id}"]`);

      //   if (dom && nextDom) {
      //     const nextRect = nextDom.getBoundingClientRect();
      //     const rect = dom.getBoundingClientRect();

      //     if (Math.abs(rect.x - nextRect.x) > Math.abs(rect.y - nextRect.y)) {
      //       vertical = false;
      //       icon = 'fa fa-arrow-right';
      //       tooltip = '向后移动';
      //     }

      //     toolbars.push({
      //       icon: icon,
      //       // tooltip: '向后移动（⌘ + →）',
      //       tooltip: tooltip,
      //       onClick: () => this.manager.moveDown()
      //     });
      //   }
      // }

      // if (node.removable) {
      //   toolbars.push({
      //     icon: 'fa fa-trash-o',
      //     // tooltip: '删除（Del）',
      //     tooltip: '删除',
      //     onClick: () => this.manager.del(id)
      //   });
      // }

      if (
        !host?.memberImmutable(regionNode.region) &&
        store.panels.some(Panel => Panel.key === 'renderers') &&
        store.toolbarMode === 'default'
      ) {
        const nextId = parent[idx + 1]?.$$id;

        toolbars.push(
          {
            id: 'insert-before',
            iconSvg: 'left-arrow-to-left',
            tooltip: '向前插入组件',
            // level: 'special',
            placement: 'bottom',
            // placement: vertical ? 'bottom' : 'right',
            // className: vertical
            //   ? 'ae-InsertBefore is-vertical'
            //   : 'ae-InsertBefore',
            onClick: () =>
              this.manager.showInsertPanel(
                regionNode.region,
                regionNode.id,
                regionNode.preferTag,
                'insert',
                undefined,
                id
              )
          },
          {
            id: 'insert-after',
            iconSvg: 'arrow-to-right',
            tooltip: '向后插入组件',
            // level: 'special',
            placement: 'bottom',
            // placement: vertical ? 'top' : 'left',
            // className: vertical
            //   ? 'ae-InsertAfter is-vertical'
            //   : 'ae-InsertAfter',
            onClick: () =>
              this.manager.showInsertPanel(
                regionNode.region,
                regionNode.id,
                regionNode.preferTag,
                'insert',
                undefined,
                nextId
              )
          }
        );
      }
    }

    if (
      !node.isVitualRenderer &&
      (node.info.plugin.popOverBody || node.info.plugin.popOverBodyCreator)
    ) {
      toolbars.push({
        id: 'edit',
        icon: 'fa fa-pencil',
        tooltip: '编辑',
        placement: 'bottom',
        onClick: e => this.manager.openNodePopOverForm(node.id)
      });
    }

    // if (node.duplicatable || node.duplicatable === undefined) {
    //   toolbars.push({
    //     iconSvg: 'copy-btn',
    //     icon: 'fa',
    //     tooltip: '复制',
    //     placement: 'bottom',
    //     order: 999,
    //     onClick: this.manager.duplicate.bind(this.manager, id)
    //   });
    // }

    if (node.removable || node.removable === undefined) {
      toolbars.push({
        id: 'delete',
        iconSvg: 'delete-btn',
        icon: 'fa',
        tooltip: '删除',
        placement: 'bottom',
        order: 999,
        onClick: this.manager.del.bind(this.manager, id)
      });
    }
    if (store.toolbarMode === 'default') {
      toolbars.push({
        id: 'more',
        iconSvg: 'more-btn',
        icon: 'fa fa-cog',
        tooltip: '更多',
        placement: 'bottom',
        order: 1000,
        onClick: e => {
          if (!e.defaultPrevented) {
            const info = (
              e.target as HTMLElement
            ).parentElement!.getBoundingClientRect();

            // 150 是 contextMenu 的宽度
            // 默认右对齐
            let x = window.scrollX + info.left + info.width - 150;

            // 显示不全是改成左对齐
            if (x < 0) {
              x = window.scrollX + info.left;
            }

            this.manager.openContextMenu(id, '', {
              x: x,
              y: window.scrollY + info.top + info.height + 8,
              target: e.target as HTMLElement,
              clientX: e.clientX,
              clientY: e.clientY
            });
          }
        }
      });
    }

    if (info.scaffoldForm?.canRebuild ?? info.plugin.scaffoldForm?.canRebuild) {
      toolbars.push({
        id: 'build',
        iconSvg: 'harmmer',
        tooltip: `快速构建「${info.plugin.name}」`,
        placement: 'bottom',
        onClick: () => this.manager.reScaffoldV2(id)
      });
    }
  }

  getElementsFromPoint(x: number, y: number, target: HTMLElement) {
    const store = this.manager.store;
    const doc = store.getDoc();

    // 通常是来源于移动端预览的 iframe
    if (target.ownerDocument !== doc) {
      const preview: HTMLElement = (store.getLayer() as HTMLElement)
        .previousSibling?.firstChild as HTMLElement;
      const previewRect = preview.getBoundingClientRect();

      x -= previewRect.left;
      y -= previewRect.top;
      // 如果有缩放比例，重新计算位置
      const scale = store.getScale();
      if (scale >= 0) {
        x = x / scale;
        y = y / scale;
      }
    }

    let elements = store.getDoc().elementsFromPoint(x, y);
    return elements.filter(item => item.hasAttribute('data-editor-id'));
  }

  buildEditorContextMenu(
    {
      id,
      schema,
      region,
      info,
      selections,
      clientX,
      clientY,
      target
    }: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    const manager = this.manager;
    const store = manager.store;
    const parent = store.getSchemaParentById(id);
    const node = store.getNodeById(id)!;
    const paths = store.getNodePathById(id);
    const first = paths.pop()!;
    const host = node.host as EditorNodeType;

    const elements = target
      ? this.getElementsFromPoint(clientX!, clientY!, target)
      : [];

    if (selections.length) {
      // 多选时的右键菜单
      if (store.toolbarMode === 'default') {
        menus.push({
          id: 'copy',
          label: '重复一份',
          icon: 'copy-icon',
          disabled: selections.some(item => !item.node.duplicatable),
          onSelect: () => manager.duplicate(selections.map(item => item.id))
        });
      }

      menus.push({
        id: 'unselect',
        label: '取消多选',
        icon: 'cancel-icon',
        onSelect: () =>
          store.setActiveId(
            id,
            region || node.childRegions.find(i => i.region)?.region
          )
      });

      menus.push({
        id: 'delete',
        label: '删除',
        icon: 'delete-icon',
        disabled: selections.some(item => !item.node.removable),
        className: 'text-danger',
        onSelect: () => manager.del(selections.map(item => item.id))
      });
    } else if (region) {
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );

      if (renderersPanel) {
        // region增加点选后就不需要'插入组件'了
        /*
        menus.push({
          label: '插入组件',
          onHighlight: (isOn: boolean) => isOn && store.setHoverId(id, region),
          onSelect: () => manager.showInsertPanel(region, id)
        });
        */
        menus.push({
          id: 'insert',
          label: '插入组件',
          onHighlight: (isOn: boolean) => isOn && store.setHoverId(id, region),
          onSelect: () => store.showInsertRendererPanel()
        });

        menus.push({
          id: 'clear',
          label: '清空',
          onSelect: () => manager.emptyRegion(id, region)
        });

        menus.push({
          id: 'paste',
          label: '粘贴',
          onSelect: () => manager.paste(id, region)
        });
      }
    } else {
      if (store.toolbarMode === 'mini') {
        return;
      }
      menus.push({
        id: 'select',
        label: `选中${first.label}`,
        disabled: store.activeId === first.id,
        data: id,
        onSelect: (id: string) => store.setActiveId(id),
        onHighlight: (isHiglight: boolean, id: string) =>
          isHiglight && store.setHoverId(id)
      });

      if (elements.length) {
        const children = elements
          .map(item => store.getNodeById(item.getAttribute('data-editor-id')!)!)
          .filter(
            node => node && !node.isRegion && node.info?.editable !== false
          )
          .map(node => ({
            label: node.label,
            data: node.id,
            onSelect: (id: string) => store.setActiveId(id),
            onHighlight: (isHiglight: boolean, currentId: string) =>
              isHiglight && store.setHoverId(currentId)
          }));

        children.length &&
          menus.push({
            label: '选中层级',
            children: children
          });
      }

      menus.push({
        id: 'unselect',
        label: '取消选中',
        disabled: !store.activeId || store.activeId !== id,
        onSelect: () => store.setActiveId('')
      });

      menus.push('|');

      const idx = Array.isArray(parent) ? parent.indexOf(schema) : -1;
      if (host?.schema?.isFreeContainer) {
        menus.push({
          label: '调整层级',
          disabled:
            !Array.isArray(parent) || parent.length <= 1 || !node.moveable,
          children: [
            {
              id: 'move-top',
              label: '置于顶层',
              disabled: idx === parent.length - 1,
              onSelect: () => manager.moveTop()
            },
            {
              id: 'move-bottom',
              label: '置于底层',
              disabled: idx === 0,
              onSelect: () => manager.moveBottom()
            },
            {
              id: 'move-forward',
              label: '上移一层',
              disabled: idx === parent.length - 1,
              onSelect: () => manager.moveDown()
            },
            {
              id: 'move-backward',
              label: '下移一层',
              disabled: idx === 0,
              onSelect: () => manager.moveUp()
            }
          ]
        });
      } else {
        menus.push({
          id: 'move-forward',
          label: '向前移动',
          disabled: !(Array.isArray(parent) && idx > 0) || !node.moveable,
          // || !node.prevSibling,
          onSelect: () => manager.moveUp()
        });

        menus.push({
          id: 'move-backward',
          label: '向后移动',
          disabled:
            !(Array.isArray(parent) && idx < parent.length - 1) ||
            !node.moveable,
          // || !node.nextSibling,
          onSelect: () => manager.moveDown()
        });
      }
      menus.push('|');

      menus.push({
        id: 'copy',
        label: '重复一份',
        disabled: !node.duplicatable,
        onSelect: () => manager.duplicate(id)
      });

      menus.push({
        id: 'copy-config',
        label: '复制配置',
        onSelect: () => manager.copy(id)
      });

      menus.push({
        id: 'cat-config',
        label: '剪切配置',
        disabled: !node.removable,
        onSelect: () => manager.cut(id)
      });

      menus.push({
        id: 'paste-config',
        label: '粘贴配置',
        disabled:
          !Array.isArray(parent) ||
          !node.parent ||
          node.info?.typeMutable === false ||
          !node.replaceable,
        onSelect: () => manager.paste(id)
      });

      menus.push({
        id: 'delete',
        label: '删除',
        disabled: !node.removable,
        className: 'text-danger',
        onSelect: () => manager.del(id)
      });

      /** 「点选（默认向后插入）」+ 「向前移动」可以替换 「前面插入节点」 */
      /*
      menus.push({
        label: '前面插入节点',
        disabled:
          !Array.isArray(parent) ||
          !regionNode ||
          !regionNode.isRegion ||
          !host ||
          host.memberImmutable(regionNode.region) ||
          !store.panels.some(Panel => Panel.key === 'renderers'),
        onSelect: () =>
          this.manager.showInsertPanel(
            regionNode.region,
            regionNode.id,
            regionNode.preferTag,
            'insert',
            undefined,
            id
          )
      });
      */

      /** 「点选（默认向后插入）」可以替换 「后面插入节点」 */
      /*
      menus.push({
        label: '后面插入节点',
        disabled:
          !Array.isArray(parent) ||
          !regionNode ||
          !regionNode.isRegion ||
          !host ||
          host.memberImmutable(regionNode.region) ||
          !store.panels.some(Panel => Panel.key === 'renderers'),
        onSelect: () =>
          this.manager.showInsertPanel(
            regionNode.region,
            regionNode.id,
            regionNode.preferTag,
            'insert',
            undefined,
            parent[idx + 1]?.$$id
          )
      });
      */

      menus.push('|');

      // const configPanel = store.panels.find(item => item.key === 'config');
      // menus.push({
      //   label: '设置',
      //   onSelect: () => manager.openConfigPanel(id),
      //   disabled: !configPanel
      // });

      // const codePanel = store.panels.find(item => item.key === 'code');
      // menus.push({
      //   label: '编辑代码',
      //   onSelect: () => manager.openCodePanel(id),
      //   disabled:
      //     !codePanel || (store.activeId === id && store.getPanelKey() === 'code')
      // });

      menus.push({
        id: 'undo',
        label: '撤销（Undo）',
        disabled: !store.canUndo,
        onSelect: () => store.undo()
      });

      menus.push({
        id: 'redo',
        label: '重做（Redo）',
        disabled: !store.canRedo,
        onSelect: () => store.redo()
      });

      menus.push('|');

      /** 可使用「点选（默认向后插入）」替代 */
      /*
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );
      if (first.childRegions.length && renderersPanel) {
        if (first.childRegions.length > 1) {
          menus.push({
            label: '插入组件',
            children: first.childRegions.map(region => ({
              label: `${region.label}`,
              data: region.region,
              onHighlight: (isOn: boolean, region: string) =>
                isOn ? store.setHoverId(id, region) : store.setHoverId(''),
              onSelect: (region: string) => manager.showInsertPanel(region, id)
            }))
          });
        } else {
          menus.push({
            label: '插入组件',
            data: first.childRegions[0].region,
            onHighlight: (isOn: boolean, region: string) =>
              isOn ? store.setHoverId(id, region) : store.setHoverId(''),
            onSelect: (region: string) => manager.showInsertPanel(region, id)
          });
        }
      }
      */

      // 使用新版插入组件面板（抽屉弹出式）
      const renderersPanel = store.panels.find(
        item => item.key === 'renderers'
      );
      if (first.childRegions.length && renderersPanel) {
        if (first.childRegions.length > 1) {
          menus.push({
            id: 'insert',
            label: '插入组件',
            children: first.childRegions.map(region => ({
              label: `${region.label}`,
              data: region.region,
              onHighlight: (isOn: boolean, region: string) =>
                isOn ? store.setHoverId(id, region) : store.setHoverId(''),
              onSelect: () => store.showInsertRendererPanel()
            }))
          });
        } else {
          menus.push({
            id: 'insert',
            label: '插入组件',
            data: first.childRegions[0].region,
            onHighlight: (isOn: boolean, region: string) =>
              isOn ? store.setHoverId(id, region) : store.setHoverId(''),
            onSelect: () => store.showInsertRendererPanel()
          });
        }
      }
      if (node.type === 'container') {
        menus.push({
          id: 'clear',
          label: '清空容器',
          disabled: !node.schema.body?.length,
          onSelect: () => manager.emptyRegion(id, 'body')
        });
      }

      menus.push({
        id: 'replace',
        label: '替换组件',
        disabled:
          !node.host ||
          node.info?.typeMutable === false ||
          !node.parent.isRegion ||
          !store.panels.some(Panel => Panel.key === 'renderers') ||
          !node.replaceable,
        onSelect: () => manager.showReplacePanel(id)
      });
    }

    if (
      !selections.length &&
      (info.plugin.scaffoldForm?.canRebuild || info.scaffoldForm?.canRebuild)
    ) {
      menus.push({
        id: 'build',
        label: `快速构建「${info.plugin.name}」`,
        disabled: schema.$$commonSchema || schema.$$formSchema,
        onSelect: () =>
          this.manager.reScaffold(
            id,
            info.scaffoldForm || info.plugin.scaffoldForm!,
            schema
          )
      });
    }
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    if (!context.selections.length) {
      return;
    }
    const store = this.manager.store;

    let menus: Array<ContextMenuItem> = [];
    const contextMenuContext: ContextMenuEventContext = {
      ...context,
      data: menus,
      region: ''
    };

    menus = this.manager.buildContextMenus(contextMenuContext);

    if (menus.length) {
      panels.push({
        key: 'contextmenu',
        icon: 'fa fa-cog',
        title: '操作',
        menus: menus,
        render: this.manager.makeSchemaFormRender({
          body: [
            {
              type: 'button-group',
              buttons: menus
                .filter(item => item !== '|')
                .map(menu => ({
                  ...(menu as MenuItem),
                  type: 'button',
                  onClick: (menu as MenuItem).onSelect
                }))
            } as any
          ],
          panelById: store.activeId
        })
      });
    }
  }

  afterInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;

    if (context.node && context.subRenderer?.plugin?.popOverBody) {
      const id = context.data.$$id;

      if (id) {
        setTimeout(() => {
          this.manager.setActiveId(id);
          requestAnimationFrame(() => {
            this.manager.openNodePopOverForm(id);
          });
        }, 200);
      }
    }
  }
}

registerEditorPlugin(BasicToolbarPlugin);
