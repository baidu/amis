import {H} from '../../../util/H';

export type CheckBoxOption = {
  value: string;
  text: string;
  checked: boolean;
};

export class CheckBox {
  checkboxContainer: HTMLDivElement;

  checkbox: HTMLInputElement;

  option: CheckBoxOption;

  constructor(
    container: HTMLElement,
    option: CheckBoxOption,
    onChange: (checked: boolean, option: CheckBoxOption) => void
  ) {
    this.option = option;
    const checkboxContainer = H('div', {
      className: 'excel-checkbox-container',
      parent: container
    }) as HTMLDivElement;

    const label = H('label', {
      parent: checkboxContainer
    });

    this.checkboxContainer = checkboxContainer;

    const checkbox = H('input', {
      type: 'checkbox',
      parent: label
    }) as HTMLInputElement;

    this.checkbox = checkbox;

    checkbox.checked = option.checked;

    checkbox.onchange = () => {
      option.checked = checkbox.checked;
      onChange(checkbox.checked, option);
    };

    const checkBoxText = H('span', {
      innerText: option.text,
      parent: label
    });
  }

  getText() {
    return this.option.text;
  }

  setChecked(checked: boolean) {
    this.option.checked = checked;
    this.checkbox.checked = checked;
  }

  isChecked() {
    return this.checkbox.checked;
  }

  show() {
    this.checkboxContainer.style.display = 'block';
  }

  hide() {
    this.checkboxContainer.style.display = 'none';
  }
}
