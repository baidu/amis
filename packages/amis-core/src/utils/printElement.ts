/**
 * 打印元素，参考 https://github.com/szepeshazi/print-elements 里的实现
 * 原理就是遍历节点加上打印样式，然后打印完了再清理掉
 * 对代码做了改造和优化
 */

const hideFromPrintClass = 'pe-no-print';
const preservePrintClass = 'pe-preserve-print';
const preserveAncestorClass = 'pe-preserve-ancestor';
const bodyElementName = 'BODY';

function hide(element: Element) {
  if (!element.classList.contains(preservePrintClass)) {
    element.classList.add(hideFromPrintClass);
  }
}

function preserve(element: Element, isStartingElement: boolean) {
  element.classList.remove(hideFromPrintClass);
  element.classList.add(preservePrintClass);
  if (!isStartingElement) {
    element.classList.add(preserveAncestorClass);
  }
}

function clean(element: Element) {
  element.classList.remove(hideFromPrintClass);
  element.classList.remove(preservePrintClass);
  element.classList.remove(preserveAncestorClass);
}

function walkSiblings(element: Element, callback: (element: Element) => void) {
  let sibling = element.previousElementSibling;
  while (sibling) {
    callback(sibling);
    sibling = sibling.previousElementSibling;
  }
  sibling = element.nextElementSibling;
  while (sibling) {
    callback(sibling);
    sibling = sibling.nextElementSibling;
  }
}

function attachPrintClasses(element: Element, isStartingElement: boolean) {
  preserve(element, isStartingElement);
  walkSiblings(element, hide);
}

function cleanup(element: Element, isStartingElement: boolean) {
  clean(element);
  walkSiblings(element, clean);
}

function walkTree(
  element: Element,
  callback: (element: Element, isStartingElement: boolean) => void
) {
  let currentElement: Element | null = element;
  callback(currentElement, true);
  currentElement = currentElement.parentElement;
  while (currentElement && currentElement.nodeName !== bodyElementName) {
    callback(currentElement, false);
    currentElement = currentElement.parentElement;
  }
}

export function printElements(elements: Element[]) {
  for (let i = 0; i < elements.length; i++) {
    walkTree(elements[i], attachPrintClasses);
  }
  window.print();
  for (let i = 0; i < elements.length; i++) {
    walkTree(elements[i], cleanup);
  }
}
