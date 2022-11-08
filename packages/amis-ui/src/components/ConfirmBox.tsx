import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Drawer from './Drawer';
import {localeable, LocaleProps, themeable, ThemeProps} from 'amis-core';

export interface ConfirmBoxProps extends LocaleProps, ThemeProps {
  show?: boolean;
  closeOnEsc?: boolean;
  beforeConfirm?: (bodyRef?: any) => any;
  onConfirm?: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  showTitle?: boolean;
  showFooter?: boolean;
  headerClassName?: string;
  children?:
    | JSX.Element
    | ((methods: {
        bodyRef: React.MutableRefObject<
          | {
              submit: () => Promise<Record<string, any>>;
            }
          | undefined
        >;
      }) => JSX.Element);
  popOverContainer?: any;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'top' | 'right' | 'bottom' | 'left';
  resizable?: boolean;
  type: 'dialog' | 'drawer';
}

export function ConfirmBox({
  type,
  size,
  closeOnEsc,
  show,
  onCancel,
  title,
  showTitle,
  headerClassName,
  translate: __,
  children,
  showFooter,
  onConfirm,
  beforeConfirm,
  popOverContainer,
  position,
  resizable,
  classnames: cx
}: ConfirmBoxProps) {
  const bodyRef = React.useRef<
    {submit: () => Promise<Record<string, any>>} | undefined
  >();
  const handleConfirm = React.useCallback(async () => {
    const ret = beforeConfirm
      ? await beforeConfirm?.(bodyRef.current)
      : await bodyRef.current?.submit?.();

    if (ret === false) {
      return;
    }

    onConfirm?.(ret);
  }, [onConfirm, beforeConfirm]);

  function renderDialog() {
    return (
      <Modal
        size={size}
        closeOnEsc={closeOnEsc}
        show={show}
        onHide={onCancel!}
        container={popOverContainer}
      >
        {showTitle !== false && title ? (
          <Modal.Header onClose={onCancel} className={headerClassName}>
            {title}
          </Modal.Header>
        ) : null}
        <Modal.Body>
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef
              })
            : children}
        </Modal.Body>
        {showFooter ?? true ? (
          <Modal.Footer>
            <Button onClick={onCancel}>{__('cancel')}</Button>
            <Button onClick={handleConfirm} level="primary">
              {__('confirm')}
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>
    );
  }

  function renderDrawer() {
    return (
      <Drawer
        size={size}
        closeOnEsc={closeOnEsc}
        show={show}
        onHide={onCancel!}
        container={popOverContainer}
        position={position}
        resizable={resizable}
        showCloseButton={false}
      >
        {showTitle !== false && title ? (
          <div className={cx('Drawer-header', headerClassName)}>
            <div className={cx('Drawer-title')}>{title}</div>
          </div>
        ) : null}
        <div className={cx('Drawer-body')}>
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef
              })
            : children}
        </div>
        {showFooter ?? true ? (
          <div className={cx('Drawer-footer')}>
            <Button onClick={handleConfirm} level="primary">
              {__('confirm')}
            </Button>
            <Button onClick={onCancel}>{__('cancel')}</Button>
          </div>
        ) : null}
      </Drawer>
    );
  }

  return type === 'drawer' ? renderDrawer() : renderDialog();
}

ConfirmBox.defaultProps = {
  type: 'dialog' as 'dialog',
  position: 'right' as 'right'
};

export default localeable(themeable(ConfirmBox));
