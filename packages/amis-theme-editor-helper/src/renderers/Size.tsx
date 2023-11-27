/**
 * @file Size.tsx
 * @description 设置尺寸
 */

import React from 'react';
import {observer} from 'mobx-react';
import {FormItem} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import {Icon as ThemeIcon} from '../icons/index';
import cx from 'classnames';
import {Button} from 'amis-ui';
import ThemeSelect from './ThemeSelect';
import {find} from 'lodash';
import {
  getValueByPath,
  getInheritValue,
  formatInheritData,
  setInheritData
} from '../util';

interface SizeEditorProps extends FormControlProps {
  hideWidth?: boolean;
  hideHeight?: boolean;
  hideMinWidth?: boolean;
}

function SizeEditor(props: SizeEditorProps) {
  const {
    data,
    sizesOptions = data.sizesOptions,
    value: defaultValue,
    onChange,
    hideWidth,
    hideHeight,
    hideMinWidth,
    editorThemePath,
    label
  } = props;
  const [lock, setLockValue] = React.useState(0);
  const [value, setValue] = React.useState<{
    width?: string;
    height?: string;
    minWidth?: string;
  }>({
    width: '',
    height: '',
    minWidth: ''
  });
  const RULE = /[0-9\.]*/;
  const editorDefaultValue = getValueByPath(editorThemePath, data);
  const editorInheritValue = getInheritValue(editorThemePath, data);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (defaultValue) {
        setValue(formatInheritData(defaultValue));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [defaultValue]);

  function handleChange(valueTemp: any) {
    if (sizesOptions && sizesOptions.length) {
      let value: {
        width?: string;
        height?: string;
        minWidth?: string;
      } = {};
      ['width', 'height', 'minWidth'].forEach(
        (key: 'width' | 'height' | 'minWidth') => {
          const sizeFind = find(
            sizesOptions,
            item => item.realValue === valueTemp[key]
          );
          value[key] = sizeFind ? sizeFind.value : valueTemp[key];
        }
      );
      onChange(setInheritData(value, editorInheritValue));
      return;
    }
    onChange(valueTemp);
  }

  function setValueByLock({
    data,
    type
  }: {
    data: string;
    type: 'width' | 'height';
  }) {
    if (lock) {
      const changeType = type === 'width' ? 'height' : 'width';
      let finalValue = '';
      let originNum = getNumByOption(data);
      let num = type === 'width' ? originNum / lock : originNum * lock;
      num = Number(num.toFixed(2));
      if (lock === 1) {
        finalValue = data;
      } else if (data.indexOf('var') > -1) {
        const findItem = find(
          sizesOptions,
          item => item.realValue === num + 'rem'
        );
        if (findItem) {
          finalValue = findItem.value;
        } else {
          finalValue = num + 'rem';
        }
      } else {
        const unit = data.replace(originNum.toString(), '');
        finalValue = num + unit;
      }

      const valueTemp = {
        ...value,
        [type]: data,
        [changeType]: finalValue
      };
      setValue(valueTemp);
      handleChange(valueTemp);
    }
  }

  function setValueByType(data: string, type: string) {
    if (lock && (type === 'width' || type === 'height')) {
      setValueByLock({data, type});
      return;
    }
    const valueTemp = {
      ...value,
      [type]: data
    };
    setValue(valueTemp);
    handleChange(valueTemp);
  }

  function getNumByOption(value: string) {
    if (!value) {
      return 0;
    }
    const matchValue = value.match(RULE);
    if (matchValue && matchValue[0]) {
      return Number(matchValue[0]);
    }
    if (!sizesOptions || !sizesOptions.length) {
      return 0;
    }
    const findItem = find(sizesOptions, item => item.value === value);
    const matchFindValue = findItem ? findItem.realValue.match(RULE) : 0;
    return matchFindValue && matchFindValue[0] ? Number(matchFindValue[0]) : 0;
  }

  return (
    <div className="Theme-SizeEditor">
      {label ? <div className="Theme-SizeEditor-label">{label}</div> : null}
      <div className="Theme-SizeEditor-body">
        <div
          className={cx(
            'Theme-SizeEditor-line',
            (hideWidth || hideHeight) && 'Theme-SizeEditor-item-sigle',
            !hideWidth && !hideHeight && 'Theme-SizeEditor-line-no-hide'
          )}
        >
          <div className="Theme-SizeEditor-size">
            {!hideWidth && (
              <div className="Theme-SizeEditor-item">
                <div className="Theme-SizeEditor-item-label">W</div>
                <ThemeSelect
                  {...props}
                  options={sizesOptions}
                  value={value['width']}
                  onChange={(value: string) => setValueByType(value, 'width')}
                  itemName="width"
                  placeholder={editorDefaultValue?.width}
                />
              </div>
            )}
            {!hideHeight && (
              <div className="Theme-SizeEditor-item">
                <div className="Theme-SizeEditor-item-label">H</div>
                <ThemeSelect
                  {...props}
                  options={sizesOptions}
                  value={value['height']}
                  onChange={(value: string) => setValueByType(value, 'height')}
                  itemName="height"
                  placeholder={editorDefaultValue?.height}
                />
              </div>
            )}
          </div>
          {!hideWidth && !hideHeight && (
            <div className="Theme-SizeEditor-lock">
              {!lock ? (
                <Button
                  tooltip="锁定比例"
                  tooltipPlacement="left"
                  onClick={() => {
                    if (!value['width'] || !value['height']) {
                      setLockValue(0);
                    } else {
                      const width = getNumByOption(value['width']);
                      const height = getNumByOption(value['height']);
                      if (width && height) {
                        setLockValue(Number((width / height).toFixed(2)));
                      } else {
                        setLockValue(0);
                      }
                    }
                  }}
                >
                  <ThemeIcon icon="unlock" className="common-icon" />
                </Button>
              ) : (
                <Button
                  tooltip="解除锁定"
                  tooltipPlacement="left"
                  onClick={() => {
                    setLockValue(0);
                  }}
                >
                  <ThemeIcon icon="lock" className="common-icon" />
                </Button>
              )}
            </div>
          )}
        </div>
        {!hideMinWidth && (
          <div className="Theme-SizeEditor-line Theme-SizeEditor-item-sigle">
            <div className="Theme-SizeEditor-item">
              <div className="Theme-SizeEditor-item-label">最小宽度</div>
              <ThemeSelect
                {...props}
                options={sizesOptions}
                value={value['minWidth']}
                onChange={(value: string) => setValueByType(value, 'minWidth')}
                itemName="minWidth"
                placeholder={editorDefaultValue?.minWidth}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(SizeEditor);

@FormItem({
  type: 'amis-theme-size-editor',
  strictMode: false,
  renderLabel: false
})
export class SizeEditorRenderer extends React.Component<SizeEditorProps> {
  render() {
    return <SizeEditor {...this.props} />;
  }
}
