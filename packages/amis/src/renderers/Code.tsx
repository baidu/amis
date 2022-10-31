/**
 * @file 代码高亮
 */
import React from 'react';
import isPlainObject from 'lodash/isPlainObject';
import {BaseSchema} from '../Schema';
import {Renderer, RendererProps, anyChanged} from 'amis-core';
import {getPropValue} from 'amis-core';
import {isPureVariable, resolveVariableAndFilter} from 'amis-core';
import type {editor as EditorNamespace} from 'monaco-editor';

export type MonacoEditor = typeof EditorNamespace;

export type CodeBuiltinTheme = EditorNamespace.BuiltinTheme;

export type IMonaco = {
  editor: MonacoEditor;
  [propName: string]: any;
};

// 自定义语言的 token
export interface Token {
  /**
   * token 的正则
   */
  regex: string;

  /**
   * 正则的 flag
   */
  regexFlags?: string;

  /**
   * token 名称
   */
  name: string;

  /**
   * 文字颜色
   */
  color?: string;

  /**
   * 背景色，不过不知道为何没效果
   */
  background?: string;

  /**
   * 文字样式
   */
  fontStyle?: string;
}

// 自定义语言
export interface CustomLang {
  /**
   * 语言名字
   */
  name: string;

  /**
   * token
   */
  tokens: Token[];

  /**
   * 编辑器颜色相关配置，不传使用内置默认值
   */
  colors?: EditorNamespace.IColors;
}

/**
 * 代码高亮组件
 * 文档：https://baidu.gitee.io/amis/docs/components/code
 */
export interface CodeSchema extends BaseSchema {
  type: 'code';

  /**
   * 语言类型
   */
  language?:
    | 'bat'
    | 'c'
    | 'coffeescript'
    | 'cpp'
    | 'csharp'
    | 'css'
    | 'dockerfile'
    | 'fsharp'
    | 'go'
    | 'handlebars'
    | 'html'
    | 'ini'
    | 'java'
    | 'javascript'
    | 'json'
    | 'less'
    | 'lua'
    | 'markdown'
    | 'msdax'
    | 'objective-c'
    | 'php'
    | 'plaintext'
    | 'postiats'
    | 'powershell'
    | 'pug'
    | 'python'
    | 'r'
    | 'razor'
    | 'ruby'
    | 'sb'
    | 'scss'
    | 'shell'
    | 'sol'
    | 'sql'
    | 'swift'
    | 'typescript'
    | 'vb'
    | 'xml'
    | 'yaml'
    | string;

  editorTheme?: CodeBuiltinTheme;

  /**
   * tab 大小
   */
  tabSize?: number;

  /**
   * 是否折行
   */
  wordWrap?: boolean;

  /**
   * 自定义语言
   */
  customLang?: CustomLang;

  /**
   * 使用的标签，默认多行使用pre，单行使用code
   */
  wrapperComponent?: string;
}

export interface CodeProps
  extends RendererProps,
    Omit<CodeSchema, 'type' | 'className' | 'wrapperComponent'> {
  wrapperComponent?: any;
}

export default class Code extends React.Component<CodeProps> {
  static propsList: string[] = [
    'language',
    'editorTheme',
    'tabSize',
    'wordWrap',
    'customLang'
  ];

  static defaultProps: Partial<CodeProps> = {
    language: 'plaintext',
    editorTheme: 'vs',
    tabSize: 4,
    wordWrap: true
  };

  monaco: IMonaco;
  toDispose: Array<Function> = [];
  codeRef = React.createRef<HTMLElement>();
  customLang: CustomLang;
  sourceCode: string;

  constructor(props: CodeProps) {
    super(props);
  }

  shouldComponentUpdate(nextProps: CodeProps) {
    return (
      anyChanged(Code.propsList, this.props, nextProps) ||
      this.resolveLanguage(this.props) !== this.resolveLanguage(nextProps) ||
      getPropValue(this.props) !== getPropValue(nextProps)
    );
  }

  componentDidMount() {
    import('monaco-editor').then(monaco => this.handleMonaco(monaco));
  }

