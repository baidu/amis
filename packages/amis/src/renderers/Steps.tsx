import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {BaseSchema, SchemaCollection} from '../Schema';
import {Steps} from 'amis-ui';
import {RemoteOptionsProps, withRemoteConfig} from 'amis-ui';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';
import {filter} from 'amis-core';
import {getPropValue} from 'amis-core';
import {StepStatus} from 'amis-ui';

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
      };

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
    steps,
    status,
    mode,
    labelPlacement,
    progressDot,
    data,
    source,
    config,
    render,
    useMobileUI
  } = props;

  let sourceResult: Array<StepSchema> = resolveVariableAndFilter(
    source,
    data,
    '| raw'
  ) as Array<StepSchema>;

  const stepsRow: Array<StepSchema> =
    (Array.isArray(sourceResult) ? sourceResult : undefined) ||
    config ||
    steps ||
    [];

  const resolveRender = (val?: string | SchemaCollection) =>
    typeof val === 'string' ? filter(val, data) : val && render('inner', val);
  const value = getPropValue(props) ?? 0;
  const resolveValue =
    typeof value === 'string' && isNaN(+value)
      ? +(resolveVariable(value, data) as string) || +value
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

    if (typeof status === 'string') {
      if (i === currentValue) {
        const resolveStatus = resolveVariable(status, data);
        stepStatus = resolveStatus || status || StepStatus.process;
      }
    } else if (typeof status === 'object') {
      const key = step.value;
      key && status[key] && (stepStatus = status[key]);
    }

    return stepStatus;
  }

  return (
    <Steps
      current={currentValue}
      steps={resolveSteps}
      className={className}
      status={status}
      mode={mode}
      progressDot={progressDot}
      labelPlacement={labelPlacement}
      useMobileUI={useMobileUI}
    ></Steps>
  );
}

const StepsWithRemoteConfig = withRemoteConfig({
  adaptor: data => data.steps || data
})(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof StepsCmpt>
  > {
    render() {
      const {config, deferLoad, loading, updateConfig, ...rest} = this.props;
      return <StepsCmpt config={config} {...rest} />;
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
