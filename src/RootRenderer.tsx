import {observer} from 'mobx-react';
import {getEnv} from 'mobx-state-tree';
import React from 'react';
import Alert from './components/Alert2';
import Spinner from './components/Spinner';
import {renderChild, RootProps} from './Root';
import {IScopedContext, ScopedContext} from './Scoped';
import {IRootStore, RootStore} from './store/root';
import {Action} from './types';
import {bulkBindFunctions, guid, isVisible} from './utils/helper';
import {filter} from './utils/tpl';
import qs from 'qs';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';

export interface RootRendererProps extends RootProps {
  location?: any;
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

    this.store.initData(props.data);
    this.store.updateLocation(props.location);

    bulkBindFunctions<RootRenderer /*为毛 this 的类型自动识别不出来？*/>(this, [
      'handleAction',
      'handleDialogConfirm',
      'handleDialogClose',
      'handleDrawerConfirm',
      'handleDrawerClose',
      'handlePageVisibilityChange'
    ]);
  }

  componentDidMount() {
    document.addEventListener(
      'visibilitychange',
      this.handlePageVisibilityChange
    );
  }

  componentDidUpdate(prevProps: RootRendererProps) {
    const props = this.props;

    if (props.data !== prevProps.data) {
      this.store.initData(props.data);
    }

    if (props.location !== prevProps.location) {
      this.store.updateLocation(props.location);
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
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
    action: Action,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {env, messages, onAction} = this.props;
    const store = this.store;

    if (
      onAction?.(e, action, ctx, throwErrors, delegate || this.context) ===
      false
    ) {
      return;
    }

    const scoped = delegate || this.context;
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
      store.setCurrentAction(action);
      store.openDialog(ctx);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(ctx);
    } else if (action.actionType === 'toast') {
      action.toast?.items?.forEach((item:any) => {
        env.notify(item.level || 'info', item.body ? renderChild('body', item.body, {
          ...this.props,
          data: ctx
        }) : '', {
          ...action.toast,
          ...item,
          title: item.title ? renderChild('title', item.title, {
            ...this.props,
          data: ctx
          }) : null,
          useMobileUI: env.useMobileUI
        })
      })
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
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
          redirect && env.jumpTo(redirect, action);
          action.reload &&
            this.reloadTarget(
              delegate || this.context,
              action.reload,
              store.data
            );
        })
        .catch(() => {});
    } else if (
      action.actionType === 'copy' &&
      (action.content || action.copy)
    ) {
      env.copy &&
        env.copy(filter(action.content || action.copy, ctx, '| raw'), {
          format: action.copyFormat
        });
    }
  }

  handleDialogConfirm(values: object[], action: Action, ...args: Array<any>) {
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

    store.closeDialog(true);
  }

  handleDialogClose(confirmed = false) {
    const store = this.store;
    store.closeDialog(confirmed);
  }

  handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>) {
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

    store.closeDrawer();
  }

  handleDrawerClose() {
    const store = this.store;
    store.closeDrawer();
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const store = this.store;
      store.setCurrentAction({
        type: 'button',
        actionType: 'dialog',
        dialog: dialog
      });
      store.openDialog(ctx, undefined, confirmed => {
        resolve(confirmed);
      });
    });
  }

  reloadTarget(scoped: IScopedContext, target: string, data?: any) {
    scoped.reload(target, data);
  }

  render() {
    const {pathPrefix, schema, ...rest} = this.props;
    const store = this.store;

    if (store.runtimeError) {
      return (
        <Alert level="danger">
          <h3>{this.store.runtimeError?.toString()}</h3>
          <pre>
            <code>{this.store.runtimeErrorStack.componentStack}</code>
          </pre>
        </Alert>
      );
    }

    return (
      <>
        {
          renderChild(pathPrefix!, schema, {
            ...rest,
            data: this.store.downStream,
            onAction: this.handleAction
          }) as JSX.Element
        }

        <Spinner size="lg" overlay key="info" show={store.loading} />

        {store.error ? (
          <Alert level="danger" showCloseButton onClose={store.clearMessage}>
            {store.msg}
          </Alert>
        ) : null}

        {renderChild(
          'dialog',
          {
            ...((store.action as Action) &&
              ((store.action as Action).dialog as object)),
            type: 'dialog'
          },
          {
            ...rest,
            key: 'dialog',
            data: store.dialogData,
            onConfirm: this.handleDialogConfirm,
            onClose: this.handleDialogClose,
            show: store.dialogOpen,
            onAction: this.handleAction
          }
        )}

        {renderChild(
          'drawer',
          {
            ...((store.action as Action) &&
              ((store.action as Action).drawer as object)),
            type: 'drawer'
          },
          {
            ...rest,
            key: 'drawer',
            data: store.drawerData,
            onConfirm: this.handleDrawerConfirm,
            onClose: this.handleDrawerClose,
            show: store.drawerOpen,
            onAction: this.handleAction
          }
        )}
      </>
    );
  }
}
