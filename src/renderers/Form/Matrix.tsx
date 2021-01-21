/**
 * @file filter
 * @author fex
 */

import React from 'react';
import cx from 'classnames';
import {FormBaseControl, FormControlProps, FormItem} from './Item';
import {buildApi, isValidApi, isEffectiveApi} from '../../utils/api';
import {Checkbox, Spinner} from '../../components';
import {autobind, setVariable} from '../../utils/helper';
import {ApiObject} from '../../types';
import {SchemaApi} from '../../Schema';

/**
 * Matrix 选择控件。适合做权限勾选。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/matrix
 */
export interface MatrixControlSchema extends FormBaseControl {
  type: 'matrix';

  /**
   * 配置singleSelectMode时设置为false
   */
  multiple?: boolean;

  /**
   * 设置单选模式，multiple为false时有效
   */
  singleSelectMode?: boolean;

  /**
   * 可用来通过 API 拉取 options。
   */
  source?: SchemaApi;

  columns?: Array<{
    label: string;
    [propName: string]: any;
  }>;

  rows?: Array<{
    label: string;
    [propName: string]: any;
  }>;

  /**
   * 行标题说明
   */
  rowLabel?: string;
}

export interface Column {
  label: string;
  [propName: string]: any;
}

export interface Row {
  label: string;
  [propName: string]: any;
}

export interface ValueItem extends Column, Row {
  checked: boolean;
}

export interface MatrixProps extends FormControlProps {
  columns: Array<Column>;
  rows: Array<Row>;
  multiple: boolean;
}

export interface MatrixState {
  columns: Array<Column>;
  rows: Array<Row>;
  loading: boolean;
  error?: string;
  singleSelectMode?: 'cell' | 'row' | 'column';
}

export default class MatrixCheckbox extends React.Component<
  MatrixProps,
  MatrixState
