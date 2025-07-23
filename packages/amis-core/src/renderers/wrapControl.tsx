import React from 'react';
import {IFormStore, IFormItemStore} from '../store/form';
import debouce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

import {RendererProps, Renderer, getRendererByName} from '../factory';
import {ComboStore, IComboStore, IUniqueGroup} from '../store/combo';
import {
  anyChanged,
  promisify,
  guid,
  isEmpty,
  autobind,
  getVariable,
  createObject
} from '../utils/helper';
import {str2rules} from '../utils/validations';
import {
  isNeedFormula,
  isExpression,
  FormulaExec,
  replaceExpression
} from '../utils/formula';
import {IIRendererStore, IRendererStore} from '../store';
import {ScopedContext, IScopedContext} from '../Scoped';
import {FormItemStore} from '../store/formItem';
import {isAlive} from 'mobx-state-tree';
import {observer} from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {withRootStore} from '../WithRootStore';
import {FormBaseControl, FormItemConfig, FormItemWrap} from './Item';
import {Api, DataChangeReason} from '../types';
import {TableStore} from '../store/table';
import pick from 'lodash/pick';
import {reaction} from 'mobx';
import {
  callStrFunction,
  changedEffect,
  cloneObject,
  setVariable,
  tokenize,
  injectObjectChain
} from '../utils';

export interface ControlOutterProps extends RendererProps {
  formStore?: IFormStore;
  name?: string;
  value?: any;
  id?: string;
  type?: string;
  required?: boolean;
  validations: string | {[propsName: string]: any};
  validationErrors: {[propsName: string]: any};
  validateOnChange: boolean;
  multiple?: boolean;
  delimiter?: string;
  joinValues?: boolean;
  extractValue?: boolean;
  valueField?: string;
  labelField?: string;
  unique?: boolean;
  selectFirst?: boolean;
  autoFill?: any;
  clearValueOnHidden?: boolean;
  validateApi?: Api;
  submitOnChange?: boolean;
  validate?: (value: any, values: any, name: string) => any;
  formItem?: IFormItemStore;
  addHook?: (fn: () => any, type?: 'validate' | 'init' | 'flush') => () => void;
  removeHook?: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
  $schema: {
    pipeIn?: (value: any, data: any) => any;
    pipeOut?: (value: any, originValue: any, data: any) => any;
    [propName: string]: any;
  };
  store?: IIRendererStore;
  onChange?: (
    value: any,
    name: string,
    submit?: boolean,
    changePristine?: boolean,
    changeReason?: DataChangeReason
  ) => void;
  formItemRef?: (control: any) => void;
}

export interface ControlProps {
  onBulkChange?: (
    values: Object,
    submitOnChange?: boolean,
    changeReason?: DataChangeReason
  ) => void;
  onChange?: (value: any, name: string, submit: boolean) => void;
  store: IIRendererStore;
}

export function wrapControl<
  T extends React.ComponentType<React.ComponentProps<T> & ControlProps>
