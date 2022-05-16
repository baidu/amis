"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopOverContainer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var Overlay_1 = (0, tslib_1.__importDefault)(require("./Overlay"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var PopUp_1 = (0, tslib_1.__importDefault)(require("./PopUp"));
var react_dom_1 = require("react-dom");
var PopOverContainer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PopOverContainer, _super);
    function PopOverContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpened: false
        };
        return _this;
    }
    PopOverContainer.prototype.targetRef = function (target) {
        this.target = target ? (0, react_dom_1.findDOMNode)(target) : null;
    };
    PopOverContainer.prototype.handleClick = function () {
        this.setState({
            isOpened: true
        });
    };
    PopOverContainer.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    PopOverContainer.prototype.getTarget = function () {
        return this.target || (0, react_dom_1.findDOMNode)(this);
    };
    PopOverContainer.prototype.getParent = function () {
        var _a;
        return (_a = this.getTarget()) === null || _a === void 0 ? void 0 : _a.parentElement;
    };
    PopOverContainer.prototype.render = function () {
        var _a = this.props, useMobileUI = _a.useMobileUI, children = _a.children, popOverContainer = _a.popOverContainer, popOverClassName = _a.popOverClassName, dropdownRender = _a.popOverRender;
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement(react_1.default.Fragment, null,
            children({
                isOpened: this.state.isOpened,
                onClick: this.handleClick,
                ref: this.targetRef
            }),
            mobileUI ? (react_1.default.createElement(PopUp_1.default, { isShow: this.state.isOpened, container: popOverContainer, className: popOverClassName, onHide: this.close }, dropdownRender({ onClose: this.close }))) : (react_1.default.createElement(Overlay_1.default, { container: popOverContainer || this.getParent, target: this.getTarget, placement: 'auto', show: this.state.isOpened },
                react_1.default.createElement(PopOver_1.default, { overlay: true, className: popOverClassName, style: {
                        minWidth: this.target
                            ? Math.max(this.target.offsetWidth, 100)
                            : 'auto'
                    }, onHide: this.close }, dropdownRender({ onClose: this.close }))))));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PopOverContainer.prototype, "targetRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PopOverContainer.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PopOverContainer.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PopOverContainer.prototype, "getTarget", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], PopOverContainer.prototype, "getParent", null);
    return PopOverContainer;
}(react_1.default.Component));
exports.PopOverContainer = PopOverContainer;
exports.default = PopOverContainer;
//# sourceMappingURL=./components/PopOverContainer.js.map
