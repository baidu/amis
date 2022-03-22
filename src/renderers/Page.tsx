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
import mapValues from 'lodash/mapValues';
import {resolveVariable} from '../utils/tpl-builtin';
import {buildStyle} from '../utils/style';
import PullRefresh from '../components/PullRefresh';

/**
 * 样式属性名及值
 */
interface Declaration {
  [property: string]: string;
}

/**
 * css 定义
 */
interface CSSRule {
  [selector: string]: Declaration; // 定义
}

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
   * 边栏是否允许拖动
   */
  asideResizor?: boolean;

  /**
   * 边栏最小宽度
   */
  asideMinWidth?: number;

  /**
   * 边栏最小宽度
   */
  asideMaxWidth?: number;

  /**
   * 边栏区 css 类名
   */
  asideClassName?: SchemaClassName;

  /**
   * 配置容器 className
   */
  className?: SchemaClassName;

  /**
   * 自定义页面级别样式表
   */
  css?: CSSRule;

  /**
   * 移动端下的样式表
   */
  mobileCSS?: CSSRule;

  /**
   * 页面级别的初始数据
   */
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

  /**
   * 默认不设置自动感觉内容来决定要不要展示这些区域
   * 如果配置了，以配置为主。
   */
  regions?: Array<'aside' | 'body' | 'toolbar' | 'header'>;

  /**
   * 自定义样式
   */
  style?: {
    [propName: string]: any;
  };

  /**
   * 下拉刷新配置
   */
  pullRefresh?: {
    disabled?: boolean;
    pullingText?: string;
    loosingText?: string;
  };
}

export interface PageProps
  extends RendererProps,
    Omit<PageSchema, 'type' | 'className'> {
  data: any;
  store: IServiceStore;
  location?: Location;
}

export default class Page extends React.Component<PageProps> {
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;
  style: HTMLStyleElement;
  varStyle: HTMLStyleElement;
  startX: number;
  startWidth: number;
  codeWrap: HTMLElement;

