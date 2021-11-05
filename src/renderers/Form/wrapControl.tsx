import React from 'react';
import {IFormStore, IFormItemStore} from '../../store/form';
import debouce from 'lodash/debounce';

import {RendererProps, Renderer} from '../../factory';
import {ComboStore, IComboStore, IUniqueGroup} from '../../store/combo';
import {
  anyChanged,
  promisify,
  isObject,
  guid,
  isEmpty,
  autobind,
  getVariable
} from '../../utils/helper';
import {IIRendererStore, IRendererStore} from '../../store';
import {ScopedContext, IScopedContext} from '../../Scoped';
import {reaction} from 'mobx';
import {FormItemStore} from '../../store/formItem';
import {isAlive} from 'mobx-state-tree';
import {observer} from 'mobx-react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import {withRootStore} from '../../WithRootStore';
import {FormBaseControl, FormItemWrap} from './Item';
import {Api} from '../../types';

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
  addHook?: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
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
    changePristine?: boolean
  ) => void;
}

export interface ControlProps {
  onBulkChange?: (values: Object) => void;
  onChange?: (value: any, name: string, submit: boolean) => void;
  store: IIRendererStore;
}

export function wrapControl<
  T extends React.ComponentType<React.ComponentProps<T> & ControlProps>
>(ComposedComponent: T) {
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
              $schema: {
                name,
                id,
                type,
                required,
                validations,
                validationErrors,
                unique,
                value,
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
                maxLength
              }
            } = this.props;

            this.getValue = this.getValue.bind(this);
            this.setValue = this.setValue.bind(this);
            this.handleChange = this.handleChange.bind(this);
            this.setPrinstineValue = this.setPrinstineValue.bind(this);
            this.controlRef = this.controlRef.bind(this);
            this.handleBlur = this.handleBlur.bind(this);

            if (!name) {
              return;
            }

            let propValue = this.props.value;
            const model = rootStore.addStore({
              id: guid(),
              path: this.props.$path,
              storeType: FormItemStore.name,
              parentId: store?.id,
              name
            }) as IFormItemStore;
            this.model = model;
            // @issue 打算干掉这个
            formItem?.addSubFormItem(model);
            model.config({
              id,
              type,
              required,
              unique,
              value,
              rules: validations,
              messages: validationErrors,
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
              maxLength
            });

            // issue 这个逻辑应该在 combo 里面自己实现。
            if (
              this.model.unique &&
              form?.parentStore?.storeType === ComboStore.name
            ) {
              const combo = form.parentStore as IComboStore;
              combo.bindUniuqueItem(model);
            }

            // 同步 value
            model.changeTmpValue(
              propValue ?? store?.getValueByName(model.name) ?? value
            );

            // 如果没有初始值，通过 onChange 设置过去
            if (
              onChange &&
              typeof propValue === 'undefined' &&
              typeof store?.getValueByName(model.name, false) === 'undefined'
            ) {
              onChange(model.tmpValue, model.name, false, true);
            }
          }

          componentDidMount() {
            const {
              store,
              formStore: form,
              $schema: {name, validate},
              addHook
            } = this.props;

            // 提交前先把之前的 lazyEmit 执行一下。
            this.hook3 = () => {
              this.lazyEmitChange.flush();
            };
            addHook?.(this.hook3, 'flush');

            const formItem = this.model as IFormItemStore;
            if (formItem && validate) {
              let finalValidate = promisify(validate.bind(formItem));
              this.hook2 = () => {
                formItem.clearError('control:valdiate');
                return finalValidate(
                  this.props.data,
                  this.getValue(),
                  name
                ).then((ret: any) => {
                  if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
                    formItem.addError(ret, 'control:valdiate');
                  }
                });
              };
              addHook?.(this.hook2);
            }
          }

          componentDidUpdate(prevProps: OuterProps) {
            const props = this.props;
            const form = props.formStore;
            const model = this.model;

            if (
              model &&
              anyChanged(
                [
                  'id',
                  'validations',
                  'validationErrors',
                  'value',
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
                  'validateApi'
                ],
                prevProps.$schema,
                props.$schema
              )
            ) {
              model.config({
                required: props.$schema.required,
                id: props.$schema.id,
                unique: props.$schema.unique,
                value: props.$schema.value,
                rules: props.$schema.validations,
                multiple: props.$schema.multiple,
                delimiter: props.$schema.delimiter,
                valueField: props.$schema.valueField,
                labelField: props.$schema.labelField,
                joinValues: props.$schema.joinValues,
                extractValue: props.$schema.extractValue,
                messages: props.$schema.validationErrors,
                selectFirst: props.$schema.selectFirst,
                autoFill: props.$schema.autoFill,
                clearValueOnHidden: props.$schema.clearValueOnHidden,
                validateApi: props.$schema.validateApi,
                minLength: props.minLength,
                maxLength: props.maxLength
              });
            }

            if (model && typeof props.value !== 'undefined') {
              // 自己控制的 value 优先
              if (
                props.value !== prevProps.value &&
                props.value !== model.tmpValue
              ) {
                model.changeTmpValue(props.value);
              }
            } else if (
              // 然后才是查看关联的 name 属性值是否变化
              model &&
              props.data !== prevProps.data &&
              (!model.emitedValue || model.emitedValue === model.tmpValue)
            ) {
              model.changeEmitedValue(undefined);
              const value = getVariable(props.data, model.name);
              const prevValue = getVariable(prevProps.data, model.name);
              if (
                (value !== prevValue ||
                  getVariable(props.data, model.name, false) !==
                    getVariable(prevProps.data, model.name, false)) &&
                value !== model.tmpValue
              ) {
                model.changeTmpValue(value);
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
                this.model.form?.deleteValueByName(this.model.name);

              rootStore.removeStore(this.model);
            }
            delete this.model;
          }

          controlRef(control: any) {
            const {
              addHook,
              removeHook,
              formStore: form,
              $schema: {name}
            } = this.props;

            // 因为 control 有可能被 n 层 hoc 包裹。
            while (control && control.getWrappedInstance) {
              control = control.getWrappedInstance();
            }

            if (control && control.validate && this.model) {
              const formItem = this.model as IFormItemStore;
              let validate = promisify(control.validate.bind(control));
              this.hook = () => {
                formItem.clearError('component:valdiate');

                return validate(this.props.data, this.getValue(), name).then(
                  ret => {
                    if (
                      (typeof ret === 'string' || Array.isArray(ret)) &&
                      ret
                    ) {
                      formItem.setError(ret, 'component:valdiate');
                    }
                  }
                );
              };
              addHook?.(this.hook);
            } else if (!control && this.hook) {
              removeHook?.(this.hook);
              this.hook = undefined;
            }

            // 注册到 Scoped 上
            const originRef = this.control;
            this.control = control;
            const scoped = this.context as IScopedContext;

            if (!this.control) {
              return;
            }

            if (control) {
              scoped.registerComponent(this.control);
            } else {
              scoped.unRegisterComponent(originRef);
            }
          }

          validate() {
            const {formStore: form, data} = this.props;

            if (this.model) {
              if (
                this.model.unique &&
                form?.parentStore &&
                form.parentStore.storeType === ComboStore.name
              ) {
                const combo = form.parentStore as IComboStore;
                const group = combo.uniques.get(
                  this.model.name
                ) as IUniqueGroup;
                group.items.forEach(item => item.validate(data));
              } else {
                this.model.validate(data, this.hook);
                form
                  ?.getItemsByName(this.model.name)
                  .forEach(item => item !== this.model && item.validate(data));
              }
            }
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
              value = pipeOut(value, oldValue, data);
            }

            this.model.changeTmpValue(value);
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
              $schema: {name, onChange: onFormItemChange, maxLength, minLength},
              data,
              validateOnChange,
              formSubmited
            } = this.props;

            if (!this.model) {
              return;
            }
            const value = this.model.tmpValue;
            const oldValue = getVariable(data, this.model.name, false);

            if (oldValue === value) {
              return;
            }

            this.model.changeEmitedValue(value);
            if (
              onFormItemChange?.(value, oldValue, this.model, form) === false
            ) {
              return;
            }
            const validated = this.model.validated;
            onChange?.(value, name!, submitOnChange === true);

            if (
              // 如果配置了 minLength 或者 maxLength 就切成及时验证
              this.model.rules.minLength ||
              this.model.rules.maxLength ||
              validateOnChange === true ||
              (validateOnChange !== false && (formSubmited || validated))
            ) {
              this.validate();
            } else if (validateOnChange === false) {
              this.model?.reset();
            }
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

            const {
              formStore: form,
              name,
              $schema: {pipeOut},
              onChange,
              value: oldValue,
              data
            } = this.props;

            if (pipeOut) {
              value = pipeOut(value, oldValue, data);
            }

            onChange?.(value, name!, false, true);
          }

          getValue() {
            const {formStore: data, $schema: control} = this.props;
            let value: any = this.model ? this.model.tmpValue : control.value;

            if (control.pipeIn) {
              value = control.pipeIn(value, data);
            }

            return value;
          }

          // 兼容老版本用法，新版本直接用 onChange 就可以。
          setValue(value: any, key?: string) {
            const {
              $schema: {name},
              onBulkChange
            } = this.props;

            if (!key || key === name) {
              this.handleChange(value);
            } else {
              onBulkChange &&
                onBulkChange({
                  [key]: value
                });
            }
          }

          render() {
            const {
              controlWidth,
              disabled,
              formMode,
              $schema: control,
              store,
              data,
              invisible
            } = this.props;

            if (invisible) {
              return null;
            }

            const value = this.getValue();
            const model = this.model;

            const injectedProps: any = {
              defaultSize: controlWidth,
              disabled: disabled || control.disabled,
              formItem: this.model,
              formMode: control.mode || formMode,
              ref: this.controlRef,
              data: data || store?.data,
              value,
              defaultValue: control.value,
              formItemValue: value, // 为了兼容老版本的自定义组件
              onChange: this.handleChange,

              onBlur: this.handleBlur,
              setValue: this.setValue,
              getValue: this.getValue,
              prinstine: model ? model.prinstine : undefined,
              setPrinstineValue: this.setPrinstineValue
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
