"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderChild = exports.renderChildren = exports.Root = void 0;
var tslib_1 = require("tslib");
var isPlainObject_1 = (0, tslib_1.__importDefault)(require("lodash/isPlainObject"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var ImageGallery_1 = (0, tslib_1.__importDefault)(require("./components/ImageGallery"));
var locale_1 = require("./locale");
var RootRenderer_1 = require("./RootRenderer");
var SchemaRenderer_1 = require("./SchemaRenderer");
var Scoped_1 = (0, tslib_1.__importDefault)(require("./Scoped"));
var theme_1 = require("./theme");
var helper_1 = require("./utils/helper");
var WithRootStore_1 = require("./WithRootStore");
var Root = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Root, _super);
    function Root() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Root.prototype.resolveDefinitions = function (name) {
        var definitions = this.props.schema.definitions;
        if (!name || (0, helper_1.isEmpty)(definitions)) {
            return {};
        }
        return definitions && definitions[name];
    };
    Root.prototype.render = function () {
        var _a = this.props, schema = _a.schema, rootStore = _a.rootStore, env = _a.env, pathPrefix = _a.pathPrefix, location = _a.location, data = _a.data, locale = _a.locale, translate = _a.translate, rest = (0, tslib_1.__rest)(_a, ["schema", "rootStore", "env", "pathPrefix", "location", "data", "locale", "translate"]);
        var theme = env.theme;
        var themeName = this.props.theme || 'cxd';
        if (themeName === 'default') {
            themeName = 'cxd';
        }
        return (react_1.default.createElement(WithRootStore_1.RootStoreContext.Provider, { value: rootStore },
            react_1.default.createElement(theme_1.ThemeContext.Provider, { value: themeName },
                react_1.default.createElement(locale_1.LocaleContext.Provider, { value: this.props.locale },
                    react_1.default.createElement(ImageGallery_1.default, { modalContainer: env.getModalContainer },
                        react_1.default.createElement(RootRenderer_1.RootRenderer, (0, tslib_1.__assign)({ pathPrefix: pathPrefix || '', schema: (0, isPlainObject_1.default)(schema)
                                ? (0, tslib_1.__assign)({ type: 'page' }, schema) : schema }, rest, { rootStore: rootStore, resolveDefinitions: this.resolveDefinitions, location: location, data: data, env: env, classnames: theme.classnames, classPrefix: theme.classPrefix, locale: locale, translate: translate })))))));
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [String]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Root.prototype, "resolveDefinitions", null);
    return Root;
}(react_1.default.Component));
exports.Root = Root;
function renderChildren(prefix, node, props) {
    if (Array.isArray(node)) {
        return node.map(function (node, index) {
            return renderChild("".concat(prefix, "/").concat(index), node, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props), { key: "".concat(props.key ? "".concat(props.key, "-") : '').concat(index) }));
        });
    }
    return renderChild(prefix, node, props);
}
exports.renderChildren = renderChildren;
function renderChild(prefix, node, props) {
    if (Array.isArray(node)) {
        return renderChildren(prefix, node, props);
    }
    var typeofnode = typeof node;
    if (typeofnode === 'undefined' || node === null) {
        return null;
    }
    var schema = typeofnode === 'string' || typeofnode === 'number'
        ? { type: 'tpl', tpl: String(node) }
        : node;
    var transform = props.propsTransform;
    if (transform) {
        props = (0, tslib_1.__assign)({}, props);
        delete props.propsTransform;
        props = transform(props);
    }
    return (react_1.default.createElement(SchemaRenderer_1.SchemaRenderer, (0, tslib_1.__assign)({}, props, { schema: schema, propKey: schema.key, "$path": "".concat(prefix ? "".concat(prefix, "/") : '').concat((schema && schema.type) || '') })));
}
exports.renderChild = renderChild;
exports.default = (0, Scoped_1.default)(Root);
//# sourceMappingURL=./Root.js.map
