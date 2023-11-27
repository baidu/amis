import type {ThemeDefinition} from '../helper/declares';
import component from './component';

const cxdData: ThemeDefinition = {
  config: {
    name: '云舍',
    key: 'cxd',
    description: '系统预设主题'
  },
  global: {
    colors: {
      brand: {
        token: '--colors-brand-',
        label: '品牌色',
        body: {
          common: [
            {
              id: 'default',
              label: '常规',
              color: 4
            },
            {
              id: 'active',
              label: '点击',
              color: 3
            },
            {
              id: 'hover',
              label: '悬浮',
              color: 5
            },
            {
              id: 'bg',
              label: '背景',
              color: 9
            }
          ],
          colors: [
            {
              token: '--colors-brand-1',
              label: '1-#001259',
              color: '#001259',
              index: 0
            },
            {
              token: '--colors-brand-2',
              label: '2-#001e80',
              color: '#001e80',
              index: 1
            },
            {
              token: '--colors-brand-3',
              label: '3-#0832a6',
              color: '#0832a6',
              index: 2
            },
            {
              token: '--colors-brand-4',
              label: '4-#144bcc',
              color: '#144bcc',
              index: 3
            },
            {
              token: '--colors-brand-5',
              label: '5-#2468f2',
              color: '#2468f2',
              index: 4
            },
            {
              token: '--colors-brand-6',
              label: '6-#528eff',
              color: '#528eff',
              index: 5
            },
            {
              token: '--colors-brand-7',
              label: '7-#7dadff',
              color: '#7dadff',
              index: 6
            },
            {
              token: '--colors-brand-8',
              label: '8-#a8caff',
              color: '#a8caff',
              index: 7
            },
            {
              token: '--colors-brand-9',
              label: '9-#d4e5ff',
              color: '#d4e5ff',
              index: 8
            },
            {
              token: '--colors-brand-10',
              label: '10-#e6f0ff',
              color: '#e6f0ff',
              index: 9
            }
          ]
        }
      },
      neutral: {
        token: '--colors-neutral-',
        label: '中性色',
        body: [
          {
            token: '--colors-neutral-text-',
            label: '文字',
            body: {
              common: [
                {
                  id: 'strong',
                  label: '强调/正文标题',
                  color: 1
                },
                {
                  id: 'lessStrong',
                  label: '次强调/正文标题',
                  color: 3
                },
                {
                  id: 'info',
                  label: '辅助说明',
                  color: 4
                },
                {
                  id: 'disabledInfo',
                  label: '禁用',
                  color: 5
                },
                {
                  id: 'white',
                  label: '纯白文字',
                  color: 10
                }
              ],
              colors: [
                {
                  token: '--colors-neutral-text-1',
                  label: '1-#070c14',
                  color: '#070c14',
                  index: 0
                },
                {
                  token: '--colors-neutral-text-2',
                  label: '2-#151b26',
                  color: '#151b26',
                  index: 1
                },
                {
                  token: '--colors-neutral-text-3',
                  label: '3-#303540',
                  color: '#303540',
                  index: 2
                },
                {
                  token: '--colors-neutral-text-4',
                  label: '4-#5c5f66',
                  color: '#5c5f66',
                  index: 3
                },
                {
                  token: '--colors-neutral-text-5',
                  label: '5-#84878c',
                  color: '#84878c',
                  index: 4
                },
                {
                  token: '--colors-neutral-text-6',
                  label: '6-#b8babf',
                  color: '#b8babf',
                  index: 5
                },
                {
                  token: '--colors-neutral-text-7',
                  label: '7-#d4d6d9',
                  color: '#d4d6d9',
                  index: 6
                },
                {
                  token: '--colors-neutral-text-8',
                  label: '8-#e8e9eb',
                  color: '#e8e9eb',
                  index: 7
                },
                {
                  token: '--colors-neutral-text-9',
                  label: '9-#f2f3f5',
                  color: '#f2f3f5',
                  index: 8
                },
                {
                  token: '--colors-neutral-text-10',
                  label: '10-#f7f8fa',
                  color: '#f7f8fa',
                  index: 9
                },
                {
                  token: '--colors-neutral-text-11',
                  label: '11-#ffffff',
                  color: '#ffffff',
                  index: 10
                }
              ]
            }
          },
          {
            token: '--colors-neutral-fill-',
            label: '填充',
            body: {
              none: 'transparent',
              common: [
                {
                  id: 'fill-white',
                  label: '纯白填充',
                  color: 10
                },
                {
                  id: 'fill-1',
                  label: '浅/禁用背景',
                  color: 9
                },
                {
                  id: 'fill-2',
                  label: '分割线',
                  color: 7
                },
                {
                  id: 'fill-3',
                  label: '深/灰底悬浮',
                  color: 6
                }
              ],
              colors: [
                {
                  token: '--colors-neutral-fill-1',
                  label: '1-#070c14',
                  color: '#070c14',
                  index: 0
                },
                {
                  token: '--colors-neutral-fill-2',
                  label: '2-#151b26',
                  color: '#151b26',
                  index: 1
                },
                {
                  token: '--colors-neutral-fill-3',
                  label: '3-#303540',
                  color: '#303540',
                  index: 2
                },
                {
                  token: '--colors-neutral-fill-4',
                  label: '4-#5c5f66',
                  color: '#5c5f66',
                  index: 3
                },
                {
                  token: '--colors-neutral-fill-5',
                  label: '5-#84878c',
                  color: '#84878c',
                  index: 4
                },
                {
                  token: '--colors-neutral-fill-6',
                  label: '6-#b8babf',
                  color: '#b8babf',
                  index: 5
                },
                {
                  token: '--colors-neutral-fill-7',
                  label: '7-#d4d6d9',
                  color: '#d4d6d9',
                  index: 6
                },
                {
                  token: '--colors-neutral-fill-8',
                  label: '8-#e8e9eb',
                  color: '#e8e9eb',
                  index: 7
                },
                {
                  token: '--colors-neutral-fill-9',
                  label: '9-#f2f3f5',
                  color: '#f2f3f5',
                  index: 8
                },
                {
                  token: '--colors-neutral-fill-10',
                  label: '10-#f7f8fa',
                  color: '#f7f8fa',
                  index: 9
                },
                {
                  token: '--colors-neutral-fill-11',
                  label: '11-#ffffff',
                  color: '#ffffff',
                  index: 10
                }
              ]
            }
          },
          {
            token: '--colors-neutral-line-',
            label: '线条',
            body: {
              common: [
                {
                  id: 'line-1',
                  label: '浅',
                  color: 9
                },
                {
                  id: 'line-2',
                  label: '常规',
                  color: 7
                },
                {
                  id: 'line-3',
                  label: '深',
                  color: 5
                },
                {
                  id: 'line-4',
                  label: '重',
                  color: 3
                }
              ],
              colors: [
                {
                  token: '--colors-neutral-line-1',
                  label: '1-#070c14',
                  color: '#070c14',
                  index: 0
                },
                {
                  token: '--colors-neutral-line-2',
                  label: '2-#151b26',
                  color: '#151b26',
                  index: 1
                },
                {
                  token: '--colors-neutral-line-3',
                  label: '3-#303540',
                  color: '#303540',
                  index: 2
                },
                {
                  token: '--colors-neutral-line-4',
                  label: '4-#5c5f66',
                  color: '#5c5f66',
                  index: 3
                },
                {
                  token: '--colors-neutral-line-5',
                  label: '5-#84878c',
                  color: '#84878c',
                  index: 4
                },
                {
                  token: '--colors-neutral-line-6',
                  label: '6-#b8babf',
                  color: '#b8babf',
                  index: 5
                },
                {
                  token: '--colors-neutral-line-7',
                  label: '7-#d4d6d9',
                  color: '#d4d6d9',
                  index: 6
                },
                {
                  token: '--colors-neutral-line-8',
                  label: '8-#e8e9eb',
                  color: '#e8e9eb',
                  index: 7
                },
                {
                  token: '--colors-neutral-line-9',
                  label: '9-#f2f3f5',
                  color: '#f2f3f5',
                  index: 8
                },
                {
                  token: '--colors-neutral-line-10',
                  label: '10-#f7f8fa',
                  color: '#f7f8fa',
                  index: 9
                },
                {
                  token: '--colors-neutral-line-11',
                  label: '11-#ffffff',
                  color: '#ffffff',
                  index: 10
                }
              ]
            }
          }
        ]
      },
      func: {
        token: 'func',
        label: '辅助色',
        body: [
          {
            token: '--colors-error-',
            label: '失败色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-error-1',
                  label: '1-#590410',
                  color: '#590410',
                  index: 0
                },
                {
                  token: '--colors-error-2',
                  label: '2-#800d18',
                  color: '#800d18',
                  index: 1
                },
                {
                  token: '--colors-error-3',
                  label: '3-#a61922',
                  color: '#a61922',
                  index: 2
                },
                {
                  token: '--colors-error-4',
                  label: '4-#cc292e',
                  color: '#cc292e',
                  index: 3
                },
                {
                  token: '--colors-error-5',
                  label: '5-#f23d3d',
                  color: '#f23d3d',
                  index: 4
                },
                {
                  token: '--colors-error-6',
                  label: '6-#ff6966',
                  color: '#ff6966',
                  index: 5
                },
                {
                  token: '--colors-error-7',
                  label: '7-#ff908c',
                  color: '#ff908c',
                  index: 6
                },
                {
                  token: '--colors-error-8',
                  label: '8-#ffb6b3',
                  color: '#ffb6b3',
                  index: 7
                },
                {
                  token: '--colors-error-9',
                  label: '9-#ffdbd9',
                  color: '#ffdbd9',
                  index: 8
                },
                {
                  token: '--colors-error-10',
                  label: '10-#ffe8e6',
                  color: '#ffe8e6',
                  index: 9
                }
              ]
            }
          },
          {
            token: '--colors-warning-',
            label: '警告色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-warning-1',
                  label: '1-#662500',
                  color: '#662500',
                  index: 0
                },
                {
                  token: '--colors-warning-2',
                  label: '2-#8c3800',
                  color: '#8c3800',
                  index: 1
                },
                {
                  token: '--colors-warning-3',
                  label: '3-#b35209',
                  color: '#b35209',
                  index: 2
                },
                {
                  token: '--colors-warning-4',
                  label: '4-#d97116',
                  color: '#d97116',
                  index: 3
                },
                {
                  token: '--colors-warning-5',
                  label: '5-#ff9326',
                  color: '#ff9326',
                  index: 4
                },
                {
                  token: '--colors-warning-6',
                  label: '6-#ffab52',
                  color: '#ffab52',
                  index: 5
                },
                {
                  token: '--colors-warning-7',
                  label: '7-#ffc27d',
                  color: '#ffc27d',
                  index: 6
                },
                {
                  token: '--colors-warning-8',
                  label: '8-#ffd8a8',
                  color: '#ffd8a8',
                  index: 7
                },
                {
                  token: '--colors-warning-9',
                  label: '9-#ffecd4',
                  color: '#ffecd4',
                  index: 8
                },
                {
                  token: '--colors-warning-10',
                  label: '10-#fff4e6',
                  color: '#fff4e6',
                  index: 9
                }
              ]
            }
          },
          {
            token: '--colors-success-',
            label: '成功色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-success-1',
                  label: '1-#012600',
                  color: '#012600',
                  index: 0
                },
                {
                  token: '--colors-success-2',
                  label: '2-#054d00',
                  color: '#054d00',
                  index: 1
                },
                {
                  token: '--colors-success-3',
                  label: '3-#0b7300',
                  color: '#0b7300',
                  index: 2
                },
                {
                  token: '--colors-success-4',
                  label: '4-#1b9908',
                  color: '#1b9908',
                  index: 3
                },
                {
                  token: '--colors-success-5',
                  label: '5-#30bf13',
                  color: '#30bf13',
                  index: 4
                },
                {
                  token: '--colors-success-6',
                  label: '6-#54cc39',
                  color: '#54cc39',
                  index: 5
                },
                {
                  token: '--colors-success-7',
                  label: '7-#7bd964',
                  color: '#7bd964',
                  index: 6
                },
                {
                  token: '--colors-success-8',
                  label: '8-#a5e693',
                  color: '#a5e693',
                  index: 7
                },
                {
                  token: '--colors-success-9',
                  label: '9-#d1f2c7',
                  color: '#d1f2c7',
                  index: 8
                },
                {
                  token: '--colors-success-10',
                  label: '10-#ecffe6',
                  color: '#ecffe6',
                  index: 9
                }
              ]
            }
          },
          {
            token: '--colors-link-',
            label: '链接色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-link-1',
                  label: '1-#001259',
                  color: '#001259',
                  index: 0
                },
                {
                  token: '--colors-link-2',
                  label: '2-#001e80',
                  color: '#001e80',
                  index: 1
                },
                {
                  token: '--colors-link-3',
                  label: '3-#0832a6',
                  color: '#0832a6',
                  index: 2
                },
                {
                  token: '--colors-link-4',
                  label: '4-#144bcc',
                  color: '#144bcc',
                  index: 3
                },
                {
                  token: '--colors-link-5',
                  label: '5-#2468f2',
                  color: '#2468f2',
                  index: 4
                },
                {
                  token: '--colors-link-6',
                  label: '6-#528eff',
                  color: '#528eff',
                  index: 5
                },
                {
                  token: '--colors-link-7',
                  label: '7-#7dadff',
                  color: '#7dadff',
                  index: 6
                },
                {
                  token: '--colors-link-8',
                  label: '8-#a8caff',
                  color: '#a8caff',
                  index: 7
                },
                {
                  token: '--colors-link-9',
                  label: '9-#d4e5ff',
                  color: '#d4e5ff',
                  index: 8
                },
                {
                  token: '--colors-link-10',
                  label: '10-#e6f0ff',
                  color: '#e6f0ff',
                  index: 9
                }
              ]
            }
          },
          {
            token: '--colors-info-',
            label: '提示色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-info-1',
                  label: '1-#001259',
                  color: '#001259',
                  index: 0
                },
                {
                  token: '--colors-info-2',
                  label: '2-#001e80',
                  color: '#001e80',
                  index: 1
                },
                {
                  token: '--colors-info-3',
                  label: '3-#0832a6',
                  color: '#0832a6',
                  index: 2
                },
                {
                  token: '--colors-info-4',
                  label: '4-#144bcc',
                  color: '#144bcc',
                  index: 3
                },
                {
                  token: '--colors-info-5',
                  label: '5-#2468f2',
                  color: '#2468f2',
                  index: 4
                },
                {
                  token: '--colors-info-6',
                  label: '6-#528eff',
                  color: '#528eff',
                  index: 5
                },
                {
                  token: '--colors-info-7',
                  label: '7-#7dadff',
                  color: '#7dadff',
                  index: 6
                },
                {
                  token: '--colors-info-8',
                  label: '8-#a8caff',
                  color: '#a8caff',
                  index: 7
                },
                {
                  token: '--colors-info-9',
                  label: '9-#d4e5ff',
                  color: '#d4e5ff',
                  index: 8
                },
                {
                  token: '--colors-info-10',
                  label: '10-#e6f0ff',
                  color: '#e6f0ff',
                  index: 9
                }
              ]
            }
          },
          {
            token: '--colors-other-',
            label: '其他色',
            body: {
              common: [
                {
                  id: 'default',
                  label: '常规',
                  color: 4
                },
                {
                  id: 'active',
                  label: '点击',
                  color: 3
                },
                {
                  id: 'hover',
                  label: '悬浮',
                  color: 5
                },
                {
                  id: 'bg',
                  label: '背景',
                  color: 9
                }
              ],
              colors: [
                {
                  token: '--colors-other-1',
                  label: '1-#001259',
                  color: '#001259',
                  index: 0
                },
                {
                  token: '--colors-other-2',
                  label: '2-#001e80',
                  color: '#001e80',
                  index: 1
                },
                {
                  token: '--colors-other-3',
                  label: '3-#0832a6',
                  color: '#0832a6',
                  index: 2
                },
                {
                  token: '--colors-other-4',
                  label: '4-#144bcc',
                  color: '#144bcc',
                  index: 3
                },
                {
                  token: '--colors-other-5',
                  label: '5-#2468f2',
                  color: '#2468f2',
                  index: 4
                },
                {
                  token: '--colors-other-6',
                  label: '6-#528eff',
                  color: '#528eff',
                  index: 5
                },
                {
                  token: '--colors-other-7',
                  label: '7-#7dadff',
                  color: '#7dadff',
                  index: 6
                },
                {
                  token: '--colors-other-8',
                  label: '8-#a8caff',
                  color: '#a8caff',
                  index: 7
                },
                {
                  token: '--colors-other-9',
                  label: '9-#d4e5ff',
                  color: '#d4e5ff',
                  index: 8
                },
                {
                  token: '--colors-other-10',
                  label: '10-#e6f0ff',
                  color: '#e6f0ff',
                  index: 9
                }
              ]
            }
          }
        ]
      },
      data: {
        label: '数据色',
        body: [
          {
            label: '默认',
            token: 'dataColor1',
            colors: [
              {
                value: '#2468f2'
              },
              {
                value: '#aa24ed'
              },
              {
                value: '#e32262'
              },
              {
                value: '#855f14'
              },
              {
                value: '#3b8714'
              },
              {
                value: '#158a63'
              },
              {
                value: '#1c77b8'
              }
            ]
          },
          {
            label: '经典',
            token: 'dataColor2',
            colors: [
              {
                value: '#2468f2'
              },
              {
                value: '#c01fcf'
              },
              {
                value: '#cc3b1f'
              },
              {
                value: '#4f7a12'
              },
              {
                value: '#158f48'
              },
              {
                value: '#1c77b8'
              },
              {
                value: '#8437f0'
              }
            ]
          },
          {
            label: '过渡',
            token: 'dataColor3',
            colors: [
              {
                value: '#2468f2'
              },
              {
                value: '#4856f0'
              },
              {
                value: '#6347ed'
              },
              {
                value: '#8437f0'
              },
              {
                value: '#aa24ed'
              },
              {
                value: '#c01fcf'
              },
              {
                value: '#cc1faf'
              }
            ]
          }
        ]
      }
    },
    fonts: {
      base: {
        label: '基础字体',
        token: '--fonts-base-family',
        body: [
          {
            value: '-apple-system'
          },
          {
            value: 'BlinkMacSystemFont'
          },
          {
            value: 'SF Pro SC'
          },
          {
            value: 'SF Pro Text'
          },
          {
            value: 'Helvetica Neue'
          },
          {
            value: 'Helvetica'
          },
          {
            value: 'PingFang SC'
          },
          {
            value: 'Segoe UI'
          },
          {
            value: 'Roboto'
          },
          {
            value: 'Hiragino Sans GB'
          },
          {
            value: 'Arial'
          },
          {
            value: 'microsoft yahei ui'
          },
          {
            value: 'Microsoft YaHei'
          },
          {
            value: 'SimSun'
          },
          {
            value: 'sans-serif'
          }
        ]
      },
      size: {
        label: '字号',
        token: '--fonts-size-',
        body: [
          {
            label: '运营标题-大',
            token: '--fonts-size-1',
            value: '48px'
          },
          {
            label: '运营标题-中',
            token: '--fonts-size-2',
            value: '40px'
          },
          {
            label: '运营标题-小',
            token: '--fonts-size-3',
            value: '32px'
          },
          {
            label: '标题-大',
            token: '--fonts-size-4',
            value: '24px'
          },
          {
            label: '标题-中',
            token: '--fonts-size-5',
            value: '18px'
          },
          {
            label: '标题-小',
            token: '--fonts-size-6',
            value: '16px'
          },
          {
            label: '正文-常规-大',
            token: '--fonts-size-7',
            value: '14px'
          },
          {
            label: '正文-常规-小',
            token: '--fonts-size-8',
            value: '12px'
          },
          {
            label: '水印文字',
            token: '--fonts-size-9',
            value: '12px'
          }
        ]
      },
      lineHeight: {
        label: '行高',
        token: '--fonts-lineHeight-',
        body: [
          {
            label: 'Line-height-1',
            token: '--fonts-lineHeight-1',
            value: 1.3
          },
          {
            label: 'Line-height-2',
            token: '--fonts-lineHeight-2',
            value: 1.5
          },
          {
            label: 'Line-height-3',
            token: '--fonts-lineHeight-3',
            value: 1.7
          }
        ]
      },
      weight: {
        label: '字重',
        token: '--fonts-weight-',
        body: [
          {
            label: 'Ultra bold(heavy)',
            token: '--fonts-weight-1',
            value: 900
          },
          {
            label: 'Extra bold',
            token: '--fonts-weight-2',
            value: 800
          },
          {
            label: 'Blod',
            token: '--fonts-weight-3',
            value: 700
          },
          {
            label: 'Semi bold',
            token: '--fonts-weight-4',
            value: 600
          },
          {
            label: 'Medium',
            token: '--fonts-weight-5',
            value: 500
          },
          {
            label: 'Regular',
            token: '--fonts-weight-6',
            value: 400
          },
          {
            label: 'Light',
            token: '--fonts-weight-7',
            value: 300
          },
          {
            label: 'Extra light(thin)',
            token: '--fonts-weight-8',
            value: 200
          },
          {
            label: 'Uitra light',
            token: '--fonts-weight-9',
            value: 100
          }
        ]
      }
    },
    borders: {
      width: {
        label: '粗细',
        token: '--borders-width-',
        body: [
          {
            label: '无',
            disabled: true,
            token: '--borders-width-1',
            value: '0px'
          },
          {
            label: '常规',
            token: '--borders-width-2',
            value: '1px'
          },
          {
            label: '中粗',
            token: '--borders-width-3',
            value: '2px'
          },
          {
            label: '特粗',
            token: '--borders-width-4',
            value: '4px'
          }
        ]
      },
      style: {
        label: '样式',
        token: '--borders-style-',
        body: [
          {
            label: '无',
            disabled: true,
            token: '--borders-style-1',
            value: 'none'
          },
          {
            label: '实线',
            token: '--borders-style-2',
            value: 'solid'
          },
          {
            label: '虚线',
            token: '--borders-style-3',
            value: 'dashed'
          },
          {
            label: '点线',
            token: '--borders-style-4',
            value: 'dotted'
          }
        ]
      },
      radius: {
        label: '圆角',
        token: '--borders-radius-',
        body: [
          {
            label: '无',
            disabled: true,
            token: '--borders-radius-1',
            value: '0px'
          },
          {
            label: '圆角1',
            token: '--borders-radius-2',
            value: '2px'
          },
          {
            label: '圆角2',
            token: '--borders-radius-3',
            value: '4px'
          },
          {
            label: '圆角3',
            token: '--borders-radius-4',
            value: '6px'
          },
          {
            label: '圆角4',
            token: '--borders-radius-5',
            value: '8px'
          },
          {
            label: '圆角5',
            token: '--borders-radius-6',
            value: '10px'
          },
          {
            label: '圆角6',
            token: '--borders-radius-7',
            value: '50%'
          }
        ]
      }
    },
    sizes: {
      size: {
        label: '尺寸',
        token: '--sizes-size-',
        base: 0.125,
        start: '0.125rem',
        body: [
          {
            label: '无',
            disabled: true,
            token: '--sizes-size-0',
            value: '0rem'
          },
          {
            label: 'auto',
            disabled: true,
            token: '--sizes-size-1',
            value: 'auto'
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
        ]
      }
    },
    shadows: {
      shadow: {
        label: '阴影',
        token: '--shadows-shadow-',
        body: [
          {
            label: '无阴影',
            disabled: true,
            token: '--shadows-shadow-none',
            value: [
              {
                inset: false,
                x: '0px',
                y: '0px',
                blur: '0px',
                spread: '0px',
                color: 'transparent'
              }
            ]
          },
          {
            label: '阴影sm',
            token: '--shadows-shadow-sm',
            value: [
              {
                inset: false,
                x: '0px',
                y: '1px',
                blur: '2px',
                spread: '0px',
                color: 'rgba(0, 0, 0, 0.05)'
              }
            ]
          },
          {
            label: '阴影',
            token: '--shadows-shadow-normal',
            value: [
              {
                inset: false,
                x: '0px',
                y: '1px',
                blur: '3px',
                spread: '0px',
                color: 'rgba(0, 0, 0, 0.1)'
              },
              {
                inset: false,
                x: '0px',
                y: '1px',
                blur: '2px',
                spread: '0px',
                color: 'rgba(0, 0, 0, 0.06)'
              }
            ]
          },
          {
            label: '阴影md',
            token: '--shadows-shadow-md',
            value: [
              {
                inset: false,
                x: '0px',
                y: '4px',
                blur: '-1px',
                spread: '0px',
                color: 'rgba(0, 0, 0, 0.1)'
              },
              {
                inset: false,
                x: '0px',
                y: '2px',
                blur: '4px',
                spread: '-1px',
                color: 'rgba(0, 0, 0, 0.06)'
              }
            ]
          },
          {
            label: '阴影lg',
            token: '--shadows-shadow-lg',
            value: [
              {
                inset: false,
                x: '0px',
                y: '10px',
                blur: '15px',
                spread: '-3px',
                color: 'rgba(0, 0, 0, 0.1)'
              },
              {
                inset: false,
                x: '0px',
                y: '4px',
                blur: '6px',
                spread: '-2px',
                color: 'rgba(0, 0, 0, 0.05)'
              }
            ]
          },
          {
            label: '阴影xl',
            token: '--shadows-shadow-xl',
            value: [
              {
                inset: false,
                x: '0px',
                y: '20px',
                blur: '25px',
                spread: '-5px',
                color: 'rgba(0, 0, 0, 0.1)'
              },
              {
                inset: false,
                x: '0px',
                y: '10px',
                blur: '10px',
                spread: '-5px',
                color: 'rgba(0, 0, 0, 0.04)'
              }
            ]
          },
          {
            label: '阴影2xl',
            token: '--shadows-shadow-2xl',
            value: [
              {
                inset: false,
                x: '0px',
                y: '25px',
                blur: '50px',
                spread: '-12px',
                color: 'rgba(0, 0, 0, 0.25)'
              }
            ]
          }
        ]
      }
    }
  },
  component
};
export default cxdData;
