import React, {useEffect, useState} from 'react';
import {Editor} from 'amis-ui';

export interface AmisStyleCodeEditorProps {
  value: any;
  onChange: (value: any, diff: any) => void;
  onPaste?: () => void;
  disabled?: boolean;
  $schemaUrl?: string;
  $schema?: string;
  className?: string;
}

function json2Css(data: any) {
  let res = '';
  for (let className in data) {
    if (typeof data[className] === 'object') {
      let value = [];
      for (let key in data[className]) {
        if (typeof data[className][key] !== 'object') {
          if (data[className][key]) {
            value.push(`${key}: ${data[className][key]};`);
          }
        } else {
          for (let k in data[className][key]) {
            if (data[className][key][k]) {
              value.push(`${k}: ${data[className][key][k]};`);
            }
          }
        }
      }
      res += `.${className} {
  ${value.join('\n  ')}
}\n`;
    }
  }
  return res;
}

function AmisStyleCodeEditor(props: AmisStyleCodeEditorProps) {
  const [value, setValue] = useState(props.value);
  debugger;
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  console.log(json2Css(value));
  return (
    <Editor
      value={json2Css(value)}
      language="css"
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
  );
}

export default AmisStyleCodeEditor;
