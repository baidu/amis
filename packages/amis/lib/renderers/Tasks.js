"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var factory_1 = require("../factory");
var immutability_helper_1 = (0, tslib_1.__importDefault)(require("immutability-helper"));
var api_1 = require("../utils/api");
var Scoped_1 = require("../Scoped");
var Spinner_1 = (0, tslib_1.__importDefault)(require("../components/Spinner"));
var helper_1 = require("../utils/helper");
var Task = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Task, _super);
    function Task(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            items: props.items ? props.items.concat() : []
        };
        _this.handleLoaded = _this.handleLoaded.bind(_this);
        _this.tick = _this.tick.bind(_this);
        return _this;
    }
    Task.prototype.componentDidMount = function () {
        this.tick(!!this.props.checkApi);
    };
    Task.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.items !== props.items) {
            this.setState({
                items: props.items ? props.items.concat() : []
            });
        }
        else if ((0, api_1.isApiOutdated)(prevProps.checkApi, props.checkApi, prevProps.data, props.data)) {
            this.tick(true);
        }
    };
    Task.prototype.componentWillUnmount = function () {
        clearTimeout(this.timer);
    };
    Task.prototype.reload = function () {
        this.tick(true);
    };
    Task.prototype.tick = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var _a = this.props, loadingStatusCode = _a.loadingStatusCode, data = _a.data, interval = _a.interval, checkApi = _a.checkApi, env = _a.env;
        var items = this.state.items;
        clearTimeout(this.timer);
        // 如果每个 task 都完成了, 则不需要取查看状态.
        if (!force && !items.some(function (item) { return item.status === loadingStatusCode; })) {
            return;
        }
        if (interval && !(0, api_1.isEffectiveApi)(checkApi)) {
            return env.alert('checkApi 没有设置, 不能及时获取任务状态');
        }
        (0, api_1.isEffectiveApi)(checkApi, data) &&
            env &&
            env
                .fetcher(checkApi, data)
                .then(this.handleLoaded)
                .catch(function (e) { return _this.setState({ error: e }); });
    };
    Task.prototype.handleLoaded = function (ret) {
        if (!Array.isArray(ret.data)) {
            return this.props.env.alert('返回格式不正确, 期望 response.data 为数组, 包含每个 task 的状态信息');
        }
        this.setState({
            items: ret.data
        });
        var interval = this.props.interval;
        clearTimeout(this.timer);
        this.timer = setTimeout(this.tick, interval);
    };
    Task.prototype.submitTask = function (item, index, retry) {
        var _this = this;
        if (retry === void 0) { retry = false; }
        var _a = this.props, submitApi = _a.submitApi, reSubmitApi = _a.reSubmitApi, loadingStatusCode = _a.loadingStatusCode, errorStatusCode = _a.errorStatusCode, data = _a.data, env = _a.env;
        if (!retry && !(0, api_1.isEffectiveApi)(submitApi)) {
            return env.alert('submitApi 没有配置');
        }
        else if (retry && !(0, api_1.isEffectiveApi)(reSubmitApi)) {
            return env.alert('reSubmitApi 没有配置');
        }
        this.setState((0, immutability_helper_1.default)(this.state, {
            items: {
                $splice: [
                    [
                        index,
                        1,
                        (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { status: loadingStatusCode })
                    ]
                ]
            }
        }));
        var api = retry ? reSubmitApi : submitApi;
        (0, api_1.isEffectiveApi)(api, data) &&
            env &&
            env
                .fetcher(api, (0, helper_1.createObject)(data, item))
                .then(function (ret) {
                if (ret && ret.data) {
                    if (Array.isArray(ret.data)) {
                        _this.handleLoaded(ret);
                    }
                    else {
                        var replace = api && api.replaceData;
                        var items = _this.state.items.map(function (item) {
                            return item.key === ret.data.key
                                ? (0, tslib_1.__assign)((0, tslib_1.__assign)({}, (api.replaceData ? {} : item)), ret.data) : item;
                        });
                        _this.handleLoaded((0, tslib_1.__assign)((0, tslib_1.__assign)({}, ret), { data: items }));
                    }
                    return;
                }
                clearTimeout(_this.timer);
                _this.timer = setTimeout(_this.tick, 4);
            })
                .catch(function (e) {
                return _this.setState((0, immutability_helper_1.default)(_this.state, {
                    items: {
                        $splice: [
                            [
                                index,
                                1,
                                (0, tslib_1.__assign)((0, tslib_1.__assign)({}, item), { status: errorStatusCode, remark: e.message || e })
                            ]
                        ]
                    }
                }));
            });
    };
    Task.prototype.render = function () {
        var _this = this;
        var _a = this.props, cx = _a.classnames, className = _a.className, tableClassName = _a.tableClassName, taskNameLabel = _a.taskNameLabel, operationLabel = _a.operationLabel, statusLabel = _a.statusLabel, remarkLabel = _a.remarkLabel, btnText = _a.btnText, retryBtnText = _a.retryBtnText, btnClassName = _a.btnClassName, retryBtnClassName = _a.retryBtnClassName, statusLabelMap = _a.statusLabelMap, statusTextMap = _a.statusTextMap, readyStatusCode = _a.readyStatusCode, loadingStatusCode = _a.loadingStatusCode, canRetryStatusCode = _a.canRetryStatusCode, __ = _a.translate, render = _a.render;
        var items = this.state.items;
        var error = this.state.error;
        return (react_1.default.createElement("div", { className: cx('Table-content', className) },
            react_1.default.createElement("table", { className: cx('Table-table', tableClassName) },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, taskNameLabel),
                        react_1.default.createElement("th", null, __(operationLabel)),
                        react_1.default.createElement("th", null, statusLabel),
                        react_1.default.createElement("th", null, remarkLabel))),
                react_1.default.createElement("tbody", null, error ? (react_1.default.createElement("tr", null,
                    react_1.default.createElement("td", { colSpan: 4 },
                        react_1.default.createElement("div", { className: "text-danger" }, error)))) : (items.map(function (item, key) { return (react_1.default.createElement("tr", { key: key },
                    react_1.default.createElement("td", null, item.label),
                    react_1.default.createElement("td", null, item.status == loadingStatusCode ? (react_1.default.createElement(Spinner_1.default, { show: true, icon: "reload", spinnerClassName: cx('Task-spinner') })) : item.status == canRetryStatusCode ? (react_1.default.createElement("a", { onClick: function () { return _this.submitTask(item, key, true); }, className: cx('Button', 'Button--danger', retryBtnClassName || btnClassName) }, retryBtnText || btnText)) : (react_1.default.createElement("a", { onClick: function () { return _this.submitTask(item, key); }, className: cx('Button', 'Button--default', btnClassName, {
                            disabled: item.status !== readyStatusCode
                        }) }, btnText))),
                    react_1.default.createElement("td", null,
                        react_1.default.createElement("span", { className: cx('label', statusLabelMap && statusLabelMap[item.status || 0]) }, statusTextMap && statusTextMap[item.status || 0])),
                    react_1.default.createElement("td", null, item.remark ? render("".concat(key, "/remark"), item.remark) : null))); }))))));
    };
    Task.defaultProps = {
        className: '',
        tableClassName: '',
        taskNameLabel: '任务名称',
        operationLabel: 'Table.operation',
        statusLabel: '状态',
        remarkLabel: '备注说明',
        btnText: '上线',
        retryBtnText: '重试',
        btnClassName: '',
        retryBtnClassName: '',
        statusLabelMap: [
            'label-warning',
            'label-info',
            'label-info',
            'label-danger',
            'label-success',
            'label-danger'
        ],
        statusTextMap: ['未开始', '就绪', '进行中', '出错', '已完成', '出错'],
        initialStatusCode: 0,
        readyStatusCode: 1,
        loadingStatusCode: 2,
        errorStatusCode: 3,
        finishStatusCode: 4,
        canRetryStatusCode: 5,
        interval: 3000
    };
    return Task;
}(react_1.default.Component));
exports.default = Task;
var TaskRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(TaskRenderer, _super);
    function TaskRenderer(props, context) {
        var _this = _super.call(this, props) || this;
        var scoped = context;
        scoped.registerComponent(_this);
        return _this;
    }
    TaskRenderer.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        var scoped = this.context;
        scoped.unRegisterComponent(this);
    };
    var _a;
    TaskRenderer.contextType = Scoped_1.ScopedContext;
    TaskRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'tasks'
        }),
        (0, tslib_1.__metadata)("design:paramtypes", [Object, typeof (_a = typeof Scoped_1.IScopedContext !== "undefined" && Scoped_1.IScopedContext) === "function" ? _a : Object])
    ], TaskRenderer);
    return TaskRenderer;
}(Task));
exports.TaskRenderer = TaskRenderer;
//# sourceMappingURL=./renderers/Tasks.js.map
