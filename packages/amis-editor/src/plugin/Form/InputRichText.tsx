import {
  BaseEventContext,
  getSchemaTpl,
  defaultValue,
  RendererPluginEvent,
  tipedLabel
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getEventControlConfig} from '../../renderer/event-control/helper';
import {ValidatorTag} from '../../validator';

const tinymceToolbarsDelimiter = ' ';

const tinymceOptions = [
  'advlist',
  'autolink',
  'link',
  'image',
  'lists',
  'charmap',
  'preview',
  'anchor',
  'pagebreak',
  'searchreplace',
  'wordcount',
  'visualblocks',
  'visualchars',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'nonbreaking',
  'table',
  'emoticons',
  'template',
  'help'
];

const tinymceToolbars = [
  'undo',
  'redo',
  'bold',
  'italic',
  'backcolor',
  'alignleft',
  'formatselect',
  'aligncenter',
  'alignright',
  'alignjustify',
  'bullist',
  'numlist',
  'outdent',
  'indent',
  'removeformat',
  'help',
  'charmap',
  'anchor',
  'pagebreak',
  'searchreplace',
  'wordcount',
  'visualblocks',
  'visualchars',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'nonbreaking',
  'table',
  'tableprops',
  'tabledelete',
  'tablecellprops',
  'tablemergecells',
  'tablesplitcells',
  'tableinsertrowbefore',
  'tableinsertrowafter',
  'tabledeleterow',
  'tablerowprops',
  'tableinsertcolbefore',
  'tableinsertcolafter',
  'tabledeletecol',
  'tablecutrow',
  'tablecopyrow',
  'tablepasterowbefore',
  'tablepasterowafter',
  'tablecutcol',
  'tablecopycol',
  'tablepastecolbefore',
  'tablepastecolafter',
  'tableinsertdialog',
  'tablecellvalign',
  'tablecellborderwidth',
  'tablecellborderstyle',
  'tablecellbackgroundcolor',
  'tablecellbordercolor',
  'tablecaption',
  'tablerowheader',
  'tablecolheader',
  'emoticons',
  'template',
  'link',
  'openlink',
  'unlink',
  'image',
  'preview',
  'alignnone',
  'underline',
  'strikethrough',
  'subscript',
  'superscript',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'cut',
  'copy',
  'paste',
  'selectall',
  'newdocument',
  'remove',
  'print',
  'hr',
  'blockquote',
  'forecolor',
  'visualaid',
  'lineheight',
  'pastetext'
];

const froalaOptions = [
  'paragraphFormat',
  'quote',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'formatOL',
  'formatUL',
  'align',
  'insertLink',
  'insertImage',
  'insertTable',
  'undo',
  'redo',
  'html'
];

const froalaOptionsPipeOut = (arr: Array<string>) => {
  return froalaOptions.filter(item => arr.find(a => a === item));
};

export class RichTextControlPlugin extends BasePlugin {
  static id = 'RichTextControlPlugin';
  // 关联渲染器名字
  rendererName = 'input-rich-text';
  $schema = '/schemas/RichTextControlSchema.json';

