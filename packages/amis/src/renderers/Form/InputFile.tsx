import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import ImageControl from './InputImage';
import {Payload, ApiObject, ApiString, Action} from 'amis-core';
import {qsstringify, createObject, guid, isEmpty} from 'amis-core';
import {buildApi, isEffectiveApi, normalizeApi, isApiOutdated} from 'amis-core';
import {Icon} from 'amis-ui';
import {TooltipWrapper} from 'amis-ui';
import DropZone from 'react-dropzone';
import {FileRejection} from 'react-dropzone';
import {dataMapping} from 'amis-core';
import {
  SchemaApi,
  SchemaClassName,
  SchemaTokenizeableString,
  SchemaUrlPath
} from '../../Schema';
import merge from 'lodash/merge';
import omit from 'lodash/omit';

/**
 * File 文件上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/file
 */
export interface FileControlSchema extends FormBaseControl {
  /**
   * 指定为文件上传
   */
  type: 'input-file';

  /**
   * 上传文件按钮说明
   * @default 请选择文件
   */
  btnLabel?: string;

  /**
   * 默认只支持纯文本，要支持其他类型，请配置此属性。建议直接填写文件后缀
   * 如：.txt,.csv
   *
   * 多个类型用逗号隔开。
   *
   * @default text/plain
   */
  accept?: string;

  /**
   * 如果上传的文件比较小可以设置此选项来简单的把文件 base64 的值给 form 一起提交，目前不支持多选。
   */
  asBase64?: boolean;

  /**
   * 如果不希望 File 组件上传，可以配置 `asBlob` 或者 `asBase64`，采用这种方式后，组件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。
   */
  asBlob?: boolean;

  /**
   * 是否自动开始上传
   */
  autoUpload?: boolean;

  /**
   * 默认 `/api/upload/chunk` 想自己存储时才需要关注。
   */
  chunkApi?: SchemaApi;

  /**
   * 分块大小，默认为 5M.
   *
   * @default 5242880
   */
  chunkSize?: number;

  /**
   * 分块上传的并发数
   */
  concurrency?: number;

  /**
   * 分割符
   */
  delimiter?: string;

  /**
   * 默认显示文件路径的时候会支持直接下载，
   * 可以支持加前缀如：`http://xx.dom/filename=` ，
   * 如果不希望这样，可以把当前配置项设置为 `false`。
   *
   * 1.1.6 版本开始将支持变量 ${xxx} 来自己拼凑个下载地址，并且支持配置成 post.
   */
  downloadUrl?: SchemaApi;

  /**
   * 模板下载地址
   */
  templateUrl?: SchemaApi;

  /**
   * 默认 `file`, 如果你不想自己存储，则可以忽略此属性。
   * @default file
   */
  fileField?: string;

  /**
   * 默认 `/api/upload/finishChunkApi` 想自己存储时才需要关注。
   *
   * @default /api/upload/finishChunkApi
   */
  finishChunkApi?: SchemaApi;

  /**
   * 是否隐藏上传按钮
   */
  hideUploadButton?: boolean;

  /**
   * 最多的个数
   */
  maxLength?: number;

  /**
   * 默认没有限制，当设置后，文件大小大于此值将不允许上传。
   */
  maxSize?: number;

  /**
   * 默认 `/api/upload/file` 如果想自己存储，请设置此选项。
   *
   * @default /api/upload/file
   */
  receiver?: SchemaApi;

  /**
   * 默认 `/api/upload/startChunk` 想自己存储时才需要关注。
   *
   * @default /api/upload/startChunk
   */
  startChunkApi?: string;

  /**
   * 默认为 'auto' amis 所在服务器，限制了文件上传大小不得超出10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。
   */
  useChunk?: 'auto' | boolean;

  /**
   * 按钮 CSS 类名
   */
  btnClassName?: SchemaClassName;

  /**
   * 上传按钮 CSS 类名
   */
  btnUploadClassName?: SchemaClassName;

  /**
   * 是否为多选
   */
  multiple?: boolean;

  /**
   * 1. 单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，
   * 否则，整个选项对象都会作为该表单项的值提交。
   * 2. 多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，
   * 否则直接将以数组的形式提交值。
   */
  joinValues?: boolean;

