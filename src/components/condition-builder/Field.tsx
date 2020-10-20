import React from 'react';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';
import {ClassNamesFn, ThemeProps, themeable} from '../../theme';
import {Icon} from '../icons';
import {findTree, noop} from '../../utils/helper';

export interface ConditionFieldProps extends ThemeProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
}

const option2value = (item: any) => item.name;

export function ConditionField({
  options,
  onChange,
  value,
  classnames: cx
}: ConditionFieldProps) {
  return (
    <PopOverContainer
      popOverRender={({onClose}) => (
        <ListRadios
          onClick={onClose}
          showRadio={false}
          options={options}
          value={value}
          option2value={option2value}
          onChange={onChange}
        />
      )}
    >
      {({onClick, ref, isOpened}) => (
        <div className={cx('CBGroup-field')}>
          <ResultBox
            className={cx('CBGroup-fieldInput', isOpened ? 'is-active' : '')}
            ref={ref}
            allowInput={false}
            result={
              value ? findTree(options, item => item.name === value)?.label : ''
            }
            onResultChange={noop}
            onResultClick={onClick}
            placeholder="请选择字段"
          >
            <span className={cx('CBGroup-fieldCaret')}>
              <Icon icon="caret" className="icon" />
            </span>
          </ResultBox>
        </div>
      )}
    </PopOverContainer>
  );
}

export default themeable(ConditionField);
