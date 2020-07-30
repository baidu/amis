amis.define('src/icons/copy.svg', function(require, exports, module, define) {

  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  var tslib_1 = require("node_modules/tslib/tslib");
  var react_1 = tslib_1.__importDefault(require("node_modules/react/index"));
  var Copy = function (props) { return react_1.default.createElement("svg", tslib_1.__assign({ viewBox: "0 0 12 12", className: "icon" }, props),
      react_1.default.createElement("g", { stroke: "none", strokeWidth: 1, fill: "none", fillRule: "evenodd" },
          react_1.default.createElement("polyline", { id: "Stroke-1", stroke: "currentColor", points: "2.5 9.5 0.5 9.5 0.5 0.5 9.5 0.5 9.5 2.5" }),
          react_1.default.createElement("polygon", { id: "Stroke-3", stroke: "currentColor", points: "2.5 11.5 11.5 11.5 11.5 2.5 2.5 2.5" }))); };
  exports.default = Copy;
  

});
