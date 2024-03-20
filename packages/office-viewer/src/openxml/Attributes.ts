/**
 * 属性类型
 */
export type AttributeType =
  | 'string'
  | 'int'
  | 'double'
  | 'boolean'
  | 'child'
  // 子节点，只取内容
  | 'child-string'
  | 'child-int'
  | 'any';

export const ANY_KEY = '__any__';

/**
 * 单个属性定义
 */
export interface Attribute {
  type: AttributeType;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 默认值
   */
  defaultValue?: string | number | boolean;

  /**
   * 解析子节点作为作为属性
   */
  childAttributes?: Attributes;

  /**
   * 子节点是否是数组
   */
  childIsArray?: boolean;
}

/**
 * 属性通用解析定义，这个主要是为了自动化解析属性
 */
export type Attributes = {
  [key: string]: Attribute;
};
