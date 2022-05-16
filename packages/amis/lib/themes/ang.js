"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classnames = exports.classPrefix = void 0;
var theme_1 = require("../theme");
exports.classPrefix = 'a-';
exports.classnames = (0, theme_1.makeClassnames)(exports.classPrefix);
(0, theme_1.theme)('ang', {
    classPrefix: exports.classPrefix,
    classnames: exports.classnames
});
//# sourceMappingURL=./themes/ang.js.map
