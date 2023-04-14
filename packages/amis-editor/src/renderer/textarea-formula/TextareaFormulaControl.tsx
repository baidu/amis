/**
 * @file 长文本公式输入框
 */

import React from 'react';
import cx from 'classnames';
import {Icon, FormItem, Spinner} from 'amis';
import {autobind, FormControlProps, Schema} from 'amis-core';
import CodeMirrorEditor from 'amis-ui/lib/components/CodeMirror';
import {FormulaPlugin, editorFactory} from './plugin';

import FormulaPicker, {CustomFormulaPickerProps} from './FormulaPicker';
import debounce from 'lodash/debounce';
import CodeMirror from 'codemirror';
import {getVariables} from './utils';
import {VariableItem} from 'amis-ui/lib/components/formula/Editor';
import {reaction} from 'mobx';

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
  additionalMenus?: Array<{
    label: string; // 文案（当存在图标时，为tooltip内容）
    onClick: () => void; // 触发事件
    icon?: string; // 图标
    className?: string; //外层类名
  }>;

  /**
   * 整体点击长文本公式输入框
   */
  onOverallClick?: () => void;

  /**
   * 自定义fx面板
   */
  customFormulaPicker?: React.FC<CustomFormulaPickerProps>;
}

interface TextareaFormulaControlState {
  value: string; // 当前文本值

  variables: Array<VariableItem>; // 变量数据

  formulaPickerOpen: boolean; // 是否打开公式编辑器

  formulaPickerValue: string; // 公式编辑器内容

  expressionBrace?: Array<CodeMirror.Position>; // 表达式所在位置

  isFullscreen: boolean; //是否全屏

  loading: boolean;
}

export class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tabs',
    requiredDataPropsVariables: false,
    height: 100
  };

  isUnmount: boolean;

  editorPlugin?: FormulaPlugin;
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
        const variablesArr = await getVariables(this);
        this.setState({
          variables: variablesArr
        });
      }
    );

    const variablesArr = await getVariables(this);
    this.setState({
      variables: variablesArr
    });
  }

  async componentDidUpdate(prevProps: TextareaFormulaControlProps) {
    if (this.props.data !== prevProps.data) {
      const variablesArr = await getVariables(this);
      this.setState({
        variables: variablesArr
      });
    }
    if (this.state.value !== this.props.value) {
      this.setState(
        {
          value: this.props.value
        },
        this.editorAutoMark
      );
    }
  }

  componentWillUnmount() {
    this.isUnmount = true;
    this.unReaction?.();
  }

  @autobind
  onExpressionClick(expression: string, brace?: Array<CodeMirror.Position>) {
    this.setState({
      formulaPickerValue: expression,
      formulaPickerOpen: true,
      expressionBrace: brace
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
    this.editorPlugin?.insertContent(value, 'expression', expressionBrace);
    this.setState({
      formulaPickerOpen: false,
      expressionBrace: undefined
    });

    this.closeFormulaPicker();
  }

  handleOnChange = debounce((value: any) => {
    this.props.onChange?.(value);
  }, 200);

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    const variables = this.props.variables || this.state.variables;
    return editorFactory(dom, cm, {...this.props, variables});
  }
  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.props.variables || this.state.variables;
    this.editorPlugin = new FormulaPlugin(
      editor,
      cm,
      () => ({...this.props, variables}),
      this.onExpressionClick
    );
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
  async handleFormulaClick() {
    if (this.props.onOverallClick) {
      return;
    }

    try {
      await this.handleFormulaEditorOpen();
    } catch (error) {}

    this.setState({
      formulaPickerOpen: true,
      formulaPickerValue: '',
      expressionBrace: undefined
    });
  }

  @autobind
  editorAutoMark() {
    this.editorPlugin?.autoMark();
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
      console.error('[amis-editor] onFormulaEditorOpen failed: ', error?.stack);
    }

    this.setState({loading: false});
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
      value,
      formulaPickerOpen,
      formulaPickerValue,
      isFullscreen,
      variables,
      loading
    } = this.state;

    const FormulaPickerCmp = customFormulaPicker ?? FormulaPicker;

    // 输入框样式
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    return (
      <div
        className={cx(
          'ae-TextareaFormulaControl',
          {
            'is-fullscreen': this.state.isFullscreen
          },
          className
        )}
      >
        <div className={cx('ae-TextareaResultBox')} style={resultBoxStyle}>
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
            onBlur={this.editorAutoMark}
          />
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
                  <Icon icon="function" className="icon" />
                </a>
              )}
            </li>
            {/* 附加底部按钮菜单项 */}
            {additionalMenus?.length &&
              additionalMenus?.map((item, i) => {
                return (
                  <li key={i} className={item?.className || ''}>
                    {item.icon ? (
                      <a
                        data-tooltip={item.label}
                        data-position="top"
                        onClick={() => item.onClick()}
                      >
                        <Icon icon={item.icon} className="icon" />
                      </a>
                    ) : (
                      <a onClick={() => item?.onClick()}>{item.label}</a>
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

        {formulaPickerOpen ? (
          <FormulaPickerCmp
            {...this.props}
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
export default class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
