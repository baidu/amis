/**
 * 简单的 input 组件 封装
 */

let inputId = 0;

export class Input {
  input: HTMLInputElement;

  constructor(
    container: HTMLElement,
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    style: 'normal' | 'borderLess' = 'normal',
    options: string[] = []
  ) {
    this.input = document.createElement('input');
    this.input.value = value;
    this.input.placeholder = placeholder;
    container.appendChild(this.input);
    this.input.className = 'excel-input';
    if (style === 'borderLess') {
      this.input.classList.add('excel-input-border-less');
    }
    this.input.oninput = () => {
      onChange(this.input.value);
    };

    if (options.length) {
      const datalist = document.createElement('datalist');
      datalist.id = `${inputId++}-list`;
      container.appendChild(datalist);
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        datalist.appendChild(optionElement);
      });
      this.input.setAttribute('list', datalist.id);
    }
  }

  getElement() {
    return this.input;
  }

  getValue() {
    return this.input.value;
  }

  setValue(text: string) {
    this.input.value = text;
  }

  force() {
    this.input.focus();
  }
}
