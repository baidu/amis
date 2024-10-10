import {ASTNode} from '../ast/ASTNode';
import {parseDateWithExtra} from '../functions/date';
import {removeQuote} from '../parser/remoteQuote';
import {EvalResult} from './EvalResult';
import {FormulaVisitor} from './FormulaVisitor';

function convertString(str: string) {
  if (str.match(/^\$\d+\.\d+$/)) {
    return parseFloat(str.slice(1));
  }

  // 将 mm/dd/yyyy 转成 Date 对象
  if (str.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    const {date, isDateGiven} = parseDateWithExtra(str);
    if (isDateGiven) {
      return date;
    }
  }
  // 自动解析日期

  return str;
}

export function visitConstant(
  visitor: FormulaVisitor,
  node: ASTNode
): EvalResult {
  const nodeName = node.token.name;
  switch (nodeName) {
    case 'NUMBER':
      return parseFloat(node.token.value);

    case 'STRING':
      return convertString(removeQuote(node.token.value));

    case 'SINGLE_QUOTE_STRING':
      return convertString(removeQuote(node.token.value));

    case 'BOOLEAN':
      return node.token.value === 'TRUE';

    case 'ERROR':
    case 'ERROR_REF':
      return {
        type: 'Error',
        value: node.token.value
      };

    default:
      throw new Error('Not implemented constant ' + nodeName);
  }
}
