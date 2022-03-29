export default {
  type: 'page',
  title: '穿梭框类事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    {
      name: 'trigger1',
      id: 'trigger1',
      type: 'action',
      label: '穿梭框1',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'selectAll',
              componentId: 'transfer-change-receiver'
            }
          ]
        }
      }
    },
    {
      "label": "穿梭器",
      "id": 'transfer-change-receiver',
      "type": "transfer",
      "name": "transfer-change-receiver",
      "options": [
        {
          "label": "诸葛亮",
          "value": "zhugeliang"
        },
        {
          "label": "曹操",
          "value": "caocao"
        },
        {
          "label": "钟无艳",
          "value": "zhongwuyan"
        },
        {
          "label": "李白",
          "value": "libai"
        },
        {
          "label": "韩信",
          "value": "hanxin"
        },
        {
          "label": "云中君",
          "value": "yunzhongjun"
        }
      ]
    }
  ]
};
