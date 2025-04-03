import {
  registerEditorPlugin,
  RendererInfoResolveEventContext
} from 'amis-editor-core';
import {
  BasePlugin,
  BaseEventContext,
  BasicPanelItem,
  PluginEvent,
  DragEventContext,
  ChangeEventContext,
  ReplaceEventContext,
  BuildPanelEventContext,
  ContextMenuEventContext,
  ContextMenuItem,
  PluginInterface
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import find from 'lodash/find';
import {JSONDelete, JSONPipeIn, JSONUpdate} from 'amis-editor-core';
import {NO_SUPPORT_STATIC_FORMITEM_CMPTS} from '../../renderer/event-control/constants';
import {
  isExpression,
  resolveVariableAndFilter,
  getRendererByName
} from 'amis-core';

export class ItemPlugin extends BasePlugin {
  static id = 'ItemPlugin';
  // panelTitle = '表单项通配';
  panelTitle = '表单项';
  order = -990;
  pluginIcon = 'form-plugin';

  afterResolveEditorInfo(event: PluginEvent<RendererInfoResolveEventContext>) {
    if (event.data && event.context.renderer.isFormItem) {
      // 给表单项目 label， description 添加快速内联编辑功能
      let inlineEditableElements =
        event.data.inlineEditableElements?.concat() || [];

      inlineEditableElements.push(
        {
          match: '.cxd-Form-label',
          key: 'label'
        },
        {
          match: '.cxd-Form-description',
          key: 'description'
        }
      );

      event.setData({
        ...event.data,
        inlineEditableElements
      });
    }
  }

  buildEditorPanel(
    context: BuildPanelEventContext,
    panels: Array<BasicPanelItem>
  ) {
    const thisPlugin: PluginInterface = this;
    const renderer = context.info.renderer;
    const store = this.manager.store;

    if (context.selections.length) {
      return;
    }
    const plugin = context.info.plugin;
    // 如果是表单项
    if (
      !context.info.hostId &&
      renderer?.isFormItem &&
      !plugin?.notRenderFormZone
    ) {
      panels.push({
        key: 'form-item',
        icon: 'fa fa-desktop',
        pluginIcon: thisPlugin.pluginIcon,
        title: this.panelTitle,
        render: this.manager.makeSchemaFormRender({
          body: this.panelBodyCreator(context),
          panelById: store.activeId,
          formKey: 'form-item'
        }),
        order: -200
      });
    }
  }
  panelBodyCreator = (context: BaseEventContext) => {
    const type = context.schema.type || '';
    const render = getRendererByName(type);
    // 支持静态表单项条件：是表单项组件，切不在不支持静态列表组件中
    const supportStatic =
      !!render?.isFormItem && !NO_SUPPORT_STATIC_FORMITEM_CMPTS.includes(type);
    const ignoreName = ~['button', 'submit', 'reset'].indexOf(type);
    const notRequiredName = ~[
      'button-toobar',
      'container',
      'fieldSet',
      'group',
      'grid',
      'hbox',
      'input-group',
      'panel',
      'service',
      'tabs',
      'table',
      'elevator',
      'static'
    ].indexOf(type);
    const hasReadOnly = ~[
      'switch',
      'wizard',
      'diff-editor',
      'editor',
      'input-rating',
      'input-text',
      'textarea'
    ].indexOf(type);
    /** 不支持配置校验属性的组件 */
    const ignoreValidator = !!~['input-group'].indexOf(type);
    const renderer: any = context.info.renderer;
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            getSchemaTpl('layout:originPosition', {value: 'left-top'}),
            ignoreName
              ? null
              : getSchemaTpl('formItemName', {
                  required: notRequiredName ? false : true
                }),
            renderer.renderLabel !== false ? getSchemaTpl('label') : null,
            hasReadOnly
              ? getSchemaTpl('switch', {
                  name: 'readOnly',
                  label: '只读模式'
                })
              : null,
            getSchemaTpl('disabled'),
            ignoreValidator ? null : getSchemaTpl('required'),
            getSchemaTpl('description'),
            getSchemaTpl('placeholder'),
            getSchemaTpl('remark', {
              mode: 'row'
            }),
            renderer.renderLabel !== false
              ? getSchemaTpl('labelRemark', {
                  mode: 'row'
                })
              : null
          ]
        },

        {
          title: '外观',
          body: [
            getSchemaTpl('formItemMode'),
            getSchemaTpl('horizontalMode'),
            getSchemaTpl('horizontal', {
              label: '',
              visibleOn:
                'this.mode == "horizontal" && this.label !== false && this.horizontal'
            }),

            renderer.sizeMutable !== false
              ? getSchemaTpl('formItemSize', {
                  options: [
                    {
                      label: '小',
                      value: 'sm'
                    },

                    {
                      label: '中',
                      value: 'md'
                    },

                    {
                      label: '大',
                      value: 'lg'
                    },
                    {
                      label: '默认（占满）',
                      value: 'full'
                    }
                  ]
                })
              : null,
            getSchemaTpl('formItemInline'),

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              label: 'Label CSS 类名',
              name: 'labelClassName'
            }),
            getSchemaTpl('className', {
              label: '控件 CSS 类名',
              name: 'inputClassName'
            }),
            getSchemaTpl('className', {
              label: '描述 CSS 类名',
              name: 'descriptionClassName',
              visibleOn: 'this.description'
            }),
            ...(!supportStatic
              ? []
              : [
                  getSchemaTpl('className', {
                    label: '静态 CSS 类名',
                    name: 'staticClassName'
                  })
                ])
          ]
        },

        {
          title: '显隐',
          body: [
            getSchemaTpl('visible'),
            supportStatic ? getSchemaTpl('static') : null,
            getSchemaTpl('switch', {
              name: 'clearValueOnHidden',
              label: '隐藏时删除表单项值'
            })
          ]
        },
        ignoreValidator
          ? null
          : {
              title: '验证',
              body: [
                // getSchemaTplByName('ref'),
                getSchemaTpl('validations'),
                getSchemaTpl('validationErrors'),
                getSchemaTpl('validateOnChange'),
                getSchemaTpl('submitOnChange'),
                getSchemaTpl('apiControl', {
                  name: 'validateApi',
                  label: '校验接口',
                  description: '单独校验这个表单项的接口'
                })
              ]
            }
      ])
    ];
  };

  afterUpdate(event: PluginEvent<ChangeEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.isFormItem &&
      context.diff?.some(change => change.path?.join('.') === 'value')
    ) {
      let value = context.value.value;
      const component = context.node?.getComponent();

      if (typeof value === 'string' && isExpression(value)) {
        const data = component?.props.data || {};
        value = resolveVariableAndFilter(value, data, '| raw');
      }
      component?.props.onChange(value);
    }
  }

  beforeReplace(event: PluginEvent<ReplaceEventContext>) {
    const context = event.context;

    if (
      context.info.renderer.isFormItem &&
      context.data &&
      context.subRenderer &&
      !~context.subRenderer.tags!.indexOf('表单项') &&
      ~context.subRenderer.tags!.indexOf('展示')
    ) {
      context.data = {
        ...context.data,
        type: `static-${context.data.type}`,
        label: context.data.label || context.schema.label,
        name: context.data.name || context.schema.name
      };
    }

    // 替换字段的时候保留 name
    if (context.schema) {
      context.data.name = context.schema.name || context.data.name;
    }
  }

  buildEditorContextMenu(
    {id, schema, region, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (this.manager.store.toolbarMode === 'mini') {
      return;
    }
    if (!selections.length || selections.length > 3) {
      // 单选或者超过3个选中态时直接返回
      return;
    }

    const arr = selections.concat();
    const first = arr.shift()!;
    const parent = first.node.parent;

    // 不在一个父节点，或者当前有非表单项，则直接跳过
    if (
      arr.some(
        elem => elem.node.parent !== parent || !elem.info.renderer?.isFormItem
      )
    ) {
      // 备注：isFormItem在amis注册渲染器时生成，所有表单类渲染器isFormItem为true
      return;
    }

    menus.unshift(
      {
        label: '合成一行',
        icon: 'merge-icon',
        onSelect: () => {
          const store = this.manager.store;
          const arr = selections.concat();
          const first = arr.shift()!;
          let schema = store.schema;

          const group = [
            {
              ...first.schema
            }
          ];

          // 让后面的 JSONPipeIn 去变一个 id
          // 因为 update 的时候，group 不会变 id
          // 不能两个 id 一样，这样点选就乱了。
          delete group[0].$$id;

          arr.forEach(elem => {
            group.push(elem.node.schema);
            schema = JSONDelete(schema, elem.id);
          });

          const curNewGroup = JSONPipeIn({
            type: 'group',
            body: group
          });
          schema = JSONUpdate(schema, first.id, curNewGroup, true);
          store.traceableSetSchema(schema);
          setTimeout(() => {
            // 合并成一行后自动选中父元素
            store.setActiveId(first.id);
          }, 40);
        }
      },
      '|'
    );
  }

  // beforeInsert(event: PluginEvent<InsertEventContext>) {
  //   const context = event.context;
  //   if (
  //     context.region === 'controls' &&
  //     Array.isArray(context.subRenderer?.tags) &&
  //     !~context.subRenderer!.tags!.indexOf('表单项') &&
  //     ~context.subRenderer!.tags!.indexOf('展示')
  //   ) {
  //     context.data = {
  //       ...context.data,
  //       type: `static-${context.data.type}`,
  //       label: context.data.label || context.subRenderer!.name,
  //       name: context.data.name || 'var1'
  //     };
  //   }
  // }
}

registerEditorPlugin(ItemPlugin);
