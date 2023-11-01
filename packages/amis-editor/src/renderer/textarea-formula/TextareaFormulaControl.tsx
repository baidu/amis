/**
 * @file 长文本公式输入框
 */

import React, {MouseEvent} from 'react';
import cx from 'classnames';
import {Icon, FormItem, TooltipWrapper, Spinner} from 'amis';
import {autobind, FormControlProps, render as renderAmis} from 'amis-core';
import {CodeMirrorEditor, FormulaEditor} from 'amis-ui';
import type {VariableItem, CodeMirror} from 'amis-ui';
import {FormulaPlugin, editorFactory} from './plugin';

import FormulaPicker, {CustomFormulaPickerProps} from './FormulaPicker';
import {reaction} from 'mobx';
import {renderFormulaValue} from '../FormulaControl';
import {getVariables} from 'amis-editor-core';
import {findDOMNode} from 'react-dom';

export interface AdditionalMenuClickOpts {
  /**
   * 当前表达式值
   */
  value: string;
  /**
   * 对表达式重新赋值
   * @param value
   * @returns
   */
  setValue: (value: string) => void;
  /**
   * 在光标位置插入新的值
   * @param content 要插入的内容
   * @param type 插入内容的类型，目前支持表达式expression 和普通文本string
   * @param brace 自定义插入的位置
   * @returns
   */
  insertContent: (
    content: string,
    type: 'expression' | 'string',
    brace?: Array<CodeMirror.Position>
  ) => void;
}

export interface AdditionalMenu {
  label: string; // 文案（当存在图标时，为tooltip内容）
  onClick?: (
    e: MouseEvent<HTMLAnchorElement>,
    opts: AdditionalMenuClickOpts
  ) => void; // 触发事件
  icon?: string; // 图标
  className?: string; //外层类名
}
export interface TextareaFormulaControlProps extends FormControlProps {
  /**
   * 输入框的高度， 默认 100 px
   */
  height?: number;

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
   *  附加底部按钮菜单项
   */
  additionalMenus?: Array<AdditionalMenu>;

  /**
   * 整体点击长文本公式输入框
   */
  onOverallClick?: () => void;

  /**
   * 自定义fx面板
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;

  /**
   * 自定义标记文本
   * @param editor
   * @returns
   */
  customMarkText?: (editor: CodeMirror.Editor) => void;

  /**
   * 插件初始化生命周期回调
   * @param plugin 插件实例，内部包含公式插件的方法
   * @returns
   */
  onPluginInit?: (plugin: FormulaPlugin) => void;

  /**
   * 弹窗顶部标题，默认为 "表达式"
   */
  header: string;
}

interface TextareaFormulaControlState {
  value: string; // 当前文本值

  variables: Array<VariableItem>; // 变量数据

  formulaPickerOpen: boolean; // 是否打开公式编辑器

  formulaPickerValue: string; // 公式编辑器内容

  expressionBrace?: Array<CodeMirror.Position>; // 表达式所在位置

  isFullscreen: boolean; //是否全屏

  tooltipStyle: {[key: string]: string}; // 提示框样式

  loading: boolean;
}

