"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withStore = void 0;
var tslib_1 = require("tslib");
/**
 * 接管 store 的生命周期，这个比较轻量，适合在组件中使用。
 * 相比渲染器中的 withStore，这里面的 store 不会在一个大树中。
 * 而且不会知道父级和子级中还有哪些 store。
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var mobx_state_tree_1 = require("mobx-state-tree");
var mobx_react_1 = require("mobx-react");
function withStore(storeFactory) {
    return function (ComposedComponent) {
        var _a;
        ComposedComponent = (0, mobx_react_1.observer)(ComposedComponent);
        var result = (0, hoist_non_react_statics_1.default)((_a = /** @class */ (function (_super) {
                (0, tslib_1.__extends)(class_1, _super);
                function class_1() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.store = storeFactory(_this.props);
                    _this.refFn = function (ref) {
                        _this.ref = ref;
                    };
                    return _this;
                }
                class_1.prototype.componentWillUnmount = function () {
                    this.store && (0, mobx_state_tree_1.destroy)(this.store);
                    delete this.store;
                };
                class_1.prototype.getWrappedInstance = function () {
                    return this.ref;
                };
                class_1.prototype.render = function () {
                    var injectedProps = {
                        store: this.store
                    };
                    return (react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, this.props, injectedProps, { ref: this.refFn })));
                };
                return class_1;
            }(react_1.default.Component)),
            _a.displayName = "WithStore(".concat(ComposedComponent.displayName || 'Unkown', ")"),
            _a.ComposedComponent = ComposedComponent,
            _a), ComposedComponent);
        return result;
    };
}
exports.withStore = withStore;
//# sourceMappingURL=./components/WithStore.js.map
