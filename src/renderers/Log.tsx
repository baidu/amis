/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import Ansi from 'ansi-to-react';
import {buildApi, isApiOutdated} from '../utils/api';
import VirtualList from '../components/virtual-list';
import Button from '../components/Button';
import {
  InputClearIcon,
  LeftArrowIcon,
  MinusIcon,
  PauseIcon,
  PlusIcon,
  ReloadIcon,
  RightArrowIcon
} from '../components/icons';

export type LogOperation = 'stop' | 'restart' | 'showLineNumber' | 'clear';

/**
 * 日志展示组件
 * 文档：https://baidu.gitee.io/amis/docs/components/log
 */
export interface LogSchema extends BaseSchema {
  /**
   * 指定为 log 链接展示控件
   */
  type: 'log';

  /**
   * 自定义 CSS 类名
   */
  className?: string;

  /**
   * 获取日志的地址
   */
  source: string;

  /**
   * 控件高度
   */
  height?: number;

  /**
   * 是否自动滚动到最底部
   */
  autoScroll?: boolean;

  /**
   * 返回内容字符编码
   */
  encoding?: string;

  /**
   * 限制最大日志数量
   */
  maxLength?: number;

  /**
   * 每行高度
   */
  rowHeight?: number;

  /**
   * 关闭 ANSI 颜色支持
   */
  disableColor?: boolean;

  /**
   * 一些可操作选项
   */
  operation?: Array<LogOperation>;
}

export interface LogProps
  extends RendererProps,
    Omit<LogSchema, 'type' | 'className'> {}

export interface LogState {
  lastLine: string;
  logs: string[];
  refresh: boolean;
  showLineNumber: boolean;
  showOperation: boolean;
}

export class Log extends React.Component<LogProps, LogState> {
  static defaultProps = {
    height: 500,
    autoScroll: true,
    placeholder: 'loading',
    encoding: 'utf-8'
  };

  isDone: boolean = false;

  autoScroll: boolean = false;

  logRef: React.RefObject<HTMLDivElement>;

  state: LogState = {
    lastLine: '',
    logs: [],
    refresh: true,
    showLineNumber: false,
    showOperation: false
  };

  constructor(props: LogProps) {
    super(props);
    this.logRef = React.createRef();
    this.autoScroll = props.autoScroll || false;
    this.pauseOrResumeScrolling = this.pauseOrResumeScrolling.bind(this);
  }

  componentWillUnmount() {
    if (this.logRef && this.logRef.current) {
      this.logRef.current.removeEventListener(
        'scroll',
        this.pauseOrResumeScrolling
      );
    }
  }

  componentDidMount() {
    if (this.autoScroll && this.logRef && this.logRef.current) {
      this.logRef.current.addEventListener(
        'scroll',
        this.pauseOrResumeScrolling
      );
    }
    if (this.props.source) {
      this.loadLogs();
    }
  }

  componentDidUpdate(prevProps: LogProps) {
    if (this.autoScroll && this.logRef && this.logRef.current) {
      this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
    }
    if (
      isApiOutdated(
        prevProps.source,
        this.props.source,
        prevProps.data,
        this.props.data
      )
    ) {
      this.loadLogs();
    }
  }

  // 如果向上滚动就停止自动滚动，除非滚到底部
  pauseOrResumeScrolling() {
    if (this.logRef && this.logRef.current) {
      const {scrollHeight, scrollTop, offsetHeight} = this.logRef.current;
      this.autoScroll = scrollHeight - (scrollTop + offsetHeight) < 50;
    }
  }

  refresh = () => {
    let origin = this.state.refresh;
    this.setState({
      refresh: !origin
    });
    if (!origin) {
      this.clear();
      this.loadLogs();
    }
  };

  clear = () => {
    this.setState({
      logs: [],
      lastLine: ''
    });
  };

  changeShowLineNumber = () => {
    this.setState({
      showLineNumber: !this.state.showLineNumber
    });
  };

  changeShowOperation = () => {
    this.setState({
      showOperation: !this.state.showOperation
    });
  };

