import React from 'react';
import Dropzone from 'react-dropzone';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import {
  autobind,
  dataMapping,
  FormControlProps,
  FormItem,
  getVariable,
  guid,
  isExpression,
  isObject,
  resolveEventData,
  TestIdBuilder
} from 'amis-core';
import {FormBaseControlSchema, SchemaTokenizeableString} from '../../Schema';
import type {CellRichTextValue, CellValue} from 'exceljs';
import {Icon, TooltipWrapper} from 'amis-ui';

/**
 * Excel 文件状态
 */
export type ExcelFileState =
  | 'init'
  | 'error'
  | 'pending'
  | 'parsed'
  | 'invalid';

/**
 * Excel 文件数据结构
 */
export interface ExcelFileData {
  /** 单个 sheet 的数据 */
  data: any[];
  /** sheet 名称 */
  sheetName?: string;
  /** 图片数据 */
  images?: string[];
}

/**
 * Excel 文件输出数据结构
 */
export interface ExcelOutputData {
  /** 文件名称 */
  fileName: string;
  /** 文件数据 */
  data: any[] | ExcelFileData | ExcelFileData[];
}

/**
 * Excel 文件对象
 */
export interface ExcelFile {
  /** 文件唯一标识 */
  id: string;
  /** 文件名称 */
  name: string;
  /** 文件状态 */
  state: ExcelFileState;
  /** 错误信息 */
  error?: string;
  /** 解析后的数据 */
  data?: any[] | ExcelFileData | ExcelFileData[];
}

/**
 * Excel 解析
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/form/input-excel
 */
export interface InputExcelControlSchema extends FormBaseControlSchema {
  /**
   * 指定为 Excel 解析
   */
  type: 'input-excel';

  /**
   * 是否解析所有 sheet，默认情况下只解析第一个
   */
  allSheets?: boolean;

  /**
   * 解析模式，array 是解析成二维数组，object 是将第一列作为字段名，解析为对象数组
   */
  parseMode?: 'array' | 'object';

  /**
   * 是否包含空内容，主要用于二维数组模式
   */
  includeEmpty?: boolean;

  /**
   * 纯文本模式
   */
  plainText?: boolean;

  /**
   * 解析图片
   */
  parseImage?: boolean;

  /** 图片解析结果使用 data URI 格式 */
  imageDataURI?: boolean;

  /**
   * 占位文本提示
   */
  placeholder?: string;

  /**
   * 最大上传文件数
   */
  maxLength?: number;

  /**
   * 是否允许上传多个文件
   */
  multiple?: boolean;

  /**
   * 文件解析完成后将字段同步到表单内部
   */
  autoFill?: {
    [propName: string]: SchemaTokenizeableString;
  };

  testIdBuilder?: TestIdBuilder;
}

export interface ExcelProps
  extends FormControlProps,
    Omit<
      InputExcelControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface ExcelControlState {
  files: Array<ExcelFile>;
  error?: string | null;
}

export type InputExcelRendererEvent = 'change';
export type InputExcelRendererAction = 'clear';
export default class ExcelControl extends React.PureComponent<
  ExcelProps,
  ExcelControlState
