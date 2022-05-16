"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiduMapPicker = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var theme_1 = require("../theme");
var helper_1 = require("../utils/helper");
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
var icons_1 = require("./icons");
/**
 * 坐标常量说明：
 * COORDINATES_WGS84 = 1, WGS84坐标
 * COORDINATES_WGS84_MC = 2, WGS84的平面墨卡托坐标
 * COORDINATES_GCJ02 = 3，GCJ02坐标
 * COORDINATES_GCJ02_MC = 4, GCJ02的平面墨卡托坐标
 * COORDINATES_BD09 = 5, 百度bd09经纬度坐标
 * COORDINATES_BD09_MC = 6，百度bd09墨卡托坐标
 * COORDINATES_MAPBAR = 7，mapbar地图坐标
 * COORDINATES_51 = 8，51地图坐标
 */
var COORDINATES_WGS84 = 1;
var COORDINATES_WGS84_MC = 2;
var COORDINATES_GCJ02 = 3;
var COORDINATES_GCJ02_MC = 4;
var COORDINATES_BD09 = 5;
var COORDINATES_BD09_MC = 6;
var COORDINATES_MAPBAR = 7;
var COORDINATES_51 = 8;
var BaiduMapPicker = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(BaiduMapPicker, _super);
    function BaiduMapPicker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            inputValue: '',
            locs: [],
            locIndex: -1,
            sugs: []
        };
        _this.id = (0, helper_1.uuid)();
        _this.mapRef = react_1.default.createRef();
        _this.search = (0, debounce_1.default)(function () {
            var _a;
            if (_this.state.inputValue) {
                (_a = _this.ac) === null || _a === void 0 ? void 0 : _a.search(_this.state.inputValue);
            }
            else {
                _this.setState({
                    sugs: []
                });
            }
        }, 250, {
            trailing: true,
            leading: false
        });
        return _this;
    }
    BaiduMapPicker.prototype.componentDidMount = function () {
        if (window.BMap) {
            this.initMap();
        }
        else {
            (0, helper_1.loadScript)("//api.map.baidu.com/api?v=3.0&ak=".concat(this.props.ak, "&callback={{callback}}")).then(this.initMap);
        }
    };
    BaiduMapPicker.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.ac) === null || _a === void 0 ? void 0 : _a.dispose();
        document.body.removeChild(this.placeholderInput);
        delete this.placeholderInput;
        delete this.map;
    };
    BaiduMapPicker.prototype.initMap = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var map, value, point, geolocationControl, input;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        map = new BMap.Map(this.mapRef.current, {
                            enableMapClick: false
                        });
                        this.map = map;
                        this.convertor = new BMap.Convertor();
                        value = this.props.value;
                        point = value
                            ? new BMap.Point(value.lng, value.lat)
                            : new BMap.Point(116.404, 39.915);
                        if (!(this.props.coordinatesType == 'gcj02')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.covertPoint(point, COORDINATES_GCJ02, COORDINATES_BD09)];
                    case 1:
                        point = _a.sent();
                        map.centerAndZoom(point, 15);
                        return [3 /*break*/, 3];
                    case 2:
                        map.centerAndZoom(point, 15);
                        _a.label = 3;
                    case 3:
                        map.addControl(
                        // @ts-ignore
                        new BMap.NavigationControl({ type: BMAP_NAVIGATION_CONTROL_SMALL }));
                        geolocationControl = new BMap.GeolocationControl();
                        geolocationControl.addEventListener('locationSuccess', function (e) {
                            _this.getLocations(e.point);
                        });
                        map.addControl(geolocationControl);
                        map.addEventListener('click', function (e) {
                            _this.getLocations(e.point, true);
                        });
                        input = document.createElement('input');
                        input.className = 'invisible';
                        this.placeholderInput = input;
                        document.body.appendChild(input);
                        this.ac = new BMap.Autocomplete({
                            input: input,
                            location: map,
                            onSearchComplete: function (result) {
                                // 说明已经销毁了。
                                if (!_this.map) {
                                    return;
                                }
                                var sugs = [];
                                var poiLength = result.getNumPois();
                                if (poiLength) {
                                    for (var i = 0; i < poiLength; i++) {
                                        var poi = result.getPoi(i);
                                        sugs.push([
                                            poi.province,
                                            poi.city,
                                            poi.district,
                                            poi.street,
                                            poi.business
                                        ].join(' '));
                                    }
                                    _this.setState({
                                        sugs: sugs
                                    });
                                }
                            }
                        });
                        value ? this.getLocations(point) : geolocationControl.location();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaiduMapPicker.prototype.getLocations = function (point, select) {
        var _this = this;
        var map = this.map;
        map.clearOverlays();
        var mk = new BMap.Marker(point);
        map.addOverlay(mk);
        map.panTo(point);
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function (rs) {
            // 说明已经销毁了。
            if (!_this.map) {
                return;
            }
            var index = 0;
            var locs = [];
            locs.push({
                title: '当前位置',
                address: rs.address,
                city: rs.addressComponents.city,
                lat: rs.point.lat,
                lng: rs.point.lng
            });
            if (Array.isArray(rs.surroundingPois)) {
                rs.surroundingPois.forEach(function (item) {
                    locs.push({
                        title: item.title,
                        address: item.address,
                        city: item.city,
                        lat: item.point.lat,
                        lng: item.point.lng
                    });
                });
            }
            _this.setState({
                locIndex: index,
                locs: locs
            }, function () {
                if (!select) {
                    return;
                }
                _this.triggerOnChange(locs[0]);
            });
        });
    };
    BaiduMapPicker.prototype.handleChange = function (e) {
        this.setState({
            inputValue: e.currentTarget.value
        }, this.search);
    };
    BaiduMapPicker.prototype.handleSelect = function (e) {
        var _this = this;
        var index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var loc = this.state.locs[index];
        this.setState({
            locIndex: index
        }, function () {
            var point = new BMap.Point(loc.lng, loc.lat);
            _this.map.clearOverlays();
            var mk = new BMap.Marker(point);
            _this.map.addOverlay(mk);
            _this.map.panTo(point);
            _this.triggerOnChange(loc);
        });
    };
    BaiduMapPicker.prototype.covertPoint = function (point, from, to) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.convertor.translate([point], from, to, function (res) {
                if (res.status === 0 && res.points.length) {
                    resolve(new BMap.Point(res.points[0].lng, res.points[0].lat));
                }
                else {
                    reject();
                }
            });
        });
    };
    BaiduMapPicker.prototype.triggerOnChange = function (loc) {
        var _this = this;
        var _a;
        var point = new BMap.Point(loc.lng, loc.lat);
        if (this.props.coordinatesType == 'gcj02') {
            this.covertPoint(point, COORDINATES_BD09, COORDINATES_GCJ02).then(function (convertedPoint) {
                var _a;
                (_a = _this.props) === null || _a === void 0 ? void 0 : _a.onChange({
                    address: loc.address.trim() || loc.title,
                    lat: convertedPoint.lat,
                    lng: convertedPoint.lng,
                    city: loc.city
                });
            });
        }
        else {
            (_a = this.props) === null || _a === void 0 ? void 0 : _a.onChange({
                address: loc.address.trim() || loc.title,
                lat: loc.lat,
                lng: loc.lng,
                city: loc.city
            });
        }
    };
    BaiduMapPicker.prototype.handleSugSelect = function (e) {
        var _this = this;
        var value = e.currentTarget.innerText;
        this.setState({
            inputValue: value
        });
        var local = new BMap.LocalSearch(this.map, {
            //智能搜索
            onSearchComplete: function () {
                var results = local.getResults();
                var poi = results.getPoi(0);
                _this.setState({
                    inputValue: poi.title,
                    sugs: []
                });
                _this.getLocations(poi.point, true);
            }
        });
        local.search(value);
    };
    BaiduMapPicker.prototype.render = function () {
        var _this = this;
        var cx = this.props.classnames;
        var _a = this.state, locIndex = _a.locIndex, locs = _a.locs, inputValue = _a.inputValue, sugs = _a.sugs;
        var hasSug = Array.isArray(sugs) && sugs.length;
        return (react_1.default.createElement("div", { className: cx('MapPicker') },
            react_1.default.createElement("div", { className: cx('MapPicker-search TextControl-control') },
                react_1.default.createElement("div", { className: cx('TextControl-input') },
                    react_1.default.createElement("input", { onChange: this.handleChange, value: inputValue, placeholder: "\u641C\u7D22\u5730\u70B9" }))),
            react_1.default.createElement("div", { ref: this.mapRef, className: cx('MapPicker-map', {
                    invisible: hasSug
                }) }),
            react_1.default.createElement("div", { className: cx('MapPicker-result', {
                    invisible: hasSug
                }) }, locs.map(function (item, index) { return (react_1.default.createElement("div", { onClick: _this.handleSelect, key: index, "data-index": index, className: cx('MapPicker-item') },
                react_1.default.createElement("div", { className: cx('MapPicker-itemTitle') }, item.title),
                react_1.default.createElement("div", { className: cx('MapPicker-itemDesc') }, item.address),
                locIndex === index ? (react_1.default.createElement(icons_1.Icon, { icon: "success", className: "icon" })) : null)); })),
            hasSug ? (react_1.default.createElement("div", { className: cx('MapPicker-sug') }, sugs.map(function (item) { return (react_1.default.createElement("div", { onClick: _this.handleSugSelect, className: cx('MapPicker-sugItem'), key: item }, item)); }))) : null));
    };
    var _a, _b, _c;
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", Promise)
    ], BaiduMapPicker.prototype, "initMap", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof react_1.default !== "undefined" && react_1.default.ChangeEvent) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaiduMapPicker.prototype, "handleChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_b = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _b : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaiduMapPicker.prototype, "handleSelect", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_c = typeof react_1.default !== "undefined" && react_1.default.MouseEvent) === "function" ? _c : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], BaiduMapPicker.prototype, "handleSugSelect", null);
    return BaiduMapPicker;
}(react_1.default.Component));
exports.BaiduMapPicker = BaiduMapPicker;
exports.default = (0, theme_1.themeable)(BaiduMapPicker);
//# sourceMappingURL=./components/BaiduMapPicker.js.map
