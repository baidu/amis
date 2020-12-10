import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export const cssDocs = [
  {
    label: '开始',
    children: [
      {
        label: '快速开始',
        path: '/css-utilities/index',
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
        path: '/css-utilities/responsive-design',
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
        path: '/css-utilities/state',
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
        path: '/css-utilities/layout/box-sizing',
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
        path: '/css-utilities/layout/display',
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
        path: '/css-utilities/layout/floats',
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
        path: '/css-utilities/layout/clear',
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
        path: '/css-utilities/layout/overflow',
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
        path: '/css-utilities/layout/position',
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
        path: '/css-utilities/layout/top-right-bottom-left',
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
        path: '/css-utilities/layout/visibility',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/layout/_visibility.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Z-Index',
        path: '/css-utilities/layout/z-index',
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
        path: '/css-utilities/flexbox/direction',
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
        path: '/css-utilities/flexbox/wrap',
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
        path: '/css-utilities/flexbox/flex',
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
        path: '/css-utilities/flexbox/grow',
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
        path: '/css-utilities/flexbox/shrink',
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
        path: '/css-utilities/flexbox/order',
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
        path: '/css-utilities/grid/columns',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_columns.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Column Start / End',
        path: '/css-utilities/grid/column-start-end',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_column-start-end.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Template Rows',
        path: '/css-utilities/grid/rows',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_rows.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Row Start / End',
        path: '/css-utilities/grid/row-start-end',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_row-start-end.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Flow',
        path: '/css-utilities/grid/auto-flow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_auto-flow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Columns',
        path: '/css-utilities/grid/auto-columns',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_auto-columns.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Grid Auto Rows',
        path: '/css-utilities/grid/auto-rows',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_auto-rows.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Gap',
        path: '/css-utilities/grid/gap',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/grid/_gap.scss'],
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
        path: '/css-utilities/box-alignment/justify-content',
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
        path: '/css-utilities/box-alignment/justify-items',
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
        path: '/css-utilities/box-alignment/justify-self',
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
        path: '/css-utilities/box-alignment/align-content',
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
        path: '/css-utilities/box-alignment/align-items',
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
        path: '/css-utilities/box-alignment/align-self',
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
        path: '/css-utilities/box-alignment/place-content',
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
        path: '/css-utilities/box-alignment/place-items',
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
        path: '/css-utilities/box-alignment/place-self',
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
        path: '/css-utilities/spacing/padding',
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
        path: '/css-utilities/spacing/margin',
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
        path: '/css-utilities/spacing/space-between',
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
        path: '/css-utilities/sizing/width',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/sizing/_width.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },
      {
        label: 'Height',
        path: '/css-utilities/sizing/height',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/sizing/_height.scss'],
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
        path: '/css-utilities/typography/font-size',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_font-size.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Font css-utilities',
        path: '/css-utilities/typography/font-style',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_font-style.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Font Weight',
        path: '/css-utilities/typography/font-weight',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_font-weight.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Letter Spacing',
        path: '/css-utilities/typography/letter-spacing',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_letter-spacing.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Line Height',
        path: '/css-utilities/typography/line-height',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_line-height.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'List Style Type',
        path: '/css-utilities/typography/list-style-type',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_list-style-type.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Alignment',
        path: '/css-utilities/typography/text-align',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_text-align.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Color',
        path: '/css-utilities/typography/text-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_text-color.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Decoration',
        path: '/css-utilities/typography/text-decoration',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_text-decoration.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Text Transform',
        path: '/css-utilities/typography/text-transform',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_text-transform.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Vertical Alignment',
        path: '/css-utilities/typography/vertical-align',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_vertical-align.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Whitespace',
        path: '/css-utilities/typography/whitespace',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_whitespace.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Word Break',
        path: '/css-utilities/typography/word-break',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/typography/_word-break.scss'],
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
        path: '/css-utilities/background/background-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/background/_background-color.scss'],
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
        path: '/css-utilities/border/border-radius',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/border/_border-radius.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Width',
        path: '/css-utilities/border/border-width',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/border/_border-width.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Color',
        path: '/css-utilities/border/border-color',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/border/_border-color.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Border Style',
        path: '/css-utilities/border/border-style',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/border/_border-style.scss'],
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
        path: '/css-utilities/effect/box-shadow',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/effect/_box-shadow.scss'],
            (doc: any) => {
              cb(null, makeMarkdownRenderer(doc));
            }
          )
      },

      {
        label: 'Opacity',
        path: '/css-utilities/effect/opacity',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/effect/_opacity.scss'],
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
