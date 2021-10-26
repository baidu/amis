import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema, SchemaCollection} from '../Schema';
import Steps, {StepStatus} from '../components/Steps';
import {
  RemoteOptionsProps,
  withRemoteConfig
} from '../components/WithRemoteConfig';
import {resolveVariable} from '../utils/tpl-builtin';
import {filter} from '../utils/tpl';
import {getPropValue} from '../utils/helper';

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

  status?: StepStatus | {
    [propName: string]: StepStatus;
  };

  /**
   * 展示模式
   */
  mode?: 'horizontal' | 'vertical';
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
    data,
    source,
    config,
    render
  } = props;
  
  const stepsRow =
    (resolveVariable(source, data) as Array<StepSchema>) ||
    config ||
    steps ||
    [];
  const resolveRender = (val?: string | SchemaCollection) => typeof val === 'string'
    ? filter(val, data)
    : val && render('inner', val);
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
    }
  });

  function getStepStatus(
    step: StepSchema,
    i: number
  ): StepStatus {
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
