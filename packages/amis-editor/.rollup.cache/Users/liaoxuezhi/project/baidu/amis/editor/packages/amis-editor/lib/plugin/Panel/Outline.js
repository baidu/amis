import { __extends } from "tslib";
import React from 'react';
import { Icon } from 'amis';
import { OutlinePanel } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import WidthDraggableContainer from 'amis-editor-core';
/**
 * 大纲面板
 */
var OutlinePlugin = /** @class */ (function (_super) {
    __extends(OutlinePlugin, _super);
    function OutlinePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        return _this;
    }
    OutlinePlugin.prototype.buildEditorPanel = function (context, panels) {
        var store = this.manager.store;
        // 多选时显示大纲面板
        if (store && context.selections.length) {
            var changeLeftPanelOpenStatus = store.changeLeftPanelOpenStatus, changeLeftPanelKey = store.changeLeftPanelKey;
            changeLeftPanelOpenStatus(true);
            changeLeftPanelKey('outline');
        }
        panels.push({
            key: 'outline',
            icon: 'png-icon outline-png',
            title: (React.createElement("span", { className: "editor-tab-icon", "editor-tooltip": "\u5927\u7EB2" },
                React.createElement(Icon, { icon: "editor-outline" }))),
            component: WidthDraggableContainer(OutlinePanel),
            position: 'left',
            order: 4000
        });
    };
    return OutlinePlugin;
}(BasePlugin));
export { OutlinePlugin };
registerEditorPlugin(OutlinePlugin);
