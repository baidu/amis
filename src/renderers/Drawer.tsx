import React from 'react';
import {ScopedContext, IScopedContext} from '../Scoped';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Schema, Action} from '../types';
import {default as DrawerContainer} from '../components/Drawer';
import findLast from 'lodash/findLast';
import {guid, isVisible, autobind} from '../utils/helper';
import {reaction} from 'mobx';
import {findDOMNode} from 'react-dom';
import {IModalStore, ModalStore} from '../store/modal';
import {filter} from '../utils/tpl';
import {Spinner} from '../components';
import {IServiceStore} from '../store/service';
import {
  BaseSchema,
  SchemaClassName,
  SchemaCollection,
  SchemaName
} from '../Schema';
import {ActionSchema} from './Action';

/**
 * Drawer 抽出式弹框。
 * 文档：https://baidu.gitee.io/amis/docs/components/drawer
 */
export interface DrawerSchema extends BaseSchema {
  type: 'drawer';

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
}

export type DrawerSchemaBase = Omit<DrawerSchema, 'type'>;

export interface DrawerProps
  extends RendererProps,
    Omit<DrawerSchema, 'className'> {
  onClose: () => void;
  onConfirm: (
    values: Array<object>,
    action: Action,
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
    'children',
    'bodyClassName',
    'confirm',
    'position',
    'onClose',
    'onConfirm',
    'show',
    'resizable',
    'overlay',
    'body',
    'popOverContainer',
    'showErrorMsg'
  ];
  static defaultProps: Partial<DrawerProps> = {
    title: '',
    bodyClassName: '',
    confirm: true,
    position: 'right',
    resizable: false,
    overlay: true,
    closeOnEsc: false,
    showErrorMsg: true
  };

  reaction: any;
  $$id: string = guid();
  drawer: any;
  constructor(props: DrawerProps) {
    super(props);

    props.store.setEntered(!!props.show);
    this.handleSelfClose = this.handleSelfClose.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChildFinished = this.handleChildFinished.bind(this);
    this.resizeMouseDown = this.resizeMouseDown.bind(this);
    this.bindResize = this.bindResize.bind(this);
    this.removeResize = this.removeResize.bind(this);
    this.handleEntered = this.handleEntered.bind(this);
    this.handleExisted = this.handleExisted.bind(this);
    this.handleFormInit = this.handleFormInit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSaved = this.handleFormSaved.bind(this);
  }

  componentWillMount() {
    const store = this.props.store;
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
  }

  buildActions(): Array<ActionSchema> {
    const {actions, confirm, translate: __} = this.props;

    if (typeof actions !== 'undefined') {
      return actions;
    }

    let ret: Array<ActionSchema> = [];
    ret.push({
      type: 'button',
      actionType: 'close',
      label: __('cancle')
    });

    if (confirm) {
      ret.push({
        type: 'button',
        actionType: 'confirm',
        label: __('confirm'),
        primary: true
      });
    }

    return ret;
  }

  handleSelfClose() {
    const {onClose, store} = this.props;

    // 如果有子弹框，那么就先不隐藏自己
    if (store.dialogOpen !== false || store.drawerOpen !== false) {
      return;
    }

    // clear error
    store.updateMessage();
    onClose();
  }

  handleAction(e: React.UIEvent<any>, action: Action, data: object) {
    const {onClose, onAction} = this.props;
    if (action.actionType === 'close' || action.actionType === 'cancel') {
      onClose();
    } else if (onAction) {
      onAction(e, action, data);
    }
  }

  handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>) {
    const {store} = this.props;

    if (action.mergeData && values.length === 1 && values[0]) {
      store.updateData(values[0]);
    }

    const drawerAction = store.action as Action;
    const drawer = drawerAction.drawer as any;

    if (
      drawer.onConfirm &&
      drawer.onConfirm(values, action, ...args) === false
    ) {
      return;
    }

    store.closeDrawer();
  }

  handleDrawerClose(...args: Array<any>) {
    const {store} = this.props;

    const action = store.action as Action;
    const drawer = action.drawer as any;

    if (drawer.onClose && drawer.onClose(...args) === false) {
      return;
    }

    store.closeDrawer();
  }

  handleDialogConfirm(values: object[], action: Action, ...args: Array<any>) {
    const {store} = this.props;

    if (action.mergeData && values.length === 1 && values[0]) {
      store.updateData(values[0]);
    }

    const dialogAction = store.action as Action;
    const dialog = dialogAction.dialog as any;

    if (
      dialog.onConfirm &&
      dialog.onConfirm(values, action, ...args) === false
    ) {
      return;
    }

    store.closeDialog();
  }

  handleDialogClose(...args: Array<any>) {
    const {store} = this.props;

    const action = store.action as Action;
    const dialog = action.dialog as any;

    if (dialog.onClose && dialog.onClose(...args) === false) {
      return;
    }

    store.closeDialog();
  }

  handleChildFinished(value: any, action: Action) {
    // 下面会覆盖
  }

  handleFormInit(data: any) {
    const {store} = this.props;

    store.setFormData(data);
  }

  handleFormChange(data: any) {
    const {store} = this.props;

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
    if (typeof lazySchema === 'function') {
      store.setSchema(lazySchema(this.props));
    }
  }

  handleExisted() {
    const store = this.props.store;
    store.reset();
    store.setEntered(false);
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
      onSaved: this.handleFormSaved
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

    if (!actions || !actions.length) {
      return null;
    }

    const {store, render, classnames: cx, showErrorMsg} = this.props;

    return (
      <div className={cx('Drawer-footer')}>
        {store.loading || store.error ? (
          <div className={cx('Drawer-info')}>
            <Spinner size="sm" key="info" show={store.loading} />
            {showErrorMsg && store.error ? (
              <span className={cx('Drawer-error')}>{store.msg}</span>
            ) : null}
          </div>
        ) : null}
        {actions.map((action, key) =>
          render(`action/${key}`, action, {
            onAction: this.handleAction,
            data: store.formData,
            key,
            disabled: action.disabled || store.loading
          })
        )}
      </div>
    );
  }

  renderResizeCtrl() {
    const {classnames: cx} = this.props;

    return (
      <div
        className={cx('Drawer-resizeCtrl')}
        onMouseDown={this.resizeMouseDown}
      >
        <div className={cx('Drawer-resizeIcon')}>···</div>
      </div>
    );
  }

  resizeMouseDown(e: React.MouseEvent<any>) {
    const {position, classPrefix: ns, store} = this.props;

    this.drawer = (findDOMNode(this) as HTMLElement).querySelector(
      `.${ns}Drawer-content`
    ) as HTMLElement;
    const resizeCtrl = (findDOMNode(this) as HTMLElement).querySelector(
      `.${ns}Drawer-content .${ns}Drawer-resizeCtrl`
    ) as HTMLElement;
    const drawerWidth = getComputedStyle(this.drawer).width as string;
    const drawerHeight = getComputedStyle(this.drawer).height as string;

    store.setResizeCoord(
      (position === 'left' &&
        e.clientX -
          resizeCtrl.offsetWidth -
          parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
        (position === 'right' &&
          document.body.offsetWidth -
            e.clientX -
            resizeCtrl.offsetWidth -
            parseInt(drawerWidth.substring(0, drawerWidth.length - 2))) ||
        (position === 'top' &&
          e.clientY -
            resizeCtrl.offsetHeight -
            parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
        (position === 'bottom' &&
          document.body.offsetHeight -
            e.clientY -
            resizeCtrl.offsetHeight -
            parseInt(drawerHeight.substring(0, drawerHeight.length - 2))) ||
        0
    );

    document.body.addEventListener('mousemove', this.bindResize);
    document.body.addEventListener('mouseup', this.removeResize);
  }

  bindResize(e: any) {
    const {position, store} = this.props;
    const maxWH = 'calc(100% - 50px)';
    const drawerStyle = this.drawer.style;
    let wh =
      (position === 'left' && e.clientX) ||
      (position === 'right' && document.body.offsetWidth - e.clientX) ||
      (position === 'top' && e.clientY) ||
      (position === 'bottom' && document.body.offsetHeight - e.clientY) ||
      0;
    wh = wh - store.resizeCoord + 'px';

    if (position === 'left' || position === 'right') {
      drawerStyle.maxWidth = maxWH;
      drawerStyle.width = wh;
    }

    if (position === 'top' || position === 'bottom') {
      drawerStyle.maxHeight = maxWH;
      drawerStyle.height = wh;
    }
  }
  removeResize() {
    document.body.removeEventListener('mousemove', this.bindResize);
    document.body.removeEventListener('mouseup', this.removeResize);
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

  render() {
    const store = this.props.store;
    const {
      className,
      size,
      closeOnEsc,
      position,
      title,
      render,
      header,
      body,
      bodyClassName,
      show,
      wrapperComponent,
      env,
      resizable,
      overlay,
      closeOnOutside,
      classPrefix: ns,
      classnames: cx,
      drawerContainer
    } = {
      ...this.props,
      ...store.schema
    } as any;

    const Container = wrapperComponent || DrawerContainer;

    return (
      <Container
        classPrefix={ns}
        className={className}
        size={size}
        onHide={this.handleSelfClose}
        disabled={store.loading}
        show={show}
        position={position}
        overlay={overlay}
        onEntered={this.handleEntered}
        onExisted={this.handleExisted}
        closeOnEsc={closeOnEsc}
        closeOnOutside={
          !store.drawerOpen && !store.dialogOpen && closeOnOutside
        }
        container={
          drawerContainer
            ? drawerContainer
            : env && env.getModalContainer
            ? env.getModalContainer
            : undefined
        }
      >
        <div className={cx('Drawer-header')}>
          {title ? (
            <div className={cx('Drawer-title')}>
              {render('title', title, {
                data: store.formData
              })}
            </div>
          ) : null}
          {header
            ? render('header', header, {
                data: store.formData
              })
            : null}
        </div>

        <div className={cx('Drawer-body', bodyClassName)}>
          {body ? this.renderBody(body, 'body') : null}
        </div>

        {this.renderFooter()}

        {body
          ? render(
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
                onAction: this.handleAction,
                show: store.dialogOpen
              }
            )
          : null}

        {body
          ? render(
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
                onAction: this.handleAction,
                show: store.drawerOpen
              }
            )
          : null}

        {resizable ? this.renderResizeCtrl() : null}
      </Container>
    );
  }
}

