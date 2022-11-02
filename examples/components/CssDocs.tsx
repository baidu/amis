import React from 'react';
import {Switch} from 'react-router-dom';
import {navigations2route} from './App';
import makeMarkdownRenderer from './MdRenderer';
function wrapDoc(doc: any) {
  return {
    default: makeMarkdownRenderer(doc)
  };
}

export const cssDocs = [
  {
    label: '开始',
    children: [
      {
        label: '快速开始',
        path: '/zh-CN/style/index',
        component: React.lazy(() =>
          import('../../docs/zh-CN/style/index.md').then(wrapDoc)
        )
      },
      {
        label: 'CSS 变量',
        path: '/zh-CN/style/css-vars',
        component: React.lazy(() =>
          import('../../docs/zh-CN/style/css-vars.md').then(wrapDoc)
        )
      },
      {
        label: '辅助类 - 响应式设计',
        path: '/zh-CN/style/responsive-design',
        component: React.lazy(() =>
          import('../../docs/zh-CN/style/responsive-design.md').then(wrapDoc)
        )
      },
      {
        label: '辅助类 - 状态样式',
        path: '/zh-CN/style/state',
        component: React.lazy(() =>
          import('../../docs/zh-CN/style/state.md').then(wrapDoc)
        )
      }
    ]
  },

  {
    // prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
    label: 'Layout',
    children: [
      {
        label: 'Box Sizing',
        path: '/zh-CN/style/layout/box-sizing',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_box-sizing.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Display',
        path: '/zh-CN/style/layout/display',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_display.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Floats',
        path: '/zh-CN/style/layout/floats',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/layout/_float.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Clear',
        path: '/zh-CN/style/layout/clear',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/layout/_clear.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Overflow',
        path: '/zh-CN/style/layout/overflow',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_overflow.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Position',
        path: '/zh-CN/style/layout/position',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_position.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Top / Right / Bottom / Left',
        path: '/zh-CN/style/layout/top-right-bottom-left',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_top-right-bottom-left.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Visibility',
        path: '/zh-CN/style/layout/visibility',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_visibility.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Z-Index',
        path: '/zh-CN/style/layout/z-index',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/layout/_z-index.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'Flexbox',
    children: [
      {
        label: 'Flex Direction',
        path: '/zh-CN/style/flex/direction',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/flex/_direction.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Flex Wrap',
        path: '/zh-CN/style/flex/wrap',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/flex/_wrap.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Flex',
        path: '/zh-CN/style/flex/flex',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/flex/_flex.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Flex Grow',
        path: '/zh-CN/style/flex/grow',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/flex/_grow.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Flex Shrink',
        path: '/zh-CN/style/flex/shrink',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/flex/_shrink.scss').then(
            wrapDoc
          )
        )
      },

      {
        label: 'Flex Order',
        path: '/zh-CN/style/flex/order',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/flex/_order.scss').then(
            wrapDoc
          )
        )
      }
    ]
  },

  {
    label: 'Grid',
    children: [
      {
        label: 'Grid Template Columns',
        path: '/zh-CN/style/grid/columns',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/grid/_columns.scss').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Grid Column Start / End',
        path: '/zh-CN/style/grid/column-start-end',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/grid/_column-start-end.scss'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Grid Template Rows',
        path: '/zh-CN/style/grid/rows',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/grid/_rows.scss').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Grid Row Start / End',
        path: '/zh-CN/style/grid/row-start-end',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/grid/_row-start-end.scss'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Grid Auto Flow',
        path: '/zh-CN/style/grid/auto-flow',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/grid/_auto-flow.scss'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Grid Auto Columns',
        path: '/zh-CN/style/grid/auto-columns',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/grid/_auto-columns.scss'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Grid Auto Rows',
        path: '/zh-CN/style/grid/auto-rows',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/grid/_auto-rows.scss'
          ).then(wrapDoc)
        )
      },
      {
        label: 'Gap',
        path: '/zh-CN/style/grid/gap',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/grid/_gap.scss').then(
            wrapDoc
          )
        )
      }
    ]
  },
  {
    label: 'Box Alignment',
    children: [
      {
        label: 'Justify Content',
        path: '/zh-CN/style/box-alignment/justify-content',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_justify-content.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Justify Items',
        path: '/zh-CN/style/box-alignment/justify-items',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_justify-items.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Justify Self',
        path: '/zh-CN/style/box-alignment/justify-self',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_justify-self.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Align Content',
        path: '/zh-CN/style/box-alignment/align-content',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_align-content.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Align Items',
        path: '/zh-CN/style/box-alignment/align-items',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_align-items.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Align Self',
        path: '/zh-CN/style/box-alignment/align-self',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_align-self.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Place Content',
        path: '/zh-CN/style/box-alignment/place-content',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_place-content.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Place Items',
        path: '/zh-CN/style/box-alignment/place-items',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_place-items.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Place Self',
        path: '/zh-CN/style/box-alignment/place-self',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/box-alignment/_place-self.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'Spacing',
    children: [
      {
        label: 'Padding',
        path: '/zh-CN/style/spacing/padding',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/spacing/_padding.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Margin',
        path: '/zh-CN/style/spacing/margin',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/spacing/_margin.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Space Between',
        path: '/zh-CN/style/spacing/space-between',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/spacing/_space-between.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'Sizing',
    children: [
      {
        label: 'Width',
        path: '/zh-CN/style/sizing/width',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/sizing/_width.scss').then(
            wrapDoc
          )
        )
      },
      {
        label: 'Height',
        path: '/zh-CN/style/sizing/height',
        component: React.lazy(() =>
          import('../../packages/amis-ui/scss/helper/sizing/_height.scss').then(
            wrapDoc
          )
        )
      }
    ]
  },

  {
    label: 'Typography',
    children: [
      {
        label: 'Font Family',
        path: '/zh-CN/style/typography/font-family',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_font-family.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Font Size',
        path: '/zh-CN/style/typography/font-size',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_font-size.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Font style',
        path: '/zh-CN/style/typography/font-style',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_font-style.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Font Weight',
        path: '/zh-CN/style/typography/font-weight',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_font-weight.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Letter Spacing',
        path: '/zh-CN/style/typography/letter-spacing',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_letter-spacing.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Line Height',
        path: '/zh-CN/style/typography/line-height',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_line-height.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'List Style Type',
        path: '/zh-CN/style/typography/list-style-type',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_list-style-type.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Text Alignment',
        path: '/zh-CN/style/typography/text-align',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_text-align.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Text Color',
        path: '/zh-CN/style/typography/text-color',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_text-color.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Text Decoration',
        path: '/zh-CN/style/typography/text-decoration',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_text-decoration.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Text Transform',
        path: '/zh-CN/style/typography/text-transform',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_text-transform.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Vertical Alignment',
        path: '/zh-CN/style/typography/vertical-align',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_vertical-align.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Whitespace',
        path: '/zh-CN/style/typography/whitespace',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_whitespace.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Word Break',
        path: '/zh-CN/style/typography/word-break',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/typography/_word-break.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'Backgrounds',
    children: [
      {
        label: 'Background Color',
        path: '/zh-CN/style/background/background-color',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/background/_background-color.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'BORDERS',
    children: [
      {
        label: 'Border Radius',
        path: '/zh-CN/style/border/border-radius',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/border/_border-radius.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Border Width',
        path: '/zh-CN/style/border/border-width',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/border/_border-width.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Border Color',
        path: '/zh-CN/style/border/border-color',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/border/_border-color.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Border Style',
        path: '/zh-CN/style/border/border-style',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/border/_border-style.scss'
          ).then(wrapDoc)
        )
      }
    ]
  },

  {
    label: 'Effect',
    children: [
      {
        label: 'Box Shadow',
        path: '/zh-CN/style/effect/box-shadow',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/effect/_box-shadow.scss'
          ).then(wrapDoc)
        )
      },

      {
        label: 'Opacity',
        path: '/zh-CN/style/effect/opacity',
        component: React.lazy(() =>
          import(
            '../../packages/amis-ui/scss/helper/effect/_opacity.scss'
          ).then(wrapDoc)
        )
      }
    ]
  }
];

export default class CSSDocs extends React.PureComponent<any> {
  componentDidMount() {
    this.props.setNavigations(cssDocs);
  }

  componentDidUpdate() {
    this.props.setNavigations(cssDocs, false);
  }

  render() {
    return (
      <Switch>
        {navigations2route(cssDocs, {
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
        {/* {React.cloneElement(this.props.children as any, {
          ...(this.props.children as any).props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })} */}
      </Switch>
    );
  }
}
