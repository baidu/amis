import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, setSchemaTpl} from 'amis-editor-core';
import {tipedLabel} from 'amis-editor-core';
import {ValidatorTag} from '../validator';

setSchemaTpl('tpl:content', {
  label: tipedLabel(
    '文字内容',
    '支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'
  ),
  type: 'textarea',
  minRows: 5,
  language: 'html',
  visibleOn: 'data.wrapperComponent !== undefined',
  pipeIn: (value: any, data: any) => value || (data && data.html),
  name: 'tpl'
});

setSchemaTpl('tpl:rich-text', {
  label: '内容',
  type: 'input-rich-text',
  mode: 'normal',
  buttons: [
    'paragraphFormat',
    'quote',
    'textColor',
    'backgroundColor',
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
    'insertTable',
    '|',
    'undo',
    'redo',
    'fullscreen'
  ],
  minRows: 5,
  language: 'html',
  visibleOn: 'data.wrapperComponent === undefined',
  pipeIn: (value: any, data: any) => value || (data && data.html),
  name: 'tpl'
});

setSchemaTpl('tpl:wrapperComponent', {
  name: 'wrapperComponent',
  type: 'select',
  pipeIn: (value: any) => (value === undefined ? 'rich-text' : value),
  pipeOut: (value: any) => (value === 'rich-text' ? undefined : value),
  label: '文字格式',
  options: [
    {
      label: '普通文字',
      value: ''
    },
    {
      label: '段落',
      value: 'p'
    },
    {
      label: '一级标题',
      value: 'h1'
    },
    {
      label: '二级标题',
      value: 'h2'
    },
    {
      label: '三级标题',
      value: 'h3'
    },
    {
      label: '四级标题',
      value: 'h4'
    },
    {
      label: '五级标题',
      value: 'h5'
    },
    {
      label: '六级标题',
      value: 'h6'
    },
    {
      label: '富文本',
      value: 'rich-text'
    }
  ],
  onChange: (value: string, oldValue: string, model: any, form: any) => {
    (value === undefined || oldValue === undefined) &&
      form.setValueByName('tpl', '');
  }
});

export class TplPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'tpl';
  $schema = '/schemas/TplSchema.json';

  // 组件名称
  name = '文字';
  isBaseComponent = true;
  icon = 'fa fa-file-o';
  pluginIcon = 'plain-plugin'; // 使用文字 icon
  description = '用来展示文字或者段落，支持模板语法可用来关联动态数据。';
  docLink = '/amis/zh-CN/components/tpl';
  tags = ['展示'];
  previewSchema = {
    type: 'tpl',
    tpl: '这是模板内容当前时间<%- new Date() %>'
  };
  scaffold: any = {
    type: 'tpl',
    tpl: '请编辑内容',
    inline: true,
    wrapperComponent: ''
  };

  panelTitle = '文字';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    // 在表格/CRUD/模型列表的一列里边
    const isInTable: boolean = /\/cell\/field\/tpl$/.test(context.path);

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              !isInTable ? getSchemaTpl('tpl:wrapperComponent') : null,
              getSchemaTpl('switch', {
                label: tipedLabel(
                  '内联模式',
                  '内联模式默认采用 <code>span</code> 标签包裹内容、非内联将默认采用 <code>div</code> 标签作为容器。'
                ),
                name: 'inline',
                pipeIn: defaultValue(true),
                hiddenOn: 'data.wrapperComponent !== ""'
              }),
              getSchemaTpl('tpl:content'),
              getSchemaTpl('tpl:rich-text')
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          ...getSchemaTpl('style:common', ['layout']),
          getSchemaTpl('style:classNames', {
            isFormItem: false
          })
        ])
      }
    ]);
  };

  popOverBody = [
    getSchemaTpl('tpl:content'),
    getSchemaTpl('tpl:rich-text'),
    getSchemaTpl('tpl:wrapperComponent')
  ];
}

registerEditorPlugin(TplPlugin);
