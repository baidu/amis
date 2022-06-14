import { __assign, __decorate, __extends, __metadata, __spreadArray } from "tslib";
/**
 * @file 时间选择器的快捷键
 */
import React from 'react';
import cx from 'classnames';
import Sortable from 'sortablejs';
import { findDOMNode } from 'react-dom';
import { render as amisRender, FormItem, Button, Icon, InputBox } from 'amis';
import { autobind } from 'amis-editor-core';
import FormulaControl from './FormulaControl';
var CustomType = 'custom';
var klass = 'ae-DateShortCutControl';
var DateShortCutControl = /** @class */ (function (_super) {
    __extends(DateShortCutControl, _super);
    function DateShortCutControl(props) {
        var _this = _super.call(this, props) || this;
        var dropDownOption = props.dropDownOption, data = props.data;
        _this.dropDownOptionArr = Object.keys(dropDownOption).map(function (key) { return ({
            label: dropDownOption[key],
            value: key
        }); });
        _this.initOptions(data.ranges);
        return _this;
    }
    DateShortCutControl.prototype.initOptions = function (ranges) {
        if (!ranges) {
            // 这里先写固定，如果amis的dateTimeRange组件暴露对应属性，从中获取更合适，到时需要让其暴露下
            ranges = [
                'yesterday',
                '7daysago',
                'prevweek',
                'thismonth',
                'prevmonth',
                'prevquarter'
            ];
        }
        var dropDownOption = this.props.dropDownOption;
        var options = [];
        if (Array.isArray(ranges)) {
            ranges.map(function (item) {
                if (typeof item === 'string' && dropDownOption.hasOwnProperty(item)) {
                    options.push({
                        label: dropDownOption[item],
                        type: item,
                        inputValue: item
                    });
                }
                if (typeof item === 'object') {
                    options.push({
                        label: item === null || item === void 0 ? void 0 : item.label,
                        type: CustomType,
                        inputValue: item.range
                    });
                }
            });
        }
        this.state = { options: options };
    };
    /**
     * 添加
     */
    DateShortCutControl.prototype.addItem = function (item) {
        var _this = this;
        var options = this.state.options;
        this.setState({
            options: __spreadArray(__spreadArray([], options, true), [
                __assign(__assign({}, item), { inputValue: item.value === CustomType ? '' : item.value, type: item.value })
            ], false)
        }, function () {
            _this.onChangeOptions();
            _this.scrollToBottom();
        });
    };
    DateShortCutControl.prototype.dragRef = function (ref) {
        if (!this.drag && ref) {
            this.initDragging();
        }
        else if (this.drag && !ref) {
            this.destroyDragging();
        }
        this.drag = ref;
    };
    /*
     * 滚动到底部
     */
    DateShortCutControl.prototype.scrollToBottom = function () {
        var _a, _b;
        this.drag &&
            ((_b = (_a = this.drag) === null || _a === void 0 ? void 0 : _a.lastElementChild) === null || _b === void 0 ? void 0 : _b.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            }));
    };
    /**
     * 初始化拖动
     */
    DateShortCutControl.prototype.initDragging = function () {
        var _this = this;
        var dom = findDOMNode(this);
        this.sortable = new Sortable(dom.querySelector(".".concat(klass, "-content")), {
            group: 'OptionControlGroup',
            animation: 150,
            handle: ".".concat(klass, "Item-dragBar"),
            ghostClass: "".concat(klass, "Item-dragging"),
            onEnd: function (e) {
                // 没有移动
                if (e.newIndex === e.oldIndex) {
                    return;
                }
                // 换回来
                var parent = e.to;
                if (e.newIndex < e.oldIndex &&
                    e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex + 1]);
                }
                else if (e.oldIndex < parent.childNodes.length - 1) {
                    parent.insertBefore(e.item, parent.childNodes[e.oldIndex]);
                }
                else {
                    parent.appendChild(e.item);
                }
                var options = _this.state.options.concat();
                options[e.oldIndex] = options.splice(e.newIndex, 1, options[e.oldIndex])[0];
                _this.setState({ options: options }, function () { return _this.onChangeOptions(); });
            }
        });
    };
    /**
     * 拖动的销毁
     */
    DateShortCutControl.prototype.destroyDragging = function () {
        this.sortable && this.sortable.destroy();
    };
    /**
     * 生成内容体
     */
    DateShortCutControl.prototype.renderContent = function () {
        var _this = this;
        var options = this.state.options;
        return (React.createElement("div", { className: klass + '-wrapper' }, options && options.length ? (React.createElement("ul", { className: klass + '-content', ref: this.dragRef }, options.map(function (option, index) { return _this.renderOption(option, index); }))) : (React.createElement("div", { className: "ae-OptionControl-placeholder" }, "\u672A\u914D\u7F6E"))));
    };
    /**
     * 生成选项
     */
    DateShortCutControl.prototype.renderOption = function (option, index) {
        var _this = this;
        return (React.createElement("li", { className: klass + 'Item', key: index },
            React.createElement("a", { className: klass + 'Item-dragBar' },
                React.createElement(Icon, { icon: "drag-bar", className: "icon" })),
            React.createElement(InputBox, { className: klass + 'Item-input', clearable: false, placeholder: "\u540D\u79F0", value: option.label, onInput: function (e) {
                    return _this.onInputChange(index, e.target.value, 'label');
                } }),
            React.createElement(FormulaControl, __assign({}, this.props, { simple: true, variables: [], functions: [], header: '', onChange: function (value) {
                    return _this.onInputChange(index, value, 'inputValue');
                }, value: option.inputValue })),
            React.createElement(Button, { className: klass + 'Item-action', level: "link", size: "md", onClick: function (e) { return _this.handleDelete(index, e); } },
                React.createElement(Icon, { icon: "delete-btn", className: "icon" }))));
    };
    /**
     * 输入框的改变
     */
    DateShortCutControl.prototype.onInputChange = function (index, value, key) {
        var _this = this;
        var options = this.state.options.concat();
        options[index][key] = value;
        options[index].type = CustomType;
        this.setState({ options: options }, function () { return _this.onChangeOptions(); });
    };
    /**
     * 删除选项
     */
    DateShortCutControl.prototype.handleDelete = function (index, e) {
        var _this = this;
        var options = this.state.options.concat();
        options.splice(index, 1);
        this.setState({ options: options }, function () { return _this.onChangeOptions(); });
    };
    /**
     * 更新options字段的统一出口
     */
    DateShortCutControl.prototype.onChangeOptions = function () {
        var options = this.state.options;
        var onBulkChange = this.props.onBulkChange;
        var newOptions = [];
        options.forEach(function (item) {
            if (item.type !== CustomType) {
                newOptions.push(item.inputValue);
            }
            else {
                newOptions.push({
                    label: item.label,
                    range: item.inputValue
                });
            }
        });
        onBulkChange && onBulkChange({ ranges: newOptions });
    };
    DateShortCutControl.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, label = _a.label;
        var optionList = this.dropDownOptionArr.map(function (item) { return (__assign(__assign({}, item), { type: 'button', onAction: function (e, action) { return _this.addItem(item); } })); });
        return (React.createElement("div", { className: cx(klass, className) },
            React.createElement("header", { className: klass + '-header' },
                React.createElement("label", null, label)),
            this.renderContent(),
            React.createElement("div", { className: klass + '-footer' }, amisRender({
                type: 'dropdown-button',
                label: '添加选项',
                closeOnClick: true,
                closeOnOutside: true,
                buttons: optionList
            }))));
    };
    DateShortCutControl.defaultProps = {
        label: '快捷键'
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], DateShortCutControl.prototype, "dragRef", null);
    return DateShortCutControl;
}(React.PureComponent));
export { DateShortCutControl };
var DateShortCutControlRender = /** @class */ (function (_super) {
    __extends(DateShortCutControlRender, _super);
    function DateShortCutControlRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DateShortCutControlRender = __decorate([
        FormItem({
            type: klass,
            renderLabel: false
        })
    ], DateShortCutControlRender);
    return DateShortCutControlRender;
}(DateShortCutControl));
export { DateShortCutControlRender };
