import {getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';

export class RichTextControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-rich-text';
  $schema = '/schemas/RichTextControlSchema.json';

  // 组件名称
  name = '富文本编辑器';
  isBaseComponent = true;
  icon = 'fa fa-newspaper-o';
  pluginIcon = 'input-rich-text-plugin';
  description = `可自定义富文本的配置栏`;
  docLink = '/amis/zh-CN/components/form/input-rich-text';
  tags = ['表单项'];
  scaffold = {
    type: 'input-rich-text',
    label: '富文本',
    name: 'rich-text'
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
  panelBody = [
    getSchemaTpl('switchDefaultValue'),
    {
      type: 'textarea',
      name: 'value',
      label: '默认值',
      visibleOn: 'typeof this.value !== "undefined"'
    },
    getSchemaTpl('api', {
      name: 'receiver',
      label: '文件接收接口',
      value: '/api/upload/image',
      __isUpload: true
    }),
    {
      type: 'select',
      name: 'vendor',
      label: '编辑器类型',
      value: 'tinymce',
      options: ['tinymce', 'froala']
    },
    getSchemaTpl('fieldSet', {
      title: 'froala 设置项',
      visibleOn: 'data.vendor === "froala"',
      body: [
        {
          type: 'combo',
          name: 'options',
          noBorder: true,
          multiLine: true,
          items: [
            {
              type: 'select',
              name: 'language',
              label: '语言',
              labelRemark: '鼠标覆盖配置栏中配置时显示的提示语言',
              defaultValue: 'zh_cn',
              options: [
                {label: '中文', value: 'zh_cn'},
                {label: '英文', value: 'en_us'}
              ]
            },
            {
              type: 'textarea',
              name: 'toolbarButtons',
              label: '大屏时展示的配置项',
              labelRemark: '屏幕宽度 ≥ 1200px',
              description:
                '使用空格分开配置，使用<code>|</code>可将配置栏分组，<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">参考文档</a>',
              minRows: 5,
              value: [
                'paragraphFormat',
                'quote',
                'color',
                '|',
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                '|',
                'formatOL',
                'formatUL',
                'align',
                '|',
                'insertLink',
                'insertImage',
                'insertEmotion',
                'insertTable',
                '|',
                'undo',
                'redo',
                'html'
              ],
              pipeIn: (value: any) =>
                Array.isArray(value) ? value.join(' ') : '',
              pipeOut: (value: any) => value.replace(/\s+/g, ' ').split(' ')
            },
            {
              type: 'textarea',
              name: 'toolbarButtonsMD',
              label: '中屏时展示的配置项',
              labelRemark: '屏幕宽度 ≥ 992px',
              description:
                '使用空格分开配置，使用<code>|</code>可将配置栏分组，<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">参考文档</a>',
              minRows: 5,
              pipeIn: (value: any) =>
                Array.isArray(value) ? value.join(' ') : '',
              pipeOut: (value: any) => value.replace(/\s+/g, ' ').split(' ')
            },
            {
              type: 'textarea',
              name: 'toolbarButtonsSM',
              label: '小屏时展示的配置项',
              labelRemark: '屏幕宽度 ≥ 768px',
              description:
                '使用空格分开配置，使用<code>|</code>可将配置栏分组，<a target="_blank" href="https://www.froala.com/wysiwyg-editor/docs/options">参考文档</a>',
              minRows: 5,
              pipeIn: (value: any) =>
                Array.isArray(value) ? value.join(' ') : '',
              pipeOut: (value: any) => value.replace(/\s+/g, ' ').split(' ')
            }
          ]
        }
      ]
    }),
    getSchemaTpl('fieldSet', {
      title: 'tinymce 设置项',
      visibleOn: 'data.vendor === "tinymce"',
      body: [
        {
          type: 'combo',
          name: 'options',
          noBorder: true,
          multiLine: true,
          items: [
            getSchemaTpl('switch', {
              label: '是否显示菜单栏',
              value: 'true',
              name: 'menubar'
            }),
            {
              type: 'input-number',
              label: '高度',
              min: 0,
              value: 400,
              name: 'height'
            },
            {
              type: 'textarea',
              name: 'plugins',
              label: '启用的插件',
              description:
                '使用空格分开配置，<a target="_blank" href="https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/">参考文档</a>',
              value:
                'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking table emoticons template paste help'
            },
            {
              type: 'textarea',
              name: 'toolbar',
              label: '工具栏',
              value:
                'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons | help'
            }
          ]
        }
      ]
    })
  ];
}

registerEditorPlugin(RichTextControlPlugin);
