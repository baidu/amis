"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaEditorItemObject = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../../utils/helper");
var Button_1 = (0, tslib_1.__importDefault)(require("../Button"));
var icons_1 = require("../icons");
var InputBox_1 = (0, tslib_1.__importDefault)(require("../InputBox"));
var Common_1 = require("./Common");
var Item_1 = require("./Item");
var SchemaEditorItemObject = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaEditorItemObject, _super);
    function SchemaEditorItemObject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            members: _this.propsToMembers(_this.props),
            collapsed: false
        };
        return _this;
    }
    SchemaEditorItemObject.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        // 外部属性变化，更新 state
        if (props.value !== prevProps.value &&
            JSON.stringify(props.value) !== JSON.stringify(this.lastValue)) {
            this.setState({
                members: this.propsToMembers(props)
            });
        }
    };
    SchemaEditorItemObject.prototype.propsToMembers = function (props) {
        var _a, _b;
        var members = [];
        var required = Array.isArray((_a = props.value) === null || _a === void 0 ? void 0 : _a.required)
            ? props.value.required
            : [];
        if ((_b = props.value) === null || _b === void 0 ? void 0 : _b.properties) {
            var properties_1 = props.value.properties;
            Object.keys(properties_1).forEach(function (key) {
                var value = properties_1[key];
                members.push({
                    id: (0, helper_1.guid)(),
                    key: key || '',
                    hasError: !key || members.some(function (i) { return i.key === key; }),
                    required: !!~required.indexOf(key),
                    schema: value
                });
            });
        }
        return members;
    };
    SchemaEditorItemObject.prototype.pipeOut = function () {
        var members = this.state.members;
        var _a = this.props, value = _a.value, onChange = _a.onChange;
        var properties = {};
        var required = [];
        members
            .filter(function (item) { return !item.hasError; })
            .forEach(function (member) {
            properties[member.key] = member.schema;
            if (member.required) {
                required.push(member.key);
            }
        });
        this.lastValue = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), { properties: properties, required: required });
        onChange === null || onChange === void 0 ? void 0 : onChange(this.lastValue);
    };
    SchemaEditorItemObject.prototype.handleAdd = function () {
        var members = this.state.members.concat();
        members.push({
            id: (0, helper_1.guid)(),
            key: '',
            hasError: true,
            required: false,
            schema: {
                type: 'string'
            }
        });
        this.setState({
            members: members
        }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.handlePropKeyChange = function (index, key) {
        var members = this.state.members.concat();
        members[index] = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, members[index]), { key: key, hasError: !key || members.some(function (m, i) { return i !== index && m.key === key; }) });
        this.setState({ members: members }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.handlePropTitleChange = function (index, title) {
        var members = this.state.members.concat();
        members[index] = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, members[index]), { schema: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, members[index].schema), { title: title }) });
        this.setState({ members: members }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.handlePropRemove = function (index) {
        var members = this.state.members.concat();
        members.splice(index, 1);
        this.setState({ members: members }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.handlePropChange = function (index, item) {
        var members = this.state.members.concat();
        members[index] = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, members[index]), { schema: (0, tslib_1.__assign)({}, item) });
        this.setState({ members: members }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.handlePropRequiredChange = function (index, required) {
        var members = this.state.members.concat();
        members[index] = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, members[index]), { required: required });
        this.setState({ members: members }, this.pipeOut);
    };
    SchemaEditorItemObject.prototype.toggleCollapsed = function () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };
    SchemaEditorItemObject.prototype.rendererProps = function () {
        var _this = this;
        var _a = this.props, value = _a.value, __ = _a.translate, cx = _a.classnames, renderExtraProps = _a.renderExtraProps, renderModalProps = _a.renderModalProps, locale = _a.locale, classPrefix = _a.classPrefix, disabled = _a.disabled, showInfo = _a.showInfo, types = _a.types, onTypeChange = _a.onTypeChange, enableAdvancedSetting = _a.enableAdvancedSetting;
        var members = this.state.members;
        return (react_1.default.createElement("div", { className: cx('SchemaEditorProps', {
                'SchemaEditorProps--depth': showInfo !== false
            }) },
            members.length ? (members.map(function (member, index) { return (react_1.default.createElement(Item_1.SchemaEditorItem, { key: member.id, types: types, onTypeChange: onTypeChange, enableAdvancedSetting: enableAdvancedSetting, prefix: react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(InputBox_1.default, { className: cx('SchemaEditor-key'), hasError: member.hasError, value: member.key || '', onChange: _this.handlePropKeyChange.bind(_this, index), placeholder: __('JSONSchema.key'), disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) }),
                    react_1.default.createElement(InputBox_1.default, { className: cx('SchemaEditor-title'), value: member.schema.title || '', onChange: _this.handlePropTitleChange.bind(_this, index), placeholder: __('JSONSchema.title'), disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) })), affix: react_1.default.createElement(Button_1.default, { className: cx('SchemaEditor-btn'), onClick: _this.handlePropRemove.bind(_this, index), iconOnly: true, disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) },
                    react_1.default.createElement(icons_1.Icon, { icon: "remove", className: "icon" })), value: member.schema, onChange: _this.handlePropChange.bind(_this, index), renderExtraProps: renderExtraProps, renderModalProps: renderModalProps, locale: locale, translate: __, classnames: cx, classPrefix: classPrefix, disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref), required: member.required, onRequiredChange: _this.handlePropRequiredChange.bind(_this, index) })); })) : (react_1.default.createElement("div", { className: cx('SchemaEditorProps-placeholder') }, __('placeholder.empty'))),
            react_1.default.createElement(Button_1.default, { level: "link", onClick: this.handleAdd, size: "xs", disabled: disabled || !!(value === null || value === void 0 ? void 0 : value.$ref) }, __('JSONSchema.add_prop'))));
    };
    SchemaEditorItemObject.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, showInfo = _a.showInfo, __ = _a.translate, disabled = _a.disabled;
        return (react_1.default.createElement("div", { className: cx('SchemaEditorItem SchemaEditorObject', {
                'is-collapsed': this.state.collapsed
            }) },
            showInfo !== false ? (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("a", { className: cx('SchemaEditor-caret', {
                        'is-collapsed': this.state.collapsed
                    }), onClick: this.toggleCollapsed },
                    react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" })),
                this.renderCommon())) : null,
            this.state.collapsed ? null : this.rendererProps()));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "pipeOut", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handleAdd", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handlePropKeyChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handlePropTitleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handlePropRemove", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handlePropChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "handlePropRequiredChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditorItemObject.prototype, "toggleCollapsed", null);
    return SchemaEditorItemObject;
}(Common_1.SchemaEditorItemCommon));
exports.SchemaEditorItemObject = SchemaEditorItemObject;
//# sourceMappingURL=./components/schema-editor/Object.js.map
