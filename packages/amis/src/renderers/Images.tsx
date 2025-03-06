import React, {createRef} from 'react';
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
import Transition, {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED
} from 'react-transition-group/Transition';
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
   * 展示模式，支持缩略图模式（thumb）和大图模式（full）
   */
  displayMode?: 'thumb' | 'full';

  /**
   * 当前展示图片索引
   */
  currentIndex?: number;

  /**
   * 大图模式下的缩放模式
   */
  fullThumbMode?: 'cover' | 'contain';

  /**
   * 排列方式
   * 类命名方式按照上右下左四个边命名，l=2m，m=2s，最小单位为s
   * 每条边的顺序都是从上到下，从左到右。
   * */
  sortType?:
    | 'sm-ss-sss-m'
    | 'sss-ss-ms-m'
    | 'sms-ss-sms-m'
    | 'sm-ss-sss-ss'
    | 'ms-ss-sss-ss'
    | 'sss-ss-sm-ss'
    | 'mss-ss-ssm-ss'
    | 'sss-ss-mm-ss'
    | 'even-${number}-${number}';
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
  fontStyle?: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
  };
  /**
   *蒙层颜色
   * */
  maskColor?: string;
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

interface ImagesState {
  defaultWidth: number;
  defaultHeight: number;
  currentIndex: number;
  nextAnimation: string;
}

interface ImagesFieldProps {
  className: string;
  delimiter: string;
  defaultImage: string; // 这里的 defaultImage 类型应该是 string
  placehoder: string;
  thumbMode: string;
  thumbRatio: string;
  displayMode: string;
  fullThumbMode: string;
}
export class ImagesField extends React.Component<ImagesProps, ImagesState> {
  static defaultProps: ImagesFieldProps = {
    className: '',
    delimiter: ',',
    defaultImage: imagePlaceholder,
    placehoder: '-',
    thumbMode: 'cover',
    thumbRatio: '1:1',
    displayMode: 'thumb',
    fullThumbMode: 'cover'
  };
  containerRef = createRef<HTMLDivElement>();
  resizeObserver: ResizeObserver | null = null;

  constructor(props: ImagesProps) {
    super(props);
    this.state = {
      defaultWidth: 200,
      defaultHeight: 112.5,
      currentIndex: 0,
      nextAnimation: ''
    };
  }
  private isSwiping: boolean = false;
  private startX: number = 0;

  list: Array<any> = [];
  gap = 5;
  evenReg = /^even-[1-9]\d*-[1-9]\d*$/;

  wrapperRef: React.RefObject<HTMLDivElement> = React.createRef();

  // 根据当前索引和方向获取下一帧的索引
  @autobind
  getFrameId(pos?: string) {
    const {currentIndex} = this.state;
    const total = this.list.length;
    switch (pos) {
      case 'prev':
        return (currentIndex - 1 + total) % total;
      case 'next':
        return (currentIndex + 1) % total;
      default:
        return currentIndex;
    }
  }

  // 根据方向和动画类型切换到下一帧
  @autobind
  async transitFramesTowards(direction: string, nextAnimation: string) {
    let {currentIndex} = this.state;
    let prevIndex = currentIndex;

    switch (direction) {
      case 'left':
        currentIndex = this.getFrameId('next');
        nextAnimation = 'slideLeft';
        break;
      case 'right':
        currentIndex = this.getFrameId('prev');
        nextAnimation = 'slideRight';
        break;
      default:
        return;
    }

    this.setState({currentIndex, nextAnimation});
  }

