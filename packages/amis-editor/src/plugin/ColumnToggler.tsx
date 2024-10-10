import update from 'lodash/update';
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
  static id = 'ColumnToggler';

  rendererName = 'column-toggler';

  name = '自定义显示列';

  panelTitle = '自定义显示列';

  icon = 'fa fa-square';

  tags = ['自定义显示列'];

  $schema = '/schemas/ColumnTogglerSchema.json';

  description = '用来展示表格的自定义显示列按钮，你可以配置不同的展示样式。';

  panelJustify = true;

  isBaseComponent = true;

  disabledRendererPlugin = true;

  crudInfo: {id: any; columns: any[]; schema: any};

  panelBodyCreator = (context: BaseEventContext) => {
    const crud = context?.node?.getClosestParentByType('crud2');

    if (crud) {
      this.crudInfo = {
        id: crud.id,
        columns: crud.schema.columns || [],
        schema: crud.schema
      };
    }

    const columns = (this.crudInfo?.schema?.columns ?? []).map(
      (item: any, index: number) => ({
        label: item.title,
        value: index
      })
    );

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
              }),
              {
                type: 'button-group-select',
                label: '下拉菜单对齐',
                size: 'xs',
                name: 'align',
                value: 'right',
                options: [
                  {
                    label: '左侧',
                    value: 'left'
                  },
                  {
                    label: '右侧',
                    value: 'right'
                  }
                ]
              }
            ]
          },
          {
            title: '列默认显示',
            body: [
              {
                name: `__toggled`,
                value: '',
                type: 'checkboxes',
                // className: 'b-a p-sm',
                label: false,
                inline: false,
                joinValues: false,
                extractValue: true,
                options: columns,
                // style: {
                //   maxHeight: '200px',
                //   overflow: 'auto'
                // },
                pipeIn: (value: any, form: any) => {
                  const showColumnIndex: number[] = [];
                  this.crudInfo?.schema?.columns?.forEach(
                    (item: any, index: number) => {
                      if (item.toggled !== false) {
                        showColumnIndex.push(index);
                      }
                    }
                  );

                  return showColumnIndex;
                },
                onChange: (value: number[]) => {
                  if (!this.crudInfo) {
                    return;
                  }

                  let newColumns = this.crudInfo.schema.columns;

                  newColumns = newColumns.map((item: any, index: number) => ({
                    ...item,
                    toggled: value.includes(index) ? undefined : false
                  }));

                  const updatedSchema = update(
                    this.crudInfo.schema,
                    'columns',
                    (origin: any) => {
                      return newColumns;
                    }
                  );

                  this.manager.store.changeValueById(
                    this.crudInfo.id,
                    updatedSchema
                  );
                  this.crudInfo.schema = updatedSchema;
                }
              }
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
