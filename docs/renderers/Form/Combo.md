### Combo

组合模式，支持自由组合多个表单项。当设置成单选时数据格式为对象，当设置成多选时数据格式为数组，数组成员是对象（flat 模式可以直接是某个表单单项的数值）。

-   `type` 请设置成 `combo`
-   `multiple` 默认为 `false` 配置是否为多选模式
-   `controls` 配置组合成员，所有成员都是横向展示，可以是任意 [FormItem](./FormItem.md)
-   `controls[x].columnClassName` 列的类名，可以用它配置列宽度。默认平均分配。
-   `controls[x].unique` 设置当前列值是否唯一，即不允许重复选择。
-   `maxLength` 当 multiple 为 true 的时候启用，设置可以最大项数。
-   `flat` 默认为 `false`, 是否将结果扁平化(去掉 name),只有当 controls 的 length 为 1 且 multiple 为 true 的时候才有效。
-   `joinValues` 默认为 `true` 当扁平化开启的时候，是否用分隔符的形式发送给后端，否则采用 array 的方式。
-   `delimiter` 当扁平化开启并且 joinValues 为 true 时，用什么分隔符。
-   `multiLine` 默认是横着展示一排，设置以后竖着展示
-   `addable` 是否可新增。
-   `removable` 是否可删除
-   `deleteApi` 如果配置了，则删除前会发送一个 api，请求成功才完成删除！
-   `deleteConfirmText` 默认为 `确认要删除？`，当配置 `deleteApi` 才生效！删除时用来做用户确认！
-   `draggable` 默认为 `false`, 是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个\$id 字段
-   `draggableTip` 可拖拽的提示文字，默认为：`"可通过拖动每行中的【交换】按钮进行顺序调整"`
-   `addButtonText` 新增按钮文字，默认为 `"新增"`。
-   `minLength` 限制最小长度。
-   `maxLength` 限制最大长度。
-   `scaffold` 单组表单项初始值。默认为 `{}`。
-   `canAccessSuperData` 指定是否可以自动获取上层的数据并映射到表单项上，默认是`false`。
-   `conditions` 数组的形式包含所有条件的渲染类型，单个数组内的`test` 为判断条件，数组内的`controls`为符合该条件后渲染的`schema`
-   `typeSwitchable` 是否可切换条件，配合`conditions`使用
-   `formClassName` 单组表单项的类名
-   `noBorder` 单组表单项是否有边框
-   **还有更多通用配置请参考** [FormItem](./FormItem.md)

#### 单行模式

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "单选组合项",
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "combo2",
  "label": "多选组合项",
  "multiple": true,
  "draggable": true,
  "controls": [
    {
      "label": "字段1",
      "name": "a",
      "type": "text"
    },
    {
      "label": "字段2",
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"],
      "unique": true
    }
  ]
},
{
  "type": "static",
  "name": "combo2",
  "label": "当前值"
}
]
```

#### 多行模式。

```schema:height="450" scope="form"
[
{
  "type": "combo",
  "name": "combo",
  "label": "多选组合form",
  "multiple": true,
  "multiLine": true,
  "controls": [
      {
        "label": "字段1",
        "name": "a",
        "type": "text"
      },
      {
        "label": "字段2",
        "name": "b",
        "type": "select",
        "options": ["a", "b", "c"]
      }
    ]

},
{
  "type": "static",
  "name": "combo",
  "label": "当前值"
},

{
  "type": "combo",
  "name": "xxx",
  "label": "单选组合form",
  "multiLine": true,
  "controls": [
    {
      "name": "a",
      "type": "text"
    },
    {
      "name": "b",
      "type": "select",
      "options": ["a", "b", "c"]
    }
  ]
},
{
  "type": "static",
  "name": "xxx",
  "label": "当前值"
}

]
```

#### 条件分支

默认 Combo 渲染的成员是固定表单项的，成员的类型时一致，如果不一致怎么办？这里可以设置条件分支来给不同的成员设置不同的表单项。

如下面的栗子，定义了两种类型：文本和数字，用户新增的时候可以选择是新增文本还是数字。区分是文字和数字的方式是根据成员数据中的 type 字段来决定。

```schema:height="450" scope="form-item"
{
  "type": "combo",
  "name": "combo-conditions2",
  "label": "多选",
  "value": [
    {
      "type": "text"
    }
  ],
  "multiLine": true,
  "multiple": true,
  "typeSwitchable": false,
  "conditions": [
    {
      "label": "文本",
      "test": "this.type === \"text\"",
      "scaffold": {
        "type": "text",
        "label": "文本",
        "name": ""
      },
      "controls": [
        {
          "label": "名称",
          "name": "label",
          "type": "text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "text"
        }
      ]
    },
    {
      "label": "数字",
      "test": "this.type === \"number\"",
      "scaffold": {
        "type": "number",
        "label": "数字",
        "name": ""
      },
      "controls": [
        {
          "label": "名称",
          "name": "label",
          "type": "text"
        },
        {
          "label": "字段名",
          "name": "name",
          "type": "text"
        },
        {
          "label": "最小值",
          "name": "min",
          "type": "number"
        },
        {
          "label": "最大值",
          "name": "max",
          "type": "number"
        },
        {
          "label": "步长",
          "name": "step",
          "type": "number"
        }
      ]
    }
  ]
}
```

-   `conditions` Array<Condition> 数组，每个成员是一种类型
  - `conditions[x].label` 类型名称
  - `conditions[x].test` 表达式，目标成员数据是否属于这个类型？
  - `conditions[x].scaffold` 初始数据，当新增的时候直接使用此数据。
  - `conditions[x].controls` 该类型的表单设置。
- `typeSwitchable` 类型是否允许切换，如果设置成 true 会多一个类型切换的按钮。


#### Tabs 模式

默认成员是一个一个排列的，如果数据比较多优点让人眼花缭乱。所以 Combo 支持了 tabs 的排列方式。

```schema:height="350" scope="form-item"
{
  "type": "combo",
  "name": "combo101",
  "label": "组合多条多行",
  "multiple": true,
  "multiLine": true,
  "value": [
    {}
  ],
  "tabsMode": true,
  "tabsStyle": "card",
  "maxLength": 3,
  "controls": [
    {
      "name": "a",
      "label": "文本",
      "type": "text",
      "placeholder": "文本",
      "value": "",
      "size": "full"
    },
    {
      "name": "b",
      "label": "选项",
      "type": "select",
      "options": [
        "a",
        "b",
        "c"
      ],
      "size": "full"
    }
  ]
}
```

- `tabsMode` boolean 用来开启此模式
- `tabsStyle` string 样式，可选：`line`、`card` 或者 `radio`.
- `tabsLabelTpl` 用来生成标题的模板，默认为：`成员 ${index|plus}`

注意：这是新引入的功能，目前还不支持拖拽组合使用。且此模式只有多选时才能生效。
