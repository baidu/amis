import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  RendererInfo,
  VRendererConfig
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import React from 'react';
import {VRenderer} from 'amis-editor-core';
import {mapReactElement} from 'amis-editor-core';
import {RegionWrapper as Region} from 'amis-editor-core';

import {
  RendererPluginAction,
  RendererPluginEvent
} from 'amis-editor-core';
import {getEventControlConfig} from '../util';
import { getArgsWrapper } from '../renderer/event-control/helper';

export class WizardPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'wizard';
  $schema = '/schemas/WizardSchema.json';

  name = '向导';
  isBaseComponent = true;
  description =
    '表单向导，可以将复杂的多个表单项拆分成多个步骤，一步一步指引用户完成填写。';
  docLink = '/amis/zh-CN/components/wizard';
  tags = ['功能'];
  icon = 'fa fa-list-ol';

  scaffold = {
    type: 'wizard',
    steps: [
      {
        title: '第一步',
        body: [
          {
            type: 'input-text',
            label: '文本',
            name: 'var1'
          }
        ]
      },

      {
        title: '第二步',
        body: [
          {
            type: 'input-text',
            label: '文本2',
            name: 'var2'
          }
        ]
      }
    ]
  };

  previewSchema = {
    type: 'wizard',
    className: 'text-left m-b-none',
    steps: [
      {
        title: '第一步',
        body: [
          {
            type: 'input-text',
            label: '文本',
            name: 'var1'
          }
        ]
      },

      {
        title: '第二步',
        body: []
      }
    ]
  };

  // 事件定义
  events: RendererPluginEvent[] = [
    {
      eventName: 'inited',
      eventLabel: '初始化完成',
      description: '远程初始化接口请求成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: 'initApi 远程请求返回的初始化数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'finished',
      eventLabel: '点击完成',
      description: '最终提交时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '提交的表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'stepChange',
      eventLabel: '步骤切换',
      description: '切换步骤时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.step': {
              type: 'string',
              title: '步骤索引'
            }
          }
        }
      ]
    },
    {
      eventName: 'change',
      eventLabel: '数值变化',
      description: '表单值变化时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '当前表单数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitSucc',
      eventLabel: '提交成功',
      description: '最终提交成功时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data': {
              type: 'object',
              title: '提交成功后返回的数据'
            }
          }
        }
      ]
    },
    {
      eventName: 'submitFail',
      eventLabel: '提交失败',
      description: '最终提交失败时触发',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.error': {
              type: 'object',
              title: '提交失败后返回的错误信息'
            }
          }
        }
      ]
    },
    {
      eventName: 'stepSubmitSucc',
      eventLabel: '步骤提交成功',
      description: '单个步骤提交成功'
    },
    {
      eventName: 'stepSubmitFail',
      eventLabel: '步骤提交失败',
      description: '单个步骤提交失败',
      dataSchema: [
        {
          type: 'object',
          properties: {
            'event.data.error': {
              type: 'object',
              title: '单个步骤提交失败后返回的错误信息'
            }
          }
        }
      ]
    }
  ];

  // 动作定义
  actions: RendererPluginAction[] = [
    {
      actionType: 'submit',
      actionLabel: '全部提交',
      description: '提交全部数据'
    },
    {
      actionType: 'stepSubmit',
      actionLabel: '分步提交',
      description: '提交当前步骤数据',
      desc: (info: any) => {
        return (
          <div>
            <span className="variable-right">{info?.__rendererLabel}</span>
            提交当前步骤数据
          </div>
        );
      }
    },
    {
      actionType: 'prev',
      actionLabel: '上一步',
      description: '返回上一步'
    },
    {
      actionType: 'next',
      actionLabel: '下一步',
      description: '提交当前步骤数据'
    },
    {
      actionType: 'goto-step',
      actionLabel: '定位步骤',
      description: '切换到指定步骤',
      config: ['step'],
      desc: (info: any) => {
        return (
          <div>
            <span className="variable-right">{info?.__rendererLabel}</span>
            切换到第
            <span className="variable-left variable-right">
              {info?.args?.step}
            </span>
            步
          </div>
        );
      },
      schema: getArgsWrapper([
        {
          type: 'input-formula',
          variables: '${variables}',
          evalMode: false,
          required: true,
          variableMode: 'tabs',
          label: '目标步骤',
          size: 'lg',
          name: 'step',
          mode: 'horizontal'
        }
      ])
    },
    {
      actionType: 'reload',
      actionLabel: '重新加载',
      description: '触发组件数据刷新并重新渲染'
    },
    {
      actionType: 'setValue',
      actionLabel: '更新数据',
      description: '触发组件数据更新'
    }
  ];

  panelTitle = '向导';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            {
              name: 'steps',
              label: '步骤设置',
              type: 'combo',
              multiple: true,
              multiLine: true,
              addButtonText: '新增一步',
              scaffold: {
                title: '标题',
                items: [
                  {
                    type: 'input-text',
                    name: 'var1',
                    label: '文本'
                  }
                ]
              },
              items: [
                {
                  name: 'title',
                  type: 'input-text',
                  label: '标题',
                  pipeIn: (value: any, data: any) => value || data.label
                },

                {
                  type: 'fieldSet',
                  title: '其他设置',
                  collapsed: true,
                  collapsable: true,
                  className: 'fieldset m-b-none',
                  body: [
                    {
                      name: 'mode',
                      label: '展示模式',
                      type: 'button-group-select',
                      size: 'xs',
                      mode: 'inline',
                      className: 'w-full',
                      value: 'normal',
                      options: [
                        {
                          label: '默认',
                          value: 'normal'
                        },
                        {
                          label: '左右摆放',
                          value: 'horizontal'
                        },
                        {
                          label: '内联',
                          value: 'inline'
                        }
                      ]
                    },

                    getSchemaTpl('horizontal', {
                      visibleOn: 'data.mode == "horizontal"'
                    }),

                    getSchemaTpl('api', {
                      label: '保存接口',
                      description:
                        '如果接口返回了 <code>step</code> 变量，且数值是数字类型，比如 <code>3</code>，提交完后回跳到第 3 步'
                    }),

                    getSchemaTpl('switch', {
                      label: '采用异步方式?',
                      name: 'asyncApi',
                      visibleOn: 'data.api',
                      labelRemark: {
                        trigger: 'click',
                        rootClose: true,
                        title: '什么是异步方式？',
                        content:
                          '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                        placement: 'left'
                      },
                      pipeIn: (value: any) => value != null,
                      pipeOut: (value: any) => (value ? '' : undefined)
                    }),

                    getSchemaTpl('api', {
                      name: 'asyncApi',
                      label: '异步检测接口',
                      visibleOn: 'data.asyncApi != null',
                      description:
                        '设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                    }),

                    {
                      type: 'divider'
                    },

                    getSchemaTpl('api', {
                      name: 'initApi',
                      label: '初始化接口',
                      description: '用来初始化表单数据'
                    }),

                    getSchemaTpl('switch', {
                      label: '采用异步方式？',
                      name: 'initAsyncApi',
                      visibleOn: 'data.initApi',
                      labelRemark: {
                        trigger: 'click',
                        rootClose: true,
                        title: '什么是异步方式？',
                        content:
                          '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                        placement: 'left'
                      },
                      pipeIn: (value: any) => value != null,
                      pipeOut: (value: any) => (value ? '' : undefined)
                    }),

                    getSchemaTpl('api', {
                      name: 'initAsyncApi',
                      label: '异步检测接口',
                      visibleOn: 'data.initAsyncApi != null',
                      description:
                        '设置此属性后，表单请求 initApi 后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
                    }),

                    getSchemaTpl('initFetch'),

                    {
                      label: '是否可被点开',
                      type: 'input-text',
                      name: 'jumpableOn',
                      description:
                        '用表达式来决定，当前步骤是否可被点开。额外可用变量：currentStep 表示当前步骤。'
                    }
                  ]
                }
              ]
            },
            {
              type: 'input-text',
              name: 'startStep',
              label: '起始默认值',
              description:
                '从第几步开始。可支持模版，但是只有在组件创建时渲染模版并设置当前步数，在之后组件被刷新时，当前step不会根据startStep改变'
            }
          ]
        },

        {
          title: '接口',
          body: [
            getSchemaTpl('api', {
              name: 'initApi',
              label: '初始化接口',
              description:
                '用来初始化向导数据，当接口中返回 <code>step</code> 字段时，可以控制默认跳转到第几步，注意数值一定得是数字类型。当返回 <code>submiting</code> 并且当前步骤中存在异步保存接口时，可以让 wizard 初始进入异步提交状态。'
            }),

            getSchemaTpl('switch', {
              label: '采用异步方式？',
              name: 'initAsyncApi',
              visibleOn: 'data.initApi',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: '什么是异步方式？',
                content:
                  '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                placement: 'left'
              },

              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('api', {
              name: 'initAsyncApi',
              label: '异步检测接口',
              visibleOn: 'data.initAsyncApi != null',
              description:
                '设置此属性后，表单请求 initApi 后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
            }),

            {
              name: 'initFetch',
              type: 'radios',
              label: '是否初始拉取',
              inline: true,
              onChange: () => {},
              options: [
                {
                  label: '是',
                  value: true
                },

                {
                  label: '否',
                  value: false
                },

                {
                  label: '表达式',
                  value: ''
                }
              ]
            },

            {
              name: 'initFetch',
              autoComplete: false,
              visibleOn: 'typeof this.initFetch !== "boolean"',
              type: 'input-text',
              placeholder: '',
              className: 'm-t-n-sm'
            },

            {
              type: 'divider'
            },

            getSchemaTpl('api', {
              label: '保存接口',
              description:
                '用来保存表单数据, 最后一步点击完成触发，<code>如果最后一步中已经设置保存接口，则此处设置无效。</code>'
            }),

            getSchemaTpl('switch', {
              label: '采用异步方式?',
              name: 'asyncApi',
              visibleOn: 'data.api',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: '什么是异步方式？',
                content:
                  '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('api', {
              name: 'asyncApi',
              label: '异步检测接口',
              visibleOn: 'data.asyncApi != null',
              description:
                '设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
            })
          ]
        },

        {
          title: '外观',
          body: [
            {
              name: 'mode',
              label: '展示模式',
              type: 'button-group-select',
              size: 'sm',
              mode: 'inline',
              className: 'w-full',
              value: 'horizontal',
              options: [
                {
                  label: '水平',
                  value: 'horizontal'
                },

                {
                  label: '垂直',
                  value: 'vertical'
                }
              ]
            },

            {
              name: 'actionPrevLabel',
              label: '上一步按钮名称',
              type: 'input-text',
              pipeIn: defaultValue('上一步')
            },

            {
              name: 'actionNextLabel',
              label: '下一步按钮名称',
              type: 'input-text',
              pipeIn: defaultValue('下一步')
            },

            {
              name: 'actionNextSaveLabel',
              label: '保存并下一步按钮名称',
              type: 'input-text',
              pipeIn: defaultValue('保存并下一步')
            },

            {
              name: 'actionFinishLabel',
              label: '完成按钮名称',
              type: 'input-text',
              pipeIn: defaultValue('完成')
            },

            // {
            //   type: 'alert',
            //   level: 'info',
            //   body: `温馨提示：操作按钮每个步骤可以单独配置，请在右侧切换到需要单独配置的步骤后，点击下方的【自定义按钮】定制。`
            // },

            getSchemaTpl('className'),
            getSchemaTpl('className', {
              name: 'actionClassName',
              label: '按钮 CSS 类名'
            })
          ]
        },

        {
          title: '其他',
          body: [
            getSchemaTpl('ref'),
            getSchemaTpl('name'),
            getSchemaTpl('reload'),

            {
              label: '跳转',
              name: 'redirect',
              type: 'input-text',
              description: '当设置此值后，表单提交完后跳转到目标地址。'
            },

            getSchemaTpl('visible')
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
      ])
    ];
  };

  /**
   * 补充切换的 toolbar
   * @param context
   * @param toolbars
   */
  buildEditorToolbar(
    context: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (
      context.info.plugin === this &&
      context.info.renderer.name === this.rendererName &&
      !context.info.hostId
    ) {
      const node = context.node;

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-left',
        tooltip: '上个步骤',
        onClick: () => {
          const control = node.getComponent();

          if (control?.gotoStep) {
            const currentIndex = control.state.currentStep;
            control.gotoStep(currentIndex - 1);
          }
        }
      });

      toolbars.push({
        level: 'secondary',
        icon: 'fa fa-chevron-right',
        tooltip: '下个步骤',
        onClick: () => {
          const control = node.getComponent();

          if (control?.gotoStep) {
            const currentIndex = control.state.currentStep;
            control.gotoStep(currentIndex + 1);
          }
        }
      });
    }
  }

  filterProps(props: any) {
    props.affixFooter = false;

    return props;
  }

  patchContainers = ['steps.body'];
  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '表单集合',
        wrapperResolve: (dom: HTMLElement) => dom
      },
      actions: {
        label: '按钮组',
        key: 'actions',
        preferTag: '按钮',
        wrapperResolve: (dom: HTMLElement) => dom
      }
    },
    panelTitle: '步骤',
    panelBodyCreator: (context: BaseEventContext) => {
      return getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            {
              name: 'title',
              type: 'input-text',
              label: '标题',
              pipeIn: (value: any, data: any) => value || data.label
            },
            getSchemaTpl('api', {
              label: '保存接口',
              description:
                '如果接口返回了 <code>step</code> 变量，且数值是数字类型，比如 <code>3</code>，提交完后回跳到第 3 步'
            }),

            getSchemaTpl('switch', {
              label: '采用异步方式?',
              name: 'asyncApi',
              visibleOn: 'data.api',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: '什么是异步方式？',
                content:
                  '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('api', {
              name: 'asyncApi',
              label: '异步检测接口',
              visibleOn: 'data.asyncApi != null',
              description:
                '设置此属性后，表单提交发送保存接口后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
            }),
            {
              type: 'divider'
            },
            getSchemaTpl('api', {
              name: 'initApi',
              label: '初始化接口',
              description: '用来初始化表单数据'
            }),

            getSchemaTpl('switch', {
              label: '采用异步方式？',
              name: 'initAsyncApi',
              visibleOn: 'data.initApi',
              labelRemark: {
                trigger: 'click',
                rootClose: true,
                title: '什么是异步方式？',
                content:
                  '异步方式主要用来解决请求超时问题，启用异步方式后，程序会在请求完后，定时轮询请求额外的接口用来咨询操作是否完成。所以接口可以快速的返回，而不需要等待流程真正完成。',
                placement: 'left'
              },
              pipeIn: (value: any) => value != null,
              pipeOut: (value: any) => (value ? '' : undefined)
            }),

            getSchemaTpl('api', {
              name: 'initAsyncApi',
              label: '异步检测接口',
              visibleOn: 'data.initAsyncApi != null',
              description:
                '设置此属性后，表单请求 initApi 后，还会继续轮训请求该接口，直到返回 finished 属性为 true 才 结束'
            }),
            getSchemaTpl('initFetch')
          ]
        },
        {
          title: '外观',
          body: [
            {
              name: 'mode',
              label: '展示模式',
              type: 'button-group-select',
              size: 'xs',
              mode: 'inline',
              className: 'w-full',
              value: 'normal',
              options: [
                {
                  label: '默认',
                  value: 'normal'
                },
                {
                  label: '左右摆放',
                  value: 'horizontal'
                },
                {
                  label: '内联',
                  value: 'inline'
                }
              ]
            },
            getSchemaTpl('horizontal', {
              visibleOn: 'data.mode == "horizontal"'
            })
            // getSchemaTpl('className', {
            //   name: 'tabClassName',
            //   label: '选项卡成员 CSS 类名'
            // })
          ]
        },
        {
          title: '其他',
          body: [
            {
              label: '是否可被点开',
              type: 'input-text',
              name: 'jumpableOn',
              description:
                '用表达式来决定，当前步骤是否可被点开。额外可用变量：currentStep 表示当前步骤。'
            }
          ]
        }
      ]);
    }
  };

  wizardWrapperResolve = (dom: HTMLElement) =>
    [].slice.call(
      dom.querySelectorAll('[role="wizard-body"],[role="wizard-footer"]')
    );
  overrides = {
    renderWizard: function (this: any) {
      const info: RendererInfo = this.props.$$editor;
      const steps = this.props.steps;
      const currentStep = this.state.currentStep;
      const dom = this.super();

      if (!info || !steps?.[currentStep - 1]) {
        return dom;
      }

      const index = currentStep - 1;
      const step = steps[index];
      const id = step.$$id;
      const plugin: WizardPlugin = info.plugin as any;

      return mapReactElement(dom, (child: JSX.Element) => {
        if (/Wizard-step\b/.test(child.props.className)) {
          return (
            <VRenderer
              key={id}
              type={info.type}
              plugin={info.plugin}
              renderer={info.renderer}
              $schema="/schemas/WizardStepSchema.json"
              hostId={info.id}
              memberIndex={index}
              name={step.title || `步骤${index + 1}`}
              id={id}
              draggable={false}
              wrapperResolve={plugin.wizardWrapperResolve}
              schemaPath={`${info.schemaPath}/steps/${index}`}
              path={`${this.props.$path}/${index}`} // 好像没啥用
              data={this.props.data} // 好像没啥用
            >
              {mapReactElement(child, (child2: any, index: number) => {
                if (child2.props.schema?.body && child2.props.schema.$$id) {
                  const region = plugin.vRendererConfig?.regions?.body;

                  if (!region) {
                    return child2;
                  }

                  const schema = {
                    ...child2.props.schema
                  };
                  delete schema.$$id;
                  return (
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={React.cloneElement(child2, {
                        schema: schema
                      })}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  );
                }

                return child2;
              })}
            </VRenderer>
          );
        }

        return child;
      });
    },

    renderFooter: function (this: any) {
      const info: RendererInfo = this.props.$$editor;
      const steps = this.props.steps;
      const currentStep = this.state.currentStep;
      const dom = this.super();

      if (!info || !steps?.[currentStep - 1]) {
        return dom;
      }

      const plugin: WizardPlugin = info.plugin as any;
      const region = plugin.vRendererConfig?.regions?.actions;

      if (!region) {
        return dom;
      }

      return (
        <Region
          key={region.key}
          preferTag={region.preferTag}
          name={region.key}
          label={region.label}
          regionConfig={region}
          placeholder={region.placeholder}
          editorStore={plugin.manager.store}
          manager={plugin.manager}
          children={dom}
          wrapperResolve={region.wrapperResolve}
          rendererName={info.renderer.name}
        />
      );
    }
  };
}

registerEditorPlugin(WizardPlugin);
