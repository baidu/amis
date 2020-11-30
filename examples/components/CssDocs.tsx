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
    children: [
      {
        label: 'CSS',
        path: '/style/css',
        getComponent: (location: any, cb: any) =>
          (require as any)(
            ['../../scss/utilities/background/_background-color.scss'],
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
