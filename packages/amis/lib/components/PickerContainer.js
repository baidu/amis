"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickerContainer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var Modal_1 = (0, tslib_1.__importDefault)(require("./Modal"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var PickerContainer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PickerContainer, _super);
    function PickerContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpened: false,
            value: _this.props.value
        };
        _this.bodyRef = react_1.default.createRef();
        return _this;
    }
    PickerContainer.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.value !== prevProps.value) {
            this.setState({
                value: props.value
            });
        }
    };
    PickerContainer.prototype.handleClick = function () {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var state, _c;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = [{}];
                        return [4 /*yield*/, ((_b = (_a = this.props).onPickerOpen) === null || _b === void 0 ? void 0 : _b.call(_a, this.props))];
                    case 1:
                        state = tslib_1.__assign.apply(void 0, [tslib_1.__assign.apply(void 0, _c.concat([(_d.sent())])), { isOpened: true }]);
                        this.setState(state, function () { var _a, _b; return (_b = (_a = _this.props).onFocus) === null || _b === void 0 ? void 0 : _b.call(_a); });
                        return [2 /*return*/];
                }
            });
        });
    };
    PickerContainer.prototype.close = function (e, callback) {
        var _this = this;
        this.setState({
            isOpened: false
        }, function () {
            var _a, _b, _c, _d;
            (_b = (_a = _this.props).onClose) === null || _b === void 0 ? void 0 : _b.call(_a);
            if (callback) {
                callback();
                return;
            }
            (_d = (_c = _this.props).onCancel) === null || _d === void 0 ? void 0 : _d.call(_c);
        });
    };
    PickerContainer.prototype.handleChange = function (value) {
        this.setState({
            value: value
        });
    };
    PickerContainer.prototype.confirm = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, onConfirm, beforeConfirm, ret, state;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, onConfirm = _a.onConfirm, beforeConfirm = _a.beforeConfirm;
                        return [4 /*yield*/, (beforeConfirm === null || beforeConfirm === void 0 ? void 0 : beforeConfirm(this.bodyRef.current))];
                    case 1:
                        ret = _b.sent();
                        state = {
                            isOpened: false
                        };
                        // beforeConfirm 返回 false 则阻止后续动作
                        if (ret === false) {
                            return [2 /*return*/];
                        }
                        else if ((0, helper_1.isObject)(ret)) {
                            state.value = ret;
                        }
                        this.setState(state, function () { return onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm(_this.state.value); });
                        return [2 /*return*/];
                }
            });
        });
    };
    PickerContainer.prototype.updateState = function (state) {
        if (state === void 0) { state = {}; }
        var isOpened = state.isOpened, rest = (0, tslib_1.__rest)(state, ["isOpened"]);
        this.setState((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.state), rest));
    };
    PickerContainer.prototype.render = function () {
        var _a = this.props, children = _a.children, popOverRender = _a.bodyRender, title = _a.title, showTitle = _a.showTitle, headerClassName = _a.headerClassName, __ = _a.translate, size = _a.size;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            children({
                isOpened: this.state.isOpened,
                onClick: this.handleClick,
                setState: this.updateState
            }),
            react_1.default.createElement(Modal_1.default, { size: size, closeOnEsc: true, show: this.state.isOpened, onHide: this.close },
                showTitle !== false ? (react_1.default.createElement(Modal_1.default.Header, { onClose: this.close, className: headerClassName }, __(title || 'Select.placeholder'))) : null,
                react_1.default.createElement(Modal_1.default.Body, null, popOverRender((0, tslib_1.__assign)((0, tslib_1.__assign)({}, this.state), { ref: this.bodyRef, setState: this.updateState, onClose: this.close, onChange: this.handleChange }))),
                react_1.default.createElement(Modal_1.default.Footer, null,
                    react_1.default.createElement(Button_1.default, { onClick: this.close }, __('cancel')),
                    react_1.default.createElement(Button_1.default, { onClick: this.confirm, level: "primary" }, __('confirm'))))));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], PickerContainer.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Function]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PickerContainer.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PickerContainer.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], PickerContainer.prototype, "confirm", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PickerContainer.prototype, "updateState", null);
    return PickerContainer;
}(react_1.default.Component));
exports.PickerContainer = PickerContainer;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(PickerContainer));
//# sourceMappingURL=./components/PickerContainer.js.map
