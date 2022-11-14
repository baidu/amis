import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin, RegionConfig} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, tipedLabel} from 'amis-editor-core';

export class ContainerPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'container';
  $schema = '/schemas/ContainerSchema.json';

  // 组件名称
  name = '容器';
  isBaseComponent = true;
  description = '一个简单的容器，可以将多个渲染器放置在一起。';
  tags = ['容器'];
  withDataSource = false;
  icon = 'fa fa-square-o';
  pluginIcon = 'container-plugin';
  scaffold = {
    type: 'container',
    body: []
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区'
    }
  ];

  panelTitle = '容器';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const curRendererSchema = context?.schema;
    const isRowContent =
      curRendererSchema?.direction === 'row' ||
      curRendererSchema?.direction === 'row-reverse';
    const isFlexItem = this.manager?.isFlexItem(context?.id);
    const isFlexColumnItem = this.manager?.isFlexColumnItem(context?.id);

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                name: 'wrapperComponent',
                label: '容器标签',
                type: 'input-text',
                options: [
                  'article',
                  'aside',
                  'code',
                  'div',
                  'footer',
                  'header',
                  'p',
                  'section'
                ],
                pipeIn: defaultValue('div'),
                validations: {
                  isAlphanumeric: true,
                  matchRegexp: '/^(?!.*script).*$/' // 禁用一下script标签
                },
                validationErrors: {
                  isAlpha: 'HTML标签不合法，请重新输入',
                  matchRegexp: 'HTML标签不合法，请重新输入'
                },
                validateOnChange: false
              }
            ]
          },
          {
            title: '布局',
            body: [
              isFlexItem
                ? getSchemaTpl('layout:flex', {
                    isFlexColumnItem,
                    visibleOn:
                      'data.style && (data.style.position === "static" || data.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-grow', {
                    visibleOn:
                      'data.style && data.style.flex !== "0 0 auto" && (data.style.position === "static" || data.style.position === "relative")'
                  })
                : null,
              isFlexItem
                ? getSchemaTpl('layout:flex-basis', {
                    visibleOn:
                      'data.style && (data.style.position === "static" || data.style.position === "relative")'
                  })
                : null,
              getSchemaTpl('layout:position'),
              getSchemaTpl('layout:originPosition'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:display'),

              getSchemaTpl('layout:flexDirection', {
                visibleOn: 'data.style && data.style.display === "flex"'
              }),

              getSchemaTpl('layout:justifyContent', {
                label: '水平对齐方式',
                visibleOn:
                  'data.style && data.style.display === "flex" && data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse"'
              }),
              getSchemaTpl('layout:justifyContent', {
                label: '垂直对齐方式',
                visibleOn:
                  'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
              }),
              getSchemaTpl('layout:alignItems', {
                label: '水平对齐方式',
                visibleOn:
                  'data.style && data.style.display === "flex" && (data.style.flexDirection === "column" || data.style.flexDirection === "column-reverse")'
              }),
              getSchemaTpl('layout:alignItems', {
                label: '垂直对齐方式',
                visibleOn:
                  'data.style && data.style.display === "flex" && (data.style.flexDirection === "row" || data.style.flexDirection === "row-reverse")'
              }),

              getSchemaTpl('layout:flex-wrap', {
                visibleOn: 'data.style && data.style.display === "flex"'
              }),

              getSchemaTpl('layout:isFixedHeight', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-height', {
                visibleOn: `${!isFlexItem || !isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-y', {
                visibleOn: `${
                  !isFlexItem || !isFlexColumnItem
                } && (data.isFixedHeight || data.style && data.style.maxHeight) || (${
                  isFlexItem && isFlexColumnItem
                } && data.style.flex === '0 0 auto')`
              }),

              getSchemaTpl('layout:isFixedWidth', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:max-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:min-width', {
                visibleOn: `${!isFlexItem || isFlexColumnItem}`
              }),
              getSchemaTpl('layout:overflow-x', {
                visibleOn: `${
                  !isFlexItem || isFlexColumnItem
                } && (data.isFixedWidth || data.style && data.style.maxWidth) || (${
                  isFlexItem && !isFlexColumnItem
                } && data.style.flex === '0 0 auto')`
              }),

              !isFlexItem ? getSchemaTpl('layout:margin-center') : null
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common', ['layout']),
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容区'
              })
            ]
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(ContainerPlugin);
