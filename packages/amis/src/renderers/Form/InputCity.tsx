import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  resolveEventData
} from 'amis-core';
import {ClassNamesFn, themeable, ThemeProps} from 'amis-core';
import {Spinner} from 'amis-ui';
import {Select} from 'amis-ui';
import {CityArea} from 'amis-ui';
import {autobind, isMobile, createObject} from 'amis-core';
import {ActionObject} from 'amis-core';
import {Option} from 'amis-core';
import {localeable, LocaleProps} from 'amis-core';
import {FormBaseControlSchema} from '../../Schema';
import {supportStatic} from './StaticHoc';

/**
 * City 城市选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/city
 */
export interface InputCityControlSchema extends FormBaseControlSchema {
  /**
   * 指定为城市选择框。
   */
  type: 'input-city';

  /**
   * 开启后只会存城市的 code 信息
   */
  extractValue?: boolean;

  /**
   * 是否将各个信息拼接成字符串。
   */
  joinValues?: boolean;

  /**
   * 拼接的符号是啥？
   */
  delimiter?: string;

  /**
   * 允许选择城市？
   */
  allowCity?: boolean;

  /**
   * 允许选择地区？
   */
  allowDistrict?: boolean;

  /**
   * 允许选择街道？
   */
  allowStreet?: boolean;

  /**
   * 是否显示搜索框
   */
  searchable?: boolean;
}

export interface CityPickerProps
  extends Omit<InputCityControlSchema, 'type' | 'className'>,
    LocaleProps,
    ThemeProps {
  value: any;
  onChange: (value: any) => void;

  extractValue: boolean;
  delimiter: string;
  allowCity: boolean;
  allowDistrict: boolean;
  allowStreet: boolean;
  useMobileUI?: boolean;
}

export interface CityDb {
  province: Array<string>;
  city: {
    [propName: number]: Array<number>;
  };
  district: {
    [propName: number]:
      | {
          [propName: number]: Array<number>;
        }
      | Array<number>;
  };
  [propName: string]: any;
}

export interface CityPickerState {
  code: number;
  province: string;
  provinceCode: number;
  city: string;
  cityCode: number;
  district: string;
  districtCode: number;
  street: string;
  db?: CityDb;
}

const getCityFromCode = ({
  value,
  db,
  delimiter = ','
}:{
  value: any;
  db?: CityDb;
  delimiter?: string;
}) => {
  const result = {
    code: 0,
    province: '',
    provinceCode: 0,
    city: '',
    cityCode: 0,
    district: '',
    districtCode: 0,
    street: ''
  };

  if (!db || !value) {
    return result;
  }

  let code =
    (value && value.code) ||
    (typeof value === 'number' && value) ||
    (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);

  if (code && db[code]) {
    code = parseInt(code, 10);
    result.code = code;

    const provinceCode = code - (code % 10000);
    if (db[provinceCode]) {
      result.provinceCode = provinceCode;
      result.province = db[provinceCode];
    }

    const cityCode = code - (code % 100);
    if (cityCode !== provinceCode && db[cityCode]) {
      result.cityCode = cityCode;
      result.city = db[cityCode];
    } else if (~db.city[provinceCode]?.indexOf(code)) {
      result.cityCode = code;
      result.city = db[code];
    }

    if (code % 100) {
      result.district = db[code];
      result.districtCode = code;
    }
  } else if (value) {
    // todo 模糊查找
  }

  if (value && value.street) {
    result.street = value.street;
  } else if (typeof value === 'string' && ~value.indexOf(delimiter)) {
    result.street = value.slice(value.indexOf(delimiter) + delimiter.length);
  }

  return result;
}

const loadDb = (callback: (db: any) => void): void => {
  import('amis-ui/lib/components/CityDB').then(callback);
}

export class CityPicker extends React.Component<
  CityPickerProps,
  CityPickerState