> {
  static defaultProps: Partial<ExcelProps> = {
    allSheets: false,
    parseMode: 'object',
    includeEmpty: true,
    plainText: true,
    parseImage: false,
    imageDataURI: true
  };

  state: ExcelControlState = {
    files: []
  };

  dropzone = React.createRef<any>();
  ExcelJS: any;

  componentDidUpdate(prevProps: ExcelProps) {
    // 当值被外部设置为空时，清空文件列表
    if (prevProps.value !== this.props.value && !this.props.value) {
      this.setState({files: []});
    }

    // 如果值从外部改变了，并且不是被清空，则触发自动填充
    if (prevProps.value !== this.props.value && this.props.value) {
      this.triggerAutoFill();
    }
  }

  /**
   * 同步自动填充数据
   */
  @autobind
  syncAutoFill(filename: string, fileData?: any) {
    const {autoFill, onBulkChange, data, name, multiple} = this.props;

    if (autoFill?.hasOwnProperty('api') || !isObject(autoFill)) {
      return;
    }

    const excludeSelfAutoFill = name ? omit(autoFill, name) : autoFill;

    if (!isEmpty(excludeSelfAutoFill) && onBulkChange) {
      let context;

      if (multiple === true) {
        // 多文件模式：提供所有已解析文件的数组作为上下文
        const parsedFiles = this.state.files
          .filter(f => f.state === 'parsed')
          .map(file => ({
            filename: file.name,
            data: file.data
          }));

        context = {
          items: parsedFiles,
          currentFile: {
            filename,
            data: fileData
          }
        };
      } else {
        // 单文件模式：只提供当前文件信息作为上下文
        context = {
          filename
        };
      }

      const toSync = dataMapping(excludeSelfAutoFill, context);

      Object.keys(toSync).forEach(key => {
        if (isPlainObject(toSync[key]) && isPlainObject(data[key])) {
          toSync[key] = merge({}, data[key], toSync[key]);
        }
      });
      onBulkChange(toSync);
    }
  }

  /**
   * 处理文件上传
   * 支持单文件和多文件上传，自动处理文件数量限制
   */
  @autobind
  async handleDrop(files: File[]) {
    const {maxLength, multiple} = this.props;

    if (!files.length) {
      return;
    }

    // 如果 multiple 未定义或为 false，只取第一个文件并清除现有文件
    if (!multiple) {
      const filesToProcess = [
        {
          file: files[0],
          id: guid()
        }
      ];
      this.setState(
        {
          files: filesToProcess.map(({file, id}) => ({
            id,
            name: file.name,
            state: 'pending' as ExcelFileState
          }))
        },
        () => {
          this.processFiles(filesToProcess);
        }
      );
      return;
    }

    // multiple 为 true 的情况，追加新文件
    const remainingSlots = maxLength
      ? maxLength - this.state.files.length
      : files.length;

    if (remainingSlots <= 0) {
      return;
    }

    // 确保不超过剩余可上传数量
    const filesToProcess = files.slice(0, remainingSlots).map(file => ({
      file,
      id: guid()
    }));

    this.setState(
      state => ({
        files: [
          ...state.files,
          ...filesToProcess.map(({file, id}) => ({
            id,
            name: file.name,
            state: 'pending' as ExcelFileState
          }))
        ]
      }),
      () => {
        this.processFiles(filesToProcess);
      }
    );
  }

  /**
   * 并行处理多个文件
   * 使用 Promise.all 同时处理所有文件，提高效率
   */
  async processFiles(files: Array<{file: File; id: string}>) {
    const pendingFiles = files
      .map(({file, id}) => {
        const fileState = this.state.files.find(
          f => f.id === id && f.state === 'pending'
        );
        return fileState ? {file, fileState} : null;
      })
      .filter(
        (item): item is {file: File; fileState: ExcelFile} => item !== null
      );

    if (pendingFiles.length) {
      await Promise.all(
        pendingFiles.map(({file, fileState}) =>
          this.processExcelFile(file, fileState)
        )
      );
    } else {
      // 如果没有待处理的文件，仍然需要更新表单值
      // 这处理了清空所有文件的情况
      this.updateFormValue();
    }
  }

  @autobind
  handleSelect() {
    const {disabled, maxLength, multiple} = this.props;
    const canAddMore = multiple === true || this.state.files.length === 0;

    if (
      !disabled &&
      !(maxLength && this.state.files.length >= maxLength) &&
      canAddMore &&
      this.dropzone.current
    ) {
      this.dropzone.current.open();
    }
  }

  /**
   * 移除文件并更新表单数据
   *
   * @param file 要移除的文件对象
   */
  @autobind
  removeFile(file: ExcelFile) {
    this.setState(
      state => ({
        files: state.files.filter(f => f.id !== file.id)
      }),
      () => {
        // 检查是否有待处理的文件
        const pendingFiles = this.state.files.filter(
          f => f.state === 'pending'
        );
        if (pendingFiles.length === 0) {
          // 没有待处理文件，可以安全地更新表单值
          this.updateFormValue();
        }
        // 否则等待所有文件处理完成后再更新值
      }
    );
  }

  /**
   * 更新文件状态
   * 当状态变为 parsed 时检查是否所有文件都已处理完成
   */
  updateFileState(fileId: string, updates: Partial<ExcelFile>) {
    this.setState(
      state => ({
        files: state.files.map(f => (f.id === fileId ? {...f, ...updates} : f))
      }),
      () => {
        if (updates.state === 'parsed') {
          // 检查是否所有待处理的文件都已经处理完成
          const pendingFiles = this.state.files.filter(
            f => f.state === 'pending'
          );
          if (pendingFiles.length === 0) {
            // 所有文件都已处理完成，一次性更新表单值
            this.updateFormValue();
            // autoFill 会在 updateFormValue 中触发
          }
        }
      }
    );
  }

  /**
   * 更新表单值
   * 根据当前已解析的文件更新表单数据
   * 支持多文件模式和单文件模式
   */
  @autobind
  async updateFormValue() {
    const {data, multiple, allSheets, parseImage} = this.props;
    const parsedFiles = this.state.files.filter(f => f.state === 'parsed');

    if (parsedFiles.length === 0) {
      await this.dispatchEvent('change');
      this.props.onChange(undefined);
      return;
    }

    let value: any;

    if (multiple === true) {
      // 多文件模式：返回包含文件名和sheet数据的数组
      value = parsedFiles.map(file => {
        const fileData = Array.isArray(file.data) ? file.data : [file.data];
        return {
          fileName: file.name,
          data: fileData.map((sheet: any) => {
            // 确保每个sheet数据包含所需的属性
            const sheetData: any = {
              sheetName: sheet.sheetName || 'Sheet1',
              data: sheet.data || sheet
            };

            // 如果启用了图片解析，确保图片数据也被包含
            if (parseImage && sheet.images) {
              sheetData.images = sheet.images;
            }

            return sheetData;
          })
        };
      });
    } else {
      // 单文件模式：保持原有格式
      const file = parsedFiles[0];
      if (allSheets) {
        // 多表格模式
        value = Array.isArray(file.data) ? file.data : [file.data];
      } else {
        // 单表格模式
        value = file.data;
      }
    }

    // 检查并处理变量表达式
    if (value && isExpression(value)) {
      value = getVariable(data, value);
    }

    const dispatcher = await this.dispatchEvent('change', value);
    if (dispatcher?.prevented) {
      return;
    }
    this.props.onChange(value);

    // 在值变化时也触发自动填充
    this.triggerAutoFill();
  }

  /**
   * 在适当的时机触发自动填充
   */
  triggerAutoFill() {
    const {autoFill} = this.props;
    if (autoFill && !autoFill.hasOwnProperty('api') && isObject(autoFill)) {
      const parsedFiles = this.state.files.filter(f => f.state === 'parsed');
      if (parsedFiles.length > 0) {
        // 取最后一个处理的文件
        const lastFile = parsedFiles[parsedFiles.length - 1];
        this.syncAutoFill(lastFile.name, lastFile.data);
      }
    }
  }

  /**
   * 处理Excel文件
   * 支持 .xls 和 .xlsx 格式
   * 使用 xlsx 库转换 .xls 为 .xlsx，使用 exceljs 解析内容
   */
  async processExcelFile(excelFile: File, fileState: ExcelFile) {
    const {translate: __} = this.props;
    try {
      // 使用 Promise 包装 FileReader 操作
      const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            resolve(reader.result as ArrayBuffer);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(excelFile);
      });

      const isXls = excelFile.name.toLowerCase().endsWith('.xls');
      let buffer: ArrayBuffer;

      if (isXls) {
        const XLSX = await import('xlsx');
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          cellDates: true
        });
        const xlsxFile = XLSX.writeXLSX(workbook, {type: 'array'});
        buffer = xlsxFile.buffer;
      } else {
        buffer = arrayBuffer;
      }

      await this.parseExcelData(buffer, fileState);

      // autoFill 会在 updateFormValue 中统一处理
    } catch (error) {
      console.error('Excel parsing error:', error);
      this.updateFileState(fileState.id, {
        state: 'error',
        error: error.message || __('Excel.parseError')
      });
    }
  }

  /**
   * 解析 Excel 数据
   * 支持解析所有 sheet 或单个 sheet
   * 支持解析图片和富文本
   */
  async parseExcelData(excelData: ArrayBuffer | string, fileState: ExcelFile) {
    const {allSheets, parseImage, plainText, translate: __} = this.props;
    try {
      const ExcelJS = (await import('exceljs')).default;
      this.ExcelJS = ExcelJS;
      const workbook = new ExcelJS.Workbook();

      const data =
        typeof excelData === 'string'
          ? new Uint8Array(excelData.split('').map(c => c.charCodeAt(0))).buffer
          : excelData;

      await workbook.xlsx.load(data);

      let sheetsResult: any;
      if (allSheets) {
        sheetsResult = this.parseAllSheets(workbook, parseImage, plainText);
      } else {
        const worksheet = workbook.worksheets.find(
          (sheet: any) => sheet.state !== 'hidden'
        );
        sheetsResult = parseImage
          ? {
              data: this.readWorksheet(worksheet, plainText),
              images: this.readImages(worksheet, workbook)
            }
          : this.readWorksheet(worksheet, plainText);
      }

      this.updateFileState(fileState.id, {
        state: 'parsed',
        data: sheetsResult
      });
    } catch (error) {
      console.error('Excel parsing error:', error);
      this.updateFileState(fileState.id, {
        state: 'error',
        error: error.message || __('Excel.parseError')
      });
    }
  }

  /**
   * 解析所有可见的 sheet
   */
  parseAllSheets(workbook: any, parseImage = false, plainText = true) {
    const sheetsResult: Array<{
      sheetName: string;
      data: any[];
      images?: string[];
    }> = [];

    workbook.eachSheet((worksheet: any) => {
      const sheetState = worksheet.state || 'visible';
      // hidden 的不处理
      if (sheetState === 'hidden') {
        return;
      }

      const sheetData: {
        sheetName: string;
        data: any[];
        images?: string[];
      } = {
        sheetName: worksheet.name,
        data: this.readWorksheet(worksheet, plainText)
      };

      if (parseImage) {
        sheetData.images = this.readImages(worksheet, workbook);
      }

      sheetsResult.push(sheetData);
    });
    return sheetsResult;
  }

  /** 读取工作表里的图片 */
  readImages(worksheet: any, workbook: any) {
    const {imageDataURI} = this.props;
    const images = worksheet.getImages();
    const imgResult: string[] = [];
    for (const image of images) {
      const img = workbook.getImage(+image.imageId);
      const imgBase64 = this.encodeBase64Bytes(img.buffer);
      if (imageDataURI) {
        const extension = img.extension || 'png';
        imgResult.push(`data:image/${extension};base64,` + imgBase64);
      } else {
        imgResult.push(imgBase64);
      }
    }
    return imgResult;
  }

  /** 将 buffer 转成 base64 */
  encodeBase64Bytes(bytes: Uint8Array): string {
    return btoa(
      bytes.reduce((acc, current) => acc + String.fromCharCode(current), '')
    );
  }

  /**
   * 触发表单事件
   */
  private async dispatchEvent(
    eventName: string,
    eventData?: Record<string, any>
  ) {
    const {dispatchEvent} = this.props;
    return await dispatchEvent(
      eventName,
      resolveEventData(this.props, {value: eventData})
    );
  }

  /**
   * 检查当前单元格数据是否为富文本
   *
   * @reference https://github.com/exceljs/exceljs#rich-text
   */
  isRichTextValue(value: any) {
    return !!(
      value &&
      isObject(value) &&
      value.hasOwnProperty('richText') &&
      Array.isArray(value?.richText)
    );
  }

  /**
   * 将富文本类型的单元格内容转化为Plain Text
   *
   * @param {CellRichTextValue} cellValue 单元格值
   * @param {Boolean} html 是否输出为html格式
   */
  richText2PlainString(cellValue: CellRichTextValue, html = false) {
    const result = cellValue.richText.map(({text, font = {}}) => {
      let outputStr = text;

      /* 如果以HTML格式输出，简单处理一下样式 */
      if (html) {
        let styles = '';
        const htmlTag = font?.bold
          ? 'strong'
          : font?.italic
          ? 'em'
          : font?.vertAlign === 'superscript'
          ? 'sup'
          : font?.vertAlign === 'subscript'
          ? 'sub'
          : 'span';

        if (font?.strike) {
          styles += 'text-decoration: line-through;';
        } else if (font?.underline) {
          styles += 'text-decoration: underline;';
        }

        if (font?.outline) {
          styles += 'outline: solid;';
        }

        if (font?.size) {
          styles += `font-size: ${font.size}px;`;
        }

        outputStr = `<${htmlTag} ${
          styles ? `style=${styles}` : ''
        }>${text}</${htmlTag}>`;
      }

      return outputStr;
    });

    return result.join('');
  }

  /**
   * 读取工作表内容
   */
  readWorksheet(worksheet: any, plainText = true) {
    const result: any[] = [];
    const {parseMode, includeEmpty} = this.props;

    if (parseMode === 'array') {
      worksheet.eachRow((_row: any) => {
        let values = _row.values;
        values.shift(); // excel 返回的值是从 1 开始的，0 节点永远是 null
        if (plainText) {
          values = values.map((item: any) => {
            if (item instanceof Object) {
              if (item.hyperlink) {
                if (item.hyperlink.startsWith('mailto:')) {
                  return item.hyperlink.substring(7);
                }
                return item.hyperlink;
              } else if (item.result) {
                return item.result;
              } else if (item.richText) {
                return this.richText2PlainString(item);
              }
            }
            return item;
          });
        }
        result.push(values);
      });
      return result;
    } else {
      let firstRowValues: any[] = [];
      worksheet.eachRow((row: any, rowNumber: number) => {
        // 将第一列作为字段名
        if (rowNumber == 1) {
          firstRowValues = (row.values ?? []).map((item: CellValue) =>
            this.isRichTextValue(item)
              ? this.richText2PlainString(item as CellRichTextValue)
              : item
          );
        } else {
          const data: any = {};
          if (includeEmpty) {
            firstRowValues.forEach((item: any) => {
              data[item] = '';
            });
          }
          row.eachCell((cell: any, colNumber: any) => {
            if (firstRowValues[colNumber]) {
              let value = cell.value;
              if (plainText) {
                const ExcelValueType = this.ExcelJS.ValueType;
                if (cell.type === ExcelValueType.Hyperlink) {
                  value = cell.value.hyperlink;
                  if (value.startsWith('mailto:')) {
                    value = value.substring(7);
                  }
                } else if (cell.type === ExcelValueType.Formula) {
                  value = cell.value.result;
                } else if (cell.type === ExcelValueType.RichText) {
                  value = this.richText2PlainString(cell.value);
                } else if (cell.type === ExcelValueType.Error) {
                  value = '';
                }
              }

              data[firstRowValues[colNumber]] = value;
            }
          });
          result.push(data);
        }
      });
      return result;
    }
  }

  doAction(action: any, _data: object, _throwErrors: boolean) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue, formStore, store, name} = this.props;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      const pristineVal =
        getVariable(formStore?.pristine ?? store?.pristine, name) ?? resetValue;
      onChange(pristineVal ?? '');
    }
  }

  render() {
    const {
      className,
      classnames: cx,
      maxLength,
      disabled,
      translate: __,
      placeholder,
      testIdBuilder,
      multiple,
      env,
      container
    } = this.props;

    const {files} = this.state;
    const isMaxLength = !!maxLength && files.length >= maxLength;

    // 单文件模式使用简化UI
    if (multiple !== true) {
      return (
        <div className={cx('ExcelControl', className)}>
          <Dropzone
            key="drop-zone"
            ref={this.dropzone}
            onDrop={this.handleDrop}
            accept=".xlsx,.xls"
            multiple={false}
            disabled={disabled}
          >
            {({getRootProps, getInputProps}) => (
              <section className={cx('ExcelControl-container', className)}>
                <div
                  {...getRootProps({className: cx('ExcelControl-dropzone')})}
                  {...testIdBuilder?.getTestId()}
                >
                  <input
                    {...getInputProps()}
                    {...testIdBuilder?.getChild('input').getTestId()}
                  />
                  {files.length > 0 && files[0].state === 'parsed' ? (
                    <p>
                      {__('Excel.parsed', {
                        filename: files[0].name
                      })}
                    </p>
                  ) : (
                    <p>{placeholder ?? __('Excel.placeholder')}</p>
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      );
    }

    // 多文件模式使用当前UI，但简化风格
    return (
      <div className={cx('ExcelControl', className)}>
        <Dropzone
          key="drop-zone"
          ref={this.dropzone}
          onDrop={this.handleDrop}
          accept=".xlsx,.xls"
          multiple={!!multiple}
          disabled={disabled || isMaxLength}
          noClick={true}
        >
          {({getRootProps, getInputProps, isDragActive}) => (
            <div
              {...getRootProps({
                className: cx('ExcelControl-container', className)
              })}
            >
              <TooltipWrapper
                placement="top"
                container={container || env?.getModalContainer}
                tooltip={
                  maxLength === 1
                    ? __('Excel.singleFile')
                    : maxLength
                    ? __('File.maxLength', {
                        maxLength,
                        uploaded: files.length
                      })
                    : ''
                }
                tooltipClassName={cx('ExcelControl-tooltip')}
              >
                <div
                  className={cx('ExcelControl-dropzone', {
                    'is-disabled': disabled || isMaxLength,
                    'is-empty': !files.length,
                    'is-active': isDragActive
                  })}
                  onClick={
                    disabled || isMaxLength ? undefined : this.handleSelect
                  }
                >
                  <input
                    {...getInputProps()}
                    {...testIdBuilder?.getChild('input').getTestId()}
                  />

                  {isDragActive ? (
                    <div className={cx('ExcelControl-acceptTip')}>
                      <p>{__('File.dragDrop')}</p>
                    </div>
                  ) : (
                    <div className={cx('ExcelControl-acceptTip')}>
                      <p>{placeholder ?? __('Excel.placeholder')}</p>
                    </div>
                  )}
                </div>
              </TooltipWrapper>

              {files.length > 0 && (
                <ul className={cx('ExcelControl-list')}>
                  {files.map(file => (
                    <li key={file.id}>
                      <TooltipWrapper
                        placement="top"
                        container={container || env?.getModalContainer}
                        tooltipClassName={cx(
                          'ExcelControl-list-tooltip',
                          file.state === 'error' && 'is-invalid'
                        )}
                        tooltip={
                          file.state === 'error' ? file.error : file.name
                        }
                      >
                        <div
                          className={cx('ExcelControl-itemInfo', {
                            'is-invalid': file.state === 'error'
                          })}
                        >
                          <span className={cx('ExcelControl-itemInfoIcon')}>
                            <Icon icon="file-excel" className="icon" />
                          </span>

                          <span className={cx('ExcelControl-itemInfoText')}>
                            {file.name}
                          </span>

                          {!disabled && (
                            <a
                              data-tooltip={__('Select.clear')}
                              data-position="left"
                              className={cx('ExcelControl-clear')}
                              onClick={e => {
                                e.stopPropagation();
                                this.removeFile(file);
                              }}
                            >
                              <Icon icon="close" className="icon" />
                            </a>
                          )}
                        </div>
                      </TooltipWrapper>

                      {file.state === 'pending' && (
                        <div className={cx('ExcelControl-progressInfo')}>
                          <p>{__('Excel.parsing')}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    );
  }
}

@FormItem({
  type: 'input-excel'
})
export class ExcelControlRenderer extends ExcelControl {}
