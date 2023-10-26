import {
  isExpression,
  resolveVariableAndFilterForAsync,
  uncontrollable
} from 'amis-core';
import React from 'react';
import {
  FormulaEditor,
  FormulaEditorProps,
  FuncGroup,
  VariableItem
} from './Editor';
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

export const InputSchemaType = [
  'text',
  'number',
  'boolean',
  'date',
  'time',
  'datetime',
  'select'
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
   * 是否允许输入，否需要点击fx在弹窗中输入
   */
  allowInput?: boolean;

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
   * 公式弹出的时候，可以外部设置 variables 和 functions
   */
  onPickerOpen?: (props: FormulaPickerProps) => any;

  children?: (props: {
    onClick: (e: React.MouseEvent) => void;
    setState: (state: any) => void;
    isOpened: boolean;
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

  componentDidUpdate(prevProps: FormulaPickerProps) {
    const {value} = this.props;

    if (value !== prevProps.value) {
      this.setState({
        value: typeof value === 'string' || !this.isTextInput() ? value : '',
        editorValue: this.value2EditorValue(this.props)
      });
    }
  }

  value2EditorValue(props: FormulaPickerProps) {
    const {value} = props;

    if (!this.isTextInput()) {
      let editorValue = '';

      try {
        editorValue = JSON.stringify(value);
      } catch (error) {}

      return editorValue;
    }

    if (props.mixedMode) {
      if (
        typeof props.value === 'string' &&
        /^\s*\$\{(.+?)\}\s*$/.test(props.value)
      ) {
        return RegExp.$1;
      } else {
        return '';
      }
    }

    return String(props.value || '');
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
  renderFormulaValue(item: any) {
    const {allowInput, classnames: cx} = this.props;
    const html = {__html: item.html};
    if (allowInput) {
      return '';
    }

    return (
      <div
        className={cx('FormulaPicker-ResultBox')}
        dangerouslySetInnerHTML={html}
      ></div>
    );
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

    if (this.isTextInput()) {
      return this.confirm(editorValue);
    } else if (inputSettings) {
      let result = editorValue;
      const schemaType = inputSettings?.type;

      try {
        const ast = parse(editorValue, {evalMode: true, allowFilter: false});

        if (
          schemaType === 'select' &&
          inputSettings.multiple &&
          ast.type === 'array'
        ) {
          result = ast.members.map((i: any) => i.value);
        } else if (ast.type === 'literal' || ast.type === 'string') {
          result = ast.value ?? '';
        }
      } catch (error) {
        this.setState({isError: error?.message ?? true});
        return;
      }

      this.setState({isError: false});
      return this.confirm(result);
    }
  }

  confirm(value: string) {
    const {mixedMode} = this.props;
    const validate = this.validate(value);

    if (validate === true) {
      this.setState(
        {value: mixedMode && value ? `\${${value}}` : value},
        () => {
          this.close(undefined, () => this.handleConfirm());
        }
      );
    } else {
      this.setState({isError: validate});
    }
  }

  @autobind
  async handleClick() {
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

    const state = {
      ...(await this.props.onPickerOpen?.(this.props)),
      editorValue: this.value2EditorValue(this.props),
      isOpened: true
    };

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
          evalMode: this.props.mixedMode ? true : this.props.evalMode,
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
      allowInput = true,
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
            setState: this.updateState
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
                <ResultBox
                  className={cx(
                    'FormulaPicker-input',
                    isOpened ? 'is-active' : '',
                    !!isError ? 'is-error' : ''
                  )}
                  allowInput={allowInput}
                  clearable={clearable}
                  value={value}
                  result={
                    allowInput
                      ? void 0
                      : FormulaEditor.highlightValue(
                          value,
                          this.state.variables!,
                          this.props.evalMode
                        )
                  }
                  itemRender={this.renderFormulaValue}
                  onResultChange={noop}
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
                  allowInput={allowInput}
                  clearable={clearable}
                  evalMode={evalMode}
                  mixedMode={mixedMode}
                  variables={this.state.variables!}
                  value={value}
                  itemRender={this.renderFormulaValue}
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
