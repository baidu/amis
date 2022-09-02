import React, {Fragment} from "react";
import moment from "moment";
import {SchemaClassName, SchemaNode, Option} from "../types";
import {createObject, generateIcon, getPropValue, isMobile, isObject} from "../utils";
import {FormControlProps} from "./Item";

export interface StaticControlProps extends Omit<FormControlProps, 'onOpenDialog'> {
  /**
   * 表单状态：true 展示态，false 编辑态
   */
  static?: boolean;

  /**
   * 展示态时的占位，支持 HTML
   */
  staticPlaceholder?: any;

  /**
   * 展示态FormItem的 className
   */
  staticClassName?: SchemaClassName;

  /**
   * 展示态FormLabel的 className
   */
  staticLableClassName?: SchemaClassName;

  /**
   * 展示态FormValue的 className
   */
  staticControlClassName?: SchemaClassName;

  /**
   * 配置自定义展示态schema
   */
  staticSchema?: SchemaNode;
}

type StaticCompMapItem = [string , ((props: StaticControlProps) => JSX.Element)][];

const textTypes = [
  'input-text',
  'input-password',
  'input-email',
  'input-url',
  'native-date',
  'native-time',
  'native-number',
  'input-number',
];

const selectTypes = [
  'input-tag',
  'checkboxes',
  'radios',
  'select',
  'nested-select',
  'tree-select',
  'button-group-select',
  'input-tree',
  'tree'
];

const dateTypes = [
  'input-date',
  'input-datetime',
  'input-time',
  'input-year',
  'input-month',
  'input-quarter'
];

const dateRangeTypes = [
  'input-date-range',
  'input-datetime-range',
  'input-time-range',
  'input-year-range',
  'input-month-range',
  'input-quarter-range',
];

const renderControlTypes = [
  'input-rating',
  'checkbox',
  'matrix-checkboxes',
  'combo',
  'input-array'
];

const kvTypes = [
  'input-kv',
  'input-kvs'
];

const supportStaticTypes = new Set([
  ...textTypes,
  ...dateTypes,
  ...dateRangeTypes,
  ...renderControlTypes,
  ...kvTypes,
  ...selectTypes,
  'input-color',
  'input-range',
  'switch',
  'textarea',
  'transfer',
  'list-select',
]);

export const isSupportStatic = (type: string) => supportStaticTypes.has(type);

// 各类型表单项的展示态处理
const staticCompMap = new Map([
  // 日期类型
  ...dateTypes.map(type => [type, (props) => {
    const {render, inputFormat, format, value} = props;
    return render(
      'static-input-date',
      {
        type: 'date',
        value,
        format: inputFormat,
        valueFormat: format
      }
    ) 
  }]) as StaticCompMapItem,

  // 日期范围类型
  ...dateRangeTypes.map(type => [type, (props) => {
    let {
      delimiter = ',',
      value,
      format,
      inputFormat
    } = props;
  
    if (typeof value === 'string') {
      value = value.split(delimiter);
    }
  
    let _startTime, _endTime;
    if (format) {
      _startTime = moment(value?.[0], format);
      _endTime = moment(value?.[1], format);
    }
    else {
      _startTime = moment(value?.[0] * 1000);
      _endTime = moment(value?.[1] * 1000);
    }
    
    const startTime = value[0] && _startTime.isValid() ? _startTime.format(inputFormat) : '';
    const endTime = value[1] && _endTime.isValid() ? _endTime.format(inputFormat) : '';
    return <>{[startTime, endTime].join(' ~ ')}</>;
  }]) as StaticCompMapItem,

  // 使用原 control 的 disabled 态展示
  ...renderControlTypes.map(type => [type, (props) => {
    const {Control} = props;
    return <Control
      {...props}
      disabled={true}
    />;
  }]) as StaticCompMapItem,

  // 将值展示为 json
  ...kvTypes.map(type => [type, (props) => {
    const {render, inputFormat, format, value} = props;
    return render(
      'static-input-kv',
      {
        type: 'json'
      },
      props
    ) 
  }]) as StaticCompMapItem,

  // type: list-select
  ['list-select', (props) => {
    const {
      value,
      formItem: {
        getSelectedOptions
      },
      staticPlaceholder,
      itemSchema,
      labelField,
      valueField,
      imageClassName,
      itemClassName,
      classnames: cx,
      render,
      data
    } = props;
  
    let selectedOptions = [];
    if (getSelectedOptions) {
      selectedOptions = getSelectedOptions(value);
    }
  
    if (!selectedOptions.length) {
      return staticPlaceholder;
    }

    return selectedOptions.map((option: Option, key: number) => {
      const label = option[labelField || 'label'];
      const value = option[valueField || 'value'];
      if (itemSchema || option.body || option.image) {
        return <div
          key={key}
          className={cx(`ListControl-item`, itemClassName, `is-disabled`)}
        >
          {itemSchema
            ? render(`${key}/body`, itemSchema, {
              data: createObject(data, option)
            })
            : option.body
              ? render(`${key}/body`, option.body)
              : [
                  option.image ? (
                    <div
                      key="image"
                      className={cx('ListControl-itemImage', imageClassName)}
                    >
                      <img
                        src={option.image}
                        alt={label}
                      />
                    </div>
                  ) : null,
                  <div
                    key="label"
                    className={cx('ListControl-itemLabel')}
                  >
                    {label || value}
                  </div>
                ]
          }
        </div>
      }
      else {
        return <div
          key={key}
          className={cx(`ListControl-static-item`)}
        >
          {label || value}
        </div>
      }
    });
  }],

  // type: input-color
  ['input-color', (props) => props.render('static-color', {type: 'color'}, props)],

  // type: input-tag
  ['input-tag', (props) => {
    const {
      displayValue,
      render,
      staticPlaceholder
    } = props;
    if (staticPlaceholder === displayValue) {
      return staticPlaceholder;
    }
    return <>
      {
        displayValue.split(',').map((label: string, index: number) => render(
          'static-input-tag',
          {
            type: 'tag',
            label
          },
          {
            key: index
          }
        ))
      }
    </>;
  }],

  // type: switch
  ['switch', (props) => {
    const {
      value,
      trueValue,
      onText = '开',
      offText = '关',
      classnames: cx
    } = props;
    const on = () => isObject(onText)
      ? generateIcon(cx, onText.icon, 'Switch-icon')
      : onText;
    const off = () => isObject(offText)
      ? generateIcon(cx, offText.icon, 'Switch-icon')
      : offText;
    return <>{value === trueValue ? on() : off()}</>;
  }],

  // type: textarea
  ['textarea', (props) => {
    return props.value.split('\n').map((text: string, index: number) => {
      return <Fragment key={index}>
        {index > 0 && <br />}
        {text}
      </Fragment>
    });
  }]
]);

