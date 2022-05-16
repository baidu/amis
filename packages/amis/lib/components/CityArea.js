"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file 移动端城市选择器
 */
var react_1 = tslib_1.__importStar(require("react"));
var Picker_1 = (0, tslib_1.__importDefault)(require("./Picker"));
var ResultBox_1 = (0, tslib_1.__importDefault)(require("./ResultBox"));
var hooks_1 = require("../hooks");
var locale_1 = require("../locale");
var theme_1 = require("../theme");
var uncontrollable_1 = require("uncontrollable");
var PopUp_1 = (0, tslib_1.__importDefault)(require("./PopUp"));
var CityArea = (0, react_1.memo)(function (props) {
    var _a;
    var _b = props.joinValues, joinValues = _b === void 0 ? true : _b, _c = props.extractValue, extractValue = _c === void 0 ? true : _c, _d = props.delimiter, delimiter = _d === void 0 ? ',' : _d, _e = props.allowCity, allowCity = _e === void 0 ? true : _e, _f = props.allowDistrict, allowDistrict = _f === void 0 ? true : _f, _g = props.allowStreet, allowStreet = _g === void 0 ? false : _g, 
    // 默认北京东城区
    _h = props.value, 
    // 默认北京东城区
    value = _h === void 0 ? 110101 : _h, cx = props.classnames, __ = props.translate, _j = props.disabled, disabled = _j === void 0 ? false : _j, popOverContainer = props.popOverContainer, useMobileUI = props.useMobileUI;
    var _k = (0, react_1.useState)([]), values = _k[0], setValues = _k[1];
    var _l = (0, react_1.useState)(''), street = _l[0], setStreet = _l[1];
    var _m = (0, react_1.useState)(), confirmValues = _m[0], setConfirmValues = _m[1];
    var _o = (0, hooks_1.useSetState)(), db = _o[0], updateDb = _o[1];
    var _p = (0, hooks_1.useSetState)({
        columns: []
    }), state = _p[0], updateState = _p[1];
    var _q = (0, react_1.useState)(false), isOpened = _q[0], setIsOpened = _q[1];
    var onChange = function (columnValues, columnIndex) {
        var _a, _b, _c, _d, _e;
        // 清空后面的值
        while (columnValues[columnIndex++]) {
            columnValues[columnIndex++] = -1;
        }
        var provience = columnValues[0], city = columnValues[1], district = columnValues[2];
        if (city === -1) {
            city = (_b = (_a = db.city) === null || _a === void 0 ? void 0 : _a[provience]) === null || _b === void 0 ? void 0 : _b[0];
        }
        if (district === -1) {
            district = (_e = (_d = (_c = db.district) === null || _c === void 0 ? void 0 : _c[provience]) === null || _d === void 0 ? void 0 : _d[city]) === null || _e === void 0 ? void 0 : _e[0];
        }
        var tempValues = [provience, city, district];
        if (!allowDistrict) {
            tempValues.splice(2, 1);
        }
        if (!allowCity) {
            tempValues.splice(1, 1);
        }
        setValues(tempValues);
    };
    var propsChange = function () {
        var onChange = props.onChange;
        var province = values[0], city = values[1], district = values[2];
        var code = allowDistrict && district
            ? district
            : allowCity && city
                ? city
                : province;
        if (typeof extractValue === 'undefined' ? joinValues : extractValue) {
            code
                ? onChange(allowStreet && street
                    ? [code, street].join(delimiter)
                    : String(code))
                : onChange('');
        }
        else {
            onChange({
                code: code,
                provinceCode: province,
                province: db[province],
                cityCode: city,
                city: db[city],
                districtCode: district,
                district: db[district],
                street: street
            });
        }
    };
    var onConfirm = function () {
        var confirmValues = values.map(function (item) { return ({
            text: db[item],
            value: item
        }); });
        setConfirmValues(confirmValues);
        propsChange();
        setIsOpened(false);
    };
    var onCancel = function () {
        setIsOpened(false);
        if (props.onCancel)
            props.onCancel();
    };
    var getPropsValue = function () {
        var _a;
        // 最后一项的值
        var code = (value && value.code) ||
            (typeof value === 'number' && value) ||
            (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);
        var values = [];
        if (code && db[code]) {
            code = parseInt(code, 10);
            var provinceCode = code - (code % 10000);
            var cityCode = code - (code % 100);
            if (db[provinceCode]) {
                values[0] = provinceCode;
            }
            if (db[cityCode] && allowCity) {
                values[1] = cityCode;
            }
            else if (~((_a = db.city[provinceCode]) === null || _a === void 0 ? void 0 : _a.indexOf(code)) && allowCity) {
                values[1] = code;
            }
            if (code % 100 && allowDistrict) {
                values[2] = code;
            }
            setValues(values);
        }
    };
    var updateColumns = function () {
        if (!db) {
            return;
        }
        var provience = values[0], city = values[1], district = values[2];
        var provienceColumn = db.province.map(function (code) {
            return { text: db[code], value: code, disabled: disabled };
        });
        var cityColumn = city
            ? db.city[provience].map(function (code) {
                return { text: db[code], value: code, disabled: disabled };
            })
            : [];
        var districtColumn = city && district
            ? db.district[provience][city].map(function (code) {
                return { text: db[code], value: code, disabled: disabled };
            })
            : [];
        var columns = [
            { options: provienceColumn },
            { options: cityColumn },
            { options: districtColumn }
        ];
        if (!allowDistrict || !allowCity) {
            columns.splice(2, 1);
        }
        if (!allowCity) {
            columns.splice(1, 1);
        }
        updateState({ columns: columns });
    };
    var loadDb = function () {
        Promise.resolve().then(function () { return new Promise(function(resolve){require(['../renderers/Form/CityDB'], function(ret) {resolve(tslib_1.__importStar(ret));})}); }).then(function (db) {
            updateDb((0, tslib_1.__assign)((0, tslib_1.__assign)({}, db.default), { province: db.province, city: db.city, district: db.district }));
        });
    };
    (0, react_1.useEffect)(function () {
        loadDb();
    }, []);
    (0, react_1.useEffect)(function () {
        isOpened && db && getPropsValue();
    }, [db, isOpened]);
    (0, react_1.useEffect)(function () {
        street && propsChange();
    }, [street]);
    (0, hooks_1.useUpdateEffect)(function () {
        values.length && updateColumns();
    }, [values]);
    var result = (_a = confirmValues === null || confirmValues === void 0 ? void 0 : confirmValues.filter(function (item) { return item === null || item === void 0 ? void 0 : item.value; })) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.text; }).join(delimiter);
    return (react_1.default.createElement("div", { className: cx("CityArea") },
        react_1.default.createElement(ResultBox_1.default, { className: cx('CityArea-Input', isOpened ? 'is-active' : ''), allowInput: false, result: result, onResultChange: function () { }, onResultClick: function () { return setIsOpened(!isOpened); }, placeholder: __('Condition.cond_placeholder'), useMobileUI: useMobileUI }),
        allowStreet && values[0] ? (react_1.default.createElement("input", { className: cx('CityArea-Input'), value: street, onChange: function (e) {
                return setStreet(e.currentTarget.value);
            }, placeholder: __('City.street'), disabled: disabled })) : null,
        react_1.default.createElement(PopUp_1.default, { className: cx("CityArea-popup"), container: popOverContainer, isShow: isOpened, showConfirm: true, onConfirm: onConfirm, onHide: onCancel },
            react_1.default.createElement(Picker_1.default, { className: 'CityArea-picker', columns: state.columns, onChange: onChange, showToolbar: false, labelField: "text", itemHeight: 40, value: values, classnames: props.classnames, classPrefix: props.classPrefix }))));
});
exports.default = (0, theme_1.themeable)((0, locale_1.localeable)((0, uncontrollable_1.uncontrollable)(CityArea, {
    value: 'onChange'
})));
//# sourceMappingURL=./components/CityArea.js.map
