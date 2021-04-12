import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {Icon} from '../components/icons';

enum StepStatus {
    wait = 'wait',
    process = 'process',
    finish = 'finish',
    error = 'error'
};

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
    steps: Array<StepSchema>;

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
    }

    /**
     * 展示模式
     */
    mode?: 'horizontal' | 'vertical';
}

export interface StepsProps extends RendererProps, Omit<StepsSchema, 'className'> {}

export function Steps(props: StepsProps) {

    const { classnames: cx, steps, value = 0, status } = props;
    const valueIndex = steps.findIndex(item => item.value && item.value === value);
    const currentValue = valueIndex !== -1 ? valueIndex : value;
    console.log(props);

    return (
        <ul className={cx('Steps')}>
            {steps.map((step, i) => {
                const prefix: string = 'Steps-item';
                const finishIcon = 'check';
                const errorIcon = 'close';
                let stepStatus = StepStatus.wait;
                let icon = step.icon;

                if (i < currentValue) {
                    stepStatus = StepStatus.finish;
                    !icon && (icon = finishIcon);
                }
                else if (i === currentValue) {
                    stepStatus = StepStatus.process;
                }

                if (typeof status === 'string') {
                    if (i === currentValue) {
                        stepStatus = status || StepStatus.process;
                        stepStatus === StepStatus.error && !icon && (icon = errorIcon);
                    }
                }
                else if (typeof status === 'object') {
                    const key = step.value;
                    key && status[key] && (stepStatus = status[key]);
                }

                return (
                    <li key={i} className={cx(prefix, `${prefix}-${stepStatus}`)}>
                        <div className={cx(`${prefix}-wrapper`)}>
                            <div className={cx(`${prefix}-wrapper-icon`)}>
                                <span className={cx('Step-icon')}>
                                    {
                                        icon ? <Icon icon={icon} className="icon" /> : (i + 1)
                                    }
                                </span>
                            </div>
                            <div className={cx(`${prefix}-wrapper-container`)}>
                                <div className={cx(`${prefix}-wrapper-container-content`)}>
                                    <div className={cx('Step-title', i < currentValue && 'Step-success')}>
                                        <span>{step.title}</span>
                                        <span className="subtitle">{step.subTitle}</span>
                                    </div>
                                    <div className="step-description">{step.description}</div>
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

@Renderer({
    test: /(^|\/)steps$/,
    name: 'steps'
})
export class StepsRenderer extends React.Component<StepsProps> {
    render() {
        return <Steps {...this.props} />;
    }
}
