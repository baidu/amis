"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSchemaRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var index_1 = (0, tslib_1.__importDefault)(require("../../components/json-schema/index"));
var WithRemoteConfig_1 = require("../../components/WithRemoteConfig");
var EnhancedInputJSONSchema = (0, WithRemoteConfig_1.withRemoteConfig)({
    sourceField: 'schema',
    injectedPropsFilter: function (injectedProps, props) {
        return {
            schema: injectedProps.config,
            loading: injectedProps.loading
        };
    }
})(index_1.default);
var JSONSchemaControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(JSONSchemaControl, _super);
    function JSONSchemaControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaControl.prototype.render = function () {
        var rest = (0, tslib_1.__rest)(this.props, []);
        return react_1.default.createElement(EnhancedInputJSONSchema, (0, tslib_1.__assign)({}, rest));
    };
    return JSONSchemaControl;
}(react_1.default.PureComponent));
exports.default = JSONSchemaControl;
var JSONSchemaRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(JSONSchemaRenderer, _super);
    function JSONSchemaRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONSchemaRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'json-schema',
            strictMode: false
        })
    ], JSONSchemaRenderer);
    return JSONSchemaRenderer;
}(JSONSchemaControl));
exports.JSONSchemaRenderer = JSONSchemaRenderer;
//# sourceMappingURL=./renderers/Form/JSONSchema.js.map
