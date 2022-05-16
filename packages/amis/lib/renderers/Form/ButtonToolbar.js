"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonToolbarRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var ButtonToolbar = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ButtonToolbar, _super);
    function ButtonToolbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 这个方法editor里要用作hack，所以不能删掉这个方法
     * @returns
     */
    ButtonToolbar.prototype.renderButtons = function () {
        var _a = this.props, render = _a.render, ns = _a.classPrefix, buttons = _a.buttons;
        return Array.isArray(buttons)
            ? buttons.map(function (button, key) {
                return render("button/".concat(key), button, {
                    key: key
                });
            })
            : null;
    };
    ButtonToolbar.prototype.render = function () {
        var _a = this.props, buttons = _a.buttons, className = _a.className, cx = _a.classnames, render = _a.render;
        return (react_1.default.createElement("div", { className: cx('ButtonToolbar', className) }, this.renderButtons()));
    };
    ButtonToolbar.propsList = ['buttons', 'className'];
    return ButtonToolbar;
}(react_1.default.Component));
exports.default = ButtonToolbar;
var ButtonToolbarRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ButtonToolbarRenderer, _super);
    function ButtonToolbarRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonToolbarRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'button-toolbar',
            strictMode: false
        })
    ], ButtonToolbarRenderer);
    return ButtonToolbarRenderer;
}(ButtonToolbar));
exports.ButtonToolbarRenderer = ButtonToolbarRenderer;
//# sourceMappingURL=./renderers/Form/ButtonToolbar.js.map
