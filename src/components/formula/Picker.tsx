import {uncontrollable} from 'uncontrollable';
import React from 'react';
import {FormulaEditor, FormulaEditorProps} from './Editor';
import {autobind, noop} from '../../utils/helper';
import {generateIcon} from '../../utils/icon';
import PickerContainer from '../PickerContainer';
import Editor from './Editor';
import ResultBox from '../ResultBox';
import Button from '../Button';
import {Icon} from '../icons';
import {themeable} from '../../theme';
import {localeable} from '../../locale';

import type {SchemaIcon} from '../../Schema';
import {
  resolveVariableAndFilter,
  isPureVariable
} from '../../utils/tpl-builtin';

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

export class FormulaPicker extends React.Component<FormulaPickerProps> {
  @autobind
  handleConfirm(value: any) {
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

  render() {
    let {
      classnames: cx,
      value,
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
      <PickerContainer
        title={__(title || 'FormulaEditor.title')}
        headerClassName="font-bold"
        bodyRender={({onClose, value, onChange}) => {
          return (
            <Editor
              {...rest}
              variables={variables}
              functions={functions}
              value={value}
              onChange={onChange}
            />
          );
        }}
        value={value}
        onConfirm={this.handleConfirm}
        size={'md'}
      >
        {({onClick, isOpened}) => (
          <div className={cx('FormulaPicker', className)}>
            {mode === 'button' ? (
              <Button
                className={cx('FormulaPicker-action', 'w-full')}
                level={level}
                size={btnSize}
                onClick={onClick}
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
                    isOpened ? 'is-active' : ''
                  )}
                  allowInput={allowInput}
                  clearable={clearable}
                  value={value}
                  result={FormulaEditor.highlightValue(
                    value,
                    variables,
                    functions
                  )}
                  itemRender={this.renderFormulaValue}
                  onResultChange={noop}
                  onChange={this.handleConfirm}
                  disabled={disabled}
                  borderMode={borderMode}
                  placeholder={placeholder}
                />

                <Button
                  className={cx('FormulaPicker-action')}
                  onClick={onClick}
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
        )}
      </PickerContainer>
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
