export default {
  "type": "page",
  "title": "Simple Form Page",
  "regions": [
    "body"
  ],
  "body": [
    {
      "type": "wizard",
      "steps": [
        {
          "title": "基本信息",
          "hiddenOn": "${!validateCode}",
          "body": [
            {
              "type": "input-text",
              "label": "用户名",
              "name": "username",
              "value": "12121123123",
              "mode": "horizontal"
            },
            {
              "type": "input-password",
              "label": "密码",
              "name": "password",
              "value": "qwerasdfzxcv",
              "mode": "horizontal"
            },
            {
              "type": "input-password",
              "label": "确认密码",
              "name": "confirmPassword",
              "mode": "horizontal"
            },
            {
              "type": "button-group-select",
              "name": "hiddenTest",
              "label": "测试下隐藏",
              "inline": false,
              "value": 1,
              "options": [
                {
                  "label": "选项1",
                  "value": 1
                },
                {
                  "label": "选项2",
                  "value": 2
                }
              ],
              "id": "u:20069f4652a4",
              "multiple": false,
              "mode": "horizontal"
            }
          ],
          "id": "u:4a7fd475044b",
          "mode": "normal"
        },
        {
          "title": "验证码",
          "body": [
            {
              "type": "input-group",
              "label": "验证码",
              "body": [
                {
                  "type": "input-text",
                  "label": "验证码",
                  "name": "validateCode",
                  "mode": "horizontal"
                },
                {
                  "type": "button",
                  "label": "发送验证码"
                }
              ]
            }
          ],
          "mode": "normal"
        },
        {
          "title": "确认信息",
          "body": [
            {
              "type": "tpl",
              "tpl": "用户名: ${username}"
            },
            {
              "type": "input-text",
              "name": "hahahha"
            }
          ],
          "mode": "normal"
        }
      ],
      "id": "u:4bd3ac2a9a78",
      "mode": "horizontal",
      "stepsClassName": "w-1/2 mx-auto",
      "wrapWithPanel": false,
      "footerClassName": "bg-white fixed -bottom-0 w-full",
      "className": "bg-gray-50 overflow-hidden h-full -mx-3 -my-4",
      "stepClassName": "overflow-hidden mb-14",
      "bodyClassName": "bg-white wizard-body"
    }
  ],
  "id": "u:ee4880c00289",
  "pullRefresh": {
    "disabled": true
  },
  "css": {
    ".wizard-body": {
      "margin": "16px",
      "padding": "24px"
    }
  },
  "className": "h-full"
}
