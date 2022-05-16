"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classnames = exports.classPrefix = void 0;
var theme_1 = require("../theme");
exports.classPrefix = 'dark-';
exports.classnames = (0, theme_1.makeClassnames)(exports.classPrefix);
(0, theme_1.theme)('dark', {
    classPrefix: exports.classPrefix,
    classnames: exports.classnames,
    renderers: {
        'json': {
            jsonTheme: 'eighties'
        },
        'editor-control': {
            editorTheme: 'vs-dark'
        }
    }
});
//# sourceMappingURL=./themes/dark.js.map
