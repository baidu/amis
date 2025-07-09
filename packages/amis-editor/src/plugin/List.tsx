import {Button, isObject} from 'amis';
import React from 'react';
import {
  EditorNodeType,
  getI18nEnabled,
  registerEditorPlugin
} from 'amis-editor-core';
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
import set from 'lodash/set';
import {
  schemaArrayFormat,
  resolveArrayDatasource,
  schemaToArray,
  generateId
} from '../util';

export class ListPlugin extends BasePlugin {
  static id = 'ListPlugin';
  // 关联渲染器名字
  rendererName = 'list';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/ListSchema.json';

  // 组件名称
  name = '列表';
  isBaseComponent = true;
  isListComponent = true;
  disabledRendererPlugin = true;
  memberImmutable = true;
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
          wrapperComponent: '',
          id: generateId()
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
    const isCRUDBody = ['crud', 'crud2'].includes(context.schema.type);
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              // {
              //   children: (
              //     <Button
              //       level="primary"
              //       size="sm"
              //       block
              //       onClick={this.editDetail.bind(this, context.id)}
              //     >
              //       配置成员详情
              //     </Button>
              //   )
              // },
              // {
              //   type: 'divider'
              // },
              {
                name: 'title',
                type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                label: '标题'
              },
              isCRUDBody
                ? null
                : getSchemaTpl('formItemName', {
                    label: '绑定字段名'
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
                falseValue: false, // 组件渲染时默认值用的true，所以关闭时置为false而不是删除属性
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
                falseValue: false, // 组件渲染时默认值用的true，所以关闭时置为false而不是删除属性
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

  filterProps(props: any, node: EditorNodeType) {
    if (!node.state.value) {
      if (props.isSlot) {
        node.updateState({
          value: [props.data]
        });
        return;
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
        node.updateState({
          value: repeatArray(mockedData, 1).map((item, index) => ({
            ...item,
            id: index + 1
          }))
        });
      }
    }

    const {$schema, ...rest} = props;

    return {
      // ...JSONPipeOut(rest),
      ...rest,
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
        title: '配置成员渲染器',
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

  buildDataSchemas(node: EditorNodeType, region?: EditorNodeType) {
    let dataSchema: any = {
      $id: 'each',
      type: 'object',
      title: '当前循环项',
      properties: {}
    };

    let match =
      node.schema.source && String(node.schema.source).match(/{([\w-_]+)}/);
    let field = node.schema.name || match?.[1];
    const scope = this.manager.dataSchema.getScope(`${node.id}-${node.type}`);

    if (scope) {
      const origin = this.manager.dataSchema.current;
      this.manager.dataSchema.switchTo(scope.parent!);
      const schema = this.manager.dataSchema.getSchemaByPath(field);
      this.manager.dataSchema.switchTo(origin);
      if (isObject(schema?.items)) {
        dataSchema = {
          ...dataSchema,
          ...(schema!.items as any)
        };

        // 列表添加序号方便处理
        set(dataSchema, 'properties.index', {
          type: 'number',
          title: '索引'
        });
      }
    }

    return dataSchema;
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
        label: '配置成员渲染器',
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
      ['crud', 'crud2'].includes(schema.$$editor?.renderer.name) &&
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
        renderRenderer: plugin.renderRenderer,
        memberImmutable: plugin.memberImmutable
      };
    }

    return super.getRendererInfo(context);
  }
}

registerEditorPlugin(ListPlugin);
