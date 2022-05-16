"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeable = exports.ThemeContext = exports.defaultTheme = exports.getTheme = exports.getClassPrefix = exports.classnames = exports.setDefaultTheme = exports.hasTheme = exports.makeClassnames = exports.theme = void 0;
var tslib_1 = require("tslib");
// 主题管理
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var themes = {
    default: {}
};
function theme(name, config) {
    themes[name] = (0, tslib_1.__assign)({}, config);
}
exports.theme = theme;
var fns = {};
function makeClassnames(ns) {
    if (ns && fns[ns]) {
        return fns[ns];
    }
    var fn = function () {
        var classes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classes[_i] = arguments[_i];
        }
        var str = classnames_1.default.apply(void 0, classes);
        return str && ns
            ? str
                .replace(/(^|\s)([A-Z])/g, '$1' + ns + '$2')
                .replace(/(^|\s)\:/g, '$1')
            : str || '';
    };
    ns && (fns[ns] = fn);
    return fn;
}
exports.makeClassnames = makeClassnames;
function hasTheme(theme) {
    return !!themes[theme];
}
exports.hasTheme = hasTheme;
function setDefaultTheme(theme) {
    if (hasTheme(theme)) {
        exports.defaultTheme = theme;
    }
}
exports.setDefaultTheme = setDefaultTheme;
function classnames() {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classes[_i] = arguments[_i];
    }
    return getTheme(exports.defaultTheme).classnames.apply(null, classes);
}
exports.classnames = classnames;
function getClassPrefix() {
    return getTheme(exports.defaultTheme).classPrefix;
}
exports.getClassPrefix = getClassPrefix;
function getTheme(theme) {
    var config = themes[theme || 'cxd'];
    if (!config.getRendererConfig) {
        config.getRendererConfig = function (name) {
            return config.renderers && name ? config.renderers[name] : null;
        };
    }
    if (!config.classnames) {
        var ns = config.classPrefix;
        config.classnames = config.classnames || makeClassnames(ns);
    }
    if (!config.getComponentConfig) {
        config.getComponentConfig = function (name) {
            return config.components && name ? config.components[name] : null;
        };
    }
    return config;
}
exports.getTheme = getTheme;
exports.defaultTheme = 'cxd';
exports.ThemeContext = react_1.default.createContext('');
function themeable(ComposedComponent) {
    var _a;
    var result = (0, hoist_non_react_statics_1.default)((_a = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(class_1, _super);
            function class_1(props) {
                var _this = _super.call(this, props) || this;
                _this.childRef = _this.childRef.bind(_this);
                _this.getWrappedInstance = _this.getWrappedInstance.bind(_this);
                return _this;
            }
            class_1.prototype.childRef = function (ref) {
                while (ref && ref.getWrappedInstance) {
                    ref = ref.getWrappedInstance();
                }
                this.ref = ref;
            };
            class_1.prototype.getWrappedInstance = function () {
                return this.ref;
            };
            class_1.prototype.render = function () {
                var _a;
                var theme = this.props.theme || this.context || exports.defaultTheme;
                var config = hasTheme(theme)
                    ? getTheme(theme)
                    : getTheme(exports.defaultTheme);
                var injectedProps = {
                    classPrefix: config.classPrefix,
                    classnames: config.classnames,
                    theme: theme
                };
                var refConfig = ((_a = ComposedComponent.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent)
                    ? { ref: this.childRef }
                    : { forwardedRef: this.childRef };
                return (react_1.default.createElement(exports.ThemeContext.Provider, { value: theme },
                    react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, config.getComponentConfig(ComposedComponent.themeKey), this.props, injectedProps, refConfig))));
            };
            return class_1;
        }(react_1.default.Component)),
        _a.displayName = "Themeable(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = exports.ThemeContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}
exports.themeable = themeable;
//# sourceMappingURL=./theme.js.map
