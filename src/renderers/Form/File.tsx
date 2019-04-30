import * as React from 'react';
import {
    FormItem,
    FormControlProps
} from './Item';
import * as cx from 'classnames';
import * as qs from 'qs';
import find = require('lodash/find');
import isPlainObject = require('lodash/isPlainObject');
import {mapLimit} from 'async';
import ImageControl from './Image';
import {Payload} from '../../types';
import { filter } from '../../utils/tpl';

export interface FileProps extends FormControlProps {
    btnClassName: string;
    btnUploadClassName: string;
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
        [propName:string]: string;
    };
    asBase64?: boolean;
};

export interface FileX extends File {
    state?: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
}

export interface FileValue {
    filename?: string;
    value?:string;
    name?: string;
    url?: string;
    state: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
    [propName:string]: any;
};

export interface FileState {
    uploading: boolean;
    files: Array<FileX | FileValue>;
    error?: string | null;
};

export default class FileControl extends React.Component<FileProps, FileState> {
    static defaultProps:Partial<FileProps> = {
        btnClassName: 'btn-sm btn-info',
        btnUploadClassName: 'btn-sm btn-success',
        maxSize: 0,
        maxLength: 0,
        placeholder: '',
        btnLabel: '请选择文件',
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
            'init': "",
            'pending': "等待上传",
            'uploading': "上传中",
            'error': "上传出错",
            'uploaded': "已上传"
        },
        asBase64: false
    };

    state: FileState;
    current: FileValue | FileX | null;
    resolve?: (value?:any) => void;

    static valueToFile(value:string | FileValue, props:FileProps, files?: Array<FileX | FileValue>):FileValue|undefined {
        let file:FileValue | FileX | undefined = files && typeof value === 'string'
            ? find(files, item => (item as FileValue).value === value)
            : undefined;
        return value ? {
            ...(typeof value === 'string' ? {
                state: file && file.state ? file.state : 'init',
                value,
                name: /^data:/.test(value) ? (file && file.name || 'base64数据') : '',
                url: typeof props.downloadUrl === 'string' && value && !/^data:/.test(value) ? `${props.downloadUrl}${value}` : undefined
            } : (value as FileValue))
        } : undefined;
    }

    constructor(props:FileProps) {
        super(props);

        const value:string|Array<string | FileValue>|FileValue = props.value;
        const multiple = props.multiple;
        const joinValues = props.joinValues;
        const delimiter = props.delimiter as string;
        let files:Array<FileValue> = [];

        if (value) {
            files = (Array.isArray(value) ? value : joinValues ? (((value as any).value || value) as string).split(delimiter) : [((value as any).value || value) as string])
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
        this.startUpload = this.startUpload.bind(this);
        this.stopUpload = this.stopUpload.bind(this);
        this.toggleUpload = this.toggleUpload.bind(this);
        this.tick = this.tick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.uploadBigFile = this.uploadBigFile.bind(this);
    }

    componentWillReceiveProps(nextProps:FileProps) {
        const props = this.props;

        if (props.value !== nextProps.value) {
            const value:string|Array<string | FileValue>|FileValue = nextProps.value;
            const multiple = nextProps.multiple;
            const joinValues =nextProps.joinValues;
            const delimiter = nextProps.delimiter as string;
            let files:Array<FileValue> = [];

            if (value) {
                files = (Array.isArray(value) ? value : joinValues && typeof value === 'string' ? value.split(delimiter) : [value as any])
                .map(item => {
                    let obj = FileControl.valueToFile(item, nextProps, this.state.files) as FileValue;
                    let org;

                    if (obj && (org = find(this.state.files, (item:FileValue) => item.value === obj.value)) as FileValue) {
                        obj = {
                            ...org,
                            ...obj
                        };
                    }

                    return obj;
                })
                .filter(item => item);
            }


            this.setState({
                files: files,
            });
        }
    }

    handleDrop(e:React.ChangeEvent<any>) {
        const files = e.currentTarget.files;

        if (!files.length) {
            return;
        }

        const {maxSize, multiple, maxLength} = this.props;
        const allowed = (multiple ? maxLength ? maxLength : (files.length + this.state.files.length) : 1) - this.state.files.length;

        const inputFiles:Array<FileX> = [];

        [].slice.call(files, 0, allowed).forEach((file:FileX) => {
            if (maxSize && file.size > maxSize) {
                alert(`您选择的文件 ${file.name} 大小为 ${ImageControl.formatFileSize(file.size)} 超出了最大为 ${ImageControl.formatFileSize(maxSize)} 的限制，请重新选择`);
                return;
            }

            file.state = 'pending';
            inputFiles.push(file);
        });

        if (!inputFiles.length) {
            return;
        }

        this.setState({
            error: null,
            files: this.state.files.concat(inputFiles)
        }, () => {
            const {
                autoUpload
            } = this.props;

            if (autoUpload) {
                this.startUpload();
            }
        });
    }

    startUpload() {
        if (this.state.uploading) {
            return;
        }

        this.setState({
            uploading: true,
            files: this.state.files.map(file => {
                if (file.state === 'error') {
                    file.state = 'pending';
                }

                return file;
            })
        }, this.tick);
    }

    toggleUpload(e:React.MouseEvent<HTMLButtonElement>) {
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
        if (this.current || !this.state.uploading) {return;}

        const file = find(this.state.files, item => item.state === 'pending') as FileX;
        if (file) {
            this.current = file;

            file.state = 'uploading';

            this.setState({
                files: this.state.files.concat()
            }, () => this.sendFile(file, (error, file, obj) => {
                const files = this.state.files.concat();
                const idx = files.indexOf(file as FileX);

                if (!~idx) {
                    return;
                }

                let newFile:FileValue = file as FileValue;

                if (error) {
                    newFile.state = 'error';
                    newFile.error = error;
                } else {
                    newFile = obj as FileValue;
                }
                files.splice(idx, 1, newFile);
                this.current = null;
                this.setState({
                    files: files
                }, this.tick);
            }));
        } else {
            this.setState({
                uploading: false
            }, () => {
                this.onChange();

                if (this.resolve) {
                    this.resolve(this.state.files.some(file => file.state === 'error') ? '文件上传失败请重试' : null);
                    this.resolve = undefined;
                }
            });
        }
    }


    sendFile(file:FileX, cb:(error:null|string, file?:FileX, obj?: FileValue) => void) {
        const {
            reciever,
            fileField,
            downloadUrl,
            useChunk,
            chunkSize,
            startChunkApi,
            chunkApi,
            finishChunkApi,
            asBase64
        } = this.props;

        if (asBase64) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                cb(null, file, {
                    value: reader.result,
                    name: file.name,
                    url: '',
                    state: 'uploaded'
                });
            }
            reader.onerror = (error:any) => cb(error.message);
            return;
        }

        let fn = useChunk === 'auto' && chunkSize && file.size > chunkSize || useChunk === true ? this.uploadBigFile : this.uploadFile;

        fn(file, reciever as string, {}, {
            fieldName: fileField,
            chunkSize,
            startChunkApi,
            chunkApi,
            finishChunkApi
        })
        .then(ret => {
            if (ret.status || !ret.data) {
                throw new Error(ret.msg || '上传失败, 请重试');
            }

            const value = (ret.data as any).value || ret.data;

            cb(null, file, {
                ...isPlainObject(ret.data) ? ret.data : null,
                value: value,
                url: typeof downloadUrl === 'string' && value ? `${downloadUrl}${value}` : ret.data ? (ret.data as any).url : null,
                state: 'uploaded'
            });
        })
        .catch(error => {
            cb(error.message || '上传失败, 请重试', file);
        })
    }

    removeFile(file:FileX | FileValue, index:number) {
        const files = this.state.files.concat();

        files.splice(index, 1);

        this.setState({
            files: files
        }, this.onChange);
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
            delimiter
        } = this.props;

        const files = this.state.files.filter(file => file.state == 'uploaded' || file.state == 'init');
        let value:any = multiple ? files : files[0];

        if (value) {
            if (joinValues) {
                value = Array.isArray(value) ? value.map((item: any) => item[valueField || 'value']).join(delimiter || ',') : value[valueField || 'value'];
            } else if (extractValue) {
                value = Array.isArray(value) ? value.map((item: any) => item[valueField || 'value']) : value[valueField || 'value'];
            }
        }

        // if (joinValues && value) {
        //     value = Array.isArray(value) ? value.map((item:any) => item[valueField || 'value']).join(delimiter || ',') : value[valueField || 'value']
        // }

        onChange(value);
    }

    uploadFile(file:FileX, reciever:string, params:object, config:Partial<FileProps> = {}):Promise<Payload> {
        const fd = new FormData();

        reciever = filter(reciever, this.props.data);

        if (/^\/api\/(?:page\/)?proxy/.test(reciever)) {
            fd.append('file', file);
            fd.append('fieldName', config.fieldName);
        } else {
            fd.append(config.fieldName || 'file', file);
        }

        const idx = reciever.indexOf('?');

        if (~idx && params) {
            params = {
                ...qs.parse(reciever.substring(idx + 1)),
                ...params
            };
            reciever = reciever.substring(0, idx) + '?' + qs.stringify(params);
        } else if (params) {
            reciever += '?' + qs.stringify(params);
        }

        return this._send(reciever, fd, {
            withCredentials: true
        });
    }

    uploadBigFile(file:FileX, reciever:string, params:object, config:Partial<FileProps> = {}):Promise<Payload> {
        const chunkSize = config.chunkSize || 5 * 1024 * 1024;
        const self = this;

        interface ObjectState {
            key: string;
            uploadId: string;
            loaded: number;
            total: number;
            [propName:string]: any;
        };

        interface Task {
            file: File;
            partNumber: number;
            partSize: number;
            start: number;
            stop: number;
            [propName:string]: any;
        };

        return new Promise((resolve, reject) => {

            let state:ObjectState;

            self._send(config.startChunkApi as string, {filename: file.name})
            .then(startChunk)
            .catch(reject);

            function startChunk(ret:Payload) {
                const tasks = getTasks(file);

                if (!ret.data) {
                    throw new Error('接口返回错误，请仔细检查');
                }

                state = {
                    key: (ret.data as any).key,
                    uploadId: (ret.data as any).uploadId,
                    loaded: 0,
                    total: tasks.length
                };

                mapLimit(tasks, 3, uploadPartFile(state, config), function (err, results) {
                    if (err) {
                        reject(err);
                    } else {
                        finishChunk(results, state);
                    }
                });
            }

            function finishChunk(partList:Array<any>|undefined, state:ObjectState) {
                self._send(config.finishChunkApi as string, {
                    ...params,
                    uploadId: state.uploadId,
                    key: state.key,
                    filename: file.name,
                    partList
                }).then(resolve).catch(reject);
            }

            function uploadPartFile(state:ObjectState, conf:Partial<FileProps>) {
                reciever = conf.chunkApi as string;

                return (task:Task, callback:(error:any, value?:any) => void) => {
                    const fd = new FormData();
                    let blob = task.file.slice(task.start, task.stop + 1);

                    fd.append('key', state.key);
                    fd.append('uploadId', state.uploadId);
                    fd.append('partNumber', task.partNumber.toString());
                    fd.append('partSize', task.partSize.toString());


                    if (/^\/api\/(?:page\/)?proxy/.test(reciever)) {
                        fd.append('file', blob, file.name);
                        fd.append('fieldName', config.fieldName);
                    } else {
                        fd.append(config.fieldName || 'file', blob, file.name);
                    }

                    return self._send(reciever, fd, {
                        withCredentials: true
                    })
                    .then(ret => {
                        state.loaded++;
                        callback(null, {
                            partNumber: task.partNumber,
                            eTag: (ret.data as any).eTag
                        });
                    })
                    .catch(callback);
                }
            }

            function getTasks(file:FileX):Array<Task> {
                let leftSize = file.size;
                let offset = 0;
                let partNumber = 1;

                let tasks:Array<Task> = [];

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
        })
    }

    _send(reciever:string, data:any, options?:object):Promise<Payload> {
        const env = this.props.env;

        if (!env || !env.fetcher) {
            throw new Error('fetcher is required');
        }

        reciever = filter(reciever, this.props.data);
        return env.fetcher(reciever, data, {
            method: 'post',
            ...options
        });
    }

    validate():any {
        if (this.state.uploading || this.state.files.some(item => item.state === 'pending')) {
            return new Promise((resolve) => {
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
            btnClassName,
            btnUploadClassName,
            maxLength,
            multiple,
            autoUpload,
            stateTextMap,
            hideUploadButton,
            className
        } = this.props;
        let {
            files,
            uploading,
            error
        } = this.state;

        const hasPending = files.some(file => file.state == 'pending');

        return (
            <div className={cx('amis-file-control', className)}>
                {error ? (
                    <div>
                    <p className="help-block text-danger inline">{error}</p>
                    <a className="btn btn-link" onClick={this.clearError}><i className="fa fa-times" /></a>
                    </div>
                ) : null}

                {files && files.length ? (
                    <ul className="list-group no-bg m-b-sm">
                    {files.map((file, key) => (
                        <li key={key} className="list-group-item clearfix">
                        <a
                        className="text-danger pull-right"
                        onClick={() => this.removeFile(file, key)}
                        ><i className="fa fa-times" /></a>
                        <span className="pull-right text-muted text-xs m-r-sm">{stateTextMap && stateTextMap[file.state as string] || ''}</span>
                        <i className="fa fa-file fa-fw m-r-xs" />
                        {(file as FileValue).url ? (<a href={(file as FileValue).url} target="_blank">{file.name || (file as FileValue).filename || (file as FileValue).value}</a>) : (<span>{file.name || (file as FileValue).filename}</span>)}
                        </li>
                    ))}
                    </ul>
                ) : null}

                <div className="clear">
                {multiple && (!maxLength || files.length < maxLength) || !multiple && !files.length ? (
                    <label className={cx("btn m-r-xs", btnClassName, {disabled})}>
                    <input type="file" accept={accept} multiple={multiple} className="invisible" onChange={this.handleDrop} />
                    {btnLabel}
                    </label>
                ) : null}

                {!autoUpload && !hideUploadButton && files.length ? (
                    <button type="button" className={cx('btn m-r-xs', btnUploadClassName)} disabled={!hasPending} onClick={this.toggleUpload}>
                    {uploading ? '暂停上传' : '开始上传'}
                    </button>
                ) : null}

                {this.state.uploading ? (<i className="fa fa-spinner fa-spin fa-2x fa-fw" />) : null}
                </div>
            </div>
        );
    }
}


@FormItem({
    type: 'file',
    sizeMutable: false
})
export class FileControlRenderer extends FileControl {};

