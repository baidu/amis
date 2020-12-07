import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export const cssDocs = [
  {
    label: '开始',
    children: [
      {
        label: '快速开始',
        path: '/style/index',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../docs/css-utilities/index.md'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: '响应式设计',
        path: '/style/responsive-design',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../docs/css-utilities/responsive-design.md'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: '状态样式',
        path: '/style/state',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../docs/css-utilities/state.md'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
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
        path: '/style/layout/box-sizing',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_box-sizing.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Display',
        path: '/style/layout/display',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_display.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Floats',
        path: '/style/layout/floats',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_float.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Clear',
        path: '/style/layout/clear',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_clear.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Overflow',
        path: '/style/layout/overflow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_overflow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Position',
        path: '/style/layout/position',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_position.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Top / Right / Bottom / Left',
        path: '/style/layout/top-right-bottom-left',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_top-right-bottom-left.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Visibility',
        path: '/style/layout/visibility',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_Visibility.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Z-Index',
        path: '/style/layout/z-index',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_z-index.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Flexbox',
    children: [
      {
        label: 'Flex Direction',
        path: '/style/flexbox/direction',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_direction.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Flex Wrap',
        path: '/style/flexbox/wrap',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_wrap.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Flex',
        path: '/style/flexbox/flex',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_flex.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Flex Grow',
        path: '/style/flexbox/grow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_grow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Flex Shrink',
        path: '/style/flexbox/shrink',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_shrink.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Flex Order',
        path: '/style/flexbox/order',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_order.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Grid',
    children: [
      {
        label: 'Grid Template Columns',
        path: '/style/grid/columns',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_columns.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Column Start / End',
        path: '/style/grid/column-start-end',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_column-start-end.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Template Rows',
        path: '/style/grid/rows',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_rows.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Row Start / End',
        path: '/style/grid/row-start-end',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_row-start-end.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Flow',
        path: '/style/grid/auto-flow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_auto-flow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Columns',
        path: '/style/grid/auto-columns',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_auto-columns.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Rows',
        path: '/style/grid/auto-rows',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_auto-rows.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Gap',
        path: '/style/grid/gap',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_gap.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },
  {
    label: 'Box Alignment',
    children: [
      {
        label: 'Justify Content',
        path: '/style/box-alignment/justify-content',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_justify-content.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Justify Items',
        path: '/style/box-alignment/justify-items',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_justify-items.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Justify Self',
        path: '/style/box-alignment/justify-self',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_justify-self.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Align Content',
        path: '/style/box-alignment/align-content',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_align-content.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Align Items',
        path: '/style/box-alignment/align-items',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_align-items.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Align Self',
        path: '/style/box-alignment/align-self',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_align-self.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Place Content',
        path: '/style/box-alignment/place-content',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_place-content.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Place Items',
        path: '/style/box-alignment/place-items',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_place-items.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Place Self',
        path: '/style/box-alignment/place-self',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/box-alignment/_place-self.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Spacing',
    children: [
      {
        label: 'Padding',
        path: '/style/spacing/padding',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/spacing/_padding.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Margin',
        path: '/style/spacing/margin',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/spacing/_margin.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Space Between',
        path: '/style/spacing/space-between',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/spacing/_space-between.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Sizing',
    children: [
      {
        label: 'Width',
        path: '/style/flexbox/width',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_width.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Height',
        path: '/style/flexbox/height',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_height.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Typography',
    children: [
      {
        label: 'Font Size',
        path: '/style/typography/font-size',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_font-size.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Font Style',
        path: '/style/typography/font-style',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_font-style.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Font Weight',
        path: '/style/typography/font-weight',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_font-weight.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Letter Spacing',
        path: '/style/typography/letter-spacing',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_letter-spacing.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Line Height',
        path: '/style/typography/line-height',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_line-height.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'List Style Type',
        path: '/style/typography/list-style-type',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_list-style-type.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Alignment',
        path: '/style/typography/text-align',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_text-align.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Color',
        path: '/style/typography/text-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_text-color.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Decoration',
        path: '/style/typography/text-decoration',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_text-decoration.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Transform',
        path: '/style/typography/text-transform',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_text-transform.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Vertical Alignment',
        path: '/style/typography/vertical-algin',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_vertical-algin.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Whitespace',
        path: '/style/typography/whitespace',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_whitespace.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Word Break',
        path: '/style/typography/word-break',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_word-break.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Backgrounds',
    children: [
      {
        label: 'Background Color',
        path: '/style/background/background-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_background-color.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'BORDERS',
    children: [
      {
        label: 'Border Radius',
        path: '/style/border/border-radius',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_border-radius.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Width',
        path: '/style/border/border-width',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_border-width.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Color',
        path: '/style/border/border-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_border-color.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Style',
        path: '/style/border/border-style',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_border-style.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      }
    ]
  },

  {
    label: 'Effect',
    children: [
      {
        label: 'Box Shadow',
        path: '/style/effect/box-shadow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_box-shadow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Opacity',
        path: '/style/effect/opacity',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/flex/_opacity.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
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
    this.props.setNavigations(cssDocs);
  }

  render() {
    return (
      <>
        {React.cloneElement(this.props.children as any, {
          ...(this.props.children as any).props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen
        })}
      </>
    );
  }
}
