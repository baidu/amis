/**
 * @file CRUDTable.tsx
 * @desc 表格模式的 CRUD2
 */

import React from 'react';
import sortBy from 'lodash/sortBy';
import {autobind} from 'amis';
import {
  EditorManager,
  JSONPipeIn,
  BuildPanelEventContext,
  EditorNodeType,
  registerEditorPlugin
} from 'amis-editor-core';
import {
  DSBuilder,
  DSBuilderManager,
  DSFeatureEnum,
  DSFeatureType
} from '../../builder';
import {Table2RenderereEvent, Table2RendererAction} from '../Table2';
import {BaseCRUDPlugin} from './BaseCRUD';

export class CRUDTablePlugin extends BaseCRUDPlugin {
  static id = 'TableCRUDPlugin';

  panelJustify = true;

  multifactor = true;

  isBaseComponent = true;

  description =
    '用来实现对数据的增删改查，用来展示表格数据，可以配置列信息，然后关联数据便能完成展示。支持嵌套、超级表头、列固定、表头固顶、合并单元格等等。';

  order = -950;

  $schema = '/schemas/CRUD2TableSchema.json';

  docLink = '/amis/zh-CN/components/table2';

  previewSchema: Record<string, any> = this.generatePreviewSchema('table2');

  scaffold: any = this.generateScaffold('table2');

  constructor(manager: EditorManager) {
    super(manager, Table2RenderereEvent, Table2RendererAction);
    this.dsManager = new DSBuilderManager(manager);
  }

  /** 非实体数据源走默认构建 */
  panelBodyCreator = (context: BuildPanelEventContext) => {
    return this.baseCRUDPanelBody(context);
  };
}

registerEditorPlugin(CRUDTablePlugin);
