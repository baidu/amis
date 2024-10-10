import {
  CT_AutoFilter,
  CT_CustomFilter,
  ST_FilterOperator
} from '../../../../openxml/ExcelTypes';
import {H} from '../../../../util/H';
import {isNumeric} from '../../../../util/isNumeric';
import {Sheet} from '../../../sheet/Sheet';
import {Input} from '../../ui/Input';
import {Radio} from '../../ui/Radio';
import {Select, SelectOption} from '../../ui/Select';
import type {AutoFilterIconUI} from '../AutoFilterIconUI';
import {OperatorOptions, OperatorTypeUI} from './OperatorTypeUI';
import {buildOperatorOptions} from './buildOperatorOptions';
import {fromOperatorUI} from './fromOperatorUI';
import {getCustomFilters} from './getCustomFilters';
import {setCustomFilters} from './setCustomFilters';
import {toOperatorUI} from './toOperatorUI';

type CustomFilterItem = {
  select: Select<OperatorTypeUI>;
  input: Input;
};

type AND = 'and' | 'or';

export class CustomFiltersUI {
  customFiltersContainer: HTMLDivElement;

  /**
   * 操作符选项，会根据值不同类型变化
   */
  operatorOptions: OperatorOptions[] = [];

  /**
   * 值类型
   */
  valueType: 'text' | 'number' | 'date' = 'text';

  sheet: Sheet;

  customFilterItems: CustomFilterItem[] = [];

  autoFilter: CT_AutoFilter;

  colIndex: number;

  headerRowCount: number;

  autoFilterIcon: AutoFilterIconUI;

  texts: string[];

  andRadio?: Radio<AND>;

  constructor(
    autoFilterIcon: AutoFilterIconUI,
    container: HTMLElement,
    sheet: Sheet,
    autoFilter: CT_AutoFilter,
    colIndex: number,
    headerRowCount: number,
    texts: string[],
    isDate: boolean
  ) {
    this.sheet = sheet;
    this.colIndex = colIndex;
    this.autoFilter = autoFilter;
    this.headerRowCount = headerRowCount;
    this.autoFilterIcon = autoFilterIcon;
    this.texts = texts;

    if (texts.every(isNumeric)) {
      this.valueType = 'number';
    }

    if (isDate) {
      this.valueType = 'date';
    }

    this.buildOperatorOptions();

    const customFiltersContainer = H('div', {
      className: 'ov-excel-auto-filter-menu__custom-filters',
      parent: container
    }) as HTMLDivElement;

    this.customFiltersContainer = customFiltersContainer;

    const customFilters = getCustomFilters(autoFilter, colIndex);

    const customFilter = customFilters?.customFilter || [];

    if (customFilter.length) {
      if (customFilter.length === 1) {
        this.buildCustomFilterItem(customFilter[0]);
        this.buildCustomFilterItemAnd();
        // 生成一个空的
        this.buildCustomFilterItem();
      } else if (customFilter.length === 2) {
        this.buildCustomFilterItem(customFilter[0]);
        this.buildCustomFilterItemAnd();
        this.buildCustomFilterItem(customFilter[1]);
      } else {
        for (const filter of customFilter) {
          this.buildCustomFilterItem(filter);
        }
      }
    } else {
      // 默认生成一个空的
      this.buildCustomFilterItem();
    }
  }

  /**
   * 构建操作符选项
   */
  buildOperatorOptions() {
    this.operatorOptions = buildOperatorOptions(
      this.valueType,
      this.sheet.translate.bind(this.sheet)
    );
  }

  /**
   * 构建 and 或 or 选项
   */
  buildCustomFilterItemAnd(and?: boolean): void {
    if (and === undefined) {
      and = true;
    }
    const radioOptions = [
      {
        text: this.sheet.translate('customFilter.and'),
        value: 'and'
      },
      {
        text: this.sheet.translate('customFilter.or'),
        value: 'or'
      }
    ] as Array<{
      text: string;
      value: AND;
    }>;

    this.andRadio = new Radio<AND>(
      this.customFiltersContainer,
      radioOptions,
      and ? 'and' : 'or',
      value => {
        this.syncCustomFilters();
      }
    );
  }

  buildCustomFilterItem(customFilter?: CT_CustomFilter) {
    const operator = customFilter?.operator || 'equal';
    // 这里直接将 * 全都去掉了
    const value = (customFilter?.val || '').replace(/\*/g, '');
    const customFiltersContainer = this.customFiltersContainer;

    const customFilterItemInput = H('div', {
      className: 'ov-excel-auto-filter-menu__custom-filters-item-input',
      parent: customFiltersContainer
    });

    const select = new Select<OperatorTypeUI>(
      customFilterItemInput,
      this.operatorOptions,
      toOperatorUI(operator, value),
      () => {
        this.syncCustomFilters();
      }
    );

    const input = new Input({
      container: customFilterItemInput,
      value,
      onChange: () => {
        this.syncCustomFilters();
      },
      style: 'normal',
      options: this.texts
    });

    this.customFilterItems.push({input, select});
  }

  /**
   * 同步自定义筛选
   */
  syncCustomFilters() {
    const sheet = this.sheet;
    const autoFilter = this.autoFilter;
    const headerRowCount = this.headerRowCount;
    const customFilters = this.customFilterItems
      .map(item => {
        return fromOperatorUI(item.select.getValue(), item.input.getValue());
      })
      .filter(item => item.val !== '');

    const andValue = this.andRadio?.getValue();

    let and = true;
    if (andValue === 'or') {
      and = false;
    }

    // 当有输入内容且当前
    if (this.customFilterItems.length === 1 && customFilters.length === 1) {
      this.buildCustomFilterItemAnd();
      this.buildCustomFilterItem();
    }

    setCustomFilters(autoFilter, this.colIndex, {
      and,
      customFilter: customFilters
    });

    sheet.applyAutoFilter(autoFilter, headerRowCount);
    sheet.getWorkbook().uiEvent.emit('APPLY_AUTO_FILTER', sheet.getIndex());
    this.autoFilterIcon.syncFilterIcon();
  }
}
