export default {
  "type": "page",
  "title": "InputTable事件动作",
  "regions": [
    "body"
  ],
  "body": [
    {
      "type": "button",
      "label": "setValue 未指定index",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "args": {
                "value": [
                  {
                    "name": "zzl",
                    "color": "#ff0000"
                  },
                  {
                    "name": "zzl测试下setValue动作",
                    "color": "#00ff00"
                  }
                ]
              },
              "actionType": "setValue"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "setValue 指定index",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "args": {
                "index": 2,
                "value": {
                  "name": "setValue 指定index",
                  "color": "#00ff00"
                }
              },
              "actionType": "setValue"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "addItem 未指定index",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "args": {
                "item": [
                  {
                    "name": "${name}",
                    "color": "#ffffff"
                  },
                  {
                    "name": "插入2",
                    "color": "#2468f2"
                  }
                ]
              },
              "actionType": "addItem"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "addItem 指定index",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "args": {
                "index": 1,
                "item": [
                  {
                    "name": "index 1",
                    "color": "#ffffff"
                  },
                  {
                    "name": "index 2",
                    "color": "#ffffff"
                  }
                ]
              },
              "actionType": "addItem"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "deleteItem",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "args": {
                "condition": "${CONTAINS(name, 'index')}"
              },
              "actionType": "deleteItem"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "clear",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "actionType": "clear"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "reset",
      "onEvent": {
        "click": {
          "actions": [
            {
              "componentId": "u:39c47c713ae6",
              "actionType": "reset"
            }
          ]
        }
      },
      "id": "u:691a43978f4e"
    },
    {
      "type": "button",
      "label": "老add",
      "actionType": "add",
      "target": "table",
      "payload": {
        "name": "black",
        "color": "#000000"
      }
    },
    {
      "type": "button",
      "label": "老delete",
      "target": "table",
      "actionType": "delete",
      "payload": {
        "name": "black",
      }
    },
    {
      "type": "input-text",
      "label": "测试获取父级数据",
      "name": "name",
      "id": "u:5aea6935a4f2",
      "value": "23455656"
    },
    {
      "type": "input-table",
      "name": "table",
      "label": "表格表单",
      // "needConfirm": false,
      "value": [
        {
          "name": "zzl",
          "color": "#ff0000"
        },
        {
          "name": "zzl测试下setValue动作",
          "color": "#00ff00"
        }
      ],
      // "valueField": "name",
      "resetValue": [
        {
          name: 'resetValue',
          color: '#ffffff'
        }
      ],
      "columns": [
        {
          "label": "color",
          "name": "color",
          "quickEdit": {
            "type": "input-color",
            "id": "u:1d828c468cbd"
          },
          "type": "text",
          "id": "u:d2dc063d4a3e"
        },
        {
          "label": "说明文字",
          "name": "name",
          "quickEdit": {
            "type": "input-text",
            "mode": "inline",
            "id": "u:c9db91691264"
          },
          "type": "text",
          "id": "u:6b9d980a101d"
        }
      ],
      "strictMode": false,
      "id": "u:39c47c713ae6",
      "addable": true,
      "copyable": true,
      "editable": true,
      "removable": true,
      "draggable": false,
      "valueField": "name",
      "onEvent": {
        "add": {
          "actions": [
            {
              "args": {
                "msg": "add ${event.data | json}"
              },
              "actionType": "toast"
            }
          ],
        },
        "addConfirm": {
          "actions": [
            {
              "args": {
                "msg": "addConfirm ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "addSuccess": {
          "actions": [
            {
              "args": {
                "msg": "addSuccess ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "edit": {
          "actions": [
            {
              "args": {
                "msg": "edit ${event.data | json}"
              },
              "actionType": "toast"
            }
          ],
        },
        "editConfirm": {
          "actions": [
            {
              "args": {
                "msg": "editConfirm ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "editSuccess": {
          "actions": [
            {
              "args": {
                "msg": "editSuccess ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "editFail": {
          "actions": [
            {
              "args": {
                "msg": "editFail ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "delete": {
          "actions": [
            {
              "args": {
                "msg": "delete ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "deleteSuccess": {
          "actions": [
            {
              "args": {
                "msg": "deleteSuccess ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        },
        "deleteFail": {
          "actions": [
            {
              "args": {
                "msg": "deleteFail ${event.data | json}"
              },
              "actionType": "toast"
            }
          ]
        }
      }
    },
    {
      "type": "tpl",
      "tpl": "${table | json}"
    }
  ],
  "id": "u:6bbc05138917"
}
