"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageGallery = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var Modal_1 = (0, tslib_1.__importDefault)(require("./Modal"));
var icons_1 = require("./icons");
var locale_1 = require("../locale");
var ImageGallery = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImageGallery, _super);
    function ImageGallery() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpened: false,
            index: -1,
            items: []
        };
        return _this;
    }
    ImageGallery.prototype.handleImageEnlarge = function (info) {
        this.setState({
            isOpened: true,
            items: info.list ? info.list : [info],
            index: info.index || 0
        });
    };
    ImageGallery.prototype.close = function () {
        this.setState({
            isOpened: false
        });
    };
    ImageGallery.prototype.prev = function () {
        var index = this.state.index;
        this.setState({
            index: index - 1
        });
    };
    ImageGallery.prototype.next = function () {
        var index = this.state.index;
        this.setState({
            index: index + 1
        });
    };
    ImageGallery.prototype.handleItemClick = function (e) {
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        this.setState({
            index: index
        });
    };
    ImageGallery.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, cx = _a.classnames, modalContainer = _a.modalContainer;
        var _b = this.state, index = _b.index, items = _b.items;
        var __ = this.props.translate;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.cloneElement(children, {
                onImageEnlarge: this.handleImageEnlarge
            }),
            react_1.default.createElement(Modal_1.default, { closeOnEsc: true, size: "full", onHide: this.close, show: this.state.isOpened, contentClassName: cx('ImageGallery'), container: modalContainer },
                react_1.default.createElement("a", { "data-tooltip": __('Dialog.close'), "data-position": "left", className: cx('ImageGallery-close'), onClick: this.close },
                    react_1.default.createElement(icons_1.Icon, { icon: "close", className: "icon" })),
                ~index && items[index] ? (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: cx('ImageGallery-title') }, items[index].title),
                    react_1.default.createElement("div", { className: cx('ImageGallery-main') },
                        react_1.default.createElement("img", { src: items[index].originalSrc }),
                        items.length > 1 ? (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("a", { className: cx('ImageGallery-prevBtn', index <= 0 ? 'is-disabled' : ''), onClick: this.prev },
                                react_1.default.createElement(icons_1.Icon, { icon: "prev", className: "icon" })),
                            react_1.default.createElement("a", { className: cx('ImageGallery-nextBtn', index >= items.length - 1 ? 'is-disabled' : ''), onClick: this.next },
                                react_1.default.createElement(icons_1.Icon, { icon: "next", className: "icon" })))) : null))) : null,
                items.length > 1 ? (react_1.default.createElement("div", { className: cx('ImageGallery-footer') },
                    react_1.default.createElement("a", { className: cx('ImageGallery-prevList is-disabled') },
                        react_1.default.createElement(icons_1.Icon, { icon: "prev", className: "icon" })),
                    react_1.default.createElement("div", { className: cx('ImageGallery-itemsWrap') },
                        react_1.default.createElement("div", { className: cx('ImageGallery-items') }, items.map(function (item, i) { return (react_1.default.createElement("div", { key: i, "data-index": i, onClick: _this.handleItemClick, className: cx('ImageGallery-item', i === index ? 'is-active' : '') },
                            react_1.default.createElement("img", { src: item.src }))); }))),
                    react_1.default.createElement("a", { className: cx('ImageGallery-nextList is-disabled') },
                        react_1.default.createElement(icons_1.Icon, { icon: "next", className: "icon" })))) : null)));
    };
    var _a;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageGallery.prototype, "handleImageEnlarge", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageGallery.prototype, "close", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageGallery.prototype, "prev", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageGallery.prototype, "next", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImageGallery.prototype, "handleItemClick", null);
    return ImageGallery;
}(react_1.default.Component));
exports.ImageGallery = ImageGallery;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(ImageGallery));
//# sourceMappingURL=./components/ImageGallery.js.map
