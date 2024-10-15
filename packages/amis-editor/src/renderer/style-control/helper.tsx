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

export const buttonStateFunc = (visibleOn: string, state: string) => {
  return [
    getSchemaTpl('theme:font', {
      label: '文字',
      name: `themeCss.className.font:${state}`,
      visibleOn: visibleOn,
      editorValueToken: {
        'color': `--button-\${level || "default"}-${state}-font-color`,
        '*': '--button-size-${size || "default"}'
      },
      state
    }),
    getSchemaTpl('theme:colorPicker', {
      label: '背景',
      name: `themeCss.className.background:${state}`,
      labelMode: 'input',
      needGradient: true,
      needImage: true,
      visibleOn: visibleOn,
      editorValueToken: `--button-\${level || "default"}-${state}-bg-color`,
      state
    }),
    getSchemaTpl('theme:border', {
      name: `themeCss.className.border:${state}`,
      visibleOn: visibleOn,
      editorValueToken: `--button-\${level || "default"}-${state}`,
      state
    }),
    getSchemaTpl('theme:paddingAndMargin', {
      name: `themeCss.className.padding-and-margin:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}',
      state
    }),
    getSchemaTpl('theme:radius', {
      name: `themeCss.className.radius:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}',
      state
    }),
    getSchemaTpl('theme:select', {
      label: '图标尺寸',
      name: `themeCss.iconClassName.iconSize:${state}`,
      visibleOn: visibleOn,
      editorValueToken: '--button-size-${size || "default"}-icon-size',
      state
    })
  ];
};
