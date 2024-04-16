import {JsonView, render} from 'amis';
import cx from 'classnames';
import React from 'react';
export interface PanelPreviewProps {
  schema: any;
}

export default function (props: PanelPreviewProps) {
  const schema = React.useMemo(() => {
    return {
      type: 'form',
      mode: 'normal',
      wrapWithPanel: false,
      className: cx('config-form-content', 'ae-Settings-content'),
      wrapperComponent: 'div',
      body: Array.isArray(props.schema) ? props.schema : [props.schema],
      submitOnChange: true,
      submitOnInit: true
    };
  }, [JSON.stringify(props.schema)]);
  const [data, setData] = React.useState({});
  const onFinished = React.useCallback((data: any) => {
    setData(data);
    return false;
  }, []);
  const onJsonEdit = React.useCallback((e: any) => {
    setData(e.updated_src);
  }, []);
  const dom = React.useRef<HTMLDivElement | null>(null);
  // const popOverContainer = React.useCallback(() => {
  //   return dom.current;
  // }, []);

  return (
    <div className="PanelPreview" ref={dom}>
      <div className="AMISCSSWrapper editor-right-panel">
        {render(
          schema,
          {
            data: data,
            onFinished: onFinished
            // popOverContainer
          },
          {
            // theme: 'cxd' // 右侧属性配置面板固定使用cxd主题展示
          }
        )}
      </div>
      <JsonView
        name={false}
        src={data}
        theme={'rjv-default'}
        enableClipboard={false}
        onEdit={onJsonEdit}
        onDelete={onJsonEdit}
        onAdd={onJsonEdit}
      />
    </div>
  );
}
