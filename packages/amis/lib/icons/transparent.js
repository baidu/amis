"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Transparent = function (props) { return react_1.default.createElement("svg", (0, tslib_1.__assign)({ className: "icon" }, props),
    react_1.default.createElement("defs", null,
        react_1.default.createElement("pattern", { id: "grid", width: 20, height: 20, patternUnits: "userSpaceOnUse" },
            react_1.default.createElement("rect", { fill: "black", x: 0, y: 0, width: 10, height: 10, opacity: 0.1 }),
            react_1.default.createElement("rect", { fill: "white", x: 10, y: 0, width: 10, height: 10 }),
            react_1.default.createElement("rect", { fill: "black", x: 10, y: 10, width: 10, height: 10, opacity: 0.1 }),
            react_1.default.createElement("rect", { fill: "white", x: 0, y: 10, width: 10, height: 10 }))),
    react_1.default.createElement("rect", { fill: "url(#grid)", x: 0, y: 0, width: "100%", height: "100%" })); };
exports.default = Transparent;
