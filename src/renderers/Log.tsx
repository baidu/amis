/**
 * @file 用于显示日志的组件，比如显示命令行的输出结果
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaTpl} from '../Schema';
import Ansi from 'ansi-to-react';
import {filter} from '../utils/tpl';

/**
 * 日志展示组件
 * 文档：https://baidu.gitee.io/amis/docs/components/log
 */
export interface LogSchema extends BaseSchema {
  /**
   * 指定为 link 链接展示控件
   */
  type: 'log';

  /**
   * 自定义 CSS 类名
   */
  className?: string;

  /**
   * 获取日志的地址
   */
  url: string;

  /**
   * 控件高度
   */
  height?: number;

  /**
   * 是否自动滚动到最底部
   */
  autoScroll?: boolean;
}

export interface LogProps extends RendererProps, LogSchema {}

export interface LogState {
  logs: string[];
}

export class Log extends React.Component<LogProps, LogState> {
  static defaultProps = {
    height: 500,
    autoScroll: true,
    placeholder: 'loading'
  };

  isDone: boolean = false;

  autoScroll: boolean = false;

  logRef: React.RefObject<HTMLDivElement>;

  state: LogState = {
    logs: []
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
    this.loadLogs();
  }

  componentDidUpdate() {
    if (this.autoScroll && this.logRef && this.logRef.current) {
      this.logRef.current.scrollTop = this.logRef.current.scrollHeight;
    }
  }

  // 如果向上滚动就停止自动滚动，除非滚到底部
  pauseOrResumeScrolling() {
    if (this.logRef && this.logRef.current) {
      const {scrollHeight, scrollTop, offsetHeight} = this.logRef.current;
      this.autoScroll = scrollHeight - (scrollTop + offsetHeight) < 50;
    }
  }

  async loadLogs() {
    const {url} = this.props;
    const res = await fetch(url);
    if (res.status === 200) {
      const body = res.body;
      if (!body) {
        return;
      }
      const reader = body.getReader();
      let lastline = '';
      for (;;) {
        let {done, value} = await reader.read();
        if (value) {
          let text = new TextDecoder('utf-8').decode(value, {stream: true});
          // 不考虑只有 \r 换行符的情况，几乎没人用
          const lines = text.split('\n');
          // 如果没有换行符
          if (lines.length === 1) {
            // 如果之前最后一行是空的或者目前没内容，就新增一行
            if (lastline === '' || this.state.logs.length === 0) {
              lastline = lines[0];
              this.setState({
                logs: this.state.logs.concat(lastline)
              });
            } else {
              lastline += lines[0];
              const logs = this.state.logs;
              logs[logs.length - 1] = lastline;
              this.setState({
                logs: logs
              });
            }
          } else {
            // 如果最后一个字符是换行符就直接去掉最后一个数组
            if (text.length > 1 && text.endsWith) {
              lines.pop();
            }
            // 将之前的数据补上
            lines[0] = lastline + lines[0];
            // 如果之前有值，需要去掉最后一行
            const logs = this.state.logs;
            if (lastline !== '') {
              logs.pop();
            }
            this.setState({
              logs: logs.concat(lines)
            });
            lastline = '';
          }
        }

        if (done) {
          this.isDone = true;
          return;
        }
      }
    } else {
    }
  }

  render() {
    const {
      className,
      classnames: cx,
      render,
      placeholder,
      height,
      translate: __
    } = this.props;

    const lines = this.state.logs.map((line, index) => {
      return (
        <div className={cx('Log-line')} key={index}>
          <Ansi useClasses>{line}</Ansi>
        </div>
      );
    });

    return (
      <div
        ref={this.logRef}
        className={cx('Log', className)}
        style={{height: height}}
      >
        {lines.length ? lines : __(placeholder)}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)log$/,
  name: 'log'
})
export class LogRenderer extends Log {}
