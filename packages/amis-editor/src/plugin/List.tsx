import {Button, resolveVariable} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
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
  scaffold = {
    type: 'list',
    listItem: {
      body: [
        {
          type: 'tpl',
          tpl: '简单的展示数据：$a $b'
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
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';

    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            children: (
              <Button
                level="danger"
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
            type: 'input-text',
            label: '标题'
          },
          isCRUDBody
            ? null
            : {
                name: 'source',
                type: 'input-text',
                label: '数据源',
                pipeIn: defaultValue('${items}'),
                description: '绑定当前环境变量'
              },
          {
            name: 'placeholder',
            pipeIn: defaultValue('没有数据'),
            type: 'input-text',
            label: '无数据提示'
          }
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('switch', {
            name: 'showHeader',
            label: '是否显示头部',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('switch', {
            name: 'showFooter',
            label: '是否显示底部',
            pipeIn: defaultValue(true)
          }),

          getSchemaTpl('className', {
            label: 'CSS 类名'
          }),
          getSchemaTpl('className', {
            name: 'listClassName',
            label: 'List div CSS 类名'
          }),
          getSchemaTpl('className', {
            name: 'headerClassName',
            label: '头部 CSS 类名'
          }),
          getSchemaTpl('className', {
            name: 'footerClassName',
            label: '底部 CSS 类名'
          })
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
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
    let arr = Array.isArray(props.value)
      ? props.value
      : typeof props.source === 'string'
      ? resolveVariable(props.source, data)
      : resolveVariable('items', data);

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
