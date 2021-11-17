/**
 * @file List
 * @description 图文列表
 * @author liyuan
 */

import React from 'react';
import cx from 'classnames';
import {themeable, ThemeProps, ClassNamesFn} from '../theme';
import { url } from 'inspector';

const titleFontSize = 16;
const descriptionFontSize = 14;
const footerFontSize = 12;

export interface IStyle {
  [propName: string]: any;
}
export interface ListItemProps {
  /**
   * 标题
   */
  title?: string | React.ReactNode; // 标题
  /**
   * 标题下面的描述信息
   */
  description?: string | React.ReactNode;  // 描述
  /**
   * 描述下面的内容
   */
  footer?: string | React.ReactNode;

  /**
   * 图片所在位置 左侧 | 右侧 | 上面 | 下面
   */
  mode?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * 类
   */
  className?: string;
  
  /**
   * 图片地址
   */
  imgUrl?: string;

  /**
   * item样式
   */
  itemStyle?: IStyle;

  /**
   * 图片样式
   */
  imgStyle?: IStyle;

  /**
   * title样式
   */
  titleStyle?: IStyle;

  /**
   * 描述样式
   */
  descriptionStyle?: IStyle;

  /**
   * footer样式
   */
  footerStyle?: IStyle;
}

class ListItem extends React.PureComponent<ListItemProps, any> {
  static defaultProps: Partial<ListItemProps> = {
    className: '',
    mode: 'left'
  };

  getStyle(fontSize: number, style: IStyle = {}) {
    return Object.assign({}, {
        fontSize,
        lineHeight: fontSize * 1.5 + 'px'
      }, style);
  }

  render() {
    const {
      className,
      mode,
      title,
      description,
      footer,
      imgUrl = '',
      itemStyle,
      imgStyle,
      titleStyle,
      descriptionStyle,
      footerStyle
    } = this.props;

    const hasImg = imgUrl || imgStyle;
    const listItemClassname = cx(`list-item`, className, {
        [`img-${mode}`]: mode 
    });
    const imgWrapStyle = Object.assign({
        backgroundImage: `url(${imgUrl})`
    }, imgStyle);
    return (
      <div className={listItemClassname} style={itemStyle}>
        {hasImg && <div className="img-wrap" style={imgWrapStyle}></div>}
        <div className="list-content-wrap">
          <div className="list-title" style={this.getStyle(titleFontSize, titleStyle)}>
            {title}
          </div>
          <div className="list-content" style={this.getStyle(descriptionFontSize, descriptionStyle)}>
            {description}
          </div>
          <div className="list-footer" style={this.getStyle(footerFontSize, footerStyle)}>
            {footer}
          </div>
        </div>
      </div>
    );
  }
}

export interface ListProps extends ThemeProps {
  mode?: 'left' | 'right' | 'top' | 'bottom';
  columns?: number;
  columnSpace?: number;
  items: Array<ListItemProps>;
  style?: IStyle;
  itemStyle?: IStyle;
  imgStyle?: IStyle;
  titleStyle?: IStyle;
  descriptionStyle?: IStyle;
  footerStyle?: IStyle;
  className?: string;
}

export class List extends React.Component<ListProps> {
  static defaultProps: Partial<ListProps> = {
    mode: 'left',
    columns: 1,
    columnSpace: 0,
    items: [],
    className: ''
  };

  static ListItem = ListItem;

  renderListItem(item: ListItemProps, index: number) {
    const {columns = 1, columnSpace = 0, mode, classPrefix: ns, itemStyle, imgStyle, titleStyle, descriptionStyle, footerStyle} = this.props;
    const listMode = item.mode || mode;
    const lItemStyle = Object.assign({}, itemStyle, item.itemStyle);
    const lImgStyle = Object.assign({}, imgStyle, item.imgStyle);
    const lTitleStyle = Object.assign({}, titleStyle, item.titleStyle);
    const lDescriptionStyle = Object.assign({}, descriptionStyle, item.descriptionStyle);
    const lFooterStyle = Object.assign({}, footerStyle, item.footerStyle);  

    const listItemWrapClassname = cx(`${ns}list-item-wrap list-item-wrap-${index}`, {
      ['inline-flex']: columns > 1 
    });
    return (
        <div className={listItemWrapClassname} style={
          {
            width: `calc((100% - ${columnSpace * (columns - 1)}px) / ${columns})`
          }
        } key={index}>
          <ListItem
            {...item}
            mode={listMode}
            itemStyle={lItemStyle}
            imgStyle={lImgStyle}
            titleStyle={lTitleStyle}
            descriptionStyle={lDescriptionStyle}
            footerStyle={lFooterStyle}
          />
        </div>
    );
  }

  render() {
    const {
      classnames: cx,
      classPrefix: ns,
      className,
      style
    } = this.props;
    let items = this.props.items;
    const listClassname = cx(`${ns}DynamicList list-wrap`, className);

    items = Array.isArray(items) ? items : [items];

    return (
      <div className={listClassname} style={style}>
        {
          items.map((item, index) => {
            return this.renderListItem(item, index);
          })
        }
      </div>
    );
  }
}

const ThemedList = themeable(List);

export default ThemedList as typeof ThemedList & {
  ListItem: typeof ListItem;
};
