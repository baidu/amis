/**
 * 简单的按钮组件
 */
export class Button {
  button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    style: 'primary' | 'normal',
    text: string,
    onClick: () => void
  ) {
    this.button = document.createElement('button');
    this.button.innerText = text;
    container.appendChild(this.button);
    this.button.className = `excel-button excel-button-${style}`;
    this.button.onclick = onClick;
  }
}
