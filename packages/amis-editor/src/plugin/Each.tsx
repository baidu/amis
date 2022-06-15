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
import {defaultValue, getSchemaTpl} from 'amis-editor-core';
import {diff, JSONPipeOut} from 'amis-editor-core';

export class EachPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'each';
  $schema = '/schemas/EachSchema.json';

  // 组件名称
  name = '循环 Each';
  isBaseComponent = true;
  description = '功能渲染器，可以基于现有变量循环输出渲染器。';
  tags = ['功能'];
  icon = 'fa fa-repeat';
  scaffold = {
    type: 'each',
    name: 'arr',
    items: {
      type: 'tpl',
      tpl: '<%= data.index + 1 %>. 内容：<%= data.item %>',
      inline: false
    }
  };
  previewSchema = {
    ...this.scaffold,
    value: ['a', 'b', 'c']
  };

  panelTitle = '循环';
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      {
        type: 'input-text',
        name: 'name',
        label: '关联字段',
        placeholder: 'varname',
        description:
          '如果所在容器有下发 value 则不需要配置，如果没有请配置变量名，支持多层级如：a.b，表示关联a对象下的b属性。目标变量可以是数组，也可以是对象。'
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
            配置成员渲染器
          </Button>
        )
      },

      {
        name: 'placeholder',
        type: 'input-text',
        label: '占位符',
        pipeIn: defaultValue('暂无内容'),
        description:
          '当没有关联变量，或者目标变量不是数组或者对象时显示此占位信息'
      },

      getSchemaTpl('className')
    ];
  };

  filterProps(props: any) {
    props = JSONPipeOut(props);

    // 至少显示一个成员，否则啥都不显示。
    if (!props.value) {
      props.value = [
        {
          item: 'mocked data'
        }
      ];
    }

    return props;
  }

  buildEditorToolbar(
    {id, info}: BaseEventContext,
    toolbars: Array<BasicToolbarItem>
  ) {
    if (info.renderer.name === 'each') {
      toolbars.push({
        icon: 'fa fa-expand',
        order: 100,
        tooltip: '配置成员渲染器',
        onClick: this.editDetail.bind(this, id)
      });
    }
  }

  buildEditorContextMenu(
    {id, schema, region, info, selections}: ContextMenuEventContext,
    menus: Array<ContextMenuItem>
  ) {
    if (selections.length || info?.plugin !== this) {
      return;
    }
    if (info.renderer.name === 'each') {
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
        title: '配置成员渲染器',
        value: value.items,
        slot: {
          type: 'container',
          body: '$$'
        },
        typeMutable: true,
        onChange: newValue => {
          newValue = {...value, items: newValue};
          manager.panelChangeValue(newValue, diff(value, newValue));
        },
        data: {
          item: 'mocked data',
          index: 0
        }
      });
  }
}

registerEditorPlugin(EachPlugin);
