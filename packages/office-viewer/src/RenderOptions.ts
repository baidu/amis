/**
 * 一些通用的渲染配置项
 */
export interface RenderOptions {
  /**
   * 是否开启变量替换功能
   */
  enableVar?: boolean;

  /**
   * 上下文数据，用于替换变量
   */
  data?: any;

  /**
   * 进行表达式计算的函数，第一个参数是文本变量，第二个参数是上下文数据
   */
  evalVar: (
    text: string,
    data?: Object
  ) => Object | string | number | boolean | null | undefined;

  /**
   * 是否开启调试模式
   */
  debug?: boolean;

  /**
   * 字体映射，用于替换文档中的字体
   */
  fontMapping?: Record<string, string>;
}
