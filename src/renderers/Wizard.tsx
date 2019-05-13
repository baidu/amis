import * as React from 'react';
import * as PropTypes from 'prop-types';
import Scoped, {ScopedContext, IScopedContext} from '../Scoped';

import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, SchemaNode, Schema, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx = require('classnames');
import {observer} from 'mobx-react';
import {createObject, until} from '../utils/helper';
import {buildApi, isValidApi, isApiOutdated} from '../utils/api';
import {IFormStore} from '../store/form';

export type TabProps = Schema & {
    title?: string; // 标题
    icon?: string;
    hash?: string; // 通过 hash 来控制当前选择
    tab: Schema;
    className: string;
};

export interface WizardProps extends RendererProps {
    store: IServiceStore;
    readOnly?: boolean;
    actionClassName?: string;
    actionPrevLabel?: string;
    actionNextLabel?: string;
    actionNextSaveLabel?: string;
    actionFinishLabel?: string;
    mode?: 'horizontal' | 'vertical';
    onFinished: (values: object, action: any) => any;
}

export interface WizardState {
    currentStep: number;
}

export default class Wizard extends React.Component<WizardProps, WizardState> {
    static defaultProps: Partial<WizardProps> = {
        mode: 'horizontal', // vertical
        readOnly: false,
        messages: {},
        actionClassName: '',
        actionPrevLabel: '上一步',
        actionNextLabel: '下一步',
        actionNextSaveLabel: '保存并下一步',
        actionFinishLabel: '完成',
    };

    static propsList: Array<string> = [
        'steps',
        'mode',
        'messages',
        'actionClassName',
        'actionPrevLabel',
        'actionNextLabel',
        'actionNextSaveLabel',
        'actionFinishLabel',
        'onFinished',
    ];

    dom: any;
    form: any;
    asyncCancel: () => void;
    constructor(props: WizardProps) {
        super(props);

        this.state = {
            currentStep: -1, // init 完后会设置成 1
        };

        this.handleAction = this.handleAction.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.formRef = this.formRef.bind(this);
        this.domRef = this.domRef.bind(this);
        this.getPopOverContainer = this.getPopOverContainer.bind(this);
    }

    componentDidMount() {
        const {
            initApi,
            initFetch,
            initAsyncApi,
            initFinishedField,
            store,
            data,
            messages: {fetchSuccess, fetchFailed},
            onInit,
        } = this.props;

        if (initApi && initFetch !== false && (!initApi.sendOn || evalExpression(initApi.sendOn, data))) {
            store
                .fetchInitData(initApi, store.data, {
                    successMessage: fetchSuccess,
                    errorMessage: fetchFailed,
                    onSuccess: () => {
                        if (!initAsyncApi || store.data[initFinishedField || 'finished']) {
                            return;
                        }

                        return until(
                            () => store.checkRemote(initAsyncApi, store.data),
                            (ret: any) => ret && ret[initFinishedField || 'finished'],
                            cancel => (this.asyncCancel = cancel)
                        );
                    },
                })
                .then(value => {
                    onInit && onInit(store.data);

                    if (value && value.data && typeof value.data.step === 'number') {
                        this.setState({
                            currentStep: value.data.step,
                        });
                    } else {
                        this.setState({
                            currentStep: 1,
                        });
                    }
                    return value;
                });
        } else {
            this.setState(
                {
                    currentStep: 1,
                },
                () => onInit && onInit(store.data)
            );
        }
    }

    componentDidUpdate(prevProps: WizardProps) {
        const props = this.props;
        const {store, fetchSuccess, fetchFailed} = props;

        if (isApiOutdated(prevProps.initApi, props.initApi, prevProps.data, props.data)) {
            store.fetchData(props.initApi, store.data, {
                successMessage: fetchSuccess,
                errorMessage: fetchFailed,
            });
        }
    }

    componentWillUnmount() {
        this.asyncCancel && this.asyncCancel();
    }

    gotoStep(index: number) {
        const steps = this.props.steps || [];
        index = Math.max(Math.min(steps.length, index), 1);

        this.setState({
            currentStep: index,
        });
    }

    formRef(ref: any) {
        if (ref) {
            while (ref && ref.getWrappedInstance) {
                ref = ref.getWrappedInstance();
            }
            this.form = ref;
        } else {
            this.form = undefined;
        }
    }

    submitToTarget(target: string, values: object) {
        throw new Error('Please implements this!');
    }

    reloadTarget(target: string, data: any) {
        throw new Error('Please implements this!');
    }

    domRef(ref: any) {
        this.dom = ref;
    }

    getPopOverContainer() {
        return this.dom;
    }

    handleAction(e: React.UIEvent<any> | void, action: Action, data: object, throwErrors?: boolean) {
        const {onAction, store} = this.props;

        if (action.actionType === 'next' || action.type === 'submit') {
            this.form.doAction(
                {
                    ...action,
                    actionType: 'submit',
                },
                data
            );
        } else if (action.actionType === 'prev') {
            this.gotoStep(this.state.currentStep - 1);
        } else if (action.type === 'reset') {
            this.form.reset();
        } else if (action.actionType === 'dialog') {
            store.openDialog(data);
        } else if (onAction) {
            onAction(e, action, data);
        }
    }

