/**
 * @file PdfViewer.tsx PDF 预览
 *
 * @created: 2024/02/26
 */

import React from 'react';
import {themeable, ThemeProps, getGlobalOptions} from 'amis-core';
import {Document, Page, pdfjs} from 'react-pdf';
import {Icon} from './icons';
import Input from './Input';
import Spinner from './Spinner';

pdfjs.GlobalWorkerOptions.workerSrc = getGlobalOptions().pdfjsWorkerSrc;
export interface PdfViewerProps extends ThemeProps {
  file?: ArrayBuffer;
  width?: number;
  height?: number;
  background?: string;
  loading: boolean;
}

const PdfViewer: React.FC<PdfViewerProps> = props => {
  const {classnames: cx, className, loading, width = 300} = props;
  const [file, setFile] = React.useState(props.file);
  const [loaded, setLoaded] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [scale, setScale] = React.useState(1);
  const [total, setTotal] = React.useState(1);
  const inputRef = React.useRef<HTMLInputElement>();

  React.useEffect(() => {
    if (props.file instanceof ArrayBuffer && props.file.byteLength > 0) {
      setFile(props.file);
    } else {
      setFile(undefined);
    }
  }, [props.file]);

  function handleLoadSuccess({numPages}: {numPages: number}) {
    setLoaded(true);
    setTotal(numPages);
  }

  function handleChangePage(idx: number) {
    const newPage = page + idx;
    if (newPage <= 0 || newPage > total) {
      return;
    }
    setPage(newPage);
  }

  function handlePageBlur(event: React.ChangeEvent<HTMLInputElement>) {
    const newPage = +event.target.value;
    if (isNaN(newPage) || newPage <= 0 || newPage > total) {
      if (inputRef.current) {
        inputRef.current.value = page + '';
      }
      return;
    }
    setPage(newPage);
  }

  function handleChangeScale(t: number) {
    setScale(scale * t);
  }

  function renderLoading() {
    return (
      <div className={cx('PdfViewer-Loading')}>
        <Spinner />
      </div>
    );
  }

  function renderTool() {
    return (
      <div className={cx('PdfViewer-Tool')}>
        <Icon
          className="icon"
          icon="prev"
          onClick={() => handleChangePage(-1)}
        />
        <Input
          className="page-input"
          value={page}
          onBlur={handlePageBlur}
          ref={inputRef}
        />
        <span className="gap">/</span>
        <span>{total}</span>
        <Icon
          className="icon"
          icon="next"
          onClick={() => handleChangePage(1)}
        />
        <Icon
          className="icon"
          icon="zoom-in"
          onClick={() => handleChangeScale(1.2)}
        />
        <Icon
          className="icon"
          icon="zoom-out"
          onClick={() => handleChangeScale(0.8)}
        />
      </div>
    );
  }

  return (
    <div className={cx(className, 'PdfViewer')}>
      {!file || loading ? (
        renderLoading()
      ) : (
        <>
          <div className={cx('PdfViewer-Content', {'is-loaded': loaded})}>
            <Document
              file={file}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={err => console.log(err)}
              loading={renderLoading()}
            >
              <Page
                className={cx('PdfViewer-Content-Page')}
                pageNumber={page}
                width={width}
                height={props.height}
                loading={renderLoading()}
                noData={<div>No PDF data</div>}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
          {loaded ? renderTool() : null}
        </>
      )}
    </div>
  );
};

export default themeable(PdfViewer);
