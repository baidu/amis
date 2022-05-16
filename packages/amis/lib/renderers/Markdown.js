"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownRenderer = exports.Markdown = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用来渲染 Markdown
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("../components/LazyComponent"));
var helper_1 = require("../utils/helper");
var api_1 = require("../utils/api");
function loadComponent() {
    return Promise.resolve().then(function () { return new Promise(function(resolve){require(['../components/Markdown'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (item) { return item.default; });
}
var Markdown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Markdown, _super);
    function Markdown(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, name = _a.name, data = _a.data, src = _a.src;
        if (src) {
            _this.state = { content: '' };
            _this.updateContent();
        }
        else {
            var content = (0, helper_1.getPropValue)(_this.props) ||
                (name && (0, tpl_builtin_1.isPureVariable)(name)
                    ? (0, tpl_builtin_1.resolveVariableAndFilter)(name, data, '| raw')
                    : null);
            _this.state = { content: content };
        }
        return _this;
    }
    Markdown.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (props.src) {
            if ((0, api_1.isApiOutdated)(prevProps.src, props.src, prevProps.data, props.data)) {
                this.updateContent();
            }
        }
        else {
            this.updateContent();
        }
    };
    Markdown.prototype.updateContent = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, name, data, src, env, ret, content;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, name = _a.name, data = _a.data, src = _a.src, env = _a.env;
                        if (!(src && (0, api_1.isEffectiveApi)(src, data))) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(src, data)];
                    case 1:
                        ret = _b.sent();
                        if (typeof ret === 'string') {
                            this.setState({ content: ret });
                        }
                        else if (typeof ret === 'object' && ret.data) {
                            this.setState({ content: ret.data });
                        }
                        else {
                            console.error('markdown response error', ret);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        content = (0, helper_1.getPropValue)(this.props) ||
                            (name && (0, tpl_builtin_1.isPureVariable)(name)
                                ? (0, tpl_builtin_1.resolveVariableAndFilter)(name, data, '| raw')
                                : null);
                        if (content !== this.state.content) {
                            this.setState({ content: content });
                        }
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Markdown.prototype.render = function () {
        var _a = this.props, className = _a.className, cx = _a.classnames, options = _a.options;
        return (react_1.default.createElement("div", { className: cx('Markdown', className) },
            react_1.default.createElement(LazyComponent_1.default, { getComponent: loadComponent, content: this.state.content || '', options: options })));
    };
    return Markdown;
}(react_1.default.Component));
exports.Markdown = Markdown;
var MarkdownRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MarkdownRenderer, _super);
    function MarkdownRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MarkdownRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'markdown'
        })
    ], MarkdownRenderer);
    return MarkdownRenderer;
}(Markdown));
exports.MarkdownRenderer = MarkdownRenderer;
//# sourceMappingURL=./renderers/Markdown.js.map
