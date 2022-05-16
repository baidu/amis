"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputJSONSchemaObject = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var icons_1 = require("../icons");
var InputBox_1 = (0, tslib_1.__importDefault)(require("../InputBox"));
var InputBoxWithSuggestion_1 = (0, tslib_1.__importDefault)(require("../InputBoxWithSuggestion"));
var Select_1 = (0, tslib_1.__importDefault)(require("../Select"));
var Item_1 = require("./Item");
function InputJSONSchemaObject(props) {
    var _a, _b;
    var cx = props.classnames, value = props.value, onChange = props.onChange, disabled = props.disabled, __ = props.translate, renderKey = props.renderKey, collapsable = props.collapsable, renderValue = props.renderValue;
    var buildMembers = react_1.default.useCallback(function (schema, value) {
        var members = [];
        var required = Array.isArray(schema.required) ? schema.required : [];
        Object.keys(schema.properties || {}).forEach(function (key) {
            var child = schema.properties[key];
            members.push({
                key: (0, helper_1.guid)(),
                name: key,
                nameMutable: !required.includes(key),
                required: required.includes(key),
                schema: child
            });
        });
        var keys = Object.keys(value || {});
        var _loop_1 = function (key) {
            var exists = members.find(function (m) { return m.name === key; });
            if (!exists) {
                members.push({
                    key: (0, helper_1.guid)(),
                    name: key,
                    nameMutable: true,
                    schema: {
                        type: 'string'
                    }
                });
            }
        };
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            _loop_1(key);
        }
        if (!members.length) {
            members.push({
                key: (0, helper_1.guid)(),
                name: '',
                nameMutable: true,
                schema: {
                    type: 'string'
                }
            });
        }
        return members;
    }, []);
    var _c = react_1.default.useState(buildMembers(props.schema, props.value)), members = _c[0], setMembers = _c[1];
    var membersRef = react_1.default.useRef();
    membersRef.current = members;
    var _d = react_1.default.useState(collapsable ? true : false), collapsed = _d[0], setCollapsed = _d[1];
    var toggleCollapsed = function () {
        setCollapsed(!collapsed);
    };
    var onMemberChange = function (member, memberValue) {
        var _a;
        var newValue = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.value), (_a = {}, _a[member.name] = memberValue, _a));
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    var onMemberKeyChange = function (member, memberValue) {
        var _a, _b;
        var idx = members.indexOf(member);
        if (!~idx) {
            throw new Error('member object not found');
        }
        var newValue = (0, tslib_1.__assign)({}, props.value);
        var m = members.concat();
        m.splice(idx, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, member), { schema: ((_b = (_a = props.schema) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b[memberValue]) || {
                type: 'string'
            }, name: memberValue, invalid: !memberValue ||
                members.some(function (a, b) { return a.name === memberValue && b !== idx; }) }));
        setMembers(m);
        newValue[memberValue] = newValue[member.name];
        delete newValue[member.name];
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
        var newValue = (0, tslib_1.__assign)({}, props.value);
        delete newValue[member.name];
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
    };
    react_1.default.useEffect(function () {
        setMembers(buildMembers(props.schema, props.value));
    }, [JSON.stringify(props.schema)]);
    react_1.default.useEffect(function () {
        var value = props.value;
        var m = membersRef.current.concat();
        var keys = Object.keys(value || {});
        var _loop_2 = function (key) {
            var exists = m.find(function (m) { return m.name === key; });
            if (!exists) {
                m.push({
                    key: (0, helper_1.guid)(),
                    name: key,
                    nameMutable: true,
                    schema: {
                        type: 'string'
                    }
                });
            }
        };
        for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
            var key = keys_2[_i];
            _loop_2(key);
        }
        if (m.length !== membersRef.current.length) {
            setMembers(m);
        }
    }, [JSON.stringify(props.value)]);
    var handleAdd = react_1.default.useCallback(function () {
        var m = members.concat();
        m.push({
            key: (0, helper_1.guid)(),
            name: '',
            invalid: true,
            nameMutable: true
        });
        setMembers(m);
    }, [members]);
    var options = [];
    var properties = ((_a = props.schema) === null || _a === void 0 ? void 0 : _a.properties) || {};
    Object.keys(properties).forEach(function (key) {
        var _a;
        options.push({
            label: ((_a = properties[key]) === null || _a === void 0 ? void 0 : _a.title) || key,
            value: key
        });
    });
    // todo additionalProperties 还有其他格式
    var allowAdd = !(props.schema.additionalProperties === false &&
        options.every(function (o) { return members.find(function (m) { return m.name === o.value; }); }));
    var allowInput = props.schema.additionalProperties !== false;
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
                }, placeholder: (_b = props.schema) === null || _b === void 0 ? void 0 : _b.description }))) : null) : (members.map(function (member) {
                var _a, _b;
                var filtedOptions = options.filter(function (o) { return !members.find(function (m) { return m !== member && m.name === o.value; }); });
                return (react_1.default.createElement("div", { key: member.key, className: cx('JSONSchemaMember') },
                    react_1.default.createElement("div", { className: cx('JSONSchemaMember-key') }, member.nameMutable ? (react_1.default.createElement(react_1.default.Fragment, null, renderKey ? (renderKey(member.name, onMemberKeyChange.bind(null, member), member.schema, props)) : filtedOptions.length ? (allowInput ? (react_1.default.createElement(InputBoxWithSuggestion_1.default, { value: member.name, hasError: member.invalid, onChange: onMemberKeyChange.bind(null, member), clearable: false, placeholder: __('JSONSchema.key'), options: filtedOptions })) : (react_1.default.createElement(Select_1.default, { simpleValue: true, block: true, value: member.name, hasError: member.invalid, onChange: onMemberKeyChange.bind(null, member), clearable: false, placeholder: __('JSONSchema.key'), options: filtedOptions }))) : (react_1.default.createElement(InputBox_1.default, { value: member.name, hasError: member.invalid, onChange: onMemberKeyChange.bind(null, member), clearable: false, placeholder: __('JSONSchema.key') })))) : (react_1.default.createElement("span", null,
                        member.required ? (react_1.default.createElement("span", { className: cx("Form-star") }, "*")) : null,
                        ((_a = member.schema) === null || _a === void 0 ? void 0 : _a.title) || member.name))),
                    react_1.default.createElement("div", { className: cx('JSONSchemaMember-value') },
                        react_1.default.createElement(Item_1.InputJSONSchemaItem, (0, tslib_1.__assign)({}, props, { value: value === null || value === void 0 ? void 0 : value[member.name], onChange: onMemberChange.bind(null, member), schema: member.schema || {
                                type: 'string'
                            }, placeholder: (_b = member.schema) === null || _b === void 0 ? void 0 : _b.description, collapsable: true }))),
                    !member.required ? (react_1.default.createElement(Button_1.default, { className: cx('SchemaEditor-btn'), onClick: onMemberDelete.bind(null, member), iconOnly: true, disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) },
                        react_1.default.createElement(icons_1.Icon, { icon: "remove", className: "icon" }))) : null));
            })),
            allowAdd && !collapsed ? (react_1.default.createElement(Button_1.default, { level: "link", onClick: handleAdd, size: "xs", disabled: disabled }, __('JSONSchema.add_prop'))) : null)));
}
exports.InputJSONSchemaObject = InputJSONSchemaObject;
//# sourceMappingURL=./components/json-schema/Object.js.map
