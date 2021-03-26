import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import DropZone from 'react-dropzone';
import {FileRejection} from 'react-dropzone';
import 'blueimp-canvastoblob';
import find from 'lodash/find';
import qs from 'qs';
import {Payload} from '../../types';
import {buildApi} from '../../utils/api';
import {createObject, qsstringify, guid, isEmpty} from '../../utils/helper';
import {Icon} from '../../components/icons';
import Button from '../../components/Button';
import accepts from 'attr-accept';
import {getNameFromUrl} from './File';
import ImageComponent, {ImageThumbProps} from '../Image';
import {TranslateFn} from '../../locale';
import {dataMapping} from '../../utils/tpl-builtin';
import {
  SchemaApi,
  SchemaClassName,
  SchemaTokenizeableString,
  SchemaUrlPath
} from '../../Schema';
import {filter} from '../../utils/tpl';

/**
 * Image 图片上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/image
 */
export interface ImageControlSchema extends FormBaseControl {
  /**
   * 指定为图片上传控件
   */
  type: 'image';

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
  cropper = React.createRef<Cropper>();
  dropzone = React.createRef<any>();
  frameImageRef = React.createRef<any>();
  current: FileValue | FileX | null = null;
  resolve?: (value?: any) => void;
  emitValue: any;
  unmounted = false;

