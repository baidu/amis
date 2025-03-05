---
title: Nav 导航
description:
type: 0
group: ⚙ 组件
menuName: Nav
icon:
order: 58
---

用于展示链接导航

## 基本用法

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "className": "w-md",
  "itemBadge": {
    "mode": "ribbon",
    "text": "${customText}",
    "position": "top-left",
    "visibleOn": "this.customText",
    "level": "${customLevel}"
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
      "active": true
    },
    {
      "label": "Nav 2",
      "to": "/docs/api",
      "customText": "HOT",
      "customLevel": "danger"
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "customText": "SUC",
      "customLevel": "success"
    },
    {
      "label": "外部地址",
      "to": "http://www.baidu.com/",
      "target": "_blank"
    }
  ]
}
```

## 配置多层级

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "className": "w-md",
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user",
      "active": true
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ]
}
```

## 横向摆放

```schema: scope="body"
{
  "type": "nav",
  "stacked": false,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "to": "/docs/api"
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ]
}
```

### 响应式收纳

横向（`"stack": false`）模式下配置`overflow`，实现导航响应式收纳。

```schema: scope="body"
{
  "type": "nav",
  "stacked": false,
  "overflow": {
    "enable": true
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "?to=nav1"
    },
    {
      "label": "Nav 2",
      "to": "?to=nav1"
    },
    {
      "label": "Nav 3",
      "to": "?to=nav3"
    },
    {
      "label": "Nav 4",
      "to": "?to=nav4"
    },
    {
      "label": "Nav 5",
      "to": "?to=nav5"
    },
    {
      "label": "Nav 6",
      "to": "?to=nav6"
    },
    {
      "label": "Nav 7",
      "to": "?to=nav7"
    },
    {
      "label": "Nav 8",
      "to": "?to=nav8"
    },
    {
      "label": "Nav 9",
      "to": "?to=nav9"
    },
    {
      "label": "Nav 10",
      "to": "?to=nav10"
    },
    {
      "label": "Nav 11",
      "to": "?to=nav11",
      "children": [
        {
          "label": "Nav 13",
          "to": "?to=nav13"
        }
      ]
    },
    {
      "label": "Nav 12",
      "to": "?to=nav12"
    }
  ]
}
```

设置`maxVisibleCount`可以自定义强制展示的导航数量，不设置则自动处理。设置`overflowIndicator`自定义菜单按钮的图标。
设置`overflowLabel`自定义菜单按钮文本。

```schema: scope="body"
{
  "type": "nav",
  "stacked": false,
  "overflow": {
    "enable": true,
    "overflowClassName": "nav-overflow-btn",
    "overflowPopoverClassName": "nav-overflow-popover",
    "overflowIndicator": "fas fa-angle-double-down",
    "overflowLabel": "更多",
    "maxVisibleCount": 5
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "?to=nav1"
    },
    {
      "label": "Nav 2",
      "to": "?to=nav1"
    },
    {
      "label": "Nav 3",
      "to": "?to=nav3"
    },
    {
      "label": "Nav 4",
      "to": "?to=nav4"
    },
    {
      "label": "Nav 5",
      "to": "?to=nav5"
    },
    {
      "label": "Nav 6",
      "to": "?to=nav6"
    },
    {
      "label": "Nav 7",
      "to": "?to=nav7"
    },
    {
      "label": "Nav 8 Nav 8 Nav 8 Nav 8 Nav 8",
      "to": "?to=nav8"
    }
  ]
}
```

横向导航默认使用下拉框收纳折叠的导航，设置`overflow.mode`为`swipe`可以使用左右滚动收纳。

