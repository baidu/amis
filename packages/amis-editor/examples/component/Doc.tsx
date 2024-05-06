import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {getSchemaTpl, tipedLabel} from 'amis-editor-core';
import 'amis';
import '../../src/index';
import PanelPreview from './PanelPreview';
export interface DocProps {
  children?: string | null | undefined;
}

export function mdComment(fun: Function) {
  const txt = fun.toString();
  return txt;
}

function str2schema(code: string) {
  const fn = new Function('getSchemaTpl', 'tipedLabel', `return [${code}]`);
  return fn.call(null, getSchemaTpl, tipedLabel);
}

export default function Doc({children}: DocProps) {
  return (
    <div className="markdown">
      <div className="markdown-body">
        <Markdown
          children={children}
          remarkPlugins={[remarkGfm]}
          components={{
            pre(props) {
              if ((props.children as any)?.props?.className) {
                return <>{props.children}</>;
              }

              return <code>{props.children}</code>;
            },
            code(props) {
              const {children, className, node, ref, ...rest} = props;
              const match = /language-(\w+)/.exec(className || '');

              if (match?.[1] === 'schema') {
                const schema = str2schema(children as string);

                return (
                  <div className="schema-tpl-preview">
                    <code>
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={'jsx'}
                        style={darcula}
                      />
                    </code>

                    <PanelPreview schema={schema} />
                  </div>
                );
              }

              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={darcula}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            }
          }}
        />
      </div>
    </div>
  );
}
