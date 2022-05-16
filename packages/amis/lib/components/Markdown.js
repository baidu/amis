"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var markdown_1 = (0, tslib_1.__importDefault)(require("../utils/markdown"));
var Markdown = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Markdown, _super);
    function Markdown(props) {
        var _this = _super.call(this, props) || this;
        _this.htmlRef = _this.htmlRef.bind(_this);
        return _this;
    }
    Markdown.prototype.htmlRef = function (dom) {
        this.dom = dom;
        if (!dom) {
            return;
        }
        this._render();
    };
    Markdown.prototype.componentDidUpdate = function (nextProps) {
        if (this.props.content !== nextProps.content) {
            this._render();
        }
    };
    Markdown.prototype._render = function () {
        var _a = this.props, content = _a.content, options = _a.options;
        this.dom.innerHTML = (0, markdown_1.default)(content, options);
    };
    Markdown.prototype.render = function () {
        return (react_1.default.createElement("div", { "data-testid": "markdown-body", className: "markdown-body", ref: this.htmlRef }));
    };
    Markdown.defaultProps = {
        content: '',
        options: {
            linkify: true
        }
    };
    return Markdown;
}(react_1.default.Component));
exports.default = Markdown;
//# sourceMappingURL=./components/Markdown.js.map
