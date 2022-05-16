"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var DragBar = function (props) { return react_1.default.createElement("svg", (0, tslib_1.__assign)({ viewBox: "0 0 16 16", className: "icon" }, props),
    react_1.default.createElement("g", { transform: "translate(5.000000, 1.000000)", strokeWidth: 1, stroke: "currentColor" },
        react_1.default.createElement("circle", { cx: 1, cy: 1, r: 1 }),
        react_1.default.createElement("circle", { cx: 5, cy: 1, r: 1 }),
        react_1.default.createElement("circle", { cx: 1, cy: 5, r: 1 }),
        react_1.default.createElement("circle", { cx: 5, cy: 5, r: 1 }),
        react_1.default.createElement("circle", { cx: 1, cy: 9, r: 1 }),
        react_1.default.createElement("circle", { cx: 5, cy: 9, r: 1 }),
        react_1.default.createElement("circle", { cx: 1, cy: 13, r: 1 }),
        react_1.default.createElement("circle", { cx: 5, cy: 13, r: 1 }))); };
exports.default = DragBar;
