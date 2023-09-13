import {getSchemaTpl} from 'amis-editor-core';

export const inputStateTpl = (className: string, path: string = '') => {
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
      className,
      path
    ),
    ...inputStateFunc("${editorState == 'hover'}", 'hover', className, path),
    ...inputStateFunc("${editorState == 'active'}", 'active', className, path)
  ];
};

export const inputStateFunc = (
  visibleOn: string,
  state: string,
  className: string,
  path: string,
  options: any = []
) => {
  return [
    getSchemaTpl('theme:font', {
      label: '文字',
      name: `${className}.font:${state}`,
      visibleOn: visibleOn,
      editorThemePath: `${path}.${state}.body.font`
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `${className}.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorThemePath: `${path}.${state}.body.bg-color`
    }),
    getSchemaTpl('theme:border', {
      name: `${className}.border:${state}`,
      visibleOn: visibleOn,
      editorThemePath: `${path}.${state}.body.border`
    }),
    getSchemaTpl('theme:paddingAndMargin', {
      name: `${className}.padding-and-margin:${state}`,
      visibleOn: visibleOn,
      editorThemePath: `${path}.${state}.body.padding-and-margin`
    }),
    getSchemaTpl('theme:radius', {
      name: `${className}.radius:${state}`,
      visibleOn: visibleOn,
      editorThemePath: `${path}.${state}.body.border`
    }),
    ...options
  ];
};
