"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var theme_1 = require("../../theme");
var Item_1 = require("./Item");
function InputJSONSchema(props) {
    var schema = props.schema || {
        type: 'object',
        properties: {}
    };
    return react_1.default.createElement(Item_1.InputJSONSchemaItem, (0, tslib_1.__assign)({}, props, { schema: schema }));
}
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(InputJSONSchema));
//# sourceMappingURL=./components/json-schema/index.js.map
