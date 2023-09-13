import {
  BaseEventContext,
  getI18nEnabled,
  registerEditorPlugin
} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';

export class TasksPlugin extends BasePlugin {
  static id = 'TasksPlugin';
  // 关联渲染器名字
  rendererName = 'tasks';
  $schema = '/schemas/TasksSchema.json';

  // 组件名称
  name = '异步任务';
  isBaseComponent = true;
  description = '用来做异步任务呈现或者操作。';
  docLink = '/amis/zh-CN/components/tasks';
  tags = ['功能'];
  icon = '';
  pluginIcon = 'tasks-plugin';
  scaffold = {
    type: 'tasks',
    name: 'tasks',
    items: [
      {
        label: 'hive 任务',
        key: 'hive',
        status: 4,
        remark:
          '查看详情<a target="_blank" href="http://www.baidu.com">日志</a>。'
      },
      {
        label: '小流量',
        key: 'partial',
        status: 4
      },
      {
        label: '全量',
        key: 'full',
        status: 4
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '异步任务';
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          getSchemaTpl('layout:originPosition', {value: 'left-top'}),
          {
            name: 'items',
            label: '初始任务信息',
            type: 'combo',
            multiple: true,
            multiLine: true,
            items: [
              getSchemaTpl('label', {
                label: '任务名称'
              }),
              {
                name: 'key',
                type: 'input-text',
                label: '任务ID'
              },
              {
                name: 'status',
                type: 'input-number',
                label: '任务状态'
              },
              getSchemaTpl('taskRemark')
            ],
            addButtonText: '新增任务信息',
            scaffold: {
              label: '名称',
              key: 'key',
              status: 0,
              remark: '说明'
            },
            description: '可以不设置，如果检测接口返回这些信息的话。'
          },

          getSchemaTpl('api', {
            name: 'checkApi',
            label: '状态检测接口'
          }),

          {
            name: 'interval',
            type: 'input-number',
            min: 3000,
            step: 500,
            visibleOn: 'data.checkApi',
            pipeIn: defaultValue(3000),
            label: '定时检测间隔'
          },

          getSchemaTpl('api', {
            name: 'submitApi',
            label: '提交接口'
          }),

          getSchemaTpl('api', {
            name: 'reSubmitApi',
            label: '重试接口'
          }),

          getSchemaTpl('loadingConfig', {}, {context}),

          {
            type: 'divider'
          },

          getSchemaTpl('taskNameLabel'),

          getSchemaTpl('operationLabel'),

          getSchemaTpl('statusLabel'),

          getSchemaTpl('remarkLabel'),

          {
            name: 'btnText',
            label: '按钮名称',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            pipeIn: defaultValue('上线')
          },

          {
            name: 'retryBtnText',
            label: '重试按钮名称',
            type: i18nEnabled ? 'input-text-i18n' : 'input-text',
            pipeIn: defaultValue('重试')
          },

          {
            name: 'statusTextMap',
            pipeIn: defaultValue([
              '未开始',
              '就绪',
              '进行中',
              '出错',
              '已完成',
              '出错'
            ]),
            type: 'input-array',
            label: '状态标签文字配置',
            multiple: true,
            addable: false,
            removable: false,
            items: getSchemaTpl('inputArrayItem')
          },

          {
            name: 'initialStatusCode',
            label: '初始状态码',
            pipeIn: defaultValue(0),
            type: 'input-number'
          },

          {
            name: 'readyStatusCode',
            label: '就绪状态码',
            pipeIn: defaultValue(1),
            type: 'input-number'
          },

          {
            name: 'loadingStatusCode',
            label: '进行中状态码',
            pipeIn: defaultValue(2),
            type: 'input-number'
          },

          {
            name: 'errorStatusCode',
            label: '错误状态码',
            pipeIn: defaultValue(3),
            type: 'input-number'
          },

          {
            name: 'finishStatusCode',
            label: '完成状态码',
            pipeIn: defaultValue(4),
            type: 'input-number'
          },

          {
            name: 'canRetryStatusCode',
            label: '出错但可重试状态码',
            pipeIn: defaultValue(5),
            type: 'input-number'
          }
        ]
      },
      {
        title: '外观',
        body: [
          getSchemaTpl('className', {
            pipeIn: defaultValue('b-a bg-white table-responsive')
          }),

          getSchemaTpl('className', {
            name: 'tableClassName',
            label: '表格 CSS 类名',
            pipeIn: defaultValue('table table-striped m-b-none')
          }),

          getSchemaTpl('className', {
            name: 'btnClassName',
            label: '按钮 CSS 类名',
            pipeIn: defaultValue('btn-sm btn-default')
          }),

          getSchemaTpl('className', {
            name: 'retryBtnClassName',
            label: '重试按钮 CSS 类名',
            pipeIn: defaultValue('btn-sm btn-danger')
          }),

          {
            name: 'statusLabelMap',
            pipeIn: defaultValue([
              'label-warning',
              'label-info',
              'label-info',
              'label-danger',
              'label-success',
              'label-danger'
            ]),
            type: 'input-array',
            label: '状态标签 CSS 类名配置',
            multiple: true,
            addable: false,
            removable: false,
            items: {
              type: 'input-text',
              placeholder: 'CSS 类名'
            }
          }
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('visible')]
      }
    ]);
  };
}

registerEditorPlugin(TasksPlugin);
