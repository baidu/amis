"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFieldRenderer = exports.ImageField = exports.imagePlaceholder = exports.ImageThumb = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var icons_1 = require("../components/icons");
var locale_1 = require("../locale");
var handleAction_1 = (0, tslib_1.__importDefault)(require("../utils/handleAction"));
var ImageThumb = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImageThumb, _super);
    function ImageThumb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageThumb.prototype.handleEnlarge = function () {
        var _a = this.props, onEnlarge = _a.onEnlarge, rest = (0, tslib_1.__rest)(_a, ["onEnlarge"]);
        onEnlarge && onEnlarge(rest);
    };
    ImageThumb.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, imageClassName = _a.imageClassName, thumbClassName = _a.thumbClassName, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio, height = _a.height, width = _a.width, src = _a.src, alt = _a.alt, title = _a.title, caption = _a.caption, href = _a.href, _b = _a.blank, blank = _b === void 0 ? true : _b, htmlTarget = _a.htmlTarget, onLoad = _a.onLoad, enlargeAble = _a.enlargeAble, __ = _a.translate, overlays = _a.overlays, imageMode = _a.imageMode;
        var enlarge = enlargeAble || overlays ? (react_1.default.createElement("div", { key: "overlay", className: cx('Image-overlay') },
            enlargeAble ? (react_1.default.createElement("a", { "data-tooltip": __('Image.zoomIn'), "data-position": "bottom", target: "_blank", onClick: this.handleEnlarge },
                react_1.default.createElement(icons_1.Icon, { icon: "view", className: "icon" }))) : null,
            overlays)) : null;
        var image = (react_1.default.createElement("div", { className: cx('Image', imageMode === 'original' ? 'Image--original' : 'Image--thumb', className) },
            imageMode === 'original' ? (react_1.default.createElement("div", { className: cx('Image-origin', thumbMode ? "Image-origin--".concat(thumbMode) : ''), style: { height: height, width: width } },
                react_1.default.createElement("img", { onLoad: onLoad, className: cx('Image-image', imageClassName), src: src, alt: alt }),
                enlarge)) : (react_1.default.createElement("div", { className: cx('Image-thumbWrap') },
                react_1.default.createElement("div", { className: cx('Image-thumb', thumbClassName, thumbMode ? "Image-thumb--".concat(thumbMode) : '', thumbRatio
                        ? "Image-thumb--".concat(thumbRatio.replace(/:/g, '-'))
                        : ''), style: { height: height, width: width } },
                    react_1.default.createElement("img", { onLoad: onLoad, className: cx('Image-image', imageClassName), src: src, alt: alt })),
                enlarge)),
            title || caption ? (react_1.default.createElement("div", { key: "caption", className: cx('Image-info') },
                title ? (react_1.default.createElement("div", { className: cx('Image-title'), title: title }, title)) : null,
                caption ? (react_1.default.createElement("div", { className: cx('Image-caption'), title: caption }, caption)) : null)) : null));
        if (href) {
            image = (react_1.default.createElement("a", { href: href, target: htmlTarget || (blank ? '_blank' : '_self'), className: cx('Link', className), title: title }, image));
        }
        return image;
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageThumb.prototype, "handleEnlarge", null);
    return ImageThumb;
}(react_1.default.Component));
exports.ImageThumb = ImageThumb;
var ThemedImageThumb = (0, theme_1.themeable)((0, locale_1.localeable)(ImageThumb));
exports.default = ThemedImageThumb;
exports.imagePlaceholder = "data:image/svg+xml,%3C%3Fxml version='1.0' standalone='no'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg t='1631083237695' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2420' xmlns:xlink='http://www.w3.org/1999/xlink' width='1024' height='1024'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%3C/style%3E%3C/defs%3E%3Cpath d='M959.872 128c0.032 0.032 0.096 0.064 0.128 0.128v767.776c-0.032 0.032-0.064 0.096-0.128 0.128H64.096c-0.032-0.032-0.096-0.064-0.128-0.128V128.128c0.032-0.032 0.064-0.096 0.128-0.128h895.776zM960 64H64C28.8 64 0 92.8 0 128v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z' p-id='2421' fill='%23bfbfbf'%3E%3C/path%3E%3Cpath d='M832 288c0 53.024-42.976 96-96 96s-96-42.976-96-96 42.976-96 96-96 96 42.976 96 96zM896 832H128V704l224-384 256 320h64l224-192z' p-id='2422' fill='%23bfbfbf'%3E%3C/path%3E%3C/svg%3E";
var ImageField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImageField, _super);
    function ImageField() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageField.prototype.handleEnlarge = function (_a) {
        var src = _a.src, originalSrc = _a.originalSrc, title = _a.title, caption = _a.caption, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio;
        var _b = this.props, onImageEnlarge = _b.onImageEnlarge, enlargeTitle = _b.enlargeTitle, enlargeCaption = _b.enlargeCaption;
        onImageEnlarge &&
            onImageEnlarge({
                src: src,
                originalSrc: originalSrc || src,
                title: enlargeTitle || title,
                caption: enlargeCaption || caption,
                thumbMode: thumbMode,
                thumbRatio: thumbRatio
            }, this.props);
    };
    ImageField.prototype.handleClick = function (e) {
        var clickAction = this.props.clickAction;
        if (clickAction) {
            (0, handleAction_1.default)(e, clickAction, this.props);
        }
    };
    ImageField.prototype.render = function () {
        var _a;
        var _b = this.props, className = _b.className, defaultImage = _b.defaultImage, imageCaption = _b.imageCaption, title = _b.title, data = _b.data, imageClassName = _b.imageClassName, thumbClassName = _b.thumbClassName, height = _b.height, width = _b.width, cx = _b.classnames, src = _b.src, href = _b.href, thumbMode = _b.thumbMode, thumbRatio = _b.thumbRatio, placeholder = _b.placeholder, originalSrc = _b.originalSrc, enlargeAble = _b.enlargeAble, imageMode = _b.imageMode;
        var finnalSrc = src ? (0, tpl_1.filter)(src, data, '| raw') : '';
        var value = finnalSrc || (0, helper_1.getPropValue)(this.props) || defaultImage || exports.imagePlaceholder;
        var finnalHref = href ? (0, tpl_1.filter)(href, data, '| raw') : '';
        return (react_1.default.createElement("div", { className: cx('ImageField', imageMode === 'original'
                ? 'ImageField--original'
                : 'ImageField--thumb', className), onClick: this.handleClick }, value ? (react_1.default.createElement(ThemedImageThumb, { imageClassName: imageClassName, thumbClassName: thumbClassName, height: height, width: width, src: value, href: finnalHref, title: (0, tpl_1.filter)(title, data), caption: (0, tpl_1.filter)(imageCaption, data), thumbMode: thumbMode, thumbRatio: thumbRatio, originalSrc: (_a = (0, tpl_1.filter)(originalSrc, data, '| raw')) !== null && _a !== void 0 ? _a : value, enlargeAble: enlargeAble && value !== defaultImage, onEnlarge: this.handleEnlarge, imageMode: imageMode })) : (react_1.default.createElement("span", { className: "text-muted" }, placeholder))));
    };
    var _a;
    ImageField.defaultProps = {
        defaultImage: exports.imagePlaceholder,
        thumbMode: 'contain',
        thumbRatio: '1:1',
        placeholder: '-'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageField.prototype, "handleEnlarge", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageField.prototype, "handleClick", null);
    return ImageField;
}(react_1.default.Component));
exports.ImageField = ImageField;
var ImageFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImageFieldRenderer, _super);
    function ImageFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImageFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'image'
        })
    ], ImageFieldRenderer);
    return ImageFieldRenderer;
}(ImageField));
exports.ImageFieldRenderer = ImageFieldRenderer;
//# sourceMappingURL=./renderers/Image.js.map
