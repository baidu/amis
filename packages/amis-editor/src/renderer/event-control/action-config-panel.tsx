/**
 * 动作配置面板
 */

import {RendererProps, Schema} from 'amis-core';
import {defaultValue, RendererPluginAction} from 'amis-editor-core';
import React from 'react';
import cx from 'classnames';
import {COMMON_ACTION_SCHEMA_MAP, renderCmptActionSelect} from './helper';
import { Button } from 'amis';

export default class ActionConfigPanel extends React.Component<RendererProps> {
  render() {
    const {data, onBulkChange, render, pluginActions, actionConfigItemsMap} = this.props;
    const actionType = data.__subActions
      ? data.__cmptActionType
      : data.actionType;
    const commonActionConfig = {
      ...COMMON_ACTION_SCHEMA_MAP,
      ...actionConfigItemsMap
    };
    let schema: any = null;

    if (data.actionType === 'component') {
      // 获取组件动作配置
      const subActionSchema =
        pluginActions?.[data.__rendererName]?.find(
          (item: RendererPluginAction) =>
            item.actionType === data.__cmptActionType
        )?.schema ?? commonActionConfig[data.__cmptActionType]?.schema;
      const baseSchema = renderCmptActionSelect('选择组件', true);
      // 追加到基础配置
      schema = [
        ...(Array.isArray(baseSchema) ? baseSchema : [baseSchema]),
        ...(Array.isArray(subActionSchema)
          ? subActionSchema
          : [subActionSchema])
      ];
    }
    else {
      schema = data.__actionSchema;
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
    ) : data.__subActions ? (
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
