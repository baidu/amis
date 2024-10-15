import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {
  render,
  Modal,
  getTheme,
  Icon,
  Spinner,
  Button,
  Overlay,
  PopOver,
  Drawer
} from 'amis';
import {observer} from 'mobx-react';
import {diff} from '../util';
import {autobind, createObject} from 'amis-core';

export interface ModalFormProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

@observer
export class ModalForm extends React.Component<ModalFormProps> {
  @autobind
  async handleConfirmClick() {
    const form = this.amisScope?.getComponents()[0];

    if (!form) {
      return;
    }
    const {store} = this.props;
    const modalFormContext = store.modalForm!;

    try {
      store.markModalFormBuzy(true);
      const newValue = await form.doAction(
        {
          type: 'submit'
        },
        form.props.data,
        true
      );

      modalFormContext.callback?.(
        newValue,
        diff(modalFormContext.value, newValue)
      );
      store.closeModalForm();
    } catch (e) {
      console.error(e.stack);
    }

    store.markModalFormBuzy(false);
  }

  amisScope: any;
  @autobind
  scopeRef(scoped: any) {
    this.amisScope = scoped;
  }

  buildSchema() {
    const {store} = this.props;
    const modalFormContext = store.modalForm!;

    return {
      type: 'form',
      wrapWithPanel: false,
      mode: 'normal',
      wrapperComponent: 'div',
      initApi: modalFormContext.initApi,
      api: modalFormContext.api,
      body: modalFormContext.body,
      submitOnChange: false,
      autoFocus: true
    };
  }

  render() {
    const {store, theme, manager} = this.props;
    const modalFormContext = store.modalForm;
    if (!modalFormContext) {
      return null;
    }

    const contents = render(
      this.buildSchema(),
      {
        data: createObject(store.ctx, modalFormContext?.value),
        manager,
        scopeRef: this.scopeRef
      },
      {
        ...manager.env,
        session: 'modal-form',
        theme: theme
      }
    );

    return modalFormContext.mode === 'drawer' ? (
      <Drawer
        position={(modalFormContext.postion as any) || 'left'}
        size={modalFormContext.size || 'md'}
        theme={theme}
        show
        onHide={store.closeModalForm}
      >
        <div className="cxd-Drawer-header">{modalFormContext.title}</div>
        <div className="cxd-Drawer-body">{contents}</div>
        <div className="cxd-Drawer-footer">
          <Button
            disabled={store.modalFormBuzy}
            level="primary"
            onClick={this.handleConfirmClick}
          >
            确认
          </Button>
          <Button onClick={store.closeModalForm}>取消</Button>
        </div>
      </Drawer>
    ) : (
      <Modal
        theme={theme}
        size={modalFormContext?.size || 'md'}
        show
        onHide={store.closeModalForm}
        closeOnEsc={false}
      >
        {modalFormContext.title ? (
          <Modal.Header onClose={store.closeModalForm}>
            {modalFormContext.title}
          </Modal.Header>
        ) : null}
        <Modal.Body>{contents}</Modal.Body>
        <Modal.Footer>
          <Button
            disabled={store.modalFormBuzy}
            level="primary"
            onClick={this.handleConfirmClick}
          >
            确认
          </Button>
          <Button onClick={store.closeModalForm}>取消</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
