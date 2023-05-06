import {Button} from 'amis';
import React from 'react';
import {getI18nEnabled, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff, JSONPipeOut, repeatArray} from 'amis-editor-core';
import {
  schemaArrayFormat,
  resolveArrayDatasource,
  schemaToArray
} from '../util';

export class ListPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'list';
  $schema = '/schemas/ListSchema.json';

  // 组件名称
  name = '列表';
  isBaseComponent = true;
  description =
    '展示一个列表，可以自定标题、副标题，内容及按钮组部分。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
  docLink = '/amis/zh-CN/components/list';
  tags = ['展示'];
  icon = 'fa fa-list';
  pluginIcon = 'list-plugin';
  scaffold = {
    type: 'list',
    listItem: {
      body: [
        {
          type: 'tpl',
          tpl: '简单的展示数据：$a $b',
          wrapperComponent: ''
        }
      ],
      actions: [
        {
          icon: 'fa fa-eye',
          type: 'button'
        }
      ]
    }
  };
  previewSchema = {
    ...this.scaffold,
    items: [
      {a: 1, b: 2},
      {a: 3, b: 4},
      {a: 5, b: 6}
    ]
  };

  panelTitle = '列表';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                children: (
                  <Button
                    level="primary"
                    size="sm"
                    block
                    onClick={this.editDetail.bind(this, context.id)}
                  >
                    配置成员详情
                  </Button>
                )
              },
              {
                type: 'divider'
              },
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '标题'
              },
              isCRUDBody
                ? null
                : getSchemaTpl('sourceBindControl', {
                    label: '数据源'
                  }),
              {
                name: 'placeholder',
                pipeIn: defaultValue('没有数据'),
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '无数据提示'
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: '头部',
                name: 'showHeader',
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editHeaderDetail.bind(this, context.id)}
                        >
                          配置头部
                        </Button>
                      )
                    }
                  ]
                }
              },
              {
                type: 'ae-switch-more',
                mode: 'normal',
                formType: 'extend',
                label: '底部',
                name: 'showFooter',
                form: {
                  body: [
                    {
                      children: (
                        <Button
                          level="primary"
                          size="sm"
                          block
                          onClick={this.editFooterDetail.bind(this, context.id)}
                        >
                          配置底部
                        </Button>
                      )
                    }
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                label: '外层'
              }),
              getSchemaTpl('className', {
                name: 'itemClassName',
                label: 'ListItem'
              }),
              getSchemaTpl('className', {
                name: 'headerClassName',
                label: '头部'
              }),
              getSchemaTpl('className', {
                name: 'footerClassName',
                label: '底部'
              })
            ]
          }
        ])
      }
    ]);
  };

  filterProps(props: any) {
    if (props.isSlot) {
      props.value = [props.data];
      return props;
    }

    const data = {
      ...props.defaultData,
      ...props.data
    };
    const arr = resolveArrayDatasource({
      value: props.value,
      data,
      source: props.source
    });

    if (!Array.isArray(arr) || !arr.length) {
      const mockedData: any = this.buildMockData();
      props.value = repeatArray(mockedData, 1).map((item, index) => ({
        ...item,
        id: index + 1
      }));
    }

    const {$schema, ...rest} = props;

    return {
      ...JSONPipeOut(rest),
      $schema
    };
  }

  buildMockData() {
    return {
      id: 666,
      title: '假数据',
      description: '假数据',
      a: '假数据',
      b: '假数据'
    };
  }

  editHeaderDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultHeader = {
      type: 'tpl',
      tpl: '头部',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置头部',
        value: schemaToArray(value.header ?? defaultHeader),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, header: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editFooterDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    const defaultFooter = {
      type: 'tpl',
      tpl: '底部',
      wrapperComponent: ''
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置底部',
        value: schemaToArray(value.footer ?? defaultFooter),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: newValue => {
          newValue = {...value, footer: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置成员详情',
        value: {
          ...value.listItem
        },
        slot: {
          type: 'list',
          listItem: '$$'
        },
        onChange: newValue => {
          newValue = {...value, listItem: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          // TODO  默认数据不对
          items: [this.buildMockData()]
        }
      });
  }

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      info.renderer.name === 'list' ||
      (info.renderer.name === 'crud' && schema.mode === 'list')
    ) {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置成员渲染器',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (
      info.renderer.name === 'list' ||
      (info.renderer.name === 'crud' && schema.mode === 'list')
    ) {
      menus.push('|', {
        label: '配置成员详情',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  // 为了能够自动注入数据。
  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'list'
    ) {
      return {
        ...({id: schema.$$editor.id} as any),
        name: plugin.name!,
        regions: plugin.regions,
        patchContainers: plugin.patchContainers,
        vRendererConfig: plugin.vRendererConfig,
        wrapperProps: plugin.wrapperProps,
        wrapperResolve: plugin.wrapperResolve,
        filterProps: plugin.filterProps,
        $schema: plugin.$schema,
        renderRenderer: plugin.renderRenderer
      };
    }

    return super.getRendererInfo(context);
  }
}

registerEditorPlugin(ListPlugin);
