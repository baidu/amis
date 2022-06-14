/// <reference types="react" />
import { RendererProps } from 'amis-core';
interface InputComponentNameProps extends RendererProps {
    value: any;
    onChange: (value: any) => void;
}
export declare function InputComponentName(props: InputComponentNameProps): JSX.Element;
export {};
