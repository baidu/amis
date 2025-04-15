import React, {Suspense} from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  prettyBytes,
  resolveEventData,
  CustomStyle,
  setThemeClassName,
  PlainObject,
  localeFormatter
} from 'amis-core';
// import 'cropperjs/dist/cropper.css';
const Cropper = React.lazy(() => import('react-cropper'));
import DropZone from 'react-dropzone';
import {FileRejection, ErrorCode, DropEvent} from 'react-dropzone';
import 'blueimp-canvastoblob';
import find from 'lodash/find';
import {Payload, ActionObject} from 'amis-core';
import {
  buildApi,
  isEffectiveApi,
  normalizeApi,
  isApiOutdated,
  isApiOutdatedWithData
} from 'amis-core';
import {createObject, qsstringify, guid, isEmpty, qsparse} from 'amis-core';
import {Icon, TooltipWrapper, Button} from 'amis-ui';
import accepts from 'attr-accept';
import {getNameFromUrl} from './InputFile';
import ImageComponent, {ImageThumbProps} from '../Image';
import {TranslateFn} from 'amis-core';
import {dataMapping} from 'amis-core';
import {
  FormBaseControlSchema,
  SchemaApi,
  SchemaClassName,
  SchemaTokenizeableString,
  SchemaUrlPath
} from '../../Schema';
import {filter} from 'amis-core';
import isPlainObject from 'lodash/isPlainObject';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import {TplSchema} from '../Tpl';
import Sortable from 'sortablejs';

/**
 * Image 图片上传控件
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/image
 */
export interface ImageControlSchema extends FormBaseControlSchema {
  /**
   * 格式校验失败是否显示弹窗
   * */
  showErrorModal?: boolean;
  /**
   * 校验格式失败时显示的文字信息
   * */
  invalidTypeMessage?: string;
  /**
   * 校验文件大小失败时显示的文字信息
   * */
  invalidSizeMessage?: string;
  /**
   * 指定为图片上传控件
   */
  type: 'input-image';

  /**
   * 默认展示图片的链接
   */
  src?: SchemaUrlPath;

  /**
   * 默认展示图片的类名
   */
  imageClassName?: string;

  /**
   * 配置接收的图片类型
   *
   * 建议直接填写文件后缀
   * 如：.txt,.csv
   *
   * 多个类型用逗号隔开。
   */
  accept?: string;

  /**
   * 默认都是通过用户选择图片后上传返回图片地址，如果开启此选项，则可以允许用户图片地址。
   */
  allowInput?: boolean;

  /**
   * 是否自动开始上传
   */
  autoUpload?: boolean;

  /**
   * 上传按钮文案
   */
  uploadBtnText?: string | TplSchema;

  /**
   * 选择图片按钮的 CSS 类名
   */
  btnClassName?: SchemaClassName;

  /**
   * 上传按钮的 CSS 类名
   */
  btnUploadClassName?: SchemaClassName;

  /**
   * @deprecated
   */
  compress?: boolean;

  /**
   * @deprecated
   */
  compressOptions?: {
    maxHeight?: number;
    maxWidth?: number;
  };

  crop?:
    | boolean
    | {
        /**
         * 默认 `1` 即 `1:1`
         *
         * 留空将不限制
         */
        aspectRatio?: number;

        guides?: boolean;
        dragMode?: string;
        viewMode?: number;
        rotatable?: boolean;
        scalable?: boolean;
      };

  /**
   * 裁剪后的图片类型
   */
  cropFormat?: string;

  /**
   * 裁剪后的质量
   */
  cropQuality?: number;

  /**
   * 是否允许二次裁剪。
   */
  reCropable?: boolean;

  /**
   * 是否隐藏上传按钮
   */
  hideUploadButton?: boolean;

  /**
   * 限制图片大小，超出不让上传。
   */
  limit?: {
    /**
     * 比率不对时的提示文字
     */
    aspectRatioLabel?: string;
    /**
     * 限制比率
     */
    aspectRatio?: number;

    /**
     * 限制图片高度
     */
    height?: number;

    /**
     *  限制图片宽度
     */
    width?: number;

    /**
     * 限制图片最大高度
     */
    maxHeight?: number;

    /**
     * 限制图片最大宽度
     */
    maxWidth?: number;

    /**
     * 限制图片最小高度
     */
    minHeight?: number;

    /**
     *  限制图片最小宽度
     */
    minWidth?: number;
  };

  /**
   * 最多的个数
   */
  maxLength?: number;

  /**
   * 默认没有限制，当设置后，文件大小大于此值将不允许上传。
   */
  maxSize?: number;

  /**
   * 默认 `/api/upload` 如果想自己存储，请设置此选项。
   */
  receiver?: SchemaApi;

  /**
   * 默认为 false, 开启后，允许用户输入压缩选项。
   *
   * @deprecated
   */
  showCompressOptions?: boolean;

  /**
   * 是否为多选
   */
  multiple?: boolean;

  /**
   * 可配置移动端的拍照功能，比如配置 `camera` 移动端只能拍照，等
   */
  capture?: string;

  /**
   * 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
   * 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
   */
  joinValues?: boolean;

  /**
   * 分割符
   */
  delimiter?: string;

  /**
   * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
   */
  extractValue?: boolean;

  /**
   * 清除时设置的值
   */
  resetValue?: any;

  /**
   * 缩路图展示模式
   */
  thumbMode?: 'w-full' | 'h-full' | 'contain' | 'cover';

  /**
   * 缩路图展示比率。
   */
  thumbRatio?: '1:1' | '4:3' | '16:9';

  /**
   * 上传后把其他字段同步到表单内部。
   */
  autoFill?: {
    [propName: string]: SchemaTokenizeableString;
  };

  /**
   * 初始化时是否把其他字段同步到表单内部。
   */
  initAutoFill?: boolean;

  /**
   * 初始化时是否打开裁剪模式
   */
  initCrop?: boolean;

  /**
   * 图片上传完毕是否进入裁剪模式
   */
  dropCrop?: boolean;

  /**
   * 默认占位图图片地址
   */
  frameImage?: SchemaUrlPath;

  /**
   * 是否开启固定尺寸
   */
  fixedSize?: boolean;

