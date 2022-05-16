"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRenderer = exports.Log = void 0;
var tslib_1 = require("tslib");
/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var ansi_to_react_1 = (0, tslib_1.__importDefault)(require("ansi-to-react"));
var api_1 = require("../utils/api");
var virtual_list_1 = (0, tslib_1.__importDefault)(require("../components/virtual-list"));
var Button_1 = (0, tslib_1.__importDefault)(require("../components/Button"));
var icons_1 = require("../components/icons");
var Log = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Log, _super);
    function Log(props) {
        var _this = _super.call(this, props) || this;
        _this.isDone = false;
        _this.autoScroll = false;
        _this.state = {
            lastLine: '',
            logs: [],
            refresh: true,
            showLineNumber: false,
            showOperation: false
        };
        _this.refresh = function () {
            var origin = _this.state.refresh;
            _this.setState({
                refresh: !origin
            });
            if (!origin) {
                _this.clear();
                _this.loadLogs();
            }
        };
        _this.clear = function () {
            _this.setState({
                logs: [],
                lastLine: ''
            });
        };
        _this.changeShowLineNumber = function () {
            _this.setState({
                showLineNumber: !_this.state.showLineNumber
            });
        };
        _this.changeShowOperation = function () {
            _this.setState({
                showOperation: !_this.state.showOperation
            });
        };
        _this.logRef = react_1.default.createRef();
        _this.autoScroll = props.autoScroll || false;
        _this.pauseOrResumeScrolling = _this.pauseOrResumeScrolling.bind(_this);
        return _this;
    }
    Log.prototype.componentWillUnmount = function () {
        if (this.logRef && this.logRef.current) {
            this.logRef.current.removeEventListener('scroll', this.pauseOrResumeScrolling);
        }
    };
    Log.prototype.componentDidMount = function () {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.addEventListener('scroll', this.pauseOrResumeScrolling);
        }
        if (this.props.source) {
            this.loadLogs();
        }
    };
    Log.prototype.componentDidUpdate = function (prevProps) {
        if (this.autoScroll && this.logRef && this.logRef.current) {
            this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
        }
        if ((0, api_1.isApiOutdated)(prevProps.source, this.props.source, prevProps.data, this.props.data)) {
            this.loadLogs();
        }
    };
    // 如果向上滚动就停止自动滚动，除非滚到底部
    Log.prototype.pauseOrResumeScrolling = function () {
        if (this.logRef && this.logRef.current) {
            var _a = this.logRef.current, scrollHeight = _a.scrollHeight, scrollTop = _a.scrollTop, offsetHeight = _a.offsetHeight;
            this.autoScroll = scrollHeight - (scrollTop + offsetHeight) < 50;
        }
    };
    Log.prototype.loadLogs = function () {
        var _a;
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _b, source, data, env, __, encoding, maxLength, api, res, body, reader, lastline, logs, _c, done, value, text, lines;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = this.props, source = _b.source, data = _b.data, env = _b.env, __ = _b.translate, encoding = _b.encoding, maxLength = _b.maxLength;
                        api = (0, api_1.buildApi)(source, data);
                        if (!api.url) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fetch(api.url, {
                                method: ((_a = api.method) === null || _a === void 0 ? void 0 : _a.toLocaleUpperCase()) || 'GET',
                                headers: api.headers || undefined,
                                body: api.data ? JSON.stringify(api.data) : undefined,
                                credentials: 'include'
                            })];
                    case 1:
                        res = _d.sent();
                        if (!(res.status === 200)) return [3 /*break*/, 8];
                        body = res.body;
                        if (!body) {
                            return [2 /*return*/];
                        }
                        reader = body.getReader();
                        lastline = '';
                        logs = [];
                        _d.label = 2;
                    case 2:
                        if (!!this.state.refresh) return [3 /*break*/, 4];
                        return [4 /*yield*/, reader.cancel('click cancel button').then(function () {
                                _this.props.env.notify('success', '日志已经停止刷新');
                                return;
                            })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4: return [4 /*yield*/, reader.read()];
                    case 5:
                        _c = _d.sent(), done = _c.done, value = _c.value;
                        if (value) {
                            text = new TextDecoder(encoding).decode(value, { stream: true });
                            lines = text.split('\n');
                            // 如果没有换行符就只更新最后一行
                            if (lines.length === 1) {
                                lastline += lines[0];
                                this.setState({
                                    lastLine: lastline
                                });
                            }
                            else {
                                // 将之前的数据补上
                                lines[0] = lastline + lines[0];
                                // 最后一个要么是空，要么是下一行的数据
                                lastline = lines.pop() || '';
                                if (maxLength) {
                                    if (logs.length + lines.length > maxLength) {
                                        logs.splice(0, logs.length + lines.length - maxLength);
                                    }
                                }
                                logs = logs.concat(lines);
                                this.setState({
                                    logs: logs,
                                    lastLine: lastline
                                });
                            }
                        }
                        if (done) {
                            this.isDone = true;
                            return [2 /*return*/];
                        }
                        _d.label = 6;
                    case 6: return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        env.notify('error', __('fetchFailed'));
                        _d.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 渲染某一行
     */
    Log.prototype.renderLine = function (index, line, showLineNumber) {
        var _a = this.props, cx = _a.classnames, disableColor = _a.disableColor;
        return (react_1.default.createElement("div", { className: cx('Log-line'), key: index },
            showLineNumber && (react_1.default.createElement("span", { className: cx('Log-line-number') },
                index + 1,
                " ")),
            disableColor ? line : react_1.default.createElement(ansi_to_react_1.default, { useClasses: true }, line)));
    };
    Log.prototype.render = function () {
        var _this = this;
        var _a = this.props, source = _a.source, className = _a.className, cx = _a.classnames, placeholder = _a.placeholder, height = _a.height, rowHeight = _a.rowHeight, disableColor = _a.disableColor, __ = _a.translate, operation = _a.operation, env = _a.env;
        var _b = this.state, refresh = _b.refresh, showLineNumber = _b.showLineNumber, showOperation = _b.showOperation;
        var loading = __(placeholder);
        if (!source) {
            loading = __('Log.mustHaveSource');
        }
        var lines;
        var logs = this.state.lastLine
            ? this.state.logs.concat([this.state.lastLine])
            : this.state.logs;
        // 如果设置 rowHeight 就开启延迟渲染
        var useVirtualRender = rowHeight;
        if (useVirtualRender) {
            lines = (react_1.default.createElement(virtual_list_1.default, { height: height, itemCount: logs.length, itemSize: rowHeight, renderItem: function (_a) {
                    var index = _a.index, style = _a.style;
                    return (react_1.default.createElement("div", { className: cx('Log-line'), key: index, style: (0, tslib_1.__assign)((0, tslib_1.__assign)({}, style), { whiteSpace: 'nowrap' }) },
                        showLineNumber && (react_1.default.createElement("span", { className: cx('Log-line-number') },
                            index + 1,
                            " ")),
                        disableColor ? (logs[index]) : (react_1.default.createElement(ansi_to_react_1.default, { useClasses: true }, logs[index]))));
                } }));
        }
        else {
            lines = logs.map(function (line, index) {
                return _this.renderLine(index, line, showLineNumber);
            });
        }
        return (react_1.default.createElement("div", { className: cx('Log', className) },
            react_1.default.createElement("div", { ref: this.logRef, className: cx('Log-body'), style: { height: useVirtualRender ? 'auto' : height } }, useVirtualRender ? lines : lines.length ? lines : loading),
            react_1.default.createElement("div", { className: cx('Log-operation') }, operation &&
                (operation === null || operation === void 0 ? void 0 : operation.length) > 0 &&
                (showOperation ? (react_1.default.createElement(react_1.default.Fragment, null,
                    operation.includes('stop') && (react_1.default.createElement(Button_1.default, { size: "sm", title: "__('stop')", disabled: !refresh, onClick: this.refresh },
                        react_1.default.createElement(icons_1.PauseIcon, null))),
                    operation.includes('restart') && (react_1.default.createElement(Button_1.default, { size: "sm", title: __('reload'), disabled: refresh, onClick: this.refresh },
                        react_1.default.createElement(icons_1.ReloadIcon, null))),
                    operation.includes('showLineNumber') && (react_1.default.createElement(Button_1.default, { size: "sm", title: showLineNumber
                            ? __('Log.notShowLineNumber')
                            : __('Log.showLineNumber'), onClick: this.changeShowLineNumber }, showLineNumber ? react_1.default.createElement(icons_1.MinusIcon, null) : react_1.default.createElement(icons_1.PlusIcon, null))),
                    operation.includes('clear') && (react_1.default.createElement(Button_1.default, { size: "sm", title: __('clear'), onClick: this.clear },
                        react_1.default.createElement(icons_1.InputClearIcon, null))),
                    react_1.default.createElement(Button_1.default, { size: "sm", title: __('Log.collapse'), onClick: this.changeShowOperation },
                        react_1.default.createElement(icons_1.LeftArrowIcon, null)))) : (react_1.default.createElement("div", { title: __('Log.expand'), className: cx('Log-operation-hidden'), onClick: this.changeShowOperation },
                    react_1.default.createElement(icons_1.RightArrowIcon, null)))))));
    };
    Log.defaultProps = {
        height: 500,
        autoScroll: true,
        placeholder: 'loading',
        encoding: 'utf-8'
    };
    return Log;
}(react_1.default.Component));
exports.Log = Log;
var LogRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LogRenderer, _super);
    function LogRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LogRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'log'
        })
    ], LogRenderer);
    return LogRenderer;
}(Log));
exports.LogRenderer = LogRenderer;
//# sourceMappingURL=./renderers/Log.js.map
