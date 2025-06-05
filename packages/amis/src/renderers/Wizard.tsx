import React from 'react';
import {ScopedContext, IScopedContext, filterTarget} from 'amis-core';
import {Renderer, RendererProps} from 'amis-core';
import {ServiceStore, IServiceStore} from 'amis-core';
import {Api, ActionObject} from 'amis-core';
import {filter, evalExpression} from 'amis-core';
import {toNumber} from 'amis-core';
import {
  createObject,
  until,
  isVisible,
  autobind,
  SkipOperation
} from 'amis-core';
import {isApiOutdated, isEffectiveApi} from 'amis-core';
import {IFormStore} from 'amis-core';
import {Spinner, SpinnerExtraProps} from 'amis-ui';
import {Steps} from 'amis-ui';
import {
  BaseSchema,
  FormSchema,
  SchemaApi,
  SchemaClassName,
  SchemaExpression,
  SchemaName,
  SchemaReload
} from '../Schema';

import {ActionSchema} from './Action';

import {tokenize, evalExpressionWithConditionBuilderAsync} from 'amis-core';
import {StepSchema} from './Steps';
import isEqual from 'lodash/isEqual';

export type WizardStepSchema = Omit<FormSchema, 'type'> &
  StepSchema & {
    /**
     * 当前步骤用来保存数据的 api。
     */
    api?: SchemaApi;

    asyncApi?: SchemaApi;

    /**
     * 当前步骤用来获取初始数据的 api
     */
    initApi?: SchemaApi;

    /**
     * 是否可直接跳转到该步骤，一般编辑模式需要可直接跳转查看。
     */
    jumpable?: boolean;

    /**
     * 通过 JS 表达式来配置当前步骤可否被直接跳转到。
     */
    jumpableOn?: SchemaExpression;

    /**
     * Step 标题
     */
    title?: string;
    label?: string;

    /**
     * 每一步可以单独配置按钮。如果不配置wizard会自动生成。
     */
    actions?: Array<ActionSchema>;

    /**
     * 保存完后，可以指定跳转地址，支持相对路径和组内绝对路径，同时可以通过 $xxx 使用变量
     */
    redirect?: string;

    reload?: SchemaReload;

    /**
     * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
     */
    target?: string;
  };

/**
 * 表单向导
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/wizard
 */
export interface WizardSchema extends BaseSchema, SpinnerExtraProps {
  /**
   * 指定为表单向导
   */
  type: 'wizard';

  /**
   * 配置按钮 className
   */
  actionClassName?: SchemaClassName;

  /**
   * 完成按钮的文字描述
   */
  actionFinishLabel?: string;

  /**
   * 下一步按钮的文字描述
   */
  actionNextLabel?: string;

  /**
   * 下一步并且保存按钮的文字描述
   */
  actionNextSaveLabel?: string;

  /**
   * 上一步按钮的文字描述
   */
  actionPrevLabel?: string;

  /**
   * Wizard 用来保存数据的 api。
   * [详情](https://baidu.github.io/amis/docs/api#wizard)
   */
  api?: SchemaApi;

  /**
   * 是否合并后再提交
   */
  bulkSubmit?: boolean;

  /**
   * Wizard 用来获取初始数据的 api。
   */
  initApi?: SchemaApi;

  /**
   * 展示模式
   *
   * @default vertical
   */
  mode?: 'vertical' | 'horizontal';

  name?: SchemaName;

  /**
   * 是否为只读模式。
   */
  readOnly?: boolean;

  /**
   * 保存完后，可以指定跳转地址，支持相对路径和组内绝对路径，同时可以通过 $xxx 使用变量
   */
  redirect?: string;

  reload?: SchemaReload;

  /**
   * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
   */
  target?: string;

  /**
   * 是否将底部按钮固定在底部。
   */
  affixFooter?: boolean | 'always';

  steps: Array<WizardStepSchema>;

  startStep?: string;

  /**
   * 步骤条区域css类
   */
  stepsClassName?: string;

  /**
   * 表单区域css类
   */
  bodyClassName?: string;

  /**
   * step + body区域css类
   */
  stepClassName?: string;

  /**
   * 底部操作栏的css类
   */
  footerClassName?: string;

  /**
   * 是否用panel包裹
   */
  wrapWithPanel?: boolean;
}

export interface WizardProps
  extends RendererProps,
    Omit<WizardSchema, 'className'> {
  store: IServiceStore;
  onFinished: (values: object, action: any) => any;
}

export interface WizardState {
  currentStep: number;
  completeStep: number;
  rawSteps: WizardStepSchema[];
}

