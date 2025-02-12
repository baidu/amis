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
   * 类命名方式按照上下左右四个边命名，l=2m，m=2s，最小单位为s
   * 每条边的顺序都是从上到下，从左到右。
   * */
  sortType?:
    | 'sm-mm-mmm-m'
    | 'sss-ss-ms-m'
    | 'sms-ss-sms-l'
    | 'sm-mm-sss-ss'
    | 'ms-ss-sss-ss'
    | 'sss-ss-ms-ss'
    | 'ssss-ss-mss-ss'
    | 'sss-ss-mm-ss'
    | 'grid-x-y';
  /**
   * 宽度（有sortType时生效）
   * */
  width?: string;
  /**
   * 高度（有sortType时生效）
   * */
  height?: string;
  /**
   * 鼠标悬浮时的展示状态（对应AIpage的文字6，9，10不存在）
   * */
  hoverMode?:
    | 'hover-slide'
    | 'pull-top'
    | 'scale-center'
    | 'scale-top'
    | 'text-style-1'
    | 'text-style-2'
    | 'text-style-3'
    | 'text-style-4'
    | 'text-style-5'
    | 'text-style-6'
    | 'text-style-7';
  /**
   * 描述文字样式
   * */
  fontStyle?:
    | {
        fontSize?: string;
        fontWeight?: string;
        fontFamily?: string;
        color: string;
      }
    | string;
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

  constructor(props: ImagesProps) {
    super(props);
    this.state = {
      enLargeUrl: ''
    };
  }

  list: Array<any> = [];
  gap = 10;
  gridReg = /^grid-[1-9]\d*-[1-9]\d*$/;

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
    if (
      rootStyle === 'sm-mm-mmm-m' ||
      rootStyle === 'sss-ss-ms-m' ||
      rootStyle === 'sms-ss-sms-l'
    ) {
      if (index === 0) {
        return height + this.gap;
      } else {
        return height * 0.5;
      }
    } else if (
      rootStyle === 'sm-mm-sss-ss' ||
      rootStyle === 'ms-ss-sss-ss' ||
      rootStyle === 'sss-ss-ms-ss' ||
      rootStyle === 'ssss-ss-mss-ss' ||
      rootStyle === 'sss-ss-mm-ss'
    ) {
      return height * 0.5;
    } else if (this.gridReg.test(rootStyle || '')) {
      const rows = Number(rootStyle?.split('-')[1]);
      const columns = Number(rootStyle?.split('-')[2]);
      if (index < rows * columns) {
        return (height - this.gap * (rows - 1)) / rows;
      }
    }
    return 0;
  };

  /**
   * 计算照片子元素宽度
   * */
  generateWidth = (rootStyle: string | undefined, index: number) => {
    const width = Number(this.props.width) || 800;
    if (rootStyle === 'sm-mm-mmm-m' || rootStyle === 'sss-ss-ms-m') {
      if (index === 0) {
        return width / 3;
      } else if (index === 1) {
        return (width / 3) * 2 + this.gap;
      } else {
        return width / 3;
      }
    } else if (rootStyle === 'sms-ss-sms-l') {
      if (index === 0 || index === 2 || index === 4) {
        return width / 4;
      } else if (index === 1 || index === 3) {
        return width / 2 + this.gap;
      }
    } else if (rootStyle === 'sm-mm-sss-ss') {
      if (index === 0 || index === 2 || index === 3 || index === 4) {
        return width / 3;
      } else {
        return (width / 3) * 2 + this.gap;
      }
    } else if (rootStyle === 'ms-ss-sss-ss') {
      if (index === 1 || index === 2 || index === 3 || index === 4) {
        return width / 3;
      } else {
        return (width / 3) * 2 + this.gap;
      }
    } else if (rootStyle === 'sss-ss-ms-ss') {
      if (index === 0 || index === 1 || index === 2 || index === 4) {
        return width / 3;
      } else {
        return (width / 3) * 2 + this.gap;
      }
    } else if (rootStyle === 'ssss-ss-mss-ss') {
      if (
        index === 0 ||
        index === 1 ||
        index === 2 ||
        index === 3 ||
        index === 5 ||
        index === 6
      ) {
        return width / 4;
      } else {
        return width / 2 + this.gap;
      }
    } else if (rootStyle === 'sss-ss-mm-ss') {
      if (index === 0 || index === 1 || index === 2) {
        return (width - this.gap * 2) / 3;
      } else {
        return (width - this.gap) / 2;
      }
    } else if (this.gridReg.test(rootStyle || '')) {
      const rows = Number(rootStyle?.split('-')[1]);
      const columns = Number(rootStyle?.split('-')[2]);
      if (index < rows * columns) {
        return (width - this.gap * (columns - 1)) / columns;
      }
    }

    return 0;
  };

  /**
   * 计算照片子元素平移位置
   * */
  generateTranslate = (rootStyle: string | undefined, index: number) => {
    const width = Number(this.props.width) || 800;
    const height = Number(this.props.height) || 450;
    const gap = this.gap;
    let styleObj: any = {
      position: 'absolute',
      boxSizing: 'border-box',
      height: this.generateHeight(rootStyle, index) + 'px',
      width: this.generateWidth(rootStyle, index) + 'px'
    };
    if (rootStyle === 'sm-mm-mmm-m') {
      if (index === 1) {
        styleObj.transform = `translate(${width / 3 + gap}px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${width / 3 + gap}px,${
          height * 0.5 + gap
        }px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${
          height * 0.5 + gap
        }px)`;
      }
    } else if (rootStyle === 'sss-ss-ms-m') {
      if (index === 1) {
        styleObj.transform = `translate(${width / 3 + gap}px,${
          height * 0.5 + gap
        }px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${width / 3 + gap}px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${0}px)`;
      }
    } else if (rootStyle === 'sms-ss-sms-l') {
      if (index === 1) {
        styleObj.transform = `translate(${width / 4 + gap}px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${(width / 4) * 3 + 3 * gap}px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${width / 4 + gap}px,${
          height / 2 + gap
        }px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${(width / 4) * 3 + 3 * gap}px,${
          height / 2 + gap
        }px)`;
      }
    } else if (rootStyle === 'sm-mm-sss-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${width / 3 + gap}px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${0}px,${height / 2 + gap}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${width / 3 + gap}px,${
          height / 2 + gap
        }px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${
          height / 2 + gap
        }px)`;
      }
    } else if (rootStyle === 'ms-ss-sss-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${0}px,${height / 2 + gap}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${width / 3 + gap}px,${
          height / 2 + gap
        }px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${
          height / 2 + gap
        }px)`;
      }
    } else if (rootStyle === 'sss-ss-ms-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${width / 3 + gap}px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${0}px,${height / 2 + gap}px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${(width / 3) * 2 + 2 * gap}px,${
          height / 2 + gap
        }px`;
      }
    } else if (rootStyle === 'ssss-ss-mss-ss') {
      if (index === 1 || index === 2 || index === 3) {
        styleObj.transform = `translate(${(width / 4 + gap) * index}px,${0}px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${0}px,${height / 2 + gap}px)`;
      } else if (index === 5 || index === 6) {
        styleObj.transform = `translate(${(width / 4 + gap) * (index - 3)}px,${
          height / 2 + gap
        }px)`;
      }
    } else if (rootStyle === 'sss-ss-mm-ss') {
      if (index === 1 || index === 2) {
        styleObj.transform = `translate(${
          ((width - 2 * gap) / 3 + gap) * index
        }px,${0}px)`;
      } else if (index === 3 || index === 4) {
        styleObj.transform = `translate(${
          ((width - gap) / 2 + gap) * (index - 3)
        }px,${height / 2 + gap}px)`;
      }
    } else if (this.gridReg.test(rootStyle || '')) {
      const rows = Number(rootStyle?.split('-')[1]);
      const columns = Number(rootStyle?.split('-')[2]);
      if (index < rows * columns) {
        // 计算每个网格单元的宽度和高度
        const cellWidth = (width - (columns - 1) * gap) / columns;
        const cellHeight = (height - (rows - 1) * gap) / rows;

        // 计算当前索引的行号和列号
        const row = Math.floor(index / columns);
        const col = index % columns;

        // 计算图片的 x, y 坐标
        const x = col * (cellWidth + gap);
        const y = row * (cellHeight + gap);
        styleObj.transform = `translate(${x}px,${y}px)`;
      }
    }
    return styleObj;
  };
  /**
   * 生成文字效果
   * */
  generateFontStyle = () => {
    if (!this.props.fontStyle) {
      return {};
    }
    let styleObj: object = {};
    if (typeof this.props.fontStyle === 'string') {
      let validJsonStr = this.props.fontStyle.replace(
        /(['"])?([a-zA-Z0-9-_]+)\1\s*:\s*(['"])?([^'"]+)\3/g,
        '"$2": "$4"'
      );
      styleObj = JSON.parse(validJsonStr);
    } else if (typeof this.props.fontStyle === 'object') {
      styleObj = this.props.fontStyle;
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
    /**
     * 截取图集图片数量，多余图片不显示
     * */
    if (
      this.props.sortType === 'sm-mm-mmm-m' ||
      this.props.sortType === 'sss-ss-ms-m'
    ) {
      this.list = list.slice(0, 5);
    } else if (
      this.props.sortType === 'sms-ss-sms-l' ||
      this.props.sortType === 'sm-mm-sss-ss' ||
      this.props.sortType === 'ms-ss-sss-ss' ||
      this.props.sortType === 'sss-ss-ms-ss'
    ) {
      this.list = list.slice(0, 6);
    } else if (this.props.sortType === 'ssss-ss-mss-ss') {
      this.list = list.slice(0, 8);
    } else if (this.props.sortType === 'sss-ss-mm-ss') {
      this.list = list.slice(0, 6);
    }

    if (this.props.sortType) {
      return (
        <div className={sortType}>
          {list.map((item: any, index: number) => (
            <div
              className={`${this.props.hoverMode} Img-container`}
              style={this.generateTranslate(sortType, index)}
              key={index}
            >
              <div
                className="mask"
                style={{
                  height: this.generateHeight(sortType, index) + 'px',
                  width: this.generateWidth(sortType, index) + 'px'
                }}
                onClick={() =>
                  this.handleEnlarge({
                    src: item.image,
                    index
                  } as ImageThumbProps)
                }
              >
                <span style={{...this.generateFontStyle()}}>{item.desc}</span>
              </div>
              <img
                alt=""
                src={
                  (src ? filter(src, item, '| raw') : item && item.image) ||
                  item
                }
                width={this.generateWidth(sortType, index)}
                height={this.generateHeight(sortType, index)}
              />
            </div>
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
                  hoverMode={this.props.hoverMode}
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
                  desc={item && item.desc}
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
                hoverMode={this.props.hoverMode}
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
