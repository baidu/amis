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
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
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
  classnames: cx,
  className,
  bodyClassName,
  footerClassName
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
        className={className}
      >
        {showTitle !== false && title ? (
          <Modal.Header onClose={onCancel} className={headerClassName}>
            {title}
          </Modal.Header>
        ) : null}
        <Modal.Body className={bodyClassName}>
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef
              })
            : children}
        </Modal.Body>
        {showFooter ?? true ? (
          <Modal.Footer className={footerClassName}>
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
        className={className}
      >
        {showTitle !== false && title ? (
          <div className={cx('Drawer-header', headerClassName)}>
            <div className={cx('Drawer-title')}>{title}</div>
          </div>
        ) : null}
        <div className={cx('Drawer-body', bodyClassName)}>
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef
              })
            : children}
        </div>
        {showFooter ?? true ? (
          <div className={cx('Drawer-footer', footerClassName)}>
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
