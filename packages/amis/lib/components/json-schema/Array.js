"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputJSONSchemaArray = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var icons_1 = require("../icons");
var Item_1 = require("./Item");
function InputJSONSchemaArray(props) {
    var _a, _b, _c;
    var cx = props.classnames, value = props.value, onChange = props.onChange, disabled = props.disabled, __ = props.translate, collapsable = props.collapsable, renderValue = props.renderValue;
    var buildMembers = react_1.default.useCallback(function (schema, value) {
        var members = [];
        var len = Array.isArray(value) ? value.length : 1;
        if (typeof schema.minContains === 'number') {
            len = Math.max(len, schema.minContains);
        }
        var maxContains = typeof schema.maxContains === 'number' ? schema.maxContains : 0;
        while (len--) {
            members.push({
                key: (0, helper_1.guid)(),
                index: members.length,
                schema: schema.items,
                invalid: maxContains ? maxContains < members.length : false
            });
        }
        return members;
    }, []);
    var _d = react_1.default.useState(buildMembers(props.schema, value)), members = _d[0], setMembers = _d[1];
    var membersRef = react_1.default.useRef(members);
    membersRef.current = members;
    var _e = react_1.default.useState(collapsable ? true : false), collapsed = _e[0], setCollapsed = _e[1];
    var toggleCollapsed = function () {
        setCollapsed(!collapsed);
    };
    var onMemberChange = function (member, memberValue) {
        var newValue = Array.isArray(props.value) ? props.value.concat() : [];
        newValue[member.index] = memberValue;
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    var onMemberDelete = function (member) {
        var idx = members.indexOf(member);
        if (!~idx) {
            throw new Error('member object not found');
        }
        var m = members.concat();
        m.splice(idx, 1);
        setMembers(m);
        var newValue = Array.isArray(props.value) ? props.value.concat() : [];
        newValue.splice(member.index, 1);
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    react_1.default.useEffect(function () {
        setMembers(buildMembers(props.schema, props.value));
    }, [JSON.stringify(props.schema)]);
    react_1.default.useEffect(function () {
        var value = props.value;
        var schema = props.schema;
        var len = Array.isArray(value) ? value.length : 1;
        if (typeof schema.minContains === 'number') {
            len = Math.max(len, schema.minContains);
        }
        if (typeof schema.maxContains === 'number') {
            len = Math.min(schema.maxContains, len);
        }
        var m = membersRef.current.concat();
        if (m.length !== len) {
            while (m.length !== len) {
                if (m.length > len) {
                    m.pop();
                }
                else {
                    m.push({
                        key: (0, helper_1.guid)(),
                        index: m.length,
                        schema: schema.items
                    });
                }
            }
            setMembers(m);
        }
    }, [JSON.stringify(props.value)]);
    var handleAdd = react_1.default.useCallback(function () {
        var m = members.concat();
        m.push({
            key: (0, helper_1.guid)(),
            index: members.length,
            schema: props.schema.items,
            invalid: false
        });
        setMembers(m);
    }, [members]);
    var maxContains = typeof ((_a = props.schema) === null || _a === void 0 ? void 0 : _a.maxContains) === 'number'
        ? props.schema.maxContains
        : 0;
    var minContains = typeof ((_b = props.schema) === null || _b === void 0 ? void 0 : _b.minContains) === 'number'
        ? props.schema.minContains
        : 0;
    // todo additionalProperties 还有其他格式
    var allowAdd = !maxContains || maxContains > members.length;
    var allowDelete = !minContains || minContains < members.length;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        collapsable ? (react_1.default.createElement("a", { className: cx('JSONSchemaObject-caret', {
                'is-collapsed': collapsed
            }), onClick: toggleCollapsed },
            react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null,
        react_1.default.createElement("div", { className: cx('JSONSchemaObject', {
                'is-expanded': collapsable && !collapsed
            }) },
            collapsed ? (renderValue ? (react_1.default.createElement(Item_1.InputJSONSchemaItem, (0, tslib_1.__assign)({}, props, { value: value, onChange: onChange, schema: {
                    type: 'string'
                }, placeholder: (_c = props.schema) === null || _c === void 0 ? void 0 : _c.description }))) : null) : (members.map(function (member) {
                return (react_1.default.createElement("div", { key: member.key, className: cx('JSONSchemaMember') },
                    react_1.default.createElement("div", { className: cx('JSONSchemaMember-value') },
                        react_1.default.createElement(Item_1.InputJSONSchemaItem, (0, tslib_1.__assign)({}, props, { value: value === null || value === void 0 ? void 0 : value[member.index], onChange: onMemberChange.bind(null, member), schema: member.schema || {
                                type: 'string'
                            }, collapsable: true }))),
                    allowDelete ? (react_1.default.createElement(Button_1.default, { className: cx('SchemaEditor-btn'), onClick: onMemberDelete.bind(null, member), iconOnly: true, disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) },
                        react_1.default.createElement(icons_1.Icon, { icon: "remove", className: "icon" }))) : null));
            })),
            !collapsed ? (react_1.default.createElement(Button_1.default, { level: "link", onClick: handleAdd, size: "xs", disabled: disabled || !allowAdd }, __('JSONSchema.add_prop'))) : null)));
}
exports.InputJSONSchemaArray = InputJSONSchemaArray;
//# sourceMappingURL=./components/json-schema/Array.js.map
