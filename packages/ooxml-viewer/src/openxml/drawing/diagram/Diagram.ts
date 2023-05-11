/**
 * 图形，这块没啥文档说明，大部分是靠猜的
 */

import Word from '../../../Word';

export class Diagram {
  // 这里的输入是 dgm:relIds 元素
  static fromXML(word: Word, relidsElement: Element) {
    const diagram = new Diagram();
    const dmId = relidsElement.getAttribute('r:dm');
    if (dmId) {
      const dmRel = word.getDocumentRels(dmId);
      if (dmRel) {
        // 对应的就是 digrams/data1.xml 文件
        const dm = word.loadWordRelXML(dmRel);
        console.log(dm);
      }
    }

    return diagram;
  }
}