  async componentDidUpdate(preProps: CodeProps) {
    const props = this.props;
    const dom = this.codeRef.current;

    if (this?.monaco?.editor && dom) {
      const {tabSize} = props;
      const sourceCode = getPropValue(this.props);
      const language = this.resolveLanguage();
      const theme = this.registerAndGetTheme();
      /**
       * FIXME: https://github.com/microsoft/monaco-editor/issues/338
       * 已知问题：变量的样式存储在顶层，所以同页面中存在多个editor时，切换主题对所有editor生效
       * 每个组件单独实例化一个editor可以处理，但是成本较高，目前官方的处理方式是iframe嵌套隔离
       */
      this.monaco.editor.setTheme(theme);
      /**
       * colorizeElement可能会存在延迟加载的editor触发更新，导致sourceCode覆盖已经处理的innerHTML
       * 使用colorize，每次基于code构建HTML, 保证一致性
       */
      const colorizedHtml = await this.monaco.editor.colorize(
        sourceCode,
        language,
        {
          tabSize
        }
      );
      dom.innerHTML = colorizedHtml;
    }
  }

  async handleMonaco(monaco: any) {
    if (!monaco) {
      return;
    }

    this.monaco = monaco;
    const {tabSize} = this.props;
    const sourceCode = getPropValue(this.props);
    const language = this.resolveLanguage();
    const dom = this.codeRef.current;

    if (dom && this.monaco?.editor) {
      const theme = this.registerAndGetTheme();
      // 这里必须是异步才能准确，可能是因为 monaco 里注册主题是异步的
      this.monaco.editor.setTheme(theme);
      const colorizedHtml = await this.monaco.editor.colorize(
        sourceCode,
        language,
        {
          tabSize
        }
      );
      dom.innerHTML = colorizedHtml;
    }
  }

  resolveLanguage(props?: CodeProps) {
    const currentProps = props ?? this.props;
    const {customLang, data} = currentProps;
    let {language = 'plaintext'} = currentProps;

    if (isPureVariable(language)) {
      language = resolveVariableAndFilter(language, data);
    }

    if (customLang) {
      if (customLang.name) {
        language = customLang.name;
      }
    }

    return language;
  }

  /** 注册并返回当前主题名称，如果未自定义主题，则范围editorTheme值，默认为'vs' */
  registerAndGetTheme() {
    const monaco = this.monaco;
    const {editorTheme = 'vs'} = this.props;

    if (!monaco) {
      return editorTheme;
    }

    if (
      this.customLang &&
      this.customLang.name &&
      Array.isArray(this.customLang.tokens) &&
      this.customLang.tokens.length
    ) {
      const langName = this.customLang.name;
      const colors =
        this.customLang?.colors && isPlainObject(this.customLang?.colors)
          ? this.customLang.colors
          : {};
      monaco.languages.register({id: langName});

      const tokenizers = [];
      const rules = [];
      for (const token of this.customLang.tokens) {
        const regex = new RegExp(token.regex, token.regexFlags || undefined);
        tokenizers.push([regex, token.name]);
        rules.push({
          token: token.name,
          foreground: token.color,
          background: token.background,
          fontStyle: token.fontStyle
        });
      }

      monaco.languages.setMonarchTokensProvider(langName, {
        tokenizer: {
          root: tokenizers
        }
      });
      monaco.editor.defineTheme(langName, {
        base: 'vs',
        inherit: false,
        rules: rules,
        colors
      });

      return langName;
    }

    return editorTheme;
  }

  render() {
    const sourceCode = getPropValue(this.props);
    const {
      className,
      classnames: cx,
      editorTheme,
      customLang,
      wordWrap,
      wrapperComponent
    } = this.props;
    const language = this.resolveLanguage();
    const isMultiLine =
      typeof sourceCode === 'string' && sourceCode.split(/\r?\n/).length > 1;
    const Component = wrapperComponent || (isMultiLine ? 'pre' : 'code');

    if (customLang) {
      this.customLang = customLang;
    }

    return (
      <Component
        ref={this.codeRef}
        className={cx(
          'Code',
          {
            // 使用内置暗色主题时设置一下背景，避免看不清
            'Code--dark':
              editorTheme && ['vs-dark', 'hc-black'].includes(editorTheme),
            'Code-pre-wrap': Component === 'pre',
            'word-break': wordWrap
          },
          className
        )}
        data-lang={language}
      >
        {sourceCode}
      </Component>
    );
  }
}

@Renderer({
  type: 'code'
})
export class CodeRenderer extends Code {}
