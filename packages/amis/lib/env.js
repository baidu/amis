"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRendererEnv = exports.EnvContext = void 0;
var tslib_1 = require("tslib");
/**
 * @file 组件 Env，包括如何发送 ajax，如何通知，如何跳转等等。。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
exports.EnvContext = react_1.default.createContext(undefined);
function withRendererEnv(ComposedComponent) {
    var _a;
    var result = (0, hoist_non_react_statics_1.default)((_a = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_1.prototype.render = function () {
                var injectedProps = {
                    env: this.props.env || this.context
                };
                if (!injectedProps.env) {
                    throw new Error('Env 信息获取失败，组件用法不正确');
                }
                return (react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, this.props, injectedProps)));
            };
            return class_1;
        }(react_1.default.Component)),
        _a.displayName = "WithEnv(".concat(ComposedComponent.displayName || ComposedComponent.name, ")"),
        _a.contextType = exports.EnvContext,
        _a.ComposedComponent = ComposedComponent,
        _a), ComposedComponent);
    return result;
}
exports.withRendererEnv = withRendererEnv;
//# sourceMappingURL=./env.js.map
