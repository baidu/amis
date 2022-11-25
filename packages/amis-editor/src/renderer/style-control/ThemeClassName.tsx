/**
 * 类名输入框 + 自定义样式源码编辑器
 */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Editor, Icon, Overlay, PopOver} from 'amis-ui';
import {FormControlProps, FormItem, render} from 'amis-core';
import {parse as cssParse} from 'postcss';
import {PlainObject} from './types';
import {debounce} from 'lodash';

const valueMap: PlainObject = {
  'margin-top': 'marginTop',
  'margin-right': 'marginRight',
  'margin-bottom': 'marginBottom',
  'margin-left': 'marginLeft',
  'padding-top': 'paddingTop',
  'padding-right': 'paddingRight',
  'padding-bottom': 'paddingBottom',
  'padding-left': 'paddingLeft',
  'border-top-width': 'top-border-width',
  'border-right-width': 'right-border-width',
  'border-bottom-width': 'bottom-border-width',
  'border-left-width': 'left-border-width',
  'border-top-style': 'top-border-style',
  'border-right-style': 'right-border-style',
  'border-bottom-style': 'bottom-border-style',
  'border-left-style': 'left-border-style',
  'border-top-color': 'top-border-color',
  'border-right-color': 'right-border-color',
  'border-bottom-color': 'bottom-border-color',
  'border-left-color': 'left-border-color',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'line-height': 'lineHeight'
};

const fontStyle = [
  'color',
  'font-weight',
  'font-size',
  'font-style',
  'text-decoration',
  'text-align',
  'vertical-align',
  'font-family',
  'line-height'
];

function AmisStyleCodeEditor(props: FormControlProps) {
  const {name, value: classname} = props;
  const [value, setValue] = useState('');

  function getCssAndSetValue(classname?: string, name?: string) {
    const id = classname?.replace(name + '-', '');
    const dom = document.getElementById(id || '') || null;
    const content = dom?.innerHTML || '';
    const ast = cssParse(content);
    const nodes: any[] = [];
    ast.nodes.forEach((node: any) => {
      const selector = node.selector;
      if (!selector.endsWith('.hover') && !selector.endsWith('.active')) {
        nodes.push(node);
      }
    });
    ast.nodes = nodes;

    const css = nodes
      .map(node => {
        const style = node.nodes.map((n: any) => `${n.prop}: ${n.value};`);
        return `${node.selector} {\n  ${style.join('\n  ')}\n}`;
      })
      .join('\n\n');

    setValue(css);
  }

  useEffect(() => {
    getCssAndSetValue(classname, name);
  }, []);

  function handleChange(value: string) {
    setValue(value);
    editorChange(value);
  }

  const editorChange = debounce((value: string) => {
    try {
      const ast = cssParse(value);
      const {data, onBulkChange, name} = props;
      const sourceCss = data.css || {};
      const className: PlainObject = {};
      ast.nodes.forEach((node: any) => {
        const nodes = node.nodes;
        const selector = node.selector;
        let state = 'default';
        if (!!~selector.indexOf(':hover:active')) {
          state = 'active';
        } else if (!!~selector.indexOf(':hover')) {
          state = 'hover';
        }
        nodes.forEach((item: any) => {
          const prop = item.prop;
          const cssValue = item.value;
          if (!!~prop.indexOf('radius')) {
            const type = 'radius:' + state;
            !className[type] && (className[type] = {});
            const radius = cssValue.split(' ');

            className[type]['top-left-border-radius'] = radius[0];
            className[type]['top-right-border-radius'] = radius[1];
            className[type]['bottom-right-border-radius'] = radius[2];
            className[type]['bottom-left-border-radius'] = radius[3];
          } else if (!!~prop.indexOf('border')) {
            !className['border:' + state] &&
              (className['border:' + state] = {});
            className['border:' + state][valueMap[prop] || prop] = cssValue;
          } else if (!!~prop.indexOf('padding') || !!~prop.indexOf('margin')) {
            !className['padding-and-margin:' + state] &&
              (className['padding-and-margin:' + state] = {});
            className['padding-and-margin:' + state][valueMap[prop] || prop] =
              cssValue;
          } else if (fontStyle.includes(prop)) {
            !className['font:' + state] && (className['font:' + state] = {});
            className['font:' + state][valueMap[prop] || prop] = cssValue;
          } else {
            className[(valueMap[prop] || prop) + ':' + state] = cssValue;
          }
        });
      });
      const newCss = {
        ...sourceCss,
        [name!]: className
      };
      onBulkChange &&
        onBulkChange({
          css: newCss
        });
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="ThemeClassName-editor">
      <div className="ThemeClassName-editor-title">自定义样式源码</div>
      <div className="ThemeClassName-editor-close">
        <Button onClick={props.onHide} level="link">
          <Icon icon="close" className="icon" />
        </Button>
      </div>

      <div className="ThemeClassName-editor-content">
        <Editor
          value={value}
          language="css"
          onChange={handleChange}
          options={{
            automaticLayout: true,
            lineNumbers: 'off',
            glyphMargin: false,
            tabSize: 2,
            wordWrap: 'on',
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
            folding: true,
            minimap: {
              enabled: false
            }
          }}
        />
      </div>
    </div>
  );
}

function ThemeClassName(props: FormControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {value} = props;
  const [showEditor, setShowEditor] = useState(false);
  function handleShowEditor() {
    setShowEditor(true);
  }
  return (
    <>
      <div ref={ref} className="ThemeClassName">
        <Button
          onClick={handleShowEditor}
          level="link"
          className=":ThemeClassName-button"
        >
          <Icon icon="file" className="icon" />
        </Button>
        {render({
          type: 'input-tag',
          name: 'class',
          placeholder: '请输入类名',
          delimiter: ' ',
          value: value,
          onChange: (value: string) => {
            props.onChange && props.onChange(value);
          }
        })}
      </div>
      <Overlay
        container={document.body}
        placement="left"
        target={ref.current}
        show={showEditor}
        rootClose={false}
      >
        <PopOver overlay onHide={() => setShowEditor(false)}>
          <AmisStyleCodeEditor {...props} onHide={() => setShowEditor(false)} />
        </PopOver>
      </Overlay>
    </>
  );
}

@FormItem({
  type: 'theme-classname',
  strictMode: false
})
export class BorderRenderer extends React.Component<FormControlProps> {
  render() {
    return <ThemeClassName {...this.props} />;
  }
}
