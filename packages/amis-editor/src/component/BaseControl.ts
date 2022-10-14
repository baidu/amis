/**
 * @file 基础控件集合
 */

import flatten from 'lodash/flatten';
import {getEventControlConfig} from '../renderer/event-control/helper';
import {getSchemaTpl, isObject, tipedLabel} from 'amis-editor-core';
import type {BaseEventContext} from 'amis-editor-core';
import {SchemaObject} from 'amis/lib/Schema';

// 默认动作
export const BUTTON_DEFAULT_ACTION = {
  onEvent: {
    click: {
      actions: []
    }
  }
};

export type PrimitiveType = string | number | boolean;
/**
 * 校验项
 * 数组项为 ValidationType 或 对象形式的配置
 * 对象形式配置规则 优先匹配 isShow 形式，后匹配 isHidden 形式
 * 如下：
 */
export type ValidationOptions = Array<{
  option: string;
  isShow?: {
    // 匹配条件展示该校验项
    [key: string]: PrimitiveType | Array<PrimitiveType>;
  };
  isHidden?: {
    // 匹配条件隐藏该校验项
    [key: string]: PrimitiveType | Array<PrimitiveType>;
  };
}>;

export type FormItemControlPanel =
  | 'property'
  | 'common'
  | 'option'
  | 'status'
  | 'validation'
  | 'style'
  | 'option'
  | 'event';

/**
 * Label提示
 * 支持传入Schema或String，传入String则使用默认配置，如下：
 *
 * @default
 * ```
 * className: 'ae-BaseRemark',
 * icon: 'fa fa-question-circle',
 * trigger: ['hover', 'click'],
 * placement: 'left'
 * ```
 */
export const BaseLabelMark = (schema: Record<string, any> | string) => {
  const base = {
    className: 'ae-BaseRemark',
    icon: 'fa fa-question-circle',
    trigger: ['hover', 'click'],
    placement: 'left',
    content: ''
  };

  if (!isObject(schema) || typeof schema === 'string') {
    return schema ? {...base, content: schema.toString()} : undefined;
  }

  const {className, content, ...rest} = schema;

  return content
    ? {
        ...base,
        ...rest,
        ...(className
          ? {className: `${base.className} ${rest.className}`}
          : {}),
        content
      }
    : undefined;
};

const normalizCollapsedGroup = (publicProps = {}, body: any) => {
  return body
    ? Array.isArray(body)
      ? body
          .filter(item => item)
          .map((item, index) => ({
            ...publicProps,
            key: item.key || index.toString(),
            ...item,
            body: flatten(item.body)
          }))
      : [
          {
            ...publicProps,
            key: '0',
            ...body
          }
        ]
    : [];
};

/**
 * 更新/归一化处理表单项
 *
 * @param defaultBody 默认配置
 * @param body 输入配置
 * @param replace 是否完全替换
 * @returns
 */
const normalizeBodySchema = (
  defaultBody: Array<Record<string, any>>,
  body: Array<Record<string, any>> | Record<string, any>,
  replace: boolean = false,
  reverse: boolean = false,
  order: Record<string, number> = {}
) => {
  const normalizedBody = body
    ? Array.isArray(body)
      ? body.concat()
      : [body]
    : [];
  const schema = flatten(
    replace
      ? normalizedBody
      : reverse
      ? [...normalizedBody, ...defaultBody]
      : [...defaultBody, ...normalizedBody]
  );

  return schema;
};

/**
 * 表单项组件面板
 *
 * @param {Object=} panels
 * @param {string=} key
 * `property` 属性
 *     `common` 基本
 *     `status` 状态
 *     `validation` 校验
 * `style` 样式
 * `event` 事件
 * @param {string=} panels.body - 配置面板Schema
 * @param {boolean=} panels.replace - 是否完全替换默认Schema，默认追加
 * @param {Array} panels.validation.validationType - 默认显示的校验类型
 */
