/**
 * @file video
 * @author fex
 */
/* eslint fecs-indent: [0, "space", 2, 2] */

import React from 'react';
import {
  Player,
  Shortcut,
  BigPlayButton,
  ControlBar,
  PlaybackRateMenuButton
} from 'video-react';
import {padArr} from '../utils/helper';
import cx from 'classnames';
import {Renderer, RendererProps} from '../factory';
import {resolveVariable} from '../utils/tpl-builtin';
import {filter} from '../utils/tpl';
// import css
import 'video-react/dist/video-react.css';

const str2seconds: (str: string) => number = str =>
  str
    .split(':')
    .reverse()
    .reduce(
      (seconds, value, index) =>
        seconds + (parseInt(value, 10) || 0) * Math.pow(60, index),
      0
    );

export interface FlvSourceProps {
  src?: string;
  type?: string;
  video?: any;
  config?: object;
  manager?: any;
  isLive?: boolean;
  autoPlay?: boolean;
  actions?: any;
  order?: number;
}

let currentPlaying: any = null;

export class FlvSource extends React.Component<FlvSourceProps, any> {
  flvPlayer: any;
  componentDidMount() {
    let {src, video, config, manager, isLive, autoPlay, actions} = this.props;

    (require as any)(['flv.js'], (flvjs: any) => {
      // load hls video source base on hls.js
      if (flvjs.isSupported()) {
        video = video || (manager.video && manager.video.video);

        let flvPlayer = flvjs.createPlayer(
          {
            type: 'flv',
            url: src,
            isLive: isLive
          },
          config
        );
        flvPlayer.attachMediaElement(video);
        this.flvPlayer = flvPlayer;
        let loaded = false;
        let timer: any;

        manager.subscribeToOperationStateChange((operation: any) => {
          const type = operation.operation.action;

          if (type === 'play') {
            clearTimeout(timer);
            if (!loaded) {
              loaded = true;
              flvPlayer.load();
            }

            flvPlayer.play();
          } else if (type === 'pause') {
            flvPlayer.pause();

            if (isLive) {
              timer = setTimeout(() => {
                actions.seek(0);
                flvPlayer.unload();
                loaded = false;
              }, 30000);
            }
          }
        });

        flvPlayer.on(flvjs.Events.RECOVERED_EARLY_EOF, () => {
          alert('直播已经结束');
        });
        flvPlayer.on(flvjs.Events.ERROR, () => {
          alert('视频加载失败');
        });

        if (autoPlay) {
          setTimeout(() => actions.play(), 200);
        }
      }
    });
  }

  componentWillUnmount() {
    if (this.flvPlayer) {
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
    }
  }

  render() {
    return (
      <source src={this.props.src} type={this.props.type || 'video/x-flv'} />
    );
  }
}

export interface HlsSourceProps {
  src?: string;
  type?: string;
  video?: any;
  config?: object;
  manager?: any;
  isLive?: boolean;
  autoPlay?: boolean;
  actions?: any;
  order?: number;
}
export class HlsSource extends React.Component<HlsSourceProps, any> {
  hls: any;
  componentDidMount() {
    let {src, video, config, manager, isLive, autoPlay, actions} = this.props;

    (require as any)(['hls.js'], (Hls: any) => {
      // load hls video source base on hls.js
      if (Hls.isSupported()) {
        video = video || (manager.video && manager.video.video);

        let hls = (this.hls = new Hls({
          autoStartLoad: false
        }));
        hls.attachMedia(video);
        hls.loadSource(src);

        let loaded = false;

        manager.subscribeToOperationStateChange((operation: any) => {
          const type = operation.operation.action;

          if (type === 'play') {
            if (!loaded) {
              loaded = true;
              hls.startLoad();
            }

            video.play();
          } else if (type === 'pause') {
            video.pause();
            hls.stopLoad();
            loaded = false;
          }
        });

        autoPlay && setTimeout(actions.play, 200);
      }
    });
  }

  componentWillUnmount() {
    if (this.hls) {
      this.hls.stopLoad();
      this.hls.detachMedia();
    }
  }

  render() {
    return (
      <source
        src={this.props.src}
        type={this.props.type || 'application/x-mpegURL'}
      />
    );
  }
}

export interface VideoProps extends RendererProps {
  className?: string;
  columnsCount?: number;
  isLive?: boolean;
  jumpFrame?: boolean;
  src?: string;
}

