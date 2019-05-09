---
title: 高级用法
shortname: advanced
---

在开始阅读之前，希望你已经阅读 [快速开始文档](./getting-started.md) 。

## 数据作用域

配置中很多地方都可以用变量如： [tpl](./renderers/Tpl.md) 类型的渲染器、API 中的 Url、FormItem 中的 source 配置、visibleOn、disabledOn 以及 Form 中的 `redirect` 配置等等。

那么都有哪些数据可以用？这取决于在哪个容器，关于容器中的数据说明如下：

-   `page` 等价于全局变量，因为顶级渲染器就是它，所以下面的所有组件都能用到这个里面的数据。
    -   `amisPage` 当前页面的数据信息，包含标题，id，key 之类的信息。
    -   `amisUser` 当前用户信息，包含邮箱和用户名信息。
    -   `params 中的数据` 如果地址栏中也携带了参数，也会 merge 到该层的数据中。
    -   `initApi 返回的数据` 如果 page 设置了 `initApi` 那么初始化的时候会从 API 中拉取数据，拉取到的数据可以用于整个页面。
-   `crud`

    -   父级 容器中的数据可以直接使用，如 page 容器
    -   `api` 返回的数据，crud 的 api 除了可以返回 `rows` 和 `count` 数据外，其他的数据会被 merge 到数据中，供容器使用。

-   `form`

    -   父级 容器中的数据可以直接使用，如 page 容器
    -   `initApi` 返回的数据。
    -   FormItem 的数据直接会存入到数据中，而且每次修改都会及时更新。通过 FormItem 设置的 `name` 值获取。

-   `formItem` 表单项中，所在的表单中的数据都能用。
-   `wizard` 同 form
-   `dialog` dialog 由 button 触发弹出，携带的数据根据按钮所在的位置来决定。
    -   form 中弹出则会把 form 中的数据复制份传给 dialog。
    -   crud 中的批量操作按钮。把整个列表数据复制给 dialog。
    -   crud 中的某一项中的按钮，则只会把对应的那一条数据拷贝给 dialog。
-   `servcie`
    -   父级 容器中的数据可以直接使用，如 page 容器
    -   如果配置了 `api`, `api` 返回的数据可以用。

取值过程，也跟 JS 作用域中取值一样，当前作用域中有，则直接返回当前作用域中，如果没有当前作用域没有，会一直往上找，直到找到了为止。如果存在同名变量，则返回就近作用域中数据。

需要注意的是，要取到值一定是在自己所在的作用域，或者上级作用域里面，同级的是取不到的，如果需要怎么办？可以往下看联动，比如：FormA 的数据发送给 formB, 另外一种方式，可以把接口拉取换到父级组件去操作，没有可拉取数据的组件，就一起包在一个 service 控件里面。

## 联动

### 简单的显隐联动

主要通过 `visibleOn`、`hiddenOn` 和 `disabledOn` 来配置。

```schema:height="300" scope="form"
[
    {
        "type": "radios",
        "name": "foo",
        "inline": true,
        "label": " ",
        "options": [
            {
                "label": "类型1",
                "value": 1
            },
            {
                "label": "类型2",
                "value": 2
            },
            {
                "label": "类型3",
                "value": 3
            }
        ]
    },

    {
        "type": "text",
        "name": "text",
        "placeholder": "类型1 可见",
        "visibleOn": "data.foo == 1"
    },

     {
         "type": "text",
         "name": "text2",
         "placeholder": "类型2 不可点",
         "disabledOn": "data.foo == 2"
     },

   {
       "type": "button",
       "label": "类型三不能提交",
       "level": "primary",
       "disabledOn": "data.foo == 3"
   }

]
```

### 选项联动

比如 select 中 options 可能根据某个值不同而不同。

```schema:height="300" scope="form"
[
    {
        "label": "选项1",
        "type": "radios",
        "labelClassName": "text-muted",
        "name": "a",
        "inline": true,
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
        "label": "选项2",
        "type": "select",
        "labelClassName": "text-muted",
        "name": "b",
        "inline": true,
        "source": "/api/mock2/options/level2?a=${a}",
        "initFetchOn": "data.a"
      }
]
```

