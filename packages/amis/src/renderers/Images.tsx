import React from 'react';
import {
  Renderer,
  RendererProps,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {filter} from 'amis-core';
import {
  resolveVariable,
  isPureVariable,
  resolveVariableAndFilter
} from 'amis-core';
import Image, {ImageThumbProps, imagePlaceholder} from './Image';
import {autobind, getPropValue} from 'amis-core';
import {BaseSchema, SchemaClassName, SchemaUrlPath} from '../Schema';
import type {ImageToolbarAction} from './Image';

/**
 * 图片集展示控件。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/images
 */
export interface ImagesSchema extends BaseSchema {
  /**
   * 指定为图片集渲染器
   */
  type: 'images' | 'static-images';

  /**
   * 默认图片地址
   */
  defaultImage?: SchemaUrlPath;

  /**
   * 列表为空时显示
   */
  placeholder?: string;

  /**
   * 配置值的连接符
   * @default ,
   */
  delimiter?: string;

  /**
   * 预览图模式
   */
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';

  /**
   * 预览图比率
   */
  thumbRatio?: '1:1' | '4:3' | '16:9';

  /**
   * 关联字段名，也可以直接配置 src
   */
  name?: string;

  value?: any; // todo 补充 description
  source?: string;

  // 静态配置，如果不相关联数据，而是直接固定列表展示，请配置。
  options?: Array<any>;

  /**
   * 图片地址，默认读取数据中的 image 属性，如果不是请配置 ,如  ${imageUrl}
   */
  src?: string;

  /**
   * 大图地址，不设置用 src 属性，如果不是请配置，如：${imageOriginUrl}
   */
  originalSrc?: string; // 原图

  /**
   * 是否启动放大功能。
   */
  enlargeAble?: boolean;

  /**
   * 放大时是否显示图片集
   */
  enlargetWithImages?: boolean;

  /**
   * 是否显示尺寸。
   */
  showDimensions?: boolean;

  /**
   * 外层 CSS 类名
   */
  className?: SchemaClassName;

  /**
   * 列表 CSS 类名
   */
  listClassName?: SchemaClassName;

  /**
   * 放大详情图 CSS 类名
   */
  imageGallaryClassName?: SchemaClassName;

  /**
   * 是否展示图片工具栏
   */
  showToolbar?: boolean;

  /**
   * 工具栏配置
   */
  toolbarActions?: ImageToolbarAction[];

  /**
   * 排列方式
   * */
  sortType?:
    | 'l-t-2m'
    | 'l-b-2m'
    | 'l-2m-2s'
    | 'rt-4m'
    | 'lt-4m'
    | 'lb-4m'
    | 'lb-6s'
    | 'lb-rb-3m';
}

export interface ImagesProps
  extends RendererProps,
    Omit<ImagesSchema, 'type' | 'className'> {
  delimiter: string;
  onEnlarge?: (
    info: ImageThumbProps & {
      list?: Array<
        Pick<
          ImageThumbProps,
          'src' | 'originalSrc' | 'title' | 'caption' | 'showToolbar'
        >
      >;
    }
  ) => void;
}

export class ImagesField extends React.Component<ImagesProps> {
  static defaultProps: Pick<
    ImagesProps,
    | 'className'
    | 'delimiter'
    | 'defaultImage'
    | 'placehoder'
    | 'thumbMode'
    | 'thumbRatio'
  > = {
    className: '',
    delimiter: ',',
    defaultImage: imagePlaceholder,
    placehoder: '-',
    thumbMode: 'contain',
    thumbRatio: '1:1'
  };

  list: Array<any> = [];
  gap = 10;

  @autobind
  handleEnlarge(info: ImageThumbProps) {
    const {onImageEnlarge, src, originalSrc} = this.props;

    onImageEnlarge &&
      onImageEnlarge(
        {
          ...info,
          originalSrc: info.originalSrc || info.src,
          list: this.list.map(item => ({
            src: src
              ? filter(src, item, '| raw')
              : (item && item.image) || item,
            originalSrc: originalSrc
              ? filter(originalSrc, item, '| raw')
              : item?.src || filter(src, item, '| raw') || item?.image || item,
            title: item && (item.enlargeTitle || item.title),
            caption:
              item && (item.enlargeCaption || item.description || item.caption)
          }))
        },
        this.props
      );
  }

  /**
   * 计算照片子元素高度
   * */
  generateHeight = (rootStyle: string | undefined, index: number) => {
    const height = Number(this.props.height) || 450;
    if (rootStyle === 'l-t-2m') {
      if (index === 0) {
        return height + this.gap;
      } else if (index === 1) {
        return height * 0.5;
      } else {
        return height * 0.5;
      }
    }
    return 0;
  };

  /**
   * 计算照片子元素宽度
   * */
  generateWidth = (rootStyle: string | undefined, index: number) => {
    const width = Number(this.props.width) || 800;
    if (rootStyle === 'l-t-2m') {
      if (index === 0) {
        console.log(index, width, width * 0.3);
        return width / 3;
      } else if (index === 1) {
        return (width / 3) * 2 + this.gap;
      } else {
        return width / 3;
      }
    }

    return 0;
  };

  /**
   * 计算照片子元素平移位置
   * */
  generateTranslate = (rootStyle: string | undefined, index: number) => {
    const width = this.props.width || 800;
    const height = this.props.height || 450;
    const gap = 10;
    let styleObj: any = {position: 'absolute', boxSizing: 'border-box'};
    if (rootStyle === 'l-t-2m') {
      if (index === 0) {
        return styleObj;
      } else if (index === 1) {
        styleObj.transform = `translate(${width / 3 + gap}px,${0}px)`;
        return styleObj;
      } else if (index === 2) {
        return {
          position: 'absolute',
          transform: `translate(${width / 3 + gap}px,${height * 0.5 + gap}px)`
        };
      } else if (index === 3) {
        return {
          position: 'absolute',
          transform: `translate(${(width / 3) * 2 + 2 * gap}px,${
            height * 0.5 + gap
          }px)`
        };
      }
    }
    return styleObj;
  };

  render() {
    const {
      className,
      style,
      defaultImage,
      thumbMode,
      thumbRatio,
      data,
      name,
      placeholder,
      classnames: cx,
      source,
      delimiter,
      enlargeAble,
      enlargeWithGallary,
      src,
      originalSrc,
      listClassName,
      options,
      showToolbar,
      toolbarActions,
      imageGallaryClassName,
      galleryControlClassName,
      id,
      wrapperCustomStyle,
      env,
      themeCss,
      sortType,
      imagesControlClassName
    } = this.props;

    let value: any;
    let list: any;

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariableAndFilter(source, data, '| raw') || undefined;
    } else if (
      Array.isArray((value = getPropValue(this.props))) ||
      typeof value === 'string'
    ) {
      list = value;
    } else if (Array.isArray(options)) {
      list = options;
    }

    if (typeof list === 'string') {
      list = list.split(delimiter);
    } else if (list && !Array.isArray(list)) {
      list = [list];
    }

    this.list = list;

    if (this.props.sortType) {
      return (
        <div className={sortType}>
          {list.map((item: any, index: number) => (
            <Image
              style={this.generateTranslate(sortType, index)}
              index={index}
              className={cx('Images-item')}
              height={this.generateHeight(sortType, index)}
              width={this.generateWidth(sortType, index)}
              key={index}
              src={
                (src ? filter(src, item, '| raw') : item && item.image) || item
              }
              originalSrc={
                (originalSrc
                  ? filter(originalSrc, item, '| raw')
                  : item && item.src) || item
              }
              title={item && item.title}
              caption={item && (item.description || item.caption)}
              thumbMode={'cover'}
              thumbRatio={thumbRatio}
              enlargeAble={enlargeAble!}
              enlargeWithGallary={enlargeWithGallary}
              onEnlarge={this.handleEnlarge}
              showToolbar={showToolbar}
              imageGallaryClassName={`${imageGallaryClassName} ${setThemeClassName(
                {...this.props, name: 'imageGallaryClassName', id, themeCss}
              )} ${setThemeClassName({
                ...this.props,
                name: 'galleryControlClassName',
                id,
                themeCss
              })}`}
              toolbarActions={toolbarActions}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div
          className={cx(
            'ImagesField',
            className,
            setThemeClassName({
              ...this.props,
              name: 'imagesControlClassName',
              id,
              themeCss
            }),
            setThemeClassName({
              ...this.props,
              name: 'wrapperCustomStyle',
              id,
              themeCss: wrapperCustomStyle
            })
          )}
          style={style}
        >
          {Array.isArray(list) ? (
            <div className={cx('Images', listClassName)}>
              {list.map((item: any, index: number) => (
                <Image
                  index={index}
                  className={cx('Images-item')}
                  key={index}
                  src={
                    (src ? filter(src, item, '| raw') : item && item.image) ||
                    item
                  }
                  originalSrc={
                    (originalSrc
                      ? filter(originalSrc, item, '| raw')
                      : item && item.src) || item
                  }
                  title={item && item.title}
                  caption={item && (item.description || item.caption)}
                  thumbMode={thumbMode}
                  thumbRatio={thumbRatio}
                  enlargeAble={enlargeAble!}
                  enlargeWithGallary={enlargeWithGallary}
                  onEnlarge={this.handleEnlarge}
                  showToolbar={showToolbar}
                  imageGallaryClassName={`${imageGallaryClassName} ${setThemeClassName(
                    {...this.props, name: 'imageGallaryClassName', id, themeCss}
                  )} ${setThemeClassName({
                    ...this.props,
                    name: 'galleryControlClassName',
                    id,
                    themeCss
                  })}`}
                  toolbarActions={toolbarActions}
                />
              ))}
            </div>
          ) : defaultImage ? (
            <div className={cx('Images', listClassName)}>
              <Image
                className={cx('Images-item')}
                src={defaultImage}
                thumbMode={thumbMode}
                thumbRatio={thumbRatio}
              />
            </div>
          ) : (
            placeholder
          )}
          <CustomStyle
            {...this.props}
            config={{
              wrapperCustomStyle,
              id,
              themeCss,
              classNames: [
                {
                  key: 'imagesControlClassName'
                },
                {
                  key: 'galleryControlClassName'
                }
              ]
            }}
            env={env}
          />
        </div>
      );
    }
  }
}

@Renderer({
  type: 'images'
})
export class ImagesFieldRenderer extends ImagesField {}
