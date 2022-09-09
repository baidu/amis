import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext,
  getSchemaTpl,
  registerEditorPlugin
} from 'amis-editor-core';

export class ColumnToggler extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'column-toggler';
  $schema = '/schemas/ColumnToggler.json';

  // 组件名称
  name = '自定义显示列';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  description = '用来展示表格的自定义显示列按钮，你可以配置不同的展示样式。';

  tags = ['自定义显示列'];
  icon = 'fa fa-square';

  panelTitle = '自定义显示列';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                label: '按钮文字',
                type: 'input-text',
                name: 'label'
              },
              {
                label: '按钮提示',
                type: 'input-text',
                name: 'tooltip'
              },
              getSchemaTpl('switch', {
                name: 'defaultIsOpened',
                label: '是否默认展开'
              }),
              getSchemaTpl('icon', {
                label: '按钮图标'
              })
            ]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('size', {
                label: '按钮尺寸'
              })
            ]
          },
          {
            title: 'CSS 类名',
            body: [
              getSchemaTpl('className', {
                name: 'className',
                label: '显示列样式'
              }),

              getSchemaTpl('className', {
                name: 'btnClassName',
                label: '按钮样式'
              })
            ]
          }
        ])
      }
    ]);
  };

  /**
   * 如果禁用了没办法编辑
   */
  filterProps(props: any) {
    props.disabled = false;
    return props;
  }

  /**
   * 如果配置里面有 rendererName 自动返回渲染器信息。
   * @param renderer
   */
  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    const plugin: PluginInterface = this;

    if (
      schema.$$id &&
      plugin.name &&
      plugin.rendererName &&
      plugin.rendererName === renderer.name
    ) {
      // 复制部分信息出去
      return {
        name: schema.label ? schema.label : plugin.name,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        // wrapper: plugin.wrapper,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer
      };
    }
  }
}

registerEditorPlugin(ColumnToggler);