```schema: scope="body"
{
    type: 'nav',
    stacked: false,
    overflow: {
      enable: true,
      mode: 'swipe'
    },
    links: [
      {
        label: 'Nav 1',
        to: '?to=nav1'
      },
      {
        label: 'Nav 2',
        to: '?to=nav2'
      },
      {
        label: 'Nav 3',
        to: '?to=nav3'
      },
      {
        label: 'Nav 4',
        to: '?to=nav4'
      },
      {
        label: 'Nav 5',
        to: '?to=nav5'
      },
      {
        label: 'Nav 6',
        to: '?to=nav6'
      },
      {
        label: 'Nav 7',
        to: '?to=nav7'
      },
      {
        label: 'Nav 8',
        to: '?to=nav8'
      },
      {
        label: 'Nav 9',
        to: '?to=nav9'
      },
      {
        label: 'Nav 10',
        to: '?to=nav10'
      },
      {
        label: 'Nav 11',
        to: '?to=nav11',
      },
      {
        label: 'Nav 12',
        to: '?to=nav12'
      },{
        label: 'Nav 13',
        to: '?to=nav13'
      },{
        label: 'Nav 14',
        to: '?to=nav14'
      },{
        label: 'Nav 15',
        to: '?to=nav15'
      },{
        label: 'Nav 16',
        to: '?to=nav16'
      },{
        label: 'Nav 17',
        to: '?to=nav17'
      },{
        label: 'Nav 18',
        to: '?to=nav18'
      },{
        label: 'Nav 19',
        to: '?to=nav19'
      }
    ]
  }
```

### 导航项收纳

垂直（`"stack": true`）模式下，如果子导航项比较多，也可以给导航项设置收纳模式，配置同`overflow`，仅支持一次性展开

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "expandPosition": "after",
  "style": {
    "width": 200
  },
  "links": [
    {
      "label": [
        {
          "type": "tpl",
          "tpl": "Nav1"
        }
      ],
      "to": "#/"
    },
    {
      "label": "Nav2",
      "unfolded": true,
      "overflow": {
        "enable": true
      },
      "children": [
        {
          "label": "Nav 2-1",
          "to": "#/test2"
        },
        {
          "label": "Nav 2-2",
          "to": "#/test3"
        },
        {
          "label": "Nav 2-3",
          "to": "#/test1"
        },
        {
          "label": "Nav 2-4",
          "to": "#/test4"
        },
        {
          "label": "Nav 2-5",
          "to": "#/test5"
        }
      ]
    }
  ]
}
```

## 动态导航

通过配置 source 来实现动态生成导航，source 可以是 api 地址或者变量，比如

```schema
{
  "type": "page",
  "data": {
    "nav": [
      {
        "label": "Nav 1",
        "to": "/docs/index",
        "icon": "fa fa-user"
      },
      {
        "label": "Nav 2",
        "to": "/docs/api"
      },
      {
        "label": "Nav 3",
        "to": "/docs/renderers"
      }
    ]
  },
  "body": {
    "type": "nav",
    "stacked": true,
    "source": "${nav}"
  }
}
```

## 懒加载

可以一次只加载部分层级，更深层次的选项可以标记为 `defer` 为 true，这样只有点开的时才会加载。

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "source": "/api/options/nav?parentId=${value}"
}
```

## 更多操作

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "className": "w-md",
  "draggable": true,
  "saveOrderApi": "/api/options/nav",
  "source": "/api/options/nav?parentId=${value}",
  "style": {
    "width": 160
  },
  "itemActions": [
    {
      "type": "icon",
      "icon": "cloud",
      "visibleOn": "this.to === '?cat=1'"
    },
    {
      "type": "dropdown-button",
      "level": "link",
      "icon": "fa fa-ellipsis-h",
      "hideCaret": true,
      "buttons": [
        {
          "type": "button",
          "label": "编辑"
        },
        {
          "type": "button",
          "label": "删除"
        }
      ]
    }
  ]
}
```

## 悬浮导航

可以通过设置`mode`属性来控制导航模式，不设置默认为内联导航模式

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "mode": "float",
  "style": {
    "width": "200px"
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user",
      "active": true
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ]
}
```

## 悬浮面板模式

