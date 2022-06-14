import type { FormControlProps } from 'amis-core';
import React from 'react';
export interface DataMappingProps extends FormControlProps {
    schema?: string;
}
export declare class DataMappingControl extends React.Component<DataMappingProps> {
    renderValue(value: any, onChange: (value: any) => void, schema: any): JSX.Element;
    render(): JSX.Element;
}
export declare class DataMappingControlRenderer extends DataMappingControl {
}
