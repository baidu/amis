---
title: 移动端展现
---

## 移动端原生 UI

从 1.6.0 版本开始，amis 会默认在移动端下使用仿原生 UI 的展现，比如日期选择会从底部弹出。

由于这个仿原生 UI 是新开发的组件，有些 amis PC 版本的高级配置功能还不支持，比如 select 下的搜索过滤等，如果需要这些功能，可以先通过 props 里的 `useMobileUI` 属性关闭。

方法 1：全局关闭

```js
amis.embed(
  '#root',
  {
    // amis schema
  },
  {
    // 这里是初始 props
  },
  {
    theme: 'antd',
    useMobileUI: false
  }
);
```

方法 2：针对某个组件进行关闭

```json
{
  "type": "select",
  "useMobileUI": false
}
```

## 移动端定制配置

有时候我们需要在移动端下展示不同效果，可以通过 `mobile` 属性来在移动端下覆盖部分属性。

```schema: scope="body"
{
  "type": "form",
  "body": [{
    "name": "email",
    "type": "input-email",
    "label": "邮箱：",
    "mobile": {
      "name": "phone",
      "type": "text",
      "label": "电话：",
      "validations": {
        "isPhoneNumber": true
      }
    }
  }]
}
```

请点击上方切换到移动端预览效果。

`mobile` 属性可以出现在配置中的任意地方，替换父节点的任意属性，比如前面的例子可以写成放在 `form` 上替换所有 `body`

```schema: scope="body"
{
  "type": "form",
  "body": [{
    "name": "email",
    "type": "input-email",
    "label": "邮箱："
  }],
  "mobile": {
    "body": [{
      "name": "phone",
      "type": "input-text",
      "label": "电话：",
      "validations": {
        "isPhoneNumber": true
      }
    }]
  }
}
```

> 注意这里对于移动端的判断是根据页面宽度，和 CSS 保持一致，所以即便是在 PC 上，如果页面宽度很小也会切换到 mobile 配置