> {
  static defaultProps: Partial<MatrixProps> = {
    columns: [],
    rows: [],
    multiple: true,
    singleSelectMode: 'column' // multiple 为 false 时有效。
  };

  state: MatrixState;
  sourceInvalid: boolean = false;
  mounted: boolean = false;

  constructor(props: MatrixProps) {
    super(props);

    this.state = {
      columns: props.columns || [],
      rows: props.rows || [],
      loading: false
    };

    this.toggleItem = this.toggleItem.bind(this);
    this.reload = this.reload.bind(this);
    this.initOptions = this.initOptions.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const {formInited, addHook} = this.props;

    formInited ? this.reload() : addHook(this.initOptions, 'init');
  }

  componentWillReceiveProps(nextProps: MatrixProps) {
    const props = this.props;

    if (props.columns !== nextProps.columns || props.rows !== nextProps.rows) {
      this.setState({
        columns: nextProps.columns || [],
        rows: nextProps.rows || []
      });
    } else if (
      nextProps.formInited &&
      (nextProps.source !== props.source || props.data !== nextProps.data)
    ) {
      let prevApi = buildApi(props.source as string, props.data as object, {
        ignoreData: true
      });
      let nextApi = buildApi(
        nextProps.source as string,
        nextProps.data as object,
        {ignoreData: true}
      );

      if (prevApi.url !== nextApi.url && isValidApi(nextApi.url)) {
        this.sourceInvalid = true;
      }
    }
  }

  componentDidUpdate() {
    if (this.sourceInvalid) {
      this.sourceInvalid = false;

      this.reload();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    const {removeHook} = this.props;
    removeHook(this.initOptions, 'init');
  }

  async initOptions(data: any) {
    await this.reload();
    const {formItem, name} = this.props;
    if (!formItem) {
      return;
    }
    if (formItem.value) {
      setVariable(data, name!, formItem.value);
    }
  }

  async reload() {
    const {source, data, env, onChange, translate: __} = this.props;

    if (!isEffectiveApi(source, data) || this.state.loading) {
      return;
    }

    if (!env || !env.fetcher) {
      throw new Error('fetcher is required');
    }

    // todo 优化这块
    return await new Promise<void>((resolve, reject) => {
      if (!this.mounted) {
        return resolve();
      }

      this.setState(
        {
          loading: true
        },
        () => {
          if (!this.mounted) {
            return resolve();
          }
          env
            .fetcher(source, data)
            .then(ret => {
              if (!ret.ok) {
                throw new Error(ret.msg || __('fetchFailed'));
              }
              if (!this.mounted) {
                return resolve();
              }
              this.setState(
                {
                  loading: false,
                  rows: (ret.data as any).rows || [],
                  columns: (ret.data as any).columns || []
                },
                () => {
                  let replace = source && (source as ApiObject).replaceData;
                  let value = (ret.data as any).value;
                  if (value) {
                    value = (source as ApiObject).replaceData
                      ? value
                      : mergeValue(value, this.state.columns, this.state.rows);
                    onChange(value);
                  }
                  resolve();
                }
              );
            })
            .catch(reason =>
              this.setState(
                {
                  error: reason,
                  loading: false
                },
                () => resolve()
              )
            );
        }
      );
    });
  }

  toggleItem(checked: boolean, x: number, y: number) {
    const {columns, rows} = this.state;
    const {multiple, singleSelectMode} = this.props;

    const value = this.props.value || buildDefaultValue(columns, rows);

    if (multiple) {
      value[x][y] = {
        ...value[x][y],
        checked
      };
    } else if (singleSelectMode === 'row') {
      for (let x2 = 0, len = columns.length; x2 < len; x2++) {
        value[x2][y] = {
          ...value[x2][y],
          checked: x === x2 ? checked : !checked
        };
      }
    } else if (singleSelectMode === 'column') {
      for (let y2 = 0, len = rows.length; y2 < len; y2++) {
        value[x][y2] = {
          ...value[x][y2],
          checked: y === y2 ? checked : !checked
        };
      }
    } else {
      // 只剩下 cell 了
      for (let y2 = 0, len = rows.length; y2 < len; y2++) {
        for (let x2 = 0, len2 = columns.length; x2 < len2; x2++) {
          value[x2][y2] = {
            ...value[x2][y2],
            checked: x === x2 && y === y2 ? checked : !checked
          };
        }
      }
    }

    this.props.onChange(value.concat());
  }

  renderInput() {
    const {columns, rows} = this.state;
    const {rowLabel, className, classnames: cx, multiple} = this.props;

    const value = this.props.value || buildDefaultValue(columns, rows);

    return (
      <div className={cx('Table m-b-none')}>
        <div className={cx('Table-content')}>
          <table className={cx('Table-table')}>
            <thead>
              <tr>
                <th>{rowLabel}</th>
                {columns.map((column, x) => (
                  <th key={x} className="text-center">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, y) => (
                <tr key={y}>
                  <td>
                    {row.label}
                    {row.description || row.desc ? (
                      <span className="m-l-xs text-muted text-xs">
                        {row.description || row.desc}
                      </span>
                    ) : null}
                  </td>
                  {columns.map((column, x) => (
                    <td key={x} className="text-center">
                      <Checkbox
                        type={multiple ? 'checkbox' : 'radio'}
                        checked={
                          !!(value[x] && value[x][y] && value[x][y].checked)
                        }
                        onChange={(checked: boolean) =>
                          this.toggleItem(checked, x, y)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    const {className, render, classnames: cx} = this.props;

    const {error, loading} = this.state;

    return (
      <div key="input" className={cx('MatrixControl', className || '')}>
        {error ? (
          <div className={cx('MatrixControl-error Alert Alert--danger')}>
            {String(error)}
          </div>
        ) : (
          this.renderInput()
        )}

        <Spinner size="lg" overlay key="info" show={loading} />
      </div>
    );
  }
}

function buildDefaultValue(
  columns: Array<Column>,
  rows: Array<Row>
): Array<Array<ValueItem>> {
  if (!Array.isArray(columns)) {
    columns = [];
  }

  if (!Array.isArray(rows)) {
    rows = [];
  }

  return columns.map(column =>
    rows.map(row => ({
      ...row,
      ...column,
      checked: false
    }))
  );
}

function mergeValue(
  value: Array<Array<ValueItem>>,
  columns: Array<Column>,
  rows: Array<Row>
): Array<Array<ValueItem>> {
  return value.map((column, x) =>
    column.map((item, y) => ({
      ...columns[x],
      ...rows[y],
      ...item
    }))
  );
}

@FormItem({
  type: 'matrix',
  strictMode: false,
  sizeMutable: false
})
export class MatrixRenderer extends MatrixCheckbox {}
