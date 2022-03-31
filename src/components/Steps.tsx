import React from 'react';
import {themeable, ThemeProps} from '../theme';
import {Icon} from './icons';
import {BaseSchema} from '../Schema';
import {isMobile} from '../utils/helper';

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
  steps: StepSchema[];
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

  function strlen(str: string | any, max: number): {len: number, index: number} { 
    let len = 0;
    let index = 0;
    if (!str) {
      return {
        len: 0,
        index: 0
      }
    }
    for (let i = 0; i < str.length; i++) {   
      const character = str.charCodeAt(i);
      //字母数字占一字符，其余两字符
      if ((character >= 0x0001 && character <= 0x007e)
        || (0xff60<=character && character<=0xff9f)) {   
        len++;   
      } else {   
        len += 2;   
      }
      if (len < max) {
        index++;
      }
    }   
    return {len, index};  
  }

  function setTextLong(content: string | any): string {
    const {len, index} = strlen(content, 18);
    if (len > 18) {
      return content.slice(0, index + 1).concat('...');
    }
    return content;
  }

  const mobileUI = useMobileUI && isMobile();
  return (
    <ul className={cx( // 纵向步骤条暂时不支持labelPlacement属性
      'Steps',
      `Steps--Placement-${(progressDot || (labelPlacement === 'vertical' && mode != 'vertical')) ? 'vertical' : ''}`,
      `Steps--${progressDot ? 'ProgressDot' : ''}`, 
      `Steps--${mode}`,
      mobileUI ? 'Steps-mobile' : '', className)}>
      {stepsRow.map((step, i) => {
        const {stepStatus, icon} = getStepStatus(step, i);
        return (
          <li
            key={i}
            className={cx('StepsItem', `is-${stepStatus}`, step.className, `StepsItem-${progressDot ? 'ProgressDot' : ''}`)}
          >
            <div className={cx('StepsItem-container')}>
                <div className={cx('StepsItem-containerTail')}></div>
                {progressDot ? <div className={cx('StepsItem-containerProgressDot')}></div>
                  : <div className={cx('StepsItem-containerIcon', i < current && 'is-success')}>
                      <span className={cx('StepsItem-icon')}>
                          {icon ? <Icon icon={icon} className="icon" /> : i + 1}
                      </span>
                    </div>}
              <div className={cx('StepsItem-containerWrapper')}>
                <div className={cx('StepsItem-body')}>
                  <div
                    className={cx(
                      'StepsItem-title',
                      `StepsItem-${progressDot ? 'vertical-ProgressDot' : ''}`,
                      i < current && 'is-success'
                    )}
                  >
                    <span className={cx('StepsItem-ellText')} title={String(step.title)}>{step.title}</span>
                    <span className={cx('StepsItem-subTitle', 'StepsItem-ellText')} title={String(step.subTitle)}>{step.subTitle}</span>
                  </div>
                  <div className={cx('StepsItem-description', 'StepsItem-ellText')} title={String(step.description)}>
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
