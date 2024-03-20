/**
 * 获取鼠标移动时相对于容器的位置
 */
export function getMouseRelativePosition(
  container: HTMLElement,
  event: MouseEvent
) {
  const dataContainerOffset = container.getBoundingClientRect();
  const offsetX = event.clientX - dataContainerOffset.x;
  const offsetY = event.clientY - dataContainerOffset.y;
  return {offsetX, offsetY};
}
