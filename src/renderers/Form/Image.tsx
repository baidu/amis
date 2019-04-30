import * as React from 'react';
import {
    FormItem,
    FormControlProps
} from './Item';
import * as cx from 'classnames';
import Cropper from 'react-cropper';
import * as DropZone from 'react-dropzone';
import 'blueimp-canvastoblob';
// @require 'cropperjs/dist/cropper.css';
// jest 不能支持这种写法
// import 'cropperjs/dist/cropper.css';
import find = require('lodash/find');
import * as qs from 'qs';
import { FileValue } from './Image';
import {Payload} from '../../types';
import { filter } from '../../utils/tpl';
import { Switch } from '../../components';

export interface ImageProps extends FormControlProps {
    placeholder?: string;
    reciever?: string;
    limit?: {
        width?: number;
        height?: number;
        maxWidth?: number;
        minWidth?: number;
        maxHeight?: number;
        minHeight?: number;
        aspectRatio?: number;
        aspectRatioLabel?: string;
    },
    accept?: string;
    btnUploadClassName?: string;
    btnClassName?: string;
    hideUploadButton?: boolean;
    joinValues?: boolean;
    extractValue?: boolean;
    delimiter?: string;
    autoUpload?: boolean;
    multiple?: boolean;
};

export interface ImageState {
    uploading: boolean;
    locked: boolean;
    lockedReason?: string;
    compress: boolean;
    compressOptions: {
        maxWidth?: number;
        maxHeight?: number;
    };
    files: Array<FileValue|FileX>;
    crop?: object;
    error?: string;
    cropFile?: FileValue;
    submitOnChange?: boolean;
};

export interface FileValue {
    value?: any;
    state: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid',
    url?: string;
    error?: string;
    info?: {
        width: number;
        height: number;
        len?: number;
    };
    [propName:string]: any;
}

export interface FileX extends File {
    preview?: string;
    state?: 'init' | 'error' | 'pending' | 'uploading' | 'uploaded' | 'invalid';
    [propName:string]: any;
}

export default class ImageControl extends React.Component<ImageProps, ImageState> {
    static defaultProps = {
        limit: undefined,
        accept: 'image/jpeg, image/jpg, image/png, image/gif',
        reciever: '/api/upload',
        btnUploadClassName: 'btn-success',
        btnClassName: 'btn-info btn-sm',
        hideUploadButton: false,
        compressOptions: {},
        placeholder: '将图片拖入该区域，或者',
        joinValues: true,
        extractValue: false,
        delimiter: ',',
        autoUpload: true,
        multiple: false
    };

    static formatFileSize(size:number | string, units = [' B', ' KB', ' M', ' G']) {
        size = parseInt(size as string, 10) || 0;

        while (size > 1024 && units.length > 1) {
            size /= 1024;
            units.shift();
        }

        return size.toFixed(2) + units[0];
    }

    static valueToFile(value:string | object, props?:ImageProps):FileValue|undefined {
        return value ? {
            ...(typeof value === 'string' ? {
                value,
                url: value
            } : value),
            state: 'init'
        } : undefined;
    }

    static sizeInfo(width?:number, height?:number):string {
        if (!width) {
            return `高度${height}px`;
        } else if (!height) {
            return `宽度${width}px`;
        }

        return `尺寸（${width} x ${height}）`;
    }

    state:ImageState = {
        uploading: false,
        locked: false,
        compress: false,
        files: [],
        compressOptions: {}
    };

    current: FileValue|FileX|null = null;
    resolve?: (value?:any) => void;

