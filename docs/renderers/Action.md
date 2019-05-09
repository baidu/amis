### Action

Action 是一种特殊的渲染器，它本身是一个按钮，同时它能触发事件。

-   `type` 指定为 `button`。
-   `actionType` 【必填】 选项：`ajax`、`link`、`url`、`dawer`、`dialog`、`confirm`、`cancel`、`prev`、`next`、`copy` 或者 `close`。
-   `api` 当 `actionType` 为 `ajax` 时，必须指定，参考 [api](./Types.md#Api) 格式说明。
-   `link` 当 `actionType` 为 `link` 时必须指定，用来指定跳转地址，跟 url 不同的是，这是单页跳转方式，不会渲染浏览器，请指定 AMis 平台内的页面。
-   `url` 当 `actionType` 为 `url` 时必须指定，按钮点击后，会打开指定页面。
-   `blank` 当 `actionType` 为 `url` 时可选，如果为 false 将在本页面打开。
-   `dialog` 当 `actionType` 为 `dialog` 时用来指定弹框内容。
-   `dawer` 当 `actionType` 为 `drawer` 时用来指定抽出式弹框内容。
-   `copy` 当 `actionType` 为 `copy` 时用来指定复制的内容。
-   `nextCondition` 当 `actionType` 为 `dialog` 时可以用来设置下一条数据的条件，默认为 `true`。
-   `confirmText` 当设置 `confirmText` 后，操作在开始前会询问用户。
-   `reload` 指定此次操作完后，需要刷新的目标组件名字（组件的 name 指，自己配置的），多个请用 `,` 号隔开。
-   `feedback` 如果 ajax 类型的，当 ajax 返回正常后，还能接着弹出一个 dialog 做其他交互。返回的数据可用于这个 dialog 中。
-   `messages`，actionType 为 `ajax` 时才有用。
    -   `success` ajax 操作成功后提示，可以不指定，不指定时以 api 返回为准。
    -   `failed` ajax 操作失败提示。

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

-   `link` 当按钮点击后，无刷新进入 AMis 内部某个页面。

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
