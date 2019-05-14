### Action

Action 是一种特殊的渲染器，它本身是一个按钮，同时它能触发事件。

#### 通用配置项
所有`actionType`都支持的通用配置项

| 属性名           | 类型      | 默认值      | 说明                                                                                                                                                             |
| ---------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type             | `string`  | `action`    | 指定为 Page 渲染器。                                                                                                                                             |
| actionType       | `string`  | -           | 【必填】这是action最核心的配置，来指定该action的作用类型，支持：`ajax`、`link`、`url`、`dawer`、`dialog`、`confirm`、`cancel`、`prev`、`next`、`copy`、`close`。 |
| label            | `string`  | -           | 按钮文本。可用 `${xxx}` 取值。                                                                                                                                   |
| level            | `string`  | `default`   | 按钮样式，支持：`link`、`primary`、`secondary`、`info`、`success`、`warning`、`danger`、`light`、`dark`、`default`。                                             |
| size             | `string`  | -           | 按钮大小，支持：`xs`、`sm`、`md`、`lg`。                                                                                                                         |
| icon             | `string`  | -           | 设置图标，例如`fa fa-plus`。                                                                                                                                       |
| iconClassName    | `string`  | -           | 给图标上添加类名。                                                                                                                                                 |
| active           | `boolean` | -           | 按钮是否高亮。                                                                                                                                                     |
| activeLevel      | `string`  | -           | 按钮高亮时的样式，配置支持同`level`。                                                                                                                              |
| activeClassName  | `string`  | `is-active` | 给按钮高亮添加类名。                                                                                                                                             |
| block            | `boolean` | -           | 用`display:"block"`来显示按钮。                                                                                                                                    |
| confirmText      | `string`  | -           | 当设置后，操作在开始前会询问用户。可用 `${xxx}` 取值。                                                                                                           |
| reload           | `string`  | -           | 指定此次操作完后，需要刷新的目标组件名字（组件的 name 指，自己配置的），多个请用 `,` 号隔开。                                                                    |
| tooltip          | `string`  | -           | 鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                         |
| disabledTip      | `string`  | -           | 被禁用后鼠标停留时弹出该段文字，也可以配置对象类型：字段为`title`和`content`。可用 `${xxx}` 取值。                                                                 |
| tooltipPlacement | `string`  | `top`       | 如果配置了`tooltip`或者`disabledTip`，指定提示信息位置，可配置`top`、`bottom`、`left`、`right`。                                                                   |

下面会分别介绍每种类型的Action配置项