export interface VideoState {
  posterInfo?: any;
  videoState?: any;
}

export default class Video extends React.Component<VideoProps, VideoState> {
  static defaultProps = {
    columnsCount: 8,
    isLive: false,
    jumpFrame: true,
    aspectRatio: 'auto'
  };

  frameDom: any;
  cursorDom: any;
  player: any;
  times: Array<number>;
  currentIndex: number;
  constructor(props: VideoProps) {
    super(props);

    this.state = {
      posterInfo: null,
      videoState: {}
    };

    this.frameRef = this.frameRef.bind(this);
    this.cursorRef = this.cursorRef.bind(this);
    this.playerRef = this.playerRef.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onImageLoaded(e: Event) {
    let image: any = new Image();
    image.onload = () => {
      this.setState({
        posterInfo: {
          width: image.width,
          height: image.height
        }
      });
      image = image.onload = null;
    };
    image.src = (e.target as HTMLElement).getAttribute('src');
  }

  frameRef(dom: any) {
    this.frameDom = dom;
  }

  cursorRef(dom: any) {
    this.cursorDom = dom;
  }

  playerRef(player: any) {
    this.player = player;

    if (!player) {
      return;
    }

    player.subscribeToStateChange((state: any) => {
      this.setState({
        videoState: state
      });

      if (!state.paused) {
        if (
          currentPlaying &&
          currentPlaying.video &&
          currentPlaying !== player
        ) {
          currentPlaying.pause();
        }

        currentPlaying = player;
      }

      if (!this.frameDom || !this.times) {
        return;
      }

      let index = 0;
      const times = this.times;
      const len = times.length;
      while (index < len) {
        if (
          times[index - 1] &&
          state.currentTime <=
            times[index + 1] - (times[index + 1] - times[index]) / 2
        ) {
          break;
        } else if (state.currentTime <= times[index]) {
          break;
        }

        index++;
      }

      if (this.currentIndex !== index) {
        this.moveCursorToIndex(index);
      }
    });
  }

  moveCursorToIndex(index: number) {
    const {classPrefix: ns} = this.props;
    if (!this.frameDom || !this.cursorDom) {
      return;
    }
    const items = this.frameDom.querySelectorAll(`.${ns}Video-frame`);

    if (items && items.length && items[index]) {
      this.currentIndex = index;
      const item = items[index];
      const frameRect = this.frameDom.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      this.cursorDom.setAttribute(
        'style',
        `width: ${rect.width - 4}px; height: ${rect.height -
          4}px; left: ${rect.left + 2 - frameRect.left}px; top: ${rect.top +
          2 -
          frameRect.top}px;`
      );
    }
  }

  jumpToIndex(index: number) {
    if (!this.times || !this.player || !this.props.jumpFrame) {
      return;
    }
    const times = this.times;
    const player = this.player;

    player.seek(times[index] - (times[index] - (times[index - 1] || 0)) / 2);
    player.play();
  }

  onClick(e: Event) {
    // 避免把所在 form 给提交了。
    e.preventDefault();
  }

  renderFrames() {
    let {
      frames,
      framesClassName,
      columnsCount,
      data,
      jumpFrame,
      classPrefix: ns
    } = this.props;

    if (typeof frames === 'string' && frames[0] === '$') {
      frames = resolveVariable(frames, data);
    }

    if (!frames) {
      return null;
    }

    const items: Array<object> = [];
    const times: Array<number> = (this.times = []);
    Object.keys(frames).forEach(time => {
      if (!frames[time]) {
        return;
      }

      times.push(str2seconds(time));

      items.push({
        time: time,
        src: frames[time]
      });
    });

    if (!items.length) {
      return null;
    }

    return (
      <div
        className={cx(`pos-rlt ${ns}Video-frameList`, framesClassName)}
        ref={this.frameRef}
      >
        {padArr(items, columnsCount).map((items, i) => {
          let restCount = (columnsCount as number) - items.length;
          let blankArray = [];

          while (restCount--) {
            blankArray.push('');
          }

          return (
            <div className="pull-in-xxs" key={i}>
              <div className={`${ns}Hbox ${ns}Video-frameItem`}>
                {items.map((item, key) => (
                  <div
                    className={`${ns}Hbox-col Wrapper--xxs ${ns}Video-frame`}
                    key={key}
                    onClick={() =>
                      this.jumpToIndex(i * (columnsCount as number) + key)
                    }
                  >
                    <img className="w-full" alt="poster" src={item.src} />
                    <div className={`${ns}Text--center`}>{item.time}</div>
                  </div>
                ))}

                {/* 补充空白 */ restCount
                  ? blankArray.map((_, index) => (
                      <div
                        className={`${ns}Hbox-col Wrapper--xxs`}
                        key={`blank_${index}`}
                      />
                    ))
                  : null}
              </div>
            </div>
          );
        })}
        {jumpFrame ? (
          <span ref={this.cursorRef} className={`${ns}Video-cursor`} />
        ) : null}
      </div>
    );
  }

  renderPlayer() {
    let {
      poster,
      autoPlay,
      muted,
      name,
      data,
      amisConfig,
      locals,
      isLive,
      minVideoDuration,
      videoType,
      playerClassName,
      classPrefix: ns,
      aspectRatio,
      rates
    } = this.props;

    let source =
      this.props.src ||
      (name && data && (data as any)[name]) ||
      (amisConfig && amisConfig.value);
    const videoState = this.state.videoState;
    let highlight =
      videoState.duration &&
      minVideoDuration &&
      videoState.duration < minVideoDuration;
    let src = filter(source, data, '| raw');
    let sourceNode;

    if (
      (src && /\.flv(?:$|\?)/.test(src) && isLive) ||
      videoType === 'video/x-flv'
    ) {
      sourceNode = (
        <FlvSource
          autoPlay={autoPlay}
          order={999.0}
          isLive={isLive}
          src={src}
        />
      );
    } else if (
      (src && /\.m3u8(?:$|\?)/.test(src)) ||
      videoType === 'application/x-mpegURL'
    ) {
      sourceNode = <HlsSource autoPlay={autoPlay} order={999.0} src={src} />;
    } else {
      sourceNode = <source src={src} />;
    }

    return (
      <div className={playerClassName}>
        <Player
          ref={this.playerRef}
          poster={filter(poster, data, '| raw')}
          src={src}
          autoPlay={autoPlay}
          muted={muted}
          aspectRatio={aspectRatio}
        >
          {rates && rates.length ? (
            <ControlBar>
              <PlaybackRateMenuButton rates={rates} order={7.1} />
            </ControlBar>
          ) : null}
          <BigPlayButton position="center" />
          {sourceNode}
          <Shortcut disabled />
        </Player>

        {highlight ? (
          <p className={`m-t-xs ${ns}Text--danger`}>
            视频时长小于 {minVideoDuration} 秒
          </p>
        ) : null}
      </div>
    );
  }

  renderPosterAndPlayer() {
    let {poster, data, locals, minPosterDimension, classnames: cx} = this.props;
    const posterInfo = this.state.posterInfo || {};
    let dimensionClassName = '';

    if (
      posterInfo &&
      minPosterDimension &&
      (minPosterDimension.width || minPosterDimension.height) &&
      (minPosterDimension.width > posterInfo.width ||
        minPosterDimension.height > posterInfo.height)
    ) {
      dimensionClassName = `Text--danger`;
    }

    return (
      <div className="pull-in-xs">
        <div className={cx('Hbox')}>
          <div className={cx('Hbox-col')}>
            <div className={cx('Wrapper Wrapper--xs')}>
              <img
                onLoad={this.onImageLoaded as any}
                className="w-full"
                alt="poster"
                src={filter(poster, data, '| raw')}
              />
              <p className="m-t-xs">
                封面{' '}
                <span className={dimensionClassName}>
                  {posterInfo.width || '-'} x {posterInfo.height || '-'}
                </span>
                {dimensionClassName ? (
                  <span>
                    {' '}
                    封面尺寸小于{' '}
                    <span className={cx('Text--danger')}>
                      {minPosterDimension.width || '-'} x{' '}
                      {minPosterDimension.height || '-'}
                    </span>
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <div className={cx('Hbox-col')}>
            <div className={cx('Wrapper Wrapper--xs')}>
              {this.renderPlayer()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let {splitPoster, className, classPrefix: ns} = this.props;

    return (
      <div
        className={cx(`${ns}Video`, className)}
        onClick={this.onClick as any}
      >
        {this.renderFrames()}
        {splitPoster ? this.renderPosterAndPlayer() : this.renderPlayer()}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)video$/,
  name: 'video'
})
export class VideoRenderer extends Video {}
