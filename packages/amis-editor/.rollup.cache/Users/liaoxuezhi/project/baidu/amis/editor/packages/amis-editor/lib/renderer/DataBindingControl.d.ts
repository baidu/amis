import type { FormControlProps } from 'amis-core';
import React from 'react';
export declare class DataBindingControl extends React.Component<FormControlProps> {
    handleConfirm(result: {
        value: string;
        schema: any;
    }): void;
    handlePickerOpen(): Promise<{
        schemas: any;
    }>;
    render(): JSX.Element;
}
export declare class DataBindingControlRenderer extends DataBindingControl {
}