>(config: Omit<FormItemConfig, 'component'>, ComposedComponent: T) {
  type OuterProps = JSX.LibraryManagedAttributes<
    T,
    Omit<React.ComponentProps<T>, keyof ControlProps>
  > &
    ControlOutterProps;

  const result = hoistNonReactStatic(
    withRootStore(
      observer(
        class extends React.Component<OuterProps> {
          public model: IFormItemStore | undefined;
          control?: any;
          value?: any = undefined;
          hook?: () => any;
          hook2?: () => any;
          hook3?: () => any;
          reaction?: () => void;

          static displayName = `WrapControl${
            ComposedComponent.displayName || ComposedComponent.name
              ? `(${ComposedComponent.displayName || ComposedComponent.name})`
              : ''
          }`;

          static contextType = ScopedContext;
          static defaultProps = {};

          lazyEmitChange = debouce(this.emitChange.bind(this), 250, {
            trailing: true,
            leading: false
          });

          constructor(props: OuterProps) {
            super(props);

            const {
              formStore: form,
              formItem,
              rootStore,
              store,
              onChange,
              data,
              inputGroupControl,
              colIndex,
              rowIndex,
              $schema: {
                id,
                type,
                required,
                validations,
                validationErrors,
                unique,
                value,
                extraName,
                multiple,
                delimiter,
                valueField,
                labelField,
                joinValues,
                extractValue,
                selectFirst,
                autoFill,
                clearValueOnHidden,
                validateApi,
                minLength,
                maxLength,
                validateOnChange,
                label,
                pagination
              }
            } = this.props;

            this.getValue = this.getValue.bind(this);
            this.setValue = this.setValue.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.setPrinstineValue = this.setPrinstineValue.bind(this);
            this.controlRef = this.controlRef.bind(this);
            this.handleBlur = this.handleBlur.bind(this);
            this.validate = this.validate.bind(this);
            this.flushChange = this.flushChange.bind(this);
            this.renderChild = this.renderChild.bind(this);
            let name =
              this.props.$schema.name ||
              (ComposedComponent.defaultProps as Record<string, unknown>)?.name;

            // 如果 name 是表达式
            // 扩充 each 用法
            if (isExpression(name)) {
              name = tokenize(name, data);
            }

            if (!name) {
              return;
            }

            let valueIsExp = isExpression(value);
            let propValue = this.props.value;
            const model = rootStore.addStore({
              id: guid(),
              path: this.props.$path,
              storeType: config.formItemStoreType || FormItemStore.name,
              parentId: store?.id,
              name,
              colIndex: colIndex !== undefined ? colIndex : undefined,
              rowIndex: rowIndex !== undefined ? rowIndex : undefined
            }) as IFormItemStore;
            this.model = model;
            // 如果组件有默认验证器类型，则合并
            const rules =
              validations && model && config.validations
                ? {...validations, ...str2rules(config.validations)}
                : validations;

            // @issue 打算干掉这个
            formItem?.addSubFormItem(model);
            model.config({
              // 理论上需要将渲染器的 defaultProps 全部生效，此处保险起见先只处理 multiple
              ...pick(
                {...ComposedComponent.defaultProps, ...this.props.$schema},
                ['multiple']
              ),
              id,
              type,
              required: props.required || required,
              unique,
              value,
              isValueSchemaExp:
                valueIsExp && value.replace(/\s/g, '') !== `\${${name}}`,
              rules: rules,
              messages: validationErrors,
              delimiter,
              valueField,
              labelField,
              joinValues,
              extractValue,
              selectFirst,
              autoFill,
              clearValueOnHidden,
              validateApi,
              minLength,
              maxLength,
              validateOnChange,
              label,
              inputGroupControl,
              extraName,
              pagination
            });

            // issue 这个逻辑应该在 combo 里面自己实现。
            if (
              this.model.unique &&
              form?.parentStore?.storeType === ComboStore.name
            ) {
              const combo = form.parentStore as IComboStore;
              combo.bindUniuqueItem(model);
            }

            if (propValue !== undefined && propValue !== null) {
              // 同步 value: 优先使用 props 中的 value
              model.changeTmpValue(propValue, 'controlled');
              model.setIsControlled(true);
            } else {
              this.setInitialValue(value);
            }

            if (
              onChange &&
              value !== undefined &&
              model.tmpValue !== undefined &&
              // 要么是默认值起作用了
              // 要么是表达式起作用了
              // 只有这两种情况才会触发 onChange
              // 比如以下 case 就不应该触发
              // 关联到上下文数据了，同时设置了默认值，因为是上下文数据优先，这个时候就不应该触发 onChange，因为没变化
              (value === model.tmpValue || valueIsExp)
            ) {
              // 组件默认值支持表达式需要: 避免初始化时上下文中丢失组件默认值
              if (model.extraName) {
                const values = model.splitExtraValue(model.tmpValue);
                onChange(values[0], model.name, false, true);
                onChange(values[1], model.extraName, false, true);
              } else {
                onChange(model.tmpValue, model.name, false, true);
              }
            } else if (
              onChange &&
              typeof propValue === 'undefined' &&
              typeof store?.getValueByName(model.name, false) === 'undefined' &&
              // todo 后续再优化这个判断，
              // 目前 input-table 中默认值会给冲掉，所以加上这个判断
              // 对应 issue 为 https://github.com/baidu/amis/issues/2674
              store?.storeType !== TableStore.name
            ) {
              // 如果没有初始值，通过 onChange 设置过去
              if (model.extraName) {
                const values = model.splitExtraValue(model.tmpValue);
                onChange(values[0], model.name, false, true);
                onChange(values[1], model.extraName, false, true);
              } else {
                onChange(model.tmpValue, model.name, false, true);
              }
            }

            this.reaction = reaction(
              () => model.validatedAt,
              (validatedAt: number) => {
                this.props.dispatchEvent?.(
                  model.valid
                    ? 'formItemValidateSucc'
                    : 'formItemValidateError',
                  injectObjectChain(
                    this.props.formStore?.data ?? this.props.data,
                    {
                      __errors: model.errors,
                      __formName: model.name,
                      __formValue: model.tmpValue,
                      __formControl: this.control
                    }
                  )
                );
              }
            );
          }

          componentDidMount() {
            const {
              store,
              formStore: form,
              $schema: {validate},
              addHook
            } = this.props;

            // 提交前先把之前的 lazyEmit 执行一下。
            this.hook3 = () => this.lazyEmitChange.flush();
            addHook?.(this.hook3, 'flush');

            const formItem = this.model as IFormItemStore;
            if (formItem && validate) {
              let finalValidate = promisify(validate.bind(this.control));
              this.hook2 = () => {
                formItem.clearError('control:valdiate');
                return finalValidate(
                  this.props.data,
                  this.getValue(),
                  formItem.name
                ).then((ret: any) => {
                  if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                    formItem.addError(ret, 'control:valdiate');
                  }
                });
              };
              addHook?.(this.hook2);
            }

            formItem?.init();
          }

          componentDidUpdate(prevProps: OuterProps) {
            const props = this.props;
            const model = this.model;

            if (!model) {
              return;
            }

            changedEffect(
              [
                'name',
                'id',
                'validations',
                'validationErrors',
                'value',
                'defaultValue',
                'required',
                'unique',
                'multiple',
                'delimiter',
                'valueField',
                'labelField',
                'joinValues',
                'extractValue',
                'selectFirst',
                'autoFill',
                'clearValueOnHidden',
                'validateApi',
                'minLength',
                'maxLength',
                'label',
                'extraName',
                'pagination'
              ],
              prevProps.$schema,
              props.$schema,
              changes => {
                model.config({
                  ...changes,

                  // todo 优化后面两个
                  isValueSchemaExp:
                    isExpression(props.$schema.value) &&
                    props.$schema.value.replace(/\s/g, '') !==
                      `\${${props.$schema.name}}`,
                  inputGroupControl: props?.inputGroupControl
                } as any);

                if (changes.hasOwnProperty('name')) {
                  this.setInitialValue(this.props.$schema.value);
                }
              }
            );

            if (props.required !== prevProps.required) {
              model.config({
                required: props.required
              });
            }

            // 此处需要同时考虑 defaultValue 和 value
            if (typeof props.value !== 'undefined') {
              // 渲染器中的 value 优先
              if (
                !isEqual(props.value, prevProps.value) &&
                !isEqual(props.value, model.tmpValue)
              ) {
                // 外部直接传入的 value 无需执行运算器
                model.changeTmpValue(props.value, 'controlled');
              }
            } else if (
              typeof props.defaultValue !== 'undefined' &&
              isExpression(props.defaultValue) &&
              (props.defaultValue as string).replace(/\s/g, '') !==
                `\${${props.name}}` &&
              (!isEqual(props.defaultValue, prevProps.defaultValue) ||
                (props.data !== prevProps.data &&
                  isNeedFormula(
                    props.defaultValue,
                    props.data,
                    prevProps.data
                  )))
            ) {
              const curResult = FormulaExec['formula'](
                props.defaultValue,
                props.data
              );
              const prevResult = FormulaExec['formula'](
                prevProps.defaultValue,
                prevProps.data
              );
              if (
                !isEqual(curResult, prevResult) &&
                !isEqual(curResult, model.tmpValue)
              ) {
                // 识别上下文变动、自身数值变动、公式运算结果变动
                model.changeTmpValue(curResult, 'formulaChanged');

                if (model.extraName) {
                  const values = model.splitExtraValue(curResult);
                  props.onChange?.(values[0], model.name, false);
                  props.onChange?.(values[1], model.extraName, false);
                } else {
                  props.onChange?.(curResult, model.name, false);
                }
              }
            } else {
              // value 非公式表达式时，name 值优先，若 defaultValue 主动变动时，则使用 defaultValue
              if (
                // 然后才是查看关联的 name 属性值是否变化
                props.data !== prevProps.data &&
                (!model.emitedValue ||
                  isEqual(model.emitedValue, model.tmpValue))
              ) {
                model.changeEmitedValue(undefined);
                const valueByName = model.extraName
                  ? [
                      getVariable(props.data, model.name, false),
                      getVariable(props.data, model.extraName, false)
                    ]
                  : getVariable(props.data, model.name, false);

                if (
                  !isEqual(
                    valueByName,
                    model.extraName
                      ? model.splitExtraValue(model.tmpValue)
                      : model.tmpValue
                  ) &&
                  (!isEqual(
                    model.extraName ? valueByName[0] : valueByName,
                    getVariable(prevProps.data, model.name, false)
                  ) ||
                    // extraName
                    (model.extraName &&
                      !isEqual(
                        valueByName[1],
                        getVariable(prevProps.data, model.extraName, false)
                      )))
                ) {
                  model.changeTmpValue(
                    valueByName,
                    props.formInited && !prevProps.formInited
                      ? 'formInited'
                      : 'dataChanged'
                  );
                  this.checkValidate();
                }
              }
            }
          }

          componentWillUnmount() {
            this.hook && this.props.removeHook?.(this.hook);
            this.hook2 && this.props.removeHook?.(this.hook2);
            this.hook3 && this.props.removeHook?.(this.hook3, 'flush');
            // this.lazyEmitChange.flush();

            this.lazyEmitChange.cancel();
            this.reaction?.();
            this.disposeModel();
          }

          setInitialValue(value: any) {
            const model = this.model!;
            const {
              formStore: form,
              data,
              canAccessSuperData,
              name
            } = this.props;
            let isExp = isExpression(value);

            if (isExp && value.replace(/\s/g, '') === `\${${name}}`) {
              console.warn('value 不要使用表达式关联自己');
              isExp = false;
              value = undefined;
            }

            let initialValue = model.extraName
              ? [
                  getVariable(
                    data,
                    model.name,
                    canAccessSuperData ?? form?.canAccessSuperData
                  ),
                  getVariable(
                    data,
                    model.extraName,
                    canAccessSuperData ?? form?.canAccessSuperData
                  )
                ]
              : getVariable(
                  data,
                  model.name,
                  canAccessSuperData ?? form?.canAccessSuperData
                );

            if (
              model.extraName &&
              initialValue.every((item: any) => item === undefined)
            ) {
              initialValue = undefined;
            }

            if (typeof initialValue === 'undefined') {
              value = isExp
                ? FormulaExec['formula'](value, data)
                : replaceExpression(value);
            }

            model.changeTmpValue(
              initialValue ?? value, // 对组件默认值进行运算
              typeof initialValue !== 'undefined'
                ? 'initialValue'
                : isExp
                ? 'formulaChanged'
                : 'defaultValue'
            );
          }

          disposeModel() {
            const {formStore: form, formItem, rootStore} = this.props;

            if (
              this.model &&
              this.model.unique &&
              form?.parentStore &&
              form?.parentStore.storeType === ComboStore.name
            ) {
              const combo = form.parentStore as IComboStore;
              combo.unBindUniuqueItem(this.model);
            }

            if (this.model) {
              formItem &&
                isAlive(formItem) &&
                formItem.removeSubFormItem(this.model);

              this.model.clearValueOnHidden &&
                this.model.form?.deleteValueByName(this.model.name, {
                  type: 'hide'
                });

              isAlive(rootStore) && rootStore.removeStore(this.model);
            }
            delete this.model;
          }

          controlRef(control: any) {
            const {
              addHook,
              removeHook,
              formStore: form,
              formItemRef
            } = this.props;

            // 因为 control 有可能被 n 层 hoc 包裹。
            while (control && control.getWrappedInstance) {
              control = control.getWrappedInstance();
            }

            if (control && !control.props) {
              Object.defineProperty(control, 'props', {
                get: () => this.props
              });
            }

            if (control && control.validate && this.model) {
              const formItem = this.model as IFormItemStore;
              let validate = promisify(control.validate.bind(control));
              this.hook = () => {
                formItem.clearError('component:valdiate');

                return validate(
                  this.props.data,
                  this.getValue(),
                  formItem.name
                ).then(ret => {
                  if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                    formItem.setError(ret, 'component:valdiate');
                  }
                });
              };
              addHook?.(this.hook);
            } else if (!control && this.hook) {
              removeHook?.(this.hook);
              this.hook = undefined;
            }

            formItemRef?.(control);
            // 注册到 Scoped 上
            const originRef = this.control;
            this.control = control;
            const scoped = this.context as IScopedContext;

            if (control) {
              scoped.registerComponent(this.control);
            } else if (originRef) {
              scoped.unRegisterComponent(originRef);
            }
          }

          checkValidate() {
            if (!this.model) return; // 如果 model 为 undefined 则直接返回
            const validated = this.model.validated;
            const {formSubmited, validateOnChange} = this.props;

            if (
              // 如果配置了 minLength 或者 maxLength 就切成及时验证
              // this.model.rules.minLength ||
              // this.model.rules.maxLength ||
              validateOnChange === true ||
              (validateOnChange !== false && (formSubmited || validated))
            ) {
              this.validate();
            } else if (validateOnChange === false) {
              this.model?.reset();
            }
          }

          async validate() {
            if (!this.model) return;
            const {formStore: form, data, dispatchEvent} = this.props;
            let result;

            if (
              this.model.unique &&
              form?.parentStore &&
              form.parentStore.storeType === ComboStore.name
            ) {
              const combo = form.parentStore as IComboStore;
              const group = combo.uniques.get(this.model.name) as IUniqueGroup;
              const validPromises = group.items.map(item =>
                item.validate(data)
              );
              result = await Promise.all(validPromises);
            } else {
              result = [await this.model.validate(data)];
            }

            const valid = !result.some(item => item === false);
            return valid;
          }

          flushChange() {
            this.lazyEmitChange.flush();
          }

          handleChange(
            value: any,
            submitOnChange: boolean = this.props.$schema.submitOnChange,
            changeImmediately: boolean = false
          ) {
            const {
              formStore: form,
              onChange,
              $schema: {
                type,
                pipeOut,
                changeImmediately: conrolChangeImmediately
              },
              formInited,
              data
            } = this.props;

            if (
              !this.model ||
              // todo 以后想办法不要強耦合类型。
              ~[
                'service',
                'group',
                'hbox',
                'panel',
                'grid',
                'input-group'
              ].indexOf(type)
            ) {
              onChange && onChange.apply(null, arguments as any);
              return;
            }

            if (pipeOut) {
              const oldValue = this.model.value;
              value = callStrFunction.call(
                this,
                pipeOut,
                ['value', 'oldValue', 'data'],
                value,
                oldValue,
                data
              );
            }

            this.model.changeTmpValue(
              value,
              type === 'formula' ? 'formulaChanged' : 'input'
            );

            if (changeImmediately || conrolChangeImmediately || !formInited) {
              this.emitChange(submitOnChange);
            } else {
              // this.props.onTmpValueChange?.(value, this.model.name);
              this.lazyEmitChange(submitOnChange);
            }
          }

          emitChange(
            submitOnChange: boolean = this.props.$schema.submitOnChange
          ) {
            const {
              formStore: form,
              onChange,
              $schema: {
                id,
                label,
                type,
                onChange: onFormItemChange,
                maxLength,
                minLength
              },
              data,
              env,
              validateOnChange,
              formSubmited
            } = this.props;

            if (!this.model) {
              return;
            }

            const model = this.model;
            const value = this.model.tmpValue;
            let oldValue: any = undefined;
            // 受控的因为没有记录上一次 props 下发的 value，所以不做比较
            if (!model.isControlled) {
              oldValue = model.extraName
                ? [
                    getVariable(data, model.name, false),
                    getVariable(data, model.extraName, false)
                  ]
                : getVariable(data, model.name, false);

              if (
                model.extraName ? isEqual(oldValue, value) : oldValue === value
              ) {
                return;
              }
            }

            if (type !== 'input-password') {
              env?.tracker(
                {
                  eventType: 'formItemChange',
                  eventData: {
                    id,
                    name: model.name,
                    label,
                    type,
                    value
                  }
                },
                this.props
              );
            }

            this.model.changeEmitedValue(value);
            if (
              onFormItemChange?.(value, oldValue, this.model, form) === false
            ) {
              return;
            }

            // onFormItemChange 可能会触发组件销毁，再次读取 this.model 为 undefined
            if (!this.model) {
              return;
            }

            const changeReason: DataChangeReason = {
              type: 'input'
            };

            if (model.changeMotivation === 'formulaChanged') {
              changeReason.type = 'formula';
            } else if (
              model.changeMotivation === 'initialValue' ||
              model.changeMotivation === 'formInited' ||
              model.changeMotivation === 'defaultValue'
            ) {
              changeReason.type = 'init';
            }

            if (model.extraName) {
              const values = model.splitExtraValue(value);
              onChange?.(
                values[0],
                model.name,
                undefined,
                undefined,
                changeReason
              );
              onChange?.(
                values[1],
                model.extraName,
                submitOnChange === true,
                undefined,
                changeReason
              );
            } else {
              onChange?.(
                value,
                model.name,
                submitOnChange === true,
                undefined,
                changeReason
              );
            }
            this.checkValidate();
          }

          handleBlur(e: any) {
            const {
              onBlur,
              $schema: {validateOnBlur}
            } = this.props;

            if (validateOnBlur && this.model) {
              this.validate();
            }

            onBlur && onBlur(e);
          }

          setPrinstineValue(value: any) {
            if (!this.model) {
              return;
            }

            const model = this.model;
            const {
              formStore: form,
              $schema: {pipeOut},
              onChange,
              value: oldValue,
              data
            } = this.props;

            if (pipeOut) {
              value = callStrFunction.call(
                this,
                pipeOut,
                ['value', 'oldValue', 'data'],
                value,
                oldValue,
                data
              );
            }

            if (model.extraName) {
              const values = model.splitExtraValue(value);
              onChange?.(values[0], model.name!, false, true);
              onChange?.(values[1], model.extraName!, false, true);
            } else {
              onChange?.(value, model.name!, false, true);
            }
          }

          getValue() {
            const {formStore, data, $schema: control} = this.props;
            let value: any = this.model ? this.model.tmpValue : control.value;

            if (control.pipeIn) {
              value = callStrFunction.call(
                this,
                control.pipeIn,
                ['value', 'store', 'data'],
                value,
                formStore,
                data
              );
            }

            return value;
          }

          // 兼容老版本用法，新版本直接用 onChange 就可以。
          setValue(value: any, key?: string) {
            const {onBulkChange} = this.props;

            if (!key || (this.model && key === this.model.name)) {
              this.handleChange(value);
            } else {
              onBulkChange &&
                onBulkChange({
                  [key]: value
                });
            }
          }

          renderChild(
            region: string,
            node?: any,
            subProps: {
              [propName: string]: any;
            } = {}
          ) {
            const {render, data, store} = this.props;
            const model = this.model;

            return render(region, node, {
              data: model
                ? model.getMergedData(data || store?.data)
                : data || store?.data,
              ...subProps
            });
          }

          render() {
            const {
              controlWidth,
              disabled,
              formMode,
              $schema: control,
              store,
              data,
              invisible,
              defaultStatic
            } = this.props;

            if (invisible) {
              return null;
            }

            const value = this.getValue();
            const model = this.model;

            const injectedProps: any = {
              defaultSize: controlWidth,
              disabled: disabled ?? control.disabled,
              static: this.props.static ?? control.static ?? defaultStatic,
              formItem: this.model,
              formMode: control.mode || formMode,
              ref: this.controlRef,
              data: data || store?.data,
              name: model?.name ?? control.name,
              value,
              changeMotivation: model?.changeMotivation,
              defaultValue: control.value,
              formItemValue: value, // 为了兼容老版本的自定义组件
              onChange: this.handleChange,
              onBlur: this.handleBlur,
              setValue: this.setValue,
              getValue: this.getValue,
              prinstine: model ? model.prinstine : undefined,
              setPrinstineValue: this.setPrinstineValue,
              onValidate: this.validate,
              onFlushChange: this.flushChange
              // render: this.renderChild // 如果覆盖，那么用的就是 form 上的 render，这个里面用到的 data 是比较旧的。
              // !没了这个， tree 里的 options 渲染会出问题
              // todo 理论上不应该影响，待确认
              // _filteredOptions: this.model?.filteredOptions
            };

            return (
              <ComposedComponent
                {...(this.props as JSX.LibraryManagedAttributes<
                  T,
                  React.ComponentProps<T>
                >)}
                {...injectedProps}
              />
            );
          }
        }
      ) as any
    ),
    ComposedComponent
  );

  return result as typeof result & {
    ComposedComponent: T;
  };
}
