import {uncontrollable} from 'amis-core';
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
  generateIcon,
  themeable,
  localeable,
  parse,
  Evaluator
} from 'amis-core';
import Editor from './Editor';
import ResultBox from '../ResultBox';
import Button from '../Button';
import {Icon} from '../icons';
import Modal from '../Modal';
import Input from '../Input';

export interface FormulaPickerProps extends FormulaEditorProps {
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
}

export interface FormulaPickerState {
  isOpened: boolean;
  value: string;
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
      isError: false
    };
  }

  componentDidUpdate(prevProps: FormulaPickerProps) {
    const value = this.props.value;
    if (typeof value !== 'undefined' && value !== prevProps.value) {
      this.setState({
        value,
        editorValue: this.value2EditorValue(this.props)
      });
    }
  }

  value2EditorValue(props: FormulaPickerProps) {
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
    const {translate: __} = this.props;
    const value = this.state.editorValue;
    this.confirm(value);
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
    const {translate: __} = this.props;

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
      variables,
      functions,
      children,
      variableMode,
      mixedMode,
      evalMode,
      ...rest
    } = this.props;
    const {isOpened, value, editorValue, isError} = this.state;
    const iconElement = generateIcon(cx, icon, 'Icon');

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
              className,
              mode === 'input-group' ? 'is-input-group' : ''
            )}
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
                          variables!,
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
                          variables!,
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
        <Modal
          size="md"
          closeOnEsc
          show={this.state.isOpened}
          onHide={this.close}
        >
          <Modal.Header onClose={this.close} className="font-bold">
            {__(title || 'FormulaEditor.title')}
          </Modal.Header>
          <Modal.Body>
            <Editor
              {...rest}
              evalMode={mixedMode ? true : evalMode}
              variables={this.state.variables ?? variables}
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
