import {IconNames, presetIcons} from '../../io/excel/preset/presetIcons';

import {Canvas} from '../Canvas';

export function drawIconSet(
  canvas: Canvas,
  icon: IconNames,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const iconURL = presetIcons[icon];
  if (!iconURL) {
    console.warn('未知的图标', icon);
    return;
  }

  // 避免挡住网格线
  canvas.drawImageWithCache(iconURL, x + 1, y + 1, height - 2, height - 2);
}
