import React from 'react';
import makeMarkdownRenderer from './MdRenderer';

export default {
  // prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
  label: '文档',
  children: [
    {
      label: 'AMIS 是什么？',
      icon: 'fa fa-home',
      path: '/docs/intro',
      getComponent: (location, cb) =>
        require(['../../docs/intro.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '快速开始',
      icon: 'fa fa-flash',
      path: '/docs/getting-started',
      getComponent: (location, cb) =>
        require(['../../docs/getting_started.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '基本用法',
      icon: 'fa fa-file',
      path: '/docs/basic',
      getComponent: (location, cb) =>
        require(['../../docs/basic.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '高级用法',
      icon: 'fa fa-rocket',
      path: '/docs/advanced',
      getComponent: (location, cb) =>
        require(['../../docs/advanced.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    // {{renderer-docs}}

    {
      label: '动态数据',
      path: '/docs/api',
      icon: 'fa fa-cloud',
      getComponent: (location, cb) =>
        require(['../../docs/api.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '定制功能',
      path: '/docs/custom',
      icon: 'fa fa-cubes',
      getComponent: (location, cb) =>
        require(['../../docs/custom.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    },

    {
      label: '定制样式',
      path: '/docs/style',
      icon: 'fa fa-laptop',
      getComponent: (location, cb) =>
        require(['../../docs/style.md'], doc => {
          cb(null, makeMarkdownRenderer(doc));
        })
    }
  ]
};
