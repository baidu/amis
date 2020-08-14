import React from 'react';
import {ThemeProps, themeable} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import {uncontrollable} from 'uncontrollable';
import {Fields, ConditionGroupValue, Funcs} from './types';
import {ConditionGroup} from './Group';

export interface QueryBuilderProps extends ThemeProps, LocaleProps {
  fields: Fields;
  funcs?: Funcs;
  value?: ConditionGroupValue;
  onChange: (value: ConditionGroupValue) => void;
}

export class QueryBuilder extends React.Component<QueryBuilderProps> {
  render() {
    const {classnames: cx, fields, funcs, onChange, value} = this.props;

    return (
      <ConditionGroup
        funcs={funcs}
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
