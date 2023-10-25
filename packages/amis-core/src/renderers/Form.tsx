import React from 'react';
import extend from 'lodash/extend';
import {Renderer, RendererProps} from '../factory';
import {FormStore, IFormStore} from '../store/form';
import {
  Api,
  SchemaNode,
  Schema,
  ActionObject,
  Payload,
  ClassName,
  BaseApiObject,
  SchemaExpression,
  SchemaClassName
} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import getExprProperties from '../utils/filter-schema';
import {
  promisify,
  difference,
  until,
  noop,
  isObject,
  isVisible,
  cloneObject,
  SkipOperation,
  isEmpty,
  getVariable,
  isObjectShallowModified,
  qsparse,
  repeatCount,
  createObject
} from '../utils/helper';

import debouce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import find from 'lodash/find';
import {
  ScopedContext,
  IScopedContext,
  ScopedComponentType,
  filterTarget
} from '../Scoped';

import {IComboStore} from '../store/combo';
import {dataMapping} from '../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import LazyComponent from '../components/LazyComponent';
import {isAlive} from 'mobx-state-tree';

import type {LabelAlign} from './Item';
import {injectObjectChain} from '../utils';

export interface FormHorizontal {
  left?: number;
  right?: number;
  leftFixed?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
  justify?: boolean; // 两端对齐
  labelAlign?: 'left' | 'right'; // label对齐方式
  /** label自定义宽度，默认单位为px */
  labelWidth?: number | string;
}

export interface FormSchemaBase {
  /**
   * 表单标题
   */
  title?: string;

  /**
   * 按钮集合，会固定在底部显示。
   */
  actions?: Array<any>;

  /**
   * 表单项集合
   */
  body?: any;

  /**
   * @deprecated 请用类型 tabs
   */
  tabs?: any;

  /**
   * @deprecated 请用类型 fieldSet
   */
  fieldSet?: any;

  data?: any;

  /**
   * 是否开启调试，开启后会在顶部实时显示表单项数据。
   */
  debug?: boolean;

  /**
   * Debug面板配置
   */
  debugConfig?: {
    /**
     * 默认展开的级别
     */
    levelExpand?: number;

    /**
     * 是否可复制
     */
    enableClipboard?: boolean;

    /**
     * 图标风格
     */
    iconStyle?: 'square' | 'circle' | 'triangle';

    /**
     * 是否显示键的引号
     */
    quotesOnKeys?: boolean;

    /**
     * 是否为键排序
     */
    sortKeys?: boolean;

    /**
     * 设置字符串的最大展示长度，超出长度阈值的字符串将被截断，点击value可切换字符串展示方式，默认为120
     */
    ellipsisThreshold?: number | false;
  };

  /**
   * 用来初始化表单数据
   */
  initApi?: string | BaseApiObject;

  /**
   * Form 用来获取初始数据的 api,与initApi不同的是，会一直轮询请求该接口，直到返回 finished 属性为 true 才 结束。
   */
  initAsyncApi?: string | BaseApiObject;

  /**
   * 设置了initAsyncApi后，默认会从返回数据的data.finished来判断是否完成，也可以设置成其他的xxx，就会从data.xxx中获取
   */
  initFinishedField?: string;

  /**
   * 设置了initAsyncApi以后，默认拉取的时间间隔
   */
  initCheckInterval?: number;

  /**
   * 是否初始加载
   */
  initFetch?: boolean;

  /**
   * 建议改成 api 的 sendOn 属性。
   */
  initFetchOn?: string;

  /**
   * 设置后将轮询调用 initApi
   */
  interval?: number;

  /**
   * 是否静默拉取
   */
  silentPolling?: boolean;

  /**
   * 配置停止轮询的条件
   */
  stopAutoRefreshWhen?: string;

  /**
   * 是否开启本地缓存
   */
  persistData?: string;

  /**
   * 开启本地缓存后限制保存哪些 key
   */
  persistDataKeys?: string[];

  /**
   * 提交成功后清空本地缓存
   */
  clearPersistDataAfterSubmit?: boolean;

  /**
   * Form 用来保存数据的 api。
   *
   * 详情：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/index#%E8%A1%A8%E5%8D%95%E6%8F%90%E4%BA%A4
   */
  api?: string | BaseApiObject;

  /**
   * Form 也可以配置 feedback。
   */
  feedback?: any;

  /**
   * 设置此属性后，表单提交发送保存接口后，还会继续轮询请求该接口，直到返回 finished 属性为 true 才 结束。
   */
  asyncApi?: string | BaseApiObject;

  /**
   * 轮询请求的时间间隔，默认为 3秒。设置 asyncApi 才有效
   */
  checkInterval?: number;

