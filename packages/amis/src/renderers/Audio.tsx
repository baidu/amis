import React from 'react';
import upperFirst from 'lodash/upperFirst';
import {Renderer, RendererProps} from 'amis-core';
import {autobind, detectPropValueChanged, getPropValue} from 'amis-core';
import {Icon} from 'amis-ui';
import {resolveVariable} from 'amis-core';
import {filter} from 'amis-core';
import {BaseSchema, SchemaUrlPath} from '../Schema';

/**
 * Audio 音频渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/audio
 */
export interface AudioSchema extends BaseSchema {
  /**
   * 指定为音频播放器
   */
  type: 'audio';

  /**
   * 是否是内联模式
   */
  inline?: boolean;

  /**
   * "视频播放地址, 支持 $ 取变量。
   */
  src?: SchemaUrlPath;

  /**
   * 是否循环播放
   */
  loop?: boolean;

  /**
   * 是否自动播放
   */
  autoPlay?: boolean;

  /**
   * 配置可选播放倍速
   */
  rates?: Array<number>;

  /**
   * 可以配置控制器
   */
  controls?: Array<'rates' | 'play' | 'time' | 'process' | 'volume'>;
}

export interface AudioProps
  extends RendererProps,
    Omit<AudioSchema, 'className'> {}

export interface AudioState {
  src?: string;
  isReady?: boolean;
  muted?: boolean;
  playing?: boolean;
  played: number;
  seeking?: boolean;
  volume: number;
  prevVolume: number;
  loaded?: number;
  playbackRate: number;
  showHandlePlaybackRate: boolean;
  showHandleVolume: boolean;
}

export class Audio extends React.Component<AudioProps, AudioState> {
  audio: HTMLMediaElement;
  progressTimeout: ReturnType<typeof setTimeout>;
  durationTimeout: ReturnType<typeof setTimeout>;

  static defaultProps: Pick<
    AudioProps,
    | 'inline'
    | 'autoPlay'
    | 'playbackRate'
    | 'loop'
    | 'rates'
    | 'progressInterval'
    | 'controls'
  > = {
    inline: true,
    autoPlay: false,
    playbackRate: 1,
    loop: false,
    rates: [],
    progressInterval: 1000,
    controls: ['rates', 'play', 'time', 'process', 'volume']
  };

  state: AudioState = {
    src:
      getPropValue(this.props, props =>
        props.src ? filter(props.src, props.data, '| raw') : undefined
      ) || '',
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

  componentWillUnmount() {
    clearTimeout(this.progressTimeout);
    clearTimeout(this.durationTimeout);
  }

  componentDidMount() {
    const autoPlay = this.props.autoPlay;
    const playing = autoPlay ? true : false;
    this.setState(
      {
        playing: playing
      },
      this.progress
    );
  }

  componentDidUpdate(prevProps: AudioProps) {
    const props = this.props;

    detectPropValueChanged(
      props,
      prevProps,
      value =>
        this.setState(
          {
            src: value,
            playing: false
          },
          () => {
            this.audio.load();
            this.progress();
          }
        ),
      props => (props.src ? filter(props.src, props.data, '| raw') : undefined)
    );
  }

  @autobind
  progress() {
    clearTimeout(this.progressTimeout);
    if (this.state.src && this.audio) {
      const currentTime = this.audio.currentTime || 0;
      const duration = this.audio.duration;
      const played = currentTime / duration;
      let playing = this.state.playing;
      playing = played != 1 && playing ? true : false;
      this.setState({
        played,
        playing
      });
      this.progressTimeout = setTimeout(
        this.progress,
        this.props.progressInterval / this.state.playbackRate
      );
    }
  }

  @autobind
  audioRef(audio: HTMLMediaElement) {
    this.audio = audio;
  }

  @autobind
  load() {
    this.setState({
      isReady: true
    });
  }

  @autobind
  handlePlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
    this.setState({
      playbackRate: rate,
      showHandlePlaybackRate: false
    });
  }

