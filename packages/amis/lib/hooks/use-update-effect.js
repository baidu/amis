"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useUpdateEffect = function (effect, deps) {
    var isMounted = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(function () {
        if (!isMounted.current) {
            isMounted.current = true;
        }
        else {
            return effect();
        }
        return undefined;
    }, deps);
};
exports.default = useUpdateEffect;
//# sourceMappingURL=./hooks/use-update-effect.js.map
