// 执行优先级，决定执行顺序，用于解决 1 + 2 * 3 的问题
export const Precedence = {
  PLUS: 1,
  MUL: 2,
  CARET: 3,
  COMPARE: 4,
  PREFIX: 5,
  POSTFIX: 6,
  FUNCTION: 7
};
