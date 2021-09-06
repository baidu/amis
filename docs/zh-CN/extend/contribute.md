---
title: 如何贡献代码
---

如果发现 amis 有不满足的功能，除了发 issue 等官方升级之外，最快的方法就是自己实现它，本文将介绍 amis 代码的基本结构，一步步教会你如何新增功能。

## 准备开始

1. 首先，你需要对 React 有基本了解，快速看一遍[官方文档](https://zh-hans.reactjs.org/docs/getting-started.html)就行。
2. 在 github 上 fork amis 项目到自己的账号下。
3. 创建分支 `git checkout -b feat-xxx`

## amis 代码结构

amis 主要代码在 `src` 和 `scss` 目录下。

## 实战：avatar 组件

本文的目标是新增 avatar 头像组件，完整演示如何在 amis 中添加一个新组建，完整实现可以参考这个 [pr](https://github.com/baidu/amis/pull/1684/files)，本文基于这个例子进行了简化。

### 1 编写 React 组件代码代码

由于这个组件并不需要被其他组件复用，所以只需要在 `renderers` 目录下实现就好，整体步骤是：

新增 `src/renderers/Avatar.tsx` 文件，内容是如下

```tsx
/**
 * @file 用来展示用户头像
 */
import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {
  BaseSchema,
  SchemaClassName,
  SchemaIcon,
  SchemaUrlPath
} from '../Schema';
import {resolveVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

/**
 * Avatar 用户头像显示
 * 文档：https://baidu.gitee.io/amis/docs/components/avatar
 */
export interface AvatarSchema extends BaseSchema {
  /**
   *  指定为用户头像控件
   */
  type: 'avatar';

  /**
   * 图片地址
   */
  src?: string;
}

export interface AvatarProps
  extends RendererProps,
    Omit<AvatarSchema, 'type' | 'className'> {}

export class AvatarField extends React.Component<AvatarProps, object> {
  render() {
    let {className, src} = this.props;

    return (
      <div className={cx('Avatar', className, `Avatar--${shape}`)}>
        <img src={src} />
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)avatar$/,
  name: 'avatar'
})
export class AvatarFieldRenderer extends AvatarField {}
```

### 编写 SCSS 代码

## 提交 PR

使用 `git push --set-upstream origin feat-xxx` 创建远程分支。

然后通过系统提示的 `https://github.com/xxx/amis/pull/new/feat-xxx` 链接来创建 PR，官方团队会在一个工作日左右回复。
