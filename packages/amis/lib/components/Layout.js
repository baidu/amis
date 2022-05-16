"use strict";
/**
 * @file Layout
 * @description 页面布局，支持左边栏、顶部、内容区域布局。
 * @author fex
 *
 * @param 参数说明：
 * * children 会渲染在内容区。
 * * header 头部区域
 * * aside 边栏
 * * asideClassName 边栏附加样式class
 * * footer 页脚
 * * folder 是否收起边栏
 * * asideFixed 边栏是否为固定模式，如果是会用 position:fixed 来定位.
 * * className 附件的样式名
 * * contentClassName 内容区域附加样式名称
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
function Layout(_a) {
    var _b;
    var header = _a.header, headerClassName = _a.headerClassName, aside = _a.aside, asideClassName = _a.asideClassName, children = _a.children, className = _a.className, contentClassName = _a.contentClassName, folded = _a.folded, asideFixed = _a.asideFixed, headerFixed = _a.headerFixed, footer = _a.footer, offScreen = _a.offScreen, size = _a.size, boxed = _a.boxed, cx = _a.classnames, bodyClassName = _a.bodyClassName;
    var body = (react_1.default.createElement("div", { className: cx("Layout-body", contentClassName) }, children));
    if (aside) {
        body = (react_1.default.createElement("div", { className: cx('Layout-content'), role: "main" }, body));
    }
    react_1.default.useEffect(function () {
        bodyClassName && document.body.classList.add(bodyClassName);
        return function () {
            bodyClassName && document.body.classList.remove(bodyClassName);
        };
    }, [bodyClassName]);
    return (react_1.default.createElement("div", { className: cx("Layout", className, (_b = {
                'Layout--boxed': boxed,
                'Layout--withAside': !!aside,
                'Layout--headerFixed': header ? headerFixed : false,
                'Layout--asideFixed': aside ? asideFixed : false,
                'Layout--folded': folded,
                'Layout--offScreen': offScreen
            },
            _b["Layout--".concat(size)] = size,
            _b['Layout--noFooter'] = !footer,
            _b)) },
        header ? (react_1.default.createElement("div", { className: cx('Layout-header', headerClassName) }, header)) : null,
        aside ? (react_1.default.createElement("div", { className: cx("Layout-aside", asideClassName) },
            react_1.default.createElement("div", { className: cx('Layout-asideWrap') },
                react_1.default.createElement("div", { id: "asideInner", className: cx('Layout-asideInner') }, aside)))) : null,
        body,
        footer ? (react_1.default.createElement("footer", { className: cx('Layout-footer'), role: "footer" }, footer)) : null));
}
exports.Layout = Layout;
Layout.defaultProps = {
    // asideWide: false,
    asideFixed: true,
    asideClassName: '',
    headerFixed: true,
    offScreen: false,
    footer: false
};
exports.default = (0, theme_1.themeable)(Layout);
//# sourceMappingURL=./components/Layout.js.map
