"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldSetRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../../factory");
var Collapse_1 = (0, tslib_1.__importDefault)(require("../Collapse"));
var FieldSetControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FieldSetControl, _super);
    function FieldSetControl(props) {
        var _this = _super.call(this, props) || this;
        _this.renderBody = _this.renderBody.bind(_this);
        return _this;
    }
    FieldSetControl.prototype.renderBody = function () {
        var _a = this.props, body = _a.body, collapsable = _a.collapsable, horizontal = _a.horizontal, render = _a.render, mode = _a.mode, formMode = _a.formMode, cx = _a.classnames, store = _a.store, formClassName = _a.formClassName, disabled = _a.disabled, formHorizontal = _a.formHorizontal, subFormMode = _a.subFormMode, subFormHorizontal = _a.subFormHorizontal;
        var props = {
            store: store,
            data: store.data,
            render: render,
            disabled: disabled,
            formMode: subFormMode || formMode,
            formHorizontal: subFormHorizontal || formHorizontal
        };
        mode && (props.mode = mode);
        typeof collapsable !== 'undefined' && (props.collapsable = collapsable);
        horizontal && (props.horizontal = horizontal);
        return (react_1.default.createElement("div", { className: cx("Form--".concat(props.mode || formMode || 'normal'), formClassName) }, body ? render('body', body, props) : null));
    };
    FieldSetControl.prototype.render = function () {
        var _a = this.props, controls = _a.controls, className = _a.className, mode = _a.mode, body = _a.body, rest = (0, tslib_1.__rest)(_a, ["controls", "className", "mode", "body"]);
        return (react_1.default.createElement(Collapse_1.default, (0, tslib_1.__assign)({}, rest, { body: body, className: className, children: this.renderBody, wrapperComponent: "fieldset", headingComponent: rest.titlePosition === 'bottom' ? 'div' : 'legend' })));
    };
    FieldSetControl.defaultProps = {
        titlePosition: 'top',
        headingClassName: '',
        collapsable: false
    };
    return FieldSetControl;
}(react_1.default.Component));
exports.default = FieldSetControl;
var FieldSetRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FieldSetRenderer, _super);
    function FieldSetRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FieldSetRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'fieldset',
            weight: -100,
            name: 'fieldset'
        })
    ], FieldSetRenderer);
    return FieldSetRenderer;
}(FieldSetControl));
exports.FieldSetRenderer = FieldSetRenderer;
//# sourceMappingURL=./renderers/Form/FieldSet.js.map
