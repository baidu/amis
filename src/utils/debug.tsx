/**
 * amis 运行时调试功能，为了避免循环引用，这个组件
 */

import React, {Component, useEffect} from 'react';
import cx from 'classnames';
import {findDOMNode, render} from 'react-dom';
import JsonView from 'react-json-view';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {resolveRenderer} from '../factory';
import {uuidv4} from './helper';

class Log {
  @observable level = '';
  @observable msg = '';
  @observable ext? = '';
}

class AMISDebugStore {
  /**
   * 当前 tab
   */
  @observable tab: 'log' | 'inspect' = 'log';

  /**
   * 组件日志
   */
  @observable logs: Log[] = [];

  /**
   * Debug 面板是否展开
   */
  @observable isExpanded = false;

  /**
   * 是否是 inspect 模式，在这个模式下可以查看数据域
   */
  @observable inspectMode = false;
}

const store = new AMISDebugStore();

const LogView = observer(({store}: {store: AMISDebugStore}) => {
  const logs = store.logs;
  return (
    <div className="AMISDebug-log">
      {logs.map((log, index) => {
        return (
          <div className="AMISDebug-logLine" key={`log-${index}`}>
            <div className="AMISDebug-logLineMsg">{log.msg}</div>
            {log.ext ? (
              <JsonView
                src={JSON.parse(log.ext)}
                collapsed={true}
                enableClipboard={false}
                displayDataTypes={false}
                iconStyle="square"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

const AMISDebug = observer(({store}: {store: AMISDebugStore}) => {
  return (
    <div className={cx('AMISDebug', {'is-expanded': store.isExpanded})}>
      <div
        className="AMISDebug-toggle"
        onClick={() => {
          store.isExpanded = !store.isExpanded;
        }}
      >
        <i className="fas fa-bug"></i>
      </div>
      <div className={cx('AMISDebug-content')}>
        <div className="AMISDebug-tab">
          <button
            className={cx({active: store.tab === 'log'})}
            onClick={() => {
              store.tab = 'log';
            }}
          >
            Log
          </button>
          <button
            className={cx({active: store.tab === 'inspect'})}
            onClick={() => {
              store.tab = 'inspect';
            }}
          >
            Inspect
          </button>
        </div>
        {store.tab === 'log' ? (
          <div className="AMISDebug-Log">
            <button
              onClick={() => {
                store.logs = [];
              }}
            >
              Clear Log
            </button>
            <LogView store={store} />
          </div>
        ) : null}
        {store.tab === 'inspect' ? (
          <div className="AMISDebug-inspect">
            <button
              onClick={() => {
                store.inspectMode = true;
              }}
            >
              Inspect
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
});

export let enableAMISDebug = false;

// 开启 debug 有两种方法，一个是设置 enableAMISDebug 全局变量，另一个是通过 amisDebug=1 query
if (
  (window as any).enableAMISDebug ||
  location.search.indexOf('amisDebug=1') !== -1
) {
  enableAMISDebug = true;
  // 页面只有一个
  if (!(window as any).amisDebugElement) {
    const amisDebugElement = document.createElement('div');
    document.body.appendChild(amisDebugElement);
    const element = <AMISDebug store={store} />;
    render(element, amisDebugElement);
    (window as any).amisDebugElement = true;
  }
}

// 存储组件的 props 信息用于 debug
const componentProps = {} as {[propName: string]: any};

export class DebugWrapper extends Component {
  componentDidMount() {
    if (!enableAMISDebug) {
      return;
    }
    const root = findDOMNode(this) as HTMLElement;
    if (!root) {
      return;
    }
    const debugId = uuidv4();
    root.setAttribute('data-debug-id', debugId);
    componentProps[debugId] = this.props;
  }

  render() {
    return this.props.children;
  }
}

/**
 * 一般调试日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
export function debug(msg: string, ext?: object) {
  if (!enableAMISDebug) {
    return;
  }
  const log = {
    level: 'debug',
    msg: msg,
    ext: JSON.stringify(ext)
  };
  console.debug(log);
  store.logs.push(log);
}

/**
 * 警告日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
export function warning(msg: string, ext?: object) {
  if (!enableAMISDebug) {
    return;
  }
  store.logs.push({
    level: 'warn',
    msg: msg,
    ext: JSON.stringify(ext)
  });
}
