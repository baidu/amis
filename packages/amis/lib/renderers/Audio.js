"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioRenderer = exports.Audio = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var upperFirst_1 = (0, tslib_1.__importDefault)(require("lodash/upperFirst"));
var factory_1 = require("../factory");
var helper_1 = require("../utils/helper");
var icons_1 = require("../components/icons");
var tpl_1 = require("../utils/tpl");
var Audio = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Audio, _super);
    function Audio() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            src: (0, helper_1.getPropValue)(_this.props, function (props) {
                return props.src ? (0, tpl_1.filter)(props.src, props.data, '| raw') : undefined;
            }) || '',
            isReady: false,
            muted: false,
            playing: false,
            played: 0,
            seeking: false,
            volume: 0.8,
            prevVolume: 0.8,
            loaded: 0,
            playbackRate: 1.0,
            showHandlePlaybackRate: false,
            showHandleVolume: false
        };
        return _this;
    }
    Audio.prototype.componentWillUnmount = function () {
        clearTimeout(this.progressTimeout);
        clearTimeout(this.durationTimeout);
    };
    Audio.prototype.componentDidMount = function () {
        var autoPlay = this.props.autoPlay;
        var playing = autoPlay ? true : false;
        this.setState({
            playing: playing
        }, this.progress);
    };
    Audio.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        var props = this.props;
        (0, helper_1.detectPropValueChanged)(props, prevProps, function (value) {
            return _this.setState({
                src: value,
                playing: false
            }, function () {
                _this.audio.load();
                _this.progress();
            });
        }, function (props) { return (props.src ? (0, tpl_1.filter)(props.src, props.data, '| raw') : undefined); });
    };
    Audio.prototype.progress = function () {
        clearTimeout(this.progressTimeout);
        if (this.state.src && this.audio) {
            var currentTime = this.audio.currentTime || 0;
            var duration = this.audio.duration;
            var played = currentTime / duration;
            var playing = this.state.playing;
            playing = played != 1 && playing ? true : false;
            this.setState({
                played: played,
                playing: playing
            });
            this.progressTimeout = setTimeout(this.progress, this.props.progressInterval / this.state.playbackRate);
        }
    };
    Audio.prototype.audioRef = function (audio) {
        this.audio = audio;
    };
    Audio.prototype.load = function () {
        this.setState({
            isReady: true
        });
    };
    Audio.prototype.handlePlaybackRate = function (rate) {
        this.audio.playbackRate = rate;
        this.setState({
            playbackRate: rate,
            showHandlePlaybackRate: false
        });
    };
    Audio.prototype.handleMute = function () {
        if (!this.state.src) {
            return;
        }
        var _a = this.state, muted = _a.muted, prevVolume = _a.prevVolume;
        var curVolume = !muted ? 0 : prevVolume;
        this.audio.muted = !muted;
        this.setState({
            muted: !muted,
            volume: curVolume
        });
    };
    Audio.prototype.handlePlaying = function () {
        if (!this.state.src) {
            return;
        }
        var playing = this.state.playing;
        playing ? this.audio.pause() : this.audio.play();
        this.setState({
            playing: !playing
        });
    };
    Audio.prototype.getCurrentTime = function () {
        if (!this.audio || !this.state.src || !this.state.isReady) {
            return '0:00';
        }
        var duration = this.audio.duration;
        var played = this.state.played;
        return this.formatTime(duration * (played || 0));
    };
    Audio.prototype.getDuration = function () {
        if (!this.audio || !this.state.src) {
            return '0:00';
        }
        if (!this.state.isReady) {
            this.onDurationCheck();
            return '0:00';
        }
        var _a = this.audio, duration = _a.duration, seekable = _a.seekable;
        // on iOS, live streams return Infinity for the duration
        // so instead we use the end of the seekable timerange
        if (duration === Infinity && seekable.length > 0) {
            return seekable.end(seekable.length - 1);
        }
        return this.formatTime(duration);
    };
    Audio.prototype.onDurationCheck = function () {
        clearTimeout(this.durationTimeout);
        var duration = this.audio && this.audio.duration;
        if (!duration) {
            this.durationTimeout = setTimeout(this.onDurationCheck, 500);
        }
    };
    Audio.prototype.onSeekChange = function (e) {
        if (!this.state.src) {
            return;
        }
        var played = e.target.value;
        this.setState({ played: played });
    };
    Audio.prototype.onSeekMouseDown = function () {
        this.setState({ seeking: true });
    };
    Audio.prototype.onSeekMouseUp = function (e) {
        if (!this.state.seeking) {
            return;
        }
        var played = e.target.value;
        var duration = this.audio.duration;
        this.audio.currentTime = duration * played;
        var loop = this.props.loop;
        var playing = this.state.playing;
        playing = played < 1 || loop ? playing : false;
        this.setState({
            playing: playing,
            seeking: false
        });
    };
    Audio.prototype.setVolume = function (e) {
        if (!this.state.src) {
            return;
        }
        var volume = e.target.value;
        this.audio.volume = volume;
        this.setState({
            volume: volume,
            prevVolume: volume
        });
    };
    Audio.prototype.formatTime = function (seconds) {
        var date = new Date(seconds * 1000);
        var hh = date.getUTCHours();
        var mm = date.getUTCMinutes();
        var ss = this.pad(date.getUTCSeconds());
        if (hh) {
            return "".concat(hh, ":").concat(this.pad(mm), ":").concat(ss);
        }
        return "".concat(mm, ":").concat(ss);
    };
    Audio.prototype.pad = function (string) {
        return ('0' + string).slice(-2);
    };
    Audio.prototype.toggleHandlePlaybackRate = function () {
        if (!this.state.src) {
            return;
        }
        this.setState({
            showHandlePlaybackRate: !this.state.showHandlePlaybackRate
        });
    };
    Audio.prototype.toggleHandleVolume = function (type) {
        if (!this.state.src) {
            return;
        }
        this.setState({
            showHandleVolume: type
        });
    };
    Audio.prototype.renderRates = function () {
        var _this = this;
        var _a = this.props, rates = _a.rates, cx = _a.classnames;
        var _b = this.state, showHandlePlaybackRate = _b.showHandlePlaybackRate, playbackRate = _b.playbackRate;
        return rates && rates.length ? (showHandlePlaybackRate ? (react_1.default.createElement("div", { className: cx('Audio-rateControl') }, rates.map(function (rate, index) { return (react_1.default.createElement("div", { key: index, className: cx('Audio-rateControlItem'), onClick: function () { return _this.handlePlaybackRate(rate); } },
            "x",
            rate.toFixed(1))); }))) : (react_1.default.createElement("div", { className: cx('Audio-rates'), onClick: this.toggleHandlePlaybackRate },
            "x",
            playbackRate.toFixed(1)))) : null;
    };
    Audio.prototype.renderPlay = function () {
        var cx = this.props.classnames;
        var playing = this.state.playing;
        return (react_1.default.createElement("div", { className: cx('Audio-play'), onClick: this.handlePlaying }, playing ? (react_1.default.createElement(icons_1.Icon, { icon: "pause", className: "icon" })) : (react_1.default.createElement(icons_1.Icon, { icon: "play", className: "icon" }))));
    };
    Audio.prototype.renderTime = function () {
        var cx = this.props.classnames;
        return (react_1.default.createElement("div", { className: cx('Audio-times') },
            this.getCurrentTime(),
            " / ",
            this.getDuration()));
    };
    Audio.prototype.renderProcess = function () {
        var cx = this.props.classnames;
        var played = this.state.played;
        return (react_1.default.createElement("div", { className: cx('Audio-process') },
            react_1.default.createElement("input", { type: "range", min: 0, max: 1, step: "any", value: played || 0, onMouseDown: this.onSeekMouseDown, onChange: this.onSeekChange, onMouseUp: this.onSeekMouseUp })));
    };
    Audio.prototype.renderVolume = function () {
        var _this = this;
        var cx = this.props.classnames;
        var _a = this.state, volume = _a.volume, showHandleVolume = _a.showHandleVolume;
        return showHandleVolume ? (react_1.default.createElement("div", { className: cx('Audio-volumeControl'), onMouseLeave: function () { return _this.toggleHandleVolume(false); } },
            react_1.default.createElement("div", { className: cx('Audio-volumeControlIcon'), onClick: this.handleMute }, volume > 0 ? (react_1.default.createElement(icons_1.Icon, { icon: "volume", className: "icon" })) : (react_1.default.createElement(icons_1.Icon, { icon: "mute", className: "icon" }))),
            react_1.default.createElement("input", { type: "range", min: 0, max: 1, step: "any", value: volume, onChange: this.setVolume }))) : (react_1.default.createElement("div", { className: cx('Audio-volume'), onMouseEnter: function () { return _this.toggleHandleVolume(true); } }, volume > 0 ? (react_1.default.createElement(icons_1.Icon, { icon: "volume", className: "icon" })) : (react_1.default.createElement(icons_1.Icon, { icon: "mute", className: "icon" }))));
    };
    Audio.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, inline = _a.inline, autoPlay = _a.autoPlay, loop = _a.loop, controls = _a.controls, cx = _a.classnames;
        var _b = this.state, muted = _b.muted, src = _b.src;
        return (react_1.default.createElement("div", { className: cx('Audio', className, inline ? 'Audio--inline' : '') },
            react_1.default.createElement("audio", { className: cx('Audio-original'), ref: this.audioRef, onCanPlay: this.load, autoPlay: autoPlay, controls: true, muted: muted, loop: loop },
                react_1.default.createElement("source", { src: src })),
            react_1.default.createElement("div", { className: cx('Audio-controls') }, controls &&
                controls.map(function (control, index) {
                    control = 'render' + (0, upperFirst_1.default)(control);
                    var method = control;
                    return (react_1.default.createElement(react_1.default.Fragment, { key: index }, _this[method]()));
                }))));
    };
    var _a;
    Audio.defaultProps = {
        inline: true,
        autoPlay: false,
        playbackRate: 1,
        loop: false,
        rates: [],
        progressInterval: 1000,
        controls: ['rates', 'play', 'time', 'process', 'volume']
    };
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "progress", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [typeof (_a = typeof HTMLMediaElement !== "undefined" && HTMLMediaElement) === "function" ? _a : Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "audioRef", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "load", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "handlePlaybackRate", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "handleMute", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "handlePlaying", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "getCurrentTime", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "getDuration", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "onDurationCheck", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "onSeekChange", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "onSeekMouseDown", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "onSeekMouseUp", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Object]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "setVolume", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "formatTime", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Number]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "pad", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", []),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "toggleHandlePlaybackRate", null);
    (0, tslib_1.__decorate)([
        helper_1.autobind,
        (0, tslib_1.__metadata)("design:type", Function),
        (0, tslib_1.__metadata)("design:paramtypes", [Boolean]),
        (0, tslib_1.__metadata)("design:returntype", void 0)
    ], Audio.prototype, "toggleHandleVolume", null);
    return Audio;
}(react_1.default.Component));
exports.Audio = Audio;
var AudioRenderer = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AudioRenderer, _super);
    function AudioRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AudioRenderer = (0, tslib_1.__decorate)([
        (0, factory_1.Renderer)({
            type: 'audio'
        })
    ], AudioRenderer);
    return AudioRenderer;
}(Audio));
exports.AudioRenderer = AudioRenderer;
//# sourceMappingURL=./renderers/Audio.js.map
