import React from 'react';
import {
  ScopedContext,
  IScopedContext,
  filterTarget,
  isPureVariable,
  resolveVariableAndFilter,
  setVariable,
  setThemeClassName,
  ValidateError,
  RendererEvent
} from 'amis-core';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaNode, Schema, ActionObject} from 'amis-core';
import {filter} from 'amis-core';
import {Modal, SpinnerExtraProps} from 'amis-ui';
import {
  guid,
  isVisible,
  autobind,
  createObject,
  isObjectShallowModified
} from 'amis-core';
import {reaction} from 'mobx';
import {Icon} from 'amis-ui';
import {ModalStore, IModalStore} from 'amis-core';
import {findDOMNode} from 'react-dom';
import {Spinner} from 'amis-ui';
import {IServiceStore, CustomStyle} from 'amis-core';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaName,
  SchemaTpl
} from '../Schema';
import {ActionSchema} from './Action';
import {isAlive} from 'mobx-state-tree';

/**
 * Dialog 弹框渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/dialog
 */
export interface DialogSchema extends BaseSchema {
  type: 'dialog';

  /**
   * 弹窗参数说明，值格式为 JSONSchema。
   */
  inputParams?: any;

  /**
   * 默认不用填写，自动会创建确认和取消按钮。
   */
  actions?: Array<ActionSchema>;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 是否支持按 ESC 关闭 Dialog
   */
  closeOnEsc?: boolean;

  /**
   * 是否支持点其它区域关闭 Dialog
   */
  closeOnOutside?: boolean;

  name?: SchemaName;

  /**
   * Dialog 大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Dialog 高度
   */
  height?: string;

  /**
   * Dialog 宽度
   */
  width?: string;

  /**
   * 请通过配置 title 设置标题
   */
  title?: SchemaCollection;

  header?: SchemaCollection;
  headerClassName?: SchemaClassName;

  footer?: SchemaCollection;

  /**
   * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
   */
  confirm?: boolean;

  /**
   * 是否显示关闭按钮
   */
  showCloseButton?: boolean;

  /**
   * 是否显示错误信息
   */
  showErrorMsg?: boolean;

  /**
   * 是否显示 spinner
   */
  showLoading?: boolean;

  /**
   * 是否显示蒙层
   */
  overlay?: boolean;

  /**
   * 弹框类型 confirm 确认弹框
   */
  dialogType?: 'confirm';
  /**
   * 可拖拽
   */
  draggable?: boolean;
  /**
   * 可全屏
   */
  allowFullscreen?: boolean;

  /**
   * 数据映射
   */
  data?: {
    [propName: string]: any;
  };
}

export type DialogSchemaBase = Omit<DialogSchema, 'type'>;

export interface DialogProps
  extends RendererProps,
    Omit<DialogSchema, 'className' | 'data'>,
    SpinnerExtraProps {
  onClose: (confirmed?: boolean) => void;
  onConfirm: (
    values: Array<object>,
    action: ActionObject,
    ctx: object,
    targets: Array<any>
  ) => void;
  children?: React.ReactNode | ((props?: any) => React.ReactNode);
  store: IModalStore;
  show?: boolean;
  lazyRender?: boolean;
  lazySchema?: (props: DialogProps) => SchemaCollection;
  wrapperComponent: React.ElementType;
}

export default class Dialog extends React.Component<DialogProps> {
  static propsList: Array<string> = [
    'title',
    'size',
    'closeOnEsc',
    'closeOnOutside',
    'children',
    'bodyClassName',
    'headerClassName',
    'confirm',
    'onClose',
    'onConfirm',
    'show',
    'body',
    'showCloseButton',
    'showErrorMsg',
    'actions',
    'popOverContainer',
    'overlay',
    'draggable',
    'allowFullscreen'
  ];
  static defaultProps = {
    title: 'Dialog.title',
    bodyClassName: '',
    confirm: true,
    show: false,
    lazyRender: false,
    showCloseButton: true,
    wrapperComponent: Modal,
    closeOnEsc: false,
    closeOnOutside: false,
    showErrorMsg: true
  };

