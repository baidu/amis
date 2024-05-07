import Graph, {GraphInstance} from '../../../util/graph';
import {rangeRefToString} from '../../io/excel/util/Range';
import {FormulaEnv} from '../FormulaEnv';
import {ASTNode} from '../ast/ASTNode';

export class DependencyVisitor {
  formulaEnv: FormulaEnv;
  fromCell: string;
  graph: GraphInstance;
  constructor(formulaEnv: FormulaEnv, graph: GraphInstance, fromCell: string) {
    this.formulaEnv = formulaEnv;
    this.graph = graph;
    this.fromCell = fromCell;
  }

  visit(node: ASTNode | ASTNode[]) {
    if (Array.isArray(node)) {
      node.map(n => this.visit(n));
      return;
    }
    const type = node.type;
    const ref = node.ref;
    switch (type) {
      case 'Reference':
        if (!ref) {
          break;
        }
        if ('name' in ref) {
        } else {
          const range = ref.range;
          this.graph.addEdge(this.fromCell, rangeRefToString(range));
        }
      case 'Intersection':

      default:
        break;
    }
  }
}
