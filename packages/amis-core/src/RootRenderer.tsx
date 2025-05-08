import {observer} from 'mobx-react';
import React from 'react';
import type {RootProps} from './Root';
import {IScopedContext, ScopedContext, filterTarget} from './Scoped';
import {IRootStore, RootStore} from './store/root';
import {ActionObject} from './types';
import {bulkBindFunctions, guid, isVisible, JSONTraverse} from './utils/helper';
import {filter} from './utils/tpl';
import qs from 'qs';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import {saveAs} from 'file-saver';
import {normalizeApi} from './utils/api';
import {findDOMNode} from 'react-dom';
import LazyComponent from './components/LazyComponent';
import {hasAsyncRenderers, loadAsyncRenderersByType} from './factory';
import {dispatchEvent} from './utils/renderer-event';

export interface RootRendererProps extends RootProps {
  location?: any;
  data?: Record<string, any>;
  context?: Record<string, any>;
  render: (region: string, schema: any, props: any) => React.ReactNode;
}

@observer
export class RootRenderer extends React.Component<RootRendererProps> {
  store: IRootStore;
  static contextType = ScopedContext;

  constructor(props: RootRendererProps) {
    super(props);
    this.store = props.rootStore.addStore({
      id: guid(),
      path: this.props.$path,
      storeType: RootStore.name,
      parentId: ''
    }) as IRootStore;
    this.store.updateContext(props.context, true);
    this.store.initData(props.data);
    this.store.updateLocation(props.location, this.props.env?.parseLocation);
    this.store.setGlobalVars(props.globalVars);

    // 将数据里面的函数批量的绑定到 this 上
    bulkBindFunctions<RootRenderer /*为毛 this 的类型自动识别不出来？*/>(this, [
      'handleAction',
      'dispatchEvent',
      'handleDialogConfirm',
      'handleDialogClose',
      'handleDrawerConfirm',
      'handleDrawerClose',
      'handlePageVisibilityChange'
    ]);

    this.store.init(() => {
      if (!hasAsyncRenderers()) {
        return;
      }
      const schema = props.schema;
      const types: Array<string> = [
        'tpl',
        'dialog',
        'drawer',
        'cell',
        'spinner',
        'group',
        'container',
        'dropdown-button',
        'plain'
      ];
      JSONTraverse(schema, (value: any, key: string) => {
        if (key === 'type') {
          types.push(value);

          // form 依赖 panel
          if (value === 'form') {
            types.push('panel');
          }
        }
      });
      return hasAsyncRenderers(types)
        ? loadAsyncRenderersByType(types, true)
        : undefined;
    });
  }

  componentDidMount() {
    document.addEventListener(
      'visibilitychange',
      this.handlePageVisibilityChange
    );

    // 兼容 affixOffsetTop 和 affixOffsetBottom
    if (
      typeof this.props.env.affixOffsetTop !== 'undefined' ||
      typeof this.props.env.affixOffsetBottom !== 'undefined'
    ) {
      // top: var(--affix-offset-top);
      const dom = findDOMNode(this);
      if (dom?.parentElement) {
        dom.parentElement.style.cssText += `--affix-offset-top: ${
          this.props.env.affixOffsetTop || 0
        }px; --affix-offset-bottom: ${
          this.props.env.affixOffsetBottom || 0
        }px;`;
      }
    }
  }