  @autobind
  private handleSwipe(deltaX: number) {
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // 向右滑
        this.transitFramesTowards('right', 'slideRight');
      } else {
        // 向左滑
        this.transitFramesTowards('left', 'slideLeft');
      }
    }
  }

  @autobind
  handleTouchStart(e: React.TouchEvent) {
    if (this.props.displayMode !== 'full') return;

    this.isSwiping = true;
    this.startX = e.touches[0].clientX;
  }

  @autobind
  handleTouchEnd(e: React.TouchEvent) {
    if (!this.isSwiping) return;

    const deltaX = e.changedTouches[0].clientX - this.startX;
    this.handleSwipe(deltaX);
    this.isSwiping = false;
  }

  @autobind
  handleMouseDown(e: React.MouseEvent) {
    if (this.props.displayMode !== 'full') return;

    // 阻止图片默认的拖拽行为
    e.preventDefault();

    this.isSwiping = true;
    this.startX = e.clientX;

    document.addEventListener('mouseup', this.handleMouseUp);
  }

  @autobind
  handleMouseUp(e: MouseEvent) {
    if (!this.isSwiping) return;

    const deltaX = e.clientX - this.startX;
    this.handleSwipe(deltaX);
    this.isSwiping = false;
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

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
  generateHeight = (sortType: string | undefined, index: number) => {
    const height = Number(this.props.height) || this.state.defaultHeight;
    if (
      sortType === 'sm-ss-sss-m' ||
      sortType === 'sss-ss-ms-m' ||
      sortType === 'sms-ss-sms-m'
    ) {
      if (index === 0) {
        return height;
      } else {
        return (height - this.gap) * 0.5;
      }
    } else if (
      sortType === 'sm-ss-sss-ss' ||
      sortType === 'ms-ss-sss-ss' ||
      sortType === 'sss-ss-sm-ss' ||
      sortType === 'mss-ss-ssm-ss' ||
      sortType === 'sss-ss-mm-ss'
    ) {
      return (height - this.gap) * 0.5;
    } else if (this.evenReg.test(sortType || '')) {
      const rows = Number(sortType?.split('-')[1]);
      const columns = Number(sortType?.split('-')[2]);
      if (index < rows * columns) {
        return (height - this.gap * (rows - 1)) / rows;
      }
    }
    return 0;
  };

  /**
   * 计算照片子元素宽度
   * */
  generateWidth = (sortType: string | undefined, index: number) => {
    const width = Number(this.props.width) || this.state.defaultWidth;
    if (sortType === 'sm-ss-sss-m' || sortType === 'sss-ss-ms-m') {
      if (index === 0) {
        return (width - 2 * this.gap) / 3;
      } else if (index === 1) {
        return ((width - 2 * this.gap) / 3) * 2 + this.gap;
      } else {
        return (width - 2 * this.gap) / 3;
      }
    } else if (sortType === 'sms-ss-sms-m') {
      if ([0, 2, 4].includes(index)) {
        return (width - 2 * this.gap) / 4;
      } else if (index === 1 || index === 3) {
        return (width - 2 * this.gap) / 2 + this.gap;
      }
    } else if (sortType === 'sm-ss-sss-ss') {
      if ([0, 2, 3, 4].includes(index)) {
        return (width - 2 * this.gap) / 3;
      } else {
        return ((width - 2 * this.gap) / 3) * 2 + this.gap;
      }
    } else if (sortType === 'ms-ss-sss-ss') {
      if ([1, 2, 3, 4].includes(index)) {
        return (width - 2 * this.gap) / 3;
      } else {
        return ((width - 2 * this.gap) / 3) * 2 + this.gap;
      }
    } else if (sortType === 'sss-ss-sm-ss') {
      if ([0, 1, 2, 4].includes(index)) {
        return (width - 2 * this.gap) / 3;
      } else {
        return ((width - 2 * this.gap) / 3) * 2 + this.gap;
      }
    } else if (sortType === 'mss-ss-ssm-ss') {
      if ([1, 2, 4, 5].includes(index)) {
        return (width - 2 * this.gap) / 4;
      } else {
        return (width - 2 * this.gap) / 2 + this.gap;
      }
    } else if (sortType === 'sss-ss-mm-ss') {
      if ([0, 1, 2].includes(index)) {
        return (width - this.gap * 2) / 3;
      } else {
        return (width - this.gap) / 2;
      }
    } else if (this.evenReg.test(sortType || '')) {
      const rows = Number(sortType?.split('-')[1]);
      const columns = Number(sortType?.split('-')[2]);
      if (index < rows * columns) {
        return (width - this.gap * (columns - 1)) / columns;
      }
    }

    return 0;
  };

  /**
   * 计算网格布局
   * */
  generateEvenTranslate(sortType: string | undefined, index: number) {
    let result = ``;
    const width = Number(this.props.width) || this.state.defaultWidth;
    const height = Number(this.props.height) || this.state.defaultHeight;
    const rows = Number(sortType?.split('-')[1]);
    const columns = Number(sortType?.split('-')[2]);
    if (index < rows * columns) {
      // 计算每个网格单元的宽度和高度
      const cellWidth = (width - (columns - 1) * this.gap) / columns;
      const cellHeight = (height - (rows - 1) * this.gap) / rows;

      // 计算当前索引的行号和列号
      const row = Math.floor(index / columns);
      const col = index % columns;

      // 计算图片的 x, y 坐标
      const x = col * (cellWidth + this.gap);
      const y = row * (cellHeight + this.gap);
      result = `translate(${x}px,${y}px)`;
    }
    return result;
  }

  /**
   * 计算照片子元素平移位置
   * */
  generateTranslate = (sortType: string | undefined, index: number) => {
    const width = Number(this.props.width) || this.state.defaultWidth;
    const height = Number(this.props.height) || this.state.defaultHeight;
    let styleObj: any = {
      position: 'absolute',
      boxSizing: 'content-box',
      height: this.generateHeight(sortType, index) + 'px',
      width: this.generateWidth(sortType, index) + 'px'
    };
    if (sortType === 'sm-ss-sss-m') {
      if (index === 1) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${(height - this.gap) * 0.5 + this.gap}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${(height - this.gap) * 0.5 + this.gap}px)`;
      }
    } else if (sortType === 'sss-ss-ms-m') {
      if (index === 1) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${(height - this.gap) * 0.5 + this.gap}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${0}px)`;
      }
    } else if (sortType === 'sms-ss-sms-m') {
      if (index === 1) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 4 + this.gap
        }px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 4) * 3 + 3 * this.gap
        }px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 4 + this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 4) * 3 + 3 * this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      }
    } else if (sortType === 'sm-ss-sss-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${0}px,${
          (height - this.gap) / 2 + this.gap
        }px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      }
    } else if (sortType === 'ms-ss-sss-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${0}px,${
          (height - this.gap) / 2 + this.gap
        }px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      }
    } else if (sortType === 'sss-ss-sm-ss') {
      if (index === 1) {
        styleObj.transform = `translate(${
          (width - 2 * this.gap) / 3 + this.gap
        }px,${0}px)`;
      } else if (index === 2) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${0}px,${
          (height - this.gap) / 2 + this.gap
        }px)`;
      } else if (index === 4) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3) * 2 + 2 * this.gap
        }px,${(height - this.gap) / 2 + this.gap}px`;
      }
    } else if (sortType === 'mss-ss-ssm-ss') {
      if (index === 1 || index === 2) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 4 + this.gap) * (index + 1)
        }px,${0}px)`;
      } else if (index === 3) {
        styleObj.transform = `translate(${0}px,${
          (height - this.gap) / 2 + this.gap
        }px)`;
      } else if (index === 4 || index === 5) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 4 + this.gap) * (index - 2)
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      }
    } else if (sortType === 'sss-ss-mm-ss') {
      if (index === 1 || index === 2) {
        styleObj.transform = `translate(${
          ((width - 2 * this.gap) / 3 + this.gap) * index
        }px,${0}px)`;
      } else if (index === 3 || index === 4) {
        styleObj.transform = `translate(${
          ((width - this.gap) / 2 + this.gap) * (index - 3)
        }px,${(height - this.gap) / 2 + this.gap}px)`;
      }
    } else if (this.evenReg.test(sortType || '')) {
      styleObj.transform = this.generateEvenTranslate(sortType, index);
    }
    return styleObj;
  };

  componentDidMount() {
    if (
      !this.props.width ||
      !this.props.height ||
      (String(this.props.width).includes('%') &&
        String(this.props.height).includes('%'))
    ) {
      //监听父级元素大小变化
      this.observeParentSize();
    }
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  observeParentSize() {
    if (this.containerRef.current?.parentElement) {
      this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          this.setState({
            defaultWidth:
              (entry.contentRect.width *
                parseFloat(this.props.width || '100')) /
              100,
            defaultHeight:
              (entry.contentRect.height *
                parseFloat(this.props.height || '100')) /
              100
          });
          // 这里可以触发组件状态更新
          this.forceUpdate();
        }
      });
      this.resizeObserver.observe(this.containerRef.current.parentElement);
    }
  }

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
      imagesControlClassName,
      displayMode,
      fullThumbMode,
      maskColor
    } = this.props;

    const {currentIndex} = this.state;
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
    if (this.props.sortType === 'sm-ss-sss-m') {
      this.list = list.slice(0, 4);
    } else if (this.props.sortType === 'sss-ss-ms-m') {
      this.list = list.slice(0, 5);
    } else if (
      this.props.sortType === 'sms-ss-sms-m' ||
      this.props.sortType === 'sm-ss-sss-ss' ||
      this.props.sortType === 'ms-ss-sss-ss' ||
      this.props.sortType === 'sss-ss-sm-ss'
    ) {
      this.list = list.slice(0, 6);
    } else if (this.props.sortType === 'mss-ss-ssm-ss') {
      this.list = list.slice(0, 8);
    } else if (this.props.sortType === 'sss-ss-mm-ss') {
      this.list = list.slice(0, 6);
    }
    if (this.props.sortType) {
      return (
        <div
          ref={this.containerRef}
          className={sortType}
          style={{
            width: (this.props.width || this.state.defaultWidth) + 'px',
            height: (this.props.height || this.state.defaultHeight) + 'px'
          }}
        >
          {this.list.map((item: any, index: number) => (
            <Image
              maskColor={maskColor}
              fontStyle={this.props.fontStyle}
              style={this.generateTranslate(sortType, index)}
              width={this.generateWidth(sortType, index)}
              height={this.generateHeight(sortType, index)}
              hoverMode={this.props.hoverMode || 'text-style-4'}
              index={index}
              className={cx('Images-item')}
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
              sortType={this.props.sortType}
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
      );
    } else {
      return (
        <div
          ref={this.wrapperRef}
          className={cx(
            'ImagesField',
            className,
            displayMode === 'full' ? 'ImagesField--full' : '',
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
          style={{
            ...style,
            ...(displayMode === 'full'
              ? {
                  height: 'auto'
                }
              : {})
          }}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          onMouseDown={this.handleMouseDown}
        >
          {Array.isArray(list) ? (
            <div className={cx('Images', listClassName)}>
              {displayMode === 'full' ? (
                <div className={cx('Images-container')}>
                  {list.map((item: any, index: number) => (
                    <Transition
                      key={index}
                      in={index === currentIndex}
                      timeout={300}
                      mountOnEnter
                      unmountOnExit
                    >
                      {(status: string) => {
                        if (status === ENTERING) {
                          this.wrapperRef.current?.childNodes.forEach(
                            (item: HTMLElement) => item.offsetHeight
                          );
                        }

                        const animationStyles: {
                          [propName: string]: React.CSSProperties;
                        } = {
                          [ENTERING]: {
                            opacity: 1,
                            transform: 'translateX(0)'
                          },
                          [ENTERED]: {
                            opacity: 1,
                            transform: 'translateX(0)'
                          },
                          [EXITING]: {
                            opacity: 0,
                            transform:
                              this.state.nextAnimation === 'slideRight'
                                ? 'translateX(100%)'
                                : 'translateX(-100%)'
                          },
                          [EXITED]: {
                            opacity: 0,
                            transform:
                              this.state.nextAnimation === 'slideRight'
                                ? 'translateX(-100%)'
                                : 'translateX(100%)'
                          }
                        };

                        return (
                          <div
                            className={cx('Images-item')}
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              transition: 'all 300ms ease-in-out',
                              ...animationStyles[status]
                            }}
                          >
                            <div className={cx('Images-itemInner')}>
                              <img
                                className={cx('Image-image', {
                                  [`Image-image--${fullThumbMode}`]:
                                    displayMode === 'full'
                                })}
                                src={
                                  (src
                                    ? filter(src, item, '| raw')
                                    : item && item.image) || item
                                }
                                alt={item && item.title}
                                draggable={false}
                                onDragStart={e => e.preventDefault()}
                              />
                              <div className={cx('Images-itemIndex')}>
                                {index + 1}/{list.length}
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Transition>
                  ))}
                </div>
              ) : (
                list.map((item: any, index: number) => (
                  <Image
                    hoverMode={this.props.hoverMode || 'text-style-4'}
                    fontStyle={this.props.fontStyle}
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
                      {
                        ...this.props,
                        name: 'imageGallaryClassName',
                        id,
                        themeCss
                      }
                    )} ${setThemeClassName({
                      ...this.props,
                      name: 'galleryControlClassName',
                      id,
                      themeCss
                    })}`}
                    toolbarActions={toolbarActions}
                  />
                ))
              )}
            </div>
          ) : defaultImage ? (
            <div className={cx('Images', listClassName)}>
              <Image
                hoverMode={this.props.hoverMode || 'text-style-4'}
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
