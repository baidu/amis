import {getSchemaTpl} from 'amis-editor-core';
interface InputStateOptions {
  state?: {
    label: string;
    value: string;
    token?: string;
  }[];
  hideFont?: boolean;
  hidePadding?: boolean;
  hideMargin?: boolean;
  hideRadius?: boolean;
  hideBackground?: boolean;
  hideBorder?: boolean;
  hiddenOn?: string;
  schema?: any[];
  fontToken?: (state: string) => string | object;
  pmToken?: (state: string) => string;
  radiusToken?: (state: string) => string | object;
  backgroundToken?: (state: string) => string;
  borderToken?: (state: string) => string | object;
}

export const inputSwitchStateTpl = (
  className: string,
  options?: InputStateOptions,
  body?: any[]
) => {
  const stateOptions = [
    {
      label: '常规',
      value: 'Default'
    },
    {
      label: '完成',
      value: 'Finish'
    },
    {
      label: '进行中',
      value: 'Process'
    },
    {
      label: '等待',
      value: 'Wait'
    },
    {
      label: '出错',
      value: 'Error'
    }
  ];
  const hiddenOnCondition = options?.hiddenOn
    ? ` && !(${options.hiddenOn})`
    : '';
  const res: any = [
    ...stateOptions.map((item: any) => {
      return {
        type: 'container',
        visibleOn:
          `\${__editorStateStep == '${item.value}'` +
          (item.value === 'Default' ? ` || !__editorStateStep` : '') +
          hiddenOnCondition +
          `}`,
        body: body?.map((b: any) => ({
          ...b,
          name: b.name.replace(/name/gi, (match: any) => match + item.value)
        }))
      };
    })
  ];
  return res;
};
export const inputStepStateTpl = (
  className: string,
  token: string,
  options?: InputStateOptions,
  body?: any[]
) => {
  const stateOptions = options?.state || [
    {
      label: '常规',
      value: 'Default'
    },
    {
      label: '完成',
      value: 'Finish'
    },
    {
      label: '进行中',
      value: 'Process'
    },
    {
      label: '等待',
      value: 'Wait'
    },
    {
      label: '出错',
      value: 'Error'
    }
  ];
  const hiddenOnCondition = options?.hiddenOn
    ? ` && !(${options.hiddenOn})`
    : '';
  const res: any = [
    ...stateOptions.map((item: any) => {
      return {
        type: 'container',
        visibleOn:
          `\${__editorStateStep == '${item.value}'` +
          (item.value === 'Default' ? ` || !__editorStateStep` : '') +
          hiddenOnCondition +
          `}`,
        body: inputStateFunc(
          'default',
          className + item.value,
          item.token || token,
          options
        )
      };
    })
  ];
  return res;
};
export const inputStateTpl = (
  className: string,
  token: string = '',
  options?: InputStateOptions
) => {
  const stateOptions = options?.state || [
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
  ];

  const res: any = [
    {
      type: 'select',
      name: `__editorState${className}`,
      label: '状态',
      selectFirst: true,
      options: stateOptions,
      hiddenOn: options?.hiddenOn || false
    },
    ...stateOptions.map((item: any) => {
      return {
        type: 'container',
        visibleOn:
          `\${__editorState${className} == '${item.value}'` +
          (item.value === 'default' ? ` || !__editorState${className}` : '') +
          `}`,
        hiddenOn: options?.hiddenOn || false,
        body: inputStateFunc(
          item.value,
          className,
          item.token || token,
          options
        )
      };
    })
  ];
  return res;
};

export const inputStateFunc = (
  state: string,
  className: string,
  token?: string,
  options?: InputStateOptions
) => {
  const cssTokenState = state === 'focused' ? 'active' : state;
  if (token) {
    if (token.includes('${state}')) {
      token = token.replace(/\${state}/g, cssTokenState);
    } else {
      token = `${token}-${cssTokenState}`;
    }
  }
  return [
    !options?.hideFont &&
      getSchemaTpl('theme:font', {
        label: '文字',
        name: `${className}.font:${state}`,
        editorValueToken: options?.fontToken?.(cssTokenState) || token,
        state
      }),
    !options?.hideBackground &&
      getSchemaTpl('theme:colorPicker', {
        label: '背景',
        name: `${className}.background:${state}`,
        labelMode: 'input',
        needGradient: true,
        needImage: true,
        editorValueToken:
          options?.backgroundToken?.(cssTokenState) ||
          (token && `${token}-bg-color`),
        state
      }),
    !options?.hideBorder &&
      getSchemaTpl('theme:border', {
        name: `${className}.border:${state}`,
        editorValueToken: options?.borderToken?.(cssTokenState) || token,
        state
      }),
    !options?.hidePadding &&
      !options?.hideMargin &&
      getSchemaTpl('theme:paddingAndMargin', {
        name: `${className}.padding-and-margin:${state}`,
        editorValueToken: options?.pmToken?.(cssTokenState) || token,
        state,
        hidePadding: options?.hidePadding,
        hideMargin: options?.hideMargin
      }),
    !options?.hideRadius &&
      getSchemaTpl('theme:radius', {
        name: `${className}.radius:${state}`,
        editorValueToken: options?.radiusToken?.(cssTokenState) || token,
        state
      }),
    ...(options?.schema || [])
  ].filter(Boolean);
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
