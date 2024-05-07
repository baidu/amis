import {readFileSync, writeFileSync} from 'fs';

import process from 'node:process';

import {functions} from '../src/excel/formula/functions/functions';
import {FormulaVisitor} from '../src/excel/formula/eval/FormulaVisitor';

import {Parser} from '../src/excel/formula/Parser';
import {tokenize} from '../src/excel/formula/tokenizer';
import {ASTNode} from '../src/excel/formula/ast/ASTNode';
import {
  FunctionName,
  builtinFunctionSet
} from '../src/excel/formula/builtinFunctions';
import {specialFunctions} from '../src/excel/formula/functions/special';

const mockEnv = {} as any;

const formulaVisitor = new FormulaVisitor(mockEnv);

const file = process.argv[2];

const content = readFileSync(file, 'utf-8').replace(/\r\n/g, '\n');

const usedFunctions = new Map<string, number>();

function addFunctions(ast: ASTNode) {
  if (ast.type === 'Function') {
    const functionName = ast.token.value.replace(/\($/, '');
    if (usedFunctions.has(functionName)) {
      usedFunctions.set(functionName, usedFunctions.get(functionName)! + 1);
    } else {
      usedFunctions.set(functionName, 1);
    }
  }
  for (const child of ast.children) {
    if (Array.isArray(child)) {
      for (const c of child) {
        addFunctions(c);
      }
      continue;
    }
    addFunctions(child);
  }
}

for (const line of content.split('\n')) {
  if (line.trim() === '') {
    continue;
  }
  if (line.startsWith('#')) {
    continue;
  }
  const formula = line.substring(1, line.length - 1).replace(/""/g, '"');
  // console.log(formula);

  const parser = new Parser(tokenize(formula));
  const ast = parser.parse();
  addFunctions(ast);
}

console.log(usedFunctions.size);

const notFoundFunctions = new Map<string, number>();

for (const [func, count] of usedFunctions) {
  if (
    !functions.has(func as FunctionName) &&
    builtinFunctionSet.has(func as FunctionName)
  ) {
    notFoundFunctions.set(func, count);
  }
}

// 这些函数是在执行时实现的
for (const [func] of specialFunctions) {
  notFoundFunctions.delete(func);
}

const mapSort = new Map(
  [...notFoundFunctions.entries()].sort((a, b) => b[1] - a[1])
);

console.log(mapSort);
