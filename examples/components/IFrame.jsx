export default {
  title: 'IFrame 可以用来嵌入其他网站',
  body: [
    {
      type: 'form',
      mode: 'inline',
      target: 'window',
      title: '',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          addOn: {
            type: 'submit',
            label: '搜索',
            level: 'info',
            icon: 'fa fa-search pull-left'
          }
        }
      ]
    },

    {
      type: 'iframe',
      className: 'b-a',
      src: 'https://www.baidu.com/s?wd=${keywords|raw}',
      height: 500
    }
  ]
};
