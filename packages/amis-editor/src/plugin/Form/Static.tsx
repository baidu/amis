import React from 'react';
import {Button} from 'amis';
import {get, clone} from 'lodash';
import {
  defaultValue,
  getSchemaTpl,
  setSchemaTpl,
  registerEditorPlugin,
  BaseEventContext,
  BasePlugin,
  EditorNodeType,
  mockValue,
  tipedLabel
} from 'amis-editor-core';
import {getVariable} from 'amis-core';

// 快速编辑
setSchemaTpl('quickEdit', (patch: any, manager: any) => ({
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'quickEdit',
  label: '可快速编辑',
  value: false,
  hiddenOnDefault: true,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  isChecked: (e: any) => {
    const {data, name} = e;
    return !!get(data, name);
  },
  form: {
    body: [
      {
        label: '编辑模式',
        name: 'quickEdit.mode',
        type: 'button-group-select',
        inputClassName: 'items-center',
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
        label: tipedLabel(
          '立即保存',
          '开启后修改即提交，而不是标记修改批量提交。'
        ),
        visibleOn: 'data.quickEdit',
        pipeIn: (value: any) => !!value
      }),
      getSchemaTpl('apiControl', {
        name: 'quickEdit.saveImmediately.api',
        label: '保存接口',
        mode: 'row',
        description:
          '单独给立即保存配置接口，如果不配置，则默认使用quickSaveItemApi。',
        visibleOn: 'this.quickEdit && this.quickEdit.saveImmediately'
      }),
      {
        name: 'quickEdit',
        asFormItem: true,
        visibleOn: 'data.quickEdit',
        mode: 'row',
        children: ({value, onChange, data}: any) => {
          // 打开快速编辑面板默认显示
          if (value === true || !value?.type) {
            value = {
              type: 'container',
              body: [
                {
                  type: 'input-text',
                  name: data.key
                }
              ]
            };
          } else {
            // 获取quickEdit属性值
            value = clone(getVariable(data, 'quickEdit'));
          }
          const originMode = value?.mode || 'popOver';

          if (value?.mode) {
            delete value.mode;
          }

          if (!value.body) {
            value = {
              type: 'container',
              body: [
                {
                  ...value,
                  mode: 'normal'
                }
              ]
            };
          }
          // todo 多个快速编辑表单模式看来只能代码模式编辑了。
          return (
            <Button
              level="info"
              className="m-b"
              size="sm"
              block
              onClick={() => {
                manager.openSubEditor({
                  title: '配置快速编辑类型',
                  value: value,
                  onChange: (value: any) =>
                    onChange({...value, mode: originMode}, 'quickEdit')
                });
              }}
            >
              配置快速编辑
            </Button>
          );
        }
      }
    ]
  }
}));

// 可复制
setSchemaTpl('copyable', {
  type: 'ae-switch-more',
  mode: 'normal',
  name: 'copyable',
  label: '可复制',
  value: false,
  hiddenOnDefault: true,
  formType: 'extend',
  pipeIn: (value: any) => !!value,
  form: {
    body: [
      {
        label: '复制内容模板',
        name: 'copyable.content',
        type: 'textarea',
        mode: 'row',
        maxRow: 2,
        visibleOn: 'data.copyable',
        description: '默认为当前字段值，可定制。'
      }
    ]
  }
});

export class StaticControlPlugin extends BasePlugin {
  static id = 'StaticControlPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'static';
  $schema = '/schemas/StaticControlSchema.json';

  // 组件名称
  name = '静态展示框';
  isBaseComponent = true;
  disabledRendererPlugin = true;
  icon = 'fa fa-info';
  pluginIcon = 'static-plugin';
  description = '纯用来展示数据，可用来展示 json、date、image、progress 等数据';
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
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const renderer: any = context.info.renderer;

    return getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'alert',
                inline: false,
                level: 'warning',
                className: 'text-sm',
                body: '<p>当前组件已停止维护，建议您使用<a href="/amis/zh-CN/components/form/formitem#%E9%85%8D%E7%BD%AE%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA" target="_blank">静态展示</a>新特性实现表单项的静态展示。</p>'
              },
              getSchemaTpl('formItemName', {
                required: false
              }),
              getSchemaTpl('label'),
              // getSchemaTpl('value'),
              getSchemaTpl('valueFormula', {
                name: 'tpl'
                // rendererSchema: {
                //   ...context?.schema,
                //   type: 'textarea', // 改用多行文本编辑
                //   value: context?.schema.tpl // 避免默认值丢失
                // }
              }),
              getSchemaTpl('quickEdit', {}, this.manager),
              getSchemaTpl('morePopOver', {}, this.manager),
              getSchemaTpl('copyable'),
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
          getSchemaTpl('status', {
            isFormItem: true,
            unsupportStatic: true
          })
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          getSchemaTpl('style:formItem', {renderer}),
          {
            title: '控件',
            body: [getSchemaTpl('borderMode')]
          },
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