设置`mode`属性为 panel，开启悬浮面板模式，最多支持 3 级菜单

```schema: scope="body"
{
    "type": "nav",
    "stacked": false,
    "mode": "panel",
    "overflow": {
        "enable": true
    },
    "links": [
        {
            "label": "Nav 1",
            "to": "?to=nav1",
            "children": [
                {
                    "label": "Nav 1-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav1-1"
                },
                {
                    "label": "Nav 1-2",
                    "icon": "fa fa-user",
                    "to": "?to=nav1-2"
                }
            ]
        },
        {
            "label": "Nav 2",
            "to": "?to=nav2",
            "children": [
                {
                    "label": "Nav 2-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav2-1",
                    "children": [
                        {
                            "label": "Nav 2-1-1",
                            "icon": "fa fa-user",
                            "to": "?to=nav2-1-1"
                        },
                        {
                            "label": "Nav 2-1-2",
                            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                            "to": "http://www.baidu.com/",
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "label": "Nav 2-2",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav2-2"
                }
            ]
        },
        {
            "label": "Nav 3",
            "to": "?to=nav3"
        },
        {
            "label": "Nav 4",
            "to": "?to=nav4"
        },
        {
            "label": "Nav 5",
            "to": "?to=nav5"
        },
        {
            "label": "Nav 6",
            "to": "?to=nav6"
        },
        {
            "label": "Nav 7",
            "to": "?to=nav7"
        },
        {
            "label": "Nav 8",
            "to": "?to=nav8",
            "children": [
                {
                    "label": "Nav 8-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav8-1"
                }
            ]
        },
        {
            "label": "Nav 9",
            "to": "?to=nav9",
            "children": [
                {
                    "label": "Nav 9-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav9-1",
                    "children": [
                        {
                            "label": "Nav 9-1-1",
                            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                            "to": "?to=nav9-1-1"
                        },
                        {
                            "label": "Nav 9-1-2",
                            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                            "to": "?to=nav13"
                        }
                    ]
                },
                {
                    "label": "Nav 9-2",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav9-2"
                }
            ]
        }
    ]
}
```

设置竖向展示

```schema: scope="body"
{
    "type": "nav",
    "stacked": true,
    "mode": "panel",
    "overflow": {
        "enable": true
    },
    "style": {
      "width": 200
    },
    "links": [
        {
            "label": "Nav 1",
            "to": "?to=nav1",
            "children": [
                {
                    "label": "Nav 1-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav1-1"
                },
                {
                    "label": "Nav 1-2",
                    "icon": "fa fa-user",
                    "to": "?to=nav1-2"
                }
            ]
        },
        {
            "label": "Nav 2",
            "to": "?to=nav2",
            "children": [
                {
                    "label": "Nav 2-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav2-1",
                    "children": [
                        {
                            "label": "Nav 2-1-1",
                            "icon": "fa fa-user",
                            "to": "?to=nav2-1-1"
                        },
                        {
                            "label": "Nav 2-1-2",
                            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                            "to": "http://www.baidu.com/",
                            "target": "_blank"
                        }
                    ]
                },
                {
                    "label": "Nav 2-2",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav2-2"
                }
            ]
        },
        {
            "label": "Nav 3",
            "to": "?to=nav3"
        },
        {
            "label": "Nav 4",
            "to": "?to=nav4"
        },
        {
            "label": "Nav 5",
            "to": "?to=nav5"
        },
        {
            "label": "Nav 6",
            "to": "?to=nav6"
        },
        {
            "label": "Nav 7",
            "to": "?to=nav7"
        },
        {
            "label": "Nav 8",
            "to": "?to=nav8",
            "children": [
                {
                    "label": "Nav 8-1",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav8-1"
                }
            ]
        },
        {
            "label": "Nav 9",
            "to": "?to=nav9",
            "children": [
                {
                    "label": "Nav 9-1",
                    "to": "?to=nav9-1",
                    "children": [
                        {
                            "label": "Nav 9-1-1",
                            "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                            "to": "?to=nav9-1-1"
                        },
                        {
                            "label": "Nav 9-1-2",
                            "to": "?to=nav9-1-2"
                        }
                    ]
                },
                {
                    "label": "Nav 9-2",
                    "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg",
                    "to": "?to=nav9-2"
                }
            ]
        }
    ]
}
```

