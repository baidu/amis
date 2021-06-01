import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {Icon} from '../components/icons';
import {
  RemoteOptionsProps,
  withRemoteConfig
} from '../components/WithRemoteConfig';
import {resolveVariable} from '../utils/tpl-builtin';
import {filter} from '../utils/tpl';

enum StepStatus {
  wait = 'wait',
  process = 'process',
  finish = 'finish',
  error = 'error'
}

export type StepSchema = {
  /**
   * 标题
   */
  title: string;

  /**
   * 子标题
   */
  subTitle?: string;

  /**
   * 图标
   */
  icon?: string;

  value?: string | number;

  /**
   * 描述
   */
  description?: string;
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
}

export interface StepsProps
  extends RendererProps,
    Omit<StepsSchema, 'className'> {}

export function Steps(props: StepsProps) {
  const {
    className,
    classnames: cx,
    steps,
    value = 0,
    status,
    data,
    source,
    config
  } = props;
  const stepsRow =
    (resolveVariable(source, data) as Array<StepSchema>) ||
    config ||
    steps ||
    [];
  const resolveValue =
    typeof value === 'string' && isNaN(+value)
      ? (resolveVariable(value, data) as string) || +value
      : +value;
  const valueIndex = stepsRow.findIndex(
    item => item.value && item.value === resolveValue
  );
  const currentValue = valueIndex !== -1 ? valueIndex : resolveValue;
  const FINISH_ICON = 'check';
  const ERROR_ICON = 'close';

  function getStepStatus(
    step: StepSchema,
    i: number
  ): {stepStatus: StepStatus; icon?: string} {
    let stepStatus = StepStatus.wait;
    let icon = step.icon;

    if (i < currentValue) {
      stepStatus = StepStatus.finish;
      !icon && (icon = FINISH_ICON);
    } else if (i === currentValue) {
      stepStatus = StepStatus.process;
    }

    if (typeof status === 'string') {
      if (i === currentValue) {
        const resolveStatus = resolveVariable(status, data);
        stepStatus = resolveStatus || status || StepStatus.process;
        stepStatus === StepStatus.error && !icon && (icon = ERROR_ICON);
      }
    } else if (typeof status === 'object') {
      const key = step.value;
      key && status[key] && (stepStatus = status[key]);
    }

    return {
      stepStatus,
      icon
    };
  }

  return (
    <ul className={cx('Steps', className)}>
      {stepsRow.map((step, i) => {
        const {stepStatus, icon} = getStepStatus(step, i);

        return (
          <li
            key={i}
            className={cx('StepsItem', `is-${stepStatus}`, step.className)}
          >
            <div className={cx('StepsItem-container')}>
              <div className={cx('StepsItem-containerIcon')}>
                <span className={cx('StepsItem-icon')}>
                  {icon ? <Icon icon={icon} className="icon" /> : i + 1}
                </span>
              </div>
              <div className={cx('StepsItem-containerWrapper')}>
                <div className={cx('StepsItem-body')}>
                  <div
                    className={cx(
                      'StepsItem-title',
                      i < currentValue && 'is-success'
                    )}
                  >
                    <span>{filter(step.title, data)}</span>
                    <span className={cx('StepsItem-subTitle')}>
                      {filter(step.subTitle || step.value, data)}
                    </span>
                  </div>
                  <div className={cx('StepsItem-description')}>
                    {filter(step.description, data)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const StepsWithRemoteConfig = withRemoteConfig({
  adaptor: data => data.steps || data
})(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof Steps>
  > {
    render() {
      const {config, deferLoad, loading, updateConfig, ...rest} = this.props;
      return <Steps config={config} {...rest} />;
    }
  }
);

@Renderer({
  type: 'steps',
  name: 'steps'
})
export class StepsRenderer extends React.Component<StepsProps> {
  render() {
    return <StepsWithRemoteConfig {...this.props} />;
  }
}
