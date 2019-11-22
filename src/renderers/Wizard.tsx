import React from 'react';
import {ScopedContext, IScopedContext} from '../Scoped';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import {
  createObject,
  until,
  isVisible,
  getScrollParent,
  autobind
} from '../utils/helper';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {IFormStore} from '../store/form';
import {Spinner} from '../components';
import {findDOMNode} from 'react-dom';
import {resizeSensor} from '../utils/resize-sensor';

export interface WizardProps extends RendererProps {
  store: IServiceStore;
  readOnly?: boolean;
  actionClassName?: string;
  actionPrevLabel?: string;
  actionNextLabel?: string;
  actionNextSaveLabel?: string;
  actionFinishLabel?: string;
  mode?: 'horizontal' | 'vertical';
  affixFooter?: boolean | 'always';
  onFinished: (values: object, action: any) => any;
}

export interface WizardState {
  currentStep: number;
}

export default class Wizard extends React.Component<WizardProps, WizardState> {
  static defaultProps: Partial<WizardProps> = {
    mode: 'horizontal', // vertical
    readOnly: false,
    messages: {},
    actionClassName: '',
    actionPrevLabel: '上一步',
    actionNextLabel: '下一步',
    actionNextSaveLabel: '保存并下一步',
    actionFinishLabel: '完成'
  };

  static propsList: Array<string> = [
    'steps',
    'mode',
    'messages',
    'actionClassName',
    'actionPrevLabel',
    'actionNextLabel',
    'actionNextSaveLabel',
    'actionFinishLabel',
    'onFinished',
    'affixFooter'
  ];

  dom: any;
  form: any;
  asyncCancel: () => void;

