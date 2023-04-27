import {ShapePr} from '../openxml/drawing/ShapeProperties';
import {shapeToSVG} from '../openxml/drawing/svg/shapeToSVG';
import {WPSStyle} from '../openxml/word/wps/WPSStyle';
import {CustomGeom} from '../openxml/drawing/CustomGeom';

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