  @autobind
  handleMute() {
    if (!this.state.src) {
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
    if (!this.state.src) {
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
    if (!this.audio || !this.state.src || !this.state.isReady) {
      return '0:00';
    }
    const duration = this.audio.duration;
    const played = this.state.played;
    return this.formatTime(duration * (played || 0));
  }

  @autobind
  getDuration() {
    if (!this.audio || !this.state.src) {
      return '0:00';
    }
    if (!this.state.isReady) {
      this.onDurationCheck();
      return '0:00';
    }
    const {duration, seekable} = this.audio;
    // on iOS, live streams return Infinity for the duration
    // so instead we use the end of the seekable timerange
    if (duration === Infinity && seekable.length > 0) {
      return seekable.end(seekable.length - 1);
    }
    return this.formatTime(duration);
  }

  @autobind
  onDurationCheck() {
    clearTimeout(this.durationTimeout);
    const duration = this.audio && this.audio.duration;
    if (!duration) {
      this.durationTimeout = setTimeout(this.onDurationCheck, 500);
    }
  }

  @autobind
  onSeekChange(e: any) {
    if (!this.state.src) {
      return;
    }
    const played = e.target.value;
    this.setState({played: played});
  }

  @autobind
  onSeekMouseDown() {
    this.setState({seeking: true});
  }

  @autobind
  onSeekMouseUp(e: any) {
    if (!this.state.seeking) {
      return;
    }
    const played = e.target.value;
    const duration = this.audio.duration;
    this.audio.currentTime = duration * played;

    const loop = this.props.loop;
    let playing = this.state.playing;
    playing = played < 1 || loop ? playing : false;
    this.setState({
      playing: playing,
      seeking: false
    });
  }

  @autobind
  setVolume(e: any) {
    if (!this.state.src) {
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
  formatTime(seconds: number) {
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
  pad(string: number) {
    return ('0' + string).slice(-2);
  }

  @autobind
  toggleHandlePlaybackRate() {
    if (!this.state.src) {
      return;
    }
    this.setState({
      showHandlePlaybackRate: !this.state.showHandlePlaybackRate
    });
  }

  @autobind
  toggleHandleVolume(type: boolean) {
    if (!this.state.src) {
      return;
    }
    this.setState({
      showHandleVolume: type
    });
  }

  renderRates() {
    const {rates, classnames: cx} = this.props;
    const {showHandlePlaybackRate, playbackRate} = this.state;

    return rates && rates.length ? (
      showHandlePlaybackRate ? (
        <div className={cx('Audio-rateControl')}>
          {rates.map((rate, index) => (
            <div
              key={index}
              className={cx('Audio-rateControlItem')}
              onClick={() => this.handlePlaybackRate(rate)}
            >
              x{rate.toFixed(1)}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cx('Audio-rates')}
          onClick={this.toggleHandlePlaybackRate}
        >
          x{playbackRate.toFixed(1)}
        </div>
      )
    ) : null;
  }

  renderPlay() {
    const {classnames: cx} = this.props;
    const {playing} = this.state;

    return (
      <div className={cx('Audio-play')} onClick={this.handlePlaying}>
        {playing ? (
          <Icon icon="pause" className="icon" />
        ) : (
          <Icon icon="play" className="icon" />
        )}
      </div>
    );
  }

  renderTime() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('Audio-times')}>
        {this.getCurrentTime()} / {this.getDuration()}
      </div>
    );
  }

  renderProcess() {
    const {classnames: cx} = this.props;
    const {played} = this.state;

    return (
      <div className={cx('Audio-process')}>
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={played || 0}
          onMouseDown={this.onSeekMouseDown}
          onChange={this.onSeekChange}
          onMouseUp={this.onSeekMouseUp}
        />
      </div>
    );
  }

  renderVolume() {
    const {classnames: cx} = this.props;
    const {volume, showHandleVolume} = this.state;

    return showHandleVolume ? (
      <div
        className={cx('Audio-volumeControl')}
        onMouseLeave={() => this.toggleHandleVolume(false)}
      >
        <div
          className={cx('Audio-volumeControlIcon')}
          onClick={this.handleMute}
        >
          {volume > 0 ? (
            <Icon icon="volume" className="icon" />
          ) : (
            <Icon icon="mute" className="icon" />
          )}
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step="any"
          value={volume}
          onChange={this.setVolume}
        />
      </div>
    ) : (
      <div
        className={cx('Audio-volume')}
        onMouseEnter={() => this.toggleHandleVolume(true)}
      >
        {volume > 0 ? (
          <Icon icon="volume" className="icon" />
        ) : (
          <Icon icon="mute" className="icon" />
        )}
      </div>
    );
  }

  render() {
    const {
      className,
      inline,
      autoPlay,
      loop,
      controls,
      classnames: cx
    } = this.props;
    const {muted, src} = this.state;

    return (
      <div className={cx('Audio', className, inline ? 'Audio--inline' : '')}>
        <audio
          className={cx('Audio-original')}
          ref={this.audioRef}
          onCanPlay={this.load}
          autoPlay={autoPlay}
          controls
          muted={muted}
          loop={loop}
        >
          <source src={src} />
        </audio>
        <div className={cx('Audio-controls')}>
          {controls &&
            controls.map((control: string, index: number) => {
              control = 'render' + upperFirst(control);
              const method:
                | 'renderRates'
                | 'renderPlay'
                | 'renderTime'
                | 'renderProcess'
                | 'renderVolume'
                | 'render' = control as any;
              return (
                <React.Fragment key={index}>{this[method]()}</React.Fragment>
              );
            })}
        </div>
      </div>
    );
  }
}

@Renderer({
  type: 'audio'
})
export class AudioRenderer extends Audio {}
