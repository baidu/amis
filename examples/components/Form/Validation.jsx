export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
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
      controls: [
        {
          type: 'text',
          name: 'test',
          label: '必填',
          required: true
        },
        {
          type: 'divider'
        },
        {
          name: 'test1',
          type: 'email',
          label: 'Email'
        },
        {
          type: 'divider'
        },
        {
          name: 'url',
          type: 'url',
          label: 'URL'
        },
        {
          type: 'divider'
        },
        {
          name: 'num',
          type: 'text',
          label: '数字',
          validations: 'isNumeric'
        },
        {
          type: 'divider'
        },
        {
          name: 'alpha',
          type: 'text',
          label: '字母或数字',
          validations: 'isAlphanumeric'
        },
        {
          type: 'divider'
        },
        {
          name: 'int',
          type: 'text',
          label: '整形',
          validations: 'isInt'
        },
        {
          type: 'divider'
        },
        {
          name: 'minLength',
          type: 'text',
          label: '长度限制',
          validations: 'minLength:2,maxLength:10'
        },
        {
          type: 'divider'
        },
        {
          name: 'min',
          type: 'text',
          label: '数值限制',
          validations: 'maximum:10,minimum:2'
        },
        {
          type: 'divider'
        },
        {
          name: 'reg',
          type: 'text',
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
          type: 'text',
          label: '服务端验证'
        }
      ]
    }
  ]
};