    constructor(props:ImageProps) {
        super(props);
        const value:string|Array<string | FileValue>|FileValue = props.value;
        const multiple = props.multiple;
        const joinValues = props.joinValues;
        const delimiter = props.delimiter as string;
        let files:Array<FileValue> = [];

        if (value) {
            // files = (multiple && Array.isArray(value) ? value : joinValues ? (value as string).split(delimiter) : [value])
            files = (Array.isArray(value) ? value : (joinValues && typeof value === 'string' && multiple) ? (value as string).split(delimiter) : [value])
            .map(item => ImageControl.valueToFile(item) as FileValue)
            .filter(item => item);
        }

        this.state = {
            ...this.state,
            files: files,
            crop: this.buildCrop(props),
            compress: !!props.compress,
            compressOptions: props.compressOptions
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
        this.startUpload = this.startUpload.bind(this);
        this.stopUpload = this.stopUpload.bind(this);
        this.toggleUpload = this.toggleUpload.bind(this);
        this.tick = this.tick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addFiles = this.addFiles.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
    }

    componentWillReceiveProps(nextProps:ImageProps) {
        const props = this.props;

        if (props.value !== nextProps.value) {
            const value:string|Array<string | FileValue>|FileValue = nextProps.value;
            const multiple = nextProps.multiple;
            const joinValues = nextProps.joinValues;
            const delimiter = nextProps.delimiter as string;

            let files:Array<FileValue> = [];

            if (value) {
                files = (Array.isArray(value) ? value : (joinValues && typeof value === 'string') ? (value as string).split(delimiter) : [value])
                .map(item => {
                    let obj = ImageControl.valueToFile(item, nextProps) as FileValue;
                    let org;

                    if (obj && (org = find(this.state.files, item => (item as FileValue).value === obj.value))) {
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
                files
            });
        }

        if (props.crop !== nextProps.crop) {
            this.setState({
                crop: this.buildCrop(nextProps)
            });
        }
    }

    buildCrop(props:ImageProps) {
        let crop = props.crop;

        if (crop && props.multiple) {
            props.env && props.env.alert && props.env.alert('图片多选配置和裁剪配置冲突，目前不能二者都支持！');
            return null;
        }

        if (crop === true) {
            crop = {};
        }

        if (crop) {
            crop = {
                aspectRatio: 1, // 1 : 1
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

    handleDropRejected(rejectedFiles:any, evt:React.DragEvent<any>) {
        evt.type === 'change' && alert('您选择的文件类型不符已被过滤！');
    }

    startUpload() {
        if (this.state.uploading) {
            return;
        }

        this.setState({
            uploading: true,
            locked: true,
            files: this.state.files.map(file => {
                if (file.state === 'error') {
                    file.state = 'pending';
                }

                return file;
            })
        }, this.tick);
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
        if (this.current || !this.state.uploading) {return;}

        const file = find(this.state.files, item => item.state === 'pending');
        if (file) {
            this.current = file;

            file.state = 'uploading';
            this.setState({
                files: this.state.files.concat()
            }, () => this.sendFile(file as FileX, (error, file, obj) => {
                const files = this.state.files.concat();
                const idx = files.indexOf(file);

                if (!~idx) {
                    return;
                }

                let newFile:FileX | FileValue = file;

                if (error) {
                    newFile.state = file.state !== 'uploading' ? file.state : 'error';
                    newFile.error = error;

                    if (!this.props.multiple && newFile.state === 'invalid') {
                        files.splice(idx, 1);
                        this.current = null;

                        return this.setState({
                            files: files,
                            error: error
                        }, this.tick);
                    }

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
                uploading: false,
                locked: false
            }, () => {
                this.onChange();

                if (this.resolve) {
                    this.resolve(this.state.files.some(file => file.state === 'error') ? '文件上传失败请重试' : null);
                    this.resolve = undefined;
                }
            });
            
        }
    }

    removeFile(file:FileValue, index:number) {
        const files = this.state.files.concat();

        files.splice(index, 1);

        this.setState({
            files: files
        }, this.onChange);
    }

    editImage(index:number) {
        const {
            multiple
        } = this.props;

        const files = this.state.files;

        this.setState({
            cropFile: {
                preview: files[index].url as string,
                state: 'init'
            }
        });

    }

    onChange() {
        const {
            multiple,
            onChange,
            joinValues,
            extractValue,
            delimiter,
            valueField
        } = this.props;

        const files = this.state.files.filter(file => file.state == 'uploaded' || file.state == 'init');

        let newValue:any = files.length ? joinValues ? files[0].value : files[0] : '';

        if (multiple) {
            newValue = joinValues ? files.map(item => item.value).join(delimiter) : extractValue ? files.map(item => item.value) : files;
        } else {
            newValue = joinValues ? newValue.value || newValue : extractValue ? newValue[valueField || 'value'] : newValue;
        }

        onChange(newValue);
    }

    handleSelect() {
        this.refs.dropzone && (this.refs.dropzone as any).open();
    }

    handleDrop(files:Array<FileX>) {
        const {multiple, crop} = this.props;

        if (crop && !multiple ) {
            return this.setState({
                locked: true,
                lockedReason: '请选择放弃或者应用',
                cropFile: files[0] as FileValue
            });
        }

        this.addFiles(files);
    }

    handlePaste(e:React.ClipboardEvent<any>) {
        const event = e.nativeEvent;
        const files:Array<FileX> = [];
        const items = event.clipboardData.items;

        [].slice.call(items).forEach((item:DataTransferItem) => {
            let blob:FileX;

            if (item.kind !== 'file' || !(blob = item.getAsFile() as File) || !/^image/i.test(blob.type)) {
                return;
            }

            blob.preview = window.URL.createObjectURL(blob);
            files.push(blob);
        });

        this.handleDrop(files);
    }

    handleCrop() {
        (this.refs.cropper as any).getCroppedCanvas().toBlob((file:File) => {
            this.addFiles([file]);
            this.setState({
                cropFile: undefined,
                locked: false,
                lockedReason: ''
            });
        });
    }

    cancelCrop() {
        this.setState({
            cropFile: undefined,
            locked: false,
            lockedReason: ''
        }, this.onChange);
    }

    addFiles(files:Array<FileX>) {
        if (!files.length) {
            return;
        }

        const {multiple, maxLength, maxSize, accept} = this.props;
        let currentFiles = this.state.files;

        if (!multiple && currentFiles.length) {
            currentFiles = [];
        }

        const allowed = (multiple ? maxLength ? maxLength : (files.length + currentFiles.length) : 1) - currentFiles.length;
        const inputFiles:Array<FileX> = [];

        [].slice.call(files, 0, allowed).forEach((file: FileX) => {
            if (maxSize && file.size > maxSize) {
                alert(`您选择的文件 ${file.name} 大小为 ${ImageControl.formatFileSize(file.size)} 超出了最大为 ${ImageControl.formatFileSize(maxSize)} 的限制，请重新选择`);
                return;
            }

            file.state = 'pending';
            if (!file.preview || !file.url) {
                file.preview = window.URL.createObjectURL(file);
            }
            inputFiles.push(file);
        });

        if (!inputFiles.length) {
            return;
        }

        this.setState({
            error: undefined,
            files: currentFiles.concat(inputFiles),
            locked: true
        }, () => {
            const {
                autoUpload
            } = this.props;

            if (autoUpload) {
                this.startUpload();
            }
        });
    }

    sendFile(file:FileX, cb:(error:null|string, file:FileX, obj?: FileValue) => void) {
        const {limit} = this.props;

        if (!limit) {
            return this._upload(file, cb);
        }

        const image = new Image();
        image.onload = () => {
            const width = image.width;
            const height = image.height;
            let error = '';

            if (limit.width && limit.width != width || limit.height && limit.height != height) {
                error = `您选择的图片不符合尺寸要求, 请上传${ImageControl.sizeInfo(limit.width, limit.height)}的图片`;
            } else if (limit.maxWidth && limit.maxWidth < width || limit.maxHeight && limit.maxHeight < height) {
                error = `您选择的图片不符合尺寸要求, 请上传不要超过${ImageControl.sizeInfo(limit.maxWidth, limit.maxHeight)}的图片`;
            } else if (limit.minWidth && limit.minWidth > width || limit.minHeight && limit.minHeight > height) {
                error = `您选择的图片不符合尺寸要求, 请上传不要小于${ImageControl.sizeInfo(limit.minWidth, limit.minHeight)}的图片`;
            } else if (limit.aspectRatio && Math.abs((width / height) - limit.aspectRatio) > 0.01) {
                error = `您选择的图片不符合尺寸要求, 请上传尺寸比率为 ${limit.aspectRatioLabel || limit.aspectRatio} 的图片`
            }

            if (error) {
                file.state = 'invalid';
                cb(error, file);
            } else {
                this._upload(file, cb);
            }
        };
        image.src = (file.preview || file.url) as string;
    }

    _upload(file:Blob, cb:(error:null|string, file:Blob, obj?: FileValue) => void) {
        let compressOptions = this.state.compressOptions;

        if (this.props.showCompressOptions) {
            compressOptions = {
                maxWidth: 800,
                maxHeight: 600,
                ...compressOptions
            };
        }

        this._send(file, this.props.reciever as string, {compress: this.state.compress, compressOptions})
        .then((ret: Payload) => {
            if (ret.status) {
                throw new Error(ret.msg || '上传失败, 请重试');
            }

            const obj:FileValue = {
                ...ret.data,
                state: 'uploaded'
            };
            obj.value = obj.value || obj.url;

            cb(null, file, obj);
        })
        .catch(error => cb(error.message || '上传失败，请重试', file))
    }

    _send(file:Blob, reciever:string, params:object):Promise<Payload> {
        const fd = new FormData();
        const data = this.props.data;
        reciever = filter(reciever, data);
        fd.append('file', file, (file as File).name);

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

        // params && Object.keys(params).forEach(key => {
        //     const value = (params as any)[key];
        //     fd.append(key, value);
        // });

        const env = this.props.env;

        if (!env || !env.fetcher) {
            throw new Error('fetcher is required');
        }

        return env.fetcher(reciever, fd, {
            method: 'post'
        });
    }

    handleClick() {
        (this.refs.dropzone as any).open();
    }

    handleImageLoaded(index:number, e:React.UIEvent<any>) {
        const imgDom = e.currentTarget;
        const img = new Image();
        img.onload = () => {
            delete img.onload;
            const files = this.state.files.concat();
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

            this.setState({
                files: files
            }, file.state == 'uploaded' || file.state == 'init' ? this.onChange : undefined);
        };
        img.src = imgDom.src;
    }

    validate():any {
        if (this.state.locked && this.state.lockedReason) {
            return this.state.lockedReason;
        } else if (this.state.uploading || this.state.files.some(item => item.state === 'pending')) {
            return new Promise((resolve) => {
                this.resolve = resolve;
                this.startUpload();
            });
        } else if (this.state.files.some(item => item.state === 'error')) {
            return '文件上传失败请重试';
        }
    }

    renderCompressOptions() {
        const showCompressOptions = this.props.showCompressOptions;
        const cx = this.props.classnames;
        const classPrefix = this.props.classPrefix;

        if (!showCompressOptions) {
            return;
        }

        return (
            <div key="options" className="m-t">

            <Switch
                classPrefix={classPrefix} 
                checked={!!this.state.compress}
                onChange={checked => this.setState({compress: checked})}
                disabled={this.props.disabled}
            />

            <span className="m-l-xs">开启缩放?</span>

            {this.state.compress && (
                <div className="inline">
                    <input
                        className="form-control w-xs inline m-l-xs m-r-xs"
                        type="text"
                        value={typeof this.state.compressOptions.maxWidth === 'undefined' ? 800 : this.state.compressOptions.maxWidth}
                        onChange={e => this.setState({compressOptions: {
                            ...this.state.compressOptions,
                            maxWidth: parseInt(e.currentTarget.value, 10) || 0
                        }})}
                        disabled={this.props.disabled}
                    />

                    <span className=" m-l-xs m-r-xs">X</span>

                    <input
                        className="form-control w-xs inline  m-l-xs m-r-xs"
                        type="text"
                        value={typeof this.state.compressOptions.maxHeight  === 'undefined' ? 600 : this.state.compressOptions.maxHeight}
                        onChange={e => this.setState({compressOptions: {
                            ...this.state.compressOptions,
                            maxHeight: parseInt(e.currentTarget.value, 10) || 0
                        }})}
                        disabled={this.props.disabled}
                    />
                </div>
            )}
            </div>
        );
    }

    render() {
        const {
            className,
            classPrefix: ns,
            placeholder,
            disabled,
            multiple,
            accept,
            maxLength,
            autoUpload,
            btnUploadClassName,
            btnClassName,
            hideUploadButton
        } = this.props;

        const {
            files,
            error,
            crop,
            uploading,
            cropFile
        } = this.state;

        const hasPending = files.some(file => file.state == 'pending');

        return (
            <div
                className={cx(`${ns}ImageControl`, className)}
                tabIndex={-1}
                onPaste={this.handlePaste}
            >
                {cropFile ? (
                    <div className="cropper-wrapper">
                        <Cropper
                            {...crop}
                            ref="cropper"
                            src={cropFile.preview}
                        />
                        <button
                            type="button"
                            className="btn-sm btn btn-link"
                            onClick={this.handleCrop}
                        >
                            <i className="fa fa-2x fa-check text-warning" />
                        </button>
                        <button
                            type="button"
                            className="btn-sm btn btn-link"
                            onClick={this.cancelCrop}
                            >
                            <i className="fa fa-2x fa-times text-white" />
                        </button>
                    </div>
                ) : (
                    <DropZone
                        key="drop-zone"
                        className={cx('drop-zone', {
                            disabled,
                            'has-files': !!files.length
                        })}
                        activeClassName="drop-zone-active"
                        ref="dropzone"
                        onDrop={this.handleDrop}
                        onDropRejected={this.handleDropRejected}
                        disableClick
                        accept={accept}
                        multiple={multiple}
                        >
                            {files && files.length ? (
                                <div className={cx("image-list clearfix", {
                                    'image-list-multiple': multiple
                                })}>
                                {files.map((file, key) => (
                                    <div
                                        key={key}
                                        className={cx('image-item pull-left', {
                                            uploaded: file.state !== 'uploading',
                                            invalid: file.state === 'error' || file.state == 'invalid'
                                        })}
                                    >
                                        <div className="img-wrapper"><img onLoad={this.handleImageLoaded.bind(this, key)} src={file.url || file.preview} alt={file.name} className="img-rounded" /></div>
                                        {file.info ? [
                                            <p key="1">{file.info.width} x {file.info.height}</p>,
                                            file.info.len ? (<p key="2">{ImageControl.formatFileSize(file.info.len)}</p>) : null
                                        ] : (<p>...</p>)}

                                        {file.error ? (<p className="text-danger">{file.error}</p>) : null}

                                        <div className="image-overlay">
                                            {file.state === 'uploading' ? (<i className="fa fa-spinner fa-spin fa-2x fa-fw" />) : null}
                                            {!disabled && file.state !== 'uploading' ? (<button onClick={this.removeFile.bind(this, file, key)} type="button" className={cx("close", {'crop-close' :!!crop})}><span>&times;</span></button>) : null}
                                            {!!crop && !disabled && file.state !== 'uploading' ? (<button onClick={this.editImage.bind(this, key)} type="button" className="edit"><i className="fa fa-pencil"></i></button>) : null}
                                            {!disabled && file.state !== 'uploading' ? (<a target="_blank" href={file.url || file.preview} className="view"><i className="fa fa-search"></i></a>) : null}
                                        </div>
                                    </div>
                                ))}

                                {multiple && (!maxLength || files.length < maxLength) || !multiple && !files.length ? (
                                    <label className={cx("image-add-btn", {disabled})} onClick={this.handleSelect}>
                                    <i className="fa fa-plus fa-3x" />
                                    </label>
                                ) : null}
                                </div>
                            ) : (<div className={error ? 'text-danger' : undefined}>{error || placeholder}
                            <button type="button" className={cx('btn m-l-sm', btnClassName)} disabled={disabled} onClick={this.handleSelect}><i className="fa fa-cloud-upload" /> 选择文件</button>
                        </div>)}
                    </DropZone>
                )}

                {this.renderCompressOptions()}

                {!autoUpload && !hideUploadButton && files.length ? (
                    <button className={cx('btn m-r-xs', btnUploadClassName)} disabled={!hasPending} onClick={this.toggleUpload}>
                        {uploading ? '暂停上传' : '开始上传'}
                    </button>
                ) : null}
            </div>
        );
    }
}


@FormItem({
    type: 'image',
    sizeMutable: false
})
export class ImageControlRenderer extends ImageControl {};

