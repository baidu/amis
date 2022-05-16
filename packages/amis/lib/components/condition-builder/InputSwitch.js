"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSwitch = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("../PopOverContainer"));
var icons_1 = require("../icons");
var GroupedSelection_1 = (0, tslib_1.__importDefault)(require("../GroupedSelection"));
var theme_1 = require("../../theme");
var option2value = function (item) { return item.value; };
function InputSwitch(_a) {
    var options = _a.options, value = _a.value, onChange = _a.onChange, cx = _a.classnames, disabled = _a.disabled, popOverContainer = _a.popOverContainer;
    return (react_1.default.createElement(PopOverContainer_1.default, { popOverContainer: popOverContainer, popOverRender: function (_a) {
            var onClose = _a.onClose;
            return (react_1.default.createElement(GroupedSelection_1.default, { onClick: onClose, option2value: option2value, onChange: onChange, options: options, value: value, multiple: false, disabled: disabled }));
        } }, function (_a) {
        var onClick = _a.onClick, isOpened = _a.isOpened, ref = _a.ref;
        return (react_1.default.createElement("div", { className: cx('CBInputSwitch', isOpened ? 'is-active' : '') },
            react_1.default.createElement("a", { onClick: onClick, ref: ref },
                react_1.default.createElement(icons_1.Icon, { icon: "ellipsis-v" }))));
    }));
}
exports.InputSwitch = InputSwitch;
exports.default = (0, theme_1.themeable)(InputSwitch);
//# sourceMappingURL=./components/condition-builder/InputSwitch.js.map
