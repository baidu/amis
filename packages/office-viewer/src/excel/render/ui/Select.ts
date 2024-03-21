export type SelectOption = {
  value: string;
  text: string;
};

export class Select<ValueType extends string> {
  element: HTMLSelectElement;

  constructor(
    container: HTMLElement,
    options: Array<{
      value: ValueType;
      text: string;
    }>,
    defaultValue: ValueType,
    onChange: (value: string) => void
  ) {
    const element = document.createElement('select');
    container.appendChild(element);
    this.element = element;
    element.className = 'excel-select';

    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value as string;
      optionElement.textContent = option.text;
      if (option.value === defaultValue) {
        optionElement.selected = true;
      }
      element.appendChild(optionElement);
    });

    element.addEventListener('change', () => {
      onChange(element.value);
    });
  }

  setValue(value: string) {
    this.element.value = value;
  }

  getValue() {
    return this.element.value as ValueType;
  }
}
