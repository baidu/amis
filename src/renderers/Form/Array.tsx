import React from 'react';
import {FormItem, FormControlProps} from './Item';
import {Schema} from '../../types';
import {ComboStore, IComboStore} from '../../store/combo';
import {observer} from 'mobx-react';
import Combo from './Combo';

export interface ArrayProps extends FormControlProps {
  placeholder?: string;
  controls: Array<Schema>;
  minLength?: number;
  maxLength?: number;
  addButtonClassName?: string;
  items: Schema & {
    unique?: boolean;
  };
  store: IComboStore;
}

export default class ArrayControl extends React.Component<ArrayProps> {
  comboInstance: any;
  constructor(props: ArrayProps) {
    super(props);
    this.comboRef = this.comboRef.bind(this);
  }

  comboRef(ref: any) {
    this.comboInstance = ref;
  }

  validate(args: Array<any>) {
    return this.comboInstance ? this.comboInstance.validate(...args) : null;
  }

  render() {
    const {items, ...rest} = this.props;

    return (
      <Combo
        {...rest}
        controls={[items]}
        flat
        multiple
        multiLine={false}
        ref={this.comboRef}
      />
    );
  }
}

@FormItem({
  type: 'array',
  storeType: ComboStore.name
})
export class ArrayControlRenderer extends ArrayControl {}
