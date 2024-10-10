import {getSchemaTpl} from 'amis-editor-core';

export const inputStateTpl = (
  className: string,
  token: string = '',
  options: {
    state: string[];
  } = {
    state: ['default', 'hover', 'focused', 'disabled']
  }
) => {
  return [
    {
      type: 'select',
      name: `__editorState${className}`,
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
          label: '选中',
          value: 'focused'
        },
        {
          label: '禁用',
          value: 'disabled'
        }
      ].filter(item => options.state.includes(item.value))
    },
    ...inputStateFunc(
      `\${__editorState${className} == 'default' || !__editorState${className}}`,
      'default',
      className,
      token
    ),
    ...inputStateFunc(
      `\${__editorState${className} == 'hover'}`,
      'hover',
      className,
      token
    ),
    ...inputStateFunc(
      `\${__editorState${className} == 'focused'}`,
      'focused',
      className,
      token
    ),
    ...inputStateFunc(
      `\${__editorState${className} == 'disabled'}`,
      'disabled',
      className,
      token
    )
  ];
};

export const inputStateFunc = (
  visibleOn: string,
  state: string,
  className: string,
  token: string,
  options: any = []
) => {
  const cssToken = state === 'focused' ? 'active' : state;
  return [
    getSchemaTpl('theme:font', {
      label: '文字',
      name: `${className}.font:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${token}-${cssToken}`,
      state
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `${className}.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorValueToken: `${token}-${cssToken}-bg-color`,
      state
    }),
    getSchemaTpl('theme:border', {
      name: `${className}.border:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${token}-${cssToken}`,
      state
    }),
    getSchemaTpl('theme:paddingAndMargin', {
      name: `${className}.padding-and-margin:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${token}-${cssToken}`,
      state
    }),
    getSchemaTpl('theme:radius', {
      name: `${className}.radius:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `${token}-${cssToken}`,
      state
    }),
    ...options
  ];
};
