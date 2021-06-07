import React from 'react';

function buildTest(type, scaffold) {
  return {
    type: 'wrapper',
    className: 'b-l b-b b-r bg-white',
    body: [
      `<h4 class="m-t-none m-b">类型：${type}</h4>`,

      {
        type: 'tabs',
        tabs: [
          {
            title: '正常模式',
            hash: 'normal',
            body: {
              type: 'form',
              title: '',
              controls: [
                {
                  label: '正常',
                  ...scaffold,
                  type,
                  name: 'a1'
                },

                {
                  type: 'divider'
                },

                {
                  label: '内联模式',
                  ...scaffold,
                  type,
                  name: 'a2',
                  mode: 'inline'
                },

                {
                  type: 'divider'
                },

                {
                  label: '表单项内联',
                  ...scaffold,
                  type,
                  name: 'a22',
                  inline: true
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 默认模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a3'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a4'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a5'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a6'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a7'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a8'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a9'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a10'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部 Inline 模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a11'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a12'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a13'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a14'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a15'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a16'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a17'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a18'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部水平模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a21'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a22'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a23'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a24'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a25'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a26'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a27'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a28'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a29'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a291'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a292'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a293'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Combo 单行模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo1',
                  label: '组合类型',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo2',
                  label: '组合类型多选',
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo3',
                  label: '组合类型多行',
                  multiLine: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo4',
                  label: '组合类型多行多选',
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo5',
                  label: '组合类型内联',
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo6',
                  label: '组合类型多选内联',
                  multiple: true,
                  inline: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo7',
                  label: '组合类型多行内联',
                  multiLine: true,
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo8',
                  label: '组合类型多行多选内联',
                  inline: true,
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                }
              ]
            }
          },

          {
            title: '水平模式',
            hash: 'horizontal',
            body: {
              type: 'form',
              title: '',
              mode: 'horizontal',
              controls: [
                {
                  label: '正常',
                  ...scaffold,
                  type,
                  name: 'a1'
                },

                {
                  type: 'divider'
                },

                {
                  label: '内联模式',
                  ...scaffold,
                  type,
                  name: 'a2',
                  mode: 'inline'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部正常模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a3'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a4'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a5'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a6'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a7'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a8'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a9'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a10'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部 Inline 模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a11'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a12'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a13'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a14'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a15'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a16'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a17'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a18'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部水平模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a21'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a22'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a23'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a24'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a25'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a26'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a27'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a28'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a29'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a291'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a292'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a293'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Combo 单行模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo1',
                  label: '组合类型',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo2',
                  label: '组合类型多选',
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo3',
                  label: '组合类型多行',
                  multiLine: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo4',
                  label: '组合类型多行多选',
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo5',
                  label: '组合类型内联',
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo6',
                  label: '组合类型多选内联',
                  multiple: true,
                  inline: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo7',
                  label: '组合类型多行内联',
                  multiLine: true,
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo8',
                  label: '组合类型多行多选内联',
                  inline: true,
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                }
              ]
            }
          },

          {
            title: '内联模式',
            hash: 'inline',
            body: {
              type: 'form',
              title: '',
              mode: 'inline',
              controls: [
                {
                  label: '正常',
                  ...scaffold,
                  type,
                  name: 'a1'
                },

                {
                  label: '正常',
                  ...scaffold,
                  type,
                  name: 'a11'
                },

                {
                  type: 'divider'
                },

                {
                  label: '内联模式',
                  ...scaffold,
                  type,
                  name: 'a2',
                  mode: 'inline'
                },

                {
                  label: '内联模式',
                  ...scaffold,
                  type,
                  name: 'a22',
                  mode: 'inline'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部正常模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a3'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a4'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a5'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a6'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a7'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a8'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'normal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a9'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a10'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部 Inline 模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a11'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a12'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a13'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a14'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a15'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a16'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'inline',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a17'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a18'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Group 局部水平模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a21'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a22'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a23'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a24'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a25'
                    },

                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a26'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a27'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a28'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a29'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a291'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'group',
                  mode: 'horizontal',
                  controls: [
                    {
                      label: '内联模式+宽度',
                      labelClassName: 'col-sm-2',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a292'
                    },

                    {
                      label: '内联模式',
                      ...scaffold,
                      mode: 'inline',
                      type,
                      name: 'a293'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'tpl',
                  className: 'text-info',
                  tpl: 'Combo 单行模式'
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo1',
                  label: '组合类型',
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo2',
                  label: '组合类型多选',
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo3',
                  label: '组合类型多行',
                  multiLine: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo4',
                  label: '组合类型多行多选',
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo5',
                  label: '组合类型内联',
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo6',
                  label: '组合类型多选内联',
                  multiple: true,
                  inline: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo7',
                  label: '组合类型多行内联',
                  multiLine: true,
                  inline: true,
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                },

                {
                  type: 'divider'
                },

                {
                  type: 'combo',
                  name: 'combo8',
                  label: '组合类型多行多选内联',
                  inline: true,
                  multiLine: true,
                  multiple: true,
                  value: [{}, {}],
                  controls: [
                    {
                      label: '正常',
                      ...scaffold,
                      type,
                      name: 'a1'
                    },

                    {
                      placeholder: '正常',
                      ...scaffold,
                      type,
                      name: 'a2'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  };
}

const options = [
  {
    label: '选项A',
    value: 'a'
  },

  {
    label: '选项B',
    value: 'b',
    children: [
      {
        label: '选项1',
        value: '1'
      },

      {
        label: '选项2',
        value: '2'
      },

      {
        label: '选项3',
        value: '3'
      }
    ]
  },

  {
    label: '选项C',
    value: 'c'
  },

  {
    label: '选项D',
    value: 'd'
  }
];

export default {
  title: '各种表单项的不同模式样式测试，记得切到小屏幕测试',
  body: [
    {
      type: 'nav',
      links: [
        {
          label: 'Text',
          to: '?renderer=text',
          activeOn: '!data.renderer || data.renderer == "text"'
        },

        {
          label: 'Textarea',
          to: '?renderer=textarea'
        },

        {
          label: 'Number',
          to: '?renderer=number'
        },

        {
          label: 'Checkbox',
          to: '?renderer=checkbox'
        },

        {
          label: 'Checkboxes',
          to: '?renderer=checkboxes'
        },

        {
          label: 'Radios',
          to: '?renderer=radios'
        },

        {
          label: 'List',
          to: '?renderer=list'
        },

        {
          label: 'Date',
          to: '?renderer=date'
        },

        {
          label: 'Switch',
          to: '?renderer=switch'
        },

        {
          label: 'Select',
          to: '?renderer=select'
        },

        {
          label: 'Tree',
          to: '?renderer=tree'
        },

        {
          label: 'Image',
          to: '?renderer=image'
        }
      ],
      stacked: false
    },

    {
      children: ({data, render}) => {
        const type = data.renderer || 'text';
        return (
          <div>
            {render(
              'body',
              buildTest(
                type,
                {
                  text: {
                    placeholder: '请输入文本',
                    clearable: true,
                    description: '这是一段很长的描述文字。。。'
                  },

                  number: {
                    placeholder: '请输入数字'
                  },

                  select: {
                    placeholder: '请选择',
                    options
                  },

                  checkbox: {
                    option: '选项'
                  },

                  checkboxes: {
                    options
                  },

                  radios: {
                    options
                  },

                  tree: {
                    options
                  },

                  list: {
                    options
                  }
                }[type]
              )
            )}
          </div>
        );
      }
    }
  ]
};
