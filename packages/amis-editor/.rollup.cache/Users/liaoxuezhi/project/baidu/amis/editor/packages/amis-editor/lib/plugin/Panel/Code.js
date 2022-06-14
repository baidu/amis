import { __extends } from "tslib";
import React from 'react';
import { Icon } from 'amis';
import CodeEditorPanel from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import WidthDraggableContainer from 'amis-editor-core';
/**
 * 添加源码编辑功能
 */
var CodePlugin = /** @class */ (function (_super) {
    __extends(CodePlugin, _super);
    function CodePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = -9999;
        return _this;
    }
    CodePlugin.prototype.buildJSONSchema = function (_a) {
        var info = _a.info;
        return info.$schema;
    };
    CodePlugin.prototype.buildEditorPanel = function (_a, panels) {
        var info = _a.info, selections = _a.selections;
        if (this.manager.store.jsonSchemaUri && !selections.length) {
            panels.push({
                key: 'code',
                icon: 'png-icon code-png',
                title: (React.createElement("span", { className: "editor-tab-icon", "editor-tooltip": "\u4EE3\u7801" },
                    React.createElement(Icon, { icon: "editor-code" }))),
                position: 'left',
                component: WidthDraggableContainer(CodeEditorPanel),
                order: 5000
            });
        }
    };
    return CodePlugin;
}(BasePlugin));
export { CodePlugin };
registerEditorPlugin(CodePlugin);
