import React from 'react';
import {
  makeHorizontalDeeper,
  getExprProperties,
  FormItem,
  FormControlProps,
  IFormItemStore,
  IFormStore,
  anyChanged
} from 'amis-core';
import {FormBaseControlSchema, SchemaCollection} from '../../Schema';

/**
 * InputGroup
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-group
 */
export interface InputGroupControlSchema extends FormBaseControlSchema {
  type: 'input-group';

  /**
   * FormItem 集合
   */
  body: SchemaCollection;

  /**
   * 校验提示信息配置
   */
  validationConfig?: {
    /**
     * 错误提示的展示模式, full为整体飘红, highlight为仅错误项飘红, 默认为full
     */
    errorMode?: 'full' | 'partial';

    /**
     * 单个子元素多条校验信息的分隔符
     */
    delimiter?: string;
  };
}

export interface InputGroupProps extends FormControlProps {
  body: Array<any>;
  formStore: IFormStore;
}

interface InputGroupState {
  isFocused: boolean;
}

export class InputGroup extends React.Component<
  InputGroupProps,
  InputGroupState
> {
  static defaultProps = {
    validationConfig: {
      errorMode: 'full',
      delimiter: '; '
    }
  };

  toDispose: Array<Function> = [];

  constructor(props: InputGroupProps) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validateHook = this.validateHook.bind(this);

    this.state = {
      isFocused: false
    };
  }

  componentDidMount() {
    const {addHook, name} = this.props;

    if (name && addHook) {
      this.toDispose.push(addHook(this.validateHook, 'validate'));
    }
  }

  componentDidUpdate(prevProps: Readonly<InputGroupProps>): void {
    if (
      anyChanged(
        ['errorCode', 'delimiter'],
        prevProps?.validationConfig,
        this.props?.validationConfig
      )
    ) {
      this.validateHook();
    }
  }

  componentWillUnmount() {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  getValidationConfig() {
    const {validationConfig} = this.props;

    return {
      errorMode: validationConfig?.errorMode !== 'partial' ? 'full' : 'partial',
      delimiter:
        validationConfig?.delimiter &&
        typeof validationConfig.delimiter === 'string'
          ? validationConfig.delimiter
          : '; '
    };
  }

  validateHook() {
    const {formStore, formItem, name} = this.props;
    const {delimiter} = this.getValidationConfig();

    if (!name) {
      return;
    }

    const chidren = formStore?.inputGroupItems?.[name];
    const errorCollection = chidren
      .map((item, index) => {
        if (item.errors.length <= 0) {
          return '';
        }
        /** 标识符格式: 索引值 + label */
        const identifier = item.label
          ? `(${index + 1})${item.label}`
          : `(${index + 1})`;
        return `${identifier}: ${item.errors.join(delimiter)}`;
      })
      .filter(Boolean);

    formItem && formItem.setError(errorCollection);
  }

  handleFocus() {
    this.setState({
      isFocused: true
    });
  }

  handleBlur() {
    this.setState({
      isFocused: false
    });
  }

  renderControl(control: any, index: any, otherProps?: any) {
    const {render, onChange} = this.props;

    if (!control) {
      return null;
    }

    const subSchema: any = control;

    return render(`${index}`, subSchema, {
      onChange,
      ...otherProps
    });
  }

  validate() {
    const {formItem} = this.props;

    const errors: Array<string> = [];

    // issue 处理这个，按理不需要这么弄。
    formItem?.subFormItems.forEach((item: IFormItemStore) => {
      if (item.errors.length) {
        errors.push(...item.errors);
      }
    });

    return errors.length ? errors : '';
  }

  render() {
    let {
      body,
      controls,
      className,
      style,
      mode,
      horizontal,
      formMode,
      formHorizontal,
      data,
      classnames: cx,
      static: isStatic,
      disabled
    } = this.props;
    const {errorMode} = this.getValidationConfig();

    formMode = mode || formMode;
    let inputs: Array<any> = Array.isArray(controls) ? controls : body;
    if (!Array.isArray(inputs)) {
      inputs = [];
    }

    inputs = inputs.filter(item => {
      if (item && (item.hidden || item.visible === false)) {
        return false;
      }

      const exprProps = getExprProperties(item || {}, data);
      if (exprProps.hidden || exprProps.visible === false) {
        return false;
      }

      return true;
    });

    let horizontalDeeper =
      horizontal ||
      (formHorizontal
        ? makeHorizontalDeeper(formHorizontal as any, inputs.length)
        : undefined);
    return (
      <div
        className={cx(
          `InputGroup`,
          `InputGroup-validation--${errorMode}`,
          className,
          {
            'is-focused': this.state.isFocused
          }
        )}
      >
        {inputs.map((control, index) => {
          const isAddOn = ~[
            'icon',
            'plain',
            'tpl',
            'button',
            'submit',
            'reset'
          ].indexOf(control && control.type);

          let dom = this.renderControl(control, index, {
            formHorizontal: horizontalDeeper,
            formMode: 'normal',
            inputOnly: true,
            inputGroupControl: {
              name: this.props.name,
              path: this.props.$path,
              schema: this.props.$schema
            },
            key: index,
            static: isStatic,
            disabled,
            onFocus: this.handleFocus,
            onBlur: this.handleBlur
          });

          return isAddOn ? (
            <span
              key={index}
              className={cx(
                control.addOnclassName,
                ~['button', 'submit', 'reset'].indexOf(control && control.type)
                  ? 'InputGroup-btn'
                  : 'InputGroup-addOn'
              )}
            >
              {dom}
            </span>
          ) : (
            dom
          );
        })}
      </div>
    );
  }
}

@FormItem({
  type: 'input-group',
  strictMode: false
})
export default class InputGroupRenderer extends InputGroup {}
