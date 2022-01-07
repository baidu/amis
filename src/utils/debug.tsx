/**
 * amis 运行时调试功能，为了避免循环引用，这个组件
 */

import React, {Component, useEffect} from 'react';
import cx from 'classnames';
import {findDOMNode, render} from 'react-dom';
import JsonView from 'react-json-view';
import {autorun, observable} from 'mobx';
import {observer} from 'mobx-react';
import {resolveRenderer} from '../factory';
import {uuidv4} from './helper';
import position from './position';

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

  /**
   * 当前高亮的组件节点 id
   */
  @observable hoverId: string;

  /**
   * 当前选中的组件节点 id
   */
  @observable activeId: string;
}

const store = new AMISDebugStore();

interface ComponentInspect {
  name: string;
  component: any;
}

// 存储组件信息用于 debug
const ComponentInfo = {} as {[propName: string]: ComponentInspect};

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
  const activeId = store.activeId;
  const activeElementInspect = ComponentInfo[activeId];

  if (activeElementInspect?.component) {
    console.debug(
      'click component',
      activeElementInspect?.component,
      activeElementInspect?.component?.props?.store?.data
    );
  }

  let start = activeElementInspect?.component?.props.data || {};
  const stacks = [start];

  while (Object.getPrototypeOf(start) !== Object.prototype) {
    const superData = Object.getPrototypeOf(start);
    if (Object.prototype.toString.call(superData) !== '[object Object]') {
      break;
    }
    stacks.push(superData);
    start = superData;
  }

  console.log('--stacks', stacks);
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
            {activeId ? (
              <>
                <h2>Component: {activeElementInspect.name}</h2>
                <h2>Data</h2>
                {/* <JsonView
                  src={activeElementInspect.data}
                  collapsed={true}
                  enableClipboard={false}
                  displayDataTypes={false}
                  iconStyle="square"
                /> */}
              </>
            ) : (
              'Click element'
            )}
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

/**
 * 鼠标移动到某个组件的效果
 */
function handleMouseMove(e: MouseEvent) {
  if (!store.isExpanded) {
    return;
  }
  const dom = e.target as HTMLElement;
  const target = dom.closest(`[data-debug-id]`);
  if (target) {
    store.hoverId = target.getAttribute('data-debug-id')!;
  }
}

/**
 *  点选某个组件
 */
function handleMouseclick(e: MouseEvent) {
  if (!store.isExpanded) {
    return;
  }
  const dom = e.target as HTMLElement;
  const target = dom.closest(`[data-debug-id]`);
  if (target) {
    store.activeId = target.getAttribute('data-debug-id')!;
    store.tab = 'inspect';
  }
}

// hover 及点击后的高亮
const amisHoverBox = document.createElement('div');
amisHoverBox.className = 'AMISDebug-hoverBox';
const amisActiveBox = document.createElement('div');
amisActiveBox.className = 'AMISDebug-activeBox';

autorun(() => {
  const hoverId = store.hoverId;
  const hoverElement = document.querySelector(
    `[data-debug-id="${hoverId}"]`
  ) as HTMLElement;
  if (hoverElement) {
    const offset = position(hoverElement, document.body);
    amisHoverBox.style.top = `${offset.top}px`;
    amisHoverBox.style.left = `${offset.left}px`;
    amisHoverBox.style.width = `${offset.width}px`;
    amisHoverBox.style.height = `${offset.height}px`;
  }
});

autorun(() => {
  const activeId = store.activeId;
  const activeElement = document.querySelector(
    `[data-debug-id="${activeId}"]`
  ) as HTMLElement;
  if (activeElement) {
    const offset = position(activeElement, document.body);
    amisActiveBox.style.top = `${offset.top}px`;
    amisActiveBox.style.left = `${offset.left}px`;
    amisActiveBox.style.width = `${offset.width}px`;
    amisActiveBox.style.height = `${offset.height}px`;
  }
});

if (enableAMISDebug) {
  document.body.appendChild(amisHoverBox);
  document.body.appendChild(amisActiveBox);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleMouseclick);
}

interface DebugWrapperProps {
  renderer: any;
}

export class DebugWrapper extends Component<DebugWrapperProps> {
  componentDidMount() {
    if (!enableAMISDebug) {
      return;
    }
    const root = findDOMNode(this) as HTMLElement;
    if (!root) {
      return;
    }
    const {renderer} = this.props;
    const debugId = uuidv4();
    root.setAttribute('data-debug-id', debugId);
    ComponentInfo[debugId] = {
      name: renderer.name,
      component: this.props.children
    };
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
