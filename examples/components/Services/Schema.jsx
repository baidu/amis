export default {
  type: 'page',
  title: '动态加载页面',
  body: [
    '<span class="text-danger">可以通过 <code>service</code>的<code>schemaApi</code> 动态控制内容。</span>',

    {
      type: 'form',
      title: '条件输入',
      panelClassName: 'panel-info m-t',
      target: 'service1',
      mode: 'inline',
      submitOnInit: true,
      body: [
        {
          label: '加载页面类型',
          required: true,
          type: 'button-group-select',
          submitOnChange: true,
          value: 'crud',
          name: 'type',
          options: [
            {
              label: 'Crud',
              value: 'crud'
            },

            {
              label: 'Form',
              value: 'form'
            },

            {
              label: 'Tabs',
              value: 'tabs'
            }
          ]
        }
      ]
    },
    {
      name: 'service1',
      type: 'service',
      className: 'm-t',
      initFetchSchema: false,
      schemaApi: '/api/mock2/service/schema?type=$type'
    }
  ]
};
