"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapControl = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var combo_1 = require("../../store/combo");
var helper_1 = require("../../utils/helper");
var Scoped_1 = require("../../Scoped");
var formItem_1 = require("../../store/formItem");
var mobx_state_tree_1 = require("mobx-state-tree");
var mobx_react_1 = require("mobx-react");
var hoist_non_react_statics_1 = (0, tslib_1.__importDefault)(require("hoist-non-react-statics"));
var WithRootStore_1 = require("../../WithRootStore");
var table_1 = require("../../store/table");
function wrapControl(ComposedComponent) {
    var _a;
    var result = (0, hoist_non_react_statics_1.default)((0, WithRootStore_1.withRootStore)((0, mobx_react_1.observer)((_a = /** @class */ (function (_super) {
            (0, tslib_1.__extends)(class_1, _super);
            function class_1(props) {
                var _a, _b;
                var _this = _super.call(this, props) || this;
                _this.value = undefined;
                _this.lazyEmitChange = (0, debounce_1.default)(_this.emitChange.bind(_this), 250, {
                    trailing: true,
                    leading: false
                });
                var _c = _this.props, form = _c.formStore, formItem = _c.formItem, rootStore = _c.rootStore, store = _c.store, onChange = _c.onChange, data = _c.data, _d = _c.$schema, name = _d.name, id = _d.id, type = _d.type, required = _d.required, validations = _d.validations, validationErrors = _d.validationErrors, unique = _d.unique, value = _d.value, multiple = _d.multiple, delimiter = _d.delimiter, valueField = _d.valueField, labelField = _d.labelField, joinValues = _d.joinValues, extractValue = _d.extractValue, selectFirst = _d.selectFirst, autoFill = _d.autoFill, clearValueOnHidden = _d.clearValueOnHidden, validateApi = _d.validateApi, minLength = _d.minLength, maxLength = _d.maxLength, validateOnChange = _d.validateOnChange, label = _d.label;
                _this.getValue = _this.getValue.bind(_this);
                _this.setValue = _this.setValue.bind(_this);
                _this.handleChange = _this.handleChange.bind(_this);
                _this.setPrinstineValue = _this.setPrinstineValue.bind(_this);
                _this.controlRef = _this.controlRef.bind(_this);
                _this.handleBlur = _this.handleBlur.bind(_this);
                if (!name) {
                    return _this;
                }
                var propValue = _this.props.value;
                var model = rootStore.addStore({
                    id: (0, helper_1.guid)(),
                    path: _this.props.$path,
                    storeType: formItem_1.FormItemStore.name,
                    parentId: store === null || store === void 0 ? void 0 : store.id,
                    name: name
                });
                _this.model = model;
                // @issue 打算干掉这个
                formItem === null || formItem === void 0 ? void 0 : formItem.addSubFormItem(model);
                model.config({
                    id: id,
                    type: type,
                    required: required,
                    unique: unique,
                    value: value,
                    rules: validations,
                    messages: validationErrors,
                    multiple: multiple,
                    delimiter: delimiter,
                    valueField: valueField,
                    labelField: labelField,
                    joinValues: joinValues,
                    extractValue: extractValue,
                    selectFirst: selectFirst,
                    autoFill: autoFill,
                    clearValueOnHidden: clearValueOnHidden,
                    validateApi: validateApi,
                    minLength: minLength,
                    maxLength: maxLength,
                    validateOnChange: validateOnChange,
                    label: label
                });
                // issue 这个逻辑应该在 combo 里面自己实现。
                if (_this.model.unique &&
                    ((_a = form === null || form === void 0 ? void 0 : form.parentStore) === null || _a === void 0 ? void 0 : _a.storeType) === combo_1.ComboStore.name) {
                    var combo = form.parentStore;
                    combo.bindUniuqueItem(model);
                }
                // 同步 value
                model.changeTmpValue((_b = propValue !== null && propValue !== void 0 ? propValue : store === null || store === void 0 ? void 0 : store.getValueByName(model.name)) !== null && _b !== void 0 ? _b : value);
                // 如果没有初始值，通过 onChange 设置过去
                if (onChange &&
                    typeof propValue === 'undefined' &&
                    typeof (store === null || store === void 0 ? void 0 : store.getValueByName(model.name, false)) === 'undefined' &&
                    // todo 后续再优化这个判断，
                    // 目前 input-table 中默认值会给冲掉，所以加上这个判断
                    // 对应 issue 为 https://github.com/baidu/amis/issues/2674
                    (store === null || store === void 0 ? void 0 : store.storeType) !== table_1.TableStore.name) {
                    onChange(model.tmpValue, model.name, false, true);
                }
                return _this;
            }
            class_1.prototype.componentDidMount = function () {
                var _this = this;
                var _a = this.props, store = _a.store, form = _a.formStore, _b = _a.$schema, name = _b.name, validate = _b.validate, addHook = _a.addHook;
                // 提交前先把之前的 lazyEmit 执行一下。
                this.hook3 = function () {
                    _this.lazyEmitChange.flush();
                };
                addHook === null || addHook === void 0 ? void 0 : addHook(this.hook3, 'flush');
                var formItem = this.model;
                if (formItem && validate) {
                    var finalValidate_1 = (0, helper_1.promisify)(validate.bind(formItem));
                    this.hook2 = function () {
                        formItem.clearError('control:valdiate');
                        return finalValidate_1(_this.props.data, _this.getValue(), name).then(function (ret) {
                            if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                                formItem.addError(ret, 'control:valdiate');
                            }
                        });
                    };
                    addHook === null || addHook === void 0 ? void 0 : addHook(this.hook2);
                }
            };
            class_1.prototype.componentDidUpdate = function (prevProps) {
                var props = this.props;
                var form = props.formStore;
                var model = this.model;
                if (model &&
                    (0, helper_1.anyChanged)([
                        'id',
                        'validations',
                        'validationErrors',
                        'value',
                        'required',
                        'unique',
                        'multiple',
                        'delimiter',
                        'valueField',
                        'labelField',
                        'joinValues',
                        'extractValue',
                        'selectFirst',
                        'autoFill',
                        'clearValueOnHidden',
                        'validateApi',
                        'minLength',
                        'maxLength',
                        'label'
                    ], prevProps.$schema, props.$schema)) {
                    model.config({
                        required: props.$schema.required,
                        id: props.$schema.id,
                        unique: props.$schema.unique,
                        value: props.$schema.value,
                        rules: props.$schema.validations,
                        multiple: props.$schema.multiple,
                        delimiter: props.$schema.delimiter,
                        valueField: props.$schema.valueField,
                        labelField: props.$schema.labelField,
                        joinValues: props.$schema.joinValues,
                        extractValue: props.$schema.extractValue,
                        messages: props.$schema.validationErrors,
                        selectFirst: props.$schema.selectFirst,
                        autoFill: props.$schema.autoFill,
                        clearValueOnHidden: props.$schema.clearValueOnHidden,
                        validateApi: props.$schema.validateApi,
                        minLength: props.$schema.minLength,
                        maxLength: props.$schema.maxLength,
                        label: props.$schema.label
                    });
                }
                if (model && typeof props.value !== 'undefined') {
                    // 自己控制的 value 优先
                    if (props.value !== prevProps.value &&
                        props.value !== model.tmpValue) {
                        model.changeTmpValue(props.value);
                    }
                }
                else if (
                // 然后才是查看关联的 name 属性值是否变化
                model &&
                    props.data !== prevProps.data &&
                    (!model.emitedValue || model.emitedValue === model.tmpValue)) {
                    model.changeEmitedValue(undefined);
                    var value = (0, helper_1.getVariable)(props.data, model.name);
                    var prevValue = (0, helper_1.getVariable)(prevProps.data, model.name);
                    if ((value !== prevValue ||
                        (0, helper_1.getVariable)(props.data, model.name, false) !==
                            (0, helper_1.getVariable)(prevProps.data, model.name, false)) &&
                        value !== model.tmpValue) {
                        model.changeTmpValue(value);
                    }
                }
            };
            class_1.prototype.componentWillUnmount = function () {
                var _a, _b, _c, _d, _e, _f, _g;
                this.hook && ((_b = (_a = this.props).removeHook) === null || _b === void 0 ? void 0 : _b.call(_a, this.hook));
                this.hook2 && ((_d = (_c = this.props).removeHook) === null || _d === void 0 ? void 0 : _d.call(_c, this.hook2));
                this.hook3 && ((_f = (_e = this.props).removeHook) === null || _f === void 0 ? void 0 : _f.call(_e, this.hook3, 'flush'));
                // this.lazyEmitChange.flush();
                this.lazyEmitChange.cancel();
                (_g = this.reaction) === null || _g === void 0 ? void 0 : _g.call(this);
                this.disposeModel();
            };
            class_1.prototype.disposeModel = function () {
                var _a;
                var _b = this.props, form = _b.formStore, formItem = _b.formItem, rootStore = _b.rootStore;
                if (this.model &&
                    this.model.unique &&
                    (form === null || form === void 0 ? void 0 : form.parentStore) &&
                    (form === null || form === void 0 ? void 0 : form.parentStore.storeType) === combo_1.ComboStore.name) {
                    var combo = form.parentStore;
                    combo.unBindUniuqueItem(this.model);
                }
                if (this.model) {
                    formItem &&
                        (0, mobx_state_tree_1.isAlive)(formItem) &&
                        formItem.removeSubFormItem(this.model);
                    this.model.clearValueOnHidden &&
                        ((_a = this.model.form) === null || _a === void 0 ? void 0 : _a.deleteValueByName(this.model.name));
                    (0, mobx_state_tree_1.isAlive)(rootStore) && rootStore.removeStore(this.model);
                }
                delete this.model;
            };
            class_1.prototype.controlRef = function (control) {
                var _this = this;
                var _a = this.props, addHook = _a.addHook, removeHook = _a.removeHook, form = _a.formStore, name = _a.$schema.name;
                // 因为 control 有可能被 n 层 hoc 包裹。
                while (control && control.getWrappedInstance) {
                    control = control.getWrappedInstance();
                }
                if (control && control.validate && this.model) {
                    var formItem_2 = this.model;
                    var validate_1 = (0, helper_1.promisify)(control.validate.bind(control));
                    this.hook = function () {
                        formItem_2.clearError('component:valdiate');
                        return validate_1(_this.props.data, _this.getValue(), name).then(function (ret) {
                            if ((typeof ret === 'string' || Array.isArray(ret)) &&
                                ret) {
                                formItem_2.setError(ret, 'component:valdiate');
                            }
                        });
                    };
                    addHook === null || addHook === void 0 ? void 0 : addHook(this.hook);
                }
                else if (!control && this.hook) {
                    removeHook === null || removeHook === void 0 ? void 0 : removeHook(this.hook);
                    this.hook = undefined;
                }
                // 注册到 Scoped 上
                var originRef = this.control;
                this.control = control;
                var scoped = this.context;
                if (control) {
                    scoped.registerComponent(this.control);
                }
                else if (originRef) {
                    scoped.unRegisterComponent(originRef);
                }
            };
            class_1.prototype.validate = function () {
                return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
                    var _a, form, data, formItemDispatchEvent, result, combo, group, validPromises, validPromises;
                    return (0, tslib_1.__generator)(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = this.props, form = _a.formStore, data = _a.data, formItemDispatchEvent = _a.formItemDispatchEvent;
                                if (!this.model) return [3 /*break*/, 4];
                                if (!(this.model.unique &&
                                    (form === null || form === void 0 ? void 0 : form.parentStore) &&
                                    form.parentStore.storeType === combo_1.ComboStore.name)) return [3 /*break*/, 2];
                                combo = form.parentStore;
                                group = combo.uniques.get(this.model.name);
                                validPromises = group.items.map(function (item) {
                                    return item.validate(data);
                                });
                                return [4 /*yield*/, Promise.all(validPromises)];
                            case 1:
                                result = _b.sent();
                                return [3 /*break*/, 4];
                            case 2:
                                validPromises = form === null || form === void 0 ? void 0 : form.getItemsByName(this.model.name).map(function (item) { return item.validate(data); });
                                if (!(validPromises && validPromises.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, Promise.all(validPromises)];
                            case 3:
                                result = _b.sent();
                                _b.label = 4;
                            case 4:
                                if (result && result.length) {
                                    if (result.indexOf(false) > -1) {
                                        formItemDispatchEvent('formItemValidateError', data);
                                    }
                                    else {
                                        formItemDispatchEvent('formItemValidateSucc', data);
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            class_1.prototype.handleChange = function (value, submitOnChange, changeImmediately) {
                if (submitOnChange === void 0) { submitOnChange = this.props.$schema.submitOnChange; }
                if (changeImmediately === void 0) { changeImmediately = false; }
                var _a = this.props, form = _a.formStore, onChange = _a.onChange, _b = _a.$schema, type = _b.type, pipeOut = _b.pipeOut, conrolChangeImmediately = _b.changeImmediately, formInited = _a.formInited, data = _a.data;
                if (!this.model ||
                    // todo 以后想办法不要強耦合类型。
                    ~[
                        'service',
                        'group',
                        'hbox',
                        'panel',
                        'grid',
                        'input-group'
                    ].indexOf(type)) {
                    onChange && onChange.apply(null, arguments);
                    return;
                }
                if (pipeOut) {
                    var oldValue = this.model.value;
                    value = pipeOut(value, oldValue, data);
                }
                this.model.changeTmpValue(value);
                if (changeImmediately || conrolChangeImmediately || !formInited) {
                    this.emitChange(submitOnChange);
                }
                else {
                    // this.props.onTmpValueChange?.(value, this.model.name);
                    this.lazyEmitChange(submitOnChange);
                }
            };
            class_1.prototype.emitChange = function (submitOnChange) {
                var _a;
                if (submitOnChange === void 0) { submitOnChange = this.props.$schema.submitOnChange; }
                var _b = this.props, form = _b.formStore, onChange = _b.onChange, _c = _b.$schema, name = _c.name, id = _c.id, label = _c.label, type = _c.type, onFormItemChange = _c.onChange, maxLength = _c.maxLength, minLength = _c.minLength, data = _b.data, env = _b.env, validateOnChange = _b.validateOnChange, formSubmited = _b.formSubmited;
                if (!this.model) {
                    return;
                }
                var value = this.model.tmpValue;
                var oldValue = (0, helper_1.getVariable)(data, this.model.name, false);
                if (oldValue === value) {
                    return;
                }
                if (type !== 'input-password') {
                    env === null || env === void 0 ? void 0 : env.tracker({
                        eventType: 'formItemChange',
                        eventData: {
                            id: id,
                            name: name,
                            label: label,
                            type: type,
                            value: value
                        }
                    }, this.props);
                }
                this.model.changeEmitedValue(value);
                if ((onFormItemChange === null || onFormItemChange === void 0 ? void 0 : onFormItemChange(value, oldValue, this.model, form)) === false) {
                    return;
                }
                var validated = this.model.validated;
                onChange === null || onChange === void 0 ? void 0 : onChange(value, name, submitOnChange === true);
                if (
                // 如果配置了 minLength 或者 maxLength 就切成及时验证
                // this.model.rules.minLength ||
                // this.model.rules.maxLength ||
                validateOnChange === true ||
                    (validateOnChange !== false && (formSubmited || validated))) {
                    this.validate();
                }
                else if (validateOnChange === false) {
                    (_a = this.model) === null || _a === void 0 ? void 0 : _a.reset();
                }
            };
            class_1.prototype.handleBlur = function (e) {
                var _a = this.props, onBlur = _a.onBlur, validateOnBlur = _a.$schema.validateOnBlur;
                if (validateOnBlur && this.model) {
                    this.validate();
                }
                onBlur && onBlur(e);
            };
            class_1.prototype.setPrinstineValue = function (value) {
                if (!this.model) {
                    return;
                }
                var _a = this.props, form = _a.formStore, name = _a.name, pipeOut = _a.$schema.pipeOut, onChange = _a.onChange, oldValue = _a.value, data = _a.data;
                if (pipeOut) {
                    value = pipeOut(value, oldValue, data);
                }
                onChange === null || onChange === void 0 ? void 0 : onChange(value, name, false, true);
            };
            class_1.prototype.getValue = function () {
                var _a = this.props, data = _a.formStore, control = _a.$schema;
                var value = this.model ? this.model.tmpValue : control.value;
                if (control.pipeIn) {
                    value = control.pipeIn(value, data);
                }
                return value;
            };
            // 兼容老版本用法，新版本直接用 onChange 就可以。
            class_1.prototype.setValue = function (value, key) {
                var _a;
                var _b = this.props, name = _b.$schema.name, onBulkChange = _b.onBulkChange;
                if (!key || key === name) {
                    this.handleChange(value);
                }
                else {
                    onBulkChange &&
                        onBulkChange((_a = {},
                            _a[key] = value,
                            _a));
                }
            };
            class_1.prototype.render = function () {
                var _a = this.props, controlWidth = _a.controlWidth, disabled = _a.disabled, formMode = _a.formMode, control = _a.$schema, store = _a.store, data = _a.data, invisible = _a.invisible;
                if (invisible) {
                    return null;
                }
                var value = this.getValue();
                var model = this.model;
                var injectedProps = {
                    defaultSize: controlWidth,
                    disabled: disabled || control.disabled,
                    formItem: this.model,
                    formMode: control.mode || formMode,
                    ref: this.controlRef,
                    data: data || (store === null || store === void 0 ? void 0 : store.data),
                    value: value,
                    defaultValue: control.value,
                    formItemValue: value,
                    onChange: this.handleChange,
                    onBlur: this.handleBlur,
                    setValue: this.setValue,
                    getValue: this.getValue,
                    prinstine: model ? model.prinstine : undefined,
                    setPrinstineValue: this.setPrinstineValue
                };
                return (react_1.default.createElement(ComposedComponent, (0, tslib_1.__assign)({}, this.props, injectedProps)));
            };
            return class_1;
        }(react_1.default.Component)),
        _a.contextType = Scoped_1.ScopedContext,
        _a.defaultProps = {},
        _a))), ComposedComponent);
    return result;
}
exports.wrapControl = wrapControl;
//# sourceMappingURL=./renderers/Form/wrapControl.js.map
