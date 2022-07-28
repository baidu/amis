import {registerEditorPlugin} from 'amis-editor-core';
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

export class ItemPlugin extends BasePlugin {
  // panelTitle = '表单项通配';
  panelTitle = '表单项';
  order = -990;
  pluginIcon = 'form-plugin';

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
          formKey: 'form-item',
        }),
        order: -200
      });
    }
  }
  panelBodyCreator = (context: BaseEventContext) => {
    const ignoreName = ~['button', 'submit', 'reset'].indexOf(
      context.schema.type
    );
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
    ].indexOf(context.schema.type);
    const hasReadOnly = ~[
      'switch',
      'wizard',
      'diff-editor',
      'editor',
      'input-rating',
      'input-text',
      'textarea'
    ].indexOf(context.schema.type);
    /** 不支持配置校验属性的组件 */
    const ignoreValidator = !!~['input-group'].indexOf(context.schema.type);
    const autoFillApi = context.schema.autoFillApi;
    const renderer: any = context.info.renderer;
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
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
            getSchemaTpl('switch', {
              name: 'disabled',
              label: '禁用',
              mode: 'horizontal',
              horizontal: {
                justify: true,
                left: 8
              },
              inputClassName: 'is-inline '
            }),
            ignoreValidator ? null : getSchemaTpl('required'),
            getSchemaTpl('description'),
            getSchemaTpl('placeholder'),
            getSchemaTpl('remark'),
            renderer.renderLabel !== false ? getSchemaTpl('labelRemark') : null,
            autoFillApi ? getSchemaTpl('autoFillApi') : null
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
                'data.mode == "horizontal" && data.label !== false && data.horizontal'
            }),

            renderer.sizeMutable !== false
              ? getSchemaTpl('formItemSize')
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
            })
          ]
        },

        {
          title: '显隐',
          body: [
            // TODO: 有些表单项没有 disabled
            getSchemaTpl('disabled'),
            getSchemaTpl('visible'),

            getSchemaTpl('switch', {
              name: 'clearValueOnHidden',
              label: '隐藏时删除表单项值',
              disabledOn: 'typeof this.visible === "boolean"'
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
                getSchemaTpl('api', {
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
      /\$/.test(context.info.renderer.name!) &&
      context.diff?.some(change => change.path?.join('.') === 'value')
    ) {
      const change: any = find(
        context.diff,
        change => change.path?.join('.') === 'value'
      )!;
      const component = this.manager.store
        .getNodeById(context.id)
        ?.getComponent();

      component?.props.onChange(change?.rhs);
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
