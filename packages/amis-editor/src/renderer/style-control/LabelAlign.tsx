import {FormControlProps, FormItem} from 'amis-core';
import {Select} from 'amis-ui';
import React from 'react';

const LabelAlign: React.FC<FormControlProps> = props => {
  const store = props.manager.store;
  const node = store.getNodeById(store.activeId);
  const parent = store.getNodeById(node.parentId);
  const parentMode = parent?.schema?.mode;

  function handleSizeChange(res: any) {
    const value = res.value;
    if (!value) {
      return;
    }
    props.onChange(value);
    if (parentMode !== 'flex') {
      // 历史包袱，只能改变mode
      if (value === 'inherit') {
        props.setValue(undefined, 'mode');
      } else if (value !== 'top') {
        props.setValue('horizontal', 'mode');
      } else {
        props.setValue('normal', 'mode');
      }
    }
  }

  return (
    <Select
      className=":LabelAlign"
      value={props.value || 'inherit'}
      onChange={handleSizeChange}
      clearable={false}
      options={[
        {
          label: '继承',
          value: 'inherit'
        },
        {
          label: '上下布局',
          value: 'top'
        },
        {
          label: '水平居左',
          value: 'left'
        },
        {
          label: '水平居右',
          value: 'right'
        }
      ]}
    />
  );
};

@FormItem({type: 'label-align', strictMode: false})
export class LabelAlignRenderer extends React.Component<FormControlProps> {
  render() {
    return <LabelAlign {...this.props} />;
  }
}
