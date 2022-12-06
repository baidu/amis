const renderOptions = (n, callback) => {
  return [...new Array(n)].map((item, index) => callback(index));
};

const options = renderOptions(1000, index => {
  const value = `${10000 + index * 3}`;

  return {
    value: value,
    label: value,
    children:
      index % 10 === 0
        ? renderOptions(20, i => {
            return {
              value: `value-${value}-${i}`,
              label: `label-${value}-${i}`
            };
          })
        : undefined
  };
});

export default {
  type: 'form',
  body: [
    {
      // type: 'input-tree',
      type: 'tree-select',
      // "type": "nested-select",
      name: 'output_fields',
      label: '输出字段',
      description: '输出字段中的制表符会转换为"\\t",换行符会转换为"\
    "',
      mode: 'horizontal',
      multiple: true,
      required: true,
      clearable: true,
      withChildren: true,
      extractValue: true,
      joinValues: true,
      cascade: true,
      borderMode: 'full',
      searchable: true,
      options: options,
      initiallyOpen: false,
      draggable: true
    },
    {
      label: '选项',
      type: 'select',
      name: 'select',
      searchable: true,
      multiple: true,
      menuTpl: '<div>${label} 值：${value}, 当前是否选中: ${checked}</div>',
      options: options
    }
  ]
};
