import React from 'react';
import {
  ScopedContext,
  IScopedContext,
  filterTarget,
  isPureVariable,
  resolveVariableAndFilter,
  setThemeClassName,
  ValidateError,
  RendererEvent
} from 'amis-core';
import {Renderer, RendererProps} from 'amis-core';
import {SchemaNode, Schema, ActionObject} from 'amis-core';
import {Drawer as DrawerContainer, SpinnerExtraProps} from 'amis-ui';
import {
  guid,
  isVisible,
  autobind,
  createObject,
  isObjectShallowModified
} from 'amis-core';
import {reaction} from 'mobx';
import {findDOMNode} from 'react-dom';
import {IModalStore, ModalStore} from 'amis-core';
import {filter} from 'amis-core';
import {Spinner} from 'amis-ui';
import {IServiceStore, CustomStyle} from 'amis-core';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaName
} from '../Schema';
import {ActionSchema} from './Action';
import {isAlive} from 'mobx-state-tree';

/**
 * Drawer 抽出式弹框。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/drawer
 */
export interface DrawerSchema extends BaseSchema {
  type: 'drawer';

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
   * 配置 外层 className
   */
  className?: SchemaClassName;

  /**
   * 配置 Body 容器 className
   */
  bodyClassName?: SchemaClassName;

  /**
   * 配置 头部 容器 className
   */
  headerClassName?: SchemaClassName;

  /**
   * 配置 头部 容器 className
   */
  footerClassName?: SchemaClassName;

  /**
   * 是否支持按 ESC 关闭 Dialog
   */
  closeOnEsc?: boolean;

  name?: SchemaName;

  /**
   * Dialog 大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';

  /**
   * 请通过配置 title 设置标题
   */
  title?: SchemaCollection;

  /**
   * 从什么位置弹出
   */
  position?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * 是否展示关闭按钮
   * 当值为false时，默认开启closeOnOutside
   */
  showCloseButton?: boolean;

  /**
   * 抽屉的宽度 （当position为left | right时生效）
   */
  width?: number | string;

  /**
   * 抽屉的高度 （当position为top | bottom时生效）
   */
  height?: number | string;

  /**
   * 头部
   */
  header?: SchemaCollection;

  /**
   * 底部
   */
  footer?: SchemaCollection;

  /**
   * 影响自动生成的按钮，如果自己配置了按钮这个配置无效。
   */
  confirm?: boolean;

  /**
   * 是否可以拖动弹窗大小
   */
  resizable?: boolean;

  /**
   * 是否显示蒙层
   */
  overlay?: boolean;

  /**
   * 点击外部的时候是否关闭弹框。
   */
  closeOnOutside?: boolean;

  /**
   * 是否显示错误信息
   */
  showErrorMsg?: boolean;

  /**
   * 数据映射
   */
  data?: {
    [propName: string]: any;
  };
}

export type DrawerSchemaBase = Omit<DrawerSchema, 'type'>;

export interface DrawerProps
  extends RendererProps,
    Omit<DrawerSchema, 'className' | 'data'>,
    SpinnerExtraProps {
  onClose: () => void;
  onConfirm: (
    values: Array<object>,
    action: ActionObject,
    ctx: object,
    targets: Array<any>
  ) => void;
  children?: React.ReactNode | ((props?: any) => React.ReactNode);
  wrapperComponent: React.ElementType;
  lazySchema?: (props: DrawerProps) => SchemaCollection;
  store: IModalStore;
  show?: boolean;
  drawerContainer?: () => HTMLElement;
}

export interface DrawerState {
  entered: boolean;
  resizeCoord: number;
  [propName: string]: any;
}

