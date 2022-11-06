import React from 'react';
import {localeable, LocaleProps, themeable, ThemeProps} from 'amis-core';

export interface ConfirmBoxProps extends LocaleProps, ThemeProps {
    show?: boolean;
    closeOnEsc?: boolean;
    onConfirm?: (data:any) => void;
    onCancel?: () => void;
    title?: string;
    showTitle?: boolean;
    showFooter?: boolean;
    headerClassName?: string;
    children?: JSX.Element | ((ref: React.RefObject<{confirm: () => Promise<any>}>) => JSX.Element)
    popOverContainer?: any;
    popOverClassName?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    type: 'dialog' | 'drawer';
}

export function ConfirmBox(props: ConfirmBoxProps) {
  return <p>233</p>;
}

ConfirmBox.defaultProps = {
    type: 'dialog' as 'dialog'
}

export default localeable(themeable(ConfirmBox));