  /**
   * 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
   */
  extractValue?: boolean;

  /**
   * 清除时设置的值
   */
  resetValue?: any;

  /**
   * 上传后把其他字段同步到表单内部。
   */
  autoFill?: {
    [propName: string]: SchemaTokenizeableString;
  };

  /**
   * 接口返回的数据中，哪个用来当做值
   */
  valueField?: string;

  /**
   * 接口返回的数据中，哪个用来展示文件名
   */
  nameField?: string;

  /**
   * 接口返回的数据中哪个用来作为下载地址。
   */
  urlField?: string;

  /**
   * 按钮状态文案配置。
   */
  stateTextMap?: {
    init: string;
    pending: string;
    uploading: string;
    error: string;
    uploaded: string;
    ready: string;
  };

  /**
   * 说明文档内容配置
   */
  documentation?: string;

  /**
   * 说明文档链接配置
   */
  documentLink?: string;

  /**
   * 是否为拖拽上传
   */
  drag?: boolean;
}

export interface FileProps
  extends FormControlProps,
    Omit<
      FileControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {
  stateTextMap: {
    init: string;
    pending: string;
    uploading: string;
    error: string;
    uploaded: string;
    ready: string;
  };
}

export interface FileX extends File {
  state?:
    | 'init'
    | 'error'
    | 'pending'
    | 'uploading'
    | 'uploaded'
    | 'invalid'
    | 'ready';
  progress?: number;
  id?: any;
}

export interface FileValue {
  filename?: string;
  value?: any;
  name?: string;
  url?: string;
  state:
    | 'init'
    | 'error'
    | 'pending'
    | 'uploading'
    | 'uploaded'
    | 'invalid'
    | 'ready';
  id?: any;
  [propName: string]: any;
}

export interface FileState {
  uploading: boolean;
  files: Array<FileX | FileValue>;
  error?: string | null;
}
let preventEvent = (e: any) => e.stopPropagation();

export function getNameFromUrl(url: string) {
  if (/(?:\/|^)([^\/]+?)$/.test(url)) {
    return decodeURIComponent(RegExp.$1);
  }

  return url;
}
export type InputFileRendererEvent = 'change' | 'success' | 'fail' | 'remove';
export type InputFileRendererAction = 'clear';

export default class FileControl extends React.Component<FileProps, FileState> {
  static defaultProps: Partial<FileProps> = {
    maxSize: 0,
    maxLength: 0,
    placeholder: '',
    receiver: '/api/upload/file',
    fileField: 'file',
    joinValues: true,
    extractValue: false,
    delimiter: ',',
    downloadUrl: '', // '/api/file/'
    templateUrl: '',
    useChunk: 'auto',
    chunkSize: 5 * 1024 * 1024, // 文件大于5M， 自动分块上传
    startChunkApi: '/api/upload/startChunk',
    chunkApi: '/api/upload/chunk',
    finishChunkApi: '/api/upload/finishChunk',
    concurrency: 3,
    accept: '',
    multiple: false,
    autoUpload: true,
    hideUploadButton: false,
    stateTextMap: {
      init: '',
      pending: '等待上传',
      uploading: '上传中',
      error: '上传出错',
      uploaded: '已上传',
      ready: ''
    },
    asBase64: false,
    drag: false
  };

  state: FileState;
  current: FileValue | FileX | null;
  resolve?: (value?: any) => void;
  emitValue: any;
  fileUploadCancelExecutors: Array<{
    file: any;
    executor: () => void;
  }> = [];

  static valueToFile(
    value: string | FileValue,
    props: FileProps,
    files?: Array<FileX | FileValue>
  ): FileValue | undefined {
    let file: FileValue | FileX | undefined =
      files && typeof value === 'string'
        ? find(files, item => (item as FileValue).value === value)
        : undefined;
    const valueField = props.valueField || 'value';
    const urlField = props.urlField || 'url';
    const nameField = props.nameField || 'name';
    return value
      ? value instanceof File
        ? {
            state: 'ready',
            [valueField]: value,
            [urlField]: value,
            [nameField]: value.name,
            id: guid()
          }
        : {
            ...(typeof value === 'string'
              ? {
                  state: file && file.state ? file.state : 'init',
                  [valueField]: value,
                  [urlField]: value,
                  [nameField]:
                    (file && file.name) ||
                    (/^data:/.test(value)
                      ? 'base64数据'
                      : getNameFromUrl(value)),
                  id: guid()
                }
              : (value as FileValue))
          }
      : undefined;
  }