export default class Drawer extends React.Component<DrawerProps> {
  static propsList: Array<string> = [
    'title',
    'size',
    'closeOnEsc',
    'closeOnOutside',
    'children',
    'className',
    'bodyClassName',
    'headerClassName',
    'footerClassName',
    'confirm',
    'position',
    'onClose',
    'onConfirm',
    'show',
    'showCloseButton',
    'width',
    'height',
    'resizable',
    'overlay',
    'body',
    'popOverContainer',
    'showErrorMsg'
  ];
  static defaultProps: Partial<DrawerProps> = {
    title: '',
    className: '',
    bodyClassName: '',
    headerClassName: '',
    footerClassName: '',
    confirm: true,
    position: 'right',
    resizable: false,
    showCloseButton: true,
    overlay: true,
    closeOnEsc: false,
    closeOnOutside: false,
    showErrorMsg: true
  };

  reaction: any;
  $$id: string = guid();
  drawer: any;
  clearErrorTimer: ReturnType<typeof setTimeout> | undefined;
  constructor(props: DrawerProps) {
    super(props);

    props.store.setEntered(!!props.show);
    this.handleSelfClose = this.handleSelfClose.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleActionSensor = this.handleActionSensor.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChildFinished = this.handleChildFinished.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.handleExited = this.handleExited.bind(this);
    this.handleFormInit = this.handleFormInit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSaved = this.handleFormSaved.bind(this);

    const store = props.store;
    this.reaction = reaction(
      () => `${store.loading}${store.error}`,
      () => this.forceUpdate()
    );
  }

  // shouldComponentUpdate(nextProps:DrawerProps) {
  //     const props = this.props;

  //     if (props.show === nextProps.show && !nextProps.show) {
  //         return false;
  //     }

  //     return isObjectShallowModified(this.props, nextProps);
  // }

