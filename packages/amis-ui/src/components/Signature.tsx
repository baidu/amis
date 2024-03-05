/**
 * @file Signature.tsx 签名组件
 *
 * @created: 2024/03/04
 */

import React from 'react';
import {themeable, ThemeProps} from 'amis-core';
import {LocaleProps, localeable} from 'amis-core';
import {resizeSensor} from 'amis-core';
import SmoothSignature from 'smooth-signature';
import Button from './Button';

export interface ISignatureProps extends LocaleProps, ThemeProps {
  width?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  clearText?: string;
  undoText?: string;
  confirmText?: string;
  horizontal?: boolean;
  onChange?: (value?: string) => void;
}

const Signature: React.FC<ISignatureProps> = props => {
  const {classnames: cx, horizontal, width, height} = props;
  const [sign, setSign] = React.useState<SmoothSignature | null>(null);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const canvas = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!wrapper.current || !canvas.current) {
      return;
    }

    initCanvas(canvas.current);
    const unSensor = resizeSensor(wrapper.current, resize);

    return () => {
      setSign(null);
      unSensor();
    };
  }, []);

  const clear = React.useCallback(() => {
    if (sign) {
      sign.clear();
      props.onChange?.(undefined);
    }
  }, [sign]);
  const undo = React.useCallback(() => {
    if (sign) {
      sign.undo();
    }
  }, [sign]);
  const confirm = React.useCallback(() => {
    if (sign) {
      const base64 = sign.toDataURL();
      props.onChange?.(base64);
    }
  }, [sign]);
  const resize = React.useCallback(() => {
    setSign(null);
    initCanvas(canvas.current!);
  }, []);
  const initCanvas = React.useCallback(
    (element: HTMLCanvasElement) => {
      const {width, height} = props;
      const rect = element.parentElement!.getBoundingClientRect();
      const clientWidth = Math.floor(rect.width);
      const defaultWidth = width || clientWidth - (horizontal ? 40 : 0);
      const defaultHeight = height || clientWidth / 2 - (horizontal ? 0 : 40);
      const signature = new SmoothSignature(element, {
        width: Math.max(defaultWidth, 300),
        height: Math.max(defaultHeight, 160),
        color: props.color || '#000',
        bgColor: props.bgColor || '#efefef'
      });
      setSign(signature);
    },
    [width, height, horizontal]
  );

  function renderTool() {
    const {translate: __, clearText, undoText, confirmText} = props;
    return (
      <div className={cx('Signature-Tool')}>
        <div className="actions">
          <Button onClick={clear}>{clearText || __('Signature.clear')}</Button>
          <Button onClick={undo}>{undoText || __('Signature.undo')}</Button>
          <Button onClick={confirm}>
            {confirmText || __('Signature.confirm')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cx('Signature', {
        'is-horizontal': horizontal
      })}
      ref={wrapper}
    >
      <canvas className={cx('Signature-canvas')} ref={canvas} />
      {renderTool()}
    </div>
  );
};

export default themeable(localeable(Signature));
