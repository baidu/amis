import {RendererProps} from 'amis-core';
import React, {useEffect, useState} from 'react';

interface InputComponentNameProps extends RendererProps {
  value: any;
  onChange: (value: any) => void;
}

export function InputComponentName(props: InputComponentNameProps) {
  const {value, onChange, render, name, node, placeholder} = props;
  const [options, setOptions] = useState<Array<any>>([]);

  useEffect(() => {
    const thisComp = node?.getComponent();
    let scoped = thisComp?.context;
    const comps: Array<any> = [];

    while (scoped?.getComponents) {
      scoped.getComponents().forEach((c: any) => {
        if (c.props.name && c !== thisComp) {
          // todo 把孩子节点拼装成 xxx.xxx
          comps.push(c.props.name);
        }
      });

      scoped = scoped.parent;
    }
    setOptions(comps);
  }, [node]);

  function onInnerChange(value: any) {
    onChange(value);
    return false;
  }

  return render(
    'inner',
    {
      type: 'input-text',
      name,
      placeholder
    },
    {
      value,
      onChange: onInnerChange,
      options
    }
  );
}
