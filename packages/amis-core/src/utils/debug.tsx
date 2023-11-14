/**
 * amis 运行时调试功能，为了避免循环引用，这个组件不要依赖 amis 里的组件
 */

import React, {Component, useEffect, useRef, useState, version} from 'react';
import cx from 'classnames';
import {findDOMNode, render, unmountComponentAtNode} from 'react-dom';
// import {createRoot} from 'react-dom/client';
import {autorun, observable} from 'mobx';
import {observer} from 'mobx-react';
import {uuidv4, importLazyComponent} from './helper';
import position from './position';

export const JsonView = React.lazy(() =>
  import('react-json-view').then(importLazyComponent)
);

class Log {
  @observable cat = '';
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
   * 显示位置，默认在右边
   */
  @observable position: 'left' | 'right' = 'right';

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

  /**
   * 字段值文本最大展示长度
   */
  @observable ellipsisThreshold: number;
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
  const ellipsisThreshold = store.ellipsisThreshold ?? 50;

  return (
    <>
      {logs.map((log, index) => {
        return (
          <div className="AMISDebug-logLine" key={`log-${index}`}>
            <div className="AMISDebug-logLineMsg">
              [{log.cat}] {log.msg}
            </div>
            {log.ext ? (
              <React.Suspense fallback={<div>Loading...</div>}>
                <JsonView
                  name={null}
                  theme="monokai"
                  src={JSON.parse(log.ext)}
                  collapsed={true}
                  enableClipboard={false}
                  displayDataTypes={false}
                  collapseStringsAfterLength={ellipsisThreshold}
                  iconStyle="square"
                />
              </React.Suspense>
            ) : null}
          </div>
        );
      })}
    </>
  );
});

