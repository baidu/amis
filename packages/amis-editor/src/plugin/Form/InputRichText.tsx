import {
  BaseEventContext,
  getSchemaTpl,
  defaultValue,
  tipedLabel
} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

import {ValidatorTag} from '../../validator';

const tinymceToolbarsDelimiter = ' ';

const tinymceToolbars = [
  'undo',
  'redo',
  'bold',
  'italic',
  'backcolor',
  'alignleft',
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
  'color',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'formatOL',
  'formatUL',
  'align',
  'insertLink',
  'insertImage',
  'insertEmotion',
  'insertTable',
  'undo',
  'redo',
  'html'
];

const froalaOptionsPipeOut = (arr: Array<string>) => {
  return froalaOptions.filter(item => arr.find(a => a === item));
};

export class RichTextControlPlugin extends BasePlugin {
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
    receiver: '',
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
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description'),
            ]
          },
          {
            title: '编辑器',
            body: [
              {
                type: 'select',
                name: 'vendor',
                label: '类型',
                value: hasRichTextToken ? 'froala' : 'tinymce',
                options: ['tinymce', 'froala'],
                onChange: (value: any, oldValue: any, model: any, form: any) => {
                  if (value === 'tinymce') {
                    form.changeValue('options', {
                      height: 400,
                      width: undefined,
                      menubar: true,
                      inline: false,
                      quickInsertEnabled: undefined,
                      charCounterCount: undefined,
                      toolbarButtons: undefined,
                      toolbarButtonsMD: undefined,
                      toolbarButtonsSM: undefined
                    });
                    form.setValueByName('customOtherSize', undefined)
                  }
                  else if (value === 'froala') {
                    form.changeValue('options', {
                      height: undefined,
                      width: undefined,
                      toolbar: undefined,
                      menubar: undefined,
                      inline: undefined,
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
                  '查看 https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/ 文档'),
                name: 'options.plugins',
                visibleOn: 'data.vendor === "tinymce"',
                defaultCheckAll: true,
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                options: [
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
                ]
              },
              {
                type: 'select',
                name: 'options.toolbar',
                multiple: true,
                label: '工具栏',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                visibleOn: 'data.vendor === "tinymce"',
                delimiter: tinymceToolbarsDelimiter,
                value: 'undo redo formatselect bold italic backcolor alignleft aligncenter alignright alignjustify bullist numlist outdent indent removeformat help',
                pipeOut: (value: string) => {
                  const arr = value?.split(tinymceToolbarsDelimiter) ?? [];
                  return tinymceToolbars.filter(item => arr.find(a => a === item)).join(' ');
                },
                options: tinymceToolbars
              },
              getSchemaTpl('switch', {
                label: '显示菜单栏',
                value: true,
                name: 'options.menubar',
                visibleOn: 'data.vendor === "tinymce"',
              }),
              getSchemaTpl('switch', {
                label: '内嵌操作栏',
                value: false,
                name: 'options.inline',
                visibleOn: 'data.vendor === "tinymce"',
              }),

              // froala
              {
                type: 'select',
                name: 'options.toolbarButtons',
                multiple: true,
                visibleOn: 'data.vendor === "froala"',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏',
                  '屏幕宽度≥1200px，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
                ),
                defaultCheckAll: true,
                joinValues: false,
                extractValue: true,
                options: [...froalaOptions],
                pipeOut: froalaOptionsPipeOut,
              },
              getSchemaTpl('switch', {
                label: '设定中小屏幕工具栏',
                name: 'customOtherSize',
                visibleOn: 'data.vendor === "froala"',
                onChange: (value: any, oldValue: any, model: any, form: any) => {
                  if (!value) {
                    form.setValueByName('options.toolbarButtonsMD', undefined);
                    form.setValueByName('options.toolbarButtonsSM', undefined);
                  }
                },
                pipeIn: (value: string | boolean, form: any) => {
                  if (typeof value === 'boolean') {
                    return value;
                  }
                  const bool = !!(form.data?.options?.toolbarButtonsMD || form.data?.options?.toolbarButtonsSM);
                  // 使用setTimeout跳过react更新检测，推进更新
                  setTimeout(() => form.setValueByName('customOtherSize', bool));
                  return bool;
                }
              }),
              {
                type: 'select',
                name: 'options.toolbarButtonsMD',
                multiple: true,
                visibleOn: 'data.customOtherSize',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏-中屏',
                  '屏幕宽度≥992px，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
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
                visibleOn: 'data.customOtherSize',
                maxTagCount: 5,
                overflowTagPopover: {
                  title: '插件',
                  offset: [0, 5]
                },
                label: tipedLabel(
                  '工具栏-小屏',
                  '屏幕宽度≥768px，参考文档：https://froala.com/wysiwyg-editor/docs/options/'
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
                visibleOn: 'data.vendor === "froala"',
              }),
              getSchemaTpl('switch', {
                label: '字数统计',
                value: true,
                name: 'options.charCounterCount',
                visibleOn: 'data.vendor === "froala"',
              }),

              // 公用部分
              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: '图片接收接口',
                visibleOn: '${vendor === "tinymce" && CONTAINS(options.plugins, "image")}',
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'receiver',
                label: '图片接收接口',
                visibleOn: 'data.vendor === "froala"',
              }),

              getSchemaTpl('apiControl', {
                mode: 'row',
                labelClassName: 'none',
                name: 'videoReceiver',
                label: '视频接收接口',
                visibleOn: 'data.vendor === "froala"',
              }),
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
              title: '${verdor === "tinymce" ? "编辑器" : "编辑区域"}',
              body: [
                {
                  type: 'input-number',
                  label: '高度',
                  min: 0,
                  name: 'options.height',
                  visibleOn: 'data.vendor === "tinymce"',
                },
                {
                  type: 'input-number',
                  label: '高度',
                  min: 150,
                  max: 400,
                  name: 'options.height',
                  visibleOn: 'data.vendor === "froala"',
                },
                {
                  type: 'input-number',
                  label: '宽度',
                  min: 0,
                  name: 'options.width'
                },
              ]
            },
            getSchemaTpl('style:formItem', {
              renderer: context.info.renderer,
              schema: [
                getSchemaTpl('switch', {
                  label: '内联模式',
                  name: 'inline',
                  pipeIn: defaultValue(false)
                }),
              ]
            }),
            getSchemaTpl('style:classNames')
          ])
        ]
      }
    ]);
  };
}

registerEditorPlugin(RichTextControlPlugin);
