"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainedSelectControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var classnames_1 = (0, tslib_1.__importDefault)(require("classnames"));
var Options_1 = require("./Options");
var Select_1 = (0, tslib_1.__importDefault)(require("../../components/Select"));
var api_1 = require("../../utils/api");
var helper_1 = require("../../utils/helper");
var ChainedSelectControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedSelectControl, _super);
    function ChainedSelectControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            stack: []
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.loadMore = _this.loadMore.bind(_this);
        return _this;
    }
    ChainedSelectControl.prototype.componentDidMount = function () {
        var _a, _b;
        var formInited = this.props.formInited;
        formInited || !this.props.addHook
            ? this.loadMore()
            : (_b = (_a = this.props).addHook) === null || _b === void 0 ? void 0 : _b.call(_a, this.loadMore, 'init');
    };
    ChainedSelectControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.options !== props.options) {
            this.setState({
                stack: []
            });
        }
        else if (props.formInited && props.value !== prevProps.value) {
            this.loadMore();
        }
    };
    ChainedSelectControl.prototype.doAction = function (action, data, throwErrors) {
        var _a = this.props, resetValue = _a.resetValue, onChange = _a.onChange;
        var actionType = action === null || action === void 0 ? void 0 : action.actionType;
        if (actionType === 'clear') {
            onChange('');
        }
        else if (actionType === 'reset') {
            onChange(resetValue !== null && resetValue !== void 0 ? resetValue : '');
        }
    };
    ChainedSelectControl.prototype.array2value = function (arr, isExtracted) {
        if (isExtracted === void 0) { isExtracted = false; }
        var _a = this.props, delimiter = _a.delimiter, joinValues = _a.joinValues, extractValue = _a.extractValue;
        // 判断arr的项是否已抽取
        return isExtracted
            ? joinValues
                ? arr.join(delimiter || ',')
                : arr
            : joinValues
                ? arr.join(delimiter || ',')
                : extractValue
                    ? arr.map(function (item) { return item.value || item; })
                    : arr;
    };
    ChainedSelectControl.prototype.loadMore = function () {
        var _this = this;
        var _a = this.props, value = _a.value, delimiter = _a.delimiter, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, source = _a.source, data = _a.data, env = _a.env, dispatchEvent = _a.dispatchEvent;
        var arr = Array.isArray(value)
            ? value.concat()
            : value && typeof value === 'string'
                ? value.split(delimiter || ',')
                : [];
        var idx = 0;
        var len = this.state.stack.length;
        while (idx < len &&
            arr[idx] &&
            this.state.stack[idx].parentId ==
                (joinValues || extractValue ? arr[idx] : arr[idx].value)) {
            idx++;
        }
        if (!arr[idx] || !env || !(0, api_1.isEffectiveApi)(source, data)) {
            return;
        }
        var parentId = joinValues || extractValue ? arr[idx] : arr[idx].value;
        var stack = this.state.stack.concat();
        stack.splice(idx, stack.length - idx);
        stack.push({
            parentId: parentId,
            loading: true,
            options: []
        });
        this.setState({
            stack: stack
        }, function () {
            env
                .fetcher(source, (0, tslib_1.__assign)((0, tslib_1.__assign)({}, data), { value: arr, level: idx + 1, parentId: parentId, parent: arr[idx] }))
                .then(function (ret) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                var stack, remoteValue, options, valueRes, rendererEvent;
                return (0, tslib_1.__generator)(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack = this.state.stack.concat();
                            remoteValue = ret.data ? ret.data.value : undefined;
                            options = (ret.data && ret.data.options) || ret.data;
                            stack.splice(idx, stack.length - idx);
                            if (!(typeof remoteValue !== 'undefined')) return [3 /*break*/, 2];
                            arr.splice(idx + 1, value.length - idx - 1);
                            arr.push(remoteValue);
                            valueRes = this.array2value(arr, true);
                            return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                    value: valueRes
                                }))];
                        case 1:
                            rendererEvent = _a.sent();
                            if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                                return [2 /*return*/];
                            }
                            onChange(valueRes);
                            _a.label = 2;
                        case 2:
                            stack.push({
                                options: options,
                                parentId: parentId,
                                loading: false,
                                visible: !!options
                            });
                            this.setState({
                                stack: stack
                            }, this.loadMore);
                            return [2 /*return*/];
                    }
                });
            }); })
                .catch(function (e) {
                env.notify('error', e.message);
            });
        });
    };
    ChainedSelectControl.prototype.handleChange = function (index, currentValue) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _a, value, delimiter, onChange, joinValues, extractValue, dispatchEvent, data, arr, valueRes, rendererEvent;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, value = _a.value, delimiter = _a.delimiter, onChange = _a.onChange, joinValues = _a.joinValues, extractValue = _a.extractValue, dispatchEvent = _a.dispatchEvent, data = _a.data;
                        arr = Array.isArray(value)
                            ? value.concat()
                            : value && typeof value === 'string'
                                ? value.split(delimiter || ',')
                                : [];
                        arr.splice(index, arr.length - index);
                        arr.push(joinValues ? currentValue.value : currentValue);
                        valueRes = this.array2value(arr);
                        return [4 /*yield*/, dispatchEvent('change', (0, helper_1.createObject)(data, {
                                value: valueRes
                            }))];
                    case 1:
                        rendererEvent = _b.sent();
                        if (rendererEvent === null || rendererEvent === void 0 ? void 0 : rendererEvent.prevented) {
                            return [2 /*return*/];
                        }
                        onChange(valueRes);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChainedSelectControl.prototype.reload = function () {
        var reload = this.props.reloadOptions;
        reload && reload();
    };
    ChainedSelectControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, options = _a.options, ns = _a.classPrefix, className = _a.className, inline = _a.inline, loading = _a.loading, value = _a.value, delimiter = _a.delimiter, joinValues = _a.joinValues, extractValue = _a.extractValue, multiple = _a.multiple, useMobileUI = _a.useMobileUI, env = _a.env, rest = (0, tslib_1.__rest)(_a, ["options", "classPrefix", "className", "inline", "loading", "value", "delimiter", "joinValues", "extractValue", "multiple", "useMobileUI", "env"]);
        var arr = Array.isArray(value)
            ? value.concat()
            : value && typeof value === 'string'
                ? value.split(delimiter || ',')
                : [];
        var mobileUI = useMobileUI && (0, helper_1.isMobile)();
        return (react_1.default.createElement("div", { className: (0, classnames_1.default)("".concat(ns, "ChainedSelectControl"), className) },
            react_1.default.createElement(Select_1.default, (0, tslib_1.__assign)({}, rest, { useMobileUI: useMobileUI, popOverContainer: mobileUI && env && env.getModalContainer
                    ? env.getModalContainer
                    : rest.popOverContainer, classPrefix: ns, key: "base", options: options, value: arr[0], onChange: this.handleChange.bind(this, 0), loading: loading, inline: true })),
            this.state.stack.map(function (_a, index) {
                var options = _a.options, loading = _a.loading, visible = _a.visible;
                return visible === false ? null : (react_1.default.createElement(Select_1.default, (0, tslib_1.__assign)({}, rest, { useMobileUI: useMobileUI, popOverContainer: mobileUI && env && env.getModalContainer
                        ? env.getModalContainer
                        : rest.popOverContainer, classPrefix: ns, key: "x-".concat(index + 1), options: options, value: arr[index + 1], onChange: _this.handleChange.bind(_this, index + 1), loading: loading, inline: true })));
            })));
    };
    ChainedSelectControl.defaultProps = {
        clearable: false,
        searchable: false,
        multiple: true
    };
    return ChainedSelectControl;
}(react_1.default.Component));
exports.default = ChainedSelectControl;
var ChainedSelectControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ChainedSelectControlRenderer, _super);
    function ChainedSelectControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainedSelectControlRenderer = (0, tslib_1.__decorate)([
        (0, Options_1.OptionsControl)({
            type: 'chained-select',
            sizeMutable: false
        })
    ], ChainedSelectControlRenderer);
    return ChainedSelectControlRenderer;
}(ChainedSelectControl));
exports.ChainedSelectControlRenderer = ChainedSelectControlRenderer;
//# sourceMappingURL=./renderers/Form/ChainedSelect.js.map
