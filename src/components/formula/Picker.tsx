import {uncontrollable} from 'uncontrollable';
import React from 'react';
import {FormulaEditor, FormulaEditorProps} from './Editor';
import {autobind, noop} from '../../utils/helper';
import PickerContainer from '../PickerContainer';
import Editor from './Editor';
import ResultBox from '../ResultBox';
import {Icon} from '../icons';
import {themeable} from '../../theme';
import {localeable} from '../../locale';

export interface FormulaPickerProps extends FormulaEditorProps {
  // 新的属性？
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * 边框模式，全边框，还是半边框，或者没边框。
   */
  borderMode?: 'full' | 'half' | 'none';

  disabled?: boolean;
}

export class FormulaPicker extends React.Component<FormulaPickerProps> {
  @autobind
  handleConfirm(value: any) {
    this.props.onChange?.(value);
  }

  render() {
    const {
      classnames: cx,
      value,
      translate: __,
      disabled,
      className,
      onChange,
      size,
      borderMode,
      ...rest
    } = this.props;

    return (
      <PickerContainer
        showTitle={false}
        bodyRender={({onClose, value, onChange}) => {
          return <Editor {...rest} value={value} onChange={onChange} />;
        }}
        value={value}
        onConfirm={this.handleConfirm}
        size={'md'}
      >
        {({onClick, isOpened}) => (
          <ResultBox
            className={cx(
              'FormulaPicker',
              className,
              isOpened ? 'is-active' : ''
            )}
            allowInput={false}
            result={FormulaEditor.highlightValue(
              value,
              rest.variables,
              rest.functions
            )}
            onResultChange={noop}
            onResultClick={onClick}
            disabled={disabled}
            borderMode={borderMode}
          >
            <span className={cx('FormulaPicker-icon')}>
              <Icon icon="pencil" className="icon" />
            </span>
          </ResultBox>
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
