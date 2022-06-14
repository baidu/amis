/**
 * @file 边框圆角
 * @description 边框 & 圆角设置
 */
import React from 'react';
import type { PlainObject } from './types';
import type { FormControlProps } from 'amis-core';
declare function BoxBorder({ disableBorder, disableRadius, onChange, value }: {
    disableBorder?: boolean;
    disableRadius?: boolean;
    onChange: (value: PlainObject) => void;
    value?: PlainObject;
}): JSX.Element;
declare const _default: typeof BoxBorder;
export default _default;
export declare class BorderRenderer extends React.Component<FormControlProps> {
    render(): JSX.Element;
}
