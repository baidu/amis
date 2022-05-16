"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulaControlRenderer = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var Item_1 = require("./Item");
var tpl_1 = require("../../utils/tpl");
var helper_1 = require("../../utils/helper");
var FormulaControl = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormulaControl, _super);
    function FormulaControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inited = false;
        return _this;
    }
    FormulaControl.prototype.componentDidMount = function () {
        var _a = this.props, formInited = _a.formInited, initSet = _a.initSet, addHook = _a.addHook;
        this.unHook = addHook ? addHook(this.handleFormInit, 'init') : undefined;
        // 如果在表单中，还是等初始化数据过来才算
        if (formInited === false) {
            return;
        }
        this.inited = true;
        initSet === false || this.initSet();
    };
    FormulaControl.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, formInited = _a.formInited, initSet = _a.initSet, autoSet = _a.autoSet;
        if (this.inited) {
            autoSet === false || this.autoSet(prevProps);
        }
        else if (typeof formInited === 'undefined') {
            this.inited = true;
            initSet === false || this.initSet();
        }
    };
    FormulaControl.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.unHook) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    FormulaControl.prototype.handleFormInit = function (data) {
        this.inited = true;
        var _a = this.props, name = _a.name, initSet = _a.initSet;
        if (initSet === false) {
            return;
        }
        var result = this.initSet();
        if (typeof name === 'string' && typeof result !== 'undefined') {
            (0, helper_1.setVariable)(data, name, result);
        }
    };
    FormulaControl.prototype.initSet = function () {
        var _a = this.props, formula = _a.formula, data = _a.data, setPrinstineValue = _a.setPrinstineValue, initSet = _a.initSet, condition = _a.condition;
        if (!formula) {
            return;
        }
        else if (condition &&
            !~condition.indexOf('$') &&
            !~condition.indexOf('<%') &&
            !(0, tpl_1.evalJS)(condition, data)) {
            return;
        }
        var result = (0, tpl_1.evalJS)(formula, data);
        result !== null && (setPrinstineValue === null || setPrinstineValue === void 0 ? void 0 : setPrinstineValue(result));
        return result;
    };
    FormulaControl.prototype.autoSet = function (prevProps) {
        var props = this.props;
        var formula = prevProps.formula, data = prevProps.data, onChange = prevProps.onChange, value = prevProps.value, condition = prevProps.condition;
        if (formula &&
            props.formula &&
            (0, helper_1.isObjectShallowModified)(data, props.data, false) &&
            value === props.value) {
            var nextResult = (0, tpl_1.evalJS)(props.formula, props.data);
            if (condition && props.condition) {
                if (!!~condition.indexOf('$') || !!~condition.indexOf('<%')) {
                    // 使用${xxx}，来监听某个变量的变化
                    if ((0, tpl_1.filter)(condition, data) !== (0, tpl_1.filter)(props.condition, props.data)) {
                        onChange(nextResult);
                    }
                }
                else if ((0, tpl_1.evalJS)(props.condition, props.data)) {
                    // 使用 data.xxx == 'a' 表达式形式来判断
                    onChange(nextResult);
                }
            }
            else {
                var prevResult = (0, tpl_1.evalJS)(formula, data);
                if (JSON.stringify(prevResult) !== JSON.stringify(nextResult)) {
                    onChange(nextResult !== null && nextResult !== void 0 ? nextResult : '');
                }
            }
        }
    };
    FormulaControl.prototype.doAction = function () {
        // 不细化具体是啥动作了，先重新计算，并把值运用上。
        var _a = this.props, formula = _a.formula, data = _a.data, onChange = _a.onChange, autoSet = _a.autoSet, value = _a.value;
        var result = (0, tpl_1.evalJS)(formula, data);
        onChange(result);
    };
    FormulaControl.prototype.render = function () {
        return null;
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], FormulaControl.prototype, "handleFormInit", null);
    return FormulaControl;
}(react_1.default.Component));
exports.default = FormulaControl;
var FormulaControlRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(FormulaControlRenderer, _super);
    function FormulaControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormulaControlRenderer = (0, tslib_1.__decorate)([
        (0, Item_1.FormItem)({
            type: 'formula',
            wrap: false,
            strictMode: false,
            sizeMutable: false
        })
    ], FormulaControlRenderer);
    return FormulaControlRenderer;
}(FormulaControl));
exports.FormulaControlRenderer = FormulaControlRenderer;
//# sourceMappingURL=./renderers/Form/Formula.js.map
