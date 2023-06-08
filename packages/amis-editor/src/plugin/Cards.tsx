import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicRendererInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface,
  RegionConfig,
  RendererInfo,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff, JSONPipeOut, repeatArray} from 'amis-editor-core';
import {resolveArrayDatasource} from '../util';

export class CardsPlugin extends BasePlugin {
  static id = 'CardsPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'cards';
  $schema = '/schemas/CardsSchema.json';

  // 组件名称
  name = '卡片列表';
  isBaseComponent = true;
  description =
    '功能类似于表格，但是用一个个小卡片来展示数据。当前组件需要配置数据源，不自带数据拉取，请优先使用 「CRUD」 组件。';
  docLink = '/amis/zh-CN/components/cards';
  tags = ['展示'];
  icon = 'fa fa-window-maximize';
  pluginIcon = 'cards-plugin';
  scaffold = {
    type: 'cards',
    data: {
      items: [
        {a: 1, b: 2},
        {a: 3, b: 4}
      ]
    },
    columnsCount: 2,
    card: {
      type: 'card',
      className: 'm-b-none',
      header: {
        title: '标题',
        subTitle: '副标题'
      },
      body: [
        {
          name: 'a',
          label: 'A'
        },
        {
          name: 'b',
          label: 'B'
        }
      ],
      actions: [
        {
          label: '详情',
          type: 'button'
        }
      ]
    }
  };
  previewSchema = {
    ...this.scaffold,
    className: 'text-left '
  };

  panelTitle = '卡片集';
  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = context.schema.type === 'crud';
    const curPosition = context?.schema?.style?.position;
    const isAbsolute = curPosition === 'fixed' || curPosition === 'absolute';

    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            getSchemaTpl('layout:originPosition', {
              visibleOn: isAbsolute ? isAbsolute : undefined,
              value: 'left-top'
            }),
            {
              children: (
                <div className="m-b">
                  <Button
                    level="primary"
                    size="sm"
                    block
                    onClick={this.editDetail.bind(this, context.id)}
                  >
                    配置单项信息
                  </Button>
                </div>
              )
            },
            {
              type: 'divider'
            },
            getSchemaTpl('title'),
            {
              name: 'href',
              type: 'input-text',
              label: '打开外部链接'
            },

            isCRUDBody
              ? null
              : {
                  name: 'source',
                  type: 'input-text',
                  label: '数据源',
                  pipeIn: defaultValue('${items}'),
                  description: '绑定当前环境变量',
                  test: !isCRUDBody
                },
            getSchemaTpl('cardsPlaceholder')
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
              name: 'headerClassName',
              label: '头部 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'footerClassName',
              label: '底部 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'itemsClassName',
              label: '内容 CSS 类名'
            }),
            getSchemaTpl('className', {
              pipeIn: defaultValue('Grid-col--sm6 Grid-col--md4 Grid-col--lg3'),
              name: 'itemClassName',
              label: '卡片 CSS 类名'
            }),
            {
              name: 'columnsCount',
              type: 'input-range',
              visibleOn: '!this.leftFixed',
              min: 0,
              max: 12,
              step: 1,
              label: '每行显示个数',
              description: '不设置时，由卡片 CSS 类名决定'
            },
            getSchemaTpl('switch', {
              name: 'masonryLayout',
              label: '启用瀑布流'
            })
          ]
        },
        {
          title: '显隐',
          body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
        }
      ])
    ];
  };

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
          type: 'card',
          ...value.card
        },
        slot: {
          type: 'container',
          body: '$$'
        },
        typeMutable: false,
        onChange: newValue => {
          newValue = {...value, card: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          item: 'mocked data',
          index: 0
        }
      });
  }

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      info.renderer.name === 'cards' ||
      (info.renderer.name === 'crud' && schema.mode === 'cards')
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
      info.renderer.name === 'cards' ||
      (info.renderer.name === 'crud' && schema.mode === 'cards')
    ) {
      menus.push('|', {
        label: '配置成员渲染器',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  filterProps(props: any) {
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
      const mockedData: any = {
        id: 666,
        title: '假数据',
        description: '假数据',
        a: '假数据',
        b: '假数据'
      };

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

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      schema.$$editor?.renderer.name === 'crud' &&
      renderer.name === 'cards'
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

registerEditorPlugin(CardsPlugin);
