import {presetShape} from '../openxml/drawing/presetShape';
import {Geom} from '../openxml/drawing/Geom';
import {ShapePr} from '../openxml/drawing/ShapeProperties';
import {shapeToSVG} from '../openxml/drawing/svg/shapeToSVG';
import {WPSStyle} from '../openxml/word/wps/WPSStyle';

export function renderGeom(
  geom: Geom,
  shapePr: ShapePr,
  width: number,
  height: number,
  wpsStyle?: WPSStyle
) {
  if (geom.prst) {
    const shape = presetShape[geom.prst];
    if (shape) {
      return shapeToSVG(
        shape,
        geom.avLst || [],
        shapePr,
        width,
        height,
        wpsStyle
      );
    }
  }

  return null;
}
