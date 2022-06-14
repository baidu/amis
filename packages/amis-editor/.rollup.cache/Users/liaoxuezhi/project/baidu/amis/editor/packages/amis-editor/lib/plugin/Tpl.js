import { __extends, __spreadArray } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl, setSchemaTpl } from 'amis-editor-core';
import { tipedLabel } from '../component/BaseControl';
setSchemaTpl('tpl:content', {
    label: tipedLabel('文字内容', '支持使用 <code>\\${xxx}</code> 来获取变量，或者用 lodash.template 语法来写模板逻辑。<a target="_blank" href="/amis/zh-CN/docs/concepts/template">详情</a>'),
    type: 'textarea',
    minRows: 5,
    language: 'html',
    visibleOn: 'data.wrapperComponent !== undefined',
    pipeIn: function (value, data) { return value || (data && data.html); },
    name: 'tpl'
});
setSchemaTpl('tpl:rich-text', {
    label: '内容',
    type: 'input-rich-text',
    mode: 'normal',
    buttons: [
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
        'insertTable',
        '|',
        'undo',
        'redo',
        'fullscreen'
    ],
    minRows: 5,
    language: 'html',
    visibleOn: 'data.wrapperComponent === undefined',
    pipeIn: function (value, data) { return value || (data && data.html); },
    name: 'tpl'
});
setSchemaTpl('tpl:wrapperComponent', {
    name: 'wrapperComponent',
    type: 'select',
    pipeIn: function (value) { return (value === undefined ? 'rich-text' : value); },
    pipeOut: function (value) { return (value === 'rich-text' ? undefined : value); },
    label: '文字格式',
    options: [
        {
            label: '普通文字(内联)',
            value: 'span'
        },
        {
            label: '普通文字(行级)',
            value: 'div'
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
    onChange: function (value, oldValue, model, form) {
        (!value || !oldValue) && form.setValueByName('tpl', '');
    }
});
var TplPlugin = /** @class */ (function (_super) {
    __extends(TplPlugin, _super);
    function TplPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'tpl';
        _this.$schema = '/schemas/TplSchema.json';
        // 组件名称
        _this.name = '文字';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-file-o';
        _this.description = '用来展示文字或者段落，支持模板语法可用来关联动态数据。';
        _this.docLink = '/amis/zh-CN/components/tpl';
        _this.tags = ['展示'];
        _this.previewSchema = {
            type: 'tpl',
            tpl: '这是模板内容当前时间<%- new Date() %>'
        };
        _this.scaffold = {
            type: 'tpl',
            tpl: '请编辑内容',
            inline: false,
            wrapperComponent: 'span'
        };
        _this.panelTitle = '文字';
        _this.panelJustify = true;
        _this.panelBodyCreator = function (context) {
            // 在表格/CRUD/模型列表的一列里边
            var isInTable = /\/cell\/field\/tpl$/.test(context.path);
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    body: getSchemaTpl('collapseGroup', [
                        {
                            title: '基本',
                            body: [
                                !isInTable ? getSchemaTpl('tpl:wrapperComponent') : null,
                                getSchemaTpl('tpl:content'),
                                getSchemaTpl('tpl:rich-text')
                            ]
                        },
                        getSchemaTpl('status')
                    ])
                },
                {
                    title: '外观',
                    body: getSchemaTpl('collapseGroup', __spreadArray(__spreadArray([
                        {
                            title: '布局',
                            body: [
                                getSchemaTpl('switch', {
                                    label: tipedLabel('内联模式', '内联模式采用 <code>span</code> 标签、非内联将采用 <code>div</code> 标签作为容器。'),
                                    name: 'inline',
                                    pipeIn: defaultValue(true)
                                })
                            ]
                        }
                    ], getSchemaTpl('style:common', ['layout']), true), [
                        getSchemaTpl('style:classNames', {
                            isFormItem: false
                        })
                    ], false))
                }
            ]);
        };
        _this.popOverBody = [
            getSchemaTpl('tpl:content'),
            getSchemaTpl('tpl:rich-text'),
            getSchemaTpl('tpl:wrapperComponent')
        ];
        return _this;
    }
    return TplPlugin;
}(BasePlugin));
export { TplPlugin };
registerEditorPlugin(TplPlugin);
