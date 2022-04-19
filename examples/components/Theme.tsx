import From from './theme/form';
import {
  colorControls,
  fontControls,
  sizeControls,
  borderControls,
  linkControls
} from './theme/vars';
import CRUD from './theme/crud';

function updateTheme(theme: any) {
  let varStyleTag = document.getElementById('customVars');
  if (!varStyleTag) {
    varStyleTag = document.createElement('style');
    varStyleTag.id = 'customVars';
    document.body.appendChild(varStyleTag);
  }

  const vars = [];
  const names = new Set();
  for (const type in theme) {
    if (type.startsWith('_')) {
      for (const name in theme[type]) {
        const value = theme[type][name];
        if (typeof value !== undefined && value !== '') {
          names.add(name);
          vars.push(`${name}: ${value.replace(/[;<>]*/g, '')};`);
        }
      }
    }
  }

  // bca-disable-line
  varStyleTag.innerHTML = `:root {
        ${[...vars].join('')}
    }`;

  // 如果是改自定义样式
  let styleTag = document.getElementById('customStyle');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'customVars';
    document.body.appendChild(styleTag);
  }
  if (theme?.style) {
    // bca-disable-line
    styleTag.innerHTML = theme.style;
  }
}

export default {
  type: 'form',
  title:
    '这是一个基于 amis 搭建较为复杂界面的例子，部分功能使用代码开发，请参考源码',
  submitText: '',
  persistData: 'amis-theme-editor',
  actions: [],
  onEvent: {
    inited: {
      actions: [
        {
          actionType: 'custom',
          script: (context: any, doAction: any, event: any) => {
            const theme = event.data.formData.config?.theme;
            theme && updateTheme(theme);
          }
        }
      ]
    }
  },
  // 用于主题修改的时候实时看效果
  onChange: (values: any, diff: any) => {
    const theme = diff.config?.theme;
    theme && updateTheme(theme);
  },
  body: [
    {
      type: 'grid',
      label: false,
      columns: [
        {
          md: 4,
          body: [
            {
              type: 'tabs',
              tabs: [
                {
                  title: '基础设置',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '变量设置',
                      label: false
                    },
                    {
                      type: 'tabs',
                      mode: 'vertical',
                      subFormMode: 'normal',
                      tabs: [
                        {
                          title: '颜色',
                          body: colorControls
                        },
                        {
                          title: '字体',
                          body: fontControls
                        },
                        {
                          title: '间距',
                          body: sizeControls
                        },
                        {
                          title: '边框',
                          body: borderControls
                        },
                        {
                          title: '链接',
                          body: linkControls
                        },
                        {
                          title: '动画',
                          body: [
                            {
                              type: 'input-text',
                              label: '动画时长',
                              placeholder: '2s',
                              name: 'config.theme._vars["--animation-duration"]'
                            }
                          ]
                        },
                        {
                          title: '其它变量',
                          body: [
                            {
                              type: 'combo',
                              multiple: true,
                              name: 'config.theme._otherVars',
                              body: [
                                {
                                  type: 'input-text',
                                  placeholder: '变量名',
                                  required: true,
                                  name: 'key'
                                },
                                {
                                  type: 'input-text',
                                  placeholder: '变量值',
                                  required: true,
                                  name: 'value'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  title: '自定义 CSS',
                  body: [
                    {
                      label: false,
                      type: 'editor',
                      name: 'config.theme.style',
                      size: 'lg',
                      options: {
                        lineNumbers: 'off'
                      },
                      language: 'css'
                    }
                  ]
                },
                {
                  title: '查看设置的变量',
                  body: [
                    {
                      type: 'static-tpl',
                      pipeIn: (value: any, data: any) => {
                        const vars = [];
                        const names = new Set();
                        const theme = data.data?.config?.theme || {};
                        for (const type in theme) {
                          if (type.startsWith('_')) {
                            for (const name in theme[type]) {
                              const value = theme[type][name];
                              if (typeof value !== undefined && value !== '') {
                                names.add(name);
                                vars.push(
                                  `${name}: ${value.replace(/[;<>]*/g, '')};`
                                );
                              }
                            }
                          }
                        }
                        if (vars.length) {
                          return `<pre>${vars.join('\n')}</pre>`;
                        } else {
                          return '未设置变量';
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          md: 8,
          type: 'container',
          columnClassName: 'b-l',
          body: [
            {
              type: 'tabs',
              tabs: [
                {
                  title: '表单预览',
                  tab: From
                },
                {
                  title: '表格预览',
                  tab: CRUD
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
