/**
 * @file Display
 * @description 布局展示相关控件
 */
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { PlainObject } from './types';
export interface DisplayProps extends FormControlProps {
    value?: PlainObject;
    onChange: (value: PlainObject) => void;
}
export default class DisplayRenderer extends React.Component<FormControlProps> {
    render(): JSX.Element;
}
