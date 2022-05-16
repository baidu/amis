"use strict";
/**
 * @file markdown 解析
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var markdown_it_1 = (0, tslib_1.__importDefault)(require("markdown-it"));
// @ts-ignore
var markdown_it_html5_media_1 = require("markdown-it-html5-media");
var markdown = (0, markdown_it_1.default)();
markdown.use(markdown_it_html5_media_1.html5Media);
function default_1(content, options) {
    if (options) {
        markdown.set(options);
    }
    return markdown.render(content);
}
exports.default = default_1;
//# sourceMappingURL=./utils/markdown.js.map
