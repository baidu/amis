export interface SvgIcon {
  name: string;
  id: string;
}

export interface SvgIconTypes {
  name: string;
  typeId: string;
  icons: SvgIcon[];
}

export let svgIcons: SvgIconTypes[] = [
  {
    name: '默认分类',
    typeId: 'default',
    icons: [
      // {
      //   id: 'import',
      //   name: '导入'
      // }
    ]
  }
];


function getSvgMountNode() {
  const node = document.getElementById('amis-icon-manage-mount-node');

  if (node) {
    return node;
  }
  else {
    const newNode = document.createElement('div');
    newNode.setAttribute('id', 'amis-icon-manage-mount-node');
    newNode.setAttribute('style', 'width:0;height:0;visibility:hidden;');

    if (document.body.firstElementChild) {
      document.body.insertBefore(newNode, document.body.firstElementChild);
    }
    else {
      document.body.appendChild(newNode);
    }

    return newNode;
  }
}

export function mountIconSpiriteToDom(spirite: string) {
  const node = getSvgMountNode();
  node && (node.innerHTML = spirite);
}


type refreshIconListFunc = null | (() => any);

export let refreshIconList: refreshIconListFunc = null;

export function setRefreshSvgListAction(
  func: (
    {setSvgIconList, mountIconSpiriteToDom}: {
      setSvgIconList: (arr: SvgIconTypes[]) => void,
      mountIconSpiriteToDom: (str: string) => void
    }
  ) => any,
) {
  if (func && typeof func === 'function') {
    refreshIconList = () => func(
      {
        setSvgIconList, mountIconSpiriteToDom
      }
    );
  }
  else {
    refreshIconList = null;
    throw new Error('setRefreshSvgListAction need a function param, not ' + typeof func);
  }
}

export function setSvgIconList(icons: SvgIconTypes[]) {
  svgIcons = icons;
}
