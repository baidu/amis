import {
  RendererPluginEvent,
  getI18nEnabled,
  registerEditorPlugin
} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

import {tipedLabel} from 'amis-editor-core';
import {isObject} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {generateId} from '../util';

export class CollapseGroupPlugin extends BasePlugin {
  static id = 'CollapseGroupPlugin';
  // 关联渲染器名字
  rendererName = 'collapse-group';
  useLazyRender = true; // 使用懒渲染
  $schema = '/schemas/CollapseGroupSchema.json';

  // 组件名称
  name = '折叠面板';
  isBaseComponent = true;
  description =
    '折叠面板，当信息量较大且分类较多时，可使用折叠面板进行分类收纳。';
  docLink = '/amis/zh-CN/components/collapse';
  tags = ['布局容器'];
  icon = 'fa fa-align-justify';
  pluginIcon = 'collapse-plugin';
  scaffold = {
    type: 'collapse-group',
    enableFieldSetStyle: true,
    activeKey: ['1'],
    body: [
      {
        type: 'collapse',
        key: '1',
        active: true,
        header: '标题1',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '这里是内容1',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      },
      {
        type: 'collapse',
        key: '2',
        header: '标题2',
        id: generateId(),
        body: [
          {
            type: 'tpl',
            tpl: '这里是内容1',
            wrapperComponent: '',
            inline: false,
            id: generateId()
          }
        ]
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '折叠状态改变',
      description: '折叠面板折叠状态改变时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            data: {
              title: '数据',
              type: 'object',
              properties: {
                activeKeys: {
                  type: 'array',
                  title: '当前展开的索引列表'
                },
                collapseId: {
                  type: 'string',
                  title: '折叠器索引'
                },
                collapsed: {
                  type: 'boolean',
                  title: '折叠器状态'
                }
              }
            }
          }
        }
      ]
    }
  ];

  activeKeyData: any = [];
  panelTitle = '折叠面板';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    const isInForm = context.path.includes('/form/');
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                {
                  name: 'enableFieldSetStyle',
                  label: '展示风格',
                  visible: isInForm,
                  type: 'button-group-select',
                  options: [
                    {
                      label: '默认',
                      value: false
                    },
                    {
                      label: '简洁',
                      value: true
                    }
                  ]
                },
                {
                  name: 'expandIconPosition',
                  label: '图标位置',
                  type: 'button-group-select',

                  pipeIn: defaultValue('left'),
                  options: [
                    {
                      label: '左边',
                      value: 'left',
                      icon: 'fa fa-align-left'
                    },
                    {
                      label: '右边',
                      value: 'right',
                      icon: 'fa fa-align-right'
                    }
                  ]
                },
                {
                  type: 'ae-switch-more',
                  label: '自定义图标',
                  bulk: true,
                  mode: 'normal',
                  value: false,
                  formType: 'extend',
                  autoFocus: false,
                  form: {
                    body: [
                      getSchemaTpl('icon', {
                        name: 'expandIcon',
                        label: '图标',
                        value: {
                          type: 'icon',
                          vendor: ''
                        },
                        pipeIn: (value: any) => value?.icon,
                        pipeOut: (value: any) => ({
                          type: 'icon',
                          vendor: '',
                          icon: value ? value : undefined
                        })
                      })
                    ]
                  },
                  pipeIn: (value: string) => {
                    if (typeof value === 'string' && value.length) {
                      return {
                        character: value
                      };
                    }
                    return undefined;
                  },
                  pipeOut: (value: any) => {
                    if (!isObject(value)) {
                      return undefined;
                    }
                    return typeof value.character === 'string'
                      ? value.character
                      : undefined;
                  }
                },
                {
                  name: 'accordion',
                  label: tipedLabel(
                    '手风琴模式',
                    '手风琴模式，只允许单个面板展开'
                  ),
                  mode: 'row',
                  inputClassName:
                    'inline-flex justify-between flex-row-reverse',
                  type: 'switch',
                  pipeIn: defaultValue(false)
                },
                getSchemaTpl('combo-container', {
                  name: 'body',
                  type: 'combo',
                  label: '面板管理',
                  mode: 'normal',
                  multiple: true,
                  addable: true,
                  columnClassName: 'w-20',
                  addButtonText: '新增折叠器',
                  minLength: 1,
                  draggable: true,
                  draggableTip: '',
                  placeholder: '请添加折叠器',
                  items: [
                    {
                      type: 'container',
                      columnClassName: 'flex-none',
                      body: tipedLabel(
                        [
                          {
                            name: 'active',
                            type: 'checkbox'
                          }
                        ],
                        '默认展开此面板'
                      )
                    },
                    getSchemaTpl('title', {
                      name: 'header',
                      placeholder: '标题'
                    })
                  ],
                  onChange: (
                    value: Array<any>,
                    oldValue: Array<any>,
                    model: any,
                    form: any
                  ) => {
                    const activeKey = value.reduce((arr: any, item: any) => {
                      item.active === true && arr.push(item.key);
                      return arr;
                    }, []);
                    form.setValues({
                      activeKey
                    });
                  },
                  pipeOut: (value: any[], oldValue: any, data: any) => {
                    const keys = value.map(item => item.key);
                    const findMinCanUsedKey = (
                      keys: string[],
                      max: number
                    ): void | string => {
                      for (let i = 1; i <= max; i++) {
                        if (!keys.includes(String(i))) {
                          return String(i);
                        }
                      }
                    };
                    value.forEach(item => {
                      if (!item.key) {
                        const key = findMinCanUsedKey(keys, value.length);
                        item.key = key;
                        item.header = `标题${key}`;
                      }
                    });
                    return value;
                  },
                  scaffold: {
                    type: 'collapse',
                    header: '标题',
                    body: [
                      {
                        type: 'tpl',
                        tpl: '内容',
                        wrapperComponent: '',
                        inline: false
                      }
                    ],
                    key: ''
                  }
                })
              ]
            }
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本样式',
              body: [
                getSchemaTpl('theme:paddingAndMargin', {
                  name: `themeCss.className.padding-and-margin`,
                  hidePadding: true
                })
              ]
            },
            getSchemaTpl('theme:cssCode'),
            getSchemaTpl('animation'),
            getSchemaTpl('style:classNames', {
              isFormItem: false
            })
          ])
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
      ])
    ];
  };

  regions: Array<RegionConfig> = [
    // {
    //   key: 'body',
    //   label: '内容区',
    //   renderMethod: 'render',
    //   insertPosition: 'inner'
    // }
  ];
}

registerEditorPlugin(CollapseGroupPlugin);
