import {
  anyChanged,
  isExpression,
  resolveVariableAndFilterForAsync,
  uncontrollable
} from 'amis-core';
import React from 'react';
import {FormulaEditor, FormulaEditorProps} from './Editor';
import {
  autobind,
  noop,
  themeable,
  localeable,
  parse,
  Evaluator,
  evaluate,
  isPureVariable
} from 'amis-core';
import Editor from './Editor';
import ResultBox from '../ResultBox';
import Button from '../Button';
import {Icon} from '../icons';
import Modal from '../Modal';
import PopUp from '../PopUp';
import FormulaInput from './Input';
import {FuncGroup, VariableItem} from './CodeEditor';

export const InputSchemaType = [
  'text',
  'number',
  'boolean',
  'date',
  'time',
  'datetime',
  'select',
  'custom'
] as const;

export type FormulaPickerInputSettingType = (typeof InputSchemaType)[number];

export interface FormulaPickerInputSettings {
  type: FormulaPickerInputSettingType;
  [propName: string]: any;
}

export interface FormulaPickerProps
  extends Omit<FormulaEditorProps, 'variables'> {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 混合模式，意味着这个输入框既可以输入不同文本
   * 也可以输入公式。
   * 当输入公式时，值格式为 ${公式内容}
   * 其他内容当字符串。
   */
  mixedMode?: boolean;

  /**
   * 编辑器标题
   */
  title?: string;

  /**
   * 按钮图标
   */
  icon?: string;

  /**
   * 控件模式
   */
  mode?: 'button' | 'input-button' | 'input-group';

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  /**
   * 按钮Label，inputMode为button时生效
   */
  btnLabel?: string;

  /**
   * 按钮样式
   */
  level?:
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'link'
    | 'primary'
    | 'dark'
    | 'light';

  /**
   * 按钮大小
   */
  btnSize?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * 禁用状态
   */
  disabled?: boolean;

  /**
   * 占位文本
   */
  placeholder?: string;

  /**
   * 可清除
   */
  clearable?: boolean;

  /**
   * 支持通过上下文变量配置value
   */
  source?: string;

  /**
   * 外层透传的 data，和source配合使用
   */
  data?: any;

  /**
   * 输入框的展示类型
   */
  inputSettings?: FormulaPickerInputSettings;

  /**
   * 其他类型渲染器
   */
  customInputRender?: (props: {
    value: any;
    onChange: (value: any) => void;
    className?: string;
    inputSettings: FormulaPickerInputSettings;
  }) => JSX.Element;

  /**
   * 公式弹出的时候，可以外部设置 variables 和 functions
   */
  onPickerOpen?: (props: FormulaPickerProps) => any;

  functionsFilter?: (functions: Array<FuncGroup>) => Array<FuncGroup>;

  children?: (props: {
    onClick: (e: React.MouseEvent) => void;
    setState: (state: any) => void;
    isOpened: boolean;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
  }) => JSX.Element;

  onConfirm?: (value?: any) => void;

  onRef?: (node: any) => void;

  popOverContainer?: any;

  variables?:
    | Array<VariableItem>
    | string
    | ((props: any) => Array<VariableItem>);
}

export interface FormulaPickerState {
  isOpened: boolean;
  value: any;
  editorValue: string;
  onConfirm?: (value?: any) => void;
  isError: boolean | string;
  variables?: Array<VariableItem>;
  functions?: Array<FuncGroup>;
  variableMode?: any;
}

export class FormulaPicker extends React.Component<
  FormulaPickerProps,
  FormulaPickerState
