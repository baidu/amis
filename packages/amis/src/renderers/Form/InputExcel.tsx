import React from 'react';
import Dropzone from 'react-dropzone';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import {
  FormItem,
  FormControlProps,
  autobind,
  isObject,
  resolveEventData,
  dataMapping
} from 'amis-core';
import {FormBaseControlSchema, SchemaTokenizeableString} from '../../Schema';
import type {CellValue, CellRichTextValue} from 'exceljs';

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
   * 文件解析完成后将字段同步到表单内部
   */
  autoFill?: {
    [propName: string]: SchemaTokenizeableString;
  };
}

export interface ExcelProps
  extends FormControlProps,
    Omit<
      InputExcelControlSchema,
      'type' | 'className' | 'descriptionClassName' | 'inputClassName'
    > {}

export interface ExcelControlState {
  filename: string;
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
    filename: ''
  };

  ExcelJS: any;

  componentDidUpdate(prevProps: ExcelProps) {
    if (prevProps.value !== this.props.value && !this.props.value) {
      this.setState({filename: ''});
    }
  }

  @autobind
  syncAutoFill(filename: string) {
    const {autoFill, onBulkChange, data, name} = this.props;

    if (autoFill?.hasOwnProperty('api') || !isObject(autoFill)) {
      return;
    }

    const excludeSelfAutoFill = name ? omit(autoFill, name) : autoFill;

    if (!isEmpty(excludeSelfAutoFill) && onBulkChange) {
      const toSync = dataMapping(excludeSelfAutoFill, {filename});

      Object.keys(toSync).forEach(key => {
        if (isPlainObject(toSync[key]) && isPlainObject(data[key])) {
          toSync[key] = merge({}, data[key], toSync[key]);
        }
      });
      onBulkChange(toSync);
    }
  }

  @autobind
  handleDrop(files: File[]) {
    const excel = files[0];
    const fileName = excel.name;
    const reader = new FileReader();
    reader.readAsArrayBuffer(excel);
    reader.onload = async () => {
      if (reader.result) {
        // 如果是 xls 就用 xlsx 解析一下转成 xlsx 然后用 exceljs 解析
        // 为啥不直接用 xlsx 解析内容？因为它的社区版本不支持读图片，只有收费版才支持
        if (fileName.toLowerCase().endsWith('.xls')) {
          import('xlsx').then(XLSX => {
            const workbook = XLSX.read(
              new Uint8Array(reader.result as ArrayBuffer),
              {
                cellDates: true
              }
            );
            const xlsxFile = XLSX.writeXLSX(workbook, {type: 'array'});
            this.processExcelFile(xlsxFile, fileName);
          });
        } else {
          this.processExcelFile(reader.result, fileName);
        }
      }
    };
  }

  processExcelFile(excelData: ArrayBuffer | string, fileName: string) {
    const {allSheets, onChange, parseImage, autoFill} = this.props;
    import('exceljs').then(async (ExcelJS: any) => {
      this.ExcelJS = ExcelJS;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(excelData);
      let sheetsResult: any = [];
      if (allSheets) {
        workbook.eachSheet((worksheet: any) => {
          const sheetState = worksheet.state || 'visible';
          // hidden 的不处理
          if (sheetState === 'hidden') {
            return;
          }
          if (parseImage) {
            sheetsResult.push({
              sheetName: worksheet.name,
              data: this.readWorksheet(worksheet),
              images: this.readImages(worksheet, workbook)
            });
          } else {
            sheetsResult.push({
              sheetName: worksheet.name,
              data: this.readWorksheet(worksheet)
            });
          }
        });
      } else {
        const worksheet = workbook.worksheets.find(
          (sheet: any) => sheet.state !== 'hidden'
        );

        if (parseImage) {
          const images = this.readImages(worksheet, workbook);
          sheetsResult = {
            data: this.readWorksheet(worksheet),
            images
          };
        } else {
          sheetsResult = this.readWorksheet(worksheet);
        }
      }
      const dispatcher = await this.dispatchEvent('change', sheetsResult);
      if (dispatcher?.prevented) {
        return;
      }

      onChange(sheetsResult);

      if (autoFill) {
        this.syncAutoFill(fileName);
      }

      this.setState({filename: fileName});
    });
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

  async dispatchEvent(eventName: string, eventData?: Record<string, any>) {
    const {dispatchEvent, data} = this.props;
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
   * 读取单个 sheet 的内容
   */
  readWorksheet(worksheet: any) {
    const result: any[] = [];
    const {parseMode, plainText, includeEmpty} = this.props;

    if (parseMode === 'array') {
      worksheet.eachRow((row: any, rowNumber: number) => {
        let values = row.values;
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

  doAction(action: any, data: object, throwErrors: boolean) {
    const actionType = action?.actionType as string;
    const {onChange, resetValue} = this.props;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  render() {
    const {
      className,
      classnames: cx,
      classPrefix: ns,
      disabled,
      translate: __,
      placeholder
    } = this.props;

    return (
      <div className={cx('ExcelControl', className)}>
        <Dropzone
          key="drop-zone"
          onDrop={this.handleDrop}
          accept=".xlsx,.xls"
          multiple={false}
          disabled={disabled}
        >
          {({getRootProps, getInputProps}) => (
            <section className={cx('ExcelControl-container', className)}>
              <div {...getRootProps({className: cx('ExcelControl-dropzone')})}>
                <input {...getInputProps()} />
                {this.state.filename ? (
                  __('Excel.parsed', {
                    filename: this.state.filename
                  })
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
}

@FormItem({
  type: 'input-excel'
})
export class ExcelControlRenderer extends ExcelControl {}
