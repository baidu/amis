/**
 * @file 进行详细配置
 */

import React from 'react';
import cx from 'classnames';
import {Renderer, toast} from 'amis';

import {EditorManager} from 'amis-editor-core';
import {autobind, FormControlProps} from 'amis-core';

export interface GoCongigControlProps extends FormControlProps {
  label: string;
  compId: string | ((data: any) => string);
  manager: EditorManager;
}

export class GoConfigControl extends React.PureComponent<
  GoCongigControlProps,
  any
> {
  @autobind
  onClick() {
    const {data: ctx = {}, compId, manager} = this.props;
    const id = typeof compId === 'string' ? compId : compId(ctx);

    if (!id) {
      toast.error('未找到对应组件');
      return;
    }
    manager.setActiveId(id);
  }

  render() {
    const {className, label, data: ctx = {}} = this.props;

    return (
      <div className={cx('ae-GoConfig', className)} onClick={this.onClick}>
        {label}
        <div className={cx('ae-GoConfig-trigger')}>去编辑</div>
      </div>
    );
  }
}

@Renderer({
  type: 'ae-go-config'
})
export class GoConfigControlRenderer extends GoConfigControl {}
