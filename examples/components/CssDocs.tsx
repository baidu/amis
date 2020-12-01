import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export const cssDocs = [
  {
    label: '📌  开始',
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
