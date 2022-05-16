"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesFieldRenderer = exports.ImagesField = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_1 = require("../utils/tpl");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var Image_1 = tslib_1.__importStar(require("./Image"));
var helper_1 = require("../utils/helper");
var ImagesField = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImagesField, _super);
    function ImagesField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = [];
        return _this;
    }
    ImagesField.prototype.handleEnlarge = function (info) {
        var _a = this.props, onImageEnlarge = _a.onImageEnlarge, src = _a.src, originalSrc = _a.originalSrc;
        onImageEnlarge &&
            onImageEnlarge((0, tslib_1.__assign)((0, tslib_1.__assign)({}, info), { originalSrc: info.originalSrc || info.src, list: this.list.map(function (item) { return ({
                    src: src
                        ? (0, tpl_1.filter)(src, item, '| raw')
                        : (item && item.image) || item,
                    originalSrc: originalSrc
                        ? (0, tpl_1.filter)(originalSrc, item, '| raw')
                        : (item === null || item === void 0 ? void 0 : item.src) || (0, tpl_1.filter)(src, item, '| raw') || (item === null || item === void 0 ? void 0 : item.image) || item,
                    title: item && (item.enlargeTitle || item.title),
                    caption: item && (item.enlargeCaption || item.description || item.caption)
                }); }) }), this.props);
    };
    ImagesField.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, defaultImage = _a.defaultImage, thumbMode = _a.thumbMode, thumbRatio = _a.thumbRatio, data = _a.data, name = _a.name, placeholder = _a.placeholder, cx = _a.classnames, source = _a.source, delimiter = _a.delimiter, enlargeAble = _a.enlargeAble, src = _a.src, originalSrc = _a.originalSrc, listClassName = _a.listClassName, options = _a.options;
        var value;
        var list;
        if (typeof source === 'string' && (0, tpl_builtin_1.isPureVariable)(source)) {
            list = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw') || undefined;
        }
        else if (Array.isArray((value = (0, helper_1.getPropValue)(this.props))) ||
            typeof value === 'string') {
            list = value;
        }
        else if (Array.isArray(options)) {
            list = options;
        }
        if (typeof list === 'string') {
            list = list.split(delimiter);
        }
        else if (list && !Array.isArray(list)) {
            list = [list];
        }
        this.list = list;
        return (react_1.default.createElement("div", { className: cx('ImagesField', className) }, Array.isArray(list) ? (react_1.default.createElement("div", { className: cx('Images', listClassName) }, list.map(function (item, index) { return (react_1.default.createElement(Image_1.default, { index: index, className: cx('Images-item'), key: index, src: (src ? (0, tpl_1.filter)(src, item, '| raw') : item && item.image) ||
                item, originalSrc: (originalSrc
                ? (0, tpl_1.filter)(originalSrc, item, '| raw')
                : item && item.src) || item, title: item && item.title, caption: item && (item.description || item.caption), thumbMode: thumbMode, thumbRatio: thumbRatio, enlargeAble: enlargeAble, onEnlarge: _this.handleEnlarge })); }))) : defaultImage ? (react_1.default.createElement("div", { className: cx('Images', listClassName) },
            react_1.default.createElement(Image_1.default, { className: cx('Images-item'), src: defaultImage, thumbMode: thumbMode, thumbRatio: thumbRatio }))) : (placeholder)));
    };
    var _a;
    ImagesField.defaultProps = {
        className: '',
        delimiter: ',',
        defaultImage: Image_1.imagePlaceholder,
        placehoder: '-',
        thumbMode: 'contain',
        thumbRatio: '1:1'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof Image_1.ImageThumbProps !== "undefined" && Image_1.ImageThumbProps) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], ImagesField.prototype, "handleEnlarge", null);
    return ImagesField;
}(react_1.default.Component));
exports.ImagesField = ImagesField;
var ImagesFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ImagesFieldRenderer, _super);
    function ImagesFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ImagesFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'images'
        })
    ], ImagesFieldRenderer);
    return ImagesFieldRenderer;
}(ImagesField));
exports.ImagesFieldRenderer = ImagesFieldRenderer;
//# sourceMappingURL=./renderers/Images.js.map
