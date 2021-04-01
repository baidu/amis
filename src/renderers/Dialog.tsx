import React from 'react';
import {ScopedContext, IScopedContext} from '../Scoped';
import {Renderer, RendererProps} from '../factory';
import {SchemaNode, Schema, Action} from '../types';
import {filter} from '../utils/tpl';
import Modal from '../components/Modal';
import findLast from 'lodash/findLast';
import {guid, isVisible, autobind} from '../utils/helper';
import {reaction} from 'mobx';
import {Icon} from '../components/icons';
import {ModalStore, IModalStore} from '../store/modal';
import {findDOMNode} from 'react-dom';
import {Spinner} from '../components';
import {IServiceStore} from '../store/service';
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
 * 文档：https://baidu.gitee.io/amis/docs/components/dialog
 */
export interface DialogSchema extends BaseSchema {
  type: 'dialog';

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

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
}

export type DialogSchemaBase = Omit<DialogSchema, 'type'>;

export interface DialogProps
  extends RendererProps,
    Omit<DialogSchema, 'className'> {
  onClose: () => void;
  onConfirm: (
    values: Array<object>,
    action: Action,
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
    'popOverContainer'
  ];
  static defaultProps = {
    title: '弹框',
    bodyClassName: '',
    confirm: true,
    show: true,
    lazyRender: false,
    showCloseButton: true,
    wrapperComponent: Modal,
    closeOnEsc: false,
    showErrorMsg: true
  };

  reaction: any;
  isDead = false;
  $$id: string = guid();
  constructor(props: DialogProps) {
    super(props);

    props.store.setEntered(!!props.show);
    this.handleSelfClose = this.handleSelfClose.bind(this);
    this.handleAction = this.handleAction.bind(this);
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
  }

  componentWillMount() {
    const store = this.props.store;
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
    const {actions, confirm, translate: __} = this.props;

    if (typeof actions !== 'undefined') {
      return actions;
    }

    let ret: Array<ActionSchema> = [];
    ret.push({
      type: 'button',
      actionType: 'cancel',
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

    // clear error
    store.updateMessage();
    onClose();
  }

  handleAction(e: React.UIEvent<any>, action: Action, data: object) {
    const {store, onAction} = this.props;

    if (action.type === 'reset') {
      store.reset();
    } else if (action.actionType === 'cancel') {
      this.handleSelfClose();
    } else if (onAction) {
      onAction(e, action, data);
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

  handleDialogClose(...args: Array<any>) {
    const {store} = this.props;

    const action = store.action as Action;
    const dialog = action.dialog as any;

    if (dialog.onClose && dialog.onClose(...args) === false) {
      return;
    }

    store.closeDialog();
  }

  handleDrawerConfirm(values: object[], action: Action, ...args: Array<any>) {
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

  handleEntered() {
    const {lazySchema, store} = this.props;

    store.setEntered(true);
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
    const {store} = this.props;
    isAlive(store) && store.setFormData({});

    store.setEntered(false);
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

  handleChildFinished(value: any, action: Action) {
    // 下面会覆盖
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
      affixOffsetTop: 0,
      onChange: this.handleFormChange,
      onInit: this.handleFormInit,
      onSaved: this.handleFormSaved
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

    if (!actions || !actions.length) {
      return null;
    }

    const {store, render, classnames: cx, showErrorMsg} = this.props;

    return (
      <div className={cx('Modal-footer')}>
        {store.loading || store.error ? (
          <div className={cx('Dialog-info')} key="info">
            <Spinner size="sm" key="info" show={store.loading} />
            {store.error && showErrorMsg !== false ? (
              <span className={cx('Dialog-error')}>{store.msg}</span>
            ) : null}
          </div>
        ) : null}
        {actions.map((action, key) =>
          render(`action/${key}`, action, {
            data: store.formData,
            onAction: this.handleAction,
            key,
            disabled: action.disabled || store.loading
          })
        )}
      </div>
    );
  }

  render() {
    const store = this.props.store;
    const {
      className,
      size,
      closeOnEsc,
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
      translate: __
    } = {
      ...this.props,
      ...store.schema
    } as any;

    const Wrapper = wrapperComponent || Modal;

    return (
      <Wrapper
        classPrefix={classPrefix}
        className={cx(className)}
        size={size}
        backdrop="static"
        onHide={this.handleSelfClose}
        keyboard={closeOnEsc && !store.loading}
        closeOnEsc={closeOnEsc}
        show={show}
        onEntered={this.handleEntered}
        onExited={this.handleExited}
        container={
          env && env.getModalContainer ? env.getModalContainer : undefined
        }
        enforceFocus={false}
        disabled={store.loading}
      >
        {title && typeof title === 'string' ? (
          <div className={cx('Modal-header', headerClassName)}>
            {showCloseButton !== false && !store.loading ? (
              <a
                data-tooltip={__('Dialog.close')}
                data-position="left"
                onClick={this.handleSelfClose}
                className={cx('Modal-close')}
              >
                <Icon icon="close" className="icon" />
              </a>
            ) : null}
            <div className={cx('Modal-title')}>
              {filter(__(title), store.formData)}
            </div>
          </div>
        ) : title ? (
          <div className={cx('Modal-header', headerClassName)}>
            {showCloseButton !== false && !store.loading ? (
              <a
                data-tooltip={__('Dialog.close')}
                onClick={this.handleSelfClose}
                className={cx('Modal-close')}
              >
                <Icon icon="close" className="icon" />
              </a>
            ) : null}
            {render('title', title, {
              data: store.formData
            })}
          </div>
        ) : showCloseButton !== false && !store.loading ? (
          <a
            data-tooltip={__('Dialog.close')}
            onClick={this.handleSelfClose}
            className={cx('Modal-close')}
          >
            <Icon icon="close" className="icon" />
          </a>
        ) : null}

        {header
          ? render('header', header, {
              data: store.formData
            })
          : null}

        {(!store.entered && lazyRender) || (lazySchema && !body) ? (
          <div className={cx('Modal-body', bodyClassName)}>
            <Spinner overlay show size="lg" />
          </div>
        ) : body ? (
          <div className={cx('Modal-body', bodyClassName)}>
            {this.renderBody(body, 'body')}
          </div>
        ) : null}

        {this.renderFooter()}

        {body
          ? render(
              'drawer',
              {
                // 支持嵌套
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
            )
          : null}

        {body
          ? render(
              'dialog',
              {
                // 支持嵌套
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
            )
          : null}
      </Wrapper>
    );
  }
}

@Renderer({
  test: /(^|\/)dialog$/,
  storeType: ModalStore.name,
  storeExtendsData: false,
  name: 'dialog',
  isolateScope: true,
  shouldSyncSuperStore: (store: IServiceStore, props: any) =>
    store.dialogOpen || props.show
})
export class DialogRenderer extends Dialog {
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
          if (this.isDead) {
            return;
          }
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
    const {onAction, store, onConfirm, env} = this.props;

    if (action.from === this.$$id) {
      return onAction
        ? onAction(e, action, data, throwErrors, delegate || this.context)
        : false;
    }

    const scoped = this.context as IScopedContext;

    if (action.type === 'reset') {
      store.setCurrentAction(action);
      store.reset();
    } else if (
      action.actionType === 'close' ||
      action.actionType === 'cancel'
    ) {
      store.setCurrentAction(action);
      this.handleSelfClose();
      action.close && this.closeTarget(action.close);
    } else if (action.actionType === 'confirm') {
      store.setCurrentAction(action);
      this.tryChildrenToHandle(
        {
          ...action,
          actionType: 'submit'
        },
        data,
        action
      ) || this.handleSelfClose();
    } else if (action.actionType === 'next' || action.actionType === 'prev') {
      store.setCurrentAction(action);
      if (action.type === 'submit') {
        this.tryChildrenToHandle(
          {
            ...action,
            actionType: 'submit',
            close: true
          },
          data,
          action
        ) || this.handleSelfClose();
      } else {
        onConfirm([data], action, data, []);
      }
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(data);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(data);
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

          const reidrect =
            action.redirect && filter(action.redirect, store.data);
          reidrect && env.jumpTo(reidrect, action);
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
        {
          ...action,
          close: false
        },
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
