/**
 * @file 移动端城市选择器
 */
import React, {useEffect, useState, memo} from 'react';

import Picker from './Picker';
import ResultBox from './ResultBox';
import {useSetState, useUpdateEffect} from '../hooks';
import {localeable, LocaleProps} from 'amis-core';
import {themeable, ThemeProps} from 'amis-core';
import {uncontrollable} from 'uncontrollable';
import PopUp from './PopUp';
import {PickerObjectOption} from './PickerColumn';

export type AreaColumnOption = {
  text: string;
  value: number;
};

export interface AreaProps extends LocaleProps, ThemeProps {
  value: any;
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
   * 是否禁用
   */
  disabled?: boolean;
  useMobileUI?: boolean;
  onChange: (value: any) => void;
  /** 点击完成按钮时触发	 */
  onConfirm?: (result: AreaColumnOption[], index: number) => void;
  /** 点击取消按钮时触发	 */
  onCancel?: (...args: unknown[]) => void;

  popOverContainer?: any;
}
/**
 * 街道
 */
type district = {
  [propName: number]: {
    [propName: number]: Array<number>;
  };
};
interface DbState {
  province: number[];
  district: district;
  [key: number]: string;
  city: {
    [key: number]: number[];
  };
}
interface StateObj {
  columns: {options: Array<AreaColumnOption>}[];
}

const CityArea = memo<AreaProps>(props => {
  const {
    joinValues = true,
    extractValue = true,
    delimiter = ',',
    allowCity = true,
    allowDistrict = true,
    allowStreet = false,
    // 默认北京东城区
    value = 110101,
    classnames: cx,
    translate: __,
    disabled = false,
    popOverContainer,
    useMobileUI
  } = props;

  const [values, setValues] = useState<Array<number>>([]);
  const [street, setStreet] = useState('');
  const [confirmValues, setConfirmValues] =
    useState<Array<PickerObjectOption>>();
  const [db, updateDb] = useSetState<DbState>();
  const [state, updateState] = useSetState<StateObj>({
    columns: []
  });
  const [isOpened, setIsOpened] = useState(false);

  const onChange = (columnValues: Array<number>, columnIndex: number) => {
    // 清空后面的值
    while (columnValues[columnIndex++]) {
      columnValues[columnIndex++] = -1;
    }
    let [provience, city, district] = columnValues;
    if (city === -1) {
      city = db.city?.[provience]?.[0];
    }
    if (district === -1) {
      district = db.district?.[provience]?.[city]?.[0];
    }
    let tempValues = [provience, city, district];
    if (!allowDistrict) {
      tempValues.splice(2, 1);
    }
    if (!allowCity) {
      tempValues.splice(1, 1);
    }
    setValues(tempValues);
  };

  const propsChange = () => {
    const {onChange} = props;
    const [province, city, district] = values;
    const code =
      allowDistrict && district
        ? district
        : allowCity && city
        ? city
        : province;
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
        provinceCode: province,
        province: db[province],
        cityCode: city,
        city: db[city],
        districtCode: district,
        district: db[district],
        street
      });
    }
  };

  const onConfirm = () => {
    const confirmValues = values.map((item: number) => ({
      text: db[item],
      value: item
    }));
    setConfirmValues(confirmValues);
    propsChange();
    setIsOpened(false);
  };

  const onCancel = () => {
    setIsOpened(false);
    if (props.onCancel) props.onCancel();
  };

  const getPropsValue = () => {
    // 最后一项的值
    let code =
      (value && value.code) ||
      (typeof value === 'number' && value) ||
      (typeof value === 'string' && /(\d{6})/.test(value) && RegExp.$1);
    const values: Array<number> = [];
    if (code && db[code]) {
      code = parseInt(code, 10);
      let provinceCode = code - (code % 10000);
      let cityCode = code - (code % 100);
      if (db[provinceCode]) {
        values[0] = provinceCode;
      }
      if (db[cityCode] && allowCity) {
        values[1] = cityCode;
      } else if (~db.city[provinceCode]?.indexOf(code) && allowCity) {
        values[1] = code;
      }

      if (code % 100 && allowDistrict) {
        values[2] = code;
      }
      setValues(values);
    }
  };

  const updateColumns = () => {
    if (!db) {
      return;
    }
    let [provience, city, district] = values;
    const provienceColumn = db.province.map((code: number) => {
      return {text: db[code], value: code, disabled};
    });
    const cityColumn = city
      ? db.city[provience].map((code: number) => {
          return {text: db[code], value: code, disabled};
        })
      : [];
    const districtColumn =
      city && district
        ? db.district[provience][city].map((code: number) => {
            return {text: db[code], value: code, disabled};
          })
        : [];
    const columns = [
      {options: provienceColumn},
      {options: cityColumn},
      {options: districtColumn}
    ];
    if (!allowDistrict || !allowCity) {
      columns.splice(2, 1);
    }
    if (!allowCity) {
      columns.splice(1, 1);
    }
    updateState({columns});
  };

  const loadDb = () => {
    import('./CityDB').then(db => {
      updateDb({
        ...db.default,
        province: db.province as any,
        city: db.city,
        district: db.district as district
      });
    });
  };

  useEffect(() => {
    loadDb();
  }, []);

  useEffect(() => {
    isOpened && db && getPropsValue();
  }, [db, isOpened]);

  useEffect(() => {
    street && propsChange();
  }, [street]);

  useUpdateEffect(() => {
    values.length && updateColumns();
  }, [values]);

  const result = confirmValues
    ?.filter(item => item?.value)
    ?.map(item => item.text)
    .join(delimiter);

  return (
    <div className={cx(`CityArea`)}>
      <ResultBox
        className={cx('CityArea-Input', isOpened ? 'is-active' : '')}
        allowInput={false}
        result={result}
        onResultChange={() => {}}
        onResultClick={() => setIsOpened(!isOpened)}
        placeholder={__('Condition.cond_placeholder')}
        useMobileUI={useMobileUI}
      ></ResultBox>
      {allowStreet && values[0] ? (
        <input
          className={cx('CityArea-Input')}
          value={street}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setStreet(e.currentTarget.value)
          }
          placeholder={__('City.street')}
          disabled={disabled}
        />
      ) : null}
      <PopUp
        className={cx(`CityArea-popup`)}
        container={popOverContainer}
        isShow={isOpened}
        showConfirm
        onConfirm={onConfirm}
        onHide={onCancel}
      >
        <Picker
          className={'CityArea-picker'}
          columns={state.columns}
          onChange={onChange as any}
          showToolbar={false}
          labelField="text"
          itemHeight={40}
          value={values}
          classnames={props.classnames}
          classPrefix={props.classPrefix}
        />
      </PopUp>
    </div>
  );
});

export default themeable(
  localeable(
    uncontrollable(CityArea, {
      value: 'onChange'
    })
  )
);
