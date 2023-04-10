import {presetShape} from '../openxml/word/drawing/presetShape';
import {Geom} from '../openxml/word/drawing/Geom';
import {ShapePr} from '../openxml/word/drawing/ShapeProperties';
import {shapeToSVG} from '../openxml/word/drawing/svg/shapeToSVG';
import {WPSStyle} from 'src/openxml/word/wps/WPSStyle';

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
