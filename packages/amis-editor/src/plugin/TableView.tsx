/**
 * @file table view 组件的可视化编辑
 */

import React from 'react';
import {PluginInterface, registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicPanelItem,
  BasicToolbarItem,
  BuildPanelEventContext,
  RegionConfig,
  RendererInfo,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {VRenderer} from 'amis-editor-core';
import type {TableViewSchema} from 'amis/lib/renderers/TableView';
import {JSONGetById} from 'amis-editor-core';
import {TableViewEditor} from '../component/TableViewEditor';

/**
 * 尚未实现的功能：
 * * 按列删除，需要将一些 colspan 减一
 * * 水平/垂直拆分单元格，增加周围节点的 colspan 和 rowspan
 */

// td 节点模板
const TD_TEMPLATE = {
  body: {
    type: 'tpl',
    tpl: '---'
  }
} as {body: {type: 'tpl'}};

/**
 * 遍历表格，算出每个单元格在最终渲染时的实际行和列，后续许多操作都需要以这个作为依据
 * 比如插入列的时候，不能根据单元格在数组的位置，而是要根据单元格实际渲染时所属列
 */
function getCellRealPosition(table: TableViewSchema) {
  if (!table) {
    return {
      trs: []
    };
  }
  // 记录有哪些行列被合并了，这样后续计算的时候就要跳过这些行列
  const spannedCell: boolean[][] = [];
  const trs = table.trs || [];

  let currentRow = 0; // 当前渲染的实际行
  for (const tr of trs) {
    const tds = tr.tds || [];

    let currentCol = 0; // 当前渲染的实际列
    for (const td of tds) {
      // 跳过被合并的行
      while (spannedCell[currentRow] && spannedCell[currentRow][currentCol]) {
        currentCol = currentCol + 1;
      }
      const rowspan = td.rowspan || 1;
      const colspan = td.colspan || 1;
      // 标记后续行合并情况
      if (rowspan > 1 || colspan > 1) {
        for (let i = 0; i < rowspan; i++) {
          const spanRow = currentRow + i;
          if (!spannedCell[spanRow]) {
            spannedCell[spanRow] = [];
          }
          for (let j = 0; j < colspan; j++) {
            const spanCol = currentCol + j;
            spannedCell[spanRow][spanCol] = true;
          }
        }
      }
      (td as any).$$row = currentRow;
      (td as any).$$col = currentCol;
      currentCol = currentCol + 1;
    }

    currentRow = currentRow + 1;
  }
  return table;
}

export class TableViewPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'table-view';
  $schema = '/schemas/TableViewSchema.json';

  // 组件名称
  name = '表格视图';
  isBaseComponent = true;
  icon = 'fa fa-columns';
  pluginIcon = 'table-view-plugin';
  description = '表格类型的展现';
  docLink = '/amis/zh-CN/components/table-view';
  tags = ['容器'];
  scaffold = {
    type: 'table-view',
    trs: [
      {
        background: '#F7F7F7',
        tds: [
          {
            body: {
              type: 'tpl',
              tpl: '地区'
            }
          },
          {
            body: {
              type: 'tpl',
              tpl: '城市'
            }
          },
          {
            body: {
              type: 'tpl',
              tpl: '销量'
            }
          }
        ]
      },
      {
        tds: [
          {
            rowspan: 2,
            body: {
              type: 'tpl',
              tpl: '华北'
            }
          },
          {
            body: {
              type: 'tpl',
              tpl: '北京'
            }
          },
          {
            body: {
              type: 'tpl',
              tpl: '${beijing}'
            }
          }
        ]
      },
      {
        tds: [
          {
            body: {
              type: 'tpl',
              tpl: '天津'
            }
          },
          {
            body: {
              type: 'tpl',
              tpl: '${tianjing}'
            }
          }
        ]
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
      renderMethod: 'renderTdBody',
      preferTag: '展示'
    }
  ];

  panelTitle = '表格视图';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        className: 'p-none',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  label: '标题',
                  name: 'caption',
                  type: 'input-text'
                },
                {
                  label: '标题位置',
                  name: 'captionSide',
                  type: 'button-group-select',
                  size: 'sm',
                  mode: 'row',
                  className: 'ae-buttonGroupSelect--justify',
                  visibleOn: 'this.caption',
                  options: [
                    {label: '顶部', value: 'top'},
                    {label: '底部', value: 'bottom'}
                  ]
                },
                {
                  type: 'input-text',
                  label: '视图宽度',
                  name: 'width',
                  clearable: true
                },
                {
                  type: 'input-text',
                  label: '单元格默认内间距',
                  name: 'padding',
                  clearable: true
                },
                {
                  label: '显示边框',
                  name: 'border',
                  type: 'switch',
                  mode: 'row',
                  inputClassName: 'inline-flex justify-between flex-row-reverse'
                },
                {
                  label: '边框颜色',
                  type: 'input-color',
                  name: 'borderColor',
                  visibleOn: 'this.border',
                  pipeIn: defaultValue('#eceff8')
                }
              ]
            }
          ])
        ]
      },
      {
        title: '外观',
        className: 'p-none',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common'),
          {
            title: 'CSS 类名',
            body: [getSchemaTpl('className')]
          }
        ])
      },
      {
        title: '状态',
        body: [getSchemaTpl('visible')]
      }
    ])
  ];

  fieldWrapperResolve = (dom: HTMLElement) => dom;

  overrides = {
    renderTd(this: any, td: any, colIndex: number, rowIndex: number) {
      const dom = this.super(td, colIndex, rowIndex);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !td.$$id) {
        return dom;
      }

      const plugin = info.plugin as TableViewPlugin;
      const id = td.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          key={id}
          $schema="/schemas/TdObject.json"
          hostId={info.id}
          memberIndex={colIndex} // TODO: colIndex 其实不对，需要增加 schema filter 功能来让插件能
          name={`${`单元格 ${rowIndex + 1},${colIndex + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/td`}
          path={`${this.props.$path}/tr/${rowIndex}/td/${colIndex}`}
          data={this.props.data}
          children={dom}
        />
      );
    },
    renderTr(this: any, tr: any, rowIndex: number) {
      const dom = this.super(tr, rowIndex);
      const info: RendererInfo = this.props.$$editor;

      if (!info || !tr.$$id) {
        return dom;
      }

      const plugin = info.plugin as TableViewPlugin;
      const id = tr.$$id;
      return (
        <VRenderer
          type={info.type}
          plugin={info.plugin}
          renderer={info.renderer}
          key={id}
          $schema="/schemas/TrObject.json"
          hostId={info.id}
          memberIndex={rowIndex}
          name={`${`行 ${rowIndex + 1}`}`}
          id={id}
          draggable={false}
          wrapperResolve={plugin.fieldWrapperResolve}
          schemaPath={`${info.schemaPath}/tr`}
          path={`${this.props.$path}/tr/${rowIndex}`}
          data={this.props.data}
          children={dom}
        />
      );
    }
  };

  tdVRendererConfig: VRendererConfig = {
    panelTitle: '单元格',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: '属性',
            className: 'p-none',
            body: [
              getSchemaTpl('collapseGroup', [
                {
                  title: '显示',
                  body: [
                    {
                      label: '背景色',
                      type: 'input-color',
                      name: 'background'
                    },
                    {
                      label: '文字颜色',
                      type: 'input-color',
                      name: 'color'
                    },
                    {
                      label: '文字加粗',
                      name: 'bold',
                      type: 'switch',
                      mode: 'row',
                      inputClassName:
                        'inline-flex justify-between flex-row-reverse'
                    }
                  ]
                },
                {
                  title: '布局',
                  body: [
                    {
                      type: 'input-text',
                      label: '单元格宽度',
                      name: 'width',
                      clearable: true
                    },
                    {
                      type: 'input-number',
                      name: 'padding',
                      label: '单元格内边距'
                    },
                    {
                      label: '水平对齐',
                      name: 'align',
                      type: 'button-group-select',
                      size: 'sm',
                      mode: 'row',
                      className: 'ae-buttonGroupSelect--justify',
                      options: [
                        {
                          label: '',
                          value: 'left',
                          icon: 'fa fa-align-left'
                        },
                        {
                          label: '',
                          value: 'center',
                          icon: 'fa fa-align-center'
                        },
                        {
                          label: '',
                          value: 'right',
                          icon: 'fa fa-align-right'
                        },
                        {
                          label: '',
                          value: 'justify',
                          icon: 'fa fa-align-justify'
                        }
                      ]
                    },
                    {
                      label: '垂直对齐',
                      name: 'valign',
                      type: 'button-group-select',
                      size: 'sm',
                      mode: 'row',
                      className: 'ae-buttonGroupSelect--justify',
                      options: [
                        {
                          label: '顶部',
                          value: 'top'
                        },
                        {
                          label: '居中',
                          value: 'middle'
                        },
                        {
                          label: '底部',
                          value: 'bottom'
                        },
                        {
                          label: '基线对齐',
                          value: 'baseline'
                        }
                      ]
                    },
                    {
                      type: 'input-number',
                      name: 'colspan',
                      label: '水平合并列数'
                    },
                    {
                      type: 'input-number',
                      name: 'rowspan',
                      label: '垂直合并列数'
                    }
                  ]
                }
              ])
            ]
          },
          {
            title: '外观',
            className: 'p-none',
            body: getSchemaTpl('collapseGroup', getSchemaTpl('style:common'))
          }
        ])
      ];
    }
  };

  trVRendererConfig: VRendererConfig = {
    panelTitle: ' 行',
    panelBodyCreator: (context: BaseEventContext) => {
      return [
        getSchemaTpl('tabs', [
          {
            title: '属性',
            body: [
              {
                label: '行高度',
                type: 'input-number',
                name: 'height'
              },
              {
                label: '行背景色',
                type: 'input-color',
                name: 'background'
              }
            ]
          },
          {
            title: '外观',
            className: 'p-none',
            body: getSchemaTpl('collapseGroup', getSchemaTpl('style:common'))
          }
        ])
      ];
    }
  };

  renderRenderer(props: any) {
    const $$editor = props.$$editor;
    const renderer = $$editor.renderer;
    const schema = props.$schema;
    getCellRealPosition(schema);
    return (
      <TableViewEditor schema={schema} manager={this.manager}>
        <renderer.component {...props} />
      </TableViewEditor>
    );
  }

  // 根据路径判断是选中单元格还是行
  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    super.buildEditorPanel(context, panels);
    const plugin: PluginInterface = this;
    const store = this.manager.store;

    if (context.info.schemaPath.endsWith('/td')) {
      panels.push({
        key: 'td',
        order: 100,
        icon: this.tdVRendererConfig.panelIcon || 'fa fa-tablet',
        pluginIcon: plugin.pluginIcon,
        title: this.tdVRendererConfig.panelTitle || '格子',
        render: this.manager.makeSchemaFormRender({
          controls: this.tdVRendererConfig.panelControlsCreator
            ? this.tdVRendererConfig.panelControlsCreator(context)
            : this.tdVRendererConfig.panelControls!,
          body: this.tdVRendererConfig.panelBodyCreator
            ? this.tdVRendererConfig.panelBodyCreator(context)
            : this.tdVRendererConfig.panelBody!,
          panelById: store.activeId
        })
      });
    } else if (context.info.schemaPath.endsWith('/tr')) {
      panels.push({
        key: 'tr',
        order: 100,
        icon: this.trVRendererConfig.panelIcon || 'fa fa-tablet',
        title: this.trVRendererConfig.panelTitle || '格子',
        render: this.manager.makeSchemaFormRender({
          controls: this.trVRendererConfig.panelControlsCreator
            ? this.trVRendererConfig.panelControlsCreator(context)
            : this.trVRendererConfig.panelControls!,
          body: this.trVRendererConfig.panelBodyCreator
            ? this.trVRendererConfig.panelBodyCreator(context)
            : this.trVRendererConfig.panelBody!,
          panelById: store.activeId
        })
      });
    }
  }

  /**
   * 插入行，需要处理前面有 rowspan 的情况
   *
   *   +---+---+---+
   *   | a | b | c |
   *   +   +---+---+
   *   |   | d | e |
   *   +   +---+---+
   *   |   | f | g |
   *   +---+---+---+
   *
   * 比如在 d 位置的前面插入行，需要将 a 的 rowspan 加一，然后再插入两个单元格
   */
  insertRow(tdId: string, position: 'above' | 'below') {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);

    const td = JSONGetById(table, tdId);

    if (!td) {
      console.warn('找不到对应的 td id');
      return;
    }

    let insertRow = td.$$row;
    if (position === 'below') {
      insertRow = insertRow + 1;
    }

    // 通过第一行来确认表格一共多少列
    const firstRow = table.trs[0];
    const firstRowLastTd = firstRow.tds[firstRow.tds.length - 1];
    if (!firstRowLastTd) {
      console.warn('第一列没内容');
      return;
    }
    let colSize = firstRowLastTd.$$col + (firstRowLastTd.colspan || 1);
    let insertIndex = table.trs.length;
    for (let trIndex = 0; trIndex < table.trs.length; trIndex++) {
      for (const td of table.trs[trIndex].tds || []) {
        const tdRow = td.$$row;
        const rowspan = td.rowspan || 1;
        const colspan = td.colspan || 1;
        // 如果覆盖到要插入的行，则增加 rowspan，并在这个插入的行中减去对应
        if (rowspan > 1) {
          const isOverlapping = tdRow + rowspan > insertRow;
          if (isOverlapping) {
            td.rowspan = rowspan + 1;
            colSize = colSize - colspan;
          }
        }
        if (tdRow === insertRow) {
          insertIndex = trIndex;
          break;
        }
      }
    }

    const insertTds = [];
    for (let i = 0; i < colSize; i++) {
      insertTds.push(TD_TEMPLATE);
    }
    table.trs.splice(insertIndex, 0, {tds: insertTds});
    this.manager.store.changeValueById(tableId, table);
  }

  /**
   * 插入列
   *
   *		+---+---+---+
   *		| a     | b |
   *		+       +---+
   *		|       | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * 比如在 c 位置左侧插入列，应该将 a 的 colspan 加一，然后在最后一行增加一个单元格
   */
  insertCol(tdId: string, position: 'left' | 'right') {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);
    const td = JSONGetById(table, tdId);
    if (!td) {
      console.warn('找不到对应的 td id');
      return;
    }

    let insertCol = td.$$col;
    if (position === 'right') {
      insertCol = insertCol + 1;
    }

    for (const tr of table.trs || []) {
      const tds = tr.tds || [];
      let isInserted = false;
      for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
        const td = tds[tdIndex];
        const tdColspan = td.colspan || 1;
        const tdCol = td.$$col;
        // 如果要插入的行被覆盖了，则对节点加一并跳过插入
        if (tdColspan > 1) {
          const isOverlapping = tdCol + tdColspan > insertCol;
          if (isOverlapping) {
            td.colspan = tdColspan + 1;
            isInserted = true;
            break;
          }
        }
        if (insertCol <= tdCol) {
          tds.splice(tdIndex, 0, TD_TEMPLATE);
          isInserted = true;
          break;
        }
      }
      // 如果没找到对应的节点，那可能是插入到最后一条或者这一列节点数量不够，此时就要插入到最后
      if (!isInserted) {
        tds.push(TD_TEMPLATE);
      }
    }
    this.manager.store.changeValueById(tableId, table);
  }

  /**
   * 拆分有跨行或跨列的单元格
   *
   *		+---+---+---+
   *		| a     | b |
   *		+       +---+
   *		|       | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * 比如拆分 a，最后要变成
   *
   *		+---+---+---+
   *		| a | g | b |
   *		+---+---+---+
   *		| h | i | c |
   *		+---+---+---+
   *		| d | e | f |
   *		+---+---+---+
   *
   * 因此要新增 g、h、i 三个单元格
   */
  splitCell(tdId: string) {
    const store = this.manager.store;
    const paths = store.getNodePathById(tdId);
    const tableId = paths[paths.length - 3].id;
    const table = store.getSchema(tableId);
    getCellRealPosition(table);
    const td = JSONGetById(table, tdId);
    if (!td) {
      console.warn('找不到对应的 td id');
      return;
    }

    const rowspan = td.rowspan || 1;
    const colspan = td.colspan || 1;

    // 将这个单元格的跨行和跨列都设置为 1
    td.colspan = 1;
    td.rowspan = 1;

    // 算出需要补充哪些单元格及位置
    const tdRow = td.$$row;
    const tdCol = td.$$col;
    const insertTds = [];
    for (var i = 0; i < rowspan; i++) {
      for (var j = 0; j < colspan; j++) {
        // 跳过第一个，也就是这个单元格自己的位置
        if (i === 0 && j === 0) {
          continue;
        }
        insertTds.push({row: tdRow + i, col: tdCol + j});
      }
    }

    // 需要将列大的放前面，主要是因为后面需要反向遍历才能动态删数据
    insertTds.sort((a: any, b: any) => {
      return b.col - a.col;
    });

    for (const tr of table.trs) {
      for (let tdIndex = 0; tdIndex < tr.tds.length; tdIndex++) {
        const td = tr.tds[tdIndex];
        const currentRow = td.$$row;
        const currentCol = td.$$col;
        let insertIndex = insertTds.length;
        while (insertIndex--) {
          const insertTd = insertTds[insertIndex];
          if (currentRow === insertTd.row) {
            if (insertTd.col <= currentCol) {
              tr.tds.splice(tdIndex, 0, TD_TEMPLATE);
            } else {
              tr.tds.push(TD_TEMPLATE);
            }
            insertTds.splice(insertIndex, 1);
          }
        }
      }
    }

    // 如果前面有单元格找不到位置，那意味着是下面这种情况，这个单元格跨两行且是最后一行
    // 这时 table.tr 其实只有一行数据，需要在添加一行数据
    // 	+---+---+
    // 	| a     |
    // 	+       +
    // 	|       |
    // 	+---+---+
    if (insertTds.length) {
      const newTds = [];
      for (var i = 0; i < insertTds.length; i++) {
        newTds.push(TD_TEMPLATE);
      }
      table.trs.push({tds: newTds});
    }

    this.manager.store.changeValueById(tableId, table);
  }

  buildEditorToolbar(
    {schema, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.schemaPath.endsWith('/td')) {
      const tdId = schema.$$id;
      toolbars.push({
        icon: 'fa fa-chevron-left',
        order: 100,
        tooltip: '左侧新增列',
        onClick: () => {
          this.insertCol(tdId, 'left');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-down',
        order: 100,
        tooltip: '下方新增行',
        onClick: () => {
          this.insertRow(tdId, 'below');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-up',
        order: 100,
        tooltip: '上方新增行',
        onClick: () => {
          this.insertRow(tdId, 'above');
        }
      });
      toolbars.push({
        icon: 'fa fa-chevron-right',
        order: 100,
        tooltip: '右侧新增列',
        onClick: () => {
          this.insertCol(tdId, 'right');
        }
      });
      const colspan = schema.colspan || 1;
      const rowspan = schema.rowspan || 1;
      if (colspan > 1 || rowspan > 1) {
        toolbars.push({
          icon: 'fa fa-columns',
          order: 100,
          tooltip: '拆分单元格',
          onClick: () => {
            this.splitCell(tdId);
          }
        });
      }
    }
  }
}

registerEditorPlugin(TableViewPlugin);