  async loadLogs() {
    const {source, data, env, translate: __, encoding, maxLength} = this.props;
    // 因为这里返回结果是流式的，和普通 api 请求不一样，如果直接用 fetcher 经过 responseAdaptor 可能会导致出错，所以就直接 fetch 了
    const api = buildApi(source, data);
    if (!api.url) {
      return;
    }
    const res = await fetch(api.url, {
      method: api.method?.toLocaleUpperCase() || 'GET',
      headers: (api.headers as Record<string, string>) || undefined,
      body: api.data ? JSON.stringify(api.data) : undefined,
      credentials: 'include'
    });
    if (res.status === 200) {
      const body = res.body;
      if (!body) {
        return;
      }
      const reader = body.getReader();
      let lastline = '';
      let logs: string[] = [];
      for (;;) {
        if (!this.state.refresh) {
          await reader.cancel('click cancel button').then(() => {
            this.props.env.notify('success', '日志已经停止刷新');
            return;
          });
        }
        let {done, value} = await reader.read();
        if (value) {
          let text = new TextDecoder(encoding).decode(value, {stream: true});
          // 不考虑只有 \r 换行符的情况，几乎没人用
          const lines = text.split('\n');
          // 如果没有换行符就只更新最后一行
          if (lines.length === 1) {
            lastline += lines[0];
            this.setState({
              lastLine: lastline
            });
          } else {
            // 将之前的数据补上
            lines[0] = lastline + lines[0];
            // 最后一个要么是空，要么是下一行的数据
            lastline = lines.pop() || '';
            if (maxLength) {
              if (logs.length + lines.length > maxLength) {
                logs.splice(0, logs.length + lines.length - maxLength);
              }
            }
            logs = logs.concat(lines);
            this.setState({
              logs: logs,
              lastLine: lastline
            });
          }
        }

        if (done) {
          this.isDone = true;
          return;
        }
      }
    } else {
      env.notify('error', __('fetchFailed'));
    }
  }

  /**
   * 渲染某一行
   */
  renderLine(index: number, line: string, showLineNumber: boolean) {
    const {classnames: cx, disableColor} = this.props;
    return (
      <div className={cx('Log-line')} key={index}>
        {showLineNumber && (
          <span className={cx('Log-line-number')}>{index + 1} </span>
        )}
        {disableColor ? line : <Ansi useClasses>{line}</Ansi>}
      </div>
    );
  }

  render() {
    const {
      source,
      className,
      classnames: cx,
      placeholder,
      height,
      rowHeight,
      disableColor,
      translate: __,
      operation,
      env
    } = this.props;

    const {refresh, showLineNumber, showOperation} = this.state;

    let loading = __(placeholder);

    if (!source) {
      loading = __('Log.mustHaveSource');
    }
    let lines: any;

    const logs = this.state.lastLine
      ? this.state.logs.concat([this.state.lastLine])
      : this.state.logs;

    // 如果设置 rowHeight 就开启延迟渲染
    const useVirtualRender = rowHeight;

    if (useVirtualRender) {
      lines = (
        <VirtualList
          height={height as number}
          itemCount={logs.length}
          itemSize={rowHeight}
          renderItem={({index, style}) => (
            <div
              className={cx('Log-line')}
              key={index}
              style={{...style, whiteSpace: 'nowrap'}}
            >
              {showLineNumber && (
                <span className={cx('Log-line-number')}>{index + 1} </span>
              )}
              {disableColor ? (
                logs[index]
              ) : (
                <Ansi useClasses>{logs[index]}</Ansi>
              )}
            </div>
          )}
        />
      );
    } else {
      lines = logs.map((line, index) => {
        return this.renderLine(index, line, showLineNumber);
      });
    }

    return (
      <div className={cx('Log', className)}>
        <div
          ref={this.logRef}
          className={cx('Log-body')}
          style={{height: useVirtualRender ? 'auto' : height}}
        >
          {useVirtualRender ? lines : lines.length ? lines : loading}
        </div>
        <div className={cx('Log-operation')}>
          {operation &&
            operation?.length > 0 &&
            (showOperation ? (
              <>
                {operation.includes('stop') && (
                  <Button
                    size="sm"
                    title="停止"
                    disabled={!refresh}
                    onClick={this.refresh}
                  >
                    <PauseIcon />
                  </Button>
                )}

                {operation.includes('restart') && (
                  <Button
                    size="sm"
                    title="重新加载数据"
                    disabled={refresh}
                    onClick={this.refresh}
                  >
                    <ReloadIcon />
                  </Button>
                )}

                {operation.includes('showLineNumber') && (
                  <Button
                    size="sm"
                    title={showLineNumber ? '关闭行数显示' : '显示行数'}
                    onClick={this.changeShowLineNumber}
                  >
                    {showLineNumber ? <MinusIcon /> : <PlusIcon />}
                  </Button>
                )}

                {operation.includes('clear') && (
                  <Button size="sm" title={'清屏'} onClick={this.clear}>
                    <InputClearIcon />
                  </Button>
                )}

                <Button
                  size="sm"
                  title={'收起工具栏'}
                  onClick={this.changeShowOperation}
                >
                  <LeftArrowIcon />
                </Button>
              </>
            ) : (
              <div
                title={'展开工具栏'}
                className={cx('Log-operation-hidden')}
                onClick={this.changeShowOperation}
              >
                <RightArrowIcon />
              </div>
            ))}
        </div>
      </div>
    );
  }
}

@Renderer({
  type: 'log'
})
export class LogRenderer extends Log {}
