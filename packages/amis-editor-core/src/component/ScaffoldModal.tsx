import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render, Modal, getTheme, Icon, Spinner, Button} from 'amis';
import {observer} from 'mobx-react';
import {autobind} from '../util';
import {createObject} from 'amis-core';

export interface SubEditorProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

@observer
export class ScaffoldModal extends React.Component<SubEditorProps> {
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
  }

  buildSchema() {
    const {store} = this.props;
    const scaffoldFormContext = store.scaffoldForm!;

    return {
      type: 'form',
      wrapWithPanel: false,
      initApi: scaffoldFormContext.initApi,
      api: scaffoldFormContext.api,
      mode: scaffoldFormContext.mode || 'normal',
      wrapperComponent: 'div',
      [scaffoldFormContext.controls ? 'controls' : 'body']:
        scaffoldFormContext.controls ?? scaffoldFormContext.body
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

  render() {
    const {store, theme, manager} = this.props;
    const scaffoldFormContext = store.scaffoldForm;
    const cx = getTheme(theme || 'cxd').classnames;

    return (
      <Modal
        size={scaffoldFormContext?.size || 'md'}
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
                data: createObject(store.ctx, scaffoldFormContext?.value),
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
          <Button
            level="primary"
            onClick={this.handleConfirmClick}
            disabled={store.scaffoldFormBuzy}
          >
            确认
          </Button>
          <Button onClick={store.closeScaffoldForm}>取消</Button>
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
