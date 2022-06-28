/**
 * 动作配置面板
 */

import {RendererProps} from 'amis-core';
import {Schema} from 'amis-core';
import React from 'react';
import cx from 'classnames';
import {RendererAction} from '.';

export default class ActionConfigPanel extends React.Component<RendererProps> {
  render() {
    const {actionConfigItems, data, onBulkChange, render, actions} = this.props;
    const hasParentType = ['component', 'openPage'].includes(data.actionType);
    const actionType = hasParentType ? data.__cmptActionType : data.actionType;
    let schema = undefined;
    if (data.actionType === 'component') {
      // 对于组件从actions中获取
      schema = actions?.[data.__rendererName]?.find((item: RendererAction) =>
        item.actionType === actionType
      )?.schema;
    }
    if (!schema) {
      schema = {
        ...actionConfigItems[actionType]
      }.schema;
    }

    return schema ? (
      render('inner', schema as Schema, {
        data,
        onChange: (value: any, field: any) => {
          onBulkChange({
            [field]: value
          });
        }
      })
    ) : data.__showSelectCmpt || hasParentType ? (
      <></>
    ) : (
      <div
        className={cx('ae-event-control-action-placeholder', {
          'no-settings': actionType
        })}
      >
        <div className="ae-event-control-action-placeholder-img" />
        <span>{actionType ? '无配置内容' : '请选择执行动作'}</span>
      </div>
    );
  }
}
