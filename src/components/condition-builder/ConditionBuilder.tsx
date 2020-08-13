import React from 'react';
import {ThemeProps, themeable} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import {uncontrollable} from 'uncontrollable';
import {FieldTypes, FieldItem, Fields} from './types';
import {ConditionGroup} from './ConditionGroup';

export interface QueryBuilderProps extends ThemeProps, LocaleProps {
  fields: Fields;
}

export class QueryBuilder extends React.Component<QueryBuilderProps> {
  render() {
    const {classnames: cx, fields} = this.props;

    return <ConditionGroup fields={fields} value={undefined} classnames={cx} />;
  }
}

export default themeable(
  localeable(
    uncontrollable(QueryBuilder, {
      value: 'onChange'
    })
  )
);
