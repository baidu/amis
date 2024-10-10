import React from 'react';
import PopOverContainer from '../PopOverContainer';
import {Icon} from '../icons';
import GroupedSelection from '../GroupedSelection';
import {themeable, ThemeProps} from 'amis-core';
import type {TestIdBuilder} from 'amis-core';

export interface InputSwitchProps extends ThemeProps {
  options: Array<any>;
  disabled?: boolean;
  popOverContainer?: any;
  value: any;
  onChange: (value: any) => void;
  testIdBuilder?: TestIdBuilder;
}

const option2value = (item: any) => item.value;

export function InputSwitch({
  options,
  value,
  onChange,
  classnames: cx,
  disabled,
  popOverContainer,
  testIdBuilder
}: InputSwitchProps) {
  return (
    <PopOverContainer
      popOverContainer={popOverContainer}
      popOverRender={({onClose}) => (
        <GroupedSelection
          onClick={onClose}
          option2value={option2value}
          onChange={onChange}
          options={options}
          value={value}
          multiple={false}
          disabled={disabled}
          testIdBuilder={testIdBuilder?.getChild('group')}
        />
      )}
    >
      {({onClick, isOpened, ref}) => (
        <div
          className={cx('CBInputSwitch', isOpened ? 'is-active' : '')}
          {...testIdBuilder?.getTestId()}
        >
          <a onClick={onClick} ref={ref}>
            <Icon icon="ellipsis-v" />
          </a>
        </div>
      )}
    </PopOverContainer>
  );
}

export default themeable(InputSwitch);