@Renderer({
  test: /(^|\/)drawer$/,
  storeType: ModalStore.name,
  storeExtendsData: false,
  name: 'drawer',
  isolateScope: true,
  shouldSyncSuperStore: (store: IServiceStore, props: any) =>
    store.drawerOpen || props.show
})
export class DrawerRenderer extends Drawer {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
    super.componentWillMount();
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
  }

  tryChildrenToHandle(action: Action, ctx: object, rawAction?: Action) {
    const scoped = this.context as IScopedContext;

    if (action.fromDialog) {
      return false;
    }

    const components = scoped.getComponents();
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

    if (!targets.length) {
      const page = findLast(
        components,
        component => component.props.type === 'page'
      );

      if (page) {
        components.push(...page.context.getComponents());
      }

      const form = findLast(
        components,
        component => component.props.type === 'form'
      );
      form && targets.push(form);

      const crud = findLast(
        components,
        component => component.props.type === 'crud'
      );
      crud && targets.push(crud);
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
        });

      return true;
    }

    return false;
  }

  handleAction(
    e: React.UIEvent<any>,
    action: Action,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onClose, onAction, store, env} = this.props;

    if (action.from === this.$$id) {
      return onAction
        ? onAction(e, action, data, throwErrors, delegate || this.context)
        : false;
    }

    const scoped = this.context as IScopedContext;

    if (action.actionType === 'close' || action.actionType === 'cancel') {
      store.setCurrentAction(action);
      onClose();
      action.close && this.closeTarget(action.close);
    } else if (action.actionType === 'confirm') {
      store.setCurrentAction(action);
      this.tryChildrenToHandle(action, data) || onClose();
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(data);
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(data);
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action);
      action.target && scoped.reload(action.target, data);
      if (action.close) {
        this.handleSelfClose();
        this.closeTarget(action.close);
      }
    } else if (this.tryChildrenToHandle(action, data)) {
      // do nothing
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
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
          redirect && env.jumpTo(redirect, action);
          action.reload && this.reloadTarget(action.reload, store.data);
          if (action.close) {
            this.handleSelfClose();
            this.closeTarget(action.close);
          }
        })
        .catch(() => {});
    } else if (onAction) {
      let ret = onAction(
        e,
        action,
        data,
        throwErrors,
        delegate || this.context
      );
      action.close &&
        (ret && ret.then
          ? ret.then(this.handleSelfClose)
          : setTimeout(this.handleSelfClose, 200));
    }
  }

  handleChildFinished(value: any, action: Action) {
    if ((action && action.from === this.$$id) || action.close === false) {
      return;
    }

    const scoped = this.context as IScopedContext;
    const components = scoped
      .getComponents()
      .filter((item: any) => !~['drawer', 'dialog'].indexOf(item.props.type));
    const onConfirm = this.props.onConfirm;

    if (
      components.length === 1 &&
      (components[0].props.type === 'form' ||
        components[0].props.type === 'wizard')
    ) {
      onConfirm([value], action, {}, components);
    }
  }

  handleDialogConfirm(values: object[], action: Action, ...rest: Array<any>) {
    super.handleDialogConfirm(values, action, ...rest);
    const scoped = this.context as IScopedContext;
    const store = this.props.store;
    const dialogAction = store.action as Action;

    if (dialogAction.reload) {
      scoped.reload(dialogAction.reload, store.data);
    } else if (action.reload) {
      scoped.reload(action.reload, store.data);
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
      } else if (action.reload) {
        scoped.reload(action.reload, store.data);
      } else {
        // 没有设置，则自动让页面中 crud 刷新。
        scoped
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
}
