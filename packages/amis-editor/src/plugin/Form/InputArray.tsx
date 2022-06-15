import {Button} from 'amis';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicSubRenderInfo,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem,
  RendererEventContext,
  SubRendererInfo
} from 'amis-editor-core';
import {defaultValue, getSchemaTpl, valuePipeOut} from 'amis-editor-core';
import React from 'react';
import {diff, JSONPipeOut} from 'amis-editor-core';

export class ArrayControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-array';
  $schema = '/schemas/ArrayControlSchema.json';
  disabledRendererPlugin = true;

  // 组件名称
  name = '数组输入框';
  isBaseComponent = true;
  icon = 'fa fa-bars';
  description =
    'Array 数组输入框，可自定义成员输入形式。其实是 Combo 的 flat 值打平的一种用法，可直接用 combo 代替。';
  docLink = '/amis/zh-CN/components/form/input-array';
  tags = ['表单项'];
  scaffold = {
    type: 'input-array',
    label: '数组输入框',
    name: 'array',
    items: {
      type: 'input-text',
      placeholder: '请输入'
    }
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    wrapWithPanel: false,
    mode: 'horizontal',
    body: [
      {
        ...this.scaffold,
        value: ['row1', ''],
        draggable: true
      }
    ]
  };

  panelTitle = '数组框';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('switchDefaultValue'),

      {
        type: 'textarea',
        name: 'value',
        label: '默认值',
        visibleOn: 'typeof this.value !== "undefined"',
        pipeOut: valuePipeOut
      },

      {
        children: (
          <Button
            size="sm"
            level="danger"
            className="m-b"
            block
            onClick={this.editDetail.bind(this, context.id)}
          >
            配置子表单项
          </Button>
        )
      },

      getSchemaTpl('switch', {
        label: '是否可新增',
        name: 'addable',
        pipeIn: defaultValue(true)
      }),

      {
        label: '新增按钮文字',
        name: 'addButtonText',
        type: 'input-text',
        visibleOn: 'data.addable',
        pipeIn: defaultValue('新增')
      },

      {
        type: 'textarea',
        name: 'scaffold',
        label: '新增初始值',
        visibleOn: 'this.addable !== false',
        pipeOut: valuePipeOut,
        pipeIn: defaultValue('')
      },

      getSchemaTpl('switch', {
        label: '是否可删除',
        name: 'removable',
        pipeIn: defaultValue(true)
      }),

      getSchemaTpl('api', {
        name: 'deleteApi',
        label: '删除前的请求',
        visibleOn: 'data.removable'
      }),

      {
        label: '删除确认提示',
        name: 'deleteConfirmText',
        type: 'input-text',
        visibleOn: 'data.deleteApi',
        pipeIn: defaultValue('确认要删除')
      },

      getSchemaTpl('switch', {
        name: 'draggable',
        label: '启用拖拽排序'
      }),

      {
        name: 'draggableTip',
        visibleOn: 'data.draggable',
        type: 'input-text',
        label: '可拖拽排序提示文字',
        pipeIn: defaultValue('可通过拖动每行中的【交换】按钮进行顺序调整')
      },

      {
        name: 'addButtonText',
        type: 'input-text',
        label: '新增按钮文字',
        pipeIn: defaultValue('新增')
      },

      getSchemaTpl('minLength'),
      getSchemaTpl('maxLength')
    ];
  };

  filterProps(props: any) {
    props = JSONPipeOut(props);

    // 至少显示一个成员，否则啥都不显示。
    if (!props.value) {
      props.value = [''];
    }

    return props;
  }

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'input-array') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置子表单项',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === 'input-array') {
      menus.push('|', {
        label: '配置成员渲染器',
        onSelect: this.editDetail.bind(this, id)
      });
    }
  }

  editDetail(id: string) {
    const manager = this.manager;
    const store = manager.store;
    const node = store.getNodeById(id);
    const value = store.getValueOf(id);

    node &&
      value &&
      this.manager.openSubEditor({
        title: '配置子表单项',
        value: value.items,
        slot: {
          type: 'form',
          mode: 'normal',
          body: '$$',
          wrapWithPanel: false,
          className: 'wrapper'
        },
        onChange: newValue => {
          newValue = {
            ...value,
            items: newValue
          };
          manager.panelChangeValue(newValue, diff(value, newValue));
        }
      });
  }
}

registerEditorPlugin(ArrayControlPlugin);
