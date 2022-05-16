"use strict";
/**
 * 用来定义数据结构的编辑器
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaEditor = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var locale_1 = require("../../locale");
var theme_1 = require("../../theme");
var uncontrollable_1 = require("uncontrollable");
var Item_1 = require("./Item");
var helper_1 = require("../../utils/helper");
var SchemaEditor = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaEditor, _super);
    function SchemaEditor(props) {
        var _this = _super.call(this, props) || this;
        var __ = props.translate;
        _this.defaultTypes = [
            {
                label: __('SchemaType.string'),
                value: 'string'
            },
            {
                label: __('SchemaType.number'),
                value: 'number'
            },
            {
                label: __('SchemaType.integer'),
                value: 'integer'
            },
            {
                label: __('SchemaType.boolean'),
                value: 'boolean'
            },
            {
                label: __('SchemaType.null'),
                value: 'null'
            },
            {
                label: __('SchemaType.object'),
                value: 'object'
            },
            {
                label: __('SchemaType.array'),
                value: 'array'
            }
        ];
        return _this;
    }
    SchemaEditor.prototype.handleTypeChange = function (type, value, origin) {
        var definitions = this.props.definitions;
        if (type === 'array') {
            value.items = {
                type: 'string'
            };
        }
        if (definitions === null || definitions === void 0 ? void 0 : definitions[type]) {
            value = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, value), definitions[type]), { $ref: type });
        }
        return value;
    };
    SchemaEditor.prototype.render = function () {
        var _a = this.props, defaultType = _a.defaultType, cx = _a.classnames, onChange = _a.onChange, renderExtraProps = _a.renderExtraProps, renderModalProps = _a.renderModalProps, translate = _a.translate, locale = _a.locale, classPrefix = _a.classPrefix, rootTypeMutable = _a.rootTypeMutable, showRootInfo = _a.showRootInfo, disabled = _a.disabled, definitions = _a.definitions, enableAdvancedSetting = _a.enableAdvancedSetting;
        var value = this.props.value || {
            type: defaultType || 'object'
        };
        var disabledTypes = Array.isArray(this.props.disabledTypes)
            ? this.props.disabledTypes
            : [];
        var types = this.defaultTypes.concat();
        if (definitions) {
            var keys = Object.keys(definitions);
            keys.forEach(function (key) {
                var definition = definitions[key];
                if ((definition === null || definition === void 0 ? void 0 : definition.type) &&
                    definition.title &&
                    [
                        'string',
                        'number',
                        'integer',
                        'object',
                        'array',
                        'boolean',
                        'null'
                    ].includes(definition.type)) {
                    types.push({
                        value: key,
                        label: translate(definition.title)
                    });
                }
            });
        }
        if (disabledTypes.length) {
            types = types.filter(function (item) { return !~disabledTypes.indexOf(item.value); });
        }
        return (react_1.default.createElement("div", { className: cx('SchemaEditor') },
            react_1.default.createElement(Item_1.SchemaEditorItem, { types: types, typeMutable: rootTypeMutable, showInfo: showRootInfo, value: value, onChange: onChange, renderExtraProps: renderExtraProps, renderModalProps: renderModalProps, locale: locale, translate: translate, classnames: cx, classPrefix: classPrefix, disabled: disabled, onTypeChange: this.handleTypeChange, enableAdvancedSetting: enableAdvancedSetting })));
    };
    SchemaEditor.defaultProps = {
        defaultType: 'object',
        rootTypeMutable: false,
        showRootInfo: false,
        disabledTypes: ['null']
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaEditor.prototype, "handleTypeChange", null);
    return SchemaEditor;
}(react_1.default.Component));
exports.SchemaEditor = SchemaEditor;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(SchemaEditor, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/schema-editor/index.js.map
