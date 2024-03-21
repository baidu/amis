import {XMLNode} from './xml';

const openBracket = '<';
const closeBracket = '>';
const slash = '/';
const space = ' ';
const questionMark = '?';

/**
 * 简单 XML 解析，目前看和 SaxesParser 比快不了多少，10 万行快了 1 秒，因为实现可能不完全准确，目前先不用
 */
export function xmlToNode(xml: string): XMLNode {
  let position = 0;

  // 当前 文本
  let text = '';
  let xmlLength = xml.length;

  const nodeStack: XMLNode[] = [];

  // 处理属性
  function processAttr() {
    const currentNode = nodeStack[nodeStack.length - 1];
    let attrName = '';
    while (position < xmlLength) {
      const char = xml[position];
      if (char === ' ') {
        position++;
        continue;
      }

      // 属性结束
      if (char === '=') {
        // ' 或 "，目前要求 = 号后面一定是引号
        const quote = xml[position + 1];
        const endQuote = xml.indexOf(quote, position + 2);
        const attrValue = xml
          .substring(position + 2, endQuote)
          .replace(/&quot;/g, '"');
        currentNode.attrs[attrName] = attrValue;
        attrName = '';
        position = endQuote + 1;
        continue;
      }

      if (char === '/' && xml[position + 1] === '>') {
        position = position + 2;
        if (nodeStack.length > 1) {
          nodeStack.pop();
        }
        text = '';
        return;
      }

      if (char === closeBracket) {
        position++;
        return;
      }

      attrName += char;
      position++;
    }
  }

  while (position < xmlLength) {
    const char = xml[position];
    // 忽略开始 xml 定义
    if (char === openBracket && xml[position + 1] === questionMark) {
      const end = xml.indexOf('?>', position);
      position = end + 2;
      continue;
    }

    // 开始 tag
    if (char === openBracket) {
      // </结束标签
      if (xml[position + 1] === slash) {
        const currentNode = nodeStack[nodeStack.length - 1];
        if (!currentNode) {
          position = position + 2;
          // 只有结束节点，解析有问题
          console.error('xml parse error');
          continue;
        }
        currentNode.text = text
          .trim()
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<');
        if (nodeStack.length > 1) {
          nodeStack.pop();
        }
        const end = xml.indexOf(closeBracket, position);
        position = end + 1;
        text = '';
        continue;
      } else {
        // < 开始，找到第一个空格或者 > 结束
        let tagName = '';
        position = position + 1;
        while (position < xmlLength) {
          const char = xml[position];
          if (char === space || char === closeBracket) {
            break;
          }
          tagName += char;
          position++;
        }

        const newNode = {
          tag: tagName,
          attrs: {},
          children: []
        };

        const parent = nodeStack[nodeStack.length - 1];
        if (parent) {
          parent.children.push(newNode);
        }

        nodeStack.push(newNode);

        // 处理属性
        processAttr();

        text = '';

        continue;
      }
    }

    text += char;

    position++;

    // 每隔 1024 截断一下，可能性能会更好？
    if (position > 124) {
      xml = xml.substring(position);
      position = 0;
      xmlLength = xml.length;
    }
  }

  return nodeStack[0]!;
}
