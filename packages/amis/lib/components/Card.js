"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var helper_1 = require("../utils/helper");
var theme_1 = require("../theme");
var style_1 = require("../utils/style");
var Card = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Card, _super);
    function Card(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    Card.prototype.handleClick = function (e) {
        if ((0, helper_1.isClickOnInput)(e)) {
            return;
        }
        this.props.onClick && this.props.onClick(e);
    };
    Card.prototype.render = function () {
        var _a = this.props, cx = _a.classnames, className = _a.className, headerClassName = _a.headerClassName, bodyClassName = _a.bodyClassName, titleClassName = _a.titleClassName, subTitleClassName = _a.subTitleClassName, descriptionClassName = _a.descriptionClassName, avatarClassName = _a.avatarClassName, avatarTextStyle = _a.avatarTextStyle, imageClassName = _a.imageClassName, avatarTextClassName = _a.avatarTextClassName, secondaryClassName = _a.secondaryClassName, footerClassName = _a.footerClassName, media = _a.media, mediaPosition = _a.mediaPosition, actions = _a.actions, children = _a.children, onClick = _a.onClick, toolbar = _a.toolbar, title = _a.title, subTitle = _a.subTitle, subTitlePlaceholder = _a.subTitlePlaceholder, description = _a.description, descriptionPlaceholder = _a.descriptionPlaceholder, secondary = _a.secondary, avatar = _a.avatar, avatarText = _a.avatarText, data = _a.data;
        var heading = null;
        var isShowHeading = avatar ||
            avatarText ||
            title ||
            subTitle ||
            subTitlePlaceholder ||
            description ||
            descriptionPlaceholder ||
            toolbar;
        if (isShowHeading) {
            heading = (react_1.default.createElement("div", { className: cx('Card-heading', headerClassName) },
                avatar ? (react_1.default.createElement("span", { className: cx('Card-avtar', avatarClassName) },
                    react_1.default.createElement("img", { className: cx('Card-img', imageClassName), src: avatar }))) : avatarText ? (react_1.default.createElement("span", { className: cx('Card-avtarText', avatarTextClassName), style: (0, style_1.buildStyle)(avatarTextStyle, data) }, avatarText)) : null,
                react_1.default.createElement("div", { className: cx('Card-meta') },
                    title ? (react_1.default.createElement("div", { className: cx('Card-title', titleClassName) }, title)) : null,
                    subTitle || subTitlePlaceholder ? (react_1.default.createElement("div", { className: cx('Card-subTitle', subTitleClassName) }, subTitle
                        ? subTitle
                        : subTitlePlaceholder
                            ? subTitlePlaceholder
                            : null)) : null,
                    description || descriptionPlaceholder ? (react_1.default.createElement("div", { className: cx('Card-desc', descriptionClassName) }, description
                        ? description
                        : descriptionPlaceholder
                            ? descriptionPlaceholder
                            : null)) : null),
                toolbar));
        }
        var body = children;
        return (react_1.default.createElement("div", { onClick: this.handleClick, className: cx('Card', className, {
                'Card--link': onClick
            }) }, media ? (react_1.default.createElement("div", { className: cx("Card-multiMedia--".concat(mediaPosition)) },
            media,
            react_1.default.createElement("div", { className: cx('Card-multiMedia-flex') },
                heading,
                body ? (react_1.default.createElement("div", { className: cx('Card-body', bodyClassName) }, body)) : null,
                secondary || actions ? (react_1.default.createElement("div", { className: cx('Card-footer-wrapper', footerClassName) },
                    secondary ? (react_1.default.createElement("div", { className: cx('Card-secondary', secondaryClassName) }, secondary)) : null,
                    actions ? (react_1.default.createElement("div", { className: cx('Card-actions-wrapper') }, actions)) : null)) : null))) : (react_1.default.createElement(react_1.default.Fragment, null,
            heading,
            body ? (react_1.default.createElement("div", { className: cx('Card-body', bodyClassName) }, body)) : null,
            secondary || actions ? (react_1.default.createElement("div", { className: cx('Card-footer-wrapper', footerClassName) },
                secondary ? (react_1.default.createElement("div", { className: cx('Card-secondary', secondaryClassName) }, secondary)) : null,
                actions ? (react_1.default.createElement("div", { className: cx('Card-actions-wrapper') }, actions)) : null)) : null))));
    };
    Card.defaultProps = {
        className: '',
        avatarClassName: '',
        headerClassName: '',
        footerClassName: '',
        secondaryClassName: '',
        avatarTextClassName: '',
        bodyClassName: '',
        titleClassName: '',
        subTitleClassName: '',
        descriptionClassName: '',
        imageClassName: '',
        mediaPosition: 'left'
    };
    return Card;
}(react_1.default.Component));
exports.Card = Card;
exports.default = (0, theme_1.themeable)(Card);
//# sourceMappingURL=./components/Card.js.map
