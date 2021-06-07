export default {
  title: '表单验证示例',
  toolbar: "<a target='_blank' href='/docs/renderers/Form/FormItem'>文档</a>",
  body: [
    {
      type: 'form',
      autoFocus: false,
      messages: {
        validateFailed: '请仔细检查表单规则，部分表单项没通过验证'
      },
      title: '表单',
      actions: [
        {
          type: 'submit',
          label: '提交'
        }
      ],
      api: '/api/mock2/form/saveFormFailed?waitSeconds=2',
      mode: 'horizontal',
      body: [
        {
          type: 'input-text',
          name: 'test',
          label: '必填',
          required: true
        },
        {
          type: 'divider'
        },
        {
          name: 'test1',
          type: 'input-email',
          label: 'Email'
        },
        {
          type: 'divider'
        },
        {
          name: 'url',
          type: 'input-url',
          label: 'URL'
        },
        {
          type: 'divider'
        },
        {
          name: 'num',
          type: 'input-text',
          label: '数字',
          validations: 'isNumeric'
        },
        {
          type: 'divider'
        },
        {
          name: 'alpha',
          type: 'input-text',
          label: '字母或数字',
          validations: 'isAlphanumeric'
        },
        {
          type: 'divider'
        },
        {
          name: 'int',
          type: 'input-text',
          label: '整形',
          validations: 'isInt'
        },
        {
          type: 'divider'
        },
        {
          name: 'minLength',
          type: 'input-text',
          label: '长度限制',
          validations: 'minLength:2,maxLength:10'
        },
        {
          type: 'divider'
        },
        {
          name: 'min',
          type: 'input-text',
          label: '数值限制',
          validations: 'maximum:10,minimum:2'
        },
        {
          type: 'divider'
        },
        {
          name: 'reg',
          type: 'input-text',
          label: '正则',
          validations: 'matchRegexp:/^abc/',
          validationErrors: {
            matchRegexp: '请输入abc开头的好么?'
          }
        },
        {
          type: 'divider'
        },
        {
          name: 'test2',
          type: 'input-text',
          label: '服务端验证'
        }
      ]
    }
  ]
};
