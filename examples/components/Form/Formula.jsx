export default {
  title: '公式示例',
  body: [
    '<p>通过公式，可以动态的设置目标值。</p>',
    {
      type: 'form',
      title: '自动应用',
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'input-number',
          name: 'a',
          label: 'A'
        },

        {
          type: 'input-number',
          name: 'b',
          label: 'B'
        },

        {
          type: 'input-number',
          name: 'sum',
          label: '和',
          disabled: true,
          description: '自动计算 A + B'
        },

        {
          type: 'formula',
          name: 'sum',
          value: 0,
          formula: 'a + b'
        }
      ]
    },

    {
      type: 'form',
      title: '手动应用',
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'input-number',
          name: 'a',
          label: 'A'
        },

        {
          type: 'input-number',
          name: 'b',
          label: 'B'
        },

        {
          type: 'group',
          body: [
            {
              type: 'input-number',
              name: 'sum',
              label: '和',
              disabled: true,
              columnClassName: 'col-sm-11'
            },

            {
              type: 'button',
              label: '计算',
              columnClassName: 'col-sm-1 v-bottom',
              target: 'theFormula'
            }
          ]
        },

        {
          type: 'formula',
          name: 'sum',
          id: 'theFormula',
          value: 0,
          formula: 'a + b',
          initSet: false,
          autoSet: false
        }
      ]
    },
    {
      type: 'form',
      title: '条件应用',
      api: '/api/mock2/form/saveForm',
      body: [
        {
          type: 'radios',
          name: 'radios',
          inline: true,
          label: 'radios',
          options: [
            {
              label: 'a',
              value: 'a'
            },
            {
              label: 'b',
              value: 'b'
            }
          ],
          description: 'radios 变化会自动清空 B'
        },
        {
          type: 'input-text',
          name: 'b',
          label: 'B'
        },

        {
          type: 'formula',
          name: 'b',
          value: 'some string',
          formula: "''",
          condition: '${radios}',
          initSet: false
        }
      ]
    }
  ]
};
