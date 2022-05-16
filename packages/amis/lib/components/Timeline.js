"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var TimelineItem_1 = (0, tslib_1.__importDefault)(require("./TimelineItem"));
function Timeline(props) {
    var items = props.items, cx = props.classnames, _a = props.direction, direction = _a === void 0 ? 'vertical' : _a, _b = props.reverse, reverse = _b === void 0 ? false : _b, _c = props.mode, mode = _c === void 0 ? 'right' : _c;
    var timelineDatasource = items === null || items === void 0 ? void 0 : items.slice();
    reverse && (timelineDatasource === null || timelineDatasource === void 0 ? void 0 : timelineDatasource.reverse());
    return (react_1.default.createElement("div", { className: cx('Timeline', "Timeline-".concat(direction), "Timeline-".concat(mode)) }, timelineDatasource === null || timelineDatasource === void 0 ? void 0 : timelineDatasource.map(function (item, index) { return (react_1.default.createElement(TimelineItem_1.default, (0, tslib_1.__assign)({}, item, { key: "TimelineItem-".concat(index) }))); })));
}
exports.Timeline = Timeline;
exports.default = (0, theme_1.themeable)(Timeline);
//# sourceMappingURL=./components/Timeline.js.map
