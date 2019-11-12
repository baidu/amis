import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {observer} from 'mobx-react';
import {ServiceStore, IServiceStore} from '../store/service';
import {
  Api,
  SchemaNode,
  Action,
  Location,
  ApiObject,
  FunctionPropertyNames
} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import qs from 'qs';
import {isVisible, autobind, bulkBindFunctions} from '../utils/helper';
import {ScopedContext, IScopedContext} from '../Scoped';
import Alert from '../components/Alert2';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {Spinner} from '../components';

export interface PageProps extends RendererProps {
  title?: string; // 标题
  subTitle?: string; // 副标题
  remark?: any; // 描述
  initApi?: Api; // 可以用来设置初始数据。
  initFetchOn?: string; // 判断是否构成拉取的条件。
  initFetch?: boolean; // 是否初始拉取？
  interval?: number;
  silentPolling?: boolean;
  stopAutoRefreshWhen?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  asideClassName?: string;
  toolbarClassName?: string;
  header?: SchemaNode;
  toolbar?: SchemaNode;
  body?: SchemaNode;
  aside?: SchemaNode;
  // primaryField?: string, // 指定主键的字段名，默认为 `id`
  location?: Location;
  store: IServiceStore;
  messages?: {
    fetchFailed?: string;
    fetchSuccess?: string;
    saveFailed?: string;
    saveSuccess?: string;
  };
}

export default class Page extends React.Component<PageProps> {
  timer: number;
  mounted: boolean;

  static defaultProps = {
    asideClassName: '',
    bodyClassName: '',
    headerClassName: '',
    initFetch: true,
    // primaryField: 'id',
    toolbarClassName: '',
    messages: {}
  };

  static propsList: Array<string> = [
    'title',
    'subtitle',
    'initApi',
    'initFetchOn',
    'initFetch',
    'headerClassName',
    'bodyClassName',
    'asideClassName',
    'toolbarClassName',
    'toolbar',
    'body',
    'aside',
    'messages',
    'style'
  ];

  componentWillMount() {
    const {store, location} = this.props;

    // autobind 会让继承里面的 super 指向有问题，所以先这样！
    bulkBindFunctions<Page /*为毛 this 的类型自动识别不出来？*/>(this, [
      'handleAction',
      'handleDialogConfirm',
      'handleDialogClose',
      'handleDrawerConfirm',
      'handleDrawerClose',
      'handleClick',
      'reload',
      'silentReload',
      'initInterval'
    ]);

    // if (location && location.search) {
    //     const query = location.query || qs.parse(location.search.substring(1));

    //     store.reInitData({
    //         ...query,
    //         query: query,
    //     });
    // } else if (!location && window.location.search) {
    //     const query = qs.parse(window.location.search.substring(1));

    //     store.reInitData({
    //         ...query,
    //         query: query,
    //     });
    // }
  }

