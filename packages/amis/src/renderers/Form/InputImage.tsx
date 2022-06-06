import React, {Suspense} from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
// import 'cropperjs/dist/cropper.css';
const Cropper = React.lazy(() => import('react-cropper'));
import DropZone from 'react-dropzone';
import {FileRejection} from 'react-dropzone';
import 'blueimp-canvastoblob';
import find from 'lodash/find';
import {Payload, ActionObject} from 'amis-core';
import {buildApi} from 'amis-core';
import {createObject, qsstringify, guid, isEmpty, qsparse} from 'amis-core';
import {Icon} from 'amis-ui';
import {Button} from 'amis-ui';
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

/**
 * Image 图片上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/image
 */
export interface ImageControlSchema extends FormBaseControlSchema {
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
  [propName: string]: any;
}

export type InputImageRendererEvent = 'change' | 'success' | 'fail' | 'remove';
export type InputImageRendererAction = 'clear';

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
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    autoUpload: true,
    multiple: false
  };

  static formatFileSize(
    size: number | string,
    units = [' B', ' KB', ' M', ' G']
  ) {
    size = parseInt(size as string, 10) || 0;

    while (size > 1024 && units.length > 1) {
      size /= 1024;
      units.shift();
    }

    return size.toFixed(2) + units[0];
  }

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
    files: []
  };

  files: Array<FileValue | FileX> = [];
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
  initAutoFill: boolean;

  constructor(props: ImageProps) {
    super(props);
    const value: string | Array<string | FileValue> | FileValue = props.value;
    const multiple = props.multiple;
    const joinValues = props.joinValues;
    const delimiter = props.delimiter as string;
    let files: Array<FileValue> = [];
    this.initAutoFill = !!props.initAutoFill;

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
  }

  componentDidMount() {
    this.syncAutoFill();
  }

  componentDidUpdate(prevProps: ImageProps) {
    const props = this.props;

    if (prevProps.value !== props.value && this.emitValue !== props.value) {
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
                id: org.id || obj.id
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
        this.syncAutoFill
      );
    } else if (prevProps.value !== props.value && !this.initAutoFill) {
      this.initAutoFill = true;
      this.syncAutoFill();
    }

    if (prevProps.crop !== props.crop) {
      this.setState({
        crop: this.buildCrop(props)
      });
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
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
    const {multiple, env, accept, translate: __} = this.props;

    const files = rejectedFiles.map(fileRejection => ({
      ...fileRejection.file,
      state: 'invalid',
      id: guid(),
      name: fileRejection.file.name
    }));

    // this.setState({
    //   files: this.files = multiple
    //     ? this.files.concat(files)
    //     : this.files.length
    //     ? this.files
    //     : files.slice(0, 1)
    // });

    env.alert(
      __('File.invalidType', {
        files: files.map((file: any) => `「${file.name}」`).join(' '),
        accept
      })
    );
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

    const env = this.props.env;
    const __ = this.props.translate;
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
                return;
              }

              let newFile: FileX | FileValue = file;

              if (error) {
                newFile.state =
                  file.state !== 'uploading' ? file.state : 'error';
                newFile.error = error;

                if (!this.props.multiple && newFile.state === 'invalid') {
                  files.splice(idx, 1);
                  this.current = null;

                  return this.setState(
                    {
                      files: (this.files = files),
                      error: error
                    },
                    this.tick
                  );
                }

                env.notify('error', error || __('File.errorRetry'));
              } else {
                newFile = {
                  name: file.name || this.state.cropFileName,
                  ...obj,
                  preview: file.preview
                } as FileValue;
              }
              files.splice(idx, 1, newFile);
              this.current = null;
              this.setState(
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
        () => {
          this.onChange(!!this.resolve, false);

          if (this.resolve) {
            this.resolve(
              this.files.some(file => file.state === 'error')
                ? __('File.errorRetry')
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
    const dispatcher = await this.dispatchEvent('remove', file);
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

  async onChange(changeImmediately?: boolean, changeEvent: boolean = true) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      delimiter,
      valueField
    } = this.props;

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
    this.syncAutoFill();
  }

  syncAutoFill() {
    const {autoFill, multiple, onBulkChange, data, name} = this.props;
    // 排除自身的字段，否则会无限更新state
    const excludeSelfAutoFill = omit(autoFill, name || '');

    if (!isEmpty(excludeSelfAutoFill) && onBulkChange && this.initAutoFill) {
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

  handleDrop(files: Array<FileX>) {
    const {multiple, crop} = this.props;

    if (crop && !multiple) {
      const file = files[0] as any;
      if (!file.preview || !file.url) {
        file.preview = window.URL.createObjectURL(file);
      }

      return this.setState({
        cropFile: file,
        cropFileName: file.name
      });
    }

    this.addFiles(files);
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

    this.handleDrop(files);
  }

  handleCrop() {
    const {cropFormat, cropQuality} = this.props;
    this.cropper.getCroppedCanvas().toBlob(
      (file: File) => {
        this.addFiles([file]);
        this.setState({
          cropFile: undefined,
          locked: false,
          lockedReason: ''
        });
      },
      cropFormat || 'image/png',
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

    const {multiple, maxLength, maxSize, accept, translate: __} = this.props;
    let currentFiles = this.files;

    if (!multiple && currentFiles.length) {
      currentFiles = [];
    }

    const allowed =
      (multiple
        ? maxLength
          ? maxLength
          : files.length + currentFiles.length
        : 1) - currentFiles.length;
    const inputFiles: Array<FileX> = [];

    [].slice.call(files, 0, allowed).forEach((file: FileX) => {
      if (maxSize && file.size > maxSize) {
        this.props.env.alert(
          __('File.maxSize', {
            filename: file.name,
            actualSize: ImageControl.formatFileSize(file.size),
            maxSize: ImageControl.formatFileSize(maxSize)
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

    this.setState(
      {
        error: undefined,
        files: (this.files = currentFiles.concat(inputFiles)),
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
        const dispatcher = await this.dispatchEvent('fail', {file, error});
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
          throw new Error(ret.msg || __('File.errorRetry'));
        }

        const obj: FileValue = {
          ...ret.data,
          state: 'uploaded'
        };
        obj.value = obj.value || obj.url;

        const dispatcher = await this.dispatchEvent('success', {
          ...file,
          value: obj.value,
          state: 'uploaded'
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(null, file, obj);
      })
      .catch(async error => {
        const dispatcher = await this.dispatchEvent('fail', {
          file,
          error
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(error.message || __('File.errorRetry'), file);
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

    const env = this.props.env;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    try {
      return await env.fetcher(api, fd, {
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
          !needUploading ? this.onChange : undefined
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
    const __ = this.props.translate;

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
    } else if (this.files.some(item => item.state === 'error')) {
      return __('File.errorRetry');
    }
  }

  async dispatchEvent(e: string, data?: Record<string, any>) {
    const {dispatchEvent} = this.props;
    const getEventData = (item: Record<string, any>) => ({
      name: item.path || item.name,
      value: item.value,
      state: item.state,
      error: item.error
    });
    const value = data
      ? getEventData(data)
      : this.files.map(item => getEventData(item));
    return dispatchEvent(e, createObject(this.props.data, {file: value}));
  }

  // 动作
  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {onChange} = this.props;
    if (action.actionType === 'clear') {
      this.files = [];
      onChange('');
    }
  }

  render() {
    const {
      className,
      classnames: cx,
      placeholder,
      disabled,
      multiple,
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
      translate: __
    } = this.props;
    const {files, error, crop, uploading, cropFile, frameImageWidth} =
      this.state;
    let frameImageStyle: any = {};
    if (fixedSizeClassName && frameImageWidth && fixedSize) {
      frameImageStyle.width = frameImageWidth;
    }
    const filterFrameImage = filter(frameImage, this.props.data, '| raw');

    const hasPending = files.some(file => file.state == 'pending');
    return (
      <div className={cx(`ImageControl`, className)}>
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
            accept={accept}
            multiple={multiple}
            disabled={disabled}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
              isFocused
            }) => (
              <div
                {...getRootProps({
                  onClick: preventEvent,
                  onPaste: this.handlePaste,
                  className: cx('ImageControl-dropzone', {
                    'is-disabled': disabled,
                    'is-empty': !files.length,
                    'is-active': isDragActive
                  })
                })}
              >
                <input {...getInputProps()} />

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
                    {files && files.length
                      ? files.map((file, key) => (
                          <div
                            key={file.id || key}
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
                                        getNameFromUrl(file.value || file.url)}
                                    </span>
                                  </div>

                                  <div className={cx('Image-overlay')}>
                                    <a
                                      data-tooltip={__('File.repick')}
                                      data-position="bottom"
                                      onClick={this.handleRetry.bind(this, key)}
                                    >
                                      <Icon icon="upload" className="icon" />
                                    </a>

                                    {!disabled ? (
                                      <a
                                        data-tooltip={__('Select.clear')}
                                        data-position="bottom"
                                        onClick={this.removeFile.bind(
                                          this,
                                          file,
                                          key
                                        )}
                                      >
                                        <Icon icon="remove" className="icon" />
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
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
                                      {/* {file.info ? (
                                        [
                                          <div key="info">
                                            {file.info.width} x{' '}
                                            {file.info.height}
                                          </div>,
                                          file.info.len ? (
                                            <div key="size">
                                              {ImageControl.formatFileSize(
                                                file.info.len
                                              )}
                                            </div>
                                          ) : null
                                        ]
                                      ) : (
                                        <div>...</div>
                                      )} */}

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
                                      !disabled ? (
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

                                      {!disabled ? (
                                        <a
                                          data-tooltip={__('Select.upload')}
                                          data-position="bottom"
                                          onClick={this.handleSelect}
                                        >
                                          <Icon
                                            icon="upload"
                                            className="icon"
                                          />
                                        </a>
                                      ) : null}

                                      {!disabled ? (
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
                        ))
                      : null}

                    {(multiple && (!maxLength || files.length < maxLength)) ||
                    (!multiple && !files.length) ? (
                      <label
                        className={cx(
                          'ImageControl-addBtn',
                          {
                            'is-disabled': disabled
                          },
                          fixedSize ? 'ImageControl-fixed-size' : '',
                          fixedSize ? fixedSizeClassName : ''
                        )}
                        style={frameImageStyle}
                        onClick={this.handleSelect}
                        data-tooltip={__(placeholder)}
                        data-position="right"
                        ref={this.frameImageRef}
                      >
                        {filterFrameImage ? (
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
                        ) : (
                          <>
                            <Icon icon="plus-fine" className="icon" />
                            <span className={cx('ImageControl-addBtn-text')}>
                              {__('Image.upload')}
                            </span>
                          </>
                        )}

                        {isFocused ? (
                          <span className={cx('ImageControl-pasteTip')}>
                            {__('Image.pasteTip')}
                          </span>
                        ) : null}
                      </label>
                    ) : null}

                    {!autoUpload && !hideUploadButton && files.length ? (
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
      </div>
    );
  }
}

@FormItem({
  type: 'input-image',
  sizeMutable: false
})
export class ImageControlRenderer extends ImageControl {}