export default class Wizard extends React.Component<WizardProps, WizardState> {
  static defaultProps: Partial<WizardProps> = {
    mode: 'horizontal', // vertical
    readOnly: false,
    messages: {},
    actionClassName: '',
    actionPrevLabel: 'Wizard.prev',
    actionNextLabel: 'Wizard.next',
    actionNextSaveLabel: 'Wizard.saveAndNext',
    actionFinishLabel: 'Wizard.finish',
    startStep: '1',
    wrapWithPanel: true
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
    'affixFooter',
    'startStep'
  ];

  dom: any;
  form: any;
  asyncCancel: () => void;

  initalValues: {
    [propName: string]: any;
  } = {};

  state: WizardState = {
    currentStep: -1, // init 完后会设置成 1
    completeStep: -1,
    rawSteps: []
  };

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
        .then(result => {
          this.handleFetchInitEvent(result);

          const state = {
            currentStep:
              typeof this.props.startStep === 'string'
                ? toNumber(
                    tokenize(
                      this.props.startStep,
                      createObject(this.props.data, result?.data || {})
                    ),
                    1
                  )
                : 1
          };

          if (
            result &&
            result.data &&
            (typeof result.data.step === 'number' ||
              (typeof result.data.step === 'string' &&
                /^\d+$/.test(result.data.step)))
          ) {
            state.currentStep = toNumber(result.data.step, 1);
          }

          this.setState(state, () => {
            // 如果 initApi 返回的状态是正在提交，则进入轮顺状态。
            if (
              result &&
              result.data &&
              (result.data.submiting || result.data.submited)
            ) {
              this.checkSubmit();
            }
          });
          return result;
        });
    } else {
      this.setState({
        currentStep:
          typeof this.props.startStep === 'string'
            ? toNumber(tokenize(this.props.startStep, this.props.data), 1)
            : 1
      });
    }

    this.normalizeSteps(store.data);
  }

  componentDidUpdate(prevProps: WizardProps) {
    const props = this.props;
    const {store, fetchSuccess, fetchFailed} = props;

    // 步骤steps、上下文数据data改变时需要执行normalizeSteps
    if (
      !isEqual(prevProps.steps, props.steps) ||
      !isEqual(prevProps.data, props.data)
    ) {
      this.normalizeSteps(props.data);
    }

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
  }

  async dispatchEvent(action: string, value?: object) {
    const {dispatchEvent, data} = this.props;

    const rendererEvent = await dispatchEvent(
      action,
      value ? createObject(data, value) : data
    );

    return rendererEvent?.prevented ?? false;
  }

  async handleFetchInitEvent(result: any) {
    const {onInit, store} = this.props;
    (await this.dispatchEvent('inited', {
      ...store.data, // 保留，兼容历史
      responseData: result.ok ? store.data ?? {} : result,
      responseStatus:
        result?.status === undefined ? (store.error ? 1 : 0) : result?.status,
      responseMsg: store.msg
    })) &&
      onInit &&
      onInit(store.data);
  }

  async normalizeSteps(values: any) {
    const {steps, translate: __} = this.props;
    const rawSteps: WizardStepSchema[] = [];
    const stepsLength = steps.length;
    // 这里有个bug，如果把第一个step隐藏，表单就不会渲染
    for (let i = 0; i < stepsLength; i++) {
      const hiddenFlag = await evalExpressionWithConditionBuilderAsync(
        steps[i].hiddenOn,
        values
      );
      !hiddenFlag && rawSteps.push(steps[i]);
    }
    this.setState({
      rawSteps: rawSteps.map((step, index) => ({
        ...step,
        hiddenOn: '',
        title:
          step.title ||
          step.label ||
          __('Steps.step', {
            index: index + 1
          })
      }))
    });
  }

  async gotoStep(index: number) {
    const steps = this.state.rawSteps;
    index = Math.max(Math.min(steps.length, index), 1);

    if (index != this.state.currentStep) {
      if (
        await this.dispatchEvent('stepChange', {
          step: index
        })
      ) {
        return;
      }

      this.setState({
        currentStep: index,
        completeStep: Math.max(this.state.completeStep, index - 1)
      });
    }
  }

  @autobind
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

  async reload(
    subPath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ) {
    if (query) {
      return this.receive(query, undefined, replace);
    }

    const {
      initApi,
      initAsyncApi,
      initFinishedField,
      store,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    if (isEffectiveApi(initApi, store.data) && this.state.currentStep === 1) {
      const value = await store.fetchInitData(initApi, store.data, {
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
      });
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
        state.currentStep = toNumber(value.data.step, 1);
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
    }

    return store.data;
  }

  receive(values: object, subPath?: string, replace?: boolean): Promise<any> {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    return this.reload();
  }

  @autobind
  domRef(ref: any) {
    this.dom = ref;
  }

  @autobind
  getPopOverContainer() {
    return this.dom;
  }

  // 用来还原异步提交状态。
  checkSubmit() {
    const {store, asyncApi, finishedField, env} = this.props;
    const steps = this.state.rawSteps;

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
        !finnalAsyncApi.silent && env.notify('error', e.message);
        store.markSaving(false);
      });
  }

  @autobind
  handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    const {onAction, store, env} = this.props;
    const steps = this.state.rawSteps;

    if (
      action.actionType === 'next' ||
      action.type === 'submit' ||
      action.actionType === 'step-submit'
    ) {
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

          const feedback = action.feedback;
          if (feedback && isVisible(feedback, store.data)) {
            const confirmed = await this.openFeedback(feedback, store.data);

            // 如果 feedback 配置了，取消就跳过原有逻辑。
            if (feedback.skipRestOnCancel && !confirmed) {
              throw new SkipOperation();
            } else if (feedback.skipRestOnConfirm && confirmed) {
              throw new SkipOperation();
            }
          }

          const reidrect =
            action.redirect && filter(action.redirect, store.data);
          reidrect && env.jumpTo(reidrect, action, store.data);

          action.reload &&
            this.reloadTarget(
              filterTarget(action.reload, store.data),
              store.data
            );
        })
        .catch(reason => {});
    } else if (action.actionType === 'reload') {
      action.target &&
        this.reloadTarget(filterTarget(action.target, data), data);
    } else if (action.actionType === 'goto-step') {
      const targetStep = (data as any).step;

      if (
        targetStep !== undefined &&
        targetStep <= steps.length &&
        targetStep >= 0
      ) {
        return this.gotoStep((data as any).step);
      }
    } else if (action.actionType === 'submit') {
      return this.finalSubmit();
    } else if (onAction) {
      return onAction(e, action, data, throwErrors, delegate || this.context);
    }
  }

  @autobind
  handleQuery(query: any) {
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
  async handleChange(values: object) {
    const {store} = this.props;

    const previous = store.data;
    const final = {...previous, ...values};

    if (await this.dispatchEvent('change', final)) {
      return;
    }

    store.updateData(values);
  }

  @autobind
  handleInit(values: any) {
    const step = this.state.currentStep;
    this.initalValues[step] = this.initalValues[step] || values;
    const store = this.props.store;

    store.updateData(values);
  }

  @autobind
  handleReset(values: any) {
    const {store} = this.props;
    const initalValue = this.initalValues[this.state.currentStep];
    const reseted: any = {};
    Object.keys(values).forEach(key => {
      reseted[key] = initalValue.hasOwnProperty(key)
        ? initalValue[key]
        : undefined;
    });

    store.updateData(reseted);
  }

  async finalSubmit(
    values: object = {},
    action: ActionObject = {type: 'submit'}
  ) {
    const {
      store,
      api,
      asyncApi,
      finishedField,
      target,
      redirect,
      reload,
      env,
      onFinished
    } = this.props;
    const steps = this.state.rawSteps;

    if (await this.dispatchEvent('finished', store.data)) {
      return;
    }

    const step = steps[this.state.currentStep - 1];
    store.updateData(values);

    // 最后一步
    if (target) {
      this.submitToTarget(filterTarget(target, store.data), store.data);
      this.setState({completeStep: steps.length});
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
        .saveRemote(action.api || step.api || api!, store.data, {
          onSuccess: async (result: any) => {
            const dispatcher = await this.dispatchEvent(
              'submitSucc',
              createObject(this.props.data, {result})
            );

            if (
              !isEffectiveApi(finnalAsyncApi, store.data) ||
              store.data[finishedField || 'finished']
            ) {
              return {
                cbResult: null,
                dispatcher
              };
            }

            const cbResult = until(
              () => store.checkRemote(finnalAsyncApi as Api, store.data),
              (ret: any) => ret && ret[finishedField || 'finished'],
              cancel => (this.asyncCancel = cancel)
            );
            return {
              cbResult,
              dispatcher
            };
          },
          onFailed: async (error: any) => {
            store.markSaving(false);
            const dispatcher = await this.dispatchEvent(
              'submitFail',
              createObject(this.props.data, {error})
            );
            return {
              dispatcher
            };
          }
        })
        .then(async value => {
          const feedback = action.feedback;
          if (feedback && isVisible(feedback, value)) {
            const confirmed = await this.openFeedback(feedback, value);

            // 如果 feedback 配置了，取消就跳过原有逻辑。
            if (feedback.skipRestOnCancel && !confirmed) {
              throw new SkipOperation();
            } else if (feedback.skipRestOnConfirm && confirmed) {
              throw new SkipOperation();
            }
          }

          this.setState({completeStep: steps.length});
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

          const finalRedirect =
            (action.redirect || step.redirect || redirect) &&
            filter(action.redirect || step.redirect || redirect, store.data);

          if (finalRedirect) {
            env.jumpTo(finalRedirect, action, store.data);
          } else if (action.reload || step.reload || reload) {
            this.reloadTarget(
              filterTarget(action.reload || step.reload || reload!, store.data),
              store.data
            );
          }

          return value;
        })
        .catch(error => {});
    } else {
      this.setState({completeStep: steps.length});

      if (onFinished && onFinished(store.data, action) === false) {
        return;
      }

      const finalRedirect =
        (action.redirect || step.redirect || redirect) &&
        filter(action.redirect || step.redirect || redirect, store.data);

      if (finalRedirect) {
        env.jumpTo(finalRedirect, action, store.data);
      } else if (action.reload || step.reload || reload) {
        this.reloadTarget(
          filterTarget(action.reload || step.reload || reload!, store.data),
          store.data
        );
      }
    }
  }

  // 接管里面 form 的提交，不能直接让 form 提交，因为 wizard 自己需要知道进度。
  @autobind
  handleSubmit(values: object, action: ActionObject) {
    const {store, finishedField} = this.props;
    const steps = this.state.rawSteps;

    if (this.state.currentStep < steps.length) {
      const step = steps[this.state.currentStep - 1];
      store.updateData(values);

      let finnalAsyncApi = action.asyncApi || step.asyncApi;

      isEffectiveApi(finnalAsyncApi, store.data) &&
        store.updateData({
          [finishedField || 'finished']: false
        });

      if (isEffectiveApi(action.api || step.api, store.data)) {
        store
          .saveRemote(action.api || step.api!, store.data, {
            onSuccess: () => {
              this.dispatchEvent('stepSubmitSucc');

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
            },
            onFailed: json => {
              this.dispatchEvent('stepSubmitFail', {error: json});
              if (json.status === 422 && json.errors && this.form) {
                this.form.props.store.setFormItemErrors(json.errors);
              }
            }
          })
          .then(async (value: any) => {
            const feedback = action.feedback;
            if (feedback && isVisible(feedback, value)) {
              const confirmed = await this.openFeedback(feedback, value);

              // 如果 feedback 配置了，取消就跳过原有逻辑。
              if (feedback.skipRestOnCancel && !confirmed) {
                throw new SkipOperation();
              } else if (feedback.skipRestOnConfirm && confirmed) {
                throw new SkipOperation();
              }
            }

            this.gotoStep(
              value && typeof value.step === 'number'
                ? value.step
                : this.state.currentStep + 1
            );
          })
          .catch(reason => {
            this.dispatchEvent('stepSubmitFail', {error: reason});
            // do nothing
          });
      } else {
        this.gotoStep(this.state.currentStep + 1);
      }
    } else {
      this.finalSubmit(values, action);
    }

    return false;
  }

  @autobind
  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    targets: Array<any>
  ) {
    const {store} = this.props;

    if (
      action.mergeData &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      store.updateData(values[0]);
    }

    store.closeDialog(true, values);
  }

  @autobind
  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
  }

  @autobind
  handleJumpStep(index: number, step: any) {
    const {store} = this.props;
    const {currentStep} = this.state;

    const canJump = isJumpable(step, index, currentStep, store.data);

    if (!canJump) {
      return;
    }
    this.gotoStep(index + 1);
  }

  renderSteps() {
    const {mode, classPrefix: ns, classnames: cx, stepsClassName} = this.props;
    const {currentStep, rawSteps: steps} = this.state;

    return (
      <div
        className={cx(`${ns}-Wizard-steps`, stepsClassName)}
        id="form-wizard"
      >
        {Array.isArray(steps) && steps.length ? (
          <Steps
            steps={steps as any}
            mode={mode}
            current={currentStep - 1}
            onClickStep={this.handleJumpStep}
          />
        ) : null}
      </div>
    );
  }

  renderActions() {
    const {
      store,
      readOnly,
      disabled,
      actionClassName,
      actionPrevLabel,
      actionNextLabel,
      actionNextSaveLabel,
      actionFinishLabel,
      render,
      translate: __,
      classnames: cx,
      testIdBuilder
    } = this.props;
    const steps = this.state.rawSteps;

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
          {step.actions.map((action, index) =>
            render(`action/${index}`, action, {
              key: `${currentStepIndex}-${index}`,
              data: createObject(this.props.data, {
                currentStep: currentStepIndex
              }),
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
            label: __(actionPrevLabel),
            actionType: 'prev',
            className: actionClassName,
            hiddenOn: '${currentStep === 1}',
            id: testIdBuilder?.getChild('button-prev').getTestIdValue()
          },
          {
            disabled: waiting || !prevCanJump || disabled,
            onAction: this.handleAction,
            data: createObject(this.props.data, {currentStep: currentStepIndex})
          }
        )}

        {render(
          `next-btn`,
          {
            type: 'button',
            label: !nextStep
              ? __(actionFinishLabel)
              : !step.api
              ? __(actionNextLabel)
              : __(actionNextSaveLabel),
            actionType: 'next',
            primary: !nextStep || !!step.api,
            className: actionClassName,
            level: 'primary',
            id: testIdBuilder?.getChild('button-next').getTestIdValue()
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

    const {
      classnames: cx,
      affixFooter,
      footerClassName,
      wrapWithPanel
    } = this.props;

    return (
      <div
        role="wizard-footer"
        className={cx(
          'Wizard-footer',
          wrapWithPanel ? 'Panel-footer' : '',
          affixFooter && wrapWithPanel ? 'Panel-fixedBottom' : '',
          footerClassName
        )}
      >
        {actions}
      </div>
    );
  }

  renderWizard() {
    const {
      className,
      steps: propsSteps,
      style,
      render,
      store,
      classPrefix: ns,
      classnames: cx,
      popOverContainer,
      mode,
      translate: __,
      loadingConfig,
      stepClassName,
      bodyClassName,
      wrapWithPanel
    } = this.props;
    const {rawSteps: stateSteps, currentStep} = this.state;

    // 这里初次渲染时，需要取props的steps
    const steps =
      Array.isArray(stateSteps) && stateSteps.length > 0
        ? stateSteps
        : Array.isArray(propsSteps)
        ? [...propsSteps].map(step => {
            delete step.hiddenOn;
            return step;
          })
        : null;

    const step = Array.isArray(steps) ? steps[currentStep - 1] : null;

    return (
      <div
        ref={this.domRef}
        className={cx(
          wrapWithPanel ? `${ns}Panel ${ns}Panel--default` : '',
          `${ns}Wizard ${ns}Wizard--${mode}`,
          className
        )}
        style={style}
      >
        <div className={cx(`${ns}Wizard-step`, stepClassName)}>
          {this.renderSteps()}
          <div
            role="wizard-body"
            className={cx(`${ns}Wizard-stepContent clearfix`, bodyClassName)}
          >
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
                  onInit: this.handleInit,
                  onReset: this.handleReset,
                  onSubmit: this.handleSubmit,
                  onAction: this.handleAction,
                  onQuery: this.handleQuery,
                  disabled: store.loading,
                  popOverContainer:
                    popOverContainer || this.getPopOverContainer,
                  onChange: this.handleChange,
                  formStore: undefined
                }
              )
            ) : currentStep === -1 ? (
              __('loading')
            ) : (
              <p className="text-danger">{__('Wizard.configError')}</p>
            )}
          </div>
          {this.renderFooter()}
        </div>

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
            show: store.dialogOpen
          }
        )}
        <Spinner
          loadingConfig={loadingConfig}
          size="lg"
          overlay
          key="info"
          show={store.loading}
        />
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
  type: 'wizard',
  storeType: ServiceStore.name,
  isolateScope: true
})
export class WizardRenderer extends Wizard {
  static contextType = ScopedContext;

  constructor(props: WizardProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
    super.componentWillUnmount();
  }

  doAction(action: ActionObject, data: object, throwErrors: boolean = false) {
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

  @autobind
  handleDialogConfirm(
    values: object[],
    action: ActionObject,
    targets: Array<any>
  ) {
    super.handleDialogConfirm(values, action, targets);

    const store = this.props.store;
    const scoped = this.context as IScopedContext;
    if (action.reload) {
      scoped.reload(action.reload, store.data);
    } else if (store.action && store.action.reload) {
      scoped.reload(store.action.reload, store.data);
    }
  }

  setData(values: object, replace?: boolean) {
    return this.props.store.updateData(values, undefined, replace);
  }

  getData() {
    const {store} = this.props;
    return store.data;
  }
}
