import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../../factory';
import {observer} from 'mobx-react';
import {FormStore, IFormStore} from '../../store/form';
import {Api, SchemaNode, Schema, Action, ApiObject, Payload} from '../../types';
import {filter, evalExpression} from '../../utils/tpl';
import cx from 'classnames';
import getExprProperties from '../../utils/filter-schema';
import {
  promisify,
  difference,
  until,
  noop,
  isObject,
  isVisible,
  cloneObject,
  SkipOperation
} from '../../utils/helper';
import debouce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import Scoped, {
  ScopedContext,
  IScopedContext,
  ScopedComponentType
} from '../../Scoped';
import {IComboStore} from '../../store/combo';
import qs from 'qs';
import {dataMapping} from '../../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../../utils/api';
import Spinner from '../../components/Spinner';
import {LazyComponent} from '../../components';
import {isAlive} from 'mobx-state-tree';
import {asFormItem} from './Item';
import {SimpleMap} from '../../utils/SimpleMap';
import {trace} from 'mobx';
import {BaseSchema, SchemaApi, SchemaDefaultData} from '../../Schema';
import {ActionSchema} from '../Action';

export interface FormSchemaHorizontal {
  left?: number;
  right?: number;
  leftField?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
}

/**
 * amis Form 渲染器，格式说明。https://baidu.gitee.io/amis/docs/components/form/index
 */
export interface FormSchema extends BaseSchema {
  type: 'form';
  title?: string;

  actions?: Array<ActionSchema>;
  controls?: Array<any>; // todo

  /**
   * @deprecated
   */
  tabs?: any;

  /**
   * @deprecated
   */
  fieldSet?: any;

  data?: SchemaDefaultData;

  debug?: boolean;

  /**
   * Form 用来保存数据的 api。
   */
  api?: SchemaApi;

  /**
   * 用来初始化表单数据
   */
  initApi?: SchemaApi;

  mode?: 'normal' | 'inline' | 'horizontal';
  horizontal?: FormSchemaHorizontal;
}

export type FormGroup = FormSchema & {
  title?: string;
  className?: string;
};
export type FormGroupNode = FormGroup | FormGroupArray;
export interface FormGroupArray extends Array<FormGroupNode> {}

export type FormHorizontal = FormSchemaHorizontal;

export interface FormProps extends RendererProps, Omit<FormSchema, 'mode'> {
  data: any;
  store: IFormStore;
  wrapperComponent: React.ReactType;
  title?: string; // 标题
  submitText?: string;
  submitOnChange?: boolean; // 设置是否一修改就提交。
  submitOnInit?: boolean;
  resetAfterSubmit?: boolean;
  initApi?: Api; // 可以用来设置初始数据。
  initAsyncApi?: Api; // 如果 api 处理时间过长，可以开启 initAsyncApi 来处理。轮询检测是否真的完成了。
  initCheckInterval?: number;
  initFinishedField?: string;
  interval?: number;
  silentPolling?: boolean;
  stopAutoRefreshWhen?: string;
  api?: Api; // 用来保存的 api
  asyncApi?: Api; // 如果 api 处理时间过长，可以开启 asyncApi 来处理。轮询检测是否真的完成了。
  checkInterval?: number;
  finishedField?: string;
  initFetch?: boolean; // 是否初始拉取？
  initFetchOn?: string;
  className?: string;
  body?: SchemaNode;
  wrapWithPanel?: boolean;
  panelClassName?: string;
  mode?: 'normal' | 'inline' | 'horizontal' | 'row';
  affixFooter?: boolean;
  collapsable?: boolean;
  debug?: boolean;
  autoFocus?: boolean;
  horizontal: FormHorizontal;
  canAccessSuperData: boolean;
  persistData: boolean; // 开启本地缓存
  clearPersistDataAfterSubmit: boolean; // 提交成功后清空本地缓存
  trimValues?: boolean;
  lazyLoad?: boolean;
  simpleMode?: boolean;
  onInit?: (values: object, props: any) => any;
  onReset?: (values: object) => void;
  onSubmit?: (values: object, action: any) => any;
  onChange?: (values: object, diff: object, props: any) => any;
  onFailed?: (reason: string, errors: any) => any;
  onFinished: (values: object, action: any) => any;
  onValidate: (values: object, form: any) => any;
  messages: {
    fetchSuccess?: string;
    fetchFailed?: string;
    saveSuccess?: string;
    saveFailed?: string;
    validateFailed?: string;
  };
  lazyChange?: boolean; // 表单项的
  formLazyChange?: boolean; // 表单的
}

