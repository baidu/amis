---
title: 图文列表
description:
type: 0
group: ⚙ 组件
menuName: DynamicList 图文列表
icon:
order: 45
---

## 基本用法

```schema: scope="body"
{
    "type": "dynamic-list",
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证，分钟级搭建表单、MIS、CRM、OA等智能化、免运维的企业级业务系统与项目应用，助力企业降本增效，实现业务智能化升级。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景；应用模板与导入导出能力，实现对典型案例及历史应用版本的高效复用，大大降低开发成本，提高项目开发效率。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；通过外部数据源接入保障企业信息统一性，实现业务数据的拓展与融合处理。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，可结合导航、表单向导、按钮组件及强大的代码自定义能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

## 配置一行展示多列

```schema: scope="body"
{
    "type": "dynamic-list",
    "columns": 2,
    "columnSpace": 10,
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证，分钟级搭建表单、MIS、CRM、OA等智能化、免运维的企业级业务系统与项目应用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景；应用模板与导入导出能力，实现对典型案例及历史应用版本的高效复用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；通过外部数据源接入保障企业信息统一性，实现业务数据的拓展与融合处理。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，可结合导航、表单向导、按钮组件及强大的代码自定义能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

## 配置样式

```schema: scope="body"
{
    "type": "dynamic-list",
    "itemStyle": {
        "border": "1px solid #999",
        "margin": "10px 10px"
    },
    "imgStyle": {
        "width": "200px",
        "height": "200px",
    },
    "titleStyle": {
        "fontFamily": "微软雅黑"
    },
    "descriptionStyle": {
        "color": "rgb(96, 98, 102)"
    },
    "footerStyle": {
        "fontStyle": "oblique"
    },
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证，分钟级搭建表单、MIS、CRM、OA等智能化、免运维的企业级业务系统与项目应用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景；应用模板与导入导出能力，实现对典型案例及历史应用版本的高效复用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；通过外部数据源接入保障企业信息统一性，实现业务数据的拓展与融合处理。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，可结合导航、表单向导、按钮组件及强大的代码自定义能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

## 展示模式

### 右图左文

```schema: scope="body"
{
    "type": "dynamic-list",
    "mode": "right",
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证，分钟级搭建表单、MIS、CRM、OA等智能化、免运维的企业级业务系统与项目应用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景；应用模板与导入导出能力，实现对典型案例及历史应用版本的高效复用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；通过外部数据源接入保障企业信息统一性，实现业务数据的拓展与融合处理。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，可结合导航、表单向导、按钮组件及强大的代码自定义能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

### 上图下文

```schema: scope="body"
{
    "type": "dynamic-list",
    "mode": "top",
    "columns": 2,
    "columnSpace": 10,
    "imgStyle": {
        "width": "auto",
        "height": "200px",
    },
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证、免运维的企业级业务系统与项目应用。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

### 下图上文

```schema: scope="body"
{
    "type": "dynamic-list",
    "mode": "bottom",
    "columns": 2,
    "columnSpace": 10,
    "imgStyle": {
        "width": "auto",
        "height": "200px",
    },
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证、免运维的企业级业务系统与项目应用。",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景。",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

## 自定义SchemaNode

```schema: scope="body"
{
    "type": "dynamic-list",
    "items": [
       {
            "title": "爱速搭低代码平台",
            "description": "更灵活、更智能、更强大的应用可视化设计与发布平台，百度内部深度实战验证，分钟级搭建表单、MIS、CRM、OA等智能化、免运维的企业级业务系统与项目应用，助力企业降本增效，实现业务智能化升级。",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "footer": [
                {
                    "label": "ajax请求",
                    "type": "button",
                    "actionType": "ajax",
                    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm"
                },
                {
                    "type": "link",
                    "href": "https://www.baidu.com",
                    "body": "百度一下，你就知道"
                }
            ],
       },
       {
            "title": "0代码搭建，所见即所得",
            "description": "通过拖拽组件与简单配置即可完成基础应用功能设计，配合自定义代码能力，可满足大多数应用开发场景；应用模板与导入导出能力，实现对典型案例及历史应用版本的高效复用，大大降低开发成本，提高项目开发效率。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "模型引擎，一键应用生成",
            "description": "面向业务的模型设计引擎，可可视化定义数据处理与流转逻辑，并一键生成应用页面；通过外部数据源接入保障企业信息统一性，实现业务数据的拓展与融合处理。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       },
       {
            "title": "业务规则随心定制",
            "description": "支持丰富、灵活的应用业务逻辑定义和控制能力，可结合导航、表单向导、按钮组件及强大的代码自定义能力，以及细粒度的数据流转与关联能力，极大程度地满足了企业实际业务需求。",
            "footer": "2021-01-05",
            "imgUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80"
       }
    ]
}
```

## 属性表

| 属性名                 | 类型                                 | 默认值                              | 说明                                   |
| ---------------------- | ------------------------------------ | ----------------------------------- | -------------------------------------- |
| type                   | `string`                             | `"dynamic-list"`                    | 指定为图文动态列表渲染器                    |
| className              | `string`                             |                                     | 外层 Dom 的类名                        |
| mode                   |  `string`                            |  `left`                             | 图片放置位置，取值可以是 `left`、`right`、`top`、`bottom`                           |
| columns                 | `number`                            |   `1`                               | 一行展示列数置                        |
| columnSpace             | `number`                            |    `0`                              | 列间距                        |
| items                   | `Array`                             |    `[]`                             | 展示数据                       |
| items.title             | [SchemaNode](../types/schemanode)   |                                     | 标题                                   |
| items.description       | [SchemaNode](../types/schemanode)   |                                     | 描述                                 |
| items.footer            | [SchemaNode](../types/schemanode)   |                                     | 底部内容                                   |
| style                   | Object                              |                                     | 自定义样式                        |
| itemStyle               | Object                              |                                     | list item自定义样式                        |
| imgStyle                | Object                              |                                     | 图片自定义样式                        |
| titleStyle              | Object                              |                                     | 标题自定义样式                        |
| descriptionStyle        | Object                              |                                     | 描述自定义样式                        |
| footerStyle             | Object                              |                                     | 底部内容自定义样式               |
