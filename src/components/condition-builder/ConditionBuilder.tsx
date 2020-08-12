import React from 'react';
import {ThemeProps, themeable} from '../../theme';
import {LocaleProps, localeable} from '../../locale';
import {uncontrollable} from 'uncontrollable';
import {FieldTypes, FieldItem} from './types';

export interface QueryBuilderProps extends ThemeProps, LocaleProps {
  fields: Array<FieldItem>;
}

export class QueryBuilder extends React.Component<QueryBuilderProps> {
  render() {
    return <p>this is querybuilder component</p>;
  }
}

export default themeable(
  localeable(
    uncontrollable(QueryBuilder, {
      value: 'onChange'
    })
  )
);
