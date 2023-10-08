import React from 'react';
import {
  diff,
  getI18nEnabled,
  getVariables,
  registerEditorPlugin
} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  PluginEvent,
  PreventClickEventContext,
  RegionConfig,
  RendererInfo,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {mapReactElement} from 'amis-editor-core';
import {VRenderer} from 'amis-editor-core';
import findIndex from 'lodash/findIndex';
import cloneDeep from 'lodash/cloneDeep';
import {RegionWrapper as Region} from 'amis-editor-core';
import {BaseSchema, Tab, resolveVariableAndFilter} from 'amis';
import {tipedLabel} from 'amis-editor-core';
import {ValidatorTag} from '../validator';
import {
  getArgsWrapper,
  getEventControlConfig
} from '../renderer/event-control/helper';
import {schemaArrayFormat, schemaToArray} from '../util';
import {filter, keys, map, omit, reduce} from 'lodash';

export class TabsPlugin extends BasePlugin {
  static id = 'TabsPlugin';
  // 关联渲染器名字
  rendererName = 'tabs';
  $schema = '/schemas/TabsSchema.json';

  // 组件名称
  name = '选项卡';
  isBaseComponent = true;
  description = '选项卡，可以将内容分组用选项卡的形式展示，降低用户使用成本。';
  docLink = '/amis/zh-CN/components/tabs';
  tags = ['布局容器'];
  icon = 'fa fa-folder-o';
  pluginIcon = 'tabs-plugin';
  scaffold = {
    type: 'tabs',
    tabs: [
      {
        title: '选项卡1',
        body: '内容1'
      },
      {
        title: '选项卡2',
        body: '内容2'
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  notRenderFormZone = true;

  regions: Array<RegionConfig> = [
    {
      key: 'toolbar',
      label: '工具栏',
      preferTag: '展示'
    }
  ];

  panelTitle = '选项卡';

  events = [
    {
      eventName: 'change',
      eventLabel: '选项卡切换',
      description: '选项卡切换',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              title: '数据',
              properties: {
                value: {
                  type: 'string',
                  title: '选项卡索引'
                }
              }
            }
          }
        }
      ]
    }
  ];

  actions = [
    {
      actionType: 'changeActiveKey',
      actionLabel: '激活指定选项卡',
      description: '修改当前激活tab项的key',
      config: ['activeKey'],
      descDetail: (info: any) => {
        return (
          <div>
            激活第
            <span className="variable-left variable-right">
              {info?.args?.activeKey}
            </span>
            项
          </div>
        );
      },
      schema: getArgsWrapper(
        getSchemaTpl('formulaControl', {
          name: 'activeKey',
          label: '激活项',
          variables: '${variables}',
          size: 'lg',
          mode: 'horizontal'
        })
      )
    }
  ];

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isSubEditor =
      context.path?.indexOf('tabs') === 0 && this.manager.store?.schema?.isSlot;
    const isNewTabMode =
      'data.tabsMode !=="vertical" && data.tabsMode !=="sidebar" && data.tabsMode !=="chrome"';
    const i18nEnabled = getI18nEnabled();
    const that = this;

    async function getOptionVars() {
      let schema = that.manager.store.valueWithoutHiddenProps;
      let children = [];

      if (schema.tabs) {
        let optionItem = reduce(
          schema.tabs,
          function (result, item) {
            return {...result, ...item};
          },
          {}
        );
        delete optionItem?.id;

        let otherItem = map(
          keys(optionItem).filter(
            item => item === 'title' || item === 'body' || item === 'tab'
          ),
          item => ({
            label:
              item === 'title'
                ? '选项卡标题'
                : item === 'body' || item === 'tab'
                ? '选项卡内容'
                : item,
            value: item,
            tag: typeof optionItem[item]
          })
        );

        children.push(...otherItem);
      }

      let variablesArr = [
        {
          label: '选项字段',
          children
        }
      ];
      return variablesArr;
    }

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        visible: !isSubEditor,
        body: getSchemaTpl('collapseGroup', [
          {
            title: '关联数据',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              getSchemaTpl('tabsControl', {
                label: '选项卡',
                mode: 'normal',
                name: 'tabs',
                type: 'ae-tabsControl'
              })
            ]
          },
          {
            title: '选项卡',
            body: [
              {
                type: 'ae-switch-more',
                mode: 'normal',
                label: '可新增',
                hiddenOnDefault: false,
                bulk: true,
                name: 'addable',
                formType: 'extend',
                form: {
                  body: [
                    {
                      label: '按钮名称',
                      name: 'addBtnText',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      placeholder: '请输入新增按钮名称',
                      pipeIn: (value: any) => {
                        return typeof value !== 'string' ? 'Schema配置' : value;
                      },
                      pipeOut: (value: any) => {
                        return context.schema?.addBtnText;
                      }
                    },
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      visibleOn: !i18nEnabled,
                      style: {
                        margin: 'auto auto 12px auto'
                      },
                      name: 'addBtnText',
                      block: true,
                      onClick: this.editAddedBtn.bind(this, context),
                      label: '配置新增按钮名称模板'
                    },
                    {
                      type: 'button',
                      level: 'primary',
                      size: 'sm',
                      name: 'addBtnText',
                      block: true,
                      onClick: this.handleAddedSchema.bind(this, context),
                      label: '配置新增选项卡模板'
                    }
                  ]
                },
                pipeIn: (value: any) => {
                  return typeof value !== 'undefined';
                },
                pipeOut: (value: any) => {
                  return value;
                }
              },
              getSchemaTpl('switch', {
                name: 'closable',
                label: '可删除',
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              }),
              getSchemaTpl('switch', {
                name: 'draggable',
                label: tipedLabel('拖拽排序', '开启后可通过拖拽调整tab顺序'),
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              }),
              getSchemaTpl('switch', {
                name: 'editable',
                label: tipedLabel(
                  '快速编辑',
                  '标题为字符串时该配置生效，开启后双击标题可直接编辑'
                ),
                visibleOn: isNewTabMode,
                clearValueOnHidden: true
              }),
              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: tipedLabel(
                  '标题提示',
                  '鼠标移动到选项卡标题时弹出提示，适用于标题超长时进行完整提示'
                ),
                name: 'showTip',
                form: {
                  body: [
                    getSchemaTpl('textareaFormulaControl', {
                      name: 'tipSchema',
                      mode: 'normal',
                      label: tipedLabel(
                        '提示模板',
                        '自定义标题渲染模板，支持JSX、数据域变量使用'
                      ),
                      variables: getOptionVars,
                      requiredDataPropsVariables: true
                    })
                  ]
                }
              }
            ]
          },
          getSchemaTpl('status'),
          {
            title: '高级',
            body: [
              {
                label: tipedLabel(
                  '初始选项卡',
                  '组件初始化时激活的选项卡，优先级高于激活的选项卡，不可响应上下文数据，选项卡配置hash时使用hash，否则使用索引值，支持获取变量，如：<code>tab\\${id}</code>、<code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'defaultKey',
                placeholder: '初始默认激活的选项卡',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },
              {
                label: tipedLabel(
                  '激活的选项卡',
                  '默认显示某个选项卡，可响应上下文数据，选项卡配置hash时使用hash，否则使用索引值，支持获取变量，如：<code>tab\\${id}</code>、<code>\\${id}</code>'
                ),
                type: 'input-text',
                name: 'activeKey',
                placeholder: '默认激活的选项卡',
                pipeOut: (data: string) =>
                  data === '' || isNaN(Number(data)) ? data : Number(data)
              },
              {
                type: 'ae-switch-more',
                formType: 'extend',
                mode: 'normal',
                label: tipedLabel(
                  '超出折叠',
                  '折叠配置仅对PC端生效移动端不生效，移动端均为超出滚动切换'
                ),
                form: {
                  body: [
                    getSchemaTpl('formulaControl', {
                      label: '最大展示数量',
                      type: 'ae-formulaControl',
                      name: 'collapseOnExceed',
                      clearValueOnHidden: true,
                      require: true,
                      pipeOut: (data: string) =>
                        data === '' || isNaN(Number(data)) ? data : Number(data)
                    }),
                    {
                      label: '折叠按钮名称',
                      name: 'collapseBtnLabel',
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      placeholder: '请输入折叠按钮名称'
                    }
                  ]
                }
              },
              getSchemaTpl('switch', {
                name: 'swipeable',
                label: tipedLabel(
                  '选项滚动切换',
                  '选项滚动切换为移动端特有功能'
                )
              }),
              getSchemaTpl('switch', {
                name: 'mountOnEnter',
                label: tipedLabel(
                  '激活时渲染内容',
                  '只有激活选项卡时才进行内容渲染，提升渲染性能'
                )
              }),
              getSchemaTpl('switch', {
                name: 'unmountOnExit',
                label: tipedLabel(
                  '隐藏后销毁内容',
                  '激活其他选项卡时销毁当前内容，使其再次激活时内容可以重新渲染，适用于数据容器需要每次渲染实时获取数据的场景'
                )
              })
            ]
          }
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  name: 'tabsMode',
                  label: '样式',
                  type: 'select',
                  options: [
                    {
                      label: '默认',
                      value: ''
                    },
                    {
                      label: '线型',
                      value: 'line'
                    },
                    {
                      label: '简约',
                      value: 'simple'
                    },
                    {
                      label: '加强',
                      value: 'strong'
                    },
                    {
                      label: '卡片',
                      value: 'card'
                    },
                    {
                      label: '仿 Chrome',
                      value: 'chrome'
                    },
                    {
                      label: '水平铺满',
                      value: 'tiled'
                    },
                    {
                      label: '选择器',
                      value: 'radio'
                    },
                    {
                      label: '垂直',
                      value: 'vertical'
                    },
                    {
                      label: '侧边栏',
                      value: 'sidebar'
                    }
                  ],
                  pipeIn: defaultValue('')
                },

                getSchemaTpl('horizontal-align', {
                  label: '标题区位置',
                  name: 'sidePosition',
                  pipeIn: defaultValue('left'),
                  visibleOn: 'data.tabsMode === "sidebar"',
                  clearValueOnHidden: true
                })
              ]
            },
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'linksClassName',
                  label: '标题区'
                }),

                getSchemaTpl('className', {
                  name: 'toolbarClassName',
                  label: '工具栏'
                }),

                getSchemaTpl('className', {
                  name: 'contentClassName',
                  label: '内容区'
                }),

                getSchemaTpl('className', {
                  name: 'showTipClassName',
                  label: '提示',
                  visibleOn: 'data.showTip',
                  clearValueOnHidden: true
                })
              ]
            })
          ])
        ]
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

  patchContainers = ['tabs.body'];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区'
      }
    },
    panelTitle: '卡片',
    panelJustify: true,
    panelBodyCreator: (context: BaseEventContext) => {
      const i18nEnabled = getI18nEnabled();
      return getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  name: 'title',
                  label: '标题',
                  block: false,
                  visibleOn: i18nEnabled,
                  type: 'input-text',
                  required: true
                },
                {
                  name: 'title',
                  label: '标题',
                  block: false,
                  visibleOn: !i18nEnabled,
                  type: 'input-text',
                  required: true,
                  addOn: {
                    type: 'button',
                    name: 'title',
                    label: '配置',
                    block: false,
                    onClick: this.editTabTtile.bind(this, context)
                  }
                },
                {
                  label: tipedLabel(
                    '标题提示',
                    '当开启 showTip 时生效，若不配置默认值使用tab.title 作为提示显示'
                  ),
                  name: 'tip',
                  type: 'input-text'
                },
                {
                  label: tipedLabel(
                    'Hash',
                    '设置后，会同步更新地址栏的 Hash。'
                  ),
                  name: 'hash',
                  type: 'input-text'
                }
              ]
            },
            getSchemaTpl('status', {disabled: true}),
            {
              title: '高级',
              body: [
                getSchemaTpl('switch', {
                  name: 'reload',
                  label: tipedLabel(
                    '重新渲染',
                    '设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用。'
                  ),
                  clearValueOnHidden: true
                }),
                getSchemaTpl('switch', {
                  name: 'mountOnEnter',
                  label: tipedLabel(
                    '激活时才渲染',
                    '当选项卡选中后才渲染其内容区，可提高渲染性能。'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                }),

                getSchemaTpl('switch', {
                  name: 'unmountOnExit',
                  label: tipedLabel(
                    '隐藏即销毁',
                    '关闭选项卡则销毁其内容去，配置「激活时才渲染」选项可实现每次选中均重新加载的效果。'
                  ),
                  visibleOn: '!this.reload',
                  clearValueOnHidden: true
                })
              ]
            }
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
          ])
        }
      ]);
    }
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  tabWrapperResolve = (dom: HTMLElement) => dom.parentElement!;
  overrides = {
    renderTabs(this: any) {
      const dom = this.super();

      if (!this.renderTab && this.props.$$editor && dom) {
        const tabs = this.props.tabs;
        return mapReactElement(dom, item => {
          if (item.type === Tab && item.props.$$id) {
            const id = item.props.$$id;
            const index = findIndex(tabs, (tab: any) => tab.$$id === id);
            const info: RendererInfo = this.props.$$editor;
            const plugin: TabsPlugin = info.plugin as any;

            if (~index) {
              const region = plugin.vRendererConfig?.regions?.body;

              if (!region) {
                return item;
              }

              return React.cloneElement(item, {
                children: (
                  <VRenderer
                    key={id}
                    type={info.type}
                    plugin={info.plugin}
                    renderer={info.renderer}
                    $schema="/schemas/TabSchema.json"
                    hostId={info.id}
                    memberIndex={index}
                    name={`${item.props.title || `卡片${index + 1}`}`}
                    id={id}
                    draggable={false}
                    wrapperResolve={plugin.tabWrapperResolve}
                    schemaPath={`${info.schemaPath}/tabs/${index}`}
                    path={`${this.props.$path}/${index}`} // 好像没啥用
                    data={this.props.data} // 好像没啥用
                  >
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={item.props.children}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  </VRenderer>
                )
              });
            }
          }

          return item;
        });
      }

      return dom;
    }
  };

  /**
   * 补充切换的 toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === 'tabs' &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: '上个卡片',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex - 1);
          }
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: '下个卡片',
        onClick: () => {
          const control = node.getComponent();

          if (control?.switchTo) {
            const currentIndex = control.currentIndex();
            control.switchTo(currentIndex + 1);
          }
        }
      });
    }
  }

  onPreventClick(e: PluginEvent<PreventClickEventContext>) {
    const mouseEvent = e.context.data;

    if (mouseEvent.defaultPrevented) {
      return false;
    } else if (
      (mouseEvent.target as HTMLElement).closest('[role=tablist]>li')
    ) {
      return false;
    }

    return;
  }

  // 配置标题
  editTabTtile(context: BaseEventContext) {
    const {id, schema} = context;
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultItemSchema = value?.title
      ? typeof value.title === 'string'
        ? {
            type: 'tpl',
            tpl: value.title
          }
        : value?.title
      : {
          type: 'tpl',
          tpl: '请编辑内容'
        };
    node &&
      value &&
      manager.openSubEditor({
        title: '配置标签页标题',
        value: schemaToArray(defaultItemSchema),
        data: schema,
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: BaseSchema) => {
          const newTabsValue = cloneDeep(value);
          newTabsValue.title = schemaArrayFormat(newValue);

          manager.panelChangeValue(newValue, diff(value, newTabsValue));
        }
      });
  }

  // 配置新增按钮模板
  editAddedBtn(context: BaseEventContext) {
    const {id, schema} = context;
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultAddBtnText =
      value.addBtnText && typeof value.addBtnText === 'object'
        ? value.addBtnText
        : {
            type: 'tpl',
            tpl: value.addBtnText ?? '新增'
          };
    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置新增按钮名称',
        value: schemaToArray(defaultAddBtnText),
        slot: {
          type: 'container',
          body: '$$'
        },
        onChange: (newValue: any) => {
          newValue = {...value, addBtnText: schemaArrayFormat(newValue)};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: schema
      });
  }

  // 配置新增tab页模板
  handleAddedSchema(context: BaseEventContext) {
    const {id, schema} = context;
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);
    const defaultAddedTabSchema = value.addedTabSchema ?? {
      title: '新增选项卡',
      body: [
        {
          type: 'tpl',
          tpl: '新增选项卡内容'
        }
      ]
    };
    const subEditorTabs = !schema.source
      ? schema.tabs.map((item: {title: any; tab: any}) => ({
          title: item.title,
          disabled: true
        }))
      : [];
    const defaultSchema = {
      type: 'tabs',
      tabs: '$$',
      defaultKey: subEditorTabs.length,
      activeKey: subEditorTabs.length
    };
    node &&
      value &&
      this.manager.openSubEditor({
        title: '新增选项卡模板',
        value: schemaToArray([...subEditorTabs, defaultAddedTabSchema]),
        slot: defaultSchema,
        onChange: (newValue: any) => {
          newValue = {
            ...value,
            addedTabSchema: schemaArrayFormat(newValue[newValue.length - 1])
          };
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(TabsPlugin);