export default class StaticControl extends React.PureComponent<
  StaticControlProps
> {
  static defaultProps = {
    staticPlaceholder: '-' 
  };

  getLabelOfSelectedValue() {
    const {
      value,
      formItem: {
        getSelectedOptions
      },
      labelField,
      valueField,
      staticPlaceholder,
    } = this.props;

    let selectedOptions = [];
    if (getSelectedOptions) {
      selectedOptions = getSelectedOptions(value);
    }

    if (selectedOptions && selectedOptions?.length > 0) {
      return selectedOptions
        .map((option: Option) => {
          const label = option[labelField || 'label'];
          const value = option[valueField || 'value'];
          return label || value
        })
        .join(', ')
    }

    return staticPlaceholder;
  }

  getDisplayValue() {
    const {
      type,
      staticPlaceholder = '',
      value,
      name,
      data,
      defaultValue,
    } = this.props;

    if (type === 'input-password') {
      return '********';
    }

    if (selectTypes.includes(type)) {
      return this.getLabelOfSelectedValue();
    }

    return getPropValue({
      value,
      name,
      data,
      defaultValue
    }) || staticPlaceholder;
  }

  renderBody() {
    const {
      type,
      staticSchema,
      render,
    } = this.props;
    const displayValue = this.getDisplayValue();

    // 外部传入自定义展示态schema
    if (staticSchema) {
      return render('form-static-schema', staticSchema, this.props);
    }

    // 默认展示态
    const PresetStaticControl = staticCompMap.get(type);
    if (PresetStaticControl) {
      return PresetStaticControl({
        ...this.props,
        displayValue
      })
    }

    // 其他情况直接展示 value
    return displayValue;
  }

  render() {
    const {
      inputClassName,
      formItem: model,
      classnames: cx,
      children,
      type,
      size,
      defaultSize,
      useMobileUI,
      static: isStatic,
      staticClassName,
      value,
      ...rest
    } = this.props;

    const mobileUI = useMobileUI && isMobile();
    const noPaddingYTypes = [
      'checkbox',
      'combo',
      'input-array',
    ];

    return (
      <div
        className={cx(
          'Form-static',
          {
            'is-noPaddingY-static': noPaddingYTypes.includes(type),
            'is-inline': !!rest.inline && !mobileUI,
            'is-error': model && !model.valid
          },
          model?.errClassNames,
          inputClassName
        )}
      >{this.renderBody()}</div>
    );
  }
}