  componentDidMount() {
    const {initApi, initFetch, initFetchOn, store, messages} = this.props;

    this.mounted = true;

    if (isEffectiveApi(initApi, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(initApi, store.data, {
          successMessage: messages && messages.fetchSuccess,
          errorMessage: messages && messages.fetchFailed
        })
        .then(this.initInterval);
    }
  }

  componentWillReceiveProps(nextProps: PageProps) {
    const props = this.props;
    const store = props.store;

    // if (nextProps.location && (!props.location || props.location.search !== nextProps.location.search)) {
    //     const query =
    //         nextProps.location.query ||
    //         (nextProps.location.search && qs.parse(nextProps.location.search.substring(1))) ||
    //         {};
    //     store.updateData({
    //         ...query,
    //         query: query,
    //     });
    // }
  }

  componentDidUpdate(prevProps: PageProps) {
    const props = this.props;
    const store = props.store;
    const initApi = props.initApi;

    if (
      // 前一次不构成条件，这次更新构成了条件，则需要重新拉取
      (props.initFetchOn && props.initFetch && !prevProps.initFetch) ||
      // 构成了条件，同时 url 里面有变量，且上次和这次还不一样，则需要重新拉取。
      (props.initFetch !== false &&
        isApiOutdated(prevProps.initApi, initApi, prevProps.data, props.data))
    ) {
      const messages = props.messages;
      isEffectiveApi(initApi, store.data) &&
        store
          .fetchData(initApi as Api, store.data, {
            successMessage: messages && messages.fetchSuccess,
            errorMessage: messages && messages.fetchFailed
          })
          .then(this.initInterval);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  reloadTarget(target: string, data?: any) {
    // 会被覆写
  }

  handleAction(
    e: React.UIEvent<any> | void,
    action: Action,
    ctx: object,
    delegate?: boolean
  ) {
    const {env, store, messages} = this.props;

    // delegate 表示不是当前层的事件，而是孩子节点的。
    delegate || store.setCurrentAction(action);

    if (
      action.actionType === 'url' ||
      action.actionType === 'link' ||
      action.actionType === 'jump'
    ) {
      if (!env || !env.jumpTo) {
        throw new Error('env.jumpTo is required!');
      }

      env.jumpTo(
        filter((action.to || action.url || action.link) as string, ctx),
        action,
        ctx
      );
    } else if (action.actionType === 'dialog') {
      store.openDialog(ctx);
    } else if (action.actionType === 'drawer') {
      store.openDrawer(ctx);
    } else if (action.actionType === 'ajax') {
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

          action.redirect &&
            env.jumpTo(filter(action.redirect, store.data), action);
          action.reload && this.reloadTarget(action.reload, store.data);
        })
        .catch(() => {});
    } else if (
      action.actionType === 'copy' &&
      (action.content || action.copy)
    ) {
      env.copy && env.copy(filter(action.content || action.copy, ctx));
    }
  }

  handleDialogConfirm(values: object[], action: Action, ...args: Array<any>) {
    const {store} = this.props;

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

    store.closeDialog();
  }

  handleDialogClose() {
    const {store} = this.props;
    store.closeDialog();
  }

  handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>) {
    const {store} = this.props;

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
    const {store} = this.props;
    store.closeDrawer();
  }

  handleClick(e: any) {
    const target: HTMLElement = e.target as HTMLElement;
    const {env} = this.props;

    if (env && target.tagName === 'A' && target.hasAttribute('data-link')) {
      env.jumpTo(target.getAttribute('data-link') as string);
      e.preventDefault();
    }
  }