    handleChange(values: object) {
        const {store} = this.props;

        store.updateData(values);
    }

    // 接管里面 form 的提交，不能直接让 form 提交，因为 wizard 自己需要知道进度。
    handleSubmit(values: object, action: Action) {
        const {store, steps, api, asyncApi, finishedField, target, redirect, reload, env, onFinished} = this.props;

        const step = steps[this.state.currentStep - 1];
        store.updateData(values);

        if (this.state.currentStep < steps.length) {
            let finnalAsyncApi = action.asyncApi || asyncApi;

            finnalAsyncApi &&
                store.updateData({
                    [finishedField || 'finished']: false,
                });

            if (step.api || action.api) {
                store
                    .saveRemote(action.api || step.api, store.data, {
                        onSuccess: () => {
                            if (!finnalAsyncApi || store.data[finishedField || 'finished']) {
                                return;
                            }

                            return until(
                                () => store.checkRemote(finnalAsyncApi as Api, store.data),
                                (ret: any) => ret && ret[finishedField || 'finished'],
                                cancel => (this.asyncCancel = cancel)
                            );
                        },
                    })
                    .then(() => this.gotoStep(this.state.currentStep + 1))
                    .catch(e => {
                        // do nothing
                    });
            } else {
                this.gotoStep(this.state.currentStep + 1);
            }
        } else {
            // 最后一步
            if (target) {
                this.submitToTarget(target, store.data);
            } else if (action.api || step.api || api) {
                let finnalAsyncApi = action.asyncApi || step.asyncApi || asyncApi;

                finnalAsyncApi &&
                    store.updateData({
                        [finishedField || 'finished']: false,
                    });

                const formStore = this.form ? (this.form.props.store as IFormStore) : store;
                store.markSaving(true);

                formStore
                    .saveRemote(action.api || step.api || api, store.data, {
                        onSuccess: () => {
                            if (!finnalAsyncApi || store.data[finishedField || 'finished']) {
                                return;
                            }

                            return until(
                                () => store.checkRemote(finnalAsyncApi as Api, store.data),
                                (ret: any) => ret && ret[finishedField || 'finished'],
                                cancel => (this.asyncCancel = cancel)
                            );
                        },
                    })
                    .then(value => {
                        store.updateData({
                            ...store.data,
                            ...value
                        });
                        store.markSaving(false);
                        if (onFinished && onFinished(value, action) === false) {
                            // 如果是 false 后面的操作就不执行
                            return value;
                        }

                        if (redirect) {
                            env.updateLocation(filter(redirect, store.data));
                        } else if (reload) {
                            this.reloadTarget(reload, store.data);
                        }

                        return value;
                    })
                    .catch(e => {
                        store.markSaving(false);
                        console.error(e);
                    });
            }
        }

        return false;
    }

    handleDialogConfirm(values: object[], action: Action, ctx: any, targets: Array<any>) {
        const {store} = this.props;

        if (action.mergeData && values.length === 1 && values[0] && targets[0].props.type === 'form') {
            store.updateData(values[0]);
        }

        store.closeDialog();
    }

    handleDialogClose() {
        const {store} = this.props;
        store.closeDialog();
    }

    renderSteps() {
        const {steps, store, mode, classPrefix: ns} = this.props;
        const currentStep = this.state.currentStep;

        return (
            <div className={`${ns}Wizard-steps clearfix ${ns}Wizard--${mode}`} id="form-wizard">
                {Array.isArray(steps) && steps.length ? (
                    <ul>
                        {steps.map((step, key) => {
                            const canJump = isJumpable(step, key, currentStep, store.data);

                            return (
                                <li
                                    key={key}
                                    className={cx({
                                        'is-complete': canJump,
                                        'is-active': currentStep === key + 1,
                                    })}
                                    onClick={() => (canJump ? this.gotoStep(key + 1) : null)}
                                >
                                    <span
                                        className={cx('Badge', {
                                            // 'Badge--success': canJump && currentStep != key + 1,
                                            'Badge--info':
                                                currentStep === key + 1 || (canJump && currentStep != key + 1),
                                        })}
                                    >
                                        {key + 1}
                                    </span>
                                    {step.title || step.label || `第 ${key + 1} 步`}
                                </li>
                            );
                        })}
                    </ul>
                ) : null}
            </div>
        );
    }