他们是怎么关联的呢？注意看 select 的 source 配置 `"/api/mock/getOptions?waitSeconds=1&type=$foo"` 这里用了变量 `$foo` 这个 foo 正好是第一个表单的 name 值。只要这个值发生变化，source 就会重新获取一次。

这里有个问题就是，数据一旦变化就会出发重新拉取，如果是输入框岂不是拉取得很频繁？没关系，也可以主动拉取如：

```schema:height="300" scope="body"
{
    "type": "form",
    "name": "lidong",
    "controls": [
        {
            "type": "text",
            "name": "foo",
            "addOn": {
                "label": "搜索",
                "className": "btn-info",
                "type": "button",
                "actionType": "reload",
                "disabledOn": "!data.foo",
                "target": "lidong.select"
            }
        },

        {
            "type": "select",
            "name": "select",
            "label": "Select",
            "source": {
                "method": "get",
                "url": "/api/mock2/options/level2?waitSeconds=1",
                "data": {
                    "a": "$foo"
                }
            },
            "desc": "这里只是演示刷新不会真正的过滤。"
        }
    ]
}
```

注意，source 中的传参是通过 source 中的 data 关联的，不能写在 source 的 url 中，因为如果写了，就会自动监控值的变化而自动刷新，写在 data 里面关联则不会。如果对 source 中的配置规则不了解，请前往 [API 说明](./renderers/类型说明.md#api)

另外注意 button 的 target 值，正好是这个 form 的 name 值 `lidong` 的 formItem 的 name 值 `select`。当按钮的对象是一个 formItem 时，会出发 formItem 的数据重新拉取。

### 数据联动

Form 和 CRUD, CRUD 有个 filter 配置项，里面可以配置表单项，当他提交时 CRUD 自动就会携带接受到的表单数据然后重新获取数据。有个限制，就是 CRUD 和 filter 必须放在一起，不能分开，实际上完全可以分开，只要 Form 的 target 是 CRUD 的 name 值即可。

```schema:height="300"
{
    "type": "page",
    "aside": {
        "type": "form",
        "target": "doc-crud",
        "wrapWithPanel": false,
        "className": "wrapper-xs",
        "controls": [
            {
                "type": "text",
                "name": "keywords",
                "placeholder": "请输入关键字",
                "clearable": true,
                "addOn": {
                    "label": "搜索",
                    "className": "btn-info",
                    "type": "submit"
                }
            }
        ]
    },
    "body": {
        "name": "doc-crud",
        "type": "crud",
        "api": "/api/sample",
        "syncLocation": false,
        "title": null,
        "perPageField":"rn",
        "defaultParams":{
            "rn": 10
        },
        "columns": [
            {
                "name": "id",
                "label": "ID",
                "width": 20,
                "sortable": true
            },
            {
                "name": "engine",
                "label": "Rendering engine",
                "sortable": true,
                "toggled": false
            },
            {
                "name": "browser",
                "label": "Browser",
                "sortable": true
            },
            {
                "name": "platform",
                "label": "Platform(s)",
                "sortable": true
            },
            {
                "name": "version",
                "label": "Engine version"
            }
        ]
    }
}
```

Form 的 target 还可以是另外一个 Form，当 A Form 把自己的数据提交给 B Form 时，A 的数据会被合并到 B Form 中，同时，B Form 会再次初始化，如：拉取 initApi, 重新拉取 formItem 上的 source 等等。 比如用户管理中的[加入用户](/group/test/admin/users?perPage=12)操作就是用这种方式实现的。

```schema:height="300"
{
    "type": "page",
    "aside": {
        "type": "form",
        "target": "doc-form",
        "wrapWithPanel": false,
        "className": "wrapper-xs",
        "controls": [
            {
                "type": "text",
                "name": "keywords",
                "clearable": true,
                "placeholder": "请输入关键字",
                "addOn": {
                    "label": "提交",
                    "className": "btn-info",
                    "type": "submit"
                }
            }
        ]
    },
    "body": {
        "name": "doc-form",
        "type": "form",
        "api": "/api/sample",
        "submitText": null,
        "controls": [
            {
                "type": "static",
                "name": "keywords",
                "label": "你刚刚输入的是："
            }
        ]
    }
}
```
