/**
 * 主题内外边距
 */

import {FormItem} from 'amis-core';
import type {FormControlProps} from 'amis-core';
import {Overlay, PopOver} from 'amis-ui';
import React, {useEffect, useState} from 'react';
import cx from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import ThemeSelect from './ThemeSelect';
import {
  getValueByPath,
  getInheritValue,
  formatInheritData,
  setInheritData
} from '../util';

interface PaddingAndMarginProps extends FormControlProps {
  custom: boolean;
}

function PaddingAndMarginDialog(props: PaddingAndMarginProps) {
  const {
    onChange,
    value,
    data,
    custom,
    label,
    options,
    hideMargin,
    hidePadding,
    state,
    editorThemePath
  } = props;
  const [type, setType] = useState('all');
  const [customRef, setCustomRef] = useState<Element | null>(null);
  const [customShow, setCustomShow] = useState(false);
  const [customIndex, setCustomIndex] = useState(0);
  const [customKey, setCustomKey] = useState('marginTop');
  const [isPaddingInherit, setIsPaddingInherit] = useState<boolean>(false);
  const [isMarginInherit, setIsMarginInherit] = useState<boolean>(false);

  const LABELS = [
    {value: 'marginTop'},
    {value: 'marginRight'},
    {value: 'marginBottom'},
    {value: 'marginLeft'},
    {value: 'paddingTop'},
    {value: 'paddingRight'},
    {value: 'paddingBottom'},
    {value: 'paddingLeft'}
  ].filter(n => {
    if (hideMargin) {
      return !!~n.value.indexOf('padding');
    } else if (hidePadding) {
      return !!~n.value.indexOf('margin');
    } else {
      return n;
    }
  });

  const editorDefaultValue = formatData(getValueByPath(editorThemePath, data));
  const editorInheritValue = getInheritValue(editorThemePath, data);
  const spaceData = formatData(value || {});
  const optionsData = options || data.sizesOptions || [];

  function formatData(sourceData: any) {
    if (!sourceData) {
      return null;
    }

    const data = formatInheritData(cloneDeep(sourceData));
    if (
      data?.marginTop === data?.marginRight &&
      data?.marginRight === data?.marginBottom &&
      data?.marginBottom === data?.marginLeft
    ) {
      data.margin = data?.marginTop;
    } else {
      data.margin = 'custom';
    }
    if (
      data?.paddingTop === data?.paddingRight &&
      data?.paddingRight === data?.paddingBottom &&
      data?.paddingBottom === data?.paddingLeft
    ) {
      data.padding = data?.paddingTop;
    } else {
      data.padding = 'custom';
    }
    return data;
  }

  function onSpaceChange(position: number | string) {
    return (value: string | undefined) => {
      const res = cloneDeep(spaceData);
      delete res.margin;
      delete res.padding;
      if (value === 'custom') {
        return;
      }

      if (position === 'margin-all') {
        if (value?.includes('all')) {
          const defaultToken = (key: string) =>
            `var(${data.default.token}${key})`;
          res.marginTop = defaultToken('marginTop');
          res.marginRight = defaultToken('marginRight');
          res.marginBottom = defaultToken('marginBottom');
          res.marginLeft = defaultToken('marginLeft');
        } else {
          res.marginTop = value;
          res.marginRight = value;
          res.marginBottom = value;
          res.marginLeft = value;
        }
      } else if (position === 'padding-all') {
        if (value?.includes('all')) {
          const defaultToken = (key: string) =>
            `var(${data.default.token}${key})`;
          res.paddingTop = defaultToken('paddingTop');
          res.paddingRight = defaultToken('paddingRight');
          res.paddingBottom = defaultToken('paddingBottom');
          res.paddingLeft = defaultToken('paddingLeft');
        } else {
          res.paddingTop = value;
          res.paddingRight = value;
          res.paddingBottom = value;
          res.paddingLeft = value;
        }
      } else if (typeof position === 'number') {
        const label = LABELS[position].value;
        res[label] = value;
        if (label.includes('padding')) {
          setIsPaddingInherit(false);
        } else {
          setIsMarginInherit(false);
        }
      }
      onChange(setInheritData(res, editorInheritValue));
    };
  }

  function findRealValue(value: string) {
    return (
      optionsData.find((item: any) => item.value === value)?.realValue || value
    );
  }

  function handleCustomClick(e: React.MouseEvent, index: number, key: string) {
    setCustomShow(true);
    setCustomRef(e.currentTarget);
    setCustomIndex(index);
    setCustomKey(key);
  }

  useEffect(() => {
    if (state && state !== 'default' && value) {
      if (
        value['paddingTop']?.includes('default-paddingTop') &&
        value['paddingBottom']?.includes('default-paddingBottom') &&
        value['paddingRight']?.includes('default-paddingRight') &&
        value['paddingLeft']?.includes('default-paddingLeft')
      ) {
        setIsPaddingInherit(true);
      }
      if (
        value['marginTop']?.includes('default-marginTop') &&
        value['marginBottom']?.includes('default-marginBottom') &&
        value['marginRight']?.includes('default-marginRight') &&
        value['marginLeft']?.includes('default-marginLeft')
      ) {
        setIsMarginInherit(true);
      }
    }
  }, [value]);

  useEffect(() => {
    if (spaceData.margin === 'custom' || spaceData.padding === 'custom') {
      setType('custom');
    }
  }, []);

  return (
    <div className="Theme-PaddingAndMargin">
      {label ? (
        <div className="Theme-PaddingAndMargin-title">{label}</div>
      ) : null}
      <div className="Theme-PaddingAndMargin-inner">
        <div
          className={cx(
            'Theme-PaddingAndMargin-label',
            custom && 'Theme-PaddingAndMargin-label--custom'
          )}
        >
          <div
            className={cx(
              'Theme-PaddingAndMargin-label-all',
              type === 'all' && 'Theme-PaddingAndMargin-label-all--active'
            )}
            onClick={() => setType('all')}
          ></div>
          {custom ? (
            <div
              className={cx(
                'Theme-PaddingAndMargin-label-custom',
                type === 'custom' &&
                  'Theme-PaddingAndMargin-label-custom--active'
              )}
              onClick={() => setType('custom')}
            >
              <div></div>
              <div></div>
            </div>
          ) : null}
        </div>
        {type === 'all' ? (
          <>
            {!hideMargin && (
              <div className="Theme-PaddingAndMargin-input">
                <ThemeSelect
                  {...props}
                  options={optionsData}
                  value={
                    isMarginInherit
                      ? `var(${data.default.token}margin-all)`
                      : spaceData.margin
                  }
                  onChange={onSpaceChange('margin-all')}
                  itemName="margin-all"
                  state={state}
                  inheritValue={editorThemePath ? 'inherit' : ''}
                  placeholder={editorDefaultValue?.margin}
                />
                <div className="Theme-PaddingAndMargin-input-label">Margin</div>
              </div>
            )}
            {!hidePadding && (
              <div className="Theme-PaddingAndMargin-input">
                <ThemeSelect
                  {...props}
                  options={optionsData}
                  value={
                    isPaddingInherit
                      ? `var(${data.default.token}padding-all)`
                      : spaceData.padding
                  }
                  onChange={onSpaceChange('padding-all')}
                  itemName="padding-all"
                  state={state}
                  inheritValue={editorThemePath ? 'inherit' : ''}
                  placeholder={editorDefaultValue?.padding}
                />
                <div className="Theme-PaddingAndMargin-input-label">
                  Padding
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      {type !== 'all' ? (
        <div
          className={cx(
            'Theme-PaddingAndMargin-custom',
            !hidePadding && 'Theme-PaddingAndMargin-custom--padding',
            !hideMargin && 'Theme-PaddingAndMargin-custom--margin'
          )}
        >
          {LABELS.map((item, index) => {
            return (
              <div
                key={item.value}
                className={cx('Theme-PaddingAndMargin-custom-' + item.value)}
                onClick={e => handleCustomClick(e, index, item.value)}
              >
                <div>
                  {findRealValue(
                    spaceData[item.value] || editorDefaultValue?.[item.value]
                  ) || '-'}
                </div>
              </div>
            );
          })}
          <Overlay
            // @ts-ignore
            container={document.body}
            // @ts-ignore
            target={customRef}
            show={customShow}
            rootClose={false}
          >
            <PopOver overlay onHide={() => setCustomShow(false)}>
              <div className="Theme-PaddingAndMargin-custom-popover">
                <ThemeSelect
                  {...props}
                  options={optionsData}
                  value={spaceData[customKey]}
                  onChange={onSpaceChange(customIndex)}
                  itemName={customKey}
                  state={state}
                  inheritValue={editorThemePath ? 'inherit' : ''}
                  placeholder={editorDefaultValue?.[customKey]}
                />
              </div>
            </PopOver>
          </Overlay>
        </div>
      ) : null}
    </div>
  );
}

@FormItem({
  type: 'amis-theme-padding-and-margin',
  strictMode: false,
  renderLabel: false
})
export default class PaddingAndMarginDialogRender extends React.Component<PaddingAndMarginProps> {
  render() {
    return (
      <PaddingAndMarginDialog
        {...this.props}
        custom={this.props.custom ?? true}
      />
    );
  }
}
