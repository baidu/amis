import {Evaluator} from './evalutor';

export interface FilterMap {
  [propName: string]: (this: FilterContext, input: any, ...args: any[]) => any;
}

export interface FunctionMap {
  [propName: string]: (this: Evaluator, ast: Object, data: any) => any;
}

export interface FilterContext {
  data: Object;
  filter?: {
    name: string;
    args: Array<any>;
  };
  restFilters: Array<{
    name: string;
    args: Array<any>;
  }>;
}

export interface EvaluatorOptions {
  /**
   * 可以外部传入 ast 节点处理器，定制或者扩充自定义函数
   */
  functions?: FunctionMap;

  /**
   * 可以外部扩充 filter
   */
  filters?: FilterMap;

  defaultFilter?: string;
}

export interface LexerOptions {
  /**
   * 直接是运算表达式？还是从模板开始 ${} 里面才算运算表达式
   */
  evalMode?: boolean;

  /**
   * 只支持取变量。
   */
  variableMode?: boolean;

  /**
   * 是否允许 filter 语法，比如：
   *
   * ${abc | html}
   */
  allowFilter?: boolean;
}

export type TokenTypeName =
  | 'Boolean'
  | 'Raw'
  | 'Variable'
  | 'OpenScript'
  | 'CloseScript'
  | 'EOF'
  | 'Identifier'
  | 'Literal'
  | 'Numeric'
  | 'Punctuator'
  | 'String'
  | 'RegularExpression'
  | 'TemplateRaw'
  | 'TemplateLeftBrace'
  | 'TemplateRightBrace'
  | 'OpenFilter'
  | 'Char';

export interface Position {
  index: number;
  line: number;
  column: number;
}

export interface Token {
  type: TokenTypeName;
  value: any;
  raw?: string;
  start: Position;
  end: Position;
}

export type NodeType = 'content' | 'raw' | 'conditional';

export interface ParserOptions {
  /**
   * 直接是运算表达式？还是从模板开始 ${} 里面才算运算表达式
   */
  evalMode?: boolean;

  /**
   * 只支持取变量。
   */
  variableMode?: boolean;

  /**
   * 是否允许 filter 语法，比如：
   *
   * ${abc | html}
   */
  allowFilter?: boolean;

  variableNamespaces?: Array<string>;
}

export interface ASTNode {
  type: string;
  start: Position;
  end: Position;
  [propname: string]: any;
}

export type ASTNodeOrNull = ASTNode | null;
