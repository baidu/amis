import { __assign, __extends } from "tslib";
import { Button } from 'amis';
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { getEventControlConfig } from '../util';
var ServicePlugin = /** @class */ (function (_super) {
    __extends(ServicePlugin, _super);
    function ServicePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'service';
        _this.$schema = '/schemas/ServiceSchema.json';
        // 组件名称
        _this.name = '服务 Service';
        _this.isBaseComponent = true;
        _this.description = '功能性容器，可以用来加载数据或者加载渲染器配置。加载到的数据在容器可以使用。';
        _this.docLink = '/amis/zh-CN/components/service';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-server';
        _this.scaffold = {
            type: 'service',
            body: [
                {
                    type: 'tpl',
                    tpl: '内容',
                    inline: false
                }
            ]
        };
        _this.previewSchema = {
            type: 'tpl',
            tpl: '功能性组件，用于数据拉取。'
        };
        _this.regions = [
            {
                key: 'body',
                label: '内容区'
            }
        ];
        _this.events = [
            {
                eventName: 'fetchInited',
                eventLabel: 'api 初始化数据',
                description: 'api 初始化完成'
            },
            {
                eventName: 'fetchSchemaInited',
                eventLabel: 'schemaApi 初始化数据',
                description: 'schemaApi 初始化完成'
            }
        ];
        _this.actions = [
            {
                actionType: 'reload',
                actionLabel: '重新加载',
                description: '触发组件数据刷新并重新渲染'
            },
            {
                actionType: 'rebuild',
                actionLabel: '重新构建',
                description: '触发schemaApi刷新，重新构建Schema'
            },
            {
                actionType: 'setValue',
                actionLabel: '变量赋值',
                description: '更新数据域数据'
            }
        ];
        _this.panelTitle = '服务';
        _this.panelBodyCreator = function (context) {
            return getSchemaTpl('tabs', [
                {
                    title: '属性',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('collapseGroup', [
                            {
                                title: '基本',
                                body: [
                                    getSchemaTpl('name'),
                                    {
                                        children: (React.createElement(Button, { level: "info", size: "sm", className: "m-b-sm", block: true, onClick: function () {
                                                // this.manager.showInsertPanel('body', context.id);
                                                _this.manager.showRendererPanel('');
                                            } }, "\u6DFB\u52A0\u5185\u5BB9"))
                                    }
                                ]
                            },
                            {
                                title: '数据接口',
                                body: [
                                    getSchemaTpl('apiControl', {
                                        name: 'api',
                                        label: '数据接口',
                                        messageDesc: '设置 service 默认提示信息，当 service 没有返回 msg 信息时有用，如果 service 返回携带了 msg 值，则还是以 service 返回为主'
                                    }),
                                    {
                                        name: 'ws',
                                        type: 'input-text',
                                        label: 'WebSocket 实时更新接口'
                                    },
                                    /** initFetchOn可以通过api的sendOn属性控制 */
                                    getSchemaTpl('switch', {
                                        name: 'initFetch',
                                        label: '数据接口初始加载',
                                        visibleOn: 'this.api'
                                    }),
                                    {
                                        name: 'interval',
                                        label: '定时刷新间隔',
                                        visibleOn: 'this.api',
                                        type: 'input-number',
                                        step: 500,
                                        description: '设置后将自动定时刷新，单位 ms'
                                    },
                                    getSchemaTpl('switch', {
                                        name: 'silentPolling',
                                        label: '静默加载',
                                        visibleOn: '!!data.interval',
                                        description: '设置自动定时刷新是否显示加载动画'
                                    }),
                                    {
                                        name: 'stopAutoRefreshWhen',
                                        label: '停止定时刷新检测',
                                        type: 'input-text',
                                        visibleOn: '!!data.interval',
                                        description: '定时刷新一旦设置会一直刷新，除非给出表达式，条件满足后则不刷新了。'
                                    }
                                ]
                            },
                            {
                                title: 'Schema接口',
                                body: [
                                    getSchemaTpl('apiControl', {
                                        name: 'schemaApi',
                                        label: '内容 Schema 接口'
                                    }),
                                    getSchemaTpl('switch', {
                                        name: 'initFetchSchema',
                                        label: 'Schema接口初始加载',
                                        visibleOn: 'this.schemaApi'
                                    })
                                ]
                            },
                            {
                                title: '全局配置',
                                body: [
                                    getSchemaTpl('data'),
                                    {
                                        type: 'js-editor',
                                        allowFullscreen: true,
                                        name: 'dataProvider',
                                        label: '自定义函数获取数据',
                                        description: '将会传递 data 和 setData 两个参数'
                                    },
                                    {
                                        label: '默认消息信息',
                                        type: 'combo',
                                        name: 'messages',
                                        multiLine: true,
                                        description: '设置 service 默认提示信息，当 service 没有返回 msg 信息时有用，如果 service 返回携带了 msg 值，则还是以 service 返回为主',
                                        items: [
                                            {
                                                label: '获取成功',
                                                type: 'input-text',
                                                name: 'fetchSuccess'
                                            },
                                            {
                                                label: '获取失败',
                                                type: 'input-text',
                                                name: 'fetchFailed'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                title: '状态',
                                body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
                            }
                        ])
                    ]
                },
                {
                    title: '外观',
                    body: [getSchemaTpl('className')]
                },
                {
                    title: '事件',
                    className: 'p-none',
                    body: [
                        getSchemaTpl('eventControl', __assign({ name: 'onEvent' }, getEventControlConfig(_this.manager, context)))
                    ]
                }
            ]);
        };
        return _this;
    }
    return ServicePlugin;
}(BasePlugin));
export { ServicePlugin };
registerEditorPlugin(ServicePlugin);
