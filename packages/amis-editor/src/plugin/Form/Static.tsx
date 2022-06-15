import React from 'react';
import {Button} from 'amis';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {registerEditorPlugin} from 'amis-editor-core';
import {BaseEventContext, BasePlugin} from 'amis-editor-core';
import {EditorNodeType} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';
import {tipedLabel} from '../../component/BaseControl';
import {ValidatorTag} from '../../validator';
import {getEventControlConfig} from '../../util';

export class StaticControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'static';
  $schema = '/schemas/StaticControlSchema.json';

  order = -390;

  // 组件名称
  name = '静态展示框';
  isBaseComponent = true;
  icon = 'fa fa-info';
  description = `纯用来展示数据，可用来展示<code>json、date、image、progress</code>等数据`;
  docLink = '/amis/zh-CN/components/form/static';
  tags = ['表单项'];
  scaffold = {
    type: 'static',
    label: '描述'
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold,
        value: '静态值'
      }
    ]
  };
  multifactor = true;

  notRenderFormZone = true;

  panelTitle = '静态展示';
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('formItemName', {
                required: false
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('value'),
              getSchemaTpl('valueFormula', {
                rendererSchema: {
                  ...context?.schema,
                  type: 'textarea', // 改用多行文本编辑
                  value: context?.schema.tpl, // 避免默认值丢失
                },
                mode: 'vertical', // 改成上下展示模式
                name: 'tpl'
              }),
              getSchemaTpl('switch', {
                name: 'quickEdit',
                label: '可快速编辑',
                pipeIn: (value: any) => !!value
              }),
              {
                label: '快速编辑模式',
                name: 'quickEdit.mode',
                type: 'button-group-select',
                size: 'sm',
                mode: 'row',
                className: 'ae-buttonGroupSelect--justify',
                visibleOn: 'data.quickEdit',
                pipeIn: defaultValue('popOver'),
                options: [
                  {
                    label: '下拉',
                    value: 'popOver'
                  },
                  {
                    label: '内嵌',
                    value: 'inline'
                  }
                ]
              },
              getSchemaTpl('switch', {
                name: 'quickEdit.saveImmediately',
                label: '立即保存',
                visibleOn: 'data.quickEdit',
                description: '开启后修改即提交，而不是标记修改批量提交。',
                descriptionClassName: 'help-block m-b-none',
                pipeIn: (value: any) => !!value
              }),
              getSchemaTpl('apiControl', {
                name: 'quickEdit.saveImmediately.api',
                label: '立即保存接口',
                description:
                  '是否单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
                visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
              }),
              {
                name: 'quickEdit',
                asFormItem: true,
                visibleOn: 'data.quickEdit',
                children: ({value, onChange, data}: any) => {
                  if (value === true) {
                    value = {};
                  }

                  const originMode = value.mode;

                  value = {
                    type: 'input-text',
                    name: data.name,
                    ...value
                  };
                  delete value.mode;

                  // todo 多个快速编辑表单模式看来只能代码模式编辑了。

                  return (
                    <Button
                      className="m-b ae-Button--enhance"
                      size="sm"
                      block
                      onClick={() => {
                        this.manager.openSubEditor({
                          title: '配置快速编辑类型',
                          value: value,
                          slot: {
                            type: 'form',
                            mode: 'normal',
                            body: ['$$'],
                            wrapWithPanel: false
                          },
                          onChange: value =>
                            onChange(
                              {
                                ...value,
                                mode: originMode
                              },
                              'quickEdit'
                            )
                        });
                      }}
                    >
                      配置快速编辑
                    </Button>
                  );
                }
              },
              getSchemaTpl('switch', {
                name: 'popOver',
                label: '查看更多展示',
                pipeIn: (value: any) => !!value
              }),
              {
                label: '弹出模式',
                name: 'popOver.mode',
                type: 'button-group-select',
                size: 'sm',
                mode: 'row',
                className: 'ae-buttonGroupSelect--justify',
                visibleOn: 'data.popOver',
                pipeIn: defaultValue('popOver'),
                options: [
                  {
                    label: '浮层',
                    value: 'popOver'
                  },

                  {
                    label: '弹框',
                    value: 'dialog'
                  },

                  {
                    label: '抽屉',
                    value: 'drawer'
                  }
                ]
              },
              {
                name: 'popOver.position',
                label: '浮层位置',
                type: 'select',
                mode: 'row',
                visibleOn: 'data.popOver && data.popOver.mode === "popOver"',
                pipeIn: defaultValue('center'),
                options: [
                  {
                    label: '目标中部',
                    value: 'center'
                  },

                  {
                    label: '目标左上角',
                    value: 'left-top'
                  },

                  {
                    label: '目标右上角',
                    value: 'right-top'
                  },

                  {
                    label: '目标左下角',
                    value: 'left-bottom'
                  },

                  {
                    label: '目标右下角',
                    value: 'right-bottom'
                  },

                  {
                    label: '页面左上角',
                    value: 'fixed-left-top'
                  },

                  {
                    label: '页面右上角',
                    value: 'fixed-right-top'
                  },

                  {
                    label: '页面左下角',
                    value: 'fixed-left-bottom'
                  },

                  {
                    label: '页面右下角',
                    value: 'fixed-right-bottom'
                  }
                ]
              },
              {
                visibleOn: 'data.popOver',
                name: 'popOver',
                asFormItem: true,
                children: ({value, onChange}: any) => {
                  value = {
                    type: 'panel',
                    title: '查看详情',
                    body: '内容详情',
                    ...value
                  };

                  return (
                    <Button
                      className="m-b ae-Button--enhance"
                      size="sm"
                      block
                      onClick={() => {
                        this.manager.openSubEditor({
                          title: '配置查看更多展示内容',
                          value: value,
                          onChange: value => onChange(value, 'quickEdit')
                        });
                      }}
                    >
                      查看更多内容配置
                    </Button>
                  );
                }
              },
              getSchemaTpl('borderMode'),
              getSchemaTpl('switch', {
                name: 'copyable',
                label: '可复制',
                pipeIn: (value: any) => !!value
              }),

              {
                label: '复制内容模板',
                name: 'copyable.content',
                type: 'textarea',
                mode: 'row',
                maxRow: 2,
                visibleOn: 'data.copyable',
                description: '默认为当前字段值，可定制。'
              },
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
              /*{
                  children: (
                    <Button
                      size="sm"
                      level="info"
                      className="m-b"
                      block
                      onClick={this.exchangeRenderer.bind(this, context.id)}
                    >
                      更改渲染器类型
                    </Button>
                  )
              },*/
            ]
          },
          getSchemaTpl('status', {isFormItem: true}),
          getSchemaTpl('validation', {tag: '1'})
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          {
            title: 'CSS类名',
            body: [
              getSchemaTpl('className', {
                label: '整体'
              }),
              getSchemaTpl('className', {
                label: '标签',
                name: 'labelClassName'
              }),
              getSchemaTpl('className', {
                label: '控件',
                name: 'inputClassName'
              }),
              getSchemaTpl('className', {
                label: '描述',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ]
          }
        ])
      }
    ]);
  };

  filterProps(props: any, node: EditorNodeType) {
    props.$$id = node.id;

    if (typeof props.value === 'undefined') {
      props.value = mockValue(props);
    }
    return props;
  }

  /*exchangeRenderer(id: string) {
    this.manager.showReplacePanel(id, '展示');
  }*/
}

registerEditorPlugin(StaticControlPlugin);
