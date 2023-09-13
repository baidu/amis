import React from 'react';
import {
  Renderer,
  RendererProps,
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter,
  filter,
  getPropValue
} from 'amis-core';
import {Steps, StepStatus, RemoteOptionsProps, withRemoteConfig} from 'amis-ui';
import {BaseSchema, SchemaCollection} from '../Schema';
import isPlainObject from 'lodash/isPlainObject';
import type {SchemaExpression} from 'amis-core';

export type StepSchema = {
  /**
   * 标题
   */
  title: string | SchemaCollection;

  /**
   * 子标题
   */
  subTitle?: string | SchemaCollection;

  /**
   * 图标
   */
  icon?: string;

  value?: string | number;

  /**
   * 描述
   */
  description?: string | SchemaCollection;
} & Omit<BaseSchema, 'type'>;

export interface StepsSchema extends BaseSchema {
  /**
   * 指定为 Steps 步骤条渲染器
   */
  type: 'steps';

  /**
   * 步骤
   */
  steps?: Array<StepSchema>;

  /**
   * API 或 数据映射
   */
  source?: string;

  /**
   * 指定当前步骤
   */
  value?: number | string;

  /**
   * 变量映射
   */
  name?: string;

  status?:
    | StepStatus
    | {
        [propName: string]: StepStatus;
      }
    | SchemaExpression;

  /**
   * 展示模式
   */
  mode?: 'horizontal' | 'vertical';

  /**
   * 标签放置位置
   */
  labelPlacement?: 'horizontal' | 'vertical';

  /**
   * 点状步骤条
   */
  progressDot?: boolean;
}

export interface StepsProps
  extends RendererProps,
    Omit<StepsSchema, 'className'> {}

export function StepsCmpt(props: StepsProps) {
  const {
    className,
    style,
    steps,
    status,
    mode,
    labelPlacement,
    progressDot,
    data,
    source,
    render,
    mobileUI
  } = props;
  let sourceResult: Array<StepSchema> = resolveVariableAndFilter(
    source,
    data,
    '| raw'
  ) as Array<StepSchema>;
  /** 步骤数据源 */
  const stepsRow: Array<StepSchema> =
    (Array.isArray(sourceResult) ? sourceResult : undefined) || steps || [];
  /** 状态数据源 */
  const statusValue = isPureVariable(status)
    ? resolveVariableAndFilter(status, data, '| raw')
    : status;

  const resolveRender = (val?: string | SchemaCollection) =>
    typeof val === 'string' ? filter(val, data) : val && render('inner', val);
  const value = getPropValue(props) ?? 0;
  const resolveValue =
    typeof value === 'string' && isNaN(+value)
      ? resolveVariable(value, data) || value
      : +value;
  const valueIndex = stepsRow.findIndex(
    item => item.value && item.value === resolveValue
  );
  const currentValue = valueIndex !== -1 ? valueIndex : resolveValue;
  const resolveSteps = stepsRow.map((step, i) => {
    const stepStatus = getStepStatus(step, i);
    return {
      ...step,
      status: stepStatus,
      title: resolveRender(step.title),
      subTitle: resolveRender(step.subTitle),
      description: resolveRender(step.description)
    };
  });

  function getStepStatus(step: StepSchema, i: number): StepStatus {
    let stepStatus;

    if (typeof statusValue === 'string') {
      if (i === currentValue) {
        stepStatus = statusValue || status || StepStatus.process;
      }
    } else if (typeof statusValue === 'object') {
      const key = step.value;
      key && statusValue[key] && (stepStatus = statusValue[key]);
    }

    return stepStatus;
  }

  return (
    <Steps
      current={currentValue}
      steps={resolveSteps}
      className={className}
      style={style}
      status={statusValue}
      mode={mode}
      progressDot={progressDot}
      labelPlacement={labelPlacement}
      mobileUI={mobileUI}
    ></Steps>
  );
}

const StepsWithRemoteConfig = withRemoteConfig()(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof StepsCmpt>
  > {
    render() {
      const {config, deferLoad, loading, updateConfig, ...rest} = this.props;
      const sourceConfig = isPlainObject(config) ? config : null;

      return <StepsCmpt {...rest} {...sourceConfig} />;
    }
  }
);

@Renderer({
  type: 'steps'
})
export class StepsRenderer extends React.Component<StepsProps> {
  render() {
    return <StepsWithRemoteConfig {...this.props} />;
  }
}
