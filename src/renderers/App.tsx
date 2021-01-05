import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';
import {SchemaNode} from '../types';

export interface AppPage {
  /**
   * 菜单文字
   */
  label?: string;

  /**
   * 菜单图标，比如： fa fa-file
   */
  icon?: string;

  /**
   * 路由规则。比如：/banner/:id。当地址以 / 打头，则不继承上层的路径，否则将集成父级页面的路径。
   */
  url?: string;

  /**
   * 不要出现多个，如果出现多个只有第一个有用。在路由找不到的时候作为默认页面。
   */
  isDefaultPage?: boolean;

  /**
   * 二选一，如果配置了 url 一定要配置。否则不知道如何渲染。
   */
  schema?: any;
  schemaApi?: any;

  /**
   * 单纯的地址。可以设置外部链接。
   */
  link?: string;

  /**
   * 支持多层级。
   */
  children?: Array<AppPage>;

  /**
   * 菜单上的类名
   */
  className?: SchemaClassName;

  /**
   * 是否在导航中可见，适合于那种需要携带参数才显示的页面。比如具体某个数据的编辑页面。
   */
  visible?: boolean;

  /**
   * 默认是自动，即：自己选中或者有孩子节点选中则展开。
   * 如果配置成 always 或者配置成 true 则永远展开。
   * 如果配置成 false 则永远不展开。
   */
  expanded?: 'auto' | 'always' | boolean;
}

/**
 * App 渲染器，适合 JSSDK 用来做多页渲染。
 */
export interface AppSchema extends BaseSchema {
  /**
   * 指定为 app 类型。
   */
  type: 'app';

  /**
   * 系统名称
   */
  brandName?: string;

  /**
   * logo 图片地址，可以是 svg。
   */
  logo?: string;

  /**
   * 顶部区域
   */
  header?: SchemaCollection;

  /**
   * 边栏菜单前面的区域
   */
  asideBefore?: SchemaCollection;

  /**
   * 边栏菜单后面的区域
   */
  asideAfter?: SchemaCollection;

  /**
   * 页面集合。
   */
  pages: Array<AppPage> | AppPage;

  /**
   * 底部区域。
   */
  footer?: SchemaCollection;

  /**
   * css 类名。
   */
  className?: SchemaClassName;
}

export interface AppProps extends RendererProps, AppSchema {
  children?: JSX.Element | ((props?: any) => JSX.Element);
}

export default class App extends React.Component<AppProps, object> {
  static propsList: Array<string> = [
    'brandName',
    'logo',
    'header',
    'asideBefore',
    'asideAfter',
    'pages',
    'footer'
  ];
  static defaultProps = {};

  render() {
    const {className, size, classnames: cx} = this.props;

    return (
      <div
        className={cx('Wrapper', size ? `Wrapper--${size}` : '', className)}
      ></div>
    );
  }
}

@Renderer({
  test: /(^|\/)app$/,
  name: 'app'
})
export class AppRenderer extends App {}
