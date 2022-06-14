/**
 * @file Background.ts
 * @description 背景设置
 */
import { __assign, __awaiter, __decorate, __extends, __generator } from "tslib";
import axios from 'axios';
import cx from 'classnames';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import React, { useState, useEffect } from 'react';
import { render as amisRender, FormItem } from 'amis';
import { getSchemaTpl } from 'amis-editor-core';
var Background = function (props) {
    var _a, _b, _c;
    var _d = useState(0), tabIndex = _d[0], setTabIndex = _d[1];
    var noImage = props.noImage;
    var tabList = noImage
        ? ['pure', 'gradient', 'noset']
        : ['pure', 'gradient', 'image', 'noset'];
    function onChange(key) {
        return function (e) {
            var _a;
            var _b, _c, _d;
            var eventValue = e !== null && typeof e === 'object'
                ? typeof e.target === 'object'
                    ? e.target.value
                    : e.value
                : e;
            var value = props.value, onChange = props.onChange;
            var result = __assign(__assign({}, value), (_a = {}, _a[key] = eventValue, _a));
            // 透明度
            if (key === 'alpha') {
                result.backgroundColor = (_b = result.backgroundColor) === null || _b === void 0 ? void 0 : _b.replace(/,\s(1|0){1}.?[0-9]*\)$/g, ", ".concat(e / 100, ")"));
            }
            // 位置
            if (key === 'backgroundPosition') {
                result.backgroundPosition = e.target.getAttribute('data-pos');
            }
            // 背景大小级平铺模式
            if (key === 'backgroundSize') {
                var bsValue = eventValue !== null && eventValue !== void 0 ? eventValue : '';
                var bsArr = bsValue.split(' ');
                // 0位size 1位平铺方式
                if (bsArr.length > 1) {
                    result.backgroundSize = bsArr[0];
                    result.backgroundRepeat = bsArr[1];
                }
                else {
                    result.backgroundSize = bsValue;
                    result.backgroundRepeat = 'no-repeat';
                }
            }
            // 渐变色角度
            if (key === 'angle') {
                var backgroundImage = (_c = result.backgroundImage) !== null && _c !== void 0 ? _c : '';
                var lineraGradient = backgroundImage.indexOf('linear-gradient') !== -1
                    ? backgroundImage
                    : 'linear-gradient(180deg, transparent, transparent)';
                result.backgroundImage = lineraGradient.replace(/linear-gradient\(\d{1,3}/g, "linear-gradient(".concat(eventValue));
            }
            // 渐变色
            if (key === 'gradientPrev' || key === 'gradientNext') {
                var backgroundImage = (_d = result.backgroundImage) !== null && _d !== void 0 ? _d : '';
                var lineraGradient = backgroundImage.indexOf('linear-gradient') !== -1
                    ? backgroundImage
                    : 'linear-gradient(180deg, transparent, transparent)';
                var tempArr = lineraGradient.split(', ');
                var len = tempArr.length;
                // 前景色
                if (key === 'gradientPrev') {
                    if (len === 3) {
                        tempArr[1] = eventValue;
                    }
                    else if (len === 5 || len === 6) {
                        var startPos = 0;
                        var endPos = 0;
                        for (var i = 0; i < len; i++) {
                            if (tempArr[i].indexOf('rgb') !== -1) {
                                startPos = i;
                            }
                            if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                                endPos = i;
                            }
                        }
                        // 后景色是rgb或rgba
                        if (endPos === len - 1) {
                            tempArr.splice(1, 1, eventValue);
                        }
                        else {
                            tempArr.splice(startPos, endPos + 1, eventValue);
                        }
                    }
                    else if (len >= 7) {
                        // 前景色和后景色都是rgb
                        for (var i = 0; i < len; i++) {
                            var pos = tempArr[i].indexOf(')');
                            if (pos !== -1) {
                                tempArr.splice(1, i, eventValue);
                                break;
                            }
                        }
                    }
                }
                // 后景色
                if (key === 'gradientNext') {
                    if (len === 3) {
                        tempArr[2] = eventValue + ')';
                    }
                    else if (len === 5 || len === 6) {
                        var startPos = 0;
                        var endPos = 0;
                        for (var i = 0; i < len; i++) {
                            if (tempArr[i].indexOf('rgb') !== -1) {
                                startPos = i;
                            }
                            if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                                endPos = i;
                            }
                        }
                        // 后景色是rgb或rgba
                        if (endPos === len - 1) {
                            tempArr.splice(startPos, endPos + 1, eventValue + ')');
                        }
                        else {
                            tempArr.splice(-1, 1, eventValue + ')');
                        }
                    }
                    else if (len >= 7) {
                        // 前景色和后景色都是rgb
                        var flag = 0;
                        for (var i = 0; i < len; i++) {
                            var pos = tempArr[i].indexOf('rgb');
                            if (pos !== -1) {
                                flag++;
                                if (flag === 2) {
                                    tempArr.splice(i, len - i + 1, eventValue);
                                    break;
                                }
                            }
                        }
                    }
                }
                result.backgroundImage = tempArr.join(', ');
                result = pick(result, 'backgroundImage');
            }
            // 删除无用属性
            if (key === 'alpha' || key === 'backgroundColor') {
                result = pick(result, 'backgroundColor');
            }
            if (key === 'backgroundImage' ||
                key === 'backgroundPosition' ||
                key === 'backgroundSize') {
                if (/linear-gradient/g.test(result === null || result === void 0 ? void 0 : result.backgroundImage)) {
                    result = pick(result, 'backgroundPosition', 'backgroundSize', 'backgroundRepeat');
                }
                else {
                    result = pick(result, 'backgroundImage', 'backgroundPosition', 'backgroundSize', 'backgroundRepeat');
                }
            }
            onChange(__assign(__assign({}, omit(value, [
                'backgroundColor',
                'backgroundImage',
                'backgroundPosition',
                'backgroundSize',
                'backgroundRepeat',
                'angle',
                'gradientNext',
                'gradientPrev'
            ])), result));
        };
    }
    // 获取渐变颜色
    function getGradient(type) {
        var _a;
        var linearGradient = (_a = props.value) === null || _a === void 0 ? void 0 : _a.backgroundImage;
        var prevColor = '';
        var nextColor = '';
        if (/linear-gradient/g.test(linearGradient)) {
            var tempArr = linearGradient.split(', ');
            var len = tempArr.length;
            if (len === 3) {
                // 非rgb颜色
                prevColor = tempArr[1];
                nextColor = tempArr[2].slice(0, -1);
            }
            else if (len === 5 || len === 6) {
                // rgb或rgba颜色
                var startPos = 0;
                var endPos = 0;
                for (var i = 0; i < len; i++) {
                    if (tempArr[i].indexOf('rgb') !== -1) {
                        startPos = i;
                    }
                    if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                        endPos = i;
                        if (i !== len - 1) {
                            prevColor = tempArr.slice(startPos, i + 1).join(', ');
                            nextColor = tempArr
                                .slice(i + 1)
                                .join('')
                                .slice(0, -1);
                        }
                        else {
                            prevColor = tempArr.slice(1, startPos).join('');
                            nextColor = tempArr.slice(startPos, len - 1).join(', ');
                        }
                    }
                }
            }
            else if (len >= 7) {
                // 前景色和后景色都是rgb或rgba
                var prevStartPos = 0;
                var prevEndPos = 0;
                var nextStartPos = 0;
                var nextEndPos = 0;
                for (var i = 0; i < len; i++) {
                    if (tempArr[i].indexOf('rgb') !== -1) {
                        if (prevStartPos === 0) {
                            prevStartPos = i;
                        }
                        else if (nextStartPos === 0) {
                            nextStartPos = i;
                        }
                    }
                    if (tempArr[i].indexOf(')') !== -1) {
                        if (prevEndPos === 0) {
                            prevEndPos = i;
                        }
                        else if (nextEndPos === 0) {
                            nextEndPos = i;
                        }
                    }
                }
                prevColor = tempArr.slice(prevStartPos, prevEndPos + 1).join(', ');
                nextColor = tempArr.slice(nextStartPos, nextEndPos).join(', ');
            }
            linearGradient.split('');
        }
        var returnColor = type === 'prev' ? prevColor : nextColor;
        if (returnColor === 'transparent') {
            return '';
        }
        return returnColor;
    }
    // 获取渐变角度
    function getGradientAngle() {
        var _a;
        var linearGradient = (_a = props.value) === null || _a === void 0 ? void 0 : _a.backgroundImage;
        var angle = 180;
        var match = /linear-gradient\((\d{1,3})/.exec(String(linearGradient || ''));
        if (match) {
            angle = +match[1];
        }
        return +angle;
    }
    // 背景颜色透明度
    function getAlpha(rgba) {
        var val = rgba.match(/(\d(\.\d+)?)+/g);
        return val ? val[3] * 100 : '';
    }
    // 获取激活的tab
    function setActiveTab() {
        var value = props.value;
        if ((value === null || value === void 0 ? void 0 : value.backgroundColor) || (value === null || value === void 0 ? void 0 : value.alpha)) {
            // 背景色
            setTabIndex(0);
        }
        else if (value === null || value === void 0 ? void 0 : value.backgroundImage) {
            if (/linear-gradient/g.test(value.backgroundImage)) {
                // 渐变色
                setTabIndex(1);
            }
            else {
                // 图片
                setTabIndex(2);
            }
        }
        else if ((value === null || value === void 0 ? void 0 : value.backgroundPosition) || (value === null || value === void 0 ? void 0 : value.backgroundSize)) {
            // 图片
            setTabIndex(2);
        }
        else {
            // 无背景
            setTabIndex(tabList.length - 1);
        }
    }
    // 上传图片
    function uploadImg(e) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var url, forms, configs, file, result, imgUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = props === null || props === void 0 ? void 0 : props.receiver;
                        if (!url) {
                            console.warn('未配置图片上传地址');
                            return [2 /*return*/];
                        }
                        forms = new FormData();
                        configs = {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        file = e.target.files[0];
                        forms.append('file', file);
                        return [4 /*yield*/, axios.post(url, forms, configs)];
                    case 1:
                        result = _b.sent();
                        if (result.status === 200) {
                            imgUrl = result.data.data.url;
                            onChange('backgroundImage')(imgUrl);
                        }
                        else {
                            alert(((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.message) || '上传失败');
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    // 背景图尺寸设置
    function getbsValue() {
        var _a, _b;
        var backgroundSize = (_a = props.value) === null || _a === void 0 ? void 0 : _a.backgroundSize;
        var backgroundRepeat = (_b = props.value) === null || _b === void 0 ? void 0 : _b.backgroundRepeat;
        var returnVal = backgroundSize || '';
        if (backgroundSize === 'auto' && backgroundRepeat) {
            returnVal = backgroundSize + ' ' + backgroundRepeat;
        }
        return returnVal;
    }
    // 清空背景颜色、渐变色、背景图
    function clearValues() {
        var value = props.value, onChange = props.onChange;
        var result = __assign(__assign({}, value), { backgroundSize: '', backgroundPosition: '', backgroundColor: '', backgroundImage: '' });
        onChange(result);
    }
    function tabChange(index, item) {
        if (item === 'noset') {
            clearValues();
        }
        setTabIndex(index);
    }
    function handleChange(key, keyValue) {
        var _a;
        var value = props.value, onChange = props.onChange;
        var result = __assign(__assign({}, value), (_a = {}, _a[key] = keyValue, _a));
        onChange(result);
    }
    var currentItem = tabList[tabIndex];
    useEffect(function () {
        setActiveTab();
    }, []);
    return (React.createElement("div", { className: "ae-Background" },
        React.createElement("div", { className: "ae-Background_tabs" },
            React.createElement("ul", { className: "ae-Background_tabs-nav" }, tabList.map(function (item, index) {
                return (React.createElement("li", { key: index, className: cx(item, {
                        active: tabIndex === index
                    }), onClick: function () { return tabChange(index, item); } }));
            })),
            React.createElement("div", { className: "ae-Background_tabs-content" },
                currentItem === 'pure' && (React.createElement("div", { className: "ae-Background_setting" }, amisRender({
                    type: 'input-color',
                    label: '背景色',
                    format: 'rgba',
                    mode: 'normal',
                    value: (_a = props.value) === null || _a === void 0 ? void 0 : _a.backgroundColor
                }, {
                    onChange: function (value) {
                        return handleChange('backgroundColor', value);
                    }
                }))),
                currentItem === 'gradient' && (React.createElement("div", { className: "ae-Background_setting" },
                    React.createElement("div", { className: "ae-Background_setting-item" },
                        React.createElement("div", { className: "ae-Background_setting-item_color" }, amisRender({
                            type: 'input-color',
                            label: '开始颜色',
                            clearable: false,
                            placeholder: '起始色',
                            inputClassName: 'ae-Background-colorpicker',
                            value: getGradient('prev')
                        }, {
                            onChange: onChange('gradientPrev')
                        })),
                        React.createElement("div", { className: "ae-Background_setting-item_pic" }),
                        React.createElement("div", { className: "ae-Background_setting-item_color" }, amisRender({
                            type: 'input-color',
                            label: '结束颜色',
                            clearable: false,
                            placeholder: '结束色',
                            inputClassName: 'ae-Background-colorpicker',
                            value: getGradient('next')
                        }, {
                            onChange: onChange('gradientNext')
                        }))),
                    React.createElement("div", { className: "ae-Background_setting-item" }, amisRender({
                        type: 'input-number',
                        label: '渐变角度',
                        mode: 'row',
                        step: 10,
                        min: 0,
                        max: 360,
                        value: getGradientAngle(),
                        description: '* 角度范围0-360度，0度表示从下至上渐变'
                    }, {
                        onChange: function (value) { return handleChange('angle', value); }
                    })))),
                currentItem === 'image' && (React.createElement("div", { className: "ae-Background_setting" },
                    amisRender({
                        type: 'group',
                        mode: 'horizontal',
                        body: [
                            getSchemaTpl('backgroundImageUrl', {
                                name: 'backgroundImage',
                                placeholder: '点击或拖拽图片上传',
                                fixedSize: true,
                                value: (_c = (_b = props.data) === null || _b === void 0 ? void 0 : _b.style) === null || _c === void 0 ? void 0 : _c.backgroundImage,
                                onChange: onChange('backgroundImage'),
                                fixedSizeClassName: 'ae-Background-upload',
                                accept: '.jpg,.png,.svg,.gif',
                                crop: true,
                                columnRatio: 6,
                                horizontal: {
                                    left: 4,
                                    right: 8
                                }
                            }),
                            {
                                type: '',
                                label: '图片位置',
                                name: 'backgroundPosition',
                                asFormItem: true,
                                columnRatio: 6,
                                horizontal: {
                                    left: 4,
                                    right: 8
                                },
                                children: function () { return (React.createElement("ul", { className: "ae-Background_setting\u2014pos" }, [
                                    '0 0',
                                    '50% 0',
                                    '100% 0',
                                    '0 50%',
                                    '50% 50%',
                                    '100% 50%',
                                    '0 100%',
                                    '50% 100%',
                                    '100% 100%'
                                ].map(function (item) {
                                    var _a;
                                    return (React.createElement("li", { key: item, "data-pos": item, className: cx('ae-Background_setting—pos_item', {
                                            active: item === ((_a = props.value) === null || _a === void 0 ? void 0 : _a.backgroundPosition)
                                        }), onClick: onChange('backgroundPosition') }));
                                }))); }
                            }
                        ]
                    }),
                    amisRender({
                        type: 'select',
                        label: '图片尺寸',
                        name: 'backgroundSize',
                        mode: 'horizontal',
                        placeholder: '图片尺寸',
                        value: getbsValue(),
                        options: [
                            {
                                label: '充满',
                                value: 'cover'
                            },
                            {
                                label: '合适',
                                value: 'contain'
                            },
                            {
                                label: '拉伸',
                                value: '100%'
                            },
                            {
                                label: '平铺',
                                value: 'auto repeat'
                            },
                            {
                                label: '横向平铺',
                                value: 'auto repeat-x'
                            },
                            {
                                label: '纵向平铺',
                                value: 'auto repeat-y'
                            },
                            {
                                label: '原始尺寸',
                                value: 'auto no-repeat'
                            }
                        ]
                    }, {
                        onChange: function (value) {
                            return handleChange('backgroundSize', value);
                        }
                    }))),
                currentItem === 'noset' && (React.createElement("div", { className: "ae-Background_setting noset" }))))));
};
export default Background;
var BackgroundRenderer = /** @class */ (function (_super) {
    __extends(BackgroundRenderer, _super);
    function BackgroundRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BackgroundRenderer.prototype.render = function () {
        return React.createElement(Background, __assign({}, this.props));
    };
    BackgroundRenderer = __decorate([
        FormItem({ type: 'style-background' })
    ], BackgroundRenderer);
    return BackgroundRenderer;
}(React.Component));
export { BackgroundRenderer };