export default class Form extends React.Component<FormProps, object> {
  static defaultProps = {
    title: '表单',
    submitText: '提交',
    initFetch: true,
    wrapWithPanel: true,
    mode: 'normal',
    collapsable: false,
    controlWidth: 'full',
    horizontal: {
      left: 2,
      right: 10,
      offset: 2
    },
    panelClassName: 'Panel--default',
    messages: {
      fetchFailed: '初始化失败',
      saveSuccess: '保存成功',
      saveFailed: '保存失败'
    },
    wrapperComponent: '',
    finishedField: 'finished',
    initFinishedField: 'finished'
  };
  static propsList: Array<string> = [
    'title',
    'header',
    'controls',
    'tabs',
    'fieldSet',
    'submitText',
    'initFetch',
    'wrapWithPanel',
    'mode',
    'collapsable',
    'horizontal',
    'panelClassName',
    'messages',
    'wrapperComponent',
    'resetAfterSubmit',
    'submitOnInit',
    'submitOnChange',
    'onInit',
    'onReset',
    'onSubmit',
    'onChange',
    'onFailed',
    'onFinished',
    'onSaved',
    'canAccessSuperData',
    'lazyChange',
    'formLazyChange',
    'lazyLoad',
    'formInited',
    'simpleMode'
  ];

  hooks: {
    [propName: string]: Array<() => Promise<any>>;
  } = {};
  asyncCancel: () => void;
  disposeOnValidate: () => void;
  shouldLoadInitApi: boolean = false;
  timer: NodeJS.Timeout;
  mounted: boolean;
  lazyHandleChange = debouce(this.handleChange.bind(this), 250, {
    trailing: true,
    leading: false
  });
  componentCache: SimpleMap = new SimpleMap();
  constructor(props: FormProps) {
    super(props);

    this.onInit = this.onInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.addHook = this.addHook.bind(this);
    this.removeHook = this.removeHook.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderFormItems = this.renderFormItems.bind(this);
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
  }

  componentWillMount() {
    const {store, canAccessSuperData, persistData, simpleMode} = this.props;

    store.setCanAccessSuperData(canAccessSuperData !== false);
    persistData && store.getPersistData();

    if (simpleMode) {
      store.setInited(true);
    }

    if (
      store &&
      store.parentStore &&
      store.parentStore.storeType === 'ComboStore'
    ) {
      const combo = store.parentStore as IComboStore;
      combo.addForm(store);
      combo.forms.forEach(item =>
        item.items.forEach(item => item.unique && item.syncOptions())
      );
    }
  }