> {
  static defaultProps = {
    joinValues: true,
    extractValue: true,
    delimiter: ',',
    allowCity: true,
    allowDistrict: true,
    allowStreet: false
  };

  state: CityPickerState = {
    code: 0,
    province: '',
    provinceCode: 0,
    city: '',
    cityCode: 0,
    district: '',
    districtCode: 0,
    street: ''
  };

  componentDidMount() {
    this.loadDb(() => this.syncIn());
  }

  componentDidUpdate(prevProps: CityPickerProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.loadDb(() => this.syncIn(props));
    }
  }

  loadDb(callback?: () => void) {
    if (this.state.db) {
      callback?.();
      return;
    }

    loadDb(db => {
      this.setState(
        {
          db: {
            ...db.default,
            province: db.province as any,
            city: db.city,
            district: db.district
          }
        },
        callback
      );
    });

    // require.ensure(['./CityDB'], (db: any) =>
    //   this.setState(
    //     {
    //       db: {
    //         ...db.default,
    //         province: db.province,
    //         city: db.city,
    //         district: db.district
    //       }
    //     },
    //     callback
    //   )
    // );
  }

  @autobind
  handleProvinceChange(option: Option) {
    this.setState(
      option
        ? {
            province: option.label as string,
            provinceCode: option.value as number,
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: '',
            code: option ? option.value : 0
          }
        : {
            code: 0,
            province: '',
            provinceCode: 0,
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: ''
          },
      this.syncOut
    );
  }

  @autobind
  handleCityChange(option: Option) {
    if (option.value % 100) {
      return this.handleDistrictChange(option, {
        cityCode: option.value as number
      });
    }

    this.setState(
      option
        ? {
            city: option.label as string,
            cityCode: option.value as number,
            district: '',
            districtCode: 0,
            street: '',
            code: option.value
          }
        : {
            city: '',
            cityCode: 0,
            district: '',
            districtCode: 0,
            street: '',
            code: this.state.provinceCode
          },
      this.syncOut
    );
  }

  @autobind
  handleDistrictChange(
    option: Option,
    otherStates: Partial<CityPickerState> = {}
  ) {
    this.setState(
      option
        ? {
            ...(otherStates as any),
            district: option.label as string,
            districtCode: option.value as number,
            street: '',
            code: option.value as number
          }
        : {
            ...(otherStates as any),
            district: '',
            districtCode: 0,
            street: '',
            code: this.state.cityCode
          },
      this.syncOut
    );
  }

  @autobind
  handleStreetChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      street: e.currentTarget.value
    });
  }

  @autobind
  handleStreetEnd() {
    this.syncOut();
  }

  @autobind
  syncIn(props = this.props) {
    const db = this.state.db!;
    const {value, delimiter} = props;

    if (!db) {
      return;
    }

    this.setState(getCityFromCode({
      value,
      delimiter,
      db
    }));
  }

  @autobind
  syncOut() {
    const {onChange, allowStreet, joinValues, extractValue, delimiter} =
      this.props;

    const {
      code,
      province,
      city,
      district,
      street,
      provinceCode,
      cityCode,
      districtCode
    } = this.state;

    if (typeof extractValue === 'undefined' ? joinValues : extractValue) {
      code
        ? onChange(
            allowStreet && street
              ? [code, street].join(delimiter)
              : String(code)
          )
        : onChange('');
    } else {
      onChange({
        code,
        provinceCode,
        province,
        cityCode,
        city,
        districtCode,
        district,
        street
      });
    }
  }

  render() {
    const {
      classnames: cx,
      className,
      disabled,
      allowCity,
      allowDistrict,
      allowStreet,
      searchable,
      translate: __
    } = this.props;

    const {provinceCode, cityCode, districtCode, street, db} = this.state;

    return db ? (
      <div className={cx('CityPicker', className)}>
        <Select
          searchable={searchable}
          disabled={disabled}
          options={db.province.map(item => ({
            label: db[item],
            value: item
          }))}
          value={provinceCode || ''}
          onChange={this.handleProvinceChange}
        />

        {allowCity && db.city[provinceCode] && db.city[provinceCode].length ? (
          <Select
            searchable={searchable}
            disabled={disabled}
            options={db.city[provinceCode].map(item => ({
              label: db[item],
              value: item
            }))}
            value={cityCode || ''}
            onChange={this.handleCityChange}
          />
        ) : null}

        {cityCode &&
        allowDistrict &&
        (db.district[provinceCode]?.[cityCode] as any)?.length ? (
          <Select
            searchable={searchable}
            disabled={disabled}
            options={(db.district[provinceCode][cityCode] as Array<number>).map(
              item => ({
                label: db[item],
                value: item
              })
            )}
            value={districtCode || ''}
            onChange={this.handleDistrictChange}
          />
        ) : null}

        {allowStreet && provinceCode ? (
          <input
            className={cx('CityPicker-input')}
            value={street || ''}
            onChange={this.handleStreetChange}
            onBlur={this.handleStreetEnd}
            placeholder={__('City.street')}
            disabled={disabled}
          />
        ) : null}
      </div>
    ) : (
      <Spinner show size="sm" />
    );
  }
}

