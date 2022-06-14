/**
 * @file 开关 + 更多编辑组合控件
 * 使用时需关注所有的配置项是一个object还是整个data中，可使用bulk来区分
 *
 */
import React from 'react';
import type { Action } from 'amis/lib/types';
import type { SchemaCollection } from 'amis/lib/Schema';
import type { IScopedContext } from 'amis-core';
import type { FormSchema } from 'amis/lib/schema';
import type { FormControlProps } from 'amis-core';
export interface SwitchMoreProps extends FormControlProps {
    className?: string;
    form?: Omit<FormSchema, 'type'>;
    formType: 'extend' | 'dialog' | 'pop';
    body?: SchemaCollection;
    rootClose?: boolean;
    autoFocus?: boolean;
    overlay?: boolean;
    container?: React.ReactNode | Function;
    target?: React.ReactNode | Function;
    trueValue?: any;
    falseValue?: any;
    removable?: boolean;
    hiddenOnDefault?: boolean;
    bulk?: boolean;
    onRemove?: (e: React.UIEvent<any> | void) => void;
    onClose: (e: React.UIEvent<any> | void) => void;
    defaultData?: any;
}
interface SwitchMoreState {
    /**
     * 是否展示更多编辑内容
     */
    show: boolean;
    /**
     * 是否开启编辑
     */
    checked: boolean;
}
export default class SwitchMore extends React.Component<SwitchMoreProps, SwitchMoreState> {
    static defaultProps: Pick<SwitchMoreProps, 'container' | 'autoFocus' | 'overlay' | 'rootClose' | 'trueValue' | 'falseValue' | 'formType' | 'bulk'>;
    overlay: HTMLElement | null;
    formNames: null | Array<string>;
    constructor(props: SwitchMoreProps);
    initState(): {
        checked: boolean;
        show: boolean;
    };
    getFormItemNames(): any[];
    overlayRef(ref: any): void;
    openPopover(): void;
    toogleExtend(): void;
    closePopover(): void;
    handleDelete(e: React.UIEvent<any> | void): void;
    handleSwitchChange(checked: boolean): void;
    handleSubmit(values: any): void;
    handleAction(e: React.UIEvent<any> | void, action: Action, data: object, throwErrors?: boolean, delegate?: IScopedContext): void;
    renderActions(): JSX.Element[] | null;
    renderPopover(): JSX.Element;
    renderExtend(): JSX.Element | null;
    renderDialogMore(): {
        type: string;
        btnLabel: string;
        className: string;
        itemClassName: string;
        icon: string;
        form: {
            reload?: string | undefined;
            hidden?: boolean | undefined;
            disabled?: boolean | undefined;
            api?: string | import("amis").BaseApiObject | undefined;
            name?: string | undefined;
            horizontal: import("amis").FormHorizontal;
            data: any;
            body?: SchemaCollection | undefined;
            title: any;
            className?: import("amis").SchemaClassName | undefined;
            id?: string | undefined;
            autoFocus: boolean | undefined;
            tabs?: any;
            visibleOn?: string | undefined;
            onEvent?: {
                [propName: string]: {
                    weight?: number | undefined;
                    actions: import("amis").ListenerAction[];
                };
            } | undefined;
            $ref?: string | undefined;
            disabledOn?: string | undefined;
            hiddenOn?: string | undefined;
            visible?: boolean | undefined;
            mode: string;
            fieldSet?: any;
            messages?: {
                validateFailed?: string | undefined;
            } | undefined;
            labelAlign?: import("amis-core/lib/renderers/Item").LabelAlign | undefined;
            submitOnChange: boolean;
            initFetchOn?: string | undefined;
            initFetch?: boolean | undefined;
            initApi?: string | import("amis").BaseApiObject | undefined;
            interval?: number | undefined;
            silentPolling?: boolean | undefined;
            stopAutoRefreshWhen?: string | undefined;
            feedback?: any;
            redirect?: string | undefined;
            target?: string | undefined;
            actions?: import("amis/lib/renderers/Action").ActionSchema[] | undefined;
            affixFooter?: boolean | undefined;
            debug?: boolean | undefined;
            initAsyncApi?: string | import("amis").BaseApiObject | undefined;
            initFinishedField?: string | undefined;
            initCheckInterval?: number | undefined;
            persistData?: string | undefined;
            clearPersistDataAfterSubmit?: boolean | undefined;
            asyncApi?: string | import("amis").BaseApiObject | undefined;
            checkInterval?: number | undefined;
            finishedField?: string | undefined;
            resetAfterSubmit?: boolean | undefined;
            clearAfterSubmit?: boolean | undefined;
            columnCount?: number | undefined;
            panelClassName: import("amis").ClassName;
            primaryField?: string | undefined;
            submitOnInit?: boolean | undefined;
            submitText?: string | undefined;
            wrapWithPanel: boolean;
            promptPageLeave?: boolean | undefined;
            promptPageLeaveMessage?: string | undefined;
            rules?: {
                rule: string;
                message: string;
                name?: string | string[] | undefined;
            }[] | undefined;
            preventEnterSubmit: boolean;
            type: string;
            bodyClassName: string;
            actionsClassName: string;
            wrapperComponent: string;
            formLazyChange: boolean;
        };
    };
    renderForm(): {
        reload?: string | undefined;
        hidden?: boolean | undefined;
        disabled?: boolean | undefined;
        api?: string | import("amis").BaseApiObject | undefined;
        name?: string | undefined;
        horizontal: import("amis").FormHorizontal;
        data: any;
        body?: SchemaCollection | undefined;
        title?: string | undefined;
        className?: import("amis").SchemaClassName | undefined;
        id?: string | undefined;
        autoFocus: boolean | undefined;
        tabs?: any;
        visibleOn?: string | undefined;
        onEvent?: {
            [propName: string]: {
                weight?: number | undefined;
                actions: import("amis").ListenerAction[];
            };
        } | undefined;
        $ref?: string | undefined;
        disabledOn?: string | undefined;
        hiddenOn?: string | undefined;
        visible?: boolean | undefined;
        mode: string;
        fieldSet?: any;
        messages?: {
            validateFailed?: string | undefined;
        } | undefined;
        labelAlign?: import("amis-core/lib/renderers/Item").LabelAlign | undefined;
        submitOnChange: boolean;
        initFetchOn?: string | undefined;
        initFetch?: boolean | undefined;
        initApi?: string | import("amis").BaseApiObject | undefined;
        interval?: number | undefined;
        silentPolling?: boolean | undefined;
        stopAutoRefreshWhen?: string | undefined;
        feedback?: any;
        redirect?: string | undefined;
        target?: string | undefined;
        actions?: import("amis/lib/renderers/Action").ActionSchema[] | undefined;
        affixFooter?: boolean | undefined;
        debug?: boolean | undefined;
        initAsyncApi?: string | import("amis").BaseApiObject | undefined;
        initFinishedField?: string | undefined;
        initCheckInterval?: number | undefined;
        persistData?: string | undefined;
        clearPersistDataAfterSubmit?: boolean | undefined;
        asyncApi?: string | import("amis").BaseApiObject | undefined;
        checkInterval?: number | undefined;
        finishedField?: string | undefined;
        resetAfterSubmit?: boolean | undefined;
        clearAfterSubmit?: boolean | undefined;
        columnCount?: number | undefined;
        panelClassName: import("amis").ClassName;
        primaryField?: string | undefined;
        submitOnInit?: boolean | undefined;
        submitText?: string | undefined;
        wrapWithPanel: boolean;
        promptPageLeave?: boolean | undefined;
        promptPageLeaveMessage?: string | undefined;
        rules?: {
            rule: string;
            message: string;
            name?: string | string[] | undefined;
        }[] | undefined;
        preventEnterSubmit: boolean;
        type: string;
        bodyClassName: string;
        actionsClassName: string;
        wrapperComponent: string;
        formLazyChange: boolean;
    };
    renderMoreSection(): JSX.Element | null;
    render(): JSX.Element | null;
}
export declare class SwitchMoreRenderer extends SwitchMore {
}
export {};
