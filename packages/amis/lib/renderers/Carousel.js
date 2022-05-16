"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselRenderer = exports.Carousel = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transition_1 = tslib_1.__importStar(require("react-transition-group/Transition"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var icons_1 = require("../components/icons");
var Html_1 = (0, tslib_1.__importDefault)(require("../components/Html"));
var Image_1 = (0, tslib_1.__importDefault)(require("../renderers/Image"));
var Scoped_1 = require("../Scoped");
var animationStyles = (_a = {},
    _a[Transition_1.ENTERING] = 'in',
    _a[Transition_1.ENTERED] = 'in',
    _a[Transition_1.EXITING] = 'out',
    _a);
var defaultSchema = {
    component: function (props) {
        var _a, _b;
        var data = props.data || {};
        var thumbMode = props.thumbMode;
        var cx = props.classnames;
        return (react_1.default.createElement(react_1.default.Fragment, null, data.hasOwnProperty('image') ? (react_1.default.createElement(Image_1.default, { src: data.image, title: data.title, href: data.href, blank: data.blank, htmlTarget: data.htmlTarget, imageCaption: data.description, thumbMode: (_b = (_a = data.thumbMode) !== null && _a !== void 0 ? _a : thumbMode) !== null && _b !== void 0 ? _b : 'contain', imageMode: "original", className: cx('Carousel-image') })) : data.hasOwnProperty('html') ? (react_1.default.createElement(Html_1.default, { html: data.html })) : data.hasOwnProperty('item') ? (react_1.default.createElement("span", null, data.item)) : (react_1.default.createElement("p", null))));
    }
};
var Carousel = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Carousel, _super);
    function Carousel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wrapperRef = react_1.default.createRef();
        _this.state = {
            current: 0,
            options: _this.props.options || (0, helper_1.getPropValue)(_this.props) || [],
            nextAnimation: ''
        };
        return _this;
    }
    Carousel.prototype.componentDidMount = function () {
        this.prepareAutoSlide();
    };
    Carousel.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        var nextOptions = props.options || (0, helper_1.getPropValue)(props) || [];
        var prevOptions = prevProps.options || (0, helper_1.getPropValue)(prevProps) || [];
        if ((0, helper_1.isArrayChildrenModified)(prevOptions, nextOptions)) {
            this.setState({
                options: nextOptions
            });
        }
    };
    Carousel.prototype.componentWillUnmount = function () {
        this.clearAutoTimeout();
    };
    Carousel.prototype.doAction = function (action, args, throwErrors) {
        var _a;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (!!~['next', 'prev'].indexOf(actionType)) {
            this.autoSlide(actionType);
        }
        else if (actionType === 'goto-image') {
            this.changeSlide(((_a = args) === null || _a === void 0 ? void 0 : _a.activeIndex) - 1);
        }
    };
    Carousel.prototype.prepareAutoSlide = function () {
        if (this.state.options.length < 2) {
            return;
        }
        this.clearAutoTimeout();
        if (this.props.auto) {
            this.intervalTimeout = setTimeout(this.autoSlide, this.props.interval);
        }
    };
    Carousel.prototype.autoSlide = function (rel) {
        this.clearAutoTimeout();
        var animation = this.props.animation;
        var nextAnimation = this.state.nextAnimation;
        switch (rel) {
            case 'prev':
                animation === 'slide'
                    ? (nextAnimation = 'slideRight')
                    : (nextAnimation = '');
                this.transitFramesTowards('right', nextAnimation);
                break;
            case 'next':
            default:
                nextAnimation = '';
                this.transitFramesTowards('left', nextAnimation);
                break;
        }
        this.durationTimeout = setTimeout(this.prepareAutoSlide, this.props.duration);
    };
    Carousel.prototype.transitFramesTowards = function (direction, nextAnimation) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var current, prevIndex, _a, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current = this.state.current;
                        prevIndex = current;
                        switch (direction) {
                            case 'left':
                                current = this.getFrameId('next');
                                break;
                            case 'right':
                                current = this.getFrameId('prev');
                                break;
                        }
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                activeIndex: current + 1,
                                prevIndex: prevIndex
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            current: current,
                            nextAnimation: nextAnimation
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Carousel.prototype.getFrameId = function (pos) {
        var _a = this.state, options = _a.options, current = _a.current;
        var total = options.length;
        switch (pos) {
            case 'prev':
                return (current - 1 + total) % total;
            case 'next':
                return (current + 1) % total;
            default:
                return current;
        }
    };
    Carousel.prototype.next = function () {
        this.autoSlide('next');
    };
    Carousel.prototype.prev = function () {
        this.autoSlide('prev');
    };
    Carousel.prototype.clearAutoTimeout = function () {
        clearTimeout(this.intervalTimeout);
        clearTimeout(this.durationTimeout);
    };
    Carousel.prototype.changeSlide = function (index) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var current, _a, dispatchEvent, data, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        current = this.state.current;
                        _a = this.props, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                activeIndex: index,
                                prevIndex: current
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        this.setState({
                            current: index
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Carousel.prototype.renderDots = function () {
        var _this = this;
        var cx = this.props.classnames;
        var _a = this.state, current = _a.current, options = _a.options;
        return (react_1.default.createElement("div", { className: cx('Carousel-dotsControl'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, Array.from({ length: options.length }).map(function (_, i) { return (react_1.default.createElement("span", { key: i, onClick: function () { return _this.changeSlide(i); }, className: cx('Carousel-dot', current === i ? 'is-active' : '') })); })));
    };
    Carousel.prototype.renderArrows = function () {
        var cx = this.props.classnames;
        return (react_1.default.createElement("div", { className: cx('Carousel-arrowsControl'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave },
            react_1.default.createElement("div", { className: cx('Carousel-leftArrow'), onClick: this.prev },
                react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" })),
            react_1.default.createElement("div", { className: cx('Carousel-rightArrow'), onClick: this.next },
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))));
    };
    Carousel.prototype.handleMouseEnter = function () {
        this.clearAutoTimeout();
    };
    Carousel.prototype.handleMouseLeave = function () {
        this.prepareAutoSlide();
    };
    Carousel.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, className = _a.className, cx = _a.classnames, itemSchema = _a.itemSchema, animation = _a.animation, width = _a.width, height = _a.height, controls = _a.controls, controlsTheme = _a.controlsTheme, placeholder = _a.placeholder, data = _a.data, name = _a.name;
        var _b = this.state, options = _b.options, current = _b.current, nextAnimation = _b.nextAnimation;
        var body = null;
        var carouselStyles = {};
        width ? (carouselStyles.width = width + 'px') : '';
        height ? (carouselStyles.height = height + 'px') : '';
        var _c = [
            controls.indexOf('dots') > -1,
            controls.indexOf('arrows') > -1
        ], dots = _c[0], arrows = _c[1];
        var animationName = nextAnimation || animation;
        if (Array.isArray(options) && options.length) {
            body = (react_1.default.createElement("div", { ref: this.wrapperRef, className: cx('Carousel-container'), onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave }, options.map(function (option, key) { return (react_1.default.createElement(Transition_1.default, { mountOnEnter: true, unmountOnExit: true, in: key === current, timeout: 500, key: key }, function (status) {
                var _a;
                if (status === Transition_1.ENTERING) {
                    _this.wrapperRef.current &&
                        _this.wrapperRef.current.childNodes.forEach(function (item) { return item.offsetHeight; });
                }
                return (react_1.default.createElement("div", { className: cx('Carousel-item', animationName, animationStyles[status]) }, render("".concat(current, "/body"), itemSchema ? itemSchema : defaultSchema, {
                    thumbMode: _this.props.thumbMode,
                    data: (0, helper_1.createObject)(data, (0, helper_1.isObject)(option)
                        ? option
                        : (_a = { item: option }, _a[name] = option, _a))
                })));
            })); })));
        }
        return (react_1.default.createElement("div", { className: cx("Carousel Carousel--".concat(controlsTheme), className), style: carouselStyles },
            body ? body : placeholder,
            dots ? this.renderDots() : null,
            arrows ? (react_1.default.createElement("div", { className: cx('Carousel-leftArrow'), onClick: this.prev },
                react_1.default.createElement(icons_1.Icon, { icon: "left-arrow", className: "icon" }))) : null,
            arrows ? (react_1.default.createElement("div", { className: cx('Carousel-rightArrow'), onClick: this.next },
                react_1.default.createElement(icons_1.Icon, { icon: "right-arrow", className: "icon" }))) : null));
    };
    Carousel.defaultProps = {
        auto: true,
        interval: 5000,
        duration: 500,
        controlsTheme: 'light',
        animation: 'fade',
        controls: ['dots', 'arrows'],
        placeholder: '-'
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "prepareAutoSlide", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "autoSlide", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String, String]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Carousel.prototype, "transitFramesTowards", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "getFrameId", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "next", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "prev", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "clearAutoTimeout", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], Carousel.prototype, "changeSlide", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "handleMouseEnter", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Carousel.prototype, "handleMouseLeave", null);
    return Carousel;
}(react_1.default.Component));
exports.Carousel = Carousel;
var CarouselRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(CarouselRenderer, _super);
    function CarouselRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    CarouselRenderer.prototype.componentWillUnmount = function () {
        var _a;
        (_a = _super.prototype.componentWillUnmount) === null || _a === void 0 ? void 0 : _a.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    var _b;
    CarouselRenderer.contextType = Scoped_1.ScopedContext;
    CarouselRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'carousel'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_b = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _b : Object])
    ], CarouselRenderer);
    return CarouselRenderer;
}(Carousel));
exports.CarouselRenderer = CarouselRenderer;
//# sourceMappingURL=./renderers/Carousel.js.map
