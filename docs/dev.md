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
export default class CustomCheckbox extends React.Component {
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

1. 呈现当前值。如以上例子，通过 `this.props.value` 判定如果勾选了则显示`已勾选`，否则显示`请勾选`。
2. 接收用户交互，通过 `this.props.onChange` 修改表单项值。如以上例子，当用户点击按钮时，切换当前选中的值。

至于其他功能如：label/description 的展示、表单验证功能、表单布局（常规、左右或者内联）等等，只要是通过 FormItem 注册进去的都无需自己实现。

需要注意，获取或者修改的是什么值跟配置中 `type` 并列的 `name` 属性有关，也就是说直接关联某个变量，自定义中直接通过 props 下发了某个指定变量的值和修改的方法。如果你想获取其他数据，或者设置其他数据可以看下以下说明：

* `获取其他数据` 可以通过 `this.props.data` 查看，作用域中所有的数据都在这了。
* `设置其他数据` 可以通过 `this.props.onBulkChange`， 比如: `this.props.onBulkChange({a: 1, b: 2})` 等于同时设置了两个值。当做数据填充的时候，这个方法很有用。



#### 自定义验证器

如果 amis [自带的验证](./renderers/Form/FormItem.md#)能满足需求了，则不需要关心。组件可以有自己的验证逻辑。

```jsx
import * as React from 'react';
import {FormItem} from 'amis';
import * as cx from 'classnames';

@FormItem({
    type: 'custom-checkbox',
})
export default class CustomCheckbox extends React.Component {
    validate() {
        // 通过 this.props.value 可以知道当前值。

        return isValid ? '' : '不合法，说明不合法原因。'
    }
    // ... 其他省略了
}
```

上面的栗子只是简单说明，另外可以做`异步验证`，validate 方法可以返回一个 promise。

#### OptionsControl

如果你的表单组件性质和 amis 的 Select、Checkboxes、List 差不多，用户配置配置 source 可通过 API 拉取选项，你可以用 OptionsControl 取代 FormItem 这个注解。

用法是一样，功能方面主要多了以下功能。

* 可以配置 options，options 支持配置 visibleOn hiddenOn 等表达式
* 可以配置 `source` 换成动态拉取 options 的功能，source 中有变量依赖会自动重新拉取。
* 下发了这些 props，可以更方便选项。
    - `options` 不管是用户配置的静态 options 还是配置 source 拉取的，下发到组件已经是最终的选项了。
    - `selectedOptions` 数组类型，当前用户选中的选项。
    - `loading` 当前选项是否在加载
    - `onToggle` 切换一个选项的值
    - `onToggleAll` 切换所有选项的值，类似于全选。

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

### 组件间通信

关于组件间通信，amis 中有个机制就是，把需要被引用的组件设置一个 name 值，然后其他组件就可以通过这个 name 与其通信，比如这个[栗子](./advanced.md#组件间通信)。其实内部是依赖于内部的一个 Scoped Context。你的组件希望可以被别的组件引用，你需要把自己注册进去，默认自定义的非表单类组件并没有把自己注册进去，可以参考以下代码做添加。

```js
import * as React from 'react';
import {Renderer, ScopedContext} from 'amis';
@Renderer({
    test: /(?:^|\/)my\-renderer$/,
})
export class CustomRenderer extends React.Component {
    static contextType = ScopedContext;

    componentWillMount() {
        const scoped = this.context;
        scoped.registerComponent(this);
    }

    componentWillUnmount() {
        const scoped = this.context;
        scoped.unRegisterComponent(this);
    }

    // 其他部分省略了。
}
```

把自己注册进去了，其他组件就能引用到了。同时，如果你想找别的组件，也同样是通过 scoped 这个 context，如： `scoped.getComponentByName("xxxName")` 这样就能拿到目标组件的实例了（前提是目标组件已经配置了 name 为 `xxxName`）。

### 其他功能方法

自定义的渲染器 props 会下发一个非常有用的 env 对象。这个 env 有以下功能方法。

* `env.fetcher` 可以用来做 ajax 请求如： `this.props.env.fetcher('xxxAPi', this.props.data).then((result) => console.log(result))`
* `env.confirm` 确认框，返回一个 promise 等待用户确认如： `this.props.env.confirm('你确定要这么做？').then((confirmed) => console.log(confirmed))`
* `env.alert` 用 Modal 实现的弹框，个人觉得更美观。
* `env.notify` toast 某个消息  如： `this.props.env.notify("error", "出错了")`
* `env.jumpTo` 页面跳转。