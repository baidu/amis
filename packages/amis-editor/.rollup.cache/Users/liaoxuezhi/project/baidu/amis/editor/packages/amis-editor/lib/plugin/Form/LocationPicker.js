import { __assign, __extends } from "tslib";
import { getSchemaTpl } from 'amis-editor-core';
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
var LocationControlPlugin = /** @class */ (function (_super) {
    __extends(LocationControlPlugin, _super);
    function LocationControlPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'location-picker';
        _this.$schema = '/schemas/LocationControlSchema.json';
        // 组件名称
        _this.name = '地理位置选择';
        _this.isBaseComponent = true;
        _this.icon = 'fa fa-location-arrow';
        _this.description = "\u5730\u7406\u4F4D\u7F6E\u9009\u62E9";
        _this.docLink = '/amis/zh-CN/components/form/location-picker';
        _this.tags = ['表单项'];
        _this.scaffold = {
            type: 'location-picker',
            name: 'location'
        };
        _this.previewSchema = {
            type: 'form',
            className: 'text-left',
            mode: 'horizontal',
            wrapWithPanel: false,
            body: [
                __assign({}, _this.scaffold)
            ]
        };
        _this.panelTitle = '地理位置选择';
        _this.panelBody = [
            getSchemaTpl('clearable'),
            {
                type: 'input-text',
                name: 'ak',
                label: '百度地图的 AK',
                description: '请从<a href="http://lbsyun.baidu.com/" target="_blank">百度地图开放平台</a>获取'
            },
            {
                type: 'select',
                name: 'coordinatesType',
                label: '坐标格式',
                value: 'bd09',
                options: [
                    { label: '百度坐标', value: 'bd09' },
                    { label: '国测局坐标', value: 'gcj02' }
                ]
            }
        ];
        return _this;
    }
    return LocationControlPlugin;
}(BasePlugin));
export { LocationControlPlugin };
registerEditorPlugin(LocationControlPlugin);
