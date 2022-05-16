"use strict";
/**
 * @file TitleBar。
 * @description
 * @author fex
 * @param 参数说明：
 * title 标题内容
 * titleClassName 标题类名，默认为 bg-light lter b-b
 * right 可以传入右侧节点, 当有右侧时自动采用 hbox 来左右布局。
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBar = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var TitleBar = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TitleBar, _super);
    function TitleBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TitleBar.prototype.render = function () {
        var _a = this.props, className = _a.className, title = _a.title, titleClassName = _a.titleClassName, right = _a.right, cx = _a.classnames;
        var left = title ? react_1.default.createElement("div", { className: titleClassName }, title) : null;
        var body = left;
        if (right) {
            body = (react_1.default.createElement("div", { className: "hbox hbox-auto-xs h-auto" },
                react_1.default.createElement("div", { className: "col bg-light b-b wrapper" }, left),
                react_1.default.createElement("div", { className: "col v-middle padder-md text-right bg-light b-b wrapper-sm" }, right)));
        }
        else {
            body = react_1.default.createElement("div", { className: "wrapper" }, left);
        }
        return react_1.default.createElement("div", { className: cx(className, 'TitleBar') }, body);
    };
    TitleBar.defaultProps = {
        className: 'bg-light lter b-b',
        title: '标题',
        titleClassName: 'm-n font-thin h3',
        right: false
    };
    return TitleBar;
}(react_1.default.PureComponent));
exports.TitleBar = TitleBar;
exports.default = (0, theme_1.themeable)(TitleBar);
//# sourceMappingURL=./components/TitleBar.js.map
