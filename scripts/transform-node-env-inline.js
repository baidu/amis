const parse = require('@babel/parser').parse;
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

module.exports = function transformNodeEnvInline(file) {
  // if (file.subpath !== '/node_modules/mobx/lib/index.js') {
  //   return;
  // }

  if (!file.isJsLike || !file.isMod) {
    return;
  }

  let contents = file.getContent();
  const idx = contents.indexOf('process.env.NODE_ENV');
  if (idx === -1) {
    return;
  }

  const idx2 = contents.indexOf('require(', idx);
  if (idx2 === -1) {
    return;
  }

  const env = file.optimizer ? 'production' : 'development';

  contents = contents.replace(/typeof\s+process\b/g, () =>
    JSON.stringify('object')
  );
  const ast = parse(contents, {
    sourceType: 'module'
  });

  traverse(ast, {
    // 参考： https://www.trickster.dev/post/javascript-ast-manipulation-with-babel-removing-unreachable-code/
    // 参考：https://github.com/babel/minify/blob/master/packages/babel-plugin-transform-node-env-inline/src/index.js
    MemberExpression(path) {
      if (path.matchesPattern('process.env.NODE_ENV')) {
        path.replaceWith(types.valueToNode(env));
        let parentPath = path.parentPath;
        if (parentPath.isBinaryExpression()) {
          const evaluated = parentPath.evaluate();
          if (evaluated.confident) {
            parentPath.replaceWith(types.valueToNode(evaluated.value));
          }
        }

        let ifStatement = null;
        while (parentPath) {
          if (
            parentPath.isIfStatement() ||
            parentPath.isConditionalExpression()
          ) {
            ifStatement = parentPath;
          }

          parentPath = parentPath.parentPath;
        }

        if (ifStatement) {
          let isTruthy = ifStatement.get('test').evaluateTruthy();
          const node = ifStatement.node;

          if (isTruthy) {
            if (types.isBlockStatement(node.consequent)) {
              ifStatement.replaceWithMultiple(node.consequent.body);
            } else {
              ifStatement.replaceWith(node.consequent);
            }
          } else if (node.alternate != null) {
            if (types.isBlockStatement(node.alternate)) {
              ifStatement.replaceWithMultiple(node.alternate.body);
            } else {
              ifStatement.replaceWith(node.alternate);
            }
          } else {
            ifStatement.remove();
          }
        }
      }
    }
  });

  contents = generate(ast, {}).code;
  file.setContent(contents);

  // console.log('\n', file.subpath, '\n', file.getContent());
  // process.exit(1);
};
