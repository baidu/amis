/**
 * 本地测试例子
 */
import {HitTestResult} from '../src/excel/render/selection/hitTest';
import {App} from './common';
import fileLists from './excelFileList';

const viewerElement = document.getElementById('viewer') as HTMLElement;

const testDir = '/__tests__/xlsx';

const data = {};

const renderOptions = {
  height: 700,
  debug: true,
  editable: true,
  fontURL: {
    等线: '/examples/static/font/DengXian.ttf',
    仿宋: '/examples/static/font/STFANGSO.TTF',
    黑体: '/examples/static/font/simhei.ttf'
  },
  data,
  mousePositionTracker: (
    x: number,
    y: number,
    hitTestResult: HitTestResult | null
  ) => {
    document.getElementById('mousePosition')!.innerText = `x${x}, y${y}`;
    if (hitTestResult) {
      document.getElementById(
        'hitTestResult'
      )!.innerHTML = `${hitTestResult.type}<br/>row: ${hitTestResult.startRow}<br/>col: ${hitTestResult.startCol}<br/>endRow: ${hitTestResult.endRow}<br/>endCol: ${hitTestResult.endCol}<br/>r: ${hitTestResult.region}<br/>width: ${hitTestResult.width}<br/>height: ${hitTestResult.height}`;
    }
  },
  enableVar: true
};

new App(testDir, fileLists, viewerElement, renderOptions);
