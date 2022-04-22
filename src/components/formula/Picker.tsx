import {uncontrollable} from 'uncontrollable';
import React from 'react';
import {FormulaEditor, FormulaEditorProps} from './Editor';
import {autobind, noop} from '../../utils/helper';
import {generateIcon} from '../../utils/icon';
import Editor from './Editor';
import ResultBox from '../ResultBox';
import Button from '../Button';
import {Icon} from '../icons';
import Modal from '../Modal';
import {themeable} from '../../theme';
import {localeable} from '../../locale';
import type {SchemaIcon} from '../../Schema';
import {
  resolveVariableAndFilter,
  isPureVariable
} from '../../utils/tpl-builtin';
import {toast} from '../../components';
import {parse, Evaluator} from 'amis-formula';

export interface FormulaPickerProps extends FormulaEditorProps {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 编辑器标题
   */
  title?: string;

  /**
   * 按钮图标
   */
  icon?: SchemaIcon;

  /**
   * 控件模式
   */
  mode?: 'button' | 'input-button';

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
}

export interface FormulaPickerState {
  isOpened: boolean;
  value: string;
  editorValue: string;
  isError: boolean | string;
}

export class FormulaPicker extends React.Component<
  FormulaPickerProps,
  FormulaPickerState
> {
  static defaultProps = {
    evalMode: true
  };

  state: FormulaPickerState = {
    isOpened: false,
    value: this.props.value,
    editorValue: this.props.value,
    isError: false
  };

  @autobind
  handleConfirm() {
    const value = this.state.value;
    this.props.onChange?.(value);
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
    const validate = this.validate(value);
    if (validate === true) {
      this.setState(
        {
          value,
          isError: false
        },
        () => this.handleConfirm()
      );
    } else {
      this.setState({isError: validate});
    }
  }

  @autobind
  handleEditorChange(value: string) {
    this.setState({
      editorValue: value
    });
  }

  @autobind
  handleEditorConfirm() {
    const {translate: __} = this.props;
    const value = this.state.editorValue;
    const validate = this.validate(value, true);

    if (validate === true) {
      this.setState({value}, () => {
        this.close(undefined, () => this.handleConfirm());
      });
    } else {
      this.setState({isError: validate});
    }
  }

  @autobind
  handleClick() {
    this.setState({
      editorValue: this.props.value,
      isOpened: true
    });
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
  validate(value: string, remind?: boolean) {
    const {translate: __} = this.props;

    try {
      const ast = parse(value, {
        evalMode: this.props.evalMode,
        allowFilter: false
      });

      new Evaluator({}).evalute(ast);

      return true;
    } catch (e) {
      const [, position] = /\s(\d+:\d+)$/.exec(e.message) || [];
      remind &&
        toast.error(
          __('FormulaEditor.invalidData', {position: position || '-'})
        );
      return position;
    }
  }

  render() {
    let {
      classnames: cx,
      translate: __,
      disabled,
      allowInput,
      className,
      onChange,
      size,
      borderMode,
      placeholder,
      mode,
      btnLabel,
      level,
      btnSize,
      icon,
      title,
      clearable,
      variables,
      functions,
      ...rest
    } = this.props;
    const {isOpened, value, editorValue, isError} = this.state;

    if (isPureVariable(variables)) {
      // 如果 variables 是 ${xxx} 这种形式，将其处理成实际的值
      variables = resolveVariableAndFilter(variables, this.props.data, '| raw');
    }

    if (isPureVariable(functions)) {
      // 如果 functions 是 ${xxx} 这种形式，将其处理成实际的值
      functions = resolveVariableAndFilter(functions, this.props.data, '| raw');
    }
    const iconElement = generateIcon(cx, icon, 'Icon');

    return (
      <>
        <div className={cx('FormulaPicker', className)}>
          {mode === 'button' ? (
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
          ) : (
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
                        variables,
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
        </div>
        {!!isError ? (
          <ul className={cx('Form-feedback')}>
            <li>{__('FormulaEditor.invalidData', {position: isError})}</li>
          </ul>
        ) : null}
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
              variables={variables}
              functions={functions}
              value={editorValue}
              onChange={this.handleEditorChange}
            />
          </Modal.Body>
          <Modal.Footer>
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