  constructor(props: ImageProps) {
    super(props);
    const value: string | Array<string | FileValue> | FileValue = props.value;
    const multiple = props.multiple;
    const joinValues = props.joinValues;
    const delimiter = props.delimiter as string;
    let files: Array<FileValue> = [];

    if (value) {
      // files = (multiple && Array.isArray(value) ? value : joinValues ? (value as string).split(delimiter) : [value])
      files = (Array.isArray(value)
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
  }

  componentWillReceiveProps(nextProps: ImageProps) {
    const props = this.props;

    if (props.value !== nextProps.value && this.emitValue !== nextProps.value) {
      const value: string | Array<string | FileValue> | FileValue =
        nextProps.value;
      const multiple = nextProps.multiple;
      const joinValues = nextProps.joinValues;
      const delimiter = nextProps.delimiter as string;

      let files: Array<FileValue> = [];

      if (value) {
        files = (Array.isArray(value)
          ? value
          : joinValues && typeof value === 'string'
          ? (value as string).split(delimiter)
          : [value]
        )
          .map(item => {
            let obj = ImageControl.valueToFile(item, nextProps) as FileValue;
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

      this.setState({
        files: (this.files = files)
      });
    }

    if (props.crop !== nextProps.crop) {
      this.setState({
        crop: this.buildCrop(nextProps)
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
        rotatable: false,
        scalable: false,
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
    const {multiple, autoFill, onBulkChange} = this.props;
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
                  name: file.name,
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
                () => {
                  // todo 这个逻辑应该移到 onChange 里面去，因为这个时候并不一定修改了表单项的值。
                  const sendTo =
                    !multiple &&
                    autoFill &&
                    !isEmpty(autoFill) &&
                    dataMapping(autoFill, newFile || {});
                  sendTo && onBulkChange(sendTo);

                  this.tick();
                }
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
          this.onChange(!!this.resolve);

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

  removeFile(file: FileValue, index: number) {
    const files = this.files.concat();

    files.splice(index, 1);

    this.setState(
      {
        files: (this.files = files)
      },
      this.onChange
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
        state: 'init'
      }
    });
  }

  onChange(changeImmediately?: boolean) {
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

    onChange((this.emitValue = newValue || ''), undefined, changeImmediately);
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
      const file = files[0] as FileValue;
      if (!file.preview || !file.url) {
        file.preview = window.URL.createObjectURL(file);
      }

      return this.setState({
        cropFile: file
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
    this.cropper.current!.getCroppedCanvas().toBlob((file: File) => {
      this.addFiles([file]);
      this.setState({
        cropFile: undefined,
        locked: false,
        lockedReason: ''
      });
    });
  }

  cancelCrop() {
    this.setState(
      {
        cropFile: undefined,
        locked: false,
        lockedReason: ''
      },
      this.onChange
    );
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
    image.onload = () => {
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
          ratio: limit.aspectRatio.toFixed(2)
        });
      }

      if (error) {
        file.state = 'invalid';
        cb(error, file);
      } else {
        this._upload(file, cb, onProgress);
      }
    };
    image.src = (file.preview || file.url) as string;
  }

  _upload(
    file: Blob,
    cb: (error: null | string, file: Blob, obj?: FileValue) => void,
    onProgress: (progress: number) => void
  ) {
    const __ = this.props.translate;
    this._send(file, this.props.receiver as string, {}, onProgress)
      .then((ret: Payload) => {
        if (ret.status) {
          throw new Error(ret.msg || __('File.errorRetry'));
        }

        const obj: FileValue = {
          ...ret.data,
          state: 'uploaded'
        };
        obj.value = obj.value || obj.url;

        cb(null, file, obj);
      })
      .catch(error => cb(error.message || __('File.errorRetry'), file));
  }

  _send(
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
        ...qs.parse(api.url.substring(idx + 1)),
        ...params
      };
      api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
    } else if (params) {
      api.url += '?' + qsstringify(params);
    }

    if (api.data) {
      qsstringify(api.data)
        .split('&')
        .forEach(item => {
          let parts = item.split('=');
          fd.append(parts[0], decodeURIComponent(parts[1]));
        });
    }

    // Note: File类型字段放在后面，可以支持第三方云存储鉴权
    fd.append(fileField, file, (file as File).name);

    const env = this.props.env;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    return env.fetcher(api, fd, {
      method: 'post',
      onUploadProgress: (event: {loaded: number; total: number}) =>
        onProgress(event.loaded / event.total)
    });
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
    const {
      files,
      error,
      crop,
      uploading,
      cropFile,
      frameImageWidth
    } = this.state;
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
            <Cropper {...crop} ref={this.cropper} src={cropFile.preview} />
            <div className={cx('ImageControl-croperToolbar')}>
              <a
                className={cx('ImageControl-cropCancel')}
                onClick={this.cancelCrop}
                data-tooltip={__('cancle')}
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
                    disabled,
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
                              <>
                                <a
                                  className={cx('ImageControl-itemClear')}
                                  data-tooltip={__('Select.clear')}
                                  data-position="bottom"
                                  onClick={this.removeFile.bind(
                                    this,
                                    file,
                                    key
                                  )}
                                >
                                  <Icon icon="close" className="icon" />
                                </a>

                                <a
                                  className={cx(
                                    'ImageControl-retryBtn',
                                    {
                                      'is-disabled': disabled
                                    },
                                    fixedSize ? 'ImageControl-fixed-size' : '',
                                    fixedSize ? fixedSizeClassName : ''
                                  )}
                                  onClick={this.handleRetry.bind(this, key)}
                                >
                                  <Icon icon="retry" className="icon" />
                                  <p className="ImageControl-itemInfoError">
                                    {__('File.repick')}
                                  </p>
                                </a>
                              </>
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
                                  <p>{__('File.uploading')}</p>
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
                                />

                                <div
                                  key="overlay"
                                  className={cx('ImageControl-itemOverlay')}
                                >
                                  {file.info ? (
                                    [
                                      <div key="info">
                                        {file.info.width} x {file.info.height}
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
                                  )}

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
                                      onClick={this.editImage.bind(this, key)}
                                    >
                                      <Icon icon="pencil" className="icon" />
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
                                      <Icon icon="remove" className="icon" />
                                    </a>
                                  ) : null}
                                  <a
                                    data-tooltip={
                                      file.name ||
                                      getNameFromUrl(file.value || file.url)
                                    }
                                    data-position="bottom"
                                    target="_blank"
                                  >
                                    <Icon icon="info" className="icon" />
                                  </a>
                                </div>
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
                          <Icon icon="plus" className="icon" />
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
  type: 'image',
  sizeMutable: false
})
export class ImageControlRenderer extends ImageControl {}
