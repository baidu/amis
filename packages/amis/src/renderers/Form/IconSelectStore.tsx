import cloneDeep from 'lodash/cloneDeep';
import {TranslateFn, makeTranslator, getDefaultLocale} from 'amis-core';

export interface SvgIcon {
  name: string;
  id: string;
  svg?: string;
}

export interface SvgIconGroup {
  name: string;
  groupId: string;
  children: SvgIcon[];
}

export let svgIcons: SvgIconGroup[] = [];

function getSvgMountNode(nodeId: string = 'amis-icon-manage-mount-node') {
  const node = document.getElementById(nodeId);

  if (node) {
    return node;
  } else {
    const newNode = document.createElement('div');
    newNode.setAttribute('id', nodeId);
    newNode.setAttribute('style', 'width:0;height:0;visibility:hidden;');

    if (document.body.firstElementChild) {
      document.body.insertBefore(newNode, document.body.firstElementChild);
    } else {
      document.body.appendChild(newNode);
    }

    return newNode;
  }
}

export function mountIconSpriteToDom(sprite: string, nodeId?: string) {
  const node = getSvgMountNode(nodeId);
  node && (node.innerHTML = sprite);
}

type refreshIconListFunc = null | (() => any);

export let refreshIconList: refreshIconListFunc = null;

export function setRefreshSvgListAction(
  func: ({
    setSvgIconList,
    mountIconSpriteToDom
  }: {
    setSvgIconList: (arr: SvgIconGroup[]) => void;
    mountIconSpriteToDom: (str: string) => void;
  }) => any
) {
  if (func && typeof func === 'function') {
    refreshIconList = () =>
      func({
        setSvgIconList,
        mountIconSpriteToDom
      });
  } else {
    refreshIconList = null;
    throw new Error(
      'setRefreshSvgListAction need a function param, not ' + typeof func
    );
  }
}

export function setSvgIconList(
  groups: SvgIconGroup[],
  combine: boolean = true,
  local: string = getDefaultLocale()
) {
  const clonedIcons = cloneDeep(groups);
  const __: TranslateFn = makeTranslator(local);

  if (combine) {
    const allIcons: SvgIcon[] = clonedIcons
      .map((item: SvgIconGroup) => item.children)
      .flat();

    svgIcons = [
      {
        name: __('IconSelect.all'),
        groupId: 'all',
        children: allIcons
      }
    ].concat(groups);
  } else {
    svgIcons = groups;
  }
}
