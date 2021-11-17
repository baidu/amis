import React from 'react';
import {localeable} from '../locale';
import {themeable} from '../theme';
import {AssociatedCheckboxesProps} from './AssociatedSelection';
import {Icon} from './icons';
import PopOverContainer from './PopOverContainer';
import ResultBox from './ResultBox';
import {uncontrollable} from 'uncontrollable';

export interface AssociatedSelectProps extends AssociatedCheckboxesProps {}

export function AssociatedSelect({classnames: cx}: AssociatedSelectProps) {
  function renderPopOver() {
    return <p>233</p>;
  }

  return (
    <PopOverContainer popOverRender={renderPopOver}>
      {({onClick}) => {
        return (
          <ResultBox onResultClick={onClick}>
            <span className={cx('AssociatedSelect-caret')}>
              <Icon icon="caret" className="icon" />
            </span>
          </ResultBox>
        );
      }}
    </PopOverContainer>
  );
}

export default themeable(
  localeable(
    uncontrollable(AssociatedSelect, {
      value: 'onChange'
    })
  )
);
