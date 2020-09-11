import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {filter} from '../utils/tpl';
import {resolveVariable, isPureVariable} from '../utils/tpl-builtin';
import Image, {ImageThumbProps} from './Image';
import {autobind} from '../utils/helper';
import {BaseSchema, SchemaUrlPath} from '../Schema';

/**
 * 图片集展示控件。
 * 文档：https://baidu.gitee.io/amis/docs/components/images
 */
export interface ImagesSchema extends BaseSchema {
  /**
   * 指定为图片集渲染器
   */
  type: 'images';

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
  src?: string;
  originalSrc?: string; // 原图
  enlargeAble?: boolean;
  showDimensions?: boolean;
}

export interface ImagesProps extends RendererProps, Omit<ImagesSchema, 'type'> {
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
    defaultImage:
      'https://fex.bdstatic.com/n/static/amis/renderers/crud/field/placeholder_cfad9b1.png',
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
              : (item && item.src) || item,
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
      value,
      placeholder,
      classnames: cx,
      source,
      delimiter,
      enlargeAble,
      src,
      originalSrc
    } = this.props;

    let list: any;

    if (typeof source === 'string' && isPureVariable(source)) {
      list = resolveVariable(source, data) || undefined;
    } else if (Array.isArray(value)) {
      list = value;
    } else if (name && data[name]) {
      list = data[name];
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
          <div className={cx('Images')}>
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
          <Image
            className={cx('Images-item')}
            src={defaultImage}
            thumbMode={thumbMode}
            thumbRatio={thumbRatio}
          />
        ) : (
          placeholder
        )}
      </div>
    );
  }
}

@Renderer({
  test: /(^|\/)images$/
})
export class ImagesFieldRenderer extends ImagesField {}
