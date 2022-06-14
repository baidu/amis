/**
 * @file transformation.ts
 * @description CSS样式解析和编译
 */
import type { LengthUnit } from './types';
export interface LengthObj {
    length?: number;
    unit: LengthUnit;
}
export declare function parseBoxShadow(inputStr: string): {
    inset: boolean;
    x: string | number;
    y: string | number;
    blur: string | number;
    spread: string | number;
    color: string | undefined;
};
export declare function normalizeBoxShadow(config: {
    x: LengthObj;
    y: LengthObj;
    blur: LengthObj;
    spread: LengthObj;
    color: string;
    inset: boolean;
}): {
    boxShadow: string;
} | {
    boxShadow: undefined;
};
