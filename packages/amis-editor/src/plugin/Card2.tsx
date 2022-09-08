import {
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  defaultValue,
  getSchemaTpl,
  tipedLabel,
  registerEditorPlugin
} from 'amis-editor-core';

export class Card2Plugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'card2';
  $schema = '/schemas/Card2Schema.json';

  // 组件名称
  name = '卡片';
  isBaseComponent = true;
  description = '展示单个卡片。';
  tags = ['展示'];
  icon = '';
  scaffold = {
    type: 'card2',
    body: '内容'
  };
  previewSchema = {
    ...this.scaffold
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      renderMethod: 'renderBody',
      preferTag: '展示'
    }
  ];

  panelTitle = '卡片';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                {
                  type: 'button-group-select',
                  label: tipedLabel(
                    '选择区域',
                    '点击触发选中或取消选中的区域'
                  ),
                  name: 'checkOnItemClick',
                  options: [
                    {label: '整个', value: true},
                    {label: '选框', value: false}
                  ],
                  pipeIn: defaultValue(false)
                },
                getSchemaTpl('switch', {
                  label: tipedLabel(
                    '隐藏选框',
                    '不再显示选择框，可以通过自定义选中态外观实现选中样式'
                  ),
                  name: 'hideCheckToggler',
                  visibleOn: 'this.checkOnItemClick'
                })
              ]
            },
            getSchemaTpl('status', {isFormItem: false})
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {
              isFormItem: false,
              schema: [
                getSchemaTpl('className', {
                  name: 'bodyClassName',
                  label: '内容区',
                  visibleOn: 'this.icon'
                }),
                // TODO
                getSchemaTpl('className', {
                  name: 'selectedClassName',
                  label: '选中态',
                  visibleOn: 'this.icon'
                })
              ]
            })
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(Card2Plugin);
