import {Button} from 'amis';
import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {
  BaseEventContext,
  BasePlugin,
  BasicToolbarItem,
  ContextMenuEventContext,
  ContextMenuItem
} from 'amis-editor-core';
import {diff, JSONPipeOut} from 'amis-editor-core';

export class SubFormControlPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'input-sub-form';
  $schema = '/schemas/SubFormControlSchema.json';

  // 组件名称
  name = '子表单项';
  isBaseComponent = true;
  icon = 'fa fa-window-restore';
  pluginIcon = 'sub-form-plugin';
  description = `SubForm, 配置一个子<code>form</code>作为当前的表单项`;
  docLink = '/amis/zh-CN/components/form/input-sub-form';
  tags = ['表单项'];
  scaffold = {
    type: 'input-sub-form',
    name: 'subform',
    label: '子表单',
    form: {
      title: '标题',
      body: [
        {
          type: 'input-text',
          label: '文本',
          name: 'text'
        }
      ]
    }
  };
  previewSchema: any = {
    type: 'form',
    className: 'text-left',
    mode: 'horizontal',
    wrapWithPanel: false,
    body: [
      {
        ...this.scaffold
      }
    ]
  };

  panelTitle = '子表单项';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      {
        children: ({value, onChange}: any) => {
          return (
            <Button
              size="sm"
              level="danger"
              className="m-b"
              block
              onClick={this.editDetail.bind(this, context.id)}
            >
              配置成员渲染器
            </Button>
          );
        }
      },
      {
        name: 'labelField',
        type: 'input-text',
        value: 'label',
        label: '名称字段名',
        description: '当值中存在这个字段，则按钮名称将使用此字段的值来展示。'
      },
      {
        name: 'btnLabel',
        label: '按钮标签名',
        value: '设置',
        type: 'input-text'
      },
      {
        name: 'minLength',
        visibleOn: 'data.multiple',
        label: '允许最少个数',
        type: 'input-number'
      },

      {
        name: 'maxLength',
        visibleOn: 'data.multiple',
        label: '允许最多个数',
        type: 'input-number'
      }
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
    if (info.renderer.name === 'input-sub-form') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置成员渲染器',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (info.renderer.name === 'input-sub-form') {
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
    if (!node || !value) {
      return;
    }

    const {
      title,
      actions,
      name,
      size,
      closeOnEsc,
      showCloseButton,
      bodyClassName,
      type,
      ...rest
    } = value.form;
    const schema = {
      title,
      actions,
      name,
      size,
      closeOnEsc,
      showCloseButton,
      bodyClassName,
      type: 'dialog',
      body: {
        type: 'form',
        ...rest
      }
    };

    this.manager.openSubEditor({
      title: '配置子表单项',
      value: schema,
      memberImmutable: ['body'],
      onChange: newValue => {
        const form = newValue.body[0];
        newValue = {
          ...value,
          form
        };
        // delete newValue.form.body;
        delete newValue.form.type;
        manager.panelChangeValue(newValue, diff(value, newValue));
      }
    });
  }
}

registerEditorPlugin(SubFormControlPlugin);
