import React from 'react';
import PropTypes from 'prop-types';
import {
  Renderer,
  RendererProps,
  filterTarget,
  setThemeClassName
} from 'amis-core';
import {observer} from 'mobx-react';
import {ServiceStore, IServiceStore} from 'amis-core';
import {
  Api,
  SchemaNode,
  ActionObject,
  Location,
  ApiObject,
  FunctionPropertyNames,
  CustomStyle
} from 'amis-core';
import {filter, evalExpression} from 'amis-core';
import {
  isVisible,
  autobind,
  bulkBindFunctions,
  isObjectShallowModified,
  createObject
} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import {Alert2 as Alert, SpinnerExtraProps} from 'amis-ui';
import {isApiOutdated, isEffectiveApi} from 'amis-core';
import {Spinner} from 'amis-ui';
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
import {isAlive, onAction} from 'mobx-state-tree';
import mapValues from 'lodash/mapValues';
import {resolveVariable} from 'amis-core';
import {buildStyle} from 'amis-core';
import {PullRefresh} from 'amis-ui';
import {scrollPosition, isMobile} from 'amis-core';

/**
 * css 定义
 */
interface CSSRule {
  [selector: string]:
    | Record<string, string>
    | Record<string, Record<string, string>>; // 定义
}

/**
 * amis Page 渲染器。详情请见：https://aisuda.bce.baidu.com/amis/zh-CN/components/page
 */
export interface PageSchema extends BaseSchema, SpinnerExtraProps {
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
   * 边栏内容是否粘住，即不跟随滚动。
   *
   * @default true
   */
  asideSticky?: boolean;

  /**
   * 边栏位置
   *
   * @default 'left'
   */
  asidePosition?: 'left' | 'right';

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
    asideSticky: true,
    asidePosition: 'left',
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
      'handleBulkChange',
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
    this.varStyle.setAttribute('data-vars', '');
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
        let innerstr = '';
        const innerValue = declaration[property];
        if (typeof innerValue === 'string') {
          declarationStr += `  ${property}: ${innerValue};\n`;
        } else {
          for (const propsName in innerValue) {
            innerstr += ` ${propsName}:${innerValue[propsName]};`;
          }
          declarationStr += `  ${property} {${innerstr}}\n`;
        }
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

  async componentDidMount() {
    const {
      initApi,
      initFetch,
      initFetchOn,
      store,
      messages,
      data,
      dispatchEvent,
      env
    } = this.props;

    this.mounted = true;

    const rendererEvent = await dispatchEvent('init', data, this);

    // Page加载完成时触发 pageLoaded 事件
    if (env?.tracker) {
      env.tracker({eventType: 'pageLoaded'}, this.props);
    }

    if (rendererEvent?.prevented || !isAlive(store)) {
      return;
    }

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
    if (
      JSON.stringify(props.css) !== JSON.stringify(prevProps.css) ||
      JSON.stringify(props.mobileCSS) !== JSON.stringify(prevProps.mobileCSS)
    ) {
      this.updateStyle();
    }
    if (JSON.stringify(props.cssVars) !== JSON.stringify(prevProps.cssVars)) {
      this.updateVarStyle();
    }
    if (isObjectShallowModified(prevProps.defaultData, props.defaultData)) {
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
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): any {
    const {env, store, messages, onAction} = this.props;

    if (action.actionType === 'dialog') {
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
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);

      if (!isEffectiveApi(action.api, ctx)) {
        return;
      }

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
          redirect && env.jumpTo(redirect, action, store.data);
          action.reload &&
            this.reloadTarget(
              filterTarget(action.reload, store.data),
              store.data
            );
        })
        .catch(e => {
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else {
      return onAction(e, action, ctx, throwErrors, delegate || this.context);
    }
  }

  handleQuery(query: any): any {
    if (this.props.initApi) {
      // 如果是分页动作，则看接口里面有没有用，没用则  return false
      // 让组件自己去排序
      if (
        query?.hasOwnProperty('orderBy') &&
        !isApiOutdated(
          this.props.initApi,
          this.props.initApi,
          this.props.store.data,
          createObject(this.props.store.data, query)
        )
      ) {
        return false;
      }

      this.receive(query);
      return;
    }

    if (this.props.onQuery) {
      return this.props.onQuery(query);
    } else {
      return false;
    }
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ...args: Array<any>
  ) {
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

    store.closeDialog(true, values);
  }

  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
  }

  handleDrawerConfirm(
    values: object[],
    action: ActionObject,
    ...args: Array<any>
  ) {
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

    store.closeDrawer(true, values);
  }

