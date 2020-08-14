import React from 'react';
import PopOverContainer from '../PopOverContainer';
import {Icon} from '../icons';
import ListRadios from '../ListRadios';
import {ClassNamesFn} from '../../theme';

export interface InputSwitchProps {
  options: Array<any>;
  value: any;
  onChange: (value: any) => void;
  classnames: ClassNamesFn;
}

const option2value = (item: any) => item.value;

export default function InputSwitch({
  options,
  value,
  onChange,
  classnames: cx
}: InputSwitchProps) {
  return (
    <PopOverContainer
      popOverRender={({onClose}) => (
        <ListRadios
          onClick={onClose}
          option2value={option2value}
          onChange={onChange}
          options={options}
          value={value}
          showRadio={false}
        />
      )}
    >
      {({onClick, isOpened, ref}) => (
        <div className={cx('CBInputSwitch', isOpened ? 'is-active' : '')}>
          <a onClick={onClick} ref={ref}>
            <Icon icon="setting" />
          </a>
        </div>
      )}
    </PopOverContainer>
  );
}
