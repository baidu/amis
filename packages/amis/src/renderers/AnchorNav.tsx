import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {AnchorNav as CAnchorNav, AnchorNavSection} from 'amis-ui';
import {isVisible, autobind} from 'amis-core';
import {filter} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaCollection} from '../Schema';

/**
 * AnchorNavSection 锚点区域渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/anchor-nav
 */

export type AnchorNavSectionSchema = {
  /**
   * 导航文字说明
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

  /**
   * 子节点
   */
  children?: Array<AnchorNavSectionSchema>;
} & Omit<BaseSchema, 'type'>;

/**
 * AnchorNav 锚点导航渲染器
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/anchor-nav
 */
export interface AnchorNavSchema extends BaseSchema {
  /**
   * 指定为 AnchorNav 锚点导航渲染器
   */
  type: 'anchor-nav';

  /**
   * 楼层集合
   */
  links: Array<AnchorNavSectionSchema>;

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

  direction?: 'vertical' | 'horizontal';
}

export interface AnchorNavProps
  extends RendererProps,
    Omit<AnchorNavSchema, 'className' | 'linkClassName' | 'sectionClassName'> {
  active?: string | number;
  sectionRender?: (
    section: AnchorNavSectionSchema,
    props: AnchorNavProps,
    index: number | string
  ) => JSX.Element;
}

export interface AnchorNavState {
  active: any;
}

export default class AnchorNav extends React.Component<
  AnchorNavProps,
  AnchorNavState
> {
  static defaultProps: Partial<AnchorNavProps> = {
    className: '',
    linkClassName: '',
    sectionClassName: ''
  };

  renderSection?: (
    section: AnchorNavSectionSchema,
    props: AnchorNavProps,
    index: number | string
  ) => JSX.Element;

  constructor(props: AnchorNavProps) {
    super(props);

    // 设置默认激活项
    const links = props.links;
    let active: any = 0;

    if (typeof props.active !== 'undefined') {
      active = props.active;
    } else {
      let section: AnchorNavSectionSchema | null = this.getActiveSection(
        links,
        props.active,
        null
      );

      active =
        section && section.href
          ? section.href
          : (links[0] && links[0].href) || 0;
    }
    this.state = {
      active
    };
  }

  // 获取激活的内容区
  getActiveSection(
    links: Array<AnchorNavSectionSchema>,
    active: string | number | undefined,
    section: AnchorNavSectionSchema | null
  ) {
    if (section) {
      return section;
    }
    links.forEach(link => {
      if (link.href === active) {
        section = link;
      } else {
        if (link.children) {
          this.getActiveSection(link.children, active, section);
        }
      }
    });
    return section;
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

  renderSections(links: AnchorNavSectionSchema[], parentIdx?: string | number) {
    const {
      classnames: cx,
      classPrefix: ns,
      sectionRender,
      render,
      data
    } = this.props;

    links = Array.isArray(links) ? links : [links];
    let children: Array<JSX.Element | null> = [];

    links.forEach((section, index) => {
      if (isVisible(section, data)) {
        // 若有子节点，key为parentIdx-index
        let curIdx = (parentIdx ? parentIdx + '-' : '') + index;

        children.push(
          /** 内容区 */
          <AnchorNavSection
            {...(section as any)}
            title={filter(section.title, data)}
            key={curIdx}
            name={section.href || curIdx}
          >
            {this.renderSection
              ? this.renderSection(section, this.props, curIdx)
              : sectionRender
              ? sectionRender(section, this.props, curIdx)
              : render(`section/${curIdx}`, section.body || '')}
          </AnchorNavSection>
        );
        if (section.children) {
          children.push(...this.renderSections(section.children, curIdx));
        }
      }
    });
    return children.filter(item => !!item);
  }

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      className,
      style,
      linkClassName,
      sectionClassName,
      direction,
      sectionRender,
      render,
      data
    } = this.props;

    let links = this.props.links;
    if (!links) {
      return null;
    }

    let children = this.renderSections(links);

    return (
      <CAnchorNav
        classPrefix={ns}
        classnames={cx}
        className={className}
        style={style}
        linkClassName={linkClassName}
        sectionClassName={sectionClassName}
        onSelect={this.handleSelect}
        active={this.state.active}
        direction={direction}
      >
        {children}
      </CAnchorNav>
    );
  }
}

@Renderer({
  type: 'anchor-nav'
})
export class AnchorNavRenderer extends AnchorNav {}
