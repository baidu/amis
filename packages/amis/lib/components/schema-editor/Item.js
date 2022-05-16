"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaEditorItem = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Array_1 = require("./Array");
var Common_1 = require("./Common");
var Object_1 = require("./Object");
var SchemaEditorItem = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaEditorItem, _super);
    function SchemaEditorItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SchemaEditorItem.prototype.render = function () {
        var value = this.props.value;
        // 动态Component要用大写开头的才会被识别
        var Renderer = Common_1.SchemaEditorItemCommon;
        switch (value === null || value === void 0 ? void 0 : value.type) {
            case 'object':
                Renderer = Object_1.SchemaEditorItemObject;
                break;
            case 'array':
                Renderer = Array_1.SchemaEditorItemArray;
                break;
        }
        return react_1.default.createElement(Renderer, (0, tslib_1.__assign)({}, this.props));
    };
    return SchemaEditorItem;
}(react_1.default.Component));
exports.SchemaEditorItem = SchemaEditorItem;
//# sourceMappingURL=./components/schema-editor/Item.js.map
