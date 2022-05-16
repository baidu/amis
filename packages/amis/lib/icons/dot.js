"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Dot = function (props) { return react_1.default.createElement("svg", (0, tslib_1.__assign)({ viewBox: "0 0 16 16", className: "icon" }, props),
    react_1.default.createElement("title", null, "\u72B6\u6001\u5706"),
    react_1.default.createElement("g", { id: "\\u72B6\\u6001\\u5706", stroke: "none", strokeWidth: 1, fill: "none", fillRule: "evenodd" },
        react_1.default.createElement("circle", { id: "dot", fill: "currentColor", cx: 8, cy: 8, r: 6 }),
        react_1.default.createElement("circle", { id: "dotWave", cx: 8, cy: 8, r: 6, fill: "currentColor", opacity: 0.5 },
            react_1.default.createElement("animate", { attributeName: "r", begin: 0, values: "6;8;6", dur: 1.5, repeatCount: "indefinite" })))); };
exports.default = Dot;
