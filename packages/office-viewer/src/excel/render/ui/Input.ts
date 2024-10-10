/**
 * 简单的 input 组件 封装
 */

let inputId = 0;

export class Input {
  input: HTMLInputElement;

  constructor(args: {
    container: HTMLElement;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onEnter?: (value: string) => void;
    style?: 'normal' | 'borderLess';
    options?: string[];
  }) {
    this.input = document.createElement('input');
    this.input.value = args.value || '';
    this.input.placeholder = args.placeholder || '';
    args.container.appendChild(this.input);
    this.input.className = 'excel-input';
    if (args.style === 'borderLess') {
      this.input.classList.add('excel-input-border-less');
    }
    this.input.oninput = () => {
      args.onChange(this.input.value);
    };
    this.input.onkeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        args.onEnter?.(this.input.value);
      }
    };

    if (args.options && args.options.length) {
      const datalist = document.createElement('datalist');
      datalist.id = `${inputId++}-list`;
      args.container.appendChild(datalist);
      args.options.forEach(option => {
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
