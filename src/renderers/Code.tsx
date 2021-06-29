/**
 * @file 代码高亮
 */
import React from 'react';
import {BaseSchema} from '../Schema';
import {Renderer, RendererProps} from '../factory';
import {getPropValue} from '../utils/helper';
import {isPureVariable, resolveVariableAndFilter} from '../utils/tpl-builtin';

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
    | 'yaml';

  editorTheme?: string;

  tabSize?: number;
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

  editor: any;
  toDispose: Array<Function> = [];
  codeRef = React.createRef<HTMLElement>();
  constructor(props: CodeProps) {
    super(props);
  }

  componentDidMount() {
    import('monaco-editor').then(monaco => this.handleMonaco(monaco));
  }

  componentWillUnmount() {
    this.editor?.dispose();
  }

  handleMonaco(monaco: any) {
    this.editor = monaco.editor;
    if (this.codeRef.current) {
      const dom = this.codeRef.current;
      monaco.editor.colorizeElement(dom, {
        tabSize: this.props.tabSize,
        theme: this.props.editorTheme
      });
    }
  }

  render() {
    const {className, classnames: cx, data} = this.props;
    const sourceCode = getPropValue(this.props);
    let language = this.props.language;
    if (isPureVariable(language)) {
      language = resolveVariableAndFilter(language, data);
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
