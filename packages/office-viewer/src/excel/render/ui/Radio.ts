let radioId = 0;
/**
 * radio 的简单封装
 */
export class Radio<ValueType extends string> {
  element: HTMLDivElement;

  constructor(
    container: HTMLElement,
    options: Array<{
      value: ValueType;
      text: string;
    }>,
    defaultValue: ValueType,
    onChange?: (value: string) => void
  ) {
    const radioWrapper = document.createElement('div');
    container.appendChild(radioWrapper);
    radioWrapper.className = 'excel-radio-wrapper';
    for (const option of options) {
      const id = `${radioId++}-${option.value}`;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.value = option.value as string;
      radio.checked = option.value === defaultValue;
      radio.name = 'excel-radio';
      radio.id = id;
      radio.onchange = () => {
        onChange?.(radio.value);
      };
      radioWrapper.appendChild(radio);
      const label = document.createElement('label');
      label.innerText = option.text;
      label.htmlFor = id;
      radioWrapper.appendChild(label);
    }

    this.element = radioWrapper;
  }

  getValue() {
    const radio = this.element.querySelector(
      'input:checked'
    ) as HTMLInputElement;
    return radio?.value as ValueType;
  }
}
