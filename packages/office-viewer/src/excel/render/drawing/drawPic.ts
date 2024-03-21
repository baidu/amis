import {Sheet} from '../../sheet/Sheet';
import {IPicture} from '../../types/IDrawing';
import {Rect, rectIntersect} from '../Rect';
import {SheetCanvas} from '../SheetCanvas';
import {PicRender} from './PicRender';

const PicRenderMap: Record<string, PicRender> = {};

export function drawPic(
  currentSheet: Sheet,
  canvas: SheetCanvas,
  displayRect: Rect,
  drawingRect: Rect,
  rowHeaderWidth: number,
  colHeaderHeight: number,
  pic: IPicture
) {
  if (!pic) {
    console.warn('pic do not exist');
    return;
  }
  const imgURL = pic.imgURL;
  if (!imgURL) {
    console.warn('imgURL do not exist');
    return;
  }

  // 目前只用 drawing 的坐标，这个 xfrm 还不知道是什么
  // const xfrm = pic.spPr?.xfrm;
  // if (!xfrm) {
  //   console.warn('xfrm do not exist');
  //   return;
  // }

  // const ext = xfrm.ext;
  // const off = xfrm.off;

  // if (!ext || !off) {
  //   console.warn('ext or off do not exist');
  //   return;
  // }

  // const x = emuToPx(parseFloat(off.x! as string));
  // const y = emuToPx(parseFloat(off.y! as string));
  // const width = emuToPx(ext.cx!);
  // const height = emuToPx(ext.cy!);

  const workbook = currentSheet.getWorkbook();
  // Excel 渲染在数据容器内，可以被表头遮挡
  const dataContainer = workbook.getDataContainer();

  const renderRect = {
    x: drawingRect.x - rowHeaderWidth,
    y: drawingRect.y - colHeaderHeight,
    width: drawingRect.width,
    height: drawingRect.height
  };

  // 因为前面算的是相对位置，所以这里也得转成相对位置
  const relativeDisplayRect = {
    x: 0,
    y: 0,
    width: displayRect.width,
    height: displayRect.height
  };

  // 如果图片在显示区域内才绘制
  if (rectIntersect(renderRect, relativeDisplayRect)) {
    const gid = pic.gid;
    // 目前 sheet 切换的时候会清空
    const gidElement = dataContainer.querySelector(`[data-gid="${gid}"]`);
    if (PicRenderMap[gid] && gidElement) {
      PicRenderMap[gid].updatePosition(renderRect);
      PicRenderMap[gid].show();
    } else {
      const picRender = new PicRender(dataContainer, renderRect, gid, pic);
      PicRenderMap[gid] = picRender;
    }
  } else {
    if (PicRenderMap[pic.gid]) {
      PicRenderMap[pic.gid].hide();
    }
  }
}
