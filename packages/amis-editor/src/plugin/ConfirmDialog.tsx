import {
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  RegionConfig,
  RendererInfo,
  getSchemaTpl,
  noop,
  defaultValue
} from 'amis-editor-core';
import {InlineModal} from './Dialog';

export class ConfirmDialogPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'confirm-dialog';
  $schema = '/schemas/ConfirmDialogSchema.json';

  // 组件名称
  name = '确认弹框';
  isBaseComponent = true;

  wrapperProps = {
    wrapperComponent: InlineModal,
    onClose: noop,
    show: true
  };

  regions: Array<RegionConfig> = [
    {
      key: 'body',
      label: '内容区',
      renderMethod: 'renderBody',
      renderMethodOverride: (regions, insertRegion) =>
        function (this: any, ...args: any[]) {
          const info: RendererInfo = this.props.$$editor;
          const dom = this.super(...args);

          if (info && args[1] === 'body') {
            return insertRegion(this, dom, regions, info, info.plugin.manager);
          }

          return dom;
        }
    },
    {
      key: 'actions',
      label: '按钮组',
      renderMethod: 'renderFooter',
      wrapperResolve: dom => dom
    }
  ];

  panelTitle = '弹框';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '标题',
                type: 'input-text',
                name: 'title'
              },
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '确认按钮文案',
                type: 'input-text',
                name: 'confirmText'
              },
              getSchemaTpl('layout:originPosition', {value: 'left-top'}),
              {
                label: '取消按钮文案',
                type: 'input-text',
                name: 'cancelText'
              },
              getSchemaTpl('switch', {
                label: '可按 Esc 关闭',
                name: 'closeOnEsc',
                value: false
              })
            ]
          }
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                label: '尺寸',
                type: 'button-group-select',
                name: 'size',
                size: 'sm',
                options: [
                  {
                    label: '标准',
                    value: ''
                  },
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
                    label: '超大',
                    value: 'xl'
                  }
                ],
                pipeIn: defaultValue(''),
                pipeOut: (value: string) => (value ? value : undefined)
              },
              getSchemaTpl('buttonLevel', {
                label: '确认按钮样式',
                name: 'confirmBtnLevel'
              }),
              getSchemaTpl('buttonLevel', {
                label: '取消按钮样式',
                name: 'cancelBtnLevel'
              })
            ]
          }
        ])
      }
    ]);
  };

  buildSubRenderers() {}
}

registerEditorPlugin(ConfirmDialogPlugin);