  /**
   * 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success`
   */
  finishedField?: string;

  /**
   * 提交完后重置表单
   */
  resetAfterSubmit?: boolean;

  /**
   * 提交后清空表单
   */
  clearAfterSubmit?: boolean;

  /**
   * 配置表单项默认的展示方式。
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 表单项显示为几列
   */
  columnCount?: number;

  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  horizontal?: FormHorizontal;

  /**
   * 是否自动将第一个表单元素聚焦。
   */
  autoFocus?: boolean;

  /**
   * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
   */
  messages?: {
    /**
     * 表单验证失败时的提示
     */
    validateFailed?: string;
  };

  name?: string;

  /**
   * 配置容器 panel className
   */
  panelClassName?: ClassName;

  /**
   * 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。
   * @default id
   */
  primaryField?: string;

  redirect?: string;

  reload?: string;

  /**
   * 修改的时候是否直接提交表单。
   */
  submitOnChange?: boolean;

  /**
   * 表单初始先提交一次，联动的时候有用
   */
  submitOnInit?: boolean;

  /**
   * 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。
   */
  submitText?: string;

  /**
   * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
   */
  target?: string;

  /**
   * 是否用 panel 包裹起来
   */
  wrapWithPanel?: boolean;

  /**
   * 是否固定底下的按钮在底部。
   */
  affixFooter?: boolean;

  /**
   * 页面离开提示，为了防止页面不小心跳转而导致表单没有保存。
   */
  promptPageLeave?: boolean;

  /**
   * 具体的提示信息，选填。
   */
  promptPageLeaveMessage?: string;

  /**
   * 组合校验规则，选填
   */
  rules?: Array<{
    rule: string;
    message: string;

    // 高亮表单项
    name?: string | Array<string>;
  }>;

  /**
   * 禁用回车提交
   */
  preventEnterSubmit?: boolean;

  /**
   * 表单label的对齐方式
   */
  labelAlign?: LabelAlign;

  /**
   * label自定义宽度，默认单位为px
   */
  labelWidth?: number | string;

  /**
   * 展示态时的className
   */
  static?: boolean;
  staticOn?: SchemaExpression;
  staticClassName?: SchemaClassName;
}

export type FormGroup = FormSchemaBase & {
  title?: string;
  className?: string;
};
export type FormGroupNode = FormGroup | FormGroupArray;
export interface FormGroupArray extends Array<FormGroupNode> {}

export interface FormProps
  extends RendererProps,
    Omit<FormSchemaBase, 'mode' | 'className'> {
  data: any;
  store: IFormStore;
  wrapperComponent: React.ElementType;
  canAccessSuperData: boolean;
  trimValues?: boolean;
  lazyLoad?: boolean;
  simpleMode?: boolean;
  onInit?: (values: object, props: any) => any;
  onReset?: (values: object, action?: any) => void;
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
  rules: Array<{
    rule: string;
    message: string;
    name?: string | Array<string>;
  }>;
  lazyChange?: boolean; // 表单项的
  formLazyChange?: boolean; // 表单的
  // Spinner 配置
  loadingConfig?: {
    root?: string;
    show?: boolean;
  };
}
export default class Form extends React.Component<FormProps, object> {
  static defaultProps = {
    title: 'Form.title',
    submitText: 'Form.submit',
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
    columnCount: 0,
    panelClassName: 'Panel--default',
    messages: {
      fetchFailed: 'fetchFailed',
      saveSuccess: 'saveSuccess',
      saveFailed: 'saveFailed'
    },
    wrapperComponent: '',
    finishedField: 'finished',
    initFinishedField: 'finished',
    labelAlign: 'right'
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
    'columnCount',
    'collapsable',
    'horizontal',
    'panelClassName',
    'messages',
    'wrapperComponent',
    'resetAfterSubmit',
    'clearAfterSubmit',
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
    'simpleMode',
    'inputOnly',
    'value',
    'actions',
    'multiple'
  ];

