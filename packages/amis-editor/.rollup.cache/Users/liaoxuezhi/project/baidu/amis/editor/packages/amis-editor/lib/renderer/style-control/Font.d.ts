/**
 * @file Font
 * @description 文字样式相关控件
 */
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { PlainObject } from './types';
export interface FontProps extends FormControlProps {
    value?: PlainObject;
    onChange: (value: PlainObject) => void;
}
declare const Font: React.FC<FontProps>;
export default Font;
export declare class FontRenderer extends React.Component<FormControlProps> {
    render(): JSX.Element;
}
