export default {
  definitions: {
    aa: {
      type: 'text',
      name: 'jack',
      value: 'ref value',
      remark: '通过<code>\\$ref</code>引入的组件'
    },
    bb: {
      type: 'combo',
      multiple: true,
      multiLine: true,
      remark: '<code>combo</code>中的子项引入自身，实现嵌套的效果',
      controls: [
        {
          label: 'combo 1',
          type: 'text',
          name: 'key'
        },
        {
          label: 'combo 2',
          name: 'value',
          $ref: 'aa'
        },
        {
          name: 'children',
          label: 'children',
          $ref: 'bb'
        }
      ]
    }
  },
  type: 'page',
  title: '引用',
  body: [
    {
      type: 'form',
      api: 'api/xxx',
      actions: [],
      controls: [
        {
          label: 'text2',
          $ref: 'aa',
          name: 'ref1'
        },
        {
          label: 'combo',
          $ref: 'bb',
          name: 'ref2'
        }
      ]
    }
  ]
};
