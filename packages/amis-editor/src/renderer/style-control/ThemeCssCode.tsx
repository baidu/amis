/**
 * 类名输入框 + 自定义样式源码编辑器
 */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Editor, Overlay, PopOver} from 'amis-ui';
import {FormControlProps, FormItem, styleMap, render} from 'amis-core';
// @ts-ignore
import {parse as cssParse} from 'amis-postcss';
import {PlainObject} from './types';
import {debounce, isEmpty} from 'lodash';
import {Icon} from '../../icons/index';
import editorFactory from './themeLanguage';
import cx from 'classnames';

const valueMap: PlainObject = {};

for (let key in styleMap) {
  valueMap[styleMap[key]] = key;
}
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

interface CssNodeTab {
  name: string;
  key: string;
  children: CssNode[];
}

export function AmisThemeCssCodeEditor(props: FormControlProps) {
  const {themeClass, data, tabValue, isFromDomTree} = props;
  const id = data.id.replace('u:', '');
  const [cssNodes, setCssNodes] = useState<CssNodeTab[]>([]);
  const [tabId, setTabId] = useState(tabValue || '');
  function getCssAndSetValue(themeClass: any[]) {
    try {
      const newCssNodes: CssNodeTab[] = [];
      themeClass?.forEach(n => {
        const classId = n.extra ? id + '-' + n.extra : id;
        const state = n.state || ['default'];
        const className = n.value || 'className';
        const dom = document.getElementById(classId || '') || null;
        const content = dom?.innerHTML || '';
        const ast = cssParse(content);
        const nodes: any[] = [];
        ast.nodes.forEach((node: any) => {
          const selector = node.selector;
          if (!selector.endsWith('.hover') && !selector.endsWith('.active')) {
            nodes.push(node);
          }
        });

        const css: {selector: string; value: string; state: string}[] = [];
        state.forEach((s: string) => {
          css.push({
            selector: `.${className}-${id}${s === 'default' ? '' : ':' + s}`,
            state: s,
            value: ''
          });
        });
        nodes.forEach(node => {
          const style = node.nodes.map((n: any) => `${n.prop}: ${n.value};`);
          const item = css.find(c => {
            if (
              c.selector === node.selector ||
              node.selector.endsWith(`:${c.state}`) ||
              node.selector.split(' ').indexOf(c.selector) > -1
            ) {
              return c;
            }
            return false;
          })!;
          item && (item.value = style.join('\n'));
        });

        newCssNodes.push({
          name: n.name || '自定义样式',
          key: n.value,
          children: css
        });
      });
      setCssNodes(newCssNodes);
      !isFromDomTree && setTabId(newCssNodes[0]?.key);
    } catch (error) {
      console.error(error);
    }
  }

  // 将树转化为一维数组
  function flattenTree(tree: any, nodes: any[]) {
    nodes.push(tree);
    if (tree.children) {
      tree.children.forEach((child: any) => {
        flattenTree(child, nodes);
      });
    }
  }

  useEffect(() => {
    if (themeClass) {
      let nodes: any[] = [];
      themeClass.forEach((child: any) => {
        flattenTree(child, nodes);
      });
      getCssAndSetValue(nodes);
    }
  }, []);

  useEffect(() => {
    if (tabValue && tabValue !== tabId) {
      setTabId(tabValue);
    }
  }, [tabValue]);

  const editorChange = debounce((nodeTabs: CssNodeTab[]) => {
    try {
      const {data, onBulkChange} = props;
      const sourceCss = data.themeCss || data.css || {};
      const newCss: any = {};
      nodeTabs.forEach(tab => {
        tab.children.forEach(node => {
          const nodes = cssParse(node.value)
            .nodes.map((node: any) => {
              const {prop, value} = node;
              return {
                prop,
                value
              };
            })
            .filter((n: any) => n.value);
          const selector = node.selector;
          const nameEtr = /\.(.*)\-/.exec(selector);
          const cssCode: PlainObject = {};
          let name = nameEtr ? nameEtr[1] : '';
          let state = 'default';
          if (!!~selector.indexOf(':active')) {
            state = 'active';
          } else if (!!~selector.indexOf(':hover')) {
            state = 'hover';
          }
          nodes.forEach((item: any) => {
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
            } else if (
              !!~prop.indexOf('padding') ||
              !!~prop.indexOf('margin')
            ) {
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
          if (newCss[name]) {
            newCss[name] = Object.assign(newCss[name], cssCode);
          } else {
            newCss[name] = cssCode;
          }
        });
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

  function handleChange(value: string, i: number, j: number) {
    const newCssNodes = cssNodes;
    newCssNodes[i].children[j].value = value;
    setCssNodes(newCssNodes); // 好像不需要这个?
    editorChange(newCssNodes);
  }
  function formateTitle(title: string) {
    if (title.endsWith('hover')) {
      return '悬浮态样式';
    } else if (title.endsWith('active')) {
      return '点击态样式';
    } else if (title.endsWith('disabled')) {
      return '禁用态样式';
    }
    return '常规态样式';
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
        {!isFromDomTree &&
          render({
            type: 'tree-select',
            label: '层级：',
            mode: 'horizontal',
            name: 'tree-select',
            clearable: false,
            options: themeClass,
            value: tabId,
            onChange: (value: string) => {
              setTabId(value);
            }
          })}
        <div className="ThemeCssCode-editor-content-main">
          {cssNodes.map((node, i) => {
            const children = node.children;
            return (
              <div
                key={i}
                className={cx(
                  node.key !== tabId &&
                    'ThemeCssCode-editor-content-body--hidden'
                )}
              >
                {children.map((css, j) => {
                  return (
                    <div
                      className="ThemeCssCode-editor-content-body"
                      key={`${i}-${j}-${css.selector}`}
                      id={`${i}-${j}-${css.selector}`}
                    >
                      {children.length > 1 ? (
                        <div className="ThemeCssCode-editor-content-body-title">
                          {formateTitle(css.selector)}
                        </div>
                      ) : null}
                      <div className="ThemeCssCode-editor-content-body-editor">
                        <Editor
                          value={css.value}
                          editorFactory={editorFactory}
                          options={{
                            onChange: (value: string) =>
                              handleChange(value, i, j)
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AmisStyleCodeEditor(props: FormControlProps) {
  const {data, onBulkChange} = props;
  const {style} = data;
  const [value, setValue] = useState('');

  function getCssAndSetValue(data: any) {
    if (isEmpty(data)) {
      return '';
    }
    let str = '';
    for (let key in data) {
      if (key === 'radius') {
        str += `border-radius: ${
          data.radius['top-left-border-radius'] +
          ' ' +
          data.radius['top-right-border-radius'] +
          ' ' +
          data.radius['bottom-right-border-radius'] +
          ' ' +
          data.radius['bottom-left-border-radius']
        };\n`;
      } else {
        str += `${styleMap[key] || key}: ${data[key]};\n`;
      }
    }
    return str;
  }

  useEffect(() => {
    const res = getCssAndSetValue(style);
    setValue(res);
  }, []);

  const editorChange = debounce((value: string) => {
    const newStyle: PlainObject = {};
    try {
      const style = cssParse(value);
      style.nodes.forEach((node: any) => {
        const {prop, value} = node;
        if (value) {
          if (prop === 'border-radius') {
            const radius = value.split(' ');
            newStyle['radius'] = {
              'top-left-border-radius': radius[0] || '',
              'top-right-border-radius': radius[1] || '',
              'bottom-right-border-radius': radius[2] || '',
              'bottom-left-border-radius': radius[3] || ''
            };
          } else {
            newStyle[valueMap[prop] || prop] = value;
          }
        }
      });
      onBulkChange &&
        onBulkChange({
          style: newStyle
        });
    } catch (error) {
      console.error(error);
    }
  });

  function handleChange(value: string) {
    editorChange(value);
    setValue(value);
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
          editorFactory={editorFactory}
          options={{
            onChange: handleChange
          }}
        />
      </div>
    </div>
  );
}

export default function ThemeCssCode(props: FormControlProps) {
  const ref = useRef<HTMLDivElement>(null);
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
        target={ref.current as any}
        show={showEditor}
        rootClose={false}
      >
        <PopOver overlay onHide={() => setShowEditor(false)}>
          {props.isLayout ? (
            <AmisStyleCodeEditor
              {...props}
              onHide={() => setShowEditor(false)}
            />
          ) : (
            <AmisThemeCssCodeEditor
              {...props}
              onHide={() => setShowEditor(false)}
            />
          )}
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
