"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingFieldRenderer = exports.MappingField = exports.Store = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var WithStore_1 = require("../components/WithStore");
var mobx_state_tree_1 = require("mobx-state-tree");
var helper_1 = require("../utils/helper");
var node_1 = require("../store/node");
var tpl_builtin_1 = require("../utils/tpl-builtin");
var api_1 = require("../utils/api");
exports.Store = node_1.StoreNode.named('MappingStore')
    .props({
    fetching: false,
    errorMsg: '',
    map: mobx_state_tree_1.types.frozen({})
})
    .actions(function (self) {
    var load = (0, mobx_state_tree_1.flow)(function (env, api, data) {
        var ret, data_1, e_1;
        return (0, tslib_1.__generator)(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    self.fetching = true;
                    return [4 /*yield*/, env.fetcher(api, data)];
                case 1:
                    ret = _a.sent();
                    if (ret.ok) {
                        data_1 = (0, api_1.normalizeApiResponseData)(ret.data);
                        self.setMap(data_1);
                    }
                    else {
                        throw new Error(ret.msg || 'fetch error');
                    }
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    self.errorMsg = e_1.message;
                    return [3 /*break*/, 4];
                case 3:
                    self.fetching = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
    return {
        load: load,
        setMap: function (options) {
            if ((0, helper_1.isObject)(options)) {
                self.map = (0, tslib_1.__assign)({}, options);
            }
        }
    };
});
exports.MappingField = (0, WithStore_1.withStore)(function (props) {
    return exports.Store.create({
        id: (0, helper_1.guid)(),
        storeType: exports.Store.name
    }, props.env);
})((_a = /** @class */ (function (_super) {
        (0, tslib_1.__extends)(class_1, _super);
        function class_1(props) {
            var _this = _super.call(this, props) || this;
            props.store.syncProps(props, undefined, ['map']);
            return _this;
        }
        class_1.prototype.componentDidMount = function () {
            var _a = this.props, store = _a.store, source = _a.source, data = _a.data;
            this.reload();
        };
        class_1.prototype.componentDidUpdate = function (prevProps) {
            var props = this.props;
            var _a = this.props, store = _a.store, source = _a.source, data = _a.data;
            store.syncProps(props, prevProps, ['map']);
            if ((0, tpl_builtin_1.isPureVariable)(source)) {
                var prev = (0, tpl_builtin_1.resolveVariableAndFilter)(prevProps.source, prevProps.data, '| raw');
                var curr = (0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw');
                if (prev !== curr) {
                    store.setMap(curr);
                }
            }
            else if ((0, api_1.isApiOutdated)(prevProps.source, props.source, prevProps.data, props.data)) {
                this.reload();
            }
        };
        class_1.prototype.reload = function () {
            var _a;
            var _b = this.props, source = _b.source, data = _b.data, env = _b.env;
            var store = this.props.store;
            if ((0, tpl_builtin_1.isPureVariable)(source)) {
                store.setMap((0, tpl_builtin_1.resolveVariableAndFilter)(source, data, '| raw'));
            }
            else if ((0, api_1.isEffectiveApi)(source, data)) {
                var api = (0, api_1.normalizeApi)(source, 'get');
                api.cache = (_a = api.cache) !== null && _a !== void 0 ? _a : 30 * 1000;
                store.load(env, api, data);
            }
        };
        class_1.prototype.renderSingleValue = function (key, reactKey) {
            var _a;
            var _b = this.props, className = _b.className, placeholder = _b.placeholder, render = _b.render, cx = _b.classnames, name = _b.name, data = _b.data, store = _b.store;
            var viewValue = (react_1.default.createElement("span", { className: "text-muted" }, placeholder));
            var map = store.map;
            var value = undefined;
            // trim 一下，干掉一些空白字符。
            key = typeof key === 'string' ? key.trim() : key;
            if (typeof key !== 'undefined' &&
                map &&
                (value =
                    (_a = map[key]) !== null && _a !== void 0 ? _a : (key === true && map['1']
                        ? map['1']
                        : key === false && map['0']
                            ? map['0']
                            : map['*'])) !== undefined) {
                viewValue = render('tpl', value);
            }
            return (react_1.default.createElement("span", { key: "map-".concat(reactKey), className: cx('MappingField', className) }, viewValue));
        };
        class_1.prototype.render = function () {
            var _this = this;
            var mapKey = (0, helper_1.getPropValue)(this.props);
            if (Array.isArray(mapKey)) {
                return (react_1.default.createElement("span", null, mapKey.map(function (singleKey, index) {
                    return _this.renderSingleValue(singleKey, index);
                })));
            }
            else {
                return this.renderSingleValue(mapKey, 0);
            }
        };
        return class_1;
    }(react_1.default.Component)),
    _a.defaultProps = {
        placeholder: '-',
        map: {
            '*': '通配值'
        }
    },
    _a));
var MappingFieldRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(MappingFieldRenderer, _super);
    function MappingFieldRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MappingFieldRenderer.prototype.render = function () {
        return react_1.default.createElement(exports.MappingField, (0, tslib_1.__assign)({}, this.props));
    };
    MappingFieldRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            test: /(^|\/)(?:map|mapping)$/,
            name: 'mapping'
        })
    ], MappingFieldRenderer);
    return MappingFieldRenderer;
}(react_1.default.Component));
exports.MappingFieldRenderer = MappingFieldRenderer;
//# sourceMappingURL=./renderers/Mapping.js.map
