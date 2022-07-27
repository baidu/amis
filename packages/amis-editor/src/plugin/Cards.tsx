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
  RendererInfoResolveEventContext,
  tipedLabel
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff, JSONPipeOut, repeatArray} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';

export class CardsPlugin extends BasePlugin {
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
      type: 'card2',
      className: 'm-b-none',
      body: [
        {
          type: 'container',
          body: [
            {
              type: 'tpl',
              tpl: '这是一个模板'
            }
          ]
        }
      ]
    }
  };
  previewSchema = {
    ...this.scaffold,
    className: 'text-left '
  };

  panelTitle = '卡片集';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isCRUDBody = ['crud', 'crud2'].includes(context.schema.type);

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('switch', {
                label: '可多选',
                name: 'multiple',
                visibleOn: `data.selectable`
              }),
              // getSchemaTpl('switch', {
              //   label: '可全选',
              //   name: 'checkAll',
              //   pipeIn: defaultValue(true),
              //   visibleOn: `data.selectable && data.multiple`
              // }),
              {
                name: 'placeholder',
                value: '暂无数据',
                type: 'input-text',
                label: '占位内容'
              }
            ]
          },
          {
            title: '数据',
            hidden: isCRUDBody,
            body: [
              {
                name: 'source',
                type: 'input-text',
                label: tipedLabel('数据', '可绑定当前页面数据'),
                pipeIn: defaultValue('${items}')
                // visible: !isCRUDBody
              },
              {
                name: 'valueField',
                type: 'input-text',
                label: '值字段'
                // visible: isInForm && !isCRUDBody
              }
            ]
          },
          getSchemaTpl('status', {
            isFormItem: false
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '布局',
            body: [
              {
                type: 'button-group-select',
                name: 'masonryLayout',
                label: '模式',
                pipeIn: defaultValue(false),
                options: [
                  {label: '瀑布', value: true},
                  {label: '流式', value: false}
                ]
              },
              {
                name: 'columnsCount',
                type: 'input-range',
                pipeIn: defaultValue(4),
                min: 0,
                max: 12,
                step: 1,
                label: tipedLabel(
                  '每行显示个数',
                  '不设置时，由卡片 CSS 类名决定'
                )
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'itemsClassName',
                label: '内容'
              }),
              getSchemaTpl('className', {
                pipeIn: defaultValue(
                  'Grid-col--sm6 Grid-col--md4 Grid-col--lg3'
                ),
                name: 'itemClassName',
                label: '卡片'
              })
            ]
          })
        ])
      },
      {
        title: '事件',
        className: 'p-none',
        body: [
          getSchemaTpl('eventControl', {
            name: 'onEvent',
            ...getEventControlConfig(this.manager, context)
          })
        ]
      }
    ]);
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
    let value = Array.isArray(props.value)
      ? props.value
      : typeof props.source === 'string'
      ? resolveVariable(props.source, data)
      : resolveVariable('items', data);

    value = !Array.isArray(value) ? [] : value;

    if (value.length < 5) {
      const mockedData: any = value.length
        ? value[0]
        : {
            id: 666,
            title: '假数据',
            description: '假数据',
            a: '假数据',
            b: '假数据'
          };

      value = value.concat(
        repeatArray(mockedData, 3).map((item, index) => ({
          ...item,
          id: index + 1
        }))
      );
    }

    value = value.slice(0, 4);

    return {
      ...props,
      value
    };
  }

  overrides = {
    renderCard(this: any, index: number, card: any, ...rest: any[]) {
      return this.super(
        index,
        // 使第一个卡片元素可以选择并编辑schema
        index > 0 ? JSONPipeOut(card) : card,
        ...rest
      );
    }
  };

  getRendererInfo(
    context: RendererInfoResolveEventContext
  ): BasicRendererInfo | void {
    const plugin: PluginInterface = this;
    const {renderer, schema} = context;
    if (
      !schema.$$id &&
      ['crud', 'crud2'].includes(schema.$$editor?.renderer.name) &&
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
