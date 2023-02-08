import {getSchemaTpl} from 'amis-editor-core';

export const inputStateTpl = (className: string) => {
  return [
    {
      type: 'select',
      name: 'editorState',
      label: '状态',
      selectFirst: true,
      options: [
        {
          label: '常规',
          value: 'default'
        },
        {
          label: '悬浮',
          value: 'hover'
        },
        {
          label: '点击',
          value: 'active'
        }
      ]
    },
    ...inputStateFunc(
      "${editorState == 'default' || !editorState}",
      'default',
      className
    ),
    ...inputStateFunc("${editorState == 'hover'}", 'hover', className),
    ...inputStateFunc("${editorState == 'active'}", 'active', className)
  ];
};

export const inputStateFunc = (
  visibleOn: string,
  state: string,
  className: string,
  options: any = []
) => {
  return [
    getSchemaTpl('theme:font', {
      label: '文字',
      name: `${className}.font:${state}`,
      visibleOn: visibleOn
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `${className}.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      visibleOn: visibleOn
    }),
    getSchemaTpl('theme:border', {
      name: `${className}.border:${state}`,
      visibleOn: visibleOn
    }),
    getSchemaTpl('theme:paddingAndMargin', {
      name: `${className}.padding-and-margin:${state}`,

      visibleOn: visibleOn
    }),
    getSchemaTpl('theme:radius', {
      name: `${className}.radius:${state}`,
      visibleOn: visibleOn
    }),
    ...options
  ];
};