#### ajax
| 属性名     | 类型                    | 默认值 | 说明                                                                                                                                      |
| ---------- | ----------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| actionType | `string`                | `ajax` | 发送请求                                                                                                                                  |
| api        | `string` 或 `ApiObject` | -      | 请求地址，参考 [api](./Types.md#api) 格式说明。                                                                                           |
| redirect   | `string`                | -      | 指定当前请求结束后跳转的路径，可用 `${xxx}` 取值。                                                                                        |
| feedback   | `DialogObject`          | -      | 如果 ajax 类型的，当 ajax 返回正常后，还能接着弹出一个 dialog 做其他交互。返回的数据可用于这个 dialog 中。格式可参考[Dialog](./Dialog.md) |
| messages   | `object`                | -      | `success`：ajax 操作成功后提示，可以不指定，不指定时以 api 返回为准。`failed`：ajax 操作失败提示。                                        |

#### link
| 属性名     | 类型     | 默认值 | 说明                                                                                                                |
| ---------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| actionType | `string` | `link` | 单页跳转                                                                                                            |
| link       | `string` | `link` | 用来指定跳转地址，跟 url 不同的是，这是单页跳转方式，不会渲染浏览器，请指定 amis 平台内的页面。可用 `${xxx}` 取值。 |

#### url
| 属性名     | 类型      | 默认值  | 说明                                             |
| ---------- | --------- | ------- | ------------------------------------------------ |
| actionType | `string`  | `url`   | 页面跳转                                         |
| url        | `string`  | -       | 按钮点击后，会打开指定页面。可用 `${xxx}` 取值。 |
| blank      | `boolean` | `false` | 如果为 `true` 将在新tab页面打开。                |

#### dialog
| 属性名        | 类型                       | 默认值   | 说明                                          |
| ------------- | -------------------------- | -------- | --------------------------------------------- |
| actionType    | `string`                   | `dialog` | 点击后显示一个弹出框                          |
| dialog        | `string` 或 `DialogObject` | -        | 指定弹框内容，格式可参考[Dialog](./Dialog.md) |
| nextCondition | `boolean`                  | -        | 可以用来设置下一条数据的条件，默认为 `true`。 |

#### drawer
| 属性名     | 类型                       | 默认值   | 说明                                          |
| ---------- | -------------------------- | -------- | --------------------------------------------- |
| actionType | `string`                   | `drawer` | 点击后显示一个侧边栏                          |
| drawer     | `string` 或 `DrawerObject` | -        | 指定弹框内容，格式可参考[Drawer](./Drawer.md) |

#### copy
| 属性名     | 类型     | 默认值 | 说明                                 |
| ---------- | -------- | ------ | ------------------------------------ |
| actionType | `string` | `copy` | 复制一段内容到粘贴板                 |
| content    | `string` | -      | 指定复制的内容。可用 `${xxx}` 取值。 |

#### 其他配置项
| 属性名   | 类型            | 默认值  | 说明                                                                                                        |
| -------- | --------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| close    | `boolean`       | `false` | 当`action`配置在`dialog`或`drawer`的`actions`中时，配置为`true`指定此次操作完后关闭当前`dialog`或`drawer`。 |
| required | `Array<string>` | -       | 配置字符串数组，指定在`form`中进行操作之前，需验证必填的表单项字段                                          |

示例：

-   `ajax` 当按钮点击时，发送 ajax 请求，发送的数据取决于所在的容器里面。

    ```schema:height="200"
    {
      "data": {
        "user": "no one"
      },
      "body": {
        "label": "Post",
        "type": "button",
        "actionType": "ajax",
        "confirmText": "确定？",
        "api": "/api/mock2/form/saveForm",
        "messages": {
          "success": "发送成功"
        }
      }
    }
    ```

-   `link` 当按钮点击后，无刷新进入 amis 内部某个页面。

    ```schema:height="200"
      {
        "body": {
          "label": "进入简介页面",
          "type": "button",
          "level": "info",
          "actionType": "link",
          "link": "/docs/index"
        }
      }
    ```

-   `url` 当按钮点击后，新窗口打开指定页面。

    ```schema:height="200"
      {
        "body": {
          "label": "打开 Baidu",
          "type": "button",
          "level": "success",
          "actionType": "url",
          "url": "raw:http://www.baidu.com"
        }
      }
    ```

-   `dialog` 当按钮点击后，弹出一个对话框。 关于 dialog 配置，请查看 [Dialog 模型](./Dialog.md)。

    ```schema:height="200"
      {
        "body": {
          "label": "Dialog Form",
          "type": "button",
          "level": "primary",
          "actionType": "dialog",
          "dialog": {
            "title": "表单设置",
            "body": {
              "type": "form",
              "api": "/api/mock2/form/saveForm?waitSeconds=1",
              "controls": [
                {
                  "type": "text",
                  "name": "text",
                  "label": "文本"
                }
              ]
            }
          }
        }
      }
    ```

-   `drawer` 当按钮点击后，弹出一个抽出式对话框。 关于 drawer 配置，请查看 [Drawer 模型](./Drawer.md)。

    ```schema:height="200"
      {
        "body": {
          "label": "Drawer Form",
          "type": "button",
          "level": "primary",
          "actionType": "drawer",
          "drawer": {1
            "title": "表单设置",
            "body": {
              "type": "form",
              "api": "/api/mock2/form/saveForm?waitSeconds=1",
              "controls": [
                {
                  "type": "text",
                  "name": "text",
                  "label": "文本"
                }
              ]
            }
          }
        }
      }
    ```
