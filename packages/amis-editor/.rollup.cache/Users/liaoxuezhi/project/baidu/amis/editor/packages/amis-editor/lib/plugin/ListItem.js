import { __assign, __extends } from "tslib";
import React from 'react';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { defaultValue, getSchemaTpl } from 'amis-editor-core';
import { VRenderer } from 'amis-editor-core';
var ListItemPlugin = /** @class */ (function (_super) {
    __extends(ListItemPlugin, _super);
    function ListItemPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'list-item';
        _this.isBaseComponent = true;
        _this.$schema = '/schemas/ListItemSchema.json';
        _this.regions = [
            {
                key: 'body',
                label: '内容区',
                renderMethod: 'renderBody',
                preferTag: '展示'
            },
            {
                key: 'actions',
                label: '按钮集合',
                preferTag: '按钮',
                renderMethod: 'renderRight',
                insertPosition: 'inner'
            }
        ];
        _this.panelTitle = '列表项';
        _this.panelBody = getSchemaTpl('tabs', [
            {
                title: '基本',
                body: [
                    // {
                    //   children: (
                    //     <Button
                    //       size="sm"
                    //       className="m-b-sm"
                    //       level="info"
                    //       block
                    //       onClick={() => {
                    //         this.pickChild('actions', 'actions', undefined, ['button']);
                    //       }}
                    //     >
                    //       新增按钮
                    //     </Button>
                    //   )
                    // },
                    // {
                    //   children: (
                    //     <div>
                    //       <Button
                    //         level="primary"
                    //         size="sm"
                    //         block
                    //         onClick={this.handleAdd}
                    //       >
                    //         新增内容
                    //       </Button>
                    //     </div>
                    //   )
                    // },
                    // {
                    //   type: 'divider'
                    // },
                    {
                        name: 'title',
                        type: 'input-text',
                        label: '标题',
                        descrition: '支持模板语法如： ${xxx}'
                    },
                    {
                        name: 'subTitle',
                        type: 'input-text',
                        label: '副标题',
                        descrition: '支持模板语法如： ${xxx}'
                    },
                    {
                        name: 'avatar',
                        type: 'input-text',
                        label: '图片地址',
                        descrition: '支持模板语法如： ${xxx}'
                    },
                    {
                        name: 'desc',
                        type: 'textarea',
                        label: '描述',
                        descrition: '支持模板语法如： ${xxx}'
                    }
                ]
            },
            {
                title: '外观',
                body: [
                    getSchemaTpl('className', {
                        name: 'avatarClassName',
                        label: '图片 CSS 类名',
                        pipeIn: defaultValue('thumb-sm avatar m-r')
                    }),
                    getSchemaTpl('className', {
                        name: 'titleClassName',
                        label: '标题 CSS 类名'
                    })
                ]
            }
        ]);
        _this.fieldWrapperResolve = function (dom) { return dom; };
        _this.overrides = {
            renderFeild: function (region, field, index, props) {
                var dom = this.super(region, field, index, props);
                var info = this.props.$$editor;
                if (!info || !field.$$id) {
                    return dom;
                }
                var plugin = info.plugin;
                var id = field.$$id;
                return (React.createElement(VRenderer, { type: info.type, plugin: info.plugin, renderer: info.renderer, multifactor: true, key: id, "$schema": "/schemas/ListBodyField.json", hostId: info.id, memberIndex: index, name: "".concat("\u5B57\u6BB5".concat(index + 1)), id: id, draggable: false, wrapperResolve: plugin.fieldWrapperResolve, schemaPath: "".concat(info.schemaPath, "/body/").concat(index), path: "".concat(this.props.$path, "/").concat(index), data: this.props.data }, dom));
            }
        };
        _this.vRendererConfig = {
            panelTitle: '字段',
            panelBodyCreator: function (context) {
                return [
                    getSchemaTpl('label'),
                    getSchemaTpl('className', {
                        name: 'labelClassName',
                        label: 'Label CSS 类名',
                        visibleOn: 'this.label'
                    })
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
                    }*/
                ];
            }
        };
        return _this;
    }
    ListItemPlugin.prototype.getRendererInfo = function (_a) {
        var renderer = _a.renderer, schema = _a.schema;
        if (schema.$$id && this.rendererName === renderer.name) {
            // 复制部分信息出去
            return {
                name: this.panelTitle,
                regions: this.regions,
                // patchContainers: plugin.patchContainers,
                // // wrapper: plugin.wrapper,
                // vRendererConfig: plugin.vRendererConfig,
                // wrapperProps: plugin.wrapperProps,
                // wrapperResolve: plugin.wrapperResolve,
                // filterProps: plugin.filterProps,
                $schema: this.$schema
                // renderRenderer: plugin.renderRenderer
            };
        }
    };
    /*exchangeRenderer(id: string) {
      this.manager.showReplacePanel(id, '展示');
    }*/
    // 自动插入 label
    ListItemPlugin.prototype.beforeInsert = function (event) {
        var _a, _b, _c, _d;
        var context = event.context;
        if ((context.info.plugin === this ||
            ((_a = context.node.sameIdChild) === null || _a === void 0 ? void 0 : _a.info.plugin) === this) &&
            context.region === 'body') {
            context.data = __assign(__assign({}, context.data), { label: (_d = (_b = context.data.label) !== null && _b !== void 0 ? _b : (_c = context.subRenderer) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : '列名称' });
        }
    };
    return ListItemPlugin;
}(BasePlugin));
export { ListItemPlugin };
registerEditorPlugin(ListItemPlugin);
