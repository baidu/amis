import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin, RegionConfig} from '../plugin';
import {defaultValue, getSchemaTpl} from '../component/schemaTpl';

export class ContainerPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'container';
  $schema = '/schemas/ContainerSchema.json';

  // 组件名称
  name = '容器';
  isBaseComponent = true;
  description = '一个简单的容器，可以将多个渲染器放置在一起。';
  tags = ['容器'];
  icon = 'fa fa-square-o';
  scaffold = {
    type: 'container',
    body: '内容'
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
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '常用',
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
          }
        ])
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common'),
          {
            title: 'CSS 类名',
            body: [
              getSchemaTpl('className', {label: '外层CSS类名'}),
              getSchemaTpl('className', {
                name: 'bodyClassName',
                label: '内容区CSS类名'
              })
            ]
          }
        ])
      }
    ]);
  };
}

registerEditorPlugin(ContainerPlugin);
