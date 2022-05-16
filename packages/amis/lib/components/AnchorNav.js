"use strict";
/**
 * @file AnchorNav
 * @description 锚点导航
 * @author hsm-lv
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnchorNav = exports.AnchorNavSection = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var uncontrollable_1 = require("uncontrollable");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var AnchorNavSectionComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AnchorNavSectionComponent, _super);
    function AnchorNavSectionComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.contentRef = function (ref) { return (_this.contentDom = ref); };
        return _this;
    }
    AnchorNavSectionComponent.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, children = _a.children, className = _a.className;
        return (react_1.default.createElement("div", { ref: this.contentRef, className: cx('AnchorNav-section', className) }, children));
    };
    return AnchorNavSectionComponent;
}(react_1.default.PureComponent));
exports.AnchorNavSection = (0, theme_1.themeable)(AnchorNavSectionComponent);
var AnchorNav = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AnchorNav, _super);
    function AnchorNav() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 滚动区域DOM
        _this.contentDom = react_1.default.createRef();
        return _this;
    }
    AnchorNav.prototype.componentDidMount = function () {
        var _this = this;
        // 初始化滚动标识
        this.setState({ fromSelect: false });
        // add scroll event
        var sectionRootDom = this.contentDom && this.contentDom.current;
        sectionRootDom.addEventListener('scroll', this.scrollToNav);
        var offsetArr = [];
        var _a = this.props, children = _a.children, active = _a.active;
        // 收集段落区域offsetTop
        children &&
            react_1.default.Children.forEach(children, function (section, index) {
                offsetArr.push({
                    key: section.props.name,
                    offsetTop: sectionRootDom.children[index].offsetTop
                });
            });
        this.setState({
            offsetArr: offsetArr
        }, function () { return active && _this.scrollToSection(active); });
    };
    AnchorNav.prototype.scrollToNav = function (e) {
        var _this = this;
        if (this.state.fromSelect) {
            return;
        }
        // 获取滚动的scrollTop
        var scrollTop = e.target.scrollTop;
        // 判断scrollTop所在区域
        var offsetArr = this.state.offsetArr;
        var firstSection = offsetArr[0];
        var lastSection = offsetArr[offsetArr.length - 1];
        // 首层偏移
        var offset = scrollTop + firstSection.offsetTop;
        // 首层
        if (offset <= firstSection.offsetTop) {
            this.fireSelect(firstSection.key);
        }
        // 最后一层
        else if (offset >= lastSection.offsetTop) {
            this.fireSelect(lastSection.key);
        }
        else {
            // 段落区间判断
            offsetArr.forEach(function (item, index) {
                if (offset >= item.offsetTop &&
                    offset < offsetArr[index + 1].offsetTop) {
                    _this.fireSelect(item.key);
                }
            });
        }
    };
    AnchorNav.prototype.scrollToSection = function (key) {
        // 获取指定段落的offsettop
        var offsetArr = this.state.offsetArr;
        var section = (0, find_1.default)(offsetArr, function (item) { return item.key === key; });
        var sectionRootDom = this.contentDom && this.contentDom.current;
        // 滚动到指定段落
        section &&
            (sectionRootDom.scrollTop = section.offsetTop - offsetArr[0].offsetTop);
    };
    AnchorNav.prototype.handleSelect = function (key) {
        // 标记滚动来自导航选择
        this.setState({ fromSelect: true });
        // 滚动到对应段落
        this.scrollToSection(key);
        var sectionRootDom = this.contentDom && this.contentDom.current;
        // 如果已经滚到底就不去更新导航选中了
        if (sectionRootDom.scrollHeight - sectionRootDom.scrollTop <
            sectionRootDom.clientHeight) {
            // fire event
            this.fireSelect(key);
        }
        // 取消标记
        this.setState({ fromSelect: false });
    };
    AnchorNav.prototype.fireSelect = function (key) {
        var onSelect = this.props.onSelect;
        onSelect && onSelect(key);
    };
    AnchorNav.prototype.renderLink = function (link, index) {
        var _this = this;
        if (!link) {
            return;
        }
        var _a = this.props, cx = _a.classnames, activeProp = _a.active;
        var _b = link.props, title = _b.title, name = _b.name;
        var active = activeProp === undefined && index === 0 ? name : activeProp;
        return (react_1.default.createElement("li", { className: cx('AnchorNav-link', active === name ? 'is-active' : ''), key: index, onClick: function () { return _this.handleSelect(name); } },
            react_1.default.createElement("a", null, title)));
    };
    AnchorNav.prototype.renderSection = function (section, index) {
        if (!section) {
            return;
        }
        var _a = this.props, activeProp = _a.active, classnames = _a.classnames;
        var name = section.props.name;
        var active = activeProp === undefined && index === 0 ? name : activeProp;
        return react_1.default.cloneElement(section, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, section.props), { key: index, classnames: classnames, active: active }));
    };
    AnchorNav.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = this.props, cx = _b.classnames, className = _b.className, linkClassName = _b.linkClassName, sectionClassName = _b.sectionClassName, children = _b.children, direction = _b.direction;
        if (!Array.isArray(children)) {
            return null;
        }
        return (react_1.default.createElement("div", { className: cx('AnchorNav', (_a = {},
                _a["AnchorNav--".concat(direction)] = direction,
                _a), className) },
            react_1.default.createElement("ul", { className: cx('AnchorNav-link-wrap', linkClassName), role: "anchorlist" }, children.map(function (link, index) { return _this.renderLink(link, index); })),
            react_1.default.createElement("div", { className: cx('AnchorNav-section-wrap', sectionClassName), ref: this.contentDom }, children.map(function (section, index) {
                return _this.renderSection(section, index);
            }))));
    };
    var _a;
    AnchorNav.defaultProps = {
        linkClassName: '',
        sectionClassName: '',
        direction: 'vertical'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Event !== "undefined" && Event) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], AnchorNav.prototype, "scrollToNav", null);
    return AnchorNav;
}(react_1.default.Component));
exports.AnchorNav = AnchorNav;
var ThemedAnchorNav = (0, theme_1.themeable)((0, uncontrollable_1.uncontrollable)(AnchorNav, {
    active: 'onSelect'
}));
exports.default = ThemedAnchorNav;
//# sourceMappingURL=./components/AnchorNav.js.map
