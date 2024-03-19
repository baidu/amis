import {CT_AutoFilter} from '../../../../openxml/ExcelTypes';
import {H} from '../../../../util/H';
import {Sheet} from '../../../sheet/Sheet';
import {CheckBoxOption} from '../../ui/CheckBox';
import {CheckBoxList} from '../../ui/CheckBoxList';
import {AutoFilterIconUI} from '../AutoFilterIconUI';
import {getFilterValues} from './getFilterValues';
import {setFilterValues} from './setFilterValues';

/**
 * 按文本分类进行过滤
 */
export class FiltersUI {
  filtersContainer: HTMLElement;

  constructor(
    autoFilterIcon: AutoFilterIconUI,
    container: HTMLElement,
    sheet: Sheet,
    autoFilter: CT_AutoFilter,
    colIndex: number,
    headerRowCount: number,
    texts: string[]
  ) {
    const filtersContainer = H('div', {
      className: 'ov-excel-auto-filter__menu-filter-filters',
      parent: container
    }) as HTMLElement;

    this.filtersContainer = filtersContainer;

    const filterValues = getFilterValues(autoFilter, colIndex);

    const selectAll = filterValues.size === 0;

    const options: CheckBoxOption[] = texts.map(text => {
      return {
        text,
        value: text,
        checked: selectAll || filterValues.has(text)
      };
    });

    const selectAllText = sheet.translate('checkBox.selectAll');
    const searchPlaceholder = sheet.translate('checkBox.search');
    const checkBoxList = new CheckBoxList(
      filtersContainer,
      selectAllText,
      searchPlaceholder,
      options,
      (checked, option, options) => {
        setFilterValues(autoFilter, colIndex, options);
        sheet.applyAutoFilter(autoFilter, headerRowCount);
        sheet.getWorkbook().uiEvent.emit('APPLY_AUTO_FILTER', sheet.getIndex());
        autoFilterIcon.syncFilterIcon();
      }
    );
  }
}
