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
} from '../plugin';
import {registerEditorPlugin} from '../manager';
import type {MenuItem} from 'amis-ui/lib/components/ContextMenu';
import {EditorNodeType} from '../store/node';

/**
 * 用来给当前选中的元素添加一些基本的工具栏按钮。
 */
export class BasicToolbarPlugin extends BasePlugin {
  order = -9999;

  buildEditorToolbar(
    {id, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    const store = this.manager.store;
    const node = store.getNodeById(id)!;
    const parent = store.getSchemaParentById(id);
    // let vertical = true;
    const regionNode = node.parent as EditorNodeType; // 父级节点
    if (Array.isArray(parent) && regionNode?.isRegion) {
      const host = node.host as EditorNodeType;

      if (node.draggable) {
        toolbars.push({
          iconSvg: 'drag-btn',
          icon: 'fa fa-arrows',
          tooltip: '按住拖动调整位置',
          placement: 'bottom',
          draggable: true,
          order: -1000,
          onDragStart: this.manager.startDrag.bind(this.manager, id)
        });
      }

      const idx = parent.indexOf(schema);

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
        store.panels.some(Panel => Panel.key === 'renderers')
      ) {
        const nextId = parent[idx + 1]?.$$id;

        toolbars.push(
          {
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
        iconSvg: 'delete-btn',
        icon: 'fa',
        tooltip: '删除',
        placement: 'bottom',
        order: 999,
        onClick: this.manager.del.bind(this.manager, id)
      });
    }

    toolbars.push({
      iconSvg: 'more-btn',
      icon: 'fa fa-cog',
      tooltip: '更多',
      placement: 'bottom',
      order: 1000,
      onClick: e => {
        if (!e.defaultPrevented) {
          const info = (e.target as HTMLElement).parentElement!.getBoundingClientRect();
          this.manager.openContextMenu(id, '', {
            x: window.scrollX + info.left + info.width - 155,
            y: window.scrollY + info.top + info.height + 8
          });
        }
      }
    });
  }

  buildEditorContextMenu(
    {id, schema, region, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    const manager = this.manager;
    const store = manager.store;
    const parent = store.getSchemaParentById(id);
    const node = store.getNodeById(id)!;
    const paths = store.getNodePathById(id);
    const first = paths.pop()!;
    const host = node.host as EditorNodeType;
    const regionNode = node.parent as EditorNodeType;

    if (selections.length) {
      // 多选时的右键菜单
      menus.push({
        label: '重复一份',
        icon: 'copy-icon',
        disabled: selections.some(item => !item.node.duplicatable),
        onSelect: () => manager.duplicate(selections.map(item => item.id))
      });

      menus.push({
        label: '取消多选',
        icon: 'cancel-icon',
        onSelect: () => store.setActiveId(id)
      });

      menus.push({
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
          label: '插入组件',
          onHighlight: (isOn: boolean) => isOn && store.setHoverId(id, region),
          onSelect: () => store.showInsertRendererPanel()
        });

        menus.push({
          label: '清空',
          onSelect: () => manager.emptyRegion(id, region)
        });

        menus.push({
          label: '粘贴',
          onSelect: () => manager.paste(id, region)
        });
      }
    } else {
      menus.push({
        label: `选中${first.label}`,
        disabled: store.activeId === first.id,
        data: id,
        onSelect: (id: string) => store.setActiveId(id),
        onHighlight: (isHiglight: boolean, id: string) =>
          isHiglight && store.setHoverId(id)
      });

      if (paths.length) {
        const children = paths
          .filter(node => !node.isRegion && node.info?.editable !== false)
          .reverse()
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
        label: '取消选中',
        disabled: !store.activeId || store.activeId !== id,
        onSelect: () => store.setActiveId('')
      });

      menus.push('|');

      menus.push({
        label: '重复一份',
        disabled: !node.duplicatable,
        onSelect: () => manager.duplicate(id)
      });

      menus.push({
        label: '复制配置',
        onSelect: () => manager.copy(id)
      });

      menus.push({
        label: '剪切配置',
        disabled: !node.removable,
        onSelect: () => manager.cut(id)
      });

      menus.push({
        label: '粘贴配置',
        disabled:
          !Array.isArray(parent) ||
          !node.parent ||
          node.info?.typeMutable === false ||
          !node.replaceable,
        onSelect: () => manager.paste(id)
      });

      menus.push({
        label: '删除',
        disabled: !node.removable,
        className: 'text-danger',
        onSelect: () => manager.del(id)
      });

      menus.push('|');

      const idx = Array.isArray(parent) ? parent.indexOf(schema) : -1;

      menus.push({
        label: '向前移动',
        disabled:
          !(Array.isArray(parent) && idx > 0) ||
          !node.moveable ||
          !node.prevSibling,
        onSelect: () => manager.moveUp()
      });

      menus.push({
        label: '向后移动',
        disabled:
          !(Array.isArray(parent) && idx < parent.length - 1) ||
          !node.moveable ||
          !node.nextSibling,
        onSelect: () => manager.moveDown()
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
        label: '撤销（Undo）',
        disabled: !store.canUndo,
        onSelect: () => store.undo()
      });

      menus.push({
        label: '重做（Redo）',
        disabled: !store.canRedo,
        onSelect: () => store.redo()
      });

      // menus.push('|');

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
            label: '插入组件',
            data: first.childRegions[0].region,
            onHighlight: (isOn: boolean, region: string) =>
              isOn ? store.setHoverId(id, region) : store.setHoverId(''),
            onSelect: () => store.showInsertRendererPanel()
          });
        }
      }

      /** 「点选（默认向后插入）」+ 「删除」可以替换 「更改类型」 */
      /*
      menus.push({
        label: '更改类型',
        disabled:
          !node.host ||
          node.info?.typeMutable === false ||
          !node.parent.isRegion ||
          !store.panels.some(Panel => Panel.key === 'renderers') ||
          !node.replaceable,
        onSelect: () => manager.showReplacePanel(id)
      });
      */
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
            // @ts-ignore amis中有问题，可选参数搞成了必选，改完了可以去掉这行
            {
              type: 'button-group',
              buttons: menus
                .filter(item => item !== '|')
                .map(menu => ({
                  ...(menu as MenuItem),
                  type: 'button',
                  onClick: (menu as MenuItem).onSelect
                }))
            }
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