  dropzone = React.createRef<any>();
  constructor(props: FileProps) {
    super(props);

    const value: string | Array<string | FileValue> | FileValue = props.value;
    const valueField = props.valueField || 'value';
    const joinValues = props.joinValues;
    const delimiter = props.delimiter as string;
    let files: Array<FileValue> = [];

    if (value && value instanceof Blob) {
      files = [value as any];
    } else if (value) {
      files = (
        Array.isArray(value)
          ? value
          : joinValues
          ? `${(value as any)[valueField] || value}`.split(delimiter)
          : [value as any]
      )
        .map(item => FileControl.valueToFile(item, props) as FileValue)
        .filter(item => item);
    }

    this.state = {
      files,
      uploading: false
    };

    this.sendFile = this.sendFile.bind(this);
    this.removeFile = this.removeFile.bind(this);
    this.clearError = this.clearError.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDropRejected = this.handleDropRejected.bind(this);
    this.startUpload = this.startUpload.bind(this);
    this.stopUpload = this.stopUpload.bind(this);
    this.retry = this.retry.bind(this);
    this.toggleUpload = this.toggleUpload.bind(this);
    this.tick = this.tick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadBigFile = this.uploadBigFile.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.syncAutoFill = this.syncAutoFill.bind(this);
    this.downloadTpl = this.downloadTpl.bind(this);
  }

  componentDidMount() {
    this.syncAutoFill();
  }

  componentDidUpdate(prevProps: FileProps) {
    const props = this.props;

    if (prevProps.value !== props.value && this.emitValue !== props.value) {
      const value: string | Array<string | FileValue> | FileValue = props.value;
      const joinValues = props.joinValues;
      const delimiter = props.delimiter as string;
      let files: Array<FileValue> = [];

      if (value) {
        files = (
          Array.isArray(value)
            ? value
            : joinValues && typeof value === 'string'
            ? value.split(delimiter)
            : [value as any]
        )
          .map(item => {
            let obj = FileControl.valueToFile(
              item,
              props,
              this.state.files
            ) as FileValue;
            let org;

            if (
              obj &&
              ((org = find(
                this.state.files,
                (item: FileValue) => item.value === obj.value
              )) as FileValue)
            ) {
              obj = {
                ...org,
                ...obj,
                id: obj.id || org!.id
              };
            }

            return obj;
          })
          .filter(item => item);
      }

      this.setState(
        {
          files: files
        },
        this.syncAutoFill
      );
    }
  }

  handleDrop(files: Array<FileX>) {
    if (!files.length) {
      return;
    }

    const {maxSize, multiple, maxLength, translate: __} = this.props;
    const nameField = this.props.nameField || 'name';
    let allowed =
      multiple && maxLength
        ? maxLength - this.state.files.length
        : files.length;

    const inputFiles: Array<FileX> = [];

    [].slice.call(files, 0, allowed).forEach((file: FileX) => {
      if (maxSize && file.size > maxSize) {
        // this.props.env.alert(
        //   __('File.maxSize', {
        //     filename: file[nameField as keyof typeof file] || file.name,
        //     actualSize: ImageControl.formatFileSize(file.size),
        //     maxSize: ImageControl.formatFileSize(maxSize)
        //   })
        // );
        file.state = 'invalid';
      } else {
        file.state = 'pending';
      }

      file.id = guid();
      inputFiles.push(file);
    });

    if (!inputFiles.length) {
      return;
    }

    this.setState(
      {
        error: null,
        files: multiple ? this.state.files.concat(inputFiles) : inputFiles
      },
      () => {
        const {autoUpload} = this.props;

        if (autoUpload) {
          this.startUpload();
        }
      }
    );
  }

