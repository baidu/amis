/**
 * @file 日志组件
 */
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {getSchemaTpl, tipedLabel} from 'amis-editor-core';

export class LogPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'log';
  $schema = '/schemas/LogSchema.json';

  // 组件名称
  name = '日志';
  isBaseComponent = true;
  icon = 'fa fa-file-text-o';
  pluginIcon = 'log-plugin';
  description = '用来实时显示日志';
  docLink = '/amis/zh-CN/components/log';
  tags = ['展示'];
  previewSchema = {
    type: 'log',
    height: 120,
    autoScroll: true
  };
  scaffold: any = {
    type: 'log',
    autoScroll: true,
    height: 500,
    encoding: 'utf-8'
  };
  panelJustify = true;
  panelTitle = '日志';
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;
    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('apiControl', {
                required: true,
                name: 'source',
                renderLabel: true,
                label: tipedLabel('数据源', `返回日志信息的服务，后端需要通过流的方式返回结果。
                  可参考<a target="_blank" href="https://baidu.github.io/amis/zh-CN/components/log#%E5%90%8E%E7%AB%AF%E5%AE%9E%E7%8E%B0%E5%8F%82%E8%80%83">示例</a>`)
              }),
              {
                type: 'input-text',
                label: tipedLabel('文本编码', '返回内容的字符编码，例如 UTF-8、ISO-8859-2、KOI8-R、GBK等等。默认UTF-8'),
                name: 'encoding'
              },
              getSchemaTpl('placeholder', {
                label: '加载提示',
                placeholder: '加载中'
              }),
              {
                type: 'switch',
                label: tipedLabel('跟随底部', '自动滚动到底部，方便查看最新日志内容'),
                name: 'autoScroll',
                value: true,
                inputClassName: 'is-inline'
              },
              {
                label: tipedLabel('操作', '可在日志顶部添加以下操作按钮'),
                type: 'checkboxes',
                name: 'operation',
                inline: false,
                options: [
                  {
                    label: '停止',
                    value: 'stop'
                  },
                  {
                    label: '刷新',
                    value: 'restart'
                  },
                  {
                    label: '清空',
                    value: 'clear'
                  },
                  {
                    label: '隐藏行号',
                    value: 'showLineNumber'
                  },
                  {
                    label: '查询',
                    value: 'filter'
                  }
                ]
              }
            ]
          },
          {
            title: '性能优化',
            body: [
              {
                type: 'input-number',
                label: tipedLabel('每行高度', `设置每行高度，这时就会默认启用虚拟渲染，避免渲染卡顿。
                    <ul><li>优点：仍然可以查看所有日志</li>
                    <li>缺点：如果某一行日志很长也不会自动折行，会出现水平滚动条</li></ul>
                `),
                name: 'rowHeight',
                min: 1
              },
              {
                type: 'input-number',
                label: tipedLabel('显示行数', `限制最大显示行数，避免渲染卡顿，默认不限制。
                    <ul><li>优点：某一行日志很长的时候会自动折行</li>
                    <li>缺点：无法查看之前的日志</li></ul>
                `),
                name: 'maxLength',
                min: 1
              }
            ]
          },
          getSchemaTpl('status', {isFormItem: false})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'input-number',
                label: tipedLabel('高度', '展示区域高度'),
                name: 'height',
                min: 1
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false
          })
        ])
      }
    ]);
  };
}

registerEditorPlugin(LogPlugin);
