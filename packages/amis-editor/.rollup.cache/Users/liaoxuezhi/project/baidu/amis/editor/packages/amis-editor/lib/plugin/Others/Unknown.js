import { __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var UnkownRendererPlugin = /** @class */ (function (_super) {
    __extends(UnkownRendererPlugin, _super);
    function UnkownRendererPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.order = 9999;
        return _this;
    }
    UnkownRendererPlugin.prototype.getRendererInfo = function (_a) {
        var renderer = _a.renderer, schema = _a.schema, path = _a.path;
        if (schema.$$id && renderer) {
            // 有些就是不想做编辑器
            if (/(^|\/)static\-field/.test(path)) {
                return;
            }
            else if (renderer.name === 'card-item' ||
                renderer.name === 'list-item-field') {
                return;
            }
            // 复制部分信息出去
            return {
                name: 'Unkown',
                $schema: '/schemas/UnkownSchema.json'
            };
        }
    };
    return UnkownRendererPlugin;
}(BasePlugin));
export { UnkownRendererPlugin };
registerEditorPlugin(UnkownRendererPlugin);
