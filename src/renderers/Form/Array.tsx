import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  FormControlSchema
} from './Item';
import {Schema} from '../../types';
import {ComboStore, IComboStore} from '../../store/combo';
import {observer} from 'mobx-react';
import Combo, {ComboControlSchema} from './Combo';
import {SchemaApi} from '../../Schema';

/**
 * Array 数组输入框。 combo 的别名。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/array
 */
export interface ArrayControlSchema
  extends Omit<ComboControlSchema, 'type' | 'controls' | 'conditions'> {
  /**
   * 指定为数组输入框类型
   */
  type: 'array';

  /**
   * 成员渲染器配置
   */
  items: FormControlSchema & {
    unique?: boolean;
  };
}

export interface ArrayProps extends FormControlProps, ArrayControlSchema {
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
        {...(rest as any)}
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
