---
title: 自定义组件
shortname: dev
---

自定义组件主要分两类。表单类和非表单类。

### FormItem

即表单类，它主要用来扩充表单项。先看个例子。

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

表单项开发主要关心两件事。

1. 呈现当前值。如以上例子，勾选了则显示`已勾选`，否则显示`请勾选`。
2. 接收用户交互，修改表单项值。如以上例子，当用户点击按钮时，切换当前选中的值。

至于其他功能如：label/description 的展示、表单验证功能、表单布局（常规、左右或者内联）等等，只要是通过 FormItem 注册进去的都无需自己实现。

### Renderer

非表单类的组件自定义，主要通过 `Renderer` 实现。在开始阅读之前，请先阅读 [amis 工作原理](./sdk#工作原理)。

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
