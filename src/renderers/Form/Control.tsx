import React from 'react';
import {IFormStore, IFormItemStore} from '../../store/form';
import debouce from 'lodash/debounce';

import {
  RendererProps,
  Renderer,
  RootStoreContext,
  withRootStore
} from '../../factory';
import {ComboStore, IComboStore, IUniqueGroup} from '../../store/combo';
import {
  anyChanged,
  promisify,
  isObject,
  getVariable,
  guid
} from '../../utils/helper';
import {Schema} from '../../types';
import {IIRendererStore, IRendererStore} from '../../store';
import {ScopedContext, IScopedContext} from '../../Scoped';
import {reaction} from 'mobx';
import {FormItemStore} from '../../store/formItem';
import {isAlive} from 'mobx-state-tree';

export interface ControlProps extends RendererProps {
  control: {
    id?: string;
    name?: string;
    value?: any;
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
    pipeIn?: (value: any, data: any) => any;
    pipeOut?: (value: any, originValue: any, data: any) => any;
    validate?: (value: any, values: any, name: string) => any;
  } & Schema;
  rootStore: IRendererStore;
  formStore: IFormStore;
  store: IIRendererStore;
  addHook: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
  removeHook: (fn: () => any, type?: 'validate' | 'init' | 'flush') => void;
}

interface ControlState {
  value: any;
}

export default class FormControl extends React.PureComponent<
  ControlProps,
  ControlState
