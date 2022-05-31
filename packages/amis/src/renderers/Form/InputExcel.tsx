import React, {Suspense} from 'react';
import Dropzone from 'react-dropzone';
import {autobind, createObject} from 'amis-core';
import {FormItem, FormControlProps, FormBaseControl} from 'amis-core';

/**
 * Excel 解析
 * 文档：https://baidu.gitee.io/amis/docs/components/form/input-excel
 */
export interface InputExcelControlSchema extends FormBaseControl {
  /**
   * 指定为 Excel 解析
   */
  type: 'input-excel';

  /**
   * 是否解析所有 sheet，默认情况下只解析第一个
   */
  allSheets: boolean;

  /**
   * 解析模式，array 是解析成二维数组，object 是将第一列作为字段名，解析为对象数组
   */
  parseMode: 'array' | 'object';

  /**
   * 是否包含空内容，主要用于二维数组模式
   */
  includeEmpty: boolean;

  /**
   * 纯文本模式
   */
  plainText: boolean;
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
    plainText: true
  };

  state: ExcelControlState = {
    filename: ''
  };

  ExcelJS: any;

  @autobind
  handleDrop(files: File[]) {
    const {allSheets, onChange, dispatchEvent, data} = this.props;
    const excel = files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(excel);
    reader.onload = async () => {
      if (reader.result) {
        import('exceljs').then(async (ExcelJS: any) => {
          this.ExcelJS = ExcelJS;
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(reader.result);
          let sheetsResult: any[] = [];
          if (allSheets) {
            workbook.eachSheet((worksheet: any) => {
              sheetsResult.push({
                sheetName: worksheet.name,
                data: this.readWorksheet(worksheet)
              });
            });
          } else {
            const worksheet = workbook.worksheets[0];
            sheetsResult = this.readWorksheet(worksheet);
          }
          const dispatcher = await this.dispatchEvent('change', sheetsResult);
          if (dispatcher?.prevented) {
            return;
          }
          onChange(sheetsResult);
          this.setState({filename: files[0].name});
        });
      }
    };
  }

  async dispatchEvent(eventName: string, eventData?: Record<string, any>) {
    const {dispatchEvent, data} = this.props;
    return await dispatchEvent(
      eventName,
      createObject(data, {
        value: eventData
      })
    );
  }
  /**
   * 读取单个 sheet 的内容
   */
  readWorksheet(worksheet: any) {
    const result: any[] = [];
    const {parseMode, plainText, includeEmpty} = this.props;

    if (parseMode === 'array') {
      worksheet.eachRow((row: any, rowNumber: number) => {
        const values = row.values;
        values.shift(); // excel 返回的值是从 1 开始的，0 节点永远是 null
        result.push(values);
      });
      return result;
    } else {
      let firstRowValues: any[] = [];
      worksheet.eachRow((row: any, rowNumber: number) => {
        // 将第一列作为字段名
        if (rowNumber == 1) {
          firstRowValues = row.values;
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
                } else if (cell.type === ExcelValueType.Formula) {
                  value = cell.value.result;
                } else if (cell.type === ExcelValueType.RichText) {
                  value = cell.value.richText
                    .map((item: any) => item.text)
                    .join('');
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
      value,
      disabled,
      translate: __
    } = this.props;

    return (
      <div className={cx('ExcelControl', className)}>
        <Dropzone
          key="drop-zone"
          onDrop={this.handleDrop}
          accept=".xlsx"
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
                  <p>{__('Excel.placeholder')}</p>
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
