"use strict";
/**
 * @file Rating
 * @description
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var validations_1 = require("../utils/validations");
var icons_1 = require("./icons");
var Rating = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Rating, _super);
    function Rating(props) {
        var _this = _super.call(this, props) || this;
        _this.starsNode = {};
        _this.state = {
            value: props.value || 0,
            stars: [],
            isClear: false,
            halfStar: {
                at: Math.floor(props.value),
                hidden: props.half && props.value % 1 < 0.5
            },
            showColor: '',
            showText: null,
            hoverValue: null
        };
        _this.getRate = _this.getRate.bind(_this);
        _this.getStars = _this.getStars.bind(_this);
        _this.moreThanHalf = _this.moreThanHalf.bind(_this);
        _this.mouseOver = _this.mouseOver.bind(_this);
        _this.mouseLeave = _this.mouseLeave.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.saveRef = _this.saveRef.bind(_this);
        _this.handleStarMouseLeave = _this.handleStarMouseLeave.bind(_this);
        return _this;
    }
    Rating.prototype.componentDidMount = function () {
        var value = this.state.value;
        this.setState({
            stars: this.getStars(value)
        });
        this.getShowColorAndText(value);
    };
    Rating.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var props = this.props;
        if (props.value !== prevProps.value) {
            this.setState({
                stars: this.getStars(props.value),
                value: props.value,
                halfStar: {
                    at: Math.floor(props.value),
                    hidden: props.half && props.value % 1 < 0.5
                }
            }, function () {
                _this.getShowColorAndText(props.value);
            });
        }
    };
    Rating.prototype.sortKeys = function (map) {
        // 需验证 key 是否是数字，需要过滤掉非数字key，如 $$id
        return Object.keys(map).filter(function (item) { return validations_1.validations.isNumeric({}, item); }).sort(function (a, b) { return Number(a) - Number(b); });
    };
    Rating.prototype.getShowColorAndText = function (value) {
        var _a = this.props, colors = _a.colors, texts = _a.texts, half = _a.half;
        if (!value)
            return this.setState({
                showText: null
            });
        // 对 value 取整
        if (half) {
            value = Math.floor(Number(value) * 2) / 2;
        }
        else {
            value = Math.floor(value);
        }
        if (colors && typeof colors !== 'string') {
            var keys = this.sortKeys(colors);
            var showKey = keys.filter(function (item) { return Number(item) < value; }).length;
            var showColor = keys[showKey] !== undefined && colors[keys[showKey]];
            // 取最大 key 的颜色，避免如下情况：colors 只设置了 1-4，value 为 5，导致取不到颜色而无法显示
            var lastColor = keys.length && colors[keys[keys.length - 1]];
            this.setState({
                showColor: showColor || lastColor || ''
            });
        }
        else if (colors && typeof colors === 'string') {
            this.setState({
                showColor: colors
            });
        }
        if (texts && (0, helper_1.isObject)(texts)) {
            var keys = this.sortKeys(texts);
            var showKey = keys.filter(function (item) { return Number(item) < value; }).length;
            var showText = keys[showKey] !== undefined &&
                texts[keys[showKey]];
            this.setState({
                showText: showText || ''
            });
        }
    };
    Rating.prototype.getRate = function () {
        var stars;
        var value = this.state.value;
        var half = this.props.half;
        if (half) {
            stars = Math.floor(value);
        }
        else {
            stars = Math.round(value);
        }
        return stars;
    };
    Rating.prototype.getStars = function (activeCount) {
        if (typeof activeCount === 'undefined') {
            activeCount = this.getRate();
        }
        var stars = [];
        var count = this.props.count;
        for (var i = 0; i < count; i++) {
            stars.push({
                active: i <= activeCount - 1
            });
        }
        return stars;
    };
    Rating.prototype.saveRef = function (index) {
        var _this = this;
        return function (node) {
            _this.starsNode[String(index)] = node;
        };
    };
    Rating.prototype.mouseOver = function (event, index) {
        var isClear = this.state.isClear;
        if (isClear)
            return;
        var _a = this.props, readOnly = _a.readOnly, half = _a.half;
        if (readOnly)
            return;
        if (half) {
            var isAtHalf = this.moreThanHalf(event, index);
            var tmpValue = isAtHalf ? index + 1 : index + 0.5;
            this.getShowColorAndText(tmpValue);
            this.onHoverChange(tmpValue);
            if (isAtHalf)
                index = index + 1;
            this.setState({
                halfStar: {
                    at: index,
                    hidden: isAtHalf
                }
            });
        }
        else {
            index = index + 1;
            this.onHoverChange(index);
            this.getShowColorAndText(index);
        }
        this.setState({
            stars: this.getStars(index)
        });
    };
    Rating.prototype.onHoverChange = function (value) {
        var onHoverChange = this.props.onHoverChange;
        var hoverValue = this.state.hoverValue;
        if (!hoverValue || (hoverValue && hoverValue !== value)) {
            this.setState({
                hoverValue: value
            });
            onHoverChange && onHoverChange(value);
        }
    };
    Rating.prototype.moreThanHalf = function (event, index) {
        var star = this.starsNode[index];
        var leftPos = star.getBoundingClientRect().left;
        return event.clientX - leftPos > star.clientWidth / 2;
    };
    Rating.prototype.mouseLeave = function () {
        var _a = this.state, value = _a.value, isClear = _a.isClear;
        var _b = this.props, half = _b.half, readOnly = _b.readOnly;
        if (readOnly)
            return;
        if (isClear)
            return this.setState({
                isClear: false,
                hoverValue: null
            });
        if (half) {
            this.setState({
                halfStar: {
                    at: Math.floor(value),
                    hidden: value % 1 === 0 // check value is decimal or not
                }
            });
        }
        this.setState({
            stars: this.getStars(),
            hoverValue: null
        });
        this.getShowColorAndText(value);
    };
    Rating.prototype.handleStarMouseLeave = function (event, index) {
        var star = this.starsNode[index];
        var leftSideX = star.getBoundingClientRect().left;
        var isClear = this.state.isClear;
        if (isClear)
            return this.setState({ isClear: false });
        // leave star from left side
        if (event.clientX <= leftSideX) {
            this.getShowColorAndText(index);
            this.setState({
                stars: this.getStars(index),
                halfStar: {
                    at: index,
                    hidden: true
                }
            });
        }
    };
    Rating.prototype.handleClick = function (event, index) {
        var _a = this.props, half = _a.half, readOnly = _a.readOnly, onChange = _a.onChange, allowClear = _a.allowClear;
        if (readOnly)
            return;
        var value;
        if (half) {
            var isAtHalf = this.moreThanHalf(event, index);
            if (isAtHalf)
                index = index + 1;
            value = isAtHalf ? index : index + 0.5;
            this.setState({
                halfStar: {
                    at: index,
                    hidden: isAtHalf
                }
            });
        }
        else {
            value = index = index + 1;
        }
        var isClear = allowClear && value === this.state.value;
        if (isClear)
            value = index = 0;
        this.setState({
            value: value,
            stars: this.getStars(index),
            isClear: isClear
        });
        this.getShowColorAndText(value);
        onChange && onChange(value);
    };
    Rating.prototype.renderStars = function () {
        var _this = this;
        var _a = this.state, halfStar = _a.halfStar, stars = _a.stars, showColor = _a.showColor;
        var _b = this.props, inactiveColor = _b.inactiveColor, char = _b.char, half = _b.half, disabled = _b.disabled, readOnly = _b.readOnly, charClassName = _b.charClassName, cx = _b.classnames;
        return (react_1.default.createElement("ul", { onMouseLeave: this.mouseLeave }, stars.map(function (star, i) {
            var isThisHalf = half && !halfStar.hidden && halfStar.at === i;
            return (react_1.default.createElement("li", { ref: _this.saveRef(i), className: cx('Rating-star', charClassName, {
                    'is-half': isThisHalf,
                    'is-active': star.active,
                    'is-disabled': readOnly || disabled
                }), key: i, style: {
                    color: star.active ? showColor : inactiveColor
                }, onMouseOver: function (e) { return _this.mouseOver(e, i); }, onMouseMove: function (e) { return _this.mouseOver(e, i); }, onClick: function (e) { return _this.handleClick(e, i); }, onMouseLeave: function (e) { return _this.handleStarMouseLeave(e, i); } },
                isThisHalf && (react_1.default.createElement("div", { className: cx('Rating-star-half'), style: {
                        color: showColor
                    } }, char)),
                char));
        })));
    };
    Rating.prototype.renderText = function () {
        var _a;
        var showText = this.state.showText;
        var _b = this.props, textClassName = _b.textClassName, textPosition = _b.textPosition, cx = _b.classnames;
        if (!showText)
            return null;
        return (react_1.default.createElement("span", { className: cx('Rating-text', textClassName, (_a = {},
                _a["Rating-text--".concat(textPosition === 'left' ? 'left' : 'right')] = textPosition,
                _a)) }, showText));
    };
    Rating.prototype.render = function () {
        var _a = this.props, className = _a.className, textPosition = _a.textPosition, cx = _a.classnames;
        return (react_1.default.createElement("div", { className: cx('Rating', className) }, textPosition === 'left' ? (react_1.default.createElement(react_1.default.Fragment, null,
            this.renderText(),
            this.renderStars())) : (react_1.default.createElement(react_1.default.Fragment, null,
            this.renderStars(),
            this.renderText()))));
    };
    Rating.defaultProps = {
        containerClass: 'rating',
        readOnly: false,
        half: true,
        allowClear: true,
        value: 0,
        count: 5,
        char: react_1.default.createElement(icons_1.Icon, { icon: "star", className: "icon" }),
        colors: {
            '2': '#abadb1',
            '3': '#787b81',
            '5': '#ffa900'
        },
        textPosition: 'right'
    };
    return Rating;
}(react_1.default.Component));
exports.Rating = Rating;
exports.default = (0, theme_1.themeable)(Rating);
//# sourceMappingURL=./components/Rating.js.map
