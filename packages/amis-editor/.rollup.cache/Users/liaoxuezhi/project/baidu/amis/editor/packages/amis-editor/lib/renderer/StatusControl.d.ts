/**
 * @file 状态配置组件
 */
import React from 'react';
import { Option } from 'amis';
import type { FormControlProps } from 'amis-core';
import type { SchemaCollection } from 'amis/lib/Schema';
import type { FormSchema } from 'amis/lib/schema';
export interface StatusControlProps extends FormControlProps {
    name: string;
    expressioName: string;
    trueValue?: boolean;
    falseValue?: boolean;
    options?: Option[];
    children?: SchemaCollection;
    messages?: Pick<FormSchema, 'messages'>;
}
interface StatusControlState {
    checked: boolean;
}
export declare class StatusControl extends React.Component<StatusControlProps, StatusControlState> {
    static defaultProps: {
        trueValue: boolean;
        falseValue: boolean;
    };
    constructor(props: StatusControlProps);
    initState(): {
        checked: boolean;
    };
    shouldComponentUpdate(nextProps: StatusControlProps, nextState: StatusControlState): boolean;
    handleSwitch(value: boolean): void;
    handleSubmit(values: any): void;
    handleSelect(value: true | ''): void;
    render(): JSX.Element;
    renderContent(): JSX.Element;
}
export declare class StatusControlRenderer extends StatusControl {
}
export {};
