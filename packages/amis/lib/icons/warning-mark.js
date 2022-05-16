"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var WarningMark = function (props) { return react_1.default.createElement("svg", (0, tslib_1.__assign)({ viewBox: "0 0 12 12", className: "icon" }, props),
    react_1.default.createElement("g", { stroke: "none", strokeWidth: 1, fill: "none", fillRule: "evenodd" },
        react_1.default.createElement("g", { stroke: "currentColor" },
            react_1.default.createElement("g", null,
                react_1.default.createElement("rect", { x: 5.5, y: 2.5, width: 1, height: 5 }),
                react_1.default.createElement("rect", { x: 5.5, y: 9.5, width: 1, height: 1 }))))); };
exports.default = WarningMark;
