/**
 * @file 长文本公式输入框
 */

import React from 'react';
import cx from 'classnames';
import {reaction} from 'mobx';
import {CodeMirrorEditor, FormulaEditor} from 'amis-ui';
import type {VariableItem, CodeMirror} from 'amis-ui';
import {Icon, Button, FormItem, TooltipWrapper} from 'amis';
import {autobind, FormControlProps} from 'amis-core';
import {FormulaPlugin, editorFactory} from './textarea-formula/plugin';
import {renderFormulaValue} from './FormulaControl';
import FormulaPicker, {
  CustomFormulaPickerProps
} from './textarea-formula/FormulaPicker';
import {getVariables} from 'amis-editor-core';

export interface TplFormulaControlProps extends FormControlProps {
  /**
   * 用于提示的变量集合，默认为空
   */
  variables?: Array<VariableItem> | Function;

  /**
   * 配合 variables 使用
   * 当 props.variables 存在时， 是否再从 amis数据域中取变量集合，默认 false;
   */
  requiredDataPropsVariables?: boolean;

  /**
   * 变量展现模式，可选值：'tabs' ｜ 'tree'
   */
  variableMode?: 'tree' | 'tabs';

  /**
   * 自定义fx面板
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;

  /**
   * 是否可清除
   */
  clearable?: boolean;

  /**
   * 弹窗顶部标题，默认为 "表达式"
   */
  header: string;
}

interface TplFormulaControlState {
  value: string; // 当前文本值

  variables: Array<VariableItem>; // 变量数据

  formulaPickerOpen: boolean; // 是否打开公式编辑器

  formulaPickerValue: string; // 公式编辑器内容

  expressionBrace?: Array<CodeMirror.Position>; // 表达式所在位置

  tooltipStyle: {[key: string]: string}; // 提示框样式

  loading: boolean;
}

// 暂时记录输入的字符，用于快捷键判断
let preInputLocation: {start: number; end: number} | null = {
  start: 0,
  end: 0
};

export class TplFormulaControl extends React.Component<
  TplFormulaControlProps,
  TplFormulaControlState
