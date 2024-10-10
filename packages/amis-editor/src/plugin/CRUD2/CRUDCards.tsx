/**
 * @file CRUDCards.tsx
 * @desc 卡片模式的 CRUD2
 */

import React from 'react';
import {autobind} from 'amis';
import {
  EditorManager,
  JSONPipeIn,
  BuildPanelEventContext,
  registerEditorPlugin
} from 'amis-editor-core';
import {DSBuilderManager, DSFeatureEnum} from '../../builder';
import {Table2RenderereEvent, Table2RendererAction} from '../Table2';
import {BaseCRUDPlugin} from './BaseCRUD';

export class CRUDCardsPlugin extends BaseCRUDPlugin {
  static id = 'CardsCRUDPlugin';

  disabledRendererPlugin = true;

  name = '卡片列表';

  panelTitle: '卡片列表';

  icon = 'fa fa-window-maximize';

  panelIcon = 'fa fa-table';

  subPanelIcon = 'fa fa-table';

  pluginIcon = 'cards-plugin';

  panelJustify = true;

  multifactor = true;

  isBaseComponent = true;

  description =
    '围绕卡片列表的数据增删改查. 负责数据的拉取，分页，单条操作，批量操作，排序，快速编辑等等功能，集成查询条件。';

  order = -1000;

  $schema = '/schemas/CRUD2CardsSchema.json';

  docLink = '/amis/zh-CN/components/cards';

  previewSchema: Record<string, any> = this.generatePreviewSchema('cards');

  scaffold: any = this.generateScaffold('cards');

  constructor(manager: EditorManager) {
    super(manager, Table2RenderereEvent, Table2RendererAction);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** 非实体数据源走默认构建 */
  panelBodyCreator = (context: BuildPanelEventContext) => {
    /** 先写入动态控件 */
    this.dynamicControls = {
      /** 列配置 */
      columns: context => this.renderColumnsControl(context),
      /** 工具栏配置 */
      toolbar: context => this.renderToolbarCollapse(context),
      /** 搜索栏 */
      filters: context => this.renderFiltersCollapse(context)
    };

    return this.baseCRUDPanelBody(context);
  };

  @autobind
  renderColumnsControl(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      title: '列设置',
      order: 5,
      body: [
        {
          type: 'ae-crud-column-control',
          name: 'columns',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderToolbarCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);

    return {
      order: 20,
      title: '工具栏',
      body: [
        {
          type: 'ae-crud-toolbar-control',
          name: 'headerToolbar',
          nodeId: context.id,
          builder
        }
      ]
    };
  }

  @autobind
  renderFiltersCollapse(context: BuildPanelEventContext) {
    const builder = this.dsManager.getBuilderBySchema(context.node.schema);
    const collection: any[] = [];

    builder.features.forEach(feat => {
      if (/Query$/.test(feat)) {
        collection.push({
          type: 'ae-crud-filters-control',
          name:
            feat === DSFeatureEnum.SimpleQuery ||
            feat === DSFeatureEnum.AdvancedQuery
              ? 'filter'
              : feat === DSFeatureEnum.FuzzyQuery
              ? 'headerToolbar'
              : undefined,
          label:
            feat === DSFeatureEnum.SimpleQuery
              ? '简单查询'
              : feat === DSFeatureEnum.AdvancedQuery
              ? '高级查询'
              : '模糊查询',
          nodeId: context.id,
          feat: feat,
          builder
        });
      }
    });

    return collection.length > 0
      ? {
          order: 10,
          title: '搜索设置',
          body: collection
        }
      : undefined;
  }
}

// registerEditorPlugin(CRUDCardsPlugin);
