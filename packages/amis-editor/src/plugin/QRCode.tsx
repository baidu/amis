import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class QRCodePlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'qrcode';
  $schema = '/schemas/QRCodeSchema.json';

  // 组件名称
  name = '二维码';
  isBaseComponent = true;
  description = '可以用来生成二维码';
  docLink = '/amis/zh-CN/components/qrcode';
  tags = ['功能'];
  icon = 'fa fa-qrcode';
  scaffold = {
    type: 'qrcode',
    value: 'https://amis.baidu.com'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '二维码';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            name: 'value',
            type: 'input-text',
            label: '二维码值',
            pipeIn: defaultValue('https://www.baidu.com'),
            description: '支持使用 <code>\\${xxx}</code> 来获取变量'
          },
          {
            name: 'level',
            type: 'select',
            label: '复杂度',
            pipeIn: defaultValue('L'),
            options: [
              {
                label: 'L',
                value: 'L'
              },
              {
                label: 'M',
                value: 'M'
              },
              {
                label: 'Q',
                value: 'Q'
              },
              {
                label: 'H',
                value: 'H'
              }
            ]
          }
        ]
      },
      {
        title: '外观',
        body: [
          {
            name: 'codeSize',
            type: 'input-number',
            label: '宽高值',
            pipeIn: defaultValue(128)
          },
          {
            name: 'backgroundColor',
            type: 'input-color',
            label: '背景色',
            pipeIn: defaultValue('#fff')
          },
          {
            name: 'foregroundColor',
            type: 'input-color',
            label: '前景色',
            pipeIn: defaultValue('#000')
          },
          getSchemaTpl('className')
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
      }
    ])
  ];
}

registerEditorPlugin(QRCodePlugin);
