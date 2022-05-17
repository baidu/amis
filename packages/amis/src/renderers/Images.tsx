import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {
  resolveVariable,
  isPureVariable,
  resolveVariableAndFilter
} from '../utils/tpl-builtin';
import Image, {ImageThumbProps, imagePlaceholder} from './Image';
import {autobind, getPropValue} from '../utils/helper';
import {BaseSchema, SchemaClassName, SchemaUrlPath} from '../Schema';

/**
 * 图片集展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/images
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
}

export interface ImagesProps
  extends RendererProps,
    Omit<ImagesSchema, 'type' | 'className'> {
  delimiter: string;

  onEnlarge?: (
    info: ImageThumbProps & {
      list?: Array<
        Pick<ImageThumbProps, 'src' | 'originalSrc' | 'title' | 'caption'>
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

  render() {
    const {
      className,
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
      src,
      originalSrc,
      listClassName,
      options
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

    return (
      <div className={cx('ImagesField', className)}>
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
                onEnlarge={this.handleEnlarge}
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
      </div>
    );
  }
}

@Renderer({
  type: 'images'
})
export class ImagesFieldRenderer extends ImagesField {}
