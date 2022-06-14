import React from 'react';
import { BaseEventContext, BasePlugin, RegionConfig } from 'amis-editor-core';
export declare class DialogPlugin extends BasePlugin {
    rendererName: string;
    $schema: string;
    name: string;
    isBaseComponent: boolean;
    wrapperProps: {
        wrapperComponent: typeof InlineModal;
        onClose: typeof import("amis-core").noop;
        show: boolean;
    };
    regions: Array<RegionConfig>;
    events: {
        eventName: string;
        eventLabel: string;
        description: string;
    }[];
    actions: {
        actionType: string;
        actionLabel: string;
        description: string;
    }[];
    panelTitle: string;
    panelBodyCreator: (context: BaseEventContext) => any;
    buildSubRenderers(): void;
}
export declare class InlineModal extends React.Component<any, any> {
    componentDidMount(): void;
    render(): JSX.Element;
}
