/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
import React from 'react';
import {buildApi, isApiOutdated, Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {Icon, SearchBox, VirtualList} from 'amis-ui';

const foregroundColors = {
  '30': 'black',
  '31': 'red',
  '32': 'green',
  '33': 'yellow',
  '34': 'blue',
  '35': 'magenta',
  '36': 'cyan',
  '37': 'white',
  '90': 'grey'
} as {[key: string]: string};

const backgroundColors = {
  '40': 'black',
  '41': 'red',
  '42': 'green',
  '43': 'yellow',
  '44': 'blue',
  '45': 'magenta',
  '46': 'cyan',
  '47': 'white'
} as {[key: string]: string};

export type LogOperation =
  | 'stop'
  | 'restart'
  | 'showLineNumber'
  | 'clear'
  | 'filter';

/**
 * 日志展示组件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/log
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
   * 一些可操作选项
   */
  operation?: Array<LogOperation>;

  /**
   * credentials 配置
   */
  credentials?: string;
}

export interface LogProps
  extends RendererProps,
    Omit<LogSchema, 'type' | 'className'> {}

export interface LogState {
  lastLine: string;
  logs: string[];
  originLastLine: string;
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
    originLastLine: '',
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
      lastLine: '',
      originLogs: [],
      originLastLine: ''
    });
    e.preventDefault();
  };

  filterWord = (logs: string[], lastLine: string, word: string) => {
    let originLogs = logs;
    let originLastLine = lastLine;
    if (word !== '' && word !== undefined && word !== null && word.length > 0) {
      logs = logs.filter(line => line.includes(word));
      if (!lastLine.includes(word)) {
        lastLine = '';
      }
    }
    this.setState({
      filterWord: word,
      lastLine: lastLine,
      logs: logs,
      originLogs: originLogs,
      originLastLine: originLastLine
    });
  };

  async loadLogs() {
    const {
      source,
      data,
      env,
      translate: __,
      encoding,
      maxLength,
      credentials = 'include'
    } = this.props;
    // 因为这里返回结果是流式的，和普通 api 请求不一样，如果直接用 fetcher 经过 responseAdaptor 可能会导致出错，所以就直接 fetch 了
    const api = buildApi(source, data);
    if (!api.url) {
      return;
    }
    const res = await fetch(api.url, {
      method: api.method?.toLocaleUpperCase() || 'GET',
      headers: (api.headers as Record<string, string>) || undefined,
      body: api.data ? JSON.stringify(api.data) : undefined,
      credentials: credentials as RequestCredentials
    });
    if (res.status === 200) {
      const body = res.body;
      if (!body) {
        return;
      }
      const reader = body.getReader();
      let lastLine = '';
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
            lastLine += lines[0];
            this.setState({
              lastLine: lastLine
            });
          } else {
            // 将之前的数据补上
            lines[0] = lastLine + lines[0];
            // 最后一个要么是空，要么是下一行的数据
            lastLine = lines.pop() || '';
            if (maxLength) {
              if (logs.length + lines.length > maxLength) {
                logs.splice(0, logs.length + lines.length - maxLength);
              }
            }
            logs = logs.concat(lines);
            this.filterWord(logs, lastLine, this.state.filterWord);
          }
        }

        if (done) {
          this.isDone = true;
          return;
        }
      }
    } else {
      !api.silent &&
        env.notify('error', api?.messages?.failed ?? __('fetchFailed'));
    }
  }

  // 简单支持 ansi 颜色，只支持一行，不支持嵌套
  ansiColrToHtml(line: string) {
    const {disableColor} = this.props;
    if (disableColor === true) {
      return line;
    }
    const match = line.match(/\u001b\[([^m]+)m/);
    if (match) {
      const colorNumber = match[1];
      if (colorNumber) {
        line = line.replace(/\u001b[^m]*?m/g, '');
        if (colorNumber in foregroundColors) {
          return (
            <span style={{color: foregroundColors[colorNumber]}}>{line}</span>
          );
        } else if (colorNumber in backgroundColors) {
          return (
            <span style={{backgroundColor: backgroundColors[colorNumber]}}>
              {line.replace(/\u001b[^m]*?m/g, '')}
            </span>
          );
        }
      }
    }

    return line;
  }

  renderHighlightWord(line: string) {
    const {classnames: cx} = this.props;
    let {filterWord} = this.state;
    if (filterWord === '') {
      return this.ansiColrToHtml(line);
    }
    let items = line.split(filterWord);
    return items.map((item, index) => {
      if (index < items.length - 1) {
        return (
          <span>
            {this.ansiColrToHtml(item)}
            <span className={cx('Log-line-highlight')}>{filterWord}</span>
          </span>
        );
      }
      return item;
    });
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
        {this.renderHighlightWord(line)}
      </div>
    );
  }

  render() {
    const {
      source,
      className,
      style,
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
              {this.renderHighlightWord(logs[index])}
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
      <div className={cx('Log', className)} style={style}>
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
                  onChange={value =>
                    this.filterWord(
                      this.state.originLogs,
                      this.state.lastLine,
                      value
                    )
                  }
                  value={this.state.filterWord}
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
