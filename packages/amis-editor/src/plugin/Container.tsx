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
    body: [
      {
        type: 'tpl',
        tpl: '内容'
      }
    ]
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
              isFlexItem ? getSchemaTpl('layout:flex', {
                visibleOn: 'data.style && (data.style.position === "static" || data.style.position === "relative")',
              }) : null,
              isFlexItem ? getSchemaTpl('layout:flex-grow', {
                visibleOn: 'data.style && data.style.flex !== "0 0 auto" && (data.style.position === "static" || data.style.position === "relative")',
              }) : null,
              isFlexItem ? getSchemaTpl('layout:flex-basis', {
                visibleOn: 'data.style && (data.style.position === "static" || data.style.position === "relative")',
              }) : null,
              getSchemaTpl('layout:position'),
              getSchemaTpl('layout:inset', {
                mode: 'vertical'
              }),
              getSchemaTpl('layout:z-index'),
              getSchemaTpl('layout:display'),

              getSchemaTpl('layout:flexDirection', {
                visibleOn: 'data.style && data.style.display === "flex"',
              }),
              getSchemaTpl('layout:justifyContent', {
                visibleOn: 'data.style && data.style.display === "flex"',
                label: tipedLabel(
                  `${isRowContent ? '水平' : '垂直'}对齐方式`,
                  '设置子元素在主轴上的对齐方式'
                )
              }),
              getSchemaTpl('layout:alignItems', {
                visibleOn: 'data.style && data.style.display === "flex"',
                label: tipedLabel(
                  `${isRowContent ? '垂直' : '水平'}对齐方式`,
                  '设置子元素在交叉轴上的对齐方式'
                )
              }),
              getSchemaTpl('layout:flex-wrap', {
                visibleOn: 'data.style && data.style.display === "flex"',
              }),

              getSchemaTpl('layout:isFixedHeight'),
              getSchemaTpl('layout:height'),
              getSchemaTpl('layout:max-height'),
              getSchemaTpl('layout:min-height'),
              getSchemaTpl('layout:overflow-y'),

              getSchemaTpl('layout:isFixedWidth'),
              getSchemaTpl('layout:width'),
              getSchemaTpl('layout:max-width'),
              getSchemaTpl('layout:min-width'),
              getSchemaTpl('layout:overflow-x'),
              !isFlexItem ? getSchemaTpl('layout:margin-center') : null,
            ]
          },
          getSchemaTpl('status'),
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common', [], ['layout']),
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容区'
              })
            ]
          }),
          ...getSchemaTpl('style:common', ['layout']),
        ])
      }
    ]);
  };
}

registerEditorPlugin(ContainerPlugin);