  reaction: any;
  isDead = false;
  $$id: string = guid();
  constructor(props: DialogProps) {
    super(props);

    props.store.setEntered(!!props.show);
    this.handleSelfClose = this.handleSelfClose.bind(this);
    this.handleSelfScreen = this.handleSelfScreen.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleActionSensor = this.handleActionSensor.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.handleExited = this.handleExited.bind(this);
    this.handleFormInit = this.handleFormInit.bind(this);
    this.handleFormSaved = this.handleFormSaved.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleChildFinished = this.handleChildFinished.bind(this);

    const store = props.store;
    this.reaction = reaction(
      () => `${store.loading}${store.error}`,
      () => this.forceUpdate()
    );
  }

  // shouldComponentUpdate(nextProps:DialogProps, nextState:DialogState) {
  //     const props = this.props;

  //     if (this.state.entered !== nextState.entered) {
  //         return true;
  //     } else if (props.show === nextProps.show && !nextProps.show) {
  //         return false;
  //     }

  //     return isObjectShallowModified(this.props, nextProps);
  // }

  componentWillUnmount() {
    this.reaction && this.reaction();
    this.isDead = true;
  }

  buildActions(): Array<ActionSchema> {
    const {actions, confirm, translate: __, testIdBuilder} = this.props;

    if (typeof actions !== 'undefined') {
      return actions;
    }

    let ret: Array<ActionSchema> = [];
    ret.push({
      type: 'button',
      testIdBuilder: testIdBuilder?.getChild('cancel'),
      actionType: 'cancel',
      label: __('cancel')
    });

    if (confirm) {
      ret.push({
        type: 'button',
        testIdBuilder: testIdBuilder?.getChild('confirm'),
        actionType: 'confirm',
        label: __('confirm'),
        primary: true
      });
    }

    return ret;
  }
  handleSelfScreen(e?: any) {
    e.preventDefault();
    e.stopPropagation();
    const {store} = this.props;
    store.setFullScreen(!store.isFullscreen);
  }
  async handleSelfClose(e?: any, confirmed?: boolean) {
    const {onClose, store, dispatchEvent} = this.props;

    const rendererEvent = await dispatchEvent('cancel', this.props.data);
    if (rendererEvent?.prevented) {
      return;
    }

    if (rendererEvent?.pendingPromise.length) {
      await rendererEvent.allDone();
    }
    // clear error
    store.updateMessage();
    store.setFullScreen(false);
    onClose(confirmed);
  }

  handleActionSensor(p: Promise<any>) {
    const {store} = this.props;

    const origin = store.busying;
    store.markBusying(true);
    // clear error
    store.updateMessage();

    p.then(() => {
      store.markBusying(origin);
    }).catch(e => {
      if (this.isDead) {
        return;
      }
      store.updateMessage(e.message, true);
      store.markBusying(origin);
    });
  }

