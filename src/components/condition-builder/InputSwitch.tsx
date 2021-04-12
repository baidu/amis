import React from 'react';
import PopOverContainer from '../PopOverContainer';
import {Icon} from '../icons';
import ListRadios from '../ListRadios';
import {ClassNamesFn, themeable, ThemeProps} from '../../theme';

export interface InputSwitchProps extends ThemeProps {
  options: Array<any>;
  disabled?: boolean;
  value: any;
  onChange: (value: any) => void;
}

const option2value = (item: any) => item.value;

export function InputSwitch({
  options,
  value,
  onChange,
  classnames: cx,
  disabled
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
          disabled={disabled}
        />
      )}
    >
      {({onClick, isOpened, ref}) => (
        <div className={cx('CBInputSwitch', isOpened ? 'is-active' : '')}>
          <a onClick={onClick} ref={ref}>
            <Icon icon="ellipsis-v" />
          </a>
        </div>
      )}
    </PopOverContainer>
  );
}

export default themeable(InputSwitch);
