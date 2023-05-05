/**
 * @file control declaration
 * @description 公共控件相关声明
 */

export type PlainObject = Record<string, any>;

// TODO: 补充一下CSS支持的类型
export type StyleObject = Record<'marginTop', any>;

export type BoxShadowProps = 'x' | 'y' | 'blur' | 'spread' | 'color' | 'inset';

export type LengthUnit = 'px' | 'em' | 'rem' | 'vw' | 'vh';