const AMISDebug = observer(({store}: {store: AMISDebugStore}) => {
  const activeId = store.activeId;
  const activeComponentInspect = ComponentInfo[activeId];

  // 收集数据域里的数据
  let start = activeComponentInspect?.component?.props?.data || {};
  const stacks = [start];

  while (Object.getPrototypeOf(start) !== Object.prototype) {
    const superData = Object.getPrototypeOf(start);
    if (Object.prototype.toString.call(superData) !== '[object Object]') {
      break;
    }
    stacks.push(superData);
    start = superData;
  }

  const stackDataView = [];
  if (Object.keys(stacks[0]).length || stacks.length > 1) {
    let level = 0;
    for (const stack of stacks) {
      stackDataView.push(
        <div key={`data-${level}`}>
          <h3>Data Level-{level}</h3>
          <React.Suspense fallback={<div>Loading...</div>}>
            <JsonView
              key={`dataview-${stack}`}
              name={null}
              theme="monokai"
              src={stack}
              collapsed={level === 0 ? false : true}
              enableClipboard={false}
              displayDataTypes={false}
              iconStyle="square"
            />
          </React.Suspense>
        </div>
      );
      level += 1;
    }
  }

  const panelRef = useRef(null);

  const [isResizing, setResizing] = useState(false);

  const [startX, setStartX] = useState(0);

  const [panelWidth, setPanelWidth] = useState(0);

  useEffect(() => {
    const handleMouseUp = () => {
      setResizing(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) {
        return;
      }
      const xOffset =
        store.position === 'right' ? e.clientX - startX : startX - e.clientX;
      const panel = panelRef.current! as HTMLElement;
      const targetWidth = Math.max(200, panelWidth - xOffset);
      panel.style.width = targetWidth + 'px';
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
      e.cancelBubble = true;
      return false;
    };
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (isResizing) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [isResizing]);

  return (
    <div
      className={cx('AMISDebug', {
        'is-expanded': store.isExpanded,
        'is-left': store.position === 'left'
      })}
      ref={panelRef}
    >
      <div
        className="AMISDebug-toggle"
        title="open debug"
        onClick={() => {
          store.isExpanded = true;
        }}
      >
        {store.isExpanded ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-bug"></i>
        )}
      </div>
      <div className={cx('AMISDebug-content')}>
        <div
          className="AMISDebug-close"
          title="Close"
          onClick={() => {
            store.isExpanded = false;
            store.activeId = '';
            store.hoverId = '';
          }}
        >
          <i className="fas fa-times" />
        </div>
        <div
          className="AMISDebug-resize"
          onMouseDown={event => {
            setStartX(event.clientX);
            setPanelWidth(
              parseInt(
                getComputedStyle(panelRef.current!).getPropertyValue('width'),
                10
              )
            );
            setResizing(true);
          }}
        ></div>
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
        <div className="AMISDebug-changePosition">
          {store.position === 'right' ? (
            <i
              className="fas fa-chevron-left"
              title="move to left"
              onClick={() => {
                store.position = 'left';
              }}
            />
          ) : (
            <i
              className="fas fa-chevron-right"
              title="move to right"
              onClick={() => {
                store.position = 'right';
              }}
            />
          )}
        </div>
        {store.tab === 'log' ? (
          <div className="AMISDebug-log">
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
                <h3>
                  Component:{' '}
                  <span className="primary">{activeComponentInspect.name}</span>
                </h3>
                {stackDataView}
              </>
            ) : (
              'Click component to display inspect'
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
});

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
  if (target && !target.closest('.AMISDebug')) {
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
  } else {
    amisHoverBox.style.top = '-999999px';
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
  } else {
    amisActiveBox.style.top = '-999999px';
  }
});

// 页面中只能有一个实例
let isEnabled = false;
let unmount: () => void;

export function enableDebug() {
  if (isEnabled) {
    return;
  }
  isEnabled = true;

  const amisDebugElement = document.createElement('div');
  document.body.appendChild(amisDebugElement);
  const element = <AMISDebug store={store} />;

  // if (parseInt(version.split('.')[0], 10) >= 18) {
  //   const root = createRoot(amisDebugElement);
  //   root.render(element);
  //   unmount = () => {
  //     root.unmount();
  //     document.body.removeChild(amisDebugElement);
  //   };
  // } else {
  render(element, amisDebugElement);
  unmount = () => {
    unmountComponentAtNode(amisDebugElement);
    document.body.removeChild(amisDebugElement);
  };
  // }

  document.body.appendChild(amisHoverBox);
  document.body.appendChild(amisActiveBox);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('click', handleMouseclick);
}

export function disableDebug() {
  if (!isEnabled) {
    return;
  }
  isEnabled = false;
  unmount?.();
  document.body.removeChild(amisHoverBox);
  document.body.removeChild(amisActiveBox);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('click', handleMouseclick);
}

interface DebugWrapperProps {
  renderer: any;
  children?: React.ReactNode;
}

export class DebugWrapper extends Component<DebugWrapperProps> {
  debugId: string = uuidv4();
  componentDidMount() {
    const root = findDOMNode(this) as HTMLElement;
    if (!root) {
      return;
    }
    const {renderer} = this.props;
    root.setAttribute('data-debug-id', this.debugId);
    ComponentInfo[this.debugId] = {
      name: renderer.name,
      component: this.props.children
    };
  }

  componentDidUpdate(prevProps: DebugWrapperProps) {
    const {renderer} = this.props;
    if (!ComponentInfo[this.debugId]) {
      return;
    }
    ComponentInfo[this.debugId] = {
      name: renderer.name,
      component: this.props.children
    };
  }

  componentWillUnmount() {
    delete ComponentInfo[this.debugId];
  }

  render() {
    return this.props.children;
  }
}

type Category = 'api' | 'event';

/**
 * 一般调试日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
export function debug(cat: Category, msg: string, ext?: object) {
  if (!isEnabled) {
    return;
  }

  console.groupCollapsed('[amis debug]', msg);
  console.debug(ext);
  console.groupEnd();

  const log = {
    cat,
    level: 'debug',
    msg: msg,
    ext: JSON.stringify(ext)
  };
  store.logs.push(log);
}

/**
 * 警告日志
 * @param msg 简单消息
 * @param ext 扩展信息
 */
export function warning(cat: Category, msg: string, ext?: object) {
  if (!isEnabled) {
    return;
  }
  const log = {
    cat,
    level: 'warn',
    msg: msg,
    ext: JSON.stringify(ext)
  };

  console.groupCollapsed('amis debug', msg);
  console.trace(log);
  console.groupEnd();
  store.logs.push(log);
}

// 辅助定位是因为什么属性变化导致了组件更新
export function traceProps(props: any, prevProps: any, componentName: string) {
  console.log(
    componentName,
    Object.keys(props)
      .map(key => {
        if (props[key] !== prevProps[key]) {
          if (key === 'data') {
            return `data[${Object.keys(props[key])
              .map(item => {
                if (props[key][item] !== prevProps[key][item]) {
                  return `${item}`;
                }
                return '';
              })
              .filter(item => item)
              .join(', ')}]`;
          }

          return key;
        }
        return '';
      })
      .filter(item => item)
  );
}