export const formItemControl: (
  panels: Partial<
    Record<
      FormItemControlPanel,
      {
        /**
         * 标题
         */
        title?: string;

        /**
         * 配置项内容
         */
        body?: any;

        /**
         * 是否完全替换默认配置项
         */
        replace?: boolean;

        /**
         * 配置项倒序排列
         */
        reverse?: boolean;

        /**
         * 是否隐藏面板
         */
        hidden?: boolean;

        /**
         * 配置项排序优先级
         */
        order?: Record<string, number>;

        /**
         * 默认支持的校验规则
         */
        validationType?: ValidationOptions;
      }
    >
  >,
  context?: BaseEventContext
) => Array<any> = (panels, context) => {
  const collapseProps = {
    type: 'collapse',
    headingClassName: 'ae-formItemControl-header',
    bodyClassName: 'ae-formItemControl-body'
  };
  // 已经配置了的属性
  const propsList = Object.keys(context?.schema ?? {});
  // 选项面版内容，支持Option的组件才展示该面板
  const optionBody = normalizeBodySchema(
    [],
    panels?.option?.body,
    panels?.option?.replace
  );
  // 属性面板配置
  const collapseGroupBody = panels?.property
    ? normalizCollapsedGroup(collapseProps, panels?.property)
    : [
        {
          ...collapseProps,
          header: '基本',
          key: 'common',
          body: normalizeBodySchema(
            [
              getSchemaTpl('formItemName', {
                required: true
              }),
              getSchemaTpl('label'),
              getSchemaTpl('labelRemark'),
              getSchemaTpl('remark'),
              getSchemaTpl('placeholder'),
              getSchemaTpl('description')
            ],
            panels?.common?.body,
            panels?.common?.replace,
            panels?.common?.reverse
          )
        },
        ...(optionBody.length !== 0
          ? [
              {
                ...collapseProps,
                header: panels?.option?.title || '选项',
                key: 'option',
                body: optionBody
              }
            ]
          : []),
        {
          ...collapseProps,
          header: '状态',
          key: 'status',
          body: normalizeBodySchema(
            [
              getSchemaTpl('hidden'),
              // TODO: 下面的部分表单项才有，是不是判断一下是否是表单项
              getSchemaTpl('disabled'),
              getSchemaTpl('clearValueOnHidden')
            ],
            panels?.status?.body,
            panels?.status?.replace,
            panels?.status?.reverse
          )
        }
        // ...(panels?.validation?.hidden
        //   ? []
        //   : [
        //       {
        //         ...collapseProps,
        //         className: 'ae-ValidationControl-Panel',
        //         header: '校验',
        //         key: 'validation',
        //         body: normalizeBodySchema(
        //           [
        //             getSchemaTpl(
        //               'validationControl',
        //               panels?.validation?.validationType
        //             ),
        //             getSchemaTpl('validateOnChange'),
        //             getSchemaTpl('submitOnChange')
        //           ],
        //           panels?.validation?.body,
        //           panels?.validation?.replace,
        //           panels?.validation?.reverse
        //         )
        //       }
        //     ])
      ];

  return [
    {
      type: 'tabs',
      tabsMode: 'line',
      className: 'editor-prop-config-tabs',
      linksClassName: 'editor-prop-config-tabs-links',
      contentClassName: 'no-border editor-prop-config-tabs-cont',
      tabs: [
        {
          title: '属性',
          className: 'p-none',
          body: [
            {
              type: 'collapse-group',
              expandIconPosition: 'right',
              expandIcon: {
                type: 'icon',
                icon: 'chevron-right'
              },
              className: 'ae-formItemControl',
              activeKey: collapseGroupBody.map((group, index) => group.key),
              body: collapseGroupBody
            }
          ]
        },
        {
          title: '外观',
          body: normalizeBodySchema(
            [
              getSchemaTpl('formItemMode'),
              getSchemaTpl('horizontalMode'),
              getSchemaTpl('horizontal', {
                label: '',
                visibleOn:
                  'data.mode == "horizontal" && data.label !== false && data.horizontal'
              }),
              // renderer.sizeMutable !== false
              //   ? getSchemaTpl('formItemSize')
              //   : null,
              getSchemaTpl('formItemInline'),
              getSchemaTpl('className'),
              getSchemaTpl('className', {
                label: 'Label CSS 类名',
                name: 'labelClassName'
              }),
              getSchemaTpl('className', {
                label: '控件 CSS 类名',
                name: 'inputClassName'
              }),
              getSchemaTpl('className', {
                label: '描述 CSS 类名',
                name: 'descriptionClassName',
                visibleOn: 'this.description'
              })
            ],
            panels?.style?.body,
            panels?.style?.replace,
            panels?.style?.reverse
          )
        },
        ...(isObject(context) && !panels?.event?.hidden
          ? [
              {
                title: '事件',
                className: 'p-none',
                body: normalizeBodySchema(
                  [
                    getSchemaTpl('eventControl', {
                      name: 'onEvent',
                      ...getEventControlConfig(
                        context!.info.plugin.manager,
                        context!
                      )
                    })
                  ],
                  panels?.event?.body,
                  panels?.event?.replace
                )
              }
            ]
          : [])
      ]
    }
  ];
};

