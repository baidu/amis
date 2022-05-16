"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Options_1 = require("./Options");
var helper_1 = require("../../utils/helper");
var ListControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListControl, _super);
    function ListControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange === null || onChange === void 0 ? void 0 : onChange('');
        }
        else if (actionType === 'reset') {
            onChange === null || onChange === void 0 ? void 0 : onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    ListControl.prototype.handleDBClick = function (option, e) {
        this.props.onToggle(option, false, true);
        this.props.onAction(null, {
            type: 'submit'
        });
    };
    ListControl.prototype.handleClick = function (option, e) {
        if (e.target && e.target.closest('a,button')) {
            return;
        }
        var onToggle = this.props.onToggle;
        onToggle(option);
    };
    ListControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    ListControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, itemClassName = _a.itemClassName, cx = _a.classnames, className = _a.className, disabled = _a.disabled, options = _a.options, placeholder = _a.placeholder, selectedOptions = _a.selectedOptions, imageClassName = _a.imageClassName, submitOnDBClick = _a.submitOnDBClick, itemSchema = _a.itemSchema, data = _a.data, labelField = _a.labelField, listClassName = _a.listClassName, __ = _a.translate;
        var body = null;
        if (options && options.length) {
            body = (react_1.default.createElement("div", { className: cx('ListControl-items', listClassName) }, options.map(function (option, key) { return (react_1.default.createElement("div", { key: key, className: cx("ListControl-item", itemClassName, {
                    'is-active': ~selectedOptions.indexOf(option),
                    'is-disabled': option.disabled || disabled
                }), onClick: _this.handleClick.bind(_this, option), onDoubleClick: submitOnDBClick
                    ? _this.handleDBClick.bind(_this, option)
                    : undefined }, itemSchema
                ? render("".concat(key, "/body"), itemSchema, {
                    data: (0, helper_1.createObject)(data, option)
                })
                : option.body
                    ? render("".concat(key, "/body"), option.body)
                    : [
                        option.image ? (react_1.default.createElement("div", { key: "image", className: cx('ListControl-itemImage', imageClassName) },
                            react_1.default.createElement("img", { src: option.image, alt: option[labelField || 'label'] }))) : null,
                        option[labelField || 'label'] ? (react_1.default.createElement("div", { key: "label", className: cx('ListControl-itemLabel') }, String(option[labelField || 'label']))) : null
                        // {/* {option.tip ? (<div className={`${ns}ListControl-tip`}>{option.tip}</div>) : null} */}
                    ])); })));
        }
        return (react_1.default.createElement("div", { className: cx('ListControl', className) }, body ? (body) : (react_1.default.createElement("span", { className: cx('ListControl-placeholder') }, __(placeholder)))));
    };
    ListControl.propsList = ['itemSchema', 'value', 'renderFormItems'];
    ListControl.defaultProps = {
        clearable: false,
        imageClassName: '',
        submitOnDBClick: false
    };
    return ListControl;
}(react_1.default.Component));
exports.default = ListControl;
var ListControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ListControlRenderer, _super);
    function ListControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'list-select',
            sizeMutable: false
        })
    ], ListControlRenderer);
    return ListControlRenderer;
}(ListControl));
exports.ListControlRenderer = ListControlRenderer;
//# sourceMappingURL=./renderers/Form/ListSelect.js.map
