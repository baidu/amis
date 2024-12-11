import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  defaultValue,
  getSchemaTpl,
  diff,
  JSONPipeOut,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem
} from 'amis-editor-core';
import {schemaArrayFormat, schemaToArray} from '../util';

export class MappingPlugin extends BasePlugin {
  static id = 'MappingPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'mapping';
  $schema = '/schemas/MappingSchema.json';

  // 组件名称
  name = '映射';
  isBaseComponent = true;
  description =
    '对现有值做映射展示，比如原始值是：1、2、3...，需要展示成：下线、上线、过期等等。';
  docLink = '/amis/zh-CN/components/mapping';
  tags = ['展示'];
  icon = 'fa fa-exchange';
  pluginIcon = 'mapping-plugin';
  scaffold = {
    type: 'mapping',
    value: 1,
    map: {
      1: '开心',
      2: '愤怒',
      3: '伤心',
      4: '冷漠',
      '*': '一般'
    },
    itemSchema: {
      type: 'tag',
      label: '${item}'
    }
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '映射';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              id: 'properties-basic',
              body: [
                isUnderField
                  ? {
                      type: 'tpl',
                      inline: false,
                      className: 'text-info text-sm',
                      tpl: '<p>当前为字段内容节点配置，选择上层还有更多配置</p>'
                    }
                  : null,
                getSchemaTpl('mapSourceControl'),
                {
                  type: 'ae-switch-more',
                  mode: 'normal',
                  label: '自定义显示模板',
                  bulk: false,
                  name: 'itemSchema',
                  formType: 'extend',
                  defaultData: this.scaffold.itemSchema,
                  form: {
                    body: [
                      {
                        type: 'button',
                        level: 'primary',
                        size: 'sm',
                        block: true,
                        onClick: this.editDetail.bind(this, context.id),
                        label: '配置显示模板'
                      }
                    ]
                  },
                  pipeIn: (value: any) => {
                    return value !== undefined;
                  },
                  pipeOut: (value: any, originValue: any, data: any) => {
                    if (value === true) {
                      return {
                        type: 'tag',
                        label: `\${${this.getDisplayField(
                          data
                        )} | default: "-"}`
                      };
                    }
                    return value ? value : undefined;
                  }
                },
                getSchemaTpl('valueFormula', {
                  pipeOut: (value: any) => {
                    return value == null || value === '' ? undefined : value;
                  }
                }),
                getSchemaTpl('placeholder', {
                  pipeIn: defaultValue('-'),
                  label: '占位符'
                })
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
                })
              ]
            }
          ])
        }
      ])
    ];
  };

  getDisplayField(data: any) {
    if (
      data.source ||
      (data.map &&
        Array.isArray(data.map) &&
        data.map[0] &&
        Object.keys(data.map[0]).length > 1)
    ) {
      return data.labelField ?? 'label';
    }
    return 'item';
  }

  buildEditorToolbar(
    {id, info, schema}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'mapping') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置显示模板',
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
    if (info.renderer.name === 'mapping') {
      menus.push('|', {
        label: '配置显示模板',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = {
      type: 'tag',
      label: `\${${this.getDisplayField(value)}}`
    };

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置显示模板',
        value: schemaToArray(value.itemSchema ?? defaultItemSchema),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, itemSchema: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          [value.labelField || 'label']: '假数据',
          [value.valueField || 'value']: '假数据',
          item: '假数据'
        }
      });
  }
}

registerEditorPlugin(MappingPlugin);