  /**
   * 固定尺寸的 CSS类名
   */
  fixedSizeClassName?: SchemaClassName;

  /**
   * 是否可拖拽排序
   */
  draggable?: boolean;

  /**
   * 可拖拽排序的提示信息。
   *
   * @default 可拖拽排序
   */
  draggableTip?: string;
}

let preventEvent = (e: any) => e.stopPropagation();

export interface ImageProps
  extends FormControlProps,
    Omit<
      ImageControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  onImageEnlarge?: (
    info: Pick<ImageThumbProps, 'src' | 'originalSrc' | 'title' | 'caption'> & {
      index?: number;
      list?: Array<
        Pick<ImageThumbProps, 'src' | 'originalSrc' | 'title' | 'caption'>
      >;
    }
  ) => void;
}

export interface ImageState {
  uploading: boolean;
  locked: boolean;
  lockedReason?: string;
  files: Array<FileValue | FileX>;
  crop?: any;
  error?: string;
  cropFile?: FileValue;
  cropFileName?: string; // 主要是用于后续上传的时候获得用户名
  submitOnChange?: boolean;
  frameImageWidth?: number;
  // drop-zone 组件是否能多选的限制，主要是为了限制重选情况下只能单选，其他情况和 props 的 multiple 一致
  dropMultiple?: boolean;
}

export interface FileValue {
  value?: any;
  state: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
  url?: string;
  error?: string;
  info?: {
    width: number;
    height: number;
    len?: number;
  };
  [propName: string]: any;
}

export interface FileX extends File {
  id?: string | number;
  preview?: string;
  state?: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
  progress?: number;
  error?: string;
  [propName: string]: any;
}

export type InputImageRendererEvent = 'change' | 'success' | 'fail' | 'remove';
export type InputImageRendererAction = 'clear';

function formatIconThemeCss(themeCss: any) {
  let addBtnControlClassName: PlainObject = {};
  ['default', 'hover', 'active'].forEach(key => {
    addBtnControlClassName[`color:${key}`] =
      themeCss?.addBtnControlClassName?.[`icon-color:${key}`];
  });
  Object.keys(addBtnControlClassName).forEach((key: any) => {
    if (!addBtnControlClassName[key]) {
      delete addBtnControlClassName[key];
    }
  });
  if (!isEmpty(addBtnControlClassName)) {
    return {addBtnControlClassName};
  }
  return;
}

export default class ImageControl extends React.Component<
  ImageProps,
  ImageState
