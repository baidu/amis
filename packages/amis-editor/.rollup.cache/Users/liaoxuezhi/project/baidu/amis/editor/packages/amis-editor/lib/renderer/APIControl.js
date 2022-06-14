import { __awaiter, __decorate, __extends, __generator, __metadata, __rest } from "tslib";
import React from 'react';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import cx from 'classnames';
import { FormItem, InputBox, Icon } from 'amis';
import { PickerContainer } from 'amis';
import { getEnv } from 'mobx-state-tree';
import { normalizeApi, isEffectiveApi, isApiOutdated } from 'amis-core';
import { isObject, autobind, createObject, anyChanged } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
var APIControl = /** @class */ (function (_super) {
    __extends(APIControl, _super);
    function APIControl(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            apiStr: _this.transformApi2Str(props.value),
            selectedItem: [],
            schema: props.pickerSchema
        };
        return _this;
    }
    APIControl.prototype.componentDidUpdate = function (prevProps) {
        var props = this.props;
        if (prevProps.value !== props.value) {
            this.setState({ apiStr: this.transformApi2Str(props.value) });
        }
        if (anyChanged(['enablePickerMode', 'pickerSchema'], prevProps, props)) {
            this.setState({ schema: props.pickerSchema });
        }
        if (isApiOutdated(prevProps === null || prevProps === void 0 ? void 0 : prevProps.pickerSource, props === null || props === void 0 ? void 0 : props.pickerSource, prevProps.data, props.data)) {
            this.fetchOptions();
        }
    };
    APIControl.prototype.transformApi2Str = function (value) {
        var api = normalizeApi(value);
        return api.url ? "".concat(api.method ? "".concat(api.method, ":") : '').concat(api.url) : '';
    };
    APIControl.prototype.fetchOptions = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var _d, value, data, env, pickerSource, apiObj, apiKey, ctx, schemaFilter, res, items, selectedItem;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _d = this.props, value = _d.value, data = _d.data, env = _d.env;
                        pickerSource = this.props.pickerSource;
                        apiObj = normalizeApi(value);
                        apiKey = (_a = apiObj === null || apiObj === void 0 ? void 0 : apiObj.url.split('api://')) === null || _a === void 0 ? void 0 : _a[1];
                        if (!pickerSource) {
                            return [2 /*return*/];
                        }
                        ctx = createObject(data, { value: value, op: 'loadOptions' });
                        schemaFilter = getEnv(window.editorStore).schemaFilter;
                        // 基于爱速搭的规则转换一下
                        if (schemaFilter) {
                            pickerSource = schemaFilter({ api: pickerSource }).api;
                        }
                        if (!isEffectiveApi(pickerSource, ctx)) return [3 /*break*/, 2];
                        return [4 /*yield*/, env.fetcher(pickerSource, ctx)];
                    case 1:
                        res = _e.sent();
                        items = ((_b = res.data) === null || _b === void 0 ? void 0 : _b.items) || ((_c = res === null || res === void 0 ? void 0 : res.data) === null || _c === void 0 ? void 0 : _c.rows);
                        if (items.length) {
                            selectedItem = items.find(function (item) { return item.key === apiKey; });
                            this.setState({ selectedItem: selectedItem ? [selectedItem] : [] });
                        }
                        _e.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    APIControl.prototype.handleSubmit = function (values, action) {
        var _a = this.props, onChange = _a.onChange, value = _a.value;
        var api = values;
        // Picker未做选择
        if (!values && action === 'picker-submit') {
            return;
        }
        if (typeof value !== 'string' || typeof values !== 'string') {
            api = merge({}, normalizeApi(value), normalizeApi(values));
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(api);
    };
    APIControl.prototype.handleAction = function (schema, e, action, data) {
        var onAction = this.props.onAction;
        onAction === null || onAction === void 0 ? void 0 : onAction(schema, e, action, data);
    };
    APIControl.prototype.normalizeValue = function (value, callback) {
        var transformedValue = cloneDeep(value);
        if (typeof callback === 'function') {
            transformedValue = callback(value);
        }
        return transformedValue;
    };
    APIControl.prototype.handlePickerConfirm = function (value) {
        var onPickerConfirm = this.props.onPickerConfirm;
        this.handleSubmit(this.normalizeValue(value, onPickerConfirm), 'picker-submit');
    };
    APIControl.prototype.handlePickerClose = function () {
        var onPickerClose = this.props.onPickerClose;
        onPickerClose === null || onPickerClose === void 0 ? void 0 : onPickerClose();
    };
    APIControl.prototype.renderHeader = function () {
        var _this = this;
        var _a = this.props, render = _a.render, actions = _a.actions, enablePickerMode = _a.enablePickerMode;
        var actionsDom = Array.isArray(actions) && actions.length > 0
            ? actions.map(function (action, index) {
                return render("action/".concat(index), action, {
                    key: index,
                    onAction: _this.handleAction.bind(_this, action)
                });
            })
            : null;
        return actionsDom || enablePickerMode ? (React.createElement("header", { className: "ae-ApiControl-header", key: "header" }, enablePickerMode ? this.renderPickerSchema() : actionsDom)) : null;
    };
    APIControl.prototype.renderPickerSchema = function () {
        var _this = this;
        var _a = this.props, render = _a.render, pickerTitle = _a.pickerTitle, _b = _a.pickerName, pickerName = _b === void 0 ? 'apiPicker' : _b, pickerSize = _a.pickerSize, pickerHeaderClassName = _a.pickerHeaderClassName, pickerBtnSchema = _a.pickerBtnSchema, enablePickerMode = _a.enablePickerMode, onPickerSelect = _a.onPickerSelect;
        var _c = this.state, selectedItem = _c.selectedItem, schema = _c.schema;
        if (!schema) {
            return null;
        }
        return (React.createElement(PickerContainer, { title: pickerTitle, value: selectedItem, headerClassName: cx(pickerHeaderClassName, 'font-bold'), onConfirm: this.handlePickerConfirm, onCancel: this.handlePickerClose, size: pickerSize, bodyRender: function (_a) {
                var _b;
                var value = _a.value, onClose = _a.onClose, onChange = _a.onChange, setState = _a.setState, states = __rest(_a, ["value", "onClose", "onChange", "setState"]);
                return render('api-control-picker', schema, {
                    data: (_b = {}, _b[pickerName] = selectedItem, _b),
                    onSelect: function (items) {
                        setState({ selectedItem: items });
                        onChange(_this.normalizeValue(items, onPickerSelect));
                    }
                });
            } }, function (_a) {
            var onClick = _a.onClick, isOpened = _a.isOpened;
            return render('picker-action', pickerBtnSchema, {
                onClick: function (e) { return __awaiter(_this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(!isOpened && enablePickerMode)) return [3 /*break*/, 4];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, this.fetchOptions()];
                            case 2:
                                _b.sent();
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _b.sent();
                                return [3 /*break*/, 4];
                            case 4:
                                onClick(e);
                                return [2 /*return*/];
                        }
                    });
                }); }
            });
        }));
    };
    APIControl.prototype.renderApiDialog = function () {
        var messageDesc = this.props.messageDesc;
        return {
            label: '',
            type: 'action',
            acitonType: 'dialog',
            size: 'sm',
            icon: React.createElement(Icon, { icon: "api" }),
            actionType: 'dialog',
            dialog: {
                title: '高级设置',
                size: 'md',
                className: 'ae-ApiControl-dialog',
                headerClassName: 'font-bold',
                bodyClassName: 'ae-ApiControl-dialog-body',
                closeOnEsc: true,
                closeOnOutside: false,
                showCloseButton: true,
                body: [this.renderApiConfigTabs(messageDesc)]
            }
        };
    };
    APIControl.prototype.renderApiConfigTabs = function (messageDesc, submitOnChange) {
        if (submitOnChange === void 0) { submitOnChange = false; }
        return {
            type: 'form',
            className: 'ae-ApiControl-form',
            mode: 'horizontal',
            submitOnChange: submitOnChange,
            wrapWithPanel: false,
            onSubmit: this.handleSubmit,
            body: [
                {
                    type: 'tabs',
                    className: 'ae-ApiControl-tabs',
                    contentClassName: 'ae-ApiControl-tabContent',
                    tabs: [
                        {
                            title: '接口设置',
                            tab: [
                                {
                                    label: '发送方式',
                                    name: 'method',
                                    value: 'get',
                                    type: 'button-group-select',
                                    mode: 'horizontal',
                                    options: [
                                        {
                                            value: 'get',
                                            label: 'GET'
                                        },
                                        {
                                            value: 'post',
                                            label: 'POST'
                                        },
                                        {
                                            value: 'put',
                                            label: 'PUT'
                                        },
                                        {
                                            value: 'patch',
                                            label: 'PATCH'
                                        },
                                        {
                                            value: 'delete',
                                            label: 'DELETE'
                                        }
                                    ]
                                },
                                {
                                    label: '接口地址',
                                    type: 'input-text',
                                    name: 'url',
                                    mode: 'horizontal',
                                    size: 'lg',
                                    placeholder: 'http://',
                                    required: true
                                },
                                {
                                    label: '发送条件',
                                    type: 'input-text',
                                    name: 'sendOn',
                                    mode: 'horizontal',
                                    size: 'lg',
                                    placeholder: '如：this.type == "123"',
                                    description: '用表达式来设置该请求的发送条件'
                                },
                                {
                                    label: '数据格式',
                                    type: 'button-group-select',
                                    name: 'dataType',
                                    size: 'sm',
                                    mode: 'horizontal',
                                    description: '发送体格式为：<%= data.dataType === "json" ? "application/json" : data.dataType === "form-data" ? "multipart/form-data" : data.dataType === "form" ? "application/x-www-form-urlencoded" : "" %>，当发送内容中存在文件时会自动使用 form-data 格式。',
                                    options: [
                                        {
                                            label: 'JSON',
                                            value: 'json'
                                        },
                                        {
                                            label: 'FormData',
                                            value: 'form-data'
                                        },
                                        {
                                            label: 'Form',
                                            value: 'form'
                                        }
                                    ],
                                    disabled: false
                                },
                                {
                                    type: 'switch',
                                    label: '是否设置缓存',
                                    name: 'cache',
                                    mode: 'horizontal',
                                    pipeIn: function (value) { return !!value; },
                                    pipeOut: function (value) { return (value ? 3000 : undefined); }
                                },
                                {
                                    label: '',
                                    type: 'input-number',
                                    name: 'cache',
                                    mode: 'horizontal',
                                    size: 'md',
                                    min: 0,
                                    step: 500,
                                    visibleOn: 'this.cache',
                                    description: '设置该请求缓存有效时间，单位 ms',
                                    pipeIn: function (value) {
                                        return typeof value === 'number' ? value : 0;
                                    }
                                },
                                {
                                    label: '文件下载',
                                    name: 'responseType',
                                    type: 'switch',
                                    mode: 'horizontal',
                                    description: '当接口为二进制文件下载时请勾选，否则会文件乱码。',
                                    pipeIn: function (value) { return value === 'blob'; },
                                    pipeOut: function (value) { return (value ? 'blob' : undefined); }
                                },
                                {
                                    label: '数据替换',
                                    name: 'replaceData',
                                    type: 'switch',
                                    mode: 'horizontal',
                                    description: '默认数据为追加方式，开启后完全替换当前数据'
                                },
                                {
                                    label: tipedLabel('初始加载', '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改'),
                                    type: 'group',
                                    visibleOn: 'this.initApi',
                                    mode: 'horizontal',
                                    direction: 'vertical',
                                    // labelRemark: {
                                    //   trigger: 'hover',
                                    //   rootClose: true,
                                    //   content:
                                    //     '当配置初始化接口后，组件初始就会拉取接口数据，可以通过以下配置修改',
                                    //   placement: 'top'
                                    // },
                                    body: [
                                        {
                                            name: 'initFetch',
                                            type: 'radios',
                                            inline: true,
                                            mode: 'normal',
                                            renderLabel: false,
                                            onChange: function () {
                                                document.getElementsByClassName('ae-Settings-content')[0].scrollTop = 0;
                                            },
                                            // pipeIn: (value:any) => typeof value === 'boolean' ? value : '1'
                                            options: [
                                                {
                                                    label: '是',
                                                    value: true
                                                },
                                                {
                                                    label: '否',
                                                    value: false
                                                },
                                                {
                                                    label: '表达式',
                                                    value: ''
                                                }
                                            ]
                                        },
                                        {
                                            name: 'initFetchOn',
                                            autoComplete: false,
                                            visibleOn: 'typeof this.initFetch !== "boolean"',
                                            type: 'input-text',
                                            mode: 'normal',
                                            size: 'lg',
                                            renderLabel: false,
                                            placeholder: '如：this.id 表示有 id 值时初始加载',
                                            className: 'm-t-n-sm'
                                        }
                                    ]
                                },
                                {
                                    label: '定时刷新',
                                    name: 'interval',
                                    type: 'switch',
                                    mode: 'horizontal',
                                    visibleOn: 'data.initApi',
                                    pipeIn: function (value) { return !!value; },
                                    pipeOut: function (value) { return (value ? 3000 : undefined); }
                                },
                                {
                                    label: '',
                                    name: 'interval',
                                    type: 'input-number',
                                    mode: 'horizontal',
                                    size: 'md',
                                    visibleOn: 'typeof this.interval === "number"',
                                    step: 500,
                                    description: '定时刷新间隔，单位 ms'
                                },
                                {
                                    label: '静默刷新',
                                    name: 'silentPolling',
                                    type: 'switch',
                                    mode: 'horizontal',
                                    visibleOn: '!!data.interval',
                                    description: '设置自动定时刷新时是否显示loading'
                                },
                                {
                                    label: tipedLabel('定时刷新停止', '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则停止刷新'),
                                    name: 'stopAutoRefreshWhen',
                                    type: 'input-text',
                                    mode: 'horizontal',
                                    horizontal: {
                                        leftFixed: 'md'
                                    },
                                    size: 'lg',
                                    visibleOn: '!!data.interval',
                                    placeholder: '停止定时刷新检测表达式'
                                    // labelRemark: {
                                    //   trigger: 'hover',
                                    //   rootClose: true,
                                    //   content:
                                    //     '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则停止刷新',
                                    //   placement: 'top'
                                    // }
                                }
                            ]
                        },
                        {
                            title: 'HTTP配置',
                            tab: [
                                {
                                    type: 'fieldSet',
                                    title: 'Body',
                                    headingClassName: 'ae-ApiControl-title',
                                    body: [
                                        {
                                            type: 'switch',
                                            label: tipedLabel('发送数据映射', '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项'),
                                            name: 'data',
                                            mode: 'row',
                                            // labelRemark: {
                                            //   trigger: 'hover',
                                            //   rootClose: true,
                                            //   content:
                                            //     '当没开启数据映射时，发送 API 的时候会发送尽可能多的数据，如果你想自己控制发送的数据，或者需要额外的数据处理，请开启此选项',
                                            //   placement: 'top'
                                            // },
                                            pipeIn: function (value) { return !!value; },
                                            pipeOut: function (value) { return (value ? { '&': '$$' } : null); }
                                        },
                                        {
                                            type: 'combo',
                                            syncDefaultValue: false,
                                            name: 'data',
                                            mode: 'normal',
                                            renderLabel: false,
                                            visibleOn: 'this.data',
                                            descriptionClassName: 'help-block text-xs m-b-none',
                                            description: '<p>当没开启数据映射时，发送数据自动切成白名单模式，配置啥发送啥，请绑定数据。如：<code>{"a": "\\${a}", "b": 2}</code></p><p>如果希望在默认的基础上定制，请先添加一个 Key 为 `&` Value 为 `\\$$` 作为第一行。</p><div>当值为 <code>__undefined</code>时，表示删除对应的字段，可以结合<code>{"&": "\\$$"}</code>来达到黑名单效果。</div>',
                                            multiple: true,
                                            pipeIn: function (value) {
                                                if (!isObject(value)) {
                                                    return value;
                                                }
                                                var arr = [];
                                                Object.keys(value).forEach(function (key) {
                                                    arr.push({
                                                        key: key || '',
                                                        value: typeof value[key] === 'string'
                                                            ? value[key]
                                                            : JSON.stringify(value[key])
                                                    });
                                                });
                                                return arr;
                                            },
                                            pipeOut: function (value) {
                                                if (!Array.isArray(value)) {
                                                    return value;
                                                }
                                                var obj = {};
                                                value.forEach(function (item) {
                                                    var key = item.key || '';
                                                    var value = item.value;
                                                    try {
                                                        value = JSON.parse(value);
                                                    }
                                                    catch (e) { }
                                                    obj[key] = value;
                                                });
                                                return obj;
                                            },
                                            items: [
                                                {
                                                    placeholder: 'Key',
                                                    type: 'input-text',
                                                    unique: true,
                                                    name: 'key',
                                                    required: true
                                                },
                                                {
                                                    placeholder: 'Value',
                                                    type: 'input-text',
                                                    name: 'value'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'switch',
                                            label: tipedLabel('返回结果映射', '如果需要对返回结果做额外的数据处理，请开启此选项'),
                                            name: 'responseData',
                                            mode: 'row',
                                            // labelRemark: {
                                            //   trigger: 'hover',
                                            //   rootClose: true,
                                            //   content:
                                            //     '如果需要对返回结果做额外的数据处理，请开启此选项',
                                            //   placement: 'top'
                                            // },
                                            pipeIn: function (value) { return !!value; },
                                            pipeOut: function (value) { return (value ? { '&': '$$' } : null); }
                                        },
                                        {
                                            type: 'combo',
                                            syncDefaultValue: false,
                                            name: 'responseData',
                                            mode: 'normal',
                                            renderLabel: false,
                                            visibleOn: 'this.responseData',
                                            descriptionClassName: 'help-block text-xs m-b-none',
                                            multiple: true,
                                            pipeIn: function (value) {
                                                if (!isObject(value)) {
                                                    return value;
                                                }
                                                var arr = [];
                                                Object.keys(value).forEach(function (key) {
                                                    arr.push({
                                                        key: key || '',
                                                        value: typeof value[key] === 'string'
                                                            ? value[key]
                                                            : JSON.stringify(value[key])
                                                    });
                                                });
                                                return arr;
                                            },
                                            pipeOut: function (value) {
                                                if (!Array.isArray(value)) {
                                                    return value;
                                                }
                                                var obj = {};
                                                value.forEach(function (item) {
                                                    var key = item.key || '';
                                                    var value = item.value;
                                                    try {
                                                        value = JSON.parse(value);
                                                    }
                                                    catch (e) { }
                                                    obj[key] = value;
                                                });
                                                return obj;
                                            },
                                            items: [
                                                {
                                                    placeholder: 'Key',
                                                    type: 'input-text',
                                                    unique: true,
                                                    name: 'key',
                                                    required: true
                                                },
                                                {
                                                    placeholder: 'Value',
                                                    type: 'input-text',
                                                    name: 'value'
                                                }
                                            ]
                                        },
                                        {
                                            label: '发送适配器',
                                            name: 'requestAdaptor',
                                            type: 'js-editor',
                                            mode: 'horizontal',
                                            horizontal: { justify: true },
                                            clasName: 'm-t-sm',
                                            allowFullscreen: true,
                                            description: '函数签名：(api) => api， 数据在 api.data 中，修改后返回 api 对象。'
                                        },
                                        {
                                            label: '接收适配器',
                                            name: 'adaptor',
                                            type: 'js-editor',
                                            mode: 'horizontal',
                                            horizontal: { justify: true },
                                            clasName: 'm-t-sm',
                                            allowFullscreen: true,
                                            description: '函数签名: (payload, response, api) => payload'
                                        }
                                    ]
                                },
                                {
                                    type: 'fieldSet',
                                    title: 'Header',
                                    headingClassName: 'ae-ApiControl-title',
                                    body: [
                                        {
                                            type: 'switch',
                                            label: tipedLabel('请求头', '可以配置headers对象，添加自定义请求头'),
                                            name: 'headers',
                                            mode: 'row',
                                            className: 'm-b-xs',
                                            // labelRemark: {
                                            //   trigger: 'hover',
                                            //   rootClose: true,
                                            //   content:
                                            //     '可以配置<code>headers</code>对象，添加自定义请求头',
                                            //   placement: 'top'
                                            // },
                                            pipeIn: function (value) { return !!value; },
                                            pipeOut: function (value) { return (value ? { '': '' } : null); }
                                        },
                                        {
                                            type: 'combo',
                                            name: 'headers',
                                            mode: 'row',
                                            syncDefaultValue: false,
                                            multiple: true,
                                            visibleOn: 'this.headers',
                                            items: [
                                                {
                                                    type: 'input-text',
                                                    name: 'key',
                                                    placeholder: 'Key',
                                                    unique: true,
                                                    required: true,
                                                    options: [
                                                        {
                                                            label: 'Content-Encoding',
                                                            value: 'Content-Encoding'
                                                        },
                                                        {
                                                            label: 'Content-Type',
                                                            value: 'Content-Type'
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: 'input-text',
                                                    name: 'value',
                                                    placeholder: 'Value',
                                                    disabled: false
                                                }
                                            ],
                                            pipeIn: function (value) {
                                                if (!isObject(value)) {
                                                    return value;
                                                }
                                                var arr = [];
                                                Object.keys(value).forEach(function (key) {
                                                    arr.push({
                                                        key: key || '',
                                                        value: typeof value[key] === 'string'
                                                            ? value[key]
                                                            : JSON.stringify(value[key])
                                                    });
                                                });
                                                return arr;
                                            },
                                            pipeOut: function (value) {
                                                if (!Array.isArray(value)) {
                                                    return value;
                                                }
                                                var obj = {};
                                                value.forEach(function (item) {
                                                    var key = item.key || '';
                                                    var value = item.value;
                                                    try {
                                                        value = JSON.parse(value);
                                                    }
                                                    catch (e) { }
                                                    obj[key] = value;
                                                });
                                                return obj;
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: '其他',
                            tab: [
                                {
                                    label: '默认消息提示',
                                    type: 'combo',
                                    name: 'messages',
                                    mode: 'normal',
                                    multiLine: true,
                                    description: messageDesc ||
                                        '设置 ajax 默认提示信息，当 ajax 没有返回 msg 信息时有用，如果 ajax 返回携带了 msg 值，则还是以 ajax 返回为主',
                                    items: [
                                        {
                                            label: '获取成功提示',
                                            type: 'input-text',
                                            name: 'fetchSuccess'
                                        },
                                        {
                                            label: '获取失败提示',
                                            type: 'input-text',
                                            name: 'fetchFailed'
                                        },
                                        {
                                            label: '保存顺序成功提示',
                                            type: 'input-text',
                                            name: 'saveOrderSuccess'
                                        },
                                        {
                                            label: '保存顺序失败提示',
                                            type: 'input-text',
                                            name: 'saveOrderFailed'
                                        },
                                        {
                                            label: '快速保存成功提示',
                                            type: 'input-text',
                                            name: 'quickSaveSuccess'
                                        },
                                        {
                                            label: '快速保存失败提示',
                                            type: 'input-text',
                                            name: 'quickSaveFailed'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        // return
    };
    APIControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, render = _a.render, className = _a.className, value = _a.value, footer = _a.footer, _b = _a.border, border = _b === void 0 ? false : _b, messageDesc = _a.messageDesc;
        return (React.createElement("div", { className: cx('ae-ApiControl', className, { border: border }) },
            this.renderHeader(),
            React.createElement("div", { className: "ae-ApiControl-content", key: "content" },
                React.createElement(InputBox, { className: "ae-ApiControl-input m-b-none", value: this.state.apiStr, clearable: false, placeholder: "http://", onChange: function (value) { return _this.handleSubmit(value, 'input'); } }),
                render('api-control-dialog', this.renderApiDialog(), {
                    data: normalizeApi(value)
                })),
            Array.isArray(footer) && footer.length !== 0 ? (React.createElement("footer", { className: "mt-3", key: "footer" }, render('api-control-footer', footer))) : null));
    };
    APIControl.defaultProps = {
        pickerBtnSchema: {
            type: 'button',
            level: 'link',
            size: 'sm',
            label: '点击选择'
        }
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], APIControl.prototype, "handleSubmit", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], APIControl.prototype, "handlePickerConfirm", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], APIControl.prototype, "handlePickerClose", null);
    return APIControl;
}(React.Component));
export default APIControl;
var APIControlRenderer = /** @class */ (function (_super) {
    __extends(APIControlRenderer, _super);
    function APIControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    APIControlRenderer = __decorate([
        FormItem({
            type: 'ae-apiControl'
        })
    ], APIControlRenderer);
    return APIControlRenderer;
}(APIControl));
export { APIControlRenderer };