  // 组件名称
  name = '富文本编辑器';
  isBaseComponent = true;
  icon = 'fa fa-newspaper-o';
  pluginIcon = 'input-rich-text-plugin';
  description = '可自定义富文本的配置栏';
  docLink = '/amis/zh-CN/components/form/input-rich-text';
  tags = ['表单项'];
  scaffold = {
    type: 'input-rich-text',
    label: '富文本',
    name: 'rich-text',
    vendor: 'tinymce'
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

  panelTitle = '富文本';

  events: RendererPluginEvent[] = [
    {
      eventName: 'change',
      eventLabel: '值变化',
      description: '输入内容变化',
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
                  title: '富文本的值'
                }
              },
              description: '当前数据域，可以通过.字段名读取对应的值'
            }
          }
        }
      ]
    }
  ];

  notRenderFormZone = true;

  panelJustify = true;

  panelBodyCreator = (context: BaseEventContext) => {
    // 有设置这个就默认使用 froala
    const hasRichTextToken = !!this.manager.env?.richTextToken;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'textarea'
                },
                label: '默认值'
              }),
              {
                type: 'select',
                name: 'vendor',
                label: '类型',
                value: hasRichTextToken ? 'froala' : 'tinymce',
                options: ['tinymce', 'froala'],
                onChange: (
                  value: any,
                  oldValue: any,
                  model: any,
                  form: any
                ) => {
                  if (value === 'tinymce') {
                    form.changeValue('options', {
                      height: 400,
                      width: undefined,
                      menubar: true,
                      quickInsertEnabled: undefined,
                      charCounterCount: undefined,
                      toolbarButtons: undefined,
                      toolbarButtonsMD: undefined,
                      toolbarButtonsSM: undefined
                    });
                  } else if (value === 'froala') {
                    form.changeValue('options', {
                      height: undefined,
                      width: undefined,
                      toolbar: undefined,
                      menubar: undefined,
                      quickInsertEnabled: true,
                      charCounterCount: true
                    });
                  }
                }
              },

              // tinymce
              {
                type: 'select',
                multiple: true,
                label: tipedLabel(
                  '插件',
                  '查看 https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/ 文档'
                ),
                name: 'options.plugins',
                visibleOn: 'this.vendor === "tinymce"',
                value: [...tinymceOptions].join(','),
                searchable: true,
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                options: tinymceOptions
              },
              {
                type: 'select',
                name: 'options.toolbar',
                multiple: true,
                label: '工具栏',
                searchable: true,
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                visibleOn: 'this.vendor === "tinymce"',
                delimiter: tinymceToolbarsDelimiter,
                value:
                  'undo redo formatselect bold italic backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help',
                pipeOut: (value: string) => {
                  const arr = value?.split(tinymceToolbarsDelimiter) ?? [];
                  return tinymceToolbars
                    .filter(item => arr.find(a => a === item))
                    .join(' ');
                },
                options: tinymceToolbars
              },
              getSchemaTpl('switch', {
                label: '显示菜单栏',
                value: true,
                name: 'options.menubar',
                visibleOn: 'this.vendor === "tinymce"'
              }),

              // froala
              {
                type: 'select',
                name: 'options.toolbarButtons',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏-大屏',
                  '屏幕宽度≥1200px，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
                ),
                value: [...froalaOptions],
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              {
                type: 'select',
                name: 'options.toolbarButtonsMD',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏-中屏',
                  '屏幕宽度≥992px，如果不配置就和大屏设置的工具栏一致，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
                ),
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              {
                type: 'select',
                name: 'options.toolbarButtonsSM',
                multiple: true,
                visibleOn: 'this.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏-小屏',
                  '屏幕宽度≥768px，如果不配置就和大屏设置的工具栏一致，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
                ),
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut
              },
              getSchemaTpl('switch', {
                label: '快速插入',
                value: true,
                name: 'options.quickInsertEnabled',
                visibleOn: 'this.vendor === "froala"'
              }),
              getSchemaTpl('switch', {
                label: '字数统计',
                value: true,
                name: 'options.charCounterCount',
                visibleOn: 'this.vendor === "froala"'
              }),

              // 公用部分
              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: '图片接收接口',
                visibleOn:
                  '${vendor === "tinymce" && CONTAINS(options.plugins, "image")}'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: '图片接收接口',
                visibleOn: 'this.vendor === "froala"'
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'videoReceiver',
                label: '视频接收接口',
                visibleOn: 'this.vendor === "froala"'
              }),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder', {
                visibleOn: 'this.vendor !== "tinymce"'
              }),
              getSchemaTpl('description')
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: ValidatorTag.Code})
        ])
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('collapseGroup', [
            {
              title: '${vendor === "tinymce" ? "编辑器" : "编辑区域"}',
              body: [
                {
                  type: 'input-number',
                  label: '高度',
                  min: 0,
                  name: 'options.height',
                  visibleOn: 'this.vendor === "tinymce"'
                },
                {
                  type: 'input-number',
                  label: '高度',
                  min: 150,
                  max: 400,
                  name: 'options.height',
                  visibleOn: 'this.vendor === "froala"'
                }
              ]
            },
            getSchemaTpl('theme:formItem'),
            getSchemaTpl('style:classNames')
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
}

registerEditorPlugin(RichTextControlPlugin);
