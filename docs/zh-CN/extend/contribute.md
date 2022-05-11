---
title: 如何贡献代码
---

如果发现 amis 有不满足的功能，除了发 issue 等官方升级之外，最快的方法就是自己实现它，本文将介绍 amis 代码的基本结构，一步步教会你如何新增功能。

## 准备开始

1. 首先，你需要对 React 有基本了解，快速看一遍[官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)就行。
2. 在 github 上 fork amis 项目到自己的账号下。
3. 创建分支 `git checkout -b feat-xxx`

## amis 代码结构

amis 主要代码在 `src` 和 `scss` 目录下，这里主要介绍 `src` 下的结构：

```
.
├── Root.tsx            // amis 最外层的渲染组件
├── RootRenderer.tsx    // 用于 Root.tsx，拆分一下避免文件太大
├── Schema.ts           // 基础类型定义
├── SchemaRenderer.tsx  // amis 组件渲染的主要入口
├── Scoped.tsx          // 数据域的实现
├── WithRootStore.tsx   // 用于表单项中注入 root context
├── WithStore.tsx       // 用于表单项中的数据存储及同步
├── compat.ts           // 用于兼容旧版的配置，比如将 1.1.x 的配置转成 1.2.x
├── components          // 大部分组件的实现在这里，也有很多内部使用的公共组件，这里的组件也能被其他 React 组件使用
├── env.tsx             // 默认的 env，env 可以由外部传入，比如最常见的是 fetcher，这样就能自己接管网络请求，比如使用客户端中的网络请求方法
├── envOverwrite.ts     // 用于在移动端或不同语言环境下使用不同配置
├── factory.tsx         // amis 渲染的总入口，对外暴露的 render 方法就在这里
├── icons               // 内置的 icon
├── index.tsx           // amis 项目对外的主要入口
├── locale              // 多语言翻译，目前只有英文和德语
├── locale.tsx          // 多语言支持的实现
├── renderers           // 将组件注册到 amis 渲染器中，这里大部分组件是直接引用 components 里的对应组件，也有部分简单的组件是直接在这里实现，
├── store               // mst 存储
├── theme.tsx           // 主题相关的实现
├── themes              // 主题配置，有些主题效果不太好通过 css 实现，就放这了
├── types.ts            // 一些公共的类型定义
└── utils               // amis 内部用的常用工具方法
```

虽然文件很多，但对于组件开发而言，大部分情况下只需要关注 `components` 及 `renderers` 目录下的内容就行，如果发现某个组件不满足需求，可以先在 `renderers` 中找到这个组件，对齐进行修改就行。

下面我们将以一个实际例子来介绍如果新增一个组件。

## 实战：avatar 组件

本文的目标是新增 avatar 头像组件，完整演示如何在 amis 中添加一个新组建，完整实现可以参考这个 [pr](https://github.com/baidu/amis/pull/1684/files)，本文基于这个例子进行了简化。

### 编写 React 组件代码

由于这个组件并不需要被其他组件复用，所以只需要在 `renderers` 目录下实现就好，整体步骤是：

新增 `src/renderers/Avatar.tsx` 文件，内容如下

```tsx
import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema} from '../Schema';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';

// schema 是用来给编辑器提示用的，同时也作为组件 props 的类型定义
export interface AvatarSchema extends BaseSchema {
  // 定义类型
  type: 'avatar';

  // 下面都是这个组件的其他属性参数，这里定义了一个 src
  src?: string;
}

// 大部分组件都是直接继承 RendererProps，里面包含渲染组件所需的常用属性
export interface AvatarProps
  extends RendererProps,
    Omit<AvatarSchema, 'type' | 'className'> {}

// 这个是组件的实现部分
export class AvatarField extends React.Component<AvatarProps, object> {
  render() {
    let {className, src, classnames: cx} = this.props;

    // 所有组件的 classname 都需要使用 cx 函数，并且以大写开头，这是为了方便支持多主题
    return (
      <div className={cx('Avatar', className)}>
        <img src={src} />
      </div>
    );
  }
}

// 将组件注册到 amis 渲染器中
@Renderer({
  type: 'avatar'
})
export class AvatarFieldRenderer extends AvatarField {}
```

上面这段代码中，最核心的就是 `AvatarField`，这就是一个 React 组件。

接下来还需要改两处地方：

- 一个是 `src/Schema.ts`，需要在 `SchemaType` 里加入刚才定义的 `avatar`。
- 另一个是 `src/index.tsx`，增加一行 `import './renders/Avatar';`。

这样就在 amis 中新增了一个组件，接下来我们编写组件所需的样式。

### 编写 SCSS 代码

新组件一般都需要对应的样式，首先创建 `scss/components/_avatar.scss` 文件，内容是：

```css
// 注意必须有这个 #{$ns}，它是为了方便生成主题，比如在 cxd 主题下，会转成 `.cxd-Avatar`
.#{$ns}Avatar {
}
```

然后修改 `scss/themes/_common.scss`，通过 `@import '../components/avatar';` 引入这个新文件。

amis 中的 css 命名使用 [SUIT](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md) 规范，请按照这个规范编写。

如果样式在不同主题下有区别，则需要使用 CSS 变量，在 `scss/_properties.scss` 里定义这个变量的默认值，让后在对应的主题文件中覆盖，比如 `scss/themes/_cxd-variables.scss`。

### 编写文档

新组件还需要有对应的文档来方便其他人了解和使用，首先在 `docs/zh-CN/components/avatar.md` 中创建文件，然后在 `examples/components/Components.tsx` 里引用。

文档编写可以参考其他示例，需要演示这个组件的所有功能。

## 提交 PR

使用 `git push --set-upstream origin feat-xxx` 创建远程分支。

然后通过系统提示的 `https://github.com/xxx/amis/pull/new/feat-xxx` 链接来创建 PR，官方团队会在一个工作日左右回复。
