/**
 * @file 基础控件集合
 */
import { __assign, __rest, __spreadArray } from "tslib";
import flatten from 'lodash/flatten';
import { getEventControlConfig } from '../util';
import { getSchemaTpl, isObject } from 'amis-editor-core';
// 默认动作
export var BUTTON_DEFAULT_ACTION = {
    onEvent: {
        click: {
            actions: []
        }
    }
};
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
export var BaseLabelMark = function (schema) {
    var base = {
        className: 'ae-BaseRemark',
        icon: 'fa fa-question-circle',
        trigger: ['hover', 'click'],
        placement: 'left',
        content: ''
    };
    if (!isObject(schema) || typeof schema === 'string') {
        return schema ? __assign(__assign({}, base), { content: schema.toString() }) : undefined;
    }
    var className = schema.className, content = schema.content, rest = __rest(schema, ["className", "content"]);
    return content
        ? __assign(__assign(__assign(__assign({}, base), rest), (className
            ? { className: "".concat(base.className, " ").concat(rest.className) }
            : {})), { content: content }) : undefined;
};
var normalizCollapsedGroup = function (publicProps, body) {
    if (publicProps === void 0) { publicProps = {}; }
    return body
        ? Array.isArray(body)
            ? body
                .filter(function (item) { return item; })
                .map(function (item, index) { return (__assign(__assign(__assign(__assign({}, publicProps), { key: item.key || index.toString() }), item), { body: flatten(item.body) })); })
            : [
                __assign(__assign(__assign({}, publicProps), { key: '0' }), body)
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
var normalizeBodySchema = function (defaultBody, body, replace, reverse, order) {
    if (replace === void 0) { replace = false; }
    if (reverse === void 0) { reverse = false; }
    if (order === void 0) { order = {}; }
    var normalizedBody = body
        ? Array.isArray(body)
            ? body.concat()
            : [body]
        : [];
    var schema = flatten(replace
        ? normalizedBody
        : reverse
            ? __spreadArray(__spreadArray([], normalizedBody, true), defaultBody, true) : __spreadArray(__spreadArray([], defaultBody, true), normalizedBody, true));
    return schema;
};
/**
 * 表单项组件面板
 *
 * @param {Object=} panels
 * @param {string=} key
 * `property` 属性
 *     `common` 常用
 *     `status` 状态
 *     `validation` 校验
 * `style` 样式
 * `event` 事件
 * @param {string=} panels.body - 配置面板Schema
 * @param {boolean=} panels.replace - 是否完全替换默认Schema，默认追加
 * @param {Array} panels.validation.validationType - 默认显示的校验类型
 */
export var formItemControl = function (panels, context) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var collapseProps = {
        type: 'collapse',
        headingClassName: 'ae-formItemControl-header',
        bodyClassName: 'ae-formItemControl-body'
    };
    // 已经配置了的属性
    var propsList = Object.keys((_a = context === null || context === void 0 ? void 0 : context.schema) !== null && _a !== void 0 ? _a : {});
    // 选项面版内容，支持Option的组件才展示该面板
    var optionBody = normalizeBodySchema([], (_b = panels === null || panels === void 0 ? void 0 : panels.option) === null || _b === void 0 ? void 0 : _b.body, (_c = panels === null || panels === void 0 ? void 0 : panels.option) === null || _c === void 0 ? void 0 : _c.replace);
    // 属性面板配置
    var collapseGroupBody = (panels === null || panels === void 0 ? void 0 : panels.property)
        ? normalizCollapsedGroup(collapseProps, panels === null || panels === void 0 ? void 0 : panels.property)
        : __spreadArray(__spreadArray([
            __assign(__assign({}, collapseProps), { header: '常用', key: 'common', body: normalizeBodySchema([
                    getSchemaTpl('formItemName', {
                        required: true
                    }),
                    getSchemaTpl('label'),
                    getSchemaTpl('labelRemark'),
                    getSchemaTpl('remark'),
                    getSchemaTpl('placeholder'),
                    getSchemaTpl('description')
                ], (_d = panels === null || panels === void 0 ? void 0 : panels.common) === null || _d === void 0 ? void 0 : _d.body, (_e = panels === null || panels === void 0 ? void 0 : panels.common) === null || _e === void 0 ? void 0 : _e.replace, (_f = panels === null || panels === void 0 ? void 0 : panels.common) === null || _f === void 0 ? void 0 : _f.reverse) })
        ], (optionBody.length !== 0
            ? [
                __assign(__assign({}, collapseProps), { header: ((_g = panels === null || panels === void 0 ? void 0 : panels.option) === null || _g === void 0 ? void 0 : _g.title) || '选项', key: 'option', body: optionBody })
            ]
            : []), true), [
            __assign(__assign({}, collapseProps), { header: '状态', key: 'status', body: normalizeBodySchema([
                    getSchemaTpl('hidden'),
                    // TODO: 下面的部分表单项才有，是不是判断一下是否是表单项
                    getSchemaTpl('disabled'),
                    getSchemaTpl('clearValueOnHidden')
                ], (_h = panels === null || panels === void 0 ? void 0 : panels.status) === null || _h === void 0 ? void 0 : _h.body, (_j = panels === null || panels === void 0 ? void 0 : panels.status) === null || _j === void 0 ? void 0 : _j.replace, (_k = panels === null || panels === void 0 ? void 0 : panels.status) === null || _k === void 0 ? void 0 : _k.reverse) })
        ], false);
    return [
        {
            type: 'tabs',
            tabsMode: 'line',
            className: 'editor-prop-config-tabs',
            linksClassName: 'editor-prop-config-tabs-links',
            contentClassName: 'no-border editor-prop-config-tabs-cont',
            tabs: __spreadArray([
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
                            activeKey: collapseGroupBody.map(function (group, index) { return group.key; }),
                            body: collapseGroupBody
                        }
                    ]
                },
                {
                    title: '外观',
                    body: normalizeBodySchema([
                        getSchemaTpl('formItemMode'),
                        getSchemaTpl('horizontalMode'),
                        getSchemaTpl('horizontal', {
                            label: '',
                            visibleOn: 'data.mode == "horizontal" && data.label !== false && data.horizontal'
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
                    ], (_l = panels === null || panels === void 0 ? void 0 : panels.style) === null || _l === void 0 ? void 0 : _l.body, (_m = panels === null || panels === void 0 ? void 0 : panels.style) === null || _m === void 0 ? void 0 : _m.replace, (_o = panels === null || panels === void 0 ? void 0 : panels.style) === null || _o === void 0 ? void 0 : _o.reverse)
                }
            ], (isObject(context) && !((_p = panels === null || panels === void 0 ? void 0 : panels.event) === null || _p === void 0 ? void 0 : _p.hidden)
                ? [
                    {
                        title: '事件',
                        className: 'p-none',
                        body: normalizeBodySchema([
                            getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(context.info.plugin.manager, context)))
                        ], (_q = panels === null || panels === void 0 ? void 0 : panels.event) === null || _q === void 0 ? void 0 : _q.body, (_r = panels === null || panels === void 0 ? void 0 : panels.event) === null || _r === void 0 ? void 0 : _r.replace)
                    }
                ]
                : []), true)
        }
    ];
};
export function tipedLabel(body, tip, style) {
    return {
        type: 'tooltip-wrapper',
        tooltip: tip,
        tooltipTheme: 'dark',
        placement: 'top',
        tooltipStyle: __assign({ fontSize: '12px' }, (style || {})),
        className: 'ae-formItemControl-label-tip',
        body: body
    };
}
/**
 * 信息提示组件模版
 */
export function remarkTpl(config) {
    return {
        type: 'ae-switch-more',
        formType: 'dialog',
        label: config.labelRemark
            ? tipedLabel(config.label, config.labelRemark)
            : config.label,
        bulk: false,
        name: config.name,
        pipeIn: function (value) { return !!value; },
        pipeOut: function (value) {
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
                                labelRemark: BaseLabelMark('有哪些辅助类 CSS 类名？请前往 <a href="https://baidu.gitee.io/amis/zh-CN/style/index" target="_blank">样式说明</a>，除此之外你可以添加自定义类名，然后在系统配置中添加自定义样式。')
                            },
                            {
                                name: 'trigger',
                                type: 'select',
                                label: '触发方式',
                                labelRemark: BaseLabelMark('浮层触发方式默认值为鼠标悬停'),
                                multiple: true,
                                pipeIn: function (value) {
                                    return Array.isArray(value) ? value.join(',') : [];
                                },
                                pipeOut: function (value) {
                                    return value && value.length ? value.split(',') : ['hover'];
                                },
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
