export default {
  "title": "表单及表单项切换编辑态展示态",
  "data": {
    "id": 1
  },
  "body": [
    {
      "type": "form",
      "title": "整个表单状态切换",
      "mode": "horizontal",
      "labelWidth": 150,
      "id": "allFormSwitch",
      "body": [
        {
          "type": "input-text",
          "name": "var1",
          "label": "输入框",
          "value": "text"
        },
        {
          "type": "input-color",
          "name": "var2",
          "label": "颜色选择",
          "value": "#F0F"
        },
        {
          "type": "switch",
          "name": "switch",
          "label": "开关",
          "value": true
        },
        {
          "type": "checkboxes",
          "name": "checkboxes",
          "label": "多选框",
          "value": "1,2",
          "multiple": true,
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            },
            {
              "label": "选项3",
              "value": 3
            }
          ]
        },
        {
          "type": "select",
          "name": "type",
          "label": "下拉单选",
          "inline": true,
          "value": 1,
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            },
            {
              "label": "内容很长很长的选项，内容很长很长的选项",
              "value": 3
            }
          ]
        },
        {
          type: 'button-toolbar',
          name: 'button-toolbar',
          buttons: [
            {
              "type": "button",
              "label": "提交",
              "level": "primary",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "static",
                      "componentId": "allFormSwitch"
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "label": "编辑",
              "level": "primary",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "nonstatic",
                      "componentId": "allFormSwitch"
                    }
                  ]
                }
              }
            }
          ],
          className: 'show'
        },
      ],
      "actions": []
    },

    {
      "type": "form",
      "title": "单个表单项状态切换",
      "mode": "horizontal",
      "labelWidth": 150,
      "body": [
        {
          "type": "input-text",
          "id": "formItemSwitch",
          "name": "var1",
          "label": "使用事件动作状态切换",
          "value": "text"
        },
        {
          type: 'button-toolbar',
          name: 'button-toolbar',
          buttons: [
            {
              "type": "button",
              "label": "编辑态",
              "level": "primary",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "nonstatic",
                      "componentId": "formItemSwitch"
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "label": "展示态",
              "level": "primary",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "static",
                      "componentId": "formItemSwitch"
                    }
                  ]
                }
              }
            }
          ],
          className: 'show'
        },
      ],
      "actions": []
    },
    {
      "type": "form",
      "title": "表单项展示态属性",
      "mode": "horizontal",
      "labelWidth": 150,
      "body": [
        {
          "type": "input-text",
          "id": "formItemInputText",
          "name": "var1",
          "label": "编辑态<br />不设置<br />或static: false",
          "value": "text",
          "static": false,
          "desc": "使用staticOn 支持表达式控制，用法类似"
        },
        {
          "type": "input-text",
          "id": "formItemInputText",
          "name": "var1",
          "label": "展示态<br />static: true",
          "value": "text",
          "static": true
        },
        {
          "type": "input-text",
          "id": "formItemInputText",
          "name": "var2",
          "label": "空值时的占位 staticPlaceholder",
          "staticPlaceholder": "空值占位符，默认为 -",
          "static": true
        },
        {
          "type": "input-text",
          "name": "var3",
          "label": "自定义展示态schema",
          "value": "表单项value",
          "desc": "通过\\${name}可获取到当前值",
          "static": true,
          "staticSchema": [
            "自定义前缀 | ",
            {
              "type": "tpl",
              "tpl": "${var3}"
            },
            " | 自定义后缀",
          ]
        }
      ],
      "actions": []
    },
    {
      "type": "form",
      "api": "/api/mock2/saveForm?waitSeconds=2",
      "id": "myform",
      "mode": "horizontal",
      "autoFocus": true,
      "panel": false,
      "debug": false,
      "title": "目前支持编辑态展示态切换的表单项",
      "labelWidth": 150,
      "staticClassName": "now-is-static",
      "body": [
        {
          "type": "button-toolbar",
          "name": "button-toolbar",
          "buttons": [
            {
              "type": "button",
              "label": "切换为编辑态",
              "level": "primary",
              "visibleOn": "${static}",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "nonstatic",
                      "componentId": "myform"
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "label": "切换为展示态",
              "level": "primary",
              "visibleOn": "${!static}",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "static",
                      "componentId": "myform"
                    }
                  ]
                }
              }
            }
          ],
          "className": "show"
        },
        {
          "type": "input-text",
          "name": "var1",
          "label": "文本",
          "value": "text",
          "desc": "这是一段描述文字",
          "id": "my-input-text"
        },
        {
          "type": "input-password",
          "name": "password",
          "label": "密码",
          "inline": true,
          "value": "123456"
        },
        {
          "type": "input-email",
          "validations": "isEmail",
          "label": "邮箱",
          "name": "email",
          "value": "hello@baidu.com"
        },
        {
          "type": "input-url",
          "validations": "isUrl",
          "label": "url",
          "name": "url",
          "value": "https://www.baidu.com"
        },
        {
          "type": "input-number",
          "name": "number",
          "label": "数字",
          "placeholder": "",
          "inline": true,
          "value": 5,
          "min": 1,
          "max": 10
        },
        {
          "type": "divider"
        },
        {
          "type": "native-date",
          "name": "native-date",
          "label": "native日期选择",
          "value": "2022-08-18"
        },
        {
          "type": "native-time",
          "name": "native-time",
          "label": "native时间选择",
          "value": "16:10"
        },
        {
          "type": "native-number",
          "name": "native-number",
          "label": "native数字输入",
          "value": "6"
        },
        {
          "type": "divider"
        },
        {
          "type": "input-tag",
          "name": "tag",
          "label": "标签",
          "placeholder": "",
          "clearable": true,
          "value": "zhugeliang,caocao",
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
              "label": "野核",
              "children": [
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
        },
        {
          "type": "divider"
        },
        {
          "type": "checkboxes",
          "name": "checkboxes",
          "label": "多选框",
          "value": "1,2",
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            },
            {
              "label": "选项3",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "radios",
          "name": "radios",
          "label": "单选",
          "value": 3,
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            },
            {
              "label": "选项3",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "button-group-select",
          "name": "btn-group",
          "label": "按钮组",
          "description": "类似于单选效果",
          "value": 1,
          "options": [
            {
              "label": "选项 A",
              "value": 1
            },
            {
              "label": "选项 B",
              "value": 2
            },
            {
              "label": "选项 C",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "list-select",
          "name": "List",
          "label": "List",
          "desc": "也差不多，只是展示方式不一样",
          "value": 3,
          "options": [
            {
              "label": "选项 A",
              "value": 1
            },
            {
              "label": "选项 B",
              "value": 2
            },
            {
              "label": "选项 C",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "list-select",
          "name": "list2",
          "label": "List",
          "desc": "可多选",
          "multiple": true,
          "value": "1,2",
          "options": [
            {
              "label": "选项 A",
              "value": 1
            },
            {
              "label": "选项 B",
              "value": 2
            },
            {
              "label": "选项 C",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "list-select",
          "name": "list4",
          "label": "List",
          "imageClassName": "thumb-lg",
          "desc": "支持放张图片",
          "value": 1,
          "options": [
            {
              "image": "/examples/static/photo/3893101144.jpg",
              "value": 1,
              "label": "图片1"
            },
            {
              "image": "/examples/static/photo/3893101144.jpg",
              "value": 2,
              "label": "图片2"
            },
            {
              "image": "/examples/static/photo/3893101144.jpg",
              "value": 3,
              "label": "图片3"
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "list-select",
          "name": "list5",
          "label": "List",
          "desc": "支持文字排版",
          "value": 1,
          "options": [
            {
              "value": 1,
              "body": "<div class=\"m-l-sm m-r-sm m-b-sm m-t-xs\">\n                                  <div class=\"text-md p-b-xs b-inherit b-b m-b-xs\">套餐：C01</div>\n                                  <div class=\"text-sm\">CPU：22核</div>\n                                  <div class=\"text-sm\">内存：10GB</div>\n                                  <div class=\"text-sm\">SSD盘：1024GB</div>\n                              </div>"
            },
            {
              "value": 2,
              "body": "<div class=\"m-l-sm m-r-sm  m-b-sm m-t-xs\">\n                              <div class=\"text-md p-b-xs b-inherit b-b m-b-xs\">套餐：C02</div>\n                              <div class=\"text-sm\">CPU：23核</div>\n                              <div class=\"text-sm\">内存：11GB</div>\n                              <div class=\"text-sm\">SSD盘：1025GB</div>\n                              </div>"
            },
            {
              "value": 3,
              "disabled": true,
              "body": "<div class=\"m-l-sm m-r-sm  m-b-sm m-t-xs\">\n                              <div class=\"text-md p-b-xs b-inherit b-b m-b-xs\">套餐：C03</div>\n                              <div class=\"text-sm\">CPU：24核</div>\n                              <div class=\"text-sm\">内存：12GB</div>\n                              <div class=\"text-sm\">SSD盘：1026GB</div>\n                              </div>"
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "input-rating",
          "count": 5,
          "value": 4,
          "label": "评分",
          "name": "rating",
          "half": false
        },
        {
          "type": "divider"
        },
        {
          "type": "switch",
          "name": "switch",
          "label": "开关",
          "value": true
        },
        {
          "type": "switch",
          "name": "switch4",
          "value": true,
          "onText": "开启",
          "offText": "关闭",
          "label": "开关文字"
        },
        {
          "type": "switch",
          "name": "switch5",
          "value": true,
          "onText": {
            "type": "icon",
            "icon": "fa fa-check-circle"
          },
          "offText": {
            "type": "icon",
            "icon": "fa fa-times-circle"
          },
          "label": "开关icon"
        },
        {
          "type": "divider"
        },
        {
          "type": "checkbox",
          "name": "checkbox",
          "label": "勾选框",
          "options": "勾选说明",
          "value": true
        },
        {
          "type": "divider"
        },
        {
          "type": "select",
          "name": "type",
          "label": "下拉单选",
          "inline": true,
          "value": 1,
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            },
            {
              "label": "内容很长很长的选项，内容很长很长的选项",
              "value": 3
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "select",
          "name": "type2",
          "label": "多选",
          "multiple": true,
          "inline": true,
          "value": "1,2",
          "options": [
            {
              "label": "选项1",
              "value": 1
            },
            {
              "label": "选项2",
              "value": 2
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "input-color",
          "name": "color",
          "label": "Color",
          "value": "#dc1717"
        },
        {
          "type": "divider"
        },
        {
          "type": "input-date",
          "name": "date",
          "label": "日期",
          "value": "1591326307"
        },
        {
          "type": "input-datetime",
          "name": "datetime",
          "label": "日期+时间",
          "value": "1591326307"
        },
        {
          "type": "input-time",
          "name": "time",
          "label": "时间",
          "value": "1591326307"
        },
        {
          "type": "input-month",
          "name": "year-month",
          "label": "年月",
          "value": "1591326307"
        },
        {
          "type": "input-month",
          "name": "month",
          "label": "月份",
          "value": "1591326307"
        },
        {
          "type": "input-year",
          "name": "year",
          "label": "年份",
          "value": "1591326307"
        },
        {
          "type": "input-quarter",
          "name": "quarter",
          "label": "季度",
          "value": "1591326307"
        },
        {
          "type": "divider"
        },
        {
          "type": "input-date-range",
          "name": "input-date-range",
          "label": "日期范围",
          "value": "1661961600,1664553599"
        },
        {
          "type": "input-datetime-range",
          "name": "input-datetime-range",
          "label": "日期时间范围",
          "value": "1659283200,1661961599"
        },
        {
          "type": "input-time-range",
          "name": "input-time-range",
          "label": "时间范围",
          "value": "15:00,23:27"
        },
        {
          "type": "input-month-range",
          "name": "input-month-range",
          "label": "月份范围",
          "value": "1643644800,1651420799"
        },
        {
          "type": "input-year-range",
          "name": "input-year-range",
          "label": "年份范围",
          "value": "1693497600,1790870399"
        },
        {
          "type": "input-quarter-range",
          "name": "input-quarter-range",
          "label": "季度范围",
          "value": "1640966400,1664639999"
        },
        {
          "type": "divider"
        },
        {
          "type": "input-group",
          "size": "sm",
          "inline": true,
          "label": "组合",
          "body": [
            {
              "type": "input-text",
              "placeholder": "搜索作业ID/名称",
              "inputClassName": "b-l-none p-l-none",
              "name": "jobName",
              "value": "作业"
            },
            {
              "type": "input-text",
              "placeholder": "搜索作业ID/名称",
              "inputClassName": "b-l-none p-l-none",
              "name": "jobName",
              "value": "家庭作业"
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "input-group",
          "label": "各种组合",
          "inline": true,
          "body": [
            {
              "type": "select",
              "name": "memoryUnits",
              "options": [
                {
                  "label": "Gi",
                  "value": "Gi"
                },
                {
                  "label": "Mi",
                  "value": "Mi"
                },
                {
                  "label": "Ki",
                  "value": "Ki"
                }
              ],
              "value": "Gi"
            },
            {
              "type": "input-text",
              "name": "memory",
              "value": "memory"
            },
            {
              "type": "select",
              "name": "memoryUnits2",
              "options": [
                {
                  "label": "Gi",
                  "value": "Gi"
                },
                {
                  "label": "Mi",
                  "value": "Mi"
                },
                {
                  "label": "Ki",
                  "value": "Ki"
                }
              ],
              "value": "Gi"
            },
            {
              "type": "button",
              "label": "Go"
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "textarea",
          "name": "textarea",
          "label": "多行文本",
          "value": "这是一段多行文本文字\n第二行内容"
        },
        {
          "type": "divider"
        },
        {
          "label": "穿梭器",
          "name": "a",
          "type": "transfer",
          "source": "/api/mock2/form/getOptions?waitSeconds=1",
          "searchable": true,
          "searchApi": "/api/mock2/options/autoComplete2?term=$term",
          "selectMode": "list",
          "sortable": true,
          "inline": true,
          "value": "A,B,C"
        },
        {
          "type": "divider"
        },
        {
          "type": "input-tree",
          "name": "tree",
          "label": "树",
          "iconField": "icon",
          "value": "2",
          "options": [
            {
              "label": "Folder A",
              "value": 1,
              "icon": "fa fa-bookmark",
              "children": [
                {
                  "label": "file A",
                  "value": 2,
                  "icon": "fa fa-star"
                },
                {
                  "label": "file B",
                  "value": 3
                }
              ]
            },
            {
              "label": "file C",
              "value": 4
            },
            {
              "label": "file D",
              "value": 5
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "input-tree",
          "name": "trees",
          "label": "树多选",
          "multiple": true,
          "value": "1-2,5",
          "options": [
            {
              "label": "Folder A",
              "value": 1,
              "children": [
                {
                  "label": "file A",
                  "value": 2
                },
                {
                  "label": "file B",
                  "value": 3
                }
              ]
            },
            {
              "label": "file C",
              "value": 4
            },
            {
              "label": "file D",
              "value": 5
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "tree-select",
          "name": "selecttree",
          "label": "树选择器",
          "value": "5",
          "options": [
            {
              "label": "Folder A",
              "value": 1,
              "children": [
                {
                  "label": "file A",
                  "value": 2
                },
                {
                  "label": "file B",
                  "value": 3
                }
              ]
            },
            {
              "label": "file C",
              "value": 4
            },
            {
              "label": "file D",
              "value": 5
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "tree-select",
          "name": "selecttrees",
          "label": "树多选选择器",
          "multiple": true,
          "value": "1-2,5",
          "options": [
            {
              "label": "Folder A",
              "value": 1,
              "children": [
                {
                  "label": "file A",
                  "value": 2
                },
                {
                  "label": "file B",
                  "value": 3
                }
              ]
            },
            {
              "label": "file C",
              "value": 4
            },
            {
              "label": "file D",
              "value": 5
            }
          ]
        },
        {
          "type": "nested-select",
          "name": "nestedSelect",
          "label": "级联选择器",
          "value": "definitions",
          "options": [
            {
              "label": "概念",
              "value": "concepts",
              "children": [
                {
                  "label": "配置与组件",
                  "value": "schema"
                },
                {
                  "label": "数据域与数据链",
                  "value": "scope"
                },
                {
                  "label": "模板",
                  "value": "template"
                },
                {
                  "label": "数据映射",
                  "value": "data-mapping"
                },
                {
                  "label": "表达式",
                  "value": "expression"
                },
                {
                  "label": "联动",
                  "value": "linkage"
                },
                {
                  "label": "行为",
                  "value": "action"
                },
                {
                  "label": "样式",
                  "value": "style"
                }
              ]
            },
            {
              "label": "类型",
              "value": "types",
              "children": [
                {
                  "label": "SchemaNode",
                  "value": "schemanode"
                },
                {
                  "label": "API",
                  "value": "api"
                },
                {
                  "label": "Definitions",
                  "value": "definitions"
                }
              ]
            },
            {
              "label": "组件",
              "value": "zujian",
              "children": [
                {
                  "label": "布局",
                  "value": "buju",
                  "children": [
                    {
                      "label": "Page 页面",
                      "value": "page"
                    },
                    {
                      "label": "Container 容器",
                      "value": "container"
                    },
                    {
                      "label": "Collapse 折叠器",
                      "value": "Collapse"
                    }
                  ]
                },
                {
                  "label": "功能",
                  "value": "gongneng",
                  "children": [
                    {
                      "label": "Action 行为按钮",
                      "value": "action-type"
                    },
                    {
                      "label": "App 多页应用",
                      "value": "app"
                    },
                    {
                      "label": "Button 按钮",
                      "value": "button"
                    }
                  ]
                },
                {
                  "label": "数据输入",
                  "value": "shujushuru",
                  "children": [
                    {
                      "label": "Form 表单",
                      "value": "form"
                    },
                    {
                      "label": "FormItem 表单项",
                      "value": "formitem"
                    },
                    {
                      "label": "Options 选择器表单项",
                      "value": "options"
                    }
                  ]
                },
                {
                  "label": "数据展示",
                  "value": "shujuzhanshi",
                  "children": [
                    {
                      "label": "CRUD 增删改查",
                      "value": "crud"
                    },
                    {
                      "label": "Table 表格",
                      "value": "table"
                    },
                    {
                      "label": "Card 卡片",
                      "value": "card"
                    }
                  ]
                },
                {
                  "label": "反馈",
                  "value": "fankui"
                }
              ]
            }
          ]
        },
        {
          "type": "nested-select",
          "name": "nestedSelectMul",
          "label": "级联选择器多选",
          "multiple": true,
          "checkAll": false,
          "value": "definitions",
          "options": [
            {
              "label": "概念",
              "value": "concepts",
              "children": [
                {
                  "label": "配置与组件",
                  "value": "schema"
                },
                {
                  "label": "数据域与数据链",
                  "value": "scope"
                },
                {
                  "label": "模板",
                  "value": "template"
                },
                {
                  "label": "数据映射",
                  "value": "data-mapping"
                },
                {
                  "label": "表达式",
                  "value": "expression"
                },
                {
                  "label": "联动",
                  "value": "linkage"
                },
                {
                  "label": "行为",
                  "value": "action"
                },
                {
                  "label": "样式",
                  "value": "style"
                }
              ]
            },
            {
              "label": "类型",
              "value": "types",
              "children": [
                {
                  "label": "SchemaNode",
                  "value": "schemanode"
                },
                {
                  "label": "API",
                  "value": "api"
                },
                {
                  "label": "Definitions",
                  "value": "definitions"
                }
              ]
            },
            {
              "label": "组件",
              "value": "zujian",
              "children": [
                {
                  "label": "布局",
                  "value": "buju",
                  "children": [
                    {
                      "label": "Page 页面",
                      "value": "page"
                    },
                    {
                      "label": "Container 容器",
                      "value": "container"
                    },
                    {
                      "label": "Collapse 折叠器",
                      "value": "Collapse"
                    }
                  ]
                },
                {
                  "label": "功能",
                  "value": "gongneng",
                  "children": [
                    {
                      "label": "Action 行为按钮",
                      "value": "action-type"
                    },
                    {
                      "label": "App 多页应用",
                      "value": "app"
                    },
                    {
                      "label": "Button 按钮",
                      "value": "button"
                    }
                  ]
                },
                {
                  "label": "数据输入",
                  "value": "shujushuru",
                  "children": [
                    {
                      "label": "Form 表单",
                      "value": "form"
                    },
                    {
                      "label": "FormItem 表单项",
                      "value": "formitem"
                    },
                    {
                      "label": "Options 选择器表单项",
                      "value": "options"
                    }
                  ]
                },
                {
                  "label": "数据展示",
                  "value": "shujuzhanshi",
                  "children": [
                    {
                      "label": "CRUD 增删改查",
                      "value": "crud"
                    },
                    {
                      "label": "Table 表格",
                      "value": "table"
                    },
                    {
                      "label": "Card 卡片",
                      "value": "card"
                    }
                  ]
                },
                {
                  "label": "反馈",
                  "value": "fankui"
                }
              ]
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "divider"
        },
        {
          "type": "matrix-checkboxes",
          "name": "matrix",
          "label": "矩阵开关",
          "rowLabel": "行标题说明",
          "value": [
            [
              {
                "label": "列1",
                "checked": true
              },
              {
                "label": "列1",
                "checked": false
              }
            ],
            [
              {
                "label": "列2",
                "checked": false
              },
              {
                "label": "列2",
                "checked": true
              }
            ],
          ],
          "columns": [
            {
              "label": "列1"
            },
            {
              "label": "列2"
            }
          ],
          "rows": [
            {
              "label": "行1"
            },
            {
              "label": "行2"
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "combo",
          "name": "combo",
          "label": "组合单条",
          "value": {
            "a": 1,
            "b": "a"
          },
          "items": [
            {
              "name": "a",
              "label": "名称",
              "type": "input-text",
              "placeholder": "A"
            },
            {
              "name": "b",
              "label": "信息",
              "type": "select",
              "options": [
                "a",
                "b",
                "c"
              ]
            }
          ]
        },
        {
          "type": "divider"
        },
        {
          "type": "combo",
          "name": "combo2",
          "label": "组合多条",
          "multiple": true,
          "value": [
            {
              "a": 1,
              "b": "a"
            },
            {
              "a": 2,
              "b": "b"
            },
          ],
          "items": [
            {
              "name": "a",
              "label": "名称：",
              "type": "input-text",
              "placeholder": "A"
            },
            {
              "name": "b",
              "label": "信息：",
              "type": "select",
              "options": [
                "a",
                "b",
                "c"
              ]
            }
          ]
        },
        {
          "name": "array",
          "label": "颜色集合",
          "type": "input-array",
          "value": [
            "red",
            "blue",
            "green"
          ],
          "inline": true,
          "items": {
            "type": "input-color",
            "clearable": false
          }
        },
        {
          "type": "input-kv",
          "name": "kv",
          "label": "键值对",
          "valueType": "input-number",
          "value": {
            "count1": 2,
            "count2": 4
          }
        },
        {
          "type": "input-kvs",
          "name": "dataModel",
          "label": "可嵌套键值对象",
          "addButtonText": "新增表",
          "keyItem": {
            "label": "表名",
            "mode": "horizontal",
            "type": "select",
            "options": [
              "table1",
              "table2",
              "table3"
            ]
          },
          "valueItems": [
            {
              "type": "input-kvs",
              "addButtonText": "新增字段",
              "name": "column",
              "keyItem": {
                "label": "字段名",
                "mode": "horizontal",
                "type": "select",
                "options": [
                  "id",
                  "title",
                  "content"
                ]
              },
              "valueItems": [
                {
                  "type": "switch",
                  "name": "primary",
                  "mode": "horizontal",
                  "label": "是否是主键"
                },
                {
                  "type": "select",
                  "name": "type",
                  "label": "字段类型",
                  "mode": "horizontal",
                  "options": [
                    "text",
                    "int",
                    "float"
                  ]
                }
              ]
            }
          ],
          "value": {
            "table1": {
              "column": {
                "id": {
                  "primary": false,
                  "type": "text"
                },
                "title": {
                  "type": "text"
                }
              }
            },
            "table2": {
              "column": {
                "title": {
                  "type": "int"
                }
              }
            }
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "input-range",
          "name": "range",
          "label": "范围",
          "value": "50"
        },
        {
          "type": "button-toolbar",
          "name": "button-toolbar",
          "buttons": [
            {
              "type": "button",
              "label": "切换为编辑态",
              "level": "primary",
              "visibleOn": "${static}",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "nonstatic",
                      "componentId": "myform"
                    }
                  ]
                }
              }
            },
            {
              "type": "button",
              "label": "切换为展示态",
              "level": "primary",
              "visibleOn": "${!static}",
              "onEvent": {
                "click": {
                  "actions": [
                    {
                      "actionType": "static",
                      "componentId": "myform"
                    }
                  ]
                }
              }
            }
          ]
        }
      ],
      "actions": []
    }
  ]
};
