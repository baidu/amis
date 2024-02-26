/**
 * @file PdfViewer.tsx PDF 预览
 *
 * @created: 2024/02/26
 */

import React from 'react';
import {themeable, ThemeProps, ClassNamesFn} from 'amis-core';

export interface PdfViewerProps extends ThemeProps {
  src?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = props => {
  const src = props.src;
  const {classnames: cx, className} = props;

  return (
    <div className={cx(className, 'PdfViewer')}>
      {src ? (
        <iframe src={src} className={cx('PdfViewer-frame')} allowFullScreen />
      ) : null}
    </div>
  );
};

export default themeable(PdfViewer);
