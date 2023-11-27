/**
 * @file Shadow.tsx
 * @description 设置阴影
 */

import React from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';
import {FormItem, PlainObject, render} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import type {ShadowData} from '../helper/declares';
import {NumberInput, Overlay, PopOver, Select} from 'amis-ui';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import {ThemeWrapperHeader} from './ThemeWrapper';
import ColorPicker from './ColorPicker';
import {Icon as ThemeIcon} from '../icons/index';
import {getValueByPath, getInheritValue, setInheritData} from '../util';

interface ShadowEditorProps extends FormControlProps {}

interface ShadowViewProps {
  show: boolean;
  target: any;
  name: string;
  value: string[];
  close: () => void;
}

interface ShadowOption {
  label?: string;
  value?: string;
  realValue: ShadowData[];
}

function ShadowView(props: ShadowViewProps) {
  const {show, target, name, value, close} = props;

  return (
    <Overlay
      // @ts-ignore
      container={document.body}
      target={target.current}
      show={show}
      placement="top"
      offset={[0, -8]}
    >
      <PopOver overlay={false} onHide={close}>
        <div className="Theme-ShadowView">
          <div className="Theme-ShadowView-header">阴影预览</div>
          <div className="Theme-ShadowView-body">
            <div className="Theme-ShadowView-body-shadow">
              <div
                className="Theme-ShadowView-body-shadow-square"
                style={{boxShadow: value?.join(', ') || 'none'}}
              ></div>
            </div>
            <div className="Theme-ShadowView-body-title">{name}</div>
            <div className="Theme-ShadowView-body-value">
              {value?.map((shadow: string, index: number) => (
                <div className="Theme-ShadowView-body-value-item" key={index}>
                  {shadow}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopOver>
    </Overlay>
  );
}

function ShadowEditor(props: ShadowEditorProps) {
  const {
    data,
    onChange,
    value,
    hasSenior,
    options,
    colorOptions,
    state,
    itemName,
    editorThemePath
  } = props;
  const target = React.useRef<HTMLDivElement>(null);
  const [open, toggleOpen] = React.useState(true);
  const [senior, toggleSenior] = React.useState(false);
  const [show, toggleViewShow] = React.useState(false);

  const customShadow = {
    label: '自定义',
    value: 'custom',
    realValue: [
      {
        inset: false,
        x: '0px',
        y: '0px',
        blur: '0px',
        spread: '0px',
        color: 'transparent'
      }
    ],
    visible: false
  };
  const shadowOptions = options
    ? [...options, customShadow]
    : [...cloneDeep(data.shadowOptions || []), customShadow];

  if (state && state !== 'default') {
    shadowOptions.unshift({
      value: editorThemePath ? 'inherit' : `var(${data.default.token}shadow)`,
      label: '继承常规',
      realValue: editorThemePath
        ? ['继承常规']
        : [`var(${data.default.token}${itemName})`]
    });
  }
  const editorDefaultValue = getValueByPath(editorThemePath, data);
  const editorInheritValue = getInheritValue(editorThemePath, data);
  const defaultValue = value
    ? (value.indexOf('inherit:') > -1 && 'inherit') ||
      find(cloneDeep(shadowOptions), item => item.value === value) ||
      formateCustomValue(value)
    : null;

  const [shadowData, setShadowData] = React.useState<ShadowOption | undefined>(
    defaultValue
  );

  React.useEffect(() => {
    if (
      defaultValue &&
      (!shadowData || defaultValue.value !== shadowData.value)
    ) {
      setShadowData(defaultValue);
    }
  }, [defaultValue]);

  function formateCustomValue(value: string) {
    const color: PlainObject = {};
    let colorIndex = 0;
    value = value.trim().replace(/((rgba|rgb|var)\(.*?\))|(#.{6})/g, $1 => {
      const key = '$' + colorIndex;
      colorIndex++;
      color[key] = $1;
      return key;
    });
    const realValue = value.split(',').map((item: string) => {
      let inset = false;
      if (item.includes('inset')) {
        inset = true;
        item = item.replace('inset', '');
      }
      item = item.trim();
      const css = item.split(' ');
      return {
        inset,
        x: css[0],
        y: css[1],
        blur: css[2],
        spread: css[3],
        color: color[css[4]]
      };
    });
    return {
      label: '自定义',
      value: 'custom',
      realValue
    };
  }

  function formatRealValue(value?: ShadowData[]) {
    if (!value) {
      return {value: '', source: []};
    }
    const res = value.map((shadow: ShadowData) => {
      return `${shadow.inset ? 'inset' : ''} ${shadow.x || ''} ${
        shadow.y || ''
      } ${shadow.blur || ''} ${shadow.spread || ''} ${
        shadow.color || 'transparent'
      }`;
    });
    return {value: res.join(', '), source: res};
  }

  function onShadowSelect(value: string) {
    if (value === 'custom') {
      return;
    }
    if (value) {
      const findItem = find(shadowOptions, item => item.value === value);
      if (findItem?.value) {
        setShadowData(findItem);
        onChange(setInheritData(findItem.value, editorInheritValue));
      }
    } else {
      setShadowData(undefined);
      onChange(undefined);
    }
  }

  function changeToCustom(shadowData: ShadowOption) {
    if (!shadowData.value) {
      return shadowData;
    }
    const findItem = find(
      shadowOptions,
      item => item.value === shadowData.value
    );
    if (!isEqual(shadowData.realValue, findItem.realValue)) {
      return {
        ...shadowData,
        label: '自定义',
        value: 'custom'
      };
    }
    return shadowData;
  }

  function handleAdd(inset: boolean) {
    const newData = changeToCustom({
      ...(shadowData || {
        label: '自定义',
        value: 'custom'
      }),
      realValue: [
        ...(shadowData?.realValue || []),
        {
          inset,
          x: '0px',
          y: '0px',
          blur: '0px',
          spread: '0px',
          color: 'transparent'
        }
      ]
    });
    setShadowData(newData);
    onChange(formatRealValue(newData.realValue).value);
  }

  function handleDelete(index: number) {
    if (shadowData!.realValue.length === 1) {
      return;
    }
    let data = cloneDeep(shadowData);
    data!.realValue.splice(index, 1);
    const newData = changeToCustom(data!);
    setShadowData(newData);
    onChange(formatRealValue(newData.realValue).value);
  }

  function handleEdit(value: string, type: keyof ShadowData, index: number) {
    if (type !== 'color') {
      value += 'px';
    }
    (shadowData!.realValue[index][type] as string) = value;
    const newData = changeToCustom(shadowData!);
    setShadowData(newData);
    onChange(formatRealValue(newData.realValue).value);
  }

  // 数据格式化
  const formatter = (value: string | number) => {
    return value + 'px';
  };

  // 还原数据
  const parser = (value: string) => {
    return parseFloat(value);
  };

  return (
    <div className="Theme-ShadowEditor">
      <ThemeWrapperHeader
        title="阴影"
        hasSenior={hasSenior}
        senior={senior}
        toggleSenior={toggleSenior}
        open={open}
        toggleOpen={toggleOpen}
      />
      {open && (
        <div className="Theme-ShadowEditor-body">
          <div className="Theme-ShadowEditor-line">
            <div
              ref={target}
              className="Theme-ShadowEditor-view"
              onMouseOver={() => toggleViewShow(true)}
              onMouseOut={() => toggleViewShow(false)}
            >
              <div
                style={{
                  boxShadow: formatRealValue(shadowData?.realValue).value
                }}
                className="Theme-ShadowEditor-view-inner"
              ></div>
            </div>
            <ShadowView
              target={target}
              show={show}
              close={() => {
                toggleViewShow(false);
              }}
              name={shadowData?.label || '无阴影'}
              value={formatRealValue(shadowData?.realValue).source}
            />
            <div className="Theme-ShadowEditor-item">
              <Select
                options={shadowOptions}
                clearable
                value={shadowData?.value}
                onChange={(res: any) => {
                  onShadowSelect(res.value);
                }}
                placeholder={editorDefaultValue || '无阴影'}
              />
            </div>
          </div>
          {senior || shadowData?.value === 'custom' ? (
            <div className="Theme-ShadowEditor-customContent">
              <div className="Theme-Wrapper-header Theme-ShadowEditor-sub-header">
                <div className="Theme-Wrapper-header-left">阴影层</div>
                <div className="Theme-Wrapper-header-right">
                  {render({
                    type: 'dropdown-button',
                    level: 'link',
                    btnClassName: 'Theme-ShadowEditor-add',
                    icon: 'plus',
                    hideCaret: true,
                    closeOnClick: true,
                    align: 'right',
                    buttons: ['', 'inset'].map(item => {
                      return {
                        label: item ? '内阴影' : '外阴影',
                        onClick: () => handleAdd(!!item)
                      };
                    })
                  })}
                </div>
              </div>
              {shadowData?.realValue.length
                ? shadowData.realValue.map(
                    (item: ShadowData, index: number) => (
                      <div className="Theme-ShadowEditor-line" key={index}>
                        <div className="Theme-ShadowEditor-item">
                          <div className="Theme-ShadowEditor-color-picker">
                            <ColorPicker
                              needCustom
                              needTheme
                              value={item.color}
                              options={colorOptions || data.colorOptions || []}
                              onChange={(value: string) => {
                                handleEdit(value, 'color', index);
                              }}
                            />
                          </div>
                          <div className="Theme-ShadowEditor-item-label">
                            {item.inset ? '内阴影' : '外阴影'}
                          </div>
                        </div>
                        <div className="Theme-ShadowEditor-item">
                          <NumberInput
                            value={parseFloat(item.x)}
                            parser={parser}
                            formatter={formatter}
                            onChange={value => {
                              handleEdit(value as any, 'x', index);
                            }}
                          />
                          <div className="Theme-ShadowEditor-item-label">X</div>
                        </div>
                        <div className="Theme-ShadowEditor-item">
                          <NumberInput
                            value={parseFloat(item.y)}
                            parser={parser}
                            formatter={formatter}
                            onChange={value => {
                              handleEdit(value as any, 'y', index);
                            }}
                          />
                          <div className="Theme-ShadowEditor-item-label">Y</div>
                        </div>
                        <div className="Theme-ShadowEditor-item">
                          <NumberInput
                            value={parseFloat(item.blur)}
                            parser={parser}
                            formatter={formatter}
                            onChange={value => {
                              handleEdit(value as any, 'blur', index);
                            }}
                          />
                          <div className="Theme-ShadowEditor-item-label">
                            模糊
                          </div>
                        </div>
                        <div className="Theme-ShadowEditor-item">
                          <NumberInput
                            value={parseFloat(item.spread)}
                            parser={parser}
                            formatter={formatter}
                            onChange={value => {
                              handleEdit(value as any, 'spread', index);
                            }}
                          />
                          <div className="Theme-ShadowEditor-item-label">
                            扩展
                          </div>
                        </div>
                        <div className="Theme-ShadowEditor-item trash-icon">
                          <ThemeIcon
                            icon="trash"
                            className={cx(
                              'common-icon',
                              shadowData.realValue.length === 1 &&
                                'disabled-icon'
                            )}
                            onClick={() => {
                              handleDelete(index);
                            }}
                          />
                        </div>
                      </div>
                    )
                  )
                : null}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default observer(ShadowEditor);

@FormItem({
  type: 'amis-theme-shadow-editor',
  strictMode: false,
  renderLabel: false
})
export class ShadowEditorRenderer extends React.Component<ShadowEditorProps> {
  render() {
    return <ShadowEditor {...this.props} />;
  }
}
