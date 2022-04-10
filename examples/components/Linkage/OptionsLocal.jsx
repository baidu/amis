export default {
  type: 'page',
  title: '表单选线的联动',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    actions: [],
    body: [
      '<p class="text-danger">表单选项内也能联动，通过配置 visibleOn、hiddenOn或者disabledOn</p>',
      {
        type: 'divider'
      },

      {
        label: '选项1',
        type: 'list-select',
        multiple: false,
        labelClassName: 'text-muted',
        name: 'a',
        inline: true,
        options: [
          {
            label: '选项1',
            value: 1
          },

          {
            label: '选项2',
            value: 2
          },

          {
            label: '选项3',
            value: 3
          }
        ]
      },

      {
        label: '选项2',
        type: 'radios',
        labelClassName: 'text-muted',
        name: 'b',
        inline: true,
        options: [
          {
            label: '选项1',
            value: 1,
            disabledOn: 'data.a == 1'
          },

          {
            label: '选项2',
            value: 2,
            hiddenOn: 'data.a == 2'
          },

          {
            label: '选项3',
            value: 3,
            visibleOn: 'data.a == 3'
          }
        ]
      }
    ]
  }
};
