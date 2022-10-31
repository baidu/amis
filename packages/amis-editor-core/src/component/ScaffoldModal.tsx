import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render, Modal, getTheme, Icon, Spinner, Button} from 'amis';
import {observer} from 'mobx-react';
import {autobind, isObject} from '../util';
import {createObject} from 'amis-core';

export interface SubEditorProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

interface ScaffoldState {
  step: number
}

@observer
export class ScaffoldModal extends React.Component<SubEditorProps, ScaffoldState> {
  constructor(props: SubEditorProps) {
    super(props);

    this.state = {
      step: 0
    };
  }

  @autobind
  handleConfirm([values]: any) {
    const store = this.props.store;

    values = {
      ...store.scaffoldForm?.value,
      ...values
    };

    if (store.scaffoldForm?.pipeOut) {
      const mapped = store.scaffoldForm.pipeOut(values);
      values = {
        ...mapped
      };
    }

    store.scaffoldForm?.callback(values);
    store.closeScaffoldForm();
    this.setState({step: 0});
  }

  buildSchema() {
    const {store} = this.props;
    const scaffoldFormContext = store.scaffoldForm!;

    let body = scaffoldFormContext.controls ?? scaffoldFormContext.body;
    if (scaffoldFormContext.stepsBody) {
      body = [
        {
          type: 'steps',
          name: '__steps',
          className: 'ae-Steps',
          steps: body.map((step, index) => ({
            title: step.title,
            value: index,
            iconClassName: 'ae-Steps-Icon'
          }))
        },
        ...body.map((step, index) => ({
          type: 'container',
          visibleOn: `__step === ${index}`,
          body: step.body
        }))
      ]
    }

    let layout: object;
    if (isObject(scaffoldFormContext.mode)) {
      layout = scaffoldFormContext.mode as object;
    } else {
      layout = {
        mode: scaffoldFormContext.mode || 'normal'
      }
    }

    return {
      type: 'form',
      wrapWithPanel: false,
      initApi: scaffoldFormContext.initApi,
      api: scaffoldFormContext.api,
      ...layout,
      wrapperComponent: 'div',
      data: {
        __step: 0
      },
      [scaffoldFormContext.controls ? 'controls' : 'body']: body,
    };
    // const {store} = this.props;
    // const scaffoldFormContext = store.scaffoldForm;

    // return {
    //   show: !!scaffoldFormContext,
    //   size: scaffoldFormContext?.size || 'md',
    //   title: scaffoldFormContext?.title,
    //   onClose: store.closeScaffoldForm,
    //   onConfirm: this.handleConfirm,
    //   data: createObject(store.ctx, scaffoldFormContext?.value),
    //   body: scaffoldFormContext
    //     ? {
    //         type: 'form',
    //         initApi: scaffoldFormContext.initApi,
    //         api: scaffoldFormContext.api,
    //         mode: scaffoldFormContext.mode || 'normal',
    //         wrapperComponent: 'div',
    //         onValidate: scaffoldFormContext.validate,
    //         [scaffoldFormContext.controls ? 'controls' : 'body']:
    //           scaffoldFormContext.controls ?? scaffoldFormContext.body
    //       }
    //     : {
    //         type: 'tpl',
    //         tpl: 'Loading...'
    //       },
    //   actions: [
    //     [
    //       {
    //         type: 'submit',
    //         label: '确认',
    //         level: 'primary'
    //       },
    //       {
    //         type: 'button',
    //         label: '取消',
    //         actionType: 'close'
    //       }
    //     ]
    //   ],
    //   closeOnEsc: false,
    //   bodyClassName: 'ae-Dialog'
    //   // lazyRender: true
    // };
  }

  amisScope: any;

  @autobind
  scopeRef(scoped: any) {
    this.amisScope = scoped;
  }

  @autobind
  goToNextStep() {
    // 不能更新props的data，控制amis不重新渲染，否则数据会重新初始化
    const form = this.amisScope?.getComponents()[0].props.store;
    const step = this.state.step + 1;
    form.setValueByName('__step', step);

    // 控制按钮
    this.setState({
     step
    });
  }