  handleDropRejected(
    rejectedFiles: FileRejection[],
    evt: React.DragEvent<any>
  ) {
    if (evt.type !== 'change' && evt.type !== 'drop') {
      return;
    }
    const {multiple, env, accept, translate: __} = this.props;
    const nameField = this.props.nameField || 'name';

    const files = rejectedFiles.map(fileRejection => ({
      ...fileRejection.file,
      state: 'invalid',
      id: guid(),
      [nameField]: fileRejection.file.name
    }));

    // this.setState({
    //   files: multiple
    //     ? this.state.files.concat(files)
    //     : this.state.files.length
    //     ? this.state.files
    //     : files.slice(0, 1)
    // });

    env.alert(
      __('File.invalidType', {
        files: files.map((item: any) => `「${item[nameField]}」`).join(' '),
        accept
      })
    );
  }

  handleClickFile(file: FileX | FileValue, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const {downloadUrl} = this.props;
    const urlField = this.props.urlField || 'url';
    const valueField = this.props.valueField || 'value';

    const fileUrl =
      file[urlField as keyof typeof file] ||
      file[valueField as keyof typeof file];

    let api =
      typeof downloadUrl === 'string' && !~downloadUrl.indexOf('$')
        ? `${downloadUrl}${fileUrl}`
        : downloadUrl
        ? downloadUrl
        : `${fileUrl}`;

    this.handleApi(api, file);
  }

  downloadTpl(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.handleApi(this.props.templateUrl || '');
  }

  handleApi(api: SchemaApi, payload?: object) {
    const {data, env} = this.props;
    if (api) {
      const ctx = createObject(data, {
        ...payload
      });

      const apiObject = normalizeApi(api);

      if (apiObject.method?.toLowerCase() === 'get' && !apiObject.data) {
        window.open(buildApi(apiObject, ctx).url);
      } else {
        apiObject.responseType = apiObject.responseType ?? 'blob';
        env.fetcher(apiObject, ctx, {
          responseType: 'blob'
        });
      }
    }
  }

  handleSelect() {
    const {disabled, multiple, maxLength} = this.props;
    !disabled &&
      !(multiple && maxLength && this.state.files.length >= maxLength) &&
      this.dropzone.current &&
      this.dropzone.current.open();
  }

  startUpload(retry: boolean = false) {
    if (this.state.uploading) {
      return;
    }

    this.setState(
      {
        uploading: true,
        files: this.state.files.map(file => {
          if (retry && file.state === 'error') {
            file.state = 'pending';
            file.progress = 0;
          }

          return file;
        })
      },
      this.tick
    );
  }

  toggleUpload(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
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

  retry() {
    this.startUpload(true);
  }

  tick() {
    if (this.current || !this.state.uploading) {
      return;
    }

    const {translate: __} = this.props;
    const nameField = this.props.nameField || 'name';
    const file = find(
      this.state.files,
      item => item.state === 'pending'
    ) as FileX;
    if (file) {
      this.current = file;

      file.state = 'uploading';

      this.setState(
        {
          files: this.state.files.concat()
        },
        () =>
          this.sendFile(
            file,
            (error, file, obj) => {
              const files = this.state.files.concat();
              const idx = files.indexOf(file as FileX);

              if (!~idx) {
                return;
              }

              let newFile: FileValue = file as FileValue;

              if (error) {
                newFile.state = 'error';
                newFile.error = error;
              } else {
                newFile = obj as FileValue;
                newFile[nameField] = newFile[nameField] || file!.name;
              }
              files.splice(idx, 1, newFile);
              this.current = null;
              this.setState(
                {
                  error: error ? error : null,
                  files: files
                },
                this.tick
              );
            },
            progress => {
              const files = this.state.files.concat();
              const idx = files.indexOf(file);

              if (!~idx) {
                return;
              }

              // file 是个非 File 对象，先不copy了直接改。
              file.progress = progress;
              this.setState({
                files
              });
            }
          )
      );
    } else {
      this.setState(
        {
          uploading: false
        },
        () => {
          this.onChange(!!this.resolve);

          if (this.resolve) {
            this.resolve(
              this.state.files.some(file => file.state === 'error')
                ? __('File.errorRetry')
                : null
            );
            this.resolve = undefined;
          }
        }
      );
    }
  }

  sendFile(
    file: FileX,
    cb: (error: null | string, file?: FileX, obj?: FileValue) => void,
    onProgress: (progress: number) => void
  ) {
    const {
      receiver,
      fileField,
      useChunk,
      chunkSize,
      startChunkApi,
      chunkApi,
      finishChunkApi,
      asBase64,
      asBlob,
      data,
      translate: __
    } = this.props;
    const nameField = this.props.nameField || 'name';
    const valueField = this.props.valueField || 'value';

    if (asBase64) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        file.state = 'ready';
        cb(null, file, {
          [valueField]: reader.result as string,
          [nameField]: file.name,
          state: 'ready',
          id: file.id
        });
      };
      reader.onerror = (error: any) => cb(error.message);
      return;
    } else if (asBlob) {
      file.state = 'ready';
      setTimeout(
        () =>
          cb(null, file, {
            [nameField]: file.name,
            [valueField]: file,
            state: 'ready',
            id: file.id
          }),
        4
      );
      return;
    }