  componentDidUpdate(prevProps: RootRendererProps) {
    const props = this.props;

    // 更新全局变量
    if (props.globalVars !== prevProps.globalVars) {
      this.store.setGlobalVars(props.globalVars);
    }

    if (props.location !== prevProps.location) {
      this.store.updateLocation(props.location, this.props.env?.parseLocation);
    }

    let contextChanged = false;
    if (props.context !== prevProps.context) {
      contextChanged = true;
      this.store.updateContext(props.context);
    }

    // 一定要最后处理，否则 downStream 里面的上层数据 context 还是老的。
    if (props.data !== prevProps.data || contextChanged) {
      // context 依赖 data 变化才能触发变动，所以不管 data 变没变都更新一下
      this.store.initData(props.data);
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.props.env?.errorCatcher?.(error, errorInfo);
    this.store.setRuntimeError(error, errorInfo);
  }

  componentWillUnmount() {
    this.props.rootStore.removeStore(this.store);
    document.removeEventListener(
      'visibilitychange',
      this.handlePageVisibilityChange
    );
  }

  handlePageVisibilityChange() {
    const env = this.props.env;
    if (document.visibilityState === 'hidden') {
      env?.tracker({
        eventType: 'pageHidden'
      });
    } else if (document.visibilityState === 'visible') {
      env?.tracker({
        eventType: 'pageVisible'
      });
    }
  }

  handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): any {
    const {env, messages, onAction, mobileUI, render} = this.props;
    const store = this.store;

    if (
      onAction?.(e, action, ctx, throwErrors, delegate || this.context) ===
      false
    ) {
      return;
    }

    const scoped = delegate || (this.context as IScopedContext);
    if (action.actionType === 'reload') {
      action.target && scoped.reload(action.target, ctx);
    } else if (action.target) {
      action.target.split(',').forEach(name => {
        let target = scoped.getComponentByName(name);
        target &&
          target.doAction &&
          target.doAction(
            {
              ...action,
              target: undefined
            },
            ctx
          );
      });
    } else if (
      action.actionType === 'url' ||
      action.actionType === 'link' ||
      action.actionType === 'jump'
    ) {
      if (!env || !env.jumpTo) {
        throw new Error('env.jumpTo is required!');
      }

      env.jumpTo(
        filter(
          (action.to || action.url || action.link) as string,
          ctx,
          '| raw'
        ),
        action,
        ctx
      );
    } else if (action.actionType === 'email') {
      const mailTo = filter(action.to, ctx);
      const mailInfo = mapValues(
        pick(action, 'to', 'cc', 'bcc', 'subject', 'body'),
        val => filter(val, ctx)
      );
      const mailStr = qs.stringify(mailInfo);
      const mailto = `mailto:${mailTo}?${mailStr}`;

      window.open(mailto);
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return new Promise<any>(resolve => {
        store.openDialog(
          ctx,
          undefined,
          (confirmed: any, value: any) => {
            action.callback?.(confirmed, value);
            resolve({
              confirmed,
              value
            });
          },
          delegate || (this.context as any)
        );
      });
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return new Promise<any>(resolve => {
        store.openDrawer(
          ctx,
          undefined,
          (confirmed: any, value: any) => {
            action.callback?.(confirmed, value);
            resolve({
              confirmed,
              value
            });
          },
          delegate
        );
      });
    } else if (action.actionType === 'toast') {
      action.toast?.items?.forEach(({level, body, title, ...item}: any) => {
        env.notify(
          level || 'info',
          body
            ? render('body', body, {
                ...this.props,
                data: ctx,
                context: store.context
              })
            : '',
          {
            ...action.toast,
            ...item,
            title: title
              ? render('title', title, {
                  ...this.props,
                  data: ctx,
                  context: store.context
                })
              : null,
            mobileUI: mobileUI
          }
        );
      });
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      store
        .saveRemote(action.api as string, ctx, {
          successMessage:
            (action.messages && action.messages.success) ||
            (messages && messages.saveSuccess),
          errorMessage:
            (action.messages && action.messages.failed) ||
            (messages && messages.saveSuccess)
        })
        .then(async () => {
          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          const redirect =
            action.redirect && filter(action.redirect, store.data);
          redirect && env.jumpTo(redirect, action, store.data);
          action.reload &&
            this.reloadTarget(
              delegate || (this.context as IScopedContext),
              filterTarget(action.reload, ctx),
              store.data
            );
        })
        .catch(e => {
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else if (
      action.actionType === 'copy' &&
      (action.content || action.copy)
    ) {
      env.copy &&
        env.copy(filter(action.content || action.copy, ctx, '| raw'), {
          format: action.copyFormat
        });
    } else if (action.actionType === 'saveAs') {
      // 使用 saveAs 实现下载
      // 不支持 env，除非以后将 saveAs 代码拷过来改
      const api = normalizeApi((action as any).api);
      if (typeof api.url === 'string') {
        let fileName = action.fileName || 'data.txt';
        if (!action.fileName && api.url.indexOf('.') !== -1) {
          fileName = api.url.split('/').pop();
        }
        saveAs(api.url, fileName);
      }
    }
  }

  dispatchEvent(
    e: string | React.MouseEvent<any>,
    data: any,
    renderer?: React.Component<any>,
    scoped?: IScopedContext
  ) {
    return dispatchEvent(e, renderer!, scoped!, data);
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ...args: Array<any>
  ) {
    const store = this.store;

    if (action.mergeData && values.length === 1 && values[0]) {
      store.updateData(values[0]);
    }

    const dialog = store.action.dialog as any;
    if (
      dialog &&
      dialog.onConfirm &&
      dialog.onConfirm(values, action, ...args) === false
    ) {
      return;
    }

    const dialogAction = store.action as ActionObject;
    const reload = action.reload ?? dialogAction.reload;
    const scoped = store.getDialogScoped() || (this.context as IScopedContext);

    store.closeDialog(true, values);

    if (reload) {
      scoped.reload(reload, store.data);
    }
  }

  handleDialogClose(confirmed = false) {
    const store = this.store;
    store.closeDialog(confirmed);
  }

  handleDrawerConfirm(
    values: object[],
    action: ActionObject,
    ...args: Array<any>
  ) {
    const store = this.store;

    if (action.mergeData && values.length === 1 && values[0]) {
      store.updateData(values[0]);
    }

    const drawer = store.action.drawer as any;
    if (
      drawer &&
      drawer.onConfirm &&
      drawer.onConfirm(values, action, ...args) === false
    ) {
      return;
    }

    const drawerAction = store.action as ActionObject;
    const reload = action.reload ?? drawerAction.reload;
    const scoped = store.getDrawerScoped() || (this.context as IScopedContext);

    store.closeDrawer(true, values);

    // 稍等会，等动画结束。
    setTimeout(() => {
      if (reload) {
        scoped.reload(reload, store.data);
      }
    }, 300);
  }

  handleDrawerClose() {
    const store = this.store;
    store.closeDrawer(false);
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const store = this.store;
      store.setCurrentAction(
        {
          type: 'button',
          actionType: 'dialog',
          dialog: dialog
        },
        this.props.resolveDefinitions
      );
      store.openDialog(
        ctx,
        undefined,
        confirmed => {
          resolve(confirmed);
        },
        this.context as any
      );
    });
  }

  reloadTarget(scoped: IScopedContext, target: string, data?: any) {
    scoped.reload(target, data);
  }

  renderRuntimeError() {
    const {render, ...rest} = this.props;
    const {store} = this;
    return render(
      'error',
      {
        type: 'alert',
        level: 'danger'
      },
      {
        ...rest,
        topStore: store,
        body: (
          <>
            <h3>{store.runtimeError?.toString()}</h3>
            <pre>
              <code>{store.runtimeErrorStack.componentStack}</code>
            </pre>
          </>
        )
      }
    );
  }

  renderSpinner() {
    const {render, ...rest} = this.props;
    const {store} = this;
    return render(
      'spinner',
      {
        type: 'spinner'
      },
      {
        ...rest,
        topStore: store,
        show: store.loading
      }
    );
  }

  renderError() {
    const {render, ...rest} = this.props;
    const store = this.store;
    return store.error
      ? render(
          'error',
          {
            type: 'alert'
          },
          {
            ...rest,
            topStore: this.store,
            body: store.msg,
            showCloseButton: true,
            onClose: store.clearMessage
          }
        )
      : null;
  }

  renderDialog() {
    const {render, ...rest} = this.props;
    const store = this.store;
    return render(
      'dialog',
      {
        ...store.dialogSchema,
        type: 'dialog'
      },
      {
        ...rest,
        key: 'dialog',
        topStore: this.store,
        data: store.dialogData,
        context: store.context,
        onConfirm: this.handleDialogConfirm,
        onClose: this.handleDialogClose,
        show: store.dialogOpen,
        onAction: this.handleAction,
        dispatchEvent: this.dispatchEvent
      }
    );
  }

  renderDrawer() {
    const {render, ...rest} = this.props;
    const store = this.store;
    return render(
      'drawer',
      {
        ...store.drawerSchema,
        type: 'drawer'
      },
      {
        ...rest,
        key: 'drawer',
        topStore: this.store,
        data: store.drawerData,
        context: store.context,
        onConfirm: this.handleDrawerConfirm,
        onClose: this.handleDrawerClose,
        show: store.drawerOpen,
        onAction: this.handleAction,
        dispatchEvent: this.dispatchEvent
      }
    );
  }

  render() {
    const {pathPrefix, schema, render, globalVars, ...rest} = this.props;
    const store = this.store;

    if (store.runtimeError) {
      return this.renderRuntimeError();
    } else if (!store.ready) {
      return <LazyComponent className="RootLoader" />;
    }

    return (
      <>
        {
          render(pathPrefix!, schema, {
            ...rest,
            topStore: this.store,
            data: this.store.downStream,
            context: store.context,
            onAction: this.handleAction,
            dispatchEvent: this.dispatchEvent
          }) as JSX.Element
        }

        {this.renderSpinner()}

        {this.renderError()}

        {this.renderDialog()}

        {this.renderDrawer()}
      </>
    );
  }
}
