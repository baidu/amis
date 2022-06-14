/**
 * @file 表达式控件
 */
import { __assign, __awaiter, __decorate, __extends, __generator, __metadata, __rest, __spreadArray } from "tslib";
import React from 'react';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import { FormItem, Button, InputBox, Icon, render, ResultBox } from 'amis';
import { FormulaExec, isExpression } from 'amis';
import { PickerContainer } from 'amis';
import { FormulaEditor } from 'amis-ui/lib/components/formula/Editor';
import { autobind } from 'amis-editor-core';
var FormulaControl = /** @class */ (function (_super) {
    __extends(FormulaControl, _super);
    function FormulaControl(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSimpleInputChange = debounce(function (value) {
            var _a, _b;
            (_b = (_a = _this.props) === null || _a === void 0 ? void 0 : _a.onChange) === null || _b === void 0 ? void 0 : _b.call(_a, _this.replaceExpression(value));
        }, 250, {
            trailing: true,
            leading: false
        });
        _this.handleInputChange = function (value) {
            var _a, _b;
            (_b = (_a = _this.props) === null || _a === void 0 ? void 0 : _a.onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        };
        _this.state = {
            variables: _this.normalizeVariables(props.variables),
            variableMode: 'tabs',
            evalMode: false
        };
        return _this;
    }
    FormulaControl.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        // 优先使用props中的变量数据
        if (!this.props.variables) {
            // 从amis数据域中取变量数据
            this.resolveVariablesFromScope().then(function (variables) {
                if (!_this.isUnmount && !isEqual(variables, _this.state.variables)) {
                    _this.setState({
                        variables: variables
                    });
                }
            });
        }
    };
    FormulaControl.prototype.componentWillUnmount = function () {
        this.isUnmount = true;
    };
    // 组件默认值设置交互中未使用
    FormulaControl.prototype.normalizeVariables = function (variables) {
        var _a, _b, _c;
        if (!variables) {
            return [];
        }
        var _d = this.props, context = _d.context, evalMode = _d.evalMode;
        // 自身字段
        var field = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.name;
        var ancestorField = (_c = context === null || context === void 0 ? void 0 : context.node) === null || _c === void 0 ? void 0 : _c.ancestorField;
        return uniqBy(__spreadArray(__spreadArray(__spreadArray([], (Array.isArray(variables) ? variables : []), true), (ancestorField
            ? ancestorField.map(function (item) { return ({
                label: item,
                value: evalMode ? "this.".concat(item) : item
            }); })
            : []), true), (field ? [{ label: field, value: "this.".concat(field) }] : []), true), 'value');
    };
    /**
     * 将 ${xx}（非 \${xx}）替换成 \${xx}
     * 备注: 手动编辑时，自动处理掉 ${xx}，避免识别成 公式表达式
     */
    FormulaControl.prototype.replaceExpression = function (expression) {
        if (expression && isString(expression) && isExpression(expression)) {
            return expression.replace(/(^|[^\\])\$\{/g, '\\${');
        }
        return expression;
    };
    // 根据 name 值 判断当前表达式是否 存在循环引用问题
    FormulaControl.prototype.isLoopExpression = function (expression, selfName) {
        if (!expression || !selfName || !isString(expression)) {
            return false;
        }
        var variables = FormulaExec.collect(expression);
        return variables.some(function (variable) { return variable === selfName; });
    };
    // 判断是否是期望类型
    FormulaControl.prototype.isExpectType = function (value) {
        if (value === null || value === undefined) {
            return true; // 数值为空不进行类型识别
        }
        var expectType = this.props.valueType;
        if (expectType === null || expectType === undefined) {
            return true; // expectType为空，则不进行类型识别
        }
        // 当前数据域
        var curData = this.getContextData();
        if ((expectType === 'number' && isNumber(value)) ||
            (expectType === 'boolean' && isBoolean(value)) ||
            (expectType === 'object' && isPlainObject(value)) ||
            (expectType === 'array' && isArray(value))) {
            return true;
        }
        else if (isString(value)) {
            if (isExpression(value)) {
                // 根据公式运算结果判断类型
                var formulaValue = FormulaExec.formula(value, curData);
                if ((expectType === 'number' && isNumber(formulaValue)) ||
                    (expectType === 'boolean' && isBoolean(formulaValue)) ||
                    (expectType === 'object' && isPlainObject(formulaValue)) ||
                    (expectType === 'array' && isArray(formulaValue)) ||
                    (expectType === 'string' && isString(formulaValue))) {
                    return true;
                }
            }
            else if (expectType === 'string') {
                // 非公式字符串
                return true;
            }
        }
        return false;
    };
    FormulaControl.prototype.resolveVariablesFromScope = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, node, manager, dataPropsAsOptions;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = this.props, node = _b.node, manager = _b.manager;
                        return [4 /*yield*/, (manager === null || manager === void 0 ? void 0 : manager.getContextSchemas(node))];
                    case 1:
                        _c.sent();
                        dataPropsAsOptions = (_a = manager === null || manager === void 0 ? void 0 : manager.dataSchema) === null || _a === void 0 ? void 0 : _a.getDataPropsAsOptions();
                        return [2 /*return*/, dataPropsAsOptions || []];
                }
            });
        });
    };
    FormulaControl.prototype.handleConfirm = function (value) {
        var _a, _b;
        (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.onChange) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    // 剔除掉一些用不上的属性
    FormulaControl.prototype.filterCustomRendererProps = function (rendererSchema) {
        var data = this.props.data;
        var curRendererSchema = null;
        if (rendererSchema) {
            curRendererSchema = Object.assign({}, rendererSchema, data, {
                type: rendererSchema.type
            });
            if (curRendererSchema.label) {
                delete curRendererSchema.label;
            }
            if (curRendererSchema.id) {
                delete curRendererSchema.id;
            }
            if (curRendererSchema.$$id) {
                delete curRendererSchema.$$id;
            }
            if (this.props.needDeleteValue) {
                delete curRendererSchema.value;
            }
            // 避免不能编辑
            curRendererSchema.readOnly = false;
            // 避免没有清空icon
            curRendererSchema.clearable = true;
        }
        return curRendererSchema;
    };
    FormulaControl.prototype.renderFormulaValue = function (item) {
        var html = { __html: item.html };
        {
            /* bca-disable-next-line */
        }
        return React.createElement("span", { dangerouslySetInnerHTML: html });
    };
    FormulaControl.prototype.getContextData = function () {
        var _a, _b, _c, _d;
        // 当前数据域
        return (((_c = (_b = (_a = this.props.data) === null || _a === void 0 ? void 0 : _a.__super) === null || _b === void 0 ? void 0 : _b.__props__) === null || _c === void 0 ? void 0 : _c.data) ||
            ((_d = this.props.manager) === null || _d === void 0 ? void 0 : _d.amisStore) ||
            {});
    };
    FormulaControl.prototype.render = function () {
        var _this = this;
        var _a, _b;
        var _c = this.props, className = _c.className, label = _c.label, value = _c.value, header = _c.header, variables = _c.variables, placeholder = _c.placeholder, simple = _c.simple, evalMode = _c.evalMode, rendererSchema = _c.rendererSchema, rendererWrapper = _c.rendererWrapper, manager = _c.manager, rest = __rest(_c, ["className", "label", "value", "header", "variables", "placeholder", "simple", "evalMode", "rendererSchema", "rendererWrapper", "manager"]);
        var labelText = typeof label === 'string' ? label : '';
        // 自身字段
        var selfName = (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.name;
        // 判断是否含有公式表达式
        var isExpr = isExpression(value);
        // 判断当前是否有循环引用，备注：非精准识别，待优化
        var isLoop = false;
        if (isExpr && (rendererSchema === null || rendererSchema === void 0 ? void 0 : rendererSchema.name)) {
            isLoop = (rendererSchema === null || rendererSchema === void 0 ? void 0 : rendererSchema.name)
                ? this.isLoopExpression(value, rendererSchema === null || rendererSchema === void 0 ? void 0 : rendererSchema.name)
                : false;
        }
        // 判断是否含有公式表达式
        var isTypeError = !this.isExpectType(value);
        var isError = isLoop || isTypeError;
        var highlightValue = isExpression(value)
            ? FormulaEditor.highlightValue(value, this.state.variables, evalMode !== null && evalMode !== void 0 ? evalMode : this.state.evalMode)
            : value;
        return (React.createElement("div", { className: cx('ae-editor-FormulaControl', isError ? 'is-has-tooltip' : '', className) },
            !simple && !rendererSchema && !isExpr && (React.createElement(InputBox, { className: "ae-editor-FormulaControl-input", value: value, clearable: true, placeholder: placeholder, onChange: this.handleSimpleInputChange })),
            !simple && rendererSchema && !isExpr && (React.createElement("div", { className: cx('ae-editor-FormulaControl-custom-renderer', rendererWrapper ? 'border-wrapper' : '') }, render(this.filterCustomRendererProps(rendererSchema), {
                onChange: this.handleSimpleInputChange,
                manager: manager
            }, __assign({}, ((manager === null || manager === void 0 ? void 0 : manager.env) || {}))))),
            !simple && isExpr && (React.createElement(ResultBox, { className: cx('ae-editor-FormulaControl-ResultBox', isError ? 'is-error' : ''), allowInput: false, clearable: true, value: value, result: highlightValue, itemRender: this.renderFormulaValue, onChange: this.handleInputChange, onResultChange: function () {
                    _this.handleInputChange(undefined);
                } })),
            React.createElement(PickerContainer, { showTitle: false, bodyRender: function (_a) {
                    var _b;
                    var onClose = _a.onClose, value = _a.value, onChange = _a.onChange;
                    return (React.createElement(FormulaEditor, __assign({}, rest, { evalMode: evalMode !== null && evalMode !== void 0 ? evalMode : _this.state.evalMode, variableMode: (_b = rest.variableMode) !== null && _b !== void 0 ? _b : _this.state.variableMode, variables: _this.state.variables, header: header || labelText, value: isString(value) ? value : undefined, onChange: onChange, selfVariableName: selfName })));
                }, value: value, onConfirm: this.handleConfirm, size: "md" }, function (_a) {
                var _b;
                var onClick = _a.onClick, isOpened = _a.isOpened;
                return (React.createElement(Button, { size: "sm", tooltip: '点击配置表达式', tooltipPlacement: "left", onClick: onClick },
                    React.createElement(Icon, { icon: "function", className: cx('ae-editor-FormulaControl-icon', 'icon', (_b = {},
                            _b['is-filled'] = !!value,
                            _b)) })));
            }),
            isExpr && !isError && (React.createElement("div", { className: "desc-msg info-msg", title: value }, value)),
            isError && (React.createElement("div", { className: "desc-msg error-msg" }, isLoop ? '当前表达式异常（存在循环引用）' : '数值类型不匹配'))));
    };
    FormulaControl.defaultProps = {
        simple: false
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], FormulaControl.prototype, "replaceExpression", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, String]),
        __metadata("design:returntype", Boolean)
    ], FormulaControl.prototype, "isLoopExpression", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Boolean)
    ], FormulaControl.prototype, "isExpectType", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormulaControl.prototype, "handleConfirm", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormulaControl.prototype, "filterCustomRendererProps", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], FormulaControl.prototype, "renderFormulaValue", null);
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], FormulaControl.prototype, "getContextData", null);
    return FormulaControl;
}(React.Component));
export default FormulaControl;
var FormulaControlRenderer = /** @class */ (function (_super) {
    __extends(FormulaControlRenderer, _super);
    function FormulaControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FormulaControlRenderer = __decorate([
        FormItem({
            type: 'ae-formulaControl'
        })
    ], FormulaControlRenderer);
    return FormulaControlRenderer;
}(FormulaControl));
export { FormulaControlRenderer };
