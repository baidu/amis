/**
 * @file 浮窗编辑
 */
import React from 'react';
import type { Action } from 'amis/lib/types';
import type { IScopedContext } from 'amis-core';
import type { FormControlProps } from 'amis-core';
import type { FormSchema } from 'amis/lib/Schema';
import type { Offset } from 'amis-ui/lib/components/PopOver';
export interface PopoverEditProps extends FormControlProps {
    className?: string;
    popOverclassName?: string;
    btnLabel?: string;
    btnIcon?: string;
    iconPosition?: 'right' | 'left';
    mode: 'popover' | 'dialog';
    form: Omit<FormSchema, 'type'>;
    rootClose?: boolean;
    placement?: string;
    offset?: ((clip: object, offset: object) => Offset) | Offset;
    style?: object;
    overlay?: boolean;
    container?: React.ReactNode | Function;
    target?: React.ReactNode | Function;
    trueValue?: any;
    falseValue?: any;
    enableEdit?: boolean;
    removable?: boolean;
    onClose: (e: React.UIEvent<any> | void) => void;
}
interface PopoverEditState {
    /**
     * 是否展示编辑窗口
     */
    show: boolean;
    /**
     * 是否开启编辑
     */
    checked: boolean;
}
export declare class PopoverEdit extends React.Component<PopoverEditProps, PopoverEditState> {
    static defaultProps: Pick<PopoverEditProps, 'btnIcon' | 'iconPosition' | 'container' | 'placement' | 'overlay' | 'rootClose' | 'mode' | 'trueValue' | 'falseValue' | 'enableEdit'>;
    overlay: HTMLElement | null;
    constructor(props: PopoverEditProps);
    overlayRef(ref: any): void;
    openPopover(): void;
    closePopover(): void;
    handleDelete(e: React.UIEvent<any> | void): void;
    handleSwitchChange(checked: boolean): void;
    handleSubmit(values: any, action: any): void;
    handleAction(e: React.UIEvent<any> | void, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): void;
    renderPopover(): JSX.Element;
    render(): JSX.Element;
}
export declare class PopoverEditRenderer extends PopoverEdit {
}
export {};
