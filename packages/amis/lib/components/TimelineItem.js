"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineItem = void 0;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var icons_1 = require("./icons");
function TimelineItem(props) {
    var time = props.time, title = props.title, detail = props.detail, detailCollapsedText = props.detailCollapsedText, detailExpandedText = props.detailExpandedText, color = props.color, icon = props.icon, cx = props.classnames, __ = props.translate, key = props.key;
    var _a = (0, react_1.useState)(false), detailVisible = _a[0], setDetailVisible = _a[1];
    var renderDetail = function (detail, detailCollapsedText, detailExpandedText) {
        if (detailCollapsedText === void 0) { detailCollapsedText = __('Timeline.collapseText'); }
        if (detailExpandedText === void 0) { detailExpandedText = __('Timeline.expandText'); }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: cx('TimelineItem-detail-button'), onClick: function () { return setDetailVisible(!detailVisible); } },
                detailVisible ? detailExpandedText : detailCollapsedText,
                react_1.default.createElement("div", { className: cx('TimelineItem-detail-arrow', "".concat(detailVisible && 'TimelineItem-detail-arrow-top')) },
                    react_1.default.createElement(icons_1.Icon, { icon: "tree-down" }))),
            react_1.default.createElement("div", { className: cx("".concat(detailVisible
                    ? 'TimelineItem-detail-visible'
                    : 'TimelineItem-detail-invisible')) }, detail)));
    };
    // 判断是否为颜色值
    var isColorVal = color && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);
    // 取level级颜色
    var levelColor = !isColorVal && color;
    return (react_1.default.createElement("div", { className: cx('TimelineItem'), key: key },
        react_1.default.createElement("div", { className: cx('TimelineItem-axle') },
            react_1.default.createElement("div", { className: cx('TimelineItem-line') }),
            icon ? (react_1.default.createElement("div", { className: cx('TimelineItem-icon') },
                react_1.default.createElement(icons_1.Icon, { icon: icon, className: "icon" }))) : (react_1.default.createElement("div", { className: cx('TimelineItem-round', levelColor && "TimelineItem-round--".concat(levelColor)), style: isColorVal ? { backgroundColor: color } : undefined }))),
        react_1.default.createElement("div", { className: cx('TimelineItem-content') },
            react_1.default.createElement("div", { className: cx('TimelineItem-time') }, time),
            react_1.default.createElement("div", { className: cx('TimelineItem-title') }, title),
            detail && (react_1.default.createElement("div", { className: cx('TimelineItem-detail') }, renderDetail(detail, detailCollapsedText, detailExpandedText))))));
}
exports.TimelineItem = TimelineItem;
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)(TimelineItem));
//# sourceMappingURL=./components/TimelineItem.js.map