  hooks: {
    [propName: string]: Array<() => Promise<any>>;
  } = {};
  asyncCancel: () => void;
  disposeOnValidate: () => void;
  disposeRulesValidate: () => void;
  shouldLoadInitApi: boolean = false;
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;
  lazyEmitChange = debouce(this.emitChange.bind(this), 250, {
    trailing: true,
    leading: false
  });
  unBlockRouting?: () => void;
  constructor(props: FormProps) {
    super(props);

    this.onInit = this.onInit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleQuery = this.handleQuery.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDrawerConfirm = this.handleDrawerConfirm.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
    this.addHook = this.addHook.bind(this);
    this.removeHook = this.removeHook.bind(this);
    this.emitChange = this.emitChange.bind(this);
    this.handleBulkChange = this.handleBulkChange.bind(this);
    this.renderFormItems = this.renderFormItems.bind(this);
    this.reload = this.reload.bind(this);
    this.silentReload = this.silentReload.bind(this);
    this.initInterval = this.initInterval.bind(this);
    this.dispatchInited = this.dispatchInited.bind(this);
    this.blockRouting = this.blockRouting.bind(this);
    this.beforePageUnload = this.beforePageUnload.bind(this);
    this.formItemDispatchEvent = this.formItemDispatchEvent.bind(this);

    const {store, canAccessSuperData, persistData, simpleMode} = props;

    store.setCanAccessSuperData(canAccessSuperData !== false);
    store.setPersistData(persistData);

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
      combo.forms.forEach(form =>
        form.items.forEach(
          item => item.unique && item.syncOptions(undefined, form.data)
        )
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
      onValidate,
      promptPageLeave,
      env,
      rules
    } = this.props;

    this.mounted = true;

    if (onValidate) {
      const finalValidate = promisify(onValidate);
      this.disposeOnValidate = this.addHook(async () => {
        const result = await finalValidate(store.data, store);

        if (result && isObject(result)) {
          Object.keys(result).forEach(key => {
            let msg = result[key];
            const items = store.getItemsByPath(key);

            // 没有找到
            if (!Array.isArray(items) || !items.length) {
              return;
            }

            // 在setError之前，提前把残留的error信息清除掉，否则每次onValidate后都会一直把报错 append 上去
            items.forEach(item => item.clearError());

            if (msg) {
              msg = Array.isArray(msg) ? msg : [msg];
              items.forEach(item => item.addError(msg));
            }

            delete result[key];
          });

          isEmpty(result)
            ? store.clearRestError()
            : store.setRestError(Object.keys(result).map(key => result[key]));
        }
      });
    }

    if (Array.isArray(rules) && rules.length) {
      this.disposeRulesValidate = this.addHook(() => {
        if (!store.valid) {
          return;
        }

        rules.forEach(
          item =>
            !evalExpression(item.rule, store.data) &&
            store.addRestError(item.message, item.name)
        );
      });
    }

    if (isEffectiveApi(initApi, store.data, initFetch, initFetchOn)) {
      store
        .fetchInitData(initApi as any, store.data, {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed,
          onSuccess: (json: Payload, data: any) => {
            store.setValues(data);

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
        .then(this.dispatchInited)
        .then(this.initInterval)
        .then(this.onInit);
    } else {
      setTimeout(this.onInit.bind(this), 4);
    }

    if (promptPageLeave) {
      window.addEventListener('beforeunload', this.beforePageUnload);
      this.unBlockRouting = env.blockRouting?.(this.blockRouting) ?? undefined;
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

      store[store.hasRemoteData ? 'fetchData' : 'fetchInitData'](
        props.initApi as Api,
        store.data,
        {
          successMessage: fetchSuccess,
          errorMessage: fetchFailed
        }
      )
        .then(this.dispatchInited)
        .then(this.initInterval);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
    // this.lazyHandleChange.flush();
    this.lazyEmitChange.cancel();
    this.asyncCancel && this.asyncCancel();
    this.disposeOnValidate && this.disposeOnValidate();
    this.disposeRulesValidate && this.disposeRulesValidate();
    window.removeEventListener('beforeunload', this.beforePageUnload);
    this.unBlockRouting?.();
  }

  async dispatchInited(value: any) {
    const {data, store, dispatchEvent} = this.props;

    if (store.fetching) {
      return value;
    }

    // 派发init事件，参数为初始化数据
    await dispatchEvent(
      'inited',
      createObject(data, {
        ...value?.data, // 保留，兼容历史
        responseData: value?.data ?? {},
        responseStatus: store.error ? 1 : 0,
        responseMsg: store.msg
      })
    );

    return value;
  }

  blockRouting(): any {
    const store = this.props.store;
    const {promptPageLeaveMessage, promptPageLeave} = this.props;

    if (promptPageLeave && store.modified) {
      return promptPageLeaveMessage || '新的修改没有保存，确认要离开？';
    }
  }

  beforePageUnload(e: any): any {
    const blocked = this.blockRouting();

    if (blocked) {
      e.preventDefault();
      e.returnValue = '';
    }
  }

  async onInit() {
    const {onInit, store, persistData, submitOnInit, dispatchEvent} =
      this.props;
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

    if (persistData) {
      store.getLocalPersistData();
      data = cloneObject(store.data);
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

  async reload(
    subPath?: string,
    query?: any,
    ctx?: any,
    silent?: boolean
  ): Promise<any> {
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

    if (isEffectiveApi(initApi, store.data)) {
      const result: Payload = await store.fetchInitData(initApi, store.data, {
        successMessage: fetchSuccess,
        errorMessage: fetchFailed,
        silent,
        onSuccess: (json: Payload, data: any) => {
          store.setValues(data);

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

      // 派发初始化接口请求完成事件
      await this.dispatchInited(result);

      if (result?.ok) {
        this.initInterval(result);
        store.reset(undefined, false);
      }
    } else {
      store.reset(undefined, false);
    }
  }

  receive(values: object, name?: string, replace?: boolean) {
    const {store} = this.props;

    store.updateData(values, undefined, replace);
    return this.reload();
  }

  silentReload(target?: string, query?: any) {
    this.reload(target, query, undefined, true);
  }

  initInterval(value: any) {
    const {interval, silentPolling, stopAutoRefreshWhen, data} = this.props;

    clearTimeout(this.timer);
    value?.ok &&
      interval &&
      this.mounted &&
      (!stopAutoRefreshWhen || !evalExpression(stopAutoRefreshWhen, data)) &&
      (this.timer = setTimeout(
        silentPolling ? this.silentReload : this.reload,
        Math.max(interval, 1000)
      ));
    return value;
  }

  isValidated() {
    return this.props.store.validated;
  }

  validate(
    forceValidate?: boolean,
    throwErrors: boolean = false
  ): Promise<boolean> {
    const {store, dispatchEvent, data, messages, translate: __} = this.props;

    this.flush();
    return store
      .validate(
        this.hooks['validate'] || [],
        forceValidate,
        throwErrors,
        typeof messages?.validateFailed === 'string'
          ? __(filter(messages.validateFailed, store.data))
          : undefined
      )
      .then((result: boolean) => {
        if (result) {
          dispatchEvent('validateSucc', data);
        } else {
          dispatchEvent('validateError', data);
        }
        return result;
      });
  }

  setErrors(errors: {[propName: string]: string}, tag = 'remote') {
    const {store} = this.props;
    store.setFormItemErrors(errors, tag);
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

  setValues(value: any, replace?: boolean) {
    const {store} = this.props;
    this.flush();
    store.setValues(value, undefined, replace);
  }

  submit(
    fn?: (values: object) => Promise<any>,
    throwErrors: boolean = false
  ): Promise<any> {
    const {store, messages, translate: __, dispatchEvent, data} = this.props;
    this.flush();
    const validateErrCb = () => dispatchEvent('validateError', data);
    return store.submit(
      fn,
      this.hooks['validate'] || [],
      typeof messages?.validateFailed === 'string'
        ? __(filter(messages.validateFailed, store.data))
        : undefined,
      validateErrCb,
      throwErrors
    );
  }

  // 如果开启了 lazyChange，需要一个 flush 方法把队列中值应用上。
  flush() {
    const hooks = this.hooks['flush'] || [];
    hooks.forEach(fn => fn());
    this.lazyEmitChange.flush();
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

  handleChange(
    value: any,
    name: string,
    submit: boolean,
    changePristine = false
  ) {
    const {store, formLazyChange, persistDataKeys} = this.props;
    if (typeof name !== 'string') {
      return;
    }
    store.changeValue(name, value, changePristine);
    if (!changePristine) {
      (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(
        submit
      );
    }

    if (store.persistData && store.inited) {
      store.setLocalPersistData(persistDataKeys);
    }
  }
  formItemDispatchEvent(type: string, data: any) {
    const {dispatchEvent} = this.props;
    return dispatchEvent(type, data);
  }

  async emitChange(submit: boolean) {
    const {onChange, store, submitOnChange, dispatchEvent, data} = this.props;

    if (!isAlive(store)) {
      return;
    }

    // 提前准备好 onChange 的参数。
    // 因为 store.data 会在 await 期间被 WithStore.componentDidUpdate 中的 store.initData 改变。导致数据丢失
    const changeProps = [
      store.data,
      difference(store.data, store.pristine),
      this.props
    ];

    const dispatcher = await dispatchEvent(
      'change',
      createObject(data, store.data)
    );
    if (!dispatcher?.prevented) {
      onChange && onChange.apply(null, changeProps);
    }

    store.clearRestError();
    (submit || (submitOnChange && store.inited)) &&
      this.handleAction(
        undefined,
        {
          type: 'submit'
        },
        store.data
      );
  }

  handleBulkChange(values: Object, submit: boolean) {
    const {onChange, store, formLazyChange} = this.props;
    store.setValues(values);
    // store.updateData(values);

    // store.items.forEach(formItem => {
    //   const updatedValue = getVariable(values, formItem.name, false);

    //   if (updatedValue !== undefined) {
    //     // 更新验证状态但保留错误信息
    //     formItem.reset(true);
    //     // 这里需要更新value，否则提交时不会使用新的字段值校验
    //     formItem.changeTmpValue(updatedValue);
    //     formItem.validateOnChange && formItem.validate(values);
    //   }
    // });
    (formLazyChange === false ? this.emitChange : this.lazyEmitChange)(submit);
  }

  handleFormSubmit(e: React.UIEvent<any>) {
    const {preventEnterSubmit, onActionSensor, close} = this.props;

    e.preventDefault();
    if (preventEnterSubmit) {
      return false;
    }

    const sensor: any = this.handleAction(
      e,
      {
        type: 'submit',
        close
      },
      this.props.store.data
    );

    // 让外层可以监控这个动作执行结果
    onActionSensor?.(sensor);
    return sensor;
  }

  handleReset(action: any) {
    const {onReset} = this.props;

    return (data: any) => {
      onReset && onReset(data, action);
    };
  }

  async handleAction(
    e: React.UIEvent<any> | void,
    action: ActionObject,
    data: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ): Promise<any> {
    const {
      store,
      onSubmit,
      api,
      asyncApi,
      finishedField,
      checkInterval,
      messages: {saveSuccess, saveFailed},
      resetAfterSubmit,
      clearAfterSubmit,
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
      dispatchEvent,
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
      /** 如果是按钮指定了required，则校验前先清空一下遗留的校验报错 */
      store.clearErrors();

      const fields = action.required.map(item => ({
        name: item,
        rules: {isRequired: true}
      }));
      const validationRes = await store.validateFields(fields);

      if (!validationRes) {
        const dispatcher = await dispatchEvent(
          'validateError',
          this.props.data
        );
        if (!dispatcher?.prevented) {
          env.notify('error', __('Form.validateFailed'));
        }

        /** 抛异常是为了在dialog中catch这个错误，避免弹窗直接关闭 */
        return Promise.reject(__('Form.validateFailed'));
      } else {
        /** 重置validated状态，保证submit时触发表单中的校验项 */
        store.clearErrors();
      }
    }
    if (
      action.type === 'submit' ||
      action.actionType === 'submit' ||
      action.actionType === 'confirm' ||
      action.actionType === 'reset-and-submit' ||
      action.actionType === 'clear-and-submit'
    ) {
      // 配了submit事件的表示将提交逻辑全部托管给事件
      const {dispatchEvent, onEvent} = this.props;
      const submitEvent = onEvent?.submit?.actions?.length;
      const dispatcher = await dispatchEvent('submit', this.props.data);
      if (dispatcher?.prevented || submitEvent) {
        return;
      }

      store.setCurrentAction(action);

      if (action.actionType === 'reset-and-submit') {
        store.reset(this.handleReset(action));
      } else if (action.actionType === 'clear-and-submit') {
        store.clear(this.handleReset(action));
      }

      return this.submit((values): any => {
        if (onSubmit && onSubmit(values, action) === false) {
          return Promise.resolve(false);
        }
        // 走到这里代表校验成功了
        dispatchEvent('validateSucc', this.props.data);

        if (target) {
          this.submitToTarget(filterTarget(target, values), values);
          /** 可能配置页面跳转事件，页面路由变化导致persistKey不一致，无法清除持久化数据，所以提交成功事件之前先清理一下 */
          clearPersistDataAfterSubmit && store.clearLocalPersistData();
          dispatchEvent('submitSucc', createObject(this.props.data, values));
        } else if (action.actionType === 'reload') {
          action.target &&
            this.reloadTarget(filterTarget(action.target, values), values);
        } else if (action.actionType === 'dialog') {
          store.openDialog(
            data,
            undefined,
            action.callback,
            delegate || (this.context as any)
          );
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
              successMessage:
                typeof saveSuccess === 'string'
                  ? filter(saveSuccess, store.data)
                  : undefined,
              errorMessage:
                typeof saveFailed === 'string'
                  ? filter(saveFailed, store.data)
                  : undefined,
              onSuccess: async (result: Payload) => {
                clearPersistDataAfterSubmit && store.clearLocalPersistData();
                // result为提交接口返回的内容
                const dispatcher = await dispatchEvent(
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
                  cancel => (this.asyncCancel = cancel),
                  checkInterval
                ).then((value: any) => {
                  // 派发asyncApiFinished事件
                  dispatchEvent('asyncApiFinished', store.data);
                });
                return {
                  cbResult,
                  dispatcher
                };
              },
              onFailed: async (result: Payload) => {
                const dispatcher = await dispatchEvent(
                  'submitFail',
                  createObject(this.props.data, {error: result})
                );
                return {
                  dispatcher
                };
              }
            })
            .then(async response => {
              onSaved && onSaved(values, response);
              const feedback = action.feedback || this.props.feedback;

              // submit 也支持 feedback
              if (feedback && isVisible(feedback, store.data)) {
                const confirmed = await this.openFeedback(feedback, store.data);

                // 如果 feedback 配置了，取消就跳过原有逻辑。
                if (feedback.skipRestOnCancel && !confirmed) {
                  throw new SkipOperation();
                } else if (feedback.skipRestOnConfirm && confirmed) {
                  throw new SkipOperation();
                }
              }

              return injectObjectChain(store.data, {
                __payload: values,
                __response: response
              });
            });
        } else {
          clearPersistDataAfterSubmit && store.clearLocalPersistData();
          // type为submit，但是没有配api以及target时，只派发事件
          dispatchEvent('submitSucc', createObject(this.props.data, values));
        }

        return Promise.resolve(null);
      }, throwErrors)
        .then(values => {
          // 有可能 onSubmit return false 了，那么后面的就不应该再执行了。
          if (values === false) {
            return store.data;
          }

          if (onFinished && onFinished(values, action) === false) {
            return values;
          }

          resetAfterSubmit && store.reset(this.handleReset(action));
          clearAfterSubmit && store.clear(this.handleReset(action));
          clearPersistDataAfterSubmit && store.clearLocalPersistData();

          if (action.redirect || redirect) {
            const finalRedirect = filter(
              action.redirect || redirect,
              store.data
            );
            finalRedirect && env.jumpTo(finalRedirect, action, store.data);
          } else if (action.reload || reload) {
            this.reloadTarget(
              filterTarget(action.reload || reload!, store.data),
              store.data
            );
          }

          action.close && this.closeTarget(action.close);
          return values;
        })
        .catch(reason => {
          onFailed && onFailed(reason, store.errors);

          if (throwErrors) {
            throw reason;
          }
        });
    } else if (action.type === 'reset' || action.actionType === 'reset') {
      store.setCurrentAction(action);
      store.reset(onReset);
    } else if (action.actionType === 'clear') {
      store.setCurrentAction(action);
      store.clear(onReset);
    } else if (action.actionType === 'validate') {
      store.setCurrentAction(action);
      return this.validate(true, throwErrors);
    } else if (action.actionType === 'dialog') {
      store.setCurrentAction(action);
      store.openDialog(
        data,
        undefined,
        action.callback,
        delegate || (this.context as any)
      );
    } else if (action.actionType === 'drawer') {
      store.setCurrentAction(action);
      store.openDrawer(data);
    } else if (action.actionType === 'ajax') {
      store.setCurrentAction(action);
      if (!isEffectiveApi(action.api)) {
        return env.alert(__(`当 actionType 为 ajax 时，请设置 api 属性`));
      }
      let successMsg =
        (action.messages && action.messages.success) || saveSuccess;
      let failMsg = (action.messages && action.messages.failed) || saveFailed;

      return store
        .saveRemote(action.api as Api, data, {
          successMessage: __(
            typeof successMsg === 'string'
              ? filter(successMsg, store.data)
              : undefined
          ),
          errorMessage: __(
            typeof failMsg === 'string'
              ? filter(failMsg, store.data)
              : undefined
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
          redirect && env.jumpTo(redirect, action, store.data);

          action.reload &&
            this.reloadTarget(
              filterTarget(action.reload, store.data),
              store.data
            );
          action.close && this.closeTarget(action.close);
        })
        .catch(e => {
          onFailed && onFailed(e, store.errors);
          if (throwErrors || action.countDown) {
            throw e;
          }
        });
    } else if (action.actionType === 'reload') {
      store.setCurrentAction(action);
      if (action.target) {
        this.reloadTarget(filterTarget(action.target, data), data);
      } else {
        this.receive(data);
      }
      // action.target && this.reloadTarget(filterTarget(action.target, data), data);
    } else if (onAction) {
      // 不识别的丢给上层去处理。
      return onAction(e, action, data, throwErrors, delegate || this.context);
    }
  }

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

  handleDialogConfirm(
    values: object[],
    action: ActionObject,
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
      this.handleBulkChange(values[0], false);
    }

    store.closeDialog(true);
  }

  handleDialogClose(confirmed = false) {
    const {store} = this.props;
    store.closeDialog(confirmed);
  }

  handleDrawerConfirm(
    values: object[],
    action: ActionObject,
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

  buildActions() {
    const {
      actions,
      submitText,
      body,
      translate: __,
      loadingConfig
    } = this.props;

    if (
      typeof actions !== 'undefined' ||
      !submitText ||
      (Array.isArray(body) &&
        body.some(
          item =>
            item &&
            !!~['submit', 'button', 'button-group', 'reset'].indexOf(
              (item as any)?.body?.[0]?.type ||
                (item as any)?.body?.type ||
                (item as any).type
            )
        ))
    ) {
      return actions;
    }

    return [
      {
        type: 'submit',
        label: __(submitText),
        primary: true,
        loadingConfig
      }
    ];
  }

  renderFormItems(
    schema: Partial<FormSchemaBase> & {
      controls?: Array<any>;
    },
    region: string = '',
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    let body: Array<any> = Array.isArray(schema.body)
      ? schema.body
      : schema.body
      ? [schema.body]
      : [];

    // 旧用法，让 wrapper 走走 compat 逻辑兼容旧用法
    // 后续可以删除。
    if (!body.length && schema.controls) {
      console.warn('请用 body 代替 controls');
      body = [
        {
          size: 'none',
          type: 'wrapper',
          wrap: false,
          controls: schema.controls
        }
      ];
    }

    return this.renderChildren(body, region, otherProps);
  }

  renderChildren(
    children: Array<any>,
    region: string,
    otherProps: Partial<FormProps> = {}
  ): React.ReactNode {
    children = children || [];

    if (!Array.isArray(children)) {
      children = [children];
    }

    if (this.props.mode === 'row') {
      const ns = this.props.classPrefix;

      children = flatten(children).filter(item => {
        if ((item as Schema).hidden || (item as Schema).visible === false) {
          return false;
        }

        const exprProps = getExprProperties(
          item as Schema,
          this.props.store.data,
          undefined,
          this.props
        );
        if (exprProps.hidden || exprProps.visible === false) {
          return false;
        }

        return true;
      });

      if (!children.length) {
        return null;
      }

      const {classnames: cx} = this.props;

      return (
        <div className={cx('Form-row')}>
          {children.map((control, key) =>
            ~['hidden', 'formula'].indexOf((control as any).type) ||
            (control as any).mode === 'inline' ? (
              this.renderChild(control, key, otherProps)
            ) : (
              <div
                key={key}
                className={cx(`Form-col`, (control as Schema).columnClassName)}
              >
                {this.renderChild(control, '', {
                  ...otherProps,
                  mode: 'row'
                })}
              </div>
            )
          )}
        </div>
      );
    }

    return children.map((control, key) =>
      this.renderChild(control, key, otherProps, region)
    );
  }

  renderChild(
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
      formLazyChange,
      dispatchEvent,
      labelAlign,
      labelWidth,
      static: isStatic,
      canAccessSuperData
    } = props;

    const subProps = {
      formStore: form,
      data: store.data,
      key: `${(control as Schema).name || ''}-${
        (control as Schema).type
      }-${key}`,
      formInited: form.inited,
      formSubmited: form.submited,
      formMode: mode,
      formHorizontal: horizontal,
      formLabelAlign: labelAlign !== 'left' ? 'right' : labelAlign,
      formLabelWidth: labelWidth,
      controlWidth,
      /**
       * form.loading有为true时才下发disabled属性，否则不显性设置disbaled为false
       * Form中包含容器类组件时，这些组件会将此处的disbaled继续下发至子组件，导致SchemaRenderer中props.disabled覆盖schema.disabled
       */
      disabled:
        disabled ||
        (control as Schema).disabled ||
        (form.loading ? true : undefined),
      btnDisabled: disabled || form.loading || form.validating,
      onAction: this.handleAction,
      onQuery: this.handleQuery,
      onChange: this.handleChange,
      onBulkChange: this.handleBulkChange,
      addHook: this.addHook,
      removeHook: this.removeHook,
      renderFormItems: this.renderFormItems,
      formItemDispatchEvent: this.formItemDispatchEvent,
      formPristine: form.pristine
      // value: (control as any)?.name
      //   ? getVariable(form.data, (control as any)?.name, canAccessSuperData)
      //   : (control as any)?.value,
      // defaultValue: (control as any)?.value
    };

    let subSchema: any = {
      ...control
    };

    if (subSchema.$ref) {
      subSchema = {
        ...resolveDefinitions(subSchema.$ref),
        ...subSchema
      };
    }

    lazyChange === false && (subSchema.changeImmediately = true);
    return render(`${region ? `${region}/` : ''}${key}`, subSchema, subProps);
  }

  renderBody() {
    const {
      body,
      mode,
      className,
      classnames: cx,
      debug,
      debugConfig,
      $path,
      store,
      columnCount,
      render,
      staticClassName,
      static: isStatic = false,
      loadingConfig
    } = this.props;

    const {restError} = store;

    const WrapperComponent =
      this.props.wrapperComponent ||
      (/(?:\/|^)form\//.test($path as string) ? 'div' : 'form');

    const padDom = repeatCount(
      columnCount && Array.isArray(body)
        ? (columnCount - (body.length % columnCount)) % columnCount
        : 0,
      index => (
        <div
          className={cx(`Form-item Form-item--${mode} is-placeholder`)}
          key={index}
        ></div>
      )
    );

    return (
      <WrapperComponent
        className={cx(
          `Form`,
          `Form--${mode || 'normal'}`,
          columnCount ? `Form--column Form--column-${columnCount}` : null,
          staticClassName && isStatic ? staticClassName : className,
          isStatic ? 'Form--isStatic' : null
        )}
        onSubmit={this.handleFormSubmit}
        noValidate
      >
        {/* 实现回车自动提交 */}
        <input type="submit" style={{display: 'none'}} />

        {debug
          ? render('form-debug-json', {
              type: 'json',
              value: store.data,
              ellipsisThreshold: 120,
              className: cx('Form--debug'),
              ...debugConfig
            })
          : null}

        {render(
          'spinner',
          {type: 'spinner'},
          {
            overlay: true,
            show: store.loading,
            loadingConfig
          }
        )}

        {this.renderFormItems({
          body
        })}

        {padDom}

        {/* 显示没有映射上的 errors */}
        {restError && restError.length ? (
          <ul className={cx('Form-restError', 'Form-feedback')}>
            {restError.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : null}

        {render(
          'modal',
          {
            ...((store.action as ActionObject) &&
              ((store.action as ActionObject).dialog as object)),
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
            ...((store.action as ActionObject) &&
              ((store.action as ActionObject).drawer as object)),
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
      $path,
      $schema,
      wrapWithPanel,
      render,
      title,
      store,
      panelClassName,
      headerClassName,
      footerClassName,
      footerWrapClassName,
      actionsClassName,
      bodyClassName,
      classnames: cx,
      style,
      affixFooter,
      lazyLoad,
      translate: __,
      footer
    } = this.props;

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
          style: style,
          formStore: this.props.store,
          children: body,
          actions: this.buildActions(),
          onAction: this.handleAction,
          onQuery: this.handleQuery,
          disabled: store.loading,
          btnDisabled: store.loading || store.validating,
          headerClassName,
          footer,
          footerClassName,
          footerWrapClassName,
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
  type: 'form',
  storeType: FormStore.name,
  isolateScope: true,
  storeExtendsData: (props: any) => props.inheritData,
  shouldSyncSuperStore: (store, props, prevProps) => {
    // 如果是 QuickEdit，让 store 同步 __super 数据。
    if (
      props.quickEditFormRef &&
      props.onQuickChange &&
      (isObjectShallowModified(prevProps.data, props.data) ||
        isObjectShallowModified(prevProps.data.__super, props.data.__super) ||
        isObjectShallowModified(
          prevProps.data.__super?.__super,
          props.data.__super?.__super
        ))
    ) {
      return true;
    }

    return undefined;
  }
})
export class FormRenderer extends Form {
  static contextType = ScopedContext;

  constructor(props: FormProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
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
    action: ActionObject,
    data: object = this.props.store.data,
    throwErrors: boolean = false
  ) {
    return this.handleAction(undefined, action, data, throwErrors);
  }

  async handleAction(
    e: React.UIEvent<any> | undefined,
    action: ActionObject,
    ctx: object,
    throwErrors: boolean = false,
    delegate?: IScopedContext
  ) {
    // 禁用了不要做任何动作。@先注释掉，会引起其他问题
    // if (this.props.disabled) {
    //   return;
    // }

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
    action: ActionObject,
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

  async reload(
    target?: string,
    query?: any,
    ctx?: any,
    silent?: boolean,
    replace?: boolean
  ): Promise<any> {
    if (query) {
      return this.receive(query, undefined, replace);
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
        qsparse((target as string).substring(idx2 + 1)),
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
      await super.reload(target, query, ctx, silent);
      const components = scoped.getComponents();
      components.forEach(
        (component: any) =>
          component.reload && component.reload('', subQuery, ctx)
      );
    } else {
      return super.reload(target, query, ctx, silent);
    }
  }

  async receive(
    values: object,
    name?: string,
    replace?: boolean
  ): Promise<any> {
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

    return super.receive(values, undefined, replace);
  }

  setData(values: object, replace?: boolean) {
    const {onChange, store} = this.props;
    super.setValues(values, replace);
    // 触发表单change
    onChange &&
      onChange(store.data, difference(store.data, store.pristine), this.props);
  }

  getData() {
    const {store} = this.props;
    return store.data;
  }
}
