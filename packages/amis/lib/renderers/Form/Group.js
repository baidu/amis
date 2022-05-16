"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlGroupRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../../factory");
var helper_1 = require("../../utils/helper");
var Item_1 = require("./Item");
var ControlGroupRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ControlGroupRenderer, _super);
    function ControlGroupRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.renderInput = _this.renderInput.bind(_this);
        return _this;
    }
    ControlGroupRenderer.prototype.renderControl = function (control, index, otherProps) {
        var _a = this.props, render = _a.render, disabled = _a.disabled, data = _a.data, mode = _a.mode, horizontal = _a.horizontal, formMode = _a.formMode, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal;
        if (!control) {
            return null;
        }
        var subSchema = control;
        return render("".concat(index), subSchema, (0, tslib_1.__assign)({ disabled: disabled, formMode: subFormMode || mode || formMode, formHorizontal: subFormHorizontal || horizontal || formHorizontal }, otherProps));
    };
    ControlGroupRenderer.prototype.renderVertical = function (props) {
        var _this = this;
        if (props === void 0) { props = this.props; }
        var body = props.body, className = props.className, cx = props.classnames, mode = props.mode, formMode = props.formMode, data = props.data;
        formMode = mode || formMode;
        if (!Array.isArray(body)) {
            return null;
        }
        return (react_1.default.createElement("div", { className: cx("Form-group Form-group--ver Form-group--".concat(formMode), className) }, body.map(function (control, index) {
            if (!(0, helper_1.isVisible)(control, data)) {
                return null;
            }
            return _this.renderControl(control, index, {
                key: index
            });
        })));
    };
    ControlGroupRenderer.prototype.renderHorizontal = function (props) {
        var _this = this;
        if (props === void 0) { props = this.props; }
        var body = props.body, className = props.className, ns = props.classPrefix, cx = props.classnames, mode = props.mode, horizontal = props.horizontal, formMode = props.formMode, formHorizontal = props.formHorizontal, subFormMode = props.subFormMode, subFormHorizontal = props.subFormHorizontal, data = props.data, gap = props.gap;
        if (!Array.isArray(body)) {
            return null;
        }
        formMode = subFormMode || mode || formMode;
        var horizontalDeeper = subFormHorizontal ||
            horizontal ||
            (formHorizontal
                ? (0, helper_1.makeHorizontalDeeper)(formHorizontal, body.filter(function (item) {
                    var _a;
                    return ((_a = item) === null || _a === void 0 ? void 0 : _a.mode) !== 'inline' &&
                        (0, helper_1.isVisible)(item, data);
                }).length)
                : undefined);
        return (react_1.default.createElement("div", { className: cx("Form-group Form-group--hor Form-group--".concat(formMode), gap ? "Form-group--".concat(gap) : '', className) }, body.map(function (control, index) {
            var _a;
            if (!(0, helper_1.isVisible)(control, data)) {
                return null;
            }
            var controlMode = ((_a = control) === null || _a === void 0 ? void 0 : _a.mode) || formMode;
            if (controlMode === 'inline' ||
                (control && control.type === 'formula')) {
                return _this.renderControl(control, index, {
                    key: index,
                    className: cx(control.className, control.columnClassName)
                });
            }
            var columnWidth = control.columnRatio ||
                (0, helper_1.getWidthRate)(control && control.columnClassName, true);
            return (react_1.default.createElement("div", { key: index, className: cx("".concat(ns, "Form-groupColumn"), columnWidth ? "".concat(ns, "Form-groupColumn--").concat(columnWidth) : '', control && control.columnClassName) }, _this.renderControl(control, index, {
                formHorizontal: horizontalDeeper,
                formMode: controlMode
            })));
        })));
    };
    ControlGroupRenderer.prototype.renderInput = function (props) {
        if (props === void 0) { props = this.props; }
        var direction = props.direction;
        return direction === 'vertical'
            ? this.renderVertical(props)
            : this.renderHorizontal(props);
    };
    ControlGroupRenderer.prototype.render = function () {
        var _a = this.props, label = _a.label, rest = (0, tslib_1.__rest)(_a, ["label"]);
        if (typeof label !== 'undefined') {
            return (react_1.default.createElement(Item_1.FormItemWrap, (0, tslib_1.__assign)({}, rest, { sizeMutable: false, label: label, renderControl: this.renderInput })));
        }
        return this.renderInput();
    };
    ControlGroupRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'group'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object])
    ], ControlGroupRenderer);
    return ControlGroupRenderer;
}(react_1.default.Component));
exports.ControlGroupRenderer = ControlGroupRenderer;
//# sourceMappingURL=./renderers/Form/Group.js.map
