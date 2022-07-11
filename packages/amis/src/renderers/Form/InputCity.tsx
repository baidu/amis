import React from 'react';
import {
  FormItem,
  FormControlProps,
  FormBaseControl,
  RendererProps
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
import split from 'lodash/split';

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
   * 允许输入街道，多选时字段失效
   */
  allowStreet?: boolean;

  /**
   * 是否显示搜索框
   */
  searchable?: boolean;

  /**
   * 是否多选
   */
  multiple?: boolean;
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
  useMobileUI?: boolean;
  render: RendererProps['render'];
}

interface CityValue {
  code: number;
  province: string;
  provinceCode: number;
  city: string;
  cityCode: number;
  district: string;
  districtCode: number;
  street?: string;
}

export interface CityPickerState {
  value: CityValue | CityValue[];
  street?: string;

  db?: {
    options: Option[];
    [propName: string]: any;
  };
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
    value: {
      code: 0,
      province: '',
      provinceCode: 0,
      city: '',
      cityCode: 0,
      district: '',
      districtCode: 0
    }
  };

  componentDidMount() {
    this.loadDb(() => this.syncIn());
  }

  componentDidUpdate(prevProps: CityPickerProps) {
    const props = this.props;
    if (props.value !== prevProps.value) {
      this.loadDb(() => this.syncIn(props));
    }
    const {db} = this.state;
    if (
      db &&
      (props.allowCity !== prevProps.allowCity ||
        props.allowDistrict !== prevProps.allowDistrict)
    ) {
      this.setState({
        db: {
          ...db,
          options: this.filterOptions(db.options)
        }
      });
    }
  }

  loadDb(callback?: () => void) {
    if (this.state.db) {
      callback?.();
      return;
    }

    import('amis-ui/lib/components/CityDB').then(db => {
      const options = this.filterOptions(db.options);
      this.setState(
        {
          db: {
            ...db.default,
            options
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

  filterOptions(options: Option[]) {
    const {allowCity, allowDistrict} = this.props;
    if (!allowCity) {
      return options.map(opt => ({...opt, children: undefined}));
    } else if (!allowDistrict) {
      return options.map(opt => ({
        ...opt,
        children: opt.children?.map(item => ({
          ...item,
          children: undefined
        }))
      }));
    }
    return options;
  }

  @autobind
  syncIn(props = this.props) {
    const db = this.state.db;

    if (!db) {
      return;
    }

    const {value: inputValue, multiple, extractValue, delimiter} = props;

    let inputValues: CityValue[] | string[] = extractValue
      ? split(inputValue, delimiter)
      : Array.isArray(inputValue)
      ? inputValue
      : [inputValue];
    let inputStreet = '';

    if (!multiple) {
      inputStreet =
        typeof inputValues[1] === 'string'
          ? inputValues[1]
          : inputValues[1]?.street || '';
      inputValues = inputValues.slice(0, 1);
    }

    const values = inputValues.map(value => {
      const state = {
        code: 0,
        province: '',
        provinceCode: 0,
        city: '',
        cityCode: 0,
        district: '',
        districtCode: 0
      };

      let code =
        (value && (value as CityValue)?.code) ||
        (typeof value === 'number' && value) ||
        (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);

      if (code && db[code]) {
        code = parseInt(code as string, 10);
        state.code = code;

        const provinceCode = code - (code % 10000);
        if (db[provinceCode]) {
          state.provinceCode = provinceCode;
          state.province = db[provinceCode];
        }

        const cityCode = code - (code % 100);
        if (cityCode !== provinceCode && db[cityCode]) {
          state.cityCode = cityCode;
          state.city = db[cityCode];
        }
        // else if (~db.city[provinceCode]?.indexOf(code)) {
        //   state.cityCode = code;
        //   state.city = db[code];
        // }

        if (code % 100) {
          state.district = db[code];
          state.districtCode = code;
        }
      } else if (value) {
        // todo 模糊查找
      }
      return state;
    });
    const stateValues = multiple ? values : values[0];
    this.setState({value: stateValues, street: inputStreet});
  }

  /**
   * 触发 onChange 逻辑
   */
  @autobind
  syncOut() {
    const {
      onChange,
      joinValues,
      extractValue,
      delimiter,
      allowStreet,
      multiple
    } = this.props;
    const {value, street} = this.state;
    const values = Array.isArray(value) ? value : [value];
    if (extractValue ?? joinValues) {
      const cityCodes = values.map(({code}) => String(code || ''));
      if (allowStreet && street && !multiple) {
        cityCodes.push(street);
      }
      onChange(cityCodes.join(delimiter));
    } else {
      // 数组：  返回 code 存在的
      // 非数组：allowStreet == true street 拼接到 value 中返回
      //        alowStreet == false 返回 value
      onChange(
        Array.isArray(value)
          ? value.filter(item => item.code)
          : allowStreet
          ? {...value, street}
          : value
      );
    }
  }

  translateCodeToAreaDetails(code: number) {
    const provinceCode = code - (code % 10000);
    const cityCode = code - (code % 100);
    const districtCode = code % 100 === 0 ? 0 : code;

    return [
      provinceCode,
      cityCode === provinceCode ? 0 : cityCode,
      districtCode
    ];
  }

  @autobind
  onSelectChange(inputValue: string | number = '') {
    const {multiple, delimiter} = this.props;
    const values = split(String(inputValue), delimiter);

    const valueState = values.map(value => {
      const code = parseInt(value, 10);
      const db = this.state.db!;
      const [provinceCode, cityCode, districtCode] =
        this.translateCodeToAreaDetails(code);

      return {
        province: db[provinceCode] || '',
        provinceCode: provinceCode || 0,
        city: db[cityCode] || '',
        cityCode: cityCode || 0,
        district: db[districtCode] || '',
        districtCode: districtCode || 0,
        code: code || 0
      };
    });

    this.setState(
      {
        value: multiple ? valueState : valueState[0]
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

  render() {
    const {
      classnames: cx,
      className,
      delimiter,
      disabled,
      multiple,
      render,
      searchable,
      allowStreet,
      allowCity,
      placeholder,
      translate: __
    } = this.props;

    const {value, db, street} = this.state;

    const values = Array.isArray(value) ? value : [value];

    return db ? (
      <>
        <div className={cx('CityPicker', className)}>
          {render(
            'input-city',
            {
              type: 'nested-select',
              name: 'nestedSelect',
              options: db.options
            },
            {
              onChange: this.onSelectChange,
              extractValue: false,
              withChildren: false,
              // code = 0 的不传
              value: values.map(item => item.code || '').join(delimiter),
              searchable,
              multiple,
              delimiter,
              disabled,
              clearable: true,
              onlyLeaf: !multiple,
              onlyChildren: true,
              placeholder,
              checkAll: false
            }
          )}
        </div>

        {allowStreet && !multiple ? (
          <input
            className={cx('CityPicker-input')}
            value={street || ''}
            onChange={this.handleStreetChange}
            onBlur={this.handleStreetEnd}
            placeholder={__('City.street')}
            disabled={disabled}
          />
        ) : null}
      </>
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
}
export class LocationControl extends React.Component<LocationControlProps> {
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
    const {dispatchEvent, data, onChange} = this.props;

    const rendererEvent = await dispatchEvent(
      'change',
      createObject(data, {
        value
      })
    );

    if (rendererEvent?.prevented) {
      return;
    }

    onChange(value);
  }

  render() {
    const {
      value,
      allowCity,
      allowDistrict,
      extractValue,
      joinValues,
      disabled,
      searchable,
      env,
      useMobileUI,
      render
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
        disabled={disabled}
        useMobileUI={useMobileUI}
      />
    ) : (
      <ThemedCity
        {...this.props}
        render={render}
        searchable={searchable}
        value={value}
        onChange={this.handleChange}
        allowCity={allowCity}
        allowDistrict={allowDistrict}
        extractValue={extractValue}
        joinValues={joinValues}
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
