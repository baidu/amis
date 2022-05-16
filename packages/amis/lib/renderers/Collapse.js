"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapseRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Collapse_1 = require("../components/Collapse");
var Collapse = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Collapse, _super);
    function Collapse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collapse.prototype.render = function () {
        var _a = this.props, id = _a.id, ns = _a.classPrefix, cx = _a.classnames, size = _a.size, wrapperComponent = _a.wrapperComponent, headingComponent = _a.headingComponent, className = _a.className, headingClassName = _a.headingClassName, children = _a.children, titlePosition = _a.titlePosition, headerPosition = _a.headerPosition, title = _a.title, collapseTitle = _a.collapseTitle, collapseHeader = _a.collapseHeader, header = _a.header, body = _a.body, bodyClassName = _a.bodyClassName, render = _a.render, collapsable = _a.collapsable, __ = _a.translate, mountOnEnter = _a.mountOnEnter, unmountOnExit = _a.unmountOnExit, showArrow = _a.showArrow, expandIcon = _a.expandIcon, disabled = _a.disabled, collapsed = _a.collapsed, propsUpdate = _a.propsUpdate, onCollapse = _a.onCollapse;
        return (react_1.default.createElement(Collapse_1.Collapse, { id: id, classnames: cx, classPrefix: ns, mountOnEnter: mountOnEnter, unmountOnExit: unmountOnExit, size: size, wrapperComponent: wrapperComponent, headingComponent: headingComponent, className: className, headingClassName: headingClassName, bodyClassName: bodyClassName, headerPosition: titlePosition || headerPosition, collapsable: collapsable, collapsed: collapsed, showArrow: showArrow, disabled: disabled, propsUpdate: propsUpdate, expandIcon: expandIcon
                ? render('arrow-icon', expandIcon || '', {
                    className: cx('Collapse-icon-tranform')
                })
                : null, collapseHeader: collapseTitle || collapseHeader
                ? render('heading', collapseTitle || collapseHeader)
                : null, header: render('heading', title || header || ''), body: children
                ? typeof children === 'function'
                    ? children(this.props)
                    : children
                : body
                    ? render('body', body)
                    : null, onCollapse: onCollapse }));
    };
    return Collapse;
}(react_1.default.Component));
exports.default = Collapse;
var CollapseRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CollapseRenderer, _super);
    function CollapseRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollapseRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'collapse'
        })
    ], CollapseRenderer);
    return CollapseRenderer;
}(Collapse));
exports.CollapseRenderer = CollapseRenderer;
//# sourceMappingURL=./renderers/Collapse.js.map
