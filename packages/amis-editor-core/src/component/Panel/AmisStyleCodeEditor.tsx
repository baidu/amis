import React, {useEffect, useState} from 'react';
import {Editor} from 'amis-ui';

export interface AmisStyleCodeEditorProps {
  value: any;
  onChange: (value: any, diff: any) => void;
}

function AmisStyleCodeEditor(props: AmisStyleCodeEditorProps) {
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <Editor
      value={value}
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
