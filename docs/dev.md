---
title: 自定义组件
shortname: dev
---

自定义组件共分为两大类，表单类(FormItem和OptionControl)和非表单类(Renderer)。[示例页面](http://amis.baidu.com/group/demo/custom)

> amis是基于React进行开发的，所以更推荐使用React开发自定义组件，如果实在不熟悉React也没关系，平台也支持使用 [Vue](#vue) 和 [San](#san)

## React

### FormItem

```jsx
import * as React from 'react';
import {FormItem} from 'amis';
import * as cx from 'classnames';

@FormItem({
    type: 'custom-checkbox',
})
export default class CustomCheckbox extends React.PureComponent {
    toggle = () => {
        const {value, onChange} = this.props;

        onChange(!value);
    };

    render() {
        const {value} = this.props;
        const checked = !!value;

        return (
            <div>
                <a
                    className={cx('btn btn-default', {
                        'btn-success': checked,
                    })}
                    onClick={this.toggle}
                >
                    {checked ? '已勾选' : '请勾选'}
                </a>
                <div className="inline m-l-xs">{checked ? '已勾选' : '请勾选'}</div>
            </div>
        );
    }
}
```

表单项开发主要关心两件事。

1. 呈现当前值。如以上例子，勾选了则显示`已勾选`，否则显示`请勾选`。
2. 接收用户交互，修改表单项值。如以上例子，当用户点击按钮时，切换当前选中的值。

至于其他功能如：label/description 的展示、表单验证功能、表单布局（常规、左右或者内联）等等，只要是通过 FormItem 注册进去的都无需自己实现。

#### 使用方法

有了这个代码后，页面配置 form 的 controls 里面就可以通过这样的配置启动了。

```js
{
    // 其他信息省略了。。
    type: 'form',
    controls: [
        {
            type: 'custom-checkbox',
            name: '变量名',
            label: '自定义组件。'
        }
    ]
}
```

### Renderer

非表单类的组件自定义，主要通过 `Renderer` 实现。在开始阅读之前，请先阅读 [amis 工作原理](./sdk.md#工作原理)。

```jsx
import * as React from 'react';
import {Renderer} from 'amis';

@Renderer({
    test: /(^|\/)my\-renderer$/,
})
class CustomRenderer extends React.Component {
    render() {
        const {tip, body, render} = this.props;

        return (
            <div>
                <p>这是自定义组件：{tip}</p>
                {body ? (
                    <div className="container">
                        {render('body', body, {
                            // 这里的信息会作为 props 传递给子组件，一般情况下都不需要这个
                        })}
                    </div>
                ) : null}
            </div>
        );
    }
}
```

这里注册一个 React 组件，当节点的 path 信息是 `my-renderer` 结尾时，交给当前组件来完成渲染。

请注意 `this.props` 中的 `render` 方法，它用来实现容器功能，通过它可以让使用者动态的配置其他渲染模型。

## Vue
Vue的实现思路非常简单，可以看[这里](https://github.com/baidu/amis/issues/31)，平台基于此进行了一层封装以便用户使用，且内置了[Element](https://element.eleme.cn/2.0/#/zh-CN)作为UI组件库。以下示例代码则都基于UI库，当然你也完全可以不依赖UI库。

> 组件的使用方法同 [React](#使用方法)

### FormItem
下面示例将实现一个简单的自定义输入框组件：

```jsx
import { FormItem } from 'amis/vue';

@FormItem({
    type: 'vue-text'
})
class VueText {

    // 这里v-model直接绑定amis中的value属性
    template = `<el-input v-model="value" placeholder="请输入内容"></el-input>`;

    watch = {
        value: function (newValue, oldValue) {
            // 可以触发amis的onChange事件，进行表单项的修改且同步给amis
            this.$emit('change', newValue);
        }
    }
}
```

### OptionControl
OptionControl也是FormItem的一种，只是更适用于例如下拉框选择器这类的组件，在这里我们实现一个简单的下拉框选择器

```jsx
import { OptionsControl } from 'amis/vue';

@OptionsControl({
    type: 'vue-select'
})
class VueSelect {

    // 这里v-model直接绑定amis中的value属性，而且绑定amis的options变量，
    // 这样就可以和其他amis组件一样通过source配置远程拉取数据接口，并将拉取到的数据同步到options变量中，例如：
    // {
    //   "type": "vue-select",
    //   "label": "Vue-Select",
    //   "name": "vueSelect",
    //   "source": "/api/mock2/form/getOptions?waitSeconds=1"
    // }
    template = `<template>
        <el-select v-model="value" placeholder="请选择">
            <el-option
                v-for="item in options" // 这里直接使用amis的options变量，source拉取完数据后会自动同步到这个变量中
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </template>`;

    watch = {
        value: function (newValue, oldValue) {
            // 可以触发amis的onChange事件，进行表单项的修改
            this.$emit('change', newValue);
        }
    }
}
```

### Renderer

```jsx
import { Renderer } from 'amis/vue';

@Renderer({
    test: /(^|\/)vue\-button$/
})
class VueButton {
    template = `
    <div>
        这是一个Element-UI按钮

        <el-button @click="visible = true">按钮1</el-button> // 这里触发一个Element的弹框
        <el-dialog :visible.sync="visible" title="Hello world">
            <p>欢迎使用 Element</p>
        </el-dialog>

        <el-button @click="handleClick">按钮2</el-button> // 这里则触发一个amis的弹框
    </div>
    `;
    data = {
        visible: false
    };

    methods = {
        handleClick()  {
            // 触发amis的onAction事件，调起弹框
            this.$emit('action', [
                null,
                {
                    actionType: 'dialog',
                    dialog: {
                        title: '来个弹框',
                        body: 'Bom Bom Bom ${a} ${b}'
                    }
                },
                {
                    a: 1,
                    b: 2
                }
            ]);
        }
    };
}
```

## San
`San`内置了 [San-Mui](https://ecomfe.github.io/san-mui/#/guide/installation) 作为UI组件库。

> 组件的使用方法同 [React](#使用方法)

### FormItem
这里我们同样实现一个简单的Text输入框组件

```jsx
import * as san from 'san';
import { FormItem } from 'amis/san';
import { TextField } from 'san-mui';

@FormItem({
    type: 'san-text'
})
class SanComponent extends san.Component {

    constructor(options) {
        super(options);
        // .....
    }

    // value 直接绑定 amis 的 value
    static template = `
        <div>
            <san-text-field hintText="提示文字" inputValue="{=value=}"/>
        </div>
    `;

    static components = {
        'san-text-field': TextField,
    };

    attached() {
        this.watch('value', (value) => {
            // 可以触发amis的onChange事件，进行表单项的修改
            this.dispatch('change', value);
        });
    };

    initData() {
        return {
            value: ''
        };
    }
}
```

### OptionsControl
这里实现一个简单的List组件
```jsx
import * as san from 'san';
import {
    OptionsControl
} from 'amis/san';

@OptionsControl({
    type: 'san-list'
})
export class SanListControl extends san.Component {

    // 这里还是直接绑定 options 变量，通过配置 source 拉取远端数据，自动同步到options中
    static template = `
        <template>
            <div class="a-ListControl-item {{value === opt.value ? 'is-active' : ''}}" s-for="opt in options" on-click="onClick(opt)">
                <div class="a-ListControl-itemLabel">
                    {{opt.label}}
                </div>
            </div>
        </template>
    `
    onClick(option) {
        // 触发 amis 的 onChange 事件
        this.dispatch('change', option.value);
    }
 }
```

### Renderer

```jsx
import * as san from 'san';
import { Renderer } from 'amis/san';
import { Button } from 'san-mui';

@Renderer({
    test: /(^|\/)san\-button$/,
})
class SanComponent extends san.Component {

    constructor(options) {
        super(options);
        // .....
    }

    static template = `
        <template>
            <section>
                <san-button variants="raised primary" on-click="handleClick">主色</san-button>
                <san-button variants="raised secondery" on-click="handleClick">次色</san-button>
                <san-button variants="raised danger" on-click="handleClick">危险</san-button>
                <san-button variants="raised warning" on-click="handleClick">警告</san-button>
                <san-button variants="raised success" on-click="handleClick">成功</san-button>
                <san-button variants="raised info" on-click="handleClick">通知</san-button>
                <san-button variants="raised info" disabled="{{!0}}" on-click="handleClick">禁用</san-button>
            </section>
        </template>
    `;

    static components = {
        'san-button': Button
    };

    handleClick() {
        // 触发 amis 的 onAction 事件
        this.dispatch('action', [
            null,
            {
                actionType: 'dialog',
                dialog: {
                    title: '来个弹框',
                    body: 'Bom Bom Bom ${a} ${b}'
                }
            },
            {
                a: 1,
                b: 2
            }
        ])
    }

}
```

## 暴露的变量及方法
各种类型的组件都可以直接获取amis已支持的配置项，例如label、name或者value等等，除此之外还暴露了一些属性和方法方便开发。

### 属性
- `selectedOptions`：使用`OptionControl`类型注册器时可用，当前表单项已选中的`options`

### 方法
- `render`：渲染器方法，可以在自定义组件中渲染已有的amis组件，参数：
  - `region`：给当前组件设置一个key
  - `node`：amis组件的配置项
  - `subProps`：可以不填，额外的一些配置项
- `onAction`：所有类型的注册器都可用，具体使用方法可以参考上述代码示例。参数：
  - `e`：可以忽略，传入`null`就行了
  - `action`：传入你想要执行的动作，可以参考 [Action](./renderers/Action.md)
  - `ctx`：给当前`Action`内传入一些数据
- `onChange`：当使用`FormItem`和`OptionControl`时可用，修改当前表单项组件的值，参数：
  - `value`：新的值
- `setOptions`：使用`OptionControl`类型注册器时可用，手动设置 `options` 变量，参数：
  - `options`：新的`options`，需要符合amis选项规则

## 工具

目前主要提供以下工具。

### fetch

```jsx
import {fetch} from 'amis/utils';
```

用来做 ajax 请求。参数说明

-   `api` 字符串或者 api 对象，如： {url: 'http://www.baidu.com', method: 'get'}, api 地址支持变量。
-   `data` 数据体

返回一个 Promise。

如：

```js
import {fetch} from 'amis/utils';

fetch('http://www.baidu.com/api/xxx?a=${a}&b=${b}', {
    a: 'aa',
    b: 'bb',
}).then(function(result) {
    console.log(result);
});
```

### filter

```jsx
import {filter} from 'amis/utils';
```

主要用来做字符替换，如：

```js
import {filter} from 'amis/utils';

filter('blabla?a={a}', {a: 123}); // => 'blabla?a=123'
```
