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

## 水平展示

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "signature",
            "type": "input-signature",
            "horiz": true,
            "height": 300
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
            "confirmText": "确定",
            "undoText": "上一步",
            "clearText": "重置"
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

## 属性表

| 属性名      | 类型      | 默认值    | 说明               |
| ----------- | --------- | --------- | ------------------ |
| width       | `number`  |           | 组件宽度，最小 300 |
| height      | `number`  |           | 组件高度，最小 160 |
| color       | `string`  | `#000`    | 手写字体颜色       |
| bgColor     | `string`  | `#EFEFEF` | 面板背景颜色       |
| clearText   | `string`  | `清空`    | 清空按钮名称       |
| undoText    | `string`  | `撤销`    | 撤销按钮名称       |
| confirmText | `string`  | `确认`    | 确认按钮名称       |
| horiz       | `boolean` |           | 是否水平展示       |
