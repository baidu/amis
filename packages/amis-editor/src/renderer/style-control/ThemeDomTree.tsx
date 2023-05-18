/**
 * 外观编辑器-组件dom树
 */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Tree, Icon} from 'amis-ui';
import {FormControlProps, FormItem} from 'amis-core';
import {AmisThemeCssCodeEditor} from './ThemeCssCode';

function ThemeDomTree(props: FormControlProps): React.JSX.Element {
  const {themeClass, onChange} = props;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(true);
  const [editorItem, setEditorItem] = useState<any>(null);
  const [editorOpen, setEditorOpen] = useState<any>(false);

  function onDomSelect(value: string) {
    setValue(value);
    onChange(value);
  }

  function onDomEdit(item: any) {
    setEditorItem(item);
    setTimeout(() => setEditorOpen(true), 0);
  }

  return (
    <>
      <Button style={{width: '256px'}} onClick={() => setOpen(!open)}>
        {open ? '关闭组件结构' : '开启组件结构'}
      </Button>
      {open && (
        <div className="ThemeDomTree">
          <div className="ThemeDomTree-header">
            <div className="ThemeDomTree-header-title">组件结构</div>
            <div className="ThemeDomTree-header-close">
              <Icon
                icon="close"
                className="icon"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="ThemeDomTree-content">
            <Tree
              options={themeClass}
              value={value}
              onChange={(value: string) => onDomSelect(value)}
              editable={true}
              onEdit={(item: any) => onDomEdit(item)}
              editTip="编辑该节点样式源码"
            />
          </div>

          {editorOpen && (
            <div className="ThemeDomTree-style-wrapper">
              <AmisThemeCssCodeEditor
                {...props}
                className="ThemeDomTree-css-code"
                themeClass={themeClass}
                tabValue={editorItem?.value}
                isFromDomTree={true}
                onHide={() => setEditorOpen(false)}
              ></AmisThemeCssCodeEditor>
            </div>
          )}
        </div>
      )}
    </>
  );
}

@FormItem({
  type: 'theme-domTree',
  strictMode: false
})
export class ThemeDomTreeRenderer extends React.Component<FormControlProps> {
  render() {
    return <ThemeDomTree {...this.props} />;
  }
}
