import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import cx from 'classnames';
import qs from 'qs';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
// @ts-ignore
import mapLimit from 'async/mapLimit';
import ImageControl from './Image';
import {Payload, ApiObject, ApiString} from '../../types';
import {filter} from '../../utils/tpl';
import Alert from '../../components/Alert2';
import {qsstringify, createObject, guid, isEmpty} from '../../utils/helper';
import {buildApi} from '../../utils/api';
import Button from '../../components/Button';
import {Icon} from '../../components/icons';
import DropZone from 'react-dropzone';
import {FileRejection} from 'react-dropzone';
import {dataMapping} from '../../utils/tpl-builtin';
import {
  SchemaApi,
  SchemaClassName,
  SchemaTokenizeableString
} from '../../Schema';

/**
 * File 文件上传控件
 * 文档：https://baidu.gitee.io/amis/docs/components/form/file
 */
export interface FileControlSchema extends FormBaseControl {
  /**
   * 指定为文件上传
   */
  type: 'file';

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
   * 分割符
   */
  delimiter?: string;

  /**
   * 默认显示文件路径的时候会支持直接下载，
   * 可以支持加前缀如：`http://xx.dom/filename=` ，
   * 如果不希望这样，可以把当前配置项设置为 `false`。
   */
  downloadUrl?: string;

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
    useChunk: 'auto',
    chunkSize: 5 * 1024 * 1024, // 文件大于5M， 自动分块上传
    startChunkApi: '/api/upload/startChunk',
    chunkApi: '/api/upload/chunk',
    finishChunkApi: '/api/upload/finishChunk',
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
    asBase64: false
  };

  state: FileState;
  current: FileValue | FileX | null;
  resolve?: (value?: any) => void;
  emitValue: any;

  static valueToFile(
    value: string | FileValue,
    props: FileProps,
    files?: Array<FileX | FileValue>
  ): FileValue | undefined {
    let file: FileValue | FileX | undefined =
      files && typeof value === 'string'
        ? find(files, item => (item as FileValue).value === value)
        : undefined;
    return value
      ? value instanceof File
        ? {
            state: 'ready',
            value: value,
            name: value.name,
            url: '',
            id: guid()
          }
        : {
            ...(typeof value === 'string'
              ? {
                  state: file && file.state ? file.state : 'init',
                  value,
                  name:
                    (file && file.name) ||
                    (/^data:/.test(value)
                      ? 'base64数据'
                      : getNameFromUrl(value)),
                  id: guid(),
                  url:
                    typeof props.downloadUrl === 'string' &&
                    value &&
                    !/^data:/.test(value)
                      ? `${props.downloadUrl}${value}`
                      : undefined
                }
              : (value as FileValue))
          }
      : undefined;
  }

  dropzone = React.createRef<any>();
  constructor(props: FileProps) {
    super(props);

    const value: string | Array<string | FileValue> | FileValue = props.value;
    const multiple = props.multiple;
    const joinValues = props.joinValues;
    const delimiter = props.delimiter as string;
    let files: Array<FileValue> = [];

    if (value && value instanceof Blob) {
      files = [value as any];
    } else if (value) {
      files = (Array.isArray(value)
        ? value
        : joinValues
        ? `${(value as any).value || value}`.split(delimiter)
        : [((value as any).value || value) as string]
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
  }

  componentWillReceiveProps(nextProps: FileProps) {
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
          ? value.split(delimiter)
          : [value as any]
        )
          .map(item => {
            let obj = FileControl.valueToFile(
              item,
              nextProps,
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

      this.setState({
        files: files
      });
    }
  }

  handleDrop(files: Array<FileX>) {
    if (!files.length) {
      return;
    }

    const {maxSize, multiple, maxLength, translate: __} = this.props;
    let allowed =
      multiple && maxLength
        ? maxLength - this.state.files.length
        : files.length;

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

    const files = rejectedFiles.map(fileRejection => ({
      ...fileRejection.file,
      state: 'invalid',
      id: guid(),
      name: fileRejection.file.name
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
        files: files.map((item: any) => `「${item.name}」`).join(' '),
        accept
      })
    );
  }

  handleSelect() {
    this.dropzone.current && this.dropzone.current.open();
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

    const {translate: __, multiple, autoFill, onBulkChange} = this.props;
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
                newFile.name = newFile.name || file!.name;
              }
              files.splice(idx, 1, newFile);
              this.current = null;
              this.setState(
                {
                  error: error ? error : null,
                  files: files
                },
                () => {
                  // todo 这个逻辑应该移到 onChange 里面去，因为这个时候并不一定修改了表单项的值。
                  const sendTo =
                    !multiple &&
                    autoFill &&
                    !isEmpty(autoFill) &&
                    dataMapping(autoFill, obj || {});
                  sendTo && onBulkChange(sendTo);

                  this.tick();
                }
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
      downloadUrl,
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

    if (asBase64) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        file.state = 'ready';
        cb(null, file, {
          value: reader.result as string,
          name: file.name,
          url: '',
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
            name: file.name,
            value: file,
            url: '',
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
      .then(ret => {
        if (ret.status || !ret.data) {
          throw new Error(ret.msg || __('File.errorRetry'));
        }

        onProgress(1);
        let value =
          (ret.data as any).value || (ret.data as any).url || ret.data;

        cb(null, file, {
          ...(isPlainObject(ret.data) ? ret.data : null),
          value: value,
          url:
            typeof downloadUrl === 'string' && value
              ? `${downloadUrl}${value}`
              : ret.data
              ? (ret.data as any).url
              : null,
          state: 'uploaded',
          id: file.id
        });
      })
      .catch(error => {
        cb(error.message || __('File.errorRetry'), file);
      });
  }

  removeFile(file: FileX | FileValue, index: number) {
    const files = this.state.files.concat();

    files.splice(index, 1);

    this.setState(
      {
        files: files
      },
      this.onChange
    );
  }

  clearError() {
    this.setState({
      error: null
    });
  }

  onChange(changeImmediately?: boolean) {
    const {
      multiple,
      onChange,
      joinValues,
      extractValue,
      valueField,
      delimiter,
      resetValue,
      asBlob
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

    onChange((this.emitValue = value), undefined, changeImmediately);
  }

  uploadFile(
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
      .forEach(item => {
        const parts = item.split('=');
        fd.append(parts[0], decodeURIComponent(parts[1]));
      });

    // Note: File类型字段放在后面，可以支持第三方云存储鉴权
    fd.append(config.fieldName || 'file', file);

    return this._send(api, fd, {}, onProgress);
  }

  uploadBigFile(
    file: FileX,
    receiver: string,
    params: object,
    config: Partial<FileProps> = {},
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const chunkSize = config.chunkSize || 5 * 1024 * 1024;
    const self = this;
    let startProgress = 0.2;
    let endProgress = 0.9;
    let progressArr: Array<number>;
    const __ = this.props.translate;

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
          filename: file.name
        }),
        {
          method: 'post',
          autoAppend: true
        }
      );

      self._send(startApi).then(startChunk).catch(reject);

      function startChunk(ret: Payload) {
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

        mapLimit(
          tasks,
          3,
          uploadPartFile(state, config),
          function (err: any, results: any) {
            if (err) {
              reject(err);
            } else {
              finishChunk(results, state);
            }
          }
        );
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

      function finishChunk(
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
            filename: file.name,
            partList
          }),
          {
            method: 'post',
            autoAppend: true
          }
        );

        self._send(endApi).then(resolve).catch(reject);
      }

      function uploadPartFile(state: ObjectState, conf: Partial<FileProps>) {
        return (task: Task, callback: (error: any, value?: any) => void) => {
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
            ._send(api, fd, {}, progress =>
              updateProgress(task.partNumber, progress)
            )
            .then(ret => {
              state.loaded++;
              callback(null, {
                partNumber: task.partNumber,
                eTag: (ret.data as any).eTag
              });
            })
            .catch(callback);
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
      onUploadProgress: onProgress
        ? (event: {loaded: number; total: number}) =>
            onProgress(event.loaded / event.total)
        : undefined
    });
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

  render() {
    const {
      btnLabel,
      accept,
      disabled,
      maxLength,
      multiple,
      autoUpload,
      description,
      hideUploadButton,
      className,
      classnames: cx,
      translate: __,
      render
    } = this.props;
    let {files, uploading, error} = this.state;

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
        <DropZone
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
                disabled,
                'is-empty': !files.length,
                'is-active': isDragActive
              })}
            >
              <input {...getInputProps()} />

              {isDragActive ? (
                <div className={cx('FileControl-acceptTip')}>
                  {__('File.dragDrop')}
                </div>
              ) : (
                <>
                  {(multiple && (!maxLength || files.length < maxLength)) ||
                  !multiple ? (
                    <Button
                      level="default"
                      disabled={disabled}
                      className={cx('FileControl-selectBtn')}
                      onClick={this.handleSelect}
                    >
                      <Icon icon="upload" className="icon" />
                      {!multiple && files.length
                        ? __('File.repick')
                        : multiple && files.length
                        ? __('File.continueAdd')
                        : btnLabel
                        ? btnLabel
                        : __('File.upload')}
                    </Button>
                  ) : null}

                  {description
                    ? render('desc', description!, {
                        className: cx('FileControl-description')
                      })
                    : null}

                  {Array.isArray(files) ? (
                    <ul className={cx('FileControl-list')}>
                      {files.map((file, index) => (
                        <li key={file.id}>
                          <div
                            className={cx('FileControl-itemInfo', {
                              'is-invalid':
                                file.state === 'invalid' ||
                                file.state === 'error'
                            })}
                          >
                            <Icon icon="file" className="icon" />
                            {(file as FileValue).url ? (
                              <a
                                className={cx('FileControl-itemInfoText')}
                                target="_blank"
                                rel="noopener"
                                href={(file as FileValue).url}
                              >
                                {file.name || (file as FileValue).filename}
                              </a>
                            ) : (
                              <span className={cx('FileControl-itemInfoText')}>
                                {file.name || (file as FileValue).filename}
                              </span>
                            )}

                            {file.state === 'invalid' ||
                            file.state === 'error' ? (
                              <Icon icon="fail" className="icon" />
                            ) : null}
                            {file.state !== 'uploading' && !disabled ? (
                              <a
                                data-tooltip={__('Select.clear')}
                                className={cx('FileControl-clear')}
                                onClick={() => this.removeFile(file, index)}
                              >
                                <Icon icon="close" className="icon" />
                              </a>
                            ) : null}
                          </div>
                          {file.state === 'uploading' ||
                          file.state === 'uploaded' ? (
                            <div className={cx('FileControl-progressInfo')}>
                              <div className={cx('FileControl-progress')}>
                                <span
                                  style={{
                                    width: `${
                                      file.state === 'uploaded'
                                        ? 100
                                        : (file.progress || 0) * 100
                                    }%`
                                  }}
                                />
                              </div>

                              {file.state === 'uploaded' ? (
                                <Icon icon="success" className="icon" />
                              ) : (
                                <span>
                                  {Math.round((file.progress || 0) * 100)}%
                                </span>
                              )}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          )}
        </DropZone>

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
            className={cx('FileControl-uploadBtn')}
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
  type: 'file',
  sizeMutable: false,
  renderDescription: false
})
export class FileControlRenderer extends FileControl {}