  openFeedback(dialog: any, ctx: any) {
    return new Promise(resolve => {
      const {store} = this.props;
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

  reload(subpath?: any, query?: any, ctx?: any, silent?: boolean) {
    if (query) {
      return this.receive(query);
    }

    const {store, initApi} = this.props;

    clearTimeout(this.timer);
    isEffectiveApi(initApi, store.data) &&
      store
        .fetchData(initApi, store.data, {
          silent
        })
        .then(this.initInterval);
  }

  receive(values: object) {
    const {store} = this.props;

    store.updateData(values);
    this.reload();
  }

  silentReload(target?: string, query?: any) {
    this.reload(query, undefined, undefined, true);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

    interval &&
      this.mounted &&
      (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 3000)
      ));
    return value;
  }

  renderHeader() {
    const {
      title,
      subTitle,
      remark,
      headerClassName,
      toolbarClassName,
      toolbar,
      render,
      store,
      env,
      classnames: cx
    } = this.props;

    const subProps = {
      onAction: this.handleAction
    };
    let header, right;

    if (title || subTitle) {
      header = (
        <div className={cx(`Page-header`, headerClassName)}>
          {title ? (
            <h2 className={cx('Page-title')}>
              {render('title', title, subProps)}
              {remark
                ? render('remark', {
                    type: 'remark',
                    tooltip: remark,
                    container:
                      env && env.getModalContainer
                        ? env.getModalContainer
                        : undefined
                  })
                : null}
            </h2>
          ) : null}
          {subTitle && (
            <small className={cx('Page-subTitle')}>
              {render('subTitle', subTitle, subProps)}
            </small>
          )}
        </div>
      );
    }

    if (toolbar) {
      right = (
        <div className={cx(`Page-toolbar`, toolbarClassName)}>
          {render('toolbar', toolbar, subProps)}
        </div>
      );
    }

    if (header && right) {
      return (
        <div className={cx('Page-headerRow')}>
          {header}
          {right}
        </div>
      );
    }

    return header || right;
  }

  render() {
    const {
      className,
      store,
      body,
      bodyClassName,
      render,
      aside,
      asideClassName,
      classnames: cx,
      header
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      loading: store.loading
    };

    const hasAside = aside && (!Array.isArray(aside) || aside.length);

    return (
      <div
        className={cx(`Page`, hasAside ? `Page--withSidebar` : '', className)}
        onClick={this.handleClick}
      >
        {hasAside ? (
          <div className={cx(`Page-aside`, asideClassName)}>
            {render('aside', aside as any, {
              ...subProps,
              ...(typeof aside === 'string'
                ? {
                    inline: false,
                    className: `Page-asideTplWrapper`
                  }
                : null)
            })}
          </div>
        ) : null}

        <div className={cx('Page-content')}>
          {header ? render('header', header, subProps) : null}
          <div className={cx('Page-main')}>
            {this.renderHeader()}
            <div className={cx(`Page-body`, bodyClassName)}>
              <Spinner size="lg" overlay key="info" show={store.loading} />

              {store.error ? (
                <Alert
                  level="danger"
                  showCloseButton
                  onClose={store.clearMessage}
                >
                  {store.msg}
                </Alert>
              ) : null}

              {body ? render('body', body, subProps) : null}
            </div>
          </div>
        </div>

        {render(
          'dialog',
          {
            ...((store.action as Action) &&
              ((store.action as Action).dialog as object)),
            type: 'dialog'
          },
          {
            key: 'dialog',
            data: store.dialogData,
            onConfirm: this.handleDialogConfirm,
            onClose: this.handleDialogClose,
            show: store.dialogOpen,
            onAction: this.handleAction
          }
        )}

        {render(
          'drawer',
          {
            ...((store.action as Action) &&
              ((store.action as Action).drawer as object)),
            type: 'drawer'
          },
          {
            key: 'drawer',
            data: store.drawerData,
            onConfirm: this.handleDrawerConfirm,
            onClose: this.handleDrawerClose,
            show: store.drawerOpen,
            onAction: this.handleAction
          }
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(?:^|\/)page$/,
  name: 'page',
  storeType: ServiceStore.name,
  isolateScope: true
})
export class PageRenderer extends Page {
  static contextType = ScopedContext;

  componentWillMount() {
    super.componentWillMount();

    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
  }

  reloadTarget(target: string, data?: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  handleAction(
    e: React.UIEvent<any>,
    action: Action,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: boolean
  ) {
    const scoped = this.context as IScopedContext;

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
    } else {
      super.handleAction(e, action, ctx, delegate);
    }
  }

  handleDialogConfirm(values: object[], action: Action, ...rest: Array<any>) {
    super.handleDialogConfirm(values, action, ...rest);
    const scoped = this.context;
    const store = this.props.store;
    const dialogAction = store.action as Action;

    if (dialogAction.reload) {
      scoped.reload(dialogAction.reload, store.data);
    } else {
      // 没有设置，则自动让页面中 crud 刷新。
      scoped
        .getComponents()
        .filter((item: any) => item.props.type === 'crud')
        .forEach((item: any) => item.reload && item.reload());
    }
  }

  handleDrawerConfirm(values: object[], action: Action, ...rest: Array<any>) {
    super.handleDrawerConfirm(values, action);
    const scoped = this.context as IScopedContext;
    const store = this.props.store;
    const drawerAction = store.action as Action;

    // 稍等会，等动画结束。
    setTimeout(() => {
      if (drawerAction.reload) {
        scoped.reload(drawerAction.reload, store.data);
      } else {
        // 没有设置，则自动让页面中 crud 刷新。
        scoped
          .getComponents()
          .filter((item: any) => item.props.type === 'crud')
          .forEach((item: any) => item.reload && item.reload());
      }
    }, 300);
  }
}
