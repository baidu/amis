import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import { autobind } from '../utils/helper';
import { volumeIcon, muteIcon, playIcon, pauseIcon} from '../components/icons';

export interface AudioProps extends RendererProps {
    className?: string;
    inline?: boolean,
    src?: string,
    autoPlay?: boolean,
    loop?: boolean,
    rates?: number[]
}

export interface AudioState {
    isReady?: boolean,
    muted?: boolean,
    playing?: boolean,
    played: number,
    seeking?: boolean,
    volume: number,
    prevVolume: number,
    loaded?: number,
    playbackRate: number,
    showHandlePlaybackRate: boolean,
    showHandleVolume: boolean
}

export class Audio extends React.Component<AudioProps, AudioState> {
    audio: any;
    progressTimeout: any;
    durationTimeout: any;

    static defaultProps:Pick<AudioProps, 'inline' | 'autoPlay' | 'playbackRate' | 'loop' | 'rates' | 'progressInterval'> = {
        inline: true,
        autoPlay: false,
        playbackRate: 1,
        loop: false,
        rates: [1.0, 2.0, 4.0],
        progressInterval: 1000
    };

    state:AudioState = {
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
    }

    componentWillUnmount () {
        clearTimeout(this.progressTimeout);
    }

    componentDidMount() {
        const autoPlay = this.props.autoPlay;
        const playing = autoPlay ? true : false;
        this.setState({
            playing: playing
        }, this.progress);
    }

    @autobind
    progress() {
        clearTimeout(this.progressTimeout);
        if (this.props.src && this.audio) {
            const currentTime = this.audio.currentTime || 0;
            const duration = this.audio.duration;
            const played = currentTime / duration;
            let playing = this.state.playing;
            playing = (played != 1 && playing) ? true : false;
            this.setState({
                played,
                playing
            });
            this.progressTimeout = setTimeout(this.progress, (this.props.progressInterval / this.state.playbackRate))
        }
    }

    @autobind
    audioRef(audio:any) {
        this.audio = audio;
    }

    @autobind
    load() {
        this.setState({
            isReady: true
        });
    }

    @autobind
    handlePlaybackRate(rate:number) {
        this.audio.playbackRate = rate;
        this.setState({
            playbackRate: rate,
            showHandlePlaybackRate: false
        });
    }

    @autobind
    handleMute() {
        if (!this.props.src) {
            return;
        }
        const {muted, prevVolume} = this.state;
        const curVolume = !muted ? 0 : prevVolume;
        this.audio.muted = !muted;
        this.setState({
            muted: !muted,
            volume: curVolume
        });
    }

    @autobind
    handlePlaying() {
        if (!this.props.src) {
            return;
        }
        let playing = this.state.playing;
        playing ? this.audio.pause() : this.audio.play();
        this.setState({
            playing: !playing
        });
    }

    @autobind
    getCurrentTime() {
        if (!this.audio || !this.props.src || !this.state.isReady) {
            return '0:00';
        }
        const duration = this.audio.duration;
        const played = this.state.played;
        return this.formatTime(duration * (played || 0));
    }

    @autobind
    getDuration () {
        if (!this.audio || !this.props.src) {
            return '0:00';
        }
        if (!this.state.isReady) {
            this.onDurationCheck();
            return '0:00';
        }
        const { duration, seekable } = this.audio;
        // on iOS, live streams return Infinity for the duration
        // so instead we use the end of the seekable timerange
        if (duration === Infinity && seekable.length > 0) {
            return seekable.end(seekable.length - 1)
        }
        return this.formatTime(duration);
    }

    @autobind
    onDurationCheck() {
        clearTimeout(this.durationTimeout);
        const duration = this.audio && this.audio.duration;
        if (!duration) {
            this.audio.load();
            this.durationTimeout = setTimeout(this.onDurationCheck, 500);
        }
    }

    @autobind
    onSeekChange(e:any) {
        if (!this.props.src) {
            return;
        }
        const played = e.target.value;
        this.setState({ played: played });
    }

    @autobind
    onSeekMouseDown() {
        this.setState({ seeking: true });
    }