## 导航缩起

`collapsed`属性控制导航的展开和缩起，缩起状态下，导航内容仅展示图标或第一个文字，悬浮展开全部内容或子导航项

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "collapsed": true,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ]
}
```

## 导航分割线

导航项`mode`属性控制导航项的展示模式，支持`divider`（分割线）和`group`（分组）两种模式，不设置默认为普通导航项

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "style": {
    "width": "160px"
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      mode: 'divider'
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "disabled": true,
      "disabledTip": "导航项禁用"
    }
  ]
}
```

## 导航分组

分组模式（`"mode": "group"`）的导航项展示为分组标题形式

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "mode": "group",
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "mode": "group",
      "children": [
        {
          "label": "Nav 3-1",
          "to": "/docs/api-2-1"
        }
      ]
    }
  ]
}
```

## 默认展开层级

当前导航最大层级为 4，可通过`defaultOpenLevel`来控制默认 2 层级全部展开

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "defaultOpenLevel": "2",
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1",
              "children": [
                {
                  "label": "Nav 2-1-1-1",
                  "to": "/docs/api-2-1-1-1"
                }
              ]
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "children": [
        {
          "label": "Nav 3-1",
          "to": "/docs/api-2-1"
        }
      ]
    }
  ]
}
```

## 自定义展开按钮

可以设置`expandIcon`为 icon 的名称字符串

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "expandIcon": "close",
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "children": [
        {
          "label": "Nav 3-1",
          "to": "/docs/api-2-1"
        }
      ]
    }
  ]
}
```

也可以将`expandIcon`设置为`SchemaObject`

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "expandIcon": {
    "type": "icon",
    "icon": "far fa-address-book"
  },
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers",
      "children": [
        {
          "label": "Nav 3-1",
          "to": "/docs/api-2-1"
        }
      ]
    }
  ]
}
```

## 搜索导航项

> `3.5.0` 及以上版本

