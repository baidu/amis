import {H} from '../../../util/H';
import {stripNumber} from '../../../util/stripNumber';
import {Workbook} from '../../Workbook';
import {ExcelRenderOptions} from '../../sheet/ExcelRenderOptions';

export class ZoomLevel {
  constructor(
    container: HTMLElement,
    workbook: Workbook,
    renderOptions: ExcelRenderOptions
  ) {
    this.renderZoomLevel(container, workbook);
  }

  renderZoomLevel(container: HTMLElement, workbook: Workbook) {
    const currentSheet = workbook.getActiveSheet();

    const zoom = currentSheet.getZoomLevel();
    const zoomLevel = H('div', {
      className: 'ov-excel-sheet-tab-bar__zoom-level',
      parent: container
    });
    const zoomOut = H('div', {
      className: 'ov-excel-sheet-tab-bar__zoom-out',
      parent: zoomLevel
    });
    zoomOut.textContent = '-';
    zoomOut.addEventListener('click', () => {
      currentSheet.setZoomLevel(Math.max(0.25, zoom - 0.25));
    });

    const zoomValue = H('div', {
      className: 'ov-excel-sheet-tab-bar__zoom-value',
      parent: zoomLevel
    });

    zoomValue.textContent = `${zoom * 100}%`;

    const zoomIn = H('div', {
      className: 'ov-excel-sheet-tab-bar__zoom-in',
      parent: zoomLevel
    });
    zoomIn.textContent = '+';
    zoomIn.addEventListener('click', () => {
      currentSheet.setZoomLevel(zoom + 0.25);
    });
  }
}