    let fn =
      (useChunk === 'auto' && chunkSize && file.size > chunkSize) ||
      useChunk === true
        ? this.uploadBigFile
        : this.uploadFile;

    fn(
      file,
      receiver as string,
      {},
      {
        fieldName: fileField,
        chunkSize,
        startChunkApi,
        chunkApi,
        finishChunkApi,
        data
      },
      onProgress
    )
      .then(async ret => {
        if ((ret.status && (ret as any).status !== '0') || !ret.data) {
          throw new Error(ret.msg || __('File.errorRetry'));
        }

        onProgress(1);
        let value =
          (ret.data as any).value || (ret.data as any).url || ret.data;

        const dispatcher = await this.dispatchEvent('success', {
          ...file,
          value,
          state: 'uploaded'
        });
        if (dispatcher?.prevented) {
          return;
        }
        cb(null, file, {
          ...(isPlainObject(ret.data) ? ret.data : null),
          value: value,
          state: 'uploaded',
          id: file.id
        });
      })
      .catch(async error => {
        const dispatcher = await this.dispatchEvent('fail', {file, error});
        if (dispatcher?.prevented) {
          return;
        }
        cb(error.message || __('File.errorRetry'), file);
      });
  }

  async removeFile(file: FileX | FileValue, index: number) {
    const files = this.state.files.concat();
    const removeFile = files[index];
    // 触发移出文件事件
    const dispatcher = await this.dispatchEvent('remove', removeFile);
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
        files: files
      },
      isUploading ? this.tick : this.onChange
    );
  }

  clearError() {
    this.setState({
      error: null
    });
  }

  async onChange(changeImmediately?: boolean) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      valueField,
      delimiter,
      resetValue,
      asBlob,
      autoFill,
      onBulkChange
    } = this.props;

    const files = this.state.files.filter(
      file => ~['uploaded', 'init', 'ready'].indexOf(file.state as string)
    );
    let value: any = multiple ? files : files[0];

    if (value) {
      if (extractValue || asBlob) {
        value = Array.isArray(value)
          ? value.map((item: any) => item[valueField || 'value'])
          : value[valueField || 'value'];
      } else if (joinValues) {
        value = Array.isArray(value)
          ? value
              .map((item: any) => item[valueField || 'value'])
              .join(delimiter || ',')
          : value[valueField || 'value'];
      }
    } else {
      value = typeof resetValue === 'undefined' ? '' : resetValue;
    }

    const dispatcher = await this.dispatchEvent('change');
    if (dispatcher?.prevented) {
      return;
    }

    onChange((this.emitValue = value), undefined, changeImmediately);
    this.syncAutoFill();
  }

  syncAutoFill() {
    const {autoFill, multiple, onBulkChange, data, name} = this.props;
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

  async uploadFile(
    file: FileX,
    receiver: string,
    params: object,
    config: Partial<FileProps> = {},
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const fd = new FormData();
    const api = buildApi(receiver, createObject(config.data, params), {
      method: 'post'
    });

    qsstringify({...api.data, ...params})
      .split('&')
      .filter(i => !!i)
      .forEach(item => {
        const parts = item.split('=');
        fd.append(parts[0], decodeURIComponent(parts[1]));
      });

    // Note: File类型字段放在后面，可以支持第三方云存储鉴权
    fd.append(config.fieldName || 'file', file);

    try {
      return await this._send(file, api, fd, {}, onProgress);
    } finally {
      this.removeFileCanelExecutor(file);
    }
  }

  uploadBigFile(
    file: FileX,
    receiver: string,
    params: object,
    config: Partial<FileProps> = {},
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const chunkSize = config.chunkSize || 5 * 1024 * 1024;
    const concurrency = this.props.concurrency;
    const self = this;
    let startProgress = 0.2;
    let endProgress = 0.9;
    let progressArr: Array<number>;
    const __ = this.props.translate;
    const nameField = this.props.nameField || 'name';

    interface ObjectState {
      key: string;
      uploadId: string;
      loaded: number;
      total: number;
      [propName: string]: any;
    }

    interface Task {
      file: File;
      partNumber: number;
      partSize: number;
      start: number;
      stop: number;
      [propName: string]: any;
    }

    return new Promise((resolve, reject) => {
      let state: ObjectState;
      const startApi = buildApi(
        config.startChunkApi!,
        createObject(config.data, {
          ...params,
          filename: file.name,
          [nameField]: file.name
        }),
        {
          method: 'post',
          autoAppend: true
        }
      );

      self._send(file, startApi).then(startChunk).catch(reject);

      async function startChunk(ret: Payload) {
        onProgress(startProgress);
        const tasks = getTasks(file);
        progressArr = tasks.map(() => 0);

        if (!ret.data) {
          throw new Error(__('File.uploadFailed'));
        }

        state = {
          key: (ret.data as any).key,
          uploadId: (ret.data as any).uploadId,
          loaded: 0,
          total: tasks.length
        };

        let results: any[] = [];
        while (tasks.length) {
          const res = await Promise.all(
            tasks.splice(0, concurrency).map(async task => {
              return await uploadPartFile(state, config)(task);
            })
          );
          results = results.concat(res);
        }
        finishChunk(results, state);
      }

      function updateProgress(partNumber: number, progress: number) {
        progressArr[partNumber - 1] = progress;
        onProgress(
          startProgress +
            (endProgress - startProgress) *
              (progressArr.reduce((count, progress) => count + progress, 0) /
                progressArr.length)
        );
      }

      async function finishChunk(
        partList: Array<any> | undefined,
        state: ObjectState
      ) {
        onProgress(endProgress);
        const endApi = buildApi(
          config.finishChunkApi!,
          createObject(config.data, {
            ...params,
            uploadId: state.uploadId,
            key: state.key,
            [nameField]: file.name,
            filename: file.name,
            partList
          }),
          {
            method: 'post',
            autoAppend: true
          }
        );

        try {
          const ret = await self._send(file, endApi);
          resolve(ret);
        } catch (err) {
          reject(err);
        } finally {
          self.removeFileCanelExecutor(file);
        }
      }

      function uploadPartFile(state: ObjectState, conf: Partial<FileProps>) {
        return (task: Task) => {
          const api = buildApi(
            conf.chunkApi!,
            createObject(config.data, params),
            {
              method: 'post'
            }
          );

          const fd = new FormData();
          let blob = task.file.slice(task.start, task.stop + 1);

          qsstringify({...api.data, ...params})
            .split('&')
            .forEach(item => {
              const parts = item.split('=');
              fd.append(parts[0], decodeURIComponent(parts[1]));
            });

          fd.append('key', state.key);
          fd.append('uploadId', state.uploadId);
          fd.append('partNumber', task.partNumber.toString());
          fd.append('partSize', task.partSize.toString());

          // Note: File类型字段放在后面，可以支持第三方云存储鉴权
          fd.append(config.fieldName || 'file', blob, file.name);

          return self
            ._send(file, api, fd, {}, progress =>
              updateProgress(task.partNumber, progress)
            )
            .then(ret => {
              state.loaded++;
              return {
                partNumber: task.partNumber,
                eTag: (ret.data as any).eTag
              };
            });
        };
      }

      function getTasks(file: FileX): Array<Task> {
        let leftSize = file.size;
        let offset = 0;
        let partNumber = 1;

        let tasks: Array<Task> = [];

        while (leftSize > 0) {
          let partSize = Math.min(leftSize, chunkSize);
          tasks.push({
            file: file,
            partNumber: partNumber,
            partSize: partSize,
            start: offset,
            stop: offset + partSize - 1
          });

          leftSize -= partSize;
          offset += partSize;
          partNumber += 1;
        }

        return tasks;
      }
    });
  }

  _send(
    file: FileX,
    api: ApiObject | ApiString,
    data?: any,
    options?: object,
    onProgress?: (progress: number) => void
  ): Promise<Payload> {
    const env = this.props.env;

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    return env.fetcher(api, data, {
      method: 'post',
      ...options,
      withCredentials: true,
      cancelExecutor: (cancelExecutor: () => void) => {
        // 记录取消器，取消的时候要调用
        this.fileUploadCancelExecutors.push({
          file: file,
          executor: cancelExecutor
        });
      },
      onUploadProgress: onProgress
        ? (event: {loaded: number; total: number}) =>
            onProgress(event.loaded / event.total)
        : undefined
    });
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

  validate(): any {
    const __ = this.props.translate;

    if (
      this.state.uploading ||
      this.state.files.some(item => item.state === 'pending')
    ) {
      return new Promise(resolve => {
        this.resolve = resolve;
        this.startUpload();
      });
    } else if (this.state.files.some(item => item.state === 'error')) {
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
      : this.state.files.map(item => getEventData(item));
    return dispatchEvent(
      e,
      createObject(this.props.data, {
        file: value
      })
    );
  }

  // 动作
  doAction(action: Action, data: object, throwErrors: boolean) {
    const {onChange} = this.props;
    if (action.actionType === 'clear') {
      this.setState({files: []}, () => {
        onChange('');
      });
    }
  }

  render() {
    const {
      btnLabel,
      accept,
      disabled,
      maxLength,
      maxSize,
      multiple,
      autoUpload,
      description,
      descriptionClassName,
      hideUploadButton,
      className,
      btnClassName,
      btnUploadClassName,
      classnames: cx,
      translate: __,
      render,
      downloadUrl,
      templateUrl,
      drag,
      documentation,
      documentLink
    } = this.props;
    let {files, uploading, error} = this.state;
    const nameField = this.props.nameField || 'name';
    const valueField = this.props.valueField || 'value';
    const urlField = this.props.urlField || 'url';

    const hasPending = files.some(file => file.state == 'pending');

    let uploaded = 0;
    let failed = 0;

    this.state.uploading ||
      this.state.files.forEach(item => {
        if (item.state === 'error') {
          failed++;
        } else if (item.state === 'uploaded') {
          uploaded++;
        }
      });

    return (
      <div className={cx('FileControl', className)}>
        {templateUrl ? (
          <a
            className={cx('FileControl-templateInfo')}
            onClick={this.downloadTpl.bind(this)}
          >
            <Icon icon="download" className="icon" />
            <span>{__('File.downloadTpl')}</span>
          </a>
        ) : null}

        <DropZone
          disabled={disabled}
          key="drop-zone"
          ref={this.dropzone}
          onDrop={this.handleDrop}
          onDropRejected={this.handleDropRejected}
          accept={accept === '*' ? '' : accept}
          multiple={multiple}
        >
          {({getRootProps, getInputProps, isDragActive}) => (
            <div
              {...getRootProps({
                onClick: preventEvent
              })}
              className={cx('FileControl-dropzone', {
                'disabled':
                  disabled ||
                  (multiple && !!maxLength && files.length >= maxLength),
                'is-empty': !files.length,
                'is-active': isDragActive
              })}
            >
              <input disabled={disabled} {...getInputProps()} />

              {drag || isDragActive ? (
                <div
                  className={cx('FileControl-acceptTip')}
                  onClick={this.handleSelect}
                >
                  <Icon icon="cloud-upload" className="icon" />
                  <span>
                    {__('File.dragDrop')}
                    <span className={cx('FileControl-acceptTip-click')}>
                      {__('File.clickUpload')}
                    </span>
                  </span>
                  <div className={cx('FileControl-acceptTip-help', 'TplField')}>
                    {documentLink ? (
                      <a href={documentLink} onClick={e => e.stopPropagation()}>
                        {documentation ? documentation : __('File.helpText')}
                      </a>
                    ) : null}
                  </div>
                  {maxSize ? (
                    <div className={cx('FileControl-sizeTip')}>
                      {__('File.sizeLimit', {maxSize})}
                    </div>
                  ) : null}
                </div>
              ) : (
                <>
                  <Button
                    level="default"
                    disabled={disabled}
                    className={cx('FileControl-selectBtn', btnClassName, {
                      'is-disabled':
                        multiple && !!maxLength && files.length >= maxLength
                    })}
                    tooltip={
                      multiple && maxLength && files.length >= maxLength
                        ? __('File.maxLength', {maxLength})
                        : ''
                    }
                    onClick={this.handleSelect}
                  >
                    <Icon icon="upload" className="icon" />
                    <span>
                      {!multiple && files.length
                        ? __('File.repick')
                        : multiple && files.length
                        ? __('File.continueAdd')
                        : btnLabel
                        ? btnLabel
                        : __('File.upload')}
                    </span>
                  </Button>
                </>
              )}
              {description
                ? render('desc', description, {
                    className: cx(
                      'FileControl-description',
                      descriptionClassName
                    )
                  })
                : null}
            </div>
          )}
        </DropZone>

        {maxSize && !drag ? (
          <div className={cx('FileControl-sizeTip')}>
            {__('File.sizeLimit', {maxSize})}
          </div>
        ) : null}

        {Array.isArray(files) ? (
          <ul className={cx('FileControl-list')}>
            {files.map((file, index) => {
              const filename =
                file[nameField as keyof typeof file] ||
                (file as FileValue).filename;

              return (
                <li key={file.id}>
                  <TooltipWrapper
                    placement="bottom"
                    tooltipClassName={cx('FileControl-list-tooltip')}
                    tooltip={
                      file.state === 'invalid' || file.state === 'error'
                        ? (file as FileValue).error ||
                          (maxSize && file.size > maxSize
                            ? __('File.maxSize', {
                                filename: file.name,
                                actualSize: ImageControl.formatFileSize(
                                  file.size
                                ),
                                maxSize: ImageControl.formatFileSize(maxSize)
                              })
                            : '')
                        : ''
                    }
                  >
                    <div
                      className={cx('FileControl-itemInfo', {
                        'is-invalid':
                          file.state === 'invalid' || file.state === 'error'
                      })}
                    >
                      <span className={cx('FileControl-itemInfoIcon')}>
                        <Icon icon="file" className="icon" />
                      </span>

                      {(file as FileValue)[urlField] ||
                      (file as FileValue)[valueField] ||
                      downloadUrl ? (
                        <a
                          className={cx('FileControl-itemInfoText')}
                          target="_blank"
                          rel="noopener"
                          href="#"
                          onClick={this.handleClickFile.bind(this, file)}
                        >
                          {filename}
                        </a>
                      ) : (
                        <span className={cx('FileControl-itemInfoText')}>
                          {filename}
                        </span>
                      )}

                      {!disabled ? (
                        <a
                          data-tooltip={__('Select.clear')}
                          data-position="left"
                          className={cx('FileControl-clear')}
                          onClick={() => this.removeFile(file, index)}
                        >
                          <Icon icon="close" className="icon" />
                        </a>
                      ) : null}
                    </div>
                  </TooltipWrapper>

                  {file.state === 'uploading' ? (
                    <div className={cx('FileControl-progressInfo')}>
                      <div className={cx('FileControl-progress')}>
                        <span
                          style={{width: `${(file.progress || 0) * 100}%`}}
                        />
                      </div>
                      <span>{Math.round((file.progress || 0) * 100)}%</span>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {failed ? (
          <div className={cx('FileControl-sum')}>
            {__('File.result', {
              uploaded,
              failed
            })}
            <a onClick={this.retry}>{__('File.retry')}</a>
            {__('File.failed')}
          </div>
        ) : null}

        {!autoUpload && !hideUploadButton && files.length ? (
          <Button
            level="default"
            disabled={!hasPending}
            className={cx('FileControl-uploadBtn', btnUploadClassName)}
            onClick={this.toggleUpload}
          >
            {__(uploading ? 'File.pause' : 'File.start')}
          </Button>
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'input-file',
  sizeMutable: false,
  renderDescription: false,
  shouldComponentUpdate: (props: any, prevProps: any) =>
    !!isEffectiveApi(props.receiver, props.data) &&
    isApiOutdated(
      props.receiver,
      prevProps.receiver,
      props.data,
      prevProps.data
    )
})
export class FileControlRenderer extends FileControl {}
