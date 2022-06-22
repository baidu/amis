import {Button} from 'amis-ui';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  InsertEventContext,
  PluginEvent,
  RegionConfig,
  RendererInfo,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import flatten from 'lodash/flatten';
import {VRenderer} from 'amis-editor-core';

export class CardPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'card';
  $schema = '/schemas/CardSchema.json';

  // 组件名称
  name = '卡片';
  isBaseComponent = true;
  description = '展示单个卡片。';
  docLink = '/amis/zh-CN/components/card';
  tags = ['展示'];
  icon = '';
  pluginIcon = 'card-plugin';
  scaffold = {
    type: 'card',
    header: {
      title: '标题',
      subTitle: '副标题'
    },
    body: '内容',
    actions: [
      {
        type: 'button',
        label: '按钮',
        actionType: 'dialog',
        dialog: {
          title: '标题',
          body: '内容'
        }
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      renderMethod: 'renderBody',
      preferTag: '展示'
    },

    {
      key: 'actions',
      label: '按钮组',
      renderMethod: 'renderActions',
      wrapperResolve: (dom: HTMLElement) => dom,
      preferTag: '按钮'
    }
  ];

  panelTitle = '卡片';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: flatten([
            {
              children: (
                <Button
                  size="sm"
                  className="m-b-sm"
                  level="info"
                  block
                  onClick={() =>
                    // this.manager.showInsertPanel('actions', context.id)
                    this.manager.showRendererPanel(
                      '按钮',
                      '请从左侧组件面板中点击添加按钮元素'
                    )
                  }
                >
                  新增按钮
                </Button>
              )
            },
            {
              children: (
                <div>
                  <Button
                    block
                    level="primary"
                    size="sm"
                    onClick={() =>
                      // this.manager.showInsertPanel('body', context.id)
                      this.manager.showRendererPanel(
                        '展示',
                        '请从左侧组件面板中点击添加内容元素'
                      )
                    }
                  >
                    新增内容
                  </Button>
                </div>
              )
            },
            {
              type: 'divider'
            },
            {
              name: 'header.title',
              type: 'input-text',
              label: '标题',
              description: '支持模板语法如： <code>\\${xxx}</code>'
            },
            {
              name: 'header.subTitle',
              type: 'input-text',
              label: '副标题',
              description: '支持模板语法如： <code>\\${xxx}</code>'
            },
            {
              name: 'header.avatar',
              type: 'input-text',
              label: '图片地址',
              description: '支持模板语法如： <code>\\${xxx}</code>'
            },
            {
              name: 'header.desc',
              type: 'textarea',
              label: '描述',
              description: '支持模板语法如： <code>\\${xxx}</code>'
            },
            {
              name: 'header.highlight',
              type: 'input-text',
              label: '是否高亮表达式',
              description: '如： <code>this.isOwner</code>'
            }
          ])
        },
        {
          title: '外观',
          body: [
            {
              type: 'input-range',
              name: 'actionsCount',
              pipeIn: defaultValue(4),
              min: 1,
              max: 10,
              step: 1,
              label: '卡片一行最多能放按钮个数'
            },
            getSchemaTpl('className', {
              name: 'titleClassName',
              label: '标题 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'highlightClassName',
              label: '高亮 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'subTitleClassName',
              label: '副标题 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'descClassName',
              label: '描述 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'avatarClassName',
              label: '图片外层 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'imageClassName',
              label: '图片 CSS 类名'
            }),
            getSchemaTpl('className', {
              name: 'bodyClassName',
              label: '内容区 CSS 类名'
            }),
            getSchemaTpl('className')
          ]
        },
        {
          title: '显隐',
          body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
        }
      ])
    ];
  };

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/

  fieldWrapperResolve = (dom: HTMLElement) => dom;
  overrides = {
    renderFeild: function (
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

      const plugin = info.plugin as CardPlugin;
      const id = field.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          multifactor
          key={id}
          $schema="/schemas/CardBodyField.json"
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

registerEditorPlugin(CardPlugin);
