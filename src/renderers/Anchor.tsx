import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {Anchor as CAnchor, AnchorSection} from '../components/Anchor';
import {isVisible, autobind} from '../utils/helper';
import {filter} from '../utils/tpl';
import {find} from 'lodash';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';

/**
 * AnchorSection 锚点区域渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/anchor
 */

export type AnchorSectionSchema = {
  /**
   * 文字说明
   */
  title: string;

  /**
   * 锚点链接
   */
  href?: string;

  /**
   * 内容
   */
  body?: SchemaCollection;
} & Omit<BaseSchema, 'type'>;

/**
 * Anchor 锚点渲染器
 * 文档：https://baidu.gitee.io/amis/docs/components/anchor
 */
export interface AnchorSchema extends BaseSchema {
  /**
   * 指定为 Anchor 锚点渲染器
   */
  type: 'anchor';

  /**
   * 楼层集合
   */
  links: Array<AnchorSectionSchema>;

  /**
   * 被激活（定位）的楼层
   */
  active?: string | number;

  /**
   * 样式名
   */
  className?: SchemaClassName;

  /**
   * 导航样式名
   */
  linkClassName?: SchemaClassName;

  /**
   * 楼层样式名
   */
  sectionClassName?: SchemaClassName;
}

export interface AnchorProps
  extends RendererProps,
    Omit<AnchorSchema, 'className' | 'linkClassName' | 'sectionClassName'> {
  active?: string | number;
  sectionRender?: (
    section: AnchorSectionSchema,
    props: AnchorProps,
    index: number
  ) => JSX.Element;
}

export interface AnchorState {
  active: any;
}

export default class Anchor extends React.Component<AnchorProps, AnchorState> {
  static defaultProps: Partial<AnchorProps> = {
    className: '',
    linkClassName: '',
    sectionClassName: ''
  };

  renderSection?: (
    section: AnchorSectionSchema,
    props: AnchorProps,
    index: number
  ) => JSX.Element;

  constructor(props: AnchorProps) {
    super(props);

    // 设置默认激活项
    const links = props.links;
    let active: any = 0;

    if (typeof props.active !== 'undefined') {
      active = props.active;
    } else {
      const section: AnchorSectionSchema = find(
        links,
        section => section.href === props.active
      ) as AnchorSectionSchema;
      active =
        section && section.href
          ? section.href
          : (links[0] && links[0].href) || 0;
    }

    this.state = {
      active
    };
  }

  @autobind
  handleSelect(key: any) {
    this.setState({
      active: key
    });
  }

  @autobind
  locateTo(index: number) {
    const {links} = this.props;

    Array.isArray(links) &&
      links[index] &&
      this.setState({
        active: links[index].href || index
      });
  }

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      className,
      linkClassName,
      sectionClassName,
      sectionRender,
      render,
      data
    } = this.props;

    let links = this.props.links;
    if (!links) {
      return null;
    }

    links = Array.isArray(links) ? links : [links];
    let children: Array<JSX.Element | null> = [];

    children = links.map((section, index) =>
      isVisible(section, data) ? (
        <AnchorSection
          {...(section as any)}
          title={filter(section.title, data)}
          key={index}
          name={section.href || index}
        >
          {this.renderSection
            ? this.renderSection(section, this.props, index)
            : sectionRender
            ? sectionRender(section, this.props, index)
            : render(`section/${index}`, section.body || '')}
        </AnchorSection>
      ) : null
    );

    return (
      <CAnchor
        classPrefix={ns}
        classnames={cx}
        className={className}
        linkClassName={linkClassName}
        sectionClassName={sectionClassName}
        onSelect={this.handleSelect}
        active={this.state.active}
      >
        {children}
      </CAnchor>
    );
  }
}

@Renderer({
  test: /(^|\/)anchor$/,
  name: 'anchor'
})
export class AnchorRenderer extends Anchor {}
