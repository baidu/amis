import { __assign, __extends } from "tslib";
import { BasePlugin } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
/**
 * 用来给当前选中的元素添加一些基本的工具栏按钮。
 */
var BasicToolbarPlugin = /** @class */ (function (_super) {
    __extends(BasicToolbarPlugin, _super);
    function BasicToolbarPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        return _this;
    }
    BasicToolbarPlugin.prototype.buildEditorToolbar = function (_a, toolbars) {
        var _this = this;
        var _b;
        var id = _a.id, schema = _a.schema;
        var store = this.manager.store;
        var node = store.getNodeById(id);
        var parent = store.getSchemaParentById(id);
        // let vertical = true;
        var regionNode = node.parent; // 父级节点
        if (Array.isArray(parent) && (regionNode === null || regionNode === void 0 ? void 0 : regionNode.isRegion)) {
            var host = node.host;
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
            var idx = parent.indexOf(schema);
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
            if (!(host === null || host === void 0 ? void 0 : host.memberImmutable(regionNode.region)) &&
                store.panels.some(function (Panel) { return Panel.key === 'renderers'; })) {
                var nextId_1 = (_b = parent[idx + 1]) === null || _b === void 0 ? void 0 : _b.$$id;
                toolbars.push({
                    iconSvg: 'left-arrow-to-left',
                    tooltip: '向前插入组件',
                    // level: 'special',
                    placement: 'bottom',
                    // placement: vertical ? 'bottom' : 'right',
                    // className: vertical
                    //   ? 'ae-InsertBefore is-vertical'
                    //   : 'ae-InsertBefore',
                    onClick: function () {
                        return _this.manager.showInsertPanel(regionNode.region, regionNode.id, regionNode.preferTag, 'insert', undefined, id);
                    }
                }, {
                    iconSvg: 'arrow-to-right',
                    tooltip: '向后插入组件',
                    // level: 'special',
                    placement: 'bottom',
                    // placement: vertical ? 'top' : 'left',
                    // className: vertical
                    //   ? 'ae-InsertAfter is-vertical'
                    //   : 'ae-InsertAfter',
                    onClick: function () {
                        return _this.manager.showInsertPanel(regionNode.region, regionNode.id, regionNode.preferTag, 'insert', undefined, nextId_1);
                    }
                });
            }
        }
        if (!node.isVitualRenderer &&
            (node.info.plugin.popOverBody || node.info.plugin.popOverBodyCreator)) {
            toolbars.push({
                icon: 'fa fa-pencil',
                tooltip: '编辑',
                placement: 'bottom',
                onClick: function (e) { return _this.manager.openNodePopOverForm(node.id); }
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
            onClick: function (e) {
                if (!e.defaultPrevented) {
                    var info = e.target.parentElement.getBoundingClientRect();
                    _this.manager.openContextMenu(id, '', {
                        x: window.scrollX + info.left + info.width - 155,
                        y: window.scrollY + info.top + info.height + 8
                    });
                }
            }
        });
    };
    BasicToolbarPlugin.prototype.buildEditorContextMenu = function (_a, menus) {
        var _b;
        var id = _a.id, schema = _a.schema, region = _a.region, selections = _a.selections;
        var manager = this.manager;
        var store = manager.store;
        var parent = store.getSchemaParentById(id);
        var node = store.getNodeById(id);
        var paths = store.getNodePathById(id);
        var first = paths.pop();
        var host = node.host;
        var regionNode = node.parent;
        if (selections.length) {
            // 多选时的右键菜单
            menus.push({
                label: '重复一份',
                icon: 'copy-icon',
                disabled: selections.some(function (item) { return !item.node.duplicatable; }),
                onSelect: function () { return manager.duplicate(selections.map(function (item) { return item.id; })); }
            });
            menus.push({
                label: '取消多选',
                icon: 'cancel-icon',
                onSelect: function () { return store.setActiveId(id); }
            });
            menus.push({
                label: '删除',
                icon: 'delete-icon',
                disabled: selections.some(function (item) { return !item.node.removable; }),
                className: 'text-danger',
                onSelect: function () { return manager.del(selections.map(function (item) { return item.id; })); }
            });
        }
        else if (region) {
            var renderersPanel = store.panels.find(function (item) { return item.key === 'renderers'; });
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
                    onHighlight: function (isOn) { return isOn && store.setHoverId(id, region); },
                    onSelect: function () { return store.showInsertRendererPanel(); }
                });
                menus.push({
                    label: '清空',
                    onSelect: function () { return manager.emptyRegion(id, region); }
                });
                menus.push({
                    label: '粘贴',
                    onSelect: function () { return manager.paste(id, region); }
                });
            }
        }
        else {
            menus.push({
                label: "\u9009\u4E2D".concat(first.label),
                disabled: store.activeId === first.id,
                data: id,
                onSelect: function (id) { return store.setActiveId(id); },
                onHighlight: function (isHiglight, id) {
                    return isHiglight && store.setHoverId(id);
                }
            });
            if (paths.length) {
                var children = paths
                    .filter(function (node) { var _a; return !node.isRegion && ((_a = node.info) === null || _a === void 0 ? void 0 : _a.editable) !== false; })
                    .reverse()
                    .map(function (node) { return ({
                    label: node.label,
                    data: node.id,
                    onSelect: function (id) { return store.setActiveId(id); },
                    onHighlight: function (isHiglight, currentId) {
                        return isHiglight && store.setHoverId(currentId);
                    }
                }); });
                children.length &&
                    menus.push({
                        label: '选中层级',
                        children: children
                    });
            }
            menus.push({
                label: '取消选中',
                disabled: !store.activeId || store.activeId !== id,
                onSelect: function () { return store.setActiveId(''); }
            });
            menus.push('|');
            menus.push({
                label: '重复一份',
                disabled: !node.duplicatable,
                onSelect: function () { return manager.duplicate(id); }
            });
            menus.push({
                label: '复制配置',
                onSelect: function () { return manager.copy(id); }
            });
            menus.push({
                label: '剪切配置',
                disabled: !node.removable,
                onSelect: function () { return manager.cut(id); }
            });
            menus.push({
                label: '粘贴配置',
                disabled: !Array.isArray(parent) ||
                    !node.parent ||
                    ((_b = node.info) === null || _b === void 0 ? void 0 : _b.typeMutable) === false ||
                    !node.replaceable,
                onSelect: function () { return manager.paste(id); }
            });
            menus.push({
                label: '删除',
                disabled: !node.removable,
                className: 'text-danger',
                onSelect: function () { return manager.del(id); }
            });
            menus.push('|');
            var idx = Array.isArray(parent) ? parent.indexOf(schema) : -1;
            menus.push({
                label: '向前移动',
                disabled: !(Array.isArray(parent) && idx > 0) ||
                    !node.moveable ||
                    !node.prevSibling,
                onSelect: function () { return manager.moveUp(); }
            });
            menus.push({
                label: '向后移动',
                disabled: !(Array.isArray(parent) && idx < parent.length - 1) ||
                    !node.moveable ||
                    !node.nextSibling,
                onSelect: function () { return manager.moveDown(); }
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
                onSelect: function () { return store.undo(); }
            });
            menus.push({
                label: '重做（Redo）',
                disabled: !store.canRedo,
                onSelect: function () { return store.redo(); }
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
            var renderersPanel = store.panels.find(function (item) { return item.key === 'renderers'; });
            if (first.childRegions.length && renderersPanel) {
                if (first.childRegions.length > 1) {
                    menus.push({
                        label: '插入组件',
                        children: first.childRegions.map(function (region) { return ({
                            label: "".concat(region.label),
                            data: region.region,
                            onHighlight: function (isOn, region) {
                                return isOn ? store.setHoverId(id, region) : store.setHoverId('');
                            },
                            onSelect: function () { return store.showInsertRendererPanel(); }
                        }); })
                    });
                }
                else {
                    menus.push({
                        label: '插入组件',
                        data: first.childRegions[0].region,
                        onHighlight: function (isOn, region) {
                            return isOn ? store.setHoverId(id, region) : store.setHoverId('');
                        },
                        onSelect: function () { return store.showInsertRendererPanel(); }
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
    };
    BasicToolbarPlugin.prototype.buildEditorPanel = function (context, panels) {
        if (!context.selections.length) {
            return;
        }
        var menus = [];
        var contextMenuContext = __assign(__assign({}, context), { data: menus, region: '' });
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
                            block: true,
                            buttons: menus
                                .filter(function (item) { return item !== '|'; })
                                .map(function (menu) { return (__assign(__assign({}, menu), { type: 'button', onClick: menu.onSelect })); })
                        }
                    ]
                })
            });
        }
    };
    BasicToolbarPlugin.prototype.afterInsert = function (event) {
        var _this = this;
        var _a, _b;
        var context = event.context;
        if (context.node && ((_b = (_a = context.subRenderer) === null || _a === void 0 ? void 0 : _a.plugin) === null || _b === void 0 ? void 0 : _b.popOverBody)) {
            var id_1 = context.data.$$id;
            if (id_1) {
                setTimeout(function () {
                    _this.manager.setActiveId(id_1);
                    requestAnimationFrame(function () {
                        _this.manager.openNodePopOverForm(id_1);
                    });
                }, 200);
            }
        }
    };
    return BasicToolbarPlugin;
}(BasePlugin));
export { BasicToolbarPlugin };
registerEditorPlugin(BasicToolbarPlugin);