  handleDrawerClose() {
    const {store} = this.props;
    store.closeDrawer(false);
  }

  handleClick(e: any) {
    const target: HTMLElement = e.target as HTMLElement;
    const {env} = this.props;
    const link =
      target.tagName === 'A' && target.hasAttribute('data-link')
        ? target.getAttribute('data-link')
        : target.closest('a[data-link]')?.getAttribute('data-link');

    if (env && link) {
      env.jumpTo(link, undefined, this.props.data);
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
    const {
      asideMinWidth = 160,
      asideMaxWidth = 350,
      asidePosition
    } = this.props;
    const dx = e.clientX - this.startX;
    const mx =
      asidePosition === 'right' ? this.startWidth - dx : this.startWidth + dx;
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

  async reload(
    subpath?: any,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ) {
    if (query) {
      return this.receive(query, undefined, replace);
    }

    const {store, initApi} = this.props;

    clearTimeout(this.timer);
    if (isEffectiveApi(initApi, store.data)) {
      const value = await store.fetchData(initApi, store.data, {
        silent
      });
      this.initInterval(value);
    }

    return store.data;
  }

  receive(values: object, subPath?: string, replace?: boolean) {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    this.reload();
  }

  silentReload(target?: string, query?: any) {
    this.reload(query, undefined, undefined, true);
  }

  initInterval(value: any) {
    const {
      interval,
      silentPolling,
      stopAutoRefreshWhen,
      data,
      dispatchEvent,
      store
    } = this.props;

    dispatchEvent(
      'inited',
      createObject(data, {
        ...value?.data,
        responseData: value?.ok ? value?.data ?? {} : value,
        responseStatus:
          value?.status === undefined ? (store?.error ? 1 : 0) : value?.status,
        responseMsg: value?.msg || store?.msg
      })
    );

    value?.ok && // 接口正常返回才继续轮训
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

  handleBulkChange(values: Object) {
    this.props.store?.updateData?.(values);
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
      popOverContainer,
      env,
      classnames: cx,
      regions,
      translate: __,
      id,
      themeCss
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined,
      onChange: this.handleChange,
      onBulkChange: this.handleBulkChange,
      pageLoading: store.loading
    };
    let header, right;

    if (
      Array.isArray(regions) ? ~regions.indexOf('header') : title || subTitle
    ) {
      header = (
        <div
          className={cx(
            `Page-header`,
            headerClassName,
            setThemeClassName({
              ...this.props,
              name: 'headerControlClassName',
              id,
              themeCss
            })
          )}
        >
          {title ? (
            <h2
              className={cx(
                'Page-title',
                setThemeClassName({
                  ...this.props,
                  name: 'titleControlClassName',
                  id,
                  themeCss
                })
              )}
            >
              {render('title', title, subProps)}
              {remark
                ? render('remark', {
                    type: 'remark',
                    tooltip: remark,
                    placement: remarkPlacement || 'bottom',
                    container: popOverContainer || env.getModalContainer
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
        <div
          className={cx(
            `Page-toolbar`,
            toolbarClassName,
            setThemeClassName({
              ...this.props,
              name: 'toolbarControlClassName',
              id,
              themeCss
            })
          )}
        >
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

  renderContent(subProps: any) {
    const {
      store,
      body,
      bodyClassName,
      render,
      classnames: cx,
      showErrorMsg,
      regions,
      translate: __,
      loadingConfig,
      initApi,
      id,
      env,
      themeCss
    } = this.props;

    return (
      <div className={cx('Page-content')}>
        <div className={cx('Page-main')}>
          {this.renderHeader()}
          {/* role 用于 editor 定位 Spinner */}
          <div
            className={cx(
              `Page-body`,
              bodyClassName,
              setThemeClassName({
                ...this.props,
                name: 'bodyControlClassName',
                id,
                themeCss
              })
            )}
            role="page-body"
          >
            <Spinner
              size="lg"
              overlay
              key="info"
              show={store.loading}
              loadingConfig={loadingConfig}
            />

            {!env.forceSilenceInsideError &&
            store.error &&
            showErrorMsg !== false ? (
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
      </div>
    );
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
      showErrorMsg,
      initApi,
      regions,
      style,
      data,
      asideResizor,
      asideSticky,
      pullRefresh,
      mobileUI,
      translate: __,
      loadingConfig,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      asidePosition
    } = this.props;

    const subProps = {
      onAction: this.handleAction,
      onQuery: initApi ? this.handleQuery : undefined,
      onChange: this.handleChange,
      onBulkChange: this.handleBulkChange,
      pageLoading: store.loading
    };

    const hasAside = Array.isArray(regions)
      ? ~regions.indexOf('aside')
      : aside && (!Array.isArray(aside) || aside.length);

    const styleVar = buildStyle(style, data);
    const pageContent = this.renderContent(subProps);

    return (
      <div
        className={cx(
          `Page`,
          hasAside ? `Page--withSidebar` : '',
          hasAside && asideSticky ? `Page--asideSticky` : '',
          hasAside && asidePosition ? `Page--${asidePosition}Aside` : '',
          className,
          setThemeClassName({
            name: 'baseControlClassName',
            id,
            themeCss,
            ...this.props
          }),
          setThemeClassName({
            name: 'wrapperCustomStyle',
            id,
            themeCss: wrapperCustomStyle,
            ...this.props
          })
        )}
        onClick={this.handleClick}
        style={styleVar}
      >
        {hasAside ? (
          <div
            className={cx(
              `Page-aside`,
              asideResizor ? 'relative' : 'Page-aside--withWidth',
              asideClassName,
              setThemeClassName({
                ...this.props,
                name: 'asideControlClassName',
                id,
                themeCss
              })
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

        {mobileUI && pullRefresh && !pullRefresh.disabled ? (
          <PullRefresh
            {...pullRefresh}
            translate={__}
            onRefresh={this.handleRefresh}
          >
            {pageContent}
          </PullRefresh>
        ) : (
          pageContent
        )}

        {render(
          'dialog',
          {
            ...store.dialogSchema,
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
            ...store.drawerSchema,
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
        <CustomStyle
          {...this.props}
          config={{
            wrapperCustomStyle,
            id,
            themeCss,
            classNames: [
              {
                key: 'baseControlClassName',
                weights: {
                  default: {
                    important: true
                  },
                  hover: {
                    important: true
                  },
                  active: {
                    important: true
                  }
                }
              },
              {
                key: 'bodyControlClassName'
              },
              {
                key: 'headerControlClassName'
              },
              {
                key: 'titleControlClassName'
              },
              {
                key: 'toolbarControlClassName'
              },
              {
                key: 'asideControlClassName'
              }
            ]
          }}
          env={env}
        />
      </div>
    );
  }
}

export class PageRendererBase extends Page {
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

  async handleAction(
    e: React.UIEvent<any>,
    action: ActionObject,
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
      const ret = await super.handleAction(
        e,
        action,
        ctx,
        throwErrors,
        delegate
      );

      if (
        action.reload &&
        ~['url', 'link', 'jump'].indexOf(action.actionType!)
      ) {
        scoped.reload(action.reload, ctx);
      }

      return ret;
    }
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ...rest: Array<any>
  ) {
    const store = this.props.store;
    const dialogAction = store.action as ActionObject;
    const reload = action.reload ?? dialogAction.reload;
    const scoped = store.getDialogScoped() || (this.context as IScopedContext);

    super.handleDialogConfirm(values, action, ...rest);

    if (reload) {
      scoped.reload(reload, store.data);
    } else if (scoped?.component !== this && scoped.component?.reload) {
      scoped.component.reload();
    } else {
      // 没有设置，则自动让页面中 crud 刷新。
      (this.context as IScopedContext)
        .getComponents()
        .filter((item: any) => item.props.type === 'crud')
        .forEach((item: any) => item.reload && item.reload());
    }
  }

  handleDrawerConfirm(
    values: object[],
    action: ActionObject,
    ...rest: Array<any>
  ) {
    const store = this.props.store;
    const drawerAction = store.action as ActionObject;
    const reload = action.reload ?? drawerAction.reload;
    const scoped = store.getDrawerScoped() || (this.context as IScopedContext);

    super.handleDrawerConfirm(values, action);

    // 稍等会，等动画结束。
    setTimeout(() => {
      if (reload) {
        scoped.reload(reload, store.data);
      } else if (scoped.component !== this && scoped?.component?.reload) {
        scoped.component.reload();
      } else {
        (this.context as IScopedContext)
          .getComponents()
          .filter((item: any) => item.props.type === 'crud')
          .forEach((item: any) => item.reload && item.reload());
      }
    }, 300);
  }

  setData(values: object, replace?: boolean) {
    return this.props.store.updateData(values, undefined, replace);
  }

  getData() {
    const {store} = this.props;
    return store.data;
  }
}

@Renderer({
  type: 'page',
  storeType: ServiceStore.name,
  isolateScope: true
})
export class PageRenderer extends PageRendererBase {}
