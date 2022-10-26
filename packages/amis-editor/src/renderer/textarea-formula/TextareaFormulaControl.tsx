/**
 * @file 长文本公式输入框
 */

import React from 'react';
import isEqual from 'lodash/isEqual';
import cx from 'classnames';
import {
  Icon,
  render as amisRender,
  FormItem
} from 'amis';
import {autobind, FormControlProps, Schema} from 'amis-core';
import CodeMirrorEditor from 'amis-ui/lib/components/CodeMirror';
import {FormulaPlugin, editorFactory} from './plugin';

import FormulaPicker from './FormulaPicker';
import debounce from 'lodash/debounce';
import CodeMirror from 'codemirror';

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

  expressionBrace?: Array<CodeMirror.Position>; // 表达式所在位置

  isFullscreen: boolean; //是否全屏
}

export class TextareaFormulaControl extends React.Component<
  TextareaFormulaControlProps,
  TextareaFormulaControlState
> {
  static defaultProps: Partial<TextareaFormulaControlProps> = {
    variableMode: 'tabs',
    height: 100
  };

  isUnmount: boolean;

  wrapRef: any;

  editorPlugin?: FormulaPlugin;

  constructor(props: TextareaFormulaControlProps) {
    super(props);
    this.state = {
      value: '',
      variables: [],
      menusList: [],
      formulaPickerOpen: false,
      formulaPickerValue: '',
      isFullscreen: false
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
            expressionBrace: undefined
          })
        }
      }
    ];
    this.setState({
      menusList: [...menusList, ...additionalMenus]
    });
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
  }, 1000)

  @autobind
  editorFactory(dom: HTMLElement, cm: any) {
    const variables = this.props.variables || this.state.variables;
    return editorFactory(dom, cm, {...this.props, variables});
  }
  @autobind
  handleEditorMounted(cm: any, editor: any) {
    const variables = this.props.variables || this.state.variables;
    this.editorPlugin = new FormulaPlugin(editor, cm, () => ({...this.props, variables}), this.onExpressionClick);
  }

  @autobind
  handleFullscreenModeChange() {
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
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
    const {value, menusList, formulaPickerOpen, formulaPickerValue, isFullscreen} = this.state;

    const variables = rest.variables || this.state.variables || [];

    // 输入框样式
    let resultBoxStyle: {[key in string]: string} = {};
    if (height) {
      resultBoxStyle.height = `${height}px`;
    }

    return (
      <div className={cx('ae-TextareaFormulaControl', {'is-fullscreen': this.state.isFullscreen})} ref={(ref: any) => this.wrapRef = ref}>
        <div
          className={cx('ae-TextareaResultBox')}
          style={resultBoxStyle}
        >
          <CodeMirrorEditor
            className="ae-TextareaResultBox-editor"
            value={value}
            onChange={this.handleOnChange}
            editorFactory={this.editorFactory}
            editorDidMount={this.handleEditorMounted}
          />
          {amisRender({
            type: 'dropdown-button',
            className: 'ae-TextareaResultBox-dropdown',
            menuClassName: 'ae-TextareaResultBox-menus',
            popOverContainer: this.wrapRef,
            label: '',
            level: 'link',
            size: 'md',
            icon: 'fa fa-plus',
            trigger: 'hover',
            closeOnClick: true,
            closeOnOutside: true,
            hideCaret: true,
            buttons: menusList
          })}
          <div className="ae-TextareaResultBox-fullscreen">
            <a
              className={cx('Modal-fullscreen')}
              data-tooltip={
                isFullscreen
                  ? '退出全屏'
                  : '全屏'
              }
              data-position="left"
              onClick={this.handleFullscreenModeChange}
            >
              <Icon
                icon={isFullscreen ? 'compress-alt' : 'expand-alt'}
                className="icon"
              />
            </a>
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
export default class TextareaFormulaControlRenderer extends TextareaFormulaControl {}
