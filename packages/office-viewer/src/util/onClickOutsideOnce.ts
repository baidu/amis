/**
 * 点击元素外部时触发回调，只触发一次，用于临时对象
 */

export function onClickOutsideOnce(
  element: HTMLElement,
  onClickOutside: () => void
) {
  const outsideClickListener = (event: MouseEvent) => {
    if (event.target instanceof Node && !element.contains(event.target)) {
      onClickOutside();
      document.removeEventListener('mousedown', outsideClickListener);
    }
  };

  document.addEventListener('mousedown', outsideClickListener);
}
