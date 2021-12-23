/**
 * amis 运行时调试功能
 */

import React from 'react';
import cx from 'classnames';
import {render} from 'react-dom';
import JsonView from 'react-json-view';
import {observable} from 'mobx';
import {observer} from 'mobx-react';

class Log {
  @observable level = '';
  @observable msg = '';
  @observable ext? = '';
}

class AMISDebugStore {
  @observable logs: Log[] = [];
  @observable isExpanded = false;
}

const store = new AMISDebugStore();

const RenderLog = observer(({store}: {store: AMISDebugStore}) => {
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
        <div className="AMISDebug-buttonGroup">
          <button
            onClick={() => {
              store.logs = [];
            }}
            title="clear log"
          >
            clear <i className="fas fa-trash"></i>
          </button>
        </div>
        <RenderLog store={store} />
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
