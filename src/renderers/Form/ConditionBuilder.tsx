import React from 'react';
import {FormItem, FormControlProps} from './Item';
import ColorPicker from '../../components/ColorPicker';
import {Funcs, Fields} from '../../components/condition-builder/types';
import {Config} from '../../components/condition-builder/config';
import ConditionBuilder from '../../components/condition-builder/index';

export interface ConditionBuilderProps extends FormControlProps {
  funcs?: Funcs;
  fields: Fields;
  config?: Config;
}

export default class ConditionBuilderControl extends React.PureComponent<
  ConditionBuilderProps
> {
  render() {
    const {className, classnames: cx, ...rest} = this.props;

    return (
      <div className={cx(`ConditionBuilderControl`, className)}>
        <ConditionBuilder {...rest} />
      </div>
    );
  }
}

@FormItem({
  type: 'condition-builder'
})
export class ConditionBuilderRenderer extends ConditionBuilderControl {}