    @autobind
    onSeekMouseUp(e:any) {
        if (!this.state.seeking) {
            return;
        }
        const played = e.target.value;
        const duration = this.audio.duration;
        this.audio.currentTime = duration * played;

        const loop = this.props.loop;
        let playing = this.state.playing;
        playing = (played < 1 || loop) ? playing : false;
        this.setState({
            playing: playing,
            seeking: false
        });
    }

    @autobind
    setVolume(e:any) {
        if (!this.props.src) {
            return;
        }
        const volume = e.target.value;
        this.audio.volume = volume;
        this.setState({
            volume: volume,
            prevVolume: volume
        });
    }

    @autobind
    formatTime(seconds:number) {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = this.pad(date.getUTCSeconds());
        if (hh) {
            return `${hh}:${this.pad(mm)}:${ss}`;
        }
        return `${mm}:${ss}`;
    }

    @autobind
    pad(string:number) {
        return ('0' + string).slice(-2)
    }

    @autobind
    toggleHandlePlaybackRate() {
        if (!this.props.src) {
            return;
        }
        this.setState({
            showHandlePlaybackRate: !this.state.showHandlePlaybackRate
        });
    }

    @autobind
    toggleHandleVolume(type:boolean) {
        if (!this.props.src) {
            return;
        }
        this.setState({
            showHandleVolume: type
        });
    }

    render() {
        const {
            className,
            inline,
            src,
            autoPlay,
            loop,
            rates,
            classnames: cx
        } = this.props;
        const {
            playing,
            played,
            volume,
            muted,
            playbackRate,
            showHandlePlaybackRate,
            showHandleVolume
        } = this.state;

        return (
            <div className={cx(inline ? 'Audio--inline' : '')}>
                <audio
                    className={cx('Audio-original')}
                    ref={this.audioRef}
                    onCanPlay={this.load}
                    autoPlay={autoPlay}
                    controls
                    muted={muted}
                    loop={loop}>
                    <source src={src}/>
                </audio>
                <div className={cx('Audio', className)}>
                    {rates && rates.length ?
                        (<div className={cx('Audio-rates')}>
                            <div className={cx('Audio-rate')}
                                 onClick={this.toggleHandlePlaybackRate}>
                                x{playbackRate.toFixed(1)}
                            </div>
                            {showHandlePlaybackRate ?
                                (<div className={cx('Audio-rateControl')}>
                                    {rates.map((rate, index) =>
                                        <span className={cx('Audio-rateControlItem')}
                                              key={index}
                                              onClick={() => this.handlePlaybackRate(rate)}>
                                            x{rate.toFixed(1)}
                                            </span>
                                    )} </div>)
                                : null}
                            </div>)
                        : (<div className={cx('Audio-rates-holder')}></div>) }
                    <div className={cx('Audio-play')} onClick={this.handlePlaying}>
                        {playing ? pauseIcon : playIcon}
                    </div>
                    <div className={cx('Audio-times')}>{this.getCurrentTime()} / {this.getDuration()}</div>
                    <div className={cx('Audio-process')}>
                        <input
                            type="range"
                            min={0} max={1} step="any"
                            value={played || 0}
                            onMouseDown={this.onSeekMouseDown}
                            onChange={this.onSeekChange}
                            onMouseUp={this.onSeekMouseUp}/>
                    </div>
                    <div className={cx('Audio-volume')}
                         onMouseEnter={() => this.toggleHandleVolume(true)}
                         onMouseLeave={() => this.toggleHandleVolume(false)}>
                        {showHandleVolume ?
                            (<div className={cx('Audio-volumeControl')}>
                                <input
                                    type='range' min={0} max={1} step='any'
                                    value={volume}
                                    onChange={this.setVolume} />
                                <div className={cx('Audio-volumeControlIcon')}
                                     onClick={this.handleMute}>
                                    {volume > 0 ? volumeIcon : muteIcon}
                                    </div></div>)
                            : volume > 0 ? volumeIcon : muteIcon}
                    </div>
                </div>
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)audio/,
    name: 'audio'
})
export class AudioRenderer extends Audio {};
