import React from 'react';
import {registerEditorPlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {BasePlugin, RendererInfo, VRendererConfig} from 'amis-editor-core';
import {VRenderer} from 'amis-editor-core';
import {mapReactElement} from 'amis-editor-core';
import findIndex from 'lodash/findIndex';
import {RegionWrapper as Region} from 'amis-editor-core';
import {AnchorNavSection} from 'amis-ui';

export class AnchorNavPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'anchor-nav';
  $schema = '/schemas/AnchorNavSchema.json';

  // 组件名称
  name = '锚点导航';
  isBaseComponent = true;
  description =
    '锚点导航，在多行内容展示时，可以将内容用锚点导航分组的形式展示，点击导航菜单可以定位到对应内容区域。';
  docLink = '/amis/zh-CN/components/anchor-nav';
  tags = ['容器'];
  icon = 'fa fa-link';
  pluginIcon = 'anchor-nav-plugin';
  scaffold = {
    type: 'anchor-nav',
    links: [
      {
        title: '锚点1',
        href: '1',
        body: [
          {
            type: 'tpl',
            tpl: '这里是锚点内容1',
            inline: false
          }
        ]
      },
      {
        title: '锚点2',
        href: '2',
        body: [
          {
            type: 'tpl',
            tpl: '这里是锚点内容2',
            inline: false
          }
        ]
      },
      {
        title: '锚点3',
        href: '3',
        body: [
          {
            type: 'tpl',
            tpl: '这里是锚点内容3',
            inline: false
          }
        ]
      }
    ]
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '锚点导航';
  panelJustify = true;

  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '属性',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              getSchemaTpl('combo-container', {
                type: 'combo',
                name: 'links',
                label: '锚点设置',
                mode: 'normal',
                multiple: true,
                draggable: true,
                minLength: 1,
                addButtonText: '添加锚点',
                deleteBtn: {
                  icon: 'fa fa-trash'
                },
                items: [
                  {
                    type: 'input-text',
                    name: 'title',
                    required: true,
                    placeholder: '请输入锚点标题'
                  }
                ],
                scaffold: {
                  title: '锚点',
                  href: '',
                  body: [
                    {
                      type: 'tpl',
                      tpl: '这里是锚点内容',
                      inline: false
                    }
                  ]
                },
                draggableTip: '',
                onChange: (
                  value: Array<any>,
                  oldValue: Array<any>,
                  model: any,
                  form: any
                ) => {
                  const {active} = form.data;
                  const isInclude =
                    value.findIndex((link: any) => link.href === active) > -1;
                  form.setValues({
                    active: isInclude ? active : value[0].href
                  });
                },
                pipeOut: (value: any[]) => {
                  const hrefs = value.map(item => item.href);
                  const findMinCanUsedKey = (
                    keys: string[],
                    max: number
                  ): void | string => {
                    for (let i = 1; i <= max; i++) {
                      if (!keys.includes(String(i))) {
                        return String(i);
                      }
                    }
                  };
                  value.forEach((item: any) => {
                    if (!item.href) {
                      const key = findMinCanUsedKey(hrefs, value.length);
                      item.href = key;
                      item.title = `锚点${key}`;
                      item.body[0].tpl = `这里是锚点内容${key}`;
                    }
                  });
                  return value;
                }
              }),
              {
                name: 'active',
                type: 'select',
                label: '默认定位区域',
                source: '${links}',
                labelField: 'title',
                valueField: 'href',
                value: '1'
              }
            ]
          },
          getSchemaTpl('status')
        ])
      },
      {
        title: '外观',
        body: getSchemaTpl('collapseGroup', [
          {
            title: '基本',
            body: [
              {
                type: 'button-group-select',
                name: 'direction',
                label: '导航布局',
                value: 'vertical',
                options: [
                  {
                    label: '水平',
                    value: 'horizontal'
                  },
                  {
                    label: '垂直',
                    value: 'vertical'
                  }
                ]
              }
            ]
          },
          getSchemaTpl('style:classNames', {
            isFormItem: false,
            schema: [
              getSchemaTpl('className', {
                name: 'linkClassName',
                label: '导航'
              }),
              getSchemaTpl('className', {
                name: 'sectionClassName',
                label: '区域内容'
              })
            ]
          })
        ])
      }
    ])
  ];

  patchContainers = ['anchor-nav.body'];

  vRendererConfig: VRendererConfig = {
    regions: {
      body: {
        key: 'body',
        label: '内容区',
        renderMethod: 'renderBody',
        renderMethodOverride: (regions, insertRegion) =>
          function (this: any, ...args: any[]) {
            const info: RendererInfo = this.props.$$editor;
            const dom = this.super(...args);

            if (info && !this.props.children) {
              return insertRegion(
                this,
                dom,
                regions,
                info,
                info.plugin.manager
              );
            }

            return dom;
          }
      }
    },
    panelTitle: '内容区域',
    panelJustify: true,
    panelBody: [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基本',
                body: [
                  {
                    name: 'title',
                    label: '标题',
                    type: 'input-text',
                    required: true
                  }
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: 'CSS 类名',
                body: [getSchemaTpl('className')]
              }
            ])
          ]
        }
      ])
    ]
  };

  wrapperProps = {
    unmountOnExit: true,
    mountOnEnter: true
  };

  sectionWrapperResolve = (dom: HTMLElement) => dom.parentElement!;
  overrides = {
    render(this: any) {
      const dom = this.super();

      if (!this.renderSection && this.props.$$editor && dom) {
        const links = this.props.links;
        return mapReactElement(dom, item => {
          if (item.type === AnchorNavSection && item.props.$$id) {
            const id = item.props.$$id;
            const index = findIndex(links, (link: any) => link.$$id === id);
            const info: RendererInfo = this.props.$$editor;
            const plugin: AnchorNavPlugin = info.plugin as any;

            if (~index) {
              const region = plugin.vRendererConfig?.regions?.body;

              if (!region) {
                return item;
              }

              return React.cloneElement(item, {
                children: (
                  <VRenderer
                    key={id}
                    type={info.type}
                    plugin={info.plugin}
                    renderer={info.renderer}
                    $schema="/schemas/SectionSchema.json"
                    hostId={info.id}
                    memberIndex={index}
                    name={`${item.props.title || `锚点内容${index + 1}`}`}
                    id={id}
                    draggable={false}
                    removable={false}
                    wrapperResolve={plugin.sectionWrapperResolve}
                    schemaPath={`${info.schemaPath}/anchor-nav/${index}`}
                    path={`${this.props.$path}/${index}`} // 好像没啥用
                    data={this.props.data} // 好像没啥用
                  >
                    <Region
                      key={region.key}
                      preferTag={region.preferTag}
                      name={region.key}
                      label={region.label}
                      regionConfig={region}
                      placeholder={region.placeholder}
                      editorStore={plugin.manager.store}
                      manager={plugin.manager}
                      children={item.props.children}
                      wrapperResolve={region.wrapperResolve}
                      rendererName={info.renderer.name}
                    />
                  </VRenderer>
                )
              });
            }
          }

          return item;
        });
      }

      return dom;
    }
  };
}

registerEditorPlugin(AnchorNavPlugin);
