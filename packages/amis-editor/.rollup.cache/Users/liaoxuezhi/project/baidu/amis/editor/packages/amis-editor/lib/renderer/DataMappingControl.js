import { __assign, __decorate, __extends, __metadata, __rest } from "tslib";
import { Renderer } from 'amis';
import React from 'react';
import { autobind } from 'amis-editor-core';
var DataMappingControl = /** @class */ (function (_super) {
    __extends(DataMappingControl, _super);
    function DataMappingControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataMappingControl.prototype.renderValue = function (value, onChange, schema) {
        var render = this.props.render;
        return render('value', {
            type: 'ae-DataPickerControl',
            inputOnly: true,
            name: 'any'
        }, {
            value: value,
            onChange: onChange
        });
    };
    DataMappingControl.prototype.render = function () {
        var _a = this.props, schema = _a.schema, render = _a.render, name = _a.name, description = _a.description, required = _a.required, rest = __rest(_a, ["schema", "render", "name", "description", "required"]);
        return render('inner', {
            type: 'json-schema',
            schema: schema,
            name: name,
            description: description,
            required: required
        }, __assign(__assign({}, rest), { renderValue: this.renderValue }));
        // return (
        //   <InputJSONSchema
        //     {...rest}
        //     schema={this.state.schema}
        //     renderValue={this.renderValue}
        //   />
        // );
    };
    __decorate([
        autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Function, Object]),
        __metadata("design:returntype", void 0)
    ], DataMappingControl.prototype, "renderValue", null);
    return DataMappingControl;
}(React.Component));
export { DataMappingControl };
var DataMappingControlRenderer = /** @class */ (function (_super) {
    __extends(DataMappingControlRenderer, _super);
    function DataMappingControlRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataMappingControlRenderer = __decorate([
        Renderer({
            type: 'ae-DataMappingControl'
        })
    ], DataMappingControlRenderer);
    return DataMappingControlRenderer;
}(DataMappingControl));
export { DataMappingControlRenderer };
