import { __extends } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var HiddenControlPlugin = /** @class */ (function (_super) {
    __extends(HiddenControlPlugin, _super);
    function HiddenControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'hidden';
        _this.$schema = '/schemas/HiddenControlSchema.json';
        // 组件名称
        _this.name = '隐藏域';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-eye-slash';
        _this.description = "\u9690\u85CF\u8868\u5355\u9879";
        _this.docLink = '/amis/zh-CN/components/form/hidden';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'hidden',
            name: 'var1'
        };
        _this.previewSchema = {
            type: 'tpl',
            tpl: '隐藏域'
        };
        _this.panelTitle = '隐藏域';
        _this.panelBody = [
            {
                type: 'input-text',
                name: 'value',
                label: '默认值'
            }
        ];
        return _this;
    }
    HiddenControlPlugin.prototype.renderRenderer = function (props) {
        return (React.createElement("div", { key: props.key, className: "wrapper-sm b-a b-light m-b-sm" },
            React.createElement("span", { className: "text-muted" }, "\u529F\u80FD\u7EC4\u4EF6\uFF08\u9690\u85CF\u5B57\u6BB5\uFF09")));
    };
    return HiddenControlPlugin;
}(BasePlugin));
export { HiddenControlPlugin };
registerEditorPlugin(HiddenControlPlugin);
