import {ShapePr} from '../openxml/word/drawing/ShapeProperties';
import {shapeToSVG} from '../openxml/word/drawing/svg/shapeToSVG';
import {WPSStyle} from '../openxml/word/wps/WPSStyle';
import {CustomGeom} from '../openxml/word/drawing/CustomGeom';

export function renderCustGeom(
  geom: CustomGeom,
  shapePr: ShapePr,
  width: number,
  height: number,
  wpsStyle?: WPSStyle
) {
  if (geom.shape) {
    return shapeToSVG(geom.shape, [], shapePr, width, height, wpsStyle);
  }

  return null;
}
