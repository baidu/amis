"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationRenderer = exports.Navigation = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var rc_overflow_1 = (0, tslib_1.__importDefault)(require("rc-overflow"));
var factory_1 = require("../factory");
var filter_schema_1 = (0, tslib_1.__importDefault)(require("../utils/filter-schema"));
var tpl_1 = require("../utils/tpl");
var helper_1 = require("../utils/helper");
var icon_1 = require("../utils/icon");
var api_1 = require("../utils/api");
var theme_1 = require("../theme");
var icons_1 = require("../components/icons");
var Badge_1 = require("../components/Badge");
var WithRemoteConfig_1 = require("../components/WithRemoteConfig");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../components/Spinner"));
var PopOverContainer_1 = (0, tslib_1.__importDefault)(require("../components/PopOverContainer"));
var Scoped_1 = require("../Scoped");
var Navigation = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Navigation, _super);
    function Navigation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startPoint = {
            y: 0,
            x: 0
        };
        _this.state = {};
        return _this;
    }
    Navigation.prototype.handleClick = function (link) {
        var _a = this.props, env = _a.env, onSelect = _a.onSelect;
        // 和 action 里命名一致方便分析
        if (link && link.to) {
            env === null || env === void 0 ? void 0 : env.tracker({
                eventType: 'link',
                eventData: {
                    label: link.label,
                    link: link.to
                }
            });
        }
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(link);
    };
    Navigation.prototype.toggleLink = function (target, forceFold) {
        var _a, _b;
        (_b = (_a = this.props).onToggle) === null || _b === void 0 ? void 0 : _b.call(_a, target, forceFold);
    };
    Navigation.prototype.getDropInfo = function (e, id, depth) {
        var _a, _b;
        var _c = this.props, dragOnSameLevel = _c.dragOnSameLevel, indentSize = _c.indentSize;
        var rect = e.target.getBoundingClientRect();
        var dragLink = (_a = this.dragNode) === null || _a === void 0 ? void 0 : _a.link;
        var top = rect.top, height = rect.height, width = rect.width;
        var clientY = e.clientY, clientX = e.clientX;
        var left = depth * ((_b = parseInt(indentSize, 10)) !== null && _b !== void 0 ? _b : 24);
        var deltaX = left + width * 0.2;
        var position;
        if (clientY >= top + height / 2) {
            position = 'bottom';
        }
        else {
            position = 'top';
        }
        if (!dragOnSameLevel &&
            position === 'bottom' &&
            clientX >= this.startPoint.x + deltaX) {
            position = 'self';
        }
        return {
            nodeId: id,
            dragLink: dragLink,
            position: position,
            rect: rect,
            height: height,
            left: left
        };
    };
    Navigation.prototype.updateDropIndicator = function (e) {
        var _a, _b;
        var dragOnSameLevel = this.props.dragOnSameLevel;
        var target = e.target; // a标签
        var targetId = target.getAttribute('data-id');
        var targetDepth = Number(target.getAttribute('data-depth'));
        if (dragOnSameLevel &&
            ((_a = this.dragNode) === null || _a === void 0 ? void 0 : _a.node.parentElement) !== ((_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement)) {
            this.setState({ dropIndicator: undefined });
            this.dropInfo = null;
            return;
        }
        this.dropInfo = this.getDropInfo(e, targetId, targetDepth);
        var _c = this.dropInfo, position = _c.position, rect = _c.rect, dragLink = _c.dragLink, height = _c.height, left = _c.left;
        if (targetId === (dragLink === null || dragLink === void 0 ? void 0 : dragLink.__id)) {
            this.setState({ dropIndicator: undefined });
            this.dropInfo = null;
            return;
        }
        var ul = (0, react_dom_1.findDOMNode)(this).firstChild;
        if (position === 'self') {
            this.setState({
                dropIndicator: {
                    top: rect.top - ul.getBoundingClientRect().top,
                    left: left,
                    width: ul.getBoundingClientRect().width - left,
                    height: height,
                    opacity: 0.2
                }
            });
        }
        else {
            this.setState({
                dropIndicator: {
                    top: (position === 'bottom' ? rect.top + rect.height : rect.top) -
                        ul.getBoundingClientRect().top,
                    left: left,
                    width: ul.getBoundingClientRect().width - left
                }
            });
        }
    };
    Navigation.prototype.handleDragStart = function (link) {
        var _this = this;
        return function (e) {
            e.stopPropagation();
            var currentTarget = e.currentTarget;
            e.dataTransfer.effectAllowed = 'copyMove';
            e.dataTransfer.setDragImage(currentTarget, 0, 0);
            _this.dragNode = {
                node: currentTarget,
                link: link
            };
            _this.dropInfo = null;
            _this.startPoint = {
                x: e.clientX,
                y: e.clientY
            };
            currentTarget.addEventListener('dragend', _this.handleDragEnd);
            document.body.addEventListener('dragover', _this.handleDragOver);
        };
    };
    Navigation.prototype.handleDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.dragNode) {
            return;
        }
        var target = e.target;
        var id = target.getAttribute('data-id');
        if (!id) {
            return;
        }
        this.updateDropIndicator(e);
    };
    Navigation.prototype.handleDragEnd = function (e) {
        var _a, _b, _c;
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dropIndicator: undefined
        });
        var currentTarget = e.currentTarget;
        var id = currentTarget.getAttribute('data-id');
        var nodeId = (_a = this.dropInfo) === null || _a === void 0 ? void 0 : _a.nodeId;
        if (!this.dropInfo || !nodeId || id === nodeId) {
            return;
        }
        currentTarget.removeEventListener('dragend', this.handleDragEnd);
        document.body.removeEventListener('dragover', this.handleDragOver);
        (_c = (_b = this.props).onDragUpdate) === null || _c === void 0 ? void 0 : _c.call(_b, this.dropInfo);
        this.dragNode = null;
        this.dropInfo = null;
    };
    Navigation.prototype.renderItem = function (link, index, depth) {
        var _this = this;
        var _a, _b;
        if (depth === void 0) { depth = 1; }
        if (link.hidden === true || link.visible === false) {
            return null;
        }
        var isActive = !!link.active;
        var _c = this.props, disabled = _c.disabled, togglerClassName = _c.togglerClassName, cx = _c.classnames, indentSize = _c.indentSize, render = _c.render, itemActions = _c.itemActions, draggable = _c.draggable, links = _c.links, itemBadge = _c.itemBadge, defaultData = _c.data;
        var hasSub = (link.defer && !link.loaded) || (link.children && link.children.length);
        return (react_1.default.createElement("li", { key: (_a = link.__id) !== null && _a !== void 0 ? _a : index, "data-id": link.__id, className: cx('Nav-item', link.className, {
                'is-disabled': disabled || link.disabled || link.loading,
                'is-active': isActive,
                'is-unfolded': link.unfolded,
                'has-sub': hasSub
            }), onDragStart: this.handleDragStart(link) },
            react_1.default.createElement(Badge_1.Badge, { classnames: cx, badge: itemBadge, data: (0, helper_1.createObject)(defaultData, link) },
                react_1.default.createElement("a", { "data-id": link.__id, "data-depth": depth, title: typeof (link === null || link === void 0 ? void 0 : link.label) === 'string' ? link === null || link === void 0 ? void 0 : link.label : undefined, onClick: this.handleClick.bind(this, link), style: {
                        paddingLeft: depth * ((_b = parseInt(indentSize, 10)) !== null && _b !== void 0 ? _b : 24)
                    } },
                    !disabled && draggable ? (react_1.default.createElement("div", { className: cx('Nav-itemDrager'), draggable: true, onMouseDown: function (e) {
                            _this.toggleLink(link, true);
                            e.stopPropagation();
                        } },
                        react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" }))) : null,
                    link.loading ? (react_1.default.createElement(Spinner_1.default, { size: "sm", show: true, icon: "reload", spinnerClassName: cx('Nav-spinner') })) : hasSub ? (react_1.default.createElement("span", { onClick: function (e) {
                            _this.toggleLink(link);
                            e.stopPropagation();
                        }, className: cx('Nav-itemToggler', togglerClassName) },
                        react_1.default.createElement(icons_1.Icon, { icon: "caret", className: "icon" }))) : null,
                    (0, icon_1.generateIcon)(cx, link.icon, 'Nav-itemIcon'),
                    link.label &&
                        (typeof link.label === 'string'
                            ? link.label
                            : render('inline', link.label))),
                // 更多操作
                itemActions ? (react_1.default.createElement("div", { className: cx('Nav-item-atcions') }, render('inline', itemActions, {
                    data: (0, helper_1.createObject)(defaultData, link)
                }))) : null,
                Array.isArray(link.children) && link.children.length ? (react_1.default.createElement("ul", { className: cx('Nav-subItems') }, link.children.map(function (link, index) {
                    return _this.renderItem(link, index, depth + 1);
                }))) : null)));
    };
    Navigation.prototype.renderOverflowNavs = function (overflowConfig) {
        var _this = this;
        var _a = this.props, render = _a.render, cx = _a.classnames, className = _a.className, loading = _a.loading, _b = _a.links, links = _b === void 0 ? [] : _b;
        var overflowClassName = overflowConfig.overflowClassName, overflowPopoverClassName = overflowConfig.overflowPopoverClassName, overflowListClassName = overflowConfig.overflowListClassName, overflowLabel = overflowConfig.overflowLabel, overflowIndicator = overflowConfig.overflowIndicator, _c = overflowConfig.itemWidth, itemWidth = _c === void 0 ? 160 : _c, overflowSuffix = overflowConfig.overflowSuffix, popOverContainer = overflowConfig.popOverContainer, style = overflowConfig.style, maxVisibleCount = overflowConfig.maxVisibleCount, _d = overflowConfig.wrapperComponent, wrapperComponent = _d === void 0 ? 'ul' : _d;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Spinner_1.default, { show: !!loading, overlay: true, icon: "reload" }),
            react_1.default.createElement(rc_overflow_1.default, { className: cx('Nav-list--tabs', className), prefixCls: cx('Nav-list'), itemWidth: itemWidth, style: style, component: wrapperComponent, data: links, suffix: overflowSuffix
                    ? render('nav-overflow-suffix', overflowSuffix)
                    : null, renderRawItem: function (item, index) {
                    return _this.renderItem(item, index);
                }, renderRawRest: function (overFlowedItems) {
                    return (react_1.default.createElement(PopOverContainer_1.default, { popOverContainer: popOverContainer, popOverClassName: cx('Nav-item-overflow-popover', overflowPopoverClassName), popOverRender: function (_a) {
                            var onClose = _a.onClose;
                            return (react_1.default.createElement("div", { className: cx('Nav-list', 'Nav-list--stacked', // 浮层菜单为垂直布局
                                'Nav-list-overflow', overflowListClassName) }, overFlowedItems.map(function (item, index) {
                                return react_1.default.cloneElement(_this.renderItem(item, index), {
                                    onClick: onClose
                                });
                            })));
                        } }, function (_a) {
                        var onClick = _a.onClick, ref = _a.ref, isOpened = _a.isOpened;
                        return (react_1.default.createElement("li", { ref: ref, className: cx('Nav-item', 'Nav-item-overflow', {
                                'is-overflow-opened': isOpened
                            }, overflowClassName), onClick: onClick },
                            react_1.default.createElement("a", { "data-id": (0, helper_1.guid)(), "data-depth": 1 },
                                (0, icons_1.getIcon)(overflowIndicator) ? (react_1.default.createElement(icons_1.Icon, { icon: overflowIndicator, className: "icon" })) : ((0, icon_1.generateIcon)(cx, overflowIndicator, 'Nav-itemIcon')),
                                overflowLabel && helper_1.isObject
                                    ? render('nav-overflow-label', overflowLabel)
                                    : overflowLabel)));
                    }));
                }, maxCount: maxVisibleCount && Number.isInteger(maxVisibleCount)
                    ? maxVisibleCount
                    : 'responsive' })));
    };
    Navigation.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, stacked = _a.stacked, cx = _a.classnames, links = _a.links, loading = _a.loading, overflow = _a.overflow;
        var dropIndicator = this.state.dropIndicator;
        return (react_1.default.createElement("div", { className: cx('Nav') }, overflow && (0, helper_1.isObject)(overflow) && overflow.enable ? (this.renderOverflowNavs((0, tslib_1.__assign)({ overflowIndicator: 'fa fa-ellipsis', wrapperComponent: 'ul', itemWidth: 160 }, overflow))) : (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("ul", { className: cx('Nav-list', className, stacked ? 'Nav-list--stacked' : 'Nav-list--tabs') },
                Array.isArray(links)
                    ? links.map(function (item, index) { return _this.renderItem(item, index); })
                    : null,
                react_1.default.createElement(Spinner_1.default, { show: !!loading, overlay: true, icon: "reload" })),
            dropIndicator ? (react_1.default.createElement("div", { className: cx('Nav-dropIndicator'), style: dropIndicator })) : null))));
    };
    var _a, _b, _c, _d;
    Navigation.defaultProps = {
        indentSize: 24
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "handleClick", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "toggleLink", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof DragEvent !== "undefined" && DragEvent) === "function" ? _a : Object, String, Number]),
        (0, tslib_1.__metadata)("design:returntype", Object)
    ], Navigation.prototype, "getDropInfo", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof DragEvent !== "undefined" && DragEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "updateDropIndicator", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "handleDragStart", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof DragEvent !== "undefined" && DragEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "handleDragOver", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_d = typeof DragEvent !== "undefined" && DragEvent) === "function" ? _d : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Navigation.prototype, "handleDragEnd", null);
    return Navigation;
}(react_1.default.Component));
exports.Navigation = Navigation;
var ThemedNavigation = (0, theme_1.themeable)(Navigation);
var ConditionBuilderWithRemoteOptions = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (config, props) {
        var links = Array.isArray(config)
            ? config
            : config.links || config.options || config.items || config.rows;
        if (!Array.isArray(links)) {
            throw new Error('payload.data.options is not array.');
        }
        return links;
    },
    afterLoad: function (response, config, props) {
        if (response.value && !(0, helper_1.someTree)(config, function (item) { return item.active; })) {
            var env = props.env;
            env.jumpTo((0, tpl_1.filter)(response.value, props.data));
        }
    },
    normalizeConfig: function (links, origin, props, motivation) {
        if (Array.isArray(links) && motivation !== 'toggle') {
            var data_1 = props.data, env_1 = props.env, unfoldedField_1 = props.unfoldedField, foldedField_1 = props.foldedField;
            links = (0, helper_1.mapTree)(links, function (link) {
                var _a;
                var item = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, link), (0, filter_schema_1.default)(link, data_1)), { active: (motivation !== 'location-change' && link.active) ||
                        (link.activeOn
                            ? (0, tpl_1.evalExpression)(link.activeOn, data_1)
                            : !!(link.hasOwnProperty('to') &&
                                env_1 &&
                                env_1.isCurrentUrl((0, tpl_1.filter)(link.to, data_1)))), __id: (_a = link.__id) !== null && _a !== void 0 ? _a : (0, helper_1.guid)() });
                item.unfolded =
                    (0, helper_1.isUnfolded)(item, { unfoldedField: unfoldedField_1, foldedField: foldedField_1 }) ||
                        (link.children && link.children.some(function (link) { return !!link.active; }));
                return item;
            }, 1, true);
        }
        return links;
    },
    beforeDeferLoad: function (item, indexes, links) {
        return (0, helper_1.spliceTree)(links, indexes, 1, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { loading: true }));
    },
    afterDeferLoad: function (item, indexes, ret, links) {
        var newItem = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { loading: false, loaded: true, error: ret.ok ? undefined : ret.msg });
        var children = Array.isArray(ret.data)
            ? ret.data
            : ret.data.links || ret.data.options || ret.data.items || ret.data.rows;
        if (Array.isArray(children)) {
            newItem.children = children.concat();
            newItem.unfolded = true;
        }
        return (0, helper_1.spliceTree)(links, indexes, 1, newItem);
    }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1(props) {
        var _this = _super.call(this, props) || this;
        _this.toggleLink = _this.toggleLink.bind(_this);
        _this.handleSelect = _this.handleSelect.bind(_this);
        _this.dragUpdate = _this.dragUpdate.bind(_this);
        return _this;
    }
    class_1.prototype.componentDidMount = function () {
        if (Array.isArray(this.props.links)) {
            this.props.updateConfig(this.props.links, 'mount');
        }
    };
    class_1.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.location !== prevProps.location) {
            this.props.updateConfig(this.props.config, 'location-change');
        }
        else if (this.props.links !== prevProps.links) {
            this.props.updateConfig(this.props.links, 'update');
        }
    };
    class_1.prototype.toggleLink = function (target, forceFold) {
        var _a = this.props, config = _a.config, updateConfig = _a.updateConfig, deferLoad = _a.deferLoad;
        if (target.defer && !target.loaded) {
            deferLoad(target);
        }
        else {
            updateConfig((0, helper_1.mapTree)(config, function (link) {
                return target === link
                    ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, link), { unfolded: forceFold ? false : !link.unfolded }) : link;
            }), 'toggle');
        }
    };
    class_1.prototype.dragUpdate = function (dropInfo) {
        var _a, _b;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var links, nodeId, dragLink, position, sourceIdx, idx;
            return (0, tslib_1.__generator)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        links = this.props.config;
                        nodeId = dropInfo.nodeId, dragLink = dropInfo.dragLink, position = dropInfo.position;
                        if (dragLink) {
                            sourceIdx = (0, helper_1.findTreeIndex)(links, function (link) { return link.__id === dragLink.__id; });
                            links = (0, helper_1.spliceTree)(links, sourceIdx, 1);
                            if (position === 'self') {
                                // 插入到对应节点的children中
                                (0, helper_1.mapTree)(links, function (link) {
                                    if (link.__id === nodeId) {
                                        if (!link.children) {
                                            link.children = [];
                                        }
                                        link.children.push(dragLink);
                                    }
                                    return link;
                                });
                            }
                            else {
                                idx = (0, helper_1.findTreeIndex)(links, function (link) { return link.__id === nodeId; });
                                // 插入节点之后
                                if (position === 'bottom') {
                                    idx.push(idx.pop() + 1);
                                }
                                links = (0, helper_1.spliceTree)(links, idx, 0, dragLink);
                            }
                        }
                        this.props.updateConfig(links, 'update');
                        (_b = (_a = this.props).onOrderChange) === null || _b === void 0 ? void 0 : _b.call(_a, links);
                        return [4 /*yield*/, this.saveOrder((0, helper_1.mapTree)(links, function (link) {
                                // 清除内部加的字段
                                for (var key in link) {
                                    if (/^__.*$/.test(key)) {
                                        delete link[key];
                                    }
                                }
                                return link;
                            }))];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @description 在接口存在的时候，调用接口保存排序结果
     * @param links 排序后的结果
     */
    class_1.prototype.saveOrder = function (links) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, saveOrderApi, env, data, reload;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, saveOrderApi = _a.saveOrderApi, env = _a.env, data = _a.data, reload = _a.reload;
                        if (!(saveOrderApi && (0, api_1.isEffectiveApi)(saveOrderApi))) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(saveOrderApi, (0, helper_1.createObject)(data, { data: links }), { method: 'post' })];
                    case 1:
                        _b.sent();
                        reload();
                        return [3 /*break*/, 3];
                    case 2:
                        if (!this.props.onOrderChange) {
                            env.alert('NAV saveOrderApi is required!');
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    class_1.prototype.handleSelect = function (link) {
        var _a = this.props, onSelect = _a.onSelect, env = _a.env, data = _a.data;
        if (onSelect && onSelect(link) === false) {
            return;
        }
        if (!link.to &&
            ((link.children && link.children.length) ||
                (link.defer && !link.loaded))) {
            this.toggleLink(link);
            return;
        }
        env === null || env === void 0 ? void 0 : env.jumpTo((0, tpl_1.filter)(link.to, data), link);
    };
    class_1.prototype.render = function () {
        var _a = this.props, loading = _a.loading, config = _a.config, deferLoad = _a.deferLoad, updateConfig = _a.updateConfig, rest = (0, tslib_1.__rest)(_a, ["loading", "config", "deferLoad", "updateConfig"]);
        return (react_1.default.createElement(ThemedNavigation, (0, tslib_1.__assign)({}, rest, { loading: loading, links: config || [], disabled: loading, onSelect: this.handleSelect, onToggle: this.toggleLink, onDragUpdate: this.dragUpdate })));
    };
    return class_1;
}(react_1.default.Component)));
exports.default = ThemedNavigation;
var NavigationRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(NavigationRenderer, _super);
    function NavigationRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        _this.remoteRef = undefined;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    NavigationRenderer.prototype.remoteConfigRef = function (ref) {
        this.remoteRef = ref;
    };
    NavigationRenderer.prototype.componentWillUnmount = function () {
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    NavigationRenderer.prototype.reload = function (target, query, values) {
        var _a;
        if (query) {
            return this.receive(query);
        }
        var _b = this.props, data = _b.data, env = _b.env, source = _b.source, __ = _b.translate;
        var finalData = values ? (0, helper_1.createObject)(data, values) : data;
        (_a = this.remoteRef) === null || _a === void 0 ? void 0 : _a.loadConfig(finalData);
    };
    NavigationRenderer.prototype.receive = function (values) {
        this.reload(undefined, undefined, values);
    };
    NavigationRenderer.prototype.render = function () {
        var rest = (0, tslib_1.__rest)(this.props, []);
        return (react_1.default.createElement(ConditionBuilderWithRemoteOptions, (0, tslib_1.__assign)({}, rest, { reload: this.reload, remoteConfigRef: this.remoteConfigRef })));
    };
    var _e, _f;
    NavigationRenderer.contextType = Scoped_1.ScopedContext;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "remoteConfigRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, Object, Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "reload", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], NavigationRenderer.prototype, "receive", null);
    NavigationRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:nav|navigation)$/,
            name: 'nav'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_e = typeof factory_1.RendererProps !== "undefined" && factory_1.RendererProps) === "function" ? _e : Object, typeof (_f = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _f : Object])
    ], NavigationRenderer);
    return NavigationRenderer;
}(react_1.default.Component));
exports.NavigationRenderer = NavigationRenderer;
//# sourceMappingURL=./renderers/Nav.js.map
