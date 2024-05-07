import {FormulaEnv} from '../FormulaEnv';
import {ASTNode} from '../ast/ASTNode';
import {EvalResult} from './EvalResult';
import {visitArray} from './visitArray';
import {visitBinaryExpr} from './visitBinaryExpr';
import {visitConstant} from './visitConstant';
import {visitFunction} from './visitFunction';
import {visitPercent} from './visitPercent';
import {visitReference} from './visitReference';
import {visitUnaryExpr} from './visitUnaryExpr';
import '../functions/math';
import '../functions/trigonometry';
import '../functions/text';
import '../functions/statistical';
import '../functions/distribution';
import '../functions/engineering';
import '../functions/date';
import '../functions/financial';
import '../functions/information';
import '../functions/logical';
import '../functions/reference';
import '../functions/functionAlias';
import '../functions/database';
import {visitIntersection} from './visitIntersection';

export class FormulaVisitor {
  formulaEnv: FormulaEnv;
  constructor(formulaEnv: FormulaEnv) {
    this.formulaEnv = formulaEnv;
  }

  visit(node: ASTNode | ASTNode[]): EvalResult {
    if (Array.isArray(node)) {
      return node.map(n => this.visit(n));
    }
    const type = node.type;
    switch (type) {
      case 'BinaryExpr':
        return visitBinaryExpr(this, node);
      case 'UnaryExpr':
        return visitUnaryExpr(this, node);
      case 'Constant':
        return visitConstant(this, node);
      case 'Percent':
        return visitPercent(this, node);
      case 'Reference':
        return visitReference(this.formulaEnv, node);
      case 'Intersection':
        return visitIntersection(this, this.formulaEnv, node);
      case 'Function':
        return visitFunction(this, this.formulaEnv, node);
      case 'Array':
        return visitArray(this, node);
      case 'Union':
        return {
          type: 'Union',
          children: visitArray(this, node)
        };

      default:
        throw new Error('Not implemented type' + type);
    }
  }
}