  @autobind
  goToPrevStep() {
    // 不能更新props的data，控制amis不重新渲染，否则数据会重新初始化
    const form = this.amisScope?.getComponents()[0].props.store;
    const step = this.state.step - 1;
    form.setValueByName('__step', step);

    // 控制按钮
    this.setState({
     step
    });
  }

  @autobind
  async handleConfirmClick() {
    const form = this.amisScope?.getComponents()[0];

    if (!form) {
      return;
    }
    const {store} = this.props;

    try {
      store.setScaffoldBuzy(true);

      const values = await form.doAction(
        {
          type: 'submit'
        },
        form.props.data,
        true
      );

      this.handleConfirm([values]);
    } catch (e) {
      console.log(e.stack);
      store.setScaffoldError(e.message);
    } finally {
      store.setScaffoldBuzy(false);
    }
  }

  @autobind
  handleCancelClick() {
    this.props.store.closeScaffoldForm();
    this.setState({step: 0});
  }

  render() {
    const {store, theme, manager} = this.props;
    const scaffoldFormContext = store.scaffoldForm;
    const cx = getTheme(theme || 'cxd').classnames;

    const isStepBody = !! scaffoldFormContext?.stepsBody;
    const isLastStep = isStepBody && this.state.step === scaffoldFormContext!.body.length - 1;
    const isFirstStep = isStepBody && this.state.step === 0;

    return (
      <Modal
        size={scaffoldFormContext?.size || 'md'}
        contentClassName={scaffoldFormContext?.className}
        show={!!scaffoldFormContext}
        onHide={store.closeScaffoldForm}
        closeOnEsc={!store.scaffoldFormBuzy}
      >
        <div className={cx('Modal-header')}>
          {!store.scaffoldFormBuzy ? (
            <a
              data-position="left"
              onClick={store.closeScaffoldForm}
              className={cx('Modal-close')}
            >
              <Icon icon="close" className="icon" />
            </a>
          ) : null}
          <div className={cx('Modal-title')}>{scaffoldFormContext?.title}</div>
        </div>
        <div className={cx('Modal-body')}>
          {scaffoldFormContext ? (
            render(
              this.buildSchema(),
              {
                data: createObject(store.ctx, {
                  ...(scaffoldFormContext?.value || {}),
                  __step: 0
                }),
                onValidate: scaffoldFormContext.validate,
                scopeRef: this.scopeRef
              },
              {
                ...manager.env,
                session: 'scaffold-dialog',
                theme: theme
              }
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className={cx('Modal-footer')}>
          {store.scaffoldFormBuzy || store.scaffoldError ? (
            <div className={cx('Dialog-info')} key="info">
              <Spinner size="sm" key="info" show={store.scaffoldFormBuzy} />
              {store.scaffoldError ? (
                <span className={cx('Dialog-error')}>
                  {store.scaffoldError}
                </span>
              ) : null}
            </div>
          ) : null}
          {
            isStepBody && !isFirstStep  && (
              <Button
                  level="primary"
                  onClick={this.goToPrevStep}
                >
                  上一步
                </Button>
            )
          }
          {
            isStepBody && !isLastStep && (
              <Button
                level="primary"
                onClick={this.goToNextStep}
              >
                下一步
              </Button>
            )
          }
          {
            (!isStepBody || isLastStep) && (
              <Button
                level="primary"
                onClick={this.handleConfirmClick}
                disabled={store.scaffoldFormBuzy}
              >
                确认
              </Button>
            )
          }
          <Button onClick={this.handleCancelClick}>取消</Button>
        </div>
      </Modal>
    );
  }

  // _render() {
  //   const {store, theme, manager} = this.props;

  //   return render(
  //     {
  //       type: 'dialog'
  //     },
  //     this.buildSchema(),
  //     {
  //       ...manager.env,
  //       seesion: 'scaffold-dialog',
  //       theme: theme
  //     }
  //   );
  // }
}
