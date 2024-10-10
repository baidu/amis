import {SaxesParser, SaxesTagPlain} from './saxes';

/**
 * 解析 xml
 */
export function parseXML(content: string) {
  return new DOMParser().parseFromString(content, 'application/xml');
}

/**
 * 构建 xml 文本
 */
export function buildXML(doc: Node): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(doc);
}

/**
 * xml 节点定义，这里字段名用缩写是为了减少 json 体积
 */
export interface XMLNode {
  /**
   * tag 标签名
   */
  tag: string;
  /**
   * attributes 属性
   */
  attrs: Record<string, string>;
  /**
   * children 子节点
   */
  children: XMLNode[];
  /**
   * text 文本内容
   */
  text?: string;
  /**
   * isSelfClosing 是否是闭合
   */
  s?: boolean;
}

/**
 * 将 xml 转换为 json 数据，主要用于 Word，不用 DOMParser 的好处是可以在浏览器和 node 环境下使用
 */

export async function xml2json(xml: string): Promise<XMLNode> {
  const parser = new SaxesParser();
  const stack: XMLNode[] = [];

  return new Promise((resolve, reject) => {
    parser.on('error', function (e: any) {
      console.error(e);
    });
    parser.on('text', function (t: string) {
      const peak = stack[stack.length - 1];
      if (peak) {
        peak.text = t;
      }
    });
    parser.on('opentag', function (node: SaxesTagPlain) {
      stack.push({
        tag: node.name,
        attrs: node.attributes,
        children: []
      });
    });
    parser.on('closetag', function () {
      if (stack.length > 1) {
        const currentNode = stack[stack.length - 1];
        const parentNode = stack[stack.length - 2];
        parentNode.children.push(currentNode);
      }

      if (stack.length !== 1) {
        stack.pop();
      }
    });

    parser.on('end', function () {
      if (stack.length !== 1) {
        reject('xml2json error');
      }
      resolve(stack[0]);
    });

    parser.write(xml).close();
  });
}

/**
 * 根据标签名获取节点
 * @param node 节点
 * @param tagName 标签名
 * @param deep 是否深度查找
 * @returns
 */
export function getNodeByTagName(
  node: XMLNode,
  tagName: string,
  deep = false
): XMLNode | null {
  const children = node.children || [];
  for (const child of children) {
    if (child.tag === tagName) {
      return child;
    }
    if (deep) {
      const result = getNodeByTagName(child, tagName, deep);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * 根据标签名获取节点列表
 * @param node 节点
 * @param tagName 标签名
 * @returns
 */
export function getNodesByTagName(node: XMLNode, tagName: string): XMLNode[] {
  const result: XMLNode[] = [];
  for (const child of node.children) {
    if (child.tag === tagName) {
      result.push(child);
    }
    if (child.children) {
      result.push(...getNodesByTagName(child, tagName));
    }
  }

  return result;
}