  componentWillUnmount() {
    this.reaction && this.reaction();
    clearTimeout(this.clearErrorTimer);
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
      actionType: 'close',
      label: __('cancel')
    });

    if (confirm) {
      ret.push({
        type: 'button',
        actionType: 'confirm',
        testIdBuilder: testIdBuilder?.getChild('confirm'),
        label: __('confirm'),
        primary: true
      });
    }

    return ret;
  }

  async handleSelfClose() {
    const {onClose, store, dispatchEvent} = this.props;

    // 如果有子弹框，那么就先不隐藏自己
    if (store.dialogOpen !== false || store.drawerOpen !== false) {
      return;
    }

    const rendererEvent = await dispatchEvent('cancel', this.props.data);
    if (rendererEvent?.prevented) {
      return;
    }
    if (rendererEvent?.pendingPromise.length) {
      await rendererEvent.allDone();
    }
    // clear error
    store.updateMessage();
    onClose();
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
      store.updateMessage(e.message, true);
      store.markBusying(origin);
    });
  }

  handleAction(e: React.UIEvent<any>, action: ActionObject, data: object) {
    const {onClose, onAction} = this.props;
    if (action.actionType === 'close' || action.actionType === 'cancel') {
      onClose();
    } else if (onAction) {
      onAction(e, action, data);
    }
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

    const drawerAction = store.action as ActionObject;
    const drawer = drawerAction.drawer as any;

    if (
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

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    ...args: Array<any>
  ) {
    const {store} = this.props;

    if (action.mergeData && values.length === 1 && values[0]) {
      store.updateData(values[0]);
    }

    const dialogAction = store.action as ActionObject;
    const dialog = dialogAction.dialog as any;

    if (
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

  handleChildFinished(value: any, action: ActionObject) {
    // 下面会覆盖
  }

  handleFormInit(data: any) {
    const {store} = this.props;

    store.setFormData(data);
  }

  handleFormChange(data: any, name?: string) {
    const {store} = this.props;

    // 如果 drawer 里面不放 form，而是直接放表单项就会进到这里来。
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

  handleEntered() {
    const {lazySchema, store} = this.props;

    store.setEntered(true);
    // 可能还没来得及关闭，事件动作又打开了这个弹窗，这时候需要重置 busying 状态
    store.markBusying(false);
    if (typeof lazySchema === 'function') {
      store.setSchema(lazySchema(this.props));
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

  @autobind
  getPopOverContainer() {
    return (findDOMNode(this) as HTMLElement).querySelector(
      `.${this.props.classPrefix}Drawer-content`
    );
  }

  renderBody(body: SchemaNode, key?: any): React.ReactNode {
    let {render, store} = this.props;

    if (Array.isArray(body)) {
      return body.map((body, key) => this.renderBody(body, key));
    }

    let schema: Schema = body as Schema;
    let subProps: any = {
      key,
      disabled: store.loading,
      onAction: this.handleAction,
      onFinished: this.handleChildFinished,
      popOverContainer: this.getPopOverContainer,
      onChange: this.handleFormChange,
      onInit: this.handleFormInit,
      onSaved: this.handleFormSaved,
      onActionSensor: this.handleActionSensor,
      btnDisabled: store.loading,
      syncLocation: false
    };

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
      footerClassName,
      id,
      themeCss
    } = this.props;

    return (
      <div
        className={cx(
          'Drawer-footer',
          footerClassName,
          setThemeClassName({
            ...this.props,
            name: 'drawerFooterClassName',
            id,
            themeCss
          })
        )}
      >
        {store.loading || store.error ? (
          <div className={cx('Drawer-info')}>
            <Spinner size="sm" key="info" show={store.loading} />
            {!env.forceSilenceInsideError && showErrorMsg && store.error ? (
              <span className={cx('Drawer-error')}>{store.msg}</span>
            ) : null}
          </div>
        ) : null}
        {actions.map((action, key) =>
          render(`action/${key}`, action, {
            onAction: this.handleAction,
            onActionSensor: undefined,
            btnDisabled: store.loading,
            data: store.formData,
            key,
            disabled: action.disabled || store.loading
          })
        )}
      </div>
    );
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

  render() {
    const store = this.props.store;
    const {
      className,
      style,
      size,
      closeOnEsc,
      position,
      title,
      render,
      header,
      body,
      bodyClassName,
      headerClassName,
      show,
      showCloseButton,
      width,
      height,
      wrapperComponent,
      env,
      resizable,
      overlay,
      closeOnOutside,
      classPrefix: ns,
      classnames: cx,
      drawerContainer,
      loadingConfig,
      popOverContainer,
      themeCss,
      id,
      ...rest
    } = {
      ...this.props,
      ...store.schema
    } as DrawerProps;

    const Container = wrapperComponent || DrawerContainer;

    return (
      <Container
        {...rest}
        resizable={resizable}
        classPrefix={ns}
        className={className}
        style={style}
        drawerClassName={setThemeClassName({
          ...this.props,
          name: 'drawerClassName',
          id,
          themeCss
        })}
        drawerMaskClassName={setThemeClassName({
          ...this.props,
          name: 'drawerMaskClassName',
          id,
          themeCss
        })}
        size={size}
        onHide={this.handleSelfClose}
        disabled={store.loading}
        show={show}
        showCloseButton={showCloseButton}
        width={width}
        height={height}
        position={position}
        overlay={overlay}
        onEntered={this.handleEntered}
        onExited={this.handleExited}
        closeOnEsc={closeOnEsc}
        closeOnOutside={
          !store.drawerOpen && !store.dialogOpen && closeOnOutside
        }
        container={drawerContainer ? drawerContainer : env?.getModalContainer}
      >
        {title || header ? (
          <div
            className={cx(
              'Drawer-header',
              headerClassName,
              setThemeClassName({
                ...this.props,
                name: 'drawerHeaderClassName',
                id,
                themeCss
              })
            )}
          >
            {title ? (
              <div
                className={cx(
                  'Drawer-title',
                  setThemeClassName({
                    ...this.props,
                    name: 'drawerTitleClassName',
                    id,
                    themeCss
                  })
                )}
              >
                {render('title', title, {
                  data: store.formData,
                  onConfirm: this.handleDrawerConfirm,
                  onClose: this.handleDrawerClose,
                  onAction: this.handleAction,
                  onActionSensor: undefined,
                  btnDisabled: store.loading
                })}
              </div>
            ) : null}
            {header
              ? render('header', header, {
                  data: store.formData,
                  onConfirm: this.handleDrawerConfirm,
                  onClose: this.handleDrawerClose,
                  onAction: this.handleAction,
                  onActionSensor: undefined,
                  btnDisabled: store.loading
                })
              : null}
          </div>
        ) : null}

        {!store.entered ? (
          <div
            className={cx(
              'Drawer-body',
              bodyClassName,
              setThemeClassName({
                ...this.props,
                name: 'drawerBodyClassName',
                id,
                themeCss
              })
            )}
          >
            <Spinner overlay show size="lg" loadingConfig={loadingConfig} />
          </div>
        ) : body ? (
          // dialog-body 用于在 editor 中定位元素
          <div
            className={cx(
              'Drawer-body',
              bodyClassName,
              setThemeClassName({
                ...this.props,
                name: 'drawerBodyClassName',
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
                    key: 'drawerClassName'
                  },
                  {
                    key: 'drawerMaskClassName'
                  },
                  {
                    key: 'drawerHeaderClassName'
                  },
                  {
                    key: 'drawerTitleClassName'
                  },
                  {
                    key: 'drawerBodyClassName'
                  },
                  {
                    key: 'drawerFooterClassName'
                  }
                ],
                id: id
              }}
              env={env}
            />
          </div>
        ) : null}

        {this.renderFooter()}

        {body
          ? render(
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
                onAction: this.handleAction,
                show: store.dialogOpen
              }
            )
          : null}

        {body
          ? render(
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
                onAction: this.handleAction,
                show: store.drawerOpen
              }
            )
          : null}
      </Container>
    );
  }
}

@Renderer({
  type: 'drawer',
  storeType: ModalStore.name,
  storeExtendsData: false,
  isolateScope: true,
  shouldSyncSuperStore: (store: IServiceStore, props: any, prevProps: any) =>
    !!(
      (store.drawerOpen || props.show) &&
      (props.show !== prevProps.show ||
        isObjectShallowModified(prevProps.data, props.data))
    )
})
export class DrawerRenderer extends Drawer {
  static contextType = ScopedContext;

  constructor(props: DrawerProps, context: IScopedContext) {
    super(props);
    const scoped = context;

    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
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
            action.close !== false
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
          store.updateMessage(reason.message, true);
          store.markBusying(false);

          // 通常都是数据错误，过 3 秒自动清理错误信息
          // if (reason.constructor?.name === ValidateError.name) {
          clearTimeout(this.clearErrorTimer);
          this.clearErrorTimer = setTimeout(() => {
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
    const {onClose, onAction, store, env, dispatchEvent, show} = this.props;

    if (action.from === this.$$id || !show) {
      // 如果是从 children 里面委托过来的，那就直接向上冒泡。
      // 或者自己已经关闭了，那就不处理。
      return onAction
        ? onAction(e, action, data, throwErrors, delegate || this.context)
        : false;
    }

    if (rendererEvent?.pendingPromise.length) {
      await rendererEvent.allDone();
    }

    const scoped = this.context as IScopedContext;

    if (action.actionType === 'close' || action.actionType === 'cancel') {
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
      this.tryChildrenToHandle(action, data) || onClose();
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
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      action.target && scoped.reload(action.target, data);

      if (action.close) {
        action.close === true
          ? this.handleSelfClose()
          : this.closeTarget(action.close);
      }
    } else if (!action.from && this.tryChildrenToHandle(action, data)) {
      // 如果有 from 了，说明是从子节点冒泡上来的，那就不再走让子节点处理的逻辑。
      // do nothing
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action, this.props.resolveDefinitions);
      store
        .saveRemote(action.api as string, data, {
          successMessage: action.messages && action.messages.success,
          errorMessage: action.messages && action.messages.failed
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
      await onAction(e, action, data, throwErrors, delegate || this.context);

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

    if (
      components.length === 1 &&
      (components[0].props.type === 'form' ||
        components[0].props.type === 'wizard')
    ) {
      onConfirm([value], action, {}, components);
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
