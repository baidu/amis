/**
 * @file Background.ts
 * @description 背景设置
 */
import React from 'react';
import type { FormControlProps } from 'amis-core';
import type { PlainObject } from './types';
interface BackgroundProps extends FormControlProps {
    receiver?: string;
    value?: PlainObject;
    onChange: (value: PlainObject) => void;
}
declare const Background: React.FC<BackgroundProps>;
export default Background;
export declare class BackgroundRenderer extends React.Component<FormControlProps> {
    render(): JSX.Element;
}
