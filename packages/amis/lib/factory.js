"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererEnv = exports.getRendererByName = exports.getRenderers = exports.resolveRenderer = exports.updateEnv = exports.clearStoresCache = exports.render = exports.loadRenderer = exports.unRegisterRenderer = exports.registerRenderer = exports.Renderer = exports.filterSchema = exports.addSchemaFilter = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var index_1 = require("./store/index");
var mobx_state_tree_1 = require("mobx-state-tree");
var api_1 = require("./utils/api");
var normalizeLink_1 = require("./utils/normalizeLink");
var helper_1 = require("./utils/helper");
var mobx_react_1 = require("mobx-react");
var Scoped_1 = (0, tslib_1.__importDefault)(require("./Scoped"));
var theme_1 = require("./theme");
var find_1 = (0, tslib_1.__importDefault)(require("lodash/find"));
var Alert2_1 = (0, tslib_1.__importDefault)(require("./components/Alert2"));
var Toast_1 = require("./components/Toast");
var Alert_1 = require("./components/Alert");
var locale_1 = require("./locale");
var Root_1 = (0, tslib_1.__importDefault)(require("./Root"));
var WithStore_1 = require("./WithStore");
var env_1 = require("./env");
Object.defineProperty(exports, "RendererEnv", { enumerable: true, get: function () { return env_1.RendererEnv; } });
var envOverwrite_1 = require("./envOverwrite");
var debug_1 = require("./utils/debug");
var renderers = [];
var rendererNames = [];
var schemaFilters = [];
var anonymousIndex = 1;
function addSchemaFilter(fn) {
    schemaFilters.push(fn);
}
exports.addSchemaFilter = addSchemaFilter;
function filterSchema(schema, render, props) {
    return schemaFilters.reduce(function (schema, filter) { return filter(schema, render, props); }, schema);
}
exports.filterSchema = filterSchema;
function Renderer(config) {
    return function (component) {
        var renderer = registerRenderer((0, tslib_1.__assign)((0, tslib_1.__assign)({}, config), { component: component }));
        return renderer.component;
    };
}
exports.Renderer = Renderer;
function registerRenderer(config) {
    if (!config.test && !config.type) {
        throw new TypeError('please set config.test or config.type');
    }
    else if (!config.component) {
        throw new TypeError('config.component is required');
    }
    if (typeof config.type === 'string' && config.type) {
        config.type = config.type.toLowerCase();
        config.test =
            config.test || new RegExp("(^|/)".concat((0, helper_1.string2regExp)(config.type), "$"), 'i');
    }
    config.weight = config.weight || 0;
    config.Renderer = config.component;
    config.name = config.name || config.type || "anonymous-".concat(anonymousIndex++);
    if (~rendererNames.indexOf(config.name)) {
        throw new Error("The renderer with name \"".concat(config.name, "\" has already exists, please try another name!"));
    }
    if (config.storeType && config.component) {
        config.component = (0, WithStore_1.HocStoreFactory)({
            storeType: config.storeType,
            extendsData: config.storeExtendsData,
            shouldSyncSuperStore: config.shouldSyncSuperStore
        })((0, mobx_react_1.observer)(config.component));
    }
    if (config.isolateScope) {
        config.component = (0, Scoped_1.default)(config.component);
    }
    var idx = (0, helper_1.findIndex)(renderers, function (item) { return config.weight < item.weight; });
    ~idx ? renderers.splice(idx, 0, config) : renderers.push(config);
    rendererNames.push(config.name);
    return config;
}
exports.registerRenderer = registerRenderer;
function unRegisterRenderer(config) {
    var idx = typeof config === 'string'
        ? (0, helper_1.findIndex)(renderers, function (item) { return item.name === config; })
        : renderers.indexOf(config);
    ~idx && renderers.splice(idx, 1);
    var idx2 = typeof config === 'string'
        ? (0, helper_1.findIndex)(rendererNames, function (item) { return item === config; })
        : rendererNames.indexOf(config.name || '');
    ~idx2 && rendererNames.splice(idx2, 1);
    // 清空渲染器定位缓存
    cache = {};
}
exports.unRegisterRenderer = unRegisterRenderer;
function loadRenderer(schema, path) {
    return (react_1.default.createElement(Alert2_1.default, { level: "danger" },
        react_1.default.createElement("p", null, "Error: \u627E\u4E0D\u5230\u5BF9\u5E94\u7684\u6E32\u67D3\u5668"),
        react_1.default.createElement("p", null,
            "Path: ",
            path),
        react_1.default.createElement("pre", null,
            react_1.default.createElement("code", null, JSON.stringify(schema, null, 2)))));
}
exports.loadRenderer = loadRenderer;
var defaultOptions = {
    session: 'global',
    affixOffsetTop: 0,
    affixOffsetBottom: 0,
    richTextToken: '',
    useMobileUI: true,
    enableAMISDebug: (_b = (_a = window.enableAMISDebug) !== null && _a !== void 0 ? _a : location.search.indexOf('amisDebug=1') !== -1) !== null && _b !== void 0 ? _b : false,
    loadRenderer: loadRenderer,
    fetcher: function () {
        return Promise.reject('fetcher is required');
    },
    // 使用 WebSocket 来实时获取数据
    wsFetcher: function (ws, onMessage, onError) {
        if (ws) {
            var socket_1 = new WebSocket(ws.url);
            socket_1.onopen = function (event) {
                if (ws.body) {
                    socket_1.send(JSON.stringify(ws.body));
                }
            };
            socket_1.onmessage = function (event) {
                var _a;
                if (event.data) {
                    var data = void 0;
                    try {
                        data = JSON.parse(event.data);
                    }
                    catch (error) { }
                    if (typeof data !== 'object') {
                        var key = ws.responseKey || 'data';
                        data = (_a = {},
                            _a[key] = event.data,
                            _a);
                    }
                    onMessage(data);
                }
            };
            socket_1.onerror = onError;
            return {
                close: socket_1.close
            };
        }
        else {
            return {
                close: function () { }
            };
        }
    },
    isCancel: function () {
        console.error('Please implement isCancel. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97');
        return false;
    },
    updateLocation: function () {
        console.error('Please implement updateLocation. see https://baidu.gitee.io/amis/docs/start/getting-started#%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97');
    },
    alert: Alert_1.alert,
    confirm: Alert_1.confirm,
    notify: function (type, msg, conf) {
        return Toast_1.toast[type] ? Toast_1.toast[type](msg, conf) : console.warn('[Notify]', type, msg);
    },
    jumpTo: function (to, action) {
        if (to === 'goBack') {
            return window.history.back();
        }
        to = (0, normalizeLink_1.normalizeLink)(to);
        if (action && action.actionType === 'url') {
            action.blank === false ? (window.location.href = to) : window.open(to);
            return;
        }
        if (/^https?:\/\//.test(to)) {
            window.location.replace(to);
        }
        else {
            location.href = to;
        }
    },
    isCurrentUrl: function (to) {
        if (!to) {
            return false;
        }
        var link = (0, normalizeLink_1.normalizeLink)(to);
        var location = window.location;
        var pathname = link;
        var search = '';
        var idx = link.indexOf('?');
        if (~idx) {
            pathname = link.substring(0, idx);
            search = link.substring(idx);
        }
        if (search) {
            if (pathname !== location.pathname || !location.search) {
                return false;
            }
            var query_1 = (0, helper_1.qsparse)(search.substring(1));
            var currentQuery_1 = (0, helper_1.qsparse)(location.search.substring(1));
            return Object.keys(query_1).every(function (key) { return query_1[key] === currentQuery_1[key]; });
        }
        else if (pathname === location.pathname) {
            return true;
        }
        return false;
    },
    copy: function (contents) {
        console.error('copy contents', contents);
    },
    // 用于跟踪用户在界面中的各种操作
    tracker: function (eventTrack, props) { },
    rendererResolver: resolveRenderer,
    replaceTextIgnoreKeys: [
        'type',
        'name',
        'mode',
        'target',
        'reload',
        'persistData'
    ],
    /**
     * 过滤 html 标签，可用来添加 xss 保护逻辑
     */
    filterHtml: function (input) { return input; }
};
var stores = {};
function render(schema, props, options, pathPrefix) {
    if (props === void 0) { props = {}; }
    if (options === void 0) { options = {}; }
    if (pathPrefix === void 0) { pathPrefix = ''; }
    var locale = props.locale || (0, locale_1.getDefaultLocale)();
    // 兼容 locale 的不同写法
    locale = locale.replace('_', '-');
    locale = locale === 'en' ? 'en-US' : locale;
    locale = locale === 'zh' ? 'zh-CN' : locale;
    locale = locale === 'cn' ? 'zh-CN' : locale;
    var translate = props.translate || (0, locale_1.makeTranslator)(locale);
    var store = stores[options.session || 'global'];
    // 根据环境覆盖 schema，这个要在最前面做，不然就无法覆盖 validations
    (0, envOverwrite_1.envOverwrite)(schema, locale);
    if (!store) {
        options = (0, tslib_1.__assign)((0, tslib_1.__assign)((0, tslib_1.__assign)({}, defaultOptions), options), { fetcher: options.fetcher
                ? (0, api_1.wrapFetcher)(options.fetcher, options.tracker)
                : defaultOptions.fetcher, confirm: (0, helper_1.promisify)(options.confirm || defaultOptions.confirm || window.confirm), locale: locale, translate: translate });
        if (options.enableAMISDebug) {
            // 因为里面还有 render
            setTimeout(function () {
                (0, debug_1.enableDebug)();
            }, 10);
        }
        store = index_1.RendererStore.create({}, options);
        stores[options.session || 'global'] = store;
    }
    window.amisStore = store; // 为了方便 debug.
    var env = (0, mobx_state_tree_1.getEnv)(store);
    var theme = props.theme || options.theme || 'cxd';
    if (theme === 'default') {
        theme = 'cxd';
    }
    env.theme = (0, theme_1.getTheme)(theme);
    if (props.locale !== undefined) {
        env.translate = translate;
        env.locale = locale;
    }
    // 默认将开启移动端原生 UI
    if (typeof options.useMobileUI) {
        props.useMobileUI = true;
    }
    // 进行文本替换
    if (env.replaceText && (0, helper_1.isObject)(env.replaceText)) {
        var replaceKeys_1 = Object.keys(env.replaceText);
        replaceKeys_1.sort(function (a, b) { return b.length - a.length; }); // 避免用户将短的放前面
        var replaceTextIgnoreKeys_1 = new Set(env.replaceTextIgnoreKeys || []);
        (0, helper_1.JSONTraverse)(schema, function (value, key, object) {
            if (typeof value === 'string' && !replaceTextIgnoreKeys_1.has(key)) {
                for (var _i = 0, replaceKeys_2 = replaceKeys_1; _i < replaceKeys_2.length; _i++) {
                    var replaceKey = replaceKeys_2[_i];
                    if (~value.indexOf(replaceKey)) {
                        value = object[key] = value.replaceAll(replaceKey, env.replaceText[replaceKey]);
                    }
                }
            }
        });
    }
    return (react_1.default.createElement(env_1.EnvContext.Provider, { value: env },
        react_1.default.createElement(Root_1.default, (0, tslib_1.__assign)({}, props, { schema: schema, pathPrefix: pathPrefix, rootStore: store, env: env, theme: theme, locale: locale, translate: translate }))));
}
exports.render = render;
// 默认 env 会被缓存，所以新传入的 env 不会替换旧的。
// 除非先删了旧的，新的才会生效。
function clearStoresCache(sessions) {
    if (sessions === void 0) { sessions = Object.keys(stores); }
    if (!Array.isArray(sessions)) {
        sessions = [sessions];
    }
    sessions.forEach(function (key) {
        var store = stores[key];
        // @ts-ignore
        delete stores[key];
        store && (0, mobx_state_tree_1.destroy)(store);
    });
}
exports.clearStoresCache = clearStoresCache;
// 当然也可以直接这样更新。
// 主要是有时候第一次创建的时候并没有准备多少接口，
// 可以后续补充点，比如 amis 自己实现的，prompt 里面的表单。
function updateEnv(options, session) {
    if (session === void 0) { session = 'global'; }
    options = (0, tslib_1.__assign)({}, options);
    if (options.fetcher) {
        options.fetcher = (0, api_1.wrapFetcher)(options.fetcher, options.tracker);
    }
    if (options.confirm) {
        options.confirm = (0, helper_1.promisify)(options.confirm);
    }
    var store = stores[options.session || session];
    if (!store) {
        store = index_1.RendererStore.create({}, options);
        stores[options.session || session] = store;
    }
    else {
        var env = (0, mobx_state_tree_1.getEnv)(store);
        Object.assign(env, options);
    }
}
exports.updateEnv = updateEnv;
var cache = {};
function resolveRenderer(path, schema) {
    var type = typeof (schema === null || schema === void 0 ? void 0 : schema.type) == 'string' ? schema.type.toLowerCase() : '';
    if (type && cache[type]) {
        return cache[type];
    }
    else if (cache[path]) {
        return cache[path];
    }
    else if (path && path.length > 1024) {
        throw new Error('Path太长是不是死循环了？');
    }
    var renderer = null;
    renderers.some(function (item) {
        var matched = false;
        // 直接匹配类型，后续注册渲染都应该用这个方式而不是之前的判断路径。
        if (item.type && type) {
            matched = item.type === type;
            // 如果是type来命中的，那么cache的key直接用 type 即可。
            if (matched) {
                cache[type] = item;
            }
        }
        else if (typeof item.test === 'function') {
            // 不应该搞得这么复杂的，让每个渲染器唯一 id，自己不晕别人用起来也不晕。
            matched = item.test(path, schema, resolveRenderer);
        }
        else if (item.test instanceof RegExp) {
            matched = item.test.test(path);
        }
        if (matched) {
            renderer = item;
        }
        return matched;
    });
    // 只能缓存纯正则表达式的后者方法中没有用到第二个参数的，
    // 因为自定义 test 函数的有可能依赖 schema 的结果
    if (renderer !== null &&
        (renderer.type ||
            renderer.test instanceof RegExp ||
            (typeof renderer.test === 'function' &&
                renderer.test.length < 2))) {
        cache[path] = renderer;
    }
    return renderer;
}
exports.resolveRenderer = resolveRenderer;
function getRenderers() {
    return renderers.concat();
}
exports.getRenderers = getRenderers;
function getRendererByName(name) {
    return (0, find_1.default)(renderers, function (item) { return item.name === name; });
}
exports.getRendererByName = getRendererByName;
(0, Alert_1.setRenderSchemaFn)(function (controls, value, callback, scopeRef, theme) {
    return render({
        name: 'form',
        type: 'form',
        wrapWithPanel: false,
        mode: 'horizontal',
        controls: controls,
        messages: {
            validateFailed: ''
        }
    }, {
        data: value,
        onFinished: callback,
        scopeRef: scopeRef,
        theme: theme
    }, {
        session: 'prompt'
    });
});
//# sourceMappingURL=./factory.js.map
