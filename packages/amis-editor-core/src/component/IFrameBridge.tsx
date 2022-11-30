import {observer} from 'mobx-react';
import {isAlive} from 'mobx-state-tree';
import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
// import {createRoot} from 'react-dom/client';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {autobind, guid} from '../util';
import IFramePreview from './IFramePreview';

export interface IFrameBridgeProps {
  className?: string;
  url: string;
  editable?: boolean;
  isMobile?: boolean;
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
  data?: any;
  env?: any;
  autoFocus?: boolean;
}

export interface BridgeApi {
  update: (props: any) => void;
}

@observer
export default class IFrameBridge extends React.PureComponent<IFrameBridgeProps> {
  bridgeFnName: string;
  bridge?: BridgeApi;
  schema: any;
  constructor(props: IFrameBridgeProps) {
    super(props);

    const bridgeName = `__amis_editor_bridge_fn_${guid()}`;
    (window as any)[bridgeName] = (innerApi: BridgeApi) => {
      delete (window as any)[bridgeName];
      this.bridge = innerApi;
      this.update(props);
      return props.manager;
    };
    this.bridgeFnName = bridgeName;
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    const store = this.props.store;
    isAlive(store) && store.setDoc(document);
  }

  @autobind
  iframeRef(iframe: any) {
    const store = this.props.store;

    isAlive(store) && store.setIframe(iframe);
  }

  update(props = this.props) {
    const {editable, store} = props;
    this.bridge?.update({
      ...props,
      schema: editable ? store.filteredSchema : store.filteredSchemaForPreview
    });
  }

  render() {
    const {url, manager, className, editable, store} = this.props;

    // 没啥用，纯粹是为了监控。
    this.schema = editable
      ? store.filteredSchema
      : store.filteredSchemaForPreview;

    return (
      <iframe
        ref={this.iframeRef}
        className={className}
        id={manager.id}
        src={`${url}#${this.bridgeFnName}`}
      />
    );
  }
}

class PreviewWrapper extends React.Component<{
  bridgeName: string;
  envCreator?: any;
}> {
  readonly manager: EditorManager;
  state: any = {};
  inited = false;
  constructor(props: {bridgeName: string}) {
    super(props);

    const bridgeName = props.bridgeName;

    const bridge = (parent as any)[bridgeName];
    if (typeof bridge !== 'function') {
      throw new Error('调用错误，或者存在跨域。');
    }

    const manager: EditorManager = bridge({
      update: (props: any) =>
        this.inited ? this.setState({...props}) : (this.state = {...props})
    });
    if (!manager) {
      throw new Error('调用错误');
    }
    manager.store.setDoc(document);

    const subManager = new EditorManager(
      manager.config,
      manager.store,
      manager
    );

    this.manager = subManager;
    this.inited = true;
  }

  componentWillUnmount() {
    // 销毁，不能调用 manager.dispose 因为它会把 dnd 也销毁了。

    const manager = this.manager;

    manager.toDispose.forEach(fn => fn());
    manager.toDispose = [];
    manager.listeners.splice(0, manager.listeners.length);
    manager.lazyPatchSchema.cancel();
  }

  render() {
    return (
      <IFramePreview
        {...this.state}
        manager={this.manager}
        store={this.manager.store}
        envCreator={this.props.envCreator}
      ></IFramePreview>
    );
  }
}

export function mountInIframe(
  dom: HTMLElement,
  reactDom: any,
  envCreator?: any
) {
  if (!location.hash || parent === window) {
    throw new Error('只能在 Iframe 里面调用');
  }

  const bridgeName = location.hash.substring(1);

  // react 18 版本以下的 render方法
  reactDom.render(
    <PreviewWrapper bridgeName={bridgeName} envCreator={envCreator} />,
    dom
  );

  /*
  // react 18 render方法
  const root = createRoot(dom);
  root.render(<PreviewWrapper bridgeName={bridgeName} envCreator={envCreator} />);
  */

  window.onunload = function () {
    unmountComponentAtNode(dom);
    // root.unmount(); // react18
  };
}
