import React from 'react';
import {render} from 'amis';
import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin, BaseEventContext} from 'amis-editor-core';
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {Icon, TooltipWrapper} from 'amis-ui';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import {getI18nEnabled} from 'amis-editor-core';

export class StatusPlugin extends BasePlugin {
  static id = 'StatusPlugin';
  static scene = ['layout'];
  // 关联渲染器名字
  rendererName = 'status';
  $schema = '/schemas/AMISStatusSchema.json';

  // 组件名称
  name = '状态显示';
  isBaseComponent = true;
  description =
    '用图标更具关联字段来展示状态，比如 1 展示 √、0 展示 x。这块可以自定义配置';
  docLink = '/amis/zh-CN/components/status';
  tags = ['展示'];
  icon = 'fa fa-check-square-o';
  pluginIcon = 'status-plugin';
  scaffold = {
    type: 'status',
    value: 1
  };
  previewSchema = {
    ...this.scaffold
  };

  defaultSource = [
    {
      label: '-',
      value: '0',
      icon: 'fail',
      status: 0
    },
    {
      label: '-',
      value: '1',
      icon: 'success',
      status: 1
    },
    {
      label: '成功',
      value: 'success',
      icon: 'success',
      status: 'success'
    },
    {
      label: '运行中',
      value: 'pending',
      icon: 'rolling',
      status: 'pending'
    },
    {
      label: '排队中',
      value: 'queue',
      icon: 'warning',
      status: 'queue'
    },
    {
      label: '调度中',
      value: 'schedule',
      icon: 'schedule',
      status: 'schedule'
    },
    {
      label: '失败',
      value: 'fail',
      icon: 'fail',
      status: 'fail'
    }
  ];

  panelTitle = '状态';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    const i18nEnabled = getI18nEnabled();
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: getSchemaTpl('collapseGroup', [
            {
              title: '基本',
              body: [
                getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                getSchemaTpl('combo-container', {
                  type: 'combo',
                  name: '__source',
                  inputClassName: 'ae-Status-control',
                  labelClassName: 'ae-Status-label',
                  label: [
                    '图标配置',
                    {
                      children: (
                        <TooltipWrapper
                          tooltipClassName="ae-Status-default-icon-tooltip"
                          trigger="hover"
                          rootClose={true}
                          placement="bottom"
                          tooltip={{
                            children: () =>
                              render({
                                type: 'container',
                                body: [
                                  {
                                    type: 'tpl',
                                    tpl: '默认支持如下几种状态，无需配置即可使用。自定义状态会和默认状态合并。',
                                    wrapperComponent: 'p',
                                    className: 'ae-Status-default-icon-tip'
                                  },
                                  {
                                    type: 'table',
                                    data: {
                                      items: this.defaultSource
                                    },
                                    columns: [
                                      {
                                        name: 'icon',
                                        label: '默认icon值'
                                      },
                                      {
                                        name: 'label',
                                        label: '默认label'
                                      },
                                      {
                                        name: 'value',
                                        label: '默认value值'
                                      },
                                      {
                                        name: 'status',
                                        label: '状态',
                                        type: 'mapping',
                                        map: {
                                          '*': {
                                            type: 'status'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              })
                          }}
                        >
                          <div className="ae-Status-label-tip-icon">
                            <Icon icon="editor-help" className="icon" />
                          </div>
                        </TooltipWrapper>
                      )
                    }
                  ],
                  mode: 'normal',
                  multiple: true,
                  items: [
                    getSchemaTpl('icon', {
                      label: '',
                      placeholder: '图标',
                      onChange(
                        value: any,
                        oldValue: boolean,
                        model: any,
                        form: any
                      ) {
                        // 选择图标时自动填充label
                        if (value && value.name) {
                          form.setValues({
                            label: value.name
                          });
                        }
                      }
                    }),
                    {
                      type: i18nEnabled ? 'input-text-i18n' : 'input-text',
                      name: 'label',
                      placeholder: 'label'
                    },
                    {
                      type: 'input-text',
                      name: 'value',
                      placeholder: 'value',
                      unique: true,
                      required: true,
                      validationErrors: {
                        isRequired: '必填项'
                      }
                    },
                    getSchemaTpl('theme:colorPicker', {
                      label: '',
                      name: 'color'
                    })
                  ],
                  pipeIn: (value: any, {data}: any) => {
                    // 首次进入，将schema 转换为 combo的数据
                    if (value === undefined) {
                      let {map, labelMap, source} = data;
                      let res = cloneDeep(source) || {};
                      // 兼容旧版
                      map &&
                        Object.entries(map).forEach(([value, icon]) => {
                          if (
                            value === '' ||
                            value == null ||
                            value === '$$id'
                          ) {
                            return;
                          }
                          if (!res[value]) {
                            res[value] = {icon};
                          } else {
                            res[value] = {...res[value], icon};
                          }
                        });
                      labelMap &&
                        Object.entries(labelMap).forEach(([value, label]) => {
                          if (value === '' || value == null) {
                            return;
                          }
                          if (!res[value]) {
                            res[value] = {label};
                          } else {
                            res[value] = {...res[value], label};
                          }
                        });

                      Object.keys(res).forEach((key, index) => {
                        const item = res[key];
                        if (!('key' in item)) {
                          item.key = key;
                        }
                        if (!('value' in item)) {
                          item.value = key;
                        }
                      });

                      return Object.values(res);
                    } else {
                      // 后续可以直接使用value
                      return value;
                    }
                  },
                  onChange(
                    value: any,
                    oldValue: boolean,
                    model: any,
                    form: any
                  ) {
                    const res: any = {};
                    value.forEach((item: any) => {
                      if (item.value !== '' && item.value != null) {
                        res[item.value] = pick(item, [
                          'label',
                          'color',
                          'icon'
                        ]);
                      }
                    });
                    form.setValues({
                      map: undefined,
                      labelMap: undefined,
                      source: Object.keys(res).length > 0 ? res : undefined
                    });
                  }
                }),
                getSchemaTpl('valueFormula', {
                  pipeOut: (value: any) => {
                    return value == null || value === '' ? undefined : value;
                  }
                }),
                getSchemaTpl('placeholder', {
                  label: '占位符',
                  pipeIn: defaultValue('-')
                })
              ]
            },
            getSchemaTpl('status')
          ])
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              title: 'CSS类名',
              body: [
                getSchemaTpl('className', {
                  label: '外层'
                })
              ]
            }
          ])
        }
      ])
    ];
  };
}

registerEditorPlugin(StatusPlugin);