  componentDidMount() {
    const {
      initApi,
      initFetch,
      initFetchOn,
      initAsyncApi,
      initFinishedField,
      initCheckInterval,
      store,
      messages: {fetchSuccess, fetchFailed},
      onValidate
    } = this.props;

    this.mounted = true;

    if (onValidate) {
      const finnalValidate = promisify(onValidate);
      this.disposeOnValidate = this.addHook(async () => {
        const result = await finnalValidate(store.data, store);

        if (result && isObject(result)) {
          Object.keys(result).forEach(key => {
            let msg = result[key];
            const item = store.getItemByName(key);

            // 没有这个 formItem
            if (!item) {
              return;
            }

            if (msg) {
              msg = Array.isArray(msg) ? msg : [msg];
              item.addError(msg);
            } else {
              item.clearError();
            }
          });
        }
      });
    }

    if (isEffectiveApi(initApi, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(initApi as any, store.data, {
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
              cancel => (this.asyncCancel = cancel),
              initCheckInterval
            );
          }
        })
        .then(this.initInterval)
        .then(this.onInit);
    } else {
      setTimeout(this.onInit.bind(this), 4);
    }
  }

  componentDidUpdate(prevProps: FormProps) {
    const props = this.props;
    const store = props.store;

    if (
      isApiOutdated(
        prevProps.initApi,
        props.initApi,
        prevProps.data,
        props.data
      )
    ) {
      const {fetchSuccess, fetchFailed} = props;

      store
        .fetchData(props.initApi as Api, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        })
        .then(this.initInterval);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    // this.lazyHandleChange.flush();
    this.lazyHandleChange.cancel();
    this.asyncCancel && this.asyncCancel();
    this.disposeOnValidate && this.disposeOnValidate();
    this.componentCache.dispose();
  }

  async onInit() {
    const {onInit, store, submitOnInit} = this.props;
    if (!isAlive(store)) {
      return;
    }

    // 先拿出来数据，主要担心 form 被什么东西篡改了，然后又应用出去了
    // 之前遇到过问题，所以拿出来了。但是 options  loadOptions 默认值失效了。
    // 所以目前需要两个都要设置一下，再 init Hook 里面。
    let data = cloneObject(store.data);
    const initedAt = store.initedAt;

    store.setInited(true);
    const hooks: Array<(data: any) => Promise<any>> = this.hooks['init'] || [];
    await Promise.all(hooks.map(hook => hook(data)));

    if (!isAlive(store)) {
      return;
    }

    if (store.initedAt !== initedAt) {
      // 说明，之前的数据已经失效了。
      // 比如 combo 一开始设置了初始值，然后 form 的 initApi 又返回了新的值。
      // 这个时候 store 的数据应该已经 init 了新的值。但是 data 还是老的，这个时候
      // onInit 出去就是错误的。
      data = {
        ...data,
        ...store.data
      };
    }

    onInit && onInit(data, this.props);

    submitOnInit &&
      this.handleAction(
        undefined,
        {
          type: 'submit'
        },
        store.data
      );
  }

  reload(subPath?: string, query?: any, ctx?: any, silent?: boolean) {
    if (query) {
      return this.receive(query);
    }

    const {
      store,
      initApi,
      initAsyncApi,
      initFinishedField,
      messages: {fetchSuccess, fetchFailed}
    } = this.props;

    isEffectiveApi(initAsyncApi, store.data) &&
      store.updateData({
        [initFinishedField || 'finished']: false
      });

    isEffectiveApi(initApi, store.data)
      ? store
          .fetchInitData(initApi, store.data, {
            successMessage: fetchSuccess,
            errorMessage: fetchFailed,
            silent,
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
          .then(this.initInterval)
          .then(() => store.reset(undefined, false))
      : store.reset(undefined, false);
  }

  receive(values: object) {
    const {store} = this.props;

    store.updateData(values);
    this.reload();
  }

  silentReload(target?: string, query?: any) {
    this.reload(target, query, undefined, true);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

    clearTimeout(this.timer);
    interval &&
      this.mounted &&
      (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 3000)
      ));
    return value;
  }

  isValidated() {
    return this.props.store.validated;
  }

  validate(forceValidate?: boolean): Promise<boolean> {
    const {store} = this.props;

    this.flush();
    return store.validate(this.hooks['validate'] || [], forceValidate);
  }

  clearErrors() {
    const {store} = this.props;

    return store.clearErrors();
  }

  getValues() {
    const {store} = this.props;
    this.flush();
    return store.data;
  }

  setValues(value: any) {
    const {store} = this.props;
    this.flush();
    store.setValues(value);
  }

  submit(fn?: (values: object) => Promise<any>): Promise<any> {
    const {store, messages, translate: __} = this.props;
    this.flush();

    return store.submit(
      fn,
      this.hooks['validate'] || [],
      __(messages && messages.validateFailed)
    );
  }

  // 如果开启了 lazyChange，需要一个 flush 方法把队列中值应用上。
  flush() {
    const hooks = this.hooks['flush'] || [];
    hooks.forEach(fn => fn());
    this.lazyHandleChange.flush();
  }

  reset() {
    const {store, onReset} = this.props;
    store.reset(onReset);
  }

  addHook(fn: () => any, type: 'validate' | 'init' | 'flush' = 'validate') {
    this.hooks[type] = this.hooks[type] || [];
    this.hooks[type].push(type === 'flush' ? fn : promisify(fn));
    return () => {
      this.removeHook(fn, type);
      fn = noop;
    };
  }

  removeHook(fn: () => any, type: string = 'validate') {
    const hooks = this.hooks[type];

    if (!hooks) {
      return;
    }

    for (let i = 0, len = hooks.length; i < len; i++) {
      let hook = hooks[i];

      if (hook === fn || (hook as any).raw === fn) {
        hooks.splice(i, 1);
        len--;
        i--;
      }
    }
  }

  handleChange(value: any, name: string, submit: boolean) {
    const {onChange, store, submitOnChange} = this.props;

    onChange &&
      onChange(store.data, difference(store.data, store.pristine), this.props);

    (submit || submitOnChange) &&
      this.handleAction(
        undefined,
        {
          type: 'submit'
        },
        store.data
      );
  }

  handleFormSubmit(e: React.UIEvent<any>) {
    e.preventDefault();
    return this.handleAction(
      e,
      {
        type: 'submit'
      },
      this.props.store.data
    );
  }

  handleAction(
    e: React.UIEvent<any> | void,
    action: Action,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): any {
    const {
      store,
      onSubmit,
      api,
      asyncApi,
      finishedField,
      checkInterval,
      messages: {saveSuccess, saveFailed},
      resetAfterSubmit,
      onAction,
      onSaved,
      onReset,
      onFinished,
      onFailed,
      redirect,
      reload,
      target,
      env,
      onChange,
      clearPersistDataAfterSubmit,
      trimValues,
      translate: __
    } = this.props;

    // 做动作之前，先把数据同步一下。
    this.flush();

    if (trimValues) {
      store.trimValues();
    }

    // 如果 data 就是当前层，则 flush 一下。
    if (data === this.props.data) {
      data = store.data;
    }

    if (Array.isArray(action.required) && action.required.length) {
      return store.validateFields(action.required).then(result => {
        if (!result) {
          env.notify('error', __('依赖的部分字段没有通过验证，请注意填写！'));
        } else {
          this.handleAction(
            e,
            {...action, required: undefined},
            data,
            throwErrors,
            delegate
          );
        }
      });
    }

    if (
      action.type === 'submit' ||
      action.actionType === 'submit' ||
      action.actionType === 'confirm'
    ) {
      store.setCurrentAction(action);
      return this.submit((values): any => {
        if (onSubmit && onSubmit(values, action) === false) {
          return Promise.resolve(false);
        }

        if (target) {
          this.submitToTarget(target, values);
        } else if (action.actionType === 'reload') {
          action.target && this.reloadTarget(action.target, values);
        } else if (action.actionType === 'dialog') {
          store.openDialog(data);
        } else if (action.actionType === 'drawer') {
          store.openDrawer(data);
        } else if (isEffectiveApi(action.api || api, values)) {
          let finnalAsyncApi = action.asyncApi || asyncApi;

          isEffectiveApi(finnalAsyncApi, store.data) &&
            store.updateData({
              [finishedField || 'finished']: false
            });

          return store
            .saveRemote(action.api || (api as Api), values, {
              successMessage: saveSuccess,
              errorMessage: saveFailed,
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
                  cancel => (this.asyncCancel = cancel),
                  checkInterval
                );
              }
            })
            .then(async response => {
              onSaved && onSaved(values, response);

              // submit 也支持 feedback
              if (action.feedback && isVisible(action.feedback, store.data)) {
                const confirmed = await this.openFeedback(
                  action.feedback,
                  store.data
                );

                // 如果 feedback 配置了，取消就跳过原有逻辑。
                if (action.feedback.skipRestOnCancel && !confirmed) {
                  throw new SkipOperation();
                }
              }

              // return values;
            });
        }

        return Promise.resolve(null);
      })
        .then(values => {
          // 有可能 onSubmit return false 了，那么后面的就不应该再执行了。
          if (values === false) {
            return store.data;
          }

          if (onFinished && onFinished(values, action) === false) {
            return values;
          }

          resetAfterSubmit && store.reset(onReset);
          clearPersistDataAfterSubmit && store.clearPersistData();

          if (action.redirect || redirect) {
            const finalRedirect = filter(
              action.redirect || redirect,
              store.data
            );
            finalRedirect && env.jumpTo(finalRedirect, action);
          } else if (action.reload || reload) {
            this.reloadTarget(action.reload || reload, store.data);
          }

          action.close && this.closeTarget(action.close);
          return values;
        })
        .catch(reason => {
          if (reason instanceof SkipOperation) {
            return;
          }

          onFailed && onFailed(reason, store.errors);

          if (throwErrors) {
            throw reason;
          }
        });
    } else if (action.type === 'reset') {
      store.setCurrentAction(action);
      store.reset(onReset);
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(data);
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(data);
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
      if (!isEffectiveApi(action.api)) {
        return env.alert(__(`当 actionType 为 ajax 时，请设置 api 属性`));
      }

      return store
        .saveRemote(action.api as Api, data, {
          successMessage: __(
            (action.messages && action.messages.success) || saveSuccess
          ),
          errorMessage: __(
            (action.messages && action.messages.failed) || saveFailed
          )
        })
        .then(async response => {
          response &&
            onChange &&
            onChange(
              store.data,
              difference(store.data, store.pristine),
              this.props
            );
          if (store.validated) {
            await this.validate(true);
          }

          if (action.feedback && isVisible(action.feedback, store.data)) {
            await this.openFeedback(action.feedback, store.data);
          }

          const redirect =
            action.redirect && filter(action.redirect, store.data);
          redirect && env.jumpTo(redirect, action);

          action.reload && this.reloadTarget(action.reload, store.data);
          action.close && this.closeTarget(action.close);
        })
        .catch(e => {
          onFailed && onFailed(e, store.errors);
          if (throwErrors) {
            throw e;
          }
        });
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action);
      action.target && this.reloadTarget(action.target, data);
    } else if (onAction) {
      // 不识别的丢给上层去处理。
      return onAction(e, action, data, throwErrors, delegate || this.context);
    }
  }

  handleDialogConfirm(
    values: object[],
    action: Action,
    ctx: any,
    targets: Array<any>
  ) {
    const {store, onChange} = this.props;

    if (
      (action.mergeData || store.action.mergeData) &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      store.updateData(values[0]);
      onChange &&
        onChange(
          store.data,
          difference(store.data, store.pristine),
          this.props
        );
    }

    store.closeDialog(true);
  }

  handleDialogClose() {
    const {store} = this.props;
    store.closeDialog(false);
  }

  handleDrawerConfirm(
    values: object[],
    action: Action,
    ctx: any,
    targets: Array<any>
  ) {
    const {store, onChange} = this.props;

    if (
      (action.mergeData || store.action.mergeData) &&
      values.length === 1 &&
      values[0] &&
      targets[0].props.type === 'form'
    ) {
      store.updateData(values[0]);
      onChange &&
        onChange(
          store.data,
          difference(store.data, store.pristine),
          this.props
        );
    }

    store.closeDrawer(true);
  }

  handleDrawerClose() {
    const {store} = this.props;
    store.closeDrawer(false);
  }

  submitToTarget(target: string, values: object) {
    // 会被覆写
  }

  reloadTarget(target: string, data?: any) {
    // 会被覆写
  }

  closeTarget(target: string) {
    // 会被覆写
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

  buildActions() {
    const {actions, submitText, controls, translate: __} = this.props;

    if (
      typeof actions !== 'undefined' ||
      !submitText ||
      (Array.isArray(controls) &&
        controls.some(
          item =>
            !!~['submit', 'button', 'reset', 'button-group'].indexOf(
              (item as Schema).type
            )
        ))
    ) {
      return actions;
    }

    return [
      {
        type: 'submit',
        label: __(submitText),
        primary: true
      }
    ];
  }

  renderFormItems(
    schema: Partial<FormSchema>,
    region: string = '',
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    return this.renderControls(schema.controls!, region, otherProps);

    // return schema.tabs ? this.renderTabs(schema.tabs, schema, region)
    // : schema.fieldSet ? this.renderFiledSet(schema.fieldSet, schema, region) : this.renderControls(schema.controls as SchemaNode, schema, region);
  }

  renderControls(
    controls: Array<any>,
    region: string,
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    controls = controls || [];

    if (!Array.isArray(controls)) {
      controls = [controls];
    }

    if (this.props.mode === 'row') {
      const ns = this.props.classPrefix;

      controls = flatten(controls).filter(item => {
        if ((item as Schema).hidden || (item as Schema).visible === false) {
          return false;
        }

        const exprProps = getExprProperties(
          item as Schema,
          this.props.store.data
        );
        if (exprProps.hidden || exprProps.visible === false) {
          return false;
        }

        return true;
      });

      if (!controls.length) {
        return null;
      }

      return (
        <div className={`${ns}Form-row`}>
          {controls.map((control, key) =>
            ~['hidden', 'formula'].indexOf((control as any).type) ||
            (control as any).mode === 'inline' ? (
              this.renderControl(control, key, otherProps)
            ) : (
              <div
                key={key}
                className={cx(
                  `${ns}Form-col`,
                  (control as Schema).columnClassName
                )}
              >
                {this.renderControl(control, '', {
                  ...otherProps,
                  mode: 'row'
                })}
              </div>
            )
          )}
        </div>
      );
    }

    return controls.map((control, key) =>
      this.renderControl(control, key, otherProps, region)
    );
  }

  renderControl(
    control: SchemaNode,
    key: any = '',
    otherProps: Partial<FormProps> = {},
    region: string = ''
  ): React.ReactNode {
    if (!control) {
      return null;
    } else if (typeof control === 'string') {
      control = {
        type: 'tpl',
        tpl: control
      };
    }

    const props = {
      ...this.props,
      ...otherProps
    };
    const form = this.props.store;
    const {
      render,
      mode,
      horizontal,
      store,
      disabled,
      controlWidth,
      resolveDefinitions,
      lazyChange,
      formLazyChange
    } = props;

    const subProps = {
      formStore: form,
      data: store.data,
      key: `${(control as Schema).name || ''}-${
        (control as Schema).type
      }-${key}`,
      formInited: form.inited,
      formMode: mode,
      formHorizontal: horizontal,
      controlWidth,
      disabled: disabled || (control as Schema).disabled || form.loading,
      btnDisabled: form.loading || form.validating,
      onAction: this.handleAction,
      onChange:
        formLazyChange === false ? this.handleChange : this.lazyHandleChange,
      addHook: this.addHook,
      removeHook: this.removeHook,
      renderFormItems: this.renderFormItems,
      formPristine: form.pristine
    };

    const subSchema: any =
      (control as Schema).type === 'control'
        ? control
        : {
            type: 'control',
            control
          };

    if (subSchema.control) {
      let control = subSchema.control as Schema;
      if (control.$ref) {
        subSchema.control = control = {
          ...resolveDefinitions(control.$ref),
          ...control,
          ...getExprProperties(control, store.data)
        };
        delete control.$ref;
      } else {
        subSchema.control = control = {
          ...control,
          ...getExprProperties(control, store.data)
        };
      }

      // 自定义组件如果在节点设置了 label name 什么的，就用 formItem 包一层
      // 至少自动支持了 valdiations, label, description 等逻辑。
      if (
        control.component &&
        (control.formItemConfig ||
          (control.label !== undefined && control.name))
      ) {
        const cache = this.componentCache.get(control.component);

        if (cache) {
          control.component = cache;
        } else {
          const cache = asFormItem({
            strictMode: false,
            ...control.formItemConfig
          })(control.component);
          this.componentCache.set(control.component, cache);
          control.component = cache;
        }
      }

      control.hiddenOn && (subSchema.hiddenOn = control.hiddenOn);
      control.visibleOn && (subSchema.visibleOn = control.visibleOn);
      lazyChange === false && (control.changeImmediately = true);
    }

    return render(`${region ? `${region}/` : ''}${key}`, subSchema, subProps);
  }

  renderBody() {
    const {
      tabs,
      fieldSet,
      controls,
      mode,
      className,
      classnames: cx,
      debug,
      $path,
      store,
      render
    } = this.props;

    const WrapperComponent =
      this.props.wrapperComponent ||
      (/(?:\/|^)form\//.test($path as string) ? 'div' : 'form');

    return (
      <WrapperComponent
        className={cx(`Form`, `Form--${mode || 'normal'}`, className)}
        onSubmit={this.handleFormSubmit}
        noValidate
      >
        {debug ? (
          <pre>
            <code>{JSON.stringify(store.data, null, 2)}</code>
          </pre>
        ) : null}

        <Spinner show={store.loading} overlay />

        {this.renderFormItems({
          tabs,
          fieldSet,
          controls
        })}

        {render(
          'modal',
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

        {render(
          'modal',
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
            show: store.drawerOpen
          }
        )}
      </WrapperComponent>
    );
  }

  render() {
    const {
      wrapWithPanel,
      render,
      title,
      store,
      panelClassName,
      headerClassName,
      footerClassName,
      actionsClassName,
      bodyClassName,
      classnames: cx,
      affixFooter,
      lazyLoad,
      translate: __
    } = this.props;

    // trace(true);
    // console.log('Form');

    let body: JSX.Element = this.renderBody();

    if (wrapWithPanel) {
      body = render(
        'body',
        {
          type: 'panel',
          title: __(title)
        },
        {
          className: cx(panelClassName, 'Panel--form'),
          children: body,
          actions: this.buildActions(),
          onAction: this.handleAction,
          disabled: store.loading,
          btnDisabled: store.loading || store.validating,
          headerClassName,
          footerClassName,
          actionsClassName,
          bodyClassName,
          affixFooter
        }
      ) as JSX.Element;
    }

    if (lazyLoad) {
      body = <LazyComponent>{body}</LazyComponent>;
    }

    return body;
  }
}

@Renderer({
  test: (path: string) =>
    /(^|\/)form$/.test(path) &&
    !/(^|\/)form(?:\/.+)?\/control\/form$/.test(path),
  storeType: FormStore.name,
  name: 'form',
  isolateScope: true
})
export class FormRenderer extends Form {
  static contextType = ScopedContext;

  componentWillMount() {
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
    super.componentWillMount();
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.props.autoFocus) {
      const scoped = this.context as IScopedContext;
      const inputs = scoped.getComponents();
      let focuableInput = find(
        inputs,
        input => input.focus
      ) as ScopedComponentType;
      focuableInput && setTimeout(() => focuableInput.focus!(), 200);
    }
  }

  componentWillUnmount() {
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);

    super.componentWillUnmount();
  }

  doAction(
    action: Action,
    data: object = this.props.store.data,
    throwErrors: boolean = false
  ) {
    return this.handleAction(undefined, action, data, throwErrors);
  }

  handleAction(
    e: React.UIEvent<any> | undefined,
    action: Action,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    if (action.target && action.actionType !== 'reload') {
      const scoped = this.context as IScopedContext;

      return Promise.all(
        action.target.split(',').map(name => {
          let target = scoped.getComponentByName(name);
          return (
            target &&
            target.doAction &&
            target.doAction(
              {
                ...action,
                target: undefined
              },
              ctx,
              throwErrors
            )
          );
        })
      );
    } else {
      return super.handleAction(e, action, ctx, throwErrors, delegate);
    }
  }

  handleDialogConfirm(
    values: object[],
    action: Action,
    ctx: any,
    targets: Array<any>
  ) {
    super.handleDialogConfirm(values, action, ctx, targets);

    const store = this.props.store;
    const scoped = this.context as IScopedContext;

    if (action.reload) {
      scoped.reload(action.reload, ctx);
    } else if (store.action && store.action.reload) {
      scoped.reload(store.action.reload, ctx);
    }
  }

  submitToTarget(target: string, values: object) {
    const scoped = this.context as IScopedContext;
    scoped.send(target, values);
  }

  reloadTarget(target: string, data: any) {
    const scoped = this.context as IScopedContext;
    scoped.reload(target, data);
  }

  closeTarget(target: string) {
    const scoped = this.context as IScopedContext;
    scoped.close(target);
  }

  reload(target?: string, query?: any, ctx?: any, silent?: boolean) {
    if (query) {
      return this.receive(query);
    }

    const scoped = this.context as IScopedContext;
    let subPath: string = '';
    let idx: number;
    let subQuery: any = null;
    if (target && ~(idx = target.indexOf('.'))) {
      subPath = target.substring(idx + 1);
      target = target.substring(0, idx);
    }
    const idx2 = target ? target.indexOf('?') : -1;
    if (~idx2) {
      subQuery = dataMapping(
        qs.parse((target as string).substring(idx2 + 1)),
        ctx
      );
      target = (target as string).substring(0, idx2);
    }

    let component;
    if (
      target &&
      (component = scoped.getComponentByName(target)) &&
      component.reload
    ) {
      component.reload(subPath, subQuery, ctx);
    } else if (target === '*') {
      super.reload(target, query, ctx, silent);
      const components = scoped.getComponents();
      components.forEach(
        (component: any) =>
          component.reload && component.reload('', subQuery, ctx)
      );
    } else {
      super.reload(target, query, ctx, silent);
    }
  }

  receive(values: object, name?: string) {
    if (name) {
      const scoped = this.context as IScopedContext;
      const idx = name.indexOf('.');
      let subPath = '';

      if (~idx) {
        subPath = name.substring(1 + idx);
        name = name.substring(0, idx);
      }

      const component = scoped.getComponentByName(name);
      component && component.receive && component.receive(values, subPath);
      return;
    }

    return super.receive(values);
  }
}
