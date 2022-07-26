import React from 'react';
import {ClassName, themeable, ThemeProps} from 'amis-core';
import {Icon} from './icons';
import {isMobile} from 'amis-core';

export enum StepStatus {
  wait = 'wait',
  process = 'process',
  finish = 'finish',
  error = 'error'
}

export type StepObject = {
  className?: ClassName;
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

  iconClassName?: string;
};

export interface StepsObject {
  /**
   * 指定为 Steps 步骤条渲染器
   */
  type: 'steps';

  /**
   * 步骤
   */
  steps?: Array<StepObject>;

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

  status: StepStatus;

  /**
   * 展示模式
   */
  mode?: 'horizontal' | 'vertical';

  /**
   * 标签放置位置
   */
  labelPlacement?: 'horizontal' | 'vertical';
}
export interface StepsProps extends ThemeProps {
  steps: StepObject[];
  className: string;
  current: number;
  status?:
    | StepStatus
    | {
        [propName: string]: StepStatus;
      };
  mode?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  progressDot?: boolean;
  useMobileUI?: boolean;
}

export function Steps(props: StepsProps) {
  const {
    steps: stepsRow,
    classnames: cx,
    className,
    current,
    status,
    mode = 'horizontal',
    labelPlacement = 'horizontal',
    progressDot = false,
    useMobileUI
  } = props;
  const FINISH_ICON = 'check';
  const ERROR_ICON = 'close';

  function getStepStatus(
    step: StepObject,
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

  const mobileUI = useMobileUI && isMobile();
  return (
    <ul
      className={cx(
        // 纵向步骤条暂时不支持labelPlacement属性
        'Steps',
        `Steps--Placement-${
          progressDot || (labelPlacement === 'vertical' && mode != 'vertical')
            ? 'vertical'
            : ''
        }`,
        `Steps--${progressDot ? 'ProgressDot' : ''}`,
        `Steps--${mode}`,
        mobileUI ? 'Steps-mobile' : '',
        className
      )}
    >
      {stepsRow.map((step, i) => {
        const {stepStatus, icon} = getStepStatus(step, i);
        return (
          <li
            key={i}
            className={cx(
              'StepsItem',
              `is-${stepStatus}`,
              step.className,
              `StepsItem-${progressDot ? 'ProgressDot' : ''}`
            )}
          >
            <div className={cx('StepsItem-container')}>
              <div className={cx('StepsItem-containerTail')}></div>
              {progressDot ? (
                <div className={cx('StepsItem-containerProgressDot')}></div>
              ) : (
                <div
                  className={cx(
                    'StepsItem-containerIcon',
                    i < current && 'is-success'
                  )}
                >
                  <span className={cx('StepsItem-icon', step.iconClassName)}>
                    {icon ? <Icon icon={icon} className="icon" /> : i + 1}
                  </span>
                </div>
              )}
              <div className={cx('StepsItem-containerWrapper')}>
                <div className={cx('StepsItem-body')}>
                  <div
                    className={cx(
                      'StepsItem-title',
                      `StepsItem-${progressDot ? 'vertical-ProgressDot' : ''}`,
                      i < current && 'is-success'
                    )}
                  >
                    <span
                      className={cx('StepsItem-ellText')}
                      title={String(step.title)}
                    >
                      {step.title}
                    </span>
                    {/* {step.subTitle && (  // 步骤条不支持副标题(4.0规范)
                      <span
                        className={cx(
                          'StepsItem-subTitle',
                          'StepsItem-ellText'
                        )}
                        title={String(step.subTitle)}
                      >
                        {step.subTitle}
                      </span>
                    )} */}
                  </div>
                  <div
                    className={cx('StepsItem-description', 'StepsItem-ellText')}
                    title={String(step.description)}
                  >
                    <span>{step.description}</span>
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

export default themeable(Steps);
