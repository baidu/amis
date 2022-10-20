/**
 * @file 长文本公式输入框
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import cx from 'classnames';
import {
  Icon,
  isExpression,
  render as amisRender,
  TooltipWrapper,
  FormItem
} from 'amis';
import {autobind, FormControlProps, Schema} from 'amis-core';
import {FormulaEditor} from 'amis-ui/lib/components/formula/Editor';
import FormulaPicker from './FormulaPicker';

export interface TextareaFormulaControlProps extends FormControlProps {
  height?: number; // 输入框的高度

  variables?: any; // 公式变量

  variableMode?: 'tree' | 'tabs';

  additionalMenus?: Array<Schema> // 附加底部按钮菜单项
}

interface TextareaFormulaControlState {
  value: string; // 当前文本值

  variables: any; // 变量数据

  menusList: Schema[]; // 底部按钮菜单

  formulaPickerOpen: boolean; // 是否打开公式编辑器

  formulaPickerValue: string; // 公式编辑器内容

  formulaPickerReplaceIdx: number; // 替换表达式的索引，-1代表新增表达式

  expressionList: string[]; // value中包含的表达式列表

  cursorStartOffset: number; // 光标偏移量

  cursorRangeText: string; // 光标所处的文本
}

// 用于替换现有表达式
const REPLACE_KEY = 'TEXTAREA_FORMULA_REPLACE_KEY';

export default class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tabs'
  };

  isUnmount: boolean;

  inputRef: any;

  wrapRef: any;

  constructor(props: TextareaFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      menusList: [],
      expressionList: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      formulaPickerReplaceIdx: -1,
      cursorStartOffset: 0,
      cursorRangeText: ''
    };
  }

  componentDidMount() {
    const {additionalMenus = [], value} = this.props;
    const menusList = [
      {
        type: 'button',
        label: '表达式',
        onClick: () => {
          this.setState({
            formulaPickerOpen: true,
            formulaPickerValue: '',
            formulaPickerReplaceIdx: -1
          })
        }
      }
    ];
    this.setState({
      menusList: [...menusList, ...additionalMenus]
    });
    this.initExpression(value);
  }

  componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    // 优先使用props中的变量数据
    if (!this.props.variables) {
      // 从amis数据域中取变量数据
      this.resolveVariablesFromScope().then(variables => {
        if (Array.isArray(variables)) {
          const vars = variables.filter(item => item.children?.length);
          if (!this.isUnmount && !isEqual(vars, this.state.variables)) {
            this.setState({
              variables: vars
            });
          }
        }
      });
    }

    if (prevProps.value !== this.props.value) {
      this.initExpression(this.props.value);
    }
  }
  componentWillUnmount() {
    this.isUnmount = true;
  }

  async resolveVariablesFromScope() {
    const {node, manager} = this.props.formProps || this.props;
    await manager?.getContextSchemas(node);
    const dataPropsAsOptions = manager?.dataSchema?.getDataPropsAsOptions();

    if (dataPropsAsOptions) {
      return dataPropsAsOptions.map((item: any) => ({
        selectMode: 'tree',
        ...item
      }));
    }
    return [];
  }

  @autobind
  initExpression(value: string) {
    let replacedValue = '';
    const expressionList: string[] = [];
    if (value && typeof value === 'string') {
      // 先把 \${ 转成 \_&{ 方便后面正则处理
      value = value.replace(/\\\${/g, '\\_&{');

      replacedValue = value.replace(/\${([^{}]*)}/g, (match: string, p1: string) => {
        expressionList.push(p1);
        return REPLACE_KEY;
      });
      replacedValue = replacedValue.replace(/\\_\&{/g, '${');
    }
    this.setState({
      expressionList,
      value: replacedValue
    });
  }

  /**
   * 将当前输入框中的值转化成最终的值
   */
  @autobind
  revertFinalValue(inputValue: any): any {
    // 将 ${xx}（非 \${xx}）替换成 \${xx}，手动编辑时，自动处理掉 ${xx}，避免识别成 公式表达式
    if (inputValue && isString(inputValue) && (isExpression(inputValue) || inputValue.includes('${}'))) {
      inputValue = inputValue.replace(/(^|[^\\])\$\{/g, '\\${');
    }

    // 将表达式转化成对应的表达式
    const reg = /<div class="ae-TextareaResultBox-expression"(.*?)>表达式.*?<\/div>/g;
    inputValue = inputValue.replace(reg, (match: string) => (
      match.replace(/.*data-expression="(.*?)".*/g, (match: string, p1: string) => p1 ? `\${${p1}}` : '')
    ));
    return inputValue;
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  @autobind
  handleConfirm(value: any) {
    const {formulaPickerReplaceIdx, cursorStartOffset, cursorRangeText} = this.state;
    // 去除可能包裹的最外层的${}
    value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    // 获取焦点
    this.inputRef?.focus();
    // 替换表达式
    if (~formulaPickerReplaceIdx) {
      this.replaceExpression(formulaPickerReplaceIdx, value);
    } else if (value) {
      if (cursorRangeText && this.inputRef) {
        let innerHTML = this.inputRef.innerHTML;
        const cursorIndex = innerHTML.indexOf(cursorRangeText) + cursorStartOffset;
        // 将表达式通过__&[[]]进行包裹，使用${}会被转成\${}
        const formula = `__&[[${value}]]`;
        // 在光标位置进行添加
        innerHTML = innerHTML.slice(0, cursorIndex) + formula + innerHTML.slice(cursorIndex);
        value = this.revertFinalValue(innerHTML);
        // 将__&[[]]转化为${}
        value = value.replace(/__\&\[\[(.*)\]\]/, (match: string, p1: string) => `\${${p1}}`)
      } else { // 添加到最后
        const formula = `\${${value.replace(/^\$\{(.*)\}$/,(match: string, p1: string) => p1)}}`;

        // 多加一个空格避免部分浏览器不能再表达式后面输入的问题
        value = this.props.value + formula + ' ';
      }
      this.props?.onChange?.(value);
      setTimeout(() => {
        const selection = getSelection();
        selection?.selectAllChildren(this.inputRef);
        selection?.collapseToEnd();
      });
    }
    
    this.closeFormulaPicker();
  }

  @autobind
  handleTextareaBlur(e: React.FocusEvent<HTMLElement>) {
    this.recordLastSelectionRange();
    let inputValue = e.currentTarget.innerHTML?.trim();
    inputValue = inputValue.replace(/(\<br>)|(\&nbsp;)|(\&nbsp)/g, '');
    
    const curValue = this.revertFinalValue(inputValue);
    if (curValue !== this.props.value) {
      this.props?.onChange?.(curValue);
    }
  }

  @autobind
  handleTextareaKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // 不支持输入回车键，因为回车键在不同浏览器重表现不同，有的会加上<div>标签
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  @autobind
  replaceExpression(index: number, value: string = '') {
    const {expressionList} = this.state;
    expressionList.splice(index, 1, value);
    this.setState({expressionList});
    // 组件更新完后再更新value
    setTimeout(() => {
      const curValue = this.revertFinalValue(this.inputRef.innerHTML);
      this.props?.onChange(curValue);
    });
  }


  @autobind
  removeExpression(e: React.MouseEvent<HTMLElement>, idx: number) {
    e.stopPropagation();
    this.replaceExpression(idx);
  }

  // 记录失焦时的光标位置
  @autobind
  recordLastSelectionRange() {
    const selection = getSelection();
    const lastEditRange = selection?.getRangeAt(0);
    const startContainer: any = lastEditRange?.startContainer;
    let cursorStartOffset = 0;
    let cursorRangeText = '';
    if (startContainer?.parentNode?.className === 'ae-TextareaResultBox-input') {
      cursorStartOffset = lastEditRange?.startOffset || 0;
      cursorRangeText = startContainer?.data;
    }

    this.setState({
      cursorStartOffset,
      cursorRangeText
    });
  }

  @autobind
  renderExpressionItem(value: string, idx: number) {
    const highlightValue = FormulaEditor.highlightValue(value, this.state.variables) || {
      html: value
    };
    return (
      <TooltipWrapper
        trigger="hover"
        placement="bottom"
        key={value + idx}
        tooltip={{
          children: () => this.renderFormulaValue(highlightValue)
        }}
      >
        <div
          className="ae-TextareaResultBox-expression"
          contentEditable={false}
          data-expression={value}
          onClick={(e) => {
            this.setState({
              formulaPickerOpen: true,
              formulaPickerValue: value || '',
              formulaPickerReplaceIdx: idx
            })
          }}
        >
          表达式
          <Icon
            icon="close"
            className="icon"
            onClick={(e: React.MouseEvent<HTMLElement>) => this.removeExpression(e, idx)}
          />
        </div>
      </TooltipWrapper>
    );
  }

  @autobind
  renderFormulaValue(item: any) {
    const html = {__html: item.html};
    // bca-disable-next-line
    return <span dangerouslySetInnerHTML={html}></span>;
  }

  @autobind
  getTextareaViewValue(value: string, expressionList: string[] = []) {
    let replaceStartIdx = value.indexOf(REPLACE_KEY);
    let idx = 0;
    let result: any = [];
    while(~replaceStartIdx) {
      const preStr = value.slice(0, replaceStartIdx);
      value = value.slice(replaceStartIdx + REPLACE_KEY.length);
      replaceStartIdx = value.indexOf(REPLACE_KEY);
      if (preStr) {
        result.push(preStr);
      }
      result.push(this.renderExpressionItem(expressionList[idx], idx));
      idx++;
    }
    if (value) {
      result.push(value);
    }
    return (
      <>
        {result.map((item: string | React.ReactNode) => item)}
      </>
    );
  }

  render() {
    const {
      className,
      header,
      label,
      placeholder,
      height,
      ...rest
    } = this.props;
    const {value, expressionList, menusList, formulaPickerOpen, formulaPickerValue} = this.state;

    const textareaValues = this.getTextareaViewValue(value, expressionList);

    const variables = rest.variables || this.state.variables || [];

    // 输入框样式
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    return (
      <div className={cx('ae-TextareaFormulaControl')} ref={(ref: any) => this.wrapRef = ref}>
        <div className='ae-TextareaResultBox' style={resultBoxStyle}>
          <div className="ae-TextareaResultBox-content">
            <div
              key={value}
              className='ae-TextareaResultBox-input'
              ref={(ref: any) => this.inputRef = ref}
              contentEditable
              suppressContentEditableWarning
              onBlur={this.handleTextareaBlur}
              onKeyDown={this.handleTextareaKeyDown}
            >
              {textareaValues}
            </div>
            {amisRender({
              type: 'dropdown-button',
              className: 'ae-TextareaResultBox-dropdown',
              menuClassName: 'ae-TextareaResultBox-menus',
              popOverContainer: this.wrapRef,
              label: '',
              level: 'link',
              size: 'md',
              icon: 'fa fa-plus',
              placement: 'top',
              trigger: 'hover',
              closeOnClick: true,
              closeOnOutside: true,
              hideCaret: true,
              buttons: menusList
            })}
          </div>
        </div>
        {formulaPickerOpen ? (
          <FormulaPicker
            value={formulaPickerValue}
            initable={true}
            variables={variables}
            variableMode={rest.variableMode}
            evalMode={true}
            onClose={() => this.setState({formulaPickerOpen: false})}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-textareaFormulaControl'
})
export class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
