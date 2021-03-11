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
import {
  BaseSchema,
  SchemaCollection,
  SchemaClassName,
  SchemaDefaultData,
  SchemaApi,
  SchemaExpression,
  SchemaName,
  SchemaMessage
} from '../Schema';
import {SchemaRemark} from './Remark';
import {onAction} from 'mobx-state-tree';

/**
 * amis Page 渲染器。详情请见：https://baidu.gitee.io/amis/docs/components/page
 */
export interface PageSchema extends BaseSchema {
  /**
   * 指定为 page 渲染器。
   */
  type: 'page';

  /**
   * 页面标题
   */
  title?: string;

  /**
   * 页面副标题
   */
  subTitle?: string;

  /**
   * 页面描述, 标题旁边会出现个小图标，放上去会显示这个属性配置的内容。
   */
  remark?: SchemaRemark;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 内容区 css 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 边栏区域
   */
  aside?: SchemaCollection;

  /**
   * 边栏区 css 类名
   */
  asideClassName?: SchemaClassName;

  /**
   * 配置容器 className
   */
  className?: SchemaClassName;

  data?: SchemaDefaultData;

  /**
   * 配置 header 容器 className
   */
  headerClassName?: SchemaClassName;

  /**
   * 页面初始化的时候，可以设置一个 API 让其取拉取，发送数据会携带当前 data 数据（包含地址栏参数），获取得数据会合并到 data 中，供组件内使用。
   */
  initApi?: SchemaApi;

  /**
   * 是否默认就拉取？
   */
  initFetch?: boolean;

  /**
   * 是否默认就拉取表达式
   */
  initFetchOn?: SchemaExpression;

  messages?: SchemaMessage;

  name?: SchemaName;

  /**
   * 页面顶部区域，当存在 title 时在右上角显示。
   */
  toolbar?: SchemaCollection;

  /**
   * 配置 toolbar 容器 className
   */
  toolbarClassName?: SchemaClassName;

  definitions?: any; // todo

  /**
   * 配置轮询间隔，配置后 initApi 将轮询加载。
   */
  interval?: number;

  /**
   * 是否要静默加载，也就是说不显示进度
   */
  silentPolling?: boolean;

  /**
   * 配置停止轮询的条件。
   */
  stopAutoRefreshWhen?: SchemaExpression;
  // primaryField?: string, // 指定主键的字段名，默认为 `id`

  /**
   * 是否显示错误信息，默认是显示的。
   */
  showErrorMsg?: boolean;

  /**
   * css 变量
   */
  cssVars?: any;
}

export interface PageProps
  extends RendererProps,
    Omit<PageSchema, 'type' | 'className'> {
  data: any;
  store: IServiceStore;
  location?: Location;
}

export default class Page extends React.Component<PageProps> {
  timer: NodeJS.Timeout;
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

  static propsList: Array<keyof PageProps> = [
    'title',
    'subTitle',
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
    'style',
    'showErrorMsg'
  ];

  componentWillMount() {
    const {store, location} = this.props;

    // autobind 会让继承里面的 super 指向有问题，所以先这样！
    bulkBindFunctions<Page /*为毛 this 的类型自动识别不出来？*/>(this, [
      'handleAction',
      'handleQuery',
      'handleDialogConfirm',
      'handleDialogClose',
      'handleDrawerConfirm',
      'handleDrawerClose',
      'handleClick',
      'reload',
      'silentReload',
      'initInterval'
    ]);
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
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {env, store, messages, onAction} = this.props;

    if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(ctx);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(ctx);
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
          action.reload && this.reloadTarget(action.reload, store.data);
        })
        .catch(() => {});
    } else {
      onAction(e, action, ctx, throwErrors, delegate || this.context);
    }
  }

  handleQuery(query: any) {
    this.receive(query);
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
        Math.max(interval, 1000)
      ));
    return value;
  }

  renderHeader() {
    const {
      title,
      subTitle,
      remark,
      remarkPlacement,
      headerClassName,
      toolbarClassName,
      toolbar,
      render,
      store,
      initApi,
      env,
      classnames: cx
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined
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
                    placement: remarkPlacement || 'bottom',
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
      cssVars,
      render,
      aside,
      asideClassName,
      classnames: cx,
      header,
      showErrorMsg,
      initApi
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined,
      loading: store.loading
    };

    const hasAside = aside && (!Array.isArray(aside) || aside.length);

    let cssVarsContent = '';
    if (cssVars) {
      for (const key in cssVars) {
        if (key.startsWith('--')) {
          if (key.indexOf(':') !== -1) {
            continue;
          }
          const value = cssVars[key];
          // 这是为了防止 xss，可能还有别的
          if (
            typeof value === 'string' &&
            (value.indexOf('expression(') !== -1 || value.indexOf(';') !== -1)
          ) {
            continue;
          }
          cssVarsContent += `${key}: ${value}; \n`;
        }
      }
    }

    return (
      <div
        className={cx(`Page`, hasAside ? `Page--withSidebar` : '', className)}
        onClick={this.handleClick}
      >
        {cssVarsContent ? (
          <style
            // 似乎无法用 style 属性的方式来实现，所以目前先这样做
            dangerouslySetInnerHTML={{
              __html: `
          :root {
            ${cssVarsContent}
          }
        `
            }}
          />
        ) : null}

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

              {store.error && showErrorMsg !== false ? (
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
            onAction: this.handleAction,
            onQuery: initApi ? this.handleQuery : undefined
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
            onAction: this.handleAction,
            onQuery: initApi ? this.handleQuery : undefined
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
    delegate?: IScopedContext
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
      super.handleAction(e, action, ctx, throwErrors, delegate);

      if (
        action.reload &&
        ~['url', 'link', 'jump'].indexOf(action.actionType!)
      ) {
        const scoped = delegate || (this.context as IScopedContext);
        scoped.reload(action.reload, ctx);
      }
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
