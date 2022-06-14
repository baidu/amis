import { __extends } from "tslib";
import React from 'react';
import { Icon } from 'amis';
import { AvailableRenderersPanel } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
/**
 * 添加源码编辑功能
 */
var AvailableRenderersPlugin = /** @class */ (function (_super) {
    __extends(AvailableRenderersPlugin, _super);
    function AvailableRenderersPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        return _this;
    }
    AvailableRenderersPlugin.prototype.buildEditorPanel = function (context, panels) {
        var store = this.manager.store;
        // 多选时不显示
        if (context.selections.length) {
            return;
        }
        if (store.subRenderers.length) {
            panels.push({
                key: 'renderers',
                icon: 'png-icon renderers-png',
                title: (React.createElement("span", { className: "editor-tab-icon", "editor-tooltip": "\u7EC4\u4EF6" },
                    React.createElement(Icon, { icon: "editor-renderer" }))),
                component: AvailableRenderersPanel,
                position: 'left',
                order: -9999
            });
        }
    };
    return AvailableRenderersPlugin;
}(BasePlugin));
export { AvailableRenderersPlugin };
registerEditorPlugin(AvailableRenderersPlugin);
