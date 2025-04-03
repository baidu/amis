import type {ThemeDefinition} from '../helper/declares';

const component: ThemeDefinition['component'] = {
  button1: {
    type: [
      {
        label: '默认',
        custom: false,
        type: 'default',
        default: {
          label: '默认常规',
          token: '--button-default-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-default-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-brand-5)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-default-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-brand-4)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-brand-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-default-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '主要',
        custom: false,
        type: 'primary',
        default: {
          label: '默认常规',
          token: '--button-primary-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-brand-5)',
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-primary-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-brand-6)',
            'border': {
              'top-border-color': 'var(--colors-brand-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-primary-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-brand-4)',
            'border': {
              'top-border-color': 'var(--colors-brand-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-primary-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '次要',
        custom: false,
        type: 'secondary',
        default: {
          label: '默认常规',
          token: '--button-secondary-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-6)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-secondary-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-5)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-secondary-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-4)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-secondary-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '增强',
        custom: false,
        type: 'enhance',
        default: {
          label: '默认常规',
          token: '--button-enhance-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-brand-5)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-enhance-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-brand-6)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-brand-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-enhance-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-brand-4)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-brand-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-enhance-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '信息',
        custom: false,
        type: 'info',
        default: {
          label: '默认常规',
          token: '--button-info-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-info-5)',
            'border': {
              'top-border-color': 'var(--colors-info-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-info-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-info-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-info-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-info-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-info-6)',
            'border': {
              'top-border-color': 'var(--colors-info-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-info-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-info-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-info-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-info-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-info-4)',
            'border': {
              'top-border-color': 'var(--colors-info-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-info-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-info-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-info-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-info-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '成功',
        custom: false,
        type: 'success',
        default: {
          label: '默认常规',
          token: '--button-success-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-success-5)',
            'border': {
              'top-border-color': 'var(--colors-success-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-success-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-success-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-success-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-success-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-success-6)',
            'border': {
              'top-border-color': 'var(--colors-success-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-success-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-success-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-success-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-success-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-success-4)',
            'border': {
              'top-border-color': 'var(--colors-success-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-success-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-success-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-success-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-success-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '警告',
        custom: false,
        type: 'warning',
        default: {
          label: '默认常规',
          token: '--button-warning-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-warning-5)',
            'border': {
              'top-border-color': 'var(--colors-warning-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-warning-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-warning-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-warning-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-warning-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-warning-6)',
            'border': {
              'top-border-color': 'var(--colors-warning-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-warning-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-warning-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-warning-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-warning-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-warning-4)',
            'border': {
              'top-border-color': 'var(--colors-warning-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-warning-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-warning-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-warning-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-warning-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '危险',
        custom: false,
        type: 'danger',
        default: {
          label: '默认常规',
          token: '--button-danger-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-error-5)',
            'border': {
              'top-border-color': 'var(--colors-error-5)',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'var(--colors-error-5)',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'var(--colors-error-5)',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'var(--colors-error-5)',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-danger-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-error-6)',
            'border': {
              'top-border-color': 'var(--colors-error-6)',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'var(--colors-error-6)',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'var(--colors-error-6)',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'var(--colors-error-6)',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-danger-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-error-4)',
            'border': {
              'top-border-color': 'var(--colors-error-4)',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'var(--colors-error-4)',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'var(--colors-error-4)',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'var(--colors-error-4)',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-danger-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '浅色',
        custom: false,
        type: 'light',
        default: {
          label: '默认常规',
          token: '--button-light-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-10)',
            'border': {
              'top-border-color': 'var(--colors-brand-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-light-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-9)',
            'border': {
              'top-border-color': 'var(--colors-brand-9)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-9)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-9)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-9)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-light-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-7)',
            'border': {
              'top-border-color': 'var(--colors-brand-7)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-7)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-7)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-7)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-light-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '深色',
        custom: false,
        type: 'dark',
        default: {
          label: '默认常规',
          token: '--button-dark-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-3)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-3)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-3)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-3)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-3)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-dark-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-4)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-dark-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-11)',
            'bg-color': 'var(--colors-neutral-fill-5)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-dark-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-10)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-10)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-10)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-10)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      },
      {
        label: '链接',
        custom: false,
        type: 'link',
        default: {
          label: '默认常规',
          token: '--button-link-default-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-link-5)',
            'bg-color': 'transparent',
            'border': {
              'top-border-color': 'transparent',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'transparent',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'transparent',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'transparent',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        hover: {
          label: '默认悬浮',
          token: '--button-link-hover-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-link-6)',
            'bg-color': 'transparent',
            'border': {
              'top-border-color': 'transparent',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'transparent',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'transparent',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'transparent',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        active: {
          label: '默认点击',
          token: '--button-link-active-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-link-4)',
            'bg-color': 'transparent',
            'border': {
              'top-border-color': 'transparent',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'transparent',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'transparent',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'transparent',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        },
        disabled: {
          label: '默认禁用',
          token: '--button-link-disabled-',
          body: {
            'shadow': 'var(--shadows-shadow-none)',
            'font-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'transparent',
            'border': {
              'top-border-color': 'transparent',
              'top-border-width': 'var(--borders-width-1)',
              'top-border-style': 'var(--borders-style-1)',
              'right-border-color': 'transparent',
              'right-border-width': 'var(--borders-width-1)',
              'right-border-style': 'var(--borders-style-1)',
              'bottom-border-color': 'transparent',
              'bottom-border-width': 'var(--borders-width-1)',
              'bottom-border-style': 'var(--borders-style-1)',
              'left-border-color': 'transparent',
              'left-border-width': 'var(--borders-width-1)',
              'left-border-style': 'var(--borders-style-1)'
            }
          }
        }
      }
    ],
    size: [
      {
        label: '默认',
        type: 'default',
        custom: false,
        token: '--button-size-default-',
        body: {
          'size': {
            height: 'var(--sizes-base-16)',
            minWidth: 'var(--sizes-size-1)'
          },
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-0)'
          },
          'icon-size': 'var(--sizes-size-8)',
          'icon-margin': 'var(--sizes-size-3)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          }
        }
      },
      {
        label: '极小',
        type: 'xs',
        custom: false,
        token: '--button-size-xs-',
        body: {
          'size': {
            height: 'var(--sizes-base-11)',
            minWidth: 'var(--sizes-size-1)'
          },
          'font': {
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-2)',
            paddingBottom: 'var(--sizes-size-2)',
            paddingLeft: 'var(--sizes-size-3)',
            paddingRight: 'var(--sizes-size-3)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-0)'
          },
          'icon-size': 'var(--sizes-size-8)',
          'icon-margin': 'var(--sizes-size-3)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          }
        }
      },
      {
        label: '小',
        type: 'sm',
        custom: false,
        token: '--button-size-sm-',
        body: {
          'size': {
            height: 'var(--sizes-base-15)',
            minWidth: 'var(--sizes-size-1)'
          },
          'font': {
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-0)'
          },
          'icon-size': 'var(--sizes-size-8)',
          'icon-margin': 'var(--sizes-size-3)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          }
        }
      },
      {
        label: '中等',
        type: 'md',
        custom: false,
        token: '--button-size-md-',
        body: {
          'size': {
            height: 'var(--sizes-base-16)',
            minWidth: 'var(--sizes-size-1)'
          },
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-0)'
          },
          'icon-size': 'var(--sizes-size-8)',
          'icon-margin': 'var(--sizes-size-3)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          }
        }
      },
      {
        label: '大',
        type: 'lg',
        custom: false,
        token: '--button-size-lg-',
        body: {
          'size': {
            height: 'var(--sizes-base-19)',
            minWidth: 'var(--sizes-size-1)'
          },
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-6)',
            paddingBottom: 'var(--sizes-size-6)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-0)'
          },
          'icon-size': 'var(--sizes-size-8)',
          'icon-margin': 'var(--sizes-size-3)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          }
        }
      }
    ]
  },
  transfer1: {
    base: {
      label: '基础配置',
      token: '--transfer-base-',
      body: {
        'title-bg': 'var(--colors-neutral-fill-10)',
        'title-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'content-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-2)',
          'bottom-left-border-radius': 'var(--borders-radius-2)'
        },
        'header-padding-and-margin': {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-8)',
          paddingRight: 'var(--sizes-size-8)'
        },
        'body-padding-and-margin': {
          paddingTop: 'var(--sizes-size-0)',
          paddingBottom: 'var(--sizes-size-0)',
          paddingLeft: 'var(--sizes-size-0)',
          paddingRight: 'var(--sizes-size-0)'
        },
        'option-padding-and-margin': {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-8)',
          paddingRight: 'var(--sizes-size-8)',
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-0)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        },
        'shadow': 'var(--shadows-shadow-none)'
      }
    },
    search: {
      label: '搜索框',
      token: '--transfer-search-',
      body: {
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'placeholder-font-color': 'var(--colors-neutral-text-6)',
        'border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'border-hover-color': 'var(--colors-brand-4)',
        'border-active-color': 'var(--colors-brand-4)',
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-6)',
          paddingBottom: 'var(--sizes-size-6)',
          paddingLeft: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)'
        },
        'input-padding-and-margin': {
          paddingTop: 'var(--sizes-size-4)',
          paddingBottom: 'var(--sizes-size-4)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        },
        'shadow': 'var(--shadows-shadow-none)'
      }
    },
    group: {
      label: '分组',
      token: '--transfer-group-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        }
      }
    },
    table: {
      label: '表格形式',
      token: '--transfer-table-',
      body: {
        'header-padding-and-margin': {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        },
        'option-padding-and-margin': {
          paddingTop: 'var(--sizes-size-4)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        },
        'last-paddingRight': 'var(--sizes-base-9)'
      }
    },
    tree: {
      label: '树形式',
      token: '--transfer-tree-',
      body: {
        'bg-hover-color': 'var(--colors-neutral-fill-10)',
        'bg-active-color': 'var(--colors-brand-10)',
        'border': {
          'top-right-border-radius': 'var(--borders-radius-2)',
          'top-left-border-radius': 'var(--borders-radius-2)',
          'bottom-right-border-radius': 'var(--borders-radius-2)',
          'bottom-left-border-radius': 'var(--borders-radius-2)'
        },
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-3)',
          paddingBottom: 'var(--sizes-size-3)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)',
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-2)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        },
        'option-padding-and-margin': {
          paddingTop: 'var(--sizes-size-0)',
          paddingBottom: 'var(--sizes-size-0)',
          paddingLeft: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-0)',
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-4)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        }
      }
    },
    chained: {
      label: '级联选择',
      token: '--transfer-chained-',
      body: {
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)',
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-0)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        }
      }
    }
  },
  input: {
    base: {
      default: {
        label: '默认',
        type: 'default',
        default: {
          label: '常规',
          token: '--input-default-default-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'font': {
              color: 'var(--colors-neutral-fill-2)',
              fontSize: 'var(--fonts-size-7)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        hover: {
          label: '悬浮',
          token: '--input-default-hover-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        active: {
          label: '点击',
          token: '--input-default-active-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'shadow': 'var(--shadows-shadow-none)',
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        disabled: {
          label: '禁用',
          token: '--input-default-disabled-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-10)'
          }
        }
      },
      clearable: {
        label: '可清除',
        token: '--input-clearable-',
        body: {
          'icon': '',
          'icon-size': 'var(--sizes-size-8)',
          'default-color': 'var(--colors-brand-5)',
          'hover-color': 'var(--colors-neutral-text-4)',
          'active-color': 'var(--colors-neutral-text-4)'
        }
      },
      count: {
        label: '字数统计',
        single: {
          label: '单行输入框',
          token: '--input-count-single-',
          body: {
            font: {
              fontSize: 'var(--fonts-size-7)',
              color: 'var(--colors-neutral-text-6)'
            }
          }
        },
        multi: {
          label: '多行输入框',
          token: '--input-count-multi-',
          body: {
            font: {
              fontSize: 'var(--fonts-size-7)',
              color: 'var(--colors-neutral-text-5)'
            }
          }
        }
      },
      prefix: {
        label: '前缀/后缀',
        token: '--input-prefix-',
        body: {
          font: {
            fontSize: 'var(--fonts-size-7)',
            color: 'var(--colors-neutral-text-1)'
          }
        }
      },
      password: {
        label: '密码输入框',
        token: '--input-password-',
        body: {
          'invisible-icon': '',
          'invisible-icon-size': 'var(--sizes-size-8)',
          'invisible-icon-color': 'var(--colors-neutral-text-5)',
          'view-icon': '',
          'view-icon-size': 'var(--sizes-size-8)',
          'view-icon-color': 'var(--colors-neutral-text-5)'
        }
      },
      textarea: {
        label: '多行输入框',
        token: '--input-textarea-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-base-11)'
          }
        }
      },
      addon: {
        label: '附加组件',
        text: {
          label: '文本',
          token: '--input-addon-text-',
          body: {
            'bg-color-default': 'var(--colors-neutral-fill-11)',
            'bg-color-hover': 'var(--colors-neutral-fill-11)',
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)'
            }
          }
        }
      }
    }
  },
  link: {
    base: {
      default: {
        token: '--link-',
        body: {
          'font': {
            'fontSize': 'var(--fonts-size-7)',
            'color': 'var(--colors-link-5)',
            'fontWeight': 'var(--fonts-weight-6)',
            'text-decoration': 'none',
            'font-style': 'none'
          },
          'bg-color': 'transparent'
        }
      },
      hover: {
        token: '--link-onHover-',
        body: {
          'font': {
            'fontSize': 'var(--fonts-size-7)',
            'color': 'var(--colors-link-6)',
            'fontWeight': 'var(--fonts-weight-6)',
            'text-decoration': 'none',
            'font-style': 'none'
          },
          'bg-color': 'transparent'
        }
      },
      click: {
        token: '--link-onClick-',
        body: {
          'font': {
            'fontSize': 'var(--fonts-size-7)',
            'color': 'var(--colors-link-4)',
            'fontWeight': 'var(--fonts-weight-6)',
            'text-decoration': 'none',
            'font-style': 'none'
          },
          'bg-color': 'transparent'
        }
      },
      disabled: {
        token: '--link-disabled-',
        body: {
          'font': {
            'fontSize': 'var(--fonts-size-7)',
            'color': 'var(--colors-neutral-text-6)',
            'fontWeight': 'var(--fonts-weight-6)',
            'text-decoration': 'none',
            'font-style': 'none'
          },
          'bg-color': 'transparent'
        }
      }
    },
    icon: {
      token: '--link-icon-',
      body: {
        size: 'var(--sizes-size-8)',
        margin: 'var(--sizes-size-3)'
      }
    }
  },
  form: {
    item: {
      default: {
        item: {
          token: '--Form-item-',
          body: {
            gap: 'var(--sizes-base-12)'
          }
        },
        label: {
          token: '--Form-item-',
          body: {
            font: {
              color: 'var(--colors-neutral-text-4)',
              fontSize: 'var(--fonts-size-7)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            }
          }
        },
        star: {
          token: '--Form-item-star-',
          body: {
            color: 'var(--colors-error-5)',
            size: 'var(--sizes-size-7)'
          }
        },
        description: {
          token: '--Form-description-',
          body: {
            font: {
              color: 'var(--colors-neutral-text-5)',
              fontSize: 'var(--fonts-size-8)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            },
            gap: 'var(--sizes-size-3)'
          }
        }
      },
      error: {
        item: {
          token: '--Form-item-onError-',
          body: {
            color: 'var(--colors-error-5)',
            borderColor: 'var(--colors-error-5)',
            bg: 'var(--colors-neutral-fill-11)'
          }
        },
        feedBack: {
          token: '--Form-feedBack-',
          body: {
            font: {
              color: 'var(--colors-error-5)',
              fontSize: 'var(--fonts-size-8)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            },
            gap: 'var(--sizes-size-3)'
          }
        }
      }
    },
    mode: {
      default: {
        token: '--Form-mode-default-',
        body: {
          labelGap: 'var(--sizes-size-5)',
          width: '100%'
        }
      },
      horizontal: {
        label: {
          token: '--Form--horizontal-label-',
          body: {
            gap: 'var(--sizes-base-8)',
            widthBase: 'var(--sizes-base-49)',
            widthXs: 'var(--sizes-base-25)',
            widthSm: 'var(--sizes-base-35)',
            widthMd: '8.75rem',
            widthLg: '12.5rem'
          }
        },
        value: {
          token: '--Form--horizontal-value-',
          body: {
            size: {
              maxWidth: '100%',
              minWidth: 'var(--sizes-size-0)'
            }
          }
        }
      },
      inline: {
        item: {
          token: '--Form-mode-inline-item-',
          body: {
            gap: 'var(--sizes-base-8)'
          }
        },
        label: {
          token: '--Form-mode-inline-label-',
          body: {
            gap: 'var(--sizes-base-8)'
          }
        }
      }
    }
  },
  inputNumber: {
    base: {
      base: {
        label: '基础样式',
        type: 'base',
        default: {
          label: '默认',
          token: '--inputNumber-base-default-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)',
            'step-bg': 'var(--colors-neutral-fill-11)',
            'icon-size': 'var(--fonts-size-8)',
            'icon-color': 'var(--colors-neutral-text-2)'
          }
        },
        hover: {
          label: '悬浮',
          token: '--inputNumber-base-hover-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)',
            'step-bg-color': 'var(--colors-neutral-fill-11)',
            'icon-fontSize': 'var(--fonts-size-8)',
            'icon-color': 'var(--colors-brand-5)'
          }
        },
        active: {
          label: '点击',
          token: '--inputNumber-base-active-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'shadow': 'var(--shadows-shadow-none)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'step-bg-color': 'var(--colors-neutral-fill-11)',
            'icon-size': 'var(--fonts-size-8)',
            'icon-color': 'var(--colors-brand-5)'
          }
        },
        disabled: {
          label: '禁用',
          token: '--inputNumber-base-disabled-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'bg-color': 'var(--colors-neutral-fill-10)',
            'step-bg-color': 'var(--colors-neutral-fill-11)',
            'icon-size': 'var(--fonts-size-8)',
            'icon-color': 'var(--colors-brand-5)'
          }
        }
      },
      enhance: {
        label: '加强版',
        type: 'enhance',
        default: {
          label: '默认',
          token: '--inputNumber-enhance-default-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-0)',
              paddingBottom: 'var(--sizes-size-0)',
              paddingLeft: 'var(--sizes-size-0)',
              paddingRight: 'var(--sizes-size-0)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        hover: {
          label: '悬浮',
          token: '--inputNumber-enhance-hover-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-0)',
              paddingBottom: 'var(--sizes-size-0)',
              paddingLeft: 'var(--sizes-size-0)',
              paddingRight: 'var(--sizes-size-0)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        active: {
          label: '点击',
          token: '--inputNumber-enhance-active-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-5)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-5)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-5)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-5)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-0)',
              paddingBottom: 'var(--sizes-size-0)',
              paddingLeft: 'var(--sizes-size-0)',
              paddingRight: 'var(--sizes-size-0)'
            },
            'bg-color': 'var(--colors-neutral-fill-11)',
            'shadow': 'var(--shadows-shadow-none)'
          }
        },
        disabled: {
          label: '禁用',
          token: '--inputNumber-enhance-disabled-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-0)',
              paddingBottom: 'var(--sizes-size-0)',
              paddingLeft: 'var(--sizes-size-0)',
              paddingRight: 'var(--sizes-size-0)'
            },
            'bg-color': 'var(--colors-neutral-fill-10)'
          }
        },
        leftIcon: {
          default: {
            label: '默认',
            token: '--inputNumber-enhance-leftIcon-default-',
            body: {
              'icon': '',
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-neutral-text-2)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          hover: {
            label: '默认',
            token: '--inputNumber-enhance-leftIcon-hover-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-brand-5)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          active: {
            label: '默认',
            token: '--inputNumber-enhance-leftIcon-active-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-brand-5)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          disabled: {
            label: '默认',
            token: '--inputNumber-enhance-leftIcon-disabled-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-neutral-text-2)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          }
        },
        rightIcon: {
          default: {
            label: '默认',
            token: '--inputNumber-enhance-rightIcon-default-',
            body: {
              'icon': '',
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-neutral-text-2)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          hover: {
            label: '默认',
            token: '--inputNumber-enhance-rightIcon-hover-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-brand-5)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          active: {
            label: '默认',
            token: '--inputNumber-enhance-rightIcon-active-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-brand-5)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          },
          disabled: {
            label: '默认',
            token: '--inputNumber-enhance-rightIcon-disabled-',
            body: {
              'size': {
                height: 'var(--sizes-size-7)',
                width: 'var(--sizes-size-7)'
              },
              'color': 'var(--colors-neutral-text-2)',
              'bg-color': 'var(--colors-neutral-fill-11)'
            }
          }
        }
      },
      unit: {
        label: '带单位选择',
        width: {
          label: '单位选择器',
          token: '--inputNumber-base-default-unit-',
          body: {
            width: 'var(--sizes-base-28)'
          }
        }
      }
    }
  },
  inputRange: {
    base: {
      track: {
        token: '--InputRange-track-',
        body: {
          'bg': 'var(--colors-neutral-fill-8)',
          'height': 'var(--sizes-size-4)',
          'border-radius': 'var(--sizes-size-3)'
        }
      },
      trackActive: {
        token: '--InputRange-track-onActive-',
        body: {
          bg: 'var(--colors-brand-5)'
        }
      },
      handle: {
        token: '--InputRange-handle-',
        body: {
          size: {
            height: 'var(--sizes-size-9)',
            width: 'var(--sizes-size-9)'
          },
          bg: 'var(--colors-neutral-fill-11)',
          border: {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-7)',
            'top-left-border-radius': 'var(--borders-radius-7)',
            'bottom-right-border-radius': 'var(--borders-radius-7)',
            'bottom-left-border-radius': 'var(--borders-radius-7)'
          }
        }
      },
      handleIcon: {
        token: '--InputRange-handle-icon-',
        body: {
          size: {
            height: 'var(--sizes-size-5)',
            width: 'var(--sizes-size-5)'
          },
          color: 'var(--colors-brand-9)'
        }
      }
    },
    disabled: {
      trackActive: {
        token: '--InputRange-track-onActive-onDisabled-',
        body: {
          bg: 'var(--colors-neutral-fill-6)'
        }
      },
      handle: {
        token: '--InputRange-handle-onDisabled-',
        body: {
          'border-color': 'var(--colors-neutral-fill-7)',
          'bg': 'var(--colors-neutral-fill-11)'
        }
      },
      handleIcon: {
        token: '--InputRange-handle-icon-onDisabled-',
        body: {
          color: 'var(--colors-neutral-fill-7)'
        }
      }
    },
    dot: {
      token: '--InputRange-track-dot-',
      body: {
        size: {
          height: 'var(--sizes-size-4)',
          width: 'var(--sizes-size-4)'
        },
        bg: 'var(--colors-neutral-fill-11)'
      }
    },
    marks: {
      token: '--InputRange-marks-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        marginTop: 'var(--sizes-size-0)'
      }
    },
    label: {
      token: '--InputRange-label-',
      body: {
        font: {
          color: 'var(--colors-neutral-fill-11)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        padding: {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-5)',
          paddingRight: 'var(--sizes-size-5)'
        },
        bg: 'var(--colors-neutral-fill-1)',
        border: {
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        }
      }
    },
    input: {
      token: '--InputRange-input-',
      body: {
        width: 'var(--sizes-base-40)',
        margin: {
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-0)',
          marginLeft: 'var(--sizes-size-5)',
          marginRight: 'var(--sizes-size-5)'
        }
      }
    },
    clearIcon: {
      token: '--InputRange-clearIcon-',
      body: {
        size: {
          height: 'var(--sizes-size-7)',
          width: 'var(--sizes-size-7)'
        },
        color: 'var(--colors-neutral-text-4)',
        hoverColor: 'var(--colors-brand-5)'
      }
    }
  },
  progress: {
    base: {
      line: {
        token: '--Progress-line-',
        body: {
          'bg': 'var(--colors-neutral-fill-8)',
          'theme-color': 'var(--colors-brand-5)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-8)'
          }
        }
      },
      circle: {
        token: '--Progress-circle-',
        body: {
          'bg': 'var(--colors-neutral-fill-8)',
          'theme-color': 'var(--colors-brand-5)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-8)'
          }
        }
      }
    }
  },
  radio: {
    base: {
      default: {
        label: '默认',
        type: 'default',
        default: {
          label: '常规',
          token: '--radio-default-default-',
          body: {
            'color': 'var(--colors-neutral-text-8)',
            'text-color': 'var(--colors-neutral-text-1)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'font': {
              fontSize: 'var(--fonts-size-7)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            },
            'point-size': 'var(--sizes-size-9)',
            'point-inner-size': 'var(--sizes-size-5)',
            'padding-and-margin': {
              marginTop: 'var(--sizes-size-0)',
              marginBottom: 'var(--sizes-size-4)',
              marginLeft: 'var(--sizes-size-0)',
              marginRight: 'var(--sizes-size-9)'
            },
            'distance': 'var(--sizes-size-5)'
          }
        },
        hover: {
          label: '悬浮',
          token: '--radio-default-hover-',
          body: {
            'color': 'var(--colors-brand-5)',
            'text-color': 'var(--colors-neutral-text-1)',
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        active: {
          label: '点击',
          token: '--radio-default-active-',
          body: {
            'color': 'var(--colors-brand-5)',
            'text-color': 'var(--colors-neutral-text-1)',
            'bg-color': 'var(--colors-neutral-fill-11)'
          }
        },
        disabled: {
          label: '禁用',
          token: '--radio-default-disabled-',
          body: {
            'color': 'var(--colors-neutral-text-6)',
            'text-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-8)'
          }
        }
      },
      vertical: {
        label: '列显示',
        token: '--radio-default-vertical-',
        body: {
          'padding-and-margin': {
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-4)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-5)'
          }
        }
      }
    }
  },
  switch: {
    base: {
      default: {
        label: '默认',
        type: 'default',
        off: {
          label: '关',
          token: '--switch-default-off-',
          body: {
            'bg-color': 'var(--colors-neutral-fill-7)',
            'hover-bg-color': 'var(--colors-neutral-fill-6)',
            'slider-color': 'var(--colors-neutral-fill-11)'
          }
        },
        on: {
          label: '开',
          token: '--switch-default-on-',
          body: {
            'bg-color': 'var(--colors-brand-5)',
            'hover-bg-color': 'var(--colors-brand-4)',
            'slider-color': 'var(--colors-neutral-fill-11)'
          }
        }
      },
      option: {
        label: '开关说明',
        token: '--switch-option-',
        body: {
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)',
            color: 'var(--colors-neutral-text-1)'
          },
          'padding-and-margin': {
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-5)',
            marginRight: 'var(--sizes-size-0)'
          }
        }
      },
      text: {
        label: '开关状态文本',
        off: {
          label: '关',
          token: '--switch-text-off-',
          body: {
            'font': {
              fontSize: 'var(--fonts-size-8)',
              fontWeight: 'var(--fonts-weight-3)',
              color: 'var(--colors-neutral-text-11)'
            },
            'padding-and-margin': {
              marginTop: 'var(--sizes-size-0)',
              marginBottom: 'var(--sizes-size-0)',
              marginLeft: 'var(--sizes-base-12)',
              marginRight: 'var(--sizes-size-5)'
            }
          }
        },
        on: {
          label: '开',
          token: '--switch-text-on-',
          body: {
            'font': {
              fontSize: 'var(--fonts-size-8)',
              fontWeight: 'var(--fonts-weight-3)',
              color: 'var(--colors-neutral-text-11)'
            },
            'padding-and-margin': {
              marginTop: 'var(--sizes-size-0)',
              marginBottom: 'var(--sizes-size-0)',
              marginLeft: 'var(--sizes-base-4)',
              marginRight: 'var(--sizes-base-12)'
            }
          }
        }
      }
    },
    size: {
      default: {
        label: '常规',
        token: '--switch-size-default-',
        body: {
          'size': {
            height: 'var(--sizes-base-10)',
            minWidth: 'var(--sizes-base-22)'
          },
          'slider-size': {
            width: 'var(--sizes-size-9)'
          },
          'slider-margin': 'var(--sizes-size-2)',
          'border': {
            'top-right-border-radius': 'var(--sizes-base-15)',
            'top-left-border-radius': 'var(--sizes-base-15)',
            'bottom-right-border-radius': 'var(--sizes-base-15)',
            'bottom-left-border-radius': 'var(--sizes-base-15)'
          }
        }
      },
      sm: {
        label: '小',
        token: '--switch-size-sm-',
        body: {
          'size': {
            height: 'var(--sizes-size-9)',
            minWidth: 'var(--sizes-base-14)'
          },
          'slider-size': {
            width: 'var(--sizes-size-7)'
          },
          'slider-margin': 'var(--sizes-size-2)',
          'border': {
            'top-right-border-radius': 'var(--sizes-base-15)',
            'top-left-border-radius': 'var(--sizes-base-15)',
            'bottom-right-border-radius': 'var(--sizes-base-15)',
            'bottom-left-border-radius': 'var(--sizes-base-15)'
          }
        }
      }
    }
  },
  checkbox: {
    checkbox: {
      normal: {
        default: {
          label: '常规',
          token: '--checkbox-checkbox-default-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'size': {
              height: 'var(--sizes-base-8)'
            },
            'font': {
              fontSize: 'var(--fonts-size-7)',
              fontWeight: 'var(--fonts-weight-6)',
              lineHeight: 'var(--fonts-lineHeight-2)'
            }
          }
        },
        hover: {
          label: '悬浮',
          token: '--checkbox-checkbox-hover-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        },
        active: {
          label: '点击',
          token: '--checkbox-checkbox-active-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'shadow': 'var(--shadows-shadow-none)',
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-neutral-fill-11)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        },
        disabled: {
          label: '禁用',
          token: '--checkbox-checkbox-disabled-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        }
      },
      checked: {
        default: {
          label: '常规',
          token: '--checkbox-checked-default-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-5)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        },
        hover: {
          label: '悬浮',
          token: '--checkbox-checked-hover-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-6)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-6)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-6)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-6)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-6)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        },
        active: {
          label: '点击',
          token: '--checkbox-checked-active-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-brand-4)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-brand-4)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-brand-4)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-brand-4)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'shadow': 'var(--shadows-shadow-none)',
            'text-color': 'var(--colors-neutral-text-2)',
            'bg-color': 'var(--colors-brand-4)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        },
        disabled: {
          label: '禁用',
          token: '--checkbox-checked-disabled-',
          body: {
            'border': {
              'top-border-color': 'var(--colors-neutral-line-8)',
              'top-border-width': 'var(--borders-width-2)',
              'top-border-style': 'var(--borders-style-2)',
              'right-border-color': 'var(--colors-neutral-line-8)',
              'right-border-width': 'var(--borders-width-2)',
              'right-border-style': 'var(--borders-style-2)',
              'bottom-border-color': 'var(--colors-neutral-line-8)',
              'bottom-border-width': 'var(--borders-width-2)',
              'bottom-border-style': 'var(--borders-style-2)',
              'left-border-color': 'var(--colors-neutral-line-8)',
              'left-border-width': 'var(--borders-width-2)',
              'left-border-style': 'var(--borders-style-2)',
              'top-right-border-radius': 'var(--borders-radius-3)',
              'top-left-border-radius': 'var(--borders-radius-3)',
              'bottom-right-border-radius': 'var(--borders-radius-3)',
              'bottom-left-border-radius': 'var(--borders-radius-3)'
            },
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-6)',
              paddingRight: 'var(--sizes-size-6)'
            },
            'text-color': 'var(--colors-neutral-text-6)',
            'bg-color': 'var(--colors-neutral-fill-10)',
            'size': {
              height: 'var(--sizes-base-8)'
            }
          }
        }
      }
    },
    checkboxes: {
      label: '常规',
      token: '--checkbox-checkboxes-',
      body: {
        marginRight: 'var(--sizes-base-8)'
      }
    }
  },
  inputTree: {
    base: {
      base: {
        label: '默认态',
        type: 'base',
        default: {
          label: '默认',
          token: '--inputTree-base-default-',
          body: {
            color: 'var(--colors-neutral-text-2)',
            expandColor: 'var(--colors-neutral-text-5)'
          }
        },
        hover: {
          label: '悬浮',
          token: '--inputTree-base-hover-',
          body: {
            color: 'var(--colors-neutral-text-2)',
            expandColor: 'var(--colors-neutral-text-5)'
          }
        },
        active: {
          label: '点击',
          token: '--inputTree-base-active-',
          body: {
            color: 'var(--colors-neutral-text-2)',
            expandColor: 'var(--colors-neutral-text-5)'
          }
        },
        disabled: {
          label: '禁用',
          token: '--inputTree-base-disabled-',
          body: {
            color: 'var(--colors-neutral-text-6)',
            expandColor: 'var(--colors-neutral-text-5)'
          }
        },
        size: {
          label: '尺寸',
          token: '--inputTree-base-size-',
          body: {
            expandMarginRight: 'var(--sizes-size-5)',
            nodeMarginRight: 'var(--sizes-size-5)'
          }
        }
      },
      checkboxes: {
        label: '复选框',
        type: 'checkboxes',
        size: {
          label: '默认',
          token: '--inputTree-checkboxes-size-',
          body: {
            marginRight: 'var(--sizes-size-5)'
          }
        }
      }
    }
  },
  listSelect: {
    base: {
      default: {
        label: '常规',
        token: '--listSelect-base-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'size': {
            height: 'var(--sizes-base-8)'
          }
        }
      },
      hover: {
        label: '悬浮',
        token: '--listSelect-base-hover-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-4)',
            paddingBottom: 'var(--sizes-size-4)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'color': 'var(--colors-brand-5)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'size': {
            height: 'var(--sizes-base-8)'
          }
        }
      },
      active: {
        label: '点击',
        token: '--listSelect-base-active-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-4)',
            paddingBottom: 'var(--sizes-size-4)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'shadow': 'var(--shadows-shadow-none)',
          'color': 'var(--colors-brand-5)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'size': {
            height: 'var(--sizes-base-8)'
          }
        }
      },
      disabled: {
        label: '禁用',
        token: '--listSelect-base-disabled-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-4)',
            paddingBottom: 'var(--sizes-size-4)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'color': 'var(--colors-neutral-text-6)',
          'bg-color': 'var(--colors-neutral-fill-10)',
          'size': {
            height: 'var(--sizes-base-8)'
          }
        }
      },
      size: {
        label: '常规',
        token: '--listSelect-base-image-',
        body: {
          size: {
            width: 'var(--sizes-size-1)'
          }
        }
      }
    }
  },
  inputRating: {
    icon: {
      token: '--Rating-star-',
      body: {
        margin: 'var(--sizes-size-5)',
        size: 'var(--sizes-base-13)',
        icon: ''
      }
    },
    inactiveColors: {
      token: '--Rating-inactive-',
      body: {
        color: 'var(--colors-neutral-text-9)'
      }
    },
    activeColors: [
      {value: '#abadb1', id: 2},
      {value: '#787b81', id: 3},
      {value: '#ffa900', id: 5}
    ],
    text: {
      token: '--Rating-text-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        }
      }
    }
  },
  collapse: {
    base: {
      default: {
        label: '默认',
        token: '--collapse-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'header-padding-and-margin': {
            paddingTop: 'var(--sizes-size-9)',
            paddingBottom: 'var(--sizes-size-9)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)'
          },
          'header-font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'header-bg-color': 'var(--colors-neutral-fill-10)',
          'header-hover-bg-color': 'var(--colors-neutral-fill-9)',
          'header-hover-color': 'var(--colors-neutral-text-2)',
          'disabled-header-bg-color': 'var(--colors-neutral-fill-10)',
          'disabled-color': 'var(--colors-neutral-text-6)',
          'content-padding-and-margin': {
            paddingTop: 'var(--sizes-size-9)',
            paddingBottom: 'var(--sizes-size-9)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)'
          },
          'content-font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      icon: {
        label: '图标',
        token: '--collapse-icon-',
        body: {
          icon: '',
          size: 'var(--sizes-size-6)',
          color: 'var(--colors-neutral-text-5)',
          margin: 'var(--sizes-size-5)',
          rotate: '90deg'
        }
      }
    }
  },
  tabs: {
    simple: {
      default: {
        token: '--Tabs--simple-',
        body: {
          'padding': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)'
          },
          'split-width': 'var(--borders-width-2)',
          'split-style': 'var(--borders-style-2)',
          'split-color': 'var(--colors-neutral-line-8)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      active: {
        token: '--Tabs--simple-active-',
        body: {
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      hover: {
        token: '--Tabs--simple-hover-',
        body: {
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--simple-disabled-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    },
    strong: {
      default: {
        token: '--Tabs--strong-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-5)',
            paddingBottom: 'var(--sizes-size-5)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)',
            marginTop: 'var(--sizes-size-0)',
            marginBottom: 'var(--sizes-size-0)',
            marginLeft: 'var(--sizes-size-0)',
            marginRight: 'var(--sizes-size-5)'
          },
          'bg': 'var(--colors-neutral-fill-11)',
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          },
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      active: {
        token: '--Tabs--strong-active-',
        body: {
          bg: 'var(--colors-neutral-fill-11)',
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'transparent',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      hover: {
        token: '--Tabs--strong-hover-',
        body: {
          bg: 'var(--colors-neutral-fill-11)',
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--strong-disabled-',
        body: {
          bg: 'var(--colors-neutral-fill-11)',
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    },
    line: {
      default: {
        token: '--Tabs--line-',
        body: {
          'padding': 'var(--sizes-base-16)',
          'border-color': 'var(--colors-neutral-line-8)',
          'border-width': 'var(--borders-width-2)',
          'border-style': 'var(--borders-style-2)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      active: {
        token: '--Tabs--line-active-',
        body: {
          'font': {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'border-color': 'var(--colors-brand-5)',
          'border-width': 'var(--borders-width-3)',
          'border-style': 'var(--borders-style-2)'
        }
      },
      hover: {
        token: '--Tabs--line-hover-',
        body: {
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--line-disabled-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    },
    card: {
      default: {
        token: '--Tabs--card-',
        body: {
          'padding': {
            paddingTop: 'var(--sizes-size-4)',
            paddingBottom: 'var(--sizes-size-0)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'border-color': 'var(--colors-neutral-line-8)',
          'border-width': 'var(--borders-width-2)',
          'border-style': 'var(--borders-style-2)',
          'bg': 'var(--colors-neutral-fill-10)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'linkMargin': 'var(--sizes-size-6)',
          'linkPadding': 'var(--sizes-size-6)',
          'borderRadius': 'var(--borders-radius-3)',
          'linkBg': 'transparent'
        }
      },
      active: {
        token: '--Tabs--card-active-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          linkBg: 'transparent'
        }
      },
      hover: {
        token: '--Tabs--card-hover-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          linkBg: 'transparent'
        }
      },
      disabled: {
        token: '--Tabs--card-disabled-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          linkBg: 'transparent'
        }
      }
    },
    tiled: {
      default: {
        token: '--Tabs--tiled-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          padding: {
            paddingTop: 'var(--sizes-size-5)',
            paddingBottom: 'var(--sizes-size-5)',
            paddingLeft: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)'
          }
        }
      },
      active: {
        token: '--Tabs--tiled-active-',
        body: {
          border: {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'transparent',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      hover: {
        token: '--Tabs--tiled-hover-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--tiled-disabled-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    },
    radio: {
      default: {
        token: '--Tabs--radio-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          padding: {
            paddingTop: 'var(--sizes-size-5)',
            paddingBottom: 'var(--sizes-size-5)',
            paddingLeft: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)'
          },
          bg: 'var(--colors-neutral-fill-11)',
          height: 'var(--sizes-base-15)'
        }
      },
      active: {
        token: '--Tabs--radio-active-',
        body: {
          border: {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-11)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          bg: 'var(--colors-brand-5)'
        }
      },
      hover: {
        token: '--Tabs--radio-hover-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          bg: 'var(--colors-neutral-fill-11)'
        }
      },
      disabled: {
        token: '--Tabs--radio-disabled-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          bg: 'var(--colors-neutral-fill-11)'
        }
      }
    },
    vertical: {
      default: {
        token: '--Tabs--vertical-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          padding: {
            paddingTop: 'var(--sizes-size-5)',
            paddingBottom: 'var(--sizes-size-5)',
            paddingLeft: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)'
          },
          bg: 'var(--colors-neutral-fill-10)',
          width: '8.75rem'
        }
      },
      active: {
        token: '--Tabs--vertical-active-',
        body: {
          'font': {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          'border-color': 'var(--colors-brand-5)',
          'border-width': 'var(--borders-width-4)',
          'border-style': 'var(--borders-style-2)'
        }
      },
      hover: {
        token: '--Tabs--vertical-hover-',
        body: {
          font: {
            color: 'var(--colors-brand-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--vertical-disabled-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    },
    sidebar: {
      default: {
        token: '--Tabs--sidebar-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          },
          sideWidth: 'var(--sizes-base-31)',
          sideMargin: 'var(--sizes-base-11)'
        }
      },
      active: {
        token: '--Tabs--sidebar-active-',
        body: {
          font: {
            color: 'var(--colors-brand-5)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      hover: {
        token: '--Tabs--sidebar-hover-',
        body: {
          font: {
            color: 'var(--colors-brand-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      },
      disabled: {
        token: '--Tabs--sidebar-disabled-',
        body: {
          font: {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)',
            lineHeight: 'var(--fonts-lineHeight-2)'
          }
        }
      }
    }
  },
  panel: {
    panel: {
      token: '--Panel-',
      body: {
        bg: 'var(--colors-neutral-fill-11)',
        boxShadow: 'var(--shadows-shadow-sm)',
        margin: {
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-base-10)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        },
        border: {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        }
      }
    },
    heading: {
      token: '--Panel-heading-',
      body: {
        padding: {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        },
        bg: 'var(--colors-neutral-fill-10)',
        font: {
          color: 'var(--colors-neutral-text-3)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        border: {
          'top-border-color': 'transparent',
          'top-border-width': 'var(--borders-width-1)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'transparent',
          'right-border-width': 'var(--borders-width-1)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'transparent',
          'left-border-width': 'var(--borders-width-1)',
          'left-border-style': 'var(--borders-style-2)'
        }
      }
    },
    body: {
      token: '--Panel-body-',
      body: {
        padding: {
          paddingTop: 'var(--sizes-size-7)',
          paddingBottom: 'var(--sizes-size-7)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        }
      }
    },
    footer: {
      token: '--Panel-footer-',
      body: {
        padding: {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        },
        bg: 'var(--colors-neutral-fill-none)',
        border: {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'transparent',
          'right-border-width': 'var(--borders-width-1)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'transparent',
          'bottom-border-width': 'var(--borders-width-1)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'transparent',
          'left-border-width': 'var(--borders-width-1)',
          'left-border-style': 'var(--borders-style-2)'
        },
        buttonSpace: 'var(--sizes-size-5)'
      }
    }
  },
  divider: {
    token: '--Divider-',
    body: {
      style: 'var(--borders-style-2)',
      color: 'var(--colors-neutral-line-8)',
      width: 'var(--borders-width-2)',
      margin: {
        marginTop: 'var(--sizes-size-7)',
        marginBottom: 'var(--sizes-size-7)',
        marginLeft: 'var(--sizes-size-0)',
        marginRight: 'var(--sizes-size-0)'
      }
    }
  },
  dialog: {
    base: {
      default: {
        token: '--dialog-default-',
        body: {
          'border-width': 'var(--sizes-size-0)',
          'border-radius': 'var(--sizes-size-4)',
          'padding-y': 'var(--sizes-base-12)'
        }
      },
      icon: {
        token: '--dialog-icon-',
        body: {
          icon: '',
          size: 'var(--sizes-size-9)',
          color: 'var(--colors-neutral-text-6)'
        }
      },
      header: {
        token: '--dialog-header-',
        body: {
          height: 'var(--sizes-size-1)',
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-5)'
          }
        }
      },
      content: {
        token: '--dialog-content-',
        body: {
          'height': 'var(--sizes-size-1)',
          'margin-left': 'var(--sizes-size-5)',
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)'
          }
        }
      },
      footer: {
        token: '--dialog-footer-',
        body: {
          'height': 'var(--sizes-size-1)',
          'margin-left': 'var(--sizes-size-5)'
        }
      }
    },
    size: {
      sm: {
        token: '--dialog-size-sm-',
        body: {
          width: '21.875rem'
        }
      },
      normal: {
        token: '--dialog-size-normal-',
        body: {
          width: '31.25rem'
        }
      },
      lg: {
        token: '--dialog-size-lg-',
        body: {
          width: '68.75rem'
        }
      },
      xl: {
        token: '--dialog-size-xl-',
        body: {
          width: '90%'
        }
      }
    }
  },
  drawer: {
    base: {
      header: {
        token: '--drawer-header-',
        body: {
          height: 'var(--sizes-size-1)',
          font: {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-5)'
          }
        }
      },
      icon: {
        token: '--drawer-header-icon-',
        body: {
          icon: '',
          size: 'var(--sizes-size-7)',
          color: 'var(--colors-neutral-text-2)'
        }
      },
      content: {
        token: '--drawer-content-',
        body: {
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-5)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-12)',
            paddingBottom: 'var(--sizes-base-12)',
            paddingLeft: 'var(--sizes-base-12)',
            paddingRight: 'var(--sizes-base-12)'
          }
        }
      },
      footer: {
        token: '--drawer-footer-',
        body: {
          'height': 'var(--sizes-size-1)',
          'margin-left': 'var(--sizes-size-9)'
        }
      }
    },
    size: {
      xs: {
        token: '--drawer-size-xs-',
        body: {
          width: '12.5rem'
        }
      },
      sm: {
        token: '--drawer-size-sm-',
        body: {
          width: '18.75rem'
        }
      },
      md: {
        token: '--drawer-size-md-',
        body: {
          width: '31.25rem'
        }
      },
      lg: {
        token: '--drawer-size-lg-',
        body: {
          width: '50rem'
        }
      },
      xl: {
        token: '--drawer-size-xl-',
        body: {
          width: '90%'
        }
      }
    }
  },
  inputFile: {
    base: {
      token: '--inputFile-base-',
      body: {
        'des-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'des-margin': 'var(--sizes-base-5)'
      }
    },
    list: {
      token: '--inputFile-list-',
      body: {
        'padding-and-margin': {
          marginTop: 'var(--sizes-base-4)',
          marginBottom: 'var(--sizes-base-4)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)',
          paddingTop: 'var(--sizes-size-2)',
          paddingBottom: 'var(--sizes-size-2)',
          paddingLeft: 'var(--sizes-size-3)',
          paddingRight: 'var(--sizes-size-3)'
        },
        'font': {
          color: 'var(--colors-brand-5)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'bg-color': 'var(--colors-neutral-fill-11)',
        'bg-color-hover': 'var(--colors-neutral-fill-9)',
        'icon-size': 'var(--sizes-base-6)',
        'icon-color': 'var(--colors-neutral-text-2)',
        'icon-margin': 'var(--sizes-size-3)',
        'delete-icon-size': 'var(--sizes-base-6)',
        'delete-icon-color': 'var(--colors-neutral-text-5)',
        'delete-icon-color-hover': 'var(--colors-neutral-text-4)'
      }
    },
    drag: {
      token: '--inputFile-drag-',
      body: {
        'border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-3)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-3)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-3)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-3)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'hover-border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-3)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-3)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-3)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-3)'
        },
        'font': {
          color: 'var(--colors-neutral-text-3)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'icon-size': 'var(--sizes-base-24)',
        'icon-color': 'var(--colors-neutral-fill-8)',
        'icon-margin': 'var(--sizes-size-5)',
        'bg-color': 'var(--colors-neutral-fill-11)',
        'bg-color-hover': 'var(--colors-neutral-fill-11)'
      }
    }
  },
  inputImage: {
    base: {
      label: '图片上传',
      default: {
        token: '--inputImage-base-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'color': 'var(--colors-neutral-text-5)',
          'icon-size': 'var(--sizes-base-12)',
          'icon-color': 'var(--colors-neutral-text-5)',
          'icon-margin': 'var(--sizes-size-5)',
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      hover: {
        token: '--inputImage-base-hover-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'color': 'var(--colors-neutral-text-5)',
          'icon-color': 'var(--colors-neutral-text-5)',
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      active: {
        token: '--inputImage-base-active-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'color': 'var(--colors-neutral-text-5)',
          'icon-color': 'var(--colors-neutral-text-5)',
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      disabled: {
        token: '--inputImage-base-disabled-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'color': 'var(--colors-neutral-text-6)',
          'icon-color': 'var(--colors-neutral-text-6)',
          'bg-color': 'var(--colors-neutral-fill-10)'
        }
      }
    }
  },
  select: {
    base: {
      label: '默认',
      default: {
        label: '常规',
        token: '--select-base-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'font': {
            color: 'var(--colors-neutral-text-2)',
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)',
          'option-padding-and-margin': {
            paddingTop: 'var(--sizes-size-0)',
            paddingBottom: 'var(--sizes-size-0)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'option-font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'option-color': 'var(--colors-neutral-text-2)',
          'option-bg-color': 'var(--colors-neutral-fill-11)',
          'option-line-height': 'var(--sizes-base-16)'
        }
      },
      hover: {
        label: '悬浮',
        token: '--select-base-hover-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)',
          'option-color': 'var(--colors-neutral-text-2)',
          'option-bg-color': 'var(--colors-brand-10)'
        }
      },
      active: {
        label: '点击',
        token: '--select-base-active-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'shadow': 'var(--shadows-shadow-none)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'option-color': 'var(--colors-brand-5)',
          'option-bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      disabled: {
        label: '禁用',
        token: '--select-base-disabled-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'bg-color': 'var(--colors-neutral-fill-10)',
          'option-color': 'var(--colors-neutral-text-6)',
          'option-bg-color': 'var(--colors-neutral-fill-11)'
        }
      }
    },
    multiple: {
      label: '多选',
      token: '--select-multiple-',
      body: {
        'border': {
          'top-right-border-radius': 'var(--borders-radius-2)',
          'top-left-border-radius': 'var(--borders-radius-2)',
          'bottom-right-border-radius': 'var(--borders-radius-2)',
          'bottom-left-border-radius': 'var(--borders-radius-2)'
        },
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-0)',
          paddingBottom: 'var(--sizes-size-0)',
          paddingLeft: 'var(--sizes-size-3)',
          paddingRight: 'var(--sizes-size-3)',
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-0)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-3)'
        },
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'bg-color': 'var(--colors-neutral-fill-10)',
        'hover-bg-color': 'var(--colors-brand-10)',
        'icon-color': 'var(--colors-neutral-text-6)',
        'icon-hover-color': 'var(--colors-neutral-text-2)'
      }
    },
    group: {
      label: '分组模式',
      token: '--select-group-',
      body: {
        'font': {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-3)',
          paddingBottom: 'var(--sizes-size-3)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)'
        }
      }
    },
    table: {
      label: '表格模式',
      token: '--select-table-',
      body: {
        'header-padding-and-margin': {
          paddingTop: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-base-9)'
        },
        'option-padding-and-margin': {
          paddingTop: 'var(--sizes-size-4)',
          paddingBottom: 'var(--sizes-size-5)',
          paddingLeft: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-base-9)'
        },
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)'
        }
      }
    },
    tree: {
      label: '树模式',
      token: '--select-tree-',
      body: {
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)'
        },
        'hover-bg-color': 'var(--colors-neutral-fill-10)',
        'active-bg-color': 'var(--colors-brand-10)'
      }
    }
  },
  inputDate: {
    base: {
      label: '默认',
      default: {
        label: '常规',
        token: '--inputDate-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-6)'
          },
          'font': {
            fontSize: 'var(--fonts-size-7)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'size': {
            height: 'var(--sizes-base-16)'
          },
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'icon': '',
          'icon-color': 'var(--colors-brand-5)',
          'icon-size': 'var(--sizes-base-7)',
          'title-color': 'var(--colors-neutral-text-2)',
          'title-arrow-color': 'var(--colors-neutral-text-5)',
          'option-color': 'var(--colors-neutral-text-2)',
          'option-bg-color': 'var(--colors-neutral-fill-11)',
          'option-today-border-color': 'var(--colors-brand-5)',
          'option-border': {
            'top-right-border-radius': 'var(--borders-radius-2)',
            'top-left-border-radius': 'var(--borders-radius-2)',
            'bottom-right-border-radius': 'var(--borders-radius-2)',
            'bottom-left-border-radius': 'var(--borders-radius-2)'
          }
        }
      },
      hover: {
        label: '悬浮',
        token: '--inputDate-hover-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'title-color': 'var(--colors-brand-6)',
          'title-arrow-color': 'var(--colors-neutral-text-2)',
          'option-color': 'var(--colors-neutral-text-2)',
          'option-bg-color': 'var(--colors-neutral-fill-10)'
        }
      },
      active: {
        label: '点击',
        token: '--inputDate-active-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'shadow': 'var(--shadows-shadow-none)',
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'option-color': 'var(--colors-neutral-text-11)',
          'option-bg-color': 'var(--colors-brand-5)'
        }
      },
      disabled: {
        label: '禁用',
        token: '--inputDate-disabled-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)'
          },
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-10)',
          'option-color': 'var(--colors-neutral-text-6)',
          'option-bg-color': 'var(--colors-neutral-fill-11)'
        }
      }
    },
    other: {
      default: {
        label: '常规',
        token: '--inputDate-other-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'border': {
            'top-right-border-radius': 'var(--borders-radius-2)',
            'top-left-border-radius': 'var(--borders-radius-2)',
            'bottom-right-border-radius': 'var(--borders-radius-2)',
            'bottom-left-border-radius': 'var(--borders-radius-2)'
          }
        }
      },
      hover: {
        label: '悬浮',
        token: '--inputDate-other-hover-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-10)'
        }
      },
      active: {
        label: '点击',
        token: '--inputDate-other-active-',
        body: {
          'color': 'var(--colors-neutral-text-11)',
          'bg-color': 'var(--colors-brand-5)'
        }
      },
      disabled: {
        label: '禁用',
        token: '--inputDate-other-disabled-',
        body: {
          'color': 'var(--colors-neutral-text-6)',
          'bg-color': 'var(--colors-neutral-fill-10)'
        }
      }
    },
    range: {
      label: '范围',
      token: '--inputDate-range-',
      body: {
        'line-height': 'var(--borders-width-3)',
        'line-color': 'var(--colors-brand-4)',
        'separator-width': 'var(--sizes-size-5)',
        'separator-margin': 'var(--sizes-size-5)',
        'separator-color': 'var(--colors-neutral-fill-6)',
        'between-color': 'var(--colors-brand-10)'
      }
    }
  },
  inputTime: {
    base: {
      label: '默认',
      default: {
        label: '常规',
        token: '--inputTime-default-',
        body: {
          'font': {
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-text-11)'
        }
      },
      hover: {
        label: '悬浮',
        token: '--inputTime-hover-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-neutral-fill-10)'
        }
      },
      active: {
        label: '点击',
        token: '--inputTime-active-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-brand-10)'
        }
      }
    }
  },
  steps: {
    base: {
      label: '基本',
      token: '--steps-base-',
      body: {
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'subTitle-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'des-font': {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'title-paddingRight': 'var(--sizes-size-5)',
        'subTitle-paddingLeft': 'var(--sizes-size-6)',
        'icon-size': 'var(--sizes-base-15)',
        'icon-paddingRight': 'var(--sizes-size-6)',
        'icon-fontSize': 'var(--fonts-size-6)',
        'line-color': 'var(--colors-neutral-line-8)',
        'line-active-color': 'var(--colors-brand-5)'
      }
    },
    status: {
      label: '状态',
      token: '--steps-status-',
      body: {
        'wait-bg-color': 'var(--colors-neutral-fill-11)',
        'wait-color': 'var(--colors-neutral-text-8)',
        'process-bg-color': 'var(--colors-brand-5)',
        'process-color': 'var(--colors-neutral-text-11)',
        'finish-bg-color': 'var(--colors-brand-5)',
        'finish-color': 'var(--colors-neutral-text-11)',
        'error-bg-color': 'var(--colors-error-5)',
        'error-color': 'var(--colors-neutral-text-11)'
      }
    },
    dot: {
      label: '点状',
      token: '--steps-dot-',
      body: {
        'icon-size': 'var(--sizes-size-5)',
        'wait-bg-color': 'var(--colors-neutral-fill-8)',
        'process-bg-color': 'var(--colors-brand-5)',
        'finish-bg-color': 'var(--colors-neutral-fill-11)',
        'error-bg-color': 'var(--colors-error-5)'
      }
    },
    simple: {
      label: '简单模式',
      token: '--steps-simple-',
      body: {
        'icon': '',
        'icon-size': 'var(--sizes-size-8)'
      }
    }
  },
  userSelect: {
    base: {
      label: '基础',
      type: 'base',
      default: {
        label: '常规',
        token: '--user-select-base-default-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'font': {
            color: 'var(--colors-neutral-fill-2)',
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      hover: {
        label: '悬浮',
        token: '--user-select-base-hover-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'font': {
            color: 'var(--colors-neutral-fill-2)',
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      active: {
        label: '点击',
        token: '--user-select-base-active-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'font': {
            color: 'var(--colors-neutral-fill-2)',
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'shadow': 'var(--shadows-shadow-none)',
          'bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      disabled: {
        label: '禁用',
        token: '--user-select-base-disabled-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': 'var(--borders-radius-3)',
            'top-left-border-radius': 'var(--borders-radius-3)',
            'bottom-right-border-radius': 'var(--borders-radius-3)',
            'bottom-left-border-radius': 'var(--borders-radius-3)'
          },
          'font': {
            color: 'var(--colors-neutral-text-6)',
            fontSize: 'var(--fonts-size-8)',
            fontWeight: 'var(--fonts-weight-6)'
          },
          'bg-color': 'var(--colors-neutral-fill-10)'
        }
      }
    },
    addIcon: {
      label: '添加图标',
      token: '--user-select-add-',
      body: {
        'width': 'var(--sizes-base-15)',
        'bg-color': 'var(--colors-neutral-fill-10)',
        'active-color': 'var(--colors-brand-5)',
        'active-bg-color': 'var(--colors-brand-10)',
        'icon': '',
        'icon-size': 'var(--sizes-size-7)'
      }
    },
    option: {
      label: '选项',
      token: '--user-select-option-',
      body: {
        'height': 'var(--sizes-base-24)',
        'icon-size': 'var(--sizes-base-16)',
        'icon-bg-color': 'var(--colors-brand-6)',
        'icon-color': 'var(--colors-neutral-text-11)',
        'icon-marginRight': 'var(--sizes-size-6)',
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)'
        },
        'des-font': {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-8)'
        },
        'active-color': 'var(--colors-brand-5)'
      }
    },
    dialogOption: {
      label: '弹窗选项',
      token: '--user-select-dialog-option-',
      body: {
        'height': 'var(--sizes-base-30)',
        'bg-color': 'var(--colors-neutral-fill-11)',
        'active-bg-color': 'var(--colors-neutral-fill-10)',
        'icon-size': 'var(--sizes-base-14)',
        'icon-bg-color': 'var(--colors-brand-6)',
        'icon-color': 'var(--colors-neutral-text-11)',
        'icon-marginRight': 'var(--sizes-size-7)',
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)'
        },
        'des-font': {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-8)'
        }
      }
    }
  },
  alert: {
    base: {
      label: '点击',
      token: '--alert-base-',
      body: {
        'padding-and-margin': {
          marginTop: 'var(--sizes-size-0)',
          marginBottom: 'var(--sizes-size-9)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)',
          paddingTop: 'var(--sizes-size-3)',
          paddingBottom: 'var(--sizes-size-3)',
          paddingLeft: 'var(--sizes-size-9)',
          paddingRight: 'var(--sizes-size-9)'
        },
        'border': {
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'font': {
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'shadow': 'var(--shadows-shadow-none)',
        'title-padding-and-margin': {
          paddingTop: 'var(--sizes-size-9)',
          paddingBottom: 'var(--sizes-size-9)',
          paddingLeft: 'var(--sizes-size-9)',
          paddingRight: 'var(--sizes-size-9)'
        },
        'title-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-5)'
        },
        'title-margin-bottom': 'var(--sizes-size-3)'
      }
    },
    icon: {
      label: '图标',
      token: '--alert-icon-',
      body: {
        'size': 'var(--sizes-base-8)',
        'margin-right': 'var(--sizes-size-5)'
      }
    },
    level: {
      info: {
        label: '提示',
        token: '--alert-level-info-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-brand-10)',
          'icon-color': 'var(--colors-brand-5)'
        }
      },
      success: {
        label: '成功',
        token: '--alert-level-success-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-success-10)',
          'icon-color': 'var(--colors-success-5)'
        }
      },
      warning: {
        label: '成功',
        token: '--alert-level-warning-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-warning-10)',
          'icon-color': 'var(--colors-warning-5)'
        }
      },
      danger: {
        label: '成功',
        token: '--alert-level-danger-',
        body: {
          'color': 'var(--colors-neutral-text-2)',
          'bg-color': 'var(--colors-error-10)',
          'icon-color': 'var(--colors-error-5)'
        }
      }
    }
  },
  spinner: {
    base: {
      label: '基本',
      token: '--spinner-base-',
      body: {
        'font': {
          color: 'var(--colors-info-5)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'tip-size': 'var(--sizes-base-6)'
      }
    },
    small: {
      label: 'small尺寸',
      token: '--spinner-sm-',
      body: {
        size: 'var(--sizes-base-8)'
      }
    },
    normal: {
      label: 'normal尺寸',
      token: '--spinner-size-',
      body: {
        size: 'var(--sizes-base-16)'
      }
    },
    large: {
      label: 'large尺寸',
      token: '--spinner-lg-',
      body: {
        size: 'var(--sizes-base-24)'
      }
    }
  },
  tag: {
    base: {
      label: '基本',
      token: '--Tag-base-',
      body: {
        'font': {
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'height': 'var(--sizes-base-12)',
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-0)',
          paddingBottom: 'var(--sizes-size-0)',
          paddingLeft: 'var(--sizes-size-5)',
          paddingRight: 'var(--sizes-size-5)'
        }
      }
    },
    model: [
      {
        label: '面性标签',
        type: 'normal',
        token: '--Tag-model-normal-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-6)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-1)',
            'right-border-color': 'var(--colors-neutral-line-6)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-1)',
            'bottom-border-color': 'var(--colors-neutral-line-6)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-1)',
            'left-border-color': 'var(--colors-neutral-line-6)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          },
          'status-size': 'var(--sizes-size-0)',
          'status-margin': 'var(--sizes-size-0)',
          'close-size': 'var(--sizes-size-0)',
          'close-margin': 'var(--sizes-size-0)'
        }
      },
      {
        label: '线性标签',
        type: 'rounded',
        token: '--Tag-model-rounded-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-6)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-6)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-6)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-6)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-right-border-radius': '12px',
            'top-left-border-radius': '12px',
            'bottom-right-border-radius': '12px',
            'bottom-left-border-radius': '12px'
          },
          'status-size': 'var(--sizes-size-0)',
          'status-margin': 'var(--sizes-size-0)',
          'close-size': 'var(--sizes-size-0)',
          'close-margin': 'var(--sizes-size-0)'
        }
      },
      {
        label: '状态标签',
        type: 'status',
        token: '--Tag-model-status-',
        body: {
          'border': {
            'top-border-color': 'var(--colors-neutral-line-6)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-1)',
            'right-border-color': 'var(--colors-neutral-line-6)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-1)',
            'bottom-border-color': 'var(--colors-neutral-line-6)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-1)',
            'left-border-color': 'var(--colors-neutral-line-6)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          },
          'status-size': 'var(--sizes-size-5)',
          'status-margin': 'var(--sizes-size-5)',
          'close-size': 'var(--sizes-size-5)',
          'close-margin': 'var(--sizes-size-5)'
        }
      }
    ],
    color: [
      {
        label: 'active',
        type: 'active',
        token: '--Tag-color-active-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-brand-5)'
        }
      },
      {
        label: 'inactive',
        type: 'inactive',
        token: '--Tag-color-inactive-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-neutral-fill-6)'
        }
      },
      {
        label: 'error',
        tyupe: 'error',
        token: '--Tag-color-error-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-error-5)'
        }
      },
      {
        label: 'success',
        type: 'success',
        token: '--Tag-color-success-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-success-5)'
        }
      },
      {
        label: 'processing',
        tyupe: 'processing',
        token: '--Tag-color-processing-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-brand-6)'
        }
      },
      {
        label: 'warning',
        type: 'warning',
        token: '--Tag-color-warning-',
        body: {
          'color': 'var(--colors-neutral-fill-11)',
          'bg-color': 'var(--colors-warning-5)'
        }
      }
    ]
  },
  timeline: {
    base: {
      label: '基本',
      token: '--Timeline-',
      body: {
        'time-font': {
          color: 'var(--colors-neutral-text-5)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'title-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'detail-label-font': {
          color: 'var(--colors-brand-5)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'detail-content-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'line-bg': '#e6e6e8',
        'round-bg': '#dadbdd',
        'left-size': 'var(--sizes-size-2)',
        'shadow': 'var(--shadows-shadow-normal)',
        'detail-icon-size': 'var(--sizes-base-8)',
        'detail-icon-color': 'var(--colors-brand-5)',
        'visible-padding-and-margin': {
          paddingTop: 'var(--sizes-size-6)',
          paddingBottom: 'var(--sizes-size-6)',
          paddingLeft: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)'
        },
        'visible-border': {
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        }
      }
    },
    type: {
      label: '颜色状态',
      token: '--Timeline-type-',
      body: {
        'info-color': 'var(--colors-info-5)',
        'success-color': 'var(--colors-success-5)',
        'warning-color': 'var(--colors-warning-5)',
        'danger-color': 'var(--colors-error-5)'
      }
    },
    horizontal: {
      label: '方向',
      token: '--Timeline-horizontal-',
      body: {
        'top-size': 'var(--sizes-size-0)'
      }
    }
  },
  pick: {
    base: {
      label: '基本',
      token: '--Pick-base-',
      body: {
        'border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'bgColor': 'var(--colors-neutral-fill-11)',
        'value-font': {
          color: 'var(--colors-other-5)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'value-border': {
          'top-border-color': 'var(--colors-other-7)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-other-7)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-other-7)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-other-7)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)'
        },
        'value-bgColor': '#cce5ff',
        'value-radius': {
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'icon': '',
        'icon-size': 'var(--sizes-size-9)',
        'icon-color': '#84878c',
        'value-icon-color': 'var(--colors-other-5)',
        'value-hover-icon-color': '#b3d7ff'
      }
    },
    status: {
      label: '配置 不同状态',
      token: '--Pick-status-',
      body: {
        'hover-border': {
          'top-border-color': 'var(--colors-other-5)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-other-5)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-other-5)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-other-5)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)'
        },
        'hover-bgColor': 'var(--colors-neutral-line-11)',
        'focus-border': {
          'top-border-color': 'var(--colors-other-7)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-other-7)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-other-7)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-other-7)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)'
        },
        'focus-shadow': 'var(--shadows-shadow-none)',
        'focus-bgColor': 'var(--colors-neutral-line-11)',
        'disabled-border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)'
        },
        'disabled-bgColor': 'var(--colors-neutral-text-10)',
        'disabled-font': {
          color: 'var(--colors-neutral-line-6)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        }
      }
    }
  },
  toast: {
    base: {
      label: '基本',
      token: '--Toast-',
      body: {
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-3)',
          paddingBottom: 'var(--sizes-size-3)',
          paddingLeft: 'var(--sizes-size-9)',
          paddingRight: 'var(--sizes-size-9)'
        },
        'border': {
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        'icon-size': 'var(--sizes-size-9)'
      }
    },
    info: {
      label: '基本',
      token: '--Toast--info-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        border: {
          'top-border-color': 'var(--colors-neutral-line-11)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-11)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-11)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-11)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        bgColor: 'var(--colors-neutral-fill-11)'
      }
    },
    success: {
      label: '基本',
      token: '--Toast--success-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        border: {
          'top-border-color': 'var(--colors-neutral-line-11)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-11)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-11)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-11)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        bgColor: 'var(--colors-neutral-fill-11)'
      }
    },
    danger: {
      label: '基本',
      token: '--Toast--danger-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        border: {
          'top-border-color': 'var(--colors-neutral-line-11)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-11)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-11)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-11)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        bgColor: 'var(--colors-neutral-fill-11)'
      }
    },
    warning: {
      label: '基本',
      token: '--Toast--warning-',
      body: {
        font: {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        border: {
          'top-border-color': 'var(--colors-neutral-line-11)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-2)',
          'right-border-color': 'var(--colors-neutral-line-11)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-2)',
          'bottom-border-color': 'var(--colors-neutral-line-11)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-2)',
          'left-border-color': 'var(--colors-neutral-line-11)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-2)',
          'top-right-border-radius': 'var(--borders-radius-3)',
          'top-left-border-radius': 'var(--borders-radius-3)',
          'bottom-right-border-radius': 'var(--borders-radius-3)',
          'bottom-left-border-radius': 'var(--borders-radius-3)'
        },
        bgColor: 'var(--colors-neutral-fill-11)'
      }
    }
  },
  status: {
    base: {
      label: 'base',
      type: 'base',
      token: '--Status-base-',
      body: {
        'fontSize': 'var(--fonts-size-9)',
        'icon-size': 'var(--sizes-size-8)',
        'text-margin': 'var(--sizes-size-3)'
      }
    },
    color: [
      {
        label: 'fail',
        type: 'fail',
        token: '--Status-fail-',
        body: {
          color: 'var(--colors-error-5)'
        }
      },
      {
        label: 'success',
        type: 'success',
        token: '--Status-success-',
        body: {
          color: 'var(--colors-success-5)'
        }
      },
      {
        label: 'queue',
        type: 'queue',
        token: '--Status-queue-',
        body: {
          color: 'var(--colors-warning-5)'
        }
      },
      {
        label: 'schedule',
        type: 'schedule',
        token: '--Status-schedule-',
        body: {
          color: 'var(--colors-neutral-fill-2)'
        }
      },
      {
        label: 'pending',
        type: 'pending',
        token: '--Status-pending-',
        body: {
          'before-color': 'var(--colors-error-5)',
          'after-color': 'var(--colors-brand-5)'
        }
      }
    ]
  },
  image: {
    image: {
      default: {
        label: '默认样式',
        normal: {
          label: '整体',
          token: '--image-image-normal-',
          body: {
            'padding-and-margin': {
              paddingTop: 'var(--sizes-size-3)',
              paddingBottom: 'var(--sizes-size-3)',
              paddingLeft: 'var(--sizes-size-3)',
              paddingRight: 'var(--sizes-size-3)'
            },
            'font': {
              color: 'var(--colors-neutral-text-2)',
              fontSize: 'var(--fonts-size-7)'
            },
            'title-marginTop': 'var(--sizes-size-0)'
          }
        },
        description: {
          label: '描述',
          token: '--image-image-description-',
          body: {
            font: {
              color: 'var(--colors-neutral-text-2)',
              fontSize: 'var(--fonts-size-8)'
            },
            marginTop: 'var(--sizes-size-0)'
          }
        }
      }
    },
    images: {
      item: {
        label: '图片项',
        token: '--image-images-item-',
        body: {
          'padding-and-margin': {
            marginTop: 'var(--sizes-size-3)',
            marginBottom: 'var(--sizes-size-3)',
            marginLeft: 'var(--sizes-size-3)',
            marginRight: 'var(--sizes-size-3)'
          },
          'size': '48px',
          'color': 'var(--colors-neutral-text-5)'
        }
      },
      preview: {
        label: '图片项',
        token: '--image-images-preview-',
        body: {
          'radius': 'var(--sizes-size-3)',
          'bgColor': 'var(--colors-neutral-text-11)',
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-9)',
            paddingRight: 'var(--sizes-size-9)'
          }
        }
      }
    }
  },
  inputTag: {
    option: {
      label: '选项',
      token: '--inputTag-option-',
      body: {
        'height': 'var(--sizes-base-16)',
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-3)',
          paddingBottom: 'var(--sizes-size-3)',
          paddingLeft: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)'
        },
        'bg-color': 'var(--colors-neutral-fill-11)',
        'hover-color': 'var(--colors-neutral-text-2)',
        'hover-bg-color': 'var(--colors-brand-10)'
      }
    }
  },
  fieldSet: {
    legend: {
      label: '标题',
      token: '--fieldSet-legend-',
      body: {
        'height': 'var(--sizes-size-9)',
        'font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)'
        },
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-0)',
          paddingBottom: 'var(--sizes-size-0)',
          paddingLeft: 'var(--sizes-size-8)',
          paddingRight: 'var(--sizes-size-0)',
          marginTop: 'var(--sizes-size-7)',
          marginBottom: 'var(--sizes-size-7)',
          marginLeft: 'var(--sizes-size-0)',
          marginRight: 'var(--sizes-size-0)'
        },
        'border-color': 'var(--colors-brand-5)',
        'border-width': 'var(--sizes-size-3)'
      }
    },
    size: {
      xs: {
        label: 'xs',
        token: '--fieldSet-size-xs-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-10)',
            paddingRight: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-3)',
            paddingLeft: 'var(--sizes-size-3)'
          },
          'fontSize': 'var(--fonts-size-8)'
        }
      },
      sm: {
        label: 'sm',
        token: '--fieldSet-size-sm-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-12)',
            paddingRight: 'var(--sizes-size-6)',
            paddingBottom: 'var(--sizes-size-6)',
            paddingLeft: 'var(--sizes-size-6)'
          },
          'fontSize': 'var(--fonts-size-8)'
        }
      },
      base: {
        label: 'base',
        token: '--fieldSet-size-base-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-15)',
            paddingRight: 'var(--sizes-size-9)',
            paddingBottom: 'var(--sizes-size-9)',
            paddingLeft: 'var(--sizes-size-9)'
          },
          'fontSize': 'var(--fonts-size-7)'
        }
      },
      md: {
        label: 'md',
        token: '--fieldSet-size-md-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-15)',
            paddingRight: 'var(--sizes-base-10)',
            paddingBottom: 'var(--sizes-base-10)',
            paddingLeft: 'var(--sizes-base-10)'
          },
          'fontSize': 'var(--fonts-size-7)'
        }
      },
      lg: {
        label: 'lg',
        token: '--fieldSet-size-lg-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-20)',
            paddingRight: 'var(--sizes-base-15)',
            paddingBottom: 'var(--sizes-base-15)',
            paddingLeft: 'var(--sizes-base-15)'
          },
          'fontSize': 'var(--fonts-size-6)'
        }
      }
    }
  },
  inputRichText: {
    base: {
      label: '基础样式',
      default: {
        label: '常规',
        token: '--inputRichText-default-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          }
        }
      },
      hover: {
        label: '常规',
        token: '--inputRichText-hover-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          }
        }
      },
      active: {
        label: '点击',
        token: '--inputRichText-active-',
        body: {
          border: {
            'top-border-color': 'var(--colors-brand-5)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-brand-5)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-brand-5)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-brand-5)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          }
        }
      },
      disabled: {
        label: '禁用',
        token: '--inputRichText-disabled-',
        body: {
          border: {
            'top-border-color': 'var(--colors-neutral-line-8)',
            'top-border-width': 'var(--borders-width-2)',
            'top-border-style': 'var(--borders-style-2)',
            'right-border-color': 'var(--colors-neutral-line-8)',
            'right-border-width': 'var(--borders-width-2)',
            'right-border-style': 'var(--borders-style-2)',
            'bottom-border-color': 'var(--colors-neutral-line-8)',
            'bottom-border-width': 'var(--borders-width-2)',
            'bottom-border-style': 'var(--borders-style-2)',
            'left-border-color': 'var(--colors-neutral-line-8)',
            'left-border-width': 'var(--borders-width-2)',
            'left-border-style': 'var(--borders-style-2)',
            'top-left-border-radius': 'var(--borders-radius-1)',
            'top-right-border-radius': 'var(--borders-radius-1)',
            'bottom-right-border-radius': 'var(--borders-radius-1)',
            'bottom-left-border-radius': 'var(--borders-radius-1)'
          }
        }
      }
    }
  },
  conditionBuilder: {
    base: {
      label: '标题',
      token: '--conditionBuilder-',
      body: {
        'toolbar-size': {
          width: 'var(--sizes-base-14)',
          height: 'var(--sizes-base-14)'
        },
        'toolbar-font': {
          color: 'var(--colors-brand-3)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-5)'
        },
        'toolbar-bg-color': 'var(--colors-brand-9)',
        'toolbar-hover-font': {
          color: 'var(--colors-neutral-text-11)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-5)'
        },
        'toolbar-hover-bg-color': 'var(--colors-brand-5)',
        'line-width': 'var(--sizes-size-2)',
        'line-bg-color': 'var(--colors-brand-9)',
        'body-bg-color': 'var(--colors-neutral-line-10)',
        'body-padding-and-margin': {
          paddingTop: 'var(--sizes-size-7)',
          paddingRight: 'var(--sizes-size-7)',
          paddingBottom: 'var(--sizes-size-7)',
          paddingLeft: 'var(--sizes-base-14)'
        }
      }
    }
  },
  wizard: {
    base: {
      label: '基础样式',
      badge: {
        label: 'basebadge',
        type: 'badge',
        token: '--Wizard-badge-',
        body: {
          'size': 'var(--sizes-base-13)',
          'font': {
            fontSize: 'var(--fonts-size-7)',
            color: 'var(--colors-neutral-text-6)'
          },
          'border-width': 'var(--borders-width-2)',
          'border-color': 'var(--colors-neutral-line-6)',
          'bg-color': 'var(--colors-neutral-fill-11)',
          'onActive-color': 'var(--colors-neutral-text-11)',
          'onActive-bg-color': 'var(--colors-neutral-fill-3)',
          'text-margin': 'var(--sizes-size-4)'
        }
      },
      step: {
        label: 'basestep',
        type: 'step',
        token: '--Wizard-step-',
        body: {
          'font': {
            fontSize: 'var(--fonts-size-7)',
            color: 'var(--colors-neutral-text-6)'
          },
          'padding': {
            paddingTop: 'var(--sizes-size-6)',
            paddingRight: 'var(--sizes-size-0)',
            paddingBottom: 'var(--sizes-size-6)',
            paddingLeft: 'var(--sizes-size-0)'
          },
          'bg-color': 'var(--colors-neutral-fill-11)',
          'li-onActive-color': 'var(--colors-neutral-text-3)',
          'li-onActive-bg-color': 'var(--colors-neutral-fill-11)'
        }
      },
      after: {
        label: 'baseafter',
        type: 'after',
        token: '--Wizard-after-',
        body: {
          'color': 'var(--colors-neutral-text-6)',
          'onActive-color': 'var(--colors-neutral-text-3)'
        }
      },
      stepContent: {
        label: 'basestepContent',
        type: 'stepContent',
        token: '--Wizard-stepContent-',
        body: {
          padding: {
            paddingTop: 'var(--sizes-size-7)',
            paddingRight: 'var(--sizes-size-7)',
            paddingBottom: 'var(--sizes-size-7)',
            paddingLeft: 'var(--sizes-size-7)'
          }
        }
      }
    }
  },
  table: {
    base: {
      label: '基础',
      token: '--table-',
      body: {
        'border-width': 'var(--borders-width-2)',
        'border-color': 'var(--colors-neutral-line-8)',
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)',
          paddingBottom: 'var(--sizes-size-6)',
          paddingLeft: 'var(--sizes-size-6)'
        },
        'line-height': 'var(--sizes-base-20)',
        'paddingX': 'var(--sizes-size-7)',
        'header-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'header-bg-color': 'var(--colors-neutral-fill-10)',
        'header-separate-line-color': 'var(--colors-neutral-fill-11)',
        'header-separate-line-width': 'var(--borders-width-2)',
        'body-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-8)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'body-bg-color': 'var(--colors-neutral-fill-11)',
        'body-hover-color': 'var(--colors-neutral-text-2)',
        'body-hover-bg-color': 'var(--colors-brand-10)',
        'body-disabled-color': 'var(--colors-neutral-text-6)',
        'body-disabled-bg-color': 'var(--colors-neutral-fill-10)',
        'title-font': {
          color: 'var(--colors-neutral-text-2)',
          fontSize: 'var(--fonts-size-7)',
          fontWeight: 'var(--fonts-weight-6)',
          lineHeight: 'var(--fonts-lineHeight-2)'
        },
        'title-bg-color': 'var(--colors-neutral-fill-11)',
        'title-padding-and-margin': {
          paddingTop: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-6)',
          paddingLeft: 'var(--sizes-size-5)'
        },
        'icon-color': 'var(--colors-neutral-text-6)',
        'icon-hover-color': 'var(--colors-neutral-text-2)',
        'icon-active-color': 'var(--colors-brand-5)',
        'icon-marginLeft': 'var(--sizes-size-5)',
        'sort-icon': '',
        'sort-up-icon': '',
        'sort-down-icon': '',
        'filter-icon': '',
        'search-icon': ''
      }
    },
    togglable: {
      label: '自定义列',
      token: '--table-togglable-',
      body: {
        'padding-and-margin': {
          paddingTop: 'var(--sizes-size-4)',
          paddingRight: 'var(--sizes-size-5)',
          paddingBottom: 'var(--sizes-size-4)',
          paddingLeft: 'var(--sizes-size-5)'
        },
        'bg-color': 'var(--colors-neutral-fill-11)',
        'hover-bg-color': 'var(--colors-neutral-fill-8)'
      }
    },
    size: {
      large: {
        label: '尺寸大',
        token: '--table-size-large-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-base-10)',
            paddingRight: 'var(--sizes-size-7)',
            paddingBottom: 'var(--sizes-base-10)',
            paddingLeft: 'var(--sizes-size-7)'
          }
        }
      },
      small: {
        label: '尺寸小',
        token: '--table-size-small-',
        body: {
          'padding-and-margin': {
            paddingTop: 'var(--sizes-size-4)',
            paddingRight: 'var(--sizes-size-3)',
            paddingBottom: 'var(--sizes-size-4)',
            paddingLeft: 'var(--sizes-size-3)'
          }
        }
      }
    }
  },
  combo: {
    base: {
      label: '基本',
      token: '--combo-',
      body: {
        'bg-color': 'var(--colors-neutral-fill-11)',
        'vertical-border': {
          'top-border-color': 'var(--colors-neutral-line-8)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-3)',
          'right-border-color': 'var(--colors-neutral-line-8)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-3)',
          'bottom-border-color': 'var(--colors-neutral-line-8)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-3)',
          'left-border-color': 'var(--colors-neutral-line-8)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-3)',
          'top-left-border-radius': 'var(--borders-radius-1)',
          'top-right-border-radius': 'var(--borders-radius-1)',
          'bottom-right-border-radius': 'var(--borders-radius-1)',
          'bottom-left-border-radius': 'var(--borders-radius-1)'
        },
        'vertical-hover-border': {
          'top-border-color': 'var(--colors-brand-5)',
          'top-border-width': 'var(--borders-width-2)',
          'top-border-style': 'var(--borders-style-3)',
          'right-border-color': 'var(--colors-brand-5)',
          'right-border-width': 'var(--borders-width-2)',
          'right-border-style': 'var(--borders-style-3)',
          'bottom-border-color': 'var(--colors-brand-5)',
          'bottom-border-width': 'var(--borders-width-2)',
          'bottom-border-style': 'var(--borders-style-3)',
          'left-border-color': 'var(--colors-brand-5)',
          'left-border-width': 'var(--borders-width-2)',
          'left-border-style': 'var(--borders-style-3)'
        },
        'vertical-padding-and-margin': {
          paddingTop: 'var(--sizes-size-6)',
          paddingRight: 'var(--sizes-size-6)',
          paddingBottom: 'var(--sizes-size-6)',
          paddingLeft: 'var(--sizes-size-6)'
        }
      }
    },
    multi: {
      label: '多选模式',
      token: '--combo-multi-',
      body: {
        'delBtn-color': 'var(--colors-neutral-text-5)',
        'delBtn-hover-color': 'var(--colors-neutral-text-2)'
      }
    }
  }
};

export default component;
