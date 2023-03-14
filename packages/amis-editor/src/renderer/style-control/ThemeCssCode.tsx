/**
 * 类名输入框 + 自定义样式源码编辑器
 */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Editor, Overlay, PopOver} from 'amis-ui';
import {FormControlProps, FormItem} from 'amis-core';
import {parse as cssParse} from 'amis-postcss';
import {PlainObject} from './types';
import {cloneDeep, debounce} from 'lodash';
import {Icon} from '../../icons/index';
import editorFactory from './themeLanguage';

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

interface CssNode {
  value: string;
  selector: string;
}

function AmisStyleCodeEditor(props: FormControlProps) {
  const {themeClass, data} = props;
  const id = data.id.replace('u:', '');
  const [cssNodes, setCssNodes] = useState<CssNode[]>([]);
  const [value, setValue] = useState('');
  const [select, setSelect] = useState(0);
  function getCssAndSetValue(themeClass: string[]) {
    try {
      const nodes: any[] = [];
      const ids = themeClass.map(n => (n ? id + '-' + n : id));
      ids?.forEach(id => {
        const dom = document.getElementById(id || '') || null;
        const content = dom?.innerHTML || '';
        const ast = cssParse(content);

        ast.nodes.forEach((node: any) => {
          const selector = node.selector;
          if (!selector.endsWith('.hover') && !selector.endsWith('.active')) {
            nodes.push(node);
          }
        });
        ast.nodes = nodes;
      });

      const css = nodes.map(node => {
        const style = node.nodes.map((n: any) => `${n.prop}: ${n.value};`);
        return {
          selector: node.selector,
          value: style.join('\n')
        };
      });
      setValue(css[select].value);
      setCssNodes(css);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCssAndSetValue(themeClass);
  }, []);

  const editorChange = debounce((nodes: CssNode[]) => {
    try {
      const {data, onBulkChange} = props;
      const sourceCss = data.themeCss || data.css || {};
      const newCss: any = {};
      nodes.forEach(node => {
        const nodes = node.value
          .replace(/\s/g, '')
          .split(';')
          .map(kv => {
            const [prop, value] = kv.split(':');
            return {
              prop,
              value
            };
          })
          .filter(n => n.value);
        const selector = node.selector;
        const nameEtr = /\.(.*)\-/.exec(selector);
        const cssCode: PlainObject = {};
        let name = nameEtr ? nameEtr[1] : '';
        let state = 'default';
        if (!!~selector.indexOf(':hover:active')) {
          state = 'active';
        } else if (!!~selector.indexOf(':hover')) {
          state = 'hover';
        }
        nodes.forEach(item => {
          const prop = item.prop;
          const cssValue = item.value;
          if (!!~prop.indexOf('radius')) {
            const type = 'radius:' + state;
            !cssCode[type] && (cssCode[type] = {});
            const radius = cssValue.split(' ');

            cssCode[type]['top-left-border-radius'] = radius[0];
            cssCode[type]['top-right-border-radius'] = radius[1];
            cssCode[type]['bottom-right-border-radius'] = radius[2];
            cssCode[type]['bottom-left-border-radius'] = radius[3];
          } else if (!!~prop.indexOf('border')) {
            !cssCode['border:' + state] && (cssCode['border:' + state] = {});
            cssCode['border:' + state][valueMap[prop] || prop] = cssValue;
          } else if (!!~prop.indexOf('padding') || !!~prop.indexOf('margin')) {
            !cssCode['padding-and-margin:' + state] &&
              (cssCode['padding-and-margin:' + state] = {});
            cssCode['padding-and-margin:' + state][valueMap[prop] || prop] =
              cssValue;
          } else if (fontStyle.includes(prop)) {
            !cssCode['font:' + state] && (cssCode['font:' + state] = {});
            cssCode['font:' + state][valueMap[prop] || prop] = cssValue;
          } else {
            cssCode[(valueMap[prop] || prop) + ':' + state] = cssValue;
          }
        });
        newCss[name] = cssCode;
      });
      onBulkChange &&
        onBulkChange({
          themeCss: {
            ...sourceCss,
            ...newCss
          }
        });
    } catch (error) {
      console.error(error);
    }
  });

  function handleChange(value: string) {
    const newCssNodes = cloneDeep(cssNodes);
    newCssNodes[select].value = value;
    setCssNodes(newCssNodes);
    setValue(value);
    editorChange(newCssNodes);
  }

  return (
    <div className="ThemeCssCode-editor">
      <div className="ThemeCssCode-editor-title">编辑样式源码</div>
      <div className="ThemeCssCode-editor-close">
        <Button onClick={props.onHide} level="link">
          <Icon icon="close" className="icon" />
        </Button>
      </div>

      <div className="ThemeCssCode-editor-content">
        <Editor
          value={value}
          onChange={handleChange}
          editorFactory={editorFactory}
        />
      </div>
    </div>
  );
}

function ThemeCssCode(props: FormControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {value} = props;
  const [showEditor, setShowEditor] = useState(false);
  function handleShowEditor() {
    setShowEditor(true);
  }
  return (
    <>
      <div ref={ref} className="ThemeCssCode">
        <Button onClick={handleShowEditor} className=":ThemeCssCode-button">
          <Icon icon="theme-css" className="icon" /> 编辑样式源码
        </Button>
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
  type: 'theme-cssCode',
  strictMode: false
})
export class ThemeCssCodeRenderer extends React.Component<FormControlProps> {
  render() {
    return <ThemeCssCode {...this.props} />;
  }
}
