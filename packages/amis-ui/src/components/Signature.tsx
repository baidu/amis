/**
 * @file Signature.tsx 签名组件
 *
 * @created: 2024/03/04
 */

import React from 'react';
import {
  themeable,
  ThemeProps,
  isMobileDevice,
  LocaleProps,
  localeable,
  resizeSensor
} from 'amis-core';
import SmoothSignature from 'smooth-signature';
import Button from './Button';
import {Icon} from '../index';
import Modal from './Modal';
import Spinner from './Spinner';

export interface ISignatureProps extends LocaleProps, ThemeProps {
  value?: string;
  width?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  clearBtnLabel?: string;
  clearBtnIcon?: string;
  undoBtnLabel?: string;
  undoBtnIcon?: string;
  confirmBtnLabel?: string;
  confirmBtnIcon?: string;
  embed?: boolean;
  embedConfirmLabel?: string;
  embedConfirmIcon?: string;
  ebmedCancelLabel?: string;
  ebmedCancelIcon?: string;
  embedBtnIcon?: string;
  embedBtnLabel?: string;
  onChange?: (value?: string) => Promise<void>;
}

const Signature: React.FC<ISignatureProps> = props => {
  const {translate: __, classnames: cx, className, width, height} = props;
  const embedMobile =
    props.embed && isMobileDevice() && window.innerWidth < 768;

  const [sign, setSign] = React.useState<SmoothSignature | null>(null);
  const [open, setOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [fullScreen, setFullScreen] = React.useState(!!embedMobile);
  const [embed, setEmbed] = React.useState(props.embed || false);
  const [data, setData] = React.useState<string | undefined>(props.value);
  const wrapper = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!wrapper.current) {
      return;
    }

    const unSensor = resizeSensor(wrapper.current, resize);

    return () => {
      setSign(null);
      unSensor();
    };
  }, []);

  React.useEffect(() => setData(props.value), [props.value]);

  React.useEffect(() => setEmbed(props.embed || false), [props.embed]);

  const clear = React.useCallback(() => {
    if (sign) {
      sign.clear();
    }
    props.onChange?.(undefined);
  }, [sign]);
  const undo = React.useCallback(() => {
    if (sign) {
      sign.undo();
    }
  }, [sign]);

  const confirm = React.useCallback(() => {
    if (!sign) {
      return;
    }

    const base64 = fullScreen
      ? sign.getRotateCanvas(-90).toDataURL()
      : sign.toDataURL();

    setData(base64);
    setUploading(true);
    props.onChange?.(base64).then(() => {
      setUploading(false);
    });
  }, [sign]);
  const resize = React.useCallback(() => {
    setSign(null);
  }, []);
  const handleFullScreen = React.useCallback(() => {
    setFullScreen(true);
    setSign(null);
  }, []);
  const handleUnFullScreen = React.useCallback(() => {
    setFullScreen(false);
    setSign(null);
  }, []);
  const handleCloseModal = React.useCallback(() => {
    setOpen(false);
    setFullScreen(!!embedMobile);
    setSign(null);
  }, []);
  const handleConfirmModal = React.useCallback(() => {
    confirm();
    handleCloseModal();
  }, [sign]);
  const initCanvas = React.useCallback(
    (element: HTMLCanvasElement) => {
      const {width, height} = props;
      const clientWidth = element.parentElement!.clientWidth;
      const clientHeight = element.parentElement!.clientHeight;
      const defaultWidth = width || clientWidth - (fullScreen ? 40 : 0);
      const defaultHeight = fullScreen
        ? clientHeight
        : Math.min(height || clientWidth / 2 - 40, clientHeight - 40);
      const signature = new SmoothSignature(element, {
        width: Math.max(defaultWidth, 200),
        height: Math.max(defaultHeight, 160),
        color: props.color || '#000',
        bgColor: props.bgColor || '#efefef'
      });
      setSign(signature);
    },
    [width, height, fullScreen]
  );

  function embedCanvasRef(ref: HTMLCanvasElement) {
    if (open && ref && !sign) {
      initCanvas(ref);
    }
  }

  function canvasRef(ref: HTMLCanvasElement) {
    if (ref && !sign) {
      initCanvas(ref);
    }
  }

  function renderTool(right: boolean = true) {
    const {
      clearBtnLabel,
      clearBtnIcon,
      undoBtnLabel,
      undoBtnIcon,
      confirmBtnLabel,
      confirmBtnIcon,
      embedConfirmLabel,
      embedConfirmIcon,
      ebmedCancelLabel,
      ebmedCancelIcon
    } = props;

    return (
      <div className={cx('Signature-Tool')}>
        <div className="actions">
          <div className="left-actions">
            <Button
              onClick={clear}
              tooltip={clearBtnLabel || __('Signature.clear')}
            >
              {clearBtnLabel}
              <Icon
                icon={clearBtnIcon || 'close'}
                className={cx('icon', {'ml-1': clearBtnLabel})}
              />
            </Button>
            <Button
              onClick={undo}
              tooltip={undoBtnLabel || __('Signature.undo')}
            >
              {undoBtnLabel}
              <Icon
                icon={undoBtnIcon || 'undo-normal'}
                className={cx('icon', {'ml-1': undoBtnLabel})}
              />
            </Button>
            {embedMobile ? null : fullScreen ? (
              <Button onClick={handleUnFullScreen}>
                <Icon icon="un-fullscreen" className="icon" />
              </Button>
            ) : (
              <Button onClick={handleFullScreen}>
                <Icon icon="full-screen" className="icon" />
              </Button>
            )}
          </div>
          {right ? (
            <div className="right-actions">
              {embed ? (
                <>
                  <Button onClick={handleCloseModal}>
                    {ebmedCancelLabel || __('Signature.cancel')}
                    <Icon icon={ebmedCancelIcon} className="icon ml-1" />
                  </Button>
                  <Button onClick={handleConfirmModal} level="primary">
                    {embedConfirmLabel || __('Signature.confirm')}
                    <Icon icon={embedConfirmIcon} className="icon ml-1" />
                  </Button>
                </>
              ) : (
                <Button onClick={confirm} level="primary">
                  {confirmBtnLabel || __('Signature.confirm')}
                  <Icon icon={confirmBtnIcon} className="icon ml-1" />
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderEmbedSignature() {
    const {
      embedConfirmLabel,
      ebmedCancelLabel,
      embedBtnIcon: icon,
      embedBtnLabel,
      embedConfirmIcon,
      ebmedCancelIcon
    } = props;
    return (
      <div className={cx('Signature-Embed')}>
        <Button onClick={() => setOpen(true)}>
          <Icon className="icon mr-1" icon={icon || 'fas fa-pen'}></Icon>
          {embedBtnLabel || data
            ? __('Signature.embedUpdateLabel')
            : __('Signature.embedLabel')}
        </Button>
        {data ? (
          <div className={cx('Signature-Embed-Preview')}>
            {uploading ? (
              <Spinner show={uploading} />
            ) : (
              <>
                <img src={data} />
                <Icon
                  className="preview-close icon"
                  icon="close"
                  onClick={clear}
                />
              </>
            )}
          </div>
        ) : uploading ? (
          <div className={cx('Signature-Embed-Preview')}>
            <Spinner show={uploading} />
          </div>
        ) : null}

        <Modal show={open} onHide={handleCloseModal} size="full">
          <Modal.Body>
            <div
              className={cx('Signature-Embed-Body', {
                'is-fullScreen': fullScreen
              })}
            >
              <canvas className={cx('Signature-canvas')} ref={embedCanvasRef} />
              {renderTool(fullScreen)}
            </div>
          </Modal.Body>
          {fullScreen ? null : (
            <Modal.Footer>
              <Button onClick={handleCloseModal}>
                {ebmedCancelLabel || __('Signature.cancel')}
                <Icon icon={ebmedCancelIcon} className="icon ml-1" />
              </Button>
              <Button onClick={handleConfirmModal} level="primary">
                {embedConfirmLabel || __('Signature.confirm')}
                <Icon icon={embedConfirmIcon} className="icon ml-1" />
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </div>
    );
  }

  return (
    <div className={cx(className)}>
      <div
        className={cx('Signature', {
          'is-fullScreen': fullScreen
        })}
        ref={wrapper}
      >
        {embed ? (
          renderEmbedSignature()
        ) : (
          <>
            <canvas className={cx('Signature-canvas')} ref={canvasRef} />
            {renderTool()}
          </>
        )}
      </div>
    </div>
  );
};

export default themeable(localeable(Signature));