const ThemedCity = themeable(localeable(CityPicker));
export default ThemedCity;

export interface LocationControlProps extends FormControlProps {
  allowCity?: boolean;
  allowDistrict?: boolean;
  extractValue?: boolean;
  joinValues?: boolean;
  allowStreet?: boolean;
}
export class LocationControl extends React.Component<LocationControlProps> {
  state = {
    db: null
  }

  @autobind
  doAction(action: ActionObject, data: object, throwErrors: boolean) {
    const {resetValue, onChange} = this.props;
    const actionType = action?.actionType as string;

    if (actionType === 'clear') {
      onChange('');
    } else if (actionType === 'reset') {
      onChange(resetValue ?? '');
    }
  }

  @autobind
  async handleChange(value: number | string) {
    const {dispatchEvent, onChange} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      resolveEventData(this.props, {value}, 'value')
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange(value);
  }

  renderStatic(displayValue = '') {
    const {value, delimiter} = this.props;
    if (!this.state.db) {
      loadDb(db => {
        this.setState(
          {
            db: {
              ...db.default,
              province: db.province as any,
              city: db.city,
              district: db.district
            }
          }
        );
      });
      return <Spinner size='sm' />;
    }

    if (!value) {
      return <>{displayValue}</>;
    }

    const {
      province,
      city,
      district,
      street
    } = getCityFromCode({
      value,
      delimiter,
      db: this.state.db
    });

    return (
      <>
        {
          [province, city, district, street]
            .filter(v => !!v)
            .join(delimiter)
        }
      </>
    );
  }

  @supportStatic()
  render() {
    const {
      value,
      allowCity,
      allowDistrict,
      extractValue,
      joinValues,
      allowStreet,
      disabled,
      searchable,
      env,
      useMobileUI
    } = this.props;
    const mobileUI = useMobileUI && isMobile();
    return mobileUI ? (
      <CityArea
        value={value}
        popOverContainer={
          env && env.getModalContainer ? env.getModalContainer : undefined
        }
        onChange={this.handleChange}
        allowCity={allowCity}
        allowDistrict={allowDistrict}
        extractValue={extractValue}
        joinValues={joinValues}
        allowStreet={allowStreet}
        disabled={disabled}
        useMobileUI={useMobileUI}
      />
    ) : (
      <ThemedCity
        searchable={searchable}
        value={value}
        onChange={this.handleChange}
        allowCity={allowCity}
        allowDistrict={allowDistrict}
        extractValue={extractValue}
        joinValues={joinValues}
        allowStreet={allowStreet}
        disabled={disabled}
      />
    );
  }
}

@FormItem({
  type: 'input-city',
  sizeMutable: false
})
export class CheckboxControlRenderer extends LocationControl {}