/**
 * 信息提示组件模版
 */
export function remarkTpl(config: {
  name: 'remark' | 'labelRemark';
  label: string;
  labelRemark?: string;
}) {
  return {
    type: 'ae-switch-more',
    formType: 'dialog',
    className: 'ae-switch-more-flex',
    label: config.labelRemark
      ? tipedLabel(config.label, config.labelRemark)
      : config.label,
    bulk: false,
    name: config.name,
    pipeIn: (value: any) => !!value,
    pipeOut: (value: any) => {
      // 更新内容
      if (isObject(value)) {
        return value;
      }
      // 关到开
      if (value) {
        return {
          icon: 'fa fa-question-circle',
          trigger: ['hover'],
          className: 'Remark--warning',
          placement: 'top'
        };
      }
      // 开到关
      return undefined;
    },
    form: {
      size: 'md',
      className: 'mb-8',
      mode: 'horizontal',
      horizontal: {
        left: 4,
        right: 8,
        justify: true
      },
      body: {
        type: 'grid',
        className: 'pt-4 right-panel-pop',
        gap: 'lg',
        columns: [
          {
            md: '6',
            body: [
              {
                name: 'title',
                type: 'input-text',
                label: '提示标题',
                placeholder: '请输入提示标题'
              },
              {
                name: 'content',
                type: 'textarea',
                label: '内容'
              }
            ]
          },
          {
            md: '6',
            body: [
              {
                name: 'placement',
                type: 'button-group-select',
                size: 'md',
                label: '弹出位置',
                options: [
                  {
                    label: '上',
                    value: 'top'
                  },
                  {
                    label: '下',
                    value: 'bottom'
                  },
                  {
                    label: '左',
                    value: 'left'
                  },

                  {
                    label: '右',
                    value: 'right'
                  }
                ]
              },
              {
                name: 'icon',
                label: '图标',
                type: 'icon-picker',
                className: 'fix-icon-picker-overflow'
              },
              {
                name: 'className',
                label: 'CSS 类名',
                type: 'input-text',
                labelRemark: BaseLabelMark(
                  '有哪些辅助类 CSS 类名？请前往 <a href="https://baidu.gitee.io/amis/zh-CN/style/index" target="_blank">样式说明</a>，除此之外你可以添加自定义类名，然后在系统配置中添加自定义样式。'
                )
              },
              {
                name: 'trigger',
                type: 'select',
                label: '触发方式',
                labelRemark: BaseLabelMark('浮层触发方式默认值为鼠标悬停'),
                multiple: true,
                pipeIn: (value: any) =>
                  Array.isArray(value) ? value.join(',') : [],
                pipeOut: (value: any) =>
                  value && value.length ? value.split(',') : ['hover'],
                options: [
                  {
                    label: '鼠标悬停',
                    value: 'hover'
                  },
                  {
                    label: '点击',
                    value: 'click'
                  }
                ]
              },
              {
                name: 'rootClose',
                visibleOn: '~this.trigger.indexOf("click")',
                label: '点击空白关闭',
                type: 'switch',
                mode: 'row',
                inputClassName: 'inline-flex justify-between flex-row-reverse'
              }
            ]
          }
        ]
      }
    }
  };
}
