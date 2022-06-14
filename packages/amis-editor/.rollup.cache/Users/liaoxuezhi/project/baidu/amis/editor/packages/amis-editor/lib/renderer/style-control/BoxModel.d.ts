/**
 * @file  BoxModel
 * @description 盒模型控件，支持编辑 margin & padding
 */
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { PlainObject } from './types';
export declare type Direction = 'left' | 'right' | 'top' | 'bottom';
declare function BoxModel({ value, onChange }: {
    value?: PlainObject;
    onChange: (value: PlainObject) => void;
}): JSX.Element;
declare const _default: typeof BoxModel;
export default _default;
export declare class BoxModelRenderer extends React.Component<FormControlProps> {
    render(): JSX.Element;
}
