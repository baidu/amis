import React from 'react';
import {Button} from 'amis';
import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, RegionConfig, BaseEventContext} from 'amis-editor-core';
import {formItemControl} from '../../component/BaseControl';

export class ControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'control';
  $schema = '/schemas/FormControlSchema.json';

  // 组件名称
  name = '表单项容器';
  isBaseComponent = true;
  icon = 'fa fa-object-group';
  pluginIcon = 'form-group-plugin';
  description = `表单项容器`;
  docLink = '/amis/zh-CN/components/form/group';
  tags = ['容器'];
  /**
   * 组件选择面板中隐藏，和Container合并
   */
  disabledRendererPlugin = true;
  scaffold = {
    type: 'control',
    label: '表单项容器',
    body: [
      {
        type: 'tpl',
        tpl: 'a'
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

  // 容器配置
  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '元素集合',
      preferTag: '表单项'
    }
  ];

  panelTitle = '表单项容器';
  panelBodyCreator = (context: BaseEventContext) => {
    return formItemControl({
      common: {
        replace: true,
        body: [
          {
            children: (
              <Button
                className="m-b"
                onClick={() => this.manager.showRendererPanel('表单项')}
                level="danger"
                tooltip="插入一个新的元素"
                size="sm"
                block
              >
                新增元素
              </Button>
            )
          },
          getSchemaTpl('labelRemark'),
          getSchemaTpl('remark'),
          getSchemaTpl('placeholder'),
          getSchemaTpl('description')
        ]
      }
    });
  };
}

registerEditorPlugin(ControlPlugin);