  parentNode?: any;
  unSensor: Function;
  affixDom: React.RefObject<HTMLDivElement> = React.createRef();
  footerDom: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: WizardProps) {
    super(props);

    this.state = {
      currentStep: -1 // init 完后会设置成 1
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.formRef = this.formRef.bind(this);
    this.domRef = this.domRef.bind(this);
    this.getPopOverContainer = this.getPopOverContainer.bind(this);
  }

  componentDidMount() {
    const {
      initApi,
      initFetch,
      initAsyncApi,
      initFinishedField,
      store,
      messages: {fetchSuccess, fetchFailed},
      onInit
    } = this.props;

    if (isEffectiveApi(initApi, store.data, initFetch)) {
      store
        .fetchInitData(initApi, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed,
          onSuccess: () => {
            if (
              !isEffectiveApi(initAsyncApi, store.data) ||
              store.data[initFinishedField || 'finished']
            ) {
              return;
            }

            return until(
              () => store.checkRemote(initAsyncApi, store.data),
              (ret: any) => ret && ret[initFinishedField || 'finished'],
              cancel => (this.asyncCancel = cancel)
            );
          }
        })
        .then(value => {
          onInit && onInit(store.data);
          const state = {
            currentStep: 1
          };

          if (
            value &&
            value.data &&
            (typeof value.data.step === 'number' ||
              (typeof value.data.step === 'string' &&
                /^\d+$/.test(value.data.step)))
          ) {
            state.currentStep = parseInt(value.data.step, 10);
          }

          this.setState(state, () => {
            // 如果 initApi 返回的状态是正在提交，则进入轮顺状态。
            if (
              value &&
              value.data &&
              (value.data.submiting || value.data.submited)
            ) {
              this.checkSubmit();
            }
          });
          return value;
        });
    } else {
      this.setState(
        {
          currentStep: 1
        },
        () => onInit && onInit(store.data)
      );
    }

    const dom = findDOMNode(this) as HTMLElement;
    let parent: HTMLElement | Window | null = dom ? getScrollParent(dom) : null;
    if (!parent || parent === document.body) {
      parent = window;
    }
    this.parentNode = parent;
    parent.addEventListener('scroll', this.affixDetect);
    this.unSensor = resizeSensor(dom as HTMLElement, this.affixDetect);
    this.affixDetect();
  }

  componentDidUpdate(prevProps: WizardProps) {
    const props = this.props;
    const {store, fetchSuccess, fetchFailed} = props;

    if (
      isApiOutdated(
        prevProps.initApi,
        props.initApi,
        prevProps.data,
        props.data
      )
    ) {
      store.fetchData(props.initApi, store.data, {
        successMessage: fetchSuccess,
        errorMessage: fetchFailed
      });
    }
  }

  componentWillUnmount() {
    this.asyncCancel && this.asyncCancel();
    const parent = this.parentNode;
    parent && parent.removeEventListener('scroll', this.affixDetect);
    this.unSensor && this.unSensor();
  }

  @autobind
  affixDetect() {
    if (
      !this.props.affixFooter ||
      !this.affixDom.current ||
      !this.footerDom.current
    ) {
      return;
    }

    const affixDom = this.affixDom.current;
    const footerDom = this.footerDom.current;
    let affixed = false;
    footerDom.offsetWidth &&
      (affixDom.style.cssText = `width: ${footerDom.offsetWidth}px;`);

    if (this.props.affixFooter === 'always') {
      affixed = true;
      footerDom.classList.add('invisible2');
    } else {
      const clip = footerDom.getBoundingClientRect();
      const clientHeight = window.innerHeight;
      affixed = clip.top + clip.height / 2 > clientHeight;
    }

    affixed ? affixDom.classList.add('in') : affixDom.classList.remove('in');
  }

  gotoStep(index: number) {
    const steps = this.props.steps || [];
    index = Math.max(Math.min(steps.length, index), 1);

    this.setState({
      currentStep: index
    });
  }

  formRef(ref: any) {
    if (ref) {
      while (ref && ref.getWrappedInstance) {
        ref = ref.getWrappedInstance();
      }
      this.form = ref;
    } else {
      this.form = undefined;
    }
  }

  submitToTarget(target: string, values: object) {
    throw new Error('Please implements this!');
  }

  reloadTarget(target: string, data: any) {
    throw new Error('Please implements this!');
  }

  domRef(ref: any) {
    this.dom = ref;
  }

  getPopOverContainer() {
    return this.dom;
  }

  // 用来还原异步提交状态。
  checkSubmit() {
    const {store, steps, asyncApi, finishedField, env} = this.props;

    const step = steps[this.state.currentStep - 1];
    let finnalAsyncApi =
      (step && step.asyncApi) ||
      (this.state.currentStep === steps.length && asyncApi);

    if (!step || !isEffectiveApi(finnalAsyncApi, store.data)) {
      return;
    }

    store.markSaving(true);
    store.updateData({
      [finishedField || 'finished']: false
    });

    until(
      () => store.checkRemote(finnalAsyncApi as Api, store.data),
      (ret: any) => ret && ret[finishedField || 'finished'],
      cancel => (this.asyncCancel = cancel)
    )
      .then(() => {
        store.markSaving(false);
        this.gotoStep(this.state.currentStep + 1);
      })
      .catch(e => {
        env.notify('error', e.message);
        store.markSaving(false);
      });
  }

  handleAction(e: React.UIEvent<any> | void, action: Action, data: object) {
    const {onAction, store, env} = this.props;

    if (action.actionType === 'next' || action.type === 'submit') {
      this.form.doAction(
        {
          ...action,
          actionType: 'submit'
        },
        data
      );
    } else if (action.actionType === 'prev') {
      this.gotoStep(this.state.currentStep - 1);
    } else if (action.type === 'reset') {
      this.form.reset();
    } else if (action.actionType === 'dialog') {
      store.openDialog(data);
    } else if (action.actionType === 'ajax') {
      if (!action.api) {
        return env.alert(`当 actionType 为 ajax 时，请设置 api 属性`);
      }

      return store
        .saveRemote(action.api as Api, data, {
          successMessage: action.messages && action.messages.success,
          errorMessage: action.messages && action.messages.failed
        })
        .then(async () => {
          this.form && this.form.isValidated() && this.form.validate(true);

          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          action.reload
            ? this.reloadTarget(action.reload, store.data)
            : action.redirect
            ? env.updateLocation(filter(action.redirect, store.data))
            : null;
        })
        .catch(() => {});
    } else if (action.actionType === 'reload') {
      action.target && this.reloadTarget(action.target, data);
    } else if (onAction) {
      onAction(e, action, data);
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

  handleChange(values: object) {
    const {store} = this.props;

    store.updateData(values);
  }

  // 接管里面 form 的提交，不能直接让 form 提交，因为 wizard 自己需要知道进度。
  handleSubmit(values: object, action: Action) {
    const {
      store,
      steps,
      api,
      asyncApi,
      finishedField,
      target,
      redirect,
      reload,
      env,
      onFinished
    } = this.props;

    const step = steps[this.state.currentStep - 1];
    store.updateData(values);

    if (this.state.currentStep < steps.length) {
      let finnalAsyncApi = action.asyncApi || step.asyncApi;

      isEffectiveApi(finnalAsyncApi, store.data) &&
        store.updateData({
          [finishedField || 'finished']: false
        });

      if (isEffectiveApi(action.api || step.api, store.data)) {
        store
          .saveRemote(action.api || step.api, store.data, {
            onSuccess: () => {
              if (
                !isEffectiveApi(finnalAsyncApi, store.data) ||
                store.data[finishedField || 'finished']
              ) {
                return;
              }

              return until(
                () => store.checkRemote(finnalAsyncApi as Api, store.data),
                (ret: any) => ret && ret[finishedField || 'finished'],
                cancel => (this.asyncCancel = cancel)
              );
            }
          })
          .then((value: any) =>
            this.gotoStep(
              value && typeof value.step === 'number'
                ? value.step
                : this.state.currentStep + 1
            )
          )
          .catch(() => {
            // do nothing
          });
      } else {
        this.gotoStep(this.state.currentStep + 1);
      }
    } else {
      // 最后一步
      if (target) {
        this.submitToTarget(target, store.data);
      } else if (action.api || step.api || api) {
        let finnalAsyncApi = action.asyncApi || step.asyncApi || asyncApi;

        isEffectiveApi(finnalAsyncApi, store.data) &&
          store.updateData({
            [finishedField || 'finished']: false
          });

        const formStore = this.form
          ? (this.form.props.store as IFormStore)
          : store;
        store.markSaving(true);

        formStore
          .saveRemote(action.api || step.api || api, store.data, {
            onSuccess: () => {
              if (
                !isEffectiveApi(finnalAsyncApi, store.data) ||
                store.data[finishedField || 'finished']
              ) {
                return;
              }

              return until(
                () => store.checkRemote(finnalAsyncApi as Api, store.data),
                (ret: any) => ret && ret[finishedField || 'finished'],
                cancel => (this.asyncCancel = cancel)
              );
            }
          })
          .then(value => {
            store.updateData({
              ...store.data,
              ...value
            });
            store.markSaving(false);

            if (value && typeof value.step === 'number') {
              this.gotoStep(value.step);
            } else if (onFinished && onFinished(value, action) === false) {
              // 如果是 false 后面的操作就不执行
              return value;
            }

            if (redirect) {
              env.updateLocation(filter(redirect, store.data));
            } else if (reload) {
              this.reloadTarget(reload, store.data);
            }

            return value;
          })
          .catch(e => {
            store.markSaving(false);
            console.error(e);
          });
      } else {
        onFinished && onFinished(store.data, action);
      }
    }

    return false;
  }

  handleDialogConfirm(values: object[], action: Action, targets: Array<any>) {
    const {store} = this.props;

    if (
      action.mergeData &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      store.updateData(values[0]);
    }

    store.closeDialog();
  }

  handleDialogClose() {
    const {store} = this.props;
    store.closeDialog();
  }

  renderSteps() {
    const {steps, store, mode, classPrefix: ns, classnames: cx} = this.props;
    const currentStep = this.state.currentStep;

    return (
      <div
        className={`${ns}Wizard-steps ${ns}Wizard--${mode}`}
        id="form-wizard"
      >
        {Array.isArray(steps) && steps.length ? (
          <ul>
            {steps.map((step, key) => {
              const canJump = isJumpable(step, key, currentStep, store.data);

              return (
                <li
                  key={key}
                  className={cx({
                    'is-complete': canJump,
                    'is-active': currentStep === key + 1
                  })}
                  onClick={() => (canJump ? this.gotoStep(key + 1) : null)}
                >
                  <span
                    className={cx('Badge', {
                      // 'Badge--success': canJump && currentStep != key + 1,
                      'is-active':
                        currentStep === key + 1 ||
                        (canJump && currentStep != key + 1)
                    })}
                  >
                    {key + 1}
                  </span>
                  {step.title || step.label || `第 ${key + 1} 步`}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }

  renderActions() {
    const {
      steps,
      store,
      readOnly,
      disabled,
      actionClassName,
      actionPrevLabel,
      actionNextLabel,
      actionNextSaveLabel,
      actionFinishLabel,
      render
    } = this.props;

    if (!Array.isArray(steps)) {
      return null;
    }

    const currentStepIndex = this.state.currentStep;
    const nextStep = steps[currentStepIndex];
    const prevStep = steps[currentStepIndex - 2];
    const waiting = store.loading;
    const step = steps[currentStepIndex - 1];

    if (!step) {
      return null;
    }

    const prevCanJump = prevStep
      ? isJumpable(prevStep, currentStepIndex - 2, currentStepIndex, store.data)
      : false;

    if (step.actions && Array.isArray(step.actions)) {
      return step.actions.length ? (
        <>
          {step.actions.map((action: Action, index: number) =>
            render(`action/${index}`, action, {
              key: index,
              onAction: this.handleAction,
              disabled:
                action.disabled ||
                waiting ||
                disabled ||
                (action.actionType === 'prev' && !prevCanJump) ||
                (action.actionType === 'next' &&
                  readOnly &&
                  (!!step.api || !nextStep))
            })
          )}
        </>
      ) : null;
    }

    return (
      <>
        {render(
          `prev-btn`,
          {
            type: 'button',
            label: actionPrevLabel,
            actionType: 'prev',
            className: actionClassName
          },
          {
            disabled: waiting || !prevCanJump || disabled,
            onAction: this.handleAction
          }
        )}

        {render(
          `next-btn`,
          {
            type: 'button',
            label: !nextStep
              ? actionFinishLabel
              : !step.api
              ? actionNextLabel
              : actionNextSaveLabel,
            actionType: 'next',
            primary: !nextStep || !!step.api,
            className: actionClassName
          },
          {
            disabled:
              waiting || disabled || (readOnly && (!!step.api || !nextStep)),
            onAction: this.handleAction
          }
        )}
      </>
    );
  }

  renderFooter() {
    const actions = this.renderActions();

    if (!actions) {
      return actions;
    }
    const {classnames: cx, affixFooter} = this.props;

    return (
      <>
        <div ref={this.footerDom} className={cx('Panel-footer')}>
          {actions}
        </div>

        {affixFooter ? (
          <div ref={this.affixDom} className={cx('Panel-fixedBottom')}>
            <div className={cx('Panel-footer')}>{actions}</div>
          </div>
        ) : null}
      </>
    );
  }

  renderWizard() {
    const {
      className,
      steps,
      render,
      store,
      classPrefix: ns,
      classnames: cx
    } = this.props;

    const currentStep = this.state.currentStep;
    const step = Array.isArray(steps) ? steps[currentStep - 1] : null;

    return (
      <div
        ref={this.domRef}
        className={cx(`${ns}Panel ${ns}Panel--default ${ns}Wizard`, className)}
      >
        {this.renderSteps()}
        <div className={`${ns}Wizard-stepContent clearfix`}>
          {step ? (
            render(
              'body',
              {
                ...step,
                type: 'form',
                wrapWithPanel: false,

                // 接口相关需要外部来接管
                api: null
              },
              {
                key: this.state.currentStep,
                ref: this.formRef,
                onSubmit: this.handleSubmit,
                onAction: this.handleAction,
                disabled: store.loading,
                popOverContainer: this.getPopOverContainer,
                onChange: this.handleChange
              }
            )
          ) : currentStep === -1 ? (
            '初始中。。'
          ) : (
            <p className="text-danger">配置错误</p>
          )}
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
            show: store.dialogOpen
          }
        )}
        {this.renderFooter()}

        <Spinner size="lg" overlay key="info" show={store.loading} />
      </div>
    );
  }

  render() {
    return this.renderWizard();
  }
}

function isJumpable(step: any, index: number, currentStep: number, data: any) {
  let canJump = false;

  if (step && step.hasOwnProperty('jumpable')) {
    canJump = step.jumpable;
  } else if (step && step.jumpableOn) {
    canJump = evalExpression(
      step.jumpableOn,
      createObject(data, {
        currentStep
      })
    );
  } else {
    canJump = index + 1 < currentStep;
  }

  return canJump;
}

@Renderer({
  test: /(^|\/)wizard$/,
  storeType: ServiceStore.name,
  name: 'wizard',
  isolateScope: true
})
export class WizardRenderer extends Wizard {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  doAction(action: Action, data: object, throwErrors: boolean = false) {
    return this.handleAction(undefined, action, data);
  }

  submitToTarget(target: string, values: object) {
    const scoped = this.context as IScopedContext;
    scoped.send(target, values);
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  handleDialogConfirm(values: object[], action: Action, targets: Array<any>) {
    super.handleDialogConfirm(values, action, targets);

    const store = this.props.store;
    const scoped = this.context as IScopedContext;
    if (action.reload) {
      scoped.reload(action.reload, store.data);
    } else if (store.action && store.action.reload) {
      scoped.reload(store.action.reload, store.data);
    }
  }
}
