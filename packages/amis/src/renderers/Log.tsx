/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
import React from 'react';
import {buildApi, isApiOutdated, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import Ansi from 'ansi-to-react';
import {Icon, SearchBox, VirtualList} from 'amis-ui';

export type LogOperation =
  | 'stop'
  | 'restart'
  | 'showLineNumber'
  | 'clear'
  | 'filter';

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
  originLogs: string[];
  refresh: boolean;
  showLineNumber: boolean;
  filterWord: string;
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
    originLogs: [],
    refresh: true,
    showLineNumber: false,
    filterWord: ''
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

  refresh = (e: React.MouseEvent<HTMLElement>) => {
    let origin = this.state.refresh;
    this.setState({
      refresh: !origin
    });
    if (!origin) {
      this.clear(e);
      this.loadLogs();
    }
    e.preventDefault();
  };

  clear = (e: React.MouseEvent<HTMLElement>) => {
    this.setState({
      logs: [],
      lastLine: ''
    });
    e.preventDefault();
  };

  changeFilterWord = (value: string) => {
    let logs = this.state.originLogs;
    if (
      value !== '' &&
      value !== undefined &&
      value !== null &&
      value.length > 0
    ) {
      logs = logs.filter(line => line.includes(value));
    }

    this.setState({
      filterWord: value,
      logs: logs
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
              originLogs: logs,
              lastLine: lastline
            });
          }
        }

        this.changeFilterWord(this.state.filterWord);

        if (done) {
          this.isDone = true;
          return;
        }
      }
    } else {
      env.notify('error', __('fetchFailed'));
    }
  }

  renderHighlightWord(line: string) {
    const {classnames: cx} = this.props;
    let {filterWord} = this.state;
    if (filterWord === '') {
      return line;
    }
    let items = line.split(filterWord);
    return items.map((item, index) => {
      if (index < items.length - 1) {
        return (
          <span>
            {item}
            <span className={cx('Log-line-highlight')}>{filterWord}</span>
          </span>
        );
      }
      return item;
    });
  }

  renderHighlightWordWithAnsi(line: string) {
    let {filterWord} = this.state;
    if (filterWord === '') {
      return line;
    }
    return line.replaceAll(
      filterWord,
      `\u001b[43;1m\u001b[30;1m${filterWord}\u001b[0m`
    );
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
        {disableColor ? (
          this.renderHighlightWord(line)
        ) : (
          <Ansi useClasses>{this.renderHighlightWordWithAnsi(line)}</Ansi>
        )}
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
      operation
    } = this.props;

    const {refresh, showLineNumber} = this.state;

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
                this.renderHighlightWord(logs[index])
              ) : (
                <Ansi useClasses>
                  {this.renderHighlightWordWithAnsi(logs[index])}
                </Ansi>
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
        <div className={cx('Log-operation')}>
          {operation && operation?.length > 0 && (
            <>
              {operation.includes('stop') && (
                <a
                  title={__('stop')}
                  className={!refresh ? 'is-disabled' : ''}
                  onClick={this.refresh}
                >
                  <Icon icon="pause" />
                </a>
              )}

              {operation.includes('restart') && (
                <a
                  title={__('reload')}
                  className={refresh ? 'is-disabled' : ''}
                  onClick={this.refresh}
                >
                  <Icon icon="refresh" />
                </a>
              )}

              {operation.includes('showLineNumber') && (
                <a
                  title={
                    showLineNumber
                      ? __('Log.notShowLineNumber')
                      : __('Log.showLineNumber')
                  }
                  onClick={e => {
                    this.setState({showLineNumber: !showLineNumber});
                    e.preventDefault();
                  }}
                >
                  <Icon icon={showLineNumber ? 'invisible' : 'view'} />
                </a>
              )}

              {operation.includes('clear') && (
                <a onClick={this.clear} title={__('clear')}>
                  <Icon icon="remove" />
                </a>
              )}

              {operation && operation.includes('filter') && (
                <SearchBox
                  className={cx('Log-filter-box')}
                  placeholder="过滤词"
                  onChange={this.changeFilterWord}
                />
              )}
            </>
          )}
        </div>
        <div
          ref={this.logRef}
          className={cx('Log-body')}
          style={{height: useVirtualRender ? 'auto' : height}}
        >
          {useVirtualRender ? lines : lines.length ? lines : loading}
        </div>
      </div>
    );
  }
}

@Renderer({
  type: 'log'
})
export class LogRenderer extends Log {}
