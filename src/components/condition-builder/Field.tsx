import React from 'react';
import PopOverContainer from '../PopOverContainer';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';
import {ClassNamesFn} from '../../theme';
import {Icon} from '../icons';
import {find} from 'lodash';
import {findTree, noop} from '../../utils/helper';

export interface ConditionFieldProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  classnames: ClassNamesFn;
}

const option2value = (item: any) => item.name;

export default function ConditionField({
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
