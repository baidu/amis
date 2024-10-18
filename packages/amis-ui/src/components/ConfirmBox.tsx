import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Drawer from './Drawer';
import {localeable, LocaleProps, themeable, ThemeProps} from 'amis-core';
import Spinner from './Spinner';
import PopUp from './PopUp';
import {findDOMNode} from 'react-dom';
import type {TestIdBuilder} from 'amis-core';

export interface ConfirmBoxProps extends LocaleProps, ThemeProps {
  show?: boolean;
  disabled?: boolean;
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
        loading?: boolean;
        bodyRef: React.MutableRefObject<
          | {
              submit: () => Promise<Record<string, any>>;
            }
          | undefined
        >;
        popOverContainer: () => HTMLElement | null | undefined;
        onConfirm: () => void;
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
  testIdBuilder?: TestIdBuilder;
  onExited?: () => void;
  onEntered?: () => void;
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
  footerClassName,
  mobileUI,
  disabled,
  testIdBuilder,
  onEntered,
  onExited
}: ConfirmBoxProps) {
  const [loading, setLoading] = React.useState<boolean>();
  const [error, setError] = React.useState<string>();
  const bodyRef = React.useRef<
    {submit: () => Promise<Record<string, any>>} | undefined
  >();
  const bodyDomRef = React.useRef<HTMLElement | null>();
  const getPopOverContainer = React.useCallback(() => {
    const dom =
      bodyDomRef.current && !(bodyDomRef.current as HTMLElement).nodeType
        ? findDOMNode(bodyDomRef.current)
        : null;
    return dom?.parentElement;
  }, []);
  const handleConfirm = React.useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const ret = beforeConfirm
        ? await beforeConfirm?.(bodyRef.current)
        : await bodyRef.current?.submit?.();

      if (ret === false) {
        return;
      } else if (typeof ret === 'string') {
        setError(ret);
        return;
      }

      await onConfirm?.(ret);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setTimeout(() => setError(''), 5000);
    }
  }, [onConfirm, beforeConfirm]);
  React.useEffect(() => {
    show && setError('');
  }, [show]);

  function renderDialog() {
    return mobileUI ? (
      <PopUp
        isShow={show}
        showConfirm
        onConfirm={handleConfirm}
        onHide={onCancel}
        container={popOverContainer}
        onEntered={onEntered}
        onExited={onExited}
      >
        {typeof children === 'function'
          ? children({
              bodyRef: bodyRef,
              loading,
              popOverContainer: getPopOverContainer,
              onConfirm: handleConfirm
            })
          : children}
      </PopUp>
    ) : (
      <Modal
        size={size}
        closeOnEsc={closeOnEsc}
        show={show}
        onHide={onCancel!}
        container={popOverContainer}
        className={className}
        onEntered={onEntered}
        onExited={onExited}
      >
        {showTitle !== false && title ? (
          <Modal.Header onClose={onCancel} className={headerClassName}>
            {title}
          </Modal.Header>
        ) : null}
        <Modal.Body ref={bodyDomRef as any} className={bodyClassName}>
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef,
                loading,
                onConfirm: handleConfirm,
                popOverContainer: getPopOverContainer
              })
            : children}
        </Modal.Body>
        {showFooter ?? true ? (
          <Modal.Footer className={footerClassName}>
            {loading || error ? (
              <div className={cx('Dialog-info')}>
                <Spinner size="sm" key="info" show={loading} />
                {error ? (
                  <span className={cx('Dialog-error')}>{error}</span>
                ) : null}
              </div>
            ) : null}
            <Button
              disabled={loading}
              onClick={onCancel}
              testIdBuilder={testIdBuilder?.getChild('cancel')}
            >
              {__('cancel')}
            </Button>
            <Button
              disabled={loading || disabled}
              onClick={handleConfirm}
              level="primary"
              testIdBuilder={testIdBuilder?.getChild('confirm')}
            >
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
        <div
          ref={bodyDomRef as any}
          className={cx('Drawer-body', bodyClassName)}
        >
          {typeof children === 'function'
            ? children({
                bodyRef: bodyRef,
                loading,
                popOverContainer: getPopOverContainer,
                onConfirm: handleConfirm
              })
            : children}
        </div>
        {showFooter ?? true ? (
          <div className={cx('Drawer-footer', footerClassName)}>
            {loading || error ? (
              <div className={cx('Drawer-info')}>
                <Spinner size="sm" key="info" show={loading} />
                {error ? (
                  <span className={cx('Drawer-error')}>{error}</span>
                ) : null}
              </div>
            ) : null}
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
