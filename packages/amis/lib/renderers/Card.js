"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardItemFieldRenderer = exports.CardRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var Checkbox_1 = (0, tslib_1.__importDefault)(require("../components/Checkbox"));
var helper_1 = require("../utils/helper");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var QuickEdit_1 = (0, tslib_1.__importDefault)(require("./QuickEdit"));
var PopOver_1 = (0, tslib_1.__importDefault)(require("./PopOver"));
var Table_1 = require("./Table");
var Copyable_1 = (0, tslib_1.__importDefault)(require("./Copyable"));
var omit = require("lodash/omit");
var Card_1 = require("../components/Card");
var react_dom_1 = require("react-dom");
var icons_1 = require("../components/icons");
var CardRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CardRenderer, _super);
    function CardRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleAction = _this.handleAction.bind(_this);
        _this.handleCheck = _this.handleCheck.bind(_this);
        _this.getPopOverContainer = _this.getPopOverContainer.bind(_this);
        _this.handleQuickChange = _this.handleQuickChange.bind(_this);
        return _this;
    }
    CardRenderer.prototype.isHaveLink = function () {
        var _a = this.props, href = _a.href, itemAction = _a.itemAction, onCheck = _a.onCheck, checkOnItemClick = _a.checkOnItemClick, checkable = _a.checkable;
        return href || itemAction || onCheck || (checkOnItemClick && checkable);
    };
    CardRenderer.prototype.handleClick = function (e) {
        var _a = this.props, item = _a.item, href = _a.href, data = _a.data, env = _a.env, blank = _a.blank, itemAction = _a.itemAction, onAction = _a.onAction, onCheck = _a.onCheck, selectable = _a.selectable;
        if (href) {
            env.jumpTo((0, tpl_1.filter)(href, data), {
                type: 'button',
                actionType: 'url',
                blank: blank
            });
            return;
        }
        if (itemAction) {
            onAction && onAction(e, itemAction, (item === null || item === void 0 ? void 0 : item.data) || data);
            return;
        }
        selectable && (onCheck === null || onCheck === void 0 ? void 0 : onCheck(item));
    };
    CardRenderer.prototype.handleAction = function (e, action, ctx) {
        var _a = this.props, onAction = _a.onAction, item = _a.item;
        onAction && onAction(e, action, ctx || item.data);
    };
    CardRenderer.prototype.handleCheck = function (e) {
        var item = this.props.item;
        this.props.onCheck && this.props.onCheck(item);
    };
    CardRenderer.prototype.getPopOverContainer = function () {
        return (0, react_dom_1.findDOMNode)(this);
    };
    CardRenderer.prototype.handleQuickChange = function (values, saveImmediately, savePristine, resetOnFailed) {
        var _a = this.props, onQuickChange = _a.onQuickChange, item = _a.item;
        onQuickChange &&
            onQuickChange(item, values, saveImmediately, savePristine, resetOnFailed);
    };
    CardRenderer.prototype.renderToolbar = function () {
        var _a = this.props, selectable = _a.selectable, checkable = _a.checkable, selected = _a.selected, checkOnItemClick = _a.checkOnItemClick, multiple = _a.multiple, hideCheckToggler = _a.hideCheckToggler, cx = _a.classnames, toolbar = _a.toolbar, render = _a.render, dragging = _a.dragging, data = _a.data, header = _a.header;
        var toolbars = [];
        if (header) {
            var highlightClassName = header.highlightClassName, highlightTpl = header.highlight;
            var highlight = !!(0, tpl_1.evalExpression)(highlightTpl, data);
            if (highlight) {
                toolbars.push(react_1.default.createElement("i", { className: cx('Card-highlight', highlightClassName) }));
            }
        }
        if (selectable && !hideCheckToggler) {
            toolbars.push(react_1.default.createElement(Checkbox_1.default, { key: "check", className: cx('Card-checkbox'), type: multiple ? 'checkbox' : 'radio', disabled: !checkable, checked: selected, onChange: checkOnItemClick ? helper_1.noop : this.handleCheck }));
        }
        if (Array.isArray(toolbar)) {
            toolbar.forEach(function (action, index) {
                return toolbars.push(render("toolbar/".concat(index), (0, tslib_1.__assign)({ type: 'button', level: 'link', size: 'sm' }, action), {
                    key: index
                }));
            });
        }
        if (dragging) {
            toolbars.push(react_1.default.createElement("div", { className: cx('Card-dragBtn') },
                react_1.default.createElement(icons_1.Icon, { icon: "drag-bar", className: "icon" })));
        }
        return toolbars.length ? (react_1.default.createElement("div", { className: cx('Card-toolbar') }, toolbars)) : null;
    };
    CardRenderer.prototype.renderActions = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, render = _a.render, dragging = _a.dragging, actionsCount = _a.actionsCount, data = _a.data, cx = _a.classnames;
        if (Array.isArray(actions)) {
            var group = (0, helper_1.padArr)(actions.filter(function (item) { return (0, helper_1.isVisible)(item, data); }), actionsCount);
            return group.map(function (actions, groupIndex) { return (react_1.default.createElement("div", { key: groupIndex, className: cx('Card-actions') }, actions.map(function (action, index) {
                var size = action.size || 'sm';
                return render("action/".concat(index), (0, tslib_1.__assign)((0, tslib_1.__assign)({ level: 'link', type: 'button' }, action), { size: size }), {
                    isMenuItem: true,
                    key: index,
                    index: index,
                    disabled: dragging || (0, helper_1.isDisabled)(action, data),
                    className: cx('Card-action', action.className || "".concat(size ? "Card-action--".concat(size) : '')),
                    componentClass: 'a',
                    onAction: _this.handleAction
                });
            }))); });
        }
        return;
    };
    CardRenderer.prototype.renderChild = function (node, region, key) {
        if (region === void 0) { region = 'body'; }
        if (key === void 0) { key = 0; }
        var render = this.props.render;
        if (typeof node === 'string' || typeof node === 'number') {
            return render(region, node, { key: key });
        }
        var childNode = node;
        if (childNode.type === 'hbox' || childNode.type === 'grid') {
            return render(region, node, {
                key: key,
                itemRender: this.itemRender
            });
        }
        return this.renderFeild(region, childNode, key, this.props);
    };
    CardRenderer.prototype.itemRender = function (field, index, props) {
        return this.renderFeild("column/".concat(index), field, index, props);
    };
    CardRenderer.prototype.renderFeild = function (region, field, key, props) {
        var render = props.render, cx = props.classnames, itemIndex = props.itemIndex;
        var data = this.props.data;
        if (!(0, helper_1.isVisible)(field, data)) {
            return;
        }
        var $$id = field.$$id ? "".concat(field.$$id, "-field") : '';
        return (react_1.default.createElement("div", { className: cx('Card-field'), key: key },
            field && field.label ? (react_1.default.createElement("label", { className: cx('Card-fieldLabel', field.labelClassName) }, field.label)) : null,
            render(region, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, field), { field: field, $$id: $$id, type: 'card-item-field' }), {
                className: cx('Card-fieldValue', field.className),
                rowIndex: itemIndex,
                colIndex: key,
                value: field.name ? (0, tpl_builtin_1.resolveVariable)(field.name, data) : undefined,
                popOverContainer: this.getPopOverContainer,
                onAction: this.handleAction,
                onQuickChange: this.handleQuickChange
            })));
    };
    CardRenderer.prototype.renderBody = function () {
        var _this = this;
        var body = this.props.body;
        if (!body) {
            return null;
        }
        if (Array.isArray(body)) {
            return body.map(function (child, index) {
                return _this.renderChild(child, "body/".concat(index), index);
            });
        }
        return this.renderChild(body, 'body');
    };
    CardRenderer.prototype.rederTitle = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var titleTpl = (header || {}).title;
            var title = (0, tpl_1.filter)(titleTpl, data);
            return title ? render('title', titleTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSubTitle = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var subTitleTpl = (header || {}).subTitle;
            var subTitle = (0, tpl_1.filter)(subTitleTpl, data);
            return subTitle ? render('sub-title', subTitleTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSubTitlePlaceholder = function () {
        var _a = this.props, render = _a.render, header = _a.header, cx = _a.classnames;
        if (header) {
            var subTitlePlaceholder = (header || {}).subTitlePlaceholder;
            return subTitlePlaceholder
                ? render('sub-title', subTitlePlaceholder, {
                    className: cx('Card-placeholder')
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderDesc = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var _b = header || {}, descTpl = _b.desc, descriptionTpl = _b.description;
            var desc = (0, tpl_1.filter)(descriptionTpl || descTpl, data);
            return desc
                ? render('desc', descriptionTpl || descTpl, {
                    className: !desc ? 'text-muted' : null
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderDescPlaceholder = function () {
        var _a = this.props, render = _a.render, header = _a.header;
        if (header) {
            var descPlaceholder = header.descriptionPlaceholder || header.descPlaceholder;
            return descPlaceholder
                ? render('desc', descPlaceholder, {
                    className: !descPlaceholder ? 'text-muted' : null
                })
                : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderAvatar = function () {
        var _a = this.props, data = _a.data, header = _a.header;
        if (header) {
            var avatarTpl = (header || {}).avatar;
            var avatar = (0, tpl_1.filter)(avatarTpl, data, '| raw');
            return avatar ? avatar : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderAvatarText = function () {
        var _a = this.props, render = _a.render, data = _a.data, header = _a.header;
        if (header) {
            var avatarTextTpl = (header || {}).avatarText;
            var avatarText = (0, tpl_1.filter)(avatarTextTpl, data);
            return avatarText ? render('avatarText', avatarTextTpl) : undefined;
        }
        return;
    };
    CardRenderer.prototype.renderSecondary = function () {
        var _a = this.props, render = _a.render, data = _a.data, secondaryTextTpl = _a.secondary;
        var secondary = (0, tpl_1.filter)(secondaryTextTpl, data);
        return secondary ? render('secondary', secondaryTextTpl) : undefined;
    };
    CardRenderer.prototype.renderAvatarTextStyle = function () {
        var _a = this.props, header = _a.header, data = _a.data;
        if (header) {
            var avatarTextTpl = header.avatarText, avatarTextBackground = header.avatarTextBackground;
            var avatarText = (0, tpl_1.filter)(avatarTextTpl, data);
            var avatarTextStyle = {};
            if (avatarText && avatarTextBackground && avatarTextBackground.length) {
                avatarTextStyle['background'] =
                    avatarTextBackground[Math.abs((0, helper_1.hashCode)(avatarText)) % avatarTextBackground.length];
            }
            return avatarTextStyle;
        }
        return;
    };
    CardRenderer.prototype.renderMedia = function () {
        var _a = this.props, media = _a.media, cx = _a.classnames, render = _a.render, region = _a.region, data = _a.data;
        if (media) {
            var type = media.type, url = media.url, className = media.className, autoPlay = media.autoPlay, isLive = media.isLive, poster = media.poster;
            var mediaUrl = (0, tpl_builtin_1.resolveVariableAndFilter)(url, data, '| raw');
            if (type === 'image' && mediaUrl) {
                return (react_1.default.createElement("img", { className: cx('Card-multiMedia-img', className), src: mediaUrl }));
            }
            else if (type === 'video' && mediaUrl) {
                return (react_1.default.createElement("div", { className: cx('Card-multiMedia-video', className) }, render(region, {
                    type: type,
                    autoPlay: autoPlay,
                    poster: poster,
                    src: mediaUrl,
                    isLive: isLive
                })));
            }
        }
        return;
    };
    CardRenderer.prototype.render = function () {
        var _a = this.props, header = _a.header, className = _a.className, avatarClassName = _a.avatarClassName, avatarTextClassName = _a.avatarTextClassName, descClassName = _a.descClassName, descriptionClassName = _a.descriptionClassName, titleClassName = _a.titleClassName, subTitleClassName = _a.subTitleClassName, bodyClassName = _a.bodyClassName, imageClassName = _a.imageClassName, headerClassName = _a.headerClassName, secondaryClassName = _a.secondaryClassName, footerClassName = _a.footerClassName, mediaClassName = _a.mediaClassName, media = _a.media, rest = (0, tslib_1.__rest)(_a, ["header", "className", "avatarClassName", "avatarTextClassName", "descClassName", "descriptionClassName", "titleClassName", "subTitleClassName", "bodyClassName", "imageClassName", "headerClassName", "secondaryClassName", "footerClassName", "mediaClassName", "media"]);
        var headerCn = (header === null || header === void 0 ? void 0 : header.className) || headerClassName;
        var titleCn = (header === null || header === void 0 ? void 0 : header.titleClassName) || titleClassName;
        var subTitleCn = (header === null || header === void 0 ? void 0 : header.subTitleClassName) || subTitleClassName;
        var descCn = (header === null || header === void 0 ? void 0 : header.descClassName) || descClassName;
        var descriptionCn = (header === null || header === void 0 ? void 0 : header.descriptionClassName) || descriptionClassName || descCn;
        var avatarTextCn = (header === null || header === void 0 ? void 0 : header.avatarTextClassName) || avatarTextClassName;
        var avatarCn = (header === null || header === void 0 ? void 0 : header.avatarClassName) || avatarClassName;
        var imageCn = (header === null || header === void 0 ? void 0 : header.imageClassName) || imageClassName;
        var mediaPosition = media === null || media === void 0 ? void 0 : media.position;
        return (react_1.default.createElement(Card_1.Card, (0, tslib_1.__assign)({}, rest, { title: this.rederTitle(), subTitle: this.renderSubTitle(), subTitlePlaceholder: this.renderSubTitlePlaceholder(), description: this.renderDesc(), descriptionPlaceholder: this.renderDescPlaceholder(), children: this.renderBody(), actions: this.renderActions(), avatar: this.renderAvatar(), avatarText: this.renderAvatarText(), secondary: this.renderSecondary(), toolbar: this.renderToolbar(), avatarClassName: avatarCn, avatarTextStyle: this.renderAvatarTextStyle(), avatarTextClassName: avatarTextCn, className: className, titleClassName: titleCn, media: this.renderMedia(), subTitleClassName: subTitleCn, mediaPosition: mediaPosition, descriptionClassName: descriptionCn, imageClassName: imageCn, headerClassName: headerCn, footerClassName: footerClassName, secondaryClassName: secondaryClassName, bodyClassName: bodyClassName, onClick: this.isHaveLink() ? this.handleClick : undefined })));
    };
    CardRenderer.defaultProps = {
        className: '',
        avatarClassName: '',
        headerClassName: '',
        footerClassName: '',
        secondaryClassName: '',
        avatarTextClassName: '',
        bodyClassName: '',
        actionsCount: 4,
        titleClassName: '',
        highlightClassName: '',
        subTitleClassName: '',
        descClassName: '',
        descriptionClassName: '',
        imageClassName: '',
        highlight: false,
        blank: true,
        dragging: false,
        selectable: false,
        checkable: true,
        selected: false,
        hideCheckToggler: false
    };
    CardRenderer.propsList = [
        'avatarClassName',
        'avatarTextClassName',
        'bodyClassName',
        'actionsCount',
        'titleClassName',
        'highlightClassName',
        'subTitleClassName',
        'descClassName',
        'descriptionClassName',
        'imageClassName',
        'hideCheckToggler'
    ];
    CardRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'card'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object])
    ], CardRenderer);
    return CardRenderer;
}(react_1.default.Component));
exports.CardRenderer = CardRenderer;
var CardItemFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CardItemFieldRenderer, _super);
    function CardItemFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CardItemFieldRenderer.prototype.render = function () {
        var _a = this.props, type = _a.type, className = _a.className, render = _a.render, style = _a.style, Component = _a.wrapperComponent, labelClassName = _a.labelClassName, value = _a.value, data = _a.data, children = _a.children, width = _a.width, innerClassName = _a.innerClassName, label = _a.label, tabIndex = _a.tabIndex, onKeyUp = _a.onKeyUp, field = _a.field, rest = (0, tslib_1.__rest)(_a, ["type", "className", "render", "style", "wrapperComponent", "labelClassName", "value", "data", "children", "width", "innerClassName", "label", "tabIndex", "onKeyUp", "field"]);
        var schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, field), { className: innerClassName, type: (field && field.type) || 'plain' });
        var body = children
            ? children
            : render('field', schema, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, omit(rest, Object.keys(schema))), { value: value, data: data }));
        if (width) {
            style = style || {};
            style.width = style.width || width;
            body = (react_1.default.createElement("div", { style: { width: !/%/.test(String(width)) ? width : '' } }, body));
        }
        if (!Component) {
            return body;
        }
        return (react_1.default.createElement(Component, { style: style, className: className, tabIndex: tabIndex, onKeyUp: onKeyUp }, body));
    };
    CardItemFieldRenderer.defaultProps = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, Table_1.TableCell.defaultProps), { wrapperComponent: 'div' });
    CardItemFieldRenderer.propsList = (0, tslib_1.__spreadArray)([
        'quickEdit',
        'quickEditEnabledOn',
        'popOver',
        'copyable',
        'inline'
    ], Table_1.TableCell.propsList, true);
    CardItemFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'card-item-field'
        }),
        (0, QuickEdit_1.default)(),
        (0, PopOver_1.default)(),
        (0, Copyable_1.default)()
    ], CardItemFieldRenderer);
    return CardItemFieldRenderer;
}(Table_1.TableCell));
exports.CardItemFieldRenderer = CardItemFieldRenderer;
//# sourceMappingURL=./renderers/Card.js.map
