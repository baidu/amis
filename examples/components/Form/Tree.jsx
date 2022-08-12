const options = [...new Array(1000)].map((item, index) => {
  const value = `${10000 + index * 3}`;
  return {
    value: value,
    label: value
  };
});

export default {
  type: 'form',
  body: {
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
    initiallyOpen: false
  }
};
