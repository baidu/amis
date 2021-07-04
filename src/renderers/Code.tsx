/**
 * @file 代码高亮
 */
import React from 'react';
import isEqual from 'lodash/isEqual';
import {BaseSchema} from '../Schema';
import {Renderer, RendererProps} from '../factory';
import {detectPropValueChanged, getPropValue} from '../utils/helper';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

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

  editorTheme?: string;

  /**
   * tab 大小
   */
  tabSize?: number;

  /**
   * 自定义语言
   */
  customLang?: CustomLang;
}

export interface CodeProps
  extends RendererProps,
    Omit<CodeSchema, 'type' | 'className'> {}

export default class Code extends React.Component<CodeProps> {
  static defaultProps: Partial<CodeProps> = {
    language: 'plaintext',
    editorTheme: 'vs',
    tabSize: 4
  };

  monaco: any;
  toDispose: Array<Function> = [];
  codeRef = React.createRef<HTMLElement>();
  customLang: CustomLang;
  sourceCode: string;

  constructor(props: CodeProps) {
    super(props);
  }

  componentDidMount() {
    import('monaco-editor').then(monaco => this.handleMonaco(monaco));
  }

  componentDidUpdate(preProps: CodeProps) {
    const props = this.props;

    const sourceCode = getPropValue(this.props);
    const preSourceCode = getPropValue(this.props);

    if (
      sourceCode !== preSourceCode ||
      (props.customLang && !isEqual(props.customLang, preProps.customLang))
    ) {
      const dom = this.codeRef.current!;
      dom.innerHTML = sourceCode;
      const theme = this.registTheme() || this.props.editorTheme || 'vs';
      setTimeout(() => {
        this.monaco.editor.colorizeElement(dom, {
          tabSize: this.props.tabSize,
          theme
        });
      }, 16);
    }
  }

  handleMonaco(monaco: any) {
    this.monaco = monaco;
    if (this.codeRef.current) {
      const dom = this.codeRef.current;
      const theme = this.registTheme() || this.props.editorTheme || 'vs';
      // 这里必须是异步才能准确，可能是因为 monaco 里注册主题是异步的
      setTimeout(() => {
        monaco.editor.colorizeElement(dom, {
          tabSize: this.props.tabSize,
          theme
        });
      }, 16);
    }
  }

  registTheme() {
    const monaco = this.monaco;
    if (!monaco) {
      return null;
    }
    if (
      this.customLang &&
      this.customLang.name &&
      this.customLang.tokens &&
      this.customLang.tokens.length
    ) {
      const langName = this.customLang.name;
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
        rules: rules
      });

      return langName;
    }
    return null;
  }

  render() {
    const {className, classnames: cx, data, customLang} = this.props;
    let language = this.props.language;
    const sourceCode = getPropValue(this.props);
    if (isPureVariable(language)) {
      language = resolveVariableAndFilter(language, data);
    }

    if (customLang) {
      if (customLang.name) {
        language = customLang.name;
      }
      this.customLang = customLang;
    }

    return (
      <code
        ref={this.codeRef}
        className={cx(`Code`, className)}
        data-lang={language}
      >
        {sourceCode}
      </code>
    );
  }
}

@Renderer({
  type: 'code'
})
export class CodeRenderer extends Code {}
