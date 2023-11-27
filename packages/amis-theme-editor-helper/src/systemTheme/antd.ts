import type {ThemeDefinition} from '../helper/declares';
import component from './component';

const antdData: ThemeDefinition = {
  config: {
    key: 'antd',
    name: '仿Antd',
    description: '平台预设主题'
  },
  global: {
    fonts: {
      base: {
        body: [
          {value: '-apple-system'},
          {value: 'BlinkMacSystemFont'},
          {value: 'SF Pro SC'},
          {value: 'SF Pro Text'},
          {value: 'Helvetica Neue'},
          {value: 'Helvetica'},
          {value: 'PingFang SC'},
          {value: 'Segoe UI'},
          {value: 'Roboto'},
          {value: 'Hiragino Sans GB'},
          {value: 'Arial'},
          {value: 'microsoft yahei ui'},
          {value: 'Microsoft YaHei'},
          {value: 'SimSun'},
          {value: 'sans-serif'}
        ],
        label: '基础字体',
        token: '--fonts-base-family'
      },
      size: {
        body: [
          {label: '运营标题-大', token: '--fonts-size-1', value: '48px'},
          {label: '运营标题-中', token: '--fonts-size-2', value: '40px'},
          {label: '运营标题-小', token: '--fonts-size-3', value: '32px'},
          {label: '标题-大', token: '--fonts-size-4', value: '24px'},
          {label: '标题-中', token: '--fonts-size-5', value: '18px'},
          {label: '标题-小', token: '--fonts-size-6', value: '16px'},
          {label: '正文-常规-大', token: '--fonts-size-7', value: '14px'},
          {label: '正文-常规-小', token: '--fonts-size-8', value: '12px'},
          {label: '水印文字', token: '--fonts-size-9', value: '12px'}
        ],
        label: '字号',
        token: '--fonts-size-'
      },
      weight: {
        body: [
          {label: 'Ultra bold(heavy)', token: '--fonts-weight-1', value: 900},
          {label: 'Extra bold', token: '--fonts-weight-2', value: 800},
          {label: 'Blod', token: '--fonts-weight-3', value: 700},
          {label: 'Semi bold', token: '--fonts-weight-4', value: 600},
          {label: 'Medium', token: '--fonts-weight-5', value: 500},
          {label: 'Regular', token: '--fonts-weight-6', value: 400},
          {label: 'Light', token: '--fonts-weight-7', value: 300},
          {label: 'Extra light(thin)', token: '--fonts-weight-8', value: 200},
          {label: 'Uitra light', token: '--fonts-weight-9', value: 100}
        ],
        label: '字重',
        token: '--fonts-weight-'
      },
      lineHeight: {
        body: [
          {label: 'Line-height-1', token: '--fonts-lineHeight-1', value: 1.3},
          {label: 'Line-height-2', token: '--fonts-lineHeight-2', value: 1.5},
          {label: 'Line-height-3', token: '--fonts-lineHeight-3', value: 1.7}
        ],
        label: '行高',
        token: '--fonts-lineHeight-'
      }
    },
    sizes: {
      size: {
        base: 0.125,
        body: [
          {label: '无', token: '--sizes-size-0', value: '0rem', disabled: true},
          {
            label: 'auto',
            token: '--sizes-size-1',
            value: 'auto',
            disabled: true
          },
          {
            label: '特小',
            token: '--sizes-size-2',
            value: '0.125rem'
          },
          {
            label: '极小',
            token: '--sizes-size-3',
            value: '0.25rem'
          },
          {
            label: '小',
            token: '--sizes-size-4',
            value: '0.375rem'
          },
          {
            label: '正常',
            token: '--sizes-size-5',
            value: '0.5rem'
          },
          {
            label: '中',
            token: '--sizes-size-6',
            value: '0.625rem'
          },
          {
            label: '大',
            token: '--sizes-size-7',
            value: '0.75rem'
          },
          {
            label: '极大',
            token: '--sizes-size-8',
            value: '0.875rem'
          },
          {
            label: '特大',
            token: '--sizes-size-9',
            value: '1rem'
          }
        ],
        label: '尺寸',
        start: '0.125rem',
        token: '--sizes-size-'
      }
    },
    colors: {
      func: {
        body: [
          {
            body: {
              main: '#ff4d4f',
              colors: [
                {
                  color: '#660a18',
                  index: 0,
                  label: '1-#660a18',
                  token: '--colors-error-1'
                },
                {
                  color: '#8c1523',
                  index: 1,
                  label: '2-#8c1523',
                  token: '--colors-error-2'
                },
                {
                  color: '#b32430',
                  index: 2,
                  label: '3-#b32430',
                  token: '--colors-error-3'
                },
                {
                  color: '#d9363e',
                  index: 3,
                  label: '4-#d9363e',
                  token: '--colors-error-4'
                },
                {
                  color: '#ff4d4f',
                  index: 4,
                  label: '5-#ff4d4f',
                  token: '--colors-error-5'
                },
                {
                  color: '#ff7070',
                  index: 5,
                  label: '6-#ff7070',
                  token: '--colors-error-6'
                },
                {
                  color: '#ff9694',
                  index: 6,
                  label: '7-#ff9694',
                  token: '--colors-error-7'
                },
                {
                  color: '#ffbab8',
                  index: 7,
                  label: '8-#ffbab8',
                  token: '--colors-error-8'
                },
                {
                  color: '#ffdddb',
                  index: 8,
                  label: '9-#ffdddb',
                  token: '--colors-error-9'
                },
                {
                  color: '#ffe7e6',
                  index: 9,
                  label: '10-#ffe7e6',
                  token: '--colors-error-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '失败色',
            token: '--colors-error-'
          },
          {
            body: {
              main: '#faad14',
              colors: [
                {
                  color: '#613400',
                  index: 0,
                  label: '1-#613400',
                  token: '--colors-warning-1'
                },
                {
                  color: '#874d00',
                  index: 1,
                  label: '2-#874d00',
                  token: '--colors-warning-2'
                },
                {
                  color: '#ad6800',
                  index: 2,
                  label: '3-#ad6800',
                  token: '--colors-warning-3'
                },
                {
                  color: '#d48806',
                  index: 3,
                  label: '4-#d48806',
                  token: '--colors-warning-4'
                },
                {
                  color: '#faad14',
                  index: 4,
                  label: '5-#faad14',
                  token: '--colors-warning-5'
                },
                {
                  color: '#ffc443',
                  index: 5,
                  label: '6-#ffc443',
                  token: '--colors-warning-6'
                },
                {
                  color: '#ffd572',
                  index: 6,
                  label: '7-#ffd572',
                  token: '--colors-warning-7'
                },
                {
                  color: '#ffe4a1',
                  index: 7,
                  label: '8-#ffe4a1',
                  token: '--colors-warning-8'
                },
                {
                  color: '#fff2d0',
                  index: 8,
                  label: '9-#fff2d0',
                  token: '--colors-warning-9'
                },
                {
                  color: '#fff9e6',
                  index: 9,
                  label: '10-#fff9e6',
                  token: '--colors-warning-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '警告色',
            token: '--colors-warning-'
          },
          {
            body: {
              main: '#389e0d',
              colors: [
                {
                  color: '#010500',
                  index: 0,
                  label: '1-#010500',
                  token: '--colors-success-1'
                },
                {
                  color: '#092b00',
                  index: 1,
                  label: '2-#092b00',
                  token: '--colors-success-2'
                },
                {
                  color: '#135200',
                  index: 2,
                  label: '3-#135200',
                  token: '--colors-success-3'
                },
                {
                  color: '#237804',
                  index: 3,
                  label: '4-#237804',
                  token: '--colors-success-4'
                },
                {
                  color: '#389e0d',
                  index: 4,
                  label: '5-#389e0d',
                  token: '--colors-success-5'
                },
                {
                  color: '#55ab2d',
                  index: 5,
                  label: '6-#55ab2d',
                  token: '--colors-success-6'
                },
                {
                  color: '#74b852',
                  index: 6,
                  label: '7-#74b852',
                  token: '--colors-success-7'
                },
                {
                  color: '#95c47c',
                  index: 7,
                  label: '8-#95c47c',
                  token: '--colors-success-8'
                },
                {
                  color: '#b9d1ab',
                  index: 8,
                  label: '9-#b9d1ab',
                  token: '--colors-success-9'
                },
                {
                  color: '#d0dec8',
                  index: 9,
                  label: '10-#d0dec8',
                  token: '--colors-success-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '成功色',
            token: '--colors-success-'
          },
          {
            body: {
              colors: [
                {
                  color: '#002766',
                  index: 0,
                  label: '1-#002766',
                  token: '--colors-link-1'
                },
                {
                  color: '#003a8c',
                  index: 1,
                  label: '2-#003a8c',
                  token: '--colors-link-2'
                },
                {
                  color: '#0050b3',
                  index: 2,
                  label: '3-#0050b3',
                  token: '--colors-link-3'
                },
                {
                  color: '#096dd9',
                  index: 3,
                  label: '4-#096dd9',
                  token: '--colors-link-4'
                },
                {
                  color: '#1890ff',
                  index: 4,
                  label: '5-#1890ff',
                  token: '--colors-link-5'
                },
                {
                  color: '#45a8ff',
                  index: 5,
                  label: '6-#45a8ff',
                  token: '--colors-link-6'
                },
                {
                  color: '#74c0ff',
                  index: 6,
                  label: '7-#74c0ff',
                  token: '--colors-link-7'
                },
                {
                  color: '#a2d7ff',
                  index: 7,
                  label: '8-#a2d7ff',
                  token: '--colors-link-8'
                },
                {
                  color: '#d1ecff',
                  index: 8,
                  label: '9-#d1ecff',
                  token: '--colors-link-9'
                },
                {
                  color: '#e6f5ff',
                  index: 9,
                  label: '10-#e6f5ff',
                  token: '--colors-link-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '链接色',
            token: '--colors-link-'
          },
          {
            body: {
              colors: [
                {
                  color: '#002766',
                  index: 0,
                  label: '1-#002766',
                  token: '--colors-info-1'
                },
                {
                  color: '#003a8c',
                  index: 1,
                  label: '2-#003a8c',
                  token: '--colors-info-2'
                },
                {
                  color: '#0050b3',
                  index: 2,
                  label: '3-#0050b3',
                  token: '--colors-info-3'
                },
                {
                  color: '#096dd9',
                  index: 3,
                  label: '4-#096dd9',
                  token: '--colors-info-4'
                },
                {
                  color: '#1890ff',
                  index: 4,
                  label: '5-#1890ff',
                  token: '--colors-info-5'
                },
                {
                  color: '#45a8ff',
                  index: 5,
                  label: '6-#45a8ff',
                  token: '--colors-info-6'
                },
                {
                  color: '#74c0ff',
                  index: 6,
                  label: '7-#74c0ff',
                  token: '--colors-info-7'
                },
                {
                  color: '#a2d7ff',
                  index: 7,
                  label: '8-#a2d7ff',
                  token: '--colors-info-8'
                },
                {
                  color: '#d1ecff',
                  index: 8,
                  label: '9-#d1ecff',
                  token: '--colors-info-9'
                },
                {
                  color: '#e6f5ff',
                  index: 9,
                  label: '10-#e6f5ff',
                  token: '--colors-info-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '提示色',
            token: '--colors-info-'
          },
          {
            body: {
              main: '#2468f2',
              colors: [
                {
                  color: '#001259',
                  index: 0,
                  label: '1-#001259',
                  token: '--colors-other-1'
                },
                {
                  color: '#001e80',
                  index: 1,
                  label: '2-#001e80',
                  token: '--colors-other-2'
                },
                {
                  color: '#0832a6',
                  index: 2,
                  label: '3-#0832a6',
                  token: '--colors-other-3'
                },
                {
                  color: '#144bcc',
                  index: 3,
                  label: '4-#144bcc',
                  token: '--colors-other-4'
                },
                {
                  color: '#2468f2',
                  index: 4,
                  label: '5-#2468f2',
                  token: '--colors-other-5'
                },
                {
                  color: '#528eff',
                  index: 5,
                  label: '6-#528eff',
                  token: '--colors-other-6'
                },
                {
                  color: '#7dadff',
                  index: 6,
                  label: '7-#7dadff',
                  token: '--colors-other-7'
                },
                {
                  color: '#a8caff',
                  index: 7,
                  label: '8-#a8caff',
                  token: '--colors-other-8'
                },
                {
                  color: '#d4e5ff',
                  index: 8,
                  label: '9-#d4e5ff',
                  token: '--colors-other-9'
                },
                {
                  color: '#e6f0ff',
                  index: 9,
                  label: '10-#e6f0ff',
                  token: '--colors-other-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: '常规'},
                {id: 'active', color: 3, label: '点击'},
                {id: 'hover', color: 5, label: '悬浮'},
                {id: 'bg', color: 9, label: '背景'}
              ]
            },
            label: '其他色',
            token: '--colors-other-'
          }
        ],
        label: '辅助色',
        token: 'func'
      },
      brand: {
        body: {
          colors: [
            {
              color: '#002766',
              index: 0,
              label: '1-#002766',
              token: '--colors-brand-1'
            },
            {
              color: '#003a8c',
              index: 1,
              label: '2-#003a8c',
              token: '--colors-brand-2'
            },
            {
              color: '#0050b3',
              index: 2,
              label: '3-#0050b3',
              token: '--colors-brand-3'
            },
            {
              color: '#096dd9',
              index: 3,
              label: '4-#096dd9',
              token: '--colors-brand-4'
            },
            {
              color: '#1890ff',
              index: 4,
              label: '5-#1890ff',
              token: '--colors-brand-5'
            },
            {
              color: '#45a8ff',
              index: 5,
              label: '6-#45a8ff',
              token: '--colors-brand-6'
            },
            {
              color: '#74c0ff',
              index: 6,
              label: '7-#74c0ff',
              token: '--colors-brand-7'
            },
            {
              color: '#a2d7ff',
              index: 7,
              label: '8-#a2d7ff',
              token: '--colors-brand-8'
            },
            {
              color: '#d1ecff',
              index: 8,
              label: '9-#d1ecff',
              token: '--colors-brand-9'
            },
            {
              color: '#e6f5ff',
              index: 9,
              label: '10-#e6f5ff',
              token: '--colors-brand-10'
            }
          ],
          common: [
            {id: 'default', color: 4, label: '常规'},
            {id: 'active', color: 3, label: '点击'},
            {id: 'hover', color: 5, label: '悬浮'},
            {id: 'bg', color: 9, label: '背景'}
          ]
        },
        label: '品牌色',
        token: '--colors-brand-'
      },
      neutral: {
        body: [
          {
            body: {
              common: [
                {id: 'strong', color: 1, label: '强调/正文标题'},
                {id: 'lessStrong', color: 3, label: '次强调/正文标题'},
                {id: 'info', color: 4, label: '辅助说明'},
                {id: 'disabledInfo', color: 5, label: '禁用'},
                {id: 'white', color: 10, label: '纯白文字'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-text-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-text-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-text-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-text-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-text-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-text-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-text-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-text-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-text-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-text-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-text-11'
                }
              ]
            },
            label: '文字',
            token: '--colors-neutral-text-'
          },
          {
            body: {
              none: 'transparent',
              common: [
                {id: 'fill-white', color: 10, label: '纯白填充'},
                {id: 'fill-1', color: 9, label: '浅/禁用背景'},
                {id: 'fill-2', color: 7, label: '分割线'},
                {id: 'fill-3', color: 6, label: '深/灰底悬浮'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-fill-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-fill-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-fill-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-fill-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-fill-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-fill-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-fill-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-fill-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-fill-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-fill-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-fill-11'
                }
              ]
            },
            label: '填充',
            token: '--colors-neutral-fill-'
          },
          {
            body: {
              common: [
                {id: 'line-1', color: 9, label: '浅'},
                {id: 'line-2', color: 7, label: '常规'},
                {id: 'line-3', color: 5, label: '深'},
                {id: 'line-4', color: 3, label: '重'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-line-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-line-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-line-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-line-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-line-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-line-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-line-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-line-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-line-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-line-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-line-11'
                }
              ]
            },
            label: '线条',
            token: '--colors-neutral-line-'
          }
        ],
        label: '中性色',
        token: '--colors-neutral-'
      },
      data: {
        label: '数据色',
        body: [
          {
            label: '默认',
            token: 'dataColor1',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#a04bfa'
              },
              {
                value: '#fc2d98'
              },
              {
                value: '#c26711'
              },
              {
                value: '#579c0e'
              },
              {
                value: '#10b35f'
              },
              {
                value: '#129dc7'
              }
            ]
          },
          {
            label: '经典',
            token: 'dataColor2',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#c735fc'
              },
              {
                value: '#fc3f42'
              },
              {
                value: '#72910d'
              },
              {
                value: '#11ba38'
              },
              {
                value: '#129dc7'
              },
              {
                value: '#815bfc'
              }
            ]
          },
          {
            label: '过渡',
            token: 'dataColor3',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#4878fa'
              },
              {
                value: '#6568fc'
              },
              {
                value: '#815bfc'
              },
              {
                value: '#a04bfa'
              },
              {
                value: '#c735fc'
              },
              {
                value: '#f61efa'
              }
            ]
          }
        ]
      }
    },
    borders: {
      style: {
        body: [
          {
            label: '无',
            token: '--borders-style-1',
            value: 'none',
            disabled: true
          },
          {label: '实线', token: '--borders-style-2', value: 'solid'},
          {label: '虚线', token: '--borders-style-3', value: 'dashed'},
          {label: '点线', token: '--borders-style-4', value: 'dotted'}
        ],
        label: '样式',
        token: '--borders-style-'
      },
      width: {
        body: [
          {
            label: '无',
            token: '--borders-width-1',
            value: '0px',
            disabled: true
          },
          {label: '常规', token: '--borders-width-2', value: '1px'},
          {label: '中粗', token: '--borders-width-3', value: '2px'},
          {label: '特粗', token: '--borders-width-4', value: '4px'}
        ],
        label: '粗细',
        token: '--borders-width-'
      },
      radius: {
        body: [
          {
            label: '无',
            token: '--borders-radius-1',
            value: '0px',
            disabled: true
          },
          {label: '圆角1', token: '--borders-radius-2', value: '1px'},
          {label: '圆角2', token: '--borders-radius-3', value: '2px'},
          {label: '圆角3', token: '--borders-radius-4', value: '6px'},
          {label: '圆角4', token: '--borders-radius-5', value: '8px'},
          {label: '圆角5', token: '--borders-radius-6', value: '10px'},
          {label: '圆角6', token: '--borders-radius-7', value: '50%'}
        ],
        label: '圆角',
        token: '--borders-radius-'
      }
    },
    shadows: {
      shadow: {
        body: [
          {
            label: '无阴影',
            token: '--shadows-shadow-none',
            value: [
              {
                x: '0px',
                y: '0px',
                blur: '0px',
                color: 'transparent',
                inset: false,
                spread: '0px'
              }
            ],
            disabled: true
          },
          {
            label: '阴影sm',
            token: '--shadows-shadow-sm',
            value: [
              {
                x: '0px',
                y: '1px',
                blur: '2px',
                color: 'rgba(0, 0, 0, 0.05)',
                inset: false,
                spread: '0px'
              }
            ]
          },
          {
            label: '阴影',
            token: '--shadows-shadow-normal',
            value: [
              {
                x: '0px',
                y: '1px',
                blur: '3px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '0px'
              },
              {
                x: '0px',
                y: '1px',
                blur: '2px',
                color: 'rgba(0, 0, 0, 0.06)',
                inset: false,
                spread: '0px'
              }
            ]
          },
          {
            label: '阴影md',
            token: '--shadows-shadow-md',
            value: [
              {
                x: '0px',
                y: '4px',
                blur: '-1px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '0px'
              },
              {
                x: '0px',
                y: '2px',
                blur: '4px',
                color: 'rgba(0, 0, 0, 0.06)',
                inset: false,
                spread: '-1px'
              }
            ]
          },
          {
            label: '阴影lg',
            token: '--shadows-shadow-lg',
            value: [
              {
                x: '0px',
                y: '10px',
                blur: '15px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '-3px'
              },
              {
                x: '0px',
                y: '4px',
                blur: '6px',
                color: 'rgba(0, 0, 0, 0.05)',
                inset: false,
                spread: '-2px'
              }
            ]
          },
          {
            label: '阴影xl',
            token: '--shadows-shadow-xl',
            value: [
              {
                x: '0px',
                y: '20px',
                blur: '25px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '-5px'
              },
              {
                x: '0px',
                y: '10px',
                blur: '10px',
                color: 'rgba(0, 0, 0, 0.04)',
                inset: false,
                spread: '-5px'
              }
            ]
          },
          {
            label: '阴影2xl',
            token: '--shadows-shadow-2xl',
            value: [
              {
                x: '0px',
                y: '25px',
                blur: '50px',
                color: 'rgba(0, 0, 0, 0.25)',
                inset: false,
                spread: '-12px'
              }
            ]
          }
        ],
        label: '阴影',
        token: '--shadows-shadow-'
      }
    }
  },
  component
};

export default antdData;
