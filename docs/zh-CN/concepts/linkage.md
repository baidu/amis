---
title: 联动
description:
type: 0
group: 💡 概念
menuName: 联动
icon:
order: 14
---

上一节我们介绍了表达式的概念，而表达式应用最多的场景，是实现页面的联动效果。

## 基本联动

元素的联动是页面开发中很常见的功能之一，类似于：

- 某个条件下显示或隐藏某个组件
- 某个条件下请求接口
- 某个条件下轮询接口停止轮询
- 等等...

> 联动配置项一般都是 [表达式](./expression)

### 组件配置联动

控制组件的显隐，表单项的禁用状态等，看下面这个例子：

```schema: scope="body"
{
    "type": "form",
    "controls": [
        {
            "type": "radios",
            "name": "foo",
            "label": false,
            "options": [
                {
                    "label": "类型1",
                    "value": 1
                },
                {
                    "label": "类型2",
                    "value": 2
                }
            ]
        },
        {
            "type": "text",
            "name": "text1",
            "label": false,
            "placeholder": "选中 类型1 时可见",
            "visibleOn": "this.foo == 1"
        },
        {
            "type": "text",
            "name": "text2",
            "label": false,
            "placeholder": "选中 类型2 时不可点",
            "disabledOn": "this.foo == 2"
        }
    ]
}
```

上面实例主要为一个表单，表单内有三个组件：一个`radio`, 两个`text`，通过配置联动配置项，实现下面联动效果：

1. 只要当`radio`选中`类型1`时，才会显示`text1`；
2. 当`radio`选中`类型2`时，`text2`将会变为`禁用状态`

> **注意：**
>
> 在表单项联动中，为了方便数据的读取，赋值后或者修改过的表单项，通过隐藏后，并不会在当前数据域中删除掉该字段值，因此默认提交的时候可能仍然会带上已隐藏表单项的值
>
> 如果想要在提交时去掉某个隐藏的字段，可以通过 [数据映射](./data-mapping) 配置自定义数据体

### 接口联动

#### 基本使用

接口联动是另外一种很常见的场景，查看下面这个例子：

```schema: scope="body"
{
    "title": "",
    "type": "form",
    "mode": "horizontal",
    "controls": [
      {
        "label": "选项1",
        "type": "radios",
        "name": "a",
        "inline": true,
        "options": [
          {
            "label": "选项A",
            "value": 1
          },
          {
            "label": "选项B",
            "value": 2
          },
          {
            "label": "选项C",
            "value": 3
          }
        ]
      },
      {
        "label": "选项2",
        "type": "select",
        "size": "sm",
        "name": "b",
        "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/level2?a=${a}",
        "description": "切换<code>选项1</code>的值，会触发<code>选项2</code>的<code>source</code> 接口重新拉取"
      }
    ],
    "actions": []
}
```

上面例子我们实现了这个逻辑：每次选择`选项1`的时候，会触发`选项2`的`source`配置的接口重新请求，并返回不同的下拉选项。

是如何做到的？

实际上，所有**初始化接口链接上使用数据映射获取参数的形式**时，例如下面的`query=${query}`，在当前数据域中，**所引用的变量值（即 query）发生变化时**，自动重新请求该接口。

```json
{
  "initApi": "/api/initData?query=${query}"
}
```

