import {H} from '../../../../util/H';

/**
 * 排序按钮
 */
export class SortButtonUI {
  element: HTMLElement;

  /**
   * 是否是激活状态
   */
  active: boolean;

  constructor(
    container: HTMLElement,
    text: string,
    onClick: (active: boolean) => void,
    active: boolean,
    iconSVG: string
  ) {
    const element = H('div', {
      className: 'ov-excel-auto-filter__sort-button',
      parent: container
    });

    this.element = element;

    element.addEventListener('click', () => {
      onClick(this.active);
    });

    const icon = H('div', {
      className: 'ov-excel-auto-filter__sort-button-icon',
      parent: element
    });
    icon.innerHTML = iconSVG;

    const textElement = H('div', {
      className: 'ov-excel-auto-filter__sort-button-text',
      parent: element
    });
    textElement.textContent = text;

    this.active = active;
  }

  setActive(active: boolean) {
    this.active = active;
    if (active) {
      this.element.classList.add('ov-excel-auto-filter__sort-button-active');
    } else {
      this.element.classList.remove('ov-excel-auto-filter__sort-button-active');
    }
  }
}
