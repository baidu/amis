import React from 'react';
import {Fields, ConditionRule, ConditionGroupValue} from './types';

export interface ConditionItemProps {
  fields: Fields;
  value: ConditionRule | ConditionGroupValue;
}

export class ConditionItem extends React.Component<ConditionItemProps> {
  render() {
    return <p>233</p>;
  }
}