  static defaultProps = {
    asideClassName: '',
    bodyClassName: '',
    headerClassName: '',
    initFetch: true,
    // primaryField: 'id',
    toolbarClassName: '',
    messages: {},
    pullRefresh: {
      disabled: true
    }
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

  constructor(props: PageProps) {
    super(props);

    // autobind 会让继承里面的 super 指向有问题，所以先这样！
    bulkBindFunctions<Page /*为毛 this 的类型自动识别不出来？*/>(this, [
      'handleAction',
      'handleChange',
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

    this.style = document.createElement('style');
    this.style.setAttribute('data-page', '');
    document.getElementsByTagName('head')[0].appendChild(this.style);
    this.updateStyle();

    this.varStyle = document.createElement('style');
    this.style.setAttribute('data-vars', '');
    document.getElementsByTagName('head')[0].appendChild(this.varStyle);
    this.updateVarStyle();
  }

  /**
   * 构建 css
   */
  updateStyle() {
    if (this.props.css || this.props.mobileCSS) {
      this.style.innerHTML = `
      ${this.buildCSS(this.props.css)}

      @media (max-width: 768px) {
        ${this.buildCSS(this.props.mobileCSS)}
      }
      `;
    } else {
      this.style.innerHTML = '';
    }
  }

  buildCSS(cssRules?: CSSRule) {
    if (!cssRules) {
      return '';
    }
    let css = '';

    for (const selector in cssRules) {
      const declaration = cssRules[selector];
      let declarationStr = '';
      for (const property in declaration) {
        declarationStr += `  ${property}: ${declaration[property]};\n`;
      }

      css += `
      ${selector} {
        ${declarationStr}
      }
      `;
    }
    return css;
  }

  /**
   * 构建用于 css 变量的内联样式
   */
  updateVarStyle() {
    const cssVars = this.props.cssVars;
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
      this.varStyle.innerHTML = `
      :root {
        ${cssVarsContent}
      }
      `;
    }
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
    } else if (
      JSON.stringify(props.css) !== JSON.stringify(prevProps.css) ||
      JSON.stringify(props.mobileCSS) !== JSON.stringify(prevProps.mobileCSS)
    ) {
      this.updateStyle();
    } else if (
      JSON.stringify(props.cssVars) !== JSON.stringify(prevProps.cssVars)
    ) {
      this.updateVarStyle();
    } else if (props.defaultData !== prevProps.defaultData) {
      store.reInitData(props.defaultData);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    if (this.style) {
      this.style.parentNode?.removeChild(this.style);
    }
    if (this.varStyle) {
      this.varStyle.parentNode?.removeChild(this.varStyle);
    }
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
  ): any {
    const {env, store, messages, onAction} = this.props;

    if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(ctx);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(ctx);
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
      return store
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
      return onAction(e, action, ctx, throwErrors, delegate || this.context);
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

    store.closeDialog(true);
  }

  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
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
    const link =
      target.tagName === 'A' && target.hasAttribute('data-link')
        ? target.getAttribute('data-link')
        : target.closest('a[data-link]')?.getAttribute('data-link');

    if (env && link) {
      env.jumpTo(link);
      e.preventDefault();
    }
  }

  @autobind
  handleResizeMouseDown(e: React.MouseEvent) {
    // todo 可能 ie 不正确
    let isRightMB = e.nativeEvent.which == 3;

    if (isRightMB) {
      return;
    }

    this.codeWrap = e.currentTarget.parentElement as HTMLElement;
    document.addEventListener('mousemove', this.handleResizeMouseMove);
    document.addEventListener('mouseup', this.handleResizeMouseUp);
    this.startX = e.clientX;
    this.startWidth = this.codeWrap.offsetWidth;
  }

  @autobind
  handleResizeMouseMove(e: MouseEvent) {
    const {asideMinWidth = 160, asideMaxWidth = 350} = this.props;
    const dx = e.clientX - this.startX;
    const mx = this.startWidth + dx;
    const width = Math.min(Math.max(mx, asideMinWidth), asideMaxWidth);
    this.codeWrap.style.cssText += `width: ${width}px`;
  }

  @autobind
  handleResizeMouseUp() {
    document.removeEventListener('mousemove', this.handleResizeMouseMove);
    document.removeEventListener('mouseup', this.handleResizeMouseUp);
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

  @autobind
  async handleRefresh() {
    const {dispatchEvent, data} = this.props;
    const rendererEvent = await dispatchEvent('pullRefresh', data);
    if (rendererEvent?.prevented) {
      return;
    }
    this.reload();
  }

  handleChange(
    value: any,
    name: string,
    submit?: boolean,
    changePristine?: boolean
  ) {
    const {store, onChange} = this.props;

    if (typeof name === 'string' && name) {
      store.changeValue(name, value, changePristine);
    }

    onChange?.apply(null, arguments);
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
      classnames: cx,
      regions,
      translate: __
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined
    };
    let header, right;

    if (
      Array.isArray(regions) ? ~regions.indexOf('header') : title || subTitle
    ) {
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

    if (Array.isArray(regions) ? ~regions.indexOf('toolbar') : toolbar) {
      right = (
        <div className={cx(`Page-toolbar`, toolbarClassName)}>
          {render('toolbar', toolbar || '', subProps)}
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
      header,
      showErrorMsg,
      initApi,
      regions,
      style,
      data,
      asideResizor,
      pullRefresh,
      translate: __
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined,
      onChange: this.handleChange,
      pageLoading: store.loading
    };

    const hasAside = Array.isArray(regions)
      ? ~regions.indexOf('aside')
      : aside && (!Array.isArray(aside) || aside.length);

    const styleVar = buildStyle(style, data);

    const pageContent = <div className={cx('Page-content')}>
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

          {(Array.isArray(regions) ? ~regions.indexOf('body') : body)
            ? render('body', body || '', subProps)
            : null}
        </div>
      </div>
    </div>;

    return (
      <div
        className={cx(`Page`, hasAside ? `Page--withSidebar` : '', className)}
        onClick={this.handleClick}
        style={styleVar}
      >
        {hasAside ? (
          <div
            className={cx(
              `Page-aside`,
              asideResizor ? 'relative' : 'Page-aside--withWidth',
              asideClassName
            )}
          >
            {render('aside', aside || '', {
              ...subProps,
              ...(typeof aside === 'string'
                ? {
                    inline: false,
                    className: `Page-asideTplWrapper`
                  }
                : null)
            })}
            {asideResizor ? (
              <div
                onMouseDown={this.handleResizeMouseDown}
                className={cx(`Page-asideResizor`)}
              ></div>
            ) : null}
          </div>
        ) : null}

        {pullRefresh && !pullRefresh.disabled
          ? <PullRefresh
              {...pullRefresh}
              translate={__}
              onRefresh={this.handleRefresh}
              >
              {pageContent}
            </PullRefresh>
          : pageContent}

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
  type: 'page',
  storeType: ServiceStore.name,
  isolateScope: true
})
export class PageRenderer extends Page {
  static contextType = ScopedContext;

  constructor(props: PageProps, context: IScopedContext) {
    super(props);

    const scoped = context;
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
    } else {
      super.handleAction(e, action, ctx, throwErrors, delegate);

      if (
        action.reload &&
        ~['url', 'link', 'jump'].indexOf(action.actionType!)
      ) {
        scoped.reload(action.reload, ctx);
      }
    }
  }

  handleDialogConfirm(values: object[], action: Action, ...rest: Array<any>) {
    super.handleDialogConfirm(values, action, ...rest);
    const scoped = this.context;
    const store = this.props.store;
    const dialogAction = store.action as Action;
    const reload = action.reload ?? dialogAction.reload;

    if (reload) {
      scoped.reload(reload, store.data);
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
    const reload = action.reload ?? drawerAction.reload;

    // 稍等会，等动画结束。
    setTimeout(() => {
      if (reload) {
        scoped.reload(reload, store.data);
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
