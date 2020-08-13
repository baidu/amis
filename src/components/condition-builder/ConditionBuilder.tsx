import React from 'react';
import {ThemeProps, themeable} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import {uncontrollable} from 'uncontrollable';
import {Fields, ConditionGroupValue} from './types';
import {ConditionGroup} from './ConditionGroup';

export interface QueryBuilderProps extends ThemeProps, LocaleProps {
  fields: Fields;
  value?: ConditionGroupValue;
  onChange: (value: ConditionGroupValue) => void;
}

export class QueryBuilder extends React.Component<QueryBuilderProps> {
  render() {
    const {classnames: cx, fields, onChange, value} = this.props;

    return (
      <ConditionGroup
        fields={fields}
        value={value}
        onChange={onChange}
        classnames={cx}
        removeable={false}
      />
    );
  }
}

export default themeable(
  localeable(
    uncontrollable(QueryBuilder, {
      value: 'onChange'
    })
  )
);
