import React from 'react';
import {FormItem, FormControlProps} from 'amis-core';
import {ComboStore, IComboStore} from 'amis-core';
import Combo, {ComboControlSchema} from './Combo';
import {SchemaCollection} from '../../Schema';

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

  /**
   * 新增成员时的默认值
   */
  scaffold?: any;
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
    return this.comboInstance ? this.comboInstance.validate() : null;
  }

  render() {
    const {items, scaffold, ...rest} = this.props;
    // 传入多个元素时只接受首个元素，因为input-array相当于打平的combo
    const normalizedItems = Array.isArray(items)
      ? items.length > 1
        ? items.slice(0, 1)
        : items
      : items != null
      ? [items]
      : [];

    return (
      <Combo
        {...(rest as any)}
        scaffold={scaffold}
        items={normalizedItems}
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
