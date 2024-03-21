import {H} from '../../../util/H';
import {CheckBox, CheckBoxOption} from './CheckBox';
import {Input} from './Input';

/**
 * 多选框列表，目前用在自动筛选的条件选择
 */
export class CheckBoxList {
  options: CheckBoxOption[];

  listContainer: HTMLDivElement;

  checkBoxes: CheckBox[] = [];

  checkAllBox: CheckBox;

  searchInput: Input;

  constructor(
    container: HTMLElement,
    selectAllText: string,
    searchPlaceholder: string = '',
    options: CheckBoxOption[],
    onCheck: (
      checked: boolean,
      option: CheckBoxOption,
      options: CheckBoxOption[]
    ) => void
  ) {
    this.options = options;

    const wrapper = H('div', {
      className: 'excel-checkbox-list-wrapper',
      parent: container
    });

    const searchInput = new Input({
      container: wrapper,
      placeholder: searchPlaceholder,
      onChange: text => {
        this.handleSearch(text);
      }
    });

    this.searchInput = searchInput;

    const listContainer = H('div', {
      className: 'excel-checkbox-list',
      parent: wrapper
    }) as HTMLDivElement;

    this.listContainer = listContainer;

    const checkAllOption = {
      value: '__all__',
      text: selectAllText,
      checked: true
    };

    const checkAll = new CheckBox(listContainer, checkAllOption, checked => {
      this.checkBoxes.forEach(checkbox => {
        checkbox.setChecked(checked);
      });
      onCheck(checked, checkAllOption, options);
    });

    this.checkAllBox = checkAll;

    for (const option of options) {
      const checkbox = new CheckBox(
        listContainer,
        option,
        (checked, option) => {
          onCheck(checked, option, options);
          this.syncCheckAll();
        }
      );

      this.checkBoxes.push(checkbox);
    }

    this.syncCheckAll();
  }

  handleSearch(text: string) {
    if (text) {
      // 做一下过滤
      for (const checkbox of this.checkBoxes) {
        if (checkbox.getText().toLowerCase().indexOf(text.toLowerCase()) > -1) {
          checkbox.show();
        } else {
          checkbox.hide();
        }
      }
    } else {
      for (const checkbox of this.checkBoxes) {
        checkbox.show();
      }
    }
  }

  syncCheckAll() {
    const allChecked = this.checkBoxes.every(checkbox => checkbox.isChecked());
    this.checkAllBox.setChecked(allChecked);
  }

  getOptions() {
    return this.options;
  }
}
