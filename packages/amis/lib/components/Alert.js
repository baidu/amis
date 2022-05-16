"use strict";
/**
 * @file Alert
 * @author fex
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinnalAlert = exports.prompt = exports.confirm = exports.alert = exports.setRenderSchemaFn = exports.Alert = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var react_dom_1 = require("react-dom");
var Modal_1 = (0, tslib_1.__importDefault)(require("./Modal"));
var Button_1 = (0, tslib_1.__importDefault)(require("./Button"));
var theme_1 = require("../theme");
var locale_1 = require("../locale");
var Html_1 = (0, tslib_1.__importDefault)(require("./Html"));
var Alert = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Alert, _super);
    function Alert(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            show: false,
            title: '',
            content: '',
            confirm: false
        };
        _this.close = _this.close.bind(_this);
        _this.handleConfirm = _this.handleConfirm.bind(_this);
        _this.handleCancel = _this.handleCancel.bind(_this);
        _this.modalRef = _this.modalRef.bind(_this);
        _this.handleFormSubmit = _this.handleFormSubmit.bind(_this);
        _this.scopeRef = _this.scopeRef.bind(_this);
        Alert.instance = _this;
        return _this;
    }
    Alert.getInstance = function () {
        if (!Alert.instance) {
            console.warn('Alert 组件应该没有被渲染，所以隐性的渲染到 body 了');
            var container = document.body;
            var div = document.createElement('div');
            container.appendChild(div);
            (0, react_dom_1.render)(react_1.default.createElement(exports.FinnalAlert, null), div);
        }
        return Alert.instance;
    };
    Alert.prototype.componentDidMount = function () {
        this._body && (this._body.innerHTML = this.state.content);
    };
    Alert.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevState.content !== this.state.content) {
            this._body && (this._body.innerHTML = this.state.content);
        }
    };
    Alert.prototype.componentWillUnmount = function () {
        Alert.instance = null;
    };
    Alert.prototype.scopeRef = function (schemaSope) {
        this.schemaSope = schemaSope;
    };
    Alert.prototype.handleConfirm = function () {
        var _a;
        var form = (_a = this.schemaSope) === null || _a === void 0 ? void 0 : _a.getComponentByName('form');
        if (form) {
            form.doAction({ type: 'submit' });
        }
        else {
            this.close(true);
        }
    };
    Alert.prototype.handleCancel = function () {
        this.close(false);
    };
    Alert.prototype.close = function (confirmed) {
        var _this = this;
        var isConfirm = this.state.confirm || this.state.prompt;
        this.setState({
            show: false,
            prompt: false,
            confirm: false
        }, isConfirm ? function () { return _this._resolve(confirmed); } /*this._reject()*/ : undefined);
    };
    Alert.prototype.alert = function (content, title) {
        this.setState({
            title: title,
            content: content,
            show: true,
            confirm: false
        });
    };
    Alert.prototype.confirm = function (content, title, confirmText) {
        var _this = this;
        this.setState({
            title: title,
            content: content,
            show: true,
            confirm: true,
            confirmText: confirmText
        });
        return new Promise(function (resolve) {
            _this._resolve = resolve;
        });
    };
    Alert.prototype.prompt = function (controls, defaultValue, title, confirmText) {
        var _this = this;
        if (title === void 0) { title = 'placeholder.enter'; }
        if (confirmText === void 0) { confirmText = 'confirm'; }
        if (typeof controls === 'string') {
            // 兼容浏览器标准用法。
            controls = [
                {
                    name: 'text',
                    label: controls,
                    type: 'text'
                }
            ];
            if (typeof defaultValue === 'string') {
                defaultValue = {
                    text: defaultValue
                };
            }
        }
        else if (!Array.isArray(controls)) {
            controls = [controls];
        }
        this.setState({
            title: title,
            controls: controls,
            show: true,
            prompt: true,
            value: defaultValue,
            confirmText: confirmText
        });
        return new Promise(function (resolve) {
            _this._resolve = resolve;
        });
    };
    Alert.prototype.modalRef = function (ref) {
        this._modal = ref;
    };
    Alert.prototype.handleFormSubmit = function (values) {
        this.close(values);
    };
    Alert.prototype.render = function () {
        var _a, _b;
        var _c = this.props, container = _c.container, cancelText = _c.cancelText, confirmText = _c.confirmText, title = _c.title, confirmBtnLevel = _c.confirmBtnLevel, alertBtnLevel = _c.alertBtnLevel, cx = _c.classnames;
        var theme = this.props.theme || 'cxd';
        if (theme === 'default') {
            theme = 'cxd';
        }
        var __ = this.props.translate;
        var finalTitle = __((_a = this.state.title) !== null && _a !== void 0 ? _a : title);
        var finalConfirmText = __((_b = this.state.confirmText) !== null && _b !== void 0 ? _b : confirmText);
        return (react_1.default.createElement(Modal_1.default, { show: this.state.show, onHide: this.handleCancel, container: container, ref: this.modalRef, closeOnEsc: true },
            finalTitle ? (react_1.default.createElement("div", { className: cx('Modal-header') },
                react_1.default.createElement("div", { className: cx('Modal-title') }, finalTitle))) : null,
            react_1.default.createElement("div", { className: cx('Modal-body') }, this.state.prompt ? (renderForm(this.state.controls, this.state.value, this.handleFormSubmit, this.scopeRef, theme)) : (react_1.default.createElement(Html_1.default, { html: this.state.content }))),
            finalConfirmText ? (react_1.default.createElement("div", { className: cx('Modal-footer') },
                this.state.confirm || this.state.prompt ? (react_1.default.createElement(Button_1.default, { onClick: this.handleCancel }, __(cancelText))) : null,
                react_1.default.createElement(Button_1.default, { level: this.state.confirm || this.state.prompt
                        ? confirmBtnLevel
                        : alertBtnLevel, onClick: this.handleConfirm }, finalConfirmText))) : null));
    };
    Alert.instance = null;
    Alert.defaultProps = {
        confirmText: 'confirm',
        cancelText: 'cancel',
        title: 'Alert.info',
        alertBtnLevel: 'primary',
        confirmBtnLevel: 'danger'
    };
    return Alert;
}(react_1.default.Component));
exports.Alert = Alert;
var renderSchemaFn;
function setRenderSchemaFn(fn) {
    renderSchemaFn = fn;
}
exports.setRenderSchemaFn = setRenderSchemaFn;
function renderForm(controls, value, callback, scopeRef, theme) {
    if (value === void 0) { value = {}; }
    return renderSchemaFn === null || renderSchemaFn === void 0 ? void 0 : renderSchemaFn(controls, value, callback, scopeRef, theme);
}
var alert = function (content, title) { return Alert.getInstance().alert(content, title); };
exports.alert = alert;
var confirm = function (content, title, confirmText) {
    return Alert.getInstance().confirm(content, title, confirmText);
};
exports.confirm = confirm;
var prompt = function (controls, defaultvalue, title, confirmText) {
    return Alert.getInstance().prompt(controls, defaultvalue, title, confirmText);
};
exports.prompt = prompt;
exports.FinnalAlert = (0, theme_1.themeable)((0, locale_1.localeable)(Alert));
exports.default = exports.FinnalAlert;
//# sourceMappingURL=./components/Alert.js.map
