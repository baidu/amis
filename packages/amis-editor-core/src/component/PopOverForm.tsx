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
  PopOver
} from 'amis';
import {observer} from 'mobx-react';
import {diff} from '../util';
import {createObject} from 'amis-core';

export interface PopOverFormProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

@observer
export class PopOverForm extends React.Component<PopOverFormProps> {
  overlay = React.createRef<any>();
  buildSchema() {
    const {store} = this.props;
    const popOverFormContext = store.popOverForm!;

    return {
      type: 'form',
      wrapWithPanel: false,
      mode: 'normal',
      wrapperComponent: 'div',
      body: popOverFormContext.body,
      submitOnChange: true,
      autoFocus: true,
      onFinished: (newValue: any) => {
        popOverFormContext.callback?.(
          newValue,
          diff(popOverFormContext.value, newValue)
        );

        setTimeout(() => this.overlay.current?.updatePosition(), 200);
      }
    };
  }

  render() {
    const {store, theme, manager} = this.props;
    const popOverFormContext = store.popOverForm;

    return (
      <Overlay
        target={popOverFormContext?.target}
        placement={
          'left-bottom-left-top left-top-left-bottom right-bottom-right-top right-top-right-bottom center'
        }
        show={!!popOverFormContext}
        ref={this.overlay}
      >
        <PopOver
          overlay
          className="ae-Editor-popOverForm"
          onHide={store.closePopOverForm}
        >
          {popOverFormContext ? (
            render(
              this.buildSchema(),
              {
                data: createObject(store.ctx, popOverFormContext?.value)
              },
              {
                ...manager.env,
                session: 'popover-form',
                theme: theme
              }
            )
          ) : (
            <p>Loading...</p>
          )}
        </PopOver>
      </Overlay>
    );
  }
}
