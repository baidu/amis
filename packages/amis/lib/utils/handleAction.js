"use strict";
/**
 * 后续好多地方可能都要支持 action，所以提取公共功能
 */
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
function handleAction(e, action, props, data) {
    // https://reactjs.org/docs/legacy-event-pooling.html
    e.persist(); // 等 react 17之后去掉 event pooling 了，这个应该就没用了
    var onAction = props.onAction;
    var onClick = action.onClick;
    if (typeof onClick === 'string') {
        onClick = (0, api_1.str2function)(onClick, 'event', 'props', 'data');
    }
    var result = onClick && onClick(e, props, data || props.data);
    if (e.isDefaultPrevented() || result === false || !onAction) {
        return;
    }
    e.preventDefault();
    // download 是一种 ajax 的简写
    if (action.actionType === 'download') {
        action.actionType = 'ajax';
        var api = (0, api_1.normalizeApi)(action.api);
        api.responseType = 'blob';
        action.api = api;
    }
    onAction(e, action, data || props.data);
}
exports.default = handleAction;
//# sourceMappingURL=./utils/handleAction.js.map
