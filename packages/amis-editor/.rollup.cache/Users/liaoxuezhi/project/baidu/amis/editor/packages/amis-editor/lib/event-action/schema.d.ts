import type { ActionConfigItemsMap } from 'amis-editor-comp/dist/renderers/event-action';
export declare const getComboWrapper: (items: any, multiple?: boolean) => {
    type: string;
    name: string;
    multiple: boolean;
    strictMode: boolean;
    items: any[];
};
/**
 * 获取动作配置项map
 * @param manager
 */
export declare function getActionConfigItemsMap(manager: any): ActionConfigItemsMap;
