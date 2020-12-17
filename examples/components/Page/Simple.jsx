export default {
  type: 'page',
  title: '',
  body: [
    {
      type: 'panel',
      title: '',
      body: [
        {
          type: 'hbox',
          columns: [
            {
              type: 'container',
              body: [
                {
                  type: 'container',
                  bodyClassName: 'flex flex-row justify-between items-center',
                  body: [
                    {
                      type: 'tpl',
                      inline: false,
                      tpl: `<span class="text-loud text-base">费用趋势</span> <span class="text-muted text-sm">单位：元</span>`
                    },

                    {
                      type: 'form',
                      wrapWithPanel: false,
                      mode: 'inline',
                      submitOnInit: true,
                      submitOnChange: true,
                      controls: [
                        {
                          type: 'button-group',
                          className: 'm-b-none',
                          name: 'range',
                          value: 'hafe-year',
                          options: [
                            {
                              label: '近半年',
                              value: 'hafe-year'
                            },

                            {
                              label: '近一年',
                              value: 'year'
                            }
                          ]
                        },

                        {
                          type: 'select',
                          name: 'series',
                          className: 'm-b-none',
                          value: 'sumary',
                          // inputClassName: 'w-24',
                          options: [
                            {
                              label: '总费用',
                              value: 'sumary'
                            },

                            {
                              label: '现金支付',
                              value: 'cash'
                            },

                            {
                              label: '赠送金支付',
                              value: 'gift'
                            },

                            {
                              label: '代金券支付',
                              value: 'voucher'
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },

                {
                  type: 'chart',
                  api:
                    'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/chart/sample'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
