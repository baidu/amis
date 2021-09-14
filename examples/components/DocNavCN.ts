import makeMarkdownRenderer from './MdRenderer';

export default [
  {
    // prefix: ({classnames: cx}) => <li className={cx('AsideNav-divider')} />,
    label: '📌  开始',
    children: [
      {
        label: '介绍',
        path: '/zh-CN/docs/index',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/index.md').then(makeMarkdownRenderer)
      },

      {
        label: '快速开始',
        path: '/zh-CN/docs/start/getting-started',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/start/getting-started.md').then(
            makeMarkdownRenderer
          )
      },

      {
        label: '1.2.0 版本变更',
        path: '/zh-CN/docs/start/1-2-0',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/start/1-2-0.md').then(makeMarkdownRenderer)
      },

      {
        label: '常见问题',
        path: '/zh-CN/docs/start/faq',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/start/faq.md').then(makeMarkdownRenderer)
      }
    ]
  },

  {
    label: '💡  概念',
    children: [
      {
        label: '配置与组件',
        path: '/zh-CN/docs/concepts/schema',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/schema.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '数据域与数据链',
        path: '/zh-CN/docs/concepts/datascope-and-datachain',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/datascope-and-datachain.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '模板',
        path: '/zh-CN/docs/concepts/template',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/template.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '数据映射',
        path: '/zh-CN/docs/concepts/data-mapping',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/data-mapping.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '表达式',
        path: '/zh-CN/docs/concepts/expression',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/expression.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '联动',
        path: '/zh-CN/docs/concepts/linkage',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/linkage.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '行为',
        path: '/zh-CN/docs/concepts/action',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/action.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '样式',
        path: '/zh-CN/docs/concepts/style',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/concepts/style.md').then(
            makeMarkdownRenderer
          )
      }
    ]
  },

  {
    label: '类型',
    children: [
      {
        label: 'SchemaNode',
        path: '/zh-CN/docs/types/schemanode',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/types/schemanode.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'ClassName',
        path: '/zh-CN/docs/types/classname',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/types/classname.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: 'API',
        path: '/zh-CN/docs/types/api',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/types/api.md').then(makeMarkdownRenderer)
      },
      {
        label: 'Definitions',
        path: '/zh-CN/docs/types/definitions',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/types/definitions.md').then(
            makeMarkdownRenderer
          )
      }
    ]
  },

  {
    label: '💎  高级',
    children: [
      {
        label: '工作原理',
        path: '/zh-CN/docs/extend/internal',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/internal.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '自定义组件 - SDK',
        path: '/zh-CN/docs/extend/custom-sdk',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/custom-sdk.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '自定义组件 - React',
        path: '/zh-CN/docs/extend/custom-react',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/custom-react.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '将 amis 当成 UI 库用',
        path: '/zh-CN/docs/extend/ui-library',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/ui-library.md').then(
            makeMarkdownRenderer
          )
      },
      {
        label: '扩展现有组件',
        path: '/zh-CN/docs/extend/addon',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/addon.md').then(makeMarkdownRenderer)
      },
      {
        label: '移动端定制',
        path: '/zh-CN/docs/extend/mobile',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/mobile.md').then(makeMarkdownRenderer)
      },
      {
        label: '多语言',
        path: '/zh-CN/docs/extend/i18n',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/i18n.md').then(makeMarkdownRenderer)
      },
      {
        label: '如何贡献代码',
        path: '/zh-CN/docs/extend/contribute',
        getComponent: () =>
          // @ts-ignore
          import('../../docs/zh-CN/extend/contribute.md').then(
            makeMarkdownRenderer
          )
      }
    ]
  }
];
