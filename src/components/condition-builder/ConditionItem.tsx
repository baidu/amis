import React from 'react';
import {Fields, ConditionRule, ConditionGroupValue} from './types';
import {ClassNamesFn} from '../../theme';
import {Icon} from '../icons';
import Select from '../Select';
import {autobind} from '../../utils/helper';
import PopOverContainer from '../PopOverContainer';
import InputBox from '../InputBox';
import ListRadios from '../ListRadios';
import ResultBox from '../ResultBox';

export interface ConditionItemProps {
  fields: Fields;
  value: ConditionRule;
  classnames: ClassNamesFn;
  onChange: (value: ConditionRule) => void;
}

export class ConditionItem extends React.Component<ConditionItemProps> {
  @autobind
  handleLeftSelect() {}

  renderLeft() {
    const {value, fields} = this.props;

    return (
      <PopOverContainer
        popOverRender={({onClose}) => (
          <ListRadios showRadio={false} options={fields} onChange={onClose} />
        )}
      >
        {({onClick, ref}) => (
          <ResultBox
            ref={ref}
            allowInput={false}
            onResultClick={onClick}
            placeholder="请选择"
          />
        )}
      </PopOverContainer>
    );
  }

  renderItem() {
    return null;
  }

  render() {
    const {classnames: cx} = this.props;

    return (
      <div className={cx('CBGroup-item')}>
        <a>
          <Icon icon="drag-bar" className="icon" />
        </a>

        <div className={cx('CBGroup-itemBody')}>
          {this.renderLeft()}
          {this.renderItem()}
        </div>
      </div>
    );
  }
}