开启`"searchable": true`后，支持搜索当前数据源内的导航项，支持自定义匹配函数[`NavMatchFunc`](#navmatchfunc)，如果不设置默认模糊匹配导航对象中的`label`, `title` 和 `key` 字段。

```schema: scope="body"
{
  "type": "container",
  "className": "w-40",
  "body": [
    {
      "type": "nav",
      "stacked": true,
      "searchable": true,
      "searchConfig": {
        "matchFunc": "return link.searchKey === keyword;"
      },
      "links": [
        {
          "label": "Nav 1",
          "to": "?to=nav1",
          "searchKey": "1"
        },
        {
          "label": "Nav 2",
          "to": "?to=nav2",
          "searchKey": "2",
          "children": [
            {
              "label": "Nav 2-1",
              "to": "?to=nav2-1",
              "searchKey": "2-1",
              "children": [
                {
                  "label": "Nav 2-1-1",
                  "to": "?to=nav2-1-1",
                  "searchKey": "2-1-1"
                }
              ]
            }
          ]
        },
        {
          "label": "Nav 3",
          "to": "?to=nav3",
          "searchKey": "3",
          "children": [
            {
              "label": "Nav 3-1",
              "to": "?to=nav3-1",
              "searchKey": "3-1"
            }
          ]
        },
        {
          "label": "Nav 4",
          "to": "?to=nav4",
          "searchKey": "4"
        },
        {
          "label": "Nav 5",
          "to": "?to=nav5",
          "searchKey": "5"
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名                            | 类型                                      | 默认值                          | 说明                                                                                                              | 版本     |
| --------------------------------- | ----------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| type                              | `string`                                  | `"nav"`                         | 指定为 Nav 渲染器                                                                                                 |
| mode                              | `string`                                  | `"inline"`                      | 导航模式，悬浮/内联/悬浮面板，默认内联模式                                                                        |
| collapsed                         | `boolean`                                 |                                 | 控制导航是否缩起                                                                                                  |
| indentSize                        | `number`                                  | `16`                            | 层级缩进值，仅内联模式下生效                                                                                      |
| level                             | `number`                                  |                                 | 控制导航最大展示层级数                                                                                            |
| defaultOpenLevel                  | `number`                                  |                                 | 控制导航最大默认展开层级                                                                                          |
| className                         | `string`                                  |                                 | 外层 Dom 的类名                                                                                                   |
| popupClassName                    | `string`                                  |                                 | 当为悬浮模式时，可自定义悬浮层样式                                                                                |
| expandIcon                        | `string \| SchemaObject`                  |                                 | 自定义展开按钮                                                                                                    |
| expandPosition                    | `string`                                  |                                 | 展开按钮位置，`"before"`或者`"after"`，不设置默认在前面                                                           |
| stacked                           | `boolean`                                 | `true`                          | 设置成 false 可以以 tabs 的形式展示                                                                               |
| accordion                         | `boolean`                                 |                                 | 是否开启手风琴模式                                                                                                |
| source                            | `string` 或 [API](../../docs/types/api)   |                                 | 可以通过变量或 API 接口动态创建导航                                                                               |
| deferApi                          | [API](../../docs/types/api)               |                                 | 用来延时加载选项详情的接口，可以不配置，不配置公用 source 接口。                                                  |
| itemActions                       | [SchemaNode](../../docs/types/schemanode) |                                 | 更多操作相关配置                                                                                                  |
| draggable                         | `boolean`                                 |                                 | 是否支持拖拽排序                                                                                                  |
| dragOnSameLevel                   | `boolean`                                 |                                 | 仅允许同层级内拖拽                                                                                                |
| saveOrderApi                      | `string` 或 [API](../../docs/types/api)   |                                 | 保存排序的 api                                                                                                    |
| itemBadge                         | [BadgeSchema](../../components/badge)     |                                 | 角标                                                                                                              |
| links                             | `Array`                                   |                                 | 链接集合                                                                                                          |
| links[x].label                    | `string`                                  |                                 | 名称                                                                                                              |
| links[x].to                       | [模板](../../docs/concepts/template)      |                                 | 链接地址                                                                                                          |
| links[x].target                   | `string`                                  | 链接关系                        |                                                                                                                   |
| links[x].icon                     | `string`                                  |                                 | 图标                                                                                                              |
| links[x].children                 | `Array<link>`                             |                                 | 子链接                                                                                                            |
| links[x].unfolded                 | `boolean`                                 |                                 | 初始是否展开                                                                                                      |
| links[x].active                   | `boolean`                                 |                                 | 是否高亮                                                                                                          |
| links[x].activeOn                 | [表达式](../../docs/concepts/expression)  |                                 | 是否高亮的条件，留空将自动分析链接地址                                                                            |
| links[x].defer                    | `boolean`                                 |                                 | 标记是否为懒加载项                                                                                                |
| links[x].deferApi                 | [API](../../docs/types/api)               |                                 | 可以不配置，如果配置优先级更高                                                                                    |
| links[x].disabled                 | `boolean`                                 |                                 | 是否禁用                                                                                                          |
| links[x].disabledTip              | `string`                                  |                                 | 禁用提示信息                                                                                                      |
| links[x].className                | `string`                                  |                                 | 菜单项自定义样式                                                                                                  |
| links[x].mode                     | `string`                                  |                                 | 菜菜单项模式，分组模式：`"group"`、分割线：`"divider"`                                                            |
| links[x].overflow                 | `NavOverflow`                             |                                 | 导航项响应式收纳配置                                                                                              |
| overflow                          | `NavOverflow`                             |                                 | 响应式收纳配置                                                                                                    |
| overflow.enable                   | `boolean`                                 | `false`                         | 是否开启响应式收纳                                                                                                |
| overflow.overflowLabel            | `string \| SchemaObject`                  |                                 | 菜单触发按钮的文字                                                                                                |
| overflow.overflowIndicator        | `SchemaIcon`                              | `"fa fa-ellipsis"`              | 菜单触发按钮的图标                                                                                                |
| overflow.maxVisibleCount          | `number`                                  |                                 | 开启响应式收纳后导航最大可显示数量，超出此数量的导航将被收纳到下拉菜单中，默认为自动计算                          |
| overflow.wrapperComponent         | `string`                                  |                                 | 包裹导航的外层标签名，可以使用其他标签渲染                                                                        |
| overflow.style                    | `React.CSSProperties`                     |                                 | 自定义样式                                                                                                        |
| overflow.overflowClassName        | `string`                                  | `""`                            | 菜单按钮 CSS 类名                                                                                                 |
| overflow.overflowPopoverClassName | `string`                                  | `""`                            | Popover 浮层 CSS 类名                                                                                             |
| overflow.mode                     | `swipe \| popup`                          | `"popup"`                       | 导航超长时使用滚动模式还是浮层收纳模式。默认为 `"popup"`模式。使用 `"swipe"` 模式时，`"maxVisibleCount"` 将失效。 | `6.13.0` |
| searchable                        | `boolean`                                 | `false`                         | 是否开启搜索                                                                                                      | `3.5.0`  |
| searchConfig.matchFunc            | `string`                                  | [`NavMatchFunc`](#navmatchfunc) | 自定义匹配函数, 默认模糊匹配导航对象中的`label`, `title` 和 `key` 字段                                            | `3.5.0`  |
| searchConfig.className            | `string`                                  | `""`                            | 搜索框外层 CSS 类名                                                                                               | `3.5.0`  |
| searchConfig.placeholder          | `string`                                  | `false`                         | 是否开启搜索                                                                                                      | `3.5.0`  |
| searchConfig.mini                 | `boolean`                                 | `false`                         | 是否为 mini 模式                                                                                                  | `3.5.0`  |
| searchConfig.enhance              | `boolean`                                 | `false`                         | 是否为增强样式                                                                                                    | `3.5.0`  |
| searchConfig.clearable            | `boolean`                                 | `false`                         | 是否开启搜索                                                                                                      | `3.5.0`  |
| searchConfig.searchImediately     | `boolean`                                 | `false`                         | 是否立即搜索                                                                                                      | `3.5.0`  |

### NavMatchFunc

```typescript
interface NavMatchFunc {
  (
    /* 导航项对象 */
    link: Link,
    /* 搜索关键字 */
    keyword: string
  ): boolean;
}
```

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称  | 事件参数                                                        | 说明                     |
| --------- | --------------------------------------------------------------- | ------------------------ |
| loaded    | `items: item[]` 数据源<br/>`item?: object` 懒加载时所点击导航项 | 异步加载数据源完成时触发 |
| collapsed | `collapsed: boolean` 缩起展开状态                               | 导航缩起展开时触发       |
| toggled   | `item: object` 导航项数据<br/>`open: boolean` 展开状态          | 点击导航展开按钮时触发   |
| change    | `value: item[]` 选中导航项数据                                  | 导航项选中有变化时触发   |
| click     | `item: object` 点击导航项数据                                   | 手动点击导航项时触发     |

### loaded

数据源加载完成，可以尝试将`source`配置为 api 地址或者开启懒加载。

```schema
{
  "type": "page",
  "body": [
    {
      "type": "action",
      "label": "刷新",
      "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "reload",
              "componentId": "test"
            }
          ]
        }
      }
    },
    {
      "id": "test",
      "type": "nav",
      "stacked": true,
      "valueField": "label",
      "source": "/api/options/nav?parentId=${value}",
      "onEvent": {
        "loaded": {
          "actions": [
            {
              "actionType": "toast",
              "args": {
                "msg": "已加载${event.data.items.length}条记录"
              }
            }
          ]
        }
      }
    }
  ]
}
```

### collapsed

导航缩起，可以尝试修改导航的`collapsed`属性。

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "collapsed": true,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ],
  "onEvent": {
    "collapsed": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "${event.data.collapsed ? '导航缩起' : '导航展开'}"
          }
        }
      ]
    }
  }
}
```