> {
  static defaultProps: Partial<TplFormulaControlProps> = {
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    placeholder: '请输入'
  };

  wrapRef = React.createRef<HTMLDivElement>();
  tooltipRef = React.createRef<HTMLDivElement>();

  editorPlugin: FormulaPlugin;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: TplFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      tooltipStyle: {
        display: 'none'
      },
      loading: false
    };
  }

  async componentDidMount() {
    const editorStore = (window as any).editorStore;
    this.appLocale = editorStore?.appLocale;
    this.appCorpusData = editorStore?.appCorpusData;
    this.unReaction = reaction(
      () => editorStore?.appLocaleState,
      async () => {
        this.appLocale = editorStore?.appLocale;
        this.appCorpusData = editorStore?.appCorpusData;
      }
    );

    if (this.tooltipRef.current) {
      this.tooltipRef.current.addEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }
    if (this.wrapRef.current) {
      this.wrapRef.current.addEventListener(
        'keydown',
        this.handleKeyDown,
        true
      );
    }
  }

  componentWillUnmount() {
    if (this.tooltipRef.current) {
      this.tooltipRef.current.removeEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }
    if (this.wrapRef.current) {
      this.wrapRef.current.removeEventListener('keydown', this.handleKeyDown);
    }
    this.editorPlugin?.dispose();
    this.unReaction?.();
  }

  @autobind
  onExpressionMouseEnter(
    e: MouseEvent,
    expression: string,
    brace?: Array<CodeMirror.Position>
  ) {
    const wrapperRect = this.wrapRef.current?.getBoundingClientRect();
    const expressionRect = (
      e.target as HTMLSpanElement
    ).getBoundingClientRect();
    if (!wrapperRect) {
      return;
    }
    const left = expressionRect.left - wrapperRect.left;
    this.setState({
      tooltipStyle: {
        left: `${left}px`,
        width: `${expressionRect.width}px`
      },
      formulaPickerValue: expression,
      expressionBrace: brace
    });
  }

  @autobind
  hiddenToolTip() {
    this.setState({
      tooltipStyle: {
        display: 'none'
      }
    });
  }

  @autobind
  handleKeyDown(e: any) {
    // 组件禁止回车折行，否则会导致内容超过一行
    if (e.key === 'Enter') {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  @autobind
  closeFormulaPicker() {
    this.setState({formulaPickerOpen: false});
  }

  @autobind
  handleConfirm(value: any) {
    const {expressionBrace} = this.state;
    // 去除可能包裹的最外层的${}
    value = value.replace(/^\$\{(.*)\}$/, (match: string, p1: string) => p1);
    value = value ? `\${${value}}` : value;
    value = value.replace(/\r\n|\r|\n/g, ' ');
    this.editorPlugin?.insertContent(value, 'expression', expressionBrace);
    this.setState({
      formulaPickerOpen: false,
      expressionBrace: undefined
    });
  }

  @autobind
  handleOnChange(value: any) {
    this.checkOpenFormulaPicker(value);
    this.props.onChange?.(value);
  }

  // 检测用户输入'${}'自动打开表达式弹窗
  checkOpenFormulaPicker(value: string) {
    const preLength = this.props.value?.length || 0;
    // 删除了文本，无需检测
    if (value.length < preLength || value === this.props.value) {
      return;
    }
    let left = 0;
    let right = 0;
    let length = value.length;

    while (
      left < preLength &&
      value.charAt(left) === this.props.value.charAt(left)
    ) {
      left++;
    }
    while (
      right < preLength &&
      value.charAt(length - 1 - right) ===
        this.props.value.charAt(preLength - 1 - right)
    ) {
      right++;
    }
    if (preInputLocation?.end !== left) {
      preInputLocation = null;
    }

    const start = preInputLocation ? preInputLocation.start : left;
    const end = left === length - right ? left + 1 : length - right;
    const inputText = value.substring(start, end);

    if (/\$|\{|\}$/.test(inputText)) {
      if (/\$\{\}/.test(inputText)) {
        const newValue =
          value.slice(0, start) +
          inputText.replace('${}', '') +
          value.slice(end);
        this.props.onChange(newValue);

        const corsur = this.editorPlugin.getCorsur();
        this.setState({
          formulaPickerOpen: true,
          formulaPickerValue: '',
          expressionBrace: [
            {
              line: corsur?.line,
              ch: end - 3
            },
            {
              line: corsur?.line,
              ch: end
            }
          ]
        });
        preInputLocation = null;
      } else {
        preInputLocation = {
          start: left,
          ...preInputLocation,
          end
        };
      }
    } else {
      preInputLocation = null;
    }
  }

  @autobind
  handleClear() {
    this.editorPlugin?.setValue('');
  }

  /**
   * 公式编辑器打开完成一些异步任务的加载
   */
  @autobind
  async beforeFormulaEditorOpen() {
    const {node, manager, data} = this.props;
    const onFormulaEditorOpen = manager?.config?.onFormulaEditorOpen;

    this.setState({loading: true});

    try {
      if (
        manager &&
        onFormulaEditorOpen &&
        typeof onFormulaEditorOpen === 'function'
      ) {
        const res = await onFormulaEditorOpen(node, manager, data);

        if (res !== false) {
          const variables = await getVariables(this);
          this.setState({variables});
        }
      } else {
        const variables = await getVariables(this);
        this.setState({variables});
      }
    } catch (error) {
      console.error('[amis-editor] onFormulaEditorOpen failed: ', error?.stack);
    }

    this.setState({loading: false});
  }

  @autobind
  async handleFormulaClick(e: React.MouseEvent, type?: string) {
    try {
      await this.beforeFormulaEditorOpen();
    } catch (error) {}

    this.setState({
      formulaPickerOpen: true
    });

    if (type !== 'update') {
      this.setState({
        formulaPickerValue: '',
        expressionBrace: undefined
      });
    }
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    return editorFactory(dom, cm, this.props.value, {
      lineWrapping: false,
      cursorHeight: 0.85
    });
  }

  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.props.variables || this.state.variables;
    this.editorPlugin = new FormulaPlugin(editor, {
      getProps: () => ({...this.props, variables}),
      onExpressionMouseEnter: this.onExpressionMouseEnter,
      showPopover: false,
      showClearIcon: true
    });
  }

  @autobind
  editorAutoMark() {
    this.editorPlugin?.autoMark();
  }

  render() {
    const {
      className,
      header,
      label,
      placeholder,
      customFormulaPicker,
      clearable,
      ...rest
    } = this.props;
    const {
      formulaPickerOpen,
      formulaPickerValue,
      variables,
      tooltipStyle,
      loading
    } = this.state;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      variables
    ) || {
      html: formulaPickerValue
    };

    return (
      <div
        className={cx('ae-TplFormulaControl', className, {
          clearable: clearable
        })}
        ref={this.wrapRef}
      >
        <div className={cx('ae-TplResultBox')}>
          <CodeMirrorEditor
            className="ae-TplResultBox-editor"
            value={this.props.value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
          {!this.props.value && (
            <div className="ae-TplFormulaControl-placeholder">
              {placeholder}
            </div>
          )}
          {clearable && this.props.value && (
            <Icon
              icon="input-clear"
              className="input-clear-icon"
              iconContent="InputText-clear"
              onClick={this.handleClear}
            />
          )}
        </div>
        <Button
          className="ae-TplFormulaControl-button"
          size="sm"
          tooltip={{
            enterable: false,
            content: '点击配置表达式',
            tooltipTheme: 'dark',
            placement: 'left',
            mouseLeaveDelay: 0
          }}
          onClick={this.handleFormulaClick}
          loading={loading}
        >
          <Icon
            icon="input-add-fx"
            className={cx('ae-TplFormulaControl-icon', 'icon')}
          />
        </Button>

        <TooltipWrapper
          trigger="hover"
          placement="top"
          style={{fontSize: '12px'}}
          tooltip={{
            tooltipTheme: 'dark',
            children: () => renderFormulaValue(highlightValue)
          }}
        >
          <div
            className="ae-TplFormulaControl-tooltip"
            style={tooltipStyle}
            ref={this.tooltipRef}
            onClick={e => this.handleFormulaClick(e, 'update')}
          ></div>
        </TooltipWrapper>

        {formulaPickerOpen ? (
          <FormulaPickerCmp
            {...this.props}
            value={formulaPickerValue}
            initable={true}
            header={header}
            variables={variables}
            variableMode={rest.variableMode}
            evalMode={true}
            onClose={this.closeFormulaPicker}
            onConfirm={this.handleConfirm}
          />
        ) : null}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-tplFormulaControl'
})
export default class TplFormulaControlRenderer extends TplFormulaControl {}
