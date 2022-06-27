/**
 * @file  BoxModel
 * @description 盒模型控件，支持编辑 margin & padding
 */

import cx from 'classnames';
import React from 'react';
import {observer} from 'mobx-react';
import camelCase from 'lodash/camelCase';
import {FormItem} from 'amis';

import {isNumeric} from 'amis-editor-core';
import {isAuto} from '../../util';

import type {FormControlProps} from 'amis-core';
import type {PlainObject} from './types';

export type Direction = 'left' | 'right' | 'top' | 'bottom';

function BoxModel({
  value,
  onChange
}: {
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}) {
  const directions: Direction[] = ['left', 'right', 'top', 'bottom'];

  function handleChange(styleName: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      if (!inputValue) {
        onChange({...value, [styleName]: undefined});
        return;
      }

      // 数字类型或带有合法单位的字符串都支持
      if (
        isNumeric(inputValue) ||
        isAuto(inputValue) ||
        /^(-?(\d*\.)?\d+)((px)|(em)|(%)|(ex)|(ch)|(rem)|(vw)|(vh)|(vmin)|(vmax)|(cm)|(mm)|(in)|(pt)|(pc))$/.test(
          inputValue
        )
      ) {
        onChange({
          ...value,
          [styleName]: inputValue
        });
      }
    };
  }

  function renderBoxItem(item: string) {
    return (
      <>
        {directions.map((direction: Direction) => {
          const propsName = camelCase(`${item}-${direction}`);

          return (
            <input
              key={propsName}
              placeholder="0"
              className={`ae-BoxModel-input ${direction}`}
              type="text"
              onChange={handleChange(propsName)}
              value={value?.[propsName] || ''}
            />
          );
        })}
        <div className="ae-BoxModel-title">{item.toUpperCase()}</div>
        {['lt', 'lb', 'rt', 'rb'].map(position => (
          <div key={position} className={cx('ae-BoxModel-line', position)} />
        ))}
      </>
    );
  }

  return (
    <div className="mx-2 ae-BoxModel">
      <div className="ae-BoxModel-inner">
        <div className="ae-BoxModel">
          <div className="ae-BoxModel-inner"></div>
          {renderBoxItem('padding')}
        </div>
      </div>
      {renderBoxItem('margin')}
    </div>
  );
}

export default observer(BoxModel);

@FormItem({type: 'style-box-model'})
export class BoxModelRenderer extends React.Component<FormControlProps> {
  render() {
    return <BoxModel {...this.props} />;
  }
}
