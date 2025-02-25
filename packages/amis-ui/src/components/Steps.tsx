import React from 'react';
import {ClassName, themeable, ThemeProps} from 'amis-core';
import {Icon} from './icons';

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
  subTitleClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
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
  mode?: 'horizontal' | 'vertical' | 'simple';

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
  mode?: 'horizontal' | 'vertical' | 'simple';
  labelPlacement?: 'horizontal' | 'vertical';
  progressDot?: boolean;
  onClickStep?: (i: number, step: StepObject) => void;
  iconPosition?: boolean;
  iconClassName?: string;
  subTitleClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function Steps(props: StepsProps) {
  const {
    steps: stepsRow,
    classnames: cx,
    className,
    style,
    current,
    status,
    mode = 'horizontal',
    labelPlacement = 'horizontal',
    progressDot = false,
    iconPosition,
    mobileUI,
    iconClassName,
    subTitleClassName,
    titleClassName,
    descriptionClassName,
    onClickStep
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
      style={style}
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
              `${progressDot ? 'StepsItem-ProgressDot' : ''}`,
              `${
                onClickStep && stepStatus === StepStatus.finish
                  ? 'is-clickable'
                  : ''
              }`
            )}
          >
            <div
              className={cx(
                'StepsItem-container',
                iconPosition && mode != 'vertical' && 'StepsItem-vertical'
              )}
            >
              <div className={cx('StepsItem-containerTail')}></div>
              {progressDot ? (
                <div
                  className={cx('StepsItem-containerProgressDot')}
                  onClick={() => onClickStep && onClickStep(i, step)}
                ></div>
              ) : (
                <div
                  className={cx(
                    'StepsItem-containerIcon',
                    i < current && 'is-success'
                  )}
                  onClick={() => onClickStep && onClickStep(i, step)}
                >
                  <span
                    className={cx(
                      'StepsItem-icon',
                      iconClassName,
                      step.iconClassName
                    )}
                  >
                    {icon ? <Icon icon={icon} className="icon" /> : i + 1}
                  </span>
                </div>
              )}
              <div
                className={cx('StepsItem-containerWrapper')}
                onClick={() => onClickStep && onClickStep(i, step)}
              >
                <div className={cx('StepsItem-body')}>
                  <div
                    className={cx(
                      'StepsItem-title',
                      `StepsItem-${progressDot ? 'vertical-ProgressDot' : ''}`,
                      i < current && 'is-success'
                    )}
                  >
                    <span
                      className={cx('StepsItem-ellText', titleClassName)}
                      title={
                        typeof step.title === 'string' ? step.title : undefined
                      }
                    >
                      {step.title}
                    </span>
                    {step.subTitle && (
                      <span
                        className={cx(
                          'StepsItem-subTitle',
                          'StepsItem-ellText',
                          subTitleClassName
                        )}
                        title={
                          typeof step.subTitle === 'string'
                            ? step.subTitle
                            : undefined
                        }
                      >
                        {step.subTitle}
                      </span>
                    )}
                  </div>
                  <div
                    className={cx('StepsItem-description', 'StepsItem-ellText')}
                    title={
                      typeof step.description === 'string'
                        ? step.description
                        : undefined
                    }
                  >
                    <span className={cx(descriptionClassName)}>
                      {step.description}
                    </span>
                  </div>
                </div>
                {mode === 'simple' && i < stepsRow.length - 1 && (
                  <div className={cx('StepsItem-icon-line')}>
                    <Icon
                      icon="right-arrow"
                      className="icon"
                      iconContent="StepsItem-icon-line"
                    />
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default themeable(Steps);
