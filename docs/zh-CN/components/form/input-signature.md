---
title: inputSignature 签名面板
description:
type: 0
group: null
menuName: inputSignature
icon:
order: 62
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "label": "手写签名",
            "height": 200
        }
    ]
}
```

## 自定义按钮名称

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "height": 160,
            "confirmBtnLabel": "确定",
            "undoBtnLabel": "上一步",
            "clearBtnLabel": "重置"
        }
    ]
}
```

## 自定义颜色

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "label": "手写签名",
            "height": 200,
            "color": "#ff0000",
            "bgColor": "#fff"
        }
    ]
}
```

## 配合图片组件实现实时预览

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "label": "手写签名",
            "height": 200
        },
        {
            "type": "image",
            "name": "signature"
        }
    ]
}
```

## 内嵌模式

在内嵌模式下，组件会以按钮的形式展示，点击按钮后弹出一个容器，用户可以在容器中完成签名。更适合在移动端使用。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "label": "手写签名",
            "embed": true
        }
    ]
}
```

## 属性表

| 属性名            | 类型                           | 默认值     | 说明                                 |
| ----------------- | ------------------------------ | ---------- | ------------------------------------ |
| width             | `number`                       |            | 组件宽度，最小 300                   |
| height            | `number`                       |            | 组件高度，最小 160                   |
| color             | `string`                       | `#000`     | 手写字体颜色                         |
| bgColor           | `string`                       | `#EFEFEF`  | 面板背景颜色                         |
| clearBtnLabel     | `string`                       | `清空`     | 清空按钮名称                         |
| undoBtnLabel      | `string`                       | `撤销`     | 撤销按钮名称                         |
| confirmBtnLabel   | `string`                       | `确认`     | 确认按钮名称                         |
| embed             | `boolean`                      |            | 是否内嵌                             |
| embedConfirmLabel | `string`                       | `确认`     | 内嵌容器确认按钮名称                 |
| ebmedCancelLabel  | `string`                       | `取消`     | 内嵌容器取消按钮名称                 |
| embedBtnIcon      | `string`                       |            | 内嵌按钮图标                         |
| embedBtnLabel     | `string`                       | `点击签名` | 内嵌按钮文案                         |
| uploadApi         | [API](../../../docs/types/api) |            | 上传签名图片接口，仅在内嵌模式下生效 |