> {
  state: FormulaPickerState;

  static defaultProps = {
    evalMode: true
  };

  unmounted = false;
  constructor(props: FormulaPickerProps) {
    super(props);
    this.props.onRef && this.props.onRef(this);
    this.state = {
      isOpened: false,
      value: this.props.value!,
      editorValue: this.value2EditorValue(this.props),
      isError: false,
      variables: Array.isArray(props.variables) ? props.variables : []
    };
  }

  async componentDidMount() {
    const {variables, data} = this.props;
    if (typeof variables === 'function') {
      const list = await variables(this.props);
      this.setState({variables: list});
    } else if (typeof variables === 'string' && isExpression(variables)) {
      const result = await resolveVariableAndFilterForAsync(
        variables,
        data,
        '|raw'
      );
      this.setState({variables: result});
    }
    this.buildFunctions();
  }

  async componentDidUpdate(prevProps: FormulaPickerProps) {
    const {value} = this.props;

    if (value !== prevProps.value && !this.state.isOpened) {
      this.setState({
        value: typeof value === 'string' || !this.isTextInput() ? value : '',
        editorValue: this.value2EditorValue(this.props)
      });
    }

    if (anyChanged(['variables', 'data'], this.props, prevProps)) {
      const {variables, data} = this.props;
      if (Array.isArray(variables) && variables !== prevProps.variables) {
        this.setState({variables});
      } else if (typeof variables === 'function') {
        const list = await variables(this.props);
        this.setState({variables: list});
      } else if (typeof variables === 'string' && isExpression(variables)) {
        const result = await resolveVariableAndFilterForAsync(
          variables,
          data,
          '|raw'
        );
        this.setState({variables: result});
      }
    }

    if (prevProps.functions !== this.props.functions) {
      this.buildFunctions();
    }
  }

  componentWillUnmount(): void {
    this.unmounted = true;
  }

  async buildFunctions(
    functions = this.props.functions,
    setState = true
  ): Promise<any> {
    const functionList = await FormulaEditor.buildFunctions(
      functions,
      this.props.functionsFilter
    );
    if (this.unmounted) {
      return;
    }

    if (!setState) {
      return functionList;
    }

    this.setState({
      functions: functionList
    });
  }

  value2EditorValue(props: FormulaPickerProps) {
    const {value, mixedMode, inputSettings} = props;

    if (
      mixedMode &&
      typeof value === 'string' &&
      /^\s*\$\{([\s\S]+)\}\s*$/.test(value)
    ) {
      return RegExp.$1;
    } else if (typeof value !== 'string') {
      let editorValue = '';

      try {
        editorValue = JSON.stringify(value);
      } catch (error) {}

      return editorValue;
    } else {
      return value
        ? mixedMode
          ? isExpression(value)
            ? `\`${value.replace(/`/g, '\\`')}\``
            : JSON.stringify(value)
          : value
        : '';
    }
  }

  isTextInput() {
    const {inputSettings} = this.props;

    return (
      !inputSettings ||
      inputSettings?.type === 'text' ||
      !InputSchemaType.includes(inputSettings?.type)
    );
  }

  @autobind
  handleConfirm() {
    const value = this.state.value;

    if (this.props.onConfirm) {
      this.props.onConfirm(value);
    } else {
      this.props.onChange?.(value);
    }
  }

  @autobind
  handleInputChange(value: string) {
    this.setState({value}, () => this.handleConfirm());
  }

  @autobind
  handleInputGroupChange(e: React.ChangeEvent<HTMLInputElement>) {
    const onChange = this.props.onChange;
    onChange && onChange(e.currentTarget.value);
  }

  @autobind
  handleEditorChange(value: string) {
    this.setState({
      editorValue: value,
      isError: false
    });
  }

  @autobind
  handleEditorConfirm() {
    const {translate: __, inputSettings} = this.props;
    const {editorValue} = this.state;

    let ast: any;
    try {
      ast = parse(editorValue, {
        // mixedMode 弹窗中的一定是表达式
        evalMode: this.props.mixedMode ? true : this.props.evalMode,
        allowFilter: false
      });
    } catch (error) {
      this.setState({isError: error?.message ?? true});
      return;
    }

    if (
      inputSettings?.type &&
      ['boolean', 'number'].includes(inputSettings?.type)
    ) {
      let result = editorValue;
      // const schemaType = inputSettings?.type;

      if (ast.type === 'literal' || ast.type === 'string') {
        result = ast.value ?? '';
      }

      this.setState({isError: false});
      return this.confirm(result);
    }
    return this.confirm(editorValue, ast);
  }

  confirm(value: any, ast?: any) {
    const {mixedMode} = this.props;
    const stateOnConfirm = this.state.onConfirm;
    const validate = this.validate(value);

    if (validate === true) {
      let result = value;

      if (mixedMode && typeof value === 'string') {
        result =
          ast?.type === 'string'
            ? ast.value
            : ast?.type === 'template' &&
              ast.body.length === 1 &&
              ast.body[0].type === 'template_raw'
            ? ast.body[0].value
            : `\${${value}}`;
      }

      this.setState({value: result, onConfirm: undefined}, () => {
        this.close(undefined, () => {
          stateOnConfirm
            ? stateOnConfirm(this.state.value)
            : this.handleConfirm();
        });
      });
    } else {
      this.setState({isError: validate});
    }
  }

  @autobind
  async handleClick() {
    return this.openEditor(this.value2EditorValue(this.props));
  }

  @autobind
  async openEditor(editorValue: string, onConfirm?: (value: any) => void) {
    const state = {
      ...(await this.props.onPickerOpen?.(this.props)),
      editorValue,
      isOpened: true,
      onConfirm
    };

    if (state.functions) {
      state.functions = await this.buildFunctions(state.functions, false);
    }
    this.setState(state);
  }

  @autobind
  close(e?: any, callback?: () => void) {
    this.setState(
      {
        isOpened: false,
        isError: false
      },
      () => {
        if (callback) {
          callback();
          return;
        }
      }
    );
  }

  @autobind
  updateState(state: any = {}) {
    const {isOpened, ...rest} = state;
    this.setState({
      ...this.state,
      ...rest
    });
  }

  @autobind
  validate(value: string) {
    const {translate: __, inputSettings} = this.props;

    /** 处理非文本输入场景 */
    if (inputSettings && !this.isTextInput()) {
      const schemaType = inputSettings?.type;
      const errorMsg = __('FormulaEditor.invalidValue');

      /** 变量类型 */
      if (typeof value === 'string') {
        return true;
      }

      if (['number', 'boolean'].includes(schemaType)) {
        return typeof value === schemaType ? true : errorMsg;
      } else if (['text', 'date', 'time', 'datetime'].includes(schemaType)) {
        return typeof value === 'string' ? true : errorMsg;
      } else if (schemaType === 'select' && inputSettings.multiple) {
        return Array.isArray(value) ? true : errorMsg;
      } else {
        return true;
      }
    }

    try {
      value &&
        parse(value, {
          // mixedMode 值是模版， 要 ${} 包裹表达式
          evalMode: this.props.mixedMode ? false : this.props.evalMode,
          allowFilter: false
        });

      return true;
    } catch (e) {
      if (/\s(\d+:\d+)$/.test(e.message)) {
        const [, position] = /\s(\d+:\d+)$/.exec(e.message) || [];
        return position;
      }
      return e.message;
    }
  }

  render() {
    let {
      classnames: cx,
      translate: __,
      disabled,
      className,
      style,
      onChange,
      size,
      borderMode,
      placeholder,
      mode = 'input-button',
      btnLabel,
      level,
      btnSize,
      icon,
      title,
      clearable,
      functions,
      children,
      variableMode,
      mixedMode,
      evalMode,
      popOverContainer,
      mobileUI,
      inputSettings,
      customInputRender,
      ...rest
    } = this.props;
    const {isOpened, value, editorValue, isError} = this.state;
    const iconElement = <Icon cx={cx} icon={icon} className="Icon" />;

    return (
      <>
        {children ? (
          children({
            isOpened: this.state.isOpened,
            onClick: this.handleClick,
            setState: this.updateState,
            value,
            onChange: this.handleInputChange,
            disabled
          })
        ) : (
          <div
            className={cx(
              'FormulaPicker',
              mode === 'input-group' ? 'is-input-group' : '',
              {
                'FormulaPicker--text': this.isTextInput()
              },
              className
            )}
            style={style}
          >
            {mode === 'button' && (
              <Button
                className={cx('FormulaPicker-action', 'w-full')}
                level={level}
                size={btnSize}
                active={!!value}
                onClick={this.handleClick}
              >
                {iconElement ? (
                  React.cloneElement(iconElement, {
                    className: cx(
                      iconElement?.props?.className ?? '',
                      'FormulaPicker-icon',
                      {
                        ['is-filled']: !!value
                      }
                    )
                  })
                ) : (
                  <Icon
                    icon="function"
                    className={cx('FormulaPicker-icon', 'icon', {
                      ['is-filled']: !!value
                    })}
                  />
                )}
                <span className={cx('FormulaPicker-label')}>
                  {__(btnLabel || 'FormulaEditor.btnLabel')}
                </span>
              </Button>
            )}
            {mode === 'input-button' && (
              <>
                <FormulaInput
                  className={cx(
                    'FormulaPicker-input',
                    isOpened ? 'is-active' : '',
                    !!isError ? 'is-error' : ''
                  )}
                  inputSettings={inputSettings}
                  customInputRender={customInputRender}
                  clearable={clearable}
                  evalMode={mixedMode ? false : evalMode}
                  variables={this.state.variables!}
                  functions={this.state.functions ?? functions}
                  value={value}
                  onChange={this.handleInputChange}
                  disabled={disabled}
                  borderMode={borderMode}
                  placeholder={placeholder}
                />

                <Button
                  className={cx('FormulaPicker-action')}
                  onClick={this.handleClick}
                >
                  <Icon
                    icon="function"
                    className={cx('FormulaPicker-icon', 'icon', {
                      ['is-filled']: !!value
                    })}
                  />
                </Button>
              </>
            )}
            {mode === 'input-group' && (
              <>
                <FormulaInput
                  className={cx(
                    'FormulaPicker-input',
                    isOpened ? 'is-active' : '',
                    !!isError ? 'is-error' : ''
                  )}
                  inputSettings={inputSettings}
                  customInputRender={customInputRender}
                  clearable={clearable}
                  evalMode={mixedMode ? false : evalMode}
                  variables={this.state.variables!}
                  functions={this.state.functions ?? functions}
                  value={value}
                  onChange={this.handleInputChange}
                  disabled={disabled}
                  borderMode={borderMode}
                  placeholder={placeholder}
                />

                <a
                  className={cx(`FormulaPicker-toggler`)}
                  onClick={this.handleClick}
                >
                  <Icon icon="function" className="icon" />
                </a>
              </>
            )}
          </div>
        )}
        {mobileUI ? (
          <PopUp
            className={cx(`FormulaPicker-popup`)}
            isShow={this.state.isOpened}
            showConfirm
            onHide={this.close}
            onConfirm={this.handleEditorConfirm}
            container={popOverContainer}
          >
            <div className={cx('FormulaPicker-popup-inner')}>
              <Editor
                {...rest}
                evalMode={mixedMode ? true : evalMode}
                variables={this.state.variables}
                functions={this.state.functions ?? functions}
                variableMode={this.state.variableMode ?? variableMode}
                value={editorValue}
                onChange={this.handleEditorChange}
                selfVariableName={this.props.selfVariableName}
              />
              {!!isError ? (
                <div className={cx('Dialog-info')} key="info">
                  <span className={cx('Dialog-error')}>
                    {__('FormulaEditor.invalidData', {err: isError})}
                  </span>
                </div>
              ) : null}
            </div>
          </PopUp>
        ) : (
          <Modal
            size="lg"
            closeOnEsc
            show={this.state.isOpened}
            onHide={this.close}
            container={popOverContainer}
          >
            <Modal.Header onClose={this.close} className="font-bold">
              {__(title || 'FormulaEditor.title')}
            </Modal.Header>
            <Modal.Body>
              <Editor
                {...rest}
                evalMode={mixedMode ? true : evalMode}
                variables={this.state.variables}
                functions={this.state.functions ?? functions}
                variableMode={this.state.variableMode ?? variableMode}
                value={editorValue}
                onChange={this.handleEditorChange}
                selfVariableName={this.props.selfVariableName}
              />
            </Modal.Body>
            <Modal.Footer>
              {!!isError ? (
                <div className={cx('Dialog-info')} key="info">
                  <span className={cx('Dialog-error')}>
                    {__('FormulaEditor.invalidData', {err: isError})}
                  </span>
                </div>
              ) : null}
              <Button onClick={this.close}>{__('cancel')}</Button>
              <Button onClick={this.handleEditorConfirm} level="primary">
                {__('confirm')}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(FormulaPicker, {
      value: 'onChange'
    })
  )
);