### toggled

导航项收起展开，可以尝试点击导航项展开按钮。

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ],
  "onEvent": {
    "toggled": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "${event.data.item.label}${event.data.open ? '展开' : '收起'}"
          }
        }
      ]
    }
  }
}
```

### change

导航项选中，可以尝试手动修改任意导航项的`active`属性。

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "links": [
    {
      "label": "Nav 1",
      "to": "/docs/index",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "unfolded": true,
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1",
              "to": "/docs/api-2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2",
          "to": "/docs/api-2-2"
        }
      ]
    },
    {
      "label": "Nav 3",
      "to": "/docs/renderers"
    }
  ],
  "onEvent": {
    "change": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "${event.data.value.length}项选中"
          }
        }
      ]
    }
  }
}
```

### click

导航项点击，可以尝试手动点击任意导航项。

```schema: scope="body"
{
  "type": "nav",
  "stacked": true,
  "links": [
    {
      "label": "Nav 1",
      "icon": "fa fa-user"
    },
    {
      "label": "Nav 2",
      "children": [
        {
          "label": "Nav 2-1",
          "children": [
            {
              "label": "Nav 2-1-1"
            }
          ]
        },
        {
          "label": "Nav 2-2"
        }
      ]
    },
    {
      "label": "Nav 3"
    }
  ],
  "onEvent": {
    "click": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msg": "${event.data.item.label}被点击了，但不一定选中"
          }
        }
      ]
    }
  }
}
```

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称    | 动作配置                         | 说明                                                                                    |
| ----------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| updateItems | `value: string`或`value: item[]` | 更新导航数据源为指定导航项的子导航数据                                                  |
| reset       |                                  | 重置导航数据源，和 updateItems 搭配使用，没有经过 updateItems 操作的，执行 reset 无效果 |

