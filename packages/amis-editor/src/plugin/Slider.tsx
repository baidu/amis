import {
  registerEditorPlugin,
  BasePlugin,
  getSchemaTpl,
  tipedLabel,
  RegionConfig,
  BaseEventContext,
  BasicToolbarItem
} from 'amis-editor-core';

export class SliderPlugin extends BasePlugin {
  static id = 'SliderPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'slider';
  $schema = '/schemas/SliderSchema.json';

  // 组件名称
  name = '滑动条';
  isBaseComponent = true;
  description =
    '主要用于移动端中支持左右滑动展示更多内容，在桌面端中更多内容展示在右侧';
  tags = ['展示'];
  icon = 'fa fa-link';
  pluginIcon = 'url-plugin';
  scaffold = {
    type: 'slider',
    body: [],
    left: [],
    right: []
  };
  previewSchema = {
    ...this.scaffold,
    label: this.name
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '主要内容区'
    },
    {
      key: 'left',
      label: '左侧内容区',
      hiddenOn: schema => !schema.left
    },
    {
      key: 'right',
      label: '右侧内容区',
      hiddenOn: schema => !schema.right
    }
  ];

  panelTitle = '滑动条';
  panelJustify = true;
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'checkboxes',
                name: '$$area',
                multiple: true,
                label: '区域展示',
                options: [
                  {
                    label: '左侧内容区',
                    value: 'left'
                  },
                  {
                    label: '右侧内容区',
                    value: 'right'
                  }
                ],
                pipeIn: (value: any, data: any, schema: any) => {
                  let res = [];
                  if (schema.left) {
                    res.push('left');
                  }
                  if (schema.right) {
                    res.push('right');
                  }
                  return res.join(',');
                },
                onChange: (
                  value: string,
                  data: any,
                  schema: any,
                  props: any
                ) => {
                  if (value.includes('left')) {
                    props.setValueByName(
                      'left',
                      props.getValueByName('$$left') || []
                    );
                  } else {
                    props.setValueByName(
                      '$$left',
                      props.getValueByName('left')
                    );
                    props.setValueByName('left', undefined);
                  }

                  if (value.includes('right')) {
                    props.setValueByName(
                      'right',
                      props.getValueByName('$$right') || []
                    );
                  } else {
                    props.setValueByName(
                      '$$right',
                      props.getValueByName('right')
                    );
                    props.setValueByName('right', undefined);
                  }
                }
              },
              {
                type: 'input-text',
                name: 'bodyWidth',
                value: '60%',
                label: tipedLabel('内容区宽度', '主要内容区宽度占比，默认60%')
              }
            ]
          },
          getSchemaTpl('status', {
            disabled: true
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'iconClassName',
                label: '左侧图标',
                visibleOn: 'this.icon'
              }),
              getSchemaTpl('className', {
                name: 'rightIconClassName',
                label: '右侧图标',
                visibleOn: 'this.rightIcon'
              })
            ]
          })
        ])
      }
    ])
  ];

  filterProps(props: any) {
    // 编辑的时候不能切换
    props.canSwitch = false;
    return props;
  }

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
      context.info.renderer.name === 'slider' &&
      !context.info.hostId
    ) {
      const node = context.node;
      const schema = context.schema;

      if (schema.left) {
        toolbars.push({
          level: 'secondary',
          icon: 'fa fa-chevron-left',
          tooltip: '显示左侧内容',
          onClick: () => {
            const control = node.getComponent();
            control?.showLeft?.();
            control?.hideRight?.();
          }
        });
      }

      if (schema.right) {
        toolbars.push({
          level: 'secondary',
          icon: 'fa fa-chevron-right',
          tooltip: '显示右侧内容',
          onClick: () => {
            const control = node.getComponent();
            control?.showRight?.();
            control?.hideLeft?.();
          }
        });
      }
    }
  }
}

registerEditorPlugin(SliderPlugin);
