"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaRenderer = void 0;
var tslib_1 = require("tslib");
var difference_1 = (0, tslib_1.__importDefault)(require("lodash/difference"));
var omit_1 = (0, tslib_1.__importDefault)(require("lodash/omit"));
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var LazyComponent_1 = (0, tslib_1.__importDefault)(require("./components/LazyComponent"));
var factory_1 = require("./factory");
var Item_1 = require("./renderers/Form/Item");
var Root_1 = require("./Root");
var Scoped_1 = require("./Scoped");
var debug_1 = require("./utils/debug");
var filter_schema_1 = (0, tslib_1.__importDefault)(require("./utils/filter-schema"));
var helper_1 = require("./utils/helper");
var SimpleMap_1 = require("./utils/SimpleMap");
var renderer_event_1 = require("./utils/renderer-event");
var mobx_state_tree_1 = require("mobx-state-tree");
var mobx_1 = require("mobx");
var tpl_builtin_1 = require("./utils/tpl-builtin");
var defaultOmitList = [
    'type',
    'name',
    '$ref',
    'className',
    'data',
    'children',
    'ref',
    'visible',
    'visibleOn',
    'hidden',
    'hiddenOn',
    'disabled',
    'disabledOn',
    'component',
    'detectField',
    'defaultValue',
    'defaultData',
    'required',
    'requiredOn',
    'syncSuperStore',
    'mode',
    'body'
];
var componentCache = new SimpleMap_1.SimpleMap();
var SchemaRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(SchemaRenderer, _super);
    function SchemaRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.rendererKey = '';
        _this.unbindEvent = undefined;
        _this.refFn = _this.refFn.bind(_this);
        _this.renderChild = _this.renderChild.bind(_this);
        _this.reRender = _this.reRender.bind(_this);
        _this.resolveRenderer(_this.props);
        _this.dispatchEvent = _this.dispatchEvent.bind(_this);
        // 监听rootStore更新
        _this.reaction = (0, mobx_1.reaction)(function () {
            return "".concat(props.rootStore.visibleState[props.schema.id || props.$path]).concat(props.rootStore.disableState[props.schema.id || props.$path]);
        }, function () { return _this.forceUpdate(); });
        return _this;
    }
    SchemaRenderer.prototype.componentDidMount = function () {
        // 这里无法区分监听的是不是广播，所以又bind一下，主要是为了绑广播
        this.unbindEvent = (0, renderer_event_1.bindEvent)(this.cRef);
    };
    SchemaRenderer.prototype.componentWillUnmount = function () {
        var _a, _b;
        (_a = this.reaction) === null || _a === void 0 ? void 0 : _a.call(this);
        (_b = this.unbindEvent) === null || _b === void 0 ? void 0 : _b.call(this);
    };
    // 限制：只有 schema 除外的 props 变化，或者 schema 里面的某个成员值发生变化才更新。
    SchemaRenderer.prototype.shouldComponentUpdate = function (nextProps) {
        var props = this.props;
        var list = (0, difference_1.default)(Object.keys(nextProps), [
            'schema',
            'scope'
        ]);
        if ((0, difference_1.default)(Object.keys(props), ['schema', 'scope']).length !==
            list.length ||
            (0, helper_1.anyChanged)(list, this.props, nextProps)) {
            return true;
        }
        else {
            var list_1 = Object.keys(nextProps.schema);
            if (Object.keys(props.schema).length !== list_1.length ||
                (0, helper_1.anyChanged)(list_1, props.schema, nextProps.schema)) {
                return true;
            }
        }
        return false;
    };
    SchemaRenderer.prototype.resolveRenderer = function (props, force) {
        if (force === void 0) { force = false; }
        var schema = props.schema;
        var path = props.$path;
        if (schema && schema.$ref) {
            schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, props.resolveDefinitions(schema.$ref)), schema);
            path = path.replace(/(?!.*\/).*/, schema.type);
        }
        if ((schema === null || schema === void 0 ? void 0 : schema.type) &&
            (force ||
                !this.renderer ||
                this.rendererKey !== "".concat(schema.type, "-").concat(schema.$$id))) {
            var rendererResolver = props.env.rendererResolver || factory_1.resolveRenderer;
            this.renderer = rendererResolver(path, schema, props);
            this.rendererKey = "".concat(schema.type, "-").concat(schema.$$id);
        }
        else {
            // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
            // 至少自动支持了 valdiations, label, description 等逻辑。
            if (schema.children && !schema.component && schema.asFormItem) {
                schema.component = PlaceholderComponent;
                schema.renderChildren = schema.children;
                delete schema.children;
            }
            if (schema.component &&
                !schema.component.wrapedAsFormItem &&
                schema.asFormItem) {
                var cache = componentCache.get(schema.component);
                if (cache) {
                    schema.component = cache;
                }
                else {
                    var cache_1 = (0, Item_1.asFormItem)((0, tslib_1.__assign)({ strictMode: false }, schema.asFormItem))(schema.component);
                    componentCache.set(schema.component, cache_1);
                    cache_1.wrapedAsFormItem = true;
                    schema.component = cache_1;
                }
            }
        }
        return { path: path, schema: schema };
    };
    SchemaRenderer.prototype.getWrappedInstance = function () {
        return this.cRef;
    };
    SchemaRenderer.prototype.refFn = function (ref) {
        this.ref = ref;
    };
    SchemaRenderer.prototype.childRef = function (ref) {
        while (ref && ref.getWrappedInstance) {
            ref = ref.getWrappedInstance();
        }
        this.cRef = ref;
    };
    SchemaRenderer.prototype.dispatchEvent = function (e, data) {
        return (0, tslib_1.__awaiter)(this, void 0, Promise, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, renderer_event_1.dispatchEvent)(e, this.cRef, this.context, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SchemaRenderer.prototype.renderChild = function (region, node, subProps) {
        if (subProps === void 0) { subProps = {}; }
        var _a = this.props, _ = _a.schema, __ = _a.$path, env = _a.env, rest = (0, tslib_1.__rest)(_a, ["schema", "$path", "env"]);
        var $path = this.resolveRenderer(this.props).path;
        var omitList = defaultOmitList.concat();
        if (this.renderer) {
            var Component = this.renderer.component;
            Component.propsList &&
                omitList.push.apply(omitList, Component.propsList);
        }
        return (0, Root_1.renderChild)("".concat($path).concat(region ? "/".concat(region) : ''), node || '', (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, (0, omit_1.default)(rest, omitList)), subProps), { data: subProps.data || rest.data, env: env }));
    };
    SchemaRenderer.prototype.reRender = function () {
        this.resolveRenderer(this.props, true);
        this.forceUpdate();
    };
    SchemaRenderer.prototype.render = function () {
        var _this = this;
        var _a, _b, _c, _d;
        var _e = this.props, _ = _e.$path, __ = _e.schema, rootStore = _e.rootStore, rest = (0, tslib_1.__rest)(_e, ["$path", "schema", "rootStore"]);
        if (__ == null) {
            return null;
        }
        var _f = this.resolveRenderer(this.props), $path = _f.path, schema = _f.schema;
        var theme = this.props.env.theme;
        if (Array.isArray(schema)) {
            return (0, Root_1.renderChildren)($path, schema, rest);
        }
        var detectData = schema &&
            (schema.detectField === '&' ? rest : rest[schema.detectField || 'data']);
        var exprProps = detectData
            ? (0, filter_schema_1.default)(schema, detectData, undefined, rest)
            : {};
        // 控制显隐
        var visible = (0, mobx_state_tree_1.isAlive)(rootStore)
            ? rootStore.visibleState[schema.id || $path]
            : undefined;
        var disable = (0, mobx_state_tree_1.isAlive)(rootStore)
            ? rootStore.disableState[schema.id || $path]
            : undefined;
        if (visible === false ||
            (visible !== true &&
                exprProps &&
                (exprProps.hidden ||
                    exprProps.visible === false ||
                    schema.hidden ||
                    schema.visible === false ||
                    rest.hidden ||
                    rest.visible === false))) {
            rest.invisible = true;
        }
        if (schema.children) {
            return rest.invisible
                ? null
                : react_1.default.isValidElement(schema.children)
                    ? schema.children
                    : schema.children((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), exprProps), { $path: $path, $schema: schema, render: this.renderChild, forwardedRef: this.refFn }));
        }
        else if (typeof schema.component === 'function') {
            var isSFC = !(schema.component.prototype instanceof react_1.default.Component);
            var defaultData_1 = schema.data, defaultValue_1 = schema.value, defaultActiveKey_1 = schema.activeKey, propKey_1 = schema.key, restSchema_1 = (0, tslib_1.__rest)(schema, ["data", "value", "activeKey", "key"]);
            return rest.invisible
                ? null
                : react_1.default.createElement(schema.component, (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, rest), restSchema_1), exprProps), { defaultData: defaultData_1, defaultValue: defaultValue_1, defaultActiveKey: defaultActiveKey_1, propKey: propKey_1, $path: $path, $schema: schema, ref: isSFC ? undefined : this.refFn, forwardedRef: isSFC ? this.refFn : undefined, render: this.renderChild }));
        }
        else if (Object.keys(schema).length === 0) {
            return null;
        }
        else if (!this.renderer) {
            return rest.invisible ? null : (react_1.default.createElement(LazyComponent_1.default, (0, tslib_1.__assign)({}, rest, exprProps, { getComponent: function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                    var result;
                    return (0, tslib_1.__generator)(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, rest.env.loadRenderer(schema, $path, this.reRender)];
                            case 1:
                                result = _a.sent();
                                if (result && typeof result === 'function') {
                                    return [2 /*return*/, result];
                                }
                                else if (result && react_1.default.isValidElement(result)) {
                                    return [2 /*return*/, function () { return result; }];
                                }
                                this.reRender();
                                return [2 /*return*/, function () { return (0, factory_1.loadRenderer)(schema, $path); }];
                        }
                    });
                }); }, "$path": $path, "$schema": schema, retry: this.reRender })));
        }
        var renderer = this.renderer;
        schema = (0, factory_1.filterSchema)(schema, renderer, rest);
        var defaultData = schema.data, defaultValue = schema.value, propKey = schema.key, defaultActiveKey = schema.activeKey, restSchema = (0, tslib_1.__rest)(schema, ["data", "value", "key", "activeKey"]);
        var Component = renderer.component;
        // 原来表单项的 visible: false 和 hidden: true 表单项的值和验证是有效的
        // 而 visibleOn 和 hiddenOn 是无效的，
        // 这个本来就是个bug，但是已经被广泛使用了
        // 我只能继续实现这个bug了
        if (rest.invisible &&
            (exprProps.hidden ||
                exprProps.visible === false ||
                !renderer.isFormItem ||
                (schema.visible !== false && !schema.hidden))) {
            return null;
        }
        var isClassComponent = (_a = Component.prototype) === null || _a === void 0 ? void 0 : _a.isReactComponent;
        var $schema = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, schema), exprProps);
        var props = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, theme.getRendererConfig(renderer.name)), restSchema), (0, helper_1.chainEvents)(rest, restSchema)), exprProps), { defaultData: (_b = restSchema.defaultData) !== null && _b !== void 0 ? _b : defaultData, defaultValue: (_c = restSchema.defaultValue) !== null && _c !== void 0 ? _c : defaultValue, defaultActiveKey: defaultActiveKey, propKey: propKey, $path: $path, $schema: $schema, ref: this.refFn, render: this.renderChild, rootStore: rootStore, disabled: (_d = disable !== null && disable !== void 0 ? disable : rest.disabled) !== null && _d !== void 0 ? _d : restSchema.disabled, dispatchEvent: this.dispatchEvent });
        // 自动解析变量模式，主要是方便直接引入第三方组件库，无需为了支持变量封装一层
        if (renderer.autoVar) {
            for (var _i = 0, _g = Object.keys($schema); _i < _g.length; _i++) {
                var key = _g[_i];
                if (typeof props[key] === 'string') {
                    props[key] = (0, tpl_builtin_1.resolveVariableAndFilter)(props[key], props.data, '| raw');
                }
            }
        }
        var component = isClassComponent ? (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, props, { ref: this.childRef }))) : (react_1.default.createElement(Component, (0, tslib_1.__assign)({}, props)));
        return this.props.env.enableAMISDebug ? (react_1.default.createElement(debug_1.DebugWrapper, { renderer: renderer }, component)) : (component);
    };
    SchemaRenderer.displayName = 'Renderer';
    SchemaRenderer.contextType = Scoped_1.ScopedContext;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], SchemaRenderer.prototype, "childRef", null);
    return SchemaRenderer;
}(react_1.default.Component));
exports.SchemaRenderer = SchemaRenderer;
var PlaceholderComponent = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(PlaceholderComponent, _super);
    function PlaceholderComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlaceholderComponent.prototype.render = function () {
        var _a = this.props, renderChildren = _a.renderChildren, rest = (0, tslib_1.__rest)(_a, ["renderChildren"]);
        if (typeof renderChildren === 'function') {
            return renderChildren(rest);
        }
        return null;
    };
    return PlaceholderComponent;
}(react_1.default.Component));
//# sourceMappingURL=./SchemaRenderer.js.map
