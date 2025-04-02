import React from 'react';
import {
  Renderer,
  RendererProps,
  isPureVariable,
  resolveVariable,
  resolveVariableAndFilter,
  filter,
  getPropValue,
  CustomStyle,
  setThemeClassName
} from 'amis-core';
import {Steps, RemoteOptionsProps, withRemoteConfig} from 'amis-ui';
import {StepStatus} from 'amis-ui/lib/components/Steps';
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

  /**
   * 切换图标位置
   */
  iconPosition: false;
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
    iconPosition,
    labelPlacement,
    progressDot,
    data,
    source,
    render,
    mobileUI,
    iconClassName,
    titleClassName,
    subTitleClassName,
    descriptionClassName
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
      iconClassName={iconClassName}
      subTitleClassName={subTitleClassName}
      titleClassName={titleClassName}
      descriptionClassName={descriptionClassName}
      style={style}
      status={statusValue}
      mode={mode}
      iconPosition={iconPosition}
      progressDot={progressDot}
      labelPlacement={labelPlacement}
      mobileUI={mobileUI}
    />
  );
}

const StepsWithRemoteConfig = withRemoteConfig()(
  class extends React.Component<
    RemoteOptionsProps & React.ComponentProps<typeof StepsCmpt>
  > {
    render() {
      const {
        classnames: cx,
        config,
        deferLoad,
        loading,
        updateConfig,
        id,
        wrapperCustomStyle,
        env,
        themeCss,
        className,
        classPrefix: ns,
        ...rest
      } = this.props;
      const sourceConfig = isPlainObject(config) ? config : null;

      return (
        <>
          <StepsCmpt
            {...rest}
            {...sourceConfig}
            className={cx(
              `${ns}StepsControl`,
              className,
              setThemeClassName({
                ...this.props,
                name: 'baseControlClassName',
                id,
                themeCss
              })
            )}
            iconClassName={setThemeClassName({
              ...this.props,
              name: [
                'iconControlClassNameDefault',
                'iconControlClassNameFinish',
                'iconControlClassNameProcess',
                'iconControlClassNameWait',
                'iconControlClassNameError'
              ],
              id,
              themeCss
            })}
            subTitleClassName={setThemeClassName({
              ...this.props,
              name: [
                'subTitleControlClassNameDefault',
                'subTitleControlClassNameFinish',
                'subTitleControlClassNameProcess',
                'subTitleControlClassNameWait',
                'subTitleControlClassNameError'
              ],
              id,
              themeCss
            })}
            titleClassName={cx(
              setThemeClassName({
                ...this.props,
                name: [
                  'titleControlClassNameDefault',
                  'titleControlClassNameFinish',
                  'titleControlClassNameProcess',
                  'titleControlClassNameWait',
                  'titleControlClassNameError'
                ],
                id,
                themeCss
              })
            )}
            descriptionClassName={setThemeClassName({
              ...this.props,
              name: [
                'descriptionControlClassNameDefault',
                'descriptionControlClassNameFinish',
                'descriptionControlClassNameProcess',
                'descriptionControlClassNameWait',
                'descriptionControlClassNameError'
              ],
              id,
              themeCss
            })}
          ></StepsCmpt>
          <CustomStyle
            {...this.props}
            config={{
              wrapperCustomStyle,
              id,
              themeCss,
              classNames: [
                {key: 'baseControlClassName'},
                {
                  key: 'iconControlClassNameDefault',
                  weights: {
                    default: {
                      important: true
                    }
                  }
                },
                {
                  key: 'iconControlClassNameFinish',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-finish'
                    }
                  }
                },
                {
                  key: 'iconControlClassNameProcess',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-process'
                    }
                  }
                },
                {
                  key: 'iconControlClassNameWait',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-wait'
                    }
                  }
                },
                {
                  key: 'iconControlClassNameError',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-error'
                    }
                  }
                },
                {
                  key: 'subTitleControlClassNameDefault',
                  weights: {
                    default: {
                      important: true
                    }
                  }
                },
                {
                  key: 'subTitleControlClassNameProcess',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-process'
                    }
                  }
                },
                {
                  key: 'subTitleControlClassNameFinish',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-finish'
                    }
                  }
                },
                {
                  key: 'subTitleControlClassNameWait',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-wait'
                    }
                  }
                },
                {
                  key: 'subTitleControlClassNameError',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-error'
                    }
                  }
                },
                {
                  key: 'titleControlClassNameDefault',
                  weights: {
                    default: {
                      important: true
                    }
                  }
                },
                {
                  key: 'titleControlClassNameProcess',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-process'
                    }
                  }
                },
                {
                  key: 'titleControlClassNameFinish',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-finish'
                    }
                  }
                },
                {
                  key: 'titleControlClassNameWait',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-wait'
                    }
                  }
                },
                {
                  key: 'titleControlClassNameError',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-error'
                    }
                  }
                },
                {
                  key: 'descriptionControlClassNameDefault',
                  weights: {
                    default: {
                      important: true
                    }
                  }
                },
                {
                  key: 'descriptionControlClassNameFinish',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-finish'
                    }
                  }
                },
                {
                  key: 'descriptionControlClassNameProcess',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-process'
                    }
                  }
                },
                {
                  key: 'descriptionControlClassNameWait',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-wait'
                    }
                  }
                },
                {
                  key: 'descriptionControlClassNameError',
                  weights: {
                    default: {
                      important: true,
                      parent: '.is-error'
                    }
                  }
                }
              ]
            }}
            env={env}
          />
        </>
      );
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
