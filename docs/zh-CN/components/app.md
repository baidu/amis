---
title: App 多页应用
description:
type: 0
group: ⚙ 组件
menuName: App 多页应用
icon:
order: 99
---

用于实现多页应用，适合于全屏模式，如果只是局部渲染请不要使用。

## 基本用法

类型定义为 `app`，通过 pages 定义页面，支持层级，支持内嵌 schema，或者 通过 schemaApi 远程拉取页面，完整用法请参考 [amis-admin](https://github.com/aisuda/amis-admin) 项目里的代码示例，需要修改 `env`：

```json
{
  "type": "app",
  "brandName": "应用名称",
  "pages": [
    {
      "label": "分组1",
      "children": [
        {
          "label": "父页面",
          "url": "/parent",
          "children": [
            {
              "label": "子页面",
              "url": "pageA",
              "schema": {
                "type": "page",
                "title": "Page A"
              }
            }
          ]
        }
      ]
    }
  ]
  ...
}
```

## 属性说明

- `type` 请配置成 `app`
- `api` 页面配置接口，如果你想远程拉取页面配置请配置。返回配置路径 `json>data>pages`，具体格式请参考 `pages` 属性。
- `brandName` 应用名称。
- `logo` 支持图片地址，或者 svg。
- `className` css 类名。
- `header` 顶部区域。
- `asideBefore` 页面菜单上前面区域。
- `asideAfter` 页面菜单下前面区域。
- `footer` 页面。
- `pages` `Array<页面配置>`具体的页面配置。
  通常为数组，数组第一层为分组，一般只需要配置 label 集合，如果你不想分组，直接不配置，真正的页面请在第二层开始配置，即第一层的 children 中。

  具体的页面配置也支持属性结构，每层有以下配置。

  - `label` 菜单名称。
  - `icon` 菜单图标，比如：fa fa-file.
  - `url` 页面路由路径，当路由命中该路径时，启用当前页面。当路径不是 `/` 打头时，会连接父级路径。比如：父级的路径为 `folder`，而此时配置 `pageA`, 那么当页面地址为 `/folder/pageA` 时才会命中此页面。当路径是 `/` 开头如： `/crud/list` 时，则不会拼接父级路径。另外还支持 `/crud/view/:id` 这类带参数的路由，页面中可以通过 `${params.id}` 取到此值。
  - `schema` 页面的配置，具体配置请前往 [Page 页面说明](./page)
  - `schemaApi` 如果想通过接口拉取，请配置。返回路径为 `json>data`。schema 和 schemaApi 只能二选一。
  - `link` 如果想配置个外部链接菜单，只需要配置 link 即可。
  - `redirect` 跳转，当命中当前页面时，跳转到目标页面。
  - `rewrite` 改成渲染其他路径的页面，这个方式页面地址不会发生修改。
  - `isDefaultPage` 当你需要自定义 404 页面的时候有用，不要出现多个这样的页面，因为只有第一个才会有用。
  - `visible` 有些页面可能不想出现在菜单中，可以配置成 `false`，另外带参数的路由无需配置，直接就是不可见的。
  - `className` 菜单类名。

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.2 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数 | 说明                                                |
| -------- | -------- | --------------------------------------------------- |
| didMount | -        | 组件实例被创建并插入 DOM 中时触发。2.4.1 及以上版本 |

## 动作表

| 动作名称 | 动作配置                   | 说明             |
| -------- | -------------------------- | ---------------- |
| reload   | -                          | 刷新（重新加载） |
| setValue | `value: object` 更新的数据 | 更新数据         |
