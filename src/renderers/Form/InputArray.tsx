import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import {Schema} from '../../types';
import {ComboStore, IComboStore} from '../../store/combo';
import {observer} from 'mobx-react';
import Combo, {ComboControlSchema} from './Combo';
import {SchemaApi, SchemaCollection, SchemaObject} from '../../Schema';

/**
 * InputArray 数组输入框。 combo 的别名。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/array
 */
export interface ArrayControlSchema
  extends Omit<
    ComboControlSchema,
    'type' | 'controls' | 'conditions' | 'items'
  > {
  /**
   * 指定为数组输入框类型
   */
  type: 'input-array';

  /**
   * 成员渲染器配置
   */
  items: SchemaCollection;
}

export interface InputArrayProps
  extends FormControlProps,
    Omit<
      ArrayControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  store: IComboStore;
}

export default class InputArrayControl extends React.Component<InputArrayProps> {
  comboInstance: any;
  constructor(props: InputArrayProps) {
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
        items={[items]}
        flat
        multiple
        multiLine={false}
        ref={this.comboRef}
      />
    );
  }
}

@FormItem({
  type: 'input-array',
  storeType: ComboStore.name
})
export class ArrayControlRenderer extends InputArrayControl {}
