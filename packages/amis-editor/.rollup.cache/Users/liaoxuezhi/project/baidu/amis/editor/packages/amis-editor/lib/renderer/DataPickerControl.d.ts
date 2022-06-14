import type { FormControlProps } from 'amis-core';
import React from 'react';
declare class DataPickerControl extends React.Component<FormControlProps> {
    handleConfirm(value: string): void;
    handlePickerOpen(): Promise<{
        variables: any;
        variableMode: string;
    }>;
    render(): JSX.Element;
}
export declare class DataPickerControlRenderer extends DataPickerControl {
}
export {};
