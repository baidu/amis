import React from 'react';
import {FormItem, FormControlProps, FormBaseControl} from './Item';
import db, {province, city, district} from './CityDB';
import {ClassNamesFn, themeable, ThemeProps} from '../../theme';
import {Select} from '../../components';
import {autobind} from '../../utils/helper';
import {Option} from './Options';
import {localeable, LocaleProps} from '../../locale';

/**
 * City 城市选择框。
 * 文档：https://baidu.gitee.io/amis/docs/components/form/city
 */
export interface CityControlSchema extends FormBaseControl {
  /**
   * 指定为城市选择框。
   */
  type: 'city';

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
}

export interface CityPickerProps
  extends Omit<CityControlSchema, 'type'>,
    LocaleProps,
    ThemeProps {
  value: any;
  onChange: (value: any) => void;

  extractValue: boolean;
  delimiter: string;
  allowCity: boolean;
  allowDistrict: boolean;
  allowStreet: boolean;
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

  state = {
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
    this.syncIn();
  }

  componentDidUpdate(prevProps: CityPickerProps) {
    const props = this.props;

    if (props.value !== prevProps.value) {
      this.syncIn(props);
    }
  }

  @autobind
  handleProvinceChange(option: Option) {
    this.setState(
      {
        province: option.label as string,
        provinceCode: option.value as number,
        city: '',
        cityCode: 0,
        district: '',
        districtCode: 0,
        street: '',
        code: option.value
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
      {
        city: option.label as string,
        cityCode: option.value as number,
        district: '',
        districtCode: 0,
        street: '',
        code: option.value
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
      {
        ...(otherStates as any),
        district: option.label as string,
        districtCode: option.value as number,
        street: '',
        code: option.value as number
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
    const {value, delimiter} = props;

    const state = {
      code: 0,
      province: '',
      provinceCode: 0,
      city: '',
      cityCode: 0,
      district: '',
      districtCode: 0,
      street: ''
    };

    let code =
      (value && value.code) ||
      (typeof value === 'number' && value) ||
      (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);

    if (code && db[code]) {
      code = parseInt(code, 10);
      state.code = code;

      const provinceCode = code - (code % 10000);
      if (db[provinceCode]) {
        state.provinceCode = provinceCode;
        state.province = db[provinceCode];
      }

      const cityCode = code - (code % 100);
      if (db[cityCode]) {
        state.cityCode = cityCode;
        state.city = db[cityCode];
      }

      if (code % 100) {
        state.district = db[code];
        state.districtCode = code;
      }
    } else if (value) {
      // todo 模糊查找
    }

    if (value && value.street) {
      state.street = value.street;
    } else if (typeof value === 'string' && ~value.indexOf(delimiter)) {
      state.street = value.slice(value.indexOf(delimiter) + delimiter.length);
    }

    this.setState(state);
  }

  @autobind
  syncOut() {
    const {
      onChange,
      allowStreet,
      joinValues,
      extractValue,
      delimiter
    } = this.props;

    const {code, province, city, district, street} = this.state;

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
        province,
        city,
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
      translate: __
    } = this.props;

    const {provinceCode, cityCode, districtCode, street} = this.state;

    return (
      <div className={cx('CityPicker', className)}>
        <Select
          disabled={disabled}
          options={province.map(item => ({
            label: db[item],
            value: item
          }))}
          value={provinceCode}
          onChange={this.handleProvinceChange}
        />

        {provinceCode &&
        allowDistrict &&
        Array.isArray(district[provinceCode]) ? (
          <Select
            disabled={disabled}
            options={(district[provinceCode] as Array<number>).map(item => ({
              label: db[item],
              value: item
            }))}
            value={districtCode}
            onChange={this.handleDistrictChange}
          />
        ) : allowCity && city[provinceCode] && city[provinceCode].length ? (
          <Select
            disabled={disabled}
            options={city[provinceCode].map(item => ({
              label: db[item],
              value: item
            }))}
            value={cityCode}
            onChange={this.handleCityChange}
          />
        ) : null}

        {cityCode &&
        allowDistrict &&
        district[provinceCode] &&
        district[provinceCode][cityCode] ? (
          <Select
            disabled={disabled}
            options={(district[provinceCode][cityCode] as Array<number>).map(
              item => ({
                label: db[item],
                value: item
              })
            )}
            value={districtCode}
            onChange={this.handleDistrictChange}
          />
        ) : null}

        {allowStreet && provinceCode ? (
          <input
            className={cx('CityPicker-input')}
            value={street}
            onChange={this.handleStreetChange}
            onBlur={this.handleStreetEnd}
            placeholder={__('请输入街道信息')}
          />
        ) : null}
      </div>
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
  render() {
    const {
      value,
      onChange,
      allowCity,
      allowDistrict,
      extractValue,
      joinValues,
      allowStreet
    } = this.props;
    return (
      <ThemedCity
        value={value}
        onChange={onChange}
        allowCity={allowCity}
        allowDistrict={allowDistrict}
        extractValue={extractValue}
        joinValues={joinValues}
        allowStreet={allowStreet}
      />
    );
  }
}

@FormItem({
  type: 'city',
  sizeMutable: false
})
export class CheckboxControlRenderer extends LocationControl {}