> {
  static defaultProps = {
    limit: undefined,
    accept: 'image/jpeg, image/jpg, image/png, image/gif',
    receiver: '/api/upload',
    hideUploadButton: false,
    placeholder: 'Image.placeholder',
    placeholderPlacement: 'top',
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    autoUpload: true,
    multiple: false,
    capture: undefined,
    dropCrop: true,
    initAutoFill: true
  };

  static valueToFile(
    value: string | object,
    props?: ImageProps
  ): FileValue | undefined {
    return value
      ? {
          ...(typeof value === 'string'
            ? {
                value,
                url: value,
                name: value.split('/').pop(),
                filename: value.split('/').pop(),
                id: guid()
              }
            : value),
          state: 'init'
        }
      : undefined;
  }

  static sizeInfo(
    width: number | undefined,
    height: number | undefined,
    __: TranslateFn
  ): string {
    if (!width) {
      return __('Image.height', {height: height});
    } else if (!height) {
      return __('Image.width', {width: width});
    }

    return __('Image.size', {width, height});
  }

  state: ImageState = {
    uploading: false,
    locked: false,
    files: [],
    dropMultiple: false
  };

  files: Array<FileValue | FileX> = [];
  fileKeys: WeakMap<FileValue | FileX, string> = new WeakMap();
  fileUploadCancelExecutors: Array<{
    file: any;
    executor: () => void;
  }> = [];
  cropper: Cropper;
  dropzone = React.createRef<any>();
  frameImageRef = React.createRef<any>();
  current: FileValue | FileX | null = null;
  resolve?: (value?: any) => void;
  emitValue: any;
  unmounted = false;
  initedFilled = false;
  // 文件重新上传的位置标记，用以定位替换
  reuploadIndex: undefined | number = undefined;

  toDispose: Array<() => void> = [];

  constructor(props: ImageProps) {
    super(props);
    const value: string | Array<string | FileValue> | FileValue = props.value;
    const multiple = props.multiple;
    const joinValues = props.joinValues;
    const delimiter = props.delimiter as string;
    let files: Array<FileValue> = [];

    if (value) {
      // files = (multiple && Array.isArray(value) ? value : joinValues ? (value as string).split(delimiter) : [value])
      files = (
        Array.isArray(value)
          ? value
          : joinValues && typeof value === 'string' && multiple
          ? (value as string).split(delimiter)
          : [value]
      )
        .map(item => ImageControl.valueToFile(item) as FileValue)
        .filter(item => item);
    }

    this.state = {
      ...this.state,
      files: (this.files = files),
      crop: this.buildCrop(props),
      dropMultiple: props.multiple,
      frameImageWidth: 0
    };

    this.sendFile = this.sendFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.cancelCrop = this.cancelCrop.bind(this);
    this.rotatableCrop = this.rotatableCrop.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleFrameImageLoaded = this.handleFrameImageLoaded.bind(this);
    this.startUpload = this.startUpload.bind(this);
    this.stopUpload = this.stopUpload.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.tick = this.tick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.addFiles = this.addFiles.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.syncAutoFill = this.syncAutoFill.bind(this);
    this.handleReSelect = this.handleReSelect.bind(this);
    this.handleFileCancel = this.handleFileCancel.bind(this);
    this.dragTipRef = this.dragTipRef.bind(this);
  }

  componentDidMount() {
    const {formInited, addHook, formItem} = this.props;

    const onInited = () => {
      this.initedFilled = true;
      this.props.initAutoFill && this.syncAutoFill();
    };

    formItem &&
      this.toDispose.push(
        formInited || !addHook
          ? formItem.addInitHook(onInited)
          : addHook(onInited, 'init')
      );

    if (this.props.initCrop && this.files.length) {
      this.editImage(0);
    }
  }

  componentDidUpdate(prevProps: ImageProps) {
    const props = this.props;

    if (prevProps.value !== props.value) {
      const value: string | Array<string | FileValue> | FileValue = props.value;
      const multiple = props.multiple;
      const joinValues = props.joinValues;
      const delimiter = props.delimiter as string;
      let files: Array<FileValue> = [];

      if (value) {
        files = (
          Array.isArray(value)
            ? value
            : joinValues && typeof value === 'string' && multiple
            ? (value as string).split(delimiter)
            : [value]
        )
          .map(item => {
            let obj = ImageControl.valueToFile(item, props) as FileValue;
            let org;

            if (
              obj &&
              (org = find(
                this.files,
                item => (item as FileValue).value === obj.value
              ))
            ) {
              obj = {
                ...org,
                ...obj,
                id: org.id || obj.id || guid()
              };
            }

            return obj;
          })
          .filter(item => item);
      }

      this.setState(
        {
          files: (this.files = files)
        },
        props.changeMotivation !== 'formInited' && this.initedFilled
          ? this.syncAutoFill
          : undefined
      );
    }

    if (prevProps.multiple !== props.multiple) {
      this.setState({
        dropMultiple: props.multiple
      });
    }

    if (prevProps.crop !== props.crop) {
      this.setState({
        crop: this.buildCrop(props)
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.fileKeys = new WeakMap();

    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  }

  getFileKey(file: FileValue | FileX) {
    if (file.id) {
      return file.id;
    }
    if (this.fileKeys.has(file)) {
      return this.fileKeys.get(file);
    }

    const key = guid();
    this.fileKeys.set(file, key);
    return key;
  }

  buildCrop(props: ImageProps) {
    let crop = props.crop;
    const __ = this.props.translate;

    if (crop && props.multiple) {
      props.env && props.env.alert && props.env.alert(__('Image.configError'));
      return null;
    }

    if (crop === true) {
      crop = {};
    }

    if (crop) {
      crop = {
        aspectRatio: undefined, // 默认不限制
        guides: true,
        dragMode: 'move',
        viewMode: 1,
        rotatable: true,
        scalable: true,
        ...crop
      };
    }

    return crop;
  }

  handleDropRejected(
    rejectedFiles: FileRejection[],
    evt: React.DragEvent<any>
  ) {
    if (evt.type !== 'change' && evt.type !== 'drop') {
      return;
    }

    const {
      accept,
      multiple,
      onChange,
      maxLength,
      maxSize,
      translate: __,
      invalidTypeMessage,
      invalidSizeMessage
    } = this.props;

    let reFiles = rejectedFiles.map(item => item.file);
    let currentFiles = this.files;

    if (!multiple && currentFiles.length) {
      currentFiles = [];
    }

    const allowed = !isNil(this.reuploadIndex)
      ? reFiles.length
      : (multiple
          ? maxLength
            ? maxLength
            : reFiles.length + currentFiles.length
          : 1) - currentFiles.length;

    // 限制过多的错误文件
    if (allowed <= 0) {
      return;
    }

    const errorFiles = [].slice.call(reFiles, 0, allowed);

    const formatFile = (file: FileX): FileX => {
      file.id = guid();
      const errors = rejectedFiles.find(i => i.file === file)?.errors;
      if (errors) {
        file.error = errors
          .map(err => {
            // 类型错误
            if (err.code === ErrorCode.FileInvalidType) {
              if (invalidTypeMessage) {
                return localeFormatter(invalidTypeMessage, {
                  files: file.name,
                  accept
                });
              } else {
                return __('File.invalidType', {
                  files: file.name,
                  accept
                });
              }
            }
            // 文件太大
            else if (err.code === ErrorCode.FileTooLarge) {
              if (invalidSizeMessage) {
                return localeFormatter(invalidSizeMessage, {
                  maxSize: prettyBytes(maxSize as number, 1024)
                });
              } else {
                return __('File.sizeLimit', {
                  maxSize: prettyBytes(maxSize as number, 1024)
                });
              }
            }
            return '';
          })
          .join('; ');
      }
      file.state = 'invalid';
      return file;
    };

    if (multiple) {
      if (this.reuploadIndex !== undefined) {
        currentFiles.splice(this.reuploadIndex, 1, formatFile(errorFiles[0]));
        this.reuploadIndex = undefined;
      } else {
        errorFiles.forEach((item: any) => {
          currentFiles.push(formatFile(item));
        });
      }
      this.setState({
        files: (this.files = currentFiles),
        dropMultiple: multiple
      });
    } else {
      const file = formatFile(errorFiles[0]);
      this.setState(
        {
          error: file?.error ?? '',
          files: (this.files = []),
          dropMultiple: multiple
        },
        () => onChange(undefined)
      );
    }
  }

  handleFileCancel() {
    this.setState({
      dropMultiple: this.props.multiple
    });
  }

  startUpload(retry: boolean = false) {
    if (this.state.uploading) {
      return;
    }

    this.setState(
      {
        uploading: true,
        locked: true,
        files: (this.files = this.files.map(file => {
          if (retry && file.state === 'error') {
            file.state = 'pending';
            file.progress = 0;
          }

          return file;
        }))
      },
      this.tick
    );
  }

  toggleUpload() {
    return this.state.uploading ? this.stopUpload() : this.startUpload();
  }

  stopUpload() {
    if (!this.state.uploading) {
      return;
    }

    this.setState({
      uploading: false
    });
  }

  tick() {
    if (this.current || !this.state.uploading) {
      return;
    }

    const {translate: __, multiple} = this.props;
    const file = find(this.files, item => item.state === 'pending') as FileX;
    if (file) {
      this.current = file;

      file.state = 'uploading';
      this.setState(
        {
          files: (this.files = this.files.concat())
        },
        () =>
          this.sendFile(
            file as FileX,
            (error, file, obj) => {
              const files = this.files.concat();
              const idx = files.indexOf(file);

              if (!~idx) {
                // 事件里面可能把当前表单值给改了
                this.current = null;
                requestAnimationFrame(this.tick);
                return;
              }

              let newFile: FileX | FileValue = file;

              if (error) {
                newFile.state =
                  file.state !== 'uploading' ? file.state : 'error';
                newFile.error = error;

                this.current = null;
                files.splice(idx, 1);
                return this.setState(
                  {
                    files: (this.files = files),
                    error
                  },
                  this.tick
                );
              } else {
                newFile = {
                  name: file.name || this.state.cropFileName,
                  ...obj,
                  preview: file.preview
                } as FileValue;
              }
              files.splice(idx, 1, newFile);
              this.current = null;
              return this.setState(
                {
                  files: (this.files = files)
                },
                this.tick
              );
            },
            progress => {
              const files = this.files.concat();
              const idx = files.indexOf(file);

              if (!~idx) {
                return;
              }

              // file 是个非 File 对象，先不copy了直接改。
              file.progress = progress;
              this.setState({
                files: (this.files = files)
              });
            }
          )
      );
    } else {
      this.setState(
        {
          uploading: false,
          locked: false
        },
        async () => {
          await this.onChange(!!this.resolve, false);
          if (this.resolve) {
            this.resolve(
              this.files.some(file => file.state === 'error')
                ? __('Image.errorRetry')
                : null
            );
            this.resolve = undefined;
          }
        }
      );
    }
  }

  async removeFile(file: FileValue, index: number) {
    const files = this.files.concat();
    const dispatcher = await this.dispatchEvent('remove', {
      ...file, // 保留历史结构
      item: file
    });
    if (dispatcher?.prevented) {
      return;
    }
    this.removeFileCanelExecutor(file, true);
    files.splice(index, 1);

    const isUploading = this.current === file;
    if (isUploading) {
      this.current = null;
    }

    this.setState(
      {
        files: (this.files = files)
      },
      isUploading ? this.tick : this.onChange
    );
  }

  previewImage(file: FileX, index: number, e: React.MouseEvent<any>) {
    const {onImageEnlarge} = this.props;

    if (onImageEnlarge) {
      const files = this.files;
      e.preventDefault();

      onImageEnlarge({
        src: (file.preview || file.url) as string,
        originalSrc: (file.preview || file.url) as string,
        index,
        list: files.map(file => ({
          src: (file.preview || file.url) as string,
          originalSrc: (file.preview || file.url) as string,
          title: file.name || getNameFromUrl(file.value || file.url)
        }))
      });
    }
  }

  editImage(index: number) {
    const files = this.files;

    this.setState({
      cropFile: {
        preview: files[index].preview || (files[index].url as string),
        name: files[index].name,
        state: 'init'
      },
      cropFileName: files[index].name
    });
  }

  async onChange(
    changeImmediately?: boolean,
    changeEvent: boolean = true,
    initAutoFill?: boolean
  ) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;
    const curInitAutoFill = initAutoFill ?? true;

    const files = this.files.filter(
      file => file.state == 'uploaded' || file.state == 'init'
    );

    let newValue: any = files.length
      ? joinValues
        ? files[0].value
        : files[0]
      : '';

    if (multiple) {
      newValue = joinValues
        ? files.map(item => item.value).join(delimiter)
        : extractValue
        ? files.map(item => item.value)
        : files;
    } else {
      newValue = joinValues
        ? newValue.value || newValue
        : extractValue
        ? newValue[valueField || 'value']
        : newValue;
    }

    if (changeEvent) {
      const dispatcher = await this.dispatchEvent('change');
      if (dispatcher?.prevented) {
        return;
      }
    }

    onChange((this.emitValue = newValue || ''), undefined, changeImmediately);
    curInitAutoFill && this.syncAutoFill();
  }

  syncAutoFill() {
    const {autoFill, multiple, onBulkChange, data, name} = this.props;
    // 参照录入｜自动填充
    if (autoFill?.hasOwnProperty('api')) {
      return;
    }
    // 排除自身的字段，否则会无限更新state
    const excludeSelfAutoFill = omit(autoFill, name || '');

    if (!isEmpty(excludeSelfAutoFill) && onBulkChange) {
      const files = this.state.files.filter(
        file => ~['uploaded', 'init', 'ready'].indexOf(file.state as string)
      );
      const toSync = dataMapping(
        excludeSelfAutoFill,
        multiple
          ? {
              items: files
            }
          : files[0]
      );

      Object.keys(toSync).forEach(key => {
        if (isPlainObject(toSync[key]) && isPlainObject(data[key])) {
          toSync[key] = merge({}, data[key], toSync[key]);
        }
      });
      onBulkChange(toSync);
    }
  }

  handleSelect() {
    // 清除标记，以免影响正常上传
    this.reuploadIndex = undefined;
    this.dropzone.current && this.dropzone.current.open();
  }

  handleRetry(index: number) {
    const files = this.files.concat();
    const file = files[index];

    if (file.state !== 'invalid' && file.state !== 'error') {
      return;
    }

    file.state = 'pending';
    file.progress = 0;

    this.setState(
      {
        files: files
      },
      this.startUpload
    );
  }

  handleDrop(files: Array<FileX>, e?: any, event?: DropEvent) {
    const {multiple, crop, dropCrop} = this.props;

    if (!files.length && Array.isArray(e)) {
      const error = e
        .reduce((errors: Array<string>, item) => {
          errors = errors.concat(item.errors.map((e: any) => e.message));
          return errors;
        }, [])
        .join('\n');

      if (this.props.showErrorModal == undefined || this.props.showErrorModal) {
        this.props.env.alert(error);
      }
      return;
    }

    if (crop && !multiple && dropCrop) {
      const file = files[0] as any;
      if (!file.preview || !file.url) {
        file.preview = window.URL.createObjectURL(file);
      }

      return this.setState({
        cropFile: file,
        cropFileName: file.name
      });
    }

    // 拖拽的情况，没有比他更靠前的方法，只能在这里判断
    if (event && event.type === 'drop' && this.reuploadIndex !== undefined) {
      this.reuploadIndex = undefined;
    }
    this.setState(
      {
        dropMultiple: multiple
      },
      () => this.addFiles(files)
    );
  }

  handlePaste(e: React.ClipboardEvent<any>) {
    const event = e.nativeEvent as any;
    const files: Array<FileX> = [];
    const items = event.clipboardData.items;
    const accept = this.props.accept || '*';

    [].slice.call(items).forEach((item: DataTransferItem) => {
      let blob: FileX;

      if (
        item.kind !== 'file' ||
        !(blob = item.getAsFile() as File) ||
        !accepts(blob, accept)
      ) {
        return;
      }

      blob.id = guid();
      files.push(blob);
    });

    // 清除标记，以免影响正常上传
    this.reuploadIndex = undefined;
    this.handleDrop(files);
  }

  handleCrop() {
    const {cropFormat, cropQuality} = this.props;
    const originFormat = this.state.cropFile?.type || 'image/png';
    this.cropper.getCroppedCanvas().toBlob(
      (file: File) => {
        this.addFiles([file]);
        this.setState({
          cropFile: undefined,
          locked: false,
          lockedReason: ''
        });
      },
      cropFormat || originFormat,
      cropQuality || 1
    );
  }

  cancelCrop() {
    this.setState(
      {
        cropFile: undefined,
        cropFileName: undefined,
        locked: false,
        lockedReason: ''
      },
      this.onChange
    );
  }

  rotatableCrop() {
    this.cropper.rotate(45);
  }

  addFiles(files: Array<FileX>) {
    if (!files.length) {
      return;
    }

    const {multiple, maxLength, maxSize, translate: __} = this.props;
    let currentFiles = this.files;

    if (!multiple && currentFiles.length) {
      currentFiles = [];
    }

    const allowed = !isNil(this.reuploadIndex)
      ? files.length
      : (multiple
          ? maxLength
            ? maxLength
            : files.length + currentFiles.length
          : 1) - currentFiles.length;
    const inputFiles: Array<FileX> = [];

    [].slice.call(files, 0, allowed).forEach((file: FileX) => {
      if (maxSize && file.size > maxSize) {
        this.props.env.alert(
          __('File.maxSize', {
            filename: file.name || __('File.imageAfterCrop'),
            actualSize: prettyBytes(file.size, 1024),
            maxSize: prettyBytes(maxSize, 1024)
          })
        );
        return;
      }

      file.state = 'pending';
      file.id = guid();
      if (!file.preview || !file.url) {
        file.preview = URL.createObjectURL(file);
      }
      inputFiles.push(file);
    });

    if (!inputFiles.length) {
      return;
    }

    let finalFiles: Array<FileValue | FileX> = [];
    // 替换
    if (this.reuploadIndex !== undefined) {
      finalFiles = currentFiles.concat();
      // 因为单个文件重新上传也能选择多个，都插到一起
      finalFiles.splice(this.reuploadIndex, 1, ...inputFiles);
      this.reuploadIndex = undefined;
    } else {
      finalFiles = currentFiles.concat(inputFiles);
    }

    this.setState(
      {
        error: undefined,
        files: (this.files = finalFiles),
        locked: true
      },
      () => {
        const {autoUpload} = this.props;

        if (autoUpload) {
          this.startUpload();
        }
      }
    );
  }

  sendFile(
    file: FileX,
    cb: (error: null | string, file: FileX, obj?: FileValue) => void,
    onProgress: (progress: number) => void
  ) {
    const {limit, translate: __} = this.props;

    if (!limit) {
      return this._upload(file, cb, onProgress);
    }

    const image = new Image();
    image.onload = async () => {
      const width = image.width;
      const height = image.height;
      let error = '';

      if (
        (limit.width && limit.width != width) ||
        (limit.height && limit.height != height)
      ) {
        error = __('Image.sizeNotEqual', {
          info: ImageControl.sizeInfo(limit.width, limit.height, __)
        });
      } else if (
        (limit.maxWidth && limit.maxWidth < width) ||
        (limit.maxHeight && limit.maxHeight < height)
      ) {
        error = __('Image.limitMax', {
          info: ImageControl.sizeInfo(limit.maxWidth, limit.maxHeight, __)
        });
      } else if (
        (limit.minWidth && limit.minWidth > width) ||
        (limit.minHeight && limit.minHeight > height)
      ) {
        error = __('Image.limitMin', {
          info: ImageControl.sizeInfo(limit.minWidth, limit.minHeight, __)
        });
      } else if (
        limit.aspectRatio &&
        Math.abs(width / height - limit.aspectRatio) > 0.01
      ) {
        error = __(limit.aspectRatioLabel || 'Image.limitRatio', {
          ratio: (+limit.aspectRatio).toFixed(2)
        });
      }

      if (error) {
        file.state = 'invalid';
        const dispatcher = await this.dispatchEvent('fail', {
          item: file,
          error
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(error, file);
      } else {
        this._upload(file, cb, onProgress);
      }
    };
    image.src = (file.preview || file.url) as string;
  }

  _upload(
    file: FileX,
    cb: (error: null | string, file: Blob, obj?: FileValue) => void,
    onProgress: (progress: number) => void
  ) {
    const __ = this.props.translate;
    this._send(file, this.props.receiver as string, {}, onProgress)
      .then(async (ret: Payload) => {
        if (ret.status && (ret as any).status !== '0') {
          throw new Error(ret.msg || __('Image.errorRetry'));
        }

        const obj: FileValue = {
          ...ret.data,
          state: 'uploaded'
        };
        obj.value = obj.value || obj.url;

        const dispatcher = await this.dispatchEvent('success', {
          ...file, // 保留历史结构
          item: file,
          result: ret.data,
          value: obj.value
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(null, file, obj);
      })
      .catch(async error => {
        const dispatcher = await this.dispatchEvent('fail', {
          item: file,
          error
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(error.message || __('Image.errorRetry'), file);
      });
  }

  async _send(
    file: Blob,
    receiver: string,
    params: object,
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const fd = new FormData();
    const data = this.props.data;
    const api = buildApi(receiver, createObject(data, params), {
      method: 'post'
    });
    const fileField = this.props.fileField || 'file';

    const idx = api.url.indexOf('?');

    if (~idx && params) {
      params = {
        ...qsparse(api.url.substring(idx + 1)),
        ...params
      };
      api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
    } else if (params) {
      api.url += '?' + qsstringify(params);
    }

    if (api.data) {
      qsstringify(api.data)
        .split('&')
        .filter(item => item !== '')
        .forEach(item => {
          let parts = item.split('=');
          fd.append(parts[0], decodeURIComponent(parts[1]));
        });
    }

    // Note: File类型字段放在后面，可以支持第三方云存储鉴权
    fd.append(fileField, file, (file as File).name || this.state.cropFileName);

    api.data = fd;

    const env = this.props.env;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    try {
      return await env.fetcher(api, this.props.data, {
        method: 'post',
        cancelExecutor: (cancelExecutor: () => void) => {
          // 记录取消器，取消的时候要调用
          this.fileUploadCancelExecutors.push({
            file: file,
            executor: cancelExecutor
          });
        },
        onUploadProgress: (event: {loaded: number; total: number}) =>
          onProgress(event.loaded / event.total)
      });
    } finally {
      this.removeFileCanelExecutor(file);
    }
  }

  removeFileCanelExecutor(file: any, execute = false) {
    this.fileUploadCancelExecutors = this.fileUploadCancelExecutors.filter(
      item => {
        if (execute && item.file === file) {
          item.executor();
        }

        return item.file !== file;
      }
    );
  }

  handleClick() {
    (this.refs.dropzone as any).open();
  }

  handleImageLoaded(index: number, e: React.UIEvent<any>) {
    const imgDom = e.currentTarget;
    const img = new Image();
    img.onload = () => {
      delete (img as any).onload;
      const files = this.files.concat();
      const file = files[index];

      if (!file) {
        return;
      }

      file.info = {
        ...file.info,
        width: img.width,
        height: img.height
      };

      files.splice(index, 1, file);
      const needUploading = !!(
        this.current || find(files, file => file.state === 'pending')
      );

      this.unmounted ||
        this.setState(
          {
            files: (this.files = files)
          },
          () => {
            if (!needUploading) {
              this.onChange(false, true, this.props.initAutoFill);
            }
          }
        );
    };
    img.src = imgDom.src;
  }

  handleFrameImageLoaded(e: React.UIEvent<any>) {
    const imgDom = e.currentTarget;
    const img = new Image();
    const {clientHeight} = this.frameImageRef.current;

    const _this = this;
    img.onload = function () {
      const ratio = (this as any).width / (this as any).height;
      const finalWidth = (ratio * (clientHeight - 2)).toFixed(2);
      _this.setState({
        frameImageWidth: +finalWidth
      });
    };
    img.src = imgDom.src;
  }

  validate(): any {
    const {translate: __, multiple} = this.props;

    if (this.state.error) {
      this.setState({
        error: ''
      });
    }

    if (this.state.locked && this.state.lockedReason) {
      return this.state.lockedReason;
    } else if (this.state.cropFile) {
      return new Promise(resolve => {
        this.resolve = resolve;
        this.handleCrop();
      });
    } else if (
      this.state.uploading ||
      this.files.some(item => item.state === 'pending')
    ) {
      return new Promise(resolve => {
        this.resolve = resolve;
        this.startUpload();
      });
    } else if (
      multiple &&
      this.files.some(i => i.state && ['error', 'invalid'].includes(i.state))
    ) {
      return ' ';
    }
  }

  async dispatchEvent(e: string, data?: Record<string, any>) {
    const {dispatchEvent, multiple} = this.props;
    const getEventData = (item: Record<string, any>) => ({
      name: item.path || item.name,
      value: item.value,
      state: item.state,
      error: item.error
    });
    const value: any = data
      ? getEventData(data)
      : this.files.map(item => getEventData(item));
    return dispatchEvent(
      e,
      resolveEventData(
        this.props,
        {...data, file: multiple ? value : value?.[0]},
        'file'
      )
    );
  }

  // 动作
  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {onChange} = this.props;
    if (action.actionType === 'clear') {
      this.files = [];
      onChange('');
    }
  }

  // 重新上传
  handleReSelect(index: number) {
    this.reuploadIndex = index;
    this.setState(
      {
        dropMultiple: false
      },
      () => {
        this.dropzone.current && this.dropzone.current.open();
      }
    );
  }

  dragTip?: HTMLElement;
  sortable?: Sortable;
  id: string = guid();
  dragTipRef(ref: any) {
    if (!this.dragTip && ref) {
      this.initDragging(ref.parentNode as HTMLElement);
    } else if (this.dragTip && !ref) {
      this.destroyDragging();
    }

    this.dragTip = ref;
  }

  initDragging(dom: HTMLElement) {
    const ns = this.props.classPrefix;
    this.sortable = new Sortable(dom, {
      group: `inputimages-${this.id}`,
      animation: 150,
      handle: `.${ns}ImageControl-item [data-role="dragBar"]`,
      ghostClass: `${ns}ImageControl-item--dragging`,
      onEnd: (e: any) => {
        // 没有移动
        if (e.newIndex === e.oldIndex) {
          return;
        }

        // 换回来
        const parent = e.to as HTMLElement;
        if (e.oldIndex < parent.childNodes.length - 1) {
          parent.insertBefore(
            e.item,
            parent.childNodes[
              e.oldIndex > e.newIndex ? e.oldIndex + 1 : e.oldIndex
            ]
          );
        } else {
          parent.appendChild(e.item);
        }

        const files = this.files.concat();
        files.splice(e.newIndex, 0, files.splice(e.oldIndex, 1)[0]);
        this.setState(
          {
            files: (this.files = files)
          },
          () => this.onChange(true)
        );
      }
    });
  }

  destroyDragging() {
    this.sortable && this.sortable.destroy();
  }

  render() {
    const {
      className,
      classnames: cx,
      disabled,
      multiple,
      capture,
      accept,
      maxLength,
      autoUpload,
      hideUploadButton,
      thumbMode,
      thumbRatio,
      reCropable,
      frameImage,
      fixedSize,
      fixedSizeClassName,
      uploadBtnText,
      maxSize,
      render,
      themeCss,
      id,
      translate: __,
      draggable,
      draggableTip,
      env,
      static: isStatic
    } = this.props;

    const {
      files,
      error,
      crop,
      uploading,
      cropFile,
      frameImageWidth,
      dropMultiple
    } = this.state;
    let frameImageStyle: any = {};
    if (fixedSizeClassName && frameImageWidth && fixedSize) {
      frameImageStyle.width = frameImageWidth;
    }
    const filterFrameImage = filter(frameImage, this.props.data, '| raw');
    const hasPending = files.some(file => file.state == 'pending');

    const enableDraggable =
      !!multiple &&
      draggable &&
      !disabled &&
      !isStatic &&
      !hasPending &&
      files.length > 1;

    return (
      <div
        className={cx(
          `ImageControl`,
          className,
          setThemeClassName({
            ...this.props,
            name: 'inputImageControlClassName',
            id,
            themeCss
          })
        )}
      >
        {cropFile ? (
          <div className={cx('ImageControl-cropperWrapper')}>
            <Suspense fallback={<div>...</div>}>
              <Cropper
                {...crop}
                onInitialized={instance => {
                  this.cropper = instance;
                }}
                src={cropFile.preview}
              />
            </Suspense>
            <div className={cx('ImageControl-croperToolbar')}>
              {crop.rotatable && (
                <a
                  className={cx('ImageControl-cropRotatable')}
                  onClick={this.rotatableCrop}
                  data-tooltip={__('rotate')}
                  data-position="left"
                >
                  <Icon icon="retry" className="icon" />
                </a>
              )}
              <a
                className={cx('ImageControl-cropCancel')}
                onClick={this.cancelCrop}
                data-tooltip={__('cancel')}
                data-position="left"
              >
                <Icon icon="close" className="icon" />
              </a>
              <a
                className={cx('ImageControl-cropConfirm')}
                onClick={this.handleCrop}
                data-tooltip={__('confirm')}
                data-position="left"
              >
                <Icon icon="check" className="icon" />
              </a>
            </div>
          </div>
        ) : (
          <DropZone
            key="drop-zone"
            ref={this.dropzone}
            onDrop={this.handleDrop}
            onDropRejected={this.handleDropRejected}
            onFileDialogCancel={this.handleFileCancel}
            accept={accept}
            multiple={dropMultiple}
            disabled={disabled || isStatic}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject
            }) => (
              <div
                {...getRootProps({
                  onClick: preventEvent,
                  onPaste: this.handlePaste,
                  className: cx('ImageControl-dropzone', {
                    'is-disabled': disabled || isStatic,
                    'is-empty': !files.length,
                    'is-active': isDragActive
                  })
                })}
              >
                <input {...getInputProps()} capture={capture as any} />

                {isDragActive || isDragAccept || isDragReject ? (
                  <div
                    className={cx('ImageControl-acceptTip', {
                      'is-accept': isDragAccept,
                      'is-reject': isDragReject
                    })}
                  >
                    {__('Image.dragDrop')}
                  </div>
                ) : (
                  <>
                    {files && files.length ? (
                      <div className={cx('ImageControl-itemList')}>
                        {files.map((file, key) => (
                          <div
                            key={`${this.getFileKey(file)}-${key}`}
                            className={cx(
                              'ImageControl-item',
                              {
                                'is-uploaded': file.state !== 'uploading',
                                'is-invalid':
                                  file.state === 'error' ||
                                  file.state === 'invalid'
                              },
                              fixedSize ? 'ImageControl-fixed-size' : '',
                              fixedSize ? fixedSizeClassName : ''
                            )}
                            style={frameImageStyle}
                          >
                            {file.state === 'invalid' ||
                            file.state === 'error' ? (
                              <TooltipWrapper
                                placement="top"
                                tooltip={{
                                  content: file.error,
                                  disabled: !multiple && files.length === 1,
                                  tooltipBodyClassName: cx(
                                    'ImageControl-item-errorTip'
                                  )
                                }}
                                trigger="hover"
                              >
                                <div className={cx('Image--thumb')}>
                                  <div className={cx('Image-thumbWrap')}>
                                    <div
                                      className={cx(
                                        'Image-thumb',
                                        'ImageControl-filename'
                                      )}
                                    >
                                      <Icon icon="image" className="icon" />
                                      <span
                                        title={
                                          file.name ||
                                          getNameFromUrl(file.value || file.url)
                                        }
                                      >
                                        {file.name ||
                                          getNameFromUrl(
                                            file.value || file.url
                                          )}
                                      </span>
                                    </div>

                                    <div className={cx('Image-overlay')}>
                                      <a
                                        data-tooltip={__('File.repick')}
                                        data-position="bottom"
                                        onClick={this.handleReSelect.bind(
                                          this,
                                          key
                                        )}
                                      >
                                        <Icon icon="upload" className="icon" />
                                      </a>

                                      {!disabled && !isStatic ? (
                                        <a
                                          data-tooltip={__('Select.clear')}
                                          data-position="bottom"
                                          onClick={this.removeFile.bind(
                                            this,
                                            file,
                                            key
                                          )}
                                        >
                                          <Icon
                                            icon="remove"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </TooltipWrapper>
                            ) : file.state === 'uploading' ? (
                              <>
                                <a
                                  onClick={this.removeFile.bind(
                                    this,
                                    file,
                                    key
                                  )}
                                  key="clear"
                                  className={cx('ImageControl-itemClear')}
                                  data-tooltip={__('Select.clear')}
                                >
                                  <Icon icon="close" className="icon" />
                                </a>
                                <div
                                  key="info"
                                  className={cx(
                                    'ImageControl-itemInfo',
                                    fixedSize ? 'ImageControl-fixed-size' : '',
                                    fixedSize ? fixedSizeClassName : ''
                                  )}
                                >
                                  <div className={cx('ImageControl-progress')}>
                                    <span
                                      style={{
                                        width: `${Math.round(
                                          file.progress * 100
                                        )}%`
                                      }}
                                      className={cx(
                                        'ImageControl-progressValue'
                                      )}
                                    />
                                  </div>
                                  <p>{__('File.uploading')}</p>
                                </div>
                              </>
                            ) : (
                              <>
                                <ImageComponent
                                  key="image"
                                  className={cx(
                                    'ImageControl-image',
                                    fixedSize ? 'Image-thumb--fixed-size' : ''
                                  )}
                                  onLoad={this.handleImageLoaded.bind(
                                    this,
                                    key
                                  )}
                                  src={file.preview || file.url}
                                  alt={file.name}
                                  thumbMode={thumbMode}
                                  thumbRatio={thumbRatio}
                                  overlays={
                                    <>
                                      {enableDraggable ? (
                                        <a
                                          data-role="dragBar"
                                          data-tooltip={__(
                                            draggableTip || 'Image.dragTip'
                                          )}
                                          data-position="bottom"
                                          target="_blank"
                                          rel="noopener"
                                        >
                                          <Icon
                                            icon="drag-bar"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}
                                      <a
                                        data-tooltip={__('Image.zoomIn')}
                                        data-position="bottom"
                                        target="_blank"
                                        rel="noopener"
                                        href={file.url || file.preview}
                                        onClick={this.previewImage.bind(
                                          this,
                                          file,
                                          key
                                        )}
                                      >
                                        <Icon icon="view" className="icon" />
                                      </a>

                                      {!!crop &&
                                      reCropable !== false &&
                                      !disabled &&
                                      !isStatic ? (
                                        <a
                                          data-tooltip={__('Image.crop')}
                                          data-position="bottom"
                                          onClick={this.editImage.bind(
                                            this,
                                            key
                                          )}
                                        >
                                          <Icon
                                            icon="pencil"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}

                                      {!disabled && !isStatic ? (
                                        <a
                                          data-tooltip={__('Select.upload')}
                                          data-position="bottom"
                                          onClick={() =>
                                            this.handleReSelect(key)
                                          }
                                        >
                                          <Icon
                                            icon="upload"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}

                                      {!disabled && !isStatic ? (
                                        <a
                                          data-tooltip={__('Select.clear')}
                                          data-position="bottom"
                                          onClick={this.removeFile.bind(
                                            this,
                                            file,
                                            key
                                          )}
                                        >
                                          <Icon
                                            icon="remove"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}
                                      {/* <a
                                      data-tooltip={
                                        file.name ||
                                        getNameFromUrl(file.value || file.url)
                                      }
                                      data-position="bottom"
                                      target="_blank"
                                    >
                                      <Icon icon="info" className="icon" />
                                    </a> */}
                                    </>
                                  }
                                />
                              </>
                            )}
                          </div>
                        ))}
                        {enableDraggable ? (
                          <span ref={this.dragTipRef} />
                        ) : null}
                      </div>
                    ) : null}

                    {!isStatic &&
                    ((multiple && (!maxLength || files.length < maxLength)) ||
                      (!multiple && !files.length)) ? (
                      <TooltipWrapper
                        placement="top"
                        trigger="hover"
                        tooltip={{
                          content: error,
                          disabled: !multiple || !error
                        }}
                      >
                        <label
                          className={cx(
                            'ImageControl-addBtn',
                            {
                              'is-disabled': disabled
                            },
                            fixedSize ? 'ImageControl-fixed-size' : '',
                            fixedSize ? fixedSizeClassName : '',
                            setThemeClassName({
                              ...this.props,
                              name: 'addBtnControlClassName',
                              id,
                              themeCss
                            }),
                            setThemeClassName({
                              ...this.props,
                              name: 'addBtnControlClassName',
                              id,
                              themeCss: formatIconThemeCss(themeCss),
                              extra: 'icon'
                            }),
                            error ? 'is-invalid' : ''
                          )}
                          style={frameImageStyle}
                          onClick={this.handleSelect}
                          ref={this.frameImageRef}
                        >
                          <Icon
                            icon="plus-fine"
                            className="icon"
                            iconContent={cx(
                              ':ImageControl-addBtn-icon',
                              setThemeClassName({
                                ...this.props,
                                name: 'iconControlClassName',
                                id,
                                themeCss
                              })
                            )}
                          />
                          <span className={cx('ImageControl-addBtn-text')}>
                            {!uploadBtnText
                              ? __('Image.upload')
                              : render(`btn-upload-text`, uploadBtnText, {})}
                          </span>
                          {filterFrameImage ? (
                            <div className={cx('ImageControl-addBtn-bg')}>
                              <ImageComponent
                                key="upload-default-image"
                                src={filterFrameImage}
                                className={cx(
                                  fixedSize ? 'Image-thumb--fixed-size' : ''
                                )}
                                onLoad={this.handleFrameImageLoaded.bind(this)}
                                thumbMode={thumbMode}
                                thumbRatio={thumbRatio}
                              />
                            </div>
                          ) : null}
                        </label>
                      </TooltipWrapper>
                    ) : null}

                    {!isStatic &&
                    !autoUpload &&
                    !hideUploadButton &&
                    files.length ? (
                      <Button
                        level="default"
                        className={cx('ImageControl-uploadBtn')}
                        disabled={!hasPending}
                        onClick={this.toggleUpload}
                      >
                        {__(uploading ? 'File.pause' : 'File.start')}
                      </Button>
                    ) : null}

                    {error ? (
                      <div className={cx('ImageControl-errorMsg')}>{error}</div>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </DropZone>
        )}
        <CustomStyle
          {...this.props}
          config={{
            themeCss,
            classNames: [
              {
                key: 'inputImageControlClassName'
              },
              {
                key: 'addBtnControlClassName',
                weights: {
                  hover: {
                    suf: ':not(:disabled):not(.is-disabled)'
                  },
                  active: {
                    suf: ':not(:disabled):not(.is-disabled)'
                  }
                }
              },
              {
                key: 'iconControlClassName',
                weights: {
                  default: {
                    suf: ' svg'
                  }
                }
              }
            ],
            id
          }}
          env={env}
        />
        <CustomStyle
          {...this.props}
          config={{
            themeCss: formatIconThemeCss(themeCss),
            classNames: [
              {
                key: 'addBtnControlClassName',
                weights: {
                  default: {
                    inner: 'svg'
                  },
                  hover: {
                    suf: ':not(:disabled):not(.is-disabled)',
                    inner: 'svg'
                  },
                  active: {
                    suf: ':not(:disabled):not(.is-disabled)',
                    inner: 'svg'
                  }
                }
              }
            ],
            id: id && id + '-icon'
          }}
          env={env}
        />
      </div>
    );
  }
}

@FormItem({
  type: 'input-image',
  sizeMutable: false,
  shouldComponentUpdate: (props: any, prevProps: any) =>
    !!isEffectiveApi(props.receiver, props.data) &&
    (isApiOutdated(
      props.receiver,
      prevProps.receiver,
      props.data,
      prevProps.data
    ) ||
      isApiOutdatedWithData(
        props.receiver,
        prevProps.receiver,
        props.data,
        prevProps.data
      ))
})
export class ImageControlRenderer extends ImageControl {}