    renderActions() {
        const {
            steps,
            store,
            readOnly,
            disabled,
            actionClassName,
            actionPrevLabel,
            actionNextLabel,
            actionNextSaveLabel,
            actionFinishLabel,
            render,
            classPrefix: ns,
            classnames: cx,
        } = this.props;

        if (!Array.isArray(steps)) {
            return null;
        }

        const currentStepIndex = this.state.currentStep;
        const nextStep = steps[currentStepIndex];
        const prevStep = steps[currentStepIndex - 2];
        const waiting = store.loading;
        const step = steps[currentStepIndex - 1];

        if (!step) {
            return null;
        }

        const prevCanJump = prevStep ? isJumpable(prevStep, currentStepIndex - 2, currentStepIndex, store.data) : false;

        if (step.actions && Array.isArray(step.actions)) {
            return step.actions.length ? (
                <div className={cx('Panel-footer')}>
                    {step.actions.map((action: Action, index: number) =>
                        render(`action/${index}`, action, {
                            key: index,
                            onAction: this.handleAction,
                            disabled:
                                action.disabled ||
                                waiting ||
                                disabled ||
                                (action.actionType === 'prev' && !prevCanJump) ||
                                (action.actionType === 'next' && readOnly && (!!step.api || !nextStep)),
                        })
                    )}
                </div>
            ) : null;
        }

        return (
            <div className={cx('Panel-footer')}>
                {render(
                    `prev-btn`,
                    {
                        type: 'button',
                        label: actionPrevLabel,
                        actionType: 'prev',
                        className: actionClassName,
                    },
                    {
                        disabled: waiting || !prevCanJump || disabled,
                        onAction: this.handleAction,
                    }
                )}

                {render(
                    `next-btn`,
                    {
                        type: 'button',
                        label: !nextStep ? actionFinishLabel : !step.api ? actionNextLabel : actionNextSaveLabel,
                        actionType: 'next',
                        primary: !nextStep || !!step.api,
                        className: actionClassName,
                    },
                    {
                        disabled: waiting || disabled || (readOnly && (!!step.api || !nextStep)),
                        onAction: this.handleAction,
                    }
                )}
            </div>
        );
    }

    render() {
        const {className, steps, render, store, mode, classPrefix: ns} = this.props;

        const currentStep = this.state.currentStep;
        const step = Array.isArray(steps) ? steps[currentStep - 1] : null;

        return (
            <div ref={this.domRef} className={cx(`${ns}Panel ${ns}Panel--default ${ns}Wizard`, className)}>
                {this.renderSteps()}
                <div className={`${ns}Wizard-stepContent clearfix`}>
                    {step ? (
                        render(
                            'body',
                            {
                                ...step,
                                type: 'form',
                                wrapWithPanel: false,

                                // 接口相关需要外部来接管
                                api: null,
                            },
                            {
                                key: this.state.currentStep,
                                ref: this.formRef,
                                onSubmit: this.handleSubmit,
                                onAction: this.handleAction,
                                disabled: store.loading,
                                popOverContainer: this.getPopOverContainer,
                                onChange: this.handleChange,
                            }
                        )
                    ) : currentStep === -1 ? (
                        '初始中。。'
                    ) : (
                        <p className="text-danger">配置错误</p>
                    )}
                </div>

                {render(
                    'dialog',
                    {
                        ...((store.action as Action) && ((store.action as Action).dialog as object)),
                        type: 'dialog',
                    },
                    {
                        key: 'dialog',
                        data: store.dialogData,
                        onConfirm: this.handleDialogConfirm,
                        onClose: this.handleDialogClose,
                        show: store.dialogOpen,
                    }
                )}
                {this.renderActions()}

                {store.loading
                    ? render('spinner', {
                          type: 'spinner',
                          overlay: true,
                          size: 'lg',
                      })
                    : null}
            </div>
        );
    }
}

function isJumpable(step: any, index: number, currentStep: number, data: any) {
    let canJump = false;

    if (step && step.hasOwnProperty('jumpable')) {
        canJump = step.jumpable;
    } else if (step && step.jumpableOn) {
        canJump = evalExpression(
            step.jumpableOn,
            createObject(data, {
                currentStep,
            })
        );
    } else {
        canJump = index + 1 < currentStep;
    }

    return canJump;
}

@Renderer({
    test: /(^|\/)wizard$/,
    storeType: ServiceStore.name,
    name: 'wizard',
    isolateScope: true,
})
export class WizardRenderer extends Wizard {
    static contextType = ScopedContext;

    componentWillMount() {
        const scoped = this.context as IScopedContext;
        scoped.registerComponent(this);
    }

    componentWillUnmount() {
        const scoped = this.context as IScopedContext;
        scoped.unRegisterComponent(this);
    }

    doAction(action: Action, data: object, throwErrors: boolean = false) {
        return this.handleAction(undefined, action, data, throwErrors);
    }

    submitToTarget(target: string, values: object) {
        const scoped = this.context as IScopedContext;
        scoped.send(target, values);
    }

    reloadTarget(target: string, data: any) {
        const scoped = this.context as IScopedContext;
        scoped.reload(target, data);
    }

    handleDialogConfirm(values: object[], action: Action, ctx: any, targets: Array<any>) {
        super.handleDialogConfirm(values, action, ctx, targets);

        const store = this.props.store;
        const scoped = this.context as IScopedContext;
        if (action.reload) {
            scoped.reload(action.reload, store.data);
        } else if (store.action && store.action.reload) {
            scoped.reload(store.action.reload, store.data);
        }
    }
}
