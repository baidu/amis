/**
 * @file 组件选项组件的可视化编辑控件
 */

import React from 'react';
import cx from 'classnames';
import set from 'lodash/set';
import get from 'lodash/get';
import Sortable from 'sortablejs';
import {FormItem, Button, InputBox, Switch, Radios} from 'amis';

import {autobind} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import type {FormControlProps} from 'amis-core';
import type {SchemaApi} from 'amis';

export type valueType = 'text' | 'boolean' | 'number';

export type NavControlItem = {
  label: string;
  to: string;
  target: string;
  icon?: string;
  unfolded?: boolean;
  active?: boolean;
  activeOn?: string;
  overflow?: {
    enable: boolean;
    overflowLabel: string;
    overflowIndicator: string;
    maxVisibleCount: number;
  };
  // todo any
  children?: Array<any>;
};

export interface NavControlProps extends FormControlProps {}

export interface OptionControlState {
  links: Array<NavControlItem>;
  api: SchemaApi;
  source: 'custom' | 'api' | 'apicenter';
}

type IconType = {id: string; name: string};

export default class NavSourceControl extends React.Component<
  NavControlProps,
  OptionControlState
> {
  sortable?: Sortable;
  drag?: HTMLElement | null;
  target: HTMLElement | null;
  $comp: string; // 记录一下路径，不再从外部同步内部，只从内部同步外部

  internalProps = ['checked', 'editing'];

  constructor(props: NavControlProps) {
    super(props);

    let source: 'custom' | 'api' | 'apicenter' = 'custom';

    if (props.data.hasOwnProperty('source') && props.data.source) {
      const api = props.data.source;
      const url =
        typeof api === 'string'
          ? api
          : typeof api === 'object'
          ? api.url || ''
          : '';

      source = !url.indexOf('api://') ? 'apicenter' : 'api';
    }

    this.state = {
      links: this.transformOptions(props),
      api: props.data.source,
      source
    };
  }

  transformOptions(props: NavControlProps) {
    const {data} = props;
    return Array.isArray(data.links) ? data.links : [];
  }

  /**
   * 更新options字段的统一出口
   */
  onChange() {
    const {onBulkChange} = this.props;
    const {source} = this.state;
    const data: Partial<NavControlProps> = {
      source: undefined,
      links: undefined
    };

    if (source === 'custom') {
      const {links} = this.state;
      data.links = links;
    }

    if (source === 'api' || source === 'apicenter') {
      const {api} = this.state;
      data.source = api;
    }
    onBulkChange && onBulkChange(data);
    return;
  }

  /**
   * 切换选项类型
   */
  @autobind
  handleSourceChange(source: 'custom' | 'api' | 'apicenter') {
    this.setState({source: source}, this.onChange);
  }

  /**
   * 删除选项
   */
  @autobind
  handleDelete(index: string) {
    const links = this.state.links.concat();
    const indexArr = typeof index === 'string' ? index.split('_') : [index];
    let str = '';
    for (let i = 1; i < indexArr.length; i++) {
      let id = indexArr[i];
      if (i === indexArr.length - 1) {
        str += `children`;
      } else {
        str += `children[${id}].`;
      }
    }
    const originChildren = get(links[parseInt(indexArr[0])], str);
    originChildren.splice(indexArr[indexArr.length - 1], 1);
    this.setState({links}, () => this.onChange());
  }

  @autobind
  handleAdd() {
    const {links} = this.state;
    links.push({
      label: '',
      to: '',
      target: '',
      icon: '',
      unfolded: false,
      active: false,
      children: []
    });
    this.setState({links}, () => {
      this.onChange();
    });
  }

  renderHeader() {
    const {
      render,
      label,
      labelRemark,
      useMobileUI,
      env,
      popOverContainer,
      hasApiCenter
    } = this.props;
    const classPrefix = env?.theme?.classPrefix;
    const {source} = this.state;
    const optionSourceList = (
      [
        {
          label: '自定义选项',
          value: 'custom'
        },
        {
          label: '外部接口',
          value: 'api'
        },
        ...(hasApiCenter ? [{label: 'API中心', value: 'apicenter'}] : [])
      ] as Array<{
        label: string;
        value: 'custom' | 'api' | 'apicenter';
      }>
    ).map(item => ({
      ...item,
      onClick: () => this.handleSourceChange(item.value)
    }));

    return (
      <header className="ae-NavControl-header">
        <label className={cx(`${classPrefix}Form-label`)}>
          {label || ''}
          {labelRemark
            ? render('label-remark', {
                type: 'remark',
                icon: labelRemark.icon || 'warning-mark',
                tooltip: labelRemark,
                className: cx(`Form-lableRemark`, labelRemark?.className),
                useMobileUI,
                container: popOverContainer || env.getModalContainer
              })
            : null}
        </label>
        <div>
          {render(
            'validation-control-addBtn',
            {
              type: 'dropdown-button',
              level: 'link',
              size: 'sm',
              label: '${selected}',
              align: 'right',
              closeOnClick: true,
              closeOnOutside: true,
              buttons: optionSourceList
            },
            {
              popOverContainer: null,
              data: {
                selected: optionSourceList.find(item => item.value === source)!
                  .label
              }
            }
          )}
        </div>
      </header>
    );
  }

  @autobind
  handleEditLabel(
    index: string,
    value: string | boolean | IconType,
    key: string
  ) {
    const links = this.state.links.concat();
    const indexArr = typeof index === 'string' ? index.split('_') : [index];
    let str = '';
    for (let i = 1; i < indexArr.length; i++) {
      let id = indexArr[i];
      str += `children[${id}].`;
    }
    str += key;

    set(links[parseInt(indexArr[0])], str, value);

    this.setState({links}, () => this.onChange());
  }

  @autobind
  handleAddChildren(index: string, value: boolean) {
    const links = this.state.links.concat();
    const indexArr = typeof index === 'string' ? index.split('_') : [index];

    let str = '';
    for (let i = 1; i < indexArr.length; i++) {
      let id = indexArr[i];
      str += `children[${id}].`;
    }
    str += 'children';

    let originChildren = get(links[parseInt(indexArr[0])], str) || [];
    originChildren.push({
      label: '',
      to: '',
      target: '',
      icon: '',
      unfolded: false,
      active: false,
      children: []
    });

    if (value) {
      set(links[parseInt(indexArr[0])], str, originChildren);
    } else {
      set(links[parseInt(indexArr[0])], str, []);
    }
    this.setState({links}, () => this.onChange());
  }

  renderNav(props: any) {
    const {index} = props;
    const render = this.props.render;
    return (
      <div key={index}>
        <div
          className="ae-closeBtn"
          onClick={() => {
            this.handleDelete(index);
          }}
        >
          ×
        </div>
        <div className="ae-navControlLinks">
          菜单名称:
          <InputBox
            className="ae-OptionControlItem-input"
            value={props.label}
            placeholder="请输入菜单名称"
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'label')
            }
          />
        </div>
        <div className="ae-navControlLinks">
          跳转地址:
          <InputBox
            className="ae-OptionControlItem-input"
            value={props.to}
            placeholder="请输入跳转地址"
            onChange={(value: string) =>
              this.handleEditLabel(index, value, 'to')
            }
          />
        </div>
        <div className="ae-navControlLinks">
          是否需要新开页面:
          <Switch
            value={props.target === '_parent'}
            onChange={(value: boolean) =>
              this.handleEditLabel(
                index,
                value ? '_parent' : '_blank',
                'target'
              )
            }
          />
        </div>

        <div style={{height: 40}}>
          {render(
            'container',
            getSchemaTpl('icon', {
              name: 'icon',
              label: '图标',
              mode: 'horizontal',
              onChange: (icon: IconType) => {
                this.handleEditLabel(index, icon, 'icon');
              },
              horizontal: {
                justify: true,
                left: 4
              }
            })
          )}
        </div>
        <div className="ae-navControlLinks">
          初始是否折叠:
          <Switch
            value={props.unfolded}
            onChange={(value: boolean) =>
              this.handleEditLabel(index, value, 'unfolded')
            }
          />
        </div>
        {/* <div className="ae-navControlLinks">
          是否高亮:
          <Radios
            value={props.active}
            options={[
              {label: '是', value: true},
              {label: '否', value: false},
              {label: '表达式', value: ''}
            ]}
            onChange={(item: {label: string; value: boolean | string}) =>
              this.handleEditLabel(index, item.value, 'active')
            }
          />
        </div>
        {props.active === '' && (
          <div className="ae-navControlLinks">
            表达式:
            <InputBox
              value={props.activeOn}
              placeholder="留空将自动分析菜单地址"
              onChange={(value: string) =>
                this.handleEditLabel(index, value, 'activeOn')
              }
            />
          </div>
        )} */}
      </div>
    );
  }

  renderOption(props: any) {
    const {index, children} = props;

    return (
      <div className="ae-OptionControlItem" key={index}>
        {this.renderNav(props)}
        <div className="ae-navControlLinks">
          包含子菜单:
          <Switch
            value={!!(children && children.length)}
            onChange={(value: boolean) => this.handleAddChildren(index, value)}
          />
        </div>
        {children && children.length ? (
          <>
            {children.map((item: any, id: number) => {
              return this.renderOption({...item, index: `${index}_${id}`});
            })}
            <Button onClick={() => this.handleAddChildren(index, true)}>
              新增子菜单
            </Button>
          </>
        ) : null}
      </div>
    );
  }

  @autobind
  handleAPIChange(source: SchemaApi) {
    this.setState({api: source}, this.onChange);
  }

  renderApiPanel() {
    const {render} = this.props;
    const {source, api} = this.state;
    if (source === 'custom') {
      return null;
    }

    return render(
      'api',
      getSchemaTpl('apiControl', {
        label: '接口',
        name: 'source',
        mode: 'normal',
        className: 'ae-ExtendMore',
        visibleOn: 'data.autoComplete !== false',
        value: api,
        onChange: this.handleAPIChange,
        sourceType: source
      })
    );
  }

  render() {
    const {links, source} = this.state;
    const {className} = this.props;

    return (
      <div className={cx('ae-NavControl', className)}>
        {this.renderHeader()}

        {source === 'custom' ? (
          <div className="ae-NavControl-wrapper">
            {Array.isArray(links) && links.length ? (
              <div className="ae-NavControl-content">
                {links.map((option, index) =>
                  this.renderOption({...option, index})
                )}
              </div>
            ) : (
              <div className="ae-NavControl-placeholder">无选项</div>
            )}
            <div className="ae-NavControl-footer">
              <Button level="enhance" onClick={this.handleAdd}>
                添加菜单
              </Button>
            </div>
          </div>
        ) : null}

        {this.renderApiPanel()}
      </div>
    );
  }
}

@FormItem({
  type: 'ae-navSourceControl',
  renderLabel: false
})
export class NavSourceControlRenderer extends NavSourceControl {}