  handleAction(e: React.UIEvent<any>, action: ActionObject, data: object) {
    const {store, onAction} = this.props;

    if (action.type === 'reset') {
      store.reset();
    } else if (action.actionType === 'cancel') {
      this.handleSelfClose();
    } else if (onAction) {
      onAction(e, action, data);
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

  handleDialogClose(...args: Array<any>) {
    const {store} = this.props;

    const action = store.action as ActionObject;
    const dialog = action.dialog as any;

    if (dialog.onClose && dialog.onClose(...args) === false) {
      return;
    }

    store.closeDialog(args[1]);
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

    const drawer = store.action.drawer as any;

    if (
      drawer &&
      drawer.onConfirm &&
      drawer.onConfirm(values, action, ...args) === false
    ) {
      return;
    }

    store.closeDrawer(true, values);
  }

  handleDrawerClose(...args: Array<any>) {
    const {store} = this.props;

    const action = store.action as ActionObject;
    const drawer = action.drawer as any;

    if (drawer.onClose && drawer.onClose(...args) === false) {
      return;
    }

    store.closeDrawer(...args);
  }

  handleEntered() {
    const {lazySchema, store} = this.props;

    store.setEntered(true);
    // 可能还没来得及关闭，事件动作又打开了这个弹窗，这时候需要重置 busying 状态
    store.markBusying(false);
    if (typeof lazySchema === 'function') {
      store.setSchema(lazySchema(this.props));
    }

    const activeElem = document.activeElement as HTMLElement;
    if (activeElem) {
      const dom = findDOMNode(this) as HTMLElement;
      dom && !dom.contains(activeElem) && activeElem.blur();
    }
  }

  handleExited() {
    const {lazySchema, store, statusStore} = this.props;
    statusStore && isAlive(statusStore) && statusStore.resetAll();
    if (isAlive(store)) {
      store.reset();
      store.clearMessage();
      store.markBusying(false);
      store.setEntered(false);
      if (typeof lazySchema === 'function') {
        store.setSchema('');
      }
    }
  }

  handleFormInit(data: any) {
    const {store} = this.props;

    store.setFormData(data);
  }

  handleFormChange(data: any, name?: string) {
    const {store} = this.props;

    // 如果 dialog 里面不放 form，而是直接放表单项就会进到这里来。
    if (typeof name === 'string') {
      store.changeValue(name, data);
      return;
    }

    store.setFormData(data);
  }

  handleFormSaved(data: any, response: any) {
    const {store} = this.props;

    store.setFormData({
      ...data,
      ...response
    });
  }

  handleChildFinished(value: any, action: ActionObject) {
    // 下面会覆盖
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

  @autobind
  getPopOverContainer() {
    return (findDOMNode(this) as HTMLElement).querySelector(
      `.${this.props.classPrefix}Modal-content`
    );
  }

  renderBody(body: SchemaNode, key?: any): React.ReactNode {
    let {render, store} = this.props;

    if (Array.isArray(body)) {
      return body.map((body, key) => this.renderBody(body, key));
    }

    let subProps: any = {
      key,
      disabled: (body && (body as any).disabled) || store.loading,
      onAction: this.handleAction,
      onFinished: this.handleChildFinished,
      popOverContainer: this.getPopOverContainer,
      onChange: this.handleFormChange,
      onInit: this.handleFormInit,
      onSaved: this.handleFormSaved,
      onActionSensor: this.handleActionSensor,
      btnDisabled: store.loading,
      syncLocation: false // 弹框中的 crud 一般不需要同步地址栏
    };

    if (!(body as Schema).type) {
      return render(`body${key ? `/${key}` : ''}`, body, subProps);
    }

    let schema: Schema = body as Schema;

    if (schema.type === 'form') {
      schema = {
        mode: 'horizontal',
        wrapWithPanel: false,
        submitText: null,
        ...schema
      };
    }

    return render(`body${key ? `/${key}` : ''}`, schema, subProps);
  }

  renderFooter() {
    const actions = this.buildActions();
    let {hideActions} = this.props;
    if (!actions || !actions.length || hideActions) {
      return null;
    }

    const {
      store,
      render,
      env,
      classnames: cx,
      showErrorMsg,
      showLoading,
      show,
      dialogFooterClassName
    } = this.props;

    return (
      <div className={cx('Modal-footer', dialogFooterClassName)}>
        {(showLoading !== false && store.loading) ||
        (showErrorMsg !== false && store.error) ? (
          <div className={cx('Dialog-info')} key="info">
            {showLoading !== false ? (
              <Spinner size="sm" key="info" show={store.loading} />
            ) : null}
            {!env.forceSilenceInsideError &&
            store.error &&
            showErrorMsg !== false ? (
              <span className={cx('Dialog-error')}>{store.msg}</span>
            ) : null}
          </div>
        ) : null}
        {actions.map((action, key) =>
          render(`action/${key}`, action, {
            data: store.formData,
            onAction: this.handleAction,
            // 以免调用上层弹窗的 onActionSensor 方法
            // 弹窗观察内部的动作执行，不需要观察到子弹窗里面去
            // 所以这里传递了 undefined
            onActionSensor: undefined,
            btnDisabled: store.loading,
            key,
            disabled: action.disabled || store.loading || !show
          })
        )}
      </div>
    );
  }

  render() {
    const store = this.props.store;
    const {
      className,
      style,
      size,
      height,
      width,
      closeOnEsc,
      closeOnOutside,
      title,
      render,
      header,
      body,
      bodyClassName,
      headerClassName,
      show,
      lazyRender,
      lazySchema,
      wrapperComponent,
      showCloseButton,
      env,
      classnames: cx,
      classPrefix,
      translate: __,
      loadingConfig,
      overlay,
      dialogType,
      cancelText,
      confirmText,
      confirmBtnLevel,
      cancelBtnLevel,
      popOverContainer,
      inDesign,
      themeCss,
      allowFullscreen,
      draggable,
      id,
      ...rest
    } = {
      ...this.props,
      ...store.schema
    } as DialogProps;

    const Wrapper = wrapperComponent || Modal;
    return (
      <Wrapper
        {...rest}
        classPrefix={classPrefix}
        className={cx(className)}
        style={style}
        draggable={store.isFullscreen ? false : draggable}
        size={size}
        height={height}
        width={width}
        isFullscreen={store.isFullscreen}
        modalClassName={cx(
          setThemeClassName({
            ...this.props,
            name: 'dialogClassName',
            id,
            themeCss
          }),
          store.isFullscreen ? 'Modal-fullScreen' : ''
        )}
        modalMaskClassName={setThemeClassName({
          ...this.props,
          name: 'dialogMaskClassName',
          id,
          themeCss
        })}
        backdrop="static"
        onHide={this.handleSelfClose}
        keyboard={closeOnEsc && !store.loading}
        closeOnEsc={closeOnEsc}
        closeOnOutside={!store.dialogOpen && closeOnOutside}
        show={show}
        onEntered={this.handleEntered}
        onExited={this.handleExited}
        container={env?.getModalContainer}
        enforceFocus={false}
        disabled={store.loading}
        overlay={overlay}
        dialogType={dialogType}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmBtnLevel={confirmBtnLevel}
        cancelBtnLevel={cancelBtnLevel}
      >
        {title && typeof title === 'string' ? (
          <div
            className={cx(
              'Modal-header',
              headerClassName,
              setThemeClassName({
                ...this.props,
                name: 'dialogHeaderClassName',
                id,
                themeCss
              })
            )}
          >
            {showCloseButton !== false && !store.loading ? (
              <a
                data-tooltip={__('Dialog.close')}
                data-position="left"
                onClick={this.handleSelfClose}
                className={cx('Modal-close')}
              >
                <Icon
                  icon="close"
                  className="icon"
                  iconContent="Dialog-close"
                />
              </a>
            ) : null}
            {allowFullscreen ? (
              <a
                data-tooltip={
                  store.isFullscreen ? __('Dialog.reset') : __('Dialog.screen')
                }
                data-position="left"
                onClick={this.handleSelfScreen}
                className={cx('Modal-close Modal-screen')}
              >
                <Icon
                  icon={store.isFullscreen ? 'un-fullscreen' : 'full-screen'}
                  className="icon"
                />
              </a>
            ) : null}
            <div
              className={cx(
                'Modal-title',
                setThemeClassName({
                  ...this.props,
                  name: 'dialogTitleClassName',
                  id,
                  themeCss
                })
              )}
            >
              {filter(__(title), store.formData)}
            </div>
          </div>
        ) : title ? (
          <div
            className={cx(
              'Modal-header',
              headerClassName,
              setThemeClassName({
                ...this.props,
                name: 'dialogHeaderClassName',
                id,
                themeCss
              })
            )}
          >
            {showCloseButton !== false && !store.loading ? (
              <a
                data-tooltip={__('Dialog.close')}
                onClick={this.handleSelfClose}
                className={cx('Modal-close')}
              >
                <Icon
                  icon="close"
                  className="icon"
                  iconContent="Dialog-close"
                />
              </a>
            ) : null}
            {allowFullscreen ? (
              <a
                data-tooltip={
                  store.isFullscreen ? __('Dialog.reset') : __('Dialog.screen')
                }
                data-position="left"
                onClick={this.handleSelfScreen}
                className={cx('Modal-close Modal-screen')}
              >
                <Icon
                  icon={store.isFullscreen ? 'un-fullscreen' : 'full-screen'}
                  className="icon"
                />
              </a>
            ) : null}
            {render('title', title, {
              data: store.formData,
              onAction: this.handleAction,
              onActionSensor: undefined,
              btnDisabled: store.loading
            })}
          </div>
        ) : showCloseButton !== false && !store.loading ? (
          <a
            data-tooltip={__('Dialog.close')}
            onClick={this.handleSelfClose}
            className={cx('Modal-close')}
          >
            <Icon icon="close" className="icon" iconContent="Dialog-close" />
          </a>
        ) : null}

        {header
          ? render('header', header, {
              data: store.formData,
              onAction: this.handleAction,
              onActionSensor: undefined,
              btnDisabled: store.loading
            })
          : null}

        {(!store.entered && lazyRender) || (lazySchema && !body) ? (
          <div
            className={cx(
              'Modal-body',
              bodyClassName,
              setThemeClassName({
                ...this.props,
                name: 'dialogBodyClassName',
                id,
                themeCss
              })
            )}
            role="dialog-body"
          >
            <Spinner overlay show size="lg" loadingConfig={loadingConfig} />
          </div>
        ) : body ? (
          // dialog-body 用于在 editor 中定位元素
          <div
            className={cx(
              'Modal-body',
              bodyClassName,
              setThemeClassName({
                ...this.props,
                name: 'dialogBodyClassName',
                id,
                themeCss
              })
            )}
            role="dialog-body"
          >
            {this.renderBody(body, 'body')}
            <CustomStyle
              {...this.props}
              config={{
                themeCss: themeCss,
                classNames: [
                  {
                    key: 'dialogClassName'
                  },
                  {
                    key: 'dialogMaskClassName'
                  },
                  {
                    key: 'dialogHeaderClassName'
                  },
                  {
                    key: 'dialogTitleClassName'
                  },
                  {
                    key: 'dialogBodyClassName'
                  },
                  {
                    key: 'dialogFooterClassName'
                  }
                ],
                id: id
              }}
              env={env}
            />
          </div>
        ) : null}

        {body ? this.renderFooter() : null}

        {body
          ? render(
              'drawer',
              {
                // 支持嵌套
                ...store.drawerSchema,
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
            )
          : null}

        {body
          ? render(
              'dialog',
              {
                // 支持嵌套
                ...store.dialogSchema,
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
            )
          : null}
      </Wrapper>
    );
  }
}

@Renderer({
  type: 'dialog',
  storeType: ModalStore.name,
  storeExtendsData: false,
  isolateScope: true,
  shouldSyncSuperStore: (store: IServiceStore, props: any, prevProps: any) =>
    !!(
      (store.dialogOpen || props.show) &&
      (props.show !== prevProps.show ||
        isObjectShallowModified(prevProps.data, props.data))
    )
})
export class DialogRenderer extends Dialog {
  static contextType = ScopedContext;
  clearErrorTimer: ReturnType<typeof setTimeout>;

  constructor(props: DialogProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
    clearTimeout(this.clearErrorTimer);
  }

  tryChildrenToHandle(
    action: ActionObject,
    ctx: object,
    rawAction?: ActionObject
  ) {
    const scoped = this.context as IScopedContext;
    const targets: Array<any> = [];
    const {onConfirm, store} = this.props;

    if (action.target) {
      targets.push(
        ...action.target
          .split(',')
          .map(name => scoped.getComponentByName(name))
          .filter(item => item && item.doAction)
      );
    }

    /** 如果为隔离动作, 则不做联动处理, 继续交给handleAction */
    if (action?.isolateScope !== true && !targets.length) {
      let components = scoped
        .getComponents()
        .filter(item => !~['drawer', 'dialog'].indexOf(item.props.type));

      const pool = components.concat();

      while (pool.length) {
        const item = pool.pop()!;

        if (~['crud', 'form', 'wizard'].indexOf(item.props.type)) {
          targets.push(item);
          break;
        } else if (~['drawer', 'dialog'].indexOf(item.props.type)) {
          continue;
        } else if (~['page', 'service'].indexOf(item.props.type)) {
          pool.unshift.apply(pool, item.context.getComponents());
        }
      }
    }

    if (targets.length) {
      store.markBusying(true);
      store.updateMessage();

      Promise.all(
        targets.map(target =>
          target.doAction(
            {
              ...action,
              from: this.$$id
            },
            ctx,
            true
          )
        )
      )
        .then(values => {
          if (
            (action.type === 'submit' ||
              action.actionType === 'submit' ||
              action.actionType === 'confirm') &&
            action.close !== false &&
            !targets.some(item => item.props.closeDialogOnSubmit === false)
          ) {
            onConfirm && onConfirm(values, rawAction || action, ctx, targets);
          } else if (action.close) {
            action.close === true
              ? this.handleSelfClose()
              : this.closeTarget(action.close);
          }
          store.markBusying(false);
        })
        .catch(reason => {
          if (this.isDead) {
            return;
          }
          store.updateMessage(reason.message, true);
          store.markBusying(false);

          // 通常都是数据错误，过 3 秒自动清理错误信息
          // if (reason.constructor?.name === ValidateError.name) {
          clearTimeout(this.clearErrorTimer);
          this.clearErrorTimer = setTimeout(() => {
            if (this.isDead) {
              return;
            }
            store.updateMessage('');
          }, 3000);
          // }
        });

      return true;
    }

    return false;
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean): any {
    this.handleAction(undefined, action, data);
  }

  async handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext,
    rendererEvent?: RendererEvent<any>
  ) {
    const {onAction, store, onConfirm, env, dispatchEvent, onClose, show} =
      this.props;
    if (action.from === this.$$id || !show) {
      // 如果是从 children 里面委托过来的，那就直接向上冒泡。
      // 或者当前弹框已经关闭了，那就不处理。
      return onAction
        ? onAction(e, action, data, throwErrors, delegate || this.context)
        : false;
    }

    if (rendererEvent?.pendingPromise.length) {
      await rendererEvent.allDone();
    }

    const scoped = this.context as IScopedContext;

    if (action.type === 'reset') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      store.reset();
    } else if (
      action.actionType === 'close' ||
      action.actionType === 'cancel'
    ) {
      const rendererEvent = await dispatchEvent(
        'cancel',
        createObject(this.props.data, data)
      );
      if (rendererEvent?.prevented) {
        return;
      }

      if (rendererEvent?.pendingPromise.length) {
        await rendererEvent.allDone();
      }

      store.setCurrentAction(action, this.props.resolveDefinitions);
      // clear error
      store.updateMessage();
      onClose();
      if (action.close) {
        action.close === true
          ? this.handleSelfClose()
          : this.closeTarget(action.close);
      }
    } else if (action.actionType === 'confirm') {
      const rendererEvent = await dispatchEvent(
        'confirm',
        createObject(this.props.data, data)
      );

      if (rendererEvent?.prevented) {
        return;
      }

      if (rendererEvent?.pendingPromise.length) {
        await rendererEvent.allDone();
      }

      store.setCurrentAction(action, this.props.resolveDefinitions);
      const handleResult = this.tryChildrenToHandle(
        {
          ...action,
          actionType: 'submit'
        },
        data,
        action
      );

      if (!handleResult) {
        // clear error
        store.updateMessage();
        action.close !== false && onClose(true);
      }
    } else if (action.actionType === 'next' || action.actionType === 'prev') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      if (action.type === 'submit') {
        this.tryChildrenToHandle(
          {
            ...action,
            actionType: 'submit',
            close: true
          },
          data,
          action
        ) || this.handleSelfClose(undefined, true);
      } else {
        onConfirm([data], action, data, []);
      }
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return new Promise<any>(resolve => {
        store.openDialog(
          data,
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
        store.openDrawer(data, undefined, (confirmed: any, value: any) => {
          action.callback?.(confirmed, value);
          resolve({
            confirmed,
            value
          });
        });
      });
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      action.target && scoped.reload(action.target, data);
      if (action.close || action.type === 'submit') {
        this.handleSelfClose(undefined, action.type === 'submit');
        action.close &&
          typeof action.close === 'string' &&
          this.closeTarget(action.close);
      }
    } else if (!action.from && this.tryChildrenToHandle(action, data)) {
      // 如果有 from 了，说明是从子节点冒泡上来的，那就不再走让子节点处理的逻辑。
      // do nothing
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      return store
        .saveRemote(action.api as string, data, {
          successMessage: action.messages && action.messages.success,
          errorMessage: action.messages && action.messages.failed
        })
        .then(async () => {
          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          const reidrect =
            action.redirect && filter(action.redirect, store.data);
          reidrect && env.jumpTo(reidrect, action, store.data);
          action.reload &&
            this.reloadTarget(
              filterTarget(action.reload, store.data),
              store.data
            );
          if (action.close) {
            action.close === true
              ? this.handleSelfClose()
              : this.closeTarget(action.close);
          }
        })
        .catch(e => {
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else if (onAction) {
      await onAction(
        e,
        {
          ...action,
          close: false
        },
        data,
        throwErrors,
        delegate || this.context
      );

      if (action.close) {
        action.close === true
          ? this.handleSelfClose()
          : this.closeTarget(action.close);
      }
    }
  }

  handleChildFinished(value: any, action: ActionObject) {
    if ((action && action.from === this.$$id) || action.close === false) {
      return;
    }

    const scoped = this.context as IScopedContext;
    const components = scoped
      .getComponents()
      .filter(
        (item: any) =>
          !~['drawer', 'dialog', 'action', 'button', 'submit', 'reset'].indexOf(
            item.props.type
          )
      );
    const onConfirm = this.props.onConfirm;
    const onClose = this.props.onClose;

    if (
      components.length === 1 &&
      (components[0].props.type === 'form' ||
        components[0].props.type === 'wizard') &&
      (action.close === true ||
        components[0].props.closeDialogOnSubmit !== false)
    ) {
      onConfirm && onConfirm([value], action, {}, components);
    } else if (action.close === true) {
      onClose();
    }
  }

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ...rest: Array<any>
  ) {
    super.handleDialogConfirm(values, action, ...rest);
    const store = this.props.store;
    const scoped = store.getDialogScoped() || (this.context as IScopedContext);
    const dialogAction = store.action as ActionObject;
    const reload = action.reload ?? dialogAction.reload;

    if (reload) {
      scoped.reload(reload, store.data);
    } else if (scoped.component !== this && scoped.component?.reload) {
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
    super.handleDrawerConfirm(values, action);
    const store = this.props.store;
    const scoped = store.getDialogScoped() || (this.context as IScopedContext);
    const drawerAction = store.action as ActionObject;
    const reload = action.reload ?? drawerAction.reload;

    // 稍等会，等动画结束。
    setTimeout(() => {
      if (reload) {
        scoped.reload(reload, store.data);
      } else if (scoped.component !== this && scoped.component?.reload) {
        scoped.component.reload();
      } else {
        // 没有设置，则自动让页面中 crud 刷新。
        (this.context as IScopedContext)
          .getComponents()
          .filter((item: any) => item.props.type === 'crud')
          .forEach((item: any) => item.reload && item.reload());
      }
    }, 300);
  }

  reloadTarget(target: string, data?: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  closeTarget(target: string) {
    const scoped = this.context as IScopedContext;
    scoped.close(target);
  }

  setData(values: object, replace?: boolean) {
    return this.props.store.updateData(values, undefined, replace);
  }

  getData() {
    const {store} = this.props;
    return store.data;
  }
}
