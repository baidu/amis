import React from 'react';
import {getI18nEnabled, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicRendererInfo,
  InsertEventContext,
  PluginEvent,
  RegionConfig,
  RendererInfo,
  RendererInfoResolveEventContext,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {VRenderer} from 'amis-editor-core';

export class ListItemPlugin extends BasePlugin {
  static id = 'ListItemPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'list-item';
  isBaseComponent = true;
  $schema = '/schemas/AMISListItemSchema.json';

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      renderMethod: 'renderBody',
      preferTag: '展示'
    },
    {
      key: 'actions',
      label: '按钮集合',
      preferTag: '按钮',
      renderMethod: 'renderRight',
      insertPosition: 'inner'
    }
  ];

  panelTitle = '列表项';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '基本',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            name: 'title',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            label: '标题',
            descrition: '支持模板语法如： ${xxx}'
          },
          {
            name: 'subTitle',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            label: '副标题',
            descrition: '支持模板语法如： ${xxx}'
          },
          {
            name: 'avatar',
            type: 'input-text',
            label: '图片地址',
            descrition: '支持模板语法如： ${xxx}'
          },
          {
            name: 'desc',
            type: i18nEnabled ? 'textarea-i18n' : 'textarea',
            label: '描述',
            descrition: '支持模板语法如： ${xxx}'
          }
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('className', {
            name: 'avatarClassName',
            label: '图片 CSS 类名',
            pipeIn: defaultValue('thumb-sm avatar m-r')
          }),
          getSchemaTpl('className', {
            name: 'titleClassName',
            label: '标题 CSS 类名'
          })
        ]
      }
    ]);
  };

  getRendererInfo({
    renderer,
    schema
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    if (schema.$$id && this.rendererName === renderer.name) {
      // 复制部分信息出去
      return {
        name: this.panelTitle,
        regions: this.regions,
        // patchContainers: plugin.patchContainers,
        // // wrapper: plugin.wrapper,
        // vRendererConfig: plugin.vRendererConfig,
        // wrapperProps: plugin.wrapperProps,
        // wrapperResolve: plugin.wrapperResolve,
        // filterProps: plugin.filterProps,
        $schema: this.$schema
        // renderRenderer: plugin.renderRenderer
      };
    }
  }

  fieldWrapperResolve = (dom: HTMLElement) => dom;

  overrides = {
    renderField: function (
      this: any,
      region: string,
      field: any,
      index: any,
      props: any
    ) {
      const dom = this.super(region, field, index, props);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !field.$$id) {
        return dom;
      }

      const plugin = info.plugin as ListItemPlugin;
      const id = field.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          $schema="/schemas/AMISListBodyFieldSchema.json"
          hostId={info.id}
          memberIndex={index}
          name={`${`字段${index + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/body/${index}`}
          path={`${this.props.$path}/${index}`} // 好像没啥用
          data={this.props.data} // 好像没啥用
        >
          {dom}
        </VRenderer>
      );
    }
  };

  vRendererConfig: VRendererConfig = {
    panelTitle: '字段',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('label'),
        getSchemaTpl('className', {
          name: 'labelClassName',
          label: 'Label CSS 类名',
          visibleOn: 'this.label'
        })
        /*{
          children: (
            <Button
              size="sm"
              level="info"
              className="m-b"
              block
              onClick={this.exchangeRenderer.bind(this, context.id)}
            >
              更改渲染器类型
            </Button>
          )
        }*/
      ];
    }
  };

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/

  // 自动插入 label
  beforeInsert(event: PluginEvent<InsertEventContext>) {
    const context = event.context;

    if (
      (context.info.plugin === this ||
        context.node.sameIdChild?.info.plugin === this) &&
      context.region === 'body'
    ) {
      context.data = {
        ...context.data,
        label: context.data.label ?? context.subRenderer?.name ?? '列名称'
      };
    }
  }
}

registerEditorPlugin(ListItemPlugin);
