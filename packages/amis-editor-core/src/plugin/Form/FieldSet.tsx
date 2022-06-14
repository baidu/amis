import {Button} from 'amis';
import React from 'react';
import {defaultValue, getSchemaTpl} from '../../component/schemaTpl';
import {registerEditorPlugin} from '../../manager';
import {BaseEventContext, BasePlugin, RegionConfig} from '../../plugin';

export class FieldSetControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'fieldset';
  $schema = '/schemas/FieldSetControlSchema.json';
  disabledRendererPlugin = true; // 组件面板不显示

  // 组件名称
  name = '字段集';
  isBaseComponent = true;
  icon = 'fa fa-toggle-down';
  description = `多个表单项的组合，可配置是否折叠`;
  docLink = '/amis/zh-CN/components/form/fieldset';
  tags = ['表单项'];
  scaffold = {
    type: 'fieldset',
    title: '标题',
    collapsable: true,
    body: [
      {
        type: 'input-text',
        label: '文本1',
        name: 'text'
      },
      {
        type: 'input-text',
        label: '文本2',
        name: 'text'
      }
    ]
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '子表单项',
      renderMethod: 'renderBody',
      insertPosition: 'inner',
      preferTag: '表单项'
    }
  ];

  panelTitle = '字段集';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      {
        label: '标题',
        name: 'title',
        type: 'input-text'
        // required: true
      },

      getSchemaTpl('switch', {
        name: 'collapsable',
        label: '是否可折叠',
        pipeIn: defaultValue(false)
      }),

      getSchemaTpl('switch', {
        name: 'collapsed',
        label: '默认是否折叠',
        visibleOn: 'this.collapsable'
      }),

      {
        name: 'className',
        type: 'button-group-select',
        clearable: true,
        size: 'sm',
        label: '控件样式',
        className: 'w-full',
        pipeIn: defaultValue(''),
        options: [
          {
            label: '默认',
            value: ''
          },
          {
            value: 'Collapse--xs',
            label: '极小'
          },
          {
            value: 'Collapse--sm',
            label: '小'
          },
          {
            value: 'Collapse--base',
            label: '正常'
          },
          {
            value: 'Collapse--md',
            label: '大'
          },
          {
            value: 'Collapse--lg',
            label: '超大'
          }
        ]
      },

      getSchemaTpl('className', {
        name: 'headingClassName',
        label: '标题 CSS 类名'
      }),
      getSchemaTpl('className', {
        name: 'bodyClassName',
        label: '内容区域 CSS 类名'
      }),

      {
        children: (
          <Button
            level="info"
            size="sm"
            className="m-b-sm"
            block
            onClick={() => {
              // this.manager.showInsertPanel('body', context.id);
              this.manager.showRendererPanel(
                '表单项',
                '请从左侧组件面板中点击添加子表单项'
              );
            }}
          >
            添加子表单项
          </Button>
        )
      },

      getSchemaTpl('subFormItemMode'),
      getSchemaTpl('subFormHorizontalMode'),
      getSchemaTpl('subFormHorizontal')
    ];
  };

  filterProps(props: any) {
    props.collapsed = false;
    return props;
  }
}

registerEditorPlugin(FieldSetControlPlugin);
