import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {Icon} from './icons';
import {BaseSchema} from '../Schema';

export enum StepStatus {
  wait = 'wait',
  process = 'process',
  finish = 'finish',
  error = 'error'
}

export type StepSchema = {
  /**
   * 标题
   */
  title?: string | JSX.Element;

  /**
   * 子标题
   */
  subTitle?: string | JSX.Element;

  /**
   * 图标
   */
  icon?: string;

  value?: string | number;

  /**
   * 描述
   */
  description?: string | JSX.Element;

  status?: StepStatus;
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

  status: StepStatus

  /**
   * 展示模式
   */
  mode?: 'horizontal' | 'vertical';
}

export interface StepsProps extends ThemeProps {
  steps: StepSchema[];
  className: string;
  current: number;
  status?: StepStatus | {
    [propName: string]: StepStatus;
  };
  mode?: 'horizontal' | 'vertical';
}

export function Steps(props: StepsProps) {
  const {
    steps: stepsRow,
    classnames: cx,
    className,
    current,
    status,
    mode = 'horizontal'
  } = props;
  const FINISH_ICON = 'check';
  const ERROR_ICON = 'close';

  function getStepStatus(
    step: StepSchema,
    i: number
  ): {stepStatus: StepStatus; icon?: string} {
    let stepStatus: StepStatus = StepStatus.wait;
    let icon = step.icon;

    if (i < current) {
      stepStatus = StepStatus.finish;
      !icon && (icon = FINISH_ICON);
    } else if (i === current) {
      stepStatus = StepStatus.process;
    }

    if (typeof status === 'string') {
      if (i === current) {
        stepStatus = step.status || status || StepStatus.process;
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
    <ul className={cx('Steps', `Steps--${mode}`, className)}>
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
                      i < current && 'is-success'
                    )}
                  >
                    <span>{step.title}</span>
                    <span className={cx('StepsItem-subTitle')}>
                      {step.subTitle}
                    </span>
                  </div>
                  <div className={cx('StepsItem-description')}>
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  )
}

export default themeable(Steps);