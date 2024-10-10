/**
 * 点击元素外部时触发回调，用于一直存在的对象，需要手动调用删除监听器
 */
export function onClickOutside(
  element: HTMLElement,
  onClickOutside: () => void
) {
  const outsideClickListener = (event: MouseEvent) => {
    if (event.target instanceof Node && !element.contains(event.target)) {
      onClickOutside();
    }
  };

  document.addEventListener('mousedown', outsideClickListener);

  return () => {
    document.removeEventListener('mousedown', outsideClickListener);
  };
}