> **tip:**
>
> 触发所引用变量值发生变化的方式有以下几种：
>
> 1. 通过对表单项的修改，可以更改表单项`name`属性值所配置变量的值；
> 2. 通过[组件间联动](./linkage#%E7%BB%84%E4%BB%B6%E9%97%B4%E8%81%94%E5%8A%A8)，将其他组件的值发送到目标组件，进行数据域的更新，从而触发联动效果
>
> 接口联动一般只适用于初始化接口，例如：
>
> - `form`组件中的`initApi`；
> - `select`组件中的`source`选项源接口`url`, `data`只能用于主动联动；
> - `service`组件中的`api`和`schemaApi`；
> - `crud`组件中的`api`；（crud 默认是跟地址栏联动，如果要做请关闭同步地址栏 syncLocation: false）
> - 等等...

#### 配置请求条件

默认在变量变化时，总是会去请求联动的接口，你也可以配置请求条件，当只有当前数据域中某个值符合特定条件才去请求该接口。

```schema: scope="body"
{
    "title": "",
    "type": "form",
    "mode": "horizontal",
    "controls": [
      {
        "label": "选项1",
        "type": "radios",
        "name": "a",
        "inline": true,
        "options": [
          {
            "label": "选项A",
            "value": 1
          },
          {
            "label": "选项B",
            "value": 2
          },
          {
            "label": "选项C",
            "value": 3
          }
        ]
      },
      {
        "label": "选项2",
        "type": "select",
        "size": "sm",
        "name": "b",
        "source": {
            "method": "get",
            "url": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/level2?a=${a}",
            "sendOn": "this.a === 2"
        },
        "description": "只有<code>选项1</code>选择<code>B</code>的时候，才触发<code>选项2</code>的<code>source</code>接口重新拉取"
      }
    ],
    "actions": []
}
```

更多用法，见：[Api-配置请求条件](../types/api#%E9%85%8D%E7%BD%AE%E8%AF%B7%E6%B1%82%E6%9D%A1%E4%BB%B6)

#### 主动触发

上面示例有个问题，就是数据一旦变化就会出发重新拉取，而输入框的频繁变化值会导致频繁的拉取？没关系，也可以配置主动拉取如：

```schema: scope="body"
{
    "type": "form",
    "name": "my_form",
    "controls": [
      {
        "type": "text",
        "name": "keyword",
        "addOn": {
          "label": "搜索",
          "type": "button",
          "actionType": "reload",
          "target": "my_form.select"
        }
      },
      {
        "type": "select",
        "name": "select",
        "label": "Select",
        "source": {
          "method": "get",
          "url": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
          "data": {
            "a": "${keyword}"
          }
        }
      }
    ]
}
```

1. 通过`api`对象形式，将获取变量值配置到`data`请求体中。
2. 配置搜索按钮，并配置该行为是刷新目标组件，并配置目标组件`target`
3. 这样我们只有在点击搜索按钮的时候，才会将`keyword`值发送给`select`组件，重新拉取选项

### 其他联动

还有一些组件特有的联动效果，例如 form 的 disabledOn，crud 中的 itemDraggableOn 等等，可以参考相应的组件文档。

## 组件间联动

联动很可能会出现跨组件的形式，思考下面这种场景：

有一个表单`form`组件，还有一个列表组件`crud`，我们想要把`form`提交的数据，可以用作`crud`的查询条件，并请求`crud`的接口，由于`form`和`crud`位于同一层级，因此没法使用数据链的方式进行取值。

```schema: scope="body"
[
    {
      "title": "查询条件",
      "type": "form",
      "controls": [
        {
          "type": "text",
          "name": "keywords",
          "label": "关键字："
        }
      ],
      "submitText": "搜索"
    },
    {
      "type": "crud",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
      "columns": [
            {
                "name": "id",
                "label": "ID"
            },
            {
                "name": "engine",
                "label": "Rendering engine"
            },
            {
                "name": "browser",
                "label": "Browser"
            },
            {
                "name": "platform",
                "label": "Platform(s)"
            },
            {
                "name": "version",
                "label": "Engine version"
            }
        ]
    }
]
```

现在更改配置如下：

```schema: scope="body"
[
    {
      "title": "查询条件",
      "type": "form",
      "target": "my_crud",
      "controls": [
        {
          "type": "text",
          "name": "keywords",
          "label": "关键字："
        }
      ],
      "submitText": "搜索"
    },
    {
      "type": "crud",
      "name": "my_crud",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
      "columns": [
            {
                "name": "id",
                "label": "ID"
            },
            {
                "name": "engine",
                "label": "Rendering engine"
            },
            {
                "name": "browser",
                "label": "Browser"
            },
            {
                "name": "platform",
                "label": "Platform(s)"
            },
            {
                "name": "version",
                "label": "Engine version"
            }
        ]
    }
]
```

我们进行两个调整：

1. 为`crud`组件设置了`name`属性为`my_crud`
2. 为`form`组件配置了`target`属性为`crud`的`name`：**`my_crud`**

更改配置后，提交表单时，如果有配置提交接口，会先请求提交，之后 amis 会寻找`target`所配置的目标组件，把`form`中所提交的数据，发送给该目标组件中，并将该数据**合并**到目标组件的数据域中，并触发目标组件的刷新操作，对于 CRUD 组件来说，刷新即重新拉取数据接口。

> 当然，`crud`组件内置已经支持此功能，你只需要配置`crud`中的`filter`属性，就可以实现上面的效果，更多内容查看 [crud -> filter](../../components/crud) 文档。

我们再来一个例子，这次我们实现 [两个 form 之间的联动](../../components/form/index#%E5%B0%86%E6%95%B0%E6%8D%AE%E5%9F%9F%E5%8F%91%E9%80%81%E7%BB%99%E7%9B%AE%E6%A0%87%E7%BB%84%E4%BB%B6)

### 发送指定数据

`target`属性支持通过配置参数来发送指定数据，例如：`"target" :"xxx?a=${a}&b=${b}"`，这样就会把当前数据域中的`a`变量和`b`变量发送给目标组件

```schema: scope="body"
[
  {
    "type": "form",
    "title": "form1",
    "mode": "horizontal",
    "api": "/api/mock2/form/saveForm",
    "controls": [
      {
        "label": "Name",
        "type": "text",
        "name": "name"
      },

      {
        "label": "Email",
        "type": "text",
        "name": "email"
      },

      {
        "label": "Company",
        "type": "text",
        "name": "company"
      }
    ],
    "actions": [
      {
        "type": "action",
        "actionType": "reload",
        "label": "发送到 form2",
        "target": "form2?name=${name}&email=${email}"
      }
    ]
  },
  {
    "type": "form",
    "title": "form2",
    "name": "form2",
    "mode": "horizontal",
    "api": "/api/mock2/form/saveForm",
    "controls": [
      {
        "label": "MyName",
        "type": "text",
        "name": "name"
      },

      {
        "label": "MyEmail",
        "type": "text",
        "name": "email"
      },

      {
        "label": "Company",
        "type": "text",
        "name": "company"
      }
    ]
  }
]
```

上例中我们给按钮上配置了`"target": "form2?name=${name}&email=${email}"`,可以把当前数据链中的`name`变量和`email`变量发送给`form2`

### 配置多个目标

`target`支持配置多个目标组件 name，用逗号隔开，例如：

```json
{
  "type": "action",
  "actionType": "reload",
  "label": "刷新目标组件",
  "target": "target1,target2"
}
```

上例中点击按钮会刷新`target1`和`target2`组件。

事实上，**组件间联动也可以实现上述任意的 [基本联动效果](./linkage#%E5%9F%BA%E6%9C%AC%E8%81%94%E5%8A%A8)（显隐联动、接口联动等其他联动）。**
