import {RendererPluginAction, registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class PdfViewerPlugin extends BasePlugin {
  static id = 'PdfViewerPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'pdf-viewer';
  $schema = '/schemas/AMISPdfViewerSchema.json';

  // 组件名称
  name = 'PDF预览';
  isBaseComponent = true;
  description = 'PDF 文件预览';
  docLink = '/amis/zh-CN/components/pdf-viewer';
  tags = ['展示'];
  icon = 'fa fa-file-pdf';
  pluginIcon = 'pdfViewer-plugin';
  scaffold = {
    type: 'pdf-viewer'
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = 'PDF预览';

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基本',
                body: [
                  {
                    type: 'button-group-select',
                    label: '文件来源',
                    name: 'source',
                    tiled: true,
                    value: 'src',
                    options: [
                      {
                        label: '文件链接',
                        value: 'src'
                      },
                      {
                        label: '本地文件',
                        value: 'file'
                      }
                    ]
                  },
                  getSchemaTpl('tplFormulaControl', {
                    name: 'src',
                    label: '链接地址',
                    visibleOn: 'this.source === "src"'
                  }),
                  {
                    type: 'input-file',
                    label: '文件上传',
                    autoUpload: true,
                    proxy: true,
                    accept: '.pdf',
                    name: '__file',
                    visibleOn: 'this.source === "file"',
                    autoFill: {
                      src: '${url}'
                    }
                  }
                ]
              },
              getSchemaTpl('status', {
                isFormItem: false
              })
            ])
          ]
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            getSchemaTpl('style:classNames', {isFormItem: false})
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(PdfViewerPlugin);
