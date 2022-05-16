"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mobx_react_1 = require("mobx-react");
var react_1 = tslib_1.__importStar(require("react"));
function ItemActionsWrapper(props) {
    var _a;
    var cx = props.classnames;
    var children = props.children;
    var store = props.store;
    var divRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var _a;
        var row = store.hoverRow;
        if (!row) {
            return;
        }
        var frame = (_a = divRef.current.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('table');
        var dom = frame === null || frame === void 0 ? void 0 : frame.querySelector("tr[data-id=\"".concat(row.id, "\"]"));
        if (!dom) {
            return;
        }
        var rect = dom.getBoundingClientRect();
        var height = rect.height;
        var top = rect.top - frame.getBoundingClientRect().top;
        divRef.current.style.cssText += "top: ".concat(top, "px;height: ").concat(height, "px;");
    }, [(_a = store.hoverRow) === null || _a === void 0 ? void 0 : _a.id]);
    return (react_1.default.createElement("div", { className: cx('Table-itemActions-wrap'), ref: divRef }, children));
}
exports.default = (0, mobx_react_1.observer)(ItemActionsWrapper);
//# sourceMappingURL=./renderers/Table/ItemActionsWrapper.js.map
