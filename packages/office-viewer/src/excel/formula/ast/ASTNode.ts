import {Token} from '../tokenizer';
import {Reference} from './Reference';

export type ASTNodeType =
  | 'Array'
  | 'Function'
  | 'Percent'
  | 'Constant'
  | 'UnaryExpr'
  | 'BinaryExpr'
  | 'Union'
  | 'Intersection'
  | 'Reference';

export type ASTNode = {
  type: ASTNodeType;
  token: Token;
  children: ASTNode[] | ASTNode[][];

  // ref 特有字段
  ref?: Reference;

  // intersection 特有字段
  refs?: Reference[];
};

export function printAST(ast: ASTNode): string {
  const result: string[] = [];
  print(ast, result);
  return result.join('');
}

export function printArray(
  children: ASTNode[] | ASTNode[][],
  result: string[]
) {
  result.push('{');
  children.forEach((child, index) => {
    if (Array.isArray(child)) {
      child.forEach((c, i) => {
        print(c, result);
        if (i < child.length - 1) {
          result.push(',');
        }
      });
      if (index < children.length - 1) {
        result.push(';');
      }
    } else {
      print(child, result);
      if (index < children.length - 1) {
        result.push(',');
      }
    }
  });
  result.push('}');
}

export function print(node: ASTNode | ASTNode[], result: string[]) {
  if (Array.isArray(node)) {
    printArray(node, result);
    return;
  }
  switch (node.type) {
    case 'Array':
      printArray(node.children, result);
      break;

    case 'BinaryExpr':
      result.push('(');
      print(node.children[0], result);
      result.push(node.token.value);
      print(node.children[1], result);
      result.push(')');

      break;

    case 'Function':
      result.push(node.token.value);
      node.children.forEach((child, index) => {
        print(child, result);

        if (index < node.children.length - 1) {
          result.push(',');
        }
      });
      result.push(')');
      break;

    case 'Percent':
      result.push('(');
      print(node.children[0], result);
      result.push(node.token.value);
      result.push(')');
      break;

    case 'UnaryExpr':
      result.push('(');
      result.push(node.token.value);
      print(node.children[0], result);
      result.push(')');
      break;

    case 'Union':
      result.push('(');
      node.children.forEach((child, index) => {
        print(child, result);

        if (index < node.children.length - 1) {
          result.push(',');
        }
      });
      result.push(')');
      break;

    default:
      result.push(node.token.value);
  }
}
