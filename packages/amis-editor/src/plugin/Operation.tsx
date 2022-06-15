import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  RegionConfig,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';

export class OperationPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'operation';
  $schema = '/schemas/OperationSchema.json';

  // 组件名称
  name = '操作栏';
  isBaseComponent = true;
  description = '操作栏，用于表格。';
  tags = ['展示'];
  icon = '';
  scaffold = {
    type: 'operation',
    label: '操作',
    buttons: [
      {
        label: '按钮',
        type: 'button'
      }
    ]
  };
  previewSchema = {
    type: 'tpl',
    tpl: '操作栏'
  };

  regions: Array<RegionConfig> = [
    {
      key: 'buttons',
      label: '按钮集',
      renderMethod: 'render',
      insertPosition: 'inner',
      preferTag: '按钮'
    }
  ];

  panelTitle = '操作栏';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('className', {
        name: 'innerClassName'
      }),

      {
        children: (
          <Button
            level="info"
            size="sm"
            className="m-b-sm"
            block
            onClick={() => {
              // this.manager.showInsertPanel('buttons', context.id, '按钮');
              this.manager.showRendererPanel(
                '按钮',
                '请从左侧组件面板中点击添加新的按钮'
              );
            }}
          >
            添加按钮
          </Button>
        )
      }
    ];
  };

  buildSubRenderers(
    context: RendererEventContext,
    renderers: Array<SubRendererInfo>
  ): BasicSubRenderInfo | Array<BasicSubRenderInfo> | void {
    if (
      context &&
      context.info &&
      context.info.renderer &&
      (context.info.renderer.name === 'table' ||
        context.info.renderer.name === 'crud')
    ) {
      return super.buildSubRenderers.apply(this, arguments);
    }
  }
}

registerEditorPlugin(OperationPlugin);
