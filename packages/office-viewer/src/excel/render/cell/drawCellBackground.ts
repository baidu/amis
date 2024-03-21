import {CellInfo} from '../../types/CellInfo';
import {IDataProvider} from '../../types/IDataProvider';
import {getBackgroundColor} from './getBackgroundColor';

export function drawCellBackground(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  dataProvider: IDataProvider,
  cellInfo: CellInfo,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const backgroundColor = getBackgroundColor(dataProvider, cellInfo.fill);
  if (backgroundColor !== 'none') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);
  }
}
