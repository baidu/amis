export default {
  "type": "page",
  "title": "InputTable事件动作",
  "regions": [
    "body"
  ],
  "body": [
    {
      "type": "button",
      "label": "input-table赋值",
      "onEvent": {
        "click": {
          "actions": [
          ]
        }
      },
      "id": "u:ce6be67e2007"
    },
    {
      "type": "button",
      "label": "combo赋值",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:d8819450ebba",
              "args": {
                "value": [
                  {
                    "value": "B",
                    "key": "1111"
                  },
                  {
                    "key": "2222",
                    "value": "A"
                  }
                ]
              },
              "actionType": "setValue"
            }
          ]
        }
      },
      "id": "u:75e931359b4f"
    },
    {
      "type": "input-table",
      "name": "table",
      "label": "表格表单",
      "columns": [
        {
          "label": "color",
          "name": "color",
          "quickEdit": {
            "type": "input-color",
            "id": "u:b93874d69023"
          },
          "type": "text",
          "id": "u:45a6745f4478"
        },
        {
          "label": "说明文字",
          "name": "name",
          "quickEdit": {
            "type": "input-text",
            "mode": "inline",
            "id": "u:b8bb0af95a9f"
          },
          "type": "text",
          "id": "u:c5ca880372b7"
        }
      ],
      "strictMode": false,
      "id": "u:2b1e4872a28e",
      "addable": true,
      "editable": true,
      "removable": true,
      "needConfirm": true,
      "onEvent": {
        "add": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发add ${event.data.value|json}'
              }
            }
          ]
        },
        "edit": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发edit ${event.data.value|json}'
              }
            }
          ]
        },
        "addConfirm": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发addConfirm ${event.data.value|json}'
              }
            }
          ]
        },
        "editConfirm": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发editConfirm ${event.data.value|json}'
              }
            }
          ]
        },
        "delete": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发delete ${event.data.value|json}'
              }
            }
          ]
        },
        "change": {
          "weight": 0,
          "actions": [
            {
              actionType: 'toast',
              args: {
                msg: '触发change ${event.data.value|json}'
              }
            }
          ]
        }
      }
    }
  ],
  "id": "u:6bbc05138917"
}
