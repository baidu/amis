import React from 'react';
import {FormItem, FormControlProps} from './Item';
import cx from 'classnames';
import qs from 'qs';
import find = require('lodash/find');
import isPlainObject = require('lodash/isPlainObject');
import {mapLimit} from 'async';
import ImageControl from './Image';
import {Payload, ApiObject, ApiString} from '../../types';
import {filter} from '../../utils/tpl';
import Alert from '../../components/Alert2';
import {qsstringify, createObject} from '../../utils/helper';
import {buildApi} from '../../utils/api';
import Button from '../../components/Button';
import {Icon} from '../../components/icons';
import DropZone from 'react-dropzone';

export interface FileProps extends FormControlProps {
  maxSize: number;
  maxLength: number;
  placeholder?: string;
  btnLabel?: string;
  reciever?: string;
  fileField?: string;
  joinValues?: boolean;
  extractValue?: boolean;
  delimiter?: string;
  downloadUrl?: string;
  useChunk?: 'auto' | boolean;
  chunkSize?: number;
  startChunkApi?: string;
  chunkApi?: string;
  finishChunkApi?: string;
  accept?: string;
  multiple?: boolean;
  autoUpload?: boolean;
  hideUploadButton?: boolean;
  stateTextMap?: {
    init: string;
    pending: string;
    uploading: string;
    error: string;
    uploaded: string;
    [propName: string]: string;
  };
  asBase64?: boolean;
  asBlob?: boolean;
  resetValue?: string;
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

let id = 1;
function gennerateId() {
  return id++;
}

let preventEvent = (e: any) => e.stopPropagation();

function getNameFromUrl(url: string) {
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
    btnLabel: '文件上传',
    reciever: '/api/upload/file',
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
    accept: 'text/plain',
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
            id: gennerateId()
          }
        : {
            ...(typeof value === 'string'
              ? {
                  state: file && file.state ? file.state : 'init',
                  value,
                  name: /^data:/.test(value)
                    ? (file && file.name) || 'base64数据'
                    : getNameFromUrl(value),
                  id: gennerateId(),
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
        ? (((value as any).value || value) as string).split(delimiter)
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
    this.toggleUpload = this.toggleUpload.bind(this);
    this.tick = this.tick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.uploadBigFile = this.uploadBigFile.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillReceiveProps(nextProps: FileProps) {
    const props = this.props;

    if (props.value !== nextProps.value) {
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

    const {maxSize, multiple, maxLength} = this.props;
    let allowed =
      multiple && maxLength
        ? maxLength - this.state.files.length
        : files.length;

    const inputFiles: Array<FileX> = [];

    [].slice.call(files, 0, allowed).forEach((file: FileX) => {
      if (maxSize && file.size > maxSize) {
        this.props.env.alert(
          `您选择的文件 ${file.name} 大小为 ${ImageControl.formatFileSize(
            file.size
          )} 超出了最大为 ${ImageControl.formatFileSize(
            maxSize
          )} 的限制，请重新选择`
        );
        file.state = 'invalid';
      } else {
        file.state = 'pending';
      }

      file.id = gennerateId();
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

  handleDropRejected(rejectedFiles: any, evt: React.DragEvent<any>) {
    if (evt.type !== 'change' && evt.type !== 'drop') {
      return;
    }
    const {multiple, env, accept} = this.props;

    const files = rejectedFiles.map((file: any) => ({
      ...file,
      state: 'invalid',
      id: gennerateId(),
      name: file.name
    }));

    this.setState({
      files: multiple
        ? this.state.files.concat(files)
        : this.state.files.length
        ? this.state.files
        : files.slice(0, 1)
    });

    env.alert(
      `您添加的文件${files.map(
        (item: any) => `【${item.name}】`
      )}不符合类型的\`${accept}\`设定，请仔细检查。`
    );
  }

  handleSelect() {
    this.dropzone.current && this.dropzone.current.open();
  }

  startUpload() {
    if (this.state.uploading) {
      return;
    }

    this.setState(
      {
        uploading: true,
        files: this.state.files.map(file => {
          if (file.state === 'error') {
            file.state = 'pending';
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

  tick() {
    if (this.current || !this.state.uploading) {
      return;
    }

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
          this.onChange();

          if (this.resolve) {
            this.resolve(
              this.state.files.some(file => file.state === 'error')
                ? '文件上传失败请重试'
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
      reciever,
      fileField,
      downloadUrl,
      useChunk,
      chunkSize,
      startChunkApi,
      chunkApi,
      finishChunkApi,
      asBase64,
      asBlob,
      data
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
      reciever as string,
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
          throw new Error(ret.msg || '上传失败, 请重试');
        }

        onProgress(1);
        const value = (ret.data as any).value || ret.data;

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
        cb(error.message || '上传失败, 请重试', file);
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

  onChange() {
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

    onChange(value);
  }

  uploadFile(
    file: FileX,
    reciever: string,
    params: object,
    config: Partial<FileProps> = {},
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const fd = new FormData();
    const api = buildApi(reciever, createObject(config.data, params), {
      method: 'post'
    });

    qsstringify({...api.data, ...params})
      .split('&')
      .forEach(item => {
        const parts = item.split('=');
        fd.append(parts[0], parts[1]);
      });

    fd.append(config.fieldName || 'file', file);

    return this._send(api, fd, {}, onProgress);
  }

  uploadBigFile(
    file: FileX,
    reciever: string,
    params: object,
    config: Partial<FileProps> = {},
    onProgress: (progress: number) => void
  ): Promise<Payload> {
    const chunkSize = config.chunkSize || 5 * 1024 * 1024;
    const self = this;
    let startProgress = 0.2;
    let endProgress = 0.9;
    let progressArr: Array<number>;

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

      self
        ._send(startApi)
        .then(startChunk)
        .catch(reject);

      function startChunk(ret: Payload) {
        onProgress(startProgress);
        const tasks = getTasks(file);
        progressArr = tasks.map(() => 0);

        if (!ret.data) {
          throw new Error('接口返回错误，请仔细检查');
        }

        state = {
          key: (ret.data as any).key,
          uploadId: (ret.data as any).uploadId,
          loaded: 0,
          total: tasks.length
        };

        mapLimit(tasks, 3, uploadPartFile(state, config), function(
          err,
          results
        ) {
          if (err) {
            reject(err);
          } else {
            finishChunk(results, state);
          }
        });
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

        self
          ._send(endApi)
          .then(resolve)
          .catch(reject);
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
              fd.append(parts[0], parts[1]);
            });

          fd.append('key', state.key);
          fd.append('uploadId', state.uploadId);
          fd.append('partNumber', task.partNumber.toString());
          fd.append('partSize', task.partSize.toString());
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
    if (
      this.state.uploading ||
      this.state.files.some(item => item.state === 'pending')
    ) {
      return new Promise(resolve => {
        this.resolve = resolve;
        this.startUpload();
      });
    } else if (this.state.files.some(item => item.state === 'error')) {
      return '文件上传失败请重试';
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
      render
    } = this.props;
    let {files, uploading, error} = this.state;

    const hasPending = files.some(file => file.state == 'pending');

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
                  把文件拖到这，然后松完成添加！
                </div>
              ) : (
                <>
                  {(multiple && (!maxLength || files.length < maxLength)) ||
                  !multiple ? (
                    <Button
                      level="default"
                      className={cx('FileControl-selectBtn')}
                      onClick={this.handleSelect}
                    >
                      <Icon icon="upload" className="icon" />
                      {!multiple && files.length
                        ? '重新上传'
                        : multiple && files.length
                        ? '继续添加'
                        : '上传文件'}
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
                            {file.state !== 'uploading' ? (
                              <a
                                data-tooltip="移除"
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

        {error ? (
          <div className={cx('FileControl-errorMsg')}>{error}</div>
        ) : null}

        {!autoUpload && !hideUploadButton && files.length ? (
          <Button
            level="default"
            disabled={!hasPending}
            className={cx('FileControl-uploadBtn')}
            onClick={this.toggleUpload}
          >
            {uploading ? '暂停上传' : '开始上传'}
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