### updateItems / reset

```schema: scope="body"
{
  "type": "page",
  "data": {
    "items": [
      {
        "label": "Nav 1",
        "to": "/docs/index",
        "icon": "fa fa-user"
      },
      {
        "label": "Nav 2",
        "unfolded": true,
        "active": true,
        "children": [
          {
            "label": "Nav 2-1",
            "children": [
              {
                "label": "Nav 2-1-1",
                "to": "/docs/api-2-1-1"
              }
            ]
          },
          {
            "label": "Nav 2-2",
            "to": "/docs/api-2-2"
          }
        ]
      },
      {
        "label": "Nav 3",
        "to": "/docs/renderers"
      }
    ]
  },
  "body": {
    "type": "container",
    "body": [
      {
        "type": "action",
        "label": "设置数据源",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "updateItems",
                "args": {
                  "value": "Nav 2"
                },
                "componentId": "asideNav"
              }
            ]
          }
        }
      },
      {
        "type": "action",
        "label": "重置数据源",
        "className": "mx-1",
        "onEvent": {
          "click": {
            "actions": [
              {
                "actionType": "reset",
                "componentId": "asideNav"
              }
            ]
          }
        }
      },
      {
        "type": "container",
        "body": [
          {
            "type": "nav",
            "stacked": true,
            "source": "${items}",
            "id": "asideNav"
          }
        ]
      }
    ]
  }
}
```
