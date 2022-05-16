"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineRenderer = exports.TimelineCmpt = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var Timeline_1 = (0, tslib_1.__importDefault)(require("../components/Timeline"));
var tpl_1 = require("../utils/tpl");
var WithRemoteConfig_1 = require("../components/WithRemoteConfig");
function TimelineCmpt(props) {
    var items = props.items, mode = props.mode, direction = props.direction, reverse = props.reverse, data = props.data, config = props.config, source = props.source, render = props.render;
    // 获取源数据
    var timelineItemsRow = config || items || [];
    // 渲染内容
    var resolveRender = function (region, val) { return typeof val === 'string'
        ? (0, tpl_1.filter)(val, data)
        : (val && render(region, val)); };
    // 处理源数据
    var resolveTimelineItems = timelineItemsRow === null || timelineItemsRow === void 0 ? void 0 : timelineItemsRow.map(function (timelineItem) {
        return (0, tslib_1.__assign)((0, tslib_1.__assign)({}, timelineItem), { icon: resolveRender('icon', timelineItem.icon), title: resolveRender('title', timelineItem.title) });
    });
    return (react_1.default.createElement(Timeline_1.default, { items: resolveTimelineItems, direction: direction, reverse: reverse, mode: mode }));
}
exports.TimelineCmpt = TimelineCmpt;
var TimelineWithRemoteConfig = (0, WithRemoteConfig_1.withRemoteConfig)({
    adaptor: function (data) { return data.items || data; }
})(/** @class */ (function (_super) {
    (0, tslib_1.__extends)(class_1, _super);
    function class_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    class_1.prototype.render = function () {
        var _a = this.props, config = _a.config, deferLoad = _a.deferLoad, loading = _a.loading, updateConfig = _a.updateConfig, rest = (0, tslib_1.__rest)(_a, ["config", "deferLoad", "loading", "updateConfig"]);
        return react_1.default.createElement(TimelineCmpt, (0, tslib_1.__assign)({ config: config }, rest));
    };
    return class_1;
}(react_1.default.Component)));
var TimelineRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TimelineRenderer, _super);
    function TimelineRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TimelineRenderer.prototype.render = function () {
        return react_1.default.createElement(TimelineWithRemoteConfig, (0, tslib_1.__assign)({}, this.props));
    };
    TimelineRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'timeline'
        })
    ], TimelineRenderer);
    return TimelineRenderer;
}(react_1.default.Component));
exports.TimelineRenderer = TimelineRenderer;
//# sourceMappingURL=./renderers/Timeline.js.map