> {
  static propsList: any = ['control'];
  public model: IFormItemStore | undefined;
  control: any;
  value?: any = undefined;
  hook?: () => any;
  hook2?: () => any;
  hook3?: () => any;
  reaction?: () => void;

  static defaultProps = {};

  lazyValidate = debouce(this.validate.bind(this), 250, {
    trailing: true,
    leading: false
  });
  lazyEmitChange = debouce(this.emitChange.bind(this), 250, {
    trailing: true,
    leading: false
  });
  state = {value: this.value = this.props.control.value};
  componentWillMount() {
    const {
      formStore: form,
      rootStore,
      control: {
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
        extractValue
      }
    } = this.props;

    this.getValue = this.getValue.bind(this);
    this.setValue = this.setValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBulkChange = this.handleBulkChange.bind(this);
    this.setPrinstineValue = this.setPrinstineValue.bind(this);
    this.controlRef = this.controlRef.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    if (!name) {
      return;
    }

    const model = rootStore.addStore({
      id: guid(),
      path: this.props.$path,
      storeType: FormItemStore.name,
      parentId: form.id,
      name
    }) as IFormItemStore;
    this.model = model;
    form.addFormItem(model);
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
      extractValue
    });

    if (this.model.unique && form.parentStore?.storeType === ComboStore.name) {
      const combo = form.parentStore as IComboStore;
      combo.bindUniuqueItem(model);
    }

    // 同步 value
    this.setState({
      value: this.value = model.value
    });
    this.reaction = reaction(
      () => model.value,
      value => this.setState({value: this.value = value})
    );
  }

  componentDidMount() {
    const {
      store,
      formStore: form,
      control: {name, validate},
      addHook
    } = this.props;

    // 提交前先把之前的 lazyEmit 执行一下。
    this.hook3 = () => {
      this.lazyEmitChange.flush();
      this.lazyValidate.flush();
    };
    addHook(this.hook3, 'flush');

    const formItem = this.model as IFormItemStore;
    if (formItem && validate) {
      let finalValidate = promisify(validate.bind(formItem));
      this.hook2 = function () {
        formItem.clearError('control:valdiate');
        return finalValidate(form.data, formItem.value, formItem.name).then(
          (ret: any) => {
            if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
              formItem.addError(ret, 'control:valdiate');
            }
          }
        );
      };
      addHook(this.hook2);
    }
  }

  componentWillReceiveProps(nextProps: ControlProps) {
    const props = this.props;
    const form = nextProps.formStore;

    // if (!nextProps.control.name) {
    //   // 把 name 删了, 对 model 做清理
    //   this.model && this.disposeModel();
    //   this.reaction && this.reaction();
    //   this.model = undefined;
    //   return;
    // } else if (nextProps.control.name !== props.control.name || !this.model) {
    //   // 对 model 做清理
    //   this.model && this.disposeModel();
    //   this.reaction && this.reaction();

    //   // name 是后面才有的，比如编辑模式下就会出现。
    //   const model = (this.model = form.registryItem(nextProps.control.name, {
    //     id: nextProps.control.id,
    //     type: nextProps.control.type,
    //     required: nextProps.control.required,
    //     unique: nextProps.control.unique,
    //     value: nextProps.control.value,
    //     rules: nextProps.control.validations,
    //     multiple: nextProps.control.multiple,
    //     delimiter: nextProps.control.delimiter,
    //     valueField: nextProps.control.valueField,
    //     labelField: nextProps.control.labelField,
    //     joinValues: nextProps.control.joinValues,
    //     extractValue: nextProps.control.extractValue,
    //     messages: nextProps.control.validationErrors
    //   }));
    //   // this.forceUpdate();
    //   this.setState({
    //     value: model.value
    //   });

    //   this.reaction = reaction(
    //     () => model.value,
    //     value => this.setState({value})
    //   );
    // }

    if (
      this.model &&
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
          'extractValue'
        ],
        props.control,
        nextProps.control
      )
    ) {
      this.model.config({
        required: nextProps.control.required,
        id: nextProps.control.id,
        unique: nextProps.control.unique,
        value: nextProps.control.value,
        rules: nextProps.control.validations,
        multiple: nextProps.control.multiple,
        delimiter: nextProps.control.delimiter,
        valueField: nextProps.control.valueField,
        labelField: nextProps.control.labelField,
        joinValues: nextProps.control.joinValues,
        extractValue: nextProps.control.extractValue,
        messages: nextProps.control.validationErrors
      });
    }
  }

  componentWillUnmount() {
    this.hook && this.props.removeHook(this.hook);
    this.hook2 && this.props.removeHook(this.hook2);
    this.hook3 && this.props.removeHook(this.hook3, 'flush');
    this.lazyValidate.cancel();
    // this.lazyEmitChange.flush();
    this.lazyEmitChange.cancel();
    this.reaction && this.reaction();
    this.disposeModel();
  }

  disposeModel() {
    const {formStore: form} = this.props;

    if (
      this.model &&
      this.model.unique &&
      form.parentStore &&
      form.parentStore.storeType === ComboStore.name
    ) {
      const combo = form.parentStore as IComboStore;
      combo.unBindUniuqueItem(this.model);
    }

    this.model && form.removeFormItem(this.model);
  }

  controlRef(control: any) {
    const {addHook, removeHook, formStore: form} = this.props;

    // 因为 control 有可能被 n 层 hoc 包裹。
    while (control && control.getWrappedInstance) {
      control = control.getWrappedInstance();
    }

    if (control && control.validate && this.model) {
      const formItem = this.model as IFormItemStore;
      let validate = promisify(control.validate.bind(control));
      this.hook = function () {
        formItem.clearError('component:valdiate');

        return validate(form.data, formItem.value, formItem.name).then(ret => {
          if ((typeof ret === 'string' || Array.isArray(ret)) && ret) {
            formItem.setError(ret, 'component:valdiate');
          }
        });
      };
      addHook(this.hook);
    } else if (!control && this.hook) {
      removeHook(this.hook);
      this.hook = undefined;
    }

    this.control = control;
  }

  validate() {
    const {formStore: form} = this.props;

    if (this.model) {
      if (
        this.model.unique &&
        form.parentStore &&
        form.parentStore.storeType === ComboStore.name
      ) {
        const combo = form.parentStore as IComboStore;
        const group = combo.uniques.get(this.model.name) as IUniqueGroup;
        group.items.forEach(item => item.validate());
      } else {
        this.model.validate(this.hook);
        form
          .getItemsByName(this.model.name)
          .forEach(item => item !== this.model && item.validate());
      }
    }
  }

  handleChange(
    value: any,
    submitOnChange: boolean = this.props.control.submitOnChange,
    changeImmediately: boolean = false
  ) {
    const {
      formStore: form,
      onChange,
      control: {type, pipeOut, changeImmediately: conrolChangeImmediately},
      formInited
    } = this.props;

    if (
      !this.model ||
      // todo 以后想办法不要強耦合类型。
      ~['service', 'group', 'hbox', 'panel', 'grid'].indexOf(type)
    ) {
      onChange && onChange(...(arguments as any));
      return;
    }

    if (pipeOut) {
      const oldValue = this.model.value;
      value = pipeOut(value, oldValue, form.data);
    }

    this.setState({
      value: this.value = value
    });
    changeImmediately || conrolChangeImmediately || !formInited
      ? this.emitChange(submitOnChange)
      : this.lazyEmitChange(submitOnChange);
  }

  emitChange(submitOnChange: boolean = this.props.control.submitOnChange) {
    const {
      formStore: form,
      onChange,
      control: {validateOnChange, name, onChange: onFormItemChange}
    } = this.props;

    if (!this.model) {
      return;
    }
    const value = this.value; // value 跟 this.state.value 更及时。
    const oldValue = this.model.value;

    if (oldValue === value) {
      return;
    }

    this.model.changeValue(value);

    if (
      validateOnChange === true ||
      (validateOnChange !== false &&
        (form.submited || (isAlive(this.model) && this.model.validated)))
    ) {
      this.lazyValidate();
    } else if (validateOnChange === false) {
      this.model.reset();
    }

    onFormItemChange && onFormItemChange(value, oldValue, this.model, form);
    onChange && onChange(value, name, submitOnChange === true);
  }

  handleBlur(e: any) {
    const {
      onBlur,
      control: {validateOnBlur}
    } = this.props;

    if (validateOnBlur && this.model) {
      this.validate();
    }

    onBlur && onBlur(e);
  }

  handleBulkChange(
    values: any,
    submitOnChange: boolean = this.props.control.submitOnChange
  ) {
    const {
      formStore: form,
      onChange,
      control: {validateOnChange, type},
      onBulkChange
    } = this.props;

    if (!isObject(values)) {
      return;
    } else if (
      !this.model ||
      // todo 以后想办法不要強耦合类型。
      ~['service', 'group', 'hbox', 'panel', 'grid'].indexOf(type)
    ) {
      onBulkChange && onBulkChange(values);
      return;
    }

    let lastKey: string = '';
    let lastValue: any;

    Object.keys(values).forEach(key => {
      const value = values[key];
      lastKey = key;
      lastValue = value;
    });

    // is empty
    if (!lastKey) {
      return;
    }

    form.setValues(values);

    if (validateOnChange !== false && (form.submited || this.model.validated)) {
      this.lazyValidate();
    }

    onChange && onChange(lastValue, lastKey, submitOnChange === true);
  }

  setPrinstineValue(value: any) {
    if (!this.model) {
      return;
    }

    const {
      formStore: form,
      control: {pipeOut}
    } = this.props;

    if (pipeOut) {
      const oldValue = this.model.value;
      value = pipeOut(value, oldValue, form.data);
    }

    this.model.changeValue(value, true);
  }

  getValue() {
    const {formStore: form, control} = this.props;
    let value: any = this.state.value;

    if (control.pipeIn) {
      value = control.pipeIn(value, form.data);
    }

    return value;
  }

  // 兼容老版本用法，新版本直接用 onChange 就可以。
  setValue(value: any, key?: string) {
    const {
      control: {name}
    } = this.props;

    if (!key || key === name) {
      this.handleChange(value);
    } else {
      this.handleBulkChange({
        [key]: value
      });
    }
  }

  render() {
    const {
      render,
      control: {pipeIn, pipeOut, onChange, ...control},
      formMode,
      controlWidth,
      type,
      store,
      data,
      disabled,
      onChange: superOnChange,
      ...rest
    } = this.props;

    const model = this.model;
    const value = this.getValue();

    return render('', control, {
      ...rest,
      defaultSize: controlWidth,
      disabled: disabled || control.disabled,
      formItem: model,
      formMode: control.mode || formMode,
      ref: this.controlRef,
      defaultValue: control.value,
      data: store ? store.data : data,
      value,
      formItemValue: value, // 为了兼容老版本的自定义组件
      onChange:
        control.type === 'input-group' ? superOnChange : this.handleChange,
      onBlur: this.handleBlur,
      setValue: this.setValue,
      getValue: this.getValue,
      onBulkChange: this.handleBulkChange,
      prinstine: model ? model.prinstine : undefined,
      setPrinstineValue: this.setPrinstineValue
    }) as JSX.Element;
  }
}

@Renderer({
  test: (path: string) =>
    /(^|\/)form(?:\/.*)?\/control$/i.test(path) &&
    !/\/control\/control$/i.test(path),
  name: 'control'
})
// @ts-ignore
@withRootStore
export class FormControlRenderer extends FormControl {
  static displayName = 'Control';
  static contextType = ScopedContext;

  controlRef(ref: any) {
    const originRef = this.control;
    super.controlRef(ref);
    const scoped = this.context as IScopedContext;

    if (!this.control) {
      return;
    }

    if (ref) {
      scoped.registerComponent(this.control);
    } else {
      scoped.unRegisterComponent(originRef);
    }
  }
}