export class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tree',
    requiredDataPropsVariables: false,
    height: 100,
    placeholder: '请输入'
  };

  wrapRef = React.createRef<HTMLDivElement>();

  tooltipRef = React.createRef<HTMLDivElement>();

  editorPlugin: FormulaPlugin;
  unReaction: any;
  appLocale: string;
  appCorpusData: any;

  constructor(props: TextareaFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      isFullscreen: false,
      tooltipStyle: {},
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
  }

  async componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    if (
      this.state.value !== this.props.value &&
      prevProps.value !== this.props.value
    ) {
      this.setState(
        {
          value: this.props.value
        },
        this.editorAutoMark
      );
      this.editorPlugin.setValue(this.props.value || '');
    }
  }

  componentWillUnmount() {
    if (this.tooltipRef.current) {
      this.tooltipRef.current.removeEventListener(
        'mouseleave',
        this.hiddenToolTip
      );
    }
    this.editorPlugin?.dispose();

    this.unReaction?.();
  }

  @autobind
  onExpressionMouseEnter(
    e: any,
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
    const top = expressionRect.top - wrapperRect.top;
    this.setState({
      tooltipStyle: {
        left: `${left}px`,
        top: `${top}px`,
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
    this.setState({value});
    this.props.onChange?.(value);
  }

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    return editorFactory(dom, cm, this.props.value);
  }
  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.state.variables || this.props.variables || [];
    this.editorPlugin = new FormulaPlugin(editor, {
      getProps: () => ({...this.props, variables}),
      onExpressionMouseEnter: this.onExpressionMouseEnter,
      customMarkText: this.props.customMarkText,
      onPluginInit: this.props.onPluginInit,
      showClearIcon: true
    });
  }

  @autobind
  handleFullscreenModeChange() {
    if (this.props.onOverallClick) {
      return;
    }
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  }

  @autobind
  async handleFormulaEditorOpen() {
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
      }
    } catch (error) {
      console.error(
        '[amis-editor][TextareaFormulaControl] onFormulaEditorOpen failed: ',
        error?.stack
      );
    }

    this.setState({loading: false});
  }

  @autobind
  async handleFormulaClick(e: React.MouseEvent, type?: string) {
    if (this.props.onOverallClick) {
      return;
    }

    try {
      await this.handleFormulaEditorOpen();
    } catch (error) {}

    const variablesArr = await getVariables(this);

    this.setState({
      variables: variablesArr,
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
  editorAutoMark() {
    this.editorPlugin?.autoMark();
  }

  @autobind
  handleAddtionalMenuClick(
    e: MouseEvent<HTMLAnchorElement>,
    item: AdditionalMenu
  ) {
    item.onClick?.(e, {
      value: this.props.value || '',
      setValue: this.editorPlugin.setValue,
      insertContent: this.editorPlugin.insertContent
    });
  }

  render() {
    const {
      className,
      header,
      label,
      placeholder,
      height,
      additionalMenus,
      onOverallClick,
      customFormulaPicker,
      ...rest
    } = this.props;
    const {
      formulaPickerOpen,
      formulaPickerValue,
      isFullscreen,
      variables,
      tooltipStyle,
      loading
    } = this.state;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    // 输入框样式
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    const highlightValue = FormulaEditor.highlightValue(
      formulaPickerValue,
      variables
    ) || {
      html: formulaPickerValue
    };

    return (
      <div
        className={cx(
          'ae-TextareaFormulaControl',
          {
            'is-fullscreen': this.state.isFullscreen
          },
          className
        )}
        ref={this.wrapRef}
      >
        <div className={cx('ae-TextareaResultBox')} style={resultBoxStyle}>
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={this.props.value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
          {!this.state.value && (
            <div className="ae-TextareaResultBox-placeholder">
              {placeholder}
            </div>
          )}
          <ul className="ae-TextareaResultBox-footer">
            <li className="ae-TextareaResultBox-footer-fullscreen">
              <a
                className={cx('Modal-fullscreen')}
                data-tooltip={isFullscreen ? '退出全屏' : '全屏'}
                data-position="top"
                onClick={this.handleFullscreenModeChange}
              >
                <Icon
                  icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
                  className="icon"
                />
              </a>
            </li>
            <li
              className={cx('ae-TextareaResultBox-footer-fxIcon', {
                'is-loading': loading
              })}
            >
              {loading ? (
                <Spinner show icon="reload" size="sm" />
              ) : (
                <a
                  data-tooltip="表达式"
                  data-position="top"
                  onClick={this.handleFormulaClick}
                >
                  <Icon icon="input-add-fx" className="icon" />
                </a>
              )}
            </li>
            {/* 附加底部按钮菜单项 */}
            {Array.isArray(additionalMenus) &&
              additionalMenus.length > 0 &&
              additionalMenus?.map((item, i) => {
                return (
                  <li key={i}>
                    {item.icon ? (
                      <a
                        data-tooltip={item.label}
                        data-position="top"
                        onClick={e => this.handleAddtionalMenuClick(e, item)}
                      >
                        {renderAmis({
                          type: 'icon',
                          icon: item.icon,
                          vendor: '',
                          className: item.className
                        })}
                      </a>
                    ) : (
                      <a onClick={e => this.handleAddtionalMenuClick(e, item)}>
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>

        {!!onOverallClick ? (
          <div
            className={cx('ae-TextareaResultBox-overlay')}
            onClick={onOverallClick}
          ></div>
        ) : null}

        <TooltipWrapper
          container={() => findDOMNode(this) as HTMLElement}
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
            variables={variables}
            header={header}
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
  type: 'ae-textareaFormulaControl'
})
export default class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
