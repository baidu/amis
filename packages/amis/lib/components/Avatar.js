"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var theme_1 = require("../theme");
var prefix = 'Avatar--';
var childPrefix = prefix + 'text';
var Avatar = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Avatar, _super);
    function Avatar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            scale: 1,
            hasImg: true
        };
        _this.avatarChildrenRef = React.createRef();
        _this.avatarRef = React.createRef();
        _this.handleImageLoadError = _this.handleImageLoadError.bind(_this);
        return _this;
    }
    Avatar.prototype.componentDidMount = function () {
        this.setScaleByGap();
    };
    Avatar.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.props, src = _a.src, gap = _a.gap, text = _a.text, children = _a.children;
        var hasImg = this.state.hasImg;
        if (prevProps.src !== src) {
            this.setState({
                hasImg: !!src
            });
        }
        if ((prevState.hasImg && !hasImg)
            || (prevProps.text !== text)
            || (prevProps.children !== children)
            || (prevProps.gap !== gap)) {
            this.setScaleByGap();
        }
    };
    Avatar.prototype.handleImageLoadError = function (event) {
        var onError = this.props.onError;
        this.setState({
            hasImg: onError ? !onError(event) : false
        });
    };
    Avatar.prototype.setScaleByGap = function () {
        var _a = this.props.gap, gap = _a === void 0 ? 4 : _a;
        if (!this.avatarChildrenRef.current || !this.avatarRef.current) {
            return;
        }
        var childrenWidth = this.avatarChildrenRef.current.offsetWidth;
        var nodeWidth = this.avatarRef.current.offsetWidth;
        if (childrenWidth && nodeWidth) {
            if (gap * 2 < nodeWidth) {
                var diff = nodeWidth - gap * 2;
                this.setState({
                    scale: diff < childrenWidth ? diff / childrenWidth : 1
                });
            }
        }
    };
    ;
    Avatar.prototype.render = function () {
        var _a = this.props, _b = _a.style, style = _b === void 0 ? {} : _b, className = _a.className, shape = _a.shape, size = _a.size, src = _a.src, icon = _a.icon, alt = _a.alt, draggable = _a.draggable, crossOrigin = _a.crossOrigin, fit = _a.fit, text = _a.text, children = _a.children, cx = _a.classnames;
        var _c = this.state, scale = _c.scale, hasImg = _c.hasImg;
        var isImgRender = React.isValidElement(src);
        var isIconRender = React.isValidElement(icon);
        var childrenRender;
        var sizeStyle = {};
        var sizeClass = '';
        if (typeof size === 'number') {
            sizeStyle = {
                height: size,
                width: size,
                lineHeight: size + 'px'
            };
        }
        else if (typeof size === 'string') {
            sizeClass = size === 'large'
                ? "".concat(prefix, "lg")
                : size === 'small' ? "".concat(prefix, "sm") : '';
        }
        var scaleX = "scale(".concat(scale, ") translateX(-50%)");
        var scaleStyle = {
            msTransform: scaleX,
            WebkitTransform: scaleX,
            transform: scaleX
        };
        if (typeof src === 'string' && hasImg) {
            var imgStyle = fit ? { objectFit: fit } : {};
            childrenRender = (React.createElement("img", { style: imgStyle, src: src, alt: alt, draggable: draggable, onError: this.handleImageLoadError, crossOrigin: crossOrigin }));
        }
        else if (isImgRender) {
            childrenRender = src;
        }
        else if (typeof text === 'string' || typeof text === 'number') {
            childrenRender = (React.createElement("span", { className: cx(childPrefix), ref: this.avatarChildrenRef, style: scaleStyle }, text));
        }
        else if (typeof icon === 'string') {
            childrenRender = (React.createElement("i", { className: icon }));
        }
        else if (isIconRender) {
            childrenRender = icon;
        }
        else {
            childrenRender = (React.createElement("span", { className: cx(childPrefix), ref: this.avatarChildrenRef, style: scaleStyle }, children));
        }
        return (React.createElement("span", { className: cx("Avatar", className, prefix + shape, sizeClass), style: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, sizeStyle), style), ref: this.avatarRef }, childrenRender));
    };
    Avatar.defaultProps = {
        shape: 'circle',
        size: 'default',
        fit: 'cover',
        gap: 4
    };
    return Avatar;
}(React.Component));
exports.Avatar = Avatar;
exports.default = (0, theme_1.themeable)(Avatar);
//# sourceMappingURL=./components/Avatar.js.map
